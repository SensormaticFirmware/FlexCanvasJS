
/**
 * @depends ElementEvent.js
 */

//////////////////////////////////////////////////////////////////////////
/////////////////////ElementListItemClickEvent////////////////////////////

/**
 * @class ElementListItemClickEvent
 * @inherits ElementEvent
 * 
 * Event class dispatched when a DataRenderer is clicked of type "listitemclick". 
 * 
 * 
 * @constructor ElementListItemClickEvent 
 * Creates new ElementListItemClickEvent instance.
 * 
 * @param item Object
 * The collection item associated with the DataRenderer that was clicked.
 * 
 * @param index int
 * The collection index associated with the DataRenderer that was clicked.
 */
function ElementListItemClickEvent(item, index)
{
	ElementListItemClickEvent.base.prototype.constructor.call(this, "listitemclick", false);
	
	this._item = item;
	this._index = index;
}

//Inherit from ElementEvent
ElementListItemClickEvent.prototype = Object.create(ElementEvent.prototype);
ElementListItemClickEvent.prototype.constructor = ElementListItemClickEvent;
ElementListItemClickEvent.base = ElementEvent;	

/**
 * @function getItem
 * Gets the collection item associated with the DataRenderer that was clicked.
 * 
 * @returns Object
 * The collection item associated with the DataRenderer that was clicked.
 */
ElementListItemClickEvent.prototype.getItem = 
	function()
	{
		return this._item;
	};

/**
 * @function getIndex
 * Gets the collection index associated with the DataRenderer that was clicked.
 * 
 * @returns int
 * The collection index associated with the DataRenderer that was clicked.
 */	
ElementListItemClickEvent.prototype.getIndex = 
	function()
	{
		return this._index;
	};

//@Override
ElementListItemClickEvent.prototype.clone =
	function ()
	{
		var clonedEvent = ElementListItemClickEvent.base.prototype.clone.call(this);

		//No additional property copies (handled by constructor)

		return clonedEvent;
};

//@Override
ElementListItemClickEvent.prototype._cloneInstance = 
	function ()
	{
		return new ElementListItemClickEvent(this._item, this._index);
	};	