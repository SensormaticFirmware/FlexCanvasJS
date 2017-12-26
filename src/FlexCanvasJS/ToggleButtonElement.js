
/**
 * @depends ButtonElement.js
 */

///////////////////////////////////////////////////////////////////////////	
///////////////////////ToggleButtonElement/////////////////////////////////

/**
 * @class ToggleButtonElement
 * @inherits ButtonElement
 * 
 * ToggleButton is identical to a button except that it adds "selected" versions of
 * the 4 button states and Toggles from selected to not-selected when clicked. It also
 * dispatches a "changed" event when the selected state changes.
 * 
 * ToggleButton selected states:
 * "selectedUp", "selectedOver", "selectedDown", "selectedDisabled".
 * 
 * Being a SkinnableElement, ToggleButton proxies its styles to its skins. 
 * You may assign custom skins and assign any styles you wish to apply to all skins to the ToggleButton itself. 
 * 
 * ToggleButton is a base class for components such as Checkbox and RadioButton.
 * 
 * 
 * @constructor ToggleButtonElement 
 * Creates new ToggleButtonElement instance.
 */
function ToggleButtonElement()
{
	ToggleButtonElement.base.prototype.constructor.call(this);
	
	this._isSelected = false;
}

//Inherit from ButtonElement
ToggleButtonElement.prototype = Object.create(ButtonElement.prototype);
ToggleButtonElement.prototype.constructor = ToggleButtonElement;
ToggleButtonElement.base = ButtonElement;

////////////Events/////////////////////////////////////

/**
 * @event changed ElementEvent
 * Dispatched when the ToggleButton's selection state changes as a result of user interaction.
 */


/////////////Style Types///////////////////////////////

ToggleButtonElement._StyleTypes = Object.create(null);

//New toggle button specific styles.

/**
 * @style AllowDeselect boolean
 * 
 * When false, the ToggleButton cannot be de-selected by the user and the "selectedOver" and "selectedDown" states are not used, 
 * as with the case for most tab or radio button type elements.
 */
ToggleButtonElement._StyleTypes.AllowDeselect = 				{inheritable:false};		// true || false

/**
 * @style SelectedUpSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the button skin when the button is in the "selectedUp" state. 
 * This will override SkinClass when equal or higher priority than SkinClass.
 */
ToggleButtonElement._StyleTypes.SelectedUpSkinClass = 			{inheritable:false};		//Element constructor()

/**
 * @style SelectedUpSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "selectedUp" state skin element.
 */
ToggleButtonElement._StyleTypes.SelectedUpSkinStyle = 			{inheritable:false};		//StyleDefinition

/**
 * @style SelectedUpTextColor String
 * 
 * Hex color value to be used for the button label when the button is in the "selectedUp" state. Format like "#FF0000" (red).
 * This will override TextColor when equal or higher priority than TextColor.
 */
ToggleButtonElement._StyleTypes.SelectedUpTextColor = 			{inheritable:false};		//"#000000"

/**
 * @style SelectedOverSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the button skin when the button is in the "selectedOver" state. 
 * This will override SkinClass when equal or higher priority than SkinClass.
 */
ToggleButtonElement._StyleTypes.SelectedOverSkinClass = 		{inheritable:false};		//Element constructor()

/**
 * @style SelectedOverSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "selectedOver" state skin element. 
 */
ToggleButtonElement._StyleTypes.SelectedOverSkinStyle = 		{inheritable:false};		//StyleDefinition

/**
 * @style SelectedOverTextColor String
 * 
 * Hex color value to be used for the button label when the button is in the "selectedOver" state. Format like "#FF0000" (red).
 * This will override TextColor when equal or higher priority than TextColor.
 */
ToggleButtonElement._StyleTypes.SelectedOverTextColor = 		{inheritable:false};		//"#000000"

/**
 * @style SelectedDownSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the button skin when the button is in the "selectedDown" state. 
 * This will override SkinClass when equal or higher priority than SkinClass.
 */
ToggleButtonElement._StyleTypes.SelectedDownSkinClass = 		{inheritable:false};		//Element constructor()

/**
 * @style SelectedDownSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "selectedDown" state skin element. 
 */
ToggleButtonElement._StyleTypes.SelectedDownSkinStyle = 		{inheritable:false};		//StyleDefinition

/**
 * @style SelectedDownTextColor String
 * 
 * Hex color value to be used for the button label when the button is in the "selectedDown" state. Format like "#FF0000" (red).
 * This will override TextColor when equal or higher priority than TextColor.
 */
ToggleButtonElement._StyleTypes.SelectedDownTextColor = 		{inheritable:false};		//"#000000"

/**
 * @style SelectedDisabledSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the button skin when the button is in the "selectedDisabled" state. 
 * This will override SkinClass when equal or higher priority than SkinClass.
 */
ToggleButtonElement._StyleTypes.SelectedDisabledSkinClass = 	{inheritable:false};		//Element constructor()

/**
 * @style SelectedDisabledSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "selectedDisabled" state skin element. 
 */
ToggleButtonElement._StyleTypes.SelectedDisabledSkinStyle = 	{inheritable:false};		//StyleDefinition

/**
 * @style SelectedDisabledTextColor String
 * 
 * Hex color value to be used for the button label when the button is in the "selectedDisabled" state. Format like "#FF0000" (red).
 * This will override TextColor when equal or higher priority than TextColor.
 */
ToggleButtonElement._StyleTypes.SelectedDisabledTextColor = 	{inheritable:false};		//"#000000"


////////////Default Styles/////////////////////////////

ToggleButtonElement.StyleDefault = new StyleDefinition();

//ToggleButtonElement specific styles
ToggleButtonElement.StyleDefault.setStyle("AllowDeselect", 							true);

ToggleButtonElement.StyleDefault.setStyle("SelectedUpSkinClass", 					CanvasElement);
ToggleButtonElement.StyleDefault.setStyle("SelectedOverSkinClass", 					CanvasElement);
ToggleButtonElement.StyleDefault.setStyle("SelectedDownSkinClass", 					CanvasElement);
ToggleButtonElement.StyleDefault.setStyle("SelectedDisabledSkinClass", 				CanvasElement);

ToggleButtonElement.StyleDefault.setStyle("SelectedOverTextColor", 					"#000000");
ToggleButtonElement.StyleDefault.setStyle("SelectedUpTextColor", 					"#000000");
ToggleButtonElement.StyleDefault.setStyle("SelectedDownTextColor", 					"#000000");
ToggleButtonElement.StyleDefault.setStyle("SelectedDisabledTextColor", 				"#888888");

//Skin Defaults /////////////////////////////////////
ToggleButtonElement.SelectedUpSkinStyleDefault = new StyleDefinition();

ToggleButtonElement.SelectedUpSkinStyleDefault.setStyle("BorderType", 				"solid");
ToggleButtonElement.SelectedUpSkinStyleDefault.setStyle("BorderThickness", 			1);
ToggleButtonElement.SelectedUpSkinStyleDefault.setStyle("BorderColor", 				"#333333");
ToggleButtonElement.SelectedUpSkinStyleDefault.setStyle("BackgroundColor", 			"#CCCCCC");
ToggleButtonElement.SelectedUpSkinStyleDefault.setStyle("AutoGradientType", 		"linear");
ToggleButtonElement.SelectedUpSkinStyleDefault.setStyle("AutoGradientStart", 		(-.06));
ToggleButtonElement.SelectedUpSkinStyleDefault.setStyle("AutoGradientStop", 		(+.02));

ToggleButtonElement.SelectedOverSkinStyleDefault = new StyleDefinition();

ToggleButtonElement.SelectedOverSkinStyleDefault.setStyle("BorderType", 			"solid");
ToggleButtonElement.SelectedOverSkinStyleDefault.setStyle("BorderThickness", 		1);
ToggleButtonElement.SelectedOverSkinStyleDefault.setStyle("BorderColor", 			"#333333");
ToggleButtonElement.SelectedOverSkinStyleDefault.setStyle("BackgroundColor", 		"#BDBDBD");
ToggleButtonElement.SelectedOverSkinStyleDefault.setStyle("AutoGradientType", 		"linear");
ToggleButtonElement.SelectedOverSkinStyleDefault.setStyle("AutoGradientStart", 		(-.08));
ToggleButtonElement.SelectedOverSkinStyleDefault.setStyle("AutoGradientStop", 		(+.05));

ToggleButtonElement.SelectedDownSkinStyleDefault = new StyleDefinition();

ToggleButtonElement.SelectedDownSkinStyleDefault.setStyle("BorderType", 			"solid");
ToggleButtonElement.SelectedDownSkinStyleDefault.setStyle("BorderThickness", 		1);
ToggleButtonElement.SelectedDownSkinStyleDefault.setStyle("BorderColor", 			"#333333");
ToggleButtonElement.SelectedDownSkinStyleDefault.setStyle("BackgroundColor", 		"#B0B0B0");
ToggleButtonElement.SelectedDownSkinStyleDefault.setStyle("AutoGradientType", 		"linear");
ToggleButtonElement.SelectedDownSkinStyleDefault.setStyle("AutoGradientStart", 		(-.08));
ToggleButtonElement.SelectedDownSkinStyleDefault.setStyle("AutoGradientStop", 		(+.05));

ToggleButtonElement.SelectedDisabledSkinStyleDefault = new StyleDefinition();

ToggleButtonElement.SelectedDisabledSkinStyleDefault.setStyle("BorderType", 		"solid");
ToggleButtonElement.SelectedDisabledSkinStyleDefault.setStyle("BorderThickness", 	1);
ToggleButtonElement.SelectedDisabledSkinStyleDefault.setStyle("BorderColor", 		"#777777");
ToggleButtonElement.SelectedDisabledSkinStyleDefault.setStyle("BackgroundColor", 	"#C7C7C7");
ToggleButtonElement.SelectedDisabledSkinStyleDefault.setStyle("AutoGradientType", 	"linear");
ToggleButtonElement.SelectedDisabledSkinStyleDefault.setStyle("AutoGradientStart", 	(-.08));
ToggleButtonElement.SelectedDisabledSkinStyleDefault.setStyle("AutoGradientStop", 	(+.05));
///////////////////////////////////////////////////////

ToggleButtonElement.StyleDefault.setStyle("SelectedUpSkinStyle", 					ToggleButtonElement.SelectedUpSkinStyleDefault);
ToggleButtonElement.StyleDefault.setStyle("SelectedOverSkinStyle", 					ToggleButtonElement.SelectedOverSkinStyleDefault);
ToggleButtonElement.StyleDefault.setStyle("SelectedDownSkinStyle", 					ToggleButtonElement.SelectedDownSkinStyleDefault);
ToggleButtonElement.StyleDefault.setStyle("SelectedDisabledSkinStyle", 				ToggleButtonElement.SelectedDisabledSkinStyleDefault);


//////////////Public Functions/////////////////////////////////////////

/**
 * @function setSelected
 * Sets the selected state of the ToggleButton.
 * 
 * @param isSelected boolean
 * When true the toggle button is selected.
 */	
ToggleButtonElement.prototype.setSelected = 
	function (isSelected)
	{
		if (this._isSelected == isSelected)
			return;
		
		this._isSelected = isSelected;
		this._updateState();
	};
	
/**
 * @function getSelected
 * Gets the selected state of the ToggleButton.
 * 
 * @returns boolean
 * When true the toggle button is selected.
 */	
ToggleButtonElement.prototype.getSelected = 
	function ()
	{
		return this._isSelected;
	};



/////////////Internal Functions/////////////////////	

//@Override
ToggleButtonElement.prototype._updateState = 
	function ()
	{
		if (this._isSelected == false)
		{
			//Call base if we're not selected, handles non-selected states.
			ToggleButtonElement.base.prototype._updateState.call(this);
		}
		else
		{
			var newState = "selectedUp";
			
			if (this.getStyle("Enabled") == false)
				newState = "selectedDisabled";
			else if (this.getStyle("AllowDeselect") == true)
			{
				if (this._mouseIsDown == true)
					newState = "selectedDown";
				else if (this._mouseIsOver == true)
					newState = "selectedOver";
			}
			
			this.setStyle("SkinState", newState);
		}
	};

//@Override	
ToggleButtonElement.prototype._onButtonClick = 
	function (elementMouseEvent)
	{
		//Not calling base
	
		//Implementor will not expect a click event when button is disabled. 
		if (this.getStyle("Enabled") == false)
			elementMouseEvent.cancelEvent();
		else
		{
			if (this._isSelected == false || this.getStyle("AllowDeselect") == true) 
			{
				//Toggle selected state.
				this._isSelected = !this._isSelected;
				
				this._updateState();
				
				//Dispatch changed event.
				if (this.hasEventListener("changed", null) == true)
					this._dispatchEvent(new ElementEvent("changed", false));
			}	
		}
	};
	
//@override
ToggleButtonElement.prototype._getSkinClass = 
	function (state)
	{
		var stateSkinClass = null;
	
		if (state == "selectedUp")
			stateSkinClass = this.getStyleData("SelectedUpSkinClass");
		else if (state == "selectedOver")
			stateSkinClass = this.getStyleData("SelectedOverSkinClass");
		else if (state == "selectedDown")
			stateSkinClass = this.getStyleData("SelectedDownSkinClass");
		else if (state == "selectedDisabled")
			stateSkinClass = this.getStyleData("SelectedDisabledSkinClass");
		else //base class state
			return ToggleButtonElement.base.prototype._getSkinClass.call(this, state);
		
		var skinClass = this.getStyleData("SkinClass");
		
		if (skinClass.comparePriority(stateSkinClass) > 0) //Use skinClass if higher priority
			return skinClass.value;
		
		return stateSkinClass.value;
	};	
	
//@override	
ToggleButtonElement.prototype._getSkinStyleDefinitions = 
	function (state)
	{
		if (state == "selectedUp")
			return [this.getStyle("SelectedUpSkinStyle")];
		else if (state == "selectedOver")
			return [this.getStyle("SelectedOverSkinStyle")];
		else if (state == "selectedDown")
			return [this.getStyle("SelectedDownSkinStyle")];
		else if (state == "selectedDisabled")
			return [this.getStyle("SelectedDisabledSkinStyle")];
		
		return ToggleButtonElement.base.prototype._getSkinStyleDefinitions.call(this, state);
	};	
	
//@Override
ToggleButtonElement.prototype._getSkinStyleDefinitionDefault =
	function (state)
	{
		if (state == "selectedUp")
			return this._getDefaultStyle("SelectedUpSkinStyle");
		else if (state == "selectedOver")
			return this._getDefaultStyle("SelectedOverSkinStyle");
		else if (state == "selectedDown")
			return this._getDefaultStyle("SelectedDownSkinStyle");
		else if (state == "selectedDisabled")
			return this._getDefaultStyle("SelectedDisabledSkinStyle");
		
		return ToggleButtonElement.base.prototype._getSkinStyleDefinitionDefault.call(this, state);
	};	
	
//@Override
ToggleButtonElement.prototype._getTextColor = 
	function (state)
	{
		var stateTextColor = null;
	
		if (state == "selectedUp")
			stateTextColor = this.getStyleData("SelectedUpTextColor");
		else if (state == "selectedOver")
			stateTextColor = this.getStyleData("SelectedOverTextColor");
		else if (state == "selectedDown")
			stateTextColor = this.getStyleData("SelectedDownTextColor");
		else if (state == "selectedDisabled")
			stateTextColor = this.getStyleData("SelectedDisabledTextColor");
		else //base class state
			return ToggleButtonElement.base.prototype._getTextColor.call(this, state);
	
		var textColor = this.getStyleData("TextColor");
		
		if (textColor.comparePriority(stateTextColor) > 0) //Use textColor if higher priority
			return textColor.value;
		
		return stateTextColor.value;
	};

//@Override
ToggleButtonElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		ToggleButtonElement.base.prototype._doStylesUpdated.call(this, stylesMap);
	
		//Always update these, they dont do anything if no changes
		//and cheaper to call this than to check SkinClass inheritance.
		this._updateSkinClass("selectedUp");
		this._updateSkinStyleDefinitions("selectedUp");
		
		this._updateSkinClass("selectedOver");
		this._updateSkinStyleDefinitions("selectedOver");
		
		this._updateSkinClass("selectedDown");
		this._updateSkinStyleDefinitions("selectedDown");
		
		this._updateSkinClass("selectedDisabled");
		this._updateSkinStyleDefinitions("selectedDisabled");
		
		if ("AllowDeselect" in stylesMap)
			this._updateState();
	};	
	

	
	