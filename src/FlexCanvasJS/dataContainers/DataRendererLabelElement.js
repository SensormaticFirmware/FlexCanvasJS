
/**
 * @depends DataRendererBaseElement.js
 */

///////////////////////////////////////////////////////////////////////
///////////////////////DataRendererLabelElement////////////////////////

/**
 * @class DataRendererLabelElement
 * @inherits DataRendererBaseElement
 * 
 * DataList DataRenderer for a basic label.
 * Adds text color styles for DataRenderer states and 
 * sets label text when the parent DataList sets our list data.
 * 
 * @constructor DataRendererLabelElement 
 * Creates new DataRendererLabelElement instance.
 */
function DataRendererLabelElement()
{
	DataRendererLabelElement.base.prototype.constructor.call(this);
	
	this._labelElement = new LabelElement();
	this._labelElement.setStyle("Padding", 0); //Wipe out default padding (no doubly padding, only this elements padding is necessary)
	
	this._addChild(this._labelElement);
}
	
//Inherit from DataRendererBaseElement
DataRendererLabelElement.prototype = Object.create(DataRendererBaseElement.prototype);
DataRendererLabelElement.prototype.constructor = DataRendererLabelElement;
DataRendererLabelElement.base = DataRendererBaseElement;


/////////////Style Types/////////////////////////

DataRendererLabelElement._StyleTypes = Object.create(null);

/**
 * @style UpTextColor String
 * 
 * Hex color value to be used for the label when in the "up" state. Format like "#FF0000" (red).
 * This will override the TextColor style of equal priority.
 */
DataRendererLabelElement._StyleTypes.UpTextColor = 				StyleableBase.EStyleType.NORMAL;		//"#000000"

/**
 * @style AltTextColor String
 * 
 * Hex color value to be used for the label when in the "alt" state. Format like "#FF0000" (red).
 * This will override the TextColor style of equal priority.
 */
DataRendererLabelElement._StyleTypes.AltTextColor = 			StyleableBase.EStyleType.NORMAL;		//"#000000"

/**
 * @style OverTextColor String
 * 
 * Hex color value to be used for the label when in the "over" state. Format like "#FF0000" (red).
 * This will override the TextColor style of equal priority.
 */
DataRendererLabelElement._StyleTypes.OverTextColor = 			StyleableBase.EStyleType.NORMAL;		//"#000000"

/**
 * @style SelectedTextColor String
 * 
 * Hex color value to be used for the label when in the "selected" state. Format like "#FF0000" (red).
 * This will override the TextColor style of equal priority.
 */
DataRendererLabelElement._StyleTypes.SelectedTextColor = 		StyleableBase.EStyleType.NORMAL;		//"#000000"


////////////Default Styles///////////////////////

DataRendererLabelElement.StyleDefault = new StyleDefinition();

DataRendererLabelElement.StyleDefault.setStyle("PaddingTop", 				4);
DataRendererLabelElement.StyleDefault.setStyle("PaddingBottom", 			4);
DataRendererLabelElement.StyleDefault.setStyle("PaddingLeft", 				4);
DataRendererLabelElement.StyleDefault.setStyle("PaddingRight", 				4);

DataRendererLabelElement.StyleDefault.setStyle("UpTextColor", 				"#000000");
DataRendererLabelElement.StyleDefault.setStyle("AltTextColor", 				"#000000");
DataRendererLabelElement.StyleDefault.setStyle("OverTextColor", 			"#000000");
DataRendererLabelElement.StyleDefault.setStyle("SelectedTextColor", 		"#000000");


////////////Internal/////////////////////////////

//@Override
DataRendererLabelElement.prototype._changeState = 
	function (state)
	{
		DataRendererLabelElement.base.prototype._changeState.call(this, state);
		
		this._updateLabelTextColor();
	};
	
/**
 * @function _getTextColor
 * Gets the text color style for the supplied state.
 * 
 * @param state String
 * The current state.
 * 
 * @returns String
 * Text color style for the supplied state.
 */	
DataRendererLabelElement.prototype._getTextColor = 
	function (state)
	{
		var stateTextColor = null;
		
		if (state == "up")
			stateTextColor = this.getStyleData("UpTextColor");
		else if (state == "alt")
			stateTextColor = this.getStyleData("AltTextColor");
		else if (state == "over")
			stateTextColor = this.getStyleData("OverTextColor");
		else if (state == "selected")
			stateTextColor = this.getStyleData("SelectedTextColor");
	
		var textColor = this.getStyleData("TextColor");
		
		//Shouldnt have null stateTextColor
		if (stateTextColor == null || textColor.comparePriority(stateTextColor) > 0) //Use textColor if higher priority
			return textColor.value;
		
		return stateTextColor.value;
	};

/**
 * @function _updateLabelTextColor
 * Updates the text color for the current state.
 */	
DataRendererLabelElement.prototype._updateLabelTextColor = 
	function ()
	{
		var color = this._getTextColor(this._currentSkinState);
		if (color != null)
			this._labelElement.setStyle("TextColor", color);
	};
	
/**
 * @function _updateLabelTextColor
 * Updates the label text base on the list data and ItemLabelFunction.
 */		
DataRendererLabelElement.prototype._updateLabelText = 
	function ()
	{
		if (this._itemData == null)
			this._labelElement.setStyle("Text", "");
		else
		{
			var labelFunction = this._listData._parentList.getStyle("ItemLabelFunction");
			this._labelElement.setStyle("Text", labelFunction(this._itemData));
		}
	};
	
//@Override
DataRendererLabelElement.prototype._setListData = 
	function (listData, itemData)
	{
		DataRendererLabelElement.base.prototype._setListData.call(this, listData, itemData);
		
		this._updateLabelText();
	};

//@Override
DataRendererLabelElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		DataRendererLabelElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		this._updateLabelTextColor();
	};

//@Override
DataRendererLabelElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		return {width: this._labelElement._getStyledOrMeasuredWidth() + padWidth, 
				height: this._labelElement._getStyledOrMeasuredHeight() + padHeight};
	};

//@Override	
DataRendererLabelElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		DataRendererLabelElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		this._labelElement._setActualPosition(paddingMetrics.getX(), paddingMetrics.getY());
		this._labelElement._setActualSize(paddingMetrics.getWidth(), paddingMetrics.getHeight());
	};
	
	