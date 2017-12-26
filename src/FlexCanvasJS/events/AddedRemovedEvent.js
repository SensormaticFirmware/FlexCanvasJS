
/**
 * @depends DispatcherEvent.js
 */

//////////////////////////////////////////////////////////////////////
/////////////////////AddedRemovedEvent////////////////////////////////		
	
/**
 * @class AddedRemovedEvent
 * @inherits DispatcherEvent
 * 
 * Event that is dispatched when a CanvasElement is added or removed from
 * a CanvasManager and can be of type "added" or "removed". This is used to detect
 * when an Element is added or removed from the display and to create / destroy or 
 * associate / dissociate resources. For example, CanvasElement uses these events
 * to add and remove event listeners to its associated StyleDefinitions which are 
 * external resources and would cause memory leaks if not cleaned up. 
 * 
 * 
 * @constructor AddedRemovedEvent 
 * Creates new AddedRemovedEvent instance.
 * 
 * @param type String
 * String representing the event type ("added" or "removed")
 * 
 * @param manager CanvasManager
 * The CanvasManager instance that the element is being added or removed.
 */
function AddedRemovedEvent(type, manager)
{
	AddedRemovedEvent.base.prototype.constructor.call(this, type);
	
	this._manager = manager;
}	
	
//Inherit from DispatcherEvent
AddedRemovedEvent.prototype = Object.create(DispatcherEvent.prototype);
AddedRemovedEvent.prototype.constructor = AddedRemovedEvent;
AddedRemovedEvent.base = DispatcherEvent;

/**
 * @function getManager
 * Gets the CanvasManager instance that the Element has been added or removed. 
 * Note that when an element is removed, the Element is no longer associated with the CanvasManager
 * so you must use this method to get the appropriate CanvasManager reference.
 * 
 * @returns CanvasManager
 * The CanvasManager instance the element is now associated with when added, or no longer associated with when removed.
 */
AddedRemovedEvent.prototype.getManager = 
	function ()
	{
		return this._manager;
	};
	
//@Override
AddedRemovedEvent.prototype.clone =
	function ()
	{
		var clonedEvent = AddedRemovedEvent.base.prototype.clone.call(this);
		
		//No additional property copies (handled by constructor)
		
		return clonedEvent;
	};
	
//@Override
AddedRemovedEvent.prototype._cloneInstance = 
	function ()
	{
		return new AddedRemovedEvent(this._type, this._manager);
	};	
	
	