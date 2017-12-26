
/**
 * @depends DispatcherEvent.js
 */

///////////////////////////////////////////////////////////////////
//////////////////CollectionChangedEvent///////////////////////////	
	
/**
 * @class CollectionChangedEvent
 * @inherits DispatcherEvent
 * 
 * Event that is dispatched when a data collection is changed of type "collectionchanged". 
 * This is typically an internal event that the data driven containers use to monitor 
 * changes to their data collections.
 * 
 * 
 * @constructor CollectionChangedEvent 
 * Creates new CollectionChangedEvent instance.
 * 
 * @param kind String
 * String representing type of change that occurred to the collection.
 * Allowable values are "add", "remove", "update", and "reset".
 * 
 * @param index int
 * Index position the change occurred (or -1 if kind is "reset").
 */
function CollectionChangedEvent(kind, index)
{
	CollectionChangedEvent.base.prototype.constructor.call(this, "collectionchanged");
	
	this._kind = kind;
	this._index = index;
}	
	
//Inherit from DispatcherEvent
CollectionChangedEvent.prototype = Object.create(DispatcherEvent.prototype);
CollectionChangedEvent.prototype.constructor = CollectionChangedEvent;
CollectionChangedEvent.base = DispatcherEvent;

/**
 * @function getKind
 * Gets the kind of the collection event. Possible types are "add", "remove", "update", and "reset".
 * 
 * @returns String
 * The kind of the collection event.
 */
CollectionChangedEvent.prototype.getKind = 
	function ()
	{
		return this._kind;
	};
	
/**
 * @function getIndex
 * Gets the index of the data collection that the change occurred.
 * 
 * @returns int
 * The index of the data collection that the change occurred.
 */	
CollectionChangedEvent.prototype.getIndex = 
	function ()
	{
		return this._index;
	};

//@Override
CollectionChangedEvent.prototype.clone =
	function ()
	{
		var clonedEvent = CollectionChangedEvent.base.prototype.clone.call(this);
		
		//No additional property copies (handled by constructor)
		
		return clonedEvent;
	};
	
//@Override
CollectionChangedEvent.prototype._cloneInstance = 
	function ()
	{
		return new CollectionChangedEvent(this._kind, this._index);
	};
	
	