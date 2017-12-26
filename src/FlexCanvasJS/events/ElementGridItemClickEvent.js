
/**
 * @depends ElementListItemClickEvent.js
 */

//////////////////////////////////////////////////////////////////////////
/////////////////////ElementGridItemClickEvent////////////////////////////

/**
 * @class ElementGridItemClickEvent
 * @inherits ElementListItemClickEvent
 * 
 * Event class dispatched when a DataGrid DataRenderer is clicked of type "listitemclick". 
 * 
 * 
 * @constructor ElementGridItemClickEvent 
 * Creates new ElementGridItemClickEvent instance.
 * 
 * @param item Object
 * The collection item associated with the DataRenderer that was clicked.
 * 
 * @param index int
 * The collection index associated with the DataRenderer that was clicked.
 * 
 * @param columnIndex int
 * The column index associated with the DataRenderer that was clicked.
 */
function ElementGridItemClickEvent(item, index, columnIndex)
{
	ElementGridItemClickEvent.base.prototype.constructor.call(this, item, index);
	
	this._columnIndex = columnIndex;
}

//Inherit from ElementListItemClickEvent
ElementGridItemClickEvent.prototype = Object.create(ElementListItemClickEvent.prototype);
ElementGridItemClickEvent.prototype.constructor = ElementGridItemClickEvent;
ElementGridItemClickEvent.base = ElementListItemClickEvent;	

/**
 * @function getColumnIndex
 * Gets the column index that dispatched the event.
 * 
 * @returns int
 * Column index.
 */
ElementGridItemClickEvent.prototype.getColumnIndex = 
	function()
	{
		return this._columnIndex;
	};

//@Override
ElementGridItemClickEvent.prototype.clone =
	function ()
	{
		var clonedEvent = ElementGridItemClickEvent.base.prototype.clone.call(this);
		
		//No additional property copies (handled by constructor)
		
		return clonedEvent;
	};

//@Override
ElementGridItemClickEvent.prototype._cloneInstance = 
	function ()
	{
		return new ElementListItemClickEvent(this._item, this._index, this._columnIndex);
	};	