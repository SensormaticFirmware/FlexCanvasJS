
/**
 * @depends SkinnableElement.js
 */

/////////////////////////////////////////////////////////
///////////////IpInputElement////////////////////////////
	
/**
 * @class IpInputElement
 * @inherits SkinnableElement
 * 
 * IpInputElement is an edit-able IPv4 address field.
 * 
 * @constructor IpInputElement 
 * Creates new IpInputElement instance.
 */
function IpInputElement()
{
	IpInputElement.base.prototype.constructor.call(this);
	
		//Use list container to layout text fields
		this._listContainer = new ListContainerElement();
		this._listContainer.setStyle("LayoutDirection", "horizontal");
		
			this._textFieldIp1 = new TextFieldElement();
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
	
	var _self = this;
	
	//Private event handlers, need different instance for each TextInput. Proxy to prototype.
	this._onIpInputFocusEventInstance = 
		function (event)
		{
			if (event.getType() == "focusin")
				_self._onIpInputFocusIn(event);
			else
				_self._onIpInputFocusOut(event);
		};
	
	this._onIpInputKeyUpDownInstance = 
		function (keyboardEvent)
		{
			if (keyboardEvent.getType() == "keydown")
				_self._onIpInputKeyDown(keyboardEvent);
			else // if (keyboardEvent.getType() == "keyup")
				_self._onIpInputKeyUp(keyboardEvent);
		};
		
	this._onIpInputTextFieldChangedInstance = 
		function (event)
		{
			_self._onIpInputTextFieldChanged(event);
		};
		
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
		
	this.addEventListener("focusin", this._onIpInputFocusEventInstance);
	this.addEventListener("focusout", this._onIpInputFocusEventInstance);	
	
	this._textFieldIp1.addEventListener("focusout", this._onIpInputTextFieldFocusOutInstance);
	this._textFieldIp2.addEventListener("focusout", this._onIpInputTextFieldFocusOutInstance);
	this._textFieldIp3.addEventListener("focusout", this._onIpInputTextFieldFocusOutInstance);
	this._textFieldIp4.addEventListener("focusout", this._onIpInputTextFieldFocusOutInstance);
	
	/////
	
	//Currently focused IP field
	this._textFieldFocused = null;
}

//Inherit from SkinnableElement
IpInputElement.prototype = Object.create(SkinnableElement.prototype);
IpInputElement.prototype.constructor = IpInputElement;
IpInputElement.base = SkinnableElement;

/////////////Events////////////////////////////////////

/**
 * @event changed ElementEvent
 * Dispatched when the text is modified as a result of user input.
 */


/////////////Style Types///////////////////////////////

IpInputElement._StyleTypes = Object.create(null);

/**
 * @style SkinClass CanvasElement
 * 
 * The CanvasElement constructor type to apply to all skin states. 
 * Specific states such as UpSkinClass will override SkinClass.
 */
IpInputElement._StyleTypes.SkinClass =									StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style UpSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the skin when in the "up" state. 
 * This will override SkinClass.
 */
IpInputElement._StyleTypes.UpSkinClass = 								StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style UpSkinStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to the "up" state skin element.
 */
IpInputElement._StyleTypes.UpSkinStyle = 								StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

/**
 * @style UpTextColor String
 * 
 * Hex color value to be used for the button TextInput is in the "up" state. Format like "#FF0000" (red).
 * This will override the TextColor style.
 */
IpInputElement._StyleTypes.UpTextColor = 								StyleableBase.EStyleType.NORMAL;		// color "#000000"

/**
 * @style UpTextHighlightedColor String
 * 
 * Hex color value to be used for highlighted text when the TextInput is in the "up" state. Format like "#FF0000" (red).
 * This will override the TextHighlightedColor style.
 */
IpInputElement._StyleTypes.UpTextHighlightedColor = 					StyleableBase.EStyleType.NORMAL;		// color "#FFFFFF"

/**
 * @style UpTextHighlightedBackgroundColor String
 * 
 * Hex color value to be used for highlighted text background when the TextInput is in the "up" state. Format like "#FF0000" (red).
 * This will override the TextHighlightedBackgroundColor style.
 */
IpInputElement._StyleTypes.UpTextHighlightedBackgroundColor = 			StyleableBase.EStyleType.NORMAL;			// color "#000000"

/**
 * @style DisabledSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the TextInput is in the "disabled" state.
 * When this is null, the base SkinClass style will be used.
 */
IpInputElement._StyleTypes.DisabledSkinClass = 							StyleableBase.EStyleType.NORMAL;		// Element constructor()

/**
 * @style DisabledSkinStyle StyleDefinition
 * The StyleDefinition or [StyleDefinition] array to apply to the "disabled" state skin element.
 * When this is null, the base SkinTyle will be used.
 */
IpInputElement._StyleTypes.DisabledSkinStyle = 							StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition

/**
 * @style DisabledTextColor String
 * 
 * Hex color value to be used for the button TextInput is in the "disabled" state. Format like "#FF0000" (red).
 * This will override the TextColor style.
 */
IpInputElement._StyleTypes.DisabledTextColor = 							StyleableBase.EStyleType.NORMAL;		// color "#000000"

/**
 * @style DisabledTextHighlightedColor String
 * 
 * Hex color value to be used for highlighted text when the TextInput is in the "disabled" state. Format like "#FF0000" (red).
 * When this is null, the base TextHighlightedColor style will be used.
 */
IpInputElement._StyleTypes.DisabledTextHighlightedColor = 				StyleableBase.EStyleType.NORMAL;		// color "#FFFFFF"

/**
 * @style DisabledTextHighlightedBackgroundColor String
 * 
 * Hex color value to be used for highlighted text background when the TextInput is in the "disabled" state. Format like "#FF0000" (red).
 * When this is null, the base TextHighlightedBackgroundColor style will be used.
 */
IpInputElement._StyleTypes.DisabledTextHighlightedBackgroundColor = 	StyleableBase.EStyleType.NORMAL;		// color "#000000"



/////////////Default Styles///////////////////////////

IpInputElement.StyleDefault = new StyleDefinition();

IpInputElement.StyleDefault.setStyle("TextHorizontalAlign", 						"center");
IpInputElement.StyleDefault.setStyle("TextVerticalAlign", 							"middle");

IpInputElement.StyleDefault.setStyle("Enabled", 									true);

IpInputElement.StyleDefault.setStyle("UpTextColor", 								"#000000");
IpInputElement.StyleDefault.setStyle("DisabledTextColor", 							"#888888");

IpInputElement.StyleDefault.setStyle("PaddingTop",									3);
IpInputElement.StyleDefault.setStyle("PaddingBottom",								3);
IpInputElement.StyleDefault.setStyle("PaddingLeft",									5);
IpInputElement.StyleDefault.setStyle("PaddingRight",								5);

IpInputElement.StyleDefault.setStyle("TabStop", 									0);

IpInputElement.StyleDefault.setStyle("SkinClass", 									CanvasElement);
IpInputElement.StyleDefault.setStyle("UpSkinClass", 								CanvasElement);
IpInputElement.StyleDefault.setStyle("DisabledSkinClass", 							CanvasElement);

/////Skin styles//
IpInputElement.DisabledSkinStyleDefault = new StyleDefinition();

IpInputElement.DisabledSkinStyleDefault.setStyle("BorderType", 						"inset");
IpInputElement.DisabledSkinStyleDefault.setStyle("BorderThickness", 				1);
IpInputElement.DisabledSkinStyleDefault.setStyle("BorderColor", 					"#999999");
IpInputElement.DisabledSkinStyleDefault.setStyle("BackgroundFill", 					"#ECECEC");

IpInputElement.UpSkinStyleDefault = new StyleDefinition();

IpInputElement.UpSkinStyleDefault.setStyle("BorderType", 							"inset");
IpInputElement.UpSkinStyleDefault.setStyle("BorderThickness", 						1);
IpInputElement.UpSkinStyleDefault.setStyle("BorderColor", 							"#606060");

IpInputElement.UpSkinStyleDefault.setStyle("BackgroundFill", 						"#F5F5F5");

//Apply skin defaults
IpInputElement.StyleDefault.setStyle("UpSkinStyle", 								IpInputElement.UpSkinStyleDefault);
IpInputElement.StyleDefault.setStyle("DisabledSkinStyle", 							IpInputElement.DisabledSkinStyleDefault);



////////Public///////////////////////

/**
 * @function setIp
 * Sets the IP to be displayed.
 * Formatted as IPv4 address: "192.168.1.1"
 * 
 * @param ip String
 * IP to be displayed.
 */
IpInputElement.prototype.setIp = 
	function (ip)
	{
		this._textFieldIp1.setText("");
		this._textFieldIp2.setText("");
		this._textFieldIp3.setText("");
		this._textFieldIp4.setText("");
	
		if (ip == null || ip.length == 0)
			return;
		
		var i;
		var i2;
		var n;
		var ipArray = ip.split(".");
		
		for (i = 0; i < ipArray.length; i++)
		{
			if (i == 4)
				return;
			
			if (ipArray[i].length == 0)
				continue;
			
			n = Number(ipArray[i]);
			if (isNaN(n) == true)
				continue;
			
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
 * @function getIp
 * Gets the IP currently displayed. 
 * When all fields are empty an empty string "" will be returned.
 * When some but not all fields are empty null will be returned (invalid IP).
 * 
 * @returns String
 * IP currently displayed.
 */	
IpInputElement.prototype.getIp = 
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

/**
 * @function _onIpInputTextFieldChanged
 * Event handler for the internal TextField "changed" event. Only active when TextInput is Enabled.
 * Dispatches a "changed" event from this TextInput element.
 * 
 * @param elementEvent ElementEvent
 * ElementEvent to be processed.
 */	
IpInputElement.prototype._onIpInputTextFieldChanged = 
	function (elementEvent)
	{
		//Pass on the changed event
	
		if (this.hasEventListener("changed", null) == true)
			this.dispatchEvent(new ElementEvent("changed", false));
	};
	
/**
 * @function _onIpInputKeyDown
 * Event handler for "keydown" event. Only active when IpInput is enabled. 
 * Proxies keyboard event to internal TextFields.
 * 
 * @param keyboardEvent ElementKeyboardEvent
 * ElementKeyboardEvent to process.
 */	
IpInputElement.prototype._onIpInputKeyDown = 
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

/**
 * @function _onIpInputKeyUp
 * Event handler for "keyup" event. Only active when IpInput is enabled. 
 * Proxies keyboard event to internal TextField.
 * 
 * @param keyboardEvent ElementKeyboardEvent
 * ElementKeyboardEvent to process.
 */	
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
	
/**
 * @function _onIpInputFocusIn
 * Event handler for "focusin" event. 
 * Proxies focus event to internal TextFields.
 * 
 * @param elementEvent ElementEvent
 * ElementEvent to process.
 */		
IpInputElement.prototype._onIpInputFocusIn = 
	function (elementEvent)
	{
		//Mouse down already focused
		if (this._textFieldFocused != null)
			return;
	
		//This only works because TextField doesnt look at _isFocused (manages caret state with different flag)
		this._textFieldIp1.dispatchEvent(elementEvent.clone()); 
		this._textFieldFocused = this._textFieldIp1;
	};

/**
 * @function _onIpInputFocusOut
 * Event handler for "focusout" event. 
 * Proxies focus event to internal TextFields.
 * 
 * @param elementEvent ElementEvent
 * ElementEvent to process.
 */		
IpInputElement.prototype._onIpInputFocusOut = 
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
IpInputElement.prototype._getSkinClass = 
	function (state)
	{
		var stateSkinClass = null;
		
		if (state == "up")
			stateSkinClass = this.getStyleData("UpSkinClass");
		else if (state == "disabled")
			stateSkinClass = this.getStyleData("DisabledSkinClass");
		
		var skinClass = this.getStyleData("SkinClass");
		
		//Shouldnt have null stateSkinClass
		if (stateSkinClass == null || skinClass.comparePriority(stateSkinClass) > 0) //Use skinClass if higher priority
			return skinClass.value;
		
		return stateSkinClass.value;
	};
	
//@override	
IpInputElement.prototype._getSubStyleNameForSkinState = 
	function (state)
	{
		if (state == "up")
			return "UpSkinStyle";
		if (state == "disabled")
			return "DisabledSkinStyle";
		
		return IpInputElement.base.prototype._getSubStyleNameForSkinState.call(this, state);
	};			
	
/**
 * @function _updateState
 * Updates the current SkinState in response to style changes.
 */	
IpInputElement.prototype._updateState = 
	function ()
	{
		var newState = "up";

		if (this.getStyle("Enabled") == false)
			newState = "disabled";
		
		this.setStyle("SkinState", newState);
	};	
	
//@override
IpInputElement.prototype._changeState = 
	function (state)
	{
		IpInputElement.base.prototype._changeState.call(this, state);
	
		this._updateTextColors();
	};
	
/**
 * @function _updateTextColors
 * Updates the text colors based on the current state. Called when state changes and when added to display hierarchy.
 */	
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
	
/**
 * @function _getTextColor
 * Gets the text color for the supplied state based on text styles.
 * 
 * @param state String
 * The skin state to return the text color.
 * 
 * @returns String
 * Hex color value.
 */	
IpInputElement.prototype._getTextColor = 
	function (state)
	{
		var stateTextColor = null;
		
		if (state == "up")
			stateTextColor = this.getStyleData("UpTextColor");
		else if (state == "disabled")
			stateTextColor = this.getStyleData("DisabledTextColor");
	
		var textColor = this.getStyleData("TextColor");
		
		//Shouldnt have null stateTextColor
		if (stateTextColor == null || textColor.comparePriority(stateTextColor) > 0) //Use textColor if higher priority
			return textColor.value;
		
		return stateTextColor.value;
	};
	
/**
 * @function _getTextHighlightedColor
 * Gets the highlighted text color for the supplied state based on text styles.
 * 
 * @param state String
 * The skin state to return the highlighted text color.
 * 
 * @returns String
 * Hex color value.
 */		
IpInputElement.prototype._getTextHighlightedColor = 
	function (state)
	{
		var stateTextColor = null;
		
		if (state == "up")
			stateTextColor = this.getStyleData("UpTextHighlightedColor");
		else if (state == "disabled")
			stateTextColor = this.getStyleData("DisabledTextHighlightedColor");
	
		var textColor = this.getStyleData("TextHighlightedColor");
		
		//Shouldnt have null stateTextColor
		if (stateTextColor == null || textColor.comparePriority(stateTextColor) > 0) //Use textColor if higher priority
			return textColor.value;
		
		return stateTextColor.value;
	};
	
/**
 * @function _getTextHighlightedBackgroundColor
 * Gets the highlighted text background color for the supplied state based on text styles.
 * 
 * @param state String
 * The skin state to return the highlighted text background color.
 * 
 * @returns String
 * Hex color value.
 */		
IpInputElement.prototype._getTextHighlightedBackgroundColor = 
	function (state)
	{
		var stateTextColor = null;
		
		if (state == "up")
			stateTextColor = this.getStyleData("UpTextHighlightedBackgroundColor");
		else if (state == "disabled")
			stateTextColor = this.getStyleData("DisabledTextHighlightedBackgroundColor");
	
		var textColor = this.getStyleData("TextHighlightedBackgroundColor");
		
		//Shouldnt have null stateTextColor
		if (stateTextColor == null || textColor.comparePriority(stateTextColor) > 0) //Use textColor if higher priority
			return textColor.value;
		
		return stateTextColor.value;
	};
	
//@override
IpInputElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		IpInputElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
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
				if (this.hasEventListener("keydown", this._onIpInputKeyUpDownInstance) == false)
					this.addEventListener("keydown", this._onIpInputKeyUpDownInstance);
				
				if (this.hasEventListener("keyup", this._onIpInputKeyUpDownInstance) == false)
					this.addEventListener("keyup", this._onIpInputKeyUpDownInstance);
				
				if (this._textFieldIp1.hasEventListener("changed", this._onIpInputTextFieldChangedInstance) == false)
					this._textFieldIp1.addEventListener("changed", this._onIpInputTextFieldChangedInstance);		
				
				if (this._textFieldIp2.hasEventListener("changed", this._onIpInputTextFieldChangedInstance) == false)
					this._textFieldIp2.addEventListener("changed", this._onIpInputTextFieldChangedInstance);	
				
				if (this._textFieldIp3.hasEventListener("changed", this._onIpInputTextFieldChangedInstance) == false)
					this._textFieldIp3.addEventListener("changed", this._onIpInputTextFieldChangedInstance);	
				
				if (this._textFieldIp4.hasEventListener("changed", this._onIpInputTextFieldChangedInstance) == false)
					this._textFieldIp4.addEventListener("changed", this._onIpInputTextFieldChangedInstance);	
				
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
				if (this.hasEventListener("keydown", this._onIpInputKeyUpDownInstance) == true)
					this.removeEventListener("keydown", this._onIpInputKeyUpDownInstance);
				
				if (this.hasEventListener("keyup", this._onIpInputKeyUpDownInstance) == true)
					this.removeEventListener("keyup", this._onIpInputKeyUpDownInstance);
				
				if (this._textFieldIp1.hasEventListener("changed", this._onIpInputTextFieldChangedInstance) == true)
					this._textFieldIp1.removeEventListener("changed", this._onIpInputTextFieldChangedInstance);
				
				if (this._textFieldIp2.hasEventListener("changed", this._onIpInputTextFieldChangedInstance) == true)
					this._textFieldIp2.removeEventListener("changed", this._onIpInputTextFieldChangedInstance);
				
				if (this._textFieldIp3.hasEventListener("changed", this._onIpInputTextFieldChangedInstance) == true)
					this._textFieldIp3.removeEventListener("changed", this._onIpInputTextFieldChangedInstance);
				
				if (this._textFieldIp4.hasEventListener("changed", this._onIpInputTextFieldChangedInstance) == true)
					this._textFieldIp4.removeEventListener("changed", this._onIpInputTextFieldChangedInstance);
				
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
		
		////Update skin classes and sub styles.
		if ("SkinClass" in stylesMap || "UpSkinClass" in stylesMap)
			this._updateSkinClass("up");
		if ("UpSkinStyle" in stylesMap)
			this._updateSkinStyleDefinitions("up");
		
		if ("SkinClass" in stylesMap || "DisabledSkinClass" in stylesMap)
			this._updateSkinClass("disabled");
		if ("DisabledSkinStyle" in stylesMap)
			this._updateSkinStyleDefinitions("disabled");

		this._updateState();
		this._updateTextColors();
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
		IpInputElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		//Ignore padding, proxied to TextFields for proper mouse handling.		
		this._listContainer._setActualPosition(0, 0);
		this._listContainer._setActualSize(this._width, this._height);
	};
	
	