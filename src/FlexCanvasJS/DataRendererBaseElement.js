
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
DataRendererBaseElement._StyleTypes.SkinClass =					{inheritable:false};		//Element constructor()

/**
 * @style UpSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the data renderer skin when in the "up" state. 
 * This will override SkinClass.
 */
DataRendererBaseElement._StyleTypes.UpSkinClass = 				{inheritable:false};		//Element constructor()

/**
 * @style UpSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "up" state skin element.
 */
DataRendererBaseElement._StyleTypes.UpSkinStyle = 				{inheritable:false};		//StyleDefinition

/**
 * @style AltSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the data renderer skin when in the "alt" state. 
 * This is used to create different styles for alternating rows. 
 * This will override SkinClass.
 */
DataRendererBaseElement._StyleTypes.AltSkinClass = 				{inheritable:false};		//Element constructor()

/**
 * @style AltSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "alt" state skin element.
 */
DataRendererBaseElement._StyleTypes.AltSkinStyle = 				{inheritable:false};		//StyleDefinition

/**
 * @style OverSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the data renderer skin when in the "over" state. 
 * This will override SkinClass.
 */
DataRendererBaseElement._StyleTypes.OverSkinClass = 			{inheritable:false};		//Element constructor()

/**
 * @style OverSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "over" state skin element.
 */
DataRendererBaseElement._StyleTypes.OverSkinStyle = 			{inheritable:false};		//StyleDefinition

/**
 * @style SelectedSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the data renderer skin when in the "selected" state. 
 * This will override SkinClass.
 */
DataRendererBaseElement._StyleTypes.SelectedSkinClass = 		{inheritable:false};		//Element constructor()

/**
 * @style SelectedSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "selected" state skin element.
 */
DataRendererBaseElement._StyleTypes.SelectedSkinStyle = 		{inheritable:false};		//StyleDefinition

//Proxied from DataList (intended only for reading)
/**
 * @style Selectable boolean
 * 
 * When false, prevents "over" and "selected" states. Proxied from parent DataList.
 */
DataRendererBaseElement._StyleTypes.Selectable = 				{inheritable:false};		// true || false


///////////Default Styles///////////////////////////////////////////

DataRendererBaseElement.StyleDefault = new StyleDefinition();

//Skin Defaults////////////////////////////
DataRendererBaseElement.OverSkinStyleDefault = new StyleDefinition();

DataRendererBaseElement.OverSkinStyleDefault.setStyle("BackgroundColor", 			"#E0E0E0");
DataRendererBaseElement.OverSkinStyleDefault.setStyle("AutoGradientType", 			"linear");
DataRendererBaseElement.OverSkinStyleDefault.setStyle("AutoGradientStart", 			(+.03));
DataRendererBaseElement.OverSkinStyleDefault.setStyle("AutoGradientStop", 			(-.03));

DataRendererBaseElement.SelectedSkinStyleDefault = new StyleDefinition();

DataRendererBaseElement.SelectedSkinStyleDefault.setStyle("BackgroundColor", 			"#CDCDCD");
DataRendererBaseElement.SelectedSkinStyleDefault.setStyle("AutoGradientType", 			"linear");
DataRendererBaseElement.SelectedSkinStyleDefault.setStyle("AutoGradientStart", 			(+.03));
DataRendererBaseElement.SelectedSkinStyleDefault.setStyle("AutoGradientStop", 			(-.03));
//////////////////////////////////////////

DataRendererBaseElement.StyleDefault.setStyle("Selectable", 			true);												// intended only for reading, its proxied from DataList

DataRendererBaseElement.StyleDefault.setStyle("SkinClass", 				CanvasElement);										// Element constructor()
DataRendererBaseElement.StyleDefault.setStyle("UpSkinClass", 			CanvasElement);										// Element constructor()
DataRendererBaseElement.StyleDefault.setStyle("AltSkinClass", 			CanvasElement);										// Element constructor()
DataRendererBaseElement.StyleDefault.setStyle("OverSkinClass", 			CanvasElement);										// Element constructor()
DataRendererBaseElement.StyleDefault.setStyle("SelectedSkinClass", 		CanvasElement);										// Element constructor()

DataRendererBaseElement.StyleDefault.setStyle("UpSkinStyle", 			null);												// StyleDefinition
DataRendererBaseElement.StyleDefault.setStyle("AltSkinStyle", 			null);												// StyleDefinition
DataRendererBaseElement.StyleDefault.setStyle("OverSkinStyle", 			DataRendererBaseElement.OverSkinStyleDefault);		// StyleDefinition
DataRendererBaseElement.StyleDefault.setStyle("SelectedSkinStyle", 		DataRendererBaseElement.SelectedSkinStyleDefault);	// StyleDefinition


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
		
		var skinClass = this.getStyleData("SkinClass");
		
		//Shouldnt have null stateSkinClass
		if (stateSkinClass == null || skinClass.comparePriority(stateSkinClass) > 0) //Use skinClass if higher priority
			return skinClass.value;
		
		return stateSkinClass.value;
	};
		
//@override	
DataRendererBaseElement.prototype._getSkinStyleDefinitions = 
	function (state)
	{
		if (state == "up")
			return [this.getStyle("UpSkinStyle")];
		else if (state == "alt")
			return [this.getStyle("AltSkinStyle")];
		else if (state == "over")
			return [this.getStyle("OverSkinStyle")];
		else if (state == "selected")
			return [this.getStyle("SelectedSkinStyle")];
		
		return DataRendererBaseElement.base.prototype._getSkinStyleDefinitions.call(this, state);
	};

//@Override
DataRendererBaseElement.prototype._getSkinStyleDefinitionDefault =
	function (state)
	{
		if (state == "up")
			return this._getDefaultStyle("UpSkinStyle");
		else if (state == "alt")
			return this._getDefaultStyle("AltSkinStyle");
		else if (state == "over")
			return this._getDefaultStyle("OverSkinStyle");
		else if (state == "selected")
			return this._getDefaultStyle("SelectedSkinStyle");
		
		return DataRendererBaseElement.base.prototype._getSkinStyleDefinitionDefault.call(this, state);
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
		
		this._updateState();
	};

//@Override
DataRendererBaseElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		DataRendererBaseElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		//Always update these, they dont do anything if no changes
		//and cheaper to call this than to check SkinClass inheritance.
		this._updateSkinClass("up");
		this._updateSkinStyleDefinitions("up");
		
		this._updateSkinClass("alt");
		this._updateSkinStyleDefinitions("alt");
		
		this._updateSkinClass("over");
		this._updateSkinStyleDefinitions("over");
		
		this._updateSkinClass("selected");
		this._updateSkinStyleDefinitions("selected");
		
		if ("Selectable" in stylesMap)
			this._updateState();
	};
	
	