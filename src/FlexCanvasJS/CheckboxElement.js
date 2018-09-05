
/**
 * @depends RadioButtonElement.js
 * @depends CheckboxSkinElement.js
 */

///////////////////////////////////////////////////////////////////////
///////////////////////CheckboxElement/////////////////////////////////

/**
 * @class CheckboxElement
 * @inherits RadioButtonElement
 * 
 * Checkbox adds "halfSelected" versions of the 4 button states and assigns a default skin. 
 * The HalfSelected state may only be set programmatically. 
 * 
 * Checkbox half selected states:
 * "halfSelectedUp", "halfSelectedOver", "halfSelectedDown", "halfSelectedDisabled".
 * 
 * Being a SkinnableElement, Checkbox proxies its styles to its skins. 
 * You may assign custom skins and assign any styles you wish to apply to all skins to the Checkbox itself. 
 * 
 * See the default skin CheckBoxSkin for additional skin styles.
 * 
 * @seealso CheckboxSkinElement
 * 
 * 
 * @constructor CheckboxElement 
 * Creates new CheckboxElement instance.
 */
function CheckboxElement()
{
	CheckboxElement.base.prototype.constructor.call(this);
}

//Inherit from ToggleButtonElement
CheckboxElement.prototype = Object.create(RadioButtonElement.prototype);
CheckboxElement.prototype.constructor = CheckboxElement;
CheckboxElement.base = RadioButtonElement;	
	
/////////////Style Types///////////////////////////////

CheckboxElement._StyleTypes = Object.create(null);

//New checkbox specific styles, add half selected state.

/**
 * @style HalfSelectedUpSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the checkbox skin when the checkbox is in the "halfSelectedUp" state. 
 * This will override SkinClass when equal or higher priority than SkinClass.
 */
CheckboxElement._StyleTypes.HalfSelectedUpSkinClass = 			StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style HalfSelectedUpSkinStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to the "halfSelectedUp" state skin element.
 */
CheckboxElement._StyleTypes.HalfSelectedUpSkinStyle = 			StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

/**
 * @style HalfSelectedUpTextColor String
 * 
 * Hex color value to be used for the checkbox label when the checkbox is in the "halfSelectedUp" state. Format like "#FF0000" (red).
 * This will override TextColor when equal or higher priority than TextColor.
 */
CheckboxElement._StyleTypes.HalfSelectedUpTextColor = 			StyleableBase.EStyleType.NORMAL;		//"#000000"

/**
 * @style HalfSelectedOverSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the checkbox skin when the checkbox is in the "halfSelectedOver" state. 
 * This will override SkinClass when equal or higher priority than SkinClass.
 */
CheckboxElement._StyleTypes.HalfSelectedOverSkinClass = 		StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style HalfSelectedOverSkinStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to the "halfSelectedOver" state skin element.
 */
CheckboxElement._StyleTypes.HalfSelectedOverSkinStyle = 		StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

/**
 * @style HalfSelectedOverTextColor String
 * 
 * Hex color value to be used for the checkbox label when the checkbox is in the "halfSelectedOver" state. Format like "#FF0000" (red).
 * This will override TextColor when equal or higher priority than TextColor.
 */
CheckboxElement._StyleTypes.HalfSelectedOverTextColor = 		StyleableBase.EStyleType.NORMAL;		//"#000000"

/**
 * @style HalfSelectedDownSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the checkbox skin when the checkbox is in the "halfSelectedDown" state. 
 * This will override SkinClass when equal or higher priority than SkinClass.
 */
CheckboxElement._StyleTypes.HalfSelectedDownSkinClass = 		StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style HalfSelectedDownSkinStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to the "halfSelectedDown" state skin element.
 */
CheckboxElement._StyleTypes.HalfSelectedDownSkinStyle = 		StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

/**
 * @style HalfSelectedDownTextColor String
 * 
 * Hex color value to be used for the checkbox label when the checkbox is in the "halfSelectedDown" state. Format like "#FF0000" (red).
 * This will override TextColor when equal or higher priority than TextColor.
 */
CheckboxElement._StyleTypes.HalfSelectedDownTextColor = 		StyleableBase.EStyleType.NORMAL;		//"#000000"

/**
 * @style HalfSelectedDisabledSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the checkbox skin when the checkbox is in the "halfSelectedDisabled" state. 
 * This will override SkinClass when equal or higher priority than SkinClass.
 */
CheckboxElement._StyleTypes.HalfSelectedDisabledSkinClass = 	StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style HalfSelectedDisabledSkinStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to the "halfSelectedDisabled" state skin element.
 */
CheckboxElement._StyleTypes.HalfSelectedDisabledSkinStyle = 	StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

/**
 * @style HalfSelectedDisabledTextColor String
 * 
 * Hex color value to be used for the checkbox label when the checkbox is in the "halfSelectedDisabled" state. Format like "#FF0000" (red).
 * This will override TextColor when equal or higher priority than TextColor.
 */
CheckboxElement._StyleTypes.HalfSelectedDisabledTextColor = 	StyleableBase.EStyleType.NORMAL;		//"#000000"	


////////////Default Styles//////////////////////

CheckboxElement.StyleDefault = new StyleDefinition();

CheckboxElement.StyleDefault.setStyle("AllowDeselect", 							true);

CheckboxElement.StyleDefault.setStyle("SkinClass", 								CheckboxSkinElement); //Not necessary, just for completeness

CheckboxElement.StyleDefault.setStyle("UpSkinClass", 							CheckboxSkinElement);
CheckboxElement.StyleDefault.setStyle("OverSkinClass", 							CheckboxSkinElement);
CheckboxElement.StyleDefault.setStyle("DownSkinClass", 							CheckboxSkinElement);
CheckboxElement.StyleDefault.setStyle("DisabledSkinClass", 						CheckboxSkinElement);

CheckboxElement.StyleDefault.setStyle("SelectedUpSkinClass", 					CheckboxSkinElement);
CheckboxElement.StyleDefault.setStyle("SelectedOverSkinClass", 					CheckboxSkinElement);
CheckboxElement.StyleDefault.setStyle("SelectedDownSkinClass", 					CheckboxSkinElement);
CheckboxElement.StyleDefault.setStyle("SelectedDisabledSkinClass", 				CheckboxSkinElement);

CheckboxElement.StyleDefault.setStyle("HalfSelectedUpSkinClass", 				CheckboxSkinElement);
CheckboxElement.StyleDefault.setStyle("HalfSelectedOverSkinClass", 				CheckboxSkinElement);
CheckboxElement.StyleDefault.setStyle("HalfSelectedDownSkinClass", 				CheckboxSkinElement);
CheckboxElement.StyleDefault.setStyle("HalfSelectedDisabledSkinClass", 			CheckboxSkinElement);

CheckboxElement.StyleDefault.setStyle("HalfSelectedUpTextColor", 				"#000000");
CheckboxElement.StyleDefault.setStyle("HalfSelectedOverTextColor", 				"#000000");
CheckboxElement.StyleDefault.setStyle("HalfSelectedDownTextColor", 				"#000000");
CheckboxElement.StyleDefault.setStyle("HalfSelectedDisabledTextColor", 			"#888888");


//Skin Defaults
CheckboxElement.UpSkinStyleDefault = new StyleDefinition();

CheckboxElement.UpSkinStyleDefault.setStyle("BackgroundShape",					null);
CheckboxElement.UpSkinStyleDefault.setStyle("BorderType", 						"solid");
CheckboxElement.UpSkinStyleDefault.setStyle("BorderThickness", 					1);
CheckboxElement.UpSkinStyleDefault.setStyle("BorderColor", 						"#333333");
CheckboxElement.UpSkinStyleDefault.setStyle("BackgroundFill", 					"#EBEBEB");
CheckboxElement.UpSkinStyleDefault.setStyle("CheckColor", 						"#000000");

CheckboxElement.OverSkinStyleDefault = new StyleDefinition();

CheckboxElement.OverSkinStyleDefault.setStyle("BackgroundShape",				null);
CheckboxElement.OverSkinStyleDefault.setStyle("BorderType", 					"solid");
CheckboxElement.OverSkinStyleDefault.setStyle("BorderThickness", 				1);
CheckboxElement.OverSkinStyleDefault.setStyle("BorderColor", 					"#333333");
CheckboxElement.OverSkinStyleDefault.setStyle("BackgroundFill", 				"#DDDDDD");
CheckboxElement.OverSkinStyleDefault.setStyle("CheckColor", 					"#000000");

CheckboxElement.DownSkinStyleDefault = new StyleDefinition();

CheckboxElement.DownSkinStyleDefault.setStyle("BackgroundShape",				null);
CheckboxElement.DownSkinStyleDefault.setStyle("BorderType", 					"solid");
CheckboxElement.DownSkinStyleDefault.setStyle("BorderThickness", 				1);
CheckboxElement.DownSkinStyleDefault.setStyle("BorderColor", 					"#333333");
CheckboxElement.DownSkinStyleDefault.setStyle("BackgroundFill", 				"#CCCCCC");
CheckboxElement.DownSkinStyleDefault.setStyle("CheckColor", 					"#000000");

CheckboxElement.DisabledSkinStyleDefault = new StyleDefinition();

CheckboxElement.DisabledSkinStyleDefault.setStyle("BackgroundShape",			null);
CheckboxElement.DisabledSkinStyleDefault.setStyle("BorderType", 				"solid");
CheckboxElement.DisabledSkinStyleDefault.setStyle("BorderThickness", 			1);
CheckboxElement.DisabledSkinStyleDefault.setStyle("BorderColor", 				"#999999");
CheckboxElement.DisabledSkinStyleDefault.setStyle("BackgroundFill", 			"#ECECEC");
CheckboxElement.DisabledSkinStyleDefault.setStyle("CheckColor", 				"#777777");


//Apply Skin Defaults
CheckboxElement.StyleDefault.setStyle("UpSkinStyle", 							CheckboxElement.UpSkinStyleDefault);
CheckboxElement.StyleDefault.setStyle("OverSkinStyle", 							CheckboxElement.OverSkinStyleDefault);
CheckboxElement.StyleDefault.setStyle("DownSkinStyle", 							CheckboxElement.DownSkinStyleDefault);
CheckboxElement.StyleDefault.setStyle("DisabledSkinStyle", 						CheckboxElement.DisabledSkinStyleDefault);

CheckboxElement.StyleDefault.setStyle("SelectedUpSkinStyle", 					CheckboxElement.UpSkinStyleDefault);
CheckboxElement.StyleDefault.setStyle("SelectedOverSkinStyle", 					CheckboxElement.OverSkinStyleDefault);
CheckboxElement.StyleDefault.setStyle("SelectedDownSkinStyle", 					CheckboxElement.DownSkinStyleDefault);
CheckboxElement.StyleDefault.setStyle("SelectedDisabledSkinStyle", 				CheckboxElement.DisabledSkinStyleDefault);

CheckboxElement.StyleDefault.setStyle("HalfSelectedUpSkinStyle", 				CheckboxElement.UpSkinStyleDefault);
CheckboxElement.StyleDefault.setStyle("HalfSelectedOverSkinStyle", 				CheckboxElement.OverSkinStyleDefault);
CheckboxElement.StyleDefault.setStyle("HalfSelectedDownSkinStyle", 				CheckboxElement.DownSkinStyleDefault);
CheckboxElement.StyleDefault.setStyle("HalfSelectedDisabledSkinStyle", 			CheckboxElement.DisabledSkinStyleDefault);

/////////////Public Functions////////////////////////////////////////

/**
 * @function setSelected
 * @override
 * Sets the selected state of the Checkbox.
 * 
 * @param isSelected boolean
 * Checkbox adds a half selected state by setting isSelected = 2.
 * 0 (or false) is unchecked, 1 (or true) is checked, and 2 is half checked.
 */	
CheckboxElement.prototype.setSelected = 
	function (isSelected)
	{
		CheckboxElement.base.prototype.setSelected.call(this, isSelected);
	};


/////////////Internal Functions/////////////////////	

//@override
CheckboxElement.prototype._updateState = 
	function ()
	{
		if (this.getStyle("Selected") == 2)
		{
			var newState = "halfSelectedUp";
			
			if (this.getStyle("Enabled") == false)
				newState = "halfSelectedDisabled";
			else
			{
				if (this._mouseIsDown == true)
					newState = "halfSelectedDown";
				else if (this._mouseIsOver == true)
					newState = "halfSelectedOver";
			}
			
			this.setStyle("SkinState", newState);
		}
		else
		{
			//Call base if we're not selected, handles non-selected states.
			CheckboxElement.base.prototype._updateState.call(this);
		}
	};

//@override
CheckboxElement.prototype._getSkinClass = 
	function (state)
	{
		var stateSkinClass = null;
		
		if (state == "halfSelectedUp")
			stateSkinClass = this.getStyleData("HalfSelectedUpSkinClass");
		else if (state == "halfSelectedOver")
			stateSkinClass = this.getStyleData("HalfSelectedOverSkinClass");
		else if (state == "halfSelectedDown")
			stateSkinClass = this.getStyleData("HalfSelectedDownSkinClass");
		else if (state == "halfSelectedDisabled")
			stateSkinClass = this.getStyleData("HalfSelectedDisabledSkinClass");
		else //base class state
			return CheckboxElement.base.prototype._getSkinClass.call(this, state);
		
		var skinClass = this.getStyleData("SkinClass");
		
		if (skinClass.comparePriority(stateSkinClass) > 0) //Use skinClass if higher priority
			return skinClass.value;
		
		return stateSkinClass.value;
	};
	
//@override	
CheckboxElement.prototype._getSubStyleNameForSkinState = 
	function (state)
	{
		if (state == "halfSelectedUp")
			return "HalfSelectedUpSkinStyle";
		if (state == "halfSelectedOver")
			return "HalfSelectedOverSkinStyle";
		if (state == "halfSelectedDown")
			return "HalfSelectedDownSkinStyle";
		if (state == "halfSelectedDisabled")
			return "HalfSelectedDisabledSkinStyle";
		
		return CheckboxElement.base.prototype._getSubStyleNameForSkinState.call(this, state);
	};	
	
//@override
CheckboxElement.prototype._getTextColor = 
	function (state)
	{
		var stateTextColor = null;
		
		if (state == "halfSelectedUp")
			stateTextColor = this.getStyleData("HalfSelectedUpTextColor");
		else if (state == "halfSelectedOver")
			stateTextColor = this.getStyleData("HalfSelectedOverTextColor");
		else if (state == "halfSelectedDown")
			stateTextColor = this.getStyleData("HalfSelectedDownTextColor");
		else if (state == "halfSelectedDisabled")
			stateTextColor = this.getStyleData("HalfSelectedDisabledTextColor");
		else //base class state
			return CheckboxElement.base.prototype._getTextColor.call(this, state);
	
		var textColor = this.getStyleData("TextColor");
		
		if (textColor.comparePriority(stateTextColor) > 0) //Use textColor if higher priority
			return textColor.value;
		
		return stateTextColor.value;
	};

//@override
CheckboxElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		CheckboxElement.base.prototype._doStylesUpdated.call(this, stylesMap);

		////Update skin classes and sub styles.
		if ("SkinClass" in stylesMap || "HalfSelectedUpSkinClass" in stylesMap)
			this._updateSkinClass("halfSelectedUp");
		if ("HalfSelectedUpSkinStyle" in stylesMap)
			this._updateSkinStyleDefinitions("halfSelectedUp");
		
		if ("SkinClass" in stylesMap || "HalfSelectedOverSkinClass" in stylesMap)
			this._updateSkinClass("halfSelectedOver");
		if ("HalfSelectedOverSkinStyle" in stylesMap)
			this._updateSkinStyleDefinitions("halfSelectedOver");
		
		if ("SkinClass" in stylesMap || "HalfSelectedDownSkinClass" in stylesMap)
			this._updateSkinClass("halfSelectedDown");
		if ("HalfSelectedDownSkinStyle" in stylesMap)
			this._updateSkinStyleDefinitions("halfSelectedDown");
		
		if ("SkinClass" in stylesMap || "HalfSelectedDisabledSkinClass" in stylesMap)
			this._updateSkinClass("halfSelectedDisabled");
		if ("HalfSelectedDisabledSkinStyle" in stylesMap)
			this._updateSkinStyleDefinitions("halfSelectedDisabled");
	};	
	
	