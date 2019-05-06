
/**
 * @depends CanvasElement.js
 */

/////////////////////////////////////////////////////////
/////////////////TextFieldElement////////////////////////

/**
 * @class TextFieldElement
 * @inherits CanvasElement
 * 
 * Internal class used for consistently rendering text used by controls like TextElement, TextInput, and TextArea.
 * You typically should not use this class directly it is designed to be wrapped by a higher level control. 
 * This class allows text to be selected and edited, it renders a text position caret, watches
 * focus/mouse/keyboard events, maintains position of individual characters, and allows copy/cut/paste.
 * 
 * TextField also normalizes text width. The canvas natively will give
 * different widths for strings than when measuring and adding character widths 
 * which will not work for highlighting or editing. 
 * 
 * 
 * @constructor TextFieldElement 
 * Creates new TextFieldElement instance.
 */
function TextFieldElement()
{
	TextFieldElement.base.prototype.constructor.call(this);
	
	//Element used as the blinky text caret when focused.
	this._textCaret = null;
	
	this._textHighlightStartIndex = 0;
	this._caretIndex = 0;
	this._caretEnabled = false;
	this._caretBlinkTime = 0;
	this._caretBlinkVisible = false;
	this._dragScrollTime = 0;
	this._layoutShouldScroll = false;
	
	this._text = "";
	
	this._shiftPressed = false;
	this._charMetrics = null; 	// array of {x, w}
	this._spaceSpans = null; 	// array of {start, end, type} _charMetric positions of spaces for wrapping text.
	
	//Container clipping
	this._textClipContainer = new CanvasElement();
	this._textClipContainer.setStyle("ClipContent", true);
	this._textClipContainer.setStyle("MouseEnabled", false);
	
		//Container for lines of text, we slide this container around to scroll the block of text when needed.
		this._textLinesContainer = new CanvasElement();
		this._textLinesContainer._addChild(new TextFieldLineElement()); //Always need at least one line
		
	this._textClipContainer._addChild(this._textLinesContainer);	
	this._addChild(this._textClipContainer);
	
	var _self = this;
	
	//Private event handlers, need different instance for each TextField. Proxy to prototype.
	this._onTextFieldFocusEventInstance = 
		function (event)
		{
			if (event.getType() == "focusin")
				_self._onTextFieldFocusIn(event);
			else
				_self._onTextFieldFocusOut(event);
		};
	
	this._onTextFieldKeyInstance = 
		function (keyboardEvent)
		{
			if (keyboardEvent.getType() == "keydown")
				_self._onTextFieldKeyDown(keyboardEvent);
			else if (keyboardEvent.getType() == "keyup")
				_self._onTextFieldKeyUp(keyboardEvent);
		};
		
	this._onTextFieldMouseEventInstance =
		function (mouseEvent)
		{
			if (mouseEvent.getType() == "mousedown")
				_self._onTextFieldMouseDown(mouseEvent);
			else if (mouseEvent.getType() == "mouseup")
				_self._onTextFieldMouseUp(mouseEvent);
		};
	
	this._onTextFieldEnterFrameInstance =
		function (event)
		{
			_self._onTextFieldEnterFrame(event);
		};
	
	this._onTextFieldCopyPasteInstance = 
		function (event)
		{
			window.removeEventListener(event.type, _self._onTextFieldCopyPasteInstance);
		
			try
			{
				if (event.clipboardData)
				{
					if (event.type == "copy")
						_self._onTextFieldCopy(event.clipboardData);
					else if (event.type == "paste")
						_self._onTextFieldPaste(event.clipboardData);
					else
						_self._onTextFieldCut(event.clipboardData);
				}
				
				if (event.preventDefault)
					event.preventDefault();
				
				return false;
			}
			catch (ex)
			{
				//Swallow
			}
		};
}

//Inherit from CanvasElement
TextFieldElement.prototype = Object.create(CanvasElement.prototype);
TextFieldElement.prototype.constructor = TextFieldElement;
TextFieldElement.base = CanvasElement;	


/////////////Events///////////////////////////////////

/**
 * @event changed ElementEvent
 * Dispatched when the text is changed due to user interaction.
 */


/////////////Style Types///////////////////////////////

TextFieldElement._StyleTypes = Object.create(null);

/**
 * @style Selectable boolean
 * 
 * When true, the text can be highlighted and copied.
 */
TextFieldElement._StyleTypes.Selectable = 				StyleableBase.EStyleType.NORMAL;		// true || false

/**
 * @style MaxChars int
 * 
 * The maximum number of characters allowed for this TextField. When 0 unlimited characters are allowed.
 */
TextFieldElement._StyleTypes.MaxChars = 				StyleableBase.EStyleType.NORMAL;		// number

/**
 * @style Multiline boolean
 * 
 * When true, newline characters are respected and text will be rendered on multiple lines if necessary.
 */
TextFieldElement._StyleTypes.Multiline = 				StyleableBase.EStyleType.NORMAL;		// true || false

/**
 * @style WordWrap boolean
 * 
 * When true, text will wrap when width is constrained and will be rendered on multiple lines if necessary. 
 */
TextFieldElement._StyleTypes.WordWrap = 				StyleableBase.EStyleType.NORMAL;		// true || false

/**
 * @style MaskCharacter String
 * 
 * When not null, all characters are replaced with the MaskCharacter. 
 */
TextFieldElement._StyleTypes.MaskCharacter = 			StyleableBase.EStyleType.NORMAL;		// true || false


////////////Default Styles////////////////////////////

TextFieldElement.StyleDefault = new StyleDefinition();

TextFieldElement.StyleDefault.setStyle("Selectable", 					false);
TextFieldElement.StyleDefault.setStyle("MaxChars", 						0);
TextFieldElement.StyleDefault.setStyle("Multiline", 					false);
TextFieldElement.StyleDefault.setStyle("WordWrap", 						false);
TextFieldElement.StyleDefault.setStyle("MaskCharacter", 				null);

TextFieldElement.StyleDefault.setStyle("Enabled", 						false);
TextFieldElement.StyleDefault.setStyle("TabStop",						0);
TextFieldElement.StyleDefault.setStyle("Cursor", 						"text");			

TextFieldElement.StyleDefault.setStyle("BorderType", 					"none");
TextFieldElement.StyleDefault.setStyle("PaddingTop", 					1);
TextFieldElement.StyleDefault.setStyle("PaddingBottom",					1);
TextFieldElement.StyleDefault.setStyle("PaddingLeft", 					3);
TextFieldElement.StyleDefault.setStyle("PaddingRight", 					2);
TextFieldElement.StyleDefault.setStyle("BackgroundFill",				null);


////////Public///////////////////////

/**
 * @function setText
 * Sets the text string to be rendered.
 * 
 * @param text String
 * Text string to be rendered
 */
TextFieldElement.prototype.setText = 
	function (text)
	{
		if (text == null)
			text = "";
	
		//Make sure we have an actual string
		if (typeof text !== "string")
		{
			try
			{
				text = text.toString();
			}
			catch (ex)
			{
				text = "";
			}
		}
		
		var maxChars = this.getStyle("MaxChars");
		
		if (maxChars > 0 && text.length > maxChars)
			text = text.substring(0, maxChars);
		
		if (text != this._text)
		{
			this._text = text;
			
			this._charMetrics = null;
			
			this.setSelection(0, 0);
			
			//Reset scroll position
			this._textLinesContainer._setActualPosition(0, 0);
			
			this._invalidateMeasure();
			this._invalidateLayout();
		}
	};

/**
 * @function getText
 * Gets the current text string.
 * 
 * @returns String
 * Current text string.
 */	
TextFieldElement.prototype.getText = 
	function ()
	{
		return this._text;
	};

/**
 * @function setSelection
 * Sets the text selection or text caret position. When startIndex and endIndex are the same
 * it places the text caret at that position, when different, it selects / highlights that range of characters.
 * 
 * @param startIndex int
 * Character index to begin the selection.
 * 
 * @param endIndex int
 * Character index to end the selection.
 */	
TextFieldElement.prototype.setSelection = 
	function (startIndex, endIndex)
	{
		if (startIndex < 0)
			startIndex = 0;
		if (startIndex > this._text.length)
			startIndex = this._text.length;
		
		if (endIndex < 0)
			endIndex = 0;
		if (endIndex > this._text.length)
			endIndex = this._text.length;
		
		if (startIndex == this._textHighlightStartIndex && endIndex == this._caretIndex)
			return;
		
		this._textHighlightStartIndex = startIndex;
		this._caretIndex = endIndex;
		
		if (this._caretEnabled == true && startIndex == endIndex)
		{
			this._caretBlinkVisible = true;
			this._caretBlinkTime = Date.now() + 800;
		}
		
		this._updateCaretVisibility();
		this._invalidateLayout();
	};
	
/**
 * @function getSelection
 * Gets the current text selection or text caret position.
 * 
 * @returns Object
 * Object containing the start and end selection indexes. {startIndex, endIndex}
 */	
TextFieldElement.prototype.getSelection = 
	function ()
	{
		return {startIndex:this._textHighlightStartIndex, endIndex:this._caretIndex};
	};	
	
////////Internal/////////////////////	

/**
 * @function _createTextCaret
 * Generates a CanvasElement to be used as the text caret.
 * 
 * @returns CanvasElement
 * New CanvasElement instance to be used as the text caret.
 */
TextFieldElement.prototype._createTextCaret = 
	function ()
	{
		var textCaret = new CanvasElement();
		textCaret.setStyle("MouseEnabled", false);
		textCaret.setStyle("BackgroundFill", this.getStyle("TextCaretColor"));
		
		return textCaret;
	};
	
//@private
TextFieldElement.prototype._updateCaretVisibility = 
	function ()
	{
		if (this._caretEnabled == true &&
			this._caretBlinkVisible == true && 
			this._caretIndex > -1 && this._caretIndex <= this._text.length) //Dont think this line is necessary
		{
			if (this._textCaret == null)
			{
				this._textCaret = this._createTextCaret();
				this._addChild(this._textCaret);
			}
			
			this._textCaret.setStyle("Visible", true);
		}
		else if (this._textCaret != null)
			this._textCaret.setStyle("Visible", false);
	};
	
//@private - only active when caret is enabled or dragging highlight selection is scrolling.
TextFieldElement.prototype._onTextFieldEnterFrame = 
	function (event)
	{
		var i;
		var currentTime = Date.now();
		
		if (currentTime > this._caretBlinkTime && 
			this._caretEnabled == true &&
			this._caretIndex > -1 && this._caretIndex <= this._text.length) //Dont think this line is necessary
		{	
			if (this._caretBlinkVisible == true)
			{//Shutting off caret
				
				if (this._caretBlinkTime + 400 < currentTime)
					this._caretBlinkTime = currentTime + 400;
				else
					this._caretBlinkTime += 400; 
			}
			else
			{//Turning on caret
				
				if (this._caretBlinkTime + 800 < currentTime)
					this._caretBlinkTime = currentTime + 800;
				else
					this._caretBlinkTime += 800; 
			}
			
			this._caretBlinkVisible = !(this._caretBlinkVisible);
			this._updateCaretVisibility();
		}
		
		//Handle drag highlight / scroll
		if (this._mouseIsDown == true)
		{
			//Get mouse position
			var mousePos = {x:this._manager._mouseX, y:this._manager._mouseY};
			this.translatePointFrom(mousePos, this._manager);
			
			//Get caret index from mouse
			var caretIndex = this._getCaretIndexFromMouse(mousePos.x, mousePos.y);
			
			//Find the line
			var textFieldLine = this._textLinesContainer._getChildAt(0);
			if (caretIndex > textFieldLine._charMetricsEndIndex)
			{
				for (i = 1; i < this._textLinesContainer._getNumChildren(); i++)
				{
					textFieldLine = this._textLinesContainer._getChildAt(i);
					if (caretIndex >= textFieldLine._charMetricsStartIndex && caretIndex <= textFieldLine._charMetricsEndIndex)
						break;
				}
			}
			
			//Get caret position
			var caretX = this._textLinesContainer._x + textFieldLine._x + (this._charMetrics[caretIndex].x - this._charMetrics[textFieldLine._charMetricsStartIndex].x);
			var caretW = 1;
			var caretY = this._textLinesContainer._y + textFieldLine._y;
			var caretH = textFieldLine._height;
			
			var caretXWithinBounds = false;
			var caretYWithinBounds = false;
			
			if (caretX >= 0 && caretX + caretW <= this._textClipContainer._width)
				caretXWithinBounds = true;
			
			if (caretY + caretH > 0 && caretY < this._textClipContainer._height)
				caretYWithinBounds = true;
			
			//Set selection and scroll immediately
			if ((caretXWithinBounds == true && caretYWithinBounds == true) || 
				(caretYWithinBounds == true && (caretIndex == textFieldLine._charMetricsStartIndex || caretIndex == textFieldLine._charMetricsEndIndex)))
			{
				this.setSelection(this._textHighlightStartIndex, caretIndex);
				
				this._layoutShouldScroll = true;
				this._invalidateLayout();
			}
			else if (currentTime > this._dragScrollTime) //Wait for time expiration
			{
				this._dragScrollTime = currentTime + 220;
				
				this.setSelection(this._textHighlightStartIndex, caretIndex);
				
				this._layoutShouldScroll = true;
				this._invalidateLayout();
			}
		}
	};
	
//@private	
TextFieldElement.prototype._enableCaret = 
	function ()
	{
		if (this._caretEnabled == true)
			return;
	
		this._caretEnabled = true;
		
		this._updateEnterFrameListener();
		this._updateCaretVisibility();
	};
	
//@private	
TextFieldElement.prototype._disableCaret = 
	function ()
	{
		if (this._caretEnabled == false)
			return;
	
		this._caretEnabled = false;
		
		this._updateEnterFrameListener();
		this._updateCaretVisibility();
	};

//@private - Only active if TextField is Enabled or Selectable.
TextFieldElement.prototype._onTextFieldFocusIn = 
	function (elementEvent)
	{
		//Tab focus (mouse would have already set caret)
		if (this._caretEnabled == true || this.getStyle("Enabled") == false)
			return;
	
		this._enableCaret();
		this.setSelection(0, this._text.length);
	};
	
//@private - Only active if TextField is Enabled or Selectable.	
TextFieldElement.prototype._onTextFieldFocusOut = 
	function (event)
	{
		this._disableCaret();
		this.setSelection(0, 0);
	};

/**
 * @function _getLineIndexFromCharIndex
 * Gets the line index from the supplied character index.
 * 
 * @param charIndex int
 * Character index to get the line index from.
 * 
 * @returns int
 * Corresponding line index.
 */	
TextFieldElement.prototype._getLineIndexFromCharIndex = 
	function (charIndex)
	{
		var textFieldLineIndex = 0;	
		var textFieldLine = this._textLinesContainer._getChildAt(0);
		for (var i = 1; i < this._textLinesContainer._getNumChildren(); i++)
		{
			if (textFieldLine._charMetricsEndIndex >= charIndex)
				break;
			
			textFieldLine = this._textLinesContainer._getChildAt(i);
			textFieldLineIndex = i;
		}
		
		return textFieldLineIndex;
	};
	
/**
 * @function _getCaretIndexFromMouse
 * Gets the position to place the text caret based on the position of the mouse.
 * 
 * @param mouseX Number
 * Current X position of the mouse.
 * 
 * @param mouseY Number
 * Current Y position of the mouse.
 * 
 * @returns int
 * Corresponding caret character index.
 */	
TextFieldElement.prototype._getCaretIndexFromMouse = 
	function (mouseX, mouseY)
	{
		if (this._charMetrics == null || this._charMetrics.length == 0 || this._textLinesContainer._getNumChildren() == 0)
			return 0;
	
		var i;
		
		var x = this._textClipContainer._x + this._textLinesContainer._x;
		var y = this._textClipContainer._y + this._textLinesContainer._y;
		mouseX += 2; //Text cursor is slightly offset.
		
		//Find the line 
		//TODO: Account for gap due to line spacing
		var textFieldLine = this._textLinesContainer._getChildAt(0);
		for (i = 1; i < this._textLinesContainer._getNumChildren(); i++)
		{
			if (mouseY < y + textFieldLine._y + textFieldLine._height)
				break;
			
			textFieldLine = this._textLinesContainer._getChildAt(i);
		}
		
		var charX = 0;
		var charW = 0;
		
		//Find the position
		var newCaretIndex = 0;
		for (i = textFieldLine._charMetricsStartIndex; i <= textFieldLine._charMetricsEndIndex; i++)
		{
			charX = (this._charMetrics[i].x - this._charMetrics[textFieldLine._charMetricsStartIndex].x) + x + textFieldLine._x;
			charW = this._charMetrics[i].width;
			
			newCaretIndex = i;
			
			if (mouseX <= charX + (charW / 2))
				break;
		}
		
		return newCaretIndex;
	};

/**
 * @function _getVerticalScrollParameters
 * Returns parameters representing the vertical scroll page, view, and line sizes.
 * 
 * @returns Object
 * An object containing both width and height: {page:100, view:100, line:14}
 */	
TextFieldElement.prototype._getVerticalScrollParameters = 
	function ()
	{
		var params = {page:0, view:0, line:14, value:0};
		
		params.page = this._textLinesContainer._height;
		params.view = this._textClipContainer._height;
	
		var textSize = this.getStyle("TextSize");
		var lineSpacing = this.getStyle("TextLineSpacing");
		var linePaddingTop = this.getStyle("TextLinePaddingTop");
		var linePaddingBottom = this.getStyle("TextLinePaddingBottom");
		
		params.line = textSize + linePaddingTop + linePaddingBottom + lineSpacing;
		
		params.value = this._textLinesContainer._y * -1;
		
		return params;
	};
	
/**
 * @function _setVerticalScrollValue
 * Sets the vertical scroll position.
 * 
 * @param value int
 * Y position to scroll too
 */		
TextFieldElement.prototype._setVerticalScrollValue = 
	function (value)
	{
		value = Math.round(value);
		
		this._textLinesContainer._setActualPosition(this._textLinesContainer._x, value * -1);
	};	
	
/**
 * @function _getHorizontalScrollParameters
 * Returns parameters representing the vertical scroll page, view, line, and value sizes.
 * 
 * @returns Object
 * An object containing both width and height: {page:100, view:100, line:14, value:0}
 */	
TextFieldElement.prototype._getHorizontalScrollParameters = 
	function ()
	{
		var params = {page:0, view:0, line:14, value:0};
		
		params.page = this._textLinesContainer._width;
		params.view = this._textClipContainer._width;
	
		var textSize = this.getStyle("TextSize");
		var lineSpacing = this.getStyle("TextLineSpacing");
		var linePaddingTop = this.getStyle("TextLinePaddingTop");
		var linePaddingBottom = this.getStyle("TextLinePaddingBottom");
		
		params.line = textSize + linePaddingTop + linePaddingBottom + lineSpacing;
		
		params.value = this._textLinesContainer._x * -1;
		
		return params;
	};	
	
/**
 * @function _setHorizontalScrollValue
 * Sets the horizontal scroll position.
 * 
 * @param value int
 * X position to scroll too
 */		
TextFieldElement.prototype._setHorizontalScrollValue = 
	function (value)
	{
		value = Math.round(value);
		
		this._textLinesContainer._setActualPosition(value * -1, this._textLinesContainer._y);
	};
	
//@private - Only active if TextField is Enabled or Selectable.		
TextFieldElement.prototype._onTextFieldMouseDown = 
	function (mouseEvent)
	{
		var caretIndex = this._getCaretIndexFromMouse(mouseEvent.getX(), mouseEvent.getY());
		
		if (this.getStyle("Enabled") == true)
			this._enableCaret();
		
		if (this._shiftPressed == true)
			this.setSelection(this._textHighlightStartIndex, caretIndex);
		else
			this.setSelection(caretIndex, caretIndex);
		
		this._layoutShouldScroll = true;
		this._invalidateLayout();
		
		this._dragScrollTime = 0;
		
		this._updateEnterFrameListener();
	};
	
//@private - Only active if TextField is Enabled or Selectable.		
TextFieldElement.prototype._onTextFieldMouseUp = 
	function (mouseEvent)
	{
		this._updateEnterFrameListener();
	};	
	
//@private	
TextFieldElement.prototype._updateCharMetricsAndSpaceSpans = 
	function ()
	{
		if (this._charMetrics == null || this._charMetrics.length == 0)
			return;
		
		if (this._spaceSpans == null)
			this._spaceSpans = [];
		
		var currentPos = 0;
		var currentSpaceSpan = null;	
		var spaceSpanIndex = 0;
		
		for (var i = 0; i < this._charMetrics.length; i++)
		{
			//Update metrics position
			this._charMetrics[i].x = currentPos;
			currentPos += this._charMetrics[i].width;
			
			//Update space spans (re-use existing array items to save memory/GC)
			if (this._text.length > i)
			{
				if (this._text[i] == " ")
				{
					if (currentSpaceSpan == null)
					{
						currentSpaceSpan = this._spaceSpans[spaceSpanIndex];
						if (currentSpaceSpan == null)
						{
							this._spaceSpans[spaceSpanIndex] = {start:i, end:i, type:"space"};
							currentSpaceSpan = this._spaceSpans[spaceSpanIndex];
						}
						else
						{
							currentSpaceSpan.start = i;
							currentSpaceSpan.end = i;
							currentSpaceSpan.type = "space";
						}
						
						spaceSpanIndex++;
					}
					else
						currentSpaceSpan.end = i;
				}
				else 
				{
					if (this._text[i] == '\n')
					{
						currentSpaceSpan = this._spaceSpans[spaceSpanIndex];
						if (currentSpaceSpan == null)
							this._spaceSpans[spaceSpanIndex] = {start:i, end:i, type:"nline"};
						else
						{
							currentSpaceSpan.start = i;
							currentSpaceSpan.end = i;
							currentSpaceSpan.type = "nline";
						}	
						
						spaceSpanIndex++;
					}
					
					currentSpaceSpan = null;
				}
			}
		}
		
		//Purge excess
		if (this._spaceSpans.length > spaceSpanIndex)
			this._spaceSpans.splice(spaceSpanIndex, this._spaceSpans.length - spaceSpanIndex);
	};

//@private	
TextFieldElement.prototype._deleteHighlightChars = 
	function ()
	{
		if (this._textHighlightStartIndex == this._caretIndex)
			return;
	
		var highlightBegin = Math.min(this._caretIndex, this._textHighlightStartIndex);
		var highlightEnd = Math.max(this._caretIndex, this._textHighlightStartIndex);
	
		//Update string
		var strLeft = this._text.substring(0, highlightBegin);
		var strRight = this._text.substring(highlightEnd);
		this._text = strLeft + strRight;
		
		//Fix char metrics
		this._charMetrics.splice(highlightBegin, highlightEnd - highlightBegin);
		
		//Move caret
		this.setSelection(highlightBegin, highlightBegin);
	};	
	
/**
 * @function _onTextFieldKeyUp
 * Event handler for "keyup" event. Only active when TextField is enabled and focused.
 * Handles editing and cursor navigation / selection.
 * 
 * @param keyboardEvent ElementKeyboardEvent
 * ElementKeyboardEvent to process.
 */		
TextFieldElement.prototype._onTextFieldKeyUp = 
	function (keyboardEvent)
	{
		if (keyboardEvent.getDefaultPrevented() == true)
			return;
		
		if (keyboardEvent.getKey() == "Shift")
		{
			this._shiftPressed = false;
		}
	};
	
/**
 * @function _onTextFieldKeyDown
 * Event handler for "keydown" event. Only active when TextField is enabled and focused.
 * Handles editing and cursor navigation / selection.
 * 
 * @param keyboardEvent ElementKeyboardEvent
 * ElementKeyboardEvent to process.
 */	
TextFieldElement.prototype._onTextFieldKeyDown = 
	function (keyboardEvent)
	{
		if (keyboardEvent.getDefaultPrevented() == true)
			return;
	
		var enabled = this.getStyle("Enabled");
		var multiline = this.getStyle("Multiline");
		var maxChars = this.getStyle("MaxChars");
		
		var keyString = keyboardEvent.getKey();
		var dispatchChanged = false;
		var i;
		var textFieldLineIndex;
		var textFieldLine;
		
		if (keyString == "c" && keyboardEvent.getCtrl() == true)
		{
			if (this._textHighlightStartIndex == this._caretIndex)
			{
				keyboardEvent.preventDefault();
				return;
			}
			
			//IE
			if (window.clipboardData)
			{
				this._onTextFieldCopy(window.clipboardData);
				keyboardEvent.preventDefault();
			} 
			else //FF, Chrome, Webkit (Allow keyboard event to invoke the copy / paste listener)
			{
				window.addEventListener("copy", this._onTextFieldCopyPasteInstance);
				this._invalidateLayout(); //Purges the listener if something upstream cancels the keyboard event.
			}
			
			return;
		}
		else if (keyString == "Shift")
		{
			this._shiftPressed = true;
		}
		else if (keyString == "ArrowLeft")
		{
			if (keyboardEvent.getShift() == true && 
				(this._textHighlightStartIndex != this._caretIndex || enabled == true))
			{
				this.setSelection(this._textHighlightStartIndex, this._caretIndex - 1);
			}
			else if (enabled == true)
			{
				if (this._textHighlightStartIndex != this._caretIndex)
					this.setSelection(Math.min(this._caretIndex, this._textHighlightStartIndex), Math.min(this._caretIndex, this._textHighlightStartIndex));
				else
					this.setSelection(this._caretIndex - 1, this._caretIndex - 1);
			}
		}
		else if (keyString == "ArrowRight")
		{
			if (keyboardEvent.getShift() == true && 
				(this._textHighlightStartIndex != this._caretIndex || enabled == true))
			{
				this.setSelection(this._textHighlightStartIndex, this._caretIndex + 1);
			}
			else if (enabled == true)
			{
				if (this._textHighlightStartIndex != this._caretIndex)
					this.setSelection(Math.max(this._caretIndex, this._textHighlightStartIndex), Math.max(this._caretIndex, this._textHighlightStartIndex));
				else
					this.setSelection(this._caretIndex + 1, this._caretIndex + 1);
			}
		}
		else if (keyString == "ArrowDown" || keyString == "ArrowUp")
		{
			//Find the current line
			textFieldLineIndex = this._getLineIndexFromCharIndex(this._caretIndex);
			textFieldLine = this._textLinesContainer._getChildAt(textFieldLineIndex);
			
			//Get the new caret index
			var newIndex = -1;
			
			if (keyString == "ArrowUp" && textFieldLineIndex == 0)
				newIndex = 0;
			else if (keyString == "ArrowDown" && textFieldLineIndex == this._textLinesContainer._getNumChildren() - 1)
				newIndex = this._charMetrics.length -1;
			else
			{
				var charX = this._textLinesContainer._x + textFieldLine._x + (this._charMetrics[this._caretIndex].x - this._charMetrics[textFieldLine._charMetricsStartIndex].x);
				
				var moveToTextFieldLine = null;
				
				if (keyString == "ArrowUp")
					moveToTextFieldLine = this._textLinesContainer._getChildAt(textFieldLineIndex - 1);
				else
					moveToTextFieldLine = this._textLinesContainer._getChildAt(textFieldLineIndex + 1);
				
				var moveToCharX;
				var moveToCharW;
				
				for (i = moveToTextFieldLine._charMetricsStartIndex; i <= moveToTextFieldLine._charMetricsEndIndex; i++)
				{
					moveToCharX = this._textLinesContainer._x + moveToTextFieldLine._x + (this._charMetrics[i].x - this._charMetrics[moveToTextFieldLine._charMetricsStartIndex].x);
					moveToCharW = this._charMetrics[i].width;
					
					newIndex = i;
					
					if (charX <= moveToCharX + (moveToCharW / 2))
						break;
				}
			}	
				
			if (keyboardEvent.getShift() == true && (this._textHighlightStartIndex != this._caretIndex || enabled == true))
			{
				this.setSelection(this._textHighlightStartIndex, newIndex);
			}
			else if (enabled == true)
			{
				this.setSelection(newIndex, newIndex);
			}
		}
		else if (keyString == "End")
		{
			if (keyboardEvent.getCtrl() == true)
			{
				if (keyboardEvent.getShift() == true && 
					(this._textHighlightStartIndex != this._caretIndex || enabled == true))
				{
					this.setSelection(this._textHighlightStartIndex, this._text.length);
				}
				else if (enabled == true)
					this.setSelection(this._text.length, this._text.length);
			}
			else
			{
				//Find the current line
				textFieldLineIndex = this._getLineIndexFromCharIndex(this._caretIndex);
				textFieldLine = this._textLinesContainer._getChildAt(textFieldLineIndex);
				
				if (keyboardEvent.getShift() == true && 
					(this._textHighlightStartIndex != this._caretIndex || enabled == true))
				{
					this.setSelection(this._textHighlightStartIndex, textFieldLine._charMetricsEndIndex);
				}
				else if (enabled == true)
					this.setSelection(textFieldLine._charMetricsEndIndex, textFieldLine._charMetricsEndIndex);
			}
		}
		else if (keyString == "Home")
		{
			if (keyboardEvent.getCtrl() == true)
			{
				if (keyboardEvent.getShift() == true && 
					(this._textHighlightStartIndex != this._caretIndex || enabled == true))
				{
					this.setSelection(this._textHighlightStartIndex, 0);
				}
				else if (enabled == true)
					this.setSelection(0, 0);
			}
			else
			{
				//Find the current line
				textFieldLineIndex = this._getLineIndexFromCharIndex(this._caretIndex);
				textFieldLine = this._textLinesContainer._getChildAt(textFieldLineIndex);
				
				if (keyboardEvent.getShift() == true && 
					(this._textHighlightStartIndex != this._caretIndex || enabled == true))
				{
					this.setSelection(this._textHighlightStartIndex, textFieldLine._charMetricsStartIndex);
				}
				else if (enabled == true)
					this.setSelection(textFieldLine._charMetricsStartIndex, textFieldLine._charMetricsStartIndex);
			}
		}
		else if (enabled == false) 
		{
			return;
		}
		else if (keyString == "Backspace")
		{
			if (this._textHighlightStartIndex != this._caretIndex)
				this._deleteHighlightChars();
			else
			{
				if (this._text.length == 0 || this._caretIndex == 0)
				{
					keyboardEvent.preventDefault();
					return;
				}
				
				//Update string
				var strLeft = this._text.substring(0, this._caretIndex - 1);
				var strRight = this._text.substring(this._caretIndex);
				this._text = strLeft + strRight;
				
				//Fix char metrics
				this._charMetrics.splice(this._caretIndex - 1, 1);
				
				//Move caret
				this.setSelection(this._caretIndex - 1, this._caretIndex - 1);
			}
			
			dispatchChanged = true;
		}
		else if (keyString == "Delete")
		{
			if (this._textHighlightStartIndex != this._caretIndex)
				this._deleteHighlightChars();
			else
			{
				if (this._text.length == 0 || this._caretIndex == this._text.length)
				{
					keyboardEvent.preventDefault();
					return;
				}
	
				//Update string
				var strLeft = this._text.substring(0, this._caretIndex);
				var strRight = this._text.substring(this._caretIndex + 1);
				this._text = strLeft + strRight;
				
				//Fix char metrics
				this._charMetrics.splice(this._caretIndex, 1);
			}
			
			dispatchChanged = true;
		}
		else if (keyString == "v" && keyboardEvent.getCtrl() == true)
		{
			//IE
			if (window.clipboardData)
			{
				this._onTextFieldPaste(window.clipboardData);
				keyboardEvent.preventDefault();
			} 
			else //FF, Chrome, Webkit (Allow keyboard event to invoke the copy / paste listener)
			{
				window.addEventListener("paste", this._onTextFieldCopyPasteInstance);
				this._invalidateLayout(); //Purges the listener if something upstream cancels the keyboard event.
			}
			
			return;
		}
		else if (keyString == "x" && keyboardEvent.getCtrl() == true)
		{
			if (this._textHighlightStartIndex == this._caretIndex)
			{
				keyboardEvent.preventDefault();
				return;
			}
			
			//IE
			if (window.clipboardData)
			{
				this._onTextFieldCut(window.clipboardData);
				keyboardEvent.preventDefault();
			} 
			else //FF, Chrome, Webkit (Allow keyboard event to invoke the copy / paste listener)
			{
				window.addEventListener("cut", this._onTextFieldCopyPasteInstance);
				this._invalidateLayout(); //Purges the listener if something upstream cancels the keyboard event.
			}
			
			return;
		}
		else if (keyString == "Enter" && multiline == true)
		{
			this._deleteHighlightChars();
			
			if (maxChars > 0 && maxChars <= this._text.length)
			{
				keyboardEvent.preventDefault();
				return;
			}
			
			//Update string
			var strLeft = this._text.substring(0, this._caretIndex);
			var strRight = this._text.substring(this._caretIndex);
			this._text = strLeft + "\n" + strRight;
			
			//Fix char metrics
			this._charMetrics.splice(this._caretIndex, 0, {x:0, width:CanvasElement._measureText("\n", this._getFontString())});
			
			//Move caret
			this.setSelection(this._caretIndex + 1, this._caretIndex + 1);
			
			dispatchChanged = true;
		}
		else if (keyString.length == 1)
		{
			this._deleteHighlightChars();
			
			if (maxChars > 0 && maxChars <= this._text.length)
			{
				keyboardEvent.preventDefault();
				return;
			}
			
			//Measure new char
			var maskCharacter = this.getStyle("MaskCharacter");
			
			var printCharacter = keyString;
			if (maskCharacter != null)
				printCharacter = maskCharacter;
			
			var newCharMetrics = {x:0, width:CanvasElement._measureText(printCharacter, this._getFontString())};
			
			//Update string
			var strLeft = this._text.substring(0, this._caretIndex);
			var strRight = this._text.substring(this._caretIndex);
			this._text = strLeft + keyString + strRight;
			
			//Fix char metrics
			this._charMetrics.splice(this._caretIndex, 0, newCharMetrics);
			
			//Move caret
			this.setSelection(this._caretIndex + 1, this._caretIndex + 1);
			
			dispatchChanged = true;
		}
		else
			return;
		
		if (dispatchChanged == true)
		{
			this._updateCharMetricsAndSpaceSpans();
			this.dispatchEvent(new ElementEvent("changed", false));
		}
		
		this._layoutShouldScroll = true;
		this._invalidateLayout();
		
		keyboardEvent.preventDefault();
	};

/**
 * @function _onTextFieldCopy
 * Event handler for native browser "copy" event. Copies selected text to clipboard.
 * 
 * @param clipboardData BrowserClipboard
 * The browser clipboard object to copy text too.
 */	
TextFieldElement.prototype._onTextFieldCopy = 
	function (clipboardData)
	{
		var highlightBegin = Math.min(this._caretIndex, this._textHighlightStartIndex);
		var highlightEnd = Math.max(this._caretIndex, this._textHighlightStartIndex);
		
		var copyText = this._text.substring(highlightBegin, highlightEnd);
		
		clipboardData.setData("Text", copyText);
	};
	
/**
 * @function _onTextFieldCopy
 * Event handler for native browser "paste" event. Pastes clipboard text into TextField.
 * 
 * @param clipboardData BrowserClipboard
 * The browser clipboard object to copy text from.
 */		
TextFieldElement.prototype._onTextFieldPaste = 
	function (clipboardData)
	{
		var pasteString = clipboardData.getData("Text");
		
		if (pasteString == null || pasteString.length == 0)
			return;
		
		var maxChars = this.getStyle("MaxChars");
		if (maxChars > 0 && this._text.length >= maxChars && this._caretIndex >= maxChars)
			return;
		
		this._deleteHighlightChars();
		
		var maskCharacter = this.getStyle("MaskCharacter");
		
		//Update string
		var strLeft = this._text.substring(0, this._caretIndex);
		var strRight = this._text.substring(this._caretIndex);
		this._text = strLeft + pasteString + strRight;
		
		//Measure new chars
		var fontString = this._getFontString();
		for (var i = 0; i < pasteString.length; i++)
		{
			var printCharacter = pasteString[i];
			if (maskCharacter != null)
				printCharacter = maskCharacter;
			
			this._charMetrics.splice(this._caretIndex + i, 0, 
					{x:0, width:CanvasElement._measureText(printCharacter, fontString)});
		}

		//Fix char metrics
		this._updateCharMetricsAndSpaceSpans();
		
		//Move caret
		this.setSelection(this._caretIndex + pasteString.length, this._caretIndex + pasteString.length);
		
		//Truncate if exceeding max characters
		if (maxChars > 0 && this._text.length > maxChars)
		{
			this._text = this._text.subString(0, maxChars);
			this._charMetrics.splice(0, this._text.length - maxChars);
			this.setSelection(this._text.length, this._text.length);
		}
		
		this._layoutShouldScroll = true;
		this._invalidateLayout();
		
		this.dispatchEvent(new ElementEvent("changed", false));
	};

/**
 * @function _onTextFieldCut
 * Event handler for native browser "cut" event. Copies selected text to clipboard and deletes from TextField.
 * 
 * @param clipboardData BrowserClipboard
 * The browser clipboard object to copy text too.
 */		
TextFieldElement.prototype._onTextFieldCut = 
	function (clipboardData)
	{
		var highlightBegin = Math.min(this._caretIndex, this._textHighlightStartIndex);
		var highlightEnd = Math.max(this._caretIndex, this._textHighlightStartIndex);
		
		var copyText = this._text.substring(highlightBegin, highlightEnd);
		
		clipboardData.setData("Text", copyText);
		
		this._deleteHighlightChars();
		this._updateCharMetricsAndSpaceSpans();
		
		this._layoutShouldScroll = true;
		this._invalidateLayout();
		
		this.dispatchEvent(new ElementEvent("changed", false));
	};
	
//@Override	
TextFieldElement.prototype._onCanvasElementRemoved = 
	function (addedRemovedEvent)
	{
		TextFieldElement.base.prototype._onCanvasElementRemoved.call(this, addedRemovedEvent);
		
		this._disableCaret();
		
		this._shiftPressed = false;
		this._layoutShouldScroll = false;
		
		if (this.hasEventListener("enterframe", this._onTextFieldEnterFrameInstance) == true)
			this.removeEventListener("enterframe", this._onTextFieldEnterFrameInstance);
	};		
	
//@private	
TextFieldElement.prototype._updateEnterFrameListener = 
	function ()
	{
		if (this._caretEnabled == true || (this._mouseIsDown == true && this.getStyle("Selectable") == true))
		{
			if (this.hasEventListener("enterframe", this._onTextFieldEnterFrameInstance) == false)
				this.addEventListener("enterframe", this._onTextFieldEnterFrameInstance);
		}
		else
		{
			if (this.hasEventListener("enterframe", this._onTextFieldEnterFrameInstance) == true)
				this.removeEventListener("enterframe", this._onTextFieldEnterFrameInstance);
		}
	};
	
/**
 * @function _updateEventListeners
 * Adds removes mouse, keyboard, and focus event listeners based on Enabled and Selectable styles.
 * Called in response to style changes.
 */	
TextFieldElement.prototype._updateEventListeners = 
	function ()
	{
		var enabled = this.getStyle("Enabled");
		var selectable = this.getStyle("Selectable");
		
		if (selectable == true || enabled == true)
		{
			if (this.hasEventListener("keydown", this._onTextFieldKeyInstance) == false)
				this.addEventListener("keydown", this._onTextFieldKeyInstance);
			
			if (this.hasEventListener("keyup", this._onTextFieldKeyInstance) == false)
				this.addEventListener("keyup", this._onTextFieldKeyInstance);
			
			if (this.hasEventListener("mousedown", this._onTextFieldMouseEventInstance) == false)
				this.addEventListener("mousedown", this._onTextFieldMouseEventInstance);
			
			if (this.hasEventListener("mouseup", this._onTextFieldMouseEventInstance) == false)
				this.addEventListener("mouseup", this._onTextFieldMouseEventInstance);
			
			if (this.hasEventListener("focusin", this._onTextFieldFocusEventInstance) == false)
				this.addEventListener("focusin", this._onTextFieldFocusEventInstance);
			
			if (this.hasEventListener("focusout", this._onTextFieldFocusEventInstance) == false)
				this.addEventListener("focusout", this._onTextFieldFocusEventInstance);
		}
		else
		{
			if (this.hasEventListener("keydown", this._onTextFieldKeyInstance) == true)
				this.removeEventListener("keydown", this._onTextFieldKeyInstance);
			
			if (this.hasEventListener("keyup", this._onTextFieldKeyInstance) == true)
				this.removeEventListener("keyup", this._onTextFieldKeyInstance);
			
			if (this.hasEventListener("mousedown", this._onTextFieldMouseEventInstance) == true)
				this.removeEventListener("mousedown", this._onTextFieldMouseEventInstance);
			
			if (this.hasEventListener("mouseup", this._onTextFieldMouseEventInstance) == true)
				this.removeEventListener("mouseup", this._onTextFieldMouseEventInstance);
			
			if (this.hasEventListener("focusin", this._onTextFieldFocusEventInstance) == true)
				this.removeEventListener("focusin", this._onTextFieldFocusEventInstance);
			
			if (this.hasEventListener("focusout", this._onTextFieldFocusEventInstance) == true)
				this.removeEventListener("focusout", this._onTextFieldFocusEventInstance);
		}
		
		if (enabled == false)
			this._disableCaret();
	};

	
//@Override
TextFieldElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		TextFieldElement.base.prototype._doStylesUpdated.call(this, stylesMap);
	
		////Update line renderers////
		if ("TextStyle" in stylesMap ||
			"TextFont" in stylesMap ||
			"TextSize" in stylesMap ||
			"TextColor" in stylesMap ||
			"TextFillType" in stylesMap || 
			"TextDecoration" in stylesMap ||
			"MaskCharacter" in stylesMap)
		{
			for (var i = 0; i < this._textLinesContainer._getNumChildren(); i++)
				this._textLinesContainer._getChildAt(i)._invalidateRender();
		}
		else if ("TextHighlightedColor" in stylesMap ||
				"TextHighlightedBackgroundColor" in stylesMap)
		{
			for (var i = 0; i < this._textLinesContainer._getNumChildren(); i++)
			{
				//Only re-render if in fact we have a highlighted selection.
				if (this._textLinesContainer._getChildAt(i)._highlightMinIndex != this._textLinesContainer._getChildAt(i)._highlightMaxIndex)
					this._textLinesContainer._getChildAt(i)._invalidateRender();
			}
		}
		
		//Update ourself
		if ("TextStyle" in stylesMap ||
			"TextFont" in stylesMap ||
			"TextSize" in stylesMap ||
			"MaskCharacter" in stylesMap)
		{
			this._charMetrics = null;
			
			this._invalidateMeasure();
			this._invalidateLayout();
		}
		else if ("Multiline" in stylesMap ||
			"WordWrap" in stylesMap ||
			"TextLinePaddingTop" in stylesMap ||
			"TextLinePaddingBottom" in stylesMap)
		{
			this._invalidateMeasure();
			this._invalidateLayout();
		}
		else if ("TextHorizontalAlign" in stylesMap ||
			"TextVerticalAlign" in stylesMap || 
			"TextLineSpacing" in stylesMap)
		{
			this._invalidateLayout();
		}
		
		if ("MaxChars" in stylesMap)
			this.setText(this._text); //Will trim if needed.
		
		if ("TextCaretColor" in stylesMap && this._textCaret != null)
			this._textCaret.setStyle("BackgroundFill", this.getStyle("TextCaretColor"));
		
		if ("Enabled" in stylesMap || "Selectable" in stylesMap)
			this._updateEventListeners();
		
		this._updateEnterFrameListener();
		this._updateCaretVisibility();
	};	
	
//@private	
TextFieldElement.prototype._createCharMetrics = 
	function ()
	{
		if (this._charMetrics != null)
			return;
	
		var currentX = 0;
		var currentWidth = 0;
		
		this._charMetrics = [];
		this._spaceSpans = [];
		
		var currentSpaceSpan = null;
		
		if (this._text.length > 0)
		{
			var fontString = this._getFontString();	
			
			var maskCharacter = this.getStyle("MaskCharacter");
			var maskCharacterWidth = 0;
			
			if (maskCharacter != null)
				maskCharacterWidth = CanvasElement._measureText(maskCharacter, fontString);
			
			for (var i = 0; i < this._text.length; i++)
			{
				currentWidth = CanvasElement._measureText(this._text[i], fontString);
				
				if (maskCharacter != null && currentWidth > 0)
					currentWidth = maskCharacterWidth;				
				
				this._charMetrics.push(
					{
						x:		currentX,
						width: 	currentWidth
					});
				
				if (this._text[i] == " ")
				{
					if (currentSpaceSpan == null)
						currentSpaceSpan = {start:i, end:i, type:"space"};
					else
						currentSpaceSpan.end = i;
				}
				else if (currentSpaceSpan != null)
				{
					this._spaceSpans.push(currentSpaceSpan);
					currentSpaceSpan = null;
				}
				
				if (this._text[i] == '\n')
					this._spaceSpans.push({start:i, end:i, type:"nline"});
				
				currentX += currentWidth;
			}
		}
		
		if (currentSpaceSpan != null)
			this._spaceSpans.push(currentSpaceSpan);
		
		//Dummy for caret at end of string
		this._charMetrics.push( { x:currentX, width:0 }); 
		this._invalidateLayout();
	};
	
//@Override
TextFieldElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		this._createCharMetrics();
	
		var linePadTop = this.getStyle("TextLinePaddingTop");
		var linePadBottom = this.getStyle("TextLinePaddingBottom");
		var textSize = this.getStyle("TextSize");

		var textWidth = this._charMetrics[this._text.length].x;
		var textHeight = textSize + linePadTop + linePadBottom;		
		
		//If using word wrap, height is dependent on actual width so layout
		//must run and do the actual measurment...
		if (this.getStyle("WordWrap") == true)
		{	
			//We need the parent to know it can contract us.
			textWidth = this.getStyle("MinWidth") - padWidth; //padWidth added back at end
			
			this._invalidateLayout();
		}
		else if (this.getStyle("Multiline") == true)
		{
			var widestLineSize = -1;
			var lineStartIndex = 0;
			var numLines = 1;
			for (var i = 0; i < this._spaceSpans.length; i++)
			{
				//Only care about newline characters
				if (this._spaceSpans[i].type != "nline")
					continue;
				
				if (this._charMetrics[this._spaceSpans[i].start].x - this._charMetrics[lineStartIndex].x > widestLineSize)
					widestLineSize = this._charMetrics[this._spaceSpans[i].start].x - this._charMetrics[lineStartIndex].x;
				
				lineStartIndex = this._spaceSpans[i].start + 1;
				numLines++;
			}
			
			if (numLines > 1)
			{
				//Measure last line
				if (lineStartIndex < this._charMetrics.length - 1)
				{
					if (this._charMetrics[this._charMetrics.length - 1].x - this._charMetrics[lineStartIndex].x > widestLineSize)
						widestLineSize = this._charMetrics[this._charMetrics.length - 1].x - this._charMetrics[lineStartIndex].x;
				}
					
				textWidth = widestLineSize;
					
				textHeight = textHeight * numLines;
				textHeight = textHeight + (this.getStyle("TextLineSpacing") * (numLines - 1));
			}
		}
		
		//Always add 1 for text caret 
		//TODO: This should be the text caret's width only when editable
		this._setMeasuredSize(1 + textWidth + padWidth, textHeight + padHeight);
	};	
	
//@Override	
TextFieldElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		TextFieldElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		var x = paddingMetrics.getX();
		var y = paddingMetrics.getY();
		var w = paddingMetrics.getWidth();
		var h = paddingMetrics.getHeight();
		
		//Adjust text x position per scroll / align.
		var availableWidth = w - 1; // account for caret width.
		
		//Size / Position the line container.
		this._textClipContainer._setActualPosition(x, y);
		this._textClipContainer._setActualSize(availableWidth, h);
		
		var isMultiline = this.getStyle("Multiline");
		var isWordWrap = this.getStyle("WordWrap");
		var textHorizontalAlign = this.getStyle("TextHorizontalAlign");
		var textVerticalAlign = this.getStyle("TextVerticalAlign");
		var textSize = this.getStyle("TextSize");
		var lineSpacing = this.getStyle("TextLineSpacing");
		var linePaddingTop = this.getStyle("TextLinePaddingTop");
		var linePaddingBottom = this.getStyle("TextLinePaddingBottom");
		var lineHeight = textSize + linePaddingTop + linePaddingBottom;
		
		var spaceSpanIndex = 0;
		var lineStartCharIndex = 0;
		var lineEndCharIndex = 0;
		
		var newLineData = null;
		var lines = [];
		
		var textHeight = 0;
		var textWidth = 0;
		
		var caretLineIndex = 0;
		var newlineFound = false;
		
		//Calculate lines of text based on multiline, wordwrap, spaces, and newlines.
		while (lineStartCharIndex < this._charMetrics.length)
		{
			newLineData = {charMetricsStartIndex:-1, charMetricsEndIndex:-1};
			
			if (isMultiline == false && isWordWrap == false)
			{
				newLineData.charMetricsStartIndex = 0; 
				newLineData.charMetricsEndIndex = this._charMetrics.length - 1;
				caretLineIndex = 0;
				lineStartCharIndex = this._charMetrics.length;
			}
			else
			{
				newLineData.charMetricsStartIndex = lineStartCharIndex;
				newlineFound = false;
				
				for (var i = spaceSpanIndex; i < this._spaceSpans.length; i++)
				{
					//Ignore spaces if wordwrap is off
					if (this._spaceSpans[i].type == "space" && isWordWrap == false)
					{
						spaceSpanIndex++;
						continue;
					}
					
					if (textHorizontalAlign == "left")
						lineEndCharIndex = this._spaceSpans[i].end;
					else
						lineEndCharIndex = this._spaceSpans[i].start;
					
					if (this._charMetrics[lineEndCharIndex].x - this._charMetrics[newLineData.charMetricsStartIndex].x <= availableWidth ||
						newLineData.charMetricsEndIndex == -1)
					{
						newLineData.charMetricsEndIndex = lineEndCharIndex;
						
						spaceSpanIndex++;
						lineStartCharIndex = lineEndCharIndex + 1;
						
						//Handle newline as space if multiline is off
						if (this._spaceSpans[i].type == "nline" && isMultiline == true)
						{
							newlineFound = true;
							break;
						}
					}
					else
						break;
				}
				
				//Last line, no more spaces for breaks.
				if (newLineData.charMetricsEndIndex == -1 || 
					(this._charMetrics[this._charMetrics.length - 1].x - this._charMetrics[newLineData.charMetricsStartIndex].x <= availableWidth && newlineFound == false))
				{
					newLineData.charMetricsEndIndex = this._charMetrics.length - 1;
					lineStartCharIndex = this._charMetrics.length;
				}
			}
			
			//Record max line width
			if (textWidth < this._charMetrics[newLineData.charMetricsEndIndex].x - this._charMetrics[newLineData.charMetricsStartIndex].x)
				textWidth = this._charMetrics[newLineData.charMetricsEndIndex].x - this._charMetrics[newLineData.charMetricsStartIndex].x;
			
			lines.push(newLineData);
		}
		
		textHeight = (lines.length * lineHeight) + ((lines.length - 1) * lineSpacing); 
		
		//Update the measured size now that we know the height. (May cause another layout pass if causes parent to change our size)
		if (isWordWrap == true)
			this._setMeasuredSize(this._measuredWidth, textHeight + this._getPaddingSize().height);
			
		//Size the lines container to the size of lines of text
		this._textLinesContainer._setActualSize(textWidth, textHeight);
		
		//Update text lines
		
		//Purge excess
		while (this._textLinesContainer._getNumChildren() > lines.length)
			this._textLinesContainer._removeChildAt(this._textLinesContainer._getNumChildren() - 1);
		
		//Update Add
		var textFieldLine = null;
		var lineWidth = 0;
		var lineXPosition;
		var lineYPosition = 0;
		for (var i = 0; i < lines.length; i++)
		{
			if (i < this._textLinesContainer._getNumChildren()) //Update line
				textFieldLine = this._textLinesContainer._getChildAt(i);
			else //Line added
			{
				textFieldLine = new TextFieldLineElement();
				this._textLinesContainer._addChild(textFieldLine);
			}
			
			//Update line
			textFieldLine.setParentLineMetrics(this, lines[i].charMetricsStartIndex, lines[i].charMetricsEndIndex);
			textFieldLine.setParentSelection(this._textHighlightStartIndex, this._caretIndex);
			
			textFieldLine.setStyle("PaddingTop", linePaddingTop);
			textFieldLine.setStyle("PaddingBottom", linePaddingBottom);
			
			lineWidth = textFieldLine.getLineWidth();
			textFieldLine._setActualSize(lineWidth, lineHeight);
			
			//Handle horizontal alignment
			if (textHorizontalAlign == "right")
				lineXPosition = this._textLinesContainer._width - lineWidth;
			else if (textHorizontalAlign == "center")
				lineXPosition = Math.round((this._textLinesContainer._width / 2) - (lineWidth / 2));
			else // "left"
				lineXPosition = 0;
			
			textFieldLine._setActualPosition(lineXPosition, lineYPosition);
			lineYPosition += (lineHeight + lineSpacing);
		}
		
		//Position the lines container
		var lineContainerX = this._textLinesContainer._x;
		var lineContainerY = this._textLinesContainer._y;
		
		//Handle vertical alignment
		if (this._textLinesContainer._height <= this._textClipContainer._height)
		{
			if (textVerticalAlign == "bottom")
				lineContainerY = this._textClipContainer._height - this._textLinesContainer._height;
			else if (textVerticalAlign == "middle")
				lineContainerY = Math.round((this._textClipContainer._height / 2) - (this._textLinesContainer._height / 2));
			else
				lineContainerY = 0;
		}
		else //Fix resize
		{
			if (this._textLinesContainer._y > 0)
				lineContainerY = 0;
			else if (this._textLinesContainer._y + this._textLinesContainer._height < this._textClipContainer._height)
				lineContainerY = this._textClipContainer._height - this._textLinesContainer._height;
		}
		
		//Handle horizontal alignment
		if (this._textLinesContainer._width <= this._textClipContainer._width)
		{
			if (textHorizontalAlign == "right")
				lineContainerX = this._textClipContainer._width - this._textLinesContainer._width;
			else if (textHorizontalAlign == "center")
				lineContainerX = Math.round((this._textClipContainer._width / 2) - (this._textLinesContainer._width / 2));
			else
				lineContainerX = 0;
		}
		else //Fix resize
		{
			if (this._textLinesContainer._x > 0)
				lineContainerX = 0;
			else if (this._textLinesContainer._x + this._textLinesContainer._width < this._textClipContainer._width)
				lineContainerX = this._textClipContainer._width - this._textLinesContainer._width;
		}
			
		//Scroll if caret out of bounds - we only scroll if caret moved out of bounds due to user input
		if (this._layoutShouldScroll == true)
		{
			this._layoutShouldScroll = false;
			
			//Only need to scroll if text size is larger than clip region
			if (this._textLinesContainer._height > this._textClipContainer._height ||
				this._textLinesContainer._width > this._textClipContainer._width)
			{
				//Find the line the caret is on
				textFieldLine = this._textLinesContainer._getChildAt(this._getLineIndexFromCharIndex(this._caretIndex));
			
				//Get the carets actual position
				var caretX = lineContainerX + textFieldLine._x + (this._charMetrics[this._caretIndex].x - this._charMetrics[textFieldLine._charMetricsStartIndex].x);
				var caretY = lineContainerY + textFieldLine._y;
				
				//Scroll the text lines container if caret out of bounds
				if (caretX < 0)
					lineContainerX = lineContainerX + (caretX * -1) + 35; //Arbitrary 35 pixel X over-scroll (this should probably be a style)
				else if (caretX + 1 > this._textClipContainer._width) 
					lineContainerX = lineContainerX - ((caretX + 1) - this._textClipContainer._width) - 35;
	
				if (caretY < 0)
					lineContainerY = lineContainerY + (caretY * -1);
				else if (caretY + textFieldLine._height > this._textClipContainer._height)
					lineContainerY = lineContainerY - ((caretY + textFieldLine._height) - this._textClipContainer._height);
				
				//Fix over-scroll
				if (this._textLinesContainer._height > this._textClipContainer._height)
				{
					if (lineContainerY > 0)
						lineContainerY = 0;
					else if (lineContainerY + this._textLinesContainer._height < this._textClipContainer._height)
						lineContainerY = this._textClipContainer._height - this._textLinesContainer._height;
				}
				
				if (this._textLinesContainer._width > this._textClipContainer._width)
				{
					if (lineContainerX > 0)
						lineContainerX = 0;
					else if (lineContainerX + this._textLinesContainer._width < this._textClipContainer._width)
						lineContainerX = this._textClipContainer._width - this._textLinesContainer._width;
				}
			}
		}
		
		//Set the position of the text lines container
		this._textLinesContainer._setActualPosition(lineContainerX, lineContainerY);
		
		//Handle caret placement
		if (this._textCaret != null)
		{
			if (this._caretIndex < 0 || this._caretIndex > this._text.length)
				this._textCaret._setActualSize(0, 0);
			else
			{
				//Find the line the caret is on.
				textFieldLine = this._textLinesContainer._getChildAt(this._getLineIndexFromCharIndex(this._caretIndex));

				//Get the text area metrics		
				var visibleMetrics = new DrawMetrics();
				visibleMetrics._x = x;
				visibleMetrics._y = y;
				visibleMetrics._width = w;
				visibleMetrics._height = h;
				
				//Get the caret metrics
				var caretMetrics = new DrawMetrics();
				caretMetrics._x = x + this._textLinesContainer._x + textFieldLine._x + (this._charMetrics[this._caretIndex].x - this._charMetrics[textFieldLine._charMetricsStartIndex].x);
				caretMetrics._y = y + this._textLinesContainer._y + textFieldLine._y;
				caretMetrics._width = 1;
				caretMetrics._height = textFieldLine._height;
				
				//Clip caret metrics to text area
				caretMetrics.mergeReduce(visibleMetrics);
				
				//Size and position caret
				this._textCaret._setActualSize(Math.max(0, caretMetrics._width), Math.max(0, caretMetrics._height));
				this._textCaret._setActualPosition(caretMetrics._x, caretMetrics._y);
			}
		}
		
		//If we added a global listener, but a parent canceled the keyboard event, we need to purge these.
		window.removeEventListener("copy", this._onTextFieldCopyPasteInstance);
		window.removeEventListener("paste", this._onTextFieldCopyPasteInstance);
		window.removeEventListener("cut", this._onTextFieldCopyPasteInstance);
	};		
	
	
///////Internal class for rendering lines of text/////////////////

//This class is only used for rendering lines. 
//No measure() or layout() needed (handled by parent TextField).
function TextFieldLineElement()
{
	TextFieldLineElement.base.prototype.constructor.call(this);
	
	this._text = "";
	
	this._highlightMinIndex = 0;
	this._highlightMaxIndex = 0;
	
	this._parentTextField = null;
	this._charMetricsStartIndex = -1;
	this._charMetricsEndIndex = -1;	//Non-inclusive
}
	
//Inherit from CanvasElement
TextFieldLineElement.prototype = Object.create(CanvasElement.prototype);
TextFieldLineElement.prototype.constructor = TextFieldLineElement;
TextFieldLineElement.base = CanvasElement;	

//Optimize - turn off inheriting for rendering styles. We'll pull styles from parent so
//we can utilize the parents cache rather than each line having to lookup and cache styles.
//Parent also responsible for invalidating our render when styles changes.
TextFieldLineElement._StyleTypes = Object.create(null);
TextFieldLineElement._StyleTypes.TextStyle =						StyleableBase.EStyleType.NORMAL;		
TextFieldLineElement._StyleTypes.TextFont =							StyleableBase.EStyleType.NORMAL;		
TextFieldLineElement._StyleTypes.TextSize =							StyleableBase.EStyleType.NORMAL;		
TextFieldLineElement._StyleTypes.TextColor =						StyleableBase.EStyleType.NORMAL;			
TextFieldLineElement._StyleTypes.TextFillType =						StyleableBase.EStyleType.NORMAL;			
TextFieldLineElement._StyleTypes.TextHighlightedColor = 			StyleableBase.EStyleType.NORMAL;			
TextFieldLineElement._StyleTypes.TextHighlightedBackgroundColor = 	StyleableBase.EStyleType.NORMAL;	
TextFieldLineElement._StyleTypes.TextDecoration =					StyleableBase.EStyleType.NORMAL;

TextFieldLineElement.prototype.setParentLineMetrics = 
	function (parentTextField, charStartIndex, charEndIndex)
	{
		this._parentTextField = parentTextField;
		this._charMetricsStartIndex = charStartIndex;
		this._charMetricsEndIndex = charEndIndex;
		
		var newText = parentTextField._text.substring(charStartIndex, charEndIndex);
		if (newText != this._text)
		{
			this._text = newText;
			this._invalidateRender();
		}
	};

TextFieldLineElement.prototype.setParentSelection = 
	function (startIndex, endIndex)
	{
		var minIndex = Math.min(startIndex, endIndex);
		var maxIndex = Math.max(startIndex, endIndex);
		
		if (minIndex < this._charMetricsStartIndex)
			minIndex = this._charMetricsStartIndex;
		if (maxIndex > this._charMetricsEndIndex)
			maxIndex = this._charMetricsEndIndex;
		
		//Highlight is outside of bounds, nuke it.
		if (minIndex > maxIndex || minIndex == maxIndex)
		{
			minIndex = 0;
			maxIndex = 0;
		}
		
		if (this._highlightMinIndex == minIndex && this._highlightMaxIndex == maxIndex)
			return;
		
		this._highlightMinIndex = minIndex;
		this._highlightMaxIndex = maxIndex;
		
		this._invalidateRender();
	};

TextFieldLineElement.prototype.getLineWidth = 
	function ()
	{
		if (this._charMetricsStartIndex > -1 && this._charMetricsEndIndex > -1)
			return this._parentTextField._charMetrics[this._charMetricsEndIndex].x - this._parentTextField._charMetrics[this._charMetricsStartIndex].x;
		
		return 0;
	};	
	
//@override
TextFieldLineElement.prototype._doRender =
	function()
	{
		TextFieldLineElement.base.prototype._doRender.call(this);
		
		if (this._text.length == 0)
			return;
		
		var paddingMetrics = this._getPaddingMetrics();
		var ctx = this._getGraphicsCtx();
		
		//Get styles
		var textFillType = this._parentTextField.getStyle("TextFillType");
		var textColor = this._parentTextField.getStyle("TextColor");
		var highlightTextColor = this._parentTextField.getStyle("TextHighlightedColor");
		var backgroundHighlightTextColor = this._parentTextField.getStyle("TextHighlightedBackgroundColor");
		var fontString = this._parentTextField._getFontString();
		var textDecoration = this._parentTextField.getStyle("TextDecoration");	
		var maskCharacter = this._parentTextField.getStyle("MaskCharacter");
		
		var x = paddingMetrics.getX();
		var y = paddingMetrics.getY() + (paddingMetrics.getHeight() / 2); 
		var w = paddingMetrics.getWidth();
		
		for (var i = 0; i < this._text.length; i++)
		{
			var charWidth = this._parentTextField._charMetrics[i + this._charMetricsStartIndex].width;
			
			var printChar = this._text[i];
			if (maskCharacter != null)
				printChar = maskCharacter;
			
			if (this._highlightMinIndex <= i + this._charMetricsStartIndex && this._highlightMaxIndex > i + this._charMetricsStartIndex)
			{
				ctx.fillStyle = backgroundHighlightTextColor;
				
				ctx.beginPath();
				ctx.moveTo(x, 0);
				ctx.lineTo(x + charWidth, 0);
				ctx.lineTo(x + charWidth, this._height);
				ctx.lineTo(x, this._height);
				ctx.closePath();
				ctx.fill();
				
				if (textFillType == "stroke")
					CanvasElement._strokeText(ctx, printChar, x, y, fontString, highlightTextColor, "middle");
				else
					CanvasElement._fillText(ctx, printChar, x, y, fontString, highlightTextColor, "middle");
			}
			else
			{
				if (textFillType == "stroke")
					CanvasElement._strokeText(ctx, printChar, x, y, fontString, textColor, "middle");
				else
					CanvasElement._fillText(ctx, printChar, x, y, fontString, textColor, "middle");
			}
			
			x += charWidth;
		}
		
		if (textDecoration == "underline")
		{
			y = this._height - .5;
			
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x + w, y);
			ctx.lineWidth = 1;
			
			if (this._highlightMinIndex == this._highlightMaxIndex)
				ctx.strokeStyle = textColor;
			else 
				ctx.strokeStyle = highlightTextColor;
			
			ctx.stroke();
		}
	};		
	
	
	