
/**
 * @depends ElementEvent.js
 */

//////////////////////////////////////////////////////////////////////////	
/////////////////////ElementMouseEvent////////////////////////////////////

/**
 * @class ElementMouseEvent
 * @inherits ElementEvent
 * 
 * Event class used to represent mouse events of type "mousedown", "mouseup" or "click". 
 * Every "mousedown" event is always paired with a "mouseup" event. Note that the mouse is
 * not necessarily still over the same object when "mouseup" is dispatched. The user may have
 * pressed and then moved the mouse before releasing. A "click" event however, is only dispatched
 * if the mouse is still over the "mousedown" object when the mouse is released.
 * 
 * @constructor ElementMouseEvent 
 * Creates new ElementMouseEvent instance.
 * 
 * @param type String
 * String representing the event type ("mousedown", "mouseup", or "click")
 * 
 * @param x int
 * The X coordinate of the mouse relative to the object dispatching the mouse event.
 * 
 * @param y int
 * The Y coordinate of the mouse relative to the object dispatching the mouse event.
 */
function ElementMouseEvent(type, x, y)
{
	ElementMouseEvent.base.prototype.constructor.call(this, type, true);
	
	this._x = x; 
	this._y = y;
}

//Inherit from ElementEvent
ElementMouseEvent.prototype = Object.create(ElementEvent.prototype);
ElementMouseEvent.prototype.constructor = ElementMouseEvent;
ElementMouseEvent.base = ElementEvent;

/**
 * @function getX
 * 
 * Gets the X coordinate of the mouse relative to the object dispatching the mouse event. 
 * 
 * @returns int
 * The X coordinate of the mouse relative to the object dispatching the mouse event. 
 */
ElementMouseEvent.prototype.getX = 
	function()
	{
		return this._x;
	};
	
/**
 * @function getY
 * 
 * Gets the Y coordinate of the mouse relative to the object dispatching the mouse event. 
 * 
 * @returns int
 * The Y coordinate of the mouse relative to the object dispatching the mouse event. 
 */	
ElementMouseEvent.prototype.getY = 
	function()
	{
		return this._y;
	};
	
//@Override
ElementMouseEvent.prototype.clone =
	function ()
	{
		var clonedEvent = ElementMouseEvent.base.prototype.clone.call(this);
		
		//No additional property copies (handled by constructor)
		
		return clonedEvent;
	};
	
//@Override
ElementMouseEvent.prototype._cloneInstance = 
	function ()
	{
		return new ElementMouseEvent(this._type, this._x, this._y);
	};
	