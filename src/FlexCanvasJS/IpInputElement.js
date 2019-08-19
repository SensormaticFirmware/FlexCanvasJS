
/**
 * @depends TextInputElement.js
 */

/////////////////////////////////////////////////////////
///////////////IpInputElement////////////////////////////
	
/**
 * @class IpInputElement
 * @inherits TextInputElement
 * 
 * IpInputElement is an edit-able IPv4 address field.
 * 
 * @constructor IpInputElement 
 * Creates new IpInputElement instance.
 */
function IpInputElement()
{
	IpInputElement.base.prototype.constructor.call(this);
	
	//Steal the text field from base TextInput - re-use as ip1 field
	this._textFieldIp1 = this._textField;
	this._removeChild(this._textField);
	
		//Use list container to layout text fields
		this._listContainer = new ListContainerElement();
		this._listContainer.setStyle("LayoutDirection", "horizontal");
		
			this._textFieldIp1.setStyle("PercentHeight", 100);
			this._textFieldIp1.setStyle("PercentWidth", 100);
			this._textFieldIp1.setStyle("MaxChars", 3);
			this._textFieldIp1.setStyle("TabStop", -1);
			
			this._labelFieldDot1 = new LabelElement();
			this._labelFieldDot1.setStyle("PercentHeight", 100);
			this._labelFieldDot1.setStyle("TextHorizontalAlign", "center");
			this._labelFieldDot1.setStyle("Text", ".");
			this._labelFieldDot1.setStyle("PaddingLeft", 0);
			this._labelFieldDot1.setStyle("PaddingRight", 0);
			this._labelFieldDot1.setStyle("TextStyle", "bold");
			
			this._textFieldIp2 = new TextFieldElement();
			this._textFieldIp2.setStyle("PercentHeight", 100);
			this._textFieldIp2.setStyle("PercentWidth", 100);
			this._textFieldIp2.setStyle("MaxChars", 3);
			this._textFieldIp2.setStyle("TabStop", -1);
			
			this._labelFieldDot2 = new LabelElement();
			this._labelFieldDot2.setStyle("PercentHeight", 100);
			this._labelFieldDot2.setStyle("TextHorizontalAlign", "center");
			this._labelFieldDot2.setStyle("Text", ".");
			this._labelFieldDot2.setStyle("PaddingLeft", 0);
			this._labelFieldDot2.setStyle("PaddingRight", 0);
			this._labelFieldDot2.setStyle("TextStyle", "bold");
			
			this._textFieldIp3 = new TextFieldElement();
			this._textFieldIp3.setStyle("PercentHeight", 100);
			this._textFieldIp3.setStyle("PercentWidth", 100);
			this._textFieldIp3.setStyle("MaxChars", 3);
			this._textFieldIp3.setStyle("TabStop", -1);
			
			this._labelFieldDot3 = new LabelElement();
			this._labelFieldDot3.setStyle("PercentHeight", 100);
			this._labelFieldDot3.setStyle("TextHorizontalAlign", "center");
			this._labelFieldDot3.setStyle("Text", ".");
			this._labelFieldDot3.setStyle("PaddingLeft", 0);
			this._labelFieldDot3.setStyle("PaddingRight", 0);
			this._labelFieldDot3.setStyle("TextStyle", "bold");
			
			this._textFieldIp4 = new TextFieldElement();
			this._textFieldIp4.setStyle("PercentHeight", 100);
			this._textFieldIp4.setStyle("PercentWidth", 100);
			this._textFieldIp4.setStyle("MaxChars", 3);
			this._textFieldIp4.setStyle("TabStop", -1);
			
		this._listContainer.addElement(this._textFieldIp1);
		this._listContainer.addElement(this._labelFieldDot1);
		this._listContainer.addElement(this._textFieldIp2);
		this._listContainer.addElement(this._labelFieldDot2);
		this._listContainer.addElement(this._textFieldIp3);
		this._listContainer.addElement(this._labelFieldDot3);
		this._listContainer.addElement(this._textFieldIp4);
		
	this._addChild(this._listContainer);

	//////////////////////////
	
	var _self = this;
		
	this._onIpInputTextFieldMouseDownInstance = 
		function (mouseEvent)
		{
			_self._onIpInputTextFieldMouseDown(mouseEvent);
		};	
		
	this._onIpInputTextFieldFocusOutInstance = 
		function (event)
		{
			_self._onIpInputTextFieldFocusOut(event);
		};
		
	this._textFieldIp1.addEventListener("focusout", this._onIpInputTextFieldFocusOutInstance);
	this._textFieldIp2.addEventListener("focusout", this._onIpInputTextFieldFocusOutInstance);
	this._textFieldIp3.addEventListener("focusout", this._onIpInputTextFieldFocusOutInstance);
	this._textFieldIp4.addEventListener("focusout", this._onIpInputTextFieldFocusOutInstance);
	
	////////////////////
	
	//Currently focused IP field
	this._textFieldFocused = null;
}

//Inherit from SkinnableElement
IpInputElement.prototype = Object.create(TextInputElement.prototype);
IpInputElement.prototype.constructor = IpInputElement;
IpInputElement.base = TextInputElement;

/////////////Events////////////////////////////////////


/////////////Style Types///////////////////////////////


/////////////Default Styles///////////////////////////

IpInputElement.StyleDefault = new StyleDefinition();

IpInputElement.StyleDefault.setStyle("TextHorizontalAlign", 						"center");
IpInputElement.StyleDefault.setStyle("TextVerticalAlign", 							"middle");

IpInputElement.StyleDefault.setStyle("PaddingLeft",									5);
IpInputElement.StyleDefault.setStyle("PaddingRight",								5);


////////Public///////////////////////

/**
 * @function setText
 * @override
 * Sets the IP to be displayed.
 * 
 * @param text String
 * IP to be displayed. Formatted as IPv4 address: "192.168.1.1"
 */
IpInputElement.prototype.setText = 
	function (text)
	{
		if (text == null)
			text = "";
		
		var i;
		var i2;
		var n;
		var ipArray = text.split(".");
		
		for (i = 0; i < ipArray.length; i++)
		{
			if (i == 4)
				return;
			
			n = Number(ipArray[i]);
			if (isNaN(n) == true)
				n = 0;
			
			if (n > 255)
				n = 255;
			
			if (i == 0)
				this._textFieldIp1.setText(n.toString());
			else if (i == 1)
				this._textFieldIp2.setText(n.toString());
			else if (i == 2)
				this._textFieldIp3.setText(n.toString());
			else //if (i == 3)
				this._textFieldIp4.setText(n.toString());
		}
		
	};

/**
 * @function getText
 * @override 
 * Gets the IP currently displayed. 
 * 
 * @returns String
 * IP currently displayed formatted as IPv4 address: "192.168.1.1".
 * When all fields are empty an empty string "" will be returned.
 * When some but not all fields are empty null will be returned (invalid IP).
 */	
IpInputElement.prototype.getText = 
	function ()
	{
		if (this._textFieldIp1.getText().length == 0 &&
			this._textFieldIp2.getText().length == 0 &&
			this._textFieldIp3.getText().length == 0 &&
			this._textFieldIp4.getText().length == 0)
		{
			return "";
		}
		
		if (this._textFieldIp1.getText().length == 0 ||
			this._textFieldIp2.getText().length == 0 ||
			this._textFieldIp3.getText().length == 0 ||
			this._textFieldIp4.getText().length == 0)
		{
			return null;
		}
	
		return this._textFieldIp1.getText() + "." +
				this._textFieldIp2.getText() + "." +
				this._textFieldIp3.getText() + "." +
				this._textFieldIp4.getText();
	};


////////Internal/////////////////////

//@override
IpInputElement.prototype._onTextInputKeyDown = 
	function (keyboardEvent)
	{
		if (keyboardEvent.getDefaultPrevented() == true)
			return;
		
		var key = keyboardEvent.getKey();
		
		if (key.length == 1 && 
			key != "0" && key != "1" &&
			key != "2" && key != "3" &&
			key != "4" && key != "5" &&
			key != "6" && key != "7" &&
			key != "8" && key != "9" &&
			key != ".")
		{
			return;
		}
		
		if (key == "Tab" || key == ".") //Move focus
		{
			var shiftPressed = false;
			
			if (key == "Tab")
				shiftPressed = keyboardEvent.getShift();
			
			if (shiftPressed == false)
			{
				if (this._textFieldFocused == this._textFieldIp4)
					return;
				else	
				{
					//Prevent normal tab stop handling
					keyboardEvent.preventDefault();
					
					this._textFieldFocused.dispatchEvent(new ElementEvent("focusout", false));
					
					if (this._textFieldFocused == this._textFieldIp1)
						this._textFieldFocused = this._textFieldIp2;
					else if (this._textFieldFocused == this._textFieldIp2)
						this._textFieldFocused = this._textFieldIp3;
					else //if (this._textFieldFocused == this._textFieldIp3)
						this._textFieldFocused = this._textFieldIp4;
					
					this._textFieldFocused.dispatchEvent(new ElementEvent("focusin", false));
				}
			}
			else //if (shiftPressed == true)
			{
				if (this._textFieldFocused == this._textFieldIp1)
					return;
				else
				{
					//Prevent normal tab stop handling
					keyboardEvent.preventDefault();
					
					this._textFieldFocused.dispatchEvent(new ElementEvent("focusout", false));
					
					if (this._textFieldFocused == this._textFieldIp4)
						this._textFieldFocused = this._textFieldIp3;
					else if (this._textFieldFocused == this._textFieldIp3)
						this._textFieldFocused = this._textFieldIp2;
					else //if (this._textFieldFocused == this._textFieldIp2)
						this._textFieldFocused = this._textFieldIp1;
					
					this._textFieldFocused.dispatchEvent(new ElementEvent("focusin", false));
				}
			}
		}
		else
		{
			var clonedEvent = keyboardEvent.clone();
			clonedEvent._bubbles = false; //Dont bubble.
			
			//Dispatch non-bubbling keyboard event to our text field.
			this._textFieldFocused.dispatchEvent(clonedEvent);
			
			if (clonedEvent.getIsCanceled() == true)
				keyboardEvent.cancelEvent();
				
			if (clonedEvent.getDefaultPrevented() == true)
				keyboardEvent.preventDefault();
		}
	};

//@override
IpInputElement.prototype._onIpInputKeyUp = 
	function (keyboardEvent)
	{
		if (keyboardEvent.getDefaultPrevented() == true)
			return;
		
		var key = keyboardEvent.getKey();
		
		if (key.length == 1 && 
			key != "0" && key != "1" &&
			key != "2" && key != "3" &&
			key != "4" && key != "5" &&
			key != "6" && key != "7" &&
			key != "8" && key != "9")
		{
			return;
		}
		
		var clonedEvent = keyboardEvent.clone();
		clonedEvent._bubbles = false; //Dont bubble.
		
		//Dispatch non-bubbling keyboard event to our text field.
		this._textFieldFocused.dispatchEvent(clonedEvent);
		
		if (clonedEvent.getIsCanceled() == true)
			keyboardEvent.cancelEvent();
			
		if (clonedEvent.getDefaultPrevented() == true)
			keyboardEvent.preventDefault();
	};	
	
//@override	
IpInputElement.prototype._onTextInputFocusIn = 
	function (elementEvent)
	{
		//Mouse down already focused
		if (this._textFieldFocused != null)
			return;
	
		//This only works because TextField doesnt look at _isFocused (manages caret state with different flag)
		this._textFieldIp1.dispatchEvent(elementEvent.clone()); 
		this._textFieldFocused = this._textFieldIp1;
	};

//@override	
IpInputElement.prototype._onTextInputFocusOut = 
	function (elementEvent)
	{
		//This only works because TextField doesnt look at _isFocused (manages caret state with different flag)
		this._textFieldFocused.dispatchEvent(elementEvent.clone());
		this._textFieldFocused = null; 
	};

/**
 * @function _onIpInputTextFieldMouseDown
 * Event handler for the internal TextField's "mousedown" event. Only active when IpInput is enabled. 
 * 
 * @param mouseEvent ElementMouseEvent
 * ElementMouseEvent to process.
 */	
IpInputElement.prototype._onIpInputTextFieldMouseDown = 
	function (mouseEvent)
	{
		if (mouseEvent.getTarget() != this._textFieldFocused && this._textFieldFocused != null)
			this._textFieldFocused.dispatchEvent(new ElementEvent("focusout", false));
		
		this._textFieldFocused = mouseEvent.getTarget();
	};	
	
/**
 * @function _onIpInputTextFieldMouseDown
 * Event handler for the internal TextField's "focusout" event.
 * 
 * @param elementEvent ElementEvent
 * ElementEvent to process.
 */		
IpInputElement.prototype._onIpInputTextFieldFocusOut = 
	function (event)
	{
		var textField = event.getTarget();
		var text = textField.getText();
		
		if (text.length == 0)
			return;
		
		//Trim leading zeros
		while (text.charAt(0) == "0")
			text = text.slice(1);
		
		if (Number(textField.getText()) > 255)
			textField.setText("255");
		else
			textField.setText(text);
	};
	
//@override
IpInputElement.prototype._updateTextColors = 
	function ()
	{
		this._textFieldIp1.setStyle("TextColor", this._getTextColor(this._currentSkinState));
		this._textFieldIp1.setStyle("TextHighlightedColor", this._getTextHighlightedColor(this._currentSkinState));
		this._textFieldIp1.setStyle("TextHighlightedBackgroundColor", this._getTextHighlightedBackgroundColor(this._currentSkinState));
		
		this._textFieldIp2.setStyle("TextColor", this._getTextColor(this._currentSkinState));
		this._textFieldIp2.setStyle("TextHighlightedColor", this._getTextHighlightedColor(this._currentSkinState));
		this._textFieldIp2.setStyle("TextHighlightedBackgroundColor", this._getTextHighlightedBackgroundColor(this._currentSkinState));
		
		this._textFieldIp3.setStyle("TextColor", this._getTextColor(this._currentSkinState));
		this._textFieldIp3.setStyle("TextHighlightedColor", this._getTextHighlightedColor(this._currentSkinState));
		this._textFieldIp3.setStyle("TextHighlightedBackgroundColor", this._getTextHighlightedBackgroundColor(this._currentSkinState));
		
		this._textFieldIp4.setStyle("TextColor", this._getTextColor(this._currentSkinState));
		this._textFieldIp4.setStyle("TextHighlightedColor", this._getTextHighlightedColor(this._currentSkinState));
		this._textFieldIp4.setStyle("TextHighlightedBackgroundColor", this._getTextHighlightedBackgroundColor(this._currentSkinState));
	};
	
//@override
IpInputElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		//IpInputElement.base.base - skip TextInput._doStylesUpdated()
		IpInputElement.base.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		//Force the textField to use our defaults rather than inherited.
		if ("TextHorizontalAlign" in stylesMap)
		{
			this._textFieldIp1.setStyle("TextHorizontalAlign", this.getStyle("TextHorizontalAlign"));
			this._textFieldIp2.setStyle("TextHorizontalAlign", this.getStyle("TextHorizontalAlign"));
			this._textFieldIp3.setStyle("TextHorizontalAlign", this.getStyle("TextHorizontalAlign"));
			this._textFieldIp4.setStyle("TextHorizontalAlign", this.getStyle("TextHorizontalAlign"));
		}
		
		if ("TextVerticalAlign" in stylesMap)
		{
			this._textFieldIp1.setStyle("TextVerticalAlign", this.getStyle("TextVerticalAlign"));
			this._textFieldIp2.setStyle("TextVerticalAlign", this.getStyle("TextVerticalAlign"));
			this._textFieldIp3.setStyle("TextVerticalAlign", this.getStyle("TextVerticalAlign"));
			this._textFieldIp4.setStyle("TextVerticalAlign", this.getStyle("TextVerticalAlign"));
			
			this._labelFieldDot1.setStyle("TextVerticalAlign", this.getStyle("TextVerticalAlign"));
			this._labelFieldDot2.setStyle("TextVerticalAlign", this.getStyle("TextVerticalAlign"));
			this._labelFieldDot3.setStyle("TextVerticalAlign", this.getStyle("TextVerticalAlign"));
		}
		
		if ("Enabled" in stylesMap)
		{
			var enabled = this.getStyle("Enabled");
			
			this._textFieldIp1.setStyle("Enabled", enabled);
			this._textFieldIp2.setStyle("Enabled", enabled);
			this._textFieldIp3.setStyle("Enabled", enabled);
			this._textFieldIp4.setStyle("Enabled", enabled);
			
			if (enabled == true)
			{
				if (this.hasEventListener("keydown", this._onTextInputKeyUpDownInstance) == false)
					this.addEventListener("keydown", this._onTextInputKeyUpDownInstance);
				
				if (this.hasEventListener("keyup", this._onTextInputKeyUpDownInstance) == false)
					this.addEventListener("keyup", this._onTextInputKeyUpDownInstance);
				
				if (this._textFieldIp1.hasEventListener("changed", this._onTextInputTextFieldChangedInstance) == false)
					this._textFieldIp1.addEventListener("changed", this._onTextInputTextFieldChangedInstance);		
				
				if (this._textFieldIp2.hasEventListener("changed", this._onTextInputTextFieldChangedInstance) == false)
					this._textFieldIp2.addEventListener("changed", this._onTextInputTextFieldChangedInstance);	
				
				if (this._textFieldIp3.hasEventListener("changed", this._onTextInputTextFieldChangedInstance) == false)
					this._textFieldIp3.addEventListener("changed", this._onTextInputTextFieldChangedInstance);	
				
				if (this._textFieldIp4.hasEventListener("changed", this._onTextInputTextFieldChangedInstance) == false)
					this._textFieldIp4.addEventListener("changed", this._onTextInputTextFieldChangedInstance);	
				
				if (this._textFieldIp1.hasEventListener("mousedown", this._onIpInputTextFieldMouseDownInstance) == false)
					this._textFieldIp1.addEventListener("mousedown", this._onIpInputTextFieldMouseDownInstance);
				
				if (this._textFieldIp2.hasEventListener("mousedown", this._onIpInputTextFieldMouseDownInstance) == false)
					this._textFieldIp2.addEventListener("mousedown", this._onIpInputTextFieldMouseDownInstance);
				
				if (this._textFieldIp3.hasEventListener("mousedown", this._onIpInputTextFieldMouseDownInstance) == false)
					this._textFieldIp3.addEventListener("mousedown", this._onIpInputTextFieldMouseDownInstance);
				
				if (this._textFieldIp4.hasEventListener("mousedown", this._onIpInputTextFieldMouseDownInstance) == false)
					this._textFieldIp4.addEventListener("mousedown", this._onIpInputTextFieldMouseDownInstance);
			}
			else
			{
				if (this.hasEventListener("keydown", this._onTextInputKeyUpDownInstance) == true)
					this.removeEventListener("keydown", this._onTextInputKeyUpDownInstance);
				
				if (this.hasEventListener("keyup", this._onTextInputKeyUpDownInstance) == true)
					this.removeEventListener("keyup", this._onTextInputKeyUpDownInstance);
				
				if (this._textFieldIp1.hasEventListener("changed", this._onTextInputTextFieldChangedInstance) == true)
					this._textFieldIp1.removeEventListener("changed", this._onTextInputTextFieldChangedInstance);
				
				if (this._textFieldIp2.hasEventListener("changed", this._onTextInputTextFieldChangedInstance) == true)
					this._textFieldIp2.removeEventListener("changed", this._onTextInputTextFieldChangedInstance);
				
				if (this._textFieldIp3.hasEventListener("changed", this._onTextInputTextFieldChangedInstance) == true)
					this._textFieldIp3.removeEventListener("changed", this._onTextInputTextFieldChangedInstance);
				
				if (this._textFieldIp4.hasEventListener("changed", this._onTextInputTextFieldChangedInstance) == true)
					this._textFieldIp4.removeEventListener("changed", this._onTextInputTextFieldChangedInstance);
				
				if (this._textFieldIp1.hasEventListener("mousedown", this._onIpInputTextFieldMouseDownInstance) == true)
					this._textFieldIp1.removeEventListener("mousedown", this._onIpInputTextFieldMouseDownInstance);
				
				if (this._textFieldIp2.hasEventListener("mousedown", this._onIpInputTextFieldMouseDownInstance) == true)
					this._textFieldIp2.removeEventListener("mousedown", this._onIpInputTextFieldMouseDownInstance);
				
				if (this._textFieldIp3.hasEventListener("mousedown", this._onIpInputTextFieldMouseDownInstance) == true)
					this._textFieldIp3.removeEventListener("mousedown", this._onIpInputTextFieldMouseDownInstance);
				
				if (this._textFieldIp4.hasEventListener("mousedown", this._onIpInputTextFieldMouseDownInstance) == true)
					this._textFieldIp4.removeEventListener("mousedown", this._onIpInputTextFieldMouseDownInstance);
			}
		}
		
		if ("TextLinePaddingTop" in stylesMap || 
			"TextLinePaddingBottom" in stylesMap)
		{
			this._invalidateMeasure();
		}
		
		if ("Padding" in stylesMap ||
			"PaddingTop" in stylesMap ||
			"PaddingBottom" in stylesMap ||
			"PaddingLeft" in stylesMap ||
			"PaddingRight" in stylesMap)
		{
			var paddingSize = this._getPaddingSize();
			
			this._textFieldIp1.setStyle("PaddingLeft", paddingSize.paddingLeft);
			this._textFieldIp1.setStyle("PaddingTop", paddingSize.paddingTop);
			this._textFieldIp1.setStyle("PaddingBottom", paddingSize.paddingBottom);
			
			this._textFieldIp2.setStyle("PaddingTop", paddingSize.paddingTop);
			this._textFieldIp2.setStyle("PaddingBottom", paddingSize.paddingBottom);
			
			this._textFieldIp3.setStyle("PaddingTop", paddingSize.paddingTop);
			this._textFieldIp3.setStyle("PaddingBottom", paddingSize.paddingBottom);
			
			this._textFieldIp4.setStyle("PaddingRight", paddingSize.paddingRight);
			this._textFieldIp4.setStyle("PaddingTop", paddingSize.paddingTop);
			this._textFieldIp4.setStyle("PaddingBottom", paddingSize.paddingBottom);
			
			this._labelFieldDot1.setStyle("PaddingTop", paddingSize.paddingTop);
			this._labelFieldDot1.setStyle("PaddingBottom", paddingSize.paddingBottom);
			
			this._labelFieldDot2.setStyle("PaddingTop", paddingSize.paddingTop);
			this._labelFieldDot2.setStyle("PaddingBottom", paddingSize.paddingBottom);
			
			this._labelFieldDot3.setStyle("PaddingTop", paddingSize.paddingTop);
			this._labelFieldDot3.setStyle("PaddingBottom", paddingSize.paddingBottom);
			
			this._invalidateMeasure();
		}
		
		this._updateSkinStyles(stylesMap);
	};
	
//@override
IpInputElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		var fontString = this._getFontString();
	
		var measuredHeight = this.getStyle("TextSize") + this.getStyle("TextLinePaddingTop") + this.getStyle("TextLinePaddingBottom");
		
		var measuredWidth = (CanvasElement._measureText("000", fontString) + 6) * 4;
		measuredWidth += this._labelFieldDot1._getStyledOrMeasuredWidth() * 3;
		
		measuredWidth += padWidth;
		measuredHeight += padHeight;
	
		this._setMeasuredSize(measuredWidth, measuredHeight);
	};
	
//@override	
IpInputElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		//IpInputElement.base.base - skip TextInputElement._doLayout()
		IpInputElement.base.base.prototype._doLayout.call(this, paddingMetrics);
		
		//Ignore padding, proxied to TextFields for proper mouse handling.		
		this._listContainer._setActualPosition(0, 0);
		this._listContainer._setActualSize(this._width, this._height);
	};
	
	