
///////////////////////////////////////////////////////////////////////
///////////////////////DataGridItemData////////////////////////////////

/**
 * @class DataGridItemData
 * 
 * Internal data storage class passed to CanvasElements when they are used as
 * DataRenderers for a DataGrid.
 * 
 * 
 * @constructor DataGridItemData 
 * Creates new DataGridItemData instance.
 * 
 * @param parentGrid DataGridElement
 * The parent DataListElement or subclass.
 * 
 * @param itemIndex int
 * The Collection item index.
 * 
 * @param columnIndex int
 * The column index associated with the DataGrid renderer.
 */
function DataGridItemData(parentGrid, itemIndex, columnIndex)
{
	/**
	 * @member _parentGrid DataGridElement
	 * Read Only - The parent DataGridElement or subclass. 
	 */
	this._parentGrid = parentGrid;
	
	/**
	 * @member _itemIndex int
	 * Read Only - The Collection item index.
	 */
	this._itemIndex = itemIndex;
	
	/**
	 * @member _columnIndex int
	 * Read Only - Column index associated with the DataGrid renderer.
	 */
	this._columnIndex = columnIndex;
};	

