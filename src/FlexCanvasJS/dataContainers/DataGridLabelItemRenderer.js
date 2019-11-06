
/**
 * @depends DataGridItemRendererBase.js
 */

///////////////////////////////////////////////////////////////////////
///////////////////DataGridLabelItemRenderer/////////////////////////	
	
/**
 * @class DataGridLabelItemRenderer
 * @inherits DataGridItemRendererBase
 * 
 * DataGrid ItemRenderer for a basic label. Updates label text via 
 * DataGridColumnDefiniton RowItemLabelFunction.
 * 
 * @constructor DataGridLabelItemRenderer 
 * Creates new DataGridLabelItemRenderer instance.
 */
function DataGridLabelItemRenderer()
{
	DataGridLabelItemRenderer.base.prototype.constructor.call(this);
	
	this._labelElement = new LabelElement();
	this._labelElement.setStyle("Padding", 0); //Wipe out default padding (no doubly padding, only this elements padding is necessary)
	
	this._addChild(this._labelElement);
}

//Inherit from LabelElement
DataGridLabelItemRenderer.prototype = Object.create(DataGridItemRendererBase.prototype);
DataGridLabelItemRenderer.prototype.constructor = DataGridLabelItemRenderer;
DataGridLabelItemRenderer.base = DataGridItemRendererBase;


/////////////Style Types/////////////////////////

DataGridLabelItemRenderer._StyleTypes = Object.create(null);

/**
 * @style UpTextColor String
 * 
 * Hex color value to be used for the label when in the "up" state. Format like "#FF0000" (red).
 * This will override the TextColor style of equal priority.
 */
DataGridLabelItemRenderer._StyleTypes.UpTextColor = 				StyleableBase.EStyleType.NORMAL;		//"#000000"

/**
 * @style AltTextColor String
 * 
 * Hex color value to be used for the label when in the "alt" state. Format like "#FF0000" (red).
 * This will override the TextColor style of equal priority.
 */
DataGridLabelItemRenderer._StyleTypes.AltTextColor = 				StyleableBase.EStyleType.NORMAL;		//"#000000"

/**
 * @style OverTextColor String
 * 
 * Hex color value to be used for the label when in the "over" state. Format like "#FF0000" (red).
 * This will override the TextColor style of equal priority.
 */
DataGridLabelItemRenderer._StyleTypes.OverTextColor = 				StyleableBase.EStyleType.NORMAL;		//"#000000"

/**
 * @style SelectedTextColor String
 * 
 * Hex color value to be used for the label when in the "selected" state. Format like "#FF0000" (red).
 * This will override the TextColor style of equal priority.
 */
DataGridLabelItemRenderer._StyleTypes.SelectedTextColor = 			StyleableBase.EStyleType.NORMAL;		//"#000000"


////////////Default Styles///////////////////////

DataGridLabelItemRenderer.StyleDefault = new StyleDefinition();

DataGridLabelItemRenderer.StyleDefault.setStyle("PaddingTop", 				4);
DataGridLabelItemRenderer.StyleDefault.setStyle("PaddingBottom", 			4);
DataGridLabelItemRenderer.StyleDefault.setStyle("PaddingLeft", 				4);
DataGridLabelItemRenderer.StyleDefault.setStyle("PaddingRight", 			4);

DataGridLabelItemRenderer.StyleDefault.setStyle("UpTextColor", 				"#000000");
DataGridLabelItemRenderer.StyleDefault.setStyle("AltTextColor", 			"#000000");
DataGridLabelItemRenderer.StyleDefault.setStyle("OverTextColor", 			"#000000");
DataGridLabelItemRenderer.StyleDefault.setStyle("SelectedTextColor", 		"#000000");


////////////Internal/////////////////////////////

//@Override
DataGridLabelItemRenderer.prototype._changeState = 
	function (state)
	{
		DataGridLabelItemRenderer.base.prototype._changeState.call(this, state);
		
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
DataGridLabelItemRenderer.prototype._getTextColor = 
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
DataGridLabelItemRenderer.prototype._updateLabelTextColor = 
	function ()
	{
		var color = this._getTextColor(this._currentSkinState);
		if (color != null)
			this._labelElement.setStyle("TextColor", color);
	};
	
/**
 * @function _updateLabelTextColor
 * Updates the label text base on the DataGrid data and column RowItemLabelFunction.
 */		
DataGridLabelItemRenderer.prototype._updateLabelText = 
	function ()
	{
		if (this._itemData == null || this._listData == null)
			this._labelElement.setStyle("Text", "");
		else
		{
			var parentGrid = this._listData._parentGrid;
			var columnDefinition = parentGrid._gridColumns[this._listData._columnIndex];
			var labelFunction = columnDefinition.getStyle("RowItemLabelFunction");
			
			if (labelFunction == null)
				this._labelElement.setStyle("Text", "");
			else
				this._labelElement.setStyle("Text", labelFunction(this._itemData, this._listData._columnIndex));
		}
	};
	
//@override
DataGridLabelItemRenderer.prototype._setListData = 
	function (listData, itemData)
	{
		DataGridLabelItemRenderer.base.prototype._setListData.call(this, listData, itemData);
		
		this._updateLabelText();
	};

//@override
DataGridLabelItemRenderer.prototype._doStylesUpdated =
	function (stylesMap)
	{
		DataGridLabelItemRenderer.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		this._updateLabelTextColor();
	};

//@override
DataGridLabelItemRenderer.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		this._setMeasuredSize(this._labelElement._getStyledOrMeasuredWidth() + padWidth, 
							this._labelElement._getStyledOrMeasuredHeight() + padHeight);
	};

//@override	
DataGridLabelItemRenderer.prototype._doLayout = 
	function (paddingMetrics)
	{
		DataGridLabelItemRenderer.base.prototype._doLayout.call(this, paddingMetrics);
		
		this._labelElement._setActualPosition(paddingMetrics.getX(), paddingMetrics.getY());
		this._labelElement._setActualSize(paddingMetrics.getWidth(), paddingMetrics.getHeight());
	};
	
	