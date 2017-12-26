
/**
 * @depends ElementMouseEvent.js
 */

//////////////////////////////////////////////////////////////////////////
/////////////////////ElementMouseWheelEvent///////////////////////////////

/**
 * @class ElementMouseWheelEvent
 * @inherits ElementMouseEvent
 * 
 * Event class used to represent mouse wheel events of type "wheel". 
 * 
 * 
 * @constructor ElementMouseWheelEvent 
 * Creates new ElementMouseWheelEvent instance.
 * 
 * @param x int
 * The X coordinate of the mouse relative to the object dispatching the mouse event.
 * 
 * @param y int
 * The Y coordinate of the mouse relative to the object dispatching the mouse event.
 * 
 * @param deltaX int
 * The change of the X position of the the mouse wheel. (Currently -1, 0, or +1)
 * 
 * @param deltaY int
 * The change of the Y position of the the mouse wheel. (Currently -1, 0, or +1)
 */
function ElementMouseWheelEvent(x, y, deltaX, deltaY)
{
	ElementMouseWheelEvent.base.prototype.constructor.call(this, "wheel", x, y);

	this._deltaX = deltaX;
	this._deltaY = deltaY;
}

//Inherit from ElementMouseEvent
ElementMouseWheelEvent.prototype = Object.create(ElementMouseEvent.prototype);
ElementMouseWheelEvent.prototype.constructor = ElementMouseWheelEvent;
ElementMouseWheelEvent.base = ElementMouseEvent;	

/**
 * @function getDeltaX
 * 
 * Gets the change of the X position of the mouse wheel. The system normalizes this
 * across browsers to values -1, 0, or +1. 
 * 
 * @returns int
 * The change of the X position of the mouse wheel.
 */
ElementMouseWheelEvent.prototype.getDeltaX = 
	function()
	{
		return this._deltaX;
	};
	
/**
 * @function getDeltaY
 * 
 * Gets the change of the Y position of the mouse wheel. The system normalizes this
 * across browsers to values -1, 0, or +1. 
 * 
 * @returns int
 * The change of the Y position of the mouse wheel.
 */	
ElementMouseWheelEvent.prototype.getDeltaY = 
	function()
	{
		return this._deltaY;
	};
	
//@Override
ElementMouseWheelEvent.prototype.clone =
	function ()
	{
		var clonedEvent = ElementMouseWheelEvent.base.prototype.clone.call(this);
		
		//No additional property copies (handled by constructor)
		
		return clonedEvent;
	};
	
//@Override
ElementMouseWheelEvent.prototype._cloneInstance = 
	function ()
	{
		return new ElementMouseWheelEvent(this._x, this._y, this._deltaX, this._deltaY);
	};
	