
/**
 * @depends SkinnableElement.js
 */

///////////////////////////////////////////////////////////////////////
///////////////////////DataRendererBaseElement/////////////////////////
	
/**
 * @class DataRendererBaseElement
 * @inherits SkinnableElement
 * 
 * Abstract base class for DataList item rendering. Any CanvasElement
 * can be a data renderer. This class is just here for convenience as it
 * implements some commonly used functionality if you wish to subclass it. 
 * 
 * Adds skin states and styles for "up", "alt", "over", and "selected" states. 
 *  
 * 
 * @constructor DataRendererBaseElement 
 * Creates new DataRendererBaseElement instance.
 */
function DataRendererBaseElement()
{
	DataRendererBaseElement.base.prototype.constructor.call(this);
	
	var _self = this;
	
	//Private event handler, proxy to prototype.
	this._onDataRendererBaseEventInstance = 
		function (elementEvent)
		{
			if (elementEvent.getType() == "rollover")
				_self._onDataRendererRollover(elementEvent);
			else if (elementEvent.getType() == "rollout")
				_self._onDataRendererRollout(elementEvent);
		};
		
	this.addEventListener("rollover", this._onDataRendererBaseEventInstance);
	this.addEventListener("rollout", this._onDataRendererBaseEventInstance);
}
	
//Inherit from SkinnableElement
DataRendererBaseElement.prototype = Object.create(SkinnableElement.prototype);
DataRendererBaseElement.prototype.constructor = DataRendererBaseElement;
DataRendererBaseElement.base = SkinnableElement;


/////////////Style Types////////////////////////////////////////////

DataRendererBaseElement._StyleTypes = Object.create(null);

/**
 * @style SkinClass CanvasElement
 * 
 * The CanvasElement constructor type to apply to all skin states. 
 * Specific states such as UpSkinClass will override SkinClass.
 */
DataRendererBaseElement._StyleTypes.SkinClass =					StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style UpSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the data renderer skin when in the "up" state. 
 * This will override SkinClass.
 */
DataRendererBaseElement._StyleTypes.UpSkinClass = 				StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style UpSkinStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to the "up" state skin element.
 */
DataRendererBaseElement._StyleTypes.UpSkinStyle = 				StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

/**
 * @style AltSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the data renderer skin when in the "alt" state. 
 * This is used to create different styles for alternating rows. 
 * This will override SkinClass.
 */
DataRendererBaseElement._StyleTypes.AltSkinClass = 				StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style AltSkinStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to the "alt" state skin element.
 */
DataRendererBaseElement._StyleTypes.AltSkinStyle = 				StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

/**
 * @style OverSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the data renderer skin when in the "over" state. 
 * This will override SkinClass.
 */
DataRendererBaseElement._StyleTypes.OverSkinClass = 			StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style OverSkinStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to the "over" state skin element.
 */
DataRendererBaseElement._StyleTypes.OverSkinStyle = 			StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

/**
 * @style SelectedSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the data renderer skin when in the "selected" state. 
 * This will override SkinClass.
 */
DataRendererBaseElement._StyleTypes.SelectedSkinClass = 		StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style SelectedSkinStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to the "selected" state skin element.
 */
DataRendererBaseElement._StyleTypes.SelectedSkinStyle = 		StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

/**
 * @style DisabledSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the data renderer skin when in the "disabled" state. 
 * This will override SkinClass.
 */
DataRendererBaseElement._StyleTypes.DisabledSkinClass = 		StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style DisabledSkinStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to the "disabled" state skin element.
 */
DataRendererBaseElement._StyleTypes.DisabledSkinStyle = 		StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

//Proxied from DataList
/**
 * @style Selectable boolean
 * 
 * When false, prevents "over" and "selected" states. Proxied from parent DataList.
 */
DataRendererBaseElement._StyleTypes.Selectable = 				StyleableBase.EStyleType.NORMAL;		// true || false


///////////Default Styles///////////////////////////////////////////

DataRendererBaseElement.StyleDefault = new StyleDefinition();

//Skin Defaults////////////////////////////
DataRendererBaseElement.OverSkinStyleDefault = new StyleDefinition();

DataRendererBaseElement.OverSkinStyleDefault.setStyle("BackgroundFill", 				"#E0E0E0");

DataRendererBaseElement.SelectedSkinStyleDefault = new StyleDefinition();

DataRendererBaseElement.SelectedSkinStyleDefault.setStyle("BackgroundFill", 			"#CDCDCD");
//////////////////////////////////////////

DataRendererBaseElement.StyleDefault.setStyle("Selectable", 			true);												//Proxied from List - may be overridden in _setListData()

DataRendererBaseElement.StyleDefault.setStyle("SkinClass", 				CanvasElement);										// Element constructor()
DataRendererBaseElement.StyleDefault.setStyle("UpSkinClass", 			CanvasElement);										// Element constructor()
DataRendererBaseElement.StyleDefault.setStyle("AltSkinClass", 			CanvasElement);										// Element constructor()
DataRendererBaseElement.StyleDefault.setStyle("OverSkinClass", 			CanvasElement);										// Element constructor()
DataRendererBaseElement.StyleDefault.setStyle("SelectedSkinClass", 		CanvasElement);										// Element constructor()
DataRendererBaseElement.StyleDefault.setStyle("DisabledSkinClass", 		CanvasElement);										// Element constructor()

DataRendererBaseElement.StyleDefault.setStyle("UpSkinStyle", 			null);												// StyleDefinition
DataRendererBaseElement.StyleDefault.setStyle("AltSkinStyle", 			null);												// StyleDefinition
DataRendererBaseElement.StyleDefault.setStyle("OverSkinStyle", 			DataRendererBaseElement.OverSkinStyleDefault);		// StyleDefinition
DataRendererBaseElement.StyleDefault.setStyle("SelectedSkinStyle", 		DataRendererBaseElement.SelectedSkinStyleDefault);	// StyleDefinition
DataRendererBaseElement.StyleDefault.setStyle("DisabledSkinStyle", 		null);												// StyleDefinition


/////////////Internal///////////////////////////

/**
 * @function _updateState
 * Updates the SkinState style in response to mouse and ListData changes.
 */
DataRendererBaseElement.prototype._updateState = 
	function ()
	{
		var newState = "";
	
		if (this._listSelected == true)
			newState = "selected";
		if (this.getStyle("Enabled") == false)
			newState = "disabled";
		else if (this._mouseIsOver == true && this.getStyle("Selectable") == true)
			newState = "over";
		else // "up"
		{
			if (this._listData == null || this._listData._itemIndex % 2 == 0)
				newState = "up";
			else
				newState = "alt";
		}
		
		this.setStyle("SkinState", newState);
	};

//@Override
DataRendererBaseElement.prototype._getSkinClass = 
	function (state)
	{
		var stateSkinClass = null;
		
		if (state == "up")
			stateSkinClass = this.getStyleData("UpSkinClass");
		else if (state == "alt")
			stateSkinClass = this.getStyleData("AltSkinClass");
		else if (state == "over")
			stateSkinClass = this.getStyleData("OverSkinClass");
		else if (state == "selected")
			stateSkinClass = this.getStyleData("SelectedSkinClass");
		else if (state == "disabled")
			stateSkinClass = this.getStyleData("DisabledSkinClass");
		
		var skinClass = this.getStyleData("SkinClass");
		
		//Shouldnt have null stateSkinClass
		if (stateSkinClass == null || skinClass.comparePriority(stateSkinClass) > 0) //Use skinClass if higher priority
			return skinClass.value;
		
		return stateSkinClass.value;
	};
		
//@override	
DataRendererBaseElement.prototype._getSubStyleNameForSkinState = 
	function (state)
	{
		if (state == "up")
			return "UpSkinStyle";
		if (state == "alt")
			return "AltSkinStyle";
		if (state == "over")
			return "OverSkinStyle";
		if (state == "selected")
			return "SelectedSkinStyle";
		if (state == "disabled")
			return "DisabledSkinStyle";
		
		return DataRendererBaseElement.base.prototype._getSubStyleNameForSkinState.call(this, state);
	};	
	
/**
 * @function _onDataRendererRollover
 * Event handler for "rollover" event. Updates the skin state.
 * Overriding this is more efficient than adding an additional "rollover" event listener.
 * 
 * @param elementEvent ElementEvent
 * The ElementEvent to process.
 */		
DataRendererBaseElement.prototype._onDataRendererRollover = 
	function (elementEvent)
	{
		this._updateState();
	};
	
/**
 * @function _onDataRendererRollout
 * Event handler for "rollout" event. Updates the skin state.
 * Overriding this is more efficient than adding an additional "rollout" event listener.
 * 
 * @param elementEvent ElementEvent
 * The ElementEvent to process.
 */		
DataRendererBaseElement.prototype._onDataRendererRollout = 
	function (elementEvent)
	{
		this._updateState();
	};

//@Override	
DataRendererBaseElement.prototype._setListSelected = 
	function (selected)
	{
		DataRendererBaseElement.base.prototype._setListSelected.call(this, selected);
		
		this._updateState();
	};
	
//@Override	
DataRendererBaseElement.prototype._setListData = 
	function (listData, itemData)
	{
		DataRendererBaseElement.base.prototype._setListData.call(this, listData, itemData);
		
		if (itemData.hasOwnProperty("enabled") == true)
			this.setStyle("Enabled", itemData.enabled);
		else
			this.clearStyle("Enabled");
			
		if (itemData.hasOwnProperty("selectable") == true)
			this.setStyle("Selectable", itemData.selectable);
		else
			this.clearStyle("Selectable");
		
		this._updateState();
	};

//@Override
DataRendererBaseElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		DataRendererBaseElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		
		////Update skin classes and sub styles.
		if ("SkinClass" in stylesMap || "UpSkinClass" in stylesMap)
			this._updateSkinClass("up");
		if ("UpSkinStyle" in stylesMap)
			this._updateSkinStyleDefinitions("up");
		
		if ("SkinClass" in stylesMap || "AltSkinClass" in stylesMap)
			this._updateSkinClass("alt");
		if ("AltSkinStyle" in stylesMap)
			this._updateSkinStyleDefinitions("alt");
		
		if ("SkinClass" in stylesMap || "OverSkinClass" in stylesMap)
			this._updateSkinClass("over");
		if ("OverSkinStyle" in stylesMap)
			this._updateSkinStyleDefinitions("over");
		
		if ("SkinClass" in stylesMap || "SelectedSkinClass" in stylesMap)
			this._updateSkinClass("selected");
		if ("SelectedSkinStyle" in stylesMap)
			this._updateSkinStyleDefinitions("selected");		
		
		if ("SkinClass" in stylesMap || "DisabledSkinClass" in stylesMap)
			this._updateSkinClass("disabled");
		if ("DisabledSkinStyle" in stylesMap)
			this._updateSkinStyleDefinitions("disabled");
		
		if ("Selectable" in stylesMap || "Enabled" in stylesMap)
			this._updateState();
	};
	
	