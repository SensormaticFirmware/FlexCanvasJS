
/**
 * @depends CanvasElement.js
 */

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
	
//@Override
TextFieldLineElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		TextFieldLineElement.base.prototype._doStylesUpdated.call(this, stylesMap);
	
		if ("TextStyle" in stylesMap ||
			"TextFont" in stylesMap ||
			"TextSize" in stylesMap ||
			"TextColor" in stylesMap ||
			"TextFillType" in stylesMap)
		{
			this._invalidateRender();
		}
		else if ("TextHighlightedColor" in stylesMap ||
				"TextHighlightedBackgroundColor" in stylesMap)
		{
			//Only re-render if in fact we have a highlighted selection.
			if (this._highlightMinIndex != this._highlightMaxIndex)
				this._invalidateRender();
		}
	};		
	
//@Override
TextFieldLineElement.prototype._doRender =
	function()
	{
		TextFieldLineElement.base.prototype._doRender.call(this);
		
		if (this._text.length == 0)
			return;
		
		var paddingMetrics = this._getPaddingMetrics();
		var ctx = this._getGraphicsCtx();
		
		//Get styles
		var textFillType = this.getStyle("TextFillType");
		var textColor = this.getStyle("TextColor");
		var highlightTextColor = this.getStyle("TextHighlightedColor");
		var backgroundHighlightTextColor = this.getStyle("TextHighlightedBackgroundColor");
		var fontString = this._getFontString();
		
		var x = paddingMetrics.getX();
		var y = paddingMetrics.getY() + (paddingMetrics.getHeight() / 2); 
		
		if (this._highlightMinIndex == this._highlightMaxIndex)
		{
			if (textFillType == "stroke")
				CanvasElement._strokeText(ctx, this._text, x, y, fontString, textColor, "middle");
			else
				CanvasElement._fillText(ctx, this._text, x, y, fontString, textColor, "middle");
		}
		else
		{
			for (var i = 0; i < this._text.length; i++)
			{
				var charWidth = CanvasElement._measureText(this._text[i], fontString);
				
				if (this._highlightMinIndex <= i && this._highlightMaxIndex > i)
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
						CanvasElement._strokeText(ctx, this._text[i], x, y, fontString, highlightTextColor, "middle");
					else
						CanvasElement._fillText(ctx, this._text[i], x, y, fontString, highlightTextColor, "middle");
				}
				else
				{
					if (textFillType == "stroke")
						CanvasElement._strokeText(ctx, this._text[i], x, y, fontString, textColor, "middle");
					else
						CanvasElement._fillText(ctx, this._text[i], x, y, fontString, textColor, "middle");
				}
				
				x += charWidth;
			}
		}
	};	

/////////////////////////////////////////////////////////
/////////////////TextFieldElement////////////////////////

/**
 * @class TextFieldElement
 * @inherits CanvasElement
 * 
 * Internal class used for consistently rendering text used by controls like TextElement and TextInput.
 * You typically should not use this class directly it is designed to be wrapped by a higher level control. 
 * This class allows text to be selected and edited, it renders a text position caret and watches
 * focus/mouse/keyboard events, maintains position of individual characters and allows copy/cut/paste.
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
	
	this._text = "";
	
	this._charMetrics = null; 	// array of {x, w}
	this._spaceSpans = null; 	// array of {start, end, type} _charMetric positions of spaces for wrapping text.
	
	this._dragHighlightScrollCharacterTime = 0;
	this._dragHighlightScrollCharacterDuration = 0;
	this._dragHighlightScrollCharacterDirection = 0;
	
	//Container for storing / clipping lines of text.
	this._textLinesContainer = new CanvasElement();
	this._textLinesContainer.setStyle("ClipContent", true);
	this._addChild(this._textLinesContainer);
	
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
	
	this._onTextFieldKeyDownInstance = 
		function (keyboardEvent)
		{
			_self._onTextFieldKeyDown(keyboardEvent);
		};
		
	this._onTextFieldMouseEventInstance =
		function (mouseEvent)
		{
			if (mouseEvent.getType() == "mousedown")
				_self._onTextFieldMouseDown(mouseEvent);
			else if (mouseEvent.getType() == "mouseup")
				_self._onTextFieldMouseUp(mouseEvent);
			else if (mouseEvent.getType() == "mousemoveex")
				_self._onTextFieldCanvasMouseMoveEx(mouseEvent); 
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
					else // "cut"
						_self._onTextFieldCut(event.clipboardData);
				}
				
				if (event.preventDefault)
					event.preventDefault();
				
				return false;
			}
			catch (ex)
			{
				
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
TextFieldElement._StyleTypes.Selectable = 				{inheritable:false};		// true || false

/**
 * @style MaxChars int
 * 
 * The maximum number of characters allowed for this TextField. When 0 unlimited characters are allowed.
 */
TextFieldElement._StyleTypes.MaxChars = 				{inheritable:false};		// number

/**
 * @style Multiline boolean
 * 
 * When true, newline characters are respected and text will be rendered on multiple lines if necessary.
 */
TextFieldElement._StyleTypes.Multiline = 				{inheritable:false};		// true || false

/**
 * @style WordWrap boolean
 * 
 * When true, text will wrap when width is constrained and will be rendered on multiple lines if necessary. 
 */
TextFieldElement._StyleTypes.WordWrap = 				{inheritable:false};		// true || false


////////////Default Styles////////////////////////////

TextFieldElement.StyleDefault = new StyleDefinition();

TextFieldElement.StyleDefault.setStyle("Selectable", 					false);
TextFieldElement.StyleDefault.setStyle("MaxChars", 						0);
TextFieldElement.StyleDefault.setStyle("Multiline", 					false);
TextFieldElement.StyleDefault.setStyle("WordWrap", 						false);

TextFieldElement.StyleDefault.setStyle("Enabled", 						false);
TextFieldElement.StyleDefault.setStyle("TabStop",						0);
TextFieldElement.StyleDefault.setStyle("Cursor", 						"text");			

TextFieldElement.StyleDefault.setStyle("BorderType", 					"none");
TextFieldElement.StyleDefault.setStyle("PaddingTop", 					0);
TextFieldElement.StyleDefault.setStyle("PaddingBottom",					0);
TextFieldElement.StyleDefault.setStyle("PaddingLeft", 					3);
TextFieldElement.StyleDefault.setStyle("PaddingRight", 					2);
TextFieldElement.StyleDefault.setStyle("BackgroundColor",				null);


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
			if (this._textLinesContainer._getNumChildren() > 0 && this.getStyle("Multiline") == false && this.getStyle("WordWrap") == false)
				this._textLinesContainer._getChildAt(0)._setActualPosition(0, 0);
			
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
		
		this._updateEnterFrameListener();
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
		textCaret.setStyle("BackgroundColor", "TextCaretColor");
		textCaret.setStyle("AutoGradientStart", 0);
		textCaret.setStyle("AutoGradientStop", 0);
		
		return textCaret;
	};
	
//@private
TextFieldElement.prototype._updateCaretVisibility = 
	function ()
	{
		if (this._caretEnabled == true &&
			this._caretBlinkVisible == true && 
			this._caretIndex > -1 && this._caretIndex <= this._text.length && //Dont think this line is necessary
			this._caretIndex == this._textHighlightStartIndex)
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
		var currentTime = Date.now();
		
		if (currentTime > this._caretBlinkTime && 
			this._caretEnabled == true &&
			this._caretIndex > -1 && this._caretIndex <= this._text.length && //Dont think this line is necessary
			this._caretIndex == this._textHighlightStartIndex)
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
		
		if (currentTime > this._dragHighlightScrollCharacterTime && 
			this._dragHighlightScrollCharacterDuration > 0)
		{
			this._dragHighlightScrollCharacterTime += this._dragHighlightScrollCharacterDuration;
			var caretIndexChanged = false;
				
			if (this._dragHighlightScrollCharacterDirection == "left" && this._caretIndex > 0)
			{
				this.setSelection(this._textHighlightStartIndex, this._caretIndex - 1);
				caretIndexChanged = true;
			}
			else if (this._dragHighlightScrollCharacterDirection == "right" && this._caretIndex < this._text.length)
			{
				this.setSelection(this._textHighlightStartIndex, this._caretIndex + 1);
				caretIndexChanged = true;
			}
			
			if (caretIndexChanged == true)
			{
				var w = this._textLinesContainer._width;
				var textFieldLine1 = this._textLinesContainer._getChildAt(0);
				
				//Adjust text scroll position if cursor is out of bounds.
				var scrollDistance = 3;
				var caretPosition = this._charMetrics[this._caretIndex].x + textFieldLine1._x;
						
				//Adjust scroll position.
				if (caretPosition < 1)
				{
					textFieldLine1._setActualPosition(
							Math.min(0, (this._charMetrics[this._caretIndex].x * -1) + scrollDistance), 
							textFieldLine1._y);
				}
				else if (caretPosition > w - 1)
				{
					textFieldLine1._setActualPosition(
							Math.max(w - textFieldLine1._width, (this._charMetrics[this._caretIndex].x * -1) + w - scrollDistance), 
							textFieldLine1._y);
				}
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
		if (this._charMetrics == null || this._charMetrics.length == 0)
			return 0;
	
		var x = this._textLinesContainer._x;
		var w = this._textLinesContainer._width;
		mouseX += 2; //Text cursor is slightly offset. TODO: make this a style
		
		var textFieldLine1 = this._textLinesContainer._getChildAt(0);
		
		var charX = 0;
		var charW = 0;
		
		var newCaretIndex = 0;
		for (var i = 0; i <= this._text.length; i++)
		{
			charX = this._charMetrics[i].x + x + textFieldLine1._x;
			charW = this._charMetrics[i].width;
			
			if (charX < x)
				continue;
			
			if (charX > x + w)
				break;
			
			newCaretIndex = i;
			
			if (mouseX <= charX + (charW / 2))
				break;
		}
		
		return newCaretIndex;
	};

	
//@private - Only active if TextField is Enabled or Selectable.		
TextFieldElement.prototype._onTextFieldMouseDown = 
	function (mouseEvent)
	{
		if (this.hasEventListener("mousemoveex", this._onTextFieldMouseEventInstance) == false)
			this.addEventListener("mousemoveex", this._onTextFieldMouseEventInstance);

		var caretIndex = this._getCaretIndexFromMouse(mouseEvent.getX(), mouseEvent.getY());
		
		if (this.getStyle("Enabled") == true)
			this._enableCaret();
		
		this.setSelection(caretIndex, caretIndex);
	};
	
//@private - Only active if TextField is Enabled or Selectable.		
TextFieldElement.prototype._onTextFieldMouseUp = 
	function (mouseEvent)
	{
		if (this.hasEventListener("mousemoveex", this._onTextFieldMouseEventInstance) == true)
			this.removeEventListener("mousemoveex", this._onTextFieldMouseEventInstance);
		
		this._dragHighlightScrollCharacterDuration = 0;
		this._updateEnterFrameListener();
	};	
	
//@private - Only active if selectable or enabled and mouse is down.	
TextFieldElement.prototype._onTextFieldCanvasMouseMoveEx = 
	function (mouseEvent)
	{
		var mousePoint = {x:mouseEvent.getX(), y:mouseEvent.getY()};
		this.translatePointFrom(mousePoint, this._manager);
		
		var x = this._textLinesContainer._x;
		var w = this._textLinesContainer._width;
		
		var scrollDuration = 0;
		
		var caretIndex = this._getCaretIndexFromMouse(mousePoint.x, mousePoint.y);
		if (caretIndex == this._caretIndex)
		{
			if (mousePoint.x <= x + 2 && this._caretIndex > 0)
			{
				var range = Math.abs(x + 2 - mousePoint.x) * 3;
				scrollDuration = Math.max(20, 120 - range);
				
				if (this._dragHighlightScrollCharacterDuration == 0)
					this._dragHighlightScrollCharacterTime = Date.now() + scrollDuration;
				
				this._dragHighlightScrollCharacterDirection = "left";
			}
			else if (mousePoint.x >= x + w - 2 && this._caretIndex < this._text.length)
			{
				var range = Math.abs(x + w - 2 - mousePoint.x) * 3;
				scrollDuration = Math.max(20, 120 - range);
				
				if (this._dragHighlightScrollCharacterDuration == 0)
					this._dragHighlightScrollCharacterTime = Date.now() + scrollDuration;
				
				this._dragHighlightScrollCharacterDirection = "right";
			}
		}
		else
			this.setSelection(this._textHighlightStartIndex, caretIndex);
		
		this._dragHighlightScrollCharacterDuration = scrollDuration;
		this._updateEnterFrameListener();
	};
	
//@private	
TextFieldElement.prototype._updateCharXPositions = 
	function (startAfterIndex)
	{
		if (this._charMetrics == null || this._charMetrics.length == 0)
			return;
		
		if (startAfterIndex > this._charMetrics.length - 2)
			return;
		
		if (startAfterIndex < 0)
		{
			startAfterIndex = 0;
			this._charMetrics[0].x = 0;
		}
			
		var currentPos = this._charMetrics[startAfterIndex].x + this._charMetrics[startAfterIndex].width;
		for (var i = startAfterIndex + 1; i < this._charMetrics.length; i++)
		{
			this._charMetrics[i].x = currentPos;
			currentPos += this._charMetrics[i].width;
		}
	};

//@private	
TextFieldElement.prototype._deleteHighlightChars = 
	function ()
	{
		if (this._textHighlightStartIndex == this._caretIndex)
			return;
	
		var highlightBegin = Math.min(this._caretIndex, this._textHighlightStartIndex);
		var highlightEnd = Math.max(this._caretIndex, this._textHighlightStartIndex);
	
		//Fix char metrics
		this._charMetrics.splice(highlightBegin, highlightEnd - highlightBegin);
		this._updateCharXPositions(highlightBegin - 1);
		
		//Update string
		var strLeft = this._text.substring(0, highlightBegin);
		var strRight = this._text.substring(highlightEnd);
		this._text = strLeft + strRight;
		
		//Move caret
		this.setSelection(highlightBegin, highlightBegin);
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
		var keyString = keyboardEvent.getKey();
		var dispatchChanged = false;
		
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
		else if (keyString == "End")
		{
			if (keyboardEvent.getShift() == true && 
				(this._textHighlightStartIndex != this._caretIndex || enabled == true))
			{
				this.setSelection(this._textHighlightStartIndex, this._text.length);
			}
			else if (enabled == true)
				this.setSelection(this._text.length, this._text.length);
		}
		else if (keyString == "Home")
		{
			if (keyboardEvent.getShift() == true && 
				(this._textHighlightStartIndex != this._caretIndex || enabled == true))
			{
				this.setSelection(this._textHighlightStartIndex, 0);
			}
			else if (enabled == true)
				this.setSelection(0, 0);
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
				
				//Fix char metrics
				this._charMetrics.splice(this._caretIndex - 1, 1);
				this._updateCharXPositions(this._caretIndex - 2);
				
				//Update string
				var strLeft = this._text.substring(0, this._caretIndex - 1);
				var strRight = this._text.substring(this._caretIndex);
				this._text = strLeft + strRight;
				
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
	
				//Fix char metrics
				this._charMetrics.splice(this._caretIndex, 1);
				this._updateCharXPositions(this._caretIndex - 1);
				
				//Update string
				var strLeft = this._text.substring(0, this._caretIndex);
				var strRight = this._text.substring(this._caretIndex + 1);
				this._text = strLeft + strRight;
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
		else if (keyString.length == 1)
		{
			this._deleteHighlightChars();
			
			var maxChars = this.getStyle("MaxChars");
			
			if (maxChars > 0 && maxChars <= this._text.length)
			{
				keyboardEvent.preventDefault();
				return;
			}
			
			//Measure new char
			var newCharMetrics = {x:0, width:CanvasElement._measureText(keyString, this._getFontString())};
			
			//Fix char metrics
			this._charMetrics.splice(this._caretIndex, 0, newCharMetrics);
			this._updateCharXPositions(this._caretIndex - 1);
			
			//Update string
			var strLeft = this._text.substring(0, this._caretIndex);
			var strRight = this._text.substring(this._caretIndex);
			this._text = strLeft + keyString + strRight;
			
			//Move caret
			this.setSelection(this._caretIndex + 1, this._caretIndex + 1);
			
			dispatchChanged = true;
		}
		else
			return;
		
		this._scrollIfCaretOutOfBounds();
		this._invalidateLayout();
		
		if (dispatchChanged == true)
			this._dispatchEvent(new ElementEvent("changed", false));
		
		keyboardEvent.preventDefault();
	};

//@private	
TextFieldElement.prototype._scrollIfCaretOutOfBounds = 
	function ()
	{
		var textFieldLine1 = this._textLinesContainer._getChildAt(0);
		var w = this._textLinesContainer._width;
		var scrollDistance = Math.min(Math.floor(w * 0.3), 35);
		
		//Adjust text scroll position if cursor is out of bounds.
		var caretPosition = this._charMetrics[this._caretIndex].x + textFieldLine1._x;
				
		//Adjust scroll position (we dont know the width of the text line yet...) layout will fix if we overshoot
		if (caretPosition < 2)
		{
			textFieldLine1._setActualPosition(
				(this._charMetrics[this._caretIndex].x * -1) + scrollDistance,
				textFieldLine1._y);
		}
		else if (caretPosition > w - 2)
		{
			textFieldLine1._setActualPosition(
				(this._charMetrics[this._caretIndex].x * -1) + w - scrollDistance, 
				textFieldLine1._y);
		}
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
		
		//Measure new chars
		var fontString = this._getFontString();
		for (var i = 0; i < pasteString.length; i++)
		{
			this._charMetrics.splice(this._caretIndex + i, 0, 
					{x:0, width:CanvasElement._measureText(pasteString[i], fontString)});
		}

		//Fix char metrics
		this._updateCharXPositions(this._caretIndex - 1);
		
		//Update string
		var strLeft = this._text.substring(0, this._caretIndex);
		var strRight = this._text.substring(this._caretIndex);
		this._text = strLeft + pasteString + strRight;
		
		//Move caret
		this.setSelection(this._caretIndex + pasteString.length, this._caretIndex + pasteString.length);
		
		//Truncate if exceeding max characters
		if (maxChars > 0 && this._text.length > maxChars)
		{
			this._text = this._text.subString(0, maxChars);
			this._charMetrics.splice(0, this._text.length - maxChars);
			this.setSelection(this._text.length, this._text.length);
		}
		
		this._scrollIfCaretOutOfBounds();
		this._invalidateLayout();
		
		this._dispatchEvent(new ElementEvent("changed", false));
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
		
		this._scrollIfCaretOutOfBounds();
		this._invalidateLayout();
		
		this._dispatchEvent(new ElementEvent("changed", false));
	};
	
//@Override	
TextFieldElement.prototype._onCanvasElementRemoved = 
	function (addedRemovedEvent)
	{
		TextFieldElement.base.prototype._onCanvasElementRemoved.call(this, addedRemovedEvent);
		
		this._disableCaret();
		
		if (this.hasEventListener("mousemoveex", this._onTextFieldMouseEventInstance) == true)
			this.removeEventListener("mousemoveex", this._onTextFieldMouseEventInstance);
		
		if (this.hasEventListener("enterframe", this._onTextFieldEnterFrameInstance) == true)
			this.removeEventListener("enterframe", this._onTextFieldEnterFrameInstance);
	};		
	
//@private	
TextFieldElement.prototype._updateEnterFrameListener = 
	function ()
	{
		if (this._dragHighlightScrollCharacterDuration > 0 ||
			(this._caretEnabled == true && this._textHighlightStartIndex == this._caretIndex))
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
			if (this.hasEventListener("keydown", this._onTextFieldKeyDownInstance) == false)
				this.addEventListener("keydown", this._onTextFieldKeyDownInstance);
			
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
			if (this.hasEventListener("keydown", this._onTextFieldKeyDownInstance) == true)
				this.removeEventListener("keydown", this._onTextFieldKeyDownInstance);
			
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
	
		if ("TextStyle" in stylesMap ||
			"TextFont" in stylesMap ||
			"TextSize" in stylesMap)
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
			this._textCaret.setStyle("BackgroundColor", this.getStyle("TextCaretColor"));
		
		if ("Enabled" in stylesMap || "Selectable" in stylesMap)
			this._updateEventListeners();
		
		this._updateEnterFrameListener();
		this._updateCaretVisibility();
	};	
	
///**
// * @function _getCharMetrics
// * Gets a DrawMetrics object containing position and size data of character at supplied index.
// * 
// * @param charIndex int
// * Index of character to return metrics.
// * 
// * @returns DrawMetrics
// * DrawMetrics object containing position and size data of character at supplied index.
// */	
//TextFieldElement.prototype._getCharMetrics = 
//	function (charIndex)
//	{
//		if (this._charMetrics == null || 
//			charIndex < 0 ||
//			charIndex >= this._text.length)
//		{
//			return null;
//		}
//		
//		var metrics = new DrawMetrics();
//		metrics._height = this._textHeight;
//		metrics._width = this._charMetrics[charIndex].width;
//		metrics._x = this._charMetrics[charIndex].x + this._textXScrollPosition;
//		metrics._y = this._textYPosition;
//		
//		return metrics;
//	};
	
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
			
			for (var i = 0; i < this._text.length; i++)
			{
				currentWidth = CanvasElement._measureText(this._text[i], fontString);
				
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
				
				//Newline is last character, ignore
				if (this._spaceSpans[i].start == this._charMetrics.length - 2)
				{
					lineStartIndex = this._spaceSpans[i].start + 1;
					break;
				}
				
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
					if (this._charMetrics[lineStartIndex].x - this._charMetrics[this._charMetrics.length - 1].x > widestLineSize)
						widestLineSize = this._charMetrics[lineStartIndex].x - this._charMetrics[this._charMetrics.length - 1].x;
				}
					
				textWidth = widestLineSize;
					
				textHeight = textHeight * numLines;
				textHeight = textHeight + (this.getStyle("TextLineSpacing") * (numLines - 1));
			}
		}
		
		//Always add 1 for text caret 
		//TODO: This should be the text caret's width only when editable
		var measuredSize = {width:0, height:0};
		measuredSize.width = 1 + textWidth + padWidth;
		measuredSize.height = textHeight + padHeight;
		
		return measuredSize;
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
		var availableWidth = w - 1; // account for caret width - TODO: width should be width of caret element, always 1 for now.
		
		//Size / Position the line container.
		this._textLinesContainer._setActualPosition(x, y);
		this._textLinesContainer._setActualSize(availableWidth, h);
		
		var isMultiline = this.getStyle("Multiline");
		var isWordWrap = this.getStyle("WordWrap");
		var textAlign = this.getStyle("TextHorizontalAlign");
		var textBaseline = this.getStyle("TextVerticalAlign");
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
		
		var caretLineIndex = 0;
		var newlineFound = false;
		
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
					if (this._spaceSpans.type == "space" && isWordWrap == false)
						continue;
					
					if (textAlign == "left")
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
			
			lines.push(newLineData);
		}
		
		var totalTextHeight = (lines.length * lineHeight) + ((lines.length - 1) * lineSpacing); 
		
		//Update the measured size now that we know the height. (May cause another layout pass)
		if (isWordwrap == true)
			this._setMeasuredSize(this._measuredWidth, totalTextHeight + this._getPaddingSize().height);
			
		var textYPosition;
		if (textBaseline == "top")
			textYPosition = 0;
		else if (textBaseline == "bottom")
			textYPosition = h - totalTextHeight;
		else //middle
			textYPosition = Math.round((h / 2) - (totalTextHeight / 2));
		 
		//Update actual line data
		
		//Purge excess
		while (this._textLinesContainer._getNumChildren() > lines.length)
			this._textLinesContainer._removeChildAt(this._textLinesContainer._getNumChildren() - 1);
		
		//Update Add
		var textFieldLine = null;
		var lineWidth = 0;
		var lineXPosition;
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
			
			if (lineWidth < availableWidth || isMultiline == true) //align
			{
				if (textAlign == "right")
					lineXPosition = availableWidth - lineWidth;
				else if (textAlign == "center")
					lineXPosition = Math.round((availableWidth / 2) - (lineWidth / 2));
				else // "left"
					lineXPosition = 0;
			}
			else //fill excess (over-scroll or resize)
			{
				if (textFieldLine._x > 0)
					lineXPosition = 0;					
				else if (textFieldLine._x + lineWidth < availableWidth)
					lineXPosition = availableWidth - lineWidth;
				else
					lineXPosition = textFieldLine._x;
			}
			
			textFieldLine._setActualPosition(lineXPosition, textYPosition);
			
			textYPosition += (lineHeight + lineSpacing);
		}
		
		
		if (this._textCaret != null)
		{
			if (this._caretIndex < 0 || this._caretIndex > this._text.length)
				this._textCaret._setActualSize(0, lineHeight);
			else
			{
				//Find the line the caret is on.
				textFieldLine = this._textLinesContainer._getChildAt(caretLineIndex);

				var caretXPosition = this._charMetrics[this._caretIndex].x + textFieldLine._x + x;
				
				if (caretXPosition >= x && caretXPosition <= x + w - 1) //account for caret width
				{		
					this._textCaret._setActualPosition(caretXPosition, textFieldLine._y + y);
					this._textCaret._setActualSize(1, lineHeight);
				}
				else
					this._textCaret._setActualSize(0, lineHeight);
			}
		}
		
		//If we added a global listener, but a parent canceled the keyboard event, we need to purge these.
		window.removeEventListener("copy", this._onTextFieldCopyPasteInstance);
		window.removeEventListener("paste", this._onTextFieldCopyPasteInstance);
		window.removeEventListener("cut", this._onTextFieldCopyPasteInstance);
	};		
	
	