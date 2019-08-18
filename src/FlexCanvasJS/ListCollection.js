
/**
 * @depends EventDispatcher.js
 */

///////////////////////////////////////////////////////////////////
///////////////////////ListCollection//////////////////////////////	

/**
 * @class ListCollection
 * @inherits EventDispatcher
 * 
 * ListCollection is a wrapper for an Array that dispatches "collectionchanged"
 * events when the collection is modified. This is used by data driven containers
 * like the DataList or DataGrid to track and respond to changes on their associated data.
 * 
 * 
 * @constructor ListCollection 
 * Creates new ListCollection instance.
 * 
 * @param sourceArray Array
 * Backing array to be used as the collection's source. This is used
 * if you have an existing array you want to give to the ListCollection
 * to manage. Setting this to null will cause the ListCollection to create 
 * its own internal array.
 */
function ListCollection(sourceArray)
{
	ListCollection.base.prototype.constructor.call(this);
	
	if (sourceArray != null)
		this._backingArray = sourceArray;
	else
		this._backingArray = [];
	
	this._collectionSort = null;	
	
	
}

//Inherit from EventDispatcher
ListCollection.prototype = Object.create(EventDispatcher.prototype);
ListCollection.prototype.constructor = ListCollection;
ListCollection.base = EventDispatcher;

/**
 * @event collectionchanged CollectionChangedEvent
 * 
 * Dispatched when the collection is modified. CollectionChangedEvents can be of kinds "add", "remove", "update", "reset",
 * and include the index which has been changed.
 */


////////////Public///////////////////////////////

/**
 * @function getLength
 * Gets the number of elements in the collection.
 * 
 * @returns int
 * The number of elements in the collection.
 */
ListCollection.prototype.getLength = 
	function ()
	{
		return this._backingArray.length;
	};

/**
 * @function setSourceArray
 * Sets the source array to be used for the collection and dispatches a "collectionchanged" "reset" event.
 * 
 * @param sourceArray Array
 * The source array to be used for the collection.
 */	
ListCollection.prototype.setSourceArray = 
	function (sourceArray)
	{
		this._backingArray = sourceArray;
		this.dispatchEvent(new CollectionChangedEvent("reset", -1));
	};
	
/**
 * @function getSourceArray
 * Gets the source array currently used for the collection.
 * 
 * @returns Array
 * The source array currently used for the collection.
 */		
ListCollection.prototype.getSourceArray = 
	function ()
	{
		return this._backingArray;
	};
	
/**
 * @function setCollectionSort
 * Sets the CollectionSort to be used when calling sort().
 * 
 * @param collectionSort CollectionSort
 * The CollectionSort to be used when calling sort(). (or null)
 */	
ListCollection.prototype.setCollectionSort = 
	function (collectionSort)
	{
		if (this._collectionSort == collectionSort)
			return; 
			
		if (!(collectionSort instanceof CollectionSort))
			return;
			
		this._collectionSort = collectionSort;
	};
	
/**
 * @function getCollectionSort
 * Gets the CollectionSort used when calling sort().
 * 
 * @returns CollectionSort
 * The CollectionSort to be used when calling sort().
 */	
ListCollection.prototype.getCollectionSort = 
	function ()
	{
		return this._collectionSort;
	};
	
/**
 * @function sort
 * Sorts the collection and dispatches a "collectionchanged" "reset" event.
 */	
ListCollection.prototype.sort = 
	function ()
	{
		if (this._backingArray == null)
			return;
	
		if (this._collectionSort == null)
			this._backingArray.sort();
		else
			this._collectionSort.sort(this._backingArray);
		
		this.dispatchEvent(new CollectionChangedEvent("reset", -1));
	};
	
/**
 * @function getItemIndex
 * Gets the collection index of the item.
 * 
 * @param item Object
 * The item to which to return the collection index.
 * 
 * @returns int
 * The collection index or -1 if the item is not in the collection.
 */	
ListCollection.prototype.getItemIndex = 
	function (item)
	{
		if (item == null)
			return -1;
		
		return this._backingArray.indexOf(item);
	};
	
/**
 * @function getItemAt
 * Gets an item in the collection at the supplied index.
 * 
 * @param index int
 * The index to which to return the collection item.
 * 
 * @returns Object
 * The collection item or null if the index is out of range.
 */		
ListCollection.prototype.getItemAt = 
	function (index)
	{
		if (index < 0 || index >= this._backingArray.length)
			return null;
	
		return this._backingArray[index];
	};
	
/**
 * @function addItem
 * Adds an item to the end of the collection and dispatches a "collectionchanged" "add" event.
 * 
 * @param item Object
 * The item to add to the collection
 * 
 * @returns Object
 * The item just added to the collection.
 */	
ListCollection.prototype.addItem = 
	function (item)
	{
		return this.addItemAt(item, this._backingArray.length);
	};
	
/**
 * @function addItemAt
 * Adds an item to the collection at the supplied index and dispatches a "collectionchanged" "add" event.
 * 
 * @param item Object
 * The item to add to the collection
 * 
 * @param index int
 * The index to insert the item.
 * 
 * @returns Object
 * The item just added to the collection, or null if the index was out of range.
 */		
ListCollection.prototype.addItemAt = 
	function (item, index)
	{
		if (index < 0 || index > this._backingArray.length || item == null)
			return null;
		
		this._backingArray.splice(index, 0, item);
		
		this.dispatchEvent(new CollectionChangedEvent("add", index));
		
		return item;
	};
	
/**
 * @function removeItem
 * Removes an item from the collection and dispatches a "collectionchanged" "remove" event.
 * 
 * @param item Object
 * The item to remove from the collection.
 * 
 * @returns Object
 * The item just removed from the collection, or null if the item was not in the collection.
 */			
ListCollection.prototype.removeItem = 
	function (item)
	{
		return this.removeItemAt(this._backingArray.indexOf(item));
	};
	
/**
 * @function removeItemAt
 * Removes an item from the collection at the supplied index and dispatches a "collectionchanged" "remove" event.
 * 
 * @param index int
 * The index to remove the item.
 * 
 * @returns Object
 * The item just removed to the collection, or null if the index was out of range.
 */		
ListCollection.prototype.removeItemAt = 
	function (index)
	{
		if (index < 0 || index >= this._backingArray.length)
			return null;
		
		var removed = this._backingArray.splice(index, 1)[0]; //Returns array of removed items.
		
		this.dispatchEvent(new CollectionChangedEvent("remove", index));
		
		return removed;
	};

/**
 * @function replaceItemAt
 * Replaces an item in the collection at the supplied index and dispatches a "collectionchanged" "update" event.
 * 
 * @param item Object
 * The new item to which replace the existing item.
 * 
 * @param index int
 * The index to replace.
 * 
 * @returns Object
 * The item just replaced, or null if the index was out of range.
 */
ListCollection.prototype.replaceItemAt = 
	function (item, index)
	{
		if (index < 0 || index >= this._backingArray.length)
			return null;
		
		var oldItem = this._backingArray[index];
		this._backingArray[index] = item;
		
		this.indexUpdated(index);
		
		return oldItem;
	};
	
/**
 * @function clear
 * Clears the collection and dispatches a "collectionchanged" "reset" event.
 */	
ListCollection.prototype.clear = 
	function ()
	{
		this._backingArray.length = 0;
		
		this.dispatchEvent(new CollectionChangedEvent("reset", -1));
	};
	
/**
 * @function indexUpdated
 * Dispatches a "collectionchanged" "update" event. When a data objects internal
 * data is changed, call this to update the Container such as a DataList or DataGrid.
 * 
 * @param index int
 * The index to dispatch the "update" event.
 */	
ListCollection.prototype.indexUpdated = 
	function (index)
	{
		this.dispatchEvent(new CollectionChangedEvent("update", index));
	};