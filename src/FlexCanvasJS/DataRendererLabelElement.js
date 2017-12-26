
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
 * When this is null, the base class's TextColor style will be used.
 */
DataRendererLabelElement._StyleTypes.UpTextColor = 				{inheritable:false};		//"#000000"

/**
 * @style OverTextColor String
 * 
 * Hex color value to be used for the label when in the "over" state. Format like "#FF0000" (red).
 * When this is null, the base class's TextColor style will be used.
 */
DataRendererLabelElement._StyleTypes.OverTextColor = 			{inheritable:false};		//"#000000"

/**
 * @style SelectedTextColor String
 * 
 * Hex color value to be used for the label when in the "selected" state. Format like "#FF0000" (red).
 * When this is null, the base class's TextColor style will be used.
 */
DataRendererLabelElement._StyleTypes.SelectedTextColor = 		{inheritable:false};		//"#000000"


////////////Default Styles///////////////////////

DataRendererLabelElement.StyleDefault = new StyleDefinition();

DataRendererLabelElement.StyleDefault.setStyle("Padding", 					3);
DataRendererLabelElement.StyleDefault.setStyle("BorderType", 				"none");

DataRendererLabelElement.StyleDefault.setStyle("UpTextColor", 				null);
DataRendererLabelElement.StyleDefault.setStyle("OverTextColor", 			null);
DataRendererLabelElement.StyleDefault.setStyle("SelectedTextColor", 		null);


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
		if (state == "up")
			return this.getStyle("UpTextColor") || this.getStyle("TextColor");
		else if (state == "over")
			return this.getStyle("OverTextColor") || this.getStyle("TextColor");
		else if (state == "selected")
			return this.getStyle("SelectedTextColor") || this.getStyle("TextColor");
		else
			return null;
	};

/**
 * @function _updateLabelTextColor
 * Updates the text color base on the current state.
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
		//Get sizing based on skin
		var measuredSize = DataRendererLabelElement.base.prototype._doMeasure.call(this, padWidth, padHeight);
	
		//If we're larger than the skin increase size.
		var labelWidth = this._labelElement._getStyledOrMeasuredWidth();
		var labelHeight = this._labelElement._getStyledOrMeasuredHeight();
			
		if (padWidth + labelWidth > measuredSize.width)
			measuredSize.width = padWidth + labelWidth;
		
		if (padHeight + labelHeight > measuredSize.height)
			measuredSize.height = padHeight + labelHeight;
		
		return measuredSize;
	};

//@Override	
DataRendererLabelElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		DataRendererLabelElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		this._labelElement._setActualPosition(paddingMetrics.getX(), paddingMetrics.getY());
		this._labelElement._setActualSize(paddingMetrics.getWidth(), paddingMetrics.getHeight());
	};
	
	