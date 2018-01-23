
/**
 * @depends SkinnableElement.js
 */

/////////////////////////////////////////////////
//////////////////ButtonElement//////////////////

/**
 * @class ButtonElement
 * @inherits SkinnableElement
 * 
 * Button is a skin-able element that supports 4 states corresponding to mouse states
 * "up", "over", "down" and "disabled". It also has an optional label. 
 * 
 * Being a SkinnableElement, Button proxies its styles to its skins. 
 * You may assign custom skins and assign any styles you wish to apply to all skins to the Button itself. 
 * 
 * Button is used as a base class for many click-able elements such as
 * ToggleButton, Checkbox, RadioButton, etc. 
 * 
 * 
 * @constructor ButtonElement 
 * Creates new ButtonElement instance.
 */
function ButtonElement()
{
	ButtonElement.base.prototype.constructor.call(this);

	var _self = this;
	
	this._labelElement = null;
	
	//Private handler, need different instance for each button, proxy to prototype.	
	this._onButtonEventInstance = 
		function (elementEvent)
		{
			if (elementEvent.getType() == "mousedown")
				_self._onButtonMouseDown(elementEvent);
			else if (elementEvent.getType() == "mouseup")
				_self._onButtonMouseUp(elementEvent);
			else if (elementEvent.getType() == "click")
				_self._onButtonClick(elementEvent);
			else if (elementEvent.getType() == "rollover")
				_self._onButtonRollover(elementEvent);
			else if (elementEvent.getType() == "rollout")
				_self._onButtonRollout(elementEvent);
		};
		
	this.addEventListener("mousedown", this._onButtonEventInstance);
	this.addEventListener("mouseup", this._onButtonEventInstance);
	this.addEventListener("rollover", this._onButtonEventInstance);
	this.addEventListener("rollout", this._onButtonEventInstance);
	this.addEventListener("click", this._onButtonEventInstance);
}

//Inherit from SkinnableElement
ButtonElement.prototype = Object.create(SkinnableElement.prototype);
ButtonElement.prototype.constructor = ButtonElement;
ButtonElement.base = SkinnableElement;


/////////////Style Types///////////////////////////////

ButtonElement._StyleTypes = Object.create(null);

//New button specific styles.

/**
 * @style Text String
 * 
 * Text string to be displayed as the button label.
 */
ButtonElement._StyleTypes.Text = 						{inheritable:false};		// "any string" || null

/**
 * @style SkinClass CanvasElement
 * 
 * The CanvasElement constructor type to apply to all skin states. 
 * Specific states such as UpSkinClass will override SkinClass when they are equal priority.
 */
ButtonElement._StyleTypes.SkinClass =					{inheritable:false};	//Element constructor()

/**
 * @style UpSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the button skin when the button is in the "up" state. 
 * This will override SkinClass when equal or higher priority than SkinClass.
 */
ButtonElement._StyleTypes.UpSkinClass = 				{inheritable:false};		//Element constructor()

/**
 * @style UpSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "up" state skin element.
 */
ButtonElement._StyleTypes.UpSkinStyle = 				{inheritable:false};		//StyleDefinition

/**
 * @style UpTextColor String
 * 
 * Hex color value to be used for the button label when the button is in the "up" state. Format like "#FF0000" (red).
 * This will override TextColor when equal or higher priority than TextColor.
 */
ButtonElement._StyleTypes.UpTextColor = 				{inheritable:false};		//"#000000"

/**
 * @style OverSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the button skin when the button is in the "over" state. 
 * This will override SkinClass when equal or higher priority than SkinClass.
 */
ButtonElement._StyleTypes.OverSkinClass = 				{inheritable:false};		//Element constructor()

/**
 * @style OverSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "over" state skin element.
 */
ButtonElement._StyleTypes.OverSkinStyle = 				{inheritable:false};		//StyleDefinition

/**
 * @style OverTextColor String
 * 
 * Hex color value to be used for the button label when the button is in the "over" state. Format like "#FF0000" (red).
 * This will override TextColor when equal or higher priority than TextColor.
 */
ButtonElement._StyleTypes.OverTextColor = 				{inheritable:false};		//"#000000"

/**
 * @style DownSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the button skin when the button is in the "down" state. 
 * This will override SkinClass when equal or higher priority than SkinClass.
 */
ButtonElement._StyleTypes.DownSkinClass = 				{inheritable:false};		//Element constructor()

/**
 * @style DownSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "down" state skin element.
 */
ButtonElement._StyleTypes.DownSkinStyle = 				{inheritable:false};		//StyleDefinition

/**
 * @style DownTextColor String
 * 
 * Hex color value to be used for the button label when the button is in the "down" state. Format like "#FF0000" (red).
 * This will override TextColor when equal or higher priority than TextColor.
 */
ButtonElement._StyleTypes.DownTextColor = 				{inheritable:false};		//"#000000"

/**
 * @style DisabledSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the button skin when the button is in the "disabled" state. 
 * This will override SkinClass when equal or higher priority than SkinClass.
 */
ButtonElement._StyleTypes.DisabledSkinClass = 			{inheritable:false};		//Element constructor()

/**
 * @style DisabledSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "disabled" state skin element.
 */
ButtonElement._StyleTypes.DisabledSkinStyle = 			{inheritable:false};		//StyleDefinition

/**
 * @style DisabledTextColor String
 * 
 * Hex color value to be used for the button label when the button is in the "disabled" state. Format like "#FF0000" (red).
 * This will override TextColor when equal or higher priority than TextColor.
 */
ButtonElement._StyleTypes.DisabledTextColor = 			{inheritable:false};		//"#000000"


//Change some of the text styles not to inherit, we'll set these to the label 
//so the label will use button defaults if no style explicitly set.

/**
 * @style TextHorizontalAlign String
 * 
 * Determines alignment when rendering text. Available values are "left", "center", and "right".
 */
ButtonElement._StyleTypes.TextHorizontalAlign =					{inheritable:false};		// "left" || "center" || "right"

/**
 * @style TextVerticalAlign String
 * 
 * Determines the baseline when rendering text. Available values are "top", "middle", or "bottom".
 */
ButtonElement._StyleTypes.TextVerticalAlign =				{inheritable:false};  		// "top" || "middle" || "bottom"


/////////Default Styles//////////////////////////////

ButtonElement.StyleDefault = new StyleDefinition();

//Override base class styles
ButtonElement.StyleDefault.setStyle("PaddingTop",						3);
ButtonElement.StyleDefault.setStyle("PaddingBottom",                    3);
ButtonElement.StyleDefault.setStyle("PaddingLeft",                      4);
ButtonElement.StyleDefault.setStyle("PaddingRight",                     4);

ButtonElement.StyleDefault.setStyle("TextHorizontalAlign", 				"center"); 
ButtonElement.StyleDefault.setStyle("TextVerticalAlign", 				"middle");

ButtonElement.StyleDefault.setStyle("TabStop", 							0);			// number

//ButtonElement specific styles.
ButtonElement.StyleDefault.setStyle("Text", 							null);
ButtonElement.StyleDefault.setStyle("SkinClass", 						CanvasElement); //Not necessary, just for completeness

ButtonElement.StyleDefault.setStyle("UpSkinClass", 						CanvasElement);
ButtonElement.StyleDefault.setStyle("OverSkinClass", 					CanvasElement);
ButtonElement.StyleDefault.setStyle("DownSkinClass", 					CanvasElement);
ButtonElement.StyleDefault.setStyle("DisabledSkinClass", 				CanvasElement);

ButtonElement.StyleDefault.setStyle("UpTextColor", 						"#000000");
ButtonElement.StyleDefault.setStyle("OverTextColor", 					"#000000");
ButtonElement.StyleDefault.setStyle("DownTextColor", 					"#000000");
ButtonElement.StyleDefault.setStyle("DisabledTextColor", 				"#888888");

//Skin Defaults////////////////////////////
ButtonElement.UpSkinStyleDefault = new StyleDefinition();

ButtonElement.UpSkinStyleDefault.setStyle("BorderType", 				"solid");
ButtonElement.UpSkinStyleDefault.setStyle("BorderThickness", 			1);
ButtonElement.UpSkinStyleDefault.setStyle("BorderColor", 				"#333333");
ButtonElement.UpSkinStyleDefault.setStyle("BackgroundColor", 			"#EBEBEB");
ButtonElement.UpSkinStyleDefault.setStyle("AutoGradientType", 			"linear");
ButtonElement.UpSkinStyleDefault.setStyle("AutoGradientStart", 			(+.05));
ButtonElement.UpSkinStyleDefault.setStyle("AutoGradientStop", 			(-.05));

ButtonElement.OverSkinStyleDefault = new StyleDefinition();

ButtonElement.OverSkinStyleDefault.setStyle("BorderType", 				"solid");
ButtonElement.OverSkinStyleDefault.setStyle("BorderThickness", 			1);
ButtonElement.OverSkinStyleDefault.setStyle("BorderColor", 				"#333333");
ButtonElement.OverSkinStyleDefault.setStyle("BackgroundColor", 			"#DDDDDD");
ButtonElement.OverSkinStyleDefault.setStyle("AutoGradientType", 		"linear");
ButtonElement.OverSkinStyleDefault.setStyle("AutoGradientStart", 		(+.05));
ButtonElement.OverSkinStyleDefault.setStyle("AutoGradientStop", 		(-.05));

ButtonElement.DownSkinStyleDefault = new StyleDefinition();

ButtonElement.DownSkinStyleDefault.setStyle("BorderType", 				"solid");
ButtonElement.DownSkinStyleDefault.setStyle("BorderThickness", 			1);
ButtonElement.DownSkinStyleDefault.setStyle("BorderColor", 				"#333333");
ButtonElement.DownSkinStyleDefault.setStyle("BackgroundColor", 			"#CCCCCC");
ButtonElement.DownSkinStyleDefault.setStyle("AutoGradientType", 		"linear");
ButtonElement.DownSkinStyleDefault.setStyle("AutoGradientStart", 		(-.06));
ButtonElement.DownSkinStyleDefault.setStyle("AutoGradientStop", 		(+.02));

ButtonElement.DisabledSkinStyleDefault = new StyleDefinition();

ButtonElement.DisabledSkinStyleDefault.setStyle("BorderType", 			"solid");
ButtonElement.DisabledSkinStyleDefault.setStyle("BorderThickness", 		1);
ButtonElement.DisabledSkinStyleDefault.setStyle("BorderColor", 			"#999999");
ButtonElement.DisabledSkinStyleDefault.setStyle("BackgroundColor", 		"#ECECEC");
ButtonElement.DisabledSkinStyleDefault.setStyle("AutoGradientType", 	"linear");
ButtonElement.DisabledSkinStyleDefault.setStyle("AutoGradientStart", 	(+.05));
ButtonElement.DisabledSkinStyleDefault.setStyle("AutoGradientStop", 	(-.05));
//Not used by button, used by scrollbutton, but want button, scrollbutton to use the same style.
ButtonElement.DisabledSkinStyleDefault.setStyle("ArrowColor", 			"#777777");
/////////////////////////////////////////////////

//Apply Skin Defaults
ButtonElement.StyleDefault.setStyle("UpSkinStyle", 						ButtonElement.UpSkinStyleDefault);
ButtonElement.StyleDefault.setStyle("OverSkinStyle", 					ButtonElement.OverSkinStyleDefault);
ButtonElement.StyleDefault.setStyle("DownSkinStyle", 					ButtonElement.DownSkinStyleDefault);
ButtonElement.StyleDefault.setStyle("DisabledSkinStyle", 				ButtonElement.DisabledSkinStyleDefault);


	
/////////////ButtonElement Protected Functions/////////////////////	
	
/**
 * @function _updateState
 * Called in response to mouse events, and when the Button is added to the display hierarchy (if mouse is enabled).
 * Updates the Button skin state.
 */
ButtonElement.prototype._updateState = 
	function ()
	{
		var newState = "up";
	
		if (this.getStyle("Enabled") == false)
			newState = "disabled";
		else
		{
			if (this._mouseIsDown == true)
				newState = "down";
			else if (this._mouseIsOver == true)
				newState = "over";
		}
		
		this.setStyle("SkinState", newState);
	};

/**
 * @function _onButtonMouseDown
 * Event handler for "mousedown" event. Updates the Button skin state.
 * Overriding this is more efficient than adding an additional "mousedown" event listener.
 * 
 * @param elementMouseEvent ElementMouseEvent
 * The ElementMouseEvent to process.
 */	
ButtonElement.prototype._onButtonMouseDown = 
	function (elementMouseEvent)
	{
		this._updateState();
	};
	
/**
 * @function _onButtonMouseUp
 * Event handler for "mouseup" event. Updates the Button skin state.
 * Overriding this is more efficient than adding an additional "mouseup" event listener.
 * 
 * @param elementMouseEvent ElementMouseEvent
 * The ElementMouseEvent to process.
 */		
ButtonElement.prototype._onButtonMouseUp = 
	function (elementMouseEvent)
	{
		this._updateState();
	};		

/**
 * @function _onButtonRollover
 * Event handler for "rollover" event. Updates the Button skin state.
 * Overriding this is more efficient than adding an additional "rollover" event listener.
 * 
 * @param elementEvent ElementEvent
 * The ElementEvent to process.
 */		
ButtonElement.prototype._onButtonRollover = 
	function (elementEvent)
	{
		this._updateState();
	};

/**
 * @function _onButtonRollout
 * Event handler for "rollout" event. Updates the Button skin state.
 * Overriding this is more efficient than adding an additional "rollout" event listener.
 * 
 * @param elementEvent ElementEvent
 * The ElementEvent to process.
 */		
ButtonElement.prototype._onButtonRollout = 
	function (elementEvent)
	{
		this._updateState();
	};	
	
/**
 * @function _onButtonClick
 * Event handler for "click" event. Cancels the event if the Button is disabled.
 * Overriding this is more efficient than adding an additional "click" event listener.
 * 
 * @param elementMouseEvent ElementMouseEvent
 * The ElementMouseEvent to process.
 */			
ButtonElement.prototype._onButtonClick = 
	function (elementMouseEvent)
	{
		//Implementor will not expect a click event when button is disabled. 
		if (this.getStyle("Enabled") == false)
			elementMouseEvent.cancelEvent();
	};
	
//@override
ButtonElement.prototype._getSkinClass = 
	function (state)
	{
		var stateSkinClass = null;
	
		if (state == "up")
			stateSkinClass = this.getStyleData("UpSkinClass");
		else if (state == "over")
			stateSkinClass = this.getStyleData("OverSkinClass");
		else if (state == "down")
			stateSkinClass = this.getStyleData("DownSkinClass");
		else if (state == "disabled")
			stateSkinClass = this.getStyleData("DisabledSkinClass");
		
		var skinClass = this.getStyleData("SkinClass");
		
		//Shouldnt have null stateSkinClass
		if (stateSkinClass == null || skinClass.comparePriority(stateSkinClass) > 0) //Use skinClass if higher priority
			return skinClass.value;
		
		return stateSkinClass.value;
	};
	
//@override	
ButtonElement.prototype._getSkinStyleDefinitions = 
	function (state)
	{
		if (state == "up")
			return this.getStyle("UpSkinStyle");
		else if (state == "over")
			return this.getStyle("OverSkinStyle");
		else if (state == "down")
			return this.getStyle("DownSkinStyle");
		else if (state == "disabled")
			return this.getStyle("DisabledSkinStyle");
		
		return ButtonElement.base.prototype._getSkinStyleDefinitions.call(this, state);
	};

//@override
ButtonElement.prototype._getSkinStyleDefinitionDefault =
	function (state)
	{
		if (state == "up")
			return this._getDefaultStyle("UpSkinStyle");
		else if (state == "over")
			return this._getDefaultStyle("OverSkinStyle");
		else if (state == "down")
			return this._getDefaultStyle("DownSkinStyle");
		else if (state == "disabled")
			return this._getDefaultStyle("DisabledSkinStyle");
		
		return ButtonElement.base.prototype._getSkinStyleDefinitionDefault.call(this, state);
	};
	
//@override
ButtonElement.prototype._changeState = 
	function (state)
	{
		ButtonElement.base.prototype._changeState.call(this, state);
		
		this._updateTextColor();
	};
	
/**
 * @function _getTextColor
 * Gets the text color to be used for the supplied state. 
 * Override this to add styles for additional states.
 * 
 * @param state String
 * String representing the state to return the text color style.
 * 
 * @returns string
 * Text color for the supplied state.
 */	
ButtonElement.prototype._getTextColor = 
	function (state)
	{
		var stateTextColor = null;
		
		if (state == "up")
			stateTextColor = this.getStyleData("UpTextColor");
		else if (state == "over")
			stateTextColor = this.getStyleData("OverTextColor");
		else if (state == "down")
			stateTextColor = this.getStyleData("DownTextColor");
		else if (state == "disabled")
			stateTextColor = this.getStyleData("DisabledTextColor");

		var textColor = this.getStyleData("TextColor");
		
		//Shouldnt have null stateTextColor
		if (stateTextColor == null || textColor.comparePriority(stateTextColor) > 0) //Use textColor if higher priority
			return textColor.value;
		
		return stateTextColor.value;
	};

/**
 * @function _updateTextColor
 * Updates the text color in response to state changes.
 */		
ButtonElement.prototype._updateTextColor = 
	function ()
	{
		if (this._labelElement == null)
			return;
		
		this._labelElement.setStyle("TextColor", this._getTextColor(this._currentSkinState));
	};
	
/**
 * @function _updateText
 * Updates the buttons label text in response to style changes.
 */	
ButtonElement.prototype._updateText = 
	function ()
	{
		var text = this.getStyle("Text");
		if (text == null || text == "")
		{
			if (this._labelElement != null)
			{
				this._removeChild(this._labelElement);
				this._labelElement = null;
			}
		}
		else
		{
			if (this._labelElement == null)
			{
				this._labelElement = this._createLabel();
				if (this._labelElement != null)
				{
					this._updateTextColor();
					this._addChild(this._labelElement);
				}
			}
			
			if (this._labelElement != null)
				this._labelElement.setStyle("Text", text);
		}	
	};
	
//@override
ButtonElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		ButtonElement.base.prototype._doStylesUpdated.call(this, stylesMap);
	
		//Always update these, they dont do anything if no changes
		//and cheaper to call this than to check SkinClass inheritance.
		this._updateSkinClass("up");
		this._updateSkinStyleDefinitions("up");
		
		this._updateSkinClass("over");
		this._updateSkinStyleDefinitions("over");
		
		this._updateSkinClass("down");
		this._updateSkinStyleDefinitions("down");
		
		this._updateSkinClass("disabled");
		this._updateSkinStyleDefinitions("disabled");
		
		//Create / Destroy and proxy text to label.
		if ("Text" in stylesMap)
			this._updateText();
		
		//Only update the state if mouse is enabled, when disabled it means states are being manually controlled.
		if ("Enabled" in stylesMap && this.getStyle("MouseEnabled") == true)
			this._updateState();
		
		if ("TextHorizontalAlign" in stylesMap && this._labelElement != null)
			this._labelElement.setStyle("TextHorizontalAlign", this.getStyle("TextHorizontalAlign"));
		
		if ("TextVerticalAlign" in stylesMap && this._labelElement != null)
			this._labelElement.setStyle("TextVerticalAlign", this.getStyle("TextVerticalAlign"));
		
		//Always call (can optimize by checking for all text color styles)
		this._updateTextColor();
	};	
	
/**
 * @function _createLabel
 * Creates the Button's label instance when Text style is not null or empty.
 * 
 * @returns LabelElement
 * New LabelElement instance
 */	
ButtonElement.prototype._createLabel = 
	function ()
	{
		var label = new LabelElement();
	
		label.setStyle("MouseEnabled", false);
		label.setStyle("TextHorizontalAlign", this.getStyle("TextHorizontalAlign"));
		label.setStyle("TextVerticalAlign", this.getStyle("TextVerticalAlign"));
		
		label.setStyle("Padding", 0); //Wipe out default padding (no doubly padding, only this elements padding is necessary)
		
		return label;
	};
	
//@override
ButtonElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		var measuredSize = null;
	
		//Base size off of label.
		if (this._labelElement != null)
		{
			var labelWidth = this._labelElement._getStyledOrMeasuredWidth();
			var labelHeight = this._labelElement._getStyledOrMeasuredHeight();
			
			measuredSize = {width:labelWidth + padWidth, height:labelHeight + padHeight};
		}
		else
			measuredSize = ButtonElement.base.prototype._doMeasure.call(this, padWidth, padHeight);

		return measuredSize;
	};

//@override	
ButtonElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		ButtonElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		if (this._labelElement != null)
		{
			this._labelElement._setActualPosition(paddingMetrics.getX(), paddingMetrics.getY());
			this._labelElement._setActualSize(paddingMetrics.getWidth(), paddingMetrics.getHeight());
		}
	};	
	