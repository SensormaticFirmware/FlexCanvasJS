
//////////////////////////////////////////////////////////////////////
/////////////////////DispatcherEvent//////////////////////////////////

/**
 * @class DispatcherEvent
 * Base class for all events.
 * 
 * @constructor DispatcherEvent 
 * Creates new DispatcherEvent instance
 * 
 * @param type String
 * String representing the event type
 * 
 */
function DispatcherEvent(type)
{
	this._type = type;
	
	this._target = null;
	this._canceled = false;
}

//DispatcherEvent is base object, no inheritance.
DispatcherEvent.prototype.constructor = DispatcherEvent;


/**
 * @function getType
 * Gets the event type
 * 
 * @returns String
 * String representing the event type
 */
DispatcherEvent.prototype.getType = 
	function ()
	{
		return this._type;
	};

	
/**
 * @function getTarget
 * Gets event target
 * 
 * @returns Object
 * Object that originally dispatched the event 
 */	
DispatcherEvent.prototype.getTarget = 
	function ()
	{
		return this._target;
	};

/**
 * @function cancelEvent
 * Prevents processing of any subsequent event handlers
 */
DispatcherEvent.prototype.cancelEvent = 
	function ()
	{
		this._canceled = true;
	};	
	
/**
 * @function getIsCanceled
 * Checks if the event has been canceled
 * 
 * @returns boolean
 * Returns true if the event has been canceled, otherwise false
 */	
DispatcherEvent.prototype.getIsCanceled = 
	function ()
	{
		return this._canceled;
	};
	
/**
 * @function clone
 * Duplicates an instance of an Event or Event subclass. 
 * The event dispatcher calls this when dispatching or re-dispatching events to multiple targets. 
 * When creating a custom event class, you should override this and call the base class's clone() 
 * then copy the new event properties to the cloned instance.
 * 
 * @returns DispatcherEvent
 * A new event object instance identical to the cloned instance.
 */	
DispatcherEvent.prototype.clone = 
	function ()
	{
		var clonedEvent = this._cloneInstance();
		
		clonedEvent._target = this._target;
		clonedEvent._canceled = this._canceled;
		
		return clonedEvent;
	};
	
/**
 * @function _cloneInstance
 * Calls and returns the constructor() of the appropriate event subclass when cloning an event. 
 * When creating a custom event class, you should override this and return the appropriate event subclass type.
 * 
 * @returns DispatcherEvent
 * A new event instance of the same type being cloned.
 */	
DispatcherEvent.prototype._cloneInstance = 
	function ()
	{
		return new DispatcherEvent(this._type);
	};	
	
	