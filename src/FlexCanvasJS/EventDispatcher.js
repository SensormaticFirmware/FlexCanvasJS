
//////////////////////////////////////////////////////////////////////
/////////////////////EventDispatcher//////////////////////////////////
	
/**
 * @class EventDispatcher
 * Base class for all objects that dispatch events.
 * 
 * @constructor EventDispatcher 
 * Creates new EventDispatcher instance.
 */
function EventDispatcher()
{
	this._eventListeners = Object.create(null); //Map of arrays by event name.
}
	
//EventDispatcher is base object, no inheritance.
EventDispatcher.prototype.constructor = EventDispatcher;

///////////EventDispatcher Public Functions///////////////////////////

/**
 * @function addEventListener
 * Registers an event lister function to be called when an event occurs.
 * 
 * @param type String
 * String representing the event type.
 * 
 * @param callback Function
 * Function to be called when the event occurs.
 */
EventDispatcher.prototype.addEventListener = 
	function (type, callback)
	{
		if (this._eventListeners[type] == null)
			this._eventListeners[type] = [];
		
		this._eventListeners[type].push(callback);
	};

/**
 * @function removeEventListener
 * Removes a callback from the EventDispatcher
 * 
 * @param type String
 * String representing the event type.
 * 
 * @param callback Function
 * Function callback to be removed.
 * 
 * @returns boolean
 * Returns true if the callback was successfully removed, otherwise false
 * such as if the function callback was not previously registered.
 */	
EventDispatcher.prototype.removeEventListener = 
	function (type, callback)
	{
		if (!(type in this._eventListeners))
			return false;
	
		for (var i = 0; i < this._eventListeners[type].length; i++)
		{
			if (this._eventListeners[type][i] == callback)
			{
				this._eventListeners[type].splice(i, 1);
				return true;
			}
		}
		
		return false;
	};

/**
 * @function hasEventListener
 * Checks if an event listener has been registered with this EventDispatcher
 * 
 * @param type String
 * String representing the event type.
 * 
 * @param callback Function
 * Function callback to be called when the event occurs. This may be null to check
 * if the EventDispatcher has any events registered for the provided type.
 * 
 * @returns boolean
 * Returns true if the EventDispatcher has the provided callback registered for the 
 * provided type, or any callback for the provided type if the callback parameter is null.
 * Otherwise, returns false.
 */	
EventDispatcher.prototype.hasEventListener = 
	function (type, callback)
	{
		if (!(type in this._eventListeners))
			return false;
	
		if (callback == null)
		{
			if (this._eventListeners[type].length > 0)
				return true;
			
			return false;
		}
		
		
		for (var i = 0; i < this._eventListeners[type].length; i++)
		{
			if (this._eventListeners[type][i] == callback)
				return true;
		}
		
		return false;
	};

///////////EventDispatcher Internal Functions///////////////////////////	
	
/**
 * @function _dispatchEvent
 * Dispatches an event to be processed by registered event listeners. The Event's target is the
 * EventDispatcher which called _dispatchEvent. The Event will be cloned prior to passing to callback functions
 * to ensure the callback cannot modify the Event data or properties. You can check if the event was canceled
 * by calling the Event's getIsCanceled after dispatching it. Re-dispatching the same event will re-set its canceled state to false.
 * 
 * @param event DispatcherEvent
 * The DispatcherEvent class or subclass to be dispatched. 
 */	
EventDispatcher.prototype._dispatchEvent = 
	function (event)
	{
		event._canceled = false;
	
		if (event._type in this._eventListeners && this._eventListeners[event._type].length > 0)
		{
			//Copy the list of event handlers, if event handlers add/remove other handlers or themselves, 
			//we dont want to miss an event, or inconsistently dispatch newly added events.
			var listeners = this._eventListeners[event._type].slice();
			
			//TODO: Sort by priority (no priority available yet).
			
			var cloneEvent = null;
			for (var i = 0; i < listeners.length; i++)
			{
				//Clone the event so the handler can't fudge our event data.
				cloneEvent = event.clone(); 
				cloneEvent._target = this;				

				listeners[i](cloneEvent);
				
				if (cloneEvent._canceled == true)
				{
					event._canceled = true;
					return;
				}
			}
		}
	};	
	
	
	