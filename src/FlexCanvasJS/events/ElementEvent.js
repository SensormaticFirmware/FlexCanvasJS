
/**
 * @depends DispatcherEvent.js
 */

//////////////////////////////////////////////////////////////////////
/////////////////////ElementEvent/////////////////////////////////////	

/**
 * @class ElementEvent
 * @inherits DispatcherEvent
 * 
 * Base class for CanvasElement UI events. ElementEvents support
 * capture and bubbling phase when dispatched from CanvasElement(s). A bubbling event
 * invokes capture listeners from the root parent to the target child element and then
 * bubbling (normal) listeners from the target element to the root parent. 
 * Bubbling events are used to detect events dispatched on child elements.
 * Capture events are typically not needed but sometimes useful if you wish to 
 * detect an event before the target has a chance to process it.
 * 
 * For Example, when a Button dispatches a ElementMouseEvent.
 * The event propagates from the root parent (CanvasManager) down the display chain
 * from child to child dispatching capture events to any parents with registered listeners. 
 * Once reaching the target element (Button) the event then propagates back up the display chain 
 * from parent to parent dispatching bubbling events.  
 * You may cancel the event at any time to stop the event flow.
 * 
 * 
 * @constructor ElementEvent 
 * Creates new ElementEvent instance.
 * 
 * @param type String
 * String representing the event type
 * 
 * @param bubbles boolean
 * True if the ElementEvent should be dispatch capture and bubbling events.
 */

function ElementEvent(type, bubbles)
{
	ElementEvent.base.prototype.constructor.call(this, type);
	
	this._currentTarget = null;
	this._bubbles = bubbles;
	this._phase = null;  // "capture" || "bubble"
	this._defaultPrevented = false;
}

//Inherit from DispatcherEvent
ElementEvent.prototype = Object.create(DispatcherEvent.prototype);
ElementEvent.prototype.constructor = ElementEvent;
ElementEvent.base = DispatcherEvent;

/**
 * @function getCurrentTarget
 * 
 * Gets the element that is currently dispatching the event. Note that is
 * is not always the same as getTarget() which returns the element that
 * originally dispatched the event. 
 * 
 * For Example, when a click listener is registered to an element, and a child of that
 * element dispatches a click (like a Button), the target will be the child (Button) and the 
 * current target will be the element that registered the click listener.
 * 
 * 
 * @returns CanvasElement
 * The element that is currently dispatching the event.
 */
ElementEvent.prototype.getCurrentTarget = 
	function ()
	{
		return this._currentTarget;
	};

/**
 * @function getPhase
 * 
 * Gets the current phase of the event. ("bubbling" or "capture")
 * 
 * @returns String
 * String representing the event's current phase when dispatched ("bubbling" or "capture")
 */
ElementEvent.prototype.getPhase = 
	function ()
	{
		return this._phase;
	};
	
/**
 * @function preventDefault
 * 
 * Prevents the event's typical action from being taken. This is also sometimes used to "consume"
 * the event so it is only processed once. Such as preventing a mousewheel event from scrolling multiple
 * parent/child views at once. A scroll-able child will call preventDefault() to "consume" the event
 * and prevent any parents from also scrolling.
 */	
ElementEvent.prototype.preventDefault = 
	function ()
	{
		this._defaultPrevented = true;
	};

/**
 * @function getDefaultPrevented
 * 
 * Gets the default prevented state of the event.
 * 
 * @returns boolean
 * Returns true if preventDefault() has been called, false otherwise.
 */	
ElementEvent.prototype.getDefaultPrevented = 
	function ()
	{
		return this._defaultPrevented;
	};
	
//@Override	
ElementEvent.prototype.clone = 
	function ()
	{
		var clonedEvent = ElementEvent.base.prototype.clone.call(this);
		
		clonedEvent._currentTarget = this._currentTarget;
		clonedEvent._phase = this._phase;
		clonedEvent._defaultPrevented = this._defaultPrevented;
		clonedEvent._bubbles = this._bubbles; //Need to set, some subclasses always pass true in constructor.
		
		return clonedEvent;
	};
	
//@Override	
ElementEvent.prototype._cloneInstance = 
	function ()
	{
		return new ElementEvent(this._type, this._bubbles);
	};