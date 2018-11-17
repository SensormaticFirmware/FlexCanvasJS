
///////////////////////////////////////////////////////////////////////
///////////////////////DataListData////////////////////////////////////

/**
 * @class DataListData
 * 
 * Internal data storage class passed to CanvasElements when they are used as
 * DataRenderers for a DataListElement or subclass.
 * 
 * 
 * @constructor DataListData 
 * Creates new DataListData instance.
 * 
 * @param parentList DataListElement
 * The parent DataListElement or subclass.
 * 
 * @param itemIndex int
 * The Collection item index.
 */
function DataListData(parentList, itemIndex)
{
	/**
	 * @member _parentList DataListElement
	 * Read Only - The parent DataListElement or subclass. 
	 */
	this._parentList = parentList;
	
	/**
	 * @member _itemIndex int
	 * Read Only - The Collection item index.
	 */
	this._itemIndex = itemIndex;
};	