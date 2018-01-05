
/**
 * @depends SkinnableElement.js
 */

/////////////////////////////////////////////////////////
///////////////TextInputElement//////////////////////////	
	
/**
 * @class TextInputElement
 * @inherits SkinnableElement
 * 
 * TextInput is an edit-able single line text box.
 * 
 * 
 * @constructor TextInputElement 
 * Creates new TextInputElement instance.
 */
function TextInputElement()
{
	TextInputElement.base.prototype.constructor.call(this);
	
	this._textField = new TextFieldElement();
	this._textField.setStyle("Selectable", true);
	this._textField.setStyle("Cursor", null);
	this._textField.setStyle("TabStop", -1);
	this._addChild(this._textField);
	
	var _self = this;
	
	//Private event handlers, need different instance for each TextInput. Proxy to prototype.
	this._onTextInputFocusEventInstance = 
		function (event)
		{
			if (event.getType() == "focusin")
				_self._onTextInputFocusIn(event);
			else
				_self._onTextInputFocusOut(event);
		};
	
	this._onTextInputKeyDownInstance = 
		function (keyboardEvent)
		{
			_self._onTextInputKeyDown(keyboardEvent);
		};
		
	this._onTextInputTextFieldChangedInstance = 
		function (event)
		{
			_self._onTextInputTextFieldChanged(event);
		};
		
	this.addEventListener("focusin", this._onTextInputFocusEventInstance);
	this.addEventListener("focusout", this._onTextInputFocusEventInstance);	
}

//Inherit from SkinnableElement
TextInputElement.prototype = Object.create(SkinnableElement.prototype);
TextInputElement.prototype.constructor = TextInputElement;
TextInputElement.base = SkinnableElement;

/////////////Events////////////////////////////////////

/**
 * @event changed ElementEvent
 * Dispatched when the text is modified as a result of user input.
 */


/////////////Style Types///////////////////////////////

TextInputElement._StyleTypes = Object.create(null);

/**
 * @style MaxChars int
 * 
 * Maximum number of characters allowed.
 */
TextInputElement._StyleTypes.MaxChars = 								{inheritable:false};		// number

/**
 * @style SkinClass CanvasElement
 * 
 * The CanvasElement constructor type to apply to all skin states. 
 * Specific states such as UpSkinClass will override SkinClass.
 */
TextInputElement._StyleTypes.SkinClass =								{inheritable:false};		//Element constructor()

/**
 * @style UpSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the skin when in the "up" state. 
 * This will override SkinClass.
 */
TextInputElement._StyleTypes.UpSkinClass = 								{inheritable:false};		//Element constructor()

/**
 * @style UpSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "up" state skin element.
 */
TextInputElement._StyleTypes.UpSkinStyle = 								{inheritable:false};		//StyleDefinition

/**
 * @style UpTextColor String
 * 
 * Hex color value to be used for the button TextInput is in the "up" state. Format like "#FF0000" (red).
 * This will override the TextColor style.
 */
TextInputElement._StyleTypes.UpTextColor = 								{inheritable:false};		// color "#000000"

/**
 * @style UpTextHighlightedColor String
 * 
 * Hex color value to be used for highlighted text when the TextInput is in the "up" state. Format like "#FF0000" (red).
 * This will override the TextHighlightedColor style.
 */
TextInputElement._StyleTypes.UpTextHighlightedColor = 					{inheritable:false};		// color "#FFFFFF"

/**
 * @style UpTextHighlightedBackgroundColor String
 * 
 * Hex color value to be used for highlighted text background when the TextInput is in the "up" state. Format like "#FF0000" (red).
 * This will override the TextHighlightedBackgroundColor style.
 */
TextInputElement._StyleTypes.UpTextHighlightedBackgroundColor = 	{inheritable:false};			// color "#000000"

/**
 * @style DisabledSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the TextInput is in the "disabled" state.
 * When this is null, the base SkinClass style will be used.
 */
TextInputElement._StyleTypes.DisabledSkinClass = 						{inheritable:false};		// Element constructor()

/**
 * @style DisabledSkinStyle StyleDefinition
 * The StyleDefinition to apply to the "disabled" state skin element.
 * When this is null, the base SkinTyle will be used.
 */
TextInputElement._StyleTypes.DisabledSkinStyle = 						{inheritable:false};		// StyleDefinition

/**
 * @style DisabledTextColor String
 * 
 * Hex color value to be used for the button TextInput is in the "disabled" state. Format like "#FF0000" (red).
 * This will override the TextColor style.
 */
TextInputElement._StyleTypes.DisabledTextColor = 						{inheritable:false};		// color "#000000"

/**
 * @style DisabledTextHighlightedColor String
 * 
 * Hex color value to be used for highlighted text when the TextInput is in the "disabled" state. Format like "#FF0000" (red).
 * When this is null, the base TextHighlightedColor style will be used.
 */
TextInputElement._StyleTypes.DisabledTextHighlightedColor = 			{inheritable:false};		// color "#FFFFFF"

/**
 * @style DisabledTextHighlightedBackgroundColor String
 * 
 * Hex color value to be used for highlighted text background when the TextInput is in the "disabled" state. Format like "#FF0000" (red).
 * When this is null, the base TextHighlightedBackgroundColor style will be used.
 */
TextInputElement._StyleTypes.DisabledTextHighlightedBackgroundColor = 	{inheritable:false};		// color "#000000"


/////////////Default Styles///////////////////////////

TextInputElement.StyleDefault = new StyleDefinition();

TextInputElement.StyleDefault.setStyle("MaxChars", 									0);
TextInputElement.StyleDefault.setStyle("Enabled", 									true);

TextInputElement.StyleDefault.setStyle("UpTextColor", 								"#000000");
TextInputElement.StyleDefault.setStyle("UpTextHighlightedColor", 					"#FFFFFF");
TextInputElement.StyleDefault.setStyle("UpTextHighlightedBackgroundColor", 			"#000000");

TextInputElement.StyleDefault.setStyle("DisabledTextColor", 						"#888888");
TextInputElement.StyleDefault.setStyle("DisabledTextHighlightedColor", 				"#FFFFFF");
TextInputElement.StyleDefault.setStyle("DisabledTextHighlightedBackgroundColor", 	"#000000");

TextInputElement.StyleDefault.setStyle("PaddingTop",								3);
TextInputElement.StyleDefault.setStyle("PaddingBottom",								3);
TextInputElement.StyleDefault.setStyle("PaddingLeft",								3);
TextInputElement.StyleDefault.setStyle("PaddingRight",								3);

TextInputElement.StyleDefault.setStyle("TabStop", 									0);
TextInputElement.StyleDefault.setStyle("Cursor", 									"text");

TextInputElement.StyleDefault.setStyle("SkinClass", 								CanvasElement);
TextInputElement.StyleDefault.setStyle("UpSkinClass", 								CanvasElement);
TextInputElement.StyleDefault.setStyle("DisabledSkinClass", 						CanvasElement);

/////Skin styles//
TextInputElement.DisabledSkinStyleDefault = new StyleDefinition();

TextInputElement.DisabledSkinStyleDefault.setStyle("BorderType", 					"inset");
TextInputElement.DisabledSkinStyleDefault.setStyle("BorderThickness", 				1);
TextInputElement.DisabledSkinStyleDefault.setStyle("BorderColor", 					"#999999");
TextInputElement.DisabledSkinStyleDefault.setStyle("BackgroundColor", 				"#ECECEC");
TextInputElement.DisabledSkinStyleDefault.setStyle("AutoGradientType", 				"linear");
TextInputElement.DisabledSkinStyleDefault.setStyle("AutoGradientStart", 			(+.05));
TextInputElement.DisabledSkinStyleDefault.setStyle("AutoGradientStop", 				(-.05));

TextInputElement.UpSkinStyleDefault = new StyleDefinition();

TextInputElement.UpSkinStyleDefault.setStyle("BorderType", 							"inset");
TextInputElement.UpSkinStyleDefault.setStyle("BorderThickness", 					1);
TextInputElement.UpSkinStyleDefault.setStyle("BorderColor", 						"#606060");
TextInputElement.UpSkinStyleDefault.setStyle("BackgroundColor", 					"#F5F5F5");

//Apply skin defaults
TextInputElement.StyleDefault.setStyle("UpSkinStyle", 								TextInputElement.UpSkinStyleDefault);
TextInputElement.StyleDefault.setStyle("DisabledSkinStyle", 						TextInputElement.DisabledSkinStyleDefault);



////////Public///////////////////////

/**
 * @function setText
 * Sets the text to be displayed.
 * 
 * @param text String
 * Text to be displayed.
 */
TextInputElement.prototype.setText = 
	function (text)
	{
		this._textField.setText(text);
	};

/**
 * @function getText
 * Gets the text currently displayed.
 * 
 * @returns String
 * Text currently displayed.
 */	
TextInputElement.prototype.getText = 
	function ()
	{
		return this._textField.getText();
	};


////////Internal/////////////////////

/**
 * @function _onTextInputTextFieldChanged
 * Event handler for the internal TextField "changed" event. Only active when TextInput is Enabled.
 * Dispatches a "changed" event from this TextInput element.
 * 
 * @param elementEvent ElementEvent
 * ElementEvent to be processed.
 */	
TextInputElement.prototype._onTextInputTextFieldChanged = 
	function (elementEvent)
	{
		//Pass on the changed event
	
		if (this.hasEventListener("changed", null) == true)
			this._dispatchEvent(new ElementEvent("changed", false));
	};
	
/**
 * @function _onTextInputKeyDown
 * Event handler for "keydown" event. Only active when TextInput is enabled. 
 * Proxies keyboard event to internal TextField.
 * 
 * @param keyboardEvent ElementKeyboardEvent
 * ElementKeyboardEvent to process.
 */	
TextInputElement.prototype._onTextInputKeyDown = 
	function (keyboardEvent)
	{
		if (keyboardEvent.getDefaultPrevented() == true)
			return;
		
		var clonedEvent = keyboardEvent.clone();
		clonedEvent._bubbles = false; //Dont bubble.
		
		//Dispatch non-bubbling keyboard event to our text field.
		this._textField._dispatchEvent(clonedEvent);
		
		if (clonedEvent.getIsCanceled() == true)
			keyboardEvent.cancelEvent();
			
		if (clonedEvent.getDefaultPrevented() == true)
			keyboardEvent.preventDefault();
	};

/**
 * @function _onTextInputFocusIn
 * Event handler for "focusin" event. 
 * Proxies focus event to internal TextField.
 * 
 * @param elementEvent ElementEvent
 * ElementEvent to process.
 */		
TextInputElement.prototype._onTextInputFocusIn = 
	function (elementEvent)
	{
		//This only works because TextField doesnt look at _isFocused (manages caret state with different flag)
		this._textField._dispatchEvent(elementEvent.clone()); 
	};

/**
 * @function _onTextInputFocusOut
 * Event handler for "focusout" event. 
 * Proxies focus event to internal TextField.
 * 
 * @param elementEvent ElementEvent
 * ElementEvent to process.
 */		
TextInputElement.prototype._onTextInputFocusOut = 
	function (elementEvent)
	{
		//This only works because TextField doesnt look at _isFocused (manages caret state with different flag)
		this._textField._dispatchEvent(elementEvent.clone());
	};
	
//@Override
TextInputElement.prototype._getSkinClass = 
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
TextInputElement.prototype._getSkinStyleDefinitions = 
function (state)
{
	if (state == "up")
		return this.getStyle("UpSkinStyle");
	else if (state == "disabled")
		return this.getStyle("DisabledSkinStyle");
	
	return TextInputElement.base.prototype._getSkinStyleDefinitions.call(this, state);
};	

//@Override
TextInputElement.prototype._getSkinStyleDefinitionDefault =
	function (state)
	{
		if (state == "up")
			return this._getDefaultStyle("UpSkinStyle");
		else if (state == "disabled")
			return this._getDefaultStyle("DisabledSkinStyle");
		
		return TextInputElement.base.prototype._getSkinStyleDefinitionDefault.call(this, state);
	};		
	
/**
 * @function _updateState
 * Updates the current SkinState in response to style changes.
 */	
TextInputElement.prototype._updateState = 
	function ()
	{
		var newState = "up";

		if (this.getStyle("Enabled") == false)
			newState = "disabled";
		
		this.setStyle("SkinState", newState);
	};	
	
//@Override
TextInputElement.prototype._changeState = 
	function (state)
	{
		TextInputElement.base.prototype._changeState.call(this, state);
	
		this._updateTextColors();
	};
	
/**
 * @function _updateTextColors
 * Updates the text colors based on the current state. Called when state changes and when added to display hierarchy.
 */	
TextInputElement.prototype._updateTextColors = 
	function ()
	{
		this._textField.setStyle("TextColor", this._getTextColor(this._currentSkinState));
		this._textField.setStyle("TextHighlightedColor", this._getTextHighlightedColor(this._currentSkinState));
		this._textField.setStyle("TextHighlightedBackgroundColor", this._getTextHighlightedBackgroundColor(this._currentSkinState));
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
TextInputElement.prototype._getTextColor = 
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
TextInputElement.prototype._getTextHighlightedColor = 
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
TextInputElement.prototype._getTextHighlightedBackgroundColor = 
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
	
//@Override
TextInputElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		TextInputElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("MaxChars" in stylesMap)
			this._textField.setStyle("MaxChars", this.getStyle("MaxChars"));
		
		if ("Enabled" in stylesMap)
		{
			var enabled = this.getStyle("Enabled");
			this._textField.setStyle("Enabled", enabled);
			
			if (enabled == true)
			{
				if (this.hasEventListener("keydown", this._onTextInputKeyDownInstance) == false)
					this.addEventListener("keydown", this._onTextInputKeyDownInstance);
				
				if (this._textField.hasEventListener("changed", this._onTextInputTextFieldChangedInstance) == false)
					this._textField.addEventListener("changed", this._onTextInputTextFieldChangedInstance);					
			}
			else
			{
				if (this.hasEventListener("keydown", this._onTextInputKeyDownInstance) == true)
					this.removeEventListener("keydown", this._onTextInputKeyDownInstance);
				
				if (this._textField.hasEventListener("changed", this._onTextInputTextFieldChangedInstance) == true)
					this._textField.removeEventListener("changed", this._onTextInputTextFieldChangedInstance);
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
			
			this._textField.setStyle("PaddingTop", paddingSize.paddingTop);
			this._textField.setStyle("PaddingBottom", paddingSize.paddingBottom);
			this._textField.setStyle("PaddingLeft", paddingSize.paddingLeft);
			this._textField.setStyle("PaddingRight", paddingSize.paddingRight);
			
			this._invalidateMeasure();
		}
		
		this._updateSkinClass("up");
		this._updateSkinStyleDefinitions("up");
		
		this._updateSkinClass("disabled");
		this._updateSkinStyleDefinitions("disabled");
		
		this._updateState();
		this._updateTextColors();
	};
	
//@Override
TextInputElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		var measuredSize = {width:0, height:this.getStyle("TextSize") + this.getStyle("TextLinePaddingTop") + this.getStyle("TextLinePaddingBottom")};
		measuredSize.width = measuredSize.height * 10;
		
		measuredSize.width += padWidth;
		measuredSize.height += padHeight;
	
		return measuredSize;
	};
	
//@Override	
TextInputElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		TextInputElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		//Ignore padding, proxied to TextField for proper mouse handling.		
		this._textField._setActualPosition(0, 0);
		this._textField._setActualSize(this._width, this._height);
	};
	
	