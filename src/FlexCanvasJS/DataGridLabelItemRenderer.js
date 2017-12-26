
/**
 * @depends LabelElement.js
 */

///////////////////////////////////////////////////////////////////////
///////////////////DataGridLabelItemRenderer/////////////////////////	
	
/**
 * @class DataGridLabelItemRenderer
 * @inherits LabelElement
 * 
 * DataGrid ItemRenderer for a basic label. Updates label text via 
 * DataGridColumnDefiniton RowItemLabelFunction.
 * 
 * This class needs more work to add  text color styles for DataRenderer states.
 * 
 * @constructor DataGridLabelItemRenderer 
 * Creates new DataGridLabelItemRenderer instance.
 */
function DataGridLabelItemRenderer()
{
	DataGridLabelItemRenderer.base.prototype.constructor.call(this);
}

//Inherit from LabelElement
DataGridLabelItemRenderer.prototype = Object.create(LabelElement.prototype);
DataGridLabelItemRenderer.prototype.constructor = DataGridLabelItemRenderer;
DataGridLabelItemRenderer.base = LabelElement;


///////////Default Styles//////////////////////

DataGridLabelItemRenderer.StyleDefault = new StyleDefinition();

DataGridLabelItemRenderer.StyleDefault.setStyle("Padding", 				5);			// Override


//////////////Internal//////////////////////////////////////////

//@Override
DataGridLabelItemRenderer.prototype._setListData = 
	function (listData, itemData)
	{
		DataGridLabelItemRenderer.base.prototype._setListData.call(this, listData, itemData);
		
		this._updateLabelText();
	};

/**
 * @function _updateLabelText
 * Updates the label text in response to list data changes using the associated parent grid column's RowItemLabelFunction.
 */	
DataGridLabelItemRenderer.prototype._updateLabelText = 
	function ()
	{
		if (this._itemData == null || this._listData == null)
			this.setStyle("Text", "");
		else
		{
			var parentGrid = this._listData._parentGrid;
			var columnDefinition = parentGrid._gridColumns[this._listData._columnIndex];
			var labelFunction = columnDefinition.getStyle("RowItemLabelFunction");
			
			this.setStyle("Text", labelFunction(this._itemData, this._listData._columnIndex));
		}
	};
	
	