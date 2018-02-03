
///////////////////////////////////////////////////////
//////////////////Tween////////////////////////////////
	
/**
 * @class Tween
 * 
 * Tween is a helper class that is used to interpolate values
 * across a given time span and is essentially just a calculator. 
 * It can be used for nearly any type of animation and supports
 * easing for acceleration and deceleration. 
 * 
 * If you're unsure about easing, a hint is that SineInOut is a kind of magic salt 
 * you can sprinkle on just about any linear animation that usually makes everything 
 * look smoother and less jarring without being obvious.
 * 
 * @constructor Tween 
 * Creates new Tween instance.
 */
function Tween()
{
	/**
	 * @member startVal Number
	 * Beginning value at the start time of the tween.
	 */
	this.startVal = 0;
	
	/**
	 * @member endVal Number
	 * Ending value at the end time of the tween duration.
	 */
	this.endVal = 0;
	
	/**
	 * @member duration Number
	 * Duration in milliseconds the tween will run.
	 */
	this.duration = 0;
	
	/**
	 * @member startTime Number
	 * Time in milliseconds that the tween should start as returned by Date.now().
	 */
	this.startTime = null;
	
	/**
	 * @member easingFunction Function
	 * Easing function to use when calculating the tween value. This is used
	 * to create acceleration/deceleration. Setting this to null will result
	 * in a linear tween. This is a function that accepts a fraction
	 * between 0 and 1 and returns a fraction between 0 and 1. The result is used
	 * to calculate the value based on progress and start/end values. There are several
	 * standard easing functions built in as static functions of Tween that you can set to this.
	 */
	this.easingFunction = null;
}
	
//Tween is base object, no inheritance.
Tween.prototype.constructor = Tween;


/**
 * @function getProgress
 * Gets the current progress of the tween based on the start time and the current time.
 * 
 * @param time Number
 * The current time as returned by Date.now().
 * 
 * @returns Number
 * Fraction between 0 and 1.
 */
Tween.prototype.getProgress = 
	function (time)
	{
		if (time >= this.startTime + this.duration)
			return 1;
		else if (time <= this.startTime)
			return 0;
		
		return (time - this.startTime) / this.duration;
	};
	
/**
 * @function getValue
 * Gets the current value based on the supplied time.
 * 
 * @param time Number
 * The current time as returned by Date.now().
 * 
 * @returns Number
 * A number between the start and end values (inclusive).
 */	
Tween.prototype.getValue = 
	function (time)
	{
		var progress = this.getProgress(time);
		
		if (progress == 1)
			return this.endVal;
		else if (progress == 0)
			return this.startVal;
	
		if (this.easingFunction != null)
			progress = this.easingFunction(progress);
		
		var range = Math.abs(this.endVal - this.startVal);
		
		if (this.startVal < this.endVal)
			return this.startVal + (range * progress);
		
		return this.startVal - (range * progress);
	};

//////Static//////////////////
	
/**
 * @function easeInQuad
 * @static
 * Use for quadratic easing.
 * 
 * @param fraction Number
 * A number between 0 and 1.
 * 
 * @returns Number
 * A number between 0 and 1.
 */	
Tween.easeInQuad = 
	function (fraction)
	{
		return fraction * fraction;
	};
	
/**
 * @function easeOutQuad
 * @static
 * Use for quadratic easing.
 * 
 * @param fraction Number
 * A number between 0 and 1.
 * 
 * @returns Number
 * A number between 0 and 1.
 */		
Tween.easeOutQuad = 
	function (fraction)
	{
		return 1 - Tween.easeInQuad(1 - fraction);
	};

/**
 * @function easeInOutQuad
 * @static
 * Use for quadratic easing.
 * 
 * @param fraction Number
 * A number between 0 and 1.
 * 
 * @returns Number
 * A number between 0 and 1.
 */		
Tween.easeInOutQuad = 
	function (fraction)
	{
		if (fraction < 0.5)
			return Tween.easeInQuad(fraction * 2.0) / 2.0;
		
		return 1 - (Tween.easeInQuad((1 - fraction) * 2.0) / 2.0);  
	};
	
/**
 * @function easeInCubic
 * @static
 * Use for cubic easing.
 * 
 * @param fraction Number
 * A number between 0 and 1.
 * 
 * @returns Number
 * A number between 0 and 1.
 */		
Tween.easeInCubic = 
	function (fraction)
	{
		return Math.pow(fraction, 3);
	};
	
/**
 * @function easeOutCubic
 * @static
 * Use for cubic easing.
 * 
 * @param fraction Number
 * A number between 0 and 1.
 * 
 * @returns Number
 * A number between 0 and 1.
 */		
Tween.easeOutCubic = 
	function (fraction)
	{
		return 1 - Tween.easeInCubic(1 - fraction);
	};

/**
 * @function easeInOutCubic
 * @static
 * Use for cubic easing.
 * 
 * @param fraction Number
 * A number between 0 and 1.
 * 
 * @returns Number
 * A number between 0 and 1.
 */		
Tween.easeInOutCubic = 
	function (fraction)
	{
		if (fraction < 0.5)
			return Tween.easeInCubic(fraction * 2.0) / 2.0;
		
		return 1 - (Tween.easeInCubic((1 - fraction) * 2.0) / 2.0);  
	};	
	
/**
 * @function easeOutSine
 * @static
 * Use for sine easing.
 * 
 * @param fraction Number
 * A number between 0 and 1.
 * 
 * @returns Number
 * A number between 0 and 1.
 */		
Tween.easeOutSine = 
	function (fraction)
	{
		return Math.sin(fraction * (Math.PI / 2.0));
	};

/**
 * @function easeInSine
 * @static
 * Use for sine easing.
 * 
 * @param fraction Number
 * A number between 0 and 1.
 * 
 * @returns Number
 * A number between 0 and 1.
 */		
Tween.easeInSine = 
	function (fraction)
	{
		return 1 - Tween.easeOutSine(1 - fraction);
	};	
	
/**
 * @function easeInOutSine
 * @static
 * Use for sine easing.
 * 
 * @param fraction Number
 * A number between 0 and 1.
 * 
 * @returns Number
 * A number between 0 and 1.
 */		
Tween.easeInOutSine = 
	function (fraction)
	{
		if (fraction < 0.5)
			return Tween.easeInSine(fraction * 2.0) / 2.0;
		
		return 1 - (Tween.easeInSine((1 - fraction) * 2.0) / 2.0);  
	};
	
	


///////////////////////////////////////////////////////////////////////////	
///////////////////////StyleProxy////////////////////////////////////////		
	
/**
 * @class StyleProxy
 * 
 * Internal class used to wrap CanvasElements to proxy styles to other elements. 
 * This should only be used by component developers. When a proxy is assigned
 * to an element, the proxy is included in its style chain lookup after assigned
 * styles (instance, and styleDefinition) but before default styles.   
 * 
 * @constructor StyleProxy 
 * Creates new StyleProxy instance.
 * 
 * @param styleProxyElement CanvasElement
 * The element to proxy styles from.
 * 
 * @param styleProxyMap Object
 * A map of styleNames to proxy. This Object is walked for members so
 * should always be created using a null prototype: Object.create(null) and
 * members created for each styleName to proxy (set to true). 
 * 
 * MyProxyMap = Object.create(null);
 * MyProxyMap.StyleName1 = true;
 * MyProxyMap.StyleName2 = true;
 * 
 * MyProxyMap._Arbitrary = true; 
 * 
 * _Arbitrary is a special flag that indicates all styles that are not defined / unknown 
 * by the element will also be proxied.
 * 
 * For example, a Button will proxy several styles to its skins such as "BackgroundColor" by including
 * them in the proxy map it passes to its skins. Styles like "Visible" however, are omitted from the proxy
 * map. Also, the button sets the _Arbitrary flag so any styles the Button is not aware of and does not define itself, 
 * are automatically proxied to the skin, without having to be added to the proxy map. 
 * This is so that skins may have custom styles and still be blanket set by setting the Button style itself. 
 */
function StyleProxy(styleProxyElement, styleProxyMap)
{
	this._proxyElement = styleProxyElement;
	this._proxyMap = styleProxyMap;
}

//No Inheritance
StyleProxy.prototype.constructor = StyleProxy;

	


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
	
	


/**
 * @depends DispatcherEvent.js
 */

//////////////////////////////////////////////////////////////////////
/////////////////////StyleChangedEvent////////////////////////////////	
	
/**
 * @class StyleChangedEvent
 * @inherits DispatcherEvent
 * 
 * Event that is dispatched when a style is changed of type "stylechanged". 
 * This is typically an internal event that the system uses to monitor 
 * style changes to Elements, StyleDefnitions, or any style-able objects.
 * 
 * 
 * @constructor StyleChangedEvent 
 * Creates new StyleChangedEvent instance.
 * 
 * @param styleName String
 * String representing style type that was updated
 */
function StyleChangedEvent(styleName)
{
	StyleChangedEvent.base.prototype.constructor.call(this, "stylechanged");
	
	this._styleName = styleName;
}	
	
//Inherit from DispatcherEvent
StyleChangedEvent.prototype = Object.create(DispatcherEvent.prototype);
StyleChangedEvent.prototype.constructor = StyleChangedEvent;
StyleChangedEvent.base = DispatcherEvent;

/**
 * @function getStyleName
 * Gets the style name of the style which has changed
 * 
 * @returns String
 * String representing the style that has changed
 */
StyleChangedEvent.prototype.getStyleName = 
	function ()
	{
		return this._styleName;
	};
	
//@override
StyleChangedEvent.prototype.clone =
	function ()
	{
		var clonedEvent = StyleChangedEvent.base.prototype.clone.call(this);
		
		//No additional property copies (handled by constructor)
		
		return clonedEvent;
	};
	
//@override
StyleChangedEvent.prototype._cloneInstance = 
	function ()
	{
		return new StyleChangedEvent(this._styleName, this._oldValue, this._newValue);
	};
	
	


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


/**
 * @depends ElementEvent.js
 */

//////////////////////////////////////////////////////////////////////////
/////////////////////ElementKeyboardEvent/////////////////////////////////

/**
 * @class ElementKeyboardEvent
 * @inherits ElementEvent
 * 
 * Event class used to represent keyboard events of type "keydown" or "keyup". 
 * Note that unlike mouse events, every "keydown" is not necessarily paired with a "keyup".
 * When a key is held down, "keydown" events will repeatedly be dispatched until the key
 * is released which will then dispatch a "keyup" event.
 * 
 * @constructor ElementKeyboardEvent 
 * Creates new ElementKeyboardEvent instance.
 * 
 * @param type String
 * String representing the event type ("keydown" or "keyup")
 * 
 * @param key String
 * Printable representation of the key. If the key is not printable such as
 * Shift or Return this should be an emtpy string "".
 * 
 * @param keyCode int
 * The keycode of the key that caused the event.
 * 
 * @param ctrl boolean
 * True if the ctrl key is pressed, false otherwise.
 * 
 * @param alt boolean
 * True if the alt key is pressed, false otherwise.
 * 
 * @param shift boolean
 * True if the shift key is pressed, false otherwise.
 * 
 * @param meta boolean
 * True if the meta key (such as windows key) is pressed, false otherwise.
 */
function ElementKeyboardEvent(type, key, keyCode, ctrl, alt, shift, meta)
{
	ElementKeyboardEvent.base.prototype.constructor.call(this, type, true);
	
	//IE key names are different... normalize
	if (key == "Spacebar")
		key = " ";
	else if (key == "Left")
		key = "ArrowLeft";
	else if (key == "Right")
		key = "ArrowRight";		
	else if (key == "Del")
		key = "Delete";
	
	this._key = key;
	this._keyCode = keyCode;
	
	this._ctrl = ctrl;
	this._alt = alt;
	this._shift = shift;
	this._meta = meta;
}

//Inherit from ElementEvent
ElementKeyboardEvent.prototype = Object.create(ElementEvent.prototype);
ElementKeyboardEvent.prototype.constructor = ElementKeyboardEvent;
ElementKeyboardEvent.base = ElementEvent;	

/**
 * @function getKey
 * 
 * Gets the printable version of the key which caused the event. 
 * 
 * @returns String
 * The printable version of the key which caused the event. Empty string "" if the
 * key is not printable.
 */
ElementKeyboardEvent.prototype.getKey = 
	function ()
	{
		return this._key;
	};
	
/**
 * @function getKeyCode
 * 
 * Gets the key code of the key which caused the event. 
 * 
 * @returns int
 * The keycode of the key which caused the event.
 */	
ElementKeyboardEvent.prototype.getKeyCode = 
	function ()
	{
		return this._keyCode;
	};	

/**
 * @function getCtrl
 * 
 * Gets the state of the ctrl key. 
 * 
 * @returns boolean
 * True if the ctrl key is pressed, otherwise false.
 */	
ElementKeyboardEvent.prototype.getCtrl = 
	function ()
	{
		return this._ctrl;
	};		

/**
 * @function getAlt
 * 
 * Gets the state of the alt key. 
 * 
 * @returns boolean
 * True if the alt key is pressed, otherwise false.
 */		
ElementKeyboardEvent.prototype.getAlt = 
	function ()
	{
		return this._alt;
	};

/**
 * @function getShift
 * 
 * Gets the state of the shift key. 
 * 
 * @returns boolean
 * True if the shift key is pressed, otherwise false.
 */	
ElementKeyboardEvent.prototype.getShift = 
	function ()
	{
		return this._shift;
	};	
	
/**
 * @function getMeta
 * 
 * Gets the state of the meta key (such as the windows key). 
 * 
 * @returns boolean
 * True if the meta key is pressed, otherwise false.
 */		
ElementKeyboardEvent.prototype.getMeta = 
	function ()
	{
		return this._meta;
	};		
	
//@Override
ElementKeyboardEvent.prototype.clone =
	function ()
	{
		var clonedEvent = ElementKeyboardEvent.base.prototype.clone.call(this);
		
		//No additional property copies (handled by constructor)
		
		return clonedEvent;
	};
	
//@Override
ElementKeyboardEvent.prototype._cloneInstance = 
	function ()
	{
		return new ElementKeyboardEvent(this._type, 
				this._key, this._keyCode, 
				this._ctrl, this._alt, this._shift, this._meta);
	};	
	


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
	
	
	


/**
 * @depends EventDispatcher.js
 */

///////////////////////////////////////////////////////////////////
///////////////////////ToggleButtonGroup///////////////////////////

/**
 * @class ToggleButtonGroup
 * @inherits EventDispatcher
 * 
 * Convenience helper class for grouping ToggleButtons or subclasses.
 * The ToggleButtonGroup can be assigned to set of toggle buttons
 * and will only allow a single ToggleButton to be selected at a time.
 * When a ToggleButton changes state, the ToggleButtonGroup will dispatch
 * a changed event. Use this for functionality like RadioButtons and Tabs.
 * 
 * @constructor ToggleButtonGroup 
 * Creates new ToggleButtonGroup instance.
 */
function ToggleButtonGroup()
{
	ToggleButtonGroup.base.prototype.constructor.call(this);
	
	this._selectedButton = null;
	
	this._toggleButtons = [];
	
	var _self = this;
	
	this._toggleButtonChangedInstance =
		function (event)
		{
			_self._toggleButtonChanged(event);
		};
}

//Inherit from EventDispatcher
ToggleButtonGroup.prototype = Object.create(EventDispatcher.prototype);
ToggleButtonGroup.prototype.constructor = ToggleButtonGroup;
ToggleButtonGroup.base = EventDispatcher;

////////////Events/////////////////////////////////////

/**
 * @event changed DispatcherEvent
 * Dispatched when the selected ToggleButton is changed due to user interaction.
 */

//////////////Public Functions/////////////////////////////////////////

/**
 * @function addButton
 * Adds a ToggleButton or subclass to be managed by ToggleButtonGroup.
 * 
 * @param toggleButton ToggleButtonElement
 * ToggleButton or subclass to be managed by ToggleButtonGroup.
 * 
 * @returns boolean
 * True when successfully added, false if is not a instance of ToggleButton or already added.
 */	
ToggleButtonGroup.prototype.addButton = 
	function (toggleButton)
	{
		if (toggleButton == null || 
			toggleButton instanceof ToggleButtonElement == false ||
			this._toggleButtons.indexOf(toggleButton) > -1)
			return false;
		
		this._toggleButtons.push(toggleButton);
		toggleButton.addEventListener("changed", this._toggleButtonChangedInstance);
		
		return true;
	};

/**
 * @function removeButton
 * Removes a ToggleButton or subclass currently being managed by ToggleButtonGroup
 * 
 * @param toggleButton ToggleButtonElement
 * ToggleButton or subclass to be removed from ToggleButtonGroup.
 * 
 * @returns boolean
 * True when successfully removed, false if the toggle button is not currently managed by ToggleButtonGroup.
 */		
ToggleButtonGroup.prototype.removeButton = 
	function (toggleButton)
	{
		var index = this._toggleButtons.indexOf(toggleButton);
	
		if (index == -1)
			return false;
		
		this._toggleButtons.splice(index, 1);
		toggleButton.removeEventListener("changed", this._toggleButtonChangedInstance);
	};	

/**
 * @function clearButtons
 * Removes all ToggleButtons currently managed by ToggleButtonGroup.
 */		
ToggleButtonGroup.prototype.clearButtons = 
	function ()
	{
		for (var i = 0; i < this._toggleButtons.length; i++)
			this._toggleButtons[i].removeEventListener("changed", this._toggleButtonChangedInstance);
		
		this._toggleButtons = [];
	};
	
/**
 * @function setSelectedButton
 * Sets the ToggleButton to be selected.
 * 
 * @param toggleButton ToggleButtonElement
 * ToggleButton or subclass to be selected. May be set to null.
 */	
ToggleButtonGroup.prototype.setSelectedButton = 
	function (toggleButton)
	{
		if (this._selectedButton = toggleButton)
			this._selectedButton.setSelected(true);
		else if (toggleButton == null || this._toggleButtons.indexOf(toggleButton) > -1)
		{
			this._selectedButton = toggleButton;
			
			if (this._selectedButton != null)
				this._selectedButton.setSelected(true);
			
			for (var i = 0; i < this._toggleButtons.length; i++)
			{
				if (this._toggleButtons[i] != toggleButton)
					this._toggleButtons[i].setSelected(false);
			}
		}
	};
	
/**
 * @function getSelectedButton
 * Gets the selected ToggleButton.
 * 
 * @returns ToggleButtonElement
 * ToggleButton or subclass currently selected. May be null.
 */		
ToggleButtonGroup.prototype.getSelectedButton = 
	function ()
	{
		return this._selectedButton;
	};
	
////////////////////Internal/////////////////////////
	
	
/**
 * @function _toggleButtonChanged
 * Event handler for managed ToggleButton's "changed" event. 
 * Updates toggle button selected states and dispatches "changed" event.
 * 
 * @param event ElementEvent
 * ElementEvent to be processed.
 */		
ToggleButtonGroup.prototype._toggleButtonChanged = 
	function (elementEvent)
	{
		var toggleButton = elementEvent.getTarget();
		
		if (toggleButton.getSelected() == true)
			this._selectedButton = toggleButton;
		else
			this._selectedButton = null;
		
		for (var i = 0; i < this._toggleButtons.length; i++)
		{
			if (this._toggleButtons[i] != toggleButton)
				this._toggleButtons[i].setSelected(false);
		}
		
		//Dispatch changed event.
		if (this.hasEventListener("changed", null) == true)
			this._dispatchEvent(new DispatcherEvent("changed", false));
	};
	
	


/**
 * @depends EventDispatcher.js
 */

///////////////////////////////////////////////////////////////////
///////////////////////StyleDefinition/////////////////////////////	

/**
 * @class StyleDefinition
 * @inherits EventDispatcher
 * 
 * Stores a key value data set of style values by name.
 * 
 * 
 * @constructor StyleDefinition 
 * Creates new StyleDefinition instance.
 */
function StyleDefinition()
{
	StyleDefinition.base.prototype.constructor.call(this);

	this._styleMap = Object.create(null);
}

//Inherit from EventDispatcher
StyleDefinition.prototype = Object.create(EventDispatcher.prototype);
StyleDefinition.prototype.constructor = StyleDefinition;
StyleDefinition.base = EventDispatcher;

/**
 * @event stylechanged StyleChangedEvent
 * 
 * Dispatched when a style is added, cleared, or changed.
 */


/**
 * @function getStyle
 * Gets the stored style value for this object.
 * 
 * @param styleName String
 * String representing the style to return.
 * 
 * @returns Any
 * Returns the associated style value if found, otherwise undefined.
 */	
StyleDefinition.prototype.getStyle = 
	function (styleName)
	{
		if (styleName in this._styleMap)
			return this._styleMap[styleName];
		
		return undefined;
	};

/**
 * @function setStyle
 * Sets the stored style value for this object.
 * 
 * @param styleName String
 * String representing the style to set.
 * 
 * @param value Any
 * The value to store. This may be null or undefined. 
 * Note that a null style is different from an absent (undefined) style. A null style
 * will terminate a style chain lookup and return null value. An undefined style will cause
 * the system to look further up the style chain for a value. Passing undefined is the
 * same as calling clearStyle().
 */
StyleDefinition.prototype.setStyle = 
	function (styleName, value)
	{
		var oldStyle = undefined;
		if (styleName in this._styleMap)
			oldStyle = this._styleMap[styleName];
		
		//No change
		if (oldStyle === value)
			return;
	
		if (this.hasEventListener("stylechanged", null) == true)
		{
			oldStyle = this.getStyle(styleName);
			
			if (value === undefined)
				delete this._styleMap[styleName];
			else
				this._styleMap[styleName] = value;
			
			var newStyle = this.getStyle(styleName);
			
			//Strict equality required (undefined !== null)
			if (newStyle !== oldStyle)
				this._dispatchEvent(new StyleChangedEvent(styleName));
		}
		else
		{
			if (value === undefined)
				delete this._styleMap[styleName];
			else
				this._styleMap[styleName] = value;
		}
	};

/**
 * @function clearStyle
 * Clears style data from this object. This is the same 
 * passing undefined to setStyle().
 * 
 * @param styleName String
 * String representing the style to clear.
 */		
StyleDefinition.prototype.clearStyle = 
	function (styleName)
	{
		this.setStyle(styleName, undefined);
	};
	
	


/**
 * @depends StyleDefinition.js
 */

///////////////////////////////////////////////////////////////////////////	
/////////////////////////StyleData/////////////////////////////////////////

/**
 * @class StyleData
 * 
 * Storage class for style data.
 * 
 * 
 * @constructor StyleData 
 * Creates new StyleData instance.
 * 
 * @param styleName String
 * String representing style name for associated data.
 */

function StyleData(styleName)
{
	/**
	 * @member styleName string
	 * Read Only - Name of associated style
	 */
	this.styleName = styleName;
	
	/**
	 * @member value Any
	 * Read Only - Value of associated style 
	 */
	this.value = undefined;
	
	/**
	 * @member priority Array
	 * Read Only - Array of integers representing the position 
	 * in the style chain the style was found.
	 */
	this.priority = [];
}

//StyleData is base object, no inheritance.
StyleData.prototype.constructor = StyleData;

/**
 * @function equals
 * 
 * Checks if two instances of StyleData contain the same values.
 * 
 * @param equalToStyleData StyleData
 * StyleData instance to compare.
 * 
 * @returns boolean
 * Returns true when both instances contain the same values.
 */
StyleData.prototype.equals = 
	function (equalToStyleData)
	{
		if (equalToStyleData.styleName != this.styleName || 
			equalToStyleData.priority.length != this.priority.length ||
			equalToStyleData.value !== this.value)	//Strict equality required (undefined !== null)
		{
			return false;
		}
			
		for (var i = 0; i < this.priority.length; i++)
		{
			if (equalToStyleData.priority[i] != this.priority[i])
				return false;
		}
		
		return true;
	};
	
/**
 * @function comparePriority
 * Compares the style priority (position in style chain) of two StyleData instances.
 * 
 * @param compareToStyleData StyleData
 * StyleData instance to compare.
 * 
 * @returns int
 * Returns -1 if this instance is lower priority than compareToStyleData.
 * Returns +1 if this instance is higher priority than compareToStyleData.
 * Returns 0 if this instance is the same priority as compareToStyleData.
 */	
StyleData.prototype.comparePriority = 
	function (compareToStyleData)
	{
		var minLength = Math.min(this.priority.length, compareToStyleData.priority.length);
		
		for (var i = 0; i < minLength; i++)
		{
			if (this.priority[i] < compareToStyleData.priority[i])
				return +1;
			
			if (this.priority[i] > compareToStyleData.priority[i])
				return -1;
		}

		//Dont worry about different lengths... 
		//Anything with an equal priority will be the same length.
		return 0;
	};
	

	
/**
 * @function clone
 * Duplicates an instance of StyleData (deep copy). 
 * 
 * @returns StyleData
 * A new StyleData instance identical to the cloned instance.
 */	
	StyleData.prototype.clone = 
	function ()
	{
		var cloned = new StyleData(this.styleName);
		cloned.value = this.value;
		cloned.priority = this.priority.slice();
		
		return cloned;
	};	
	
	

///////////////////////////////////////////////////////////////////////////	
///////////////////////StyleableBase///////////////////////////////////////
	
/**
 * @class StyleableBase
 * @inherits StyleDefinition
 * 
 * Internal abstract base class for classes that define styles. 
 * 
 * StylableBase defines no styles itself, but allows subclasses to define them by adding  
 * and populating static Object _StyleTypes and StyleDefinition StyleDefault on the class.
 * See example.
 * 
 * inheritable: Only applicable for CanvasElements.
 * If no explicit style is set (instance, style definition, or proxy) look up the
 * parent chain for the first element supporting the style with inheritable.
 * If no style is found up the parent chain, use the element's default style.
 * 
 * Subclasses can add new styles and override the style types or defaults of their base
 * classes by creating their own _StyleTypes and StyleDefault objects.
 * 
 * Example:
 * 
 * StylableBaseSubclass._StyleTypes = Object.create(null);
 * StylableBaseSubclass._StyleTypes.Visible = 				StyleableBase.EStyleType.NORMAL;		
 * StylableBaseSubclass._StyleTypes.BorderType = 			StyleableBase.EStyleType.NORMAL;		
 * StylableBaseSubclass._StyleTypes.SkinStyle = 			StyleableBase.EStyleType.NORMAL;		
 * StylableBaseSubclass._StyleTypes.TextStyle =				StyleableBase.EStyleType.INHERITABLE;			
 * StylableBaseSubclass._StyleTypes.TextFont =				StyleableBase.EStyleType.INHERITABLE;			
 * StylableBaseSubclass._StyleTypes.TextSize =				StyleableBase.EStyleType.INHERITABLE;			
 * 
 * StylableBaseSubclass.StyleDefault = new StyleDefinition();
 * StylableBaseSubclass.StyleDefault.setStyle("Visible", 				true);
 * StylableBaseSubclass.StyleDefault.setStyle("BorderType", 			"none");
 * StylableBaseSubclass.StyleDefault.setStyle("SkinStyle", 				null);
 * StylableBaseSubclass.StyleDefault.setStyle("TextStyle", 				"normal");
 * StylableBaseSubclass.StyleDefault.setStyle("TextFont", 				"Arial");
 * StylableBaseSubclass.StyleDefault.setStyle("TextSize", 				12);
 * 
 * 
 * @constructor StyleableBase 
 * Creates new StyleableBase instance.
 */
function StyleableBase()
{
	StyleableBase.base.prototype.constructor.call(this);
}
	
//Inherit from StyleDefinition
StyleableBase.prototype = Object.create(StyleDefinition.prototype);
StyleableBase.prototype.constructor = StyleableBase;
StyleableBase.base = StyleDefinition;

//Priority enum
StyleableBase.EStylePriorities = 
	{
		INSTANCE:0,
		CLASS:1
	};

//StyleType enum
StyleableBase.EStyleType = 
	{
		NORMAL:1,
		INHERITABLE:2,
		SUBSTYLE:3
	};


//////////////Public//////////////////////

//@override	
StyleableBase.prototype.getStyle = 
	function (styleName)
	{
		return this.getStyleData(styleName).value;
	};	

//@override
StyleableBase.prototype.setStyle = 
	function (styleName, value)
	{
		var oldStyle = undefined;
		if (styleName in this._styleMap)
			oldStyle = this._styleMap[styleName];
		
		//No change
		if (oldStyle === value)
			return;
		
		if (this.hasEventListener("stylechanged", null) == true)
		{
			var oldStyleData = this.getStyleData(styleName);			
			
			//Change style
			if (value === undefined)
				delete this._styleMap[styleName];
			else
				this._styleMap[styleName] = value;
			
			var newStyleData = this.getStyleData(styleName);
			
			if (oldStyleData.equals(newStyleData) == false)
				this._dispatchEvent(new StyleChangedEvent(styleName));
		}
		else
		{
			if (value === undefined)
				delete this._styleMap[styleName];
			else
				this._styleMap[styleName] = value;
		}
	};
	
/**
 * @function getStyleData
 * 
 * Gets the style data for the supplied style name, this includes
 * additional info than getStyle() such as the style priority. You should
 * not modify the returned StyleData.
 * 
 * @param styleName String
 * String representing style to return the associated StyleData.
 * 
 * @returns StyleData
 * Returns the associated StyleData
 */	
StyleableBase.prototype.getStyleData = 
	function (styleName)
	{
		var styleData = new StyleData(styleName);
	
		styleData.value = StyleableBase.base.prototype.getStyle.call(this, styleName);
		if (styleData.value !== undefined)
		{
			styleData.priority.push(StyleableBase.EStylePriorities.INSTANCE);
			return styleData;			
		}
		
		styleData.value = this._getClassStyle(styleName);
		styleData.priority.push(StyleableBase.EStylePriorities.CLASS);
		
		return styleData;
	};
	
///////////////Internal///////////////////	
	
//@private	
StyleableBase.prototype._getStyleType = 
	function (styleName)
	{
		this._flattenStyleTypes();
		
		if (styleName in this.constructor.__StyleTypesFlatMap)
			return this.constructor.__StyleTypesFlatMap[styleName];
		
		return null;
	};

//@private	
StyleableBase.prototype._flattenStyleTypes = 
	function ()
	{
		if (this.constructor.__StyleTypesFlatMap != null)
			return;
		
		this.constructor.__StyleTypesFlatMap = Object.create(null);
		this.constructor.__StyleTypesFlatArray = [];
		
		var thisClass = this.constructor;
		var thisProto = Object.getPrototypeOf(this);
		var styleName = null;
		
		while (true)
		{
			if ("_StyleTypes" in thisClass)
			{
				for (styleName in thisClass._StyleTypes)
				{
					if (styleName in this.constructor.__StyleTypesFlatMap)
						continue;
					
					this.constructor.__StyleTypesFlatMap[styleName] = thisClass._StyleTypes[styleName];
					this.constructor.__StyleTypesFlatArray.push({styleName:styleName, styleType:thisClass._StyleTypes[styleName]});
				}
			}
			
			thisProto = Object.getPrototypeOf(thisProto);
			if (thisProto == null || thisProto.hasOwnProperty("constructor") == false)
				break;
			
			thisClass = thisProto.constructor;
		}
	};
	
/**
 * @function _getClassStyle
 * 
 * Gets the default style value for the supplied style name specified on this
 * classes StyleDefault map. Subclasses override base class values.
 *  
 * @param styleName String
 * String representing the default style to return.
 * 
 * @returns Any
 * Returns the associated default style value or undefined if none specified.
 */	
StyleableBase.prototype._getClassStyle = 
	function (styleName)
	{
		this._flattenClassStyles();
		
		if (styleName in this.constructor.__StyleDefaultsFlatMap)
			return this.constructor.__StyleDefaultsFlatMap[styleName][this.constructor.__StyleDefaultsFlatMap[styleName].length - 1];
		
		return undefined;
	};	
	
/**
 * @function _getInstanceStyle
 * 
 * Gets the assigned style value for the supplied style name specified.
 *  
 * @param styleName String
 * String representing the style to return.
 * 
 * @returns Any
 * Returns the associated style value or undefined if none specified.
 */		
StyleableBase.prototype._getInstanceStyle = 
	function (styleName)
	{
		if (styleName in this._styleMap)
			return this._styleMap[styleName];
		
		return undefined;
	};
	
/**
 * @function _applySubStylesToElement
 * 
 * Convienence function for setting sub styles of sub components.
 * Applies appropriate sub styling from this Styleable to the 
 * supplied elements definition and default definition style lists.
 *  
 * @param styleName String
 * String representing the sub style to apply.
 * 
 * @param elementToApply CanvasElement
 * The sub component element to apply sub styles.
 */		
StyleableBase.prototype._applySubStylesToElement = 
	function (styleName, elementToApply)
	{
		elementToApply._setStyleDefinitions(this._getClassStyleList(styleName), true);
		
		var instanceStyle = this._getInstanceStyle(styleName);
		if (instanceStyle !== undefined)
			elementToApply._setStyleDefinitions([instanceStyle], false);
	};	
	
/**
 * @function _getClassStyleList
 * 
 * Gets the default style values for the supplied style name specified on this
 * classes and base classes StyleDefault maps. This is used for sub styles as all
 * stub styles in the inheritance chain are applied to sub components.
 *  
 * @param styleName String
 * String representing the default style list to return.
 * 
 * @returns Array
 * Returns an array of all default styles on this class, and base classes
 * for the supplied styleName.
 */	
StyleableBase.prototype._getClassStyleList = 
	function (styleName)
	{
		this._flattenClassStyles();
	
		//Copy the array so our internal data cannot get fudged.
		if (styleName in this.constructor.__StyleDefaultsFlatMap)
			return this.constructor.__StyleDefaultsFlatMap[styleName].slice();
	
		return [];
	};
	
//@private	
StyleableBase.prototype._flattenClassStyles = 
	function ()
	{
		if (this.constructor.__StyleDefaultsFlatMap != null)
			return;
		
		this.constructor.__StyleDefaultsFlatMap = Object.create(null);
		
		var thisClass = this.constructor;
		var thisProto = Object.getPrototypeOf(this);
		var styleName = null;
		
		while (true)
		{
			if ("StyleDefault" in thisClass)
			{
				for (styleName in thisClass.StyleDefault._styleMap)
				{
					if (this.constructor.__StyleDefaultsFlatMap[styleName] == null)
						this.constructor.__StyleDefaultsFlatMap[styleName] = [];
					
					this.constructor.__StyleDefaultsFlatMap[styleName].splice(0, 0, thisClass.StyleDefault._styleMap[styleName]);
				}
			}
			
			thisProto = Object.getPrototypeOf(thisProto);
			if (thisProto == null || thisProto.hasOwnProperty("constructor") == false)
				break;
			
			thisClass = thisProto.constructor;
		}
	};
	


/**
 * @depends StyleableBase.js
 */

////////////////////////////////////////////////////////
////////////////////ShapeBase///////////////////////////

/**
 * @class ShapeBase
 * @inherits StyleableBase
 * 
 * Abstract base class for drawing vector shape paths.
 * 
 * @constructor ShapeBase 
 * Creates new ShapeBase instance.
 */
function ShapeBase()
{
	ShapeBase.base.prototype.constructor.call(this);
}

//Inherit from StyleableBase
ShapeBase.prototype = Object.create(StyleableBase.prototype);
ShapeBase.prototype.constructor = ShapeBase;
ShapeBase.base = StyleableBase;

////////////Public//////////////////////

/**
 * @function drawShape
 * Used to draw a sub-path shape path to the supplied Canvas2DContext using the supplied metrics.
 * Override this to draw custom shapes. Do *not* call beginPath() as that will destroy previous 
 * sub-paths and *do not* do any filling or other context calls. Only draw and closePath() the sub-path.
 * 
 * @param ctx Canvas2DContext
 * The Canvas2DContext to draw the sub-path on.
 * 
 * @param metrics DrawMetrics
 * DrawMetrics object to use as the bounding box for the sub-path.
 */
ShapeBase.prototype.drawShape = 
	function (ctx, metrics)
	{
		//Stub for override.
	};
	
	


/**
 * @depends ShapeBase.js
 */

////////////////////////////////////////////////////////
/////////////RoundedRectangleShape//////////////////////	

/**
 * @class RoundedRectangleShape
 * @inherits ShapeBase
 * 
 * Draws rectangles and rounded rectangles.
 * 
 * @constructor RoundedRectangleShape 
 * Creates new RoundedRectangleShape instance.
 */
function RoundedRectangleShape()
{
	RoundedRectangleShape.base.prototype.constructor.call(this);
}

//Inherit from ShapeBase
RoundedRectangleShape.prototype = Object.create(ShapeBase.prototype);
RoundedRectangleShape.prototype.constructor = RoundedRectangleShape;
RoundedRectangleShape.base = ShapeBase;

/////////////Style Types///////////////////////////////

RoundedRectangleShape._StyleTypes = Object.create(null);

/**
 * @style CornerRadius Number
 * 
 * Radius size in pixels for the rectangle's corners. 
 * CornerRadius effects all corners of the rectangle.
 */
RoundedRectangleShape._StyleTypes.CornerRadius = 					StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style CornerRadiusTopLeft Number
 * 
 * Radius size in pixels for the rectangle's top left corner.  
 * This will override the CornerRadius style unless it is null.
 */
RoundedRectangleShape._StyleTypes.CornerRadiusTopLeft = 			StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style CornerRadiusTopRight Number
 * 
 * Radius size in pixels for the rectangle's top right corner.  
 * This will override the CornerRadius style unless it is null.
 */
RoundedRectangleShape._StyleTypes.CornerRadiusTopRight = 			StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style CornerRadiusBottomLeft Number
 * 
 * Radius size in pixels for the rectangle's bottom left corner.  
 * This will override the CornerRadius style unless it is null.
 */
RoundedRectangleShape._StyleTypes.CornerRadiusBottomLeft = 			StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style CornerRadiusBottomRight Number
 * 
 * Radius size in pixels for the rectangle's bottom right corner.  
 * This will override the CornerRadius style unless it is null.
 */
RoundedRectangleShape._StyleTypes.CornerRadiusBottomRight = 		StyleableBase.EStyleType.NORMAL;		// number || null


////////////Style Defaults////////////////////////////

RoundedRectangleShape.StyleDefault = new StyleDefinition();

RoundedRectangleShape.StyleDefault.setStyle("CornerRadius", 					0);
RoundedRectangleShape.StyleDefault.setStyle("CornerRadiusTopLeft",				null);
RoundedRectangleShape.StyleDefault.setStyle("CornerRadiusTopRight",				null);
RoundedRectangleShape.StyleDefault.setStyle("CornerRadiusBottomLeft",			null);
RoundedRectangleShape.StyleDefault.setStyle("CornerRadiusBottomRight",			null);

////////////Public//////////////////////

//@Override
RoundedRectangleShape.prototype.drawShape = 
	function (ctx, metrics)
	{
		var x = metrics.getX();
		var y = metrics.getY();
		
		var width = metrics.getWidth();
		var height = metrics.getHeight();
		
		var c = this.getStyle("CornerRadius");
		var cTl = this.getStyle("CornerRadiusTopLeft");
		var cTr = this.getStyle("CornerRadiusTopRight");
		var cBl = this.getStyle("CornerRadiusBottomLeft");
		var cBr = this.getStyle("CornerRadiusBottomRight");
		
		if (c == null)
			c = 0;
		if (cTl == null)
			cTl = c;
		if (cTr == null)
			cTr = c;
		if (cBl == null)
			cBl = c;
		if (cBr == null)
			cBr = c;
		
		ctx.moveTo(x, y + cTl);
		
		if (cTl > 0)
			ctx.arcTo(x, y, 
				x + cTl, y, 
				cTl);
		
		ctx.lineTo(x + width - cTr, y);
		
		if (cTr > 0)
			ctx.arcTo(x + width, y, 
				x + width, y + cTr, 
				cTr);
		
		ctx.lineTo(x + width, y + height - cBr);
		
		if (cBr > 0)
			ctx.arcTo(x + width, y + height, 
				x + width - cBr, y + height, 
				cBr);
		
		ctx.lineTo(x + cBl, y + height);
		
		if (cBl > 0)
			ctx.arcTo(x, y + height, 
				x, y + height - cBl, 
				cBl);
		
		ctx.closePath();
	};
	
	


/**
 * @depends ShapeBase.js
 */

////////////////////////////////////////////////////////
/////////////////EllipseShape///////////////////////////

/**
 * @class EllipseShape
 * @inherits ShapeBase
 * 
 * Draws an ellipse that fills the supplied metrics rectangle.
 * 
 * @constructor EllipseShape 
 * Creates new EllipseShape instance.
 */
function EllipseShape()
{
	EllipseShape.base.prototype.constructor.call(this);
}

//Inherit from ShapeBase
EllipseShape.prototype = Object.create(ShapeBase.prototype);
EllipseShape.prototype.constructor = EllipseShape;
EllipseShape.base = ShapeBase;

////////////Public//////////////////////

//@Override
EllipseShape.prototype.drawShape = 
	function (ctx, metrics)
	{
		var w = metrics.getWidth();
		var h = metrics.getHeight();
		
		var spline4Magic = 0.551784;
		var xOffset = (w / 2) * spline4Magic;
		var yOffset = (h / 2) * spline4Magic;
		
		var xStart = metrics.getX();
		var yStart = metrics.getY();
		var xMiddle = xStart + (w / 2);
		var yMiddle = yStart + (h / 2);
		var xEnd = xStart + w;
		var yEnd = yStart + h;
		
		ctx.moveTo(xStart, yMiddle);
		ctx.bezierCurveTo(xStart, yMiddle - yOffset, xMiddle - xOffset, yStart, xMiddle, yStart);
		ctx.bezierCurveTo(xMiddle + xOffset, yStart, xEnd, yMiddle - yOffset, xEnd, yMiddle);
		ctx.bezierCurveTo(xEnd, yMiddle + yOffset, xMiddle + xOffset, yEnd, xMiddle, yEnd);
		ctx.bezierCurveTo(xMiddle - xOffset, yEnd, xStart, yMiddle + yOffset, xStart, yMiddle);
		ctx.closePath();
	};
	
	


/**
 * @depends ShapeBase.js
 */

////////////////////////////////////////////////////////
/////////////////ArrowShape/////////////////////////////	

/**
 * @class ArrowShape
 * @inherits ShapeBase
 * 
 * Draws a variety of arrow-ish shapes such as triangles, rounded pointers,
 * and traditional arrows.
 * 
 * @constructor ArrowShape 
 * Creates new ArrowShape instance.
 */
function ArrowShape()
{
	ArrowShape.base.prototype.constructor.call(this);
}

//Inherit from ShapeBase
ArrowShape.prototype = Object.create(ShapeBase.prototype);
ArrowShape.prototype.constructor = ArrowShape;
ArrowShape.base = ShapeBase;

/////////////Style Types///////////////////////////////

ArrowShape._StyleTypes = Object.create(null);

/**
 * @style Direction String
 * 
 * Determines the direction that the arrow or triangle will point. Acceptable values are "up", "down", "left", and "right".
 * Other styles are named as such when the Arrow is pointed "up". Styles do not change with orientation.
 */
ArrowShape._StyleTypes.Direction = 						StyleableBase.EStyleType.NORMAL;		// "up" || "down" || "left" || "right"

/**
 * @style RectBaseWidth Number
 * 
 * The size in pixels used for the width of the rectangular base of the arrow. Setting this to zero creates a triangle.
 * It is preferrable to use RectBasePercentWidth so that the arrow can scale.
 */
ArrowShape._StyleTypes.RectBaseWidth = 					StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style RectBaseHeight Number
 * 
 * The size in pixels used for the height of the rectangular base of the arrow. Setting this to zero creates a triangle.
 * It is preferrable to use RectBasePercentHeight so that the arrow can scale.
 */
ArrowShape._StyleTypes.RectBaseHeight = 				StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style RectBasePercentWidth Number
 * 
 * The percentage of available width to use for the width of the rectangular base of the arrow. 
 * Acceptable values are between 0 and 100. Setting this to zero will create a triangle.
 */
ArrowShape._StyleTypes.RectBasePercentWidth = 			StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style RectBasePercentHeight Number
 * 
 * The percentage of available height to use for the height of the rectangular base of the arrow. 
 * Acceptable values are between 0 and 100. Setting this to zero will create a triangle.
 */
ArrowShape._StyleTypes.RectBasePercentHeight = 			StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style CornerRadius Number
 * 
 * Radius size in pixels for the rectangular base's corners. 
 * CornerRadius effects all corners of the rectangular base. 
 */
ArrowShape._StyleTypes.CornerRadius = 					StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style CornerRadiusTopLeft Number
 * 
 * Radius size in pixels for the rectangular base's top left corner. 
 * This will override the CornerRadius style unless it is null.
 */
ArrowShape._StyleTypes.CornerRadiusTopLeft = 			StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style CornerRadiusTopRight Number
 * 
 * Radius size in pixels for the rectangular base's top right corner. 
 * This will override the CornerRadius style unless it is null.
 */
ArrowShape._StyleTypes.CornerRadiusTopRight = 			StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style CornerRadiusBottomLeft Number
 * 
 * Radius size in pixels for the rectangular base's bottom left corner. 
 * This will override the CornerRadius style unless it is null. Rounding both bottom corners
 * will give the effect of a rounded pointer. 
 */
ArrowShape._StyleTypes.CornerRadiusBottomLeft = 		StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style CornerRadiusBottomRight Number
 * 
 * Radius size in pixels for the rectangular base's bottom right corner. 
 * This will override the CornerRadius style unless it is null. Rounding both bottom corners
 * will give the effect of a rounded pointer. 
 */
ArrowShape._StyleTypes.CornerRadiusBottomRight = 		StyleableBase.EStyleType.NORMAL;		// number || null


////////////Default Styles///////////////////////////

ArrowShape.StyleDefault = new StyleDefinition();

ArrowShape.StyleDefault.setStyle("Direction", 						"up");	// "up" || "down" || "left" || "right"

ArrowShape.StyleDefault.setStyle("RectBaseWidth", 					null); 	// number || null
ArrowShape.StyleDefault.setStyle("RectBaseHeight", 					null); 	// number || null
ArrowShape.StyleDefault.setStyle("RectBasePercentWidth", 			null);	// number || null
ArrowShape.StyleDefault.setStyle("RectBasePercentHeight", 			null); 	// number || null

ArrowShape.StyleDefault.setStyle("CornerRadius", 					0);		// number || null
ArrowShape.StyleDefault.setStyle("CornerRadiusTopLeft",				null);	// number || null
ArrowShape.StyleDefault.setStyle("CornerRadiusTopRight",			null);	// number || null
ArrowShape.StyleDefault.setStyle("CornerRadiusBottomLeft",			null);	// number || null
ArrowShape.StyleDefault.setStyle("CornerRadiusBottomRight",			null);	// number || null


////////////Public//////////////////////

ArrowShape.prototype.drawShape = 
	function (ctx, metrics)
	{
		var direction = this.getStyle("Direction");
		
		if (direction != "up" && direction != "down" && direction != "left" && direction != "right")
			return;
		
		var x = metrics.getX();
		var y = metrics.getY();
		var width = metrics.getWidth();
		var height = metrics.getHeight();
		
		var c = this.getStyle("CornerRadius");
		var cornerTl = this.getStyle("CornerRadiusTopLeft");
		var cornerTr = this.getStyle("CornerRadiusTopRight");
		var cornerBl = this.getStyle("CornerRadiusBottomLeft");
		var cornerBr = this.getStyle("CornerRadiusBottomRight");
		
		if (c == null)
			c = 0;
		if (cornerTl == null)
			cornerTl = c;
		if (cornerTr == null)
			cornerTr = c;
		if (cornerBl == null)
			cornerBl = c;
		if (cornerBr == null)
			cornerBr = c;
		
		var baseWidth = this.getStyle("RectBaseWidth");
		var baseHeight = this.getStyle("RectBaseHeight");
		
		if (baseWidth == null)
		{
			var rectWidthPercent = this.getStyle("RectBasePercentWidth");
			if (rectWidthPercent == null)
				baseWidth = 0;
			else
				baseWidth = Math.round(width * (rectWidthPercent / 100));
		}
		if (baseHeight == null)
		{
			var rectHeightPercent = this.getStyle("RectBasePercentHeight");
			if (rectHeightPercent == null)
				baseHeight = 0;
			else
				baseHeight = Math.round(height * (rectHeightPercent / 100));
		}
		
		if (baseWidth == 0 || baseHeight == 0)
		{
			baseWidth = 0;
			baseHeight = 0;
		}
		
		if (direction == "down")
		{
			ctx.moveTo(x + ((width - baseWidth) / 2), 
				y + cornerTl);
			
			if (cornerTl > 0)
				ctx.arcTo(x + ((width - baseWidth) / 2), y, 
					x + ((width - baseWidth) / 2) + cornerTl, y, 
					cornerTl);
			
			ctx.lineTo(x + ((width - baseWidth) / 2) + baseWidth - cornerTr, 
				y);
			
			if (cornerTr > 0)
				ctx.arcTo(x + ((width - baseWidth) / 2) + baseWidth, y, 
					x + ((width - baseWidth) / 2) + baseWidth, y + cornerTr, 
					cornerTr);
			
			ctx.lineTo(x + ((width - baseWidth) / 2) + baseWidth, y + baseHeight - cornerBr);
			
			if (cornerBr > 0)
				ctx.arcTo(x + ((width - baseWidth) / 2) + baseWidth, y + baseHeight,
					Math.min(x + ((width - baseWidth) / 2) + baseWidth + cornerBr, x + width), y + baseHeight,
					Math.min(cornerBr, (width - baseWidth) / 2));			
			
			ctx.lineTo(x + width, y + baseHeight);
			ctx.lineTo(x + (width / 2), y + height);
			ctx.lineTo(x, y + baseHeight);
			
			ctx.lineTo(Math.max(x + ((width - baseWidth) / 2) - cornerBl, x), y + baseHeight);
			
			if (cornerBl > 0)
				ctx.arcTo(x + ((width - baseWidth) / 2), y + baseHeight,
					x + ((width - baseWidth) / 2), y + baseHeight - cornerBl,
					Math.min(cornerBl, (width - baseWidth) / 2));
		}
		else if (direction == "left")
		{
			ctx.moveTo(x + width - cornerTr, 
					y +  ((height - baseHeight) / 2));
			
			if (cornerTr > 0)
				ctx.arcTo(x + width, y +  ((height - baseHeight) / 2), 
					x + width, y +  ((height - baseHeight) / 2) + cornerTr, 
					cornerTr);
			
			ctx.lineTo(x + width, 
				y + ((height - baseHeight) / 2) + baseHeight - cornerBr);
			
			if (cornerBr > 0)
				ctx.arcTo(x + width, y + ((height - baseHeight) / 2) + baseHeight, 
					x + width - cornerBr, y + ((height - baseHeight) / 2) + baseHeight, 
					cornerBr);
			
			ctx.lineTo(x + width - baseWidth + cornerBl, y + ((height - baseHeight) / 2) + baseHeight);
			
			if (cornerBl > 0)
				ctx.arcTo(x + width - baseWidth, y + ((height - baseHeight) / 2) + baseHeight,
					x + width - baseWidth, Math.min(y + ((height - baseHeight) / 2) + baseHeight + cornerBl, y + height),
					Math.min(cornerBl, (height - baseHeight) / 2));
			
			
			ctx.lineTo(x + width - baseWidth, y + height);
			ctx.lineTo(x, y + (height / 2));
			ctx.lineTo(x + width - baseWidth, y);
			
			ctx.lineTo(x + width - baseWidth, Math.max(y, y + ((height - baseHeight) / 2) - cornerTl));

			if (cornerTl > 0)
				ctx.arcTo(x + width - baseWidth, y + ((height - baseHeight) / 2),
					x + width - baseWidth + cornerTl, y + ((height - baseHeight) / 2),
					Math.min(cornerTl, (height - baseHeight) / 2));
		}
		else if (direction == "up")
		{
			ctx.moveTo(x + ((width - baseWidth) / 2) + baseWidth, 
				y + height - cornerBr);
			
			if (cornerBr > 0)
				ctx.arcTo(x + ((width - baseWidth) / 2) + baseWidth, y + height, 
					x + ((width - baseWidth) / 2) + baseWidth - cornerBr, y + height, 
					cornerBr);
			
			ctx.lineTo(x + ((width - baseWidth) / 2) + cornerBl, 
				y + height);
			
			if (cornerBl > 0)
				ctx.arcTo(x + ((width - baseWidth) / 2), y + height, 
					x + ((width - baseWidth) / 2), y + height - cornerBl, 
					cornerBl);
			
			ctx.lineTo(x + ((width - baseWidth) / 2), y + height - baseHeight + cornerTl);
			
			if (cornerTl > 0)
				ctx.arcTo(x + ((width - baseWidth) / 2), y + height - baseHeight,
					Math.max(x + ((width - baseWidth) / 2) - cornerTl, x), y + height - baseHeight,
					Math.min(cornerTl, (width - baseWidth) / 2));			
			
			
			ctx.lineTo(x, y + height - baseHeight);
			ctx.lineTo(x + (width / 2), y);
			ctx.lineTo(x + width, y + height - baseHeight);
			
			
			ctx.lineTo(Math.min(x + ((width - baseWidth) / 2) + baseWidth + cornerTr, x + width), y + height - baseHeight);
			
			if (cornerTr > 0)
				ctx.arcTo(x + ((width - baseWidth) / 2) + baseWidth, y + height - baseHeight,
					x + ((width - baseWidth) / 2) + baseWidth, y + height - baseHeight + cornerTr,
					Math.min(cornerTr, (width - baseWidth) / 2));
		}
		else if (direction == "right")
		{
			ctx.moveTo(x + cornerBl, 
				y +  ((height - baseHeight) / 2) + baseHeight);
			
			if (cornerBl > 0)
				ctx.arcTo(x, y +  ((height - baseHeight) / 2) + baseHeight, 
					x, y +  ((height - baseHeight) / 2) + baseHeight - cornerBl, 
					cornerBl);
			
			ctx.lineTo(x, 
				y + ((height - baseHeight) / 2) + cornerTl);
			
			if (cornerTl > 0)
				ctx.arcTo(x, y + ((height - baseHeight) / 2), 
					x + cornerTl, y + ((height - baseHeight) / 2), 
					cornerTl);
			
			ctx.lineTo(x + baseWidth - cornerTr, y + ((height - baseHeight) / 2));
			
			if (cornerTr > 0)
				ctx.arcTo(x + baseWidth, y + ((height - baseHeight) / 2),
					x + baseWidth, Math.max(y + ((height - baseHeight) / 2) - cornerTr, y),
					Math.min(cornerTr, (height - baseHeight) / 2));
			
			
			ctx.lineTo(x + baseWidth, y);
			ctx.lineTo(x + width, y + (height / 2));
			ctx.lineTo(x + baseWidth, y + height);
			
			ctx.lineTo(x + baseWidth, Math.min(y + height, y + ((height - baseHeight) / 2) + baseHeight + cornerBr));

			if (cornerBr > 0)
				ctx.arcTo(x + baseWidth, y + ((height - baseHeight) / 2) + baseHeight,
					x + baseWidth - cornerBr, y + ((height - baseHeight) / 2) + baseHeight,
					Math.min(cornerBr, (height - baseHeight) / 2));
		}
		
		ctx.closePath();
	};	
	
	


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
	
	this._backingArray = [];		
	this._collectionSort = null;	
	
	if (sourceArray != null)
		this._backingArray = sourceArray;
}

//Inherit from EventDispatcher
ListCollection.prototype = Object.create(EventDispatcher.prototype);
ListCollection.prototype.constructor = ListCollection;
ListCollection.base = EventDispatcher;

/**
 * @event collectionchanged CollectionChangedEvent
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
		this._dispatchEvent(new CollectionChangedEvent("reset", -1));
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
			throw "Invalid CollectionSort";
			
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
		
		this._dispatchEvent(new CollectionChangedEvent("reset", -1));
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
		
		this._dispatchEvent(new CollectionChangedEvent("add", index));
		
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
		
		this._dispatchEvent(new CollectionChangedEvent("remove", index));
		
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
		this._backingArray = [];
		
		this._dispatchEvent(new CollectionChangedEvent("reset", -1));
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
		this._dispatchEvent(new CollectionChangedEvent("update", index));
	};


/////////////////////////////////////////////////////////////////////
/////////////////////DrawMetrics/////////////////////////////////////	

/**
 * @class DrawMetrics
 * 
 * Simple data structure to represent bounds. (X, Y, Width, Height). 
 * 
 * 
 * @constructor DrawMetrics 
 * Creates new DrawMetrics instance.
 */

//Supporting class used to indicate element bounds.
function DrawMetrics()
{
	this._x = 0;
	this._y = 0;
	this._width = 0;
	this._height = 0;
}	

//DrawMetrics is base object, no inheritance.
DrawMetrics.prototype.constructor = DrawMetrics;

/**
 * @function equals
 * 
 * Checks if two instances of DrawMetrics contain the same values.
 * 
 * @param drawMetrics DrawMetrics
 * DrawMetrics instance to compare.
 * 
 * @returns bool
 * True when both instances contain the same values.
 */
DrawMetrics.prototype.equals = 
	function(drawMetrics)
	{
		if (this._x == drawMetrics._x && 
			this._y == drawMetrics._y &&
			this._width == drawMetrics._width && 
			this._height == drawMetrics._height)
		{
			return true;
		}
		
		return false;
	};

/**
 * @function clone
 * Duplicates an instance of DrawMetrics. 
 * 
 * @returns DrawMetrics
 * A new DrawMetrics instance identical to the cloned instance.
 */		
DrawMetrics.prototype.clone = 
	function ()
	{
		var clonedMetrics = new DrawMetrics();
		
		clonedMetrics._x = this._x;
		clonedMetrics._y = this._y;
		clonedMetrics._width = this._width;
		clonedMetrics._height = this._height;
		
		return clonedMetrics;
	};
	
//@private (for now)	
DrawMetrics.prototype.copyFrom = 
	function (copyFromMetrics)
	{
		this._x = copyFromMetrics._x;
		this._y = copyFromMetrics._y;
		this._width = copyFromMetrics._width;
		this._height = copyFromMetrics._height;
	};
	
//@private (for now)
DrawMetrics.prototype.mergeExpand = 
	function (mergeWithDrawMetrics)
	{
		if (mergeWithDrawMetrics._x < this._x)
		{
			this._width += (this._x - mergeWithDrawMetrics._x);
			this._x = mergeWithDrawMetrics._x;
		}
		if (mergeWithDrawMetrics._y < this._y)
		{
			this._height += (this._y - mergeWithDrawMetrics._y);
			this._y = mergeWithDrawMetrics._y;
		}
		if (mergeWithDrawMetrics._x + mergeWithDrawMetrics._width > this._x + this._width)
			this._width += ((mergeWithDrawMetrics._x + mergeWithDrawMetrics._width) - (this._x + this._width));
		if (mergeWithDrawMetrics._y + mergeWithDrawMetrics._height > this._y + this._height)
			this._height += ((mergeWithDrawMetrics._y + mergeWithDrawMetrics._height) - (this._y + this._height));
	};
	
//@private (for now)	
DrawMetrics.prototype.mergeReduce = 
	function (mergeWithDrawMetrics)
	{
		if (this._x < mergeWithDrawMetrics._x)
		{
			this._width -= (mergeWithDrawMetrics._x - this._x);
			this._x = mergeWithDrawMetrics._x;
		}
		if (this._y < mergeWithDrawMetrics._y)
		{
			this._height -= (mergeWithDrawMetrics._y - this._y);
			this._y = mergeWithDrawMetrics._y;
		}
		if (this._x + this._width > mergeWithDrawMetrics._x + mergeWithDrawMetrics._width)
			this._width -= ((this._x + this._width) - (mergeWithDrawMetrics._x + mergeWithDrawMetrics._width));
		if (this._y + this._height > mergeWithDrawMetrics._y + mergeWithDrawMetrics._height)
			this._height -= ((this._y + this._height) - (mergeWithDrawMetrics._y + mergeWithDrawMetrics._height));	
	};
	
DrawMetrics.prototype.roundToPrecision = 
	function (precision)
	{
		this._x = CanvasElement.roundToPrecision(this._x, precision);
		this._y = CanvasElement.roundToPrecision(this._y, precision);
		this._width = CanvasElement.roundToPrecision(this._width, precision);
		this._height = CanvasElement.roundToPrecision(this._height, precision);
	};
	
//@private (for now)	
DrawMetrics.prototype.roundUp = 
	function ()
	{
		var x1 = this._x;
		var x2 = this._x + this._width;
		var y1 = this._y;
		var y2 = this._y + this._height;
		
		x1 = Math.floor(x1);
		x2 = Math.ceil(x2);
		y1 = Math.floor(y1);
		y2 = Math.ceil(y2);
		
		this._x = x1;
		this._y = y1;
		this._width = x2 - x1;
		this._height = y2 - y1;
	};
	
/**
 * @function getX
 * 
 * Gets the X value in pixels, this may be fractional. 
 * 
 * @returns Number
 * The X value.
 */
DrawMetrics.prototype.getX = 
	function()
	{
		return this._x;
	};
	
/**
 * @function getY
 * 
 * Gets the Y value in pixels, this may be fractional. 
 * 
 * @returns Number
 * The Y value.
 */	
DrawMetrics.prototype.getY = 
	function()
	{
		return this._y;
	};
	
/**
 * @function getWidth
 * 
 * Gets the Width value in pixels, this may be fractional. 
 * 
 * @returns Number
 * The Width value.
 */		
DrawMetrics.prototype.getWidth = 
	function()
	{
		return this._width;
	};
	
/**
 * @function getHeight
 * 
 * Gets the Height value in pixels, this may be fractional. 
 * 
 * @returns Number
 * The Height value.
 */		
DrawMetrics.prototype.getHeight = 
	function()
	{
		return this._height;
	};
	
	


///////////////////////////////////////////////////////////////////////
///////////////////////DataListData////////////////////////////////////

/**
 * @class DataListData
 * 
 * Internal data storage class passed to CanvasElements when they are used as
 * DataRenderers for a DataListElement or subclass.
 * 
 * 
 * @constructor DataListData 
 * Creates new DataListData instance.
 * 
 * @param parentList DataListElement
 * The parent DataListElement or subclass.
 * 
 * @param itemIndex int
 * The Collection item index.
 */
function DataListData(parentList, itemIndex)
{
	/**
	 * @member _parentList DataListElement
	 * Read Only - The parent DataListElement or subclass. 
	 */
	this._parentList = parentList;
	
	/**
	 * @member _itemIndex int
	 * Read Only - The Collection item index.
	 */
	this._itemIndex = itemIndex;
};	


///////////////////////////////////////////////////////////////////////
///////////////////////DataGridItemData////////////////////////////////

/**
 * @class DataGridItemData
 * 
 * Internal data storage class passed to CanvasElements when they are used as
 * DataRenderers for a DataGrid.
 * 
 * 
 * @constructor DataGridItemData 
 * Creates new DataGridItemData instance.
 * 
 * @param parentGrid DataGridElement
 * The parent DataListElement or subclass.
 * 
 * @param itemIndex int
 * The Collection item index.
 * 
 * @param columnIndex int
 * The column index associated with the DataGrid renderer.
 */
function DataGridItemData(parentGrid, itemIndex, columnIndex)
{
	/**
	 * @member _parentGrid DataGridElement
	 * Read Only - The parent DataGridElement or subclass. 
	 */
	this._parentGrid = parentGrid;
	
	/**
	 * @member _itemIndex int
	 * Read Only - The Collection item index.
	 */
	this._itemIndex = itemIndex;
	
	/**
	 * @member _columnIndex int
	 * Read Only - Column index associated with the DataGrid renderer.
	 */
	this._columnIndex = columnIndex;
};	




/**
 * @depends StyleableBase.js
 */

////////////////////////////////////////////////////////
//////////////CursorDefinition//////////////////////////	

/**
 * @class CursorDefinition
 * @inherits StyleableBase
 * 
 * CursorDefintion stores styles necessary to render/animate custom cursors.
 * This is used for CanvasElement's Cursor style (roll-over cursor) and can
 * also be added directly to CanvasManager. 
 *  
 * 
 * @constructor CursorDefinition 
 * Creates new CursorDefinition instance.
 */
function CursorDefinition()
{
	CursorDefinition.base.prototype.constructor.call(this);
	
	this._cursorElement = null;
	this._addedCount = 0;
}

//Inherit from StyleableBase
CursorDefinition.prototype = Object.create(StyleableBase.prototype);
CursorDefinition.prototype.constructor = CursorDefinition;
CursorDefinition.base = StyleableBase;

/////////////Style Types///////////////////////////////

CursorDefinition._StyleTypes = Object.create(null);

/**
 * @style CursorClass CanvasElement
 * 
 * The CanvasElement constructor or browser string type to use for the cursor.
 */
CursorDefinition._StyleTypes.CursorClass = 						StyleableBase.EStyleType.NORMAL;		// CanvasElement() constructor

/**
 * @style CursorStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the cursor class. (Including Width and Height, unless you've implemented
 * the doMeasure() function into a custom CanvasElement subclass).
 */
CursorDefinition._StyleTypes.CursorStyle = 						StyleableBase.EStyleType.NORMAL;		// StyleDefinition

/**
 * @style CursorOffsetX Number
 * 
 * The X offset from the actual mouse position the cursor should be rendered.
 */
CursorDefinition._StyleTypes.CursorOffsetX = 					StyleableBase.EStyleType.NORMAL;		// number

/**
 * @style CursorOffsetY Number
 * 
 * The Y offset from the actual mouse position the cursor should be rendered.
 */
CursorDefinition._StyleTypes.CursorOffsetY = 					StyleableBase.EStyleType.NORMAL;		// number


///////////Default Styles/////////////////////////////

CursorDefinition.StyleDefault = new StyleDefinition();

CursorDefinition.StyleDefault.setStyle("CursorClass", 							"default"); 	// "browsertype" || CanvasElement() constructor
CursorDefinition.StyleDefault.setStyle("CursorStyle", 							null); 			// StyleDefinition
CursorDefinition.StyleDefault.setStyle("CursorOffsetX", 						0); 			// number
CursorDefinition.StyleDefault.setStyle("CursorOffsetY", 						0); 			// number




///////////////////////////////////////////////////////////////////
///////////////////////CollectionSort//////////////////////////////	

/**
 * @class CollectionSort
 * 
 * CollectionSort is a helper class that stores a comparatorFunction
 * and a isDecending flag used to invert the sort.
 * 
 * 
 * @constructor CollectionSort 
 * Creates new CollectionSort instance.
 * 
 * @param comparatorFunction Function
 * The sort comparator function to use when sorting an array.
 * 
 * @param isDecending boolean
 * When true invert the sort.
 */
function CollectionSort(comparatorFunction, isDecending)
{
	this._comparatorFunction = comparatorFunction;
	this._isDecending = isDecending;
	
	var _self = this;
	
	//Private function to invert the comparator (decending sort). 
	//This gets passed to Array as function pointer so there's no point in using prototype.
	this._collectionSortDecendingComparator = 
		function (objA, objB)
		{
			return _self._comparatorFunction(objB, objA);
		};
}

//No inheritance (base object)
CollectionSort.prototype.constructor = CollectionSort;

/**
 * @function setComparatorFunction
 * Sets the comparator function to be used when sorting. Comparators accept 2 parameters and return -1, 0, or +1 
 * depending on the sort relation between the 2 parameters.
 * 
 * function (objA, objB) { return objA - objB; };
 * 
 *  @param comparatorFunction Function
 *  The function to be used as the comparator.
 */
CollectionSort.prototype.setComparatorFunction = 
	function (comparatorFunction)
	{
		this._comparatorFunction = comparatorFunction;
	};
	
/**
 * @function getComparatorFunction
 * Gets the comparator function used when sorting.
 * 
 * @returns Function
 * The comparator function used when sorting.
 */	
CollectionSort.prototype.getComparatorFunction = 
	function ()
	{
		return this._comparatorFunction;
	};

/**
 * @function sort
 * Sorts an array using the comparator function and isDecending flag.
 * 
 * @param array Array
 * Array to be sorted.
 */	
CollectionSort.prototype.sort = 
	function (array)
	{
		if (this._isDecending == true)
			array.sort(this._collectionSortDecendingComparator);
		else
			array.sort(this._comparatorFunction);
	};
	
/**
 * @function setIsDecending
 * Sets the isDecending flag. True to invert the sort.
 * 
 * @param isDecending bool
 * When true, invert the sort comparator function.
 */	
CollectionSort.prototype.setIsDecending = 
	function (isDecending)
	{
		this._isDecending = isDecending;
	};
	
/**
 * @function getIsDecending
 * Gets the state of the isDecending flag.
 * 
 * @returns boolean
 * The state of the isDecending flag.
 */	
CollectionSort.prototype.getIsDecending = 
	function ()
	{
		return this._isDecending;
	};
	
	


/**
 * @depends StyleableBase.js
 */

///////////////////////////////////////////////////////////////////////////	
///////////////////////CanvasElement///////////////////////////////////////	
	
/**
 * @class CanvasElement
 * @inherits StyleableBase
 * 
 * Base class for all Elements to be rendered to the Canvas by CanvasManager. 
 * CanvasElement supports all basic system functions for render-able objects such 
 * as the display chain hierarchy, user interactivity and events, 
 * style management, vector based rendering, etc. 
 * 
 * CanvasElement is the most basic type that can be added to CanvasManager and can be
 * used to automatically draw shapes or any custom rendering to the canvas.
 * 
 * 
 * @constructor CanvasElement 
 * Creates new CanvasElement instance.
 */

function CanvasElement()
{
	CanvasElement.base.prototype.constructor.call(this);
	
	//Proxy styles from a different element.
	this._styleProxy = null;
	
	//This is *not* class based defaults. Its a default version of _styleDefinition.
	//Used when the framework wants to apply a default definition that override class 
	//based default styles but *not* user applied styles.
	this._styleDefinitionDefaults = []; 
	
	//Assigned style definitions
	this._styleDefinitions = [];
	
	//Storage for the current background shape ShapeBase() per styling. We need to store a reference 
	//because we listen for style changed events and need to be able to remove the listener when
	//this is changed (via styles) or added/removed to display chain.
	this._backgroundShape = null;
	
	this._manager = null; //Canvas Manager reference
	this._displayDepth = 0; //Depth in display chain hierarchy
	
	//Event listeners for capture phase. (Only ElementEvent events support capture)
	this._captureListeners = Object.create(null);
	
	
	this._name = null;	//User defined identifier
	
	/**
	 * @member _x Number
	 * Read only - X position in pixels relative to this elements parent. This is not updated immediately, only
	 * after our parent has finished its layout phase.
	 */
	this._x = 0;
	
	/**
	 * @member _y Number
	 * Read only - Y position in pixels relative to this elements parent. This is not updated immediately, only
	 * after our parent has finished its layout phase will this be valid.
	 */
	this._y = 0;
	
	/**
	 * @member _width Number
	 * Read only - This element's actual width in pixels. This is not updated immediately, only
	 * after our parent has finished its layout phase will this be valid.
	 */
	this._width = 0;
	
	/**
	 * @member _height Number
	 * Read only - This element's actual height in pixels. This is not updated immediately, only
	 * after our parent has finished its layout phase will this be valid.
	 */
	this._height = 0;
	
	/**
	 * @member _measuredWidth Number
	 * Read only - This element's measured width in pixels. This is not updated immediately, only
	 * after this element has finished its measure phase will this be valid.
	 */
	this._measuredWidth = 0;
	
	/**
	 * @member _measuredHeight Number
	 * Read only - This element's measured height in pixels. This is not updated immediately, only
	 * after this element has finished its measure phase will this be valid.
	 */
	this._measuredHeight = 0;
	
	/**
	 * @member _mouseIsOver boolean
	 * Read only - true if the mouse is over this element, otherwise false.
	 */
	this._mouseIsOver = false;
	
	/**
	 * @member _mouseIsDown boolean
	 * Read only - true if the mouse is pressed on this element, otherwise false.
	 */
	this._mouseIsDown = false;
	
	/**
	 * @member _isFocused boolean
	 * Read only - true if this element currently has focus, otherwise false.
	 */
	this._isFocused = false;
	
	/**
	 * @member _rotateDegrees Number
	 * Read only - Degrees this element is rotated. This is not updated immediately, only
	 * after our parent has finished its layout phase will this be valid.
	 */
	this._rotateDegrees = 0;
	
	/**
	 * @member _rotateCenterX Number
	 * Read only - The X position relative to the element's parent this element is rotated around. This is not updated immediately, only
	 * after our parent has finished its layout phase will this be valid.
	 */
	this._rotateCenterX = 0;
	
	/**
	 * @member _rotateCenterY Number
	 * Read only - The Y position relative to the element's parent this element is rotated around. This is not updated immediately, only
	 * after our parent has finished its layout phase will this be valid.
	 */
	this._rotateCenterY = 0;
	
	/**
	 * @member _parent CanvasElement
	 * Read only - This elements parent element.
	 */
	this._parent = null; 	
	
	this._children = [];
	
	this._stylesInvalid = true;
	this._stylesInvalidMap = Object.create(null);	//Dirty map of changed styles for _doStylesChanged()
	this._stylesValidateNode = new CmLinkedNode();	//Reference to linked list iterator
	this._stylesValidateNode.data = this;
	
	//getStyle() can potentially be an expensive operation, we cache the value for performance and comparison when external styles change.
	this._stylesCache = Object.create(null);		
	
	this._measureInvalid = true;					//Dirty flag for _doMeasure()
	this._measureValidateNode = new CmLinkedNode();	//Reference to linked list iterator
	this._measureValidateNode.data = this;
	
	this._layoutInvalid = true;						//Dirty flag for _doLayout()
	this._layoutValidateNode = new CmLinkedNode(); 	//Reference to linked list iterator
	this._layoutValidateNode.data = this;
	
	this._renderInvalid = true;						//Dirty flag for _doRender()
	this._renderValidateNode = new CmLinkedNode();	//Reference to linked list iterator
	this._renderValidateNode.data = this;
	
	//Off screen canvas for rendering this element.
	this._graphicsCanvas = null;
	this._graphicsCtx = null;
	this._graphicsClear = true;					//Optimization, sometimes we may *have* a canvas, but its been cleared so no need to render.
	
	//Metrics used for redraw region relative to composite parents (and ourself if we're a composite layer).
	this._compositeMetrics = [];				//Array of {element:element, metrics:DrawMetrics, drawableMetrics:DrawMetrics}
	
	this._renderChanged = true;					//Dirty flag for redraw region set to true when _graphicsCanvas has been modified.
	this._renderVisible = false; 				//False if any element in the composite parent chain is not visible.	
	
	/////////Composite Rendering////////////////
	
	//Composite rendering is used for effects like shadow, alpha, and transformations which
	//require aggregating child renderings, then re-rendering with the desired effect.
	//When an element requires composite rendering, it and its children are rendered to _compositeCanvas,
	//then _compositeCanvas is rendered to the parent composite (or root canvas) and appropriate effects are applied.
	//These values are only populated when this element requires composite rendering.
	
	this._compositeRenderInvalid = false;
	this._compositeRenderValidateNode = new CmLinkedNode();
	this._compositeRenderValidateNode.data = this;
	
	this._compositeEffectChanged = true;
	
	//Pre-effect / transform. Utilizes re-draw regions when rendering.
	this._compositeVisibleMetrics = null;			//Visible area of the composite layer.																			
	this._redrawRegionMetrics = null;				//Region to redraw																								
	
	this._compositeCtx = null;						//Graphics context																								
	this._compositeCanvas = null;					//Off screen canvas for aggregate rendering of this + child renderings.											
	this._compositeCanvasMetrics = null;			//Metrics of the composite canvas. 																				
	
	//Post-effect / transform. 
	this._transformVisibleMetrics = null;			//Transformed _compositeVisibleMetrics
	this._transformDrawableMetrics = null;			//Transformed _compositeVisibleMetrics region after clipping is applied															
	////////////////////////////////////////////
	
	
	this._rollOverCursorInstance = null; 			//Reference to cursor list iterator for roll-over cursor.
	
	this._renderFocusRing = false;
	
	var _self = this;
	
	//Private event handlers, need instance for each element, proxy to prototype.
	this._onExternalStyleChangedInstance = 
		function (styleChangedEvent)
		{
			_self._onExternalStyleChanged(styleChangedEvent);
		};
	
	this._onBackgroundShapeStyleChangedInstance = 
		function (styleChangedEvent)
		{
			_self._onBackgroundShapeStyleChanged(styleChangedEvent);
		};
		
	this._onCanvasElementAddedRemovedInstance = 
		function (addedRemovedEvent)
		{
			if (addedRemovedEvent.getType() == "added")
				_self._onCanvasElementAdded(addedRemovedEvent);
			else if (addedRemovedEvent.getType() == "removed")
				_self._onCanvasElementRemoved(addedRemovedEvent);
		};
		
	this._onCanvasElementCursorOverOutInstance = 
		function (elementEvent)
		{
			_self._updateRolloverCursorDefinition();
		};
		
		
	//Listen for added/removed to display chain. (Setup / Cleanup)	
	this.addEventListener("added", this._onCanvasElementAddedRemovedInstance);
	this.addEventListener("removed", this._onCanvasElementAddedRemovedInstance);
	
	
	//////////Dynamic Properties////////////////  //Added at runtime when required.
	
	///////DataRenderer/////////////
	
	/**
	 * @member _listData DataListData
	 * Read only - List data provided by parent DataList when acting as a DataRenderer
	 */
	//this._listData = any;
	
	/**
	 * @member _itemData Object
	 * Read only - Collection item associated with this DataRenderer
	 */
	//this._itemData = any;
	
	/**
	 * @member _listSelected Any
	 * Read only - DataRenderer selected state.
	 */
	//this._listSelected = any;
	
	////////////////////////////////
}

//Inherit from StyleableBase
CanvasElement.prototype = Object.create(StyleableBase.prototype);
CanvasElement.prototype.constructor = CanvasElement;
CanvasElement.base = StyleableBase;

//Style priority enum
CanvasElement.EStylePriorities = 
{
	INSTANCE:0,
	DEFINITION:1,
	PROXY:2,
	INHERITED:3,
	DEFAULT_DEFINITION:4,
	CLASS:5
};

////////////Events/////////////////////////////////////

/**
 * @event localechanged DispatcherEvent
 * @broadcast
 * Dispatched when CanvasManager's locale selection changes.
 * 
 * @event enterframe DispatcherEvent
 * @broadcast
 * Dispatched at the beginning of the render frame before any life cycle processing begins.
 * 
 * @event mousemoveex ElementMouseEvent
 * @broadcast
 * Dispatched when the mouse moves anywhere, even outside of the browser window. Mouse coordinates are relative to CanvasManager.
 * 
 * @event resize DispatcherEvent
 * Dispatched when the element's size changes.
 * 
 * @event layoutcomplete DispatcherEvent
 * Typically an internal event. Dispatched when an element has completed its
 * layout phase. This is used when it is necessary to wait for an element to
 * finish its layout pass so things such as its PercentWidth calculation is complete.
 * This is very expensive and should only be used when absolutely necessary. Its usually
 * only needed when elements are not directly related via parent/child. 
 * For example, DropdownElement uses this to adjust the height of the dropdown popup
 * since we do not know how much height it will need until after it has finished layout.
 * 
 * @event measurecomplete DispatcherEvent
 * Typically an internal event. Dispatched when an element has completed its 
 * measure phase. This is used when it is necessary to wait for an element to
 * finish its measure pass so that its content size or _measuredSize calculation is complete.
 * This is very expensive and should only be used when absolutely necessary.  Its usually
 * only needed when elements are not directly related via parent/child.
 * For example, ViewportElement uses this to invoke a layout pass when its content child
 * changes _measuredSize. The Viewport uses an intermediate CanvasElement as a clipping container
 * for the content child, which does not measure children, so an event is needed to notify the Viewport.
 * 
 * @event keydown ElementKeyboardEvent
 * Dispatched when the element has focus and a key is pressed, repeatedly dispatched if the key is held down.
 * 
 * @event keyup ElementKeyboardEvent
 * Dispatched when the element has focus and a key is released.
 * 
 * @event mousedown ElementMouseEvent
 * Dispatched when the mouse is pressed over this element.
 * 
 * @event mouseup ElementMouseEvent
 * Dispatched when the mouse is released. Note that the mouse may not still be over the element.
 * 
 * @event click ElementMouseEvent
 * Dispatched when the mouse is pressed and released over the same element.
 * 
 * @event mousemove ElementMouseEvent
 * Dispatched when the mouse moves over this element.
 * 
 * @event wheel ElementMouseWheelEvent
 * Dispatched when the mouse wheel is rolled while over this element.
 * 
 * @event dragging ElementEvent
 * Dispatched when this element is moved due to it being dragged.
 * 
 * @event rollover ElementEvent
 * Dispatched when the mouse moves over this element.
 * 
 * @event rollout ElementEvent
 * Dispatched when the mouse moves outside of this element.
 * 
 * @event focusin ElementEvent
 * Dispatched when this element gains focus.
 * 
 * @event focusout ElementEvent
 * Dispatched when this element loses focus.
 * 
 * @event added AddedRemovedEvent
 * Dispatched when this element is added to the display hierarchy and becomes a descendant of CanvasManager. 
 * 
 * @event removed AddedRemovedEvent
 * Dispatched when this element is removed from the display hierarchy and is no longer a descendant of CanvasManager. 
 */


/////////////Style Types///////////////////////////////

CanvasElement._StyleTypes = Object.create(null);

//Rendering
/**
 * @style Visible boolean
 * 
 * When false the element will not be rendered.
 */
CanvasElement._StyleTypes.Visible = 				StyleableBase.EStyleType.NORMAL;		// true || false

/**
 * @style BorderType String
 * 
 * Determines the border type the CanvasElement should render. Allowable values are
 * "none", "solid", "inset", or "outset". Note that borders are internal and drawn on the inside
 * of the elements bounding area.
 */
CanvasElement._StyleTypes.BorderType = 				StyleableBase.EStyleType.NORMAL;		// "none" || "solid" || "inset" || "outset"

/**
 * @style BorderColor String
 * 
 * Hex color value to be used when drawing the border. Format like "#FF0000" (red)
 */
CanvasElement._StyleTypes.BorderColor = 			StyleableBase.EStyleType.NORMAL;		// "#FF0000" or null

/**
 * @style BorderThickness Number
 * 
 * Thickness in pixels to be used when drawing the border. 
 */
CanvasElement._StyleTypes.BorderThickness = 		StyleableBase.EStyleType.NORMAL;		// number

/**
 * @style BackgroundColor String
 * 
 * Hex color value to be used when drawing the background. This may be set to null and no
 * background will be rendered. Format like "#FF0000" (red)
 */
CanvasElement._StyleTypes.BackgroundColor = 		StyleableBase.EStyleType.NORMAL;		// "#FF0000" or null

/**
 * @style ShadowSize Number
 * 
 * Size in pixels that the drop shadow should be rendered. Note that the drop shadow may be rendered
 * outside the elements bounding area. This will cause the element to be composite rendered.
 */
CanvasElement._StyleTypes.ShadowSize = 				StyleableBase.EStyleType.NORMAL;		// number

/**
 * @style ShadowOffsetX Number
 * 
 * X offset that the drop shadow will be rendered.
 */
CanvasElement._StyleTypes.ShadowOffsetX = 			StyleableBase.EStyleType.NORMAL;		// number

/**
 * @style ShadowOffsetY Number
 * 
 * Y offset that the drop shadow will be rendered.
 */
CanvasElement._StyleTypes.ShadowOffsetY = 			StyleableBase.EStyleType.NORMAL;		// number

/**
 * @style ShadowColor String
 * 
 * Hex color value to be used when drawing the drop shadow. This may be set to null and no
 * shadow will be rendered. Format like "#FF0000" (red)
 */
CanvasElement._StyleTypes.ShadowColor = 			StyleableBase.EStyleType.NORMAL;		// "#FF0000" or null

/**
 * @style Alpha Number
 * 
 * Alpha value to use when rendering this component. Allowable values are between 0 and 1 with
 * 0 being transparent and 1 being opaque. This causes the element to perform composite rendering
 * when a value between 1 and 0 is used.
 */
CanvasElement._StyleTypes.Alpha = 					StyleableBase.EStyleType.NORMAL;		// number

/**
 * @style AutoGradientType String
 * 
 * Determines the type of gradient to be used when rendering the element's background.
 * Allowable values are "none", "linear", or "radial". Auto gradients automatically lighten
 * and darken the associated color are always rendered in the same direction relative to the 
 * canvas itself regardless of rotation or transformation applied to the element. 
 * This is used to create effects like a consistent light source even if the element is rotating.
 */
CanvasElement._StyleTypes.AutoGradientType = 		StyleableBase.EStyleType.NORMAL;		// "none" || "linear" || "radial"

/**
 * @style AutoGradientStart Number
 * 
 * Color offset to apply to the start of the gradient. Allowable values are numbers between 
 * -1 (white) and +1 (black). 
 */
CanvasElement._StyleTypes.AutoGradientStart = 		StyleableBase.EStyleType.NORMAL;		// number (-1 to +1 values)

/**
 * @style AutoGradientStop Number
 * 
 * Color offset to apply to the end of the gradient. Allowable values are numbers between 
 * -1 (white) and +1 (black). 
 */
CanvasElement._StyleTypes.AutoGradientStop = 		StyleableBase.EStyleType.NORMAL;		// number (-1 to +1 values)

/**
 * @style ClipContent boolean
 * 
 * Determines if out of bounds rendering is allowed. If true the element will clip all rendering
 * and children's rendering to the elements bounding box. 
 */
CanvasElement._StyleTypes.ClipContent = 			StyleableBase.EStyleType.NORMAL;		// number (true || false)

/**
 * @style SkinState String
 * 
 * This is an internal style used to toggle an element's current skin for different states such
 * as normal, mouse-over, mouse-down, etc. Its also commonly used by skin classes to identify their skin state.
 */
CanvasElement._StyleTypes.SkinState = 				StyleableBase.EStyleType.NORMAL;		// "state"

/**
 * @style BackgroundShape ShapeBase
 * 
 * Shape to be used when rendering the elements background. May be any ShapeBase subclass instance.
 */
CanvasElement._StyleTypes.BackgroundShape = 		StyleableBase.EStyleType.NORMAL;		// ShapeBase()

/**
 * @style FocusColor String
 * @inheritable
 * 
 * Hex color value to be used when drawing the elements focus indicator. Format "#FF0000" (Red). 
 * The focus indicator is only rendered when the element gains focus due to a tab stop.
 */
CanvasElement._StyleTypes.FocusColor = 				StyleableBase.EStyleType.INHERITABLE;			// color ("#000000")

/**
 * @style FocusThickness Number
 * @inheritable
 * 
 * Size in pixels that the focus ring should be rendered. Note that the focus ring is rendered
 * outside the elements bounding area.
 */
CanvasElement._StyleTypes.FocusThickness =			StyleableBase.EStyleType.INHERITABLE;			// number


//Layout
/**
 * @style Padding Number
 * 
 * Size in pixels that inner content should be spaced from the outer bounds of the element. 
 * Padding effects all sides of the element. Padding may be negative under certain circumstances like
 * expanding an inner child to allow border collapsing with its parent.
 */
CanvasElement._StyleTypes.Padding = 				StyleableBase.EStyleType.NORMAL;		// number

/**
 * @style PaddingTop Number
 * 
 * Size in pixels that inner content should be spaced from the upper bounds of the element. 
 * This will override the Padding style.
 */
CanvasElement._StyleTypes.PaddingTop = 				StyleableBase.EStyleType.NORMAL;		// number or null

/**
 * @style PaddingBottom Number
 * 
 * Size in pixels that inner content should be spaced from the lower bounds of the element. 
 * This will override the Padding style.
 */
CanvasElement._StyleTypes.PaddingBottom = 			StyleableBase.EStyleType.NORMAL;		// number or null

/**
 * @style PaddingLeft Number
 * 
 * Size in pixels that inner content should be spaced from the left most bounds of the element. 
 * This will override the Padding style.
 */
CanvasElement._StyleTypes.PaddingLeft = 			StyleableBase.EStyleType.NORMAL;		// number or null

/**
 * @style PaddingRight Number
 * 
 * Size in pixels that inner content should be spaced from the right most bounds of the element. 
 * This will override the Padding style.
 */
CanvasElement._StyleTypes.PaddingRight = 			StyleableBase.EStyleType.NORMAL;		// number or null


//Functional

/**
 * @style Enabled boolean
 * 
 * When false disables user interaction with the element.
 */
CanvasElement._StyleTypes.Enabled = 				StyleableBase.EStyleType.NORMAL;		// true || false

/**
 * @style MouseEnabled boolean
 * 
 * When false disables mouse events for the element.
 */
CanvasElement._StyleTypes.MouseEnabled = 			StyleableBase.EStyleType.NORMAL;		// true || false

/**
 * @style Draggable boolean
 * 
 * When true allows the element to be dragged by the user. This does not work for containers
 * that do not allow absolute positioning such as a ListContainer.
 */
CanvasElement._StyleTypes.Draggable = 				StyleableBase.EStyleType.NORMAL;		// true || false

/**
 * @style Cursor CursorDefinition
 * 
 * Specifies the cursor to be displayed when the mouse is over the element. A custom CursorDefinition
 * may be used or a browser type String ("text", "none", etc) may be used.
 */
CanvasElement._StyleTypes.Cursor = 					StyleableBase.EStyleType.NORMAL;		// CursorDefinition()

/**
 * @style TabStop int
 * 
 * Determines if an element can be focused using tab stops. -1 indicates the element cannot
 * take focus, 0 is default and the element will be focused in the order it appears in the display chain.
 * Numbers higher than 0 indicate a specific order to be used (not yet implemented).
 */
CanvasElement._StyleTypes.TabStop = 				StyleableBase.EStyleType.NORMAL;		// number


//Container Placement
/**
 * @style X Number
 * 
 * The X position the element should be rendered relative to its parent container. This only
 * works if the element is a child of an AnchorContainer.
 */
CanvasElement._StyleTypes.X =						StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style Y Number
 * 
 * The Y position the element should be rendered relative to its parent container. This only
 * works if the element is a child of an AnchorContainer.
 */
CanvasElement._StyleTypes.Y =						StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style Width Number
 * 
 * The Width the element should be rendered relative to its parent container. This only
 * works if the element is a child of a Container element.
 */
CanvasElement._StyleTypes.Width =					StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style Height Number
 * 
 * The Height the element should be rendered relative to its parent container. This only
 * works if the element is a child of a Container element.
 */
CanvasElement._StyleTypes.Height =					StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style Top Number
 * 
 * The distance the element should be positioned from the upper bounds of the parent container. 
 * This only works if the element is a child of an AnchorContainer. 
 */
CanvasElement._StyleTypes.Top =						StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style Left Number
 * 
 * The distance the element should be positioned from the left most bounds of the parent container. 
 * This only works if the element is a child of an AnchorContainer. 
 */
CanvasElement._StyleTypes.Left =					StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style Bottom Number
 * 
 * The distance the element should be positioned from the lower bounds of the parent container. 
 * This only works if the element is a child of an AnchorContainer. 
 */
CanvasElement._StyleTypes.Bottom =					StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style Right Number
 * 
 * The distance the element should be positioned from the right most bounds of the parent container. 
 * This only works if the element is a child of an AnchorContainer. 
 */
CanvasElement._StyleTypes.Right =					StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style PercentWidth Number
 * 
 * The percentage of available width the element should consume relative to its parent container. This only
 * works if the element is a child of a Container element. Note that percentage width is calculated
 * based on the available space left over *after* static sized elements considered. Percentages
 * are allowed to add to more than 100 and will consume all of the available space. For containers
 * like ListContainers, when percents add to more than 100 the elements will share the available space
 * per the ratio of percent vs total percent used so it is perfectly reasonable to set 3 elements all
 * to 100 and allow them to split the real-estate by 3.
 */
CanvasElement._StyleTypes.PercentWidth =			StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style PercentHeight Number
 * 
 * The percentage of available height the element should consume relative to its parent container. This only
 * works if the element is a child of a Container element. Note that percentage height is calculated
 * based on the available space left over *after* static sized elements considered. Percentages
 * are allowed to add to more than 100 and will consume all of the available space. For containers
 * like ListContainers, when percents add to more than 100 the elements will share the available space
 * per the ratio of percent vs total percent used so it is perfectly reasonable to set 3 elements all
 * to 100 and allow them to split the real-estate by 3.
 */
CanvasElement._StyleTypes.PercentHeight =			StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style MinWidth Number
 * 
 * The minimum width in pixels the element should consume. This only
 * works if the element is a child of a Container element.
 */
CanvasElement._StyleTypes.MinWidth =				StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style MinHeight Number
 * 
 * The minimum height in pixels the element should consume. This only
 * works if the element is a child of a Container element.
 */
CanvasElement._StyleTypes.MinHeight =				StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style MaxWidth Number
 * 
 * The maximum width in pixels the element should consume. This only
 * works if the element is a child of a Container element.
 */
CanvasElement._StyleTypes.MaxWidth =				StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style MaxHeight Number
 * 
 * The maximum height in pixels the element should consume. This only
 * works if the element is a child of a Container element.
 */
CanvasElement._StyleTypes.MaxHeight =				StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style HorizontalCenter Number
 * 
 * The distance in pixels from the horizontal center of the parent the element should be positioned.
 * Negative numbers indicate left of center, positive right of center. 
 * This only works if the element is a child of an AnchorContainer. 
 */
CanvasElement._StyleTypes.HorizontalCenter =		StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style VerticalCenter Number
 * 
 * The distance in pixels from the vertical center of the parent the element should be positioned.
 * Negative numbers indicate left of center, positive right of center. 
 * This only works if the element is a child of an AnchorContainer. 
 */
CanvasElement._StyleTypes.VerticalCenter =			StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style RotateDegrees Number
 * 
 * The number of degrees the element should be rotated (clockwise). When no RotateCenterX or
 * RotateCenterY is set, the element is rotated via its center point and rotated objects are
 * still positioned relative to their parent's coordinate plane after the transform has occurred.
 * This only works if the element is a child of an AnchorContainer. 
 */
CanvasElement._StyleTypes.RotateDegrees = 			StyleableBase.EStyleType.NORMAL;		// number

/**
 * @style RotateCenterX Number
 * 
 * The X position of the parent container the element should be rotated around. 
 * This only works if the element is a child of an AnchorContainer. 
 */
CanvasElement._StyleTypes.RotateCenterX = 			StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style RotateCenterY Number
 * 
 * The Y position of the parent container the element should be rotated around. 
 * This only works if the element is a child of an AnchorContainer. 
 */
CanvasElement._StyleTypes.RotateCenterY = 			StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style IncludeInLayout boolean
 * 
 * When false, the element is no longer considered in the parent container's layout. 
 * Typically this is used in conjunction with Visible, however sometimes you may want to
 * hide an element, but still have it consume container space.
 */
CanvasElement._StyleTypes.IncludeInLayout = 		StyleableBase.EStyleType.NORMAL;		// true || false

/**
 * @style CompositeLayer boolean
 * 
 * When true, this element renders itself and all children to a single layer and is treated
 * by its parent as a single element when rendering.  This is necessary and automatically enabled
 * for styles like alpha where the component and all its children must be pre-rendered, and then 
 * re-rendered with the appropriate effect.  
 * 
 * This is very expensive but can also be very beneficial when used appropriately.  
 * For example, if you have an application with a scrolling or constantly changing background
 * thereby always causing a full screen redraw, its beneficial to make the layer on top of the
 * background a composite layer.  This effectively buffers the layer. Only the delta changes
 * will be drawn to the composite. Otherwise the entire display chain would have to be re-drawn 
 * when the background moves. This is memory intensive as it effectively duplicates the rendering
 * area. Composite elements/children changing will update the composite layer, then that region of the 
 * composite layer needs to be copied up to the parent, resulting in an additional buffer copy.
 */
CanvasElement._StyleTypes.CompositeLayer = 					StyleableBase.EStyleType.NORMAL;		//true || false

//Text
/**
 * @style TextStyle String
 * @inheritable
 * 
 * Determines the style to render text. Available values are "normal", "bold", "italic", and "bold italic".
 */
CanvasElement._StyleTypes.TextStyle =						StyleableBase.EStyleType.INHERITABLE;		// "normal" || "bold" || "italic" || "bold italic"

/**
 * @style TextFont String
 * @inheritable
 * 
 * Determines the font family to use when rendering text such as "Arial".
 */
CanvasElement._StyleTypes.TextFont =						StyleableBase.EStyleType.INHERITABLE;		// "Arial"

/**
 * @style TextSize int
 * @inheritable
 * 
 * Determines the size in pixels to render text.
 */
CanvasElement._StyleTypes.TextSize =						StyleableBase.EStyleType.INHERITABLE;		// number

/**
 * @style TextHorizontalAlign String
 * @inheritable
 * 
 * Determines alignment when rendering text. Available values are "left", "center", and "right".
 */
CanvasElement._StyleTypes.TextHorizontalAlign =						StyleableBase.EStyleType.INHERITABLE;		// "left" || "center" || "right"

/**
 * @style TextVerticalAlign String
 * @inheritable
 * 
 * Determines the baseline when rendering text. Available values are "top", "middle", or "bottom".
 */
CanvasElement._StyleTypes.TextVerticalAlign =					StyleableBase.EStyleType.INHERITABLE;  	// "top" || "middle" || "bottom"

/**
 * @style LinePaddingTop Number
 * @inheritable
 * 
 * Padding to apply to the top of each line of text. This also impacts the size of the highlight background.
 * This is useful when using strange fonts that exceed their typical vertical bounds.
 */
CanvasElement._StyleTypes.TextLinePaddingTop = 				StyleableBase.EStyleType.INHERITABLE;		// number

/**
 * @style LinePaddingBottom Number
 * @inheritable
 * 
 * Padding to apply to the bottom of each line of text. This also impacts the size of the highlight background.
 * This is useful when using strange fonts that exceed their typical vertical bounds.
 */
CanvasElement._StyleTypes.TextLinePaddingBottom = 			StyleableBase.EStyleType.INHERITABLE;		// number

/**
 * @style TextLineSpacing Number
 * @inheritable
 * 
 * Vertical line spacing in pixels.
 */
CanvasElement._StyleTypes.TextLineSpacing = 				StyleableBase.EStyleType.INHERITABLE;		// number

/**
 * @style TextColor String
 * @inheritable
 * 
 * Hex color value to be used when drawing text. Format like "#FF0000" (red)
 */
CanvasElement._StyleTypes.TextColor =						StyleableBase.EStyleType.INHERITABLE;		// "#000000"

/**
 * @style TextFillType String
 * @inheritable
 * 
 * Determines the fill type when rendering text. Available values are "fill" and "stroke".
 * Stroke draws a border around characters, while fill completely fills them.
 */
CanvasElement._StyleTypes.TextFillType =					StyleableBase.EStyleType.INHERITABLE;		// "fill" || "stroke"

/**
 * @style TextHighlightedColor String
 * @inheritable
 * 
 * Hex color value to be used when drawing highlighted text. Format like "#FF0000" (red)
 */
CanvasElement._StyleTypes.TextHighlightedColor = 			StyleableBase.EStyleType.INHERITABLE;		// color "#000000"

/**
 * @style TextHighlightedColor String
 * @inheritable
 * 
 * Hex color value to be used when drawing highlighted text background. Format like "#FF0000" (red)
 */
CanvasElement._StyleTypes.TextHighlightedBackgroundColor = 	StyleableBase.EStyleType.INHERITABLE;		// color "#000000"

/**
 * @style TextCaretColor String
 * @inheritable
 * 
 * Hex color value to be used when drawing blinking text caret. "#FF0000" (red)
 */
CanvasElement._StyleTypes.TextCaretColor = 					StyleableBase.EStyleType.INHERITABLE;		// color "#000000"


/////////////Default Styles///////////////////////////////

CanvasElement.StyleDefault = new StyleDefinition();
//CanvasElement specific styles.
CanvasElement.StyleDefault.setStyle("Visible", 							true);
CanvasElement.StyleDefault.setStyle("BorderType", 						"none");
CanvasElement.StyleDefault.setStyle("BorderColor", 						"#000000");
CanvasElement.StyleDefault.setStyle("BorderThickness", 					1);
CanvasElement.StyleDefault.setStyle("BackgroundColor", 					null); 
CanvasElement.StyleDefault.setStyle("ShadowSize", 						0);
CanvasElement.StyleDefault.setStyle("ShadowOffsetX",					0);
CanvasElement.StyleDefault.setStyle("ShadowOffsetY",					0);
CanvasElement.StyleDefault.setStyle("ShadowColor",						"#000000");
CanvasElement.StyleDefault.setStyle("Alpha", 							1);
CanvasElement.StyleDefault.setStyle("AutoGradientType",					"none");
CanvasElement.StyleDefault.setStyle("AutoGradientStart",				(0.15));
CanvasElement.StyleDefault.setStyle("AutoGradientStop",					(-0.15));
CanvasElement.StyleDefault.setStyle("ClipContent",						false);
CanvasElement.StyleDefault.setStyle("SkinState", 						"");
CanvasElement.StyleDefault.setStyle("BackgroundShape", 					null); 		//ShapeBase
CanvasElement.StyleDefault.setStyle("FocusColor", 						"#3333FF");	// color ("#000000")
CanvasElement.StyleDefault.setStyle("FocusThickness", 					1);			// number

CanvasElement.StyleDefault.setStyle("Padding", 							0); 		//Not necessary, just for completeness
CanvasElement.StyleDefault.setStyle("PaddingTop", 						0);
CanvasElement.StyleDefault.setStyle("PaddingBottom",					0);
CanvasElement.StyleDefault.setStyle("PaddingLeft", 						0);
CanvasElement.StyleDefault.setStyle("PaddingRight", 					0);

CanvasElement.StyleDefault.setStyle("Enabled", 							true);
CanvasElement.StyleDefault.setStyle("MouseEnabled", 					true);
CanvasElement.StyleDefault.setStyle("Draggable", 						false);
CanvasElement.StyleDefault.setStyle("Cursor", 							null);		// "browsertype" || CursorDefinition
CanvasElement.StyleDefault.setStyle("TabStop", 							-1);		// number

CanvasElement.StyleDefault.setStyle("X", 								null);
CanvasElement.StyleDefault.setStyle("Y", 								null);
CanvasElement.StyleDefault.setStyle("Width", 							null);
CanvasElement.StyleDefault.setStyle("Height", 							null);
CanvasElement.StyleDefault.setStyle("Top", 								null);
CanvasElement.StyleDefault.setStyle("Left", 							null);
CanvasElement.StyleDefault.setStyle("Bottom", 							null);
CanvasElement.StyleDefault.setStyle("Right", 							null);
CanvasElement.StyleDefault.setStyle("PercentWidth", 					null);
CanvasElement.StyleDefault.setStyle("PercentHeight", 					null);
CanvasElement.StyleDefault.setStyle("MinWidth", 						5);		
CanvasElement.StyleDefault.setStyle("MinHeight", 						5);
CanvasElement.StyleDefault.setStyle("MaxWidth", 						null);
CanvasElement.StyleDefault.setStyle("MaxHeight", 						null);
CanvasElement.StyleDefault.setStyle("HorizontalCenter", 				null);
CanvasElement.StyleDefault.setStyle("VerticalCenter", 					null);
CanvasElement.StyleDefault.setStyle("RotateDegrees", 					0);
CanvasElement.StyleDefault.setStyle("RotateCenterX", 					null);
CanvasElement.StyleDefault.setStyle("RotateCenterY", 					null);
CanvasElement.StyleDefault.setStyle("IncludeInLayout", 					true);
CanvasElement.StyleDefault.setStyle("CompositeLayer",					false);

CanvasElement.StyleDefault.setStyle("TextStyle", 						"normal");
CanvasElement.StyleDefault.setStyle("TextFont", 						"Arial");
CanvasElement.StyleDefault.setStyle("TextSize", 						12);
CanvasElement.StyleDefault.setStyle("TextHorizontalAlign",				"left");
CanvasElement.StyleDefault.setStyle("TextVerticalAlign", 				"middle");
CanvasElement.StyleDefault.setStyle("TextLinePaddingTop", 				1);
CanvasElement.StyleDefault.setStyle("TextLinePaddingBottom", 			1);
CanvasElement.StyleDefault.setStyle("TextLineSpacing", 					0);
CanvasElement.StyleDefault.setStyle("TextColor", 						"#000000");
CanvasElement.StyleDefault.setStyle("TextFillType", 					"fill");
CanvasElement.StyleDefault.setStyle("TextHighlightedColor", 			"#FFFFFF");
CanvasElement.StyleDefault.setStyle("TextHighlightedBackgroundColor", 	"#000000");
CanvasElement.StyleDefault.setStyle("TextCaretColor", 					"#000000");


///////////CanvasElement Public Functions///////////////////////////////

/**
 * @function addStyleDefinition
 * Adds a style definition to the end element's definition list. Styles in this definition
 * will override styles in previously added definitions (lower index). Instance styles, set 
 * using setStyle() will override all definition styles.
 * Adding style definitions to elements already attached to the display chain is expensive, 
 * for better performance add definitions before attaching the element via addElement()
 * 
 * @param styleDefinition StyleDefinition
 * The StyleDefinition to add and associate with the element.
 * 
 * @returns StyleDefinition
 * The style definition just added.
 */
CanvasElement.prototype.addStyleDefinition = 
	function (styleDefinition)
	{
		return this.addStyleDefinitionAt(styleDefinition, this._styleDefinitions.length);
	};
	
/**
 * @function addStyleDefinitionAt
 * Inserts a style definition to this elements definition list at the specified index.
 * Definitions with higher indexes (added later) are higher priority. Instance styles, set 
 * using setStyle() will override all definition styles. 
 * Adding style definitions to elements already attached to the display chain is expensive, 
 * for better performance add definitions before attaching the element via addElement()
 * 
 * @param styleDefinition StyleDefinition
 * StyleDefinition to be added to this elements definition list.
 * 
 * @param index int
 * The index to insert the style definition within the elements definition list.
 * 
 * @returns StyleDefinition
 * Returns StyleDefinition just added when successfull, null if the StyleDefinition could not
 * be added due to the index being out of range or other error.
 */	
CanvasElement.prototype.addStyleDefinitionAt = 
	function (styleDefinition, index)
	{
		return this._addStyleDefinitionAt(styleDefinition, index, false);
	};
	
/**
 * @function removeStyleDefinition
 * Removes the supplied style definition from the element's style chain.
 * 
 * @param styleDefinition StyleDefinition
 * The StyleDefinition to remove from the element.
 * 
 * @returns StyleDefinition
 * The style definition just removed, or null if the supplied style 
 * definition is not associated with this element.
 */	
CanvasElement.prototype.removeStyleDefinition = 
	function (styleDefinition)
	{
		var index = this._styleDefinitions.indexOf(styleDefinition);
		if (index == -1)
			return null;
	
		return this.removeStyleDefinitionAt(index);
	};
	
/**
 * @function removeStyleDefinitionAt
 * Removes the style definition from the elements definition list at the supplied index.
 * 
 * @param index int
 * Index to be removed.
 * 
 * @returns StyleDefinition
 * Returns the StyleDefinition just removed if successfull, null if the definition could
 * not be removed due it it not being in this elements definition list, or index out of range.
 */		
CanvasElement.prototype.removeStyleDefinitionAt = 
	function (index)
	{
		return this._removeStyleDefinitionAt(index, false);
	};
	
/**
 * @function clearStyleDefinitions
 * Removes all style definitions from the element. This is more efficient than
 * removing definitions one at a time.
 */		
CanvasElement.prototype.clearStyleDefinitions = 
	function ()
	{
		return this._setStyleDefinitions([], false);
	};
	
/**
 * @function setStyleDefinitions
 * Replaces the elements current style definition list. This is more effecient than removing or 
 * adding style definitions one at a time.
 * 
 * @param styleDefinitions StyleDefinition
 * May be a StyleDefinition, or an Array of StyleDefinition
 */
CanvasElement.prototype.setStyleDefinitions = 
	function (styleDefinitions)
	{
		return this._setStyleDefinitions(styleDefinitions, false);
	};
	

	
/**
 * @function getNumStyleDefinitions
 * Gets the number of style definitions associated with this element.
 * 
 * @returns int
 * The number of style definitions.
 */		
CanvasElement.prototype.getNumStyleDefinitions = 
	function ()
	{
		return this._getNumStyleDefinitions(false);
	};
	
/**
 * @function _getNumStyleDefinitions
 * Gets the number of style definitions or default definitions associated with this element.
 * 
 * @param isDefault bool
 * When true, returns the number of default definitions.
 * 
 * @returns int
 * The number of style definitions.
 */			
CanvasElement.prototype._getNumStyleDefinitions = 
	function (isDefault)
	{
		if (isDefault == true)
			return this._styleDefinitionDefaults.length;

		return this._styleDefinitions.length;
	}
	
/**
 * @function getStyleDefinitionAt
 * Gets the style definition at the supplied zero base index.
 * 
 * @param index int
 * Index of the style definition to return;
 * 
 * @returns StyleDefinition
 * The style defenition at the supplied index, or null if index is out of range. 
 */		
CanvasElement.prototype.getStyleDefinitionAt = 
	function (index)
	{
		return this._getStyleDefinitionAt(index, false);
	};
	
/**
 * @function getStyle
 * @override
 * 
 * Gets the style value for this element. When retrieving a style, CanvasElements look
 * through their associated style chain, at each step if undefined is returned, they look
 * at the next step until a non-undefined value is found.
 * 
 * 1) Instance - Styles set directly to the element via setStyle()
 * 2) StyleDefinitions - Styles associated via its assigned StyleDefinitions
 * 3) StyleProxy - If proxy element is assigned, move to proxy element and repeat steps 1-3
 * 4) Inheritable - If style is inheritable, move up to parent element and repeat steps 1-4
 * 5) Default styles
 * 
 * @seealso StyleProxy
 * @seealso StyleableBase
 * 
 * @param styleName String
 * String representing the style value to be returned.
 * 
 * @returns Any
 * Returns the associated style value if found, otherwise undefined.
 * 
 */
CanvasElement.prototype.getStyle = 
	function (styleName)
	{
		return CanvasElement.base.prototype.getStyle.call(this, styleName);
	};	
	
//@override
CanvasElement.prototype.getStyleData = 
	function (styleName)
	{
		//Create cache if does not exist.
		var styleCache = this._stylesCache[styleName];
		if (styleCache == null)
		{
			styleCache = {styleData:new StyleData(styleName), cacheInvalid:true};
			this._stylesCache[styleName] = styleCache;
		}
		
		//Check cache
		if (styleCache.cacheInvalid == false)
			return styleCache.styleData;
		
		styleCache.cacheInvalid = false;
		var styleData = styleCache.styleData;
		
		//Reset the cache data.
		styleData.priority = [];
		styleData.value = undefined;
		
		//Check instance
		if (styleName in this._styleMap)
			styleData.value = this._styleMap[styleName];
		
		if (styleData.value !== undefined)
		{
			styleData.priority.push(CanvasElement.EStylePriorities.INSTANCE);
			return styleData;
		}
		
		//Counters (priority depth)
		var ctr = 0;
		
		//Check definitions
		for (ctr = this._styleDefinitions.length - 1; ctr >= 0; ctr--)
		{
			styleData.value = this._styleDefinitions[ctr].getStyle(styleName);
			
			if (styleData.value !== undefined)
			{
				styleData.priority.push(CanvasElement.EStylePriorities.DEFINITION);
				styleData.priority.push((this._styleDefinitions.length - 1) - ctr); //StyleDefinition depth
				
				return styleData;
			}
		}
		
		var thisStyleType = this._getStyleType(styleName);
		
		var styleType = null;
		var proxy = null;
		var ctr2 = 0;
		
		//Proxy / Inheritable not allowed for sub styles.
		if (thisStyleType != StyleableBase.EStyleType.SUBSTYLE)
		{
			//Check proxy
			proxy =	this._styleProxy;
			while (proxy != null)
			{
				styleType = proxy._proxyElement._getStyleType(styleName);
				
				//Proxy not allowed for sub styles.
				if (styleType == StyleableBase.EStyleType.SUBSTYLE)
					break;
				
				if ((styleType != null && styleName in proxy._proxyMap == false) ||		//Defined & not in proxy map
					(styleType == null && "_Arbitrary" in proxy._proxyMap == false)) 	//Not defined and no _Arbitrary flag
					break;
				
				//Check proxy instance
				if (styleName in proxy._proxyElement._styleMap)
					styleData.value = proxy._proxyElement._styleMap[styleName];
				
				if (styleData.value !== undefined)
				{
					styleData.priority.push(CanvasElement.EStylePriorities.PROXY);		
					styleData.priority.push(ctr);	//Proxy depth (chained proxies)
					styleData.priority.push(CanvasElement.EStylePriorities.INSTANCE);	
					
					return styleData;
				}
				
				//Check proxy definitions
				for (ctr2 = proxy._proxyElement._styleDefinitions.length - 1; ctr2 >= 0; ctr2--)
				{
					styleData.value = proxy._proxyElement._styleDefinitions[ctr2].getStyle(styleName);
					
					if (styleData.value !== undefined)
					{
						styleData.priority.push(CanvasElement.EStylePriorities.PROXY);
						styleData.priority.push(ctr);	//Proxy depth (chained proxies)
						styleData.priority.push(CanvasElement.EStylePriorities.DEFINITION);	
						styleData.priority.push((proxy._proxyElement._styleDefinitions.length - 1) - ctr2); //definition depth	
						
						return styleData;
					}
				}
				
				ctr++;
				proxy = proxy._proxyElement._styleProxy;
			}
			
			//Check inherited
			proxy = null;
			styleType = thisStyleType;
			var parent = this;
			
			ctr = 0;
			ctr2 = 0;
			var ctr3 = 0;
			
			while (styleType == StyleableBase.EStyleType.INHERITABLE)
			{
				parent = parent._parent;
				
				if (parent == null)
					break;
				
				//Check parent instance
				if (styleName in parent._styleMap)
					styleData.value = parent._styleMap[styleName];
				
				if (styleData.value !== undefined)
				{
					styleData.priority.push(CanvasElement.EStylePriorities.INHERITED);	
					styleData.priority.push(ctr);	//Parent depth
					styleData.priority.push(CanvasElement.EStylePriorities.INSTANCE);
					
					return styleData;
				}
				
				//Check style definitions
				for (ctr2 = parent._styleDefinitions.length - 1; ctr2 >= 0; ctr2--)
				{
					styleData.value = parent._styleDefinitions[ctr2].getStyle(styleName);
					
					if (styleData.value !== undefined)
					{
						styleData.priority.push(CanvasElement.EStylePriorities.INHERITED);	
						styleData.priority.push(ctr);	//Parent depth
						styleData.priority.push(CanvasElement.EStylePriorities.DEFINITION);
						styleData.priority.push((parent._styleDefinitions.length - 1) - ctr2); //Definition depth	
						
						return styleData;
					}
				}
				
				//Check parent proxy
				proxy = parent._styleProxy;
				ctr2 = 0;
				while (proxy != null)
				{
					styleType = proxy._proxyElement._getStyleType(styleName);
					
					//Proxy not allowed for sub styles.
					if (styleType == StyleableBase.EStyleType.SUBSTYLE)
						break;
					
					if ((styleType != null && styleName in proxy._proxyMap == false) ||		//Defined & not in proxy map
						(styleType == null && "_Arbitrary" in proxy._proxyMap == false)) 	//Not defined and no _Arbitrary flag
						break;
					
					//Check proxy instance
					if (styleName in proxy._proxyElement._styleMap)
						styleData.value = proxy._proxyElement._styleMap[styleName];
					
					if (styleData.value !== undefined)
					{
						styleData.priority.push(CanvasElement.EStylePriorities.INHERITED);		
						styleData.priority.push(ctr);	//Parent depth
						styleData.priority.push(CanvasElement.EStylePriorities.PROXY);		
						styleData.priority.push(ctr2);	//Proxy depth (chained proxies)
						styleData.priority.push(CanvasElement.EStylePriorities.INSTANCE);		
						
						return styleData;
					}
					
					//Check proxy definition
					for (ctr3 = proxy._proxyElement._styleDefinitions.length - 1; ctr3 >= 0; ctr3--)
					{
						styleData.value = proxy._proxyElement._styleDefinitions[ctr3].getStyle(styleName);
						
						if (styleData.value !== undefined)
						{
							styleData.priority.push(CanvasElement.EStylePriorities.INHERITED);	
							styleData.priority.push(ctr);	//Parent depth
							styleData.priority.push(CanvasElement.EStylePriorities.PROXY);	
							styleData.priority.push(ctr2);	//Proxy depth (chained proxies)
							styleData.priority.push(CanvasElement.EStylePriorities.DEFINITION);
							styleData.priority.push((parent._styleDefinitions.length - 1) - ctr3); //Definition depth	
							
							return styleData;
						}
					}
	
					ctr2++;
					proxy = proxy._proxyElement._styleProxy;
				}
				
				ctr++;
				styleType = parent._getStyleType(styleName);
			}
		}
		
		//Check default definitions
		for (ctr = this._styleDefinitionDefaults.length - 1; ctr >= 0; ctr--)
		{
			styleData.value = this._styleDefinitionDefaults[ctr].getStyle(styleName);
			
			if (styleData.value !== undefined)
			{
				styleData.priority.push(CanvasElement.EStylePriorities.DEFAULT_DEFINITION);
				styleData.priority.push((this._styleDefinitionDefaults.length - 1) - ctr); //StyleDefinition depth
				
				return styleData;
			}
		}
		
		//Check class
		styleData.value = this._getClassStyle(styleName);
		styleData.priority.push(CanvasElement.EStylePriorities.CLASS);
		
		return styleData;		
	};
	
//@override	
CanvasElement.prototype.setStyle = 
	function (styleName, value)
	{
		var oldValue = undefined;
		if (styleName in this._styleMap)
			oldValue = this._styleMap[styleName];

		//No change
		if (oldValue === value)
			return;
		
		if (value === undefined)
			delete this._styleMap[styleName];
		else
			this._styleMap[styleName] = value;
		
		//Spoof a style changed event and pass it to _onExternalStyleChanged for normal handling
		this._onExternalStyleChanged(new StyleChangedEvent(styleName));
	};			

/**
 * @function getManager
 * Gets the CanvasManager currently associated with this element.
 * 
 * @returns CanvasManager
 * The CanvasManager currently associated with this element.
 */	
CanvasElement.prototype.getManager = 
	function ()
	{
		return this._manager;
	};

/**
 * @function setName
 * Sets an arbitrary name to this element. The system does not use this value,
 * it is for use by implementors if a way to differentiate elements is needed.
 * 
 * @param name String
 * A String to use as the element's name.
 */	
CanvasElement.prototype.setName = 
	function (name)
	{
		if (this._name == name)
			return false;
		
		this._name = name;
		return true;
	};
	
/**
 * @function getName
 * Gets the name associated with this element.
 * 
 * @returns String
 * The name associated with this element.
 */		
CanvasElement.prototype.getName = 
	function ()
	{
		return this._name;
	};
	
/**
 * @function getMouseIsDown
 * Gets the state of the mouse for this element.
 * 
 * @returns boolean
 * Returns true if the mouse is currently pressed, false otherwise.
 */		
CanvasElement.prototype.getMouseIsDown = 
	function()
	{
		return this._mouseIsDown;
	};	

/**
 * @function getParent
 * Gets this element's parent element.
 * 
 * @returns CanvasElement
 * This element's parent element.
 */		
CanvasElement.prototype.getParent = 
	function ()
	{
		return this._parent;
	};
	
/**
 * @function rotatePoint
 * Rotates a point point on this element's parent relative to this element's rotation transformation.
 * This is used to transform a point from the parent's coordinate plane to a child's coordinate plane or vice versa.
 * Typically you should use translatePointFrom() or translatePointTo() rather than rotatePoint().
 * 
 * @param point Object
 * Point object {x:0, y:0};
 * 
 * @param reverse boolean
 * When true, rotates a point on the parent's plane, to the childs plane. 
 * When false, rotates a point on the childs plane, to the parents plane.
 */	
CanvasElement.prototype.rotatePoint = 
	function (point, reverse)
	{
		if (this._rotateDegrees == 0)
			return;
		
		var radius = 
			Math.sqrt(
					(Math.abs(point.x - this._rotateCenterX) * Math.abs(point.x - this._rotateCenterX)) +
					(Math.abs(point.y - this._rotateCenterY) * Math.abs(point.y - this._rotateCenterY))
					);
		
		var degrees;
		if (reverse == false)
			degrees = 360 - this._rotateDegrees + CanvasElement.radiansToDegrees(Math.atan2(point.x - this._rotateCenterX, point.y - this._rotateCenterY));
		else
			degrees = 360 + this._rotateDegrees + CanvasElement.radiansToDegrees(Math.atan2(point.x - this._rotateCenterX, point.y - this._rotateCenterY));
			
		point.x = Math.sin(CanvasElement.degreesToRadians(degrees)) * radius + this._rotateCenterX;
		point.y = Math.cos(CanvasElement.degreesToRadians(degrees)) * radius + this._rotateCenterY;
	};

/**
 * @function translatePointFrom
 * Translates a point from an element to this element regardless of this element's transformation,
 * depth, or position in the display hierarchy. For example, you can call this to translate a point on
 * the canvas to the relative point on this element.
 * 
 * @param point Object
 * Point - object containing {x:0, y:0}.
 * 
 * @param relativeFromElement CanvasElement
 * The element that the supplied point is relative too.
 */	
CanvasElement.prototype.translatePointFrom = 
	function (point, relativeFromElement)
	{
		return relativeFromElement.translatePointTo(point, this);
	};

/**
 * @function translatePointTo
 * Translates a point from this element to another element regardless of this element's transformation,
 * depth, or position in the display hierarchy. For example, you can call this to translate a point on
 * this element to a point on the canvas.
 * 
 * @param point Object
 * Point - object containing {x:0, y:0}.
 * 
 * @param relativeToElement CanvasElement
 * The element to translate this element's point too.
 */		
CanvasElement.prototype.translatePointTo = 
	function (point, relativeToElement)
	{
		if (relativeToElement == null || relativeToElement == this)
			return false;
		
		if (this._manager == null || this._manager != relativeToElement._manager)
			return false;
		
		//Build up both parent chains so we can find common parent//
		////////////////////////////////////////////////////////////
		
		var commonParent = null;
		
		//We are a child of relativeElement
		var thisChain = [];
		thisChain.push(this);
		while (commonParent == null && thisChain[thisChain.length - 1]._parent != null)
		{
			if (thisChain[thisChain.length - 1]._parent == relativeToElement)
				commonParent = relativeToElement;
			else
				thisChain.push(thisChain[thisChain.length - 1]._parent);
		}
		
		//Relative element is a child of us.
		var relativeChain = [];
		if (commonParent == null)
		{
			relativeChain.push(relativeToElement);
			while (commonParent == null && relativeChain[thisChain.length - 1]._parent != null)
			{
				if (relativeChain[relativeChain.length - 1]._parent == this)
					commonParent = this;
				else
					relativeChain.push(relativeChain[relativeChain.length - 1]._parent);
			}
		}
		
		//Someone is doing something weird and we're not in each others direct chains so we have to translate up AND down.
		if (commonParent == null)
		{
			//We know we have the same canvas manager, so just keep popping both arrays till we find something different.
			while (thisChain[thisChain.length - 1] == relativeChain[relativeChain.length - 1])
			{
				commonParent = thisChain[thisChain.length - 1];
				
				thisChain.pop();
				relativeChain.pop();
			}
		}
		
		//Translate up to common parent.
		var currentParent = this;
		while (currentParent != null && currentParent != commonParent)
		{
			point.x += currentParent._x;
			point.y += currentParent._y;
			
			currentParent.rotatePoint(point, false);
			
			currentParent = currentParent._parent;
		}
		
		//Translate down to relativeElement
		for (var i = relativeChain.length - 1; i >= 0; i--)
		{
			//Rotate the point backwards so we can translate the point to the element's rotated plane.
			relativeChain[i].rotatePoint(point, true);
			
			//Adjust the mouse point to within this element rather than its position in parent.
			point.x -= relativeChain[i]._x;
			point.y -= relativeChain[i]._y;
		}
		
		return true;
	};
	
/**
 * @function translateMetricsFrom
 * Translates a DrawMetrics from another element's to this element regardless of this element's transformation,
 * depth, or position in the display hierarchy. 
 * 
 * @param metrics DrawMetrics
 * Metrics to transform from the relative to this element.
 * 
 * @param relativeFromElement CanvasElement
 * The element to translate the supplied metrics too. If relativeToElement equals
 * null or this, will return metrics the same as the supplied metrics.
 * 
 * @returns DrawMetrics
 * Translated DrawMetrics relative to the supplied element.
 */	
CanvasElement.prototype.translateMetricsFrom = 	
	function (metrics, relativeFromElement)
	{
		return relativeFromElement.translateMetricsTo(metrics, this);
	};
	
/**
 * @function translateMetricsTo
 * Translates a DrawMetrics from this element's to another element regardless of this element's transformation,
 * depth, or position in the display hierarchy. 
 * 
 * @param metrics DrawMetrics
 * Metrics to transform to from this element to the supplied relative element.
 * 
 * @param relativeToElement CanvasElement
 * The element to translate the supplied metrics too. If relativeToElement equals
 * null or this, will return metrics the same as the supplied metrics.
 * 
 * @returns DrawMetrics
 * Translated DrawMetrics relative to the supplied element.
 */	
CanvasElement.prototype.translateMetricsTo = 
	function (metrics, relativeToElement)
	{
		var translatedMetrics = new DrawMetrics();
		if (relativeToElement == null || relativeToElement == this)
		{
			translatedMetrics._x = metrics._x;
			translatedMetrics._y = metrics._y;
			translatedMetrics._width = metrics._width;
			translatedMetrics._height = metrics._height;
			
			return translatedMetrics;
		}

		if (this._manager == null || this._manager != relativeToElement._manager)
			return null;
		
		//Build up both parent chains so we can find common parent.
		var commonParent = null;
		
		//We are a child of relativeElement
		var thisChain = [];
		thisChain.push(this);
		while (commonParent == null && thisChain[thisChain.length - 1]._parent != null)
		{
			if (thisChain[thisChain.length - 1]._parent == relativeToElement)
				commonParent = relativeToElement;
			else
				thisChain.push(thisChain[thisChain.length - 1]._parent);
		}
		
		//Relative element is a child of us.
		var relativeChain = [];
		if (commonParent == null)
		{
			relativeChain.push(relativeToElement);
			while (commonParent == null && relativeChain[thisChain.length - 1]._parent != null)
			{
				if (relativeChain[relativeChain.length - 1]._parent == this)
					commonParent = this;
				else
					relativeChain.push(relativeChain[relativeChain.length - 1]._parent);
			}
		}
		
		//Someone is doing something weird and we're not in each others direct chains so we have to translate up AND down.
		if (commonParent == null)
		{
			//We know we have the same canvas manager, so just keep popping both arrays till we find something different.
			while (thisChain[thisChain.length - 1] == relativeChain[relativeChain.length - 1])
			{
				commonParent = thisChain[thisChain.length - 1];
				
				thisChain.pop();
				relativeChain.pop();
			}
		}
		
		var pointTl = {x:metrics._x, y:metrics._y};
		var pointTr = {x:metrics._x + metrics._width, y:metrics._y};
		var pointBr = {x:metrics._x + metrics._width, y:metrics._y + metrics._height};
		var pointBl = {x:metrics._x, y:metrics._y + metrics._height};
		
		//Translate up to common parent.
		var currentParent = this;
		while (currentParent != null && currentParent != commonParent)
		{
			pointTl.x += currentParent._x;
			pointTl.y += currentParent._y;
			
			pointTr.x += currentParent._x;
			pointTr.y += currentParent._y;
			
			pointBr.x += currentParent._x;
			pointBr.y += currentParent._y;
			
			pointBl.x += currentParent._x;
			pointBl.y += currentParent._y;
			
			currentParent.rotatePoint(pointTl, false);
			currentParent.rotatePoint(pointTr, false);
			currentParent.rotatePoint(pointBl, false);
			currentParent.rotatePoint(pointBr, false);
			
			currentParent = currentParent._parent;
		}
		
		//Translate down to relativeElement
		for (var i = relativeChain.length - 1; i >= 0; i--) 
		{
			//Rotate the point backwards so we can translate the point to the element's rotated plane.
			relativeChain[i].rotatePoint(pointTl, true);
			relativeChain[i].rotatePoint(pointTr, true);
			relativeChain[i].rotatePoint(pointBl, true);
			relativeChain[i].rotatePoint(pointBr, true);
			
			//Adjust the mouse point to within this element rather than its position in parent.
			pointTl.x -= relativeChain[i]._x;
			pointTl.y -= relativeChain[i]._y;
			
			pointTr.x -= relativeChain[i]._x;
			pointTr.y -= relativeChain[i]._y;
			
			pointBr.x -= relativeChain[i]._x;
			pointBr.y -= relativeChain[i]._y;
			
			pointBl.x -= relativeChain[i]._x;
			pointBl.y -= relativeChain[i]._y;
		}
		
		var minX = Math.min(pointTl.x, pointTr.x, pointBr.x, pointBl.x);
		var maxX = Math.max(pointTl.x, pointTr.x, pointBr.x, pointBl.x);
		var minY = Math.min(pointTl.y, pointTr.y, pointBr.y, pointBl.y);
		var maxY = Math.max(pointTl.y, pointTr.y, pointBr.y, pointBl.y);
		
		translatedMetrics._x = minX;
		translatedMetrics._y = minY;
		translatedMetrics._width = maxX - minX;
		translatedMetrics._height = maxY - minY;
		
		return translatedMetrics;
	};	
	
/**
 * @function getMetrics
 * Gets a DrawMetrics object containing the elements bounding box information
 * x, y, width, height, relative to the supplied element regardless of this element's transformation,
 * depth, or position in the display hierarchy. For example, you can call this get the elements width and height,
 * or to get this element's bounding box relative to the canvas or any other element.
 * 
 * @param relativeToElement CanvasElement
 * The element to translate this elements bounding box too. If relativeToElement equals
 * null or this, will return metrics relative to this element: {x:0, y:0, width:thisWidth, height:thisHeight}.
 * 
 * @returns DrawMetrics
 * DrawMetrics of this element relative to the supplied element.
 */	
CanvasElement.prototype.getMetrics = 
	function (relativeToElement)
	{
		if (relativeToElement == null)
			relativeToElement = this;
	
		if (this._manager == null || this._manager != relativeToElement._manager)
			return null;
	
		var metrics = new DrawMetrics();
		metrics._x = 0;
		metrics._y = 0;
		metrics._width = this._width;
		metrics._height = this._height;
		
		if (relativeToElement == this)
			return metrics;
		
		return this.translateMetricsTo(metrics, relativeToElement);
	};

//@Override
CanvasElement.prototype.addEventListener = 	
	function (type, callback)
	{
		CanvasElement.base.prototype.addEventListener.call(this, type, callback);
	
		//Broadcast events (dispatched only by manager)
		if ((type == "enterframe" || 
			type == "localechanged" || 
			type == "mousemoveex") &&
			this._manager != null)
		{
			this._manager._broadcastDispatcher.addEventListener(type, callback);
		}
		
		return true;
	};

//@Override	
CanvasElement.prototype.removeEventListener = 
	function (type, callback)
	{
		if (CanvasElement.base.prototype.removeEventListener.call(this, type, callback) == true)
		{
			//Broadcast events (dispatched only by manager)
			if ((type == "enterframe" || 
				type == "localechanged" || 
				type == "mousemoveex") &&
				this._manager != null)
			{
				this._manager._broadcastDispatcher.removeEventListener(type, callback);
			}
			
			return true;
		}
		
		return false;
	};	

	
////////////Capture Phase Event Listeners///////////////////////	
	
/**
 * @function addCaptureListener
 * Registers an event listener function to be called during capture phase.
 * 
 * @seealso ElementEvent
 * 
 * 
 * @param type String
 * String representing the event type.
 * 
 * @param callback Function
 * Function to be called when the event occurs.
 */	
CanvasElement.prototype.addCaptureListener = 
	function (type, callback)
	{
		if (this._captureListeners[type] == null)
			this._captureListeners[type] = [];
		
		this._captureListeners[type].push(callback);
		
		return true;
	};

/**
 * @function removeCaptureListener
 * Removes a capture event listener.
 * 
 * @seealso ElementEvent
 * 
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
CanvasElement.prototype.removeCaptureListener = 
	function (type, callback)
	{
		if (!(type in this._captureListeners))
			return false;
	
		for (var i = 0; i < this._captureListeners[type].length; i++)
		{
			if (this._captureListeners[type][i] == callback)
			{
				this._captureListeners[type].splice(i, 1);
				return true;
			}
		}
		
		return false;
	};

/**
 * @function hasCaptureListener
 * Checks if an event capture listener has been registered with this CanvasElement
 * 
 * @seealso ElementEvent
 * 
 * 
 * @param type String
 * String representing the event type.
 * 
 * @param callback Function
 * Function callback to be called when the event occurs. This may be null to check
 * if the CanvasElement has any capture events registered for the provided type.
 * 
 * @returns boolean
 * Returns true if the CanvasElement has the provided capture callback registered for the 
 * provided type, or any capture callback for the provided type if the callback parameter is null.
 * Otherwise, returns false.
 */		
CanvasElement.prototype.hasCaptureListener = 
	function (type, callback)
	{
		if (!(type in this._captureListeners))
			return false;
	
		if (callback == null && this._captureListeners[type].length > 0)
			return true;
		
		for (var i = 0; i < this._captureListeners[type].length; i++)
		{
			if (this._captureListeners[type][i] == callback)
				return true;
		}
		
		return false;
	};	
	
/////////////CanvasElement Public Static Functions//////////////////

/**
 * @function adjustColorLight
 * @static
 * Adjusts supplied color brightness.
 * 
 * @param color String
 * Hex color value be adjusted. Format like "#FF0000" (red)
 * 
 * @param percent Number
 * Value between -1 and +1. -1 will return white. +1 will return black.
 * 
 * @returns String
 * Adjusted Hex color value.
 */
//Looks complicated... not really. Its using a percentage of the distance between black(neg) or white(pos) on all 3 channels independently.
CanvasElement.adjustColorLight = 
	function (color, percent) 
	{   
	    var f = parseInt(color.slice(1), 16);
	    var t = percent < 0 ? 0 : 255;
	    var p = percent < 0 ? percent * -1 : percent;
	    var R = f >> 16;
	    var G = f >> 8 & 0x00FF;
	    var B = f & 0x0000FF;
	    
	    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
	};
	
/**
 * @function radiansToDegrees
 * @static
 * Calculates radians to degrees.
 * 
 * @param radians Number
 * Radians to be calculated to degrees.
 * 
 * @returns Number
 * Resulting degrees from supplied radians.
 */	
CanvasElement.radiansToDegrees = 
	function (radians)
	{
		return radians * (180 / Math.PI);
	};
	
/**
 * @function degreesToRadians
 * @static
 * Calculates degrees to radians.
 * 
 * @param degrees Number
 * Degrees to be calculated to degrees.
 * 
 * @returns Number
 * Resulting radians from supplied degrees.
 */		
CanvasElement.degreesToRadians = 
	function (degrees)
	{
		return degrees * (Math.PI / 180);
	};

/**
 * @function normalizeDegrees
 * @static
 * Adjusts degrees less than 0 or greater than 360 to corresponding degrees between 0 and 360. 
 * This is useful when rotating an element by increments.
 * 
 * @param value Number
 * Degrees to normalize.
 * 
 * @returns Number
 * Degrees between 0 and 360.
 */	
CanvasElement.normalizeDegrees = 
	function (value)
	{
		while (value >= 360)
			value = value - 360;
		while (value < 0)
			value = value + 360;
		
		return value;
	};	

/**
 * @function roundToPrecision
 * @static
 * Rounds a number to specified precision (decimal points).
 * 
 * @param value Number
 * Number to round.
 * 
 * @param precision int
 * Number of decimal points.
 * 
 * @returns Number
 * Rounded value.
 */	
CanvasElement.roundToPrecision = 
	function (value, precision)
	{
		if (precision == 0)
			return Math.round(value);
		
		var multiplier = Math.pow(10, precision);
		
		value = value * multiplier;
		value = Math.round(value);
		return value / multiplier;
	};
	
/////////////CanvasElement Internal Static Functions//////////////////	
	
CanvasElement._browserType = "";	
	
//Map of maps for character widths by font size/style. Some browsers render canvas text by pixel rather 
//than character width. For example, an uppercase "T" with a lowercase "e" next to it ("Te"), 
//the "e" will actually render overlapping the "T" since the "e" is not tall enough to collide with the top of the "T". 
//This doesnt work for word processing, we need to be able to identify each character so we measure and 
//store character widths here, and render all text on a character by character basis for consistency.
CanvasElement._characterWidthMap = Object.create(null); 

CanvasElement._characterFillBitmapMap = Object.create(null);
CanvasElement._characterStrokeBitmapMap = Object.create(null);

CanvasElement._measureCharBitmap = null;
CanvasElement._measureCharContext = null;
(	function () 
	{
		CanvasElement._measureCharBitmap = document.createElement("canvas");
		CanvasElement._measureCharBitmap.width = 1;
		CanvasElement._measureCharBitmap.height = 1;
		
		CanvasElement._measureCharContext = CanvasElement._measureCharBitmap.getContext("2d");
	}
)();

/**
 * @function _measureText
 * @static
 * Measures text on a character by character basis. Unfortunately, browsers will give
 * different widths for strings of text, than text measured character by character. It appears
 * text width changes depending on which characters are next to which characters. This behavior
 * cannot be used for text that requires highlighting or editing. This function records the character
 * width per font in a map, and then uses that map to measure text widths. This surprisingly turns out to be 
 * just as fast as measuring full text via the canvas context (since canvas sucks so bad at text rendering).
 * 
 * @param text String
 * The text string to measure.
 * 
 * @param fontString String
 * Font styling to use when measuring. Use _getFontString()
 * 
 * @returns Number
 * Width of the text as measured via characters.
 */
CanvasElement._measureText = 
	function (text, fontString)
	{
		var charMap = CanvasElement._characterWidthMap[fontString];
		if (charMap == null)
		{
			charMap = Object.create(null);
			CanvasElement._characterWidthMap[fontString] = charMap;
		}
		
		var result = 0;
		var charWidth = 0;
		var fontSet = false;
		
		for (var i = 0; i < text.length; i++)
		{
			charWidth = charMap[text[i]];
			if (charWidth == null)
			{
				if (fontSet == false) 
				{
					CanvasElement._measureCharContext.font = fontString;
					fontSet = true;
				}
				
				charWidth = Math.ceil(CanvasElement._measureCharContext.measureText(text[i]).width);
				charMap[text[i]] = charWidth;
			}
			
			result += charWidth;
		}
		
		return result;
	};

/**
 * @function _fillText
 * @static
 * Renders text on a character by character basis. Unfortunately, browsers will give
 * different widths for strings of text, than text measured character by character. It appears
 * text width changes depending on which characters are next to which characters. This behavior
 * cannot be used for text that requires highlighting or editing. This function records character
 * bitmaps per font in a map, and then uses that map to render characters. This surprisingly turns out to be 
 * just as fast as rendering full text via the canvas context (since canvas sucks so bad at text rendering).
 * 
 * @param ctx Canvas2DContext
 * The canvas context to render the text. 
 * 
 * @param text String
 * The text string to render.
 * 
 * @param x Number
 * The X coordinate to render the text.
 * 
 * @param y Number
 * The Y coordinate to render the text.
 * 
 * @param fontString String
 * Font styling to use when measuring. Use _getFontString()
 * 
 * @param color String
 * Hex color value to be used to render the text. Format like "#FF0000" (red).
 * 
 * @param baseline String
 * Text Y position relative to Y coordinate. ("top", "middle", or "bottom")
 */	
CanvasElement._fillText = 
	function (ctx, text, x, y, fontString, color, baseline)
	{
		//Firefox weirdly renders text higher than normal
		if (CanvasElement._browserType == "Firefox")
			y += 2;
	
		var bitmapMap = CanvasElement._characterFillBitmapMap[fontString];
		if (bitmapMap == null)
		{
			bitmapMap = Object.create(null);
			CanvasElement._characterFillBitmapMap[fontString] = bitmapMap;
		}
		
		for (var i = 0; i < text.length; i++)
		{
			var bitmapAndContext = bitmapMap[text[i]];
			
			if (bitmapAndContext == null)
			{
				bitmapAndContext = {canvas:null, context:null, fontSize:0};
				bitmapMap[text[i]] = bitmapAndContext;
				
				bitmapAndContext.canvas = document.createElement("canvas");
				
				var fontSplit = fontString.split(" ");
				var fontSize = 0;
				for (var i2 = 0; i2 < fontSplit.length; i2++)
				{
					if (fontSplit[i2].length >= 3)
					{
						var pxString = fontSplit[i2].substr(fontSplit[i2].length - 2, 2);
						if (pxString == "px")
						{
							fontSize = Number(fontSplit[i2].substr(0, fontSplit[i2].length - 2));
							break;
						}
					}
				}
				
				bitmapAndContext.fontSize = fontSize;
				
				bitmapAndContext.canvas.height = fontSize + 4;
				bitmapAndContext.canvas.width = CanvasElement._measureText(text[i], fontString);
				
				bitmapAndContext.context = bitmapAndContext.canvas.getContext("2d");
				bitmapAndContext.context.font = fontString;
				bitmapAndContext.context.textBaseline = "middle";
				bitmapAndContext.context.textAlign = "left";
				bitmapAndContext.context.strokeStyle = "#000000";
				bitmapAndContext.context.fillStyle = "#000000";
				bitmapAndContext.context.fillText(text[i], 0, bitmapAndContext.canvas.height / 2);
				
				bitmapAndContext.context.globalCompositeOperation = "source-atop";
			}
			
			if (bitmapAndContext.context.fillStyle != color) 
			{
				bitmapAndContext.context.fillStyle = color;
				
				bitmapAndContext.context.beginPath();
				bitmapAndContext.context.moveTo(0, 0);
				bitmapAndContext.context.lineTo(bitmapAndContext.canvas.width, 0);
				bitmapAndContext.context.lineTo(bitmapAndContext.canvas.width, bitmapAndContext.canvas.height);
				bitmapAndContext.context.lineTo(0, bitmapAndContext.canvas.height);
				bitmapAndContext.context.closePath();
				
				bitmapAndContext.context.fill();
			}
			
			if (baseline == "top")
				ctx.drawImage(bitmapAndContext.canvas, x, Math.round(y - ((bitmapAndContext.canvas.height - bitmapAndContext.fontSize) / 2)));
			else if (baseline == "bottom")
				ctx.drawImage(bitmapAndContext.canvas, x, Math.round(y - (((bitmapAndContext.canvas.height - bitmapAndContext.fontSize) / 2) + bitmapAndContext.fontSize)));
			else //	"middle"
				ctx.drawImage(bitmapAndContext.canvas, x, Math.round(y - (bitmapAndContext.canvas.height / 2)));
			
			if (text.length == 1)
				return;
			
			x += CanvasElement._measureText(text[i], fontString);
		}
	};	
	
/**
 * @function _strokeText
 * @static
 * Renders text on a character by character basis. Unfortunately, browsers will give
 * different widths for strings of text, than text measured character by character. It appears
 * text width changes depending on which characters are next to which characters. This behavior
 * cannot be used for text that requires highlighting or editing. This function records character
 * bitmaps per font in a map, and then uses that map to render characters. This surprisingly turns out to be 
 * just as fast as rendering full text via the canvas context (since canvas sucks so bad at text rendering).
 * 
 * @param ctx Canvas2DContext
 * The canvas context to render the text. 
 * 
 * @param text String
 * The text string to render.
 * 
 * @param x Number
 * The X coordinate to render the text (Upper left).
 * 
 * @param y Number
 * The Y coordinate to render the text (Uppder left).
 * 
 * @param fontString String
 * Font styling to use when measuring. Use _getFontString()
 * 
 * @param color String
 * Hex color value to be used to render the text. Format like "#FF0000" (red).
 * 
 * @param baseline String
 * Text Y position relative to Y coordinate. ("top", "middle", or "bottom")
 */	
CanvasElement._strokeText = 
	function (ctx, text, x, y, fontString, color, baseline)
	{
		//Firefox weirdly renders text higher than normal
		if (CanvasElement._browserType == "Firefox")
			y += 2;
	
		var bitmapMap = CanvasElement._characterStrokeBitmapMap[fontString];
		if (bitmapMap == null)
		{
			bitmapMap = Object.create(null);
			CanvasElement._characterStrokeBitmapMap[fontString] = bitmapMap;
		}
		
		for (var i = 0; i < text.length; i++)
		{
			var bitmapAndContext = bitmapMap[text[i]];
			
			if (bitmapAndContext == null)
			{
				bitmapAndContext = {canvas:null, context:null};
				bitmapMap[text[i]] = bitmapAndContext;
				
				bitmapAndContext.canvas = document.createElement("canvas");
				
				var fontSplit = fontString.split(" ");
				var fontSize = 0;
				for (var i2 = 0; i2 < fontSplit.length; i2++)
				{
					if (fontSplit[i2].length >= 3)
					{
						var pxString = fontSplit[i2].substr(fontSplit[i2].length - 2, 2);
						if (pxString == "px")
						{
							fontSize = Number(fontSplit[i2].substr(0, fontSplit[i2].length - 2));
							break;
						}
					}
						
				}
				
				bitmapAndContext.fontSize = fontSize;
				
				bitmapAndContext.canvas.height = fontSize + 4;
				bitmapAndContext.canvas.width = CanvasElement._measureText(text[i], fontString);
				
				bitmapAndContext.context = bitmapAndContext.canvas.getContext("2d");
				bitmapAndContext.context.font = fontString;
				bitmapAndContext.context.textBaseline = "middle";
				bitmapAndContext.context.textAlign = "left";
				bitmapAndContext.context.strokeStyle = "#000000";
				bitmapAndContext.context.fillStyle = "#000000";
				bitmapAndContext.context.strokeText(text[i], 0, bitmapAndContext.canvas.height / 2);
				
				bitmapAndContext.context.globalCompositeOperation = "source-atop";
			}
			
			if (bitmapAndContext.context.fillStyle != color) 
			{
				bitmapAndContext.context.fillStyle = color;
				
				bitmapAndContext.context.beginPath();
				bitmapAndContext.context.moveTo(0, 0);
				bitmapAndContext.context.lineTo(bitmapAndContext.canvas.width, 0);
				bitmapAndContext.context.lineTo(bitmapAndContext.canvas.width, bitmapAndContext.canvas.height);
				bitmapAndContext.context.lineTo(0, bitmapAndContext.canvas.height);
				bitmapAndContext.context.closePath();
				
				bitmapAndContext.context.fill();
			}
			
			if (baseline == "top")
				ctx.drawImage(bitmapAndContext.canvas, x, Math.round(y - ((bitmapAndContext.canvas.height - bitmapAndContext.fontSize) / 2)));
			else if (baseline == "bottom")
				ctx.drawImage(bitmapAndContext.canvas, x, Math.round(y - (((bitmapAndContext.canvas.height - bitmapAndContext.fontSize) / 2) + bitmapAndContext.fontSize)));
			else //	"middle"
				ctx.drawImage(bitmapAndContext.canvas, x, Math.round(y - (bitmapAndContext.canvas.height / 2)));
			
			if (text.length == 1)
				return;
			
			x += CanvasElement._measureText(text[i], fontString);
		}
	};		
	
/**
 * @function _calculateMinMaxPercentSizes
 * @static
 * Used to calculate size in pixels that percent sized elements should consume given
 * a supplied size in pixels. Populates .actualSize field on objects in supplied 
 * percentSizedObjects array. This function automatically rounds all sizes to the
 * nearest pixel to prevent anti-aliasing and fuzzy lines.
 * 
 * @param percentSizedObjects Array
 * Array of objects containing size data: {minSize:Number, maxSize:Number, percentSize:Number}
 * 
 * @param size Number
 * Available size in pixels.
 */
CanvasElement._calculateMinMaxPercentSizes = 
	function (percentSizedObjects, size)
	{
		if (percentSizedObjects.length == 0)
			return;
	
		var percentObjects = percentSizedObjects.slice();
		var availableSize = size;
		var totalPercentUsed = 0;
		var i;
		
		//Fix values, record total percent used.
		for (i = 0; i < percentObjects.length; i++)
		{
			if (percentObjects[i].minSize == null)
				percentObjects[i].minSize = 0;
			if (percentObjects[i].maxSize == null)
				percentObjects[i].maxSize = Number.MAX_VALUE;
			if (percentObjects[i].percentSize == null)
				percentObjects[i].percentSize = 100;
			
			totalPercentUsed += percentObjects[i].percentSize;
		}
		
		//Size all percent sized elements.
		var done = false;
		while (done == false)
		{
			var size = 0;
			done = true;
			
			for (i = 0; i < percentObjects.length; i++)
			{
				size = availableSize * (percentObjects[i].percentSize / totalPercentUsed);
				if (size > percentObjects[i].maxSize)
				{
					percentObjects[i].actualSize = percentObjects[i].maxSize;
					totalPercentUsed -= percentObjects[i].percentSize;
					availableSize -= percentObjects[i].maxSize;
					
					percentObjects.splice(i, 1);
					done = false;
					break;
				}
				else if (size < percentObjects[i].minSize)
				{
					percentObjects[i].actualSize = percentObjects[i].minSize;
					totalPercentUsed -= percentObjects[i].percentSize;
					availableSize -= percentObjects[i].minSize;
					
					percentObjects.splice(i, 1);
					done = false;
					break;
				}
				else
					percentObjects[i].actualSize = Math.floor(size);
			}
		}
		
		for (i = 0; i < percentObjects.length; i++)
			availableSize -= percentObjects[i].actualSize;
		
		//Distribute excess pixels (rounding error)
		while (availableSize >= 1 && percentObjects.length > 0)
		{
			for (i = 0; i < percentObjects.length; i++)
			{
				while (percentObjects[i].actualSize + 1 > percentObjects[i].maxSize)
				{
					percentObjects.splice(i, 1);
					if (i == percentObjects.length)
						break;
				}
				
				if (i == percentObjects.length)
					break;
				
				percentObjects[i].actualSize++;
				availableSize--;
				
				if (availableSize <= 0)
					break;
			}
		}
	};
	
///////////////CanvasElement Internal Functions////////////////////////////////////

//@private	
CanvasElement.prototype._onBackgroundShapeStyleChanged = 
	function (styleChangedEvent)
	{
		this._invalidateRender();
	};
	
/**
 * @function _addStyleDefinitionAt
 * Inserts a style definition to this elements style definition or default definition lists.
 * Adding style definitions to elements already attached to the display chain is expensive, 
 * for better performance add definitions before attaching the element via addElement().
 * Default definitions are used when styling sub components with sub styles. 
 * 
 * @param styleDefinition StyleDefinition
 * StyleDefinition to be added to this elements definition list.
 * 
 * @param index int
 * The index to insert the style definition within the elements definition list.
 * 
 * @param isDefault bool
 * When true, inserts the definition into the element's default definition list.
 * 
 * @returns StyleDefinition
 * Returns StyleDefinition just added when successfull, null if the StyleDefinition could not
 * be added due to the index being out of range or other error.
 */		
CanvasElement.prototype._addStyleDefinitionAt = 
	function (styleDefinition, index, isDefault)
	{
		if (!(styleDefinition instanceof StyleDefinition))
			return null;
	
		//Get the appropriate style definition storage array.
		var styleDefArray;
		if (isDefault == true)
			styleDefArray = this._styleDefinitionDefaults;
		else
			styleDefArray = this._styleDefinitions;
		
		if (index < 0 || index > styleDefArray)
			return null;
		
		styleDefArray.splice(index, 0, styleDefinition);
		
		if (this._manager != null) //Attached to display chain
		{
			styleDefinition.addEventListener("stylechanged", this._onExternalStyleChangedInstance);
			
			//_onExternalStyleChanged() is expensive! We use the map to make sure we only do each style once.
			var styleNamesMap = Object.create(null);
			var styleName = null;
			
			//We're shifting the priority of all existing style definitions with a lower index (previously added) 
			//when we add a new one, so we need to invoke a style change on all associated styles.
			
			//Record relevant style names
			for (var i = index; i >= 0; i--)
			{
				for (styleName in styleDefArray[i]._styleMap)
					styleNamesMap[styleName] = true;
			}
			
			//Spoof style changed events for normal handling.
			for (styleName in styleNamesMap)
				this._onExternalStyleChanged(new StyleChangedEvent(styleName));
		}
		
		return styleDefinition;
	};	

/**
 * @function _removeStyleDefinitionAt
 * Removes a style definition from this elements style definition or default definitions at the supplied index.
 * Default definitions are used when styling sub components with sub styles. 
 * 
 * @param index int
 * Index to be removed.
 * 
 * @param isDefault bool
 * When true, removes the definition from the element's default definition list.
 * 
 * @returns StyleDefinition
 * Returns the StyleDefinition just removed if successfull, null if the definition could
 * not be removed due it it not being in this elements definition list, or index out of range.
 */			
CanvasElement.prototype._removeStyleDefinitionAt = 
	function (index, isDefault)
	{
		//Get the appropriate style definition storage array.
		var styleDefArray;
		if (isDefault == true)
			styleDefArray = this._styleDefinitionDefaults;
		else
			styleDefArray = this._styleDefinitions;
	
		if (index < 0 || index > styleDefArray - 1)
			return null;
		
		var styleDefinition = null;
		
		if (this._manager != null) //Attached to display chain
		{
			//_onExternalStyleChanged() is expensive! We use the map to make sure we only do each style once.
			var styleNamesMap = Object.create(null);
			var styleName = null;
			
			//We're shifting the priority of all existing style definitions with a lower index (previously added) 
			//when we add a new one, so we need to invoke a style change on all associated styles.
			
			//Record relevant styles
			for (var i = index; i >= 0; i--)
			{
				for (styleName in styleDefArray._styleMap)
					styleNamesMap[styleName] = true;
			}
			
			//Remove definition
			styleDefinition = styleDefArray.splice(index, 1)[0]; //Returns array of removed items.
			styleDefinition.removeEventListener("stylechanged", this._onExternalStyleChangedInstance);
			
			//Spoof style changed event for relevant styles.
			for (styleName in styleNamesMap)
				this._onExternalStyleChanged(new StyleChangedEvent(styleName));
		}
		else //Not attached, just remove the definition
			styleDefinition = styleDefArray.splice(index, 1)[0]; //Returns array of removed items.
		
		return styleDefinition;
	};	

/**
 * @function _setStyleDefinitions
 * Replaces the elements current style definition or default definition lists. 
 * This is more effecient than removing or adding style definitions one at a time.
 * Default definitions are used when styling sub components with sub styles. 
 * 
 * @param styleDefinitions StyleDefinition
 * May be a StyleDefinition, or an Array of StyleDefinition
 * 
 * @param isDefault bool
 * When true, replaces the default definition list.
 * 
 * @param styleNamesChangedMap Object
 * Optional - A empty map object - Object.create(null) to populate style changes
 * due to swapping definitions while this element is attached to the display chain. 
 * When specified (not null), does not automatically invoke style changed events.
 */	
CanvasElement.prototype._setStyleDefinitions = 
	function (styleDefinitions, isDefault, styleNamesChangedMap)
	{
		if (styleDefinitions == null)
			styleDefinitions = [];
		
		if (Array.isArray(styleDefinitions) == false)
			styleDefinitions = [styleDefinitions];
		
		var i;
		
		//Remove any null definitions
		for (i = styleDefinitions.length - 1; i >= 0; i--)
		{
			if (styleDefinitions[i] == null)
				styleDefinitions.splice(i, 1);
		}
		
		//Get the appropriate style definition storage array.
		var styleDefArray;
		if (isDefault == true)
			styleDefArray = this._styleDefinitionDefaults;
		else
			styleDefArray = this._styleDefinitions;
		
		if (this._manager != null) //Attached to display chain
		{
			var oldIndex = styleDefArray.length - 1;
			var newIndex = styleDefinitions.length - 1;
			
			var styleName = null;
			var changed = false;
			
			var styleNamesMap = styleNamesChangedMap;
			if (styleNamesMap == null)
				styleNamesMap = Object.create(null);
			
			//Compare styles from the ends of the arrays
			while (oldIndex >= 0 || newIndex >= 0)
			{
				//Detect change
				if (changed == false && (oldIndex < 0 || newIndex < 0 || styleDefinitions[newIndex] != styleDefArray[oldIndex]))
					changed = true;
				
				//Change detected
				if (changed == true)
				{
					if (oldIndex >= 0)
					{
						//Record removed style names
						for (styleName in styleDefArray[oldIndex]._styleMap)
							styleNamesMap[styleName] = true;
					}
					if (newIndex >= 0)
					{
						//Record removed style names
						for (styleName in styleDefinitions[newIndex]._styleMap)
							styleNamesMap[styleName] = true;
					}
				}
				
				oldIndex--;
				newIndex--;
			}
			
			//Bail no changes
			if (changed == false)
				return;
			
			//Clear the definition list
			while (styleDefArray.length > 0)
			{
				styleDefArray[styleDefArray.length - 1].removeEventListener("stylechanged", this._onExternalStyleChangedInstance);
				styleDefArray.splice(styleDefArray.length - 1, 1);
			}
			
			//Add the new definitions.
			for (i = 0; i < styleDefinitions.length; i++)
			{
				styleDefinitions[i].addEventListener("stylechanged", this._onExternalStyleChangedInstance);
				styleDefArray.push(styleDefinitions[i]);
			}
			
			//Spoof style changed events for normal style changed handling.
			if (styleNamesChangedMap == null)
			{
				for (styleName in styleNamesMap)
					this._onExternalStyleChanged(new StyleChangedEvent(styleName));
			}
		}
		else //Not attached to display chain, just swap the definitions
		{
			//Clear the definition list
			styleDefArray.splice(0, styleDefArray.length);
			
			//Add the new definitions.
			for (i = 0; i < styleDefinitions.length; i++)
				styleDefArray.push(styleDefinitions[i]);
		}
	};	

/**
 * @function _getStyleDefinitionAt
 * Gets the style definition or default definition at the supplied zero base index.
 * 
 * @param index int
 * Index of the style definition to return;
 * 
 * @param isDefault bool
 * When true, returns the default definition at the supplied index.
 * 
 * @returns StyleDefinition
 * The style defenition at the supplied index, or null if index is out of range. 
 */		
CanvasElement.prototype._getStyleDefinitionAt = 
	function (index, isDefault)
	{
		//Get the appropriate style definition storage array.
		var styleDefArray;
		if (isDefault == true)
			styleDefArray = this._styleDefinitionDefaults;
		else
			styleDefArray = this._styleDefinitions;
	
		if (index < 0 || index >= styleDefArray.length)
			return null;
		
		return styleDefArray[index];
	};		
	
//@private	
CanvasElement.prototype._onExternalStyleChanged = 
	function (styleChangedEvent)
	{
		//Not attached to display chain, bail.
		if (this._manager == null)
			return;
		
		var isProxy = false;
		var isParent = false;
		var validStyle = false;
		var styleName = styleChangedEvent.getStyleName();	
		var styleType = this._getStyleType(styleName);
		
		if (this._styleProxy != null && styleChangedEvent.getTarget() == this._styleProxy._proxyElement)
			isProxy = true;
		if (this._parent != null && styleChangedEvent.getTarget() == this._parent)
			isParent = true;
		
		if (isProxy == true || isParent == true)
		{
			//If coming from proxy, we cannot be a substyle, and style name must be in proxy map, or _Arbitrary specified and not in proxy map.
			//If coming from parent, style must be inheritable.
			if ((isProxy == true && styleType != StyleableBase.EStyleType.SUBSTYLE && 
				(styleName in this._styleProxy._proxyMap == true || ("_Arbitrary" in this._styleProxy._proxyMap == true && this._styleProxy._proxyElement._getStyleType(styleName) == null))) ||
				(isParent == true && styleType == StyleableBase.EStyleType.INHERITABLE))
			{
				validStyle = true;
			}
			else
				validStyle = false;
		}
		else
			validStyle = true;
		
		//Style we dont care about, bail.
		if (validStyle == false)
			return;
		
		//Get the cache for this style.
		var styleCache = this._stylesCache[styleName];
		
		//Create cache if doesnt exist.
		if (styleCache == null)
		{
			styleCache = {styleData:new StyleData(styleName), cacheInvalid:true};
			this._stylesCache[styleName] = styleCache;
		}
		
		//Check if the StyleData changed (if we're not a sub style)
		if (styleType != StyleableBase.EStyleType.SUBSTYLE)
		{
			var oldStyleData = null;
			var newStyleData = null;
			
			//Cache valid, copy it for later compare.
			if (styleCache.cacheInvalid == false)
				oldStyleData = styleCache.styleData.clone();
			
			//Invalidate the cache
			styleCache.cacheInvalid = true;
			
			//Get updated data.
			newStyleData = this.getStyleData(styleName);
			
			//No change, bail.
			if (oldStyleData != null && oldStyleData.equals(newStyleData) == true)
				return;
		}
		else //Sub styles always invalidate (the entire chain is used)
		{
			//Invalidate the cache
			styleCache.cacheInvalid = true;
			
			//Update data
			this.getStyleData(styleName);
		}
		
		if (styleType != null)
			this._invalidateStyle(styleName);
		
		//Re-dispatch from ourself.
		this._dispatchEvent(styleChangedEvent); 
	};

/**
 * @function _getStyleList
 * 
 * Gets the style values for the supplied style name in this elements
 * style definition list and instance styles for the supplied style name. 
 * This is used for sub styles as all stub styles in the list are applied to sub components.
 * This list should be supplied to the sub components style definition list.
 *  
 * @param styleName String
 * String representing the style list to return.
 * 
 * @returns Array
 * Returns an array of all styles in this elements definition list and instance styles
 * for the associated style name. 
 */	
CanvasElement.prototype._getStyleList = 
	function (styleName)
	{
		var styleList = [];
		
		//Add definitions
		for (var i = 0; i < this._styleDefinitions.length; i++)
		{
			styleValue = this._styleDefinitions[i].getStyle(styleName);
			
			if (styleValue !== undefined)
				styleList.push(styleValue);
		}
		
		//Add instance
		if (styleName in this._styleMap && this._styleMap[styleName] != null)
			styleList.push(this._styleMap[styleName]);
		
		return styleList;
	};
	
/**
 * @function _getDefaultStyleList
 * 
 * Gets the style values for the supplied style name in this elements
 * default style definition list and class list styles for the supplied style name. 
 * This is used for sub styles as all stub styles in the list are applied to sub components.
 * This list should be supplied to the sub components default style definition list.
 *  
 * @param styleName String
 * String representing the default style list to return.
 * 
 * @returns Array
 * Returns an array of all styles in this elements default definition and class list styles 
 * for the associated style name. 
 */	
CanvasElement.prototype._getDefaultStyleList = 
	function (styleName)
	{
		var styleValue = null;
		
		//Get class list
		var styleList = this._getClassStyleList(styleName);
		
		//Check default definitions
		for (var i = 0; i < this._styleDefinitionDefaults.length; i++)
		{
			styleValue = this._styleDefinitionDefaults[i].getStyle(styleName);
			
			if (styleValue !== undefined)
				styleList.push(styleValue);
		}
		
		return styleList;
	};
	
/**
 * @function _applySubStylesToElement
 * @override
 * 
 * Convienence function for setting sub styles of sub components.
 * Applies appropriate sub styling from this element to the 
 * supplied elements definition and default definition style lists.
 * You should call this on sub components from within the _doStylesUpdated()
 * function when the associated sub style changes.
 *  
 * @param styleName String
 * String representing the sub style to apply.
 * 
 * @param elementToApply CanvasElement
 * The sub component element to apply sub styles.
 */		
CanvasElement.prototype._applySubStylesToElement = 
	function (styleName, elementToApply)
	{
		var changedStyleName = null;
		var styleNamesChangedMap = Object.create(null);
	
		elementToApply._setStyleDefinitions(this._getStyleList(styleName), false, styleNamesChangedMap);
		elementToApply._setStyleDefinitions(this._getDefaultStyleList(styleName), true, styleNamesChangedMap);
		
		//Spoof style changed events for normal style changed handling.
		for (changedStyleName in styleNamesChangedMap)
			elementToApply._onExternalStyleChanged(new StyleChangedEvent(changedStyleName));
	};
	
/**
 * @function _setStyleProxy
 * 
 * Sets the element which is to proxy styles to this element. See getStyle() and StyleProxy.
 * This should be set prior to added this element to the display hierarchy via addElement() or _addChild().
 * 
 * @param styleProxy StyleProxy
 * The StyleProxy element wrapper to use to proxy styles from the proxy element to this element.
 * 
 * @seealso StyleProxy
 */	
CanvasElement.prototype._setStyleProxy = 
	function (styleProxy)
	{
		this._styleProxy = styleProxy;
	};
	
/**
 * @function _onCanvasElementAdded
 * Invoked when the element is added to the canvas. Every CanvasElement already adds its own
 * "added" event listener so overriding this is identical but more efficient than adding your own "added" event listener.
 * You should *always* call the base class function.
 * 
 * @param addedRemovedEvent AddedRemovedEvent
 * The AddedRemovedEvent to process.
 */	
CanvasElement.prototype._onCanvasElementAdded = 
	function (addedRemovedEvent)
	{
		/////////Added to the Display Chain/////////////
	
		var i;
	
		for (i = 0; i < this._styleDefinitions.length; i++)
		{
			if (this._styleDefinitions[i].hasEventListener("stylechanged", this._onExternalStyleChangedInstance) == false)
				this._styleDefinitions[i].addEventListener("stylechanged", this._onExternalStyleChangedInstance);
		}

		//If proxy is our parent, we dont want duplicate listeners.
		if (this._styleProxy != null && this._styleProxy._proxyElement.hasEventListener("stylechanged", this._onExternalStyleChangedInstance) == false)
			this._styleProxy._proxyElement.addEventListener("stylechanged", this._onExternalStyleChangedInstance);
		
		if (this._backgroundShape != null && this._backgroundShape.hasEventListener("stylechanged", this._onBackgroundShapeStyleChangedInstance) == false)
			this._backgroundShape.addEventListener("stylechanged", this._onBackgroundShapeStyleChangedInstance);
		
		for (i = 0; i < this._styleDefinitionDefaults.length; i++)
		{
			if (this._styleDefinitionDefaults[i].hasEventListener("stylechanged", this._onExternalStyleChangedInstance) == false)
				this._styleDefinitionDefaults[i].addEventListener("stylechanged", this._onExternalStyleChangedInstance);
		}
		
		//Add broadcast events to manager//
		if ("enterframe" in this._eventListeners && this._eventListeners["enterframe"].length > 0)
		{
			for (i = 0; i < this._eventListeners["enterframe"].length; i++)
				addedRemovedEvent.getManager()._broadcastDispatcher.addEventListener("enterframe", this._eventListeners["enterframe"][i]);
		}
		if ("localechanged" in this._eventListeners && this._eventListeners["localechanged"].length > 0)
		{
			for (i = 0; i < this._eventListeners["localechanged"].length; i++)
				addedRemovedEvent.getManager()._broadcastDispatcher.addEventListener("localechanged", this._eventListeners["localechanged"][i]);
		}
		if ("mousemoveex" in this._eventListeners && this._eventListeners["mousemoveex"].length > 0)
		{
			for (i = 0; i < this._eventListeners["mousemoveex"].length; i++)
				addedRemovedEvent.getManager()._broadcastDispatcher.addEventListener("mousemoveex", this._eventListeners["mousemoveex"][i]);
		}
		
		//Invalidate redraw and composite render
		this._invalidateRedrawRegion();
		this._invalidateCompositeRender();
		
		///////////Invalidate All Styles////////////////
		
		//Invalidate all cache
		for (var prop in this._stylesCache)
			this._stylesCache[prop].cacheInvalid = true;
		
		//Invalidate *all* styles, don't need to propagate, display propagates when attaching.
		this._flattenStyleTypes();
		for (i = 0; i < this.constructor.__StyleTypesFlatArray.length; i++)
			this._invalidateStyle(this.constructor.__StyleTypesFlatArray[i].styleName);
		
		//Always dispatch when added.
		if (this.hasEventListener("localechanged", null) == true)
			this._dispatchEvent(new DispatcherEvent("localechanged"));
	};

/**
 * @function _onCanvasElementRemoved
 * Invoked when the element is removed to the canvas. Every CanvasElement already adds its own
 * "removed" event listener so overriding this is identical but more efficient than adding your own "removed" event listener.
 * You should *always* call the base class function.
 * 
 * @param addedRemovedEvent AddedRemovedEvent
 * The AddedRemovedEvent to process.
 */		
CanvasElement.prototype._onCanvasElementRemoved = 
	function (addedRemovedEvent)
	{
		///////Removed from display chain///////////////////
	
		var i = 0;
	
		for (i = 0; i < this._styleDefinitions.length; i++)
		{
			if (this._styleDefinitions[i].hasEventListener("stylechanged", this._onExternalStyleChangedInstance) == true)
				this._styleDefinitions[i].removeEventListener("stylechanged", this._onExternalStyleChangedInstance);
		}
		
		if (this._styleProxy != null && this._styleProxy._proxyElement.hasEventListener("stylechanged", this._onExternalStyleChangedInstance) == true)
			this._styleProxy._proxyElement.removeEventListener("stylechanged", this._onExternalStyleChangedInstance);
		
		if (this._backgroundShape != null && this._backgroundShape.hasEventListener("stylechanged", this._onBackgroundShapeStyleChangedInstance) == true)
			this._backgroundShape.removeEventListener("stylechanged", this._onBackgroundShapeStyleChangedInstance);
		
		for (i = 0; i < this._styleDefinitionDefaults.length; i++)
		{
			if (this._styleDefinitionDefaults[i].hasEventListener("stylechanged", this._onExternalStyleChangedInstance) == true)
				this._styleDefinitionDefaults[i].removeEventListener("stylechanged", this._onExternalStyleChangedInstance);
		}
		
		if (this._rollOverCursorInstance != null)
		{
			addedRemovedEvent.getManager().removeCursor(this._rollOverCursorInstance);
			this._rollOverCursorInstance = null;
		}
		
		//Update the redraw region of any composite parents still attached to the display chain.
		for (i = 0; i < this._compositeMetrics.length; i++)
		{
			if (this._compositeMetrics[i].element._manager != null)
				this._compositeMetrics[i].element._updateRedrawRegion(this._compositeMetrics[i].drawableMetrics);
		}
		
		//Reset cycle flags
		this._stylesInvalid = true;
		this._measureInvalid = true;
		this._layoutInvalid = true;
		this._renderInvalid = true;
		
		//Nuke graphics canvas
		this._graphicsCanvas = null;
		this._graphicsCtx = null;
		this._graphicsClear = true;					
		
		//Nuke composite canvas
		this._compositeCtx = null;																														
		this._compositeCanvas = null;																
		this._compositeCanvasMetrics = null;			 
		
		//Reset redraw flags
		this._renderChanged = true;					
		this._renderVisible = false; 					
		this._compositeEffectChanged = true;
		
		//Nuke composite data
		this._compositeMetrics = [];
		this._compositeVisibleMetrics = null;																						
		this._redrawRegionMetrics = null;																												
		this._transformVisibleMetrics = null;			
		this._transformDrawableMetrics = null;				
		
		//Remove broadcast events from manager//
		if ("enterframe" in this._eventListeners && this._eventListeners["enterframe"].length > 0)
		{
			for (i = 0; i < this._eventListeners["enterframe"].length; i++)
				addedRemovedEvent.getManager()._broadcastDispatcher.removeEventListener("enterframe", this._eventListeners["enterframe"][i]);
		}
		if ("localechanged" in this._eventListeners && this._eventListeners["localechanged"].length > 0)
		{
			for (i = 0; i < this._eventListeners["localechanged"].length; i++)
				addedRemovedEvent.getManager()._broadcastDispatcher.removeEventListener("localechanged", this._eventListeners["localechanged"][i]);
		}
		if ("mousemoveex" in this._eventListeners && this._eventListeners["mousemoveex"].length > 0)
		{
			for (i = 0; i < this._eventListeners["mousemoveex"].length; i++)
				addedRemovedEvent.getManager()._broadcastDispatcher.removeEventListener("mousemoveex", this._eventListeners["mousemoveex"][i]);
		}
	};	
	
/**
 * @function _getFontString
 * Gets a font string that can be applied to the canvas's Context2D via the element's text styles.
 * This is just a helper to gather and format the styles for the canvas context.
 * 
 * @returns String
 * String to be applied to the canvas contex's font. "bold 14px Arial".
 */	
CanvasElement.prototype._getFontString = 
	function ()
	{
		return this.getStyle("TextStyle") + " " + this.getStyle("TextSize") + "px " + this.getStyle("TextFont");
	};		
	
//@Override
CanvasElement.prototype._dispatchEvent = 
	function (dispatchEvent)
	{
		if (!(dispatchEvent instanceof ElementEvent))
		{
			CanvasElement.base.prototype._dispatchEvent.call(this, dispatchEvent);
			return;
		}
	
		dispatchEvent._canceled = false;
		dispatchEvent._defaultPrevented = false;
		
		//We're transforming the event as we bubble. We shouldn't change the instance given to the dispatcher. 
		var event = dispatchEvent.clone();
	
		event._target = this;
		
		//Clone the event when calling the handlers so they cannot fudge the event data.
		var handlerEvent = null;
		
		if (event._bubbles == true)
		{
			var currentElement = this;
			var currentMousePoint = {x:0, y:0};
			if (event instanceof ElementMouseEvent)
			{
				currentMousePoint.x = event._x;
				currentMousePoint.y = event._y;
			}
			
			//Get parent chain.
			var parentChain = [];
			while (currentElement != null)
			{
				parentChain.push({element:currentElement, 
								x:currentMousePoint.x, 
								y:currentMousePoint.y});
				
				//Adjust mouse point for parent.
				if (event instanceof ElementMouseEvent)
				{
					currentMousePoint.x += currentElement._x;
					currentMousePoint.y += currentElement._y;
					
					currentElement.rotatePoint(currentMousePoint, false);
				}
				
				currentElement = currentElement._parent;
			}
			
			//Dispatch Capture Events.
			event._phase = "capture";
			for (var i = parentChain.length -1; i >= 0; i--)
			{
				currentElement = parentChain[i].element;
				
				if (event._type in currentElement._captureListeners && currentElement._captureListeners[event._type].length > 0)
				{
					event._currentTarget = currentElement;
					if (event instanceof ElementMouseEvent)
					{
						event._x = parentChain[i].x;
						event._y = parentChain[i].y;
					}
					
					//Copy the list of event handlers, if event handlers add/remove other handlers or themselves, 
					//we dont want to miss an event, or inconsistently dispatch newly added events.
					var listeners = currentElement._captureListeners[event._type].slice();
					
					//TODO: Sort by priority (no priority available yet).
					
					for (var i2 = 0; i2 < listeners.length; i2++)
					{
						handlerEvent = event.clone(); //Clone the event so the handler can't fudge our event data.
						listeners[i2](handlerEvent);
						
						if (handlerEvent._defaultPrevented == true)
						{
							dispatchEvent._defaultPrevented = true;
							event._defaultPrevented = true;
						}
						
						if (handlerEvent._canceled == true)
						{
							dispatchEvent._canceled = true;
							return;
						}
					}
				}
			}
			
			//Dispatch Bubble Events.
			event._phase = "bubble";
			for (var i = 0; i < parentChain.length; i++)
			{
				currentElement = parentChain[i].element;
				
				if (event._type in currentElement._eventListeners && currentElement._eventListeners[event._type].length > 0)
				{
					event._currentTarget = currentElement;
					if (event instanceof ElementMouseEvent)
					{
						event._x = parentChain[i].x;
						event._y = parentChain[i].y;
					}
					
					//Copy the list of event handlers, if event handlers add/remove other handlers or themselves, 
					//we dont want to miss an event, or inconsistently dispatch newly added events.
					var listeners = currentElement._eventListeners[event._type].slice();
					
					//TODO: Sort by priority (no priority available yet).
					
					for (var i2 = 0; i2 < listeners.length; i2++)
					{
						handlerEvent = event.clone(); //Clone the event so the handler can't fudge our event data.
						listeners[i2](handlerEvent);
						
						if (handlerEvent._defaultPrevented == true)
						{
							dispatchEvent._defaultPrevented = true;
							event._defaultPrevented = true;
						}
						
						if (handlerEvent._canceled == true)
						{
							dispatchEvent._canceled = true;
							return;
						}
					}
				}
			}
			
		}
		else //Dispatch only target events.
		{ 
			event._currentTarget = this;

			event._phase = "capture";
			if (event._type in this._captureListeners && this._captureListeners[event._type].length > 0)
			{
				//Copy the list of event handlers, if event handlers add/remove other handlers or themselves, 
				//we dont want to miss an event, or inconsistently dispatch newly added events.
				var listeners = this._captureListeners[event._type].slice();
				
				//TODO: Sort by priority (no priority available yet).
				
				for (var i2 = 0; i2 < listeners.length; i2++)
				{
					handlerEvent = event.clone(); //Clone the event so the handler can't fudge our event data.
					listeners[i2](handlerEvent);
					
					if (handlerEvent._defaultPrevented == true)
					{
						dispatchEvent._defaultPrevented = true;
						event._defaultPrevented = true;
					}
					
					if (handlerEvent._canceled == true)
					{
						dispatchEvent._canceled = true;
						return;
					}
				}
			}
			
			event._phase = "bubble";
			if (event._type in this._eventListeners && this._eventListeners[event._type].length > 0)
			{
				//Copy the list of event handlers, if event handlers add/remove other handlers or themselves, 
				//we dont want to miss an event, or inconsistently dispatch newly added events.
				var listeners = this._eventListeners[event._type].slice();
				
				//TODO: Sort by priority (no priority available yet).
				
				for (var i2 = 0; i2 < listeners.length; i2++)
				{
					handlerEvent = event.clone(); //Clone the event so the handler can't fudge our event data.
					listeners[i2](handlerEvent);
					
					if (handlerEvent._defaultPrevented == true)
					{
						dispatchEvent._defaultPrevented = true;
						event._defaultPrevented = true;
					}
					
					if (handlerEvent._canceled == true)
					{
						dispatchEvent._canceled = true;
						return;
					}
				}
			}
		}
	};

/**
 * @function _addChild
 * Adds a child element to the end of this element's child list.
 * 
 * @param element CanvasElement
 * CanvasElement to be added as a child of this element.
 * 
 * @returns CanvasElement
 * Returns the element just added.
 */	
CanvasElement.prototype._addChild = 
	function (element)
	{
		return this._addChildAt(element, this._children.length);
	};

/**
 * @function _addChildAt
 * Inserts a child element to this elements child list at the specified index.
 * 
 * @param element CanvasElement
 * CanvasElement to be added as a child of this element.
 * 
 * @param index int
 * The index position to insert the child in the elements child list.
 * 
 * @returns CanvasElement
 * Returns the element just added when successfull, null if the element could not
 * be added due to the index being out of range.
 */		
CanvasElement.prototype._addChildAt = 
	function (element, index)
	{
		if (!(element instanceof CanvasElement))
			return null;
		
		if (index < 0 || index > this._children.length)
			return null;
		
		//Elements may only have 1 parent.
		if (element._parent != null)
			element._parent._removeChild(element);
		
		element._parent = this;
		this._children.splice(index, 0, element);
		this.addEventListener("stylechanged", element._onExternalStyleChangedInstance);
		
		element._propagateChildData();
		
		this._invalidateMeasure();
		this._invalidateLayout();
		
		if (this._manager != null)
		{
			this._manager._rollOverInvalid = true;
			this._manager._processAddRemoveDisplayChainQueue();
		}
		
		return element;
	};
	
/**
 * @function _removeChild
 * Removes a child element from this elements child list.
 * 
 * @param element CanvasElement
 * Child to be removed.
 * 
 * @returns CanvasElement
 * Returns the element just removed if successfull, null if the
 * element could not be removed due to it not being a child of this element.
 */	
CanvasElement.prototype._removeChild = 
	function (element)
	{
		var childIndex = this._children.indexOf(element);
		if (childIndex == -1)
			return null;
	
		return this._removeChildAt(childIndex);
	};

/**
 * @function _removeChildAt
 * Removes a child element at specified index.
 * 
 * @param index int
 * Index to be removed.
 * 
 * @returns CanvasElement
 * Returns the element just removed if successfull, null if the element could
 * not be removed due it it not being a child of this element, or index out of range.
 */		
CanvasElement.prototype._removeChildAt = 
	function (index)
	{
		if (index < 0 || index > this._children.length - 1)
			return null;
		
		var element = this._children.splice(index, 1)[0]; //Returns array of removed items.
		
		//We removed an element that is in mouse-down state. 
		//Change the mouseup target to the parent of this element.
		if (element._mouseIsDown == true)
			element._manager._mouseDownElement = element._parent;
		
		if (element._mouseIsOver == true)
			element._manager._rollOverElement = element._parent;
		
		element._parent = null;
		this.removeEventListener("stylechanged", element._onExternalStyleChangedInstance);
		
		element._propagateChildData();
		
		this._invalidateMeasure();
		this._invalidateLayout();
		
		if (this._manager != null)
		{
			this._manager._rollOverInvalid = true;
			this._manager._processAddRemoveDisplayChainQueue();
		}
		
		return element;
	};	

/**
 * @function _getChildAt
 * Gets the child element at the supplied index.
 * 
 * @param index int
 * Index of child element to return;
 * 
 * @returns CanvasElement
 * The element at the supplied index, or null if index is out of range. 
 */	
CanvasElement.prototype._getChildAt = 
	function (index)
	{
		if (index < 0 || index > this._children.length - 1)
			return null;
		
		return this._children[index];
	};
	
/**
 * @function _getChildIndex
 * Returns the index of the supplied child element.
 * 
 * @param element CanvasElement
 * Child element to return the index.
 * 
 * @returns int
 * Returns the child index or -1 if the element is not
 * a child of this element.
 */	
CanvasElement.prototype._getChildIndex = 
	function (element)
	{
		return this._children.indexOf(element);
	};
	
/**
 * @function _setChildIndex
 * Changes a child element's index. 
 * 
 * @param element CanvasElement
 * Child element to change index.
 * 
 * @param index int
 * New index of the child element.
 * 
 * @returns boolean
 * Returns true if the child's index is successfully changed, false if the element
 * is not a child of this element or the index is out of range.
 */	
CanvasElement.prototype._setChildIndex = 
	function (element, index)
	{
		if (index < 0 || index > this._children.length - 1)
			return false;
		
		var currentIndex = this._getChildIndex(element);
		if (currentIndex == -1 || currentIndex == index)
			return false;
		
		this._children.splice(index, 0, this._children.splice(currentIndex, 1)[0]);
		
		this._invalidateMeasure();
		this._invalidateLayout();
		
		return true;
	};
	
/**
 * @function _getNumChildren
 * Gets this elements number of children.
 * 
 * @returns int
 * The number of child elements.
 */	
CanvasElement.prototype._getNumChildren = 
	function ()
	{
		return this._children.length;
	};
	
//@private	
CanvasElement.prototype._propagateChildData = 
	function ()
	{
		var isManager = (this instanceof CanvasManager);
	
		if ((isManager == false && (this._parent == null || this._parent._displayDepth == 0)) || 
			isManager == true && this._manager != null)
		{//Removed from display chain
			
			//Purge manager data.
			if (this._manager != null)
			{
				if (this._stylesInvalid == true)
					this._manager._updateStylesQueue.removeNode(this._stylesValidateNode, this._displayDepth);
				
				if (this._measureInvalid == true)
					this._manager._updateMeasureQueue.removeNode(this._measureValidateNode, this._displayDepth);
				
				if (this._layoutInvalid == true)
					this._manager._updateLayoutQueue.removeNode(this._layoutValidateNode, this._displayDepth);
				
				if (this._renderInvalid == true)
					this._manager._updateRenderQueue.removeNode(this._renderValidateNode, this._displayDepth);
				
				if (this._compositeRenderInvalid == true)
					this._manager._compositeRenderQueue.removeNode(this._compositeRenderValidateNode, this._displayDepth);
				
				if (this == this._manager._draggingElement)
					this._manager._clearDraggingElement();
				
				if (this == this._manager._focusElement)
					this._manager._focusElement = null;
				
				this._manager._pushAddRemoveDisplayChainQueue(this, "removed");
			}
			
			this._renderFocusRing = false;
			this._isFocused = false;
			this._mouseIsOver = false;
			this._mouseIsDown = false;
			this._displayDepth = 0;
			this._manager = null;
		}
		else
		{//Added to display chain
			
			if (isManager == true)
			{
				this._displayDepth = 1;
				this._manager = this;
			}
			else
			{
				this._displayDepth = this._parent._displayDepth + 1;
				this._manager = this._parent._manager;
			}
			
			//Add manager data.
			if (this._manager != null)
			{
				if (this._stylesInvalid == true)
					this._manager._updateStylesQueue.addNode(this._stylesValidateNode, this._displayDepth);
				
				if (this._measureInvalid == true)
					this._manager._updateMeasureQueue.addNode(this._measureValidateNode, this._displayDepth);
				
				if (this._layoutInvalid == true)
					this._manager._updateLayoutQueue.addNode(this._layoutValidateNode, this._displayDepth);
				
				if (this._renderInvalid == true)
					this._manager._updateRenderQueue.addNode(this._renderValidateNode, this._displayDepth);
				
				if (this._compositeRenderInvalid == true)
					this._manager._compositeRenderQueue.addNode(this._compositeRenderValidateNode, this._displayDepth);
				
				this._manager._pushAddRemoveDisplayChainQueue(this, "added");
			}
		}
		
		for (var i = 0; i < this._children.length; i++)
			this._children[i]._propagateChildData();
	};	

/**
 * @function _setRelativePosition
 * Sets the elements position relative to a supplied element regardless of this element's transformation,
 * depth, or position in the display hierarchy or relation to the supplied relativeToElement. This should typically
 * only be called during the parent element's layout phase. Setting relativeToElement to null has an identical
 * effect to calling _setActualPosition(). This is used by some containers to position the element relative
 * to a parent's coordinate plane rather than the child's transformed plane.
 * 
 * @param x Number
 * The relative X position to move this element's position.
 * 
 * @param y Number
 * The relative Y position to move this element's position.
 * 
 * @param relativeToElement CanvasElement
 * The CanvasElement to move this element relative too.
 */	
CanvasElement.prototype._setRelativePosition = 
	function (x, y, relativeToElement)
	{
		if (relativeToElement == null || relativeToElement == this)
		{
			if (this._x == x && this._y == y)
				return;
			
			this._x = x;
			this._y = y;
			
			if (this._manager != null)
				this._manager._rollOverInvalid = true;
			
			this._invalidateRedrawRegion();
		}
		
		if (this._manager == null || this._manager != relativeToElement._manager)
			return;
		
		//Use relative parent metrics. We want to shift this elements entire plane if its
		//transformed (rotated), we dont want to slide the element around on its transformed plane.
		var parentMetrics = this.getMetrics(this._parent);
		
		//Get the move-to position within our parent element.
		var newPosition = {x:x, y:y};
		relativeToElement.translatePointTo(newPosition, this._parent);
		
		//We haven't moved.
		if (newPosition.x == parentMetrics.getX() && newPosition.y == parentMetrics.getY())
			return;
		
		//Get the delta in its position.
		var deltaX = newPosition.x - parentMetrics.getX();
		var deltaY = newPosition.y - parentMetrics.getY();
		
		this._x = this._x + deltaX;
		this._y = this._y + deltaY;
		
		if (this._rotateDegrees != 0)
		{
			this._rotateCenterX += deltaX;
			this._rotateCenterY += deltaY;
		}
		
		if (this._manager != null)
			this._manager._rollOverInvalid = true;
		
		this._invalidateRedrawRegion();
	};	
		
/**
 * @function _setActualPosition
 * Sets the elements position within its parent. Note that if the element is transformed or rotated,
 * this sets the elements position within its transformed plane. If you wish to position a transformed
 * element relative to its parents coordinate plane, use _setRelativePosition(). This should typically
 * only be called from within the parents layout phase.
 * 
 * @param x int
 * The X position to move the element.
 * 
 * @param y int
 * The Y position to move the element.
 */	
CanvasElement.prototype._setActualPosition = 
	function (x, y)
	{
		x = Math.round(x);
		y = Math.round(y);
		
		if (this._x == x && this._y == y)
			return;
		
		this._x = x;
		this._y = y;
		
		if (this._manager != null)
			this._manager._rollOverInvalid = true;
		
		this._invalidateRedrawRegion();
	};	
	
/**
 * @function _setActualSize
 * Sets this element's size in pixels prior to any transformation or rotation. 
 * This should typically only be called from within the parents layout phase.
 * 
 * @param width Number
 * The width in pixels to size this element.
 * 
 * @param height Number
 * The height in pixels to size this element.
 */	
CanvasElement.prototype._setActualSize = 
	function (width, height)
	{
		//if (typeof width !== "number" || typeof height !== "number" || isNaN(width) || isNaN(height))
		//	throw "Invalid Size";
	
		//TODO: This is BAD!!!  This is effectively a fix for components that arent rounding / drawing on
		//		on even pixel lines causing anti-aliasing fuzz. This *needs* to be removed, and offending components fixed.
		width = Math.round(width);
		height = Math.round(height);
		
		if (this._width == width && this._height == height)
			return false;
		
		this._width = width;
		this._height = height;
		
		this._invalidateLayout();
		this._invalidateRender();
		
		if (this.hasEventListener("resize", null) == true)
			this._dispatchEvent(new DispatcherEvent("resize"), false);
		
		if (this._manager != null)
			this._manager._rollOverInvalid = true;
		
		return true;
	};
	
/**
 * @function _setActualRotation
 * Sets this elements rotation degrees and rotation point relative to its parent. This should typically
 * only be called from within the parent's layout phase.
 * 
 * @param degrees Number
 * Degrees to rotate the element (clockwise).
 * 
 * @param centerX Number
 * The X position relative to the elements parent to rotate around.
 * 
 * @param centerY Number
 * The Y position relative to the elements parent to rotate around.
 */	
CanvasElement.prototype._setActualRotation = 
	function (degrees, centerX, centerY)
	{
		if (centerX == null || centerY == null)
		{
			centerX = 0;
			centerY = 0;
		}
	
		if (this._rotateDegrees != degrees || this._rotateCenterX != centerX || this._rotateCenterY != centerY)
		{
			this._invalidateRedrawRegion();
			
			if (this._rotateDegrees != degrees)
			{
				this._compositeEffectChanged = true;
				this._invalidateCompositeRender();
				
				//Check if we need to re-render due to auto gradient
				var autoGradientType = this.getStyle("AutoGradientType");
				var backgroundColor = this.getStyle("BackgroundColor");
				var borderType = this.getStyle("BorderType");
				
				if (autoGradientType != null && autoGradientType != "none" && 
					(backgroundColor != null || (borderType != null && borderType != "none")))
				{
					this._invalidateRender();
				}
			}
		}
		
		this._rotateDegrees = degrees;
		this._rotateCenterX = centerX;
		this._rotateCenterY = centerY;
	};
	
//@private
CanvasElement.prototype._setMeasuredSize = 
	function (width, height)
	{
		if (this._measuredWidth == width && this._measuredHeight == height)
			return;
		
		this._measuredWidth = width;
		this._measuredHeight = height;
		
		if (this._parent != null)
		{
			this._parent._invalidateMeasure();
			this._parent._invalidateLayout();
		}
	};
	
//@private	
CanvasElement.prototype._setRenderFocusRing = 
	function (shouldRender)
	{
		if (this._renderFocusRing == shouldRender)
			return;
		
		this._renderFocusRing = shouldRender;
		this._invalidateRender();
	};

//@private	
CanvasElement.prototype._createMetrics = 
	function ()
	{
		return new DrawMetrics();
	};
	
	
/**
 * @function _getGraphicsCtx
 * Returns the canvas context used when rendering this element. This should typically
 * only be called from within the element's _doRender() phase, and only if you intend
 * to actually draw. Calling this will impact the canvas redraw regions.
 *  
 * @returns Canvas2DContext
 * Canvas context used when rendering this element.
 */	
CanvasElement.prototype._getGraphicsCtx = 
	function ()
	{
		if (this._graphicsCanvas == null)
		{
			this._graphicsCanvas = document.createElement("canvas");
			this._graphicsCtx = this._graphicsCanvas.getContext("2d");
			
			this._graphicsCanvas.width = this._width;
			this._graphicsCanvas.height = this._height;
		}
		
		this._renderChanged = true;
		this._graphicsClear = false;
		
		this._invalidateRedrawRegion();
		
		return this._graphicsCtx;
	};
	
	
/**
 * @function _getPaddingSize
 * Helper function that returns the elements total padding width and height per its applied styles.
 * 
 * @returns Object
 * Returns an object containing 
 * {width:paddingWidth, height:paddingHeight,
 * paddingBottom:paddingBottom, paddingTop:paddingTop,
 * paddingLeft:paddingLeft, paddingRight:paddingRight}.
 */	
CanvasElement.prototype._getPaddingSize = 
	function ()
	{
		var paddingData = this.getStyleData("Padding");
		var paddingTopData = this.getStyleData("PaddingTop");
		var paddingBottomData = this.getStyleData("PaddingBottom");
		var paddingLeftData = this.getStyleData("PaddingLeft");
		var paddingRightData = this.getStyleData("PaddingRight");
		
		var paddingTop = paddingTopData.value;
		if (paddingData.comparePriority(paddingTopData) > 0) //Use Padding if higher priority
			paddingTop = paddingData.value;
		
		var paddingBottom = paddingBottomData.value;
		if (paddingData.comparePriority(paddingBottomData) > 0) //Use Padding if higher priority
			paddingBottom = paddingData.value;
		
		var paddingLeft = paddingLeftData.value;
		if (paddingData.comparePriority(paddingLeftData) > 0) //Use Padding if higher priority
			paddingLeft = paddingData.value;
		
		var paddingRight = paddingRightData.value;
		if (paddingData.comparePriority(paddingRightData) > 0) //Use Padding if higher priority
			paddingRight = paddingData.value;
		
		return { width: paddingLeft + paddingRight, 
				height: paddingTop + paddingBottom, 
				paddingBottom:paddingBottom, 
				paddingTop:paddingTop, 
				paddingLeft:paddingLeft, 
				paddingRight:paddingRight};
	};

/**
 * @function _getBorderThickness
 * Helper function that returns the elements border thickness per its applied styles.
 * 
 * @returns Number
 * The elements border thickness.
 */	
CanvasElement.prototype._getBorderThickness = 
	function ()
	{
		var borderThickness = 0;
		var borderType = this.getStyle("BorderType");
		var borderColor = this.getStyle("BorderColor");
		if ((borderType == "solid" || borderType == "inset" || borderType == "outset") && borderColor != null)
		{
			borderThickness = this.getStyle("BorderThickness");
			if (borderThickness < 0)
				borderThickness = 0;
		}
		
		return borderThickness;
	};

/**
 * @function _getStyledOrMeasuredWidth
 * Helper function that returns this elements styled width, or measured width if no style is set. Typically
 * called from within a parent containers layout phase.
 * 
 * @returns Number
 * The elements width.
 */	
CanvasElement.prototype._getStyledOrMeasuredWidth = 
	function ()
	{
		var width = this.getStyle("Width");
		
		if (width == null)
		{
			var maxWidth = this.getStyle("MaxWidth");
			var minWidth = this.getStyle("MinWidth");
			
			if (minWidth == null)
				minWidth = 0;
			if (maxWidth == null)
				maxWidth = Number.MAX_VALUE;
			
			width = this._measuredWidth;
			width = Math.min(width, maxWidth);
			width = Math.max(width, minWidth);
		}
		
		return width;
	};

/**
 * @function _getStyledOrMeasuredHeight
 * Helper function that returns this elements styled height, or measured height if no style is set. Typically
 * called from within a parent containers layout phase.
 * 
 * @returns Number
 * The elements height.
 */		
CanvasElement.prototype._getStyledOrMeasuredHeight = 
	function ()
	{
		var height = this.getStyle("Height");
		
		if (height == null)
		{
			var maxHeight = this.getStyle("MaxHeight");
			var minHeight = this.getStyle("MinHeight");			
			
			if (minHeight == null)
				minHeight = 0;
			if (maxHeight == null)
				maxHeight = Number.MAX_VALUE;	
			
			height = this._measuredHeight;
			height = Math.min(height, maxHeight);
			height = Math.max(height, minHeight);
		}
		
		return height;
	};
	
/**
 * @function _getBorderMetrics
 * Helper function that returns a DrawMetrics object whose bounding area is inside this elements border.
 * 
 * @returns DrawMetrics
 * Returns DrawMetrics that define a bounding area inside this elements border.
 */	
CanvasElement.prototype._getBorderMetrics = 
	function ()
	{
		var metrics = this._createMetrics();
		
		var borderThickness = this._getBorderThickness();
		
		metrics._x = borderThickness / 2;
		metrics._y = borderThickness / 2;
		
		metrics._width = this._width - borderThickness;
		metrics._height = this._height - borderThickness;
		
		return metrics;
	};
	
/**
 * @function _getPaddingMetrics
 * Helper function that returns a DrawMetrics object whose bounding area is inside this elements padding area.
 * 
 * @returns DrawMetrics
 * Returns DrawMetrics that define a bounding area inside this elements padding area.
 */		
CanvasElement.prototype._getPaddingMetrics = 
	function()
	{
		var metrics = this._createMetrics();
		var paddingSize = this._getPaddingSize();
		
		metrics._x = paddingSize.paddingLeft;
		metrics._y = paddingSize.paddingTop;
		metrics._width = this._width -  paddingSize.paddingLeft - paddingSize.paddingRight;
		metrics._height = this._height - paddingSize.paddingTop - paddingSize.paddingBottom;
		
		return metrics;
	};

/**
 * @function _getAutoGradientFill
 * Helper function that returns a Context2D linear or radial CanvasGradient depending on this elements
 * auto gradient styles. This gradient uses 1 color and lightens and darkens the supplied color. 
 * The gradient is always oriented in the same direction regardless of the elements rotation or transformation. 
 * This is used for a consistent light source. 
 * 
 * @param color String
 * Hex color to lighten and darken for gradient. Format "#FF0000" (red).
 * 
 * @param context Canvas2DContext
 * Canvas2DContext to use to generate the gradient.
 * 
 * @returns CanvasGradient
 * Returns CanvasGradient to be applied to canvas Context2D.
 */		
CanvasElement.prototype._getAutoGradientFill = 
	function (color, context)
	{
		var gradientType = this.getStyle("AutoGradientType");
		
		if (gradientType == "radial")
			return this._getAutoGradientRadial(color, context);
		else if (gradientType == "linear")
			return this._getAutoGradientLinear(color, context);
		
		return null;
	};

/**
 * @function _getAutoGradientMetrics
 * Helper function that returns a metrics object to be used for generating a consistent gradient
 * relative to the canvas regardless of the elements rotation, transformation or position in the
 * display hierarchy. Currently this always generates a gradient at 10 degrees from the upper left
 * to the lower right for consistency with inset/outset borders. This is used by the auto-gradient
 * to create a consistent light source. More styles should be added to allow changing the degrees
 * for more flexibility.
 * 
 * @returns Object
 * Gradient metrics object containing {startPoint:{x,y}, endPoint:{x, y}, width, height}
 */	
CanvasElement.prototype._getAutoGradientMetrics = 
	function ()
	{
		//Get metrics relative to the canvas. Regardless of transform, 
		//light source should always be consistent.
		var metrics = this.getMetrics(this._manager);
	
		//For convienience
		var canvasX = metrics.getX();
		var canvasY = metrics.getY();
		var canvasWidth = metrics.getWidth();
		var canvasHeight = metrics.getHeight();
		
		//Calculate the gradient line based on the element's canvas metrics.
		var gradientWidth = canvasHeight * Math.tan(CanvasElement.degreesToRadians(8));
		
		var gradientStart = {x:0, y:canvasY};
		if (gradientWidth <= canvasWidth)
			gradientStart.x = canvasX + (canvasWidth / 2) - (gradientWidth / 2);
		else
			gradientStart.x = canvasX - ((gradientWidth - canvasWidth) / 2);
		
		var gradientEnd = {x:0, y:canvasY + canvasHeight};
		if (gradientWidth <= canvasWidth)
			gradientEnd.x = canvasX + (canvasWidth / 2) + (gradientWidth / 2);
		else
			gradientEnd.x = canvasX + canvasWidth + ((gradientWidth - canvasWidth) / 2);
		
		//Translate the gradient line start/stop back down to the element's coordinate plane.
		this._manager.translatePointTo(gradientStart, this);
		this._manager.translatePointTo(gradientEnd, this);
		
		return {startPoint:gradientStart, endPoint:gradientEnd, width:canvasWidth, height:canvasHeight};
	};

/**
 * @function _getAutoGradientLinear
 * Helper function that returns a Context2D linear CanvasGradient depending on this elements
 * auto gradient styles. See _getAutoGradientFill().
 * 
 * @param color String
 * Hex color to lighten and darken for gradient. Format "#FF0000" (red).
 * 
 * @param context Canvas2DContext
 * Canvas2DContext to use to generate the gradient.
 * 
 * @returns CanvasGradient
 * Returns CanvasGradient to be applied to canvas Context2D.
 */		
CanvasElement.prototype._getAutoGradientLinear = 
	function (color, context)
	{
		var lighterFill = CanvasElement.adjustColorLight(color, this.getStyle("AutoGradientStart"));
		var darkerFill = CanvasElement.adjustColorLight(color, this.getStyle("AutoGradientStop"));
		
		var gradientMetrics = this._getAutoGradientMetrics();
		
		try
		{
			var fillGradient = context.createLinearGradient(
					gradientMetrics.startPoint.x, gradientMetrics.startPoint.y, 
					gradientMetrics.endPoint.x, gradientMetrics.endPoint.y);
			
			fillGradient.addColorStop(0, lighterFill);
			fillGradient.addColorStop(1, darkerFill);
			
			return fillGradient;
		}
		catch (ex)
		{
			//Swallow, invalid color
			return null;
		}
	};	
	
/**
 * @function _getAutoGradientRadial
 * Helper function that returns a Context2D linear CanvasGradient depending on this elements
 * auto gradient styles. See _getAutoGradientFill().
 * 
 * @param color String
 * Hex color to lighten and darken for gradient. Format "#FF0000" (red).
 * 
 * @param context Canvas2DContext
 * Canvas2DContext to use to generate the gradient.
 * 
 * @returns CanvasGradient
 * Returns CanvasGradient to be applied to canvas Context2D.
 */		
CanvasElement.prototype._getAutoGradientRadial = 
	function (color, context)
	{
		var lighterFill = CanvasElement.adjustColorLight(color, this.getStyle("AutoGradientStart"));
		var darkerFill = CanvasElement.adjustColorLight(color, this.getStyle("AutoGradientStop"));
		
		var gradientMetrics = this._getAutoGradientMetrics();
		
		var xSpan = gradientMetrics.endPoint.x - gradientMetrics.startPoint.x;
		var ySpan = gradientMetrics.endPoint.y - gradientMetrics.startPoint.y;
		
		var gradientPoint = {x:gradientMetrics.startPoint.x + (xSpan * .42), 
							y:gradientMetrics.startPoint.y + (ySpan * .42)};
		
		try
		{
			var fillGradient = context.createRadialGradient(
					gradientPoint.x, gradientPoint.y, 
					(Math.max(gradientMetrics.width, gradientMetrics.height) / 2) + (Math.max(xSpan, ySpan) * .08), 
					gradientPoint.x, gradientPoint.y, 
					0);
			
			fillGradient.addColorStop(0, darkerFill);
			fillGradient.addColorStop(1, lighterFill);
			
			return fillGradient;
		}
		catch (ex)
		{
			//Swallow, invalid color
			return null;
		}
	};	

/**
 * @function _drawBackgroundShape
 * Used to draw the path to the Canvas2DContext that is to be used to render the focus ring,
 * fill the background, and draw the border. You should never need to explicitly call this. 
 * The system calls this during render phase.
 * Typically you should use the BackgroundShape style
 * for this, but may override it under more complex scenarios.
 * 
 * @param ctx Canvas2DContext
 * Canvas2DContext to draw the background shape path.
 * 
 * @param borderMetrics DrawMetrics
 * The DrawMetrics containing x,y,width,height used to draw the background. These
 * metrics should be the same as the ones used to stroke a solid border.
 */	
CanvasElement.prototype._drawBackgroundShape = 
	function (ctx, borderMetrics)
	{
		if (this._backgroundShape == null)
		{
			//Full rectangle
			var x = borderMetrics.getX();
			var y = borderMetrics.getY();
			var w = borderMetrics.getWidth();
			var h = borderMetrics.getHeight();
			
			ctx.moveTo(x, y);
			ctx.lineTo(x + w, y);
			ctx.lineTo(x + w, y + h);
			ctx.lineTo(x, y + h);
			ctx.closePath();
		}
		else
		{
			this._backgroundShape.drawShape(ctx, borderMetrics);
		}
	};

/**
 * @function _drawFocusRing
 * Used to draw the focus ring when a tab-able element gains focus due to a tab stop per the elements styles.
 * You should never need to explicitly call this. The system calls this during
 * the render phase. You may override if you wish to draw a more complex focus indicator.
 * Focus ring is drawn *outside* the elements bounding box. Focus ring is rendered
 * before the background and border. 
 * 
 * @param ctx Canvas2DContext
 * Canvas2DContext to render the focus ring.
 * 
 * @param borderMetrics DrawMetrics
 * The DrawMetrics containing x,y,width,height used to draw the background. These
 * metrics should be the same as the ones used to stroke a solid border.
 */		
CanvasElement.prototype._drawFocusRing = 
	function (ctx, borderMetrics)
	{
		var focusRingThickness = this.getStyle("FocusThickness");
		if (focusRingThickness <= 0)
			return;
		
		var focusRingColor = this.getStyle("FocusColor");
		if (focusRingColor == null)
			return;		
		
		var metrics = this.getMetrics(this);
		
		var x = metrics.getX() - focusRingThickness;
		var y = metrics.getY() - focusRingThickness;
		var w = metrics.getWidth() + (focusRingThickness * 2);
		var h = metrics.getHeight() + (focusRingThickness * 2);
		
		ctx.beginPath();
		
		//Draw anticlockwise
		ctx.moveTo(x, y);
		ctx.lineTo(x, y + h);
		ctx.lineTo(x + w, y + h);
		ctx.lineTo(x + w, y);
		ctx.closePath();
		
		//Draws clockwise (shape inside shape)
		this._drawBackgroundShape(ctx, borderMetrics);
		
		//Clip the *inside* of the background shape
		ctx.clip();

		//Draw border
		ctx.beginPath();
		this._drawBackgroundShape(ctx, borderMetrics);
		
		ctx.strokeStyle = focusRingColor;

		//Increase thickness
		ctx.lineWidth = this._getBorderThickness() + (focusRingThickness * 2);
		ctx.stroke();
	};
	
/**
 * @function _fillBackground
 * Used to fill the elements background shape according to the element�s background color and gradient settings.
 * You should never need to explicitly call this. The system calls this during
 * the render phase. You may override if you need to do a more complex background fill. The background fill
 * is rendered after the focus ring and before the border. 
 * 
 * @param ctx Canvas2DContext
 * Canvas2DContext to fill the background shape.
 * 
 * @param borderMetrics DrawMetrics
 * The DrawMetrics containing x,y,width,height used to draw the background. These
 * metrics should be the same as the ones used to stroke a solid border.
 */	
CanvasElement.prototype._fillBackground = 
	function (borderMetrics)
	{
		var backgroundColor = this.getStyle("BackgroundColor");
		if (backgroundColor == null)
			return;
	
		var ctx = this._getGraphicsCtx();
		var gradientFill = this._getAutoGradientFill(backgroundColor, ctx);
		
		if (gradientFill != null)
			ctx.fillStyle = gradientFill;
		else
			ctx.fillStyle = backgroundColor;
		
		ctx.beginPath();
		this._drawBackgroundShape(ctx, borderMetrics);

		ctx.fill();
	};

//@private	
CanvasElement.prototype._drawSolidBorder = 
	function (ctx, borderMetrics)
	{
		var borderColor = this.getStyle("BorderColor");
		if (borderColor == null)
			return;
		
		var borderThickness = this.getStyle("BorderThickness");
		if (borderThickness < 0)
			return;
	
		ctx.beginPath();
		this._drawBackgroundShape(ctx, borderMetrics);
		ctx.strokeStyle = borderColor;

		ctx.lineWidth = borderThickness;
		ctx.stroke();
	};
	
/**
 * @function _drawBorder
 * Used to render the elements border according to the element's style settings.
 * You should never need to explicitly call this. The system calls this during
 * the render phase. You may override if you need to do a more complex border. The border
 * is rendered last, on top of the focus ring and background fill.
 * 
 * @param ctx Canvas2DContext
 * Canvas2DContext to render the border.
 * 
 * @param borderMetrics DrawMetrics
 * The DrawMetrics containing x,y,width,height used to draw the background. These
 * metrics should be the same as the ones used to stroke a solid border.
 */		
CanvasElement.prototype._drawBorder = 
	function (borderMetrics)
	{
		var borderType = this.getStyle("BorderType");
	
		if (borderType != "solid" && borderType != "inset" && borderType != "outset")
			return;			
	
		var ctx = this._getGraphicsCtx();
		
		if (borderType == "solid")
		{
			this._drawSolidBorder(ctx, borderMetrics);
		}
		else //inset || outset
		{
			var borderColor = this.getStyle("BorderColor");
			var borderThickness = this.getStyle("BorderThickness");
			
			if (borderColor == null || borderThickness <= 0)
				return;
			
			var x = 0;
			var y = 0;
			var w = this._width;
			var h = this._height;
			
			var lighterColor = CanvasElement.adjustColorLight(borderColor, .3);
			var darkerColor = CanvasElement.adjustColorLight(borderColor, .3 * -1);
			
			var tlColor = borderType == "inset" ? darkerColor : lighterColor;
			var brColor = borderType == "inset" ? lighterColor : darkerColor;
			
			ctx.beginPath();
			ctx.moveTo(x, y + h);
			ctx.lineTo(x, y);
			ctx.lineTo(x + w, y);
			
			ctx.lineTo(x + w - borderThickness, y + borderThickness);
			ctx.lineTo(x + borderThickness, y + borderThickness);
			ctx.lineTo(x + borderThickness, y + h - borderThickness);
			ctx.closePath();
			
			ctx.fillStyle = tlColor;
			ctx.fill();
			
			ctx.beginPath();
			ctx.moveTo(x, y + h);
			ctx.lineTo(x + w, y + h);
			ctx.lineTo(x + w, y);
			
			ctx.lineTo(x + w - borderThickness, y + borderThickness);
			ctx.lineTo(x + w - borderThickness, y + h - borderThickness);
			ctx.lineTo(x + borderThickness, y + h - borderThickness);
			ctx.closePath();
			
			ctx.fillStyle = brColor;
			ctx.fill();
			
			ctx.lineWidth = 1;
			ctx.globalAlpha= .15;
			ctx.strokeStyle = "#000000";
			
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x + borderThickness, y + borderThickness);
			ctx.stroke();
			
			ctx.beginPath();
			ctx.moveTo(x + w, y + h);
			ctx.lineTo(x + w - borderThickness, y + h - borderThickness);
			ctx.stroke();
		}
	};

//@private	
CanvasElement.prototype._validateStyles = 
	function ()
	{
		this._stylesInvalid = false;
	
		//Reset and record the current set of invalid styles
		var stylesInvalidMap = Object.create(null);
		
		for (var prop in this._stylesInvalidMap)
		{
			if (this._stylesInvalidMap[prop] == true)
			{
				stylesInvalidMap[prop] = true; //Record
				this._stylesInvalidMap[prop] = false; //Reset
			}
		}
		
		this._doStylesUpdated(stylesInvalidMap);
	};
	
//@private	
CanvasElement.prototype._validateMeasure = 
	function ()
	{
		this._measureInvalid = false;
	
		var paddingSize = this._getPaddingSize();
		var measuredSize = this._doMeasure(paddingSize.width, paddingSize.height);
			
		this._setMeasuredSize(measuredSize.width, measuredSize.height);
		
		if (this.hasEventListener("measurecomplete", null) == true)
			this._dispatchEvent(new DispatcherEvent("measurecomplete"));
	};
	
//@private	
CanvasElement.prototype._validateLayout = 
	function ()
	{
		this._layoutInvalid = false;
		this._doLayout(this._getPaddingMetrics());
		
		if (this._layoutInvalid == false && this.hasEventListener("layoutcomplete", null) == true)
			this._dispatchEvent(new DispatcherEvent("layoutcomplete"));
	};	
	
//@private
CanvasElement.prototype._validateRender = 
	function ()
	{
		this._renderInvalid = false;
		
		if (this._graphicsCanvas != null)
		{
			this._graphicsCanvas.width = this._width;
			this._graphicsCanvas.height = this._height;
			this._graphicsCtx.clearRect(0, 0, this._graphicsCanvas.width, this._graphicsCanvas.height);
		}
		
		if (this._graphicsClear == false)
		{
			this._renderChanged = true;
			this._graphicsClear = true;
			
			this._invalidateRedrawRegion();
		}
		
		this._doRender();
	};

//@private
CanvasElement.prototype._getCompositeMetrics = 
	function (compositeParent)
	{
		for (var i = 0; i < this._compositeMetrics.length; i++)
		{
			if (this._compositeMetrics[i].element == compositeParent)
				return this._compositeMetrics[i];
		}
		
		return null;
	};
	
//@private
CanvasElement.prototype._validateCompositeRender = 
	function ()
	{
		if (this._isCompositeElement() == true)
		{
			this._updateCompositeCanvas();
			
			if (this._redrawRegionMetrics != null && this._compositeCanvasMetrics != null)
			{
				//Add a 1 pixel buffer to the redraw region. 
				//This accounts for rounding errors considering redraw regions are calculated per element
				//and composite layers calculated are rendered as an aggregate.
				this._redrawRegionMetrics._x -= 1;
				this._redrawRegionMetrics._y -= 1;
				this._redrawRegionMetrics._width += 2;
				this._redrawRegionMetrics._height += 2;
				this._redrawRegionMetrics.roundUp();
				
				//Composite canvas may have shrunk to smaller than the redraw region, adjust the redraw region
				this._redrawRegionMetrics.mergeReduce(this._compositeCanvasMetrics);
				
				if (this._redrawRegionMetrics._width > 0 && this._redrawRegionMetrics._height > 0)
				{
					this._compositeCtx.clearRect(this._redrawRegionMetrics._x, this._redrawRegionMetrics._y, this._redrawRegionMetrics._width, this._redrawRegionMetrics._height);
					this._renderRedrawRegion(this);
				}
			}
		}
		else //No longer a composite element, nuke the compositing canvases
		{
			this._compositeCanvas = null;				
			this._compositeCtx = null;				
			this._compositeCanvasMetrics = null;		
		}
		
		this._compositeRenderInvalid = false;
		this._compositeEffectChanged = false;
		this._redrawRegionMetrics = null;
	};	
	
//@private	
CanvasElement.prototype._updateCompositeCanvas = 
	function ()
	{
		if (this._compositeVisibleMetrics == null)
		{
			this._compositeCanvas = null;
			this._compositeCtx = null;
			this._compositeCanvasMetrics = null;
		}
		else 
		{
			var newMetrics = this._compositeVisibleMetrics.clone();
			newMetrics.roundUp();
			
			if (this._compositeCanvas == null || this._compositeCanvasMetrics.equals(newMetrics) == false)
			{
				if (this._compositeCanvas == null)
				{
					this._compositeCanvas = document.createElement("canvas");
					this._compositeCtx = this._compositeCanvas.getContext("2d");
				}
				
				if (this._compositeCanvasMetrics == null)
					this._compositeCanvasMetrics = newMetrics;
				else
					this._compositeCanvasMetrics.copyFrom(newMetrics);
				
				this._compositeCanvas.width = this._compositeCanvasMetrics._width;
				this._compositeCanvas.height = this._compositeCanvasMetrics._height;
				
				//Translate x / y
				this._compositeCtx.setTransform(1, 0, 0, 1, this._compositeCanvasMetrics._x * -1, this._compositeCanvasMetrics._y * -1);
				
				//Expand the redraw region to this whole canvas.
				if (this._redrawRegionMetrics == null)
					this._redrawRegionMetrics = this._compositeCanvasMetrics.clone();
				else
					this._redrawRegionMetrics.mergeExpand(this._compositeCanvasMetrics);
			}
		}
	};
	
//@private	
CanvasElement.prototype._isCompositeElement = 
	function ()
	{
		if (this == this._manager)
			return true;
		
		var alpha = this.getStyle("Alpha");
		if (alpha > 0 && alpha < 1)
			return true;
		
		var rotateDegrees = CanvasElement.normalizeDegrees(this._rotateDegrees);
		if (rotateDegrees != 0)
			return true;
		
		if (this.getStyle("ShadowSize") > 0 && this.getStyle("ShadowColor") != null)
			return true;
		
		if (this.getStyle("CompositeLayer") == true)
			return true;
		
		return false;
	};
	
//@private	
CanvasElement.prototype._updateRedrawRegion = 
	function (changedMetrics)
	{
		if (changedMetrics == null || changedMetrics._width <= 0 || changedMetrics._height <= 0)
			return;
	
		if (this._redrawRegionMetrics == null)
			this._redrawRegionMetrics = changedMetrics.clone();
		else
			this._redrawRegionMetrics.mergeExpand(changedMetrics);
		
		this._invalidateCompositeRender();
	};	
	
//@private - This is here to handle a firefox bug. FF ignores clipping if shadow is applied prior to any other
//			 rendering. We draw one pixel outside the canvas bounds to make sure the clipping region gets applied.
CanvasElement.prototype._primeShadow = 
	function ()
	{
		this._compositeCtx.beginPath();
		this._compositeCtx.moveTo(this._compositeCanvasMetrics._x - 1, this._compositeCanvasMetrics._y - 1);
		this._compositeCtx.moveTo(this._compositeCanvasMetrics._x, this._compositeCanvasMetrics._y - 1);
		this._compositeCtx.moveTo(this._compositeCanvasMetrics._x, this._compositeCanvasMetrics._y);
		this._compositeCtx.moveTo(this._compositeCanvasMetrics._x - 1, this._compositeCanvasMetrics._y);
		this._compositeCtx.closePath();
		
		this._compositeCtx.fillStyle = "#000000";
		this._compositeCtx.fill();
	};
	
//@private	
CanvasElement.prototype._renderRedrawRegion = 
	function (element)
	{
		if (element._renderVisible == false)
			return;
	
		var isCompositeChildElement = false;
		if (this != element && element._isCompositeElement() == true)
			isCompositeChildElement = true;
		
		var elementGraphics = null;
		var drawableMetrics = null;
		var compositeMetrics = null;
		
		if (isCompositeChildElement == true && element._transformDrawableMetrics != null)
		{
			compositeMetrics = element._transformVisibleMetrics;
			drawableMetrics = element._transformDrawableMetrics;
			elementGraphics = element._compositeCanvas;
			
			this._compositeCtx.globalAlpha = element.getStyle("Alpha");
		}
		else if (isCompositeChildElement == false && element._compositeMetrics.length > 0 && element._graphicsClear == false)
		{
			compositeMetrics = element._compositeMetrics[0].metrics;
			drawableMetrics = element._compositeMetrics[0].drawableMetrics;
			elementGraphics = element._graphicsCanvas;
			
			this._compositeCtx.globalAlpha = 1;
		}
		
		if (elementGraphics != null &&
			drawableMetrics._width > 0 && drawableMetrics._height > 0 &&
			drawableMetrics._x < this._redrawRegionMetrics._x + this._redrawRegionMetrics._width && 
			drawableMetrics._x + drawableMetrics._width > this._redrawRegionMetrics._x && 
			drawableMetrics._y < this._redrawRegionMetrics._y + this._redrawRegionMetrics._height && 
			drawableMetrics._y + drawableMetrics._height > this._redrawRegionMetrics._y)
		{
			if (isCompositeChildElement == true && CanvasElement.normalizeDegrees(element._rotateDegrees) != 0)
			{
				var clipMetrics = drawableMetrics.clone();
				clipMetrics.mergeReduce(this._redrawRegionMetrics);
				
				this._compositeCtx.save();
				
				//Clip the region we need to re-draw
				this._compositeCtx.beginPath();
				this._compositeCtx.moveTo(clipMetrics._x, clipMetrics._y);
				this._compositeCtx.lineTo(clipMetrics._x + clipMetrics._width, clipMetrics._y);
				this._compositeCtx.lineTo(clipMetrics._x + clipMetrics._width, clipMetrics._y + clipMetrics._height);
				this._compositeCtx.lineTo(clipMetrics._x, clipMetrics._y + clipMetrics._height);
				this._compositeCtx.closePath();
				this._compositeCtx.clip();
				
				//Translate canvas to actual position
				var parent = element._parent;
				while (parent._isCompositeElement() == false)
				{
					this._compositeCtx.translate(parent._x, parent._y);
					parent = parent._parent;
				} 
				
				//Do rotation
				this._compositeCtx.translate(element._rotateCenterX, element._rotateCenterY);
				this._compositeCtx.rotate(CanvasElement.degreesToRadians(element._rotateDegrees));
				this._compositeCtx.translate(-element._rotateCenterX, -element._rotateCenterY);
			
				//Account for composite canvas translation.
				this._compositeCtx.translate(element._compositeCanvasMetrics._x, element._compositeCanvasMetrics._y);
				
				//Handle shadow
				if (element.getStyle("ShadowSize") > 0 && element.getStyle("ShadowColor") != null)
				{
					//Handle firefox bug.
					this._primeShadow();
					
					this._compositeCtx.shadowBlur = element.getStyle("ShadowSize");
					this._compositeCtx.shadowColor = element.getStyle("ShadowColor");
					
					//We need to rotate the shadow to match the element's rotation
					var shadowOffsetX = element.getStyle("ShadowOffsetX");
					var shadowOffsetY = element.getStyle("ShadowOffsetY");
					var radius = Math.sqrt((shadowOffsetX * shadowOffsetX) + (shadowOffsetY * shadowOffsetY));
					var degrees = 360 - element._rotateDegrees + CanvasElement.radiansToDegrees(Math.atan2(shadowOffsetX, shadowOffsetY));
					
					this._compositeCtx.shadowOffsetX = Math.sin(CanvasElement.degreesToRadians(degrees)) * radius;
					this._compositeCtx.shadowOffsetY = Math.cos(CanvasElement.degreesToRadians(degrees)) * radius;
				}
				
				this._compositeCtx.drawImage(
					elementGraphics, 
					0, 0, element._compositeCanvasMetrics._width, element._compositeCanvasMetrics._height, 
					element._x, element._y, element._compositeCanvasMetrics._width, element._compositeCanvasMetrics._height);
				
				this._compositeCtx.restore();
			}
			else if (isCompositeChildElement == true && element.getStyle("ShadowSize") > 0 && element.getStyle("ShadowColor") != null)
			{
				this._compositeCtx.save();
				
				var clipMetrics = drawableMetrics.clone();
				clipMetrics.mergeReduce(this._redrawRegionMetrics);
				
				//Clip the region we need to re-draw
				this._compositeCtx.beginPath();
				this._compositeCtx.moveTo(clipMetrics._x, clipMetrics._y);
				this._compositeCtx.lineTo(clipMetrics._x + clipMetrics._width, clipMetrics._y);
				this._compositeCtx.lineTo(clipMetrics._x + clipMetrics._width, clipMetrics._y + clipMetrics._height);
				this._compositeCtx.lineTo(clipMetrics._x, clipMetrics._y + clipMetrics._height);
				this._compositeCtx.closePath();
				this._compositeCtx.clip();
				
				//Handle firefox bug.
				this._primeShadow();
				
				this._compositeCtx.shadowBlur = element.getStyle("ShadowSize");
				this._compositeCtx.shadowColor = element.getStyle("ShadowColor");
				this._compositeCtx.shadowOffsetX = element.getStyle("ShadowOffsetX");
				this._compositeCtx.shadowOffsetY = element.getStyle("ShadowOffsetY");
				
				//Account for canvas edge buffer (visible - canvas)
				var destX = compositeMetrics._x - (element._compositeVisibleMetrics._x - element._compositeCanvasMetrics._x);
				var destY = compositeMetrics._y - (element._compositeVisibleMetrics._y - element._compositeCanvasMetrics._y);
				
				this._compositeCtx.drawImage(
						elementGraphics, 
						0, 0, element._compositeCanvasMetrics._width, element._compositeCanvasMetrics._height, 
						destX, destY, element._compositeCanvasMetrics._width, element._compositeCanvasMetrics._height);
				
				this._compositeCtx.restore();
			}
			else
			{
				var sourceX = 0;
				var sourceY = 0;
				
				var destX = 0;
				var destY = 0;

				var width = 0;
				var height = 0;
				
				if (drawableMetrics._x >= this._redrawRegionMetrics._x)
				{
					sourceX = drawableMetrics._x - compositeMetrics._x;
					destX = drawableMetrics._x;
					
					width = Math.min(drawableMetrics._width,  this._redrawRegionMetrics._width - (drawableMetrics._x - this._redrawRegionMetrics._x));
				}
				else
				{
					sourceX = this._redrawRegionMetrics._x - compositeMetrics._x;
					destX = this._redrawRegionMetrics._x;
					
					width = Math.min(this._redrawRegionMetrics._width,  drawableMetrics._width - (this._redrawRegionMetrics._x - drawableMetrics._x));
				}
				
				if (drawableMetrics._y >= this._redrawRegionMetrics._y)
				{
					sourceY = drawableMetrics._y - compositeMetrics._y;
					destY = drawableMetrics._y;
					
					height = Math.min(drawableMetrics._height,  this._redrawRegionMetrics._height - (drawableMetrics._y - this._redrawRegionMetrics._y));
				}
				else
				{
					sourceY = this._redrawRegionMetrics._y - compositeMetrics._y;
					destY = this._redrawRegionMetrics._y;
					
					height = Math.min(this._redrawRegionMetrics._height,  drawableMetrics._height - (this._redrawRegionMetrics._y - drawableMetrics._y));
				}
				
				this._compositeCtx.drawImage(
					elementGraphics, 
					sourceX, sourceY, width, height, 
					destX, destY, width, height);
			}
		}
		
		if (isCompositeChildElement == false)
		{
			for (var i = 0; i < element._children.length; i++)
				this._renderRedrawRegion(element._children[i]);
		}
	};			
	
/**
 * @function _invalidateStyle
 * Invalidates the supplied style and causes the system to invoke the _doStylesChanged() function.
 * This should never concievably be called and is exclusively handled by the system. 
 * This is the starting point for the element lifecycle. If you're program is dependent on 
 * _doStylesChanged() when no styles have actually changed, you might have a design issue. 
 * Do not override this function.
 * 
 * @param styleName String
 * String representing the style to be invalidated.
 */	
CanvasElement.prototype._invalidateStyle = 
	function (styleName)
	{
		if (this._stylesInvalid == false)
		{
			this._stylesInvalid = true;
			
			if (this._manager != null)
				this._manager._updateStylesQueue.addNode(this._stylesValidateNode, this._displayDepth);
		}
		
		this._stylesInvalidMap[styleName] = true;
	};	
	
/**
 * @function _invalidateMeasure
 * Invalidates the element's measured sizes and causes the system to invoke 
 * doMeasure() on the next measure phase. The system calls this automatically for all
 * existing components, this is only necessary for custom component development. 
 * This should only be called when a change is made
 * to the element that will impact its measurement. Such as property changes or from within the elements doStylesUpdated() 
 * when a style change impacts the elements measurement (such as Padding).  On rare occasions
 * you may need to re-invalidate measurement from within the doMeasure() function (such as wrapping text).
 * This will cause a 2nd measurement pass for that element which is valid (but expensive).
 * Do not override this function.
 */	
CanvasElement.prototype._invalidateMeasure = 
	function()
	{
		//Only invalidate once.
		if (this._measureInvalid == false)
		{
			this._measureInvalid = true;
			
			if (this._manager != null)
				this._manager._updateMeasureQueue.addNode(this._measureValidateNode, this._displayDepth);
		}
	};
	
/**
 * @function _invalidateLayout
 * Invalidates the elements child layout and causes the system to invoke doLayout() on
 * the next layout phase. The system calls this automatically for all existing components,
 * this is only necessary for custom component development.
 * This should only be called when a change is made to the element that will impact its layout.
 * Such as property changes or from within the elements doStylesUpdated() when a style change impacts
 * the element's layout (such as Padding). On rare occasions you may need to re-invalidate layout
 * from within the doLayout() function. An example is when a DataList adds a new DataRenderer it
 * re-invalidates layout to allow the renderer to measure before continuing layout.
 * Do not override this function.
 */	
CanvasElement.prototype._invalidateLayout = 
	function()
	{
		//Only invalidate once.
		if (this._layoutInvalid == false)
		{
			this._layoutInvalid = true;
			
			if (this._manager != null)
				this._manager._updateLayoutQueue.addNode(this._layoutValidateNode, this._displayDepth);
		}
	};	
	
/**
 * @function _invalidateRender
 * Invalidates the elements child render and causes the system to invoke doRender() on
 * the next render phase. The system calls this automatically for all existing components,
 * this is only necessary for custom component development.
 * This should only be called when a change is made to the element that will impact its rendering.
 * Such as property changes or from within the elements doStylesUpdated() when a style change impacts
 * the element's rendering (such as BackgroundColor). 
 * Do not override this function.
 */	
CanvasElement.prototype._invalidateRender =
	function ()
	{
		//Only invalidate once.
		if (this._renderInvalid == false)
		{
			this._renderInvalid = true;
			
			if (this._manager != null)
				this._manager._updateRenderQueue.addNode(this._renderValidateNode, this._displayDepth);
		}
	};	
	
//@private	
CanvasElement.prototype._invalidateRedrawRegion = 
	function ()
	{
		if (this._manager != null)
			this._manager._redrawRegionInvalid = true;
	};	
	
//@private
CanvasElement.prototype._invalidateCompositeRender = 
	function ()
	{
		if (this._compositeRenderInvalid == false)
		{
			this._compositeRenderInvalid = true;
			
			if (this._manager != null)
				this._manager._compositeRenderQueue.addNode(this._compositeRenderValidateNode, this._displayDepth);
		}
	};
	
/**
 * @function _doStylesUpdated
 * Lifecycle method for custom component development. Never call this function directly. The system
 * calls this function in response to style changes or elements being added to the display hierarchy.
 * Override this function to handle style changes to the element. Style changes may impact other styles,
 * event listeners, layout, measurement, rendering, etc. You should call appropriate _invalidate() method per style.
 * Note that style handling should not be dependent on the *current* state of a style. This function
 * should be able to run repeatedly with the same values. An example of when this may happen is if
 * an element is temporarily removed from the display hierarchy then added back. Whenever an element is added
 * all of its styles are invalidated. This is necessary as when an element is *not* part of the display chain
 * style changes are not tracked. So when an element is added there is no way to know which styles may have changed
 * hence all of them are invalidated. 
 * 
 * @param stylesMap Object
 * An Object map containing all the style names that have been updated. Map contains entries {styleName:true}.
 * Elements should typically check this map before assuming a style has changed for performance reasons. 
 * You should always call the base method. If you wish to override the style handling behavior of a specific style, 
 * you can simply delete it from the map before passing it to the base function.
 */	
CanvasElement.prototype._doStylesUpdated = 
	function (stylesMap)
	{
		if (this._parent != null && 
			(this._parent._measureInvalid == false || this._parent._layoutInvalid == false))
		{
			if ("X" in stylesMap ||
				"Y" in stylesMap ||
				"Width" in stylesMap ||
				"Height" in stylesMap ||
				"PercentWidth" in stylesMap ||
				"PercentHeight" in stylesMap ||
				"MinWidth" in stylesMap ||
				"MinHeight" in stylesMap ||
				"MaxWidth" in stylesMap ||
				"MaxHeight" in stylesMap ||
				"Top" in stylesMap ||
				"Left" in stylesMap ||
				"Bottom" in stylesMap ||
				"Right" in stylesMap ||
				"HorizontalCenter" in stylesMap ||
				"VerticalCenter" in stylesMap ||
				"IncludeInLayout" in stylesMap ||
				"RotateDegrees" in stylesMap ||
				"RotateCenterX" in stylesMap ||
				"RotateCenterY" in stylesMap)
			{
				this._parent._invalidateMeasure();
				this._parent._invalidateLayout();
			}
		}
		
		if (this._measureInvalid == false || this._layoutInvalid == false)
		{
			if ("Padding" in stylesMap ||
				"PaddingTop" in stylesMap ||
				"PaddingBottom" in stylesMap ||
				"PaddingLeft" in stylesMap ||
				"PaddingRight" in stylesMap)
			{
				this._invalidateMeasure();
				this._invalidateLayout();
			}
		}
		
		if ("BorderThickness" in stylesMap || 
			"BorderType" in stylesMap || 
			"BorderColor" in stylesMap || 
			"BackgroundColor" in stylesMap || 
			"AutoGradientType" in stylesMap || 
			"AutoGradientStart" in stylesMap || 
			"AutoGradientStop" in stylesMap ||
			(this._renderFocusRing == true && ("FocusColor" in stylesMap || "FocusThickness" in stylesMap)))
		{
			this._invalidateRender();
		}
		
		if ("Visible" in stylesMap ||
			"ClipContent" in stylesMap)
		{
			this._invalidateRedrawRegion();
		}
		
		if ("Alpha" in stylesMap ||
			"ShadowSize" in stylesMap)
		{
			this._compositeEffectChanged = true;
			this._invalidateRedrawRegion();
			this._invalidateCompositeRender();
		}
		
		if ("BackgroundShape" in stylesMap)
		{
			var bgShape = this.getStyle("BackgroundShape");
			
			//Only handle if changed, attached/detached handles initial add/remove listener.
			if (bgShape != this._backgroundShape)
			{
				if (this._backgroundShape != null)
					this._backgroundShape.removeEventListener("stylechanged", this._onBackgroundShapeStyleChangedInstance);
				
				this._backgroundShape = bgShape;
				
				if (this._backgroundShape != null)
					this._backgroundShape.addEventListener("stylechanged", this._onBackgroundShapeStyleChangedInstance);
				
				this._invalidateRender();
			}
		}
		
		if ("Cursor" in stylesMap)
		{
			var cursorDef = this.getStyle("Cursor");
			
			if (cursorDef == null && this.hasEventListener("rollover", this._onCanvasElementCursorOverOutInstance) == true)
			{
				this.removeEventListener("rollover", this._onCanvasElementCursorOverOutInstance);
				this.removeEventListener("rollout", this._onCanvasElementCursorOverOutInstance);
			}
			else if (cursorDef != null && this.hasEventListener("rollover", this._onCanvasElementCursorOverOutInstance) == false)
			{
				this.addEventListener("rollover", this._onCanvasElementCursorOverOutInstance);
				this.addEventListener("rollout", this._onCanvasElementCursorOverOutInstance);
			}
			
			this._updateRolloverCursorDefinition();
		}
		
		//Kill focus ring if disabled.
		if ("Enabled" in stylesMap && this.getStyle("Enabled") == false)
			this._setRenderFocusRing(false);
		
		if ("Visible" in stylesMap || "MouseEnabled" in stylesMap)
			this._manager._rollOverInvalid = true;
	};

//@private	
CanvasElement.prototype._updateRolloverCursorDefinition = 
	function ()
	{
		var cursorDef = this.getStyle("Cursor");
		
		if (this._rollOverCursorInstance != null && 
			(cursorDef == null || this._mouseIsOver == false))
		{
			this._manager.removeCursor(this._rollOverCursorInstance);
			this._rollOverCursorInstance = null;
		}
		else if (this._mouseIsOver == true && cursorDef != null)
		{
			if (this._rollOverCursorInstance == null)
				this._rollOverCursorInstance = this._manager.addCursor(cursorDef, 0);
			else if (this._rollOverCursorInstance.data != cursorDef)
			{
				this._manager.removeCursor(this._rollOverCursorInstance);
				this._rollOverCursorInstance = this._manager.addCursor(cursorDef, 0);
			}
		}
	};

/**
 * @function _doMeasure
 * Lifecycle method for custom component development. Never call this function directly. The system
 * calls this function in response to changes that effect measurement or elements being added to the display hierarchy.
 * Override this function to calculate the measured size of the element based on its styling, children, etc. 
 * Return a object containing {width, height}.
 * 
 * @param padWidth Number
 * Simply a convienence as padding typically effects measurement (but not always) depending on the component.
 * Use any supporting functions such as _getBorderThickness that are needed to measure the element.
 * 
 * @param padHeight Number
 * Simply a convienence as padding typically effects measurement (but not always) depending on the component.
 * Use any supporting functions such as _getBorderThickness that are needed to measure the element.
 * 
 * @returns Object
 * An object containing the elements measured size. {width, height}
 */		
CanvasElement.prototype._doMeasure = 
	function (padWidth, padHeight)
	{
		//Stub for override.
	
		//Always return a size... 
		return {width: padWidth, height: padHeight};
	};
	
/**
 * @function _doLayout
 * Lifecycle method for custom component development. Never call this function directly. The system
 * calls this function in response to changes that effect layout or elements being added to the display hierarchy.
 * Override this function to layout its children. You should call layout functions such as _setActualPosition() and
 * _setActualSize() on child elements from within this function. Sometimes you may need to add/remove additional elements
 * during layout such as when a Datagrid or Viewport adds/removes scroll bars. Keep in mind that adding/removing elements
 * automatically re-invalidates layout, so its best to bail out and wait for the next layout pass for best performance
 * under this scenario.
 * 
 * @param paddingMetrics DrawMetrics
 * Contains metrics to use after considering the element's padding. Simply a convienence as padding typically 
 * effects layout (but not always) depending on the component. Use any supporting functions such as _getBorderMetrics()
 * that are needed to layout the element.
 */		
CanvasElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		//Stub for override.
	};	
	
/**
 * @function _doRender
 * Lifecycle method for custom component development. Never call this function directly. The system
 * calls this function in response to changes that effect rendering or elements being added to the display hierarchy.
 * Override this function to render the element. Keep in mind that any child elements are rendered on top of this
 * element. This function is typically not needed unless rendering a very primitive object such as a custom skin or 
 * a display object that cannot be handled via a BackgroundShape class and/or _fillBackground() function.
 * Most advanced objects should use skins and other means to render themselves.
 * 
 * CanvasElement draws its background and border via supplied shape and gradient settings.
 */		
CanvasElement.prototype._doRender =
	function()
	{
		var borderMetrics = this._getBorderMetrics();
		
		if (this._renderFocusRing == true)
		{
			//ctx.save();
			//this._drawFocusRing(borderMetrics);
			//ctx.restore();
		}
		
		this._fillBackground(borderMetrics);
		
		this._drawBorder(borderMetrics);
	};
	
	
//////////DataRenderer Dynamic Properties/////////////////
	
/**
 * @function _setListData
 * This function is called when the element is being used as a DataRenderer for containers
 * like DataList and DataGrid. Override this function to make any changes to the DataRenderer
 * per the supplied DataListData and itemData objects. Update any styles, states, add/remove children, call any
 * necessary _invalidate() functions, etc.
 * 
 * @param listData DataListData
 * A DataListData or subclass object passed by the parent DataList or subclass with data necessary
 * to update the DataRender like the parent DataList reference and row/column index being rendered.
 * 
 * @param itemData Object
 * The data Object (such as row data) supplied by the implementor's ListCollection to render the row/column DataRenderer.
 */	
CanvasElement.prototype._setListData = 
	function (listData, itemData)
	{
		this._listData = listData;
		this._itemData = itemData;
	};

/**
 * @function _setListSelected
 * This function is called when the element is being used as a DataRenderer for containers
 * like DataList and DataGrid to change the DataRenderer's selection state. 
 * Override this function to make any changes to the DataRenderer per the selection state.
 * Update any styles, states, add/remove children, call any necessary _invalidate() functions, etc.
 * 
 * @param selected boolean
 * True if the DataRenderer is selected, otherwise false.
 */	
CanvasElement.prototype._setListSelected = 
	function (selected)
	{
		this._listSelected = selected;
	};	
	
	


/**
 * @depends CanvasElement.js
 */

///////////////////////////////////////////////////////////////////////
///////////////////////ViewportElement/////////////////////////////////	
	
/**
 * @class ViewportElement
 * @inherits CanvasElement
 * 
 * Viewport is a container that only supports one child element (usually another container).
 * When the child's content size is too large for the view area, the Viewport will optionally 
 * pop up scroll bars, otherwise the child element will assume the size of the ViewportElement.
 * 
 * This class needs more work. More styles are needed for controlling tween behavior and allowing
 * scrolling even if scroll bars are disabled.
 *  
 * 
 * @constructor ViewportElement 
 * Creates new ViewportElement instance.
 */
function ViewportElement()
{
	ViewportElement.base.prototype.constructor.call(this);
	
	this._viewElement = null;
	
	this._horizontalScrollBar = null;
	this._verticalScrollBar = null;
	
	this._viewPortContainer = new CanvasElement();
	this._viewPortContainer.setStyle("ClipContent", true);
	this._addChild(this._viewPortContainer);
	
	var _self = this;
	
	//Private event handler, need different instance for each Viewport, proxy to prototype.
	this._onViewportScrollBarChangeInstance =
		function (elementEvent)
		{
			_self._onViewportScrollBarChange(elementEvent);
		};
		
	this._onViewportMouseWheelEventInstance = 
		function (elementMouseWheelEvent)
		{
			_self._onViewportMouseWheelEvent(elementMouseWheelEvent);
		};
		
	this._onViewElementMeasureCompleteInstance = 
		function (event)
		{
			_self._onViewElementMeasureComplete(event);
		};
		
		
	this.addEventListener("wheel", this._onViewportMouseWheelEventInstance);
}

//Inherit from CanvasElement
ViewportElement.prototype = Object.create(CanvasElement.prototype);
ViewportElement.prototype.constructor = ViewportElement;
ViewportElement.base = CanvasElement;

/////////////Style Types////////////////////////////////////////////

ViewportElement._StyleTypes = Object.create(null);

/**
 * @style MeasureContentWidth boolean
 * When true, the viewport's measured width will use its content element's measured width. 
 * Use this when you want the viewport to expand its width when possible rather than scroll, 
 * causing scrolling to happen on a parent viewport.
 */
ViewportElement._StyleTypes.MeasureContentWidth = 				StyleableBase.EStyleType.NORMAL;		// true || false

/**
 * @style MeasureContentHeight boolean
 * When true, the viewport's measured height will use its content element's measured height.
 * Use this when you want the viewport to expand when its height possible rather than scroll, 
 * causing scrolling to happen on a parent viewport.
 */
ViewportElement._StyleTypes.MeasureContentHeight = 				StyleableBase.EStyleType.NORMAL;		// true || false

/**
 * @style HorizontalScrollBarDisplay String
 * Determines the behavior of the horizontal scroll bar. Allowable values are "on", "off", or "auto".
 */
ViewportElement._StyleTypes.HorizontalScrollBarDisplay = 		StyleableBase.EStyleType.NORMAL;		// "on" || "off" || "auto"

/**
 * @style HorizontalScrollBarPlacement String
 * Determines the position of the horizontal scroll bar. Allowable values are "top" or "bottom".
 */
ViewportElement._StyleTypes.HorizontalScrollBarPlacement = 		StyleableBase.EStyleType.NORMAL;		// "top" || "bottom"

/**
 * @style VerticalScrollBarDisplay String
 * Determines the behavior of the vertical scroll bar. Allowable values are "on", "off", or "auto".
 */
ViewportElement._StyleTypes.VerticalScrollBarDisplay = 			StyleableBase.EStyleType.NORMAL;		// "on" || "off" || "auto"

/**
 * @style VerticalScrollBarPlacement String
 * Determines the position of the vertical scroll bar. Allowable values are "left" or "right".
 */
ViewportElement._StyleTypes.VerticalScrollBarPlacement = 		StyleableBase.EStyleType.NORMAL;		// "left" || "right"

//ScrollBar styles.
/**
 * @style HorizontalScrollBarStyle StyleDefinition
 * The StyleDefinition to be applied to the horizontal scroll bar.
 */
ViewportElement._StyleTypes.HorizontalScrollBarStyle = 			StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition

/**
 * @style VerticalScrollBarStyle StyleDefinition
 * The StyleDefinition to be applied to the vertical scroll bar.
 */
ViewportElement._StyleTypes.VerticalScrollBarStyle = 			StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition


////////////Default Styles///////////////////////////////////////

ViewportElement.StyleDefault = new StyleDefinition();

ViewportElement.StyleDefault.setStyle("HorizontalScrollBarDisplay", 					"auto");
ViewportElement.StyleDefault.setStyle("HorizontalScrollBarPlacement", 					"bottom");

ViewportElement.StyleDefault.setStyle("VerticalScrollBarDisplay", 						"auto");
ViewportElement.StyleDefault.setStyle("VerticalScrollBarPlacement", 					"right");

ViewportElement.StyleDefault.setStyle("HorizontalScrollBarStyle", 						null);
ViewportElement.StyleDefault.setStyle("VerticalScrollBarStyle", 						null);

ViewportElement.StyleDefault.setStyle("MeasureContentWidth", 							false);
ViewportElement.StyleDefault.setStyle("MeasureContentHeight", 							false);



/////////////Public///////////////////////////////

/**
 * @function setElement
 * Sets the child element of the Viewport.
 * 
 * @param element CanvasElement
 * The child element of the Viewport (or null).
 */
ViewportElement.prototype.setElement = 
	function (element)
	{
		if (this._viewElement != null)
		{
			this._viewElement.removeEventListener("measurecomplete", this._onViewElementMeasureCompleteInstance);
			this._viewPortContainer._removeChild(this._viewElement);
		}
		
		this._viewElement = element;
		
		if (this._viewElement != null)
		{
			this._viewElement.addEventListener("measurecomplete", this._onViewElementMeasureCompleteInstance);
			this._viewPortContainer._addChild(this._viewElement);
		}
		
		this._invalidateMeasure();
		this._invalidateLayout();
	};


////////////Internal//////////////////////////////
	
/**
 * @function _onViewportScrollBarChange
 * Event handler for the scroll bar "changed" event. Updates the child elements position within the Viewport.
 * 
 * @param elementEvent ElementEvent
 * The ElementEvent to process.
 */		
ViewportElement.prototype._onViewportScrollBarChange = 
	function (elementEvent)
	{
		this._invalidateLayout();
	};

ViewportElement.prototype._onViewElementMeasureComplete = 
	function (event)
	{
		this._invalidateLayout();
	};
	
/**
 * @function _onViewportMouseWheelEvent
 * Event handler for the Viewport's "wheel" event. Starts the scroll bar tween.
 * 
 * @param elementMouseWheelEvent ElementMouseWheelEvent
 * The ElementMouseWheelEvent to process.
 */		
ViewportElement.prototype._onViewportMouseWheelEvent = 
	function (elementMouseWheelEvent)
	{
		if (elementMouseWheelEvent.getDefaultPrevented() == true)
			return;
	
		var consumeEvent = false;
		
		var scrollPageSize = null;
		var scrollViewSize = null;
		var scrollLineSize = null;
		var scrollValue = null;
		var maxScrollValue = null;
		
		var deltaX = elementMouseWheelEvent.getDeltaX();
		var deltaY = elementMouseWheelEvent.getDeltaY();
		
		if (deltaX != 0 && this._horizontalScrollBar != null)
		{
			scrollPageSize = this._horizontalScrollBar.getScrollPageSize();
			scrollViewSize = this._horizontalScrollBar.getScrollViewSize();
			scrollLineSize = this._horizontalScrollBar.getScrollLineSize();
			
			maxScrollValue = scrollPageSize - scrollViewSize;
			if (maxScrollValue > 0)
			{
				scrollValue = this._horizontalScrollBar.getTweenToValue();
				if (scrollValue == null)
					scrollValue = this._horizontalScrollBar.getScrollValue();
				
				if (deltaX < 0 && scrollValue > 0)
				{
					this._horizontalScrollBar.startScrollTween(Math.max(scrollValue + (deltaX * (scrollLineSize * 3)), 0));
					consumeEvent = true;
				}
				else if (deltaX > 0 && scrollValue < maxScrollValue)
				{
					this._horizontalScrollBar.startScrollTween(Math.min(scrollValue + (deltaX * (scrollLineSize * 3)), maxScrollValue));
					consumeEvent = true;
				}
			}
		}
		
		if (deltaY != 0 && this._verticalScrollBar != null)
		{
			scrollPageSize = this._verticalScrollBar.getScrollPageSize();
			scrollViewSize = this._verticalScrollBar.getScrollViewSize();
			scrollLineSize = this._verticalScrollBar.getScrollLineSize();
			
			maxScrollValue = scrollPageSize - scrollViewSize;
			if (maxScrollValue > 0)
			{
				scrollValue = this._verticalScrollBar.getTweenToValue();
				if (scrollValue == null)
					scrollValue = this._verticalScrollBar.getScrollValue();
				
				if (deltaY < 0 && scrollValue > 0)
				{
					this._verticalScrollBar.startScrollTween(Math.max(scrollValue + (deltaY * (scrollLineSize * 3)), 0));
					consumeEvent = true;
				}
				else if (deltaY > 0 && scrollValue < maxScrollValue)
				{
					this._verticalScrollBar.startScrollTween(Math.min(scrollValue + (deltaY * (scrollLineSize * 3)), maxScrollValue));
					consumeEvent = true;
				}
			}
		}
		
		//We've consumed the wheel event, don't want parents double scrolling.
		if (consumeEvent == true)
		{
			elementMouseWheelEvent.preventDefault();
			this._invalidateLayout();
		}
	};
	
//@Override
ViewportElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		ViewportElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("HorizontalScrollBarDisplay" in stylesMap ||
			"VerticalScrollBarDisplay" in stylesMap)
		{
			this._invalidateLayout();
			this._invalidateMeasure();
		}
		else 
		{	
			if ("HorizontalScrollBarPlacement" in stylesMap ||
				"VerticalScrollBarPlacement" in stylesMap)
			{
				this._invalidateLayout();
			}
			
			if ("MeasureContentWidth" in stylesMap || 
				"MeasureContentHeight" in stylesMap)
			{
				this._invalidateMeasure();
			}
		}
		
		if ("HorizontalScrollBarStyle" in stylesMap && this._horizontalScrollBar != null)
			this._applySubStylesToElement("HorizontalScrollBarStyle", this._horizontalScrollBar);
		if ("VerticalScrollBarStyle" in stylesMap && this._verticalScrollBar != null)
			this._applySubStylesToElement("VerticalScrollBarStyle", this._verticalScrollBar);
	};

//@Override
ViewportElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		var vBarWidth = 0;
		var vBarHeight = 0;
		
		var hBarWidth = 0;
		var hBarHeight = 0;
		
		var w = 0;
		var h = 0;
		
		if (this._viewElement != null)
		{
			if (this.getStyle("MeasureContentWidth") == true)
				w = this._viewElement._getStyledOrMeasuredWidth();
			
			if (this.getStyle("MeasureContentHeight") == true)
				h = this._viewElement._getStyledOrMeasuredHeight();
		}
		
		if (this._verticalScrollBar != null)
		{
			vBarWidth = this._verticalScrollBar._getStyledOrMeasuredWidth();
			vBarHeight = this._verticalScrollBar._getStyledOrMeasuredHeight();
		}
		if (this._horizontalScrollBar != null)
		{
			hBarWidth = this._horizontalScrollBar._getStyledOrMeasuredWidth();
			hBarHeight = this._horizontalScrollBar._getStyledOrMeasuredHeight();
		}
		
		if (w == 0)
			w = hBarWidth;
		if (h == 0)
			h = vBarHeight;
		
		w += vBarWidth;
		h += hBarHeight;
		
		return {width:w + padWidth, height:h + padHeight};
	};
	
//@Override	
ViewportElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		var hDisplay = this.getStyle("HorizontalScrollBarDisplay");
		var vDisplay = this.getStyle("VerticalScrollBarDisplay");
		
		var paneWidth = paddingMetrics.getWidth();
		var paneHeight = paddingMetrics.getHeight();
		
		var contentWidth = 0;
		var contentHeight = 0;
		if (this._viewElement != null)
		{
			contentWidth = this._viewElement._getStyledOrMeasuredWidth();
			contentHeight = this._viewElement._getStyledOrMeasuredHeight();
		}
		
		var scrollBarsChanged = false;
		var needsHScroll = false;
		var needsVScroll = false;
		
		//We need the scroll bar.
		if (hDisplay == "on" || (hDisplay == "auto" && contentWidth > paneWidth))
			needsHScroll = true;
			
		if (vDisplay == "on" || (vDisplay == "auto" && contentHeight > paneHeight))
			needsVScroll = true;
		
		//2nd pass, we need the *other* scroll bar because the first took some of our content area.
		if (needsHScroll == true && needsVScroll == false && vDisplay == "auto" && this._horizontalScrollBar != null)
		{
			if (contentHeight > paneHeight - this._horizontalScrollBar._getStyledOrMeasuredHeight())
				needsVScroll = true;
		}

		if (needsVScroll == true && needsHScroll == false && hDisplay == "auto" && this._verticalScrollBar != null)
		{
			if (contentWidth > paneWidth - this._verticalScrollBar._getStyledOrMeasuredWidth())
				needsHScroll = true;
		}
		
		//Destroy
		if (needsHScroll == false)
		{
			if (this._horizontalScrollBar != null)
			{
				this._removeChild(this._horizontalScrollBar);
				this._horizontalScrollBar = null;
				scrollBarsChanged = true;
			}
		}
		else //Create
		{
			if (this._horizontalScrollBar == null)
			{
				this._horizontalScrollBar = new ScrollBarElement();
				this._applySubStylesToElement("HorizontalScrollBarStyle", this._horizontalScrollBar);

				this._horizontalScrollBar.setStyle("LayoutDirection", "horizontal");
				this._horizontalScrollBar.setScrollLineSize(25);
				
				this._horizontalScrollBar.addEventListener("changed", this._onViewportScrollBarChangeInstance);
				this._addChild(this._horizontalScrollBar);
				scrollBarsChanged = true;
			}
		}
		
		//Destroy
		if (needsVScroll == false)
		{
			if (this._verticalScrollBar != null)
			{
				this._removeChild(this._verticalScrollBar);
				this._verticalScrollBar = null;
				scrollBarsChanged = true;
			}
		}
		else //Create
		{
			if (this._verticalScrollBar == null)
			{
				this._verticalScrollBar = new ScrollBarElement();
				this._applySubStylesToElement("VerticalScrollBarStyle", this._verticalScrollBar);
				
				this._verticalScrollBar.setStyle("LayoutDirection", "vertical");
				this._verticalScrollBar.setScrollLineSize(25);
				
				this._verticalScrollBar.addEventListener("changed", this._onViewportScrollBarChangeInstance);
				this._addChild(this._verticalScrollBar);
				scrollBarsChanged = true;
			}
		}
		
		//Wait for next pass, adding / removing bars changes content size, need bars to measure.
		if (scrollBarsChanged == true)
			return;
		
		var horizontalBarHeight = 0;
		var verticalBarWidth = 0;
		
		var horizontalScrollValue = 0;
		var verticalScrollValue = 0;
		
		if (this._horizontalScrollBar != null)
		{
			horizontalScrollValue = this._horizontalScrollBar.getScrollValue();
			horizontalBarHeight = this._horizontalScrollBar._getStyledOrMeasuredHeight();
			paneHeight -= horizontalBarHeight;
		}
		
		if (this._verticalScrollBar != null)
		{
			verticalScrollValue = this._verticalScrollBar.getScrollValue();
			verticalBarWidth = this._verticalScrollBar._getStyledOrMeasuredWidth();
			paneWidth -= verticalBarWidth;
		}
		
		//Fix scroll values (size reduction forces us to scroll up)
		horizontalScrollValue = Math.min(horizontalScrollValue, contentWidth - paneWidth);
		horizontalScrollValue = Math.max(horizontalScrollValue, 0);
		
		verticalScrollValue = Math.min(verticalScrollValue, contentHeight - paneHeight);
		verticalScrollValue = Math.max(verticalScrollValue, 0);
		
		var horizontalBarPlacement = this.getStyle("HorizontalScrollBarPlacement");
		var verticalBarPlacement = this.getStyle("VerticalScrollBarPlacement");
		
		var x = paddingMetrics.getX();
		var y = paddingMetrics.getY();
		
		if (this._horizontalScrollBar != null)
		{
			this._horizontalScrollBar.setScrollPageSize(contentWidth);
			this._horizontalScrollBar.setScrollViewSize(paneWidth);
			this._horizontalScrollBar.setScrollValue(horizontalScrollValue);
			
			this._horizontalScrollBar._setActualSize(paneWidth, horizontalBarHeight);
			
			if (horizontalBarPlacement == "top")
			{
				if (verticalBarPlacement == "left")
					this._horizontalScrollBar._setActualPosition(x + verticalBarWidth, y);
				else
					this._horizontalScrollBar._setActualPosition(x, y);
			}
			else
			{
				if (verticalBarPlacement == "left")
					this._horizontalScrollBar._setActualPosition(x + verticalBarWidth, y + paneHeight);
				else
					this._horizontalScrollBar._setActualPosition(x, y + paneHeight);
			}
		}
		
		if (this._verticalScrollBar != null)
		{
			this._verticalScrollBar.setScrollPageSize(contentHeight);
			this._verticalScrollBar.setScrollViewSize(paneHeight);
			this._verticalScrollBar.setScrollValue(verticalScrollValue);
			
			this._verticalScrollBar._setActualSize(verticalBarWidth, paneHeight);
			
			if (verticalBarPlacement == "left")
			{
				if (horizontalBarPlacement == "top")
					this._verticalScrollBar._setActualPosition(x, y + horizontalBarHeight);
				else
					this._verticalScrollBar._setActualPosition(x, y);
			}
			else
			{
				if (horizontalBarPlacement == "top")
					this._verticalScrollBar._setActualPosition(x + paneWidth, y + horizontalBarHeight);
				else
					this._verticalScrollBar._setActualPosition(x + paneWidth, y);
			}
		}
		
		var containerX = x;
		var containerY = y;
		
		if (horizontalBarPlacement == "top")
			containerY += horizontalBarHeight;
		if (verticalBarPlacement == "left")
			containerX += verticalBarWidth;		
		
		this._viewPortContainer._setActualSize(paneWidth, paneHeight);
		this._viewPortContainer._setActualPosition(containerX, containerY);
		
		if (this._viewElement != null)
		{
			this._viewElement._setActualSize(Math.max(paneWidth, contentWidth), Math.max(paneHeight, contentHeight));
			this._viewElement._setActualPosition(horizontalScrollValue * -1, verticalScrollValue * -1);
		}
	};
	
	


/**
 * @depends CanvasElement.js
 */

///////Internal class for rendering lines of text/////////////////

//This class is only used for rendering lines. 
//No measure() or layout() needed (handled by parent TextField).
function TextFieldLineElement()
{
	TextFieldLineElement.base.prototype.constructor.call(this);
	
	this._text = "";
	
	this._highlightMinIndex = 0;
	this._highlightMaxIndex = 0;
	
	this._parentTextField = null;
	this._charMetricsStartIndex = -1;
	this._charMetricsEndIndex = -1;	//Non-inclusive
}
	
//Inherit from CanvasElement
TextFieldLineElement.prototype = Object.create(CanvasElement.prototype);
TextFieldLineElement.prototype.constructor = TextFieldLineElement;
TextFieldLineElement.base = CanvasElement;	

//Optimize - turn off inheriting for rendering styles. We'll pull styles from parent so
//we can utilize the parents cache rather than each line having to lookup and cache styles.
//Parent also responsible for invalidating our render when styles changes.
TextFieldLineElement._StyleTypes = Object.create(null);
TextFieldLineElement._StyleTypes.TextStyle =						StyleableBase.EStyleType.NORMAL;		
TextFieldLineElement._StyleTypes.TextFont =							StyleableBase.EStyleType.NORMAL;		
TextFieldLineElement._StyleTypes.TextSize =							StyleableBase.EStyleType.NORMAL;		
TextFieldLineElement._StyleTypes.TextColor =						StyleableBase.EStyleType.NORMAL;			
TextFieldLineElement._StyleTypes.TextFillType =						StyleableBase.EStyleType.NORMAL;			
TextFieldLineElement._StyleTypes.TextHighlightedColor = 			StyleableBase.EStyleType.NORMAL;			
TextFieldLineElement._StyleTypes.TextHighlightedBackgroundColor = 	StyleableBase.EStyleType.NORMAL;			


TextFieldLineElement.prototype.setParentLineMetrics = 
	function (parentTextField, charStartIndex, charEndIndex)
	{
		this._parentTextField = parentTextField;
		this._charMetricsStartIndex = charStartIndex;
		this._charMetricsEndIndex = charEndIndex;
		
		var newText = parentTextField._text.substring(charStartIndex, charEndIndex);
		if (newText != this._text)
		{
			this._text = newText;
			this._invalidateRender();
		}
	};

TextFieldLineElement.prototype.setParentSelection = 
	function (startIndex, endIndex)
	{
		var minIndex = Math.min(startIndex, endIndex);
		var maxIndex = Math.max(startIndex, endIndex);
		
		if (minIndex < this._charMetricsStartIndex)
			minIndex = this._charMetricsStartIndex;
		if (maxIndex > this._charMetricsEndIndex)
			maxIndex = this._charMetricsEndIndex;
		
		//Highlight is outside of bounds, nuke it.
		if (minIndex > maxIndex || minIndex == maxIndex)
		{
			minIndex = 0;
			maxIndex = 0;
		}
		
		if (this._highlightMinIndex == minIndex && this._highlightMaxIndex == maxIndex)
			return;
		
		this._highlightMinIndex = minIndex;
		this._highlightMaxIndex = maxIndex;
		
		this._invalidateRender();
	};

TextFieldLineElement.prototype.getLineWidth = 
	function ()
	{
		if (this._charMetricsStartIndex > -1 && this._charMetricsEndIndex > -1)
			return this._parentTextField._charMetrics[this._charMetricsEndIndex].x - this._parentTextField._charMetrics[this._charMetricsStartIndex].x;
		
		return 0;
	};	
	
//@Override
TextFieldLineElement.prototype._doRender =
	function()
	{
		TextFieldLineElement.base.prototype._doRender.call(this);
		
		if (this._text.length == 0)
			return;
		
		var paddingMetrics = this._getPaddingMetrics();
		var ctx = this._getGraphicsCtx();
		
		//Get styles
		var textFillType = this._parentTextField.getStyle("TextFillType");
		var textColor = this._parentTextField.getStyle("TextColor");
		var highlightTextColor = this._parentTextField.getStyle("TextHighlightedColor");
		var backgroundHighlightTextColor = this._parentTextField.getStyle("TextHighlightedBackgroundColor");
		var fontString = this._parentTextField._getFontString();
		
		var x = paddingMetrics.getX();
		var y = paddingMetrics.getY() + (paddingMetrics.getHeight() / 2); 
		
		if (this._highlightMinIndex == this._highlightMaxIndex)
		{
			if (textFillType == "stroke")
				CanvasElement._strokeText(ctx, this._text, x, y, fontString, textColor, "middle");
			else
				CanvasElement._fillText(ctx, this._text, x, y, fontString, textColor, "middle");
		}
		else
		{
			for (var i = 0; i < this._text.length; i++)
			{
				var charWidth = CanvasElement._measureText(this._text[i], fontString);
				
				if (this._highlightMinIndex <= i && this._highlightMaxIndex > i)
				{
					ctx.fillStyle = backgroundHighlightTextColor;
					
					ctx.beginPath();
					ctx.moveTo(x, 0);
					ctx.lineTo(x + charWidth, 0);
					ctx.lineTo(x + charWidth, this._height);
					ctx.lineTo(x, this._height);
					ctx.closePath();
					ctx.fill();
					
					if (textFillType == "stroke")
						CanvasElement._strokeText(ctx, this._text[i], x, y, fontString, highlightTextColor, "middle");
					else
						CanvasElement._fillText(ctx, this._text[i], x, y, fontString, highlightTextColor, "middle");
				}
				else
				{
					if (textFillType == "stroke")
						CanvasElement._strokeText(ctx, this._text[i], x, y, fontString, textColor, "middle");
					else
						CanvasElement._fillText(ctx, this._text[i], x, y, fontString, textColor, "middle");
				}
				
				x += charWidth;
			}
		}
	};	

/////////////////////////////////////////////////////////
/////////////////TextFieldElement////////////////////////

/**
 * @class TextFieldElement
 * @inherits CanvasElement
 * 
 * Internal class used for consistently rendering text used by controls like TextElement and TextInput.
 * You typically should not use this class directly it is designed to be wrapped by a higher level control. 
 * This class allows text to be selected and edited, it renders a text position caret and watches
 * focus/mouse/keyboard events, maintains position of individual characters and allows copy/cut/paste.
 * 
 * TextField also normalizes text width. The canvas natively will give
 * different widths for strings than when measuring and adding character widths 
 * which will not work for highlighting or editing. 
 * 
 * 
 * @constructor TextFieldElement 
 * Creates new TextFieldElement instance.
 */
function TextFieldElement()
{
	TextFieldElement.base.prototype.constructor.call(this);
	
	//Element used as the blinky text caret when focused.
	this._textCaret = null;
	
	this._textHighlightStartIndex = 0;
	this._caretIndex = 0;
	this._caretEnabled = false;
	this._caretBlinkTime = 0;
	this._caretBlinkVisible = false;
	
	this._text = "";
	
	this._charMetrics = null; 	// array of {x, w}
	this._spaceSpans = null; 	// array of {start, end, type} _charMetric positions of spaces for wrapping text.
	
	this._dragHighlightScrollCharacterTime = 0;
	this._dragHighlightScrollCharacterDuration = 0;
	this._dragHighlightScrollCharacterDirection = 0;
	
	//Container for storing / clipping lines of text.
	this._textLinesContainer = new CanvasElement();
	this._textLinesContainer.setStyle("ClipContent", true);
	this._addChild(this._textLinesContainer);
	
	var _self = this;
	
	//Private event handlers, need different instance for each TextField. Proxy to prototype.
	this._onTextFieldFocusEventInstance = 
		function (event)
		{
			if (event.getType() == "focusin")
				_self._onTextFieldFocusIn(event);
			else
				_self._onTextFieldFocusOut(event);
		};
	
	this._onTextFieldKeyDownInstance = 
		function (keyboardEvent)
		{
			_self._onTextFieldKeyDown(keyboardEvent);
		};
		
	this._onTextFieldMouseEventInstance =
		function (mouseEvent)
		{
			if (mouseEvent.getType() == "mousedown")
				_self._onTextFieldMouseDown(mouseEvent);
			else if (mouseEvent.getType() == "mouseup")
				_self._onTextFieldMouseUp(mouseEvent);
			else if (mouseEvent.getType() == "mousemoveex")
				_self._onTextFieldCanvasMouseMoveEx(mouseEvent); 
		};
	
	this._onTextFieldEnterFrameInstance =
		function (event)
		{
			_self._onTextFieldEnterFrame(event);
		};
	
	this._onTextFieldCopyPasteInstance = 
		function (event)
		{
			window.removeEventListener(event.type, _self._onTextFieldCopyPasteInstance);
		
			try
			{
				if (event.clipboardData)
				{
					if (event.type == "copy")
						_self._onTextFieldCopy(event.clipboardData);
					else if (event.type == "paste")
						_self._onTextFieldPaste(event.clipboardData);
					else // "cut"
						_self._onTextFieldCut(event.clipboardData);
				}
				
				if (event.preventDefault)
					event.preventDefault();
				
				return false;
			}
			catch (ex)
			{
				
			}
		};
}

//Inherit from CanvasElement
TextFieldElement.prototype = Object.create(CanvasElement.prototype);
TextFieldElement.prototype.constructor = TextFieldElement;
TextFieldElement.base = CanvasElement;	


/////////////Events///////////////////////////////////

/**
 * @event changed ElementEvent
 * Dispatched when the text is changed due to user interaction.
 */


/////////////Style Types///////////////////////////////

TextFieldElement._StyleTypes = Object.create(null);

/**
 * @style Selectable boolean
 * 
 * When true, the text can be highlighted and copied.
 */
TextFieldElement._StyleTypes.Selectable = 				StyleableBase.EStyleType.NORMAL;		// true || false

/**
 * @style MaxChars int
 * 
 * The maximum number of characters allowed for this TextField. When 0 unlimited characters are allowed.
 */
TextFieldElement._StyleTypes.MaxChars = 				StyleableBase.EStyleType.NORMAL;		// number

/**
 * @style Multiline boolean
 * 
 * When true, newline characters are respected and text will be rendered on multiple lines if necessary.
 */
TextFieldElement._StyleTypes.Multiline = 				StyleableBase.EStyleType.NORMAL;		// true || false

/**
 * @style WordWrap boolean
 * 
 * When true, text will wrap when width is constrained and will be rendered on multiple lines if necessary. 
 */
TextFieldElement._StyleTypes.WordWrap = 				StyleableBase.EStyleType.NORMAL;		// true || false


////////////Default Styles////////////////////////////

TextFieldElement.StyleDefault = new StyleDefinition();

TextFieldElement.StyleDefault.setStyle("Selectable", 					false);
TextFieldElement.StyleDefault.setStyle("MaxChars", 						0);
TextFieldElement.StyleDefault.setStyle("Multiline", 					false);
TextFieldElement.StyleDefault.setStyle("WordWrap", 						false);

TextFieldElement.StyleDefault.setStyle("Enabled", 						false);
TextFieldElement.StyleDefault.setStyle("TabStop",						0);
TextFieldElement.StyleDefault.setStyle("Cursor", 						"text");			

TextFieldElement.StyleDefault.setStyle("BorderType", 					"none");
TextFieldElement.StyleDefault.setStyle("PaddingTop", 					0);
TextFieldElement.StyleDefault.setStyle("PaddingBottom",					0);
TextFieldElement.StyleDefault.setStyle("PaddingLeft", 					3);
TextFieldElement.StyleDefault.setStyle("PaddingRight", 					2);
TextFieldElement.StyleDefault.setStyle("BackgroundColor",				null);


////////Public///////////////////////

/**
 * @function setText
 * Sets the text string to be rendered.
 * 
 * @param text String
 * Text string to be rendered
 */
TextFieldElement.prototype.setText = 
	function (text)
	{
		if (text == null)
			text = "";
	
		//Make sure we have an actual string
		if (typeof text !== "string")
		{
			try
			{
				text = text.toString();
			}
			catch (ex)
			{
				text = "";
			}
		}
		
		var maxChars = this.getStyle("MaxChars");
		
		if (maxChars > 0 && text.length > maxChars)
			text = text.substring(0, maxChars);
		
		if (text != this._text)
		{
			this._text = text;
			
			this._charMetrics = null;
			
			this.setSelection(0, 0);
			
			//Reset scroll position
			if (this._textLinesContainer._getNumChildren() > 0 && this.getStyle("Multiline") == false && this.getStyle("WordWrap") == false)
				this._textLinesContainer._getChildAt(0)._setActualPosition(0, 0);
			
			this._invalidateMeasure();
			this._invalidateLayout();
		}
	};

/**
 * @function getText
 * Gets the current text string.
 * 
 * @returns String
 * Current text string.
 */	
TextFieldElement.prototype.getText = 
	function ()
	{
		return this._text;
	};

/**
 * @function setSelection
 * Sets the text selection or text caret position. When startIndex and endIndex are the same
 * it places the text caret at that position, when different, it selects / highlights that range of characters.
 * 
 * @param startIndex int
 * Character index to begin the selection.
 * 
 * @param endIndex int
 * Character index to end the selection.
 */	
TextFieldElement.prototype.setSelection = 
	function (startIndex, endIndex)
	{
		if (startIndex < 0)
			startIndex = 0;
		if (startIndex > this._text.length)
			startIndex = this._text.length;
		
		if (endIndex < 0)
			endIndex = 0;
		if (endIndex > this._text.length)
			endIndex = this._text.length;
		
		if (startIndex == this._textHighlightStartIndex && endIndex == this._caretIndex)
			return;
		
		this._textHighlightStartIndex = startIndex;
		this._caretIndex = endIndex;
		
		if (this._caretEnabled == true && startIndex == endIndex)
		{
			this._caretBlinkVisible = true;
			this._caretBlinkTime = Date.now() + 800;
		}
		
		this._updateEnterFrameListener();
		this._updateCaretVisibility();
		
		this._invalidateLayout();
	};
	
/**
 * @function getSelection
 * Gets the current text selection or text caret position.
 * 
 * @returns Object
 * Object containing the start and end selection indexes. {startIndex, endIndex}
 */	
TextFieldElement.prototype.getSelection = 
	function ()
	{
		return {startIndex:this._textHighlightStartIndex, endIndex:this._caretIndex};
	};	
	
////////Internal/////////////////////	

/**
 * @function _createTextCaret
 * Generates a CanvasElement to be used as the text caret.
 * 
 * @returns CanvasElement
 * New CanvasElement instance to be used as the text caret.
 */
TextFieldElement.prototype._createTextCaret = 
	function ()
	{
		var textCaret = new CanvasElement();
		textCaret.setStyle("MouseEnabled", false);
		textCaret.setStyle("BackgroundColor", "TextCaretColor");
		textCaret.setStyle("AutoGradientStart", 0);
		textCaret.setStyle("AutoGradientStop", 0);
		
		return textCaret;
	};
	
//@private
TextFieldElement.prototype._updateCaretVisibility = 
	function ()
	{
		if (this._caretEnabled == true &&
			this._caretBlinkVisible == true && 
			this._caretIndex > -1 && this._caretIndex <= this._text.length && //Dont think this line is necessary
			this._caretIndex == this._textHighlightStartIndex)
		{
			if (this._textCaret == null)
			{
				this._textCaret = this._createTextCaret();
				this._addChild(this._textCaret);
			}
			
			this._textCaret.setStyle("Visible", true);
		}
		else if (this._textCaret != null)
			this._textCaret.setStyle("Visible", false);
	};
	
//@private - only active when caret is enabled or dragging highlight selection is scrolling.
TextFieldElement.prototype._onTextFieldEnterFrame = 
	function (event)
	{
		var currentTime = Date.now();
		
		if (currentTime > this._caretBlinkTime && 
			this._caretEnabled == true &&
			this._caretIndex > -1 && this._caretIndex <= this._text.length && //Dont think this line is necessary
			this._caretIndex == this._textHighlightStartIndex)
		{	
			if (this._caretBlinkVisible == true)
			{//Shutting off caret
				
				if (this._caretBlinkTime + 400 < currentTime)
					this._caretBlinkTime = currentTime + 400;
				else
					this._caretBlinkTime += 400; 
			}
			else
			{//Turning on caret
				
				if (this._caretBlinkTime + 800 < currentTime)
					this._caretBlinkTime = currentTime + 800;
				else
					this._caretBlinkTime += 800; 
			}
			
			this._caretBlinkVisible = !(this._caretBlinkVisible);
			this._updateCaretVisibility();
		}
		
		if (currentTime > this._dragHighlightScrollCharacterTime && 
			this._dragHighlightScrollCharacterDuration > 0)
		{
			this._dragHighlightScrollCharacterTime += this._dragHighlightScrollCharacterDuration;
			var caretIndexChanged = false;
				
			if (this._dragHighlightScrollCharacterDirection == "left" && this._caretIndex > 0)
			{
				this.setSelection(this._textHighlightStartIndex, this._caretIndex - 1);
				caretIndexChanged = true;
			}
			else if (this._dragHighlightScrollCharacterDirection == "right" && this._caretIndex < this._text.length)
			{
				this.setSelection(this._textHighlightStartIndex, this._caretIndex + 1);
				caretIndexChanged = true;
			}
			
			if (caretIndexChanged == true)
			{
				var w = this._textLinesContainer._width;
				var textFieldLine1 = this._textLinesContainer._getChildAt(0);
				
				//Adjust text scroll position if cursor is out of bounds.
				var scrollDistance = 3;
				var caretPosition = this._charMetrics[this._caretIndex].x + textFieldLine1._x;
						
				//Adjust scroll position.
				if (caretPosition < 1)
				{
					textFieldLine1._setActualPosition(
							Math.min(0, (this._charMetrics[this._caretIndex].x * -1) + scrollDistance), 
							textFieldLine1._y);
				}
				else if (caretPosition > w - 1)
				{
					textFieldLine1._setActualPosition(
							Math.max(w - textFieldLine1._width, (this._charMetrics[this._caretIndex].x * -1) + w - scrollDistance), 
							textFieldLine1._y);
				}
			}
		}
	};
	
//@private	
TextFieldElement.prototype._enableCaret = 
	function ()
	{
		if (this._caretEnabled == true)
			return;
	
		this._caretEnabled = true;
		
		this._updateEnterFrameListener();
		this._updateCaretVisibility();
	};
	
//@private	
TextFieldElement.prototype._disableCaret = 
	function ()
	{
		if (this._caretEnabled == false)
			return;
	
		this._caretEnabled = false;
		
		this._updateEnterFrameListener();
		this._updateCaretVisibility();
	};

//@private - Only active if TextField is Enabled or Selectable.
TextFieldElement.prototype._onTextFieldFocusIn = 
	function (elementEvent)
	{
		//Tab focus (mouse would have already set caret)
		if (this._caretEnabled == true || this.getStyle("Enabled") == false)
			return;
	
		this._enableCaret();
		this.setSelection(0, this._text.length);
	};
	
//@private - Only active if TextField is Enabled or Selectable.	
TextFieldElement.prototype._onTextFieldFocusOut = 
	function (event)
	{
		this._disableCaret();
		this.setSelection(0, 0);
	};

/**
 * @function _getCaretIndexFromMouse
 * Gets the position to place the text caret based on the position of the mouse.
 * 
 * @param mouseX Number
 * Current X position of the mouse.
 * 
 * @param mouseY Number
 * Current Y position of the mouse.
 * 
 * @returns int
 * Corresponding caret character index.
 */	
TextFieldElement.prototype._getCaretIndexFromMouse = 
	function (mouseX, mouseY)
	{
		if (this._charMetrics == null || this._charMetrics.length == 0)
			return 0;
	
		var x = this._textLinesContainer._x;
		var w = this._textLinesContainer._width;
		mouseX += 2; //Text cursor is slightly offset. TODO: make this a style
		
		var textFieldLine1 = this._textLinesContainer._getChildAt(0);
		
		var charX = 0;
		var charW = 0;
		
		var newCaretIndex = 0;
		for (var i = 0; i <= this._text.length; i++)
		{
			charX = this._charMetrics[i].x + x + textFieldLine1._x;
			charW = this._charMetrics[i].width;
			
			if (charX < x)
				continue;
			
			if (charX > x + w)
				break;
			
			newCaretIndex = i;
			
			if (mouseX <= charX + (charW / 2))
				break;
		}
		
		return newCaretIndex;
	};

	
//@private - Only active if TextField is Enabled or Selectable.		
TextFieldElement.prototype._onTextFieldMouseDown = 
	function (mouseEvent)
	{
		if (this.hasEventListener("mousemoveex", this._onTextFieldMouseEventInstance) == false)
			this.addEventListener("mousemoveex", this._onTextFieldMouseEventInstance);

		var caretIndex = this._getCaretIndexFromMouse(mouseEvent.getX(), mouseEvent.getY());
		
		if (this.getStyle("Enabled") == true)
			this._enableCaret();
		
		this.setSelection(caretIndex, caretIndex);
	};
	
//@private - Only active if TextField is Enabled or Selectable.		
TextFieldElement.prototype._onTextFieldMouseUp = 
	function (mouseEvent)
	{
		if (this.hasEventListener("mousemoveex", this._onTextFieldMouseEventInstance) == true)
			this.removeEventListener("mousemoveex", this._onTextFieldMouseEventInstance);
		
		this._dragHighlightScrollCharacterDuration = 0;
		this._updateEnterFrameListener();
	};	
	
//@private - Only active if selectable or enabled and mouse is down.	
TextFieldElement.prototype._onTextFieldCanvasMouseMoveEx = 
	function (mouseEvent)
	{
		var mousePoint = {x:mouseEvent.getX(), y:mouseEvent.getY()};
		this.translatePointFrom(mousePoint, this._manager);
		
		var x = this._textLinesContainer._x;
		var w = this._textLinesContainer._width;
		
		var scrollDuration = 0;
		
		var caretIndex = this._getCaretIndexFromMouse(mousePoint.x, mousePoint.y);
		if (caretIndex == this._caretIndex)
		{
			if (mousePoint.x <= x + 2 && this._caretIndex > 0)
			{
				var range = Math.abs(x + 2 - mousePoint.x) * 3;
				scrollDuration = Math.max(20, 120 - range);
				
				if (this._dragHighlightScrollCharacterDuration == 0)
					this._dragHighlightScrollCharacterTime = Date.now() + scrollDuration;
				
				this._dragHighlightScrollCharacterDirection = "left";
			}
			else if (mousePoint.x >= x + w - 2 && this._caretIndex < this._text.length)
			{
				var range = Math.abs(x + w - 2 - mousePoint.x) * 3;
				scrollDuration = Math.max(20, 120 - range);
				
				if (this._dragHighlightScrollCharacterDuration == 0)
					this._dragHighlightScrollCharacterTime = Date.now() + scrollDuration;
				
				this._dragHighlightScrollCharacterDirection = "right";
			}
		}
		else
			this.setSelection(this._textHighlightStartIndex, caretIndex);
		
		this._dragHighlightScrollCharacterDuration = scrollDuration;
		this._updateEnterFrameListener();
	};
	
//@private	
TextFieldElement.prototype._updateCharXPositions = 
	function (startAfterIndex)
	{
		if (this._charMetrics == null || this._charMetrics.length == 0)
			return;
		
		if (startAfterIndex > this._charMetrics.length - 2)
			return;
		
		if (startAfterIndex < 0)
		{
			startAfterIndex = 0;
			this._charMetrics[0].x = 0;
		}
			
		var currentPos = this._charMetrics[startAfterIndex].x + this._charMetrics[startAfterIndex].width;
		for (var i = startAfterIndex + 1; i < this._charMetrics.length; i++)
		{
			this._charMetrics[i].x = currentPos;
			currentPos += this._charMetrics[i].width;
		}
	};

//@private	
TextFieldElement.prototype._deleteHighlightChars = 
	function ()
	{
		if (this._textHighlightStartIndex == this._caretIndex)
			return;
	
		var highlightBegin = Math.min(this._caretIndex, this._textHighlightStartIndex);
		var highlightEnd = Math.max(this._caretIndex, this._textHighlightStartIndex);
	
		//Fix char metrics
		this._charMetrics.splice(highlightBegin, highlightEnd - highlightBegin);
		this._updateCharXPositions(highlightBegin - 1);
		
		//Update string
		var strLeft = this._text.substring(0, highlightBegin);
		var strRight = this._text.substring(highlightEnd);
		this._text = strLeft + strRight;
		
		//Move caret
		this.setSelection(highlightBegin, highlightBegin);
	};	
	
/**
 * @function _onTextFieldKeyDown
 * Event handler for "keydown" event. Only active when TextField is enabled and focused.
 * Handles editing and cursor navigation / selection.
 * 
 * @param keyboardEvent ElementKeyboardEvent
 * ElementKeyboardEvent to process.
 */	
TextFieldElement.prototype._onTextFieldKeyDown = 
	function (keyboardEvent)
	{
		if (keyboardEvent.getDefaultPrevented() == true)
			return;
	
		var enabled = this.getStyle("Enabled");
		var keyString = keyboardEvent.getKey();
		var dispatchChanged = false;
		
		if (keyString == "c" && keyboardEvent.getCtrl() == true)
		{
			if (this._textHighlightStartIndex == this._caretIndex)
			{
				keyboardEvent.preventDefault();
				return;
			}
			
			//IE
			if (window.clipboardData)
			{
				this._onTextFieldCopy(window.clipboardData);
				keyboardEvent.preventDefault();
			} 
			else //FF, Chrome, Webkit (Allow keyboard event to invoke the copy / paste listener)
			{
				window.addEventListener("copy", this._onTextFieldCopyPasteInstance);
				this._invalidateLayout(); //Purges the listener if something upstream cancels the keyboard event.
			}
			
			return;
		}
		else if (keyString == "ArrowLeft")
		{
			if (keyboardEvent.getShift() == true && 
				(this._textHighlightStartIndex != this._caretIndex || enabled == true))
			{
				this.setSelection(this._textHighlightStartIndex, this._caretIndex - 1);
			}
			else if (enabled == true)
			{
				if (this._textHighlightStartIndex != this._caretIndex)
					this.setSelection(Math.min(this._caretIndex, this._textHighlightStartIndex), Math.min(this._caretIndex, this._textHighlightStartIndex));
				else
					this.setSelection(this._caretIndex - 1, this._caretIndex - 1);
			}
		}
		else if (keyString == "ArrowRight")
		{
			if (keyboardEvent.getShift() == true && 
				(this._textHighlightStartIndex != this._caretIndex || enabled == true))
			{
				this.setSelection(this._textHighlightStartIndex, this._caretIndex + 1);
			}
			else if (enabled == true)
			{
				if (this._textHighlightStartIndex != this._caretIndex)
					this.setSelection(Math.max(this._caretIndex, this._textHighlightStartIndex), Math.max(this._caretIndex, this._textHighlightStartIndex));
				else
					this.setSelection(this._caretIndex + 1, this._caretIndex + 1);
			}
		}
		else if (keyString == "End")
		{
			if (keyboardEvent.getShift() == true && 
				(this._textHighlightStartIndex != this._caretIndex || enabled == true))
			{
				this.setSelection(this._textHighlightStartIndex, this._text.length);
			}
			else if (enabled == true)
				this.setSelection(this._text.length, this._text.length);
		}
		else if (keyString == "Home")
		{
			if (keyboardEvent.getShift() == true && 
				(this._textHighlightStartIndex != this._caretIndex || enabled == true))
			{
				this.setSelection(this._textHighlightStartIndex, 0);
			}
			else if (enabled == true)
				this.setSelection(0, 0);
		}
		else if (enabled == false) 
		{
			return;
		}
		else if (keyString == "Backspace")
		{
			if (this._textHighlightStartIndex != this._caretIndex)
				this._deleteHighlightChars();
			else
			{
				if (this._text.length == 0 || this._caretIndex == 0)
				{
					keyboardEvent.preventDefault();
					return;
				}
				
				//Fix char metrics
				this._charMetrics.splice(this._caretIndex - 1, 1);
				this._updateCharXPositions(this._caretIndex - 2);
				
				//Update string
				var strLeft = this._text.substring(0, this._caretIndex - 1);
				var strRight = this._text.substring(this._caretIndex);
				this._text = strLeft + strRight;
				
				//Move caret
				this.setSelection(this._caretIndex - 1, this._caretIndex - 1);
			}
			
			dispatchChanged = true;
		}
		else if (keyString == "Delete")
		{
			if (this._textHighlightStartIndex != this._caretIndex)
				this._deleteHighlightChars();
			else
			{
				if (this._text.length == 0 || this._caretIndex == this._text.length)
				{
					keyboardEvent.preventDefault();
					return;
				}
	
				//Fix char metrics
				this._charMetrics.splice(this._caretIndex, 1);
				this._updateCharXPositions(this._caretIndex - 1);
				
				//Update string
				var strLeft = this._text.substring(0, this._caretIndex);
				var strRight = this._text.substring(this._caretIndex + 1);
				this._text = strLeft + strRight;
			}
			
			dispatchChanged = true;
		}
		else if (keyString == "v" && keyboardEvent.getCtrl() == true)
		{
			//IE
			if (window.clipboardData)
			{
				this._onTextFieldPaste(window.clipboardData);
				keyboardEvent.preventDefault();
			} 
			else //FF, Chrome, Webkit (Allow keyboard event to invoke the copy / paste listener)
			{
				window.addEventListener("paste", this._onTextFieldCopyPasteInstance);
				this._invalidateLayout(); //Purges the listener if something upstream cancels the keyboard event.
			}
			
			return;
		}
		else if (keyString == "x" && keyboardEvent.getCtrl() == true)
		{
			if (this._textHighlightStartIndex == this._caretIndex)
			{
				keyboardEvent.preventDefault();
				return;
			}
			
			//IE
			if (window.clipboardData)
			{
				this._onTextFieldCut(window.clipboardData);
				keyboardEvent.preventDefault();
			} 
			else //FF, Chrome, Webkit (Allow keyboard event to invoke the copy / paste listener)
			{
				window.addEventListener("cut", this._onTextFieldCopyPasteInstance);
				this._invalidateLayout(); //Purges the listener if something upstream cancels the keyboard event.
			}
			
			return;
		}
		else if (keyString.length == 1)
		{
			this._deleteHighlightChars();
			
			var maxChars = this.getStyle("MaxChars");
			
			if (maxChars > 0 && maxChars <= this._text.length)
			{
				keyboardEvent.preventDefault();
				return;
			}
			
			//Measure new char
			var newCharMetrics = {x:0, width:CanvasElement._measureText(keyString, this._getFontString())};
			
			//Fix char metrics
			this._charMetrics.splice(this._caretIndex, 0, newCharMetrics);
			this._updateCharXPositions(this._caretIndex - 1);
			
			//Update string
			var strLeft = this._text.substring(0, this._caretIndex);
			var strRight = this._text.substring(this._caretIndex);
			this._text = strLeft + keyString + strRight;
			
			//Move caret
			this.setSelection(this._caretIndex + 1, this._caretIndex + 1);
			
			dispatchChanged = true;
		}
		else
			return;
		
		this._scrollIfCaretOutOfBounds();
		this._invalidateLayout();
		
		if (dispatchChanged == true)
			this._dispatchEvent(new ElementEvent("changed", false));
		
		keyboardEvent.preventDefault();
	};

//@private	
TextFieldElement.prototype._scrollIfCaretOutOfBounds = 
	function ()
	{
		var textFieldLine1 = this._textLinesContainer._getChildAt(0);
		var w = this._textLinesContainer._width;
		var scrollDistance = Math.min(Math.floor(w * 0.3), 35);
		
		//Adjust text scroll position if cursor is out of bounds.
		var caretPosition = this._charMetrics[this._caretIndex].x + textFieldLine1._x;
				
		//Adjust scroll position (we dont know the width of the text line yet...) layout will fix if we overshoot
		if (caretPosition < 2)
		{
			textFieldLine1._setActualPosition(
				(this._charMetrics[this._caretIndex].x * -1) + scrollDistance,
				textFieldLine1._y);
		}
		else if (caretPosition > w - 2)
		{
			textFieldLine1._setActualPosition(
				(this._charMetrics[this._caretIndex].x * -1) + w - scrollDistance, 
				textFieldLine1._y);
		}
	};
	
/**
 * @function _onTextFieldCopy
 * Event handler for native browser "copy" event. Copies selected text to clipboard.
 * 
 * @param clipboardData BrowserClipboard
 * The browser clipboard object to copy text too.
 */	
TextFieldElement.prototype._onTextFieldCopy = 
	function (clipboardData)
	{
		var highlightBegin = Math.min(this._caretIndex, this._textHighlightStartIndex);
		var highlightEnd = Math.max(this._caretIndex, this._textHighlightStartIndex);
		
		var copyText = this._text.substring(highlightBegin, highlightEnd);
		
		clipboardData.setData("Text", copyText);
	};
	
/**
 * @function _onTextFieldCopy
 * Event handler for native browser "paste" event. Pastes clipboard text into TextField.
 * 
 * @param clipboardData BrowserClipboard
 * The browser clipboard object to copy text from.
 */		
TextFieldElement.prototype._onTextFieldPaste = 
	function (clipboardData)
	{
		var pasteString = clipboardData.getData("Text");
		
		if (pasteString == null || pasteString.length == 0)
			return;
		
		var maxChars = this.getStyle("MaxChars");
		if (maxChars > 0 && this._text.length >= maxChars && this._caretIndex >= maxChars)
			return;
		
		this._deleteHighlightChars();
		
		//Measure new chars
		var fontString = this._getFontString();
		for (var i = 0; i < pasteString.length; i++)
		{
			this._charMetrics.splice(this._caretIndex + i, 0, 
					{x:0, width:CanvasElement._measureText(pasteString[i], fontString)});
		}

		//Fix char metrics
		this._updateCharXPositions(this._caretIndex - 1);
		
		//Update string
		var strLeft = this._text.substring(0, this._caretIndex);
		var strRight = this._text.substring(this._caretIndex);
		this._text = strLeft + pasteString + strRight;
		
		//Move caret
		this.setSelection(this._caretIndex + pasteString.length, this._caretIndex + pasteString.length);
		
		//Truncate if exceeding max characters
		if (maxChars > 0 && this._text.length > maxChars)
		{
			this._text = this._text.subString(0, maxChars);
			this._charMetrics.splice(0, this._text.length - maxChars);
			this.setSelection(this._text.length, this._text.length);
		}
		
		this._scrollIfCaretOutOfBounds();
		this._invalidateLayout();
		
		this._dispatchEvent(new ElementEvent("changed", false));
	};

/**
 * @function _onTextFieldCut
 * Event handler for native browser "cut" event. Copies selected text to clipboard and deletes from TextField.
 * 
 * @param clipboardData BrowserClipboard
 * The browser clipboard object to copy text too.
 */		
TextFieldElement.prototype._onTextFieldCut = 
	function (clipboardData)
	{
		var highlightBegin = Math.min(this._caretIndex, this._textHighlightStartIndex);
		var highlightEnd = Math.max(this._caretIndex, this._textHighlightStartIndex);
		
		var copyText = this._text.substring(highlightBegin, highlightEnd);
		
		clipboardData.setData("Text", copyText);
		
		this._deleteHighlightChars();
		
		this._scrollIfCaretOutOfBounds();
		this._invalidateLayout();
		
		this._dispatchEvent(new ElementEvent("changed", false));
	};
	
//@Override	
TextFieldElement.prototype._onCanvasElementRemoved = 
	function (addedRemovedEvent)
	{
		TextFieldElement.base.prototype._onCanvasElementRemoved.call(this, addedRemovedEvent);
		
		this._disableCaret();
		
		if (this.hasEventListener("mousemoveex", this._onTextFieldMouseEventInstance) == true)
			this.removeEventListener("mousemoveex", this._onTextFieldMouseEventInstance);
		
		if (this.hasEventListener("enterframe", this._onTextFieldEnterFrameInstance) == true)
			this.removeEventListener("enterframe", this._onTextFieldEnterFrameInstance);
	};		
	
//@private	
TextFieldElement.prototype._updateEnterFrameListener = 
	function ()
	{
		if (this._dragHighlightScrollCharacterDuration > 0 ||
			(this._caretEnabled == true && this._textHighlightStartIndex == this._caretIndex))
		{
			if (this.hasEventListener("enterframe", this._onTextFieldEnterFrameInstance) == false)
				this.addEventListener("enterframe", this._onTextFieldEnterFrameInstance);
		}
		else
		{
			if (this.hasEventListener("enterframe", this._onTextFieldEnterFrameInstance) == true)
				this.removeEventListener("enterframe", this._onTextFieldEnterFrameInstance);
		}
	};
	
/**
 * @function _updateEventListeners
 * Adds removes mouse, keyboard, and focus event listeners based on Enabled and Selectable styles.
 * Called in response to style changes.
 */	
TextFieldElement.prototype._updateEventListeners = 
	function ()
	{
		var enabled = this.getStyle("Enabled");
		var selectable = this.getStyle("Selectable");
		
		if (selectable == true || enabled == true)
		{
			if (this.hasEventListener("keydown", this._onTextFieldKeyDownInstance) == false)
				this.addEventListener("keydown", this._onTextFieldKeyDownInstance);
			
			if (this.hasEventListener("mousedown", this._onTextFieldMouseEventInstance) == false)
				this.addEventListener("mousedown", this._onTextFieldMouseEventInstance);
			
			if (this.hasEventListener("mouseup", this._onTextFieldMouseEventInstance) == false)
				this.addEventListener("mouseup", this._onTextFieldMouseEventInstance);
			
			if (this.hasEventListener("focusin", this._onTextFieldFocusEventInstance) == false)
				this.addEventListener("focusin", this._onTextFieldFocusEventInstance);
			
			if (this.hasEventListener("focusout", this._onTextFieldFocusEventInstance) == false)
				this.addEventListener("focusout", this._onTextFieldFocusEventInstance);
		}
		else
		{
			if (this.hasEventListener("keydown", this._onTextFieldKeyDownInstance) == true)
				this.removeEventListener("keydown", this._onTextFieldKeyDownInstance);
			
			if (this.hasEventListener("mousedown", this._onTextFieldMouseEventInstance) == true)
				this.removeEventListener("mousedown", this._onTextFieldMouseEventInstance);
			
			if (this.hasEventListener("mouseup", this._onTextFieldMouseEventInstance) == true)
				this.removeEventListener("mouseup", this._onTextFieldMouseEventInstance);
			
			if (this.hasEventListener("focusin", this._onTextFieldFocusEventInstance) == true)
				this.removeEventListener("focusin", this._onTextFieldFocusEventInstance);
			
			if (this.hasEventListener("focusout", this._onTextFieldFocusEventInstance) == true)
				this.removeEventListener("focusout", this._onTextFieldFocusEventInstance);
		}
		
		if (enabled == false)
			this._disableCaret();
	};

	
//@Override
TextFieldElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		TextFieldElement.base.prototype._doStylesUpdated.call(this, stylesMap);
	
		////Update line renderers////
		if ("TextStyle" in stylesMap ||
			"TextFont" in stylesMap ||
			"TextSize" in stylesMap ||
			"TextColor" in stylesMap ||
			"TextFillType" in stylesMap)
		{
			for (var i = 0; i < this._textLinesContainer._getNumChildren(); i++)
				this._textLinesContainer._getChildAt(i)._invalidateRender();
		}
		else if ("TextHighlightedColor" in stylesMap ||
				"TextHighlightedBackgroundColor" in stylesMap)
		{
			for (var i = 0; i < this._textLinesContainer._getNumChildren(); i++)
			{
				//Only re-render if in fact we have a highlighted selection.
				if (this._textLinesContainer._getChildAt(i)._highlightMinIndex != this._textLinesContainer._getChildAt(i)._highlightMaxIndex)
					this._textLinesContainer._getChildAt(i)._invalidateRender();
			}
		}
		
		//Update ourself
		if ("TextStyle" in stylesMap ||
			"TextFont" in stylesMap ||
			"TextSize" in stylesMap)
		{
			this._charMetrics = null;
			
			this._invalidateMeasure();
			this._invalidateLayout();
		}
		else if ("Multiline" in stylesMap ||
			"WordWrap" in stylesMap ||
			"TextLinePaddingTop" in stylesMap ||
			"TextLinePaddingBottom" in stylesMap)
		{
			this._invalidateMeasure();
			this._invalidateLayout();
		}
		else if ("TextHorizontalAlign" in stylesMap ||
			"TextVerticalAlign" in stylesMap || 
			"TextLineSpacing" in stylesMap)
		{
			this._invalidateLayout();
		}
		
		if ("MaxChars" in stylesMap)
			this.setText(this._text); //Will trim if needed.
		
		if ("TextCaretColor" in stylesMap && this._textCaret != null)
			this._textCaret.setStyle("BackgroundColor", this.getStyle("TextCaretColor"));
		
		if ("Enabled" in stylesMap || "Selectable" in stylesMap)
			this._updateEventListeners();
		
		this._updateEnterFrameListener();
		this._updateCaretVisibility();
	};	
	
///**
// * @function _getCharMetrics
// * Gets a DrawMetrics object containing position and size data of character at supplied index.
// * 
// * @param charIndex int
// * Index of character to return metrics.
// * 
// * @returns DrawMetrics
// * DrawMetrics object containing position and size data of character at supplied index.
// */	
//TextFieldElement.prototype._getCharMetrics = 
//	function (charIndex)
//	{
//		if (this._charMetrics == null || 
//			charIndex < 0 ||
//			charIndex >= this._text.length)
//		{
//			return null;
//		}
//		
//		var metrics = new DrawMetrics();
//		metrics._height = this._textHeight;
//		metrics._width = this._charMetrics[charIndex].width;
//		metrics._x = this._charMetrics[charIndex].x + this._textXScrollPosition;
//		metrics._y = this._textYPosition;
//		
//		return metrics;
//	};
	
//@private	
TextFieldElement.prototype._createCharMetrics = 
	function ()
	{
		if (this._charMetrics != null)
			return;
	
		var currentX = 0;
		var currentWidth = 0;
		
		this._charMetrics = [];
		this._spaceSpans = [];
		
		var currentSpaceSpan = null;
		
		if (this._text.length > 0)
		{
			var fontString = this._getFontString();	
			
			for (var i = 0; i < this._text.length; i++)
			{
				currentWidth = CanvasElement._measureText(this._text[i], fontString);
				
				this._charMetrics.push(
					{
						x:		currentX,
						width: 	currentWidth
					});
				
				if (this._text[i] == " ")
				{
					if (currentSpaceSpan == null)
						currentSpaceSpan = {start:i, end:i, type:"space"};
					else
						currentSpaceSpan.end = i;
				}
				else if (currentSpaceSpan != null)
				{
					this._spaceSpans.push(currentSpaceSpan);
					currentSpaceSpan = null;
				}
				
				if (this._text[i] == '\n')
					this._spaceSpans.push({start:i, end:i, type:"nline"});
				
				currentX += currentWidth;
			}
		}
		
		if (currentSpaceSpan != null)
			this._spaceSpans.push(currentSpaceSpan);
		
		//Dummy for caret at end of string
		this._charMetrics.push( { x:currentX, width:0 }); 
		this._invalidateLayout();
	};
	
//@Override
TextFieldElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		this._createCharMetrics();
	
		var linePadTop = this.getStyle("TextLinePaddingTop");
		var linePadBottom = this.getStyle("TextLinePaddingBottom");
		var textSize = this.getStyle("TextSize");

		var textWidth = this._charMetrics[this._text.length].x;
		var textHeight = textSize + linePadTop + linePadBottom;		
		
		//If using word wrap, height is dependent on actual width so layout
		//must run and do the actual measurment...
		if (this.getStyle("WordWrap") == true)
		{	
			//We need the parent to know it can contract us.
			textWidth = this.getStyle("MinWidth") - padWidth; //padWidth added back at end
			
			this._invalidateLayout();
		}
		else if (this.getStyle("Multiline") == true)
		{
			var widestLineSize = -1;
			var lineStartIndex = 0;
			var numLines = 1;
			for (var i = 0; i < this._spaceSpans.length; i++)
			{
				//Only care about newline characters
				if (this._spaceSpans[i].type != "nline")
					continue;
				
				if (this._charMetrics[this._spaceSpans[i].start].x - this._charMetrics[lineStartIndex].x > widestLineSize)
					widestLineSize = this._charMetrics[this._spaceSpans[i].start].x - this._charMetrics[lineStartIndex].x;
				
				lineStartIndex = this._spaceSpans[i].start + 1;
				numLines++;
			}
			
			if (numLines > 1)
			{
				//Measure last line
				if (lineStartIndex < this._charMetrics.length - 1)
				{
					if (this._charMetrics[lineStartIndex].x - this._charMetrics[this._charMetrics.length - 1].x > widestLineSize)
						widestLineSize = this._charMetrics[lineStartIndex].x - this._charMetrics[this._charMetrics.length - 1].x;
				}
					
				textWidth = widestLineSize;
					
				textHeight = textHeight * numLines;
				textHeight = textHeight + (this.getStyle("TextLineSpacing") * (numLines - 1));
			}
		}
		
		//Always add 1 for text caret 
		//TODO: This should be the text caret's width only when editable
		var measuredSize = {width:0, height:0};
		measuredSize.width = 1 + textWidth + padWidth;
		measuredSize.height = textHeight + padHeight;
		
		return measuredSize;
	};	
	
//@Override	
TextFieldElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		TextFieldElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		var x = paddingMetrics.getX();
		var y = paddingMetrics.getY();
		var w = paddingMetrics.getWidth();
		var h = paddingMetrics.getHeight();
		
		//Adjust text x position per scroll / align.
		var availableWidth = w - 1; // account for caret width - TODO: width should be width of caret element, always 1 for now.
		
		//Size / Position the line container.
		this._textLinesContainer._setActualPosition(x, y);
		this._textLinesContainer._setActualSize(availableWidth, h);
		
		var isMultiline = this.getStyle("Multiline");
		var isWordWrap = this.getStyle("WordWrap");
		var textAlign = this.getStyle("TextHorizontalAlign");
		var textBaseline = this.getStyle("TextVerticalAlign");
		var textSize = this.getStyle("TextSize");
		var lineSpacing = this.getStyle("TextLineSpacing");
		var linePaddingTop = this.getStyle("TextLinePaddingTop");
		var linePaddingBottom = this.getStyle("TextLinePaddingBottom");
		var lineHeight = textSize + linePaddingTop + linePaddingBottom;
		
		var spaceSpanIndex = 0;
		var lineStartCharIndex = 0;
		var lineEndCharIndex = 0;
		
		var newLineData = null;
		var lines = [];
		
		var caretLineIndex = 0;
		var newlineFound = false;
		
		while (lineStartCharIndex < this._charMetrics.length)
		{
			newLineData = {charMetricsStartIndex:-1, charMetricsEndIndex:-1};
			
			if (isMultiline == false && isWordWrap == false)
			{
				newLineData.charMetricsStartIndex = 0; 
				newLineData.charMetricsEndIndex = this._charMetrics.length - 1;
				caretLineIndex = 0;
				lineStartCharIndex = this._charMetrics.length;
			}
			else
			{
				newLineData.charMetricsStartIndex = lineStartCharIndex;
				newlineFound = false;
				
				for (var i = spaceSpanIndex; i < this._spaceSpans.length; i++)
				{
					//Ignore spaces if wordwrap is off
					if (this._spaceSpans.type == "space" && isWordWrap == false)
						continue;
					
					if (textAlign == "left")
						lineEndCharIndex = this._spaceSpans[i].end;
					else
						lineEndCharIndex = this._spaceSpans[i].start;
					
					if (this._charMetrics[lineEndCharIndex].x - this._charMetrics[newLineData.charMetricsStartIndex].x <= availableWidth ||
						newLineData.charMetricsEndIndex == -1)
					{
						newLineData.charMetricsEndIndex = lineEndCharIndex;
						
						spaceSpanIndex++;
						lineStartCharIndex = lineEndCharIndex + 1;
						
						//Handle newline as space if multiline is off
						if (this._spaceSpans[i].type == "nline" && isMultiline == true)
						{
							newlineFound = true;
							break;
						}
					}
					else
						break;
				}
				
				//Last line, no more spaces for breaks.
				if (newLineData.charMetricsEndIndex == -1 || 
					(this._charMetrics[this._charMetrics.length - 1].x - this._charMetrics[newLineData.charMetricsStartIndex].x <= availableWidth && newlineFound == false))
				{
					newLineData.charMetricsEndIndex = this._charMetrics.length - 1;
					lineStartCharIndex = this._charMetrics.length;
				}
			}
			
			lines.push(newLineData);
		}
		
		var totalTextHeight = (lines.length * lineHeight) + ((lines.length - 1) * lineSpacing); 
		
		//Update the measured size now that we know the height. (May cause another layout pass)
		if (isWordWrap == true)
			this._setMeasuredSize(this._measuredWidth, totalTextHeight + this._getPaddingSize().height);
			
		var textYPosition;
		if (textBaseline == "top")
			textYPosition = 0;
		else if (textBaseline == "bottom")
			textYPosition = h - totalTextHeight;
		else //middle
			textYPosition = Math.round((h / 2) - (totalTextHeight / 2));
		 
		//Update actual line data
		
		//Purge excess
		while (this._textLinesContainer._getNumChildren() > lines.length)
			this._textLinesContainer._removeChildAt(this._textLinesContainer._getNumChildren() - 1);
		
		//Update Add
		var textFieldLine = null;
		var lineWidth = 0;
		var lineXPosition;
		for (var i = 0; i < lines.length; i++)
		{
			if (i < this._textLinesContainer._getNumChildren()) //Update line
				textFieldLine = this._textLinesContainer._getChildAt(i);
			else //Line added
			{
				textFieldLine = new TextFieldLineElement();
				this._textLinesContainer._addChild(textFieldLine);
			}
			
			//Update line
			textFieldLine.setParentLineMetrics(this, lines[i].charMetricsStartIndex, lines[i].charMetricsEndIndex);
			textFieldLine.setParentSelection(this._textHighlightStartIndex, this._caretIndex);
			
			textFieldLine.setStyle("PaddingTop", linePaddingTop);
			textFieldLine.setStyle("PaddingBottom", linePaddingBottom);
			
			lineWidth = textFieldLine.getLineWidth();
			textFieldLine._setActualSize(lineWidth, lineHeight);
			
			if (lineWidth < availableWidth || isMultiline == true) //align
			{
				if (textAlign == "right")
					lineXPosition = availableWidth - lineWidth;
				else if (textAlign == "center")
					lineXPosition = Math.round((availableWidth / 2) - (lineWidth / 2));
				else // "left"
					lineXPosition = 0;
			}
			else //fill excess (over-scroll or resize)
			{
				if (textFieldLine._x > 0)
					lineXPosition = 0;					
				else if (textFieldLine._x + lineWidth < availableWidth)
					lineXPosition = availableWidth - lineWidth;
				else
					lineXPosition = textFieldLine._x;
			}
			
			textFieldLine._setActualPosition(lineXPosition, textYPosition);
			
			textYPosition += (lineHeight + lineSpacing);
		}
		
		
		if (this._textCaret != null)
		{
			if (this._caretIndex < 0 || this._caretIndex > this._text.length)
				this._textCaret._setActualSize(0, lineHeight);
			else
			{
				//Find the line the caret is on.
				textFieldLine = this._textLinesContainer._getChildAt(caretLineIndex);

				var caretXPosition = this._charMetrics[this._caretIndex].x + textFieldLine._x + x;
				
				if (caretXPosition >= x && caretXPosition <= x + w - 1) //account for caret width
				{		
					this._textCaret._setActualPosition(caretXPosition, textFieldLine._y + y);
					this._textCaret._setActualSize(1, lineHeight);
				}
				else
					this._textCaret._setActualSize(0, lineHeight);
			}
		}
		
		//If we added a global listener, but a parent canceled the keyboard event, we need to purge these.
		window.removeEventListener("copy", this._onTextFieldCopyPasteInstance);
		window.removeEventListener("paste", this._onTextFieldCopyPasteInstance);
		window.removeEventListener("cut", this._onTextFieldCopyPasteInstance);
	};		
	
	


/**
 * @depends CanvasElement.js
 */

/////////////////////////////////////////////////////////
/////////////////TextElement/////////////////////////////	
	
/**
 * @class TextElement
 * @inherits CanvasElement
 * 
 * Renders mutli-line style-able select-able text. 
 * TextElement respects newline characters and will
 * wrap text when width is constrained. If only a single
 * line of text is needed, LabelElement is more efficient.
 * 
 * @constructor TextElement 
 * Creates new TextElement instance.
 */
function TextElement()
{
	TextElement.base.prototype.constructor.call(this);
	
	this._textField = new TextFieldElement();
	this._textField.setStyle("Cursor", null);
	this._textField.setStyle("TabStop", -1);
	this._addChild(this._textField);
}

//Inherit from CanvasElement
TextElement.prototype = Object.create(CanvasElement.prototype);
TextElement.prototype.constructor = TextElement;
TextElement.base = CanvasElement;

/////////////Style Types///////////////////////////////

TextElement._StyleTypes = Object.create(null);

/**
 * @style Text String
 * Text to be rendered by the TextElement.
 */
TextElement._StyleTypes.Text = 				StyleableBase.EStyleType.NORMAL;		// "any string" || null

/**
 * @style Selectable boolean
 * When true, text can be highlighted and copied.
 */
TextElement._StyleTypes.Selectable = 			StyleableBase.EStyleType.NORMAL;		// true || false

/**
 * @style Multiline boolean
 * When true, newline characters are respected and text will be rendered on multiple lines if necessary.
 */
TextElement._StyleTypes.Multiline = 				StyleableBase.EStyleType.NORMAL;		// true || false

/**
 * @style WordWrap boolean
 * When true, text will wrap when width is constrained and will be rendered on multiple lines if necessary. 
 */
TextElement._StyleTypes.WordWrap = 				StyleableBase.EStyleType.NORMAL;		// true || false


////////////Default Styles////////////////////////////

TextElement.StyleDefault = new StyleDefinition();

//Override base class styles
TextElement.StyleDefault.setStyle("PaddingTop", 					2);
TextElement.StyleDefault.setStyle("PaddingBottom", 					2);
TextElement.StyleDefault.setStyle("PaddingLeft", 					2);
TextElement.StyleDefault.setStyle("PaddingRight", 					2);

//TextElement specific styles
TextElement.StyleDefault.setStyle("Text", 							null);
TextElement.StyleDefault.setStyle("Selectable", 					false);
TextElement.StyleDefault.setStyle("Multiline", 						true);
TextElement.StyleDefault.setStyle("WordWrap", 						true);


/////////////Internal Functions///////////////////

//@Override
TextElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		TextElement.base.prototype._doStylesUpdated.call(this, stylesMap);
	
		if ("Text" in stylesMap)
			this._textField.setText(this.getStyle("Text"));
		
		if ("Selectable" in stylesMap)
			this._textField.setStyle("Selectable", this.getStyle("Selectable"));
		
		if ("Multiline" in stylesMap)
			this._textField.setStyle("Multiline", this.getStyle("Multiline"));
		
		if ("WordWrap" in stylesMap)
			this._textField.setStyle("WordWrap", this.getStyle("WordWrap"));
		
		//Proxy padding to TextField for proper mouse handling
		if ("Padding" in stylesMap ||
			"PaddingTop" in stylesMap ||
			"PaddingBottom" in stylesMap ||
			"PaddingLeft" in stylesMap ||
			"PaddingRight" in stylesMap)
		{
			var paddingSize = this._getPaddingSize();
			
			this._textField.setStyle("PaddingTop", paddingSize.paddingTop);
			this._textField.setStyle("PaddingBottom", paddingSize.paddingBottom);
			this._textField.setStyle("PaddingLeft", paddingSize.paddingLeft);
			this._textField.setStyle("PaddingRight", paddingSize.paddingRight);
		}
	};
	
//@Override
TextElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		//Ignore padding, proxied to TextField
		return {width:this._textField._measuredWidth, height:this._textField._measuredHeight};
	};	

//@Override	
TextElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		TextElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		//Ignore padding, proxied to TextField for mouse handling.
		this._textField._setActualPosition(0, 0);
		this._textField._setActualSize(this._width, this._height);
	};



/**
 * @depends CanvasElement.js
 */

///////////////////////////////////////////////////////////////////////
/////////////////////ScrollButtonSkinElement///////////////////////////

/**
 * @class ScrollButtonSkinElement
 * @inherits CanvasElement
 * 
 * Default skin class for the ScrollButton.
 * 
 * 
 * @constructor ScrollButtonSkinElement 
 * Creates new ScrollButtonSkinElement instance.
 */
function ScrollButtonSkinElement()
{
	ScrollButtonSkinElement.base.prototype.constructor.call(this);
}

//Inherit from CanvasElement
ScrollButtonSkinElement.prototype = Object.create(CanvasElement.prototype);
ScrollButtonSkinElement.prototype.constructor = ScrollButtonSkinElement;
ScrollButtonSkinElement.base = CanvasElement;		
	
//////Style Types//////////////////////
ScrollButtonSkinElement._StyleTypes = Object.create(null);

/**
 * @style ArrowColor String
 * 
 * Hex color value to be used for the arrow icon. Format like "#FF0000" (red).
 */
ScrollButtonSkinElement._StyleTypes.ArrowColor =					StyleableBase.EStyleType.NORMAL;		//"#000000"

/**
 * @style ArrowDirection String
 * 
 * Determines the arrow direction. Allowable values are "up", "down", "left", "right". 
 * Note that ScrollBar sets this style directly to the parent button depending on the scroll bar orientation.
 */
ScrollButtonSkinElement._StyleTypes.ArrowDirection =						StyleableBase.EStyleType.NORMAL;	//"up" || "down" || "left" || "right"


////////Default Styles//////////////////

ScrollButtonSkinElement.StyleDefault = new StyleDefinition();

ScrollButtonSkinElement.StyleDefault.setStyle("ArrowColor", 						"#000000");
ScrollButtonSkinElement.StyleDefault.setStyle("ArrowDirection", 					"up");


/////////Internal Functions////////////////////////

//@Override
ScrollButtonSkinElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		ScrollButtonSkinElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("ArrowColor" in stylesMap || 
			"ArrowDirection" in stylesMap)
		{
			this._invalidateRender();
		}
	};

//@Override
ScrollButtonSkinElement.prototype._doRender = 
	function()
	{
		ScrollButtonSkinElement.base.prototype._doRender.call(this);
		
		var arrowDirection = this.getStyle("ArrowDirection");
		var arrowColor = this.getStyle("ArrowColor");
		
		if (arrowColor == null || arrowDirection == null)
			return;
		
		var ctx = this._getGraphicsCtx();
		
		var borderThickness = this._getBorderThickness();
		
		var x = borderThickness;
		var y = borderThickness;
		var width = this._width - (borderThickness * 2);
		var height = this._height - (borderThickness * 2);
		
		ctx.beginPath();
		
		if (arrowDirection == "up")
		{
			ctx.moveTo(x + (width / 2), y + (height * .35));
			ctx.lineTo(x + (width * .80), y + (height * .65));
			ctx.lineTo(x + (width * .20), y + (height * .65));
		}
		else if (arrowDirection == "down")
		{
			ctx.moveTo(x + (width / 2), y + (height * .65));
			ctx.lineTo(x + (width * .80), y + (height * .35));
			ctx.lineTo(x + (width * .20), y + (height * .35));
		}
		else if (arrowDirection == "left")
		{
			ctx.moveTo(x + (width * .35), y + (height / 2));
			ctx.lineTo(x + (width * .65), y + (height * .20));
			ctx.lineTo(x + (width * .65), y + (height * .80));
		}
		else if (arrowDirection == "right")
		{
			ctx.moveTo(x + (width * .65), y + (height / 2));
			ctx.lineTo(x + (width * .35), y + (height * .20));
			ctx.lineTo(x + (width * .35), y + (height * .80));
		}
		
		ctx.closePath();
		
		ctx.fillStyle = arrowColor;
		ctx.fill();
		
	};		
	
	
	


/**
 * @depends CanvasElement.js
 */

///////////////////////////////////////////////////////////////////////
/////////////////////RadioButtonSkinElement////////////////////////////

/**
 * @class RadioButtonSkinElement
 * @inherits CanvasElement
 * 
 * Default skin class for the RadioButtonElement.  
 * Renders an inner selected indicator using the BackgroundShape style.
 * 
 * 
 * @constructor RadioButtonSkinElement 
 * Creates new RadioButtonSkinElement instance.
 */
function RadioButtonSkinElement()
{
	RadioButtonSkinElement.base.prototype.constructor.call(this);
}

//Inherit from CanvasElement
RadioButtonSkinElement.prototype = Object.create(CanvasElement.prototype);
RadioButtonSkinElement.prototype.constructor = RadioButtonSkinElement;
RadioButtonSkinElement.base = CanvasElement;		
	
//////Style Types//////////////////////
RadioButtonSkinElement._StyleTypes = Object.create(null);

/**
 * @style CheckColor String
 * 
 * Hex color value to be used for the check icon. Format like "#FF0000" (red).
 */
RadioButtonSkinElement._StyleTypes.CheckColor =						StyleableBase.EStyleType.NORMAL;		//"#000000"

/**
 * @style CheckSize Number
 * 
 * Value between 0 and 1 used to determine the size that the "selected" indicator 
 * should be rendered relative to this element's size.
 */
RadioButtonSkinElement._StyleTypes.CheckSize = 						StyleableBase.EStyleType.NORMAL;


////////Default Styles////////////////
RadioButtonSkinElement.StyleDefault = new StyleDefinition();

//RadioButtonSkinElement specific styles
RadioButtonSkinElement.StyleDefault.setStyle("CheckColor", 			"#000000");
RadioButtonSkinElement.StyleDefault.setStyle("CheckSize", 			.35);


/////////Protected Functions////////////////////////

//@Override
RadioButtonSkinElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		RadioButtonSkinElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("SkinState" in stylesMap || "CheckColor" in stylesMap || "CheckSize" in stylesMap)
			this._invalidateRender();
	};

//@Override
RadioButtonSkinElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		return {width:14, height:14};
	};

//@Override
RadioButtonSkinElement.prototype._doRender = 
	function()
	{
		RadioButtonSkinElement.base.prototype._doRender.call(this);
		
		var currentState = this.getStyle("SkinState");
		
		//Draw indicator.
		if (currentState.indexOf("selected") == 0)
		{
			var ctx = this._getGraphicsCtx();
			
			var checkSize = this.getStyle("CheckSize");
			
			var indicatorMetrics = new DrawMetrics();
			indicatorMetrics._width = this._width * checkSize;
			indicatorMetrics._height = this._height * checkSize;
			indicatorMetrics._x = (this._width - indicatorMetrics._width) / 2;
			indicatorMetrics._y = (this._height - indicatorMetrics._height) / 2;
			
			if (indicatorMetrics._width <= 0 || indicatorMetrics._height <= 0)
				return;
			
			ctx.beginPath();
			this._drawBackgroundShape(ctx, indicatorMetrics);
			
			ctx.fillStyle = this.getStyle("CheckColor");
			ctx.fill();
		}
	};		
	
	


/**
 * @depends CanvasElement.js
 */

///////////////////////////////////////////////////////////////////////
/////////////////DropdownArrowButtonSkinElement////////////////////////

/**
 * @class DropdownArrowButtonSkinElement
 * @inherits CanvasElement
 * 
 * Default skin class for Arrow button in the DropdownElement.
 * Renders the divider line and an arrow.
 *  
 * 
 * @constructor DropdownArrowButtonSkinElement 
 * Creates new DropdownArrowButtonSkinElement instance.
 */
function DropdownArrowButtonSkinElement()
{
	DropdownArrowButtonSkinElement.base.prototype.constructor.call(this);
}

//Inherit from CanvasElement
DropdownArrowButtonSkinElement.prototype = Object.create(CanvasElement.prototype);
DropdownArrowButtonSkinElement.prototype.constructor = DropdownArrowButtonSkinElement;
DropdownArrowButtonSkinElement.base = CanvasElement;		
	
//////Style Types//////////////////////
DropdownArrowButtonSkinElement._StyleTypes = Object.create(null);

/**
 * @style ArrowColor String
 * 
 * Hex color value to be used for the arrow. Format like "#FF0000" (red).
 */
DropdownArrowButtonSkinElement._StyleTypes.ArrowColor =				StyleableBase.EStyleType.NORMAL;		//"#000000"

/**
 * @style LineColor String
 * 
 * Hex color value to be used for the divider line. Format like "#FF0000" (red).
 */
DropdownArrowButtonSkinElement._StyleTypes.LineColor =				StyleableBase.EStyleType.NORMAL;		//"#000000"


//////Default Styles///////////////////

DropdownArrowButtonSkinElement.StyleDefault = new StyleDefinition();

DropdownArrowButtonSkinElement.StyleDefault.setStyle("ArrowColor", 				"#000000"); 		
DropdownArrowButtonSkinElement.StyleDefault.setStyle("LineColor", 				"#000000");


/////////Internal Functions////////////////////////

//@Override
DropdownArrowButtonSkinElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		DropdownArrowButtonSkinElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("ArrowColor" in stylesMap || 
			"LineColor" in stylesMap)
		{
			this._invalidateRender();
		}
	};

//@Override
DropdownArrowButtonSkinElement.prototype._doRender = 
	function()
	{
		DropdownArrowButtonSkinElement.base.prototype._doRender.call(this);
		
		var ctx = this._getGraphicsCtx();
		var paddingMetrics = this._getPaddingMetrics();
		
		var lineColor = this.getStyle("LineColor");
		var arrowColor = this.getStyle("ArrowColor");
		
		var x = paddingMetrics.getX();
		var y = paddingMetrics.getY();
		var width = paddingMetrics.getWidth();
		var height = paddingMetrics.getHeight();
		
		if (arrowColor != null)
		{
			ctx.beginPath();
			
			ctx.moveTo(x + (width / 2), y + (height * .60));
			ctx.lineTo(x + (width * .70), y + (height * .40));
			ctx.lineTo(x + (width * .30), y + (height * .40));
			
			ctx.closePath();
			
			ctx.fillStyle = arrowColor;
			ctx.fill();
		}

		if (lineColor != null)
		{
			var lineHeight = height * .65;
			
			ctx.beginPath();
	
			ctx.moveTo(x, y + (height / 2) - (lineHeight / 2));
			ctx.lineTo(x, y + (height / 2) + (lineHeight / 2));
			ctx.lineTo(x + 1, y + (height / 2) + (lineHeight / 2));
			ctx.lineTo(x + 1, y + (height / 2) - (lineHeight / 2));
			
			ctx.closePath();
			
			ctx.fillStyle = lineColor;
			ctx.fill();
		}
	};	
	
	


/**
 * @depends CanvasElement.js
 */

//////////////////////////////////////////////////////////////////
//////DataGridHeaderColumnDividerSkinElement//////////////////////		
	
/**
 * @class DataGridHeaderColumnDividerSkinElement
 * @inherits CanvasElement
 * 
 * Default skin class for the draggable DataGrid column dividers.
 * Renders a line, and drag arrows when mouse is over.
 * 
 * 
 * @constructor DataGridHeaderColumnDividerSkinElement 
 * Creates new DataGridHeaderColumnDividerSkinElement instance.
 */
function DataGridHeaderColumnDividerSkinElement()
{
	DataGridHeaderColumnDividerSkinElement.base.prototype.constructor.call(this);
}

//Inherit from CanvasElement
DataGridHeaderColumnDividerSkinElement.prototype = Object.create(CanvasElement.prototype);
DataGridHeaderColumnDividerSkinElement.prototype.constructor = DataGridHeaderColumnDividerSkinElement;
DataGridHeaderColumnDividerSkinElement.base = CanvasElement;		
	
//////Style Types//////////////////////
DataGridHeaderColumnDividerSkinElement._StyleTypes = Object.create(null);

/**
 * @style DividerLineColor String
 * 
 * Hex color value to be used for the divider line. Format like "#FF0000" (red).
 */
DataGridHeaderColumnDividerSkinElement._StyleTypes.DividerLineColor =			StyleableBase.EStyleType.NORMAL;		//"#000000"

/**
 * @style DividerArrowColor String
 * 
 * Hex color value to be used for the arrows. Format like "#FF0000" (red).
 */
DataGridHeaderColumnDividerSkinElement._StyleTypes.DividerArrowColor =			StyleableBase.EStyleType.NORMAL;		//"up" || "down" || "left" || "right"


////////Default Styles////////////////

DataGridHeaderColumnDividerSkinElement.StyleDefault = new StyleDefinition();

DataGridHeaderColumnDividerSkinElement.StyleDefault.setStyle("DividerLineColor", 		"#777777");
DataGridHeaderColumnDividerSkinElement.StyleDefault.setStyle("DividerArrowColor", 		"#444444");



//@Override
DataGridHeaderColumnDividerSkinElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		DataGridHeaderColumnDividerSkinElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("DividerLineColor" in stylesMap ||
			"DividerArrowColor" in stylesMap)
		{
			this._invalidateRender();
		}
	};

//@Override
DataGridHeaderColumnDividerSkinElement.prototype._doRender = 
	function()
	{
		DataGridHeaderColumnDividerSkinElement.base.prototype._doRender.call(this);
		
		var ctx = this._getGraphicsCtx();
		
		var lineColor = this.getStyle("DividerLineColor");
		var arrowColor = this.getStyle("DividerArrowColor");
		var currentState = this.getStyle("SkinState");
		
		var x = 0;
		var y = 0;
		var w = this._width;
		var h = this._height;
		
		ctx.beginPath();

		ctx.moveTo(x + (w / 2) - .5, y);
		ctx.lineTo(x + (w / 2) - .5, y + h);
		ctx.lineTo(x + (w / 2) + .5, y + h);
		ctx.lineTo(x + (w / 2) + .5, y);
		
		ctx.closePath();
		
		ctx.fillStyle = lineColor;
		ctx.fill();
		
		////////////////////////////
		
		if (currentState == "over" || currentState == "down")
		{
			var arrowHeight = h / 2;
			
			ctx.fillStyle = arrowColor;
			
			ctx.beginPath();
			
			ctx.moveTo(x + (w / 2) - .5 - 1, (h / 2) - (arrowHeight / 2));
			ctx.lineTo(x + (w / 2) - .5 - 1, (h / 2) + (arrowHeight / 2));
			ctx.lineTo(x, y + (h / 2));
			
			ctx.closePath();
			ctx.fill();
			
			ctx.beginPath();
			
			ctx.moveTo(x + (w / 2) + .5 + 1, (h / 2) - (arrowHeight / 2));
			ctx.lineTo(x + (w / 2) + .5 + 1, (h / 2) + (arrowHeight / 2));
			ctx.lineTo(x + w, y + (h / 2));
			
			ctx.closePath();
			ctx.fill();
		}
	};
	
	


/**
 * @depends CanvasElement.js
 */

///////////////////////////////////////////////////////////////////////
///////////////////////CheckboxSkinElement/////////////////////////////

/**
 * @class CheckboxSkinElement
 * @inherits CanvasElement
 * 
 * Default skin class for the CheckboxElement.
 * 
 * 
 * @constructor CheckboxSkinElement 
 * Creates new CheckboxSkinElement instance.
 */
function CheckboxSkinElement()
{
	CheckboxSkinElement.base.prototype.constructor.call(this);
}

//Inherit from CanvasElement
CheckboxSkinElement.prototype = Object.create(CanvasElement.prototype);
CheckboxSkinElement.prototype.constructor = CheckboxSkinElement;
CheckboxSkinElement.base = CanvasElement;		
	
//////Style Types//////////////////////
CheckboxSkinElement._StyleTypes = Object.create(null);

/**
 * @style CheckColor String
 * 
 * Hex color value to be used for the check icon. Format like "#FF0000" (red).
 */
CheckboxSkinElement._StyleTypes.CheckColor =				StyleableBase.EStyleType.NORMAL;		//"#000000"

/**
 * @style CheckSize Number
 * 
 * Value between 0 and 1 used to determine the size that the "selected" indicator 
 * should be rendered relative to this element's size.
 */
CheckboxSkinElement._StyleTypes.CheckSize = 				StyleableBase.EStyleType.NORMAL;


////////Default Styles////////////////

CheckboxSkinElement.StyleDefault = new StyleDefinition();

//CheckboxSkinElement specific styles
CheckboxSkinElement.StyleDefault.setStyle("CheckColor", 						"#000000");
CheckboxSkinElement.StyleDefault.setStyle("CheckSize", 							.80);




/////////Protected Functions////////////////////////

//@Override
CheckboxSkinElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		CheckboxSkinElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("SkinState" in stylesMap || "CheckColor" in stylesMap || "CheckSize" in stylesMap)
			this._invalidateRender();
	};

//@Override
CheckboxSkinElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		return {width:14, height:14};
	};

//@Override
CheckboxSkinElement.prototype._doRender = 
	function()
	{
		CheckboxSkinElement.base.prototype._doRender.call(this);
		
		var currentState = this.getStyle("SkinState");
		
		//Draw check or dash.
		if (currentState.indexOf("selected") == 0 || 
			currentState.indexOf("half") == 0)
		{
			var ctx = this._getGraphicsCtx();
			
			var borderThickness = this._getBorderThickness();
			var checkColor = this.getStyle("CheckColor");
			
			var checkSize = this.getStyle("CheckSize");
			var width = this._width * checkSize;
			var height = this._height * checkSize;
			
			var x = 0 + ((this._width - width) / 2);
			var y = 0 + ((this._height - height) / 2);
			
			if (currentState.indexOf("selected") == 0) //Draw check
			{
				ctx.beginPath();
				
				ctx.moveTo(x + (width * .10), 
							y + (height * .60));
				
				ctx.lineTo(x + (width * .40),
							y + height * .90);
				
				ctx.lineTo(x + (width * .90),
							y + (height * .26));
				
				ctx.lineTo(x + (width * .78),
							y + (height * .10));
				
				ctx.lineTo(x + (width * .38),
							y + height * .65);
				
				ctx.lineTo(x + (width * .20),
							y + height * .45);
				
				ctx.closePath();
			}
			else //Half selected - Draw dash
			{
				ctx.beginPath();
				
				ctx.moveTo(x + (width * .12), 
							y + (height * .42));
				
				ctx.lineTo(x + (width * .12),
							y + height * .58);
				
				ctx.lineTo(x + (width * .88),
							y + (height * .58));
				
				ctx.lineTo(x + (width * .88),
							y + (height * .42));
				
				ctx.closePath();
			}
			
			ctx.fillStyle = checkColor;
			ctx.fill();
		}
	};		
	
	


/**
 * @depends CanvasElement.js
 */

//////////////////////////////////////////////////////////////////////
///////////////////////SkinnableElement///////////////////////////////	
	
/**
 * @class SkinnableElement
 * @inherits CanvasElement
 * 
 * Abstract base class for skin-able components. Allows changing states, stores a list
 * of skins per state and toggles skin visibility per the current state. 
 * Any states may be used. As an example, ButtonElement uses "up", "over", "down", and "disabled" states.
 * Override appropriate functions to return skin classes and style definitions per the element's states. 
 * SkinnableElement does not render itself, its skins do. It proxies all rendering 
 * related styles to its skins (such as BackgroundColor).
 * 
 * @seealso StyleProxy
 * 
 * 
 * @constructor SkinnableElement 
 * Creates new SkinnableElement instance.
 */
function SkinnableElement()
{
	SkinnableElement.base.prototype.constructor.call(this);
	
	this._skins = Object.create(null);
	this._currentSkin = null;
	
	/**
	 * @member _currentSkinState String
	 * Read only - String representing the current state.
	 */
	this._currentSkinState = "";
	
}

//Inherit from CanvasElement
SkinnableElement.prototype = Object.create(CanvasElement.prototype);
SkinnableElement.prototype.constructor = SkinnableElement;
SkinnableElement.base = CanvasElement;


//Proxy map for styles we want to pass to skins.
SkinnableElement._SkinProxyMap = Object.create(null);

//Proxy styles that affect rendering.
SkinnableElement._SkinProxyMap.BorderType = 				true;
SkinnableElement._SkinProxyMap.BorderColor = 				true;
SkinnableElement._SkinProxyMap.BorderThickness = 			true;
SkinnableElement._SkinProxyMap.BackgroundColor = 			true;
SkinnableElement._SkinProxyMap.AutoGradientType = 			true;
SkinnableElement._SkinProxyMap.AutoGradientStart = 			true;
SkinnableElement._SkinProxyMap.AutoGradientStop = 			true;
SkinnableElement._SkinProxyMap.BackgroundShape = 			true;

//Proxy styles that are not defined by the element.
SkinnableElement._SkinProxyMap._Arbitrary =					true;


//////////////////Internal Functions///////////////////
/**
 * @function _getSkinClass
 * Gets the skin class to use per the provided state. 
 * Override this to return different skin classes for different states.
 * 
 * @param state String
 * The state for which to return a skin class.
 * 
 * @returns Function
 * Return the constructor of the appropriate skin class.
 */
SkinnableElement.prototype._getSkinClass = 
	function (state)
	{
		return null;
	};

/**
 * @function _getSubStyleNameForSkinState
 * Gets the style name of the sub style to be applied to the skin
 * for the associated state. Override this to return the associated
 * sub style name for the supplied state.
 * 
 * @param state String
 * The state for which to return a sub style name.
 * 
 * @returns string
 * Sub style name to apply to the skin of the associated state.
 */	
SkinnableElement.prototype._getSubStyleNameForSkinState = 
	function (state)
	{
		return null;
	};
	
/**
 * @function _getSkinStyleProxyMap
 * Gets the Style proxy map to pass to skins. Override this if you need to pass additional styles
 * to custom skins. You should include all the styles provided in the default SkinnableElement style map.
 * 
 * @returns Object
 * Return a style proxy map to be applied to this element to all skins. Formatted as:
 * 
 * MyProxyMap = Object.create(null);
 * MyProxyMap.StyleName1 = true;
 * MyProxyMap.StyleName2 = true;
 * 
 * @seealso StyleProxy
 */	
SkinnableElement.prototype._getSkinStyleProxyMap = 
	function ()
	{
		return SkinnableElement._SkinProxyMap;
	};
	
/**
 * @function _updateSkinStyleDefinitions
 * Updates the StyleDefinition for the skin of the provided state. Subclasses should call
 * this within their _doStylesUpdated() when skin style definitions change.
 * 
 * @param state String
 * The state for which to update the StyleDefinition.
 */	
SkinnableElement.prototype._updateSkinStyleDefinitions = 
	function (state)
	{
		var skinElement = this._skins[state];
		
		//Skin instance not yet created.
		if (skinElement == null)
			return;
	
		var subStyleName = this._getSubStyleNameForSkinState(state);
		
		if (subStyleName != null)
			this._applySubStylesToElement(subStyleName, skinElement);
	};
	
/**
 * @function _updateSkinClass
 * Updates the skin class for the skin of the provided state. Subclasses should call
 * this within their _doStylesUpdated() when skin style class changes.
 * 
 * @param state String
 * The state for which to update the skin class.
 */		
SkinnableElement.prototype._updateSkinClass = 
	function (state)
	{
		//If the skin hasnt been created bail. State change will create later.
		if (this._skins[state] == null && state != this._currentSkinState)
			return;
		
		var newSkinClass = this._getSkinClass(state);
		var currentSkinClass = null;
		
		if (this._skins[state] != null)
			currentSkinClass = this._skins[state].constructor;
		
		//Skin class has not changed.
		if (newSkinClass == currentSkinClass)
			return;
		
		//Nuke the old skin
		if (this._skins[state] != null)
		{
			this._removeChild(this._skins[state]);
			this._skins[state] = null;
		}
		
		//Only create the new skin if its active, otherwise state change will create later.
		if (this._currentSkinState == state)
		{
			//Create new and adjust visibility if needed
			var newSkin = this._createSkin(state);
			this._currentSkin = newSkin;
			
			if (newSkin != null)
				newSkin.setStyle("Visible", true);
		}
	};	
	
//@private	
SkinnableElement.prototype._createSkin = 
	function (state)
	{
		var skinClass = this._getSkinClass(state);
		if (skinClass == null)
		{
			this._skins[state] = null;
			return null;
		}
	
		var newSkin = new (skinClass)();
		
		this._skins[state] = newSkin;
		
		newSkin._setStyleProxy(new StyleProxy(this, this._getSkinStyleProxyMap()));
		
		this._updateSkinStyleDefinitions(state);
		
		newSkin.setStyle("MouseEnabled", false);
		newSkin.setStyle("SkinState", state);
		
		this._addChildAt(newSkin, 0);
		
		return newSkin;
	};
	
/**
 * @function _changeState
 * Called when the element changes skin state. Do not call this function directly.
 * You may override this if you need to make additional changes to your component
 * when the skin state changes (such as updating a label color).
 * 
 * @param state String
 * The skin state that this element is changing too.
 * 
 * @returns boolean
 * Returns true if the element state has actually changed, false if it is the same state. 
 * Subclasses can check what this base function returns before making additional changes for better performance.
 */	
SkinnableElement.prototype._changeState = 
	function (state)
	{
		if (this._currentSkinState == state || state == "" || state == null)
			return false;
	
		this._currentSkinState = state;
		
		var foundSkin = false;
		for (var skinState in this._skins)
		{
			//Ignore null skins.
			if (this._skins[skinState] == null)
				continue;
			
			if (skinState == state)
			{
				this._currentSkin = this._skins[skinState];
				this._skins[skinState].setStyle("Visible", true);
				foundSkin = true;
			}
			else 
				this._skins[skinState].setStyle("Visible", false);
		}
		
		//Attempt to create the skin (this may be null anyway)
		if (foundSkin == false)
		{
			this._currentSkin = this._createSkin(state);
			
			if (this._currentSkin != null)
				this._currentSkin.setStyle("Visible", true);
		}
		
		return true;
	};

//@override	
SkinnableElement.prototype._setActualRotation = 
	function (degrees, centerX, centerY)
	{
		var currentDegrees = this._rotateDegrees;
	
		SkinnableElement.base.prototype._setActualRotation.call(this, degrees, centerX, centerY);
	
		//Rotation changed
		if (this._rotateDegrees != currentDegrees)
		{
			var autoGradientType;
			var backgroundColor;
			var borderType;
			
			for (var skinState in this._skins)
			{
				//Check if we need to re-render due to auto gradient
				autoGradientType = this._skins[skinState].getStyle("AutoGradientType");
				backgroundColor = this._skins[skinState].getStyle("BackgroundColor");
				borderType = this._skins[skinState].getStyle("BorderType");
				
				if (autoGradientType != null && autoGradientType != "none" && 
					(backgroundColor != null || (borderType != null && borderType != "none")))
				{
					this._skins[skinState]._invalidateRender();
				}
			}
		}
	};	
	
//@override
SkinnableElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		SkinnableElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("SkinState" in stylesMap)
			this._changeState(this.getStyle("SkinState"));
	};	
	
//@override	
SkinnableElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		SkinnableElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		//We have to size all skins, not just the current skin. Otherwise if multiple skins 
		//are created within 1 cycle (multiple immediate state changes) we could end up with 
		//a skin that never gets sized unless we invalidate layout on every skin change.
		for (var prop in this._skins)
		{
			if (this._skins[prop] == null)
				continue;
			
			this._skins[prop]._setActualSize(this._width, this._height);
			this._skins[prop]._setActualPosition(0, 0);
		}
	};	

//@Override
SkinnableElement.prototype._doRender = 
	function ()
	{
		//Do nothing, don't call base. SkinnableElement does not render itself, its skins do.
	
		//TODO: Use the active skin metrics & shape to render the focus ring.
		//if (this._renderFocusRing == true)
		//	this._drawFocusRing(ctx, this._getBorderMetrics());
	};	
	
	


/**
 * @depends SkinnableElement.js
 */

/////////////////////////////////////////////////////////
///////////////TextInputElement//////////////////////////	
	
/**
 * @class TextInputElement
 * @inherits SkinnableElement
 * 
 * TextInput is an edit-able single line text box.
 * 
 * 
 * @constructor TextInputElement 
 * Creates new TextInputElement instance.
 */
function TextInputElement()
{
	TextInputElement.base.prototype.constructor.call(this);
	
	this._textField = new TextFieldElement();
	this._textField.setStyle("Selectable", true);
	this._textField.setStyle("Cursor", null);
	this._textField.setStyle("TabStop", -1);
	this._addChild(this._textField);
	
	var _self = this;
	
	//Private event handlers, need different instance for each TextInput. Proxy to prototype.
	this._onTextInputFocusEventInstance = 
		function (event)
		{
			if (event.getType() == "focusin")
				_self._onTextInputFocusIn(event);
			else
				_self._onTextInputFocusOut(event);
		};
	
	this._onTextInputKeyDownInstance = 
		function (keyboardEvent)
		{
			_self._onTextInputKeyDown(keyboardEvent);
		};
		
	this._onTextInputTextFieldChangedInstance = 
		function (event)
		{
			_self._onTextInputTextFieldChanged(event);
		};
		
	this.addEventListener("focusin", this._onTextInputFocusEventInstance);
	this.addEventListener("focusout", this._onTextInputFocusEventInstance);	
}

//Inherit from SkinnableElement
TextInputElement.prototype = Object.create(SkinnableElement.prototype);
TextInputElement.prototype.constructor = TextInputElement;
TextInputElement.base = SkinnableElement;

/////////////Events////////////////////////////////////

/**
 * @event changed ElementEvent
 * Dispatched when the text is modified as a result of user input.
 */


/////////////Style Types///////////////////////////////

TextInputElement._StyleTypes = Object.create(null);

/**
 * @style MaxChars int
 * 
 * Maximum number of characters allowed.
 */
TextInputElement._StyleTypes.MaxChars = 								StyleableBase.EStyleType.NORMAL;		// number

/**
 * @style SkinClass CanvasElement
 * 
 * The CanvasElement constructor type to apply to all skin states. 
 * Specific states such as UpSkinClass will override SkinClass.
 */
TextInputElement._StyleTypes.SkinClass =								StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style UpSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the skin when in the "up" state. 
 * This will override SkinClass.
 */
TextInputElement._StyleTypes.UpSkinClass = 								StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style UpSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "up" state skin element.
 */
TextInputElement._StyleTypes.UpSkinStyle = 								StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

/**
 * @style UpTextColor String
 * 
 * Hex color value to be used for the button TextInput is in the "up" state. Format like "#FF0000" (red).
 * This will override the TextColor style.
 */
TextInputElement._StyleTypes.UpTextColor = 								StyleableBase.EStyleType.NORMAL;		// color "#000000"

/**
 * @style UpTextHighlightedColor String
 * 
 * Hex color value to be used for highlighted text when the TextInput is in the "up" state. Format like "#FF0000" (red).
 * This will override the TextHighlightedColor style.
 */
TextInputElement._StyleTypes.UpTextHighlightedColor = 					StyleableBase.EStyleType.NORMAL;		// color "#FFFFFF"

/**
 * @style UpTextHighlightedBackgroundColor String
 * 
 * Hex color value to be used for highlighted text background when the TextInput is in the "up" state. Format like "#FF0000" (red).
 * This will override the TextHighlightedBackgroundColor style.
 */
TextInputElement._StyleTypes.UpTextHighlightedBackgroundColor = 	StyleableBase.EStyleType.NORMAL;			// color "#000000"

/**
 * @style DisabledSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the TextInput is in the "disabled" state.
 * When this is null, the base SkinClass style will be used.
 */
TextInputElement._StyleTypes.DisabledSkinClass = 						StyleableBase.EStyleType.NORMAL;		// Element constructor()

/**
 * @style DisabledSkinStyle StyleDefinition
 * The StyleDefinition to apply to the "disabled" state skin element.
 * When this is null, the base SkinTyle will be used.
 */
TextInputElement._StyleTypes.DisabledSkinStyle = 						StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition

/**
 * @style DisabledTextColor String
 * 
 * Hex color value to be used for the button TextInput is in the "disabled" state. Format like "#FF0000" (red).
 * This will override the TextColor style.
 */
TextInputElement._StyleTypes.DisabledTextColor = 						StyleableBase.EStyleType.NORMAL;		// color "#000000"

/**
 * @style DisabledTextHighlightedColor String
 * 
 * Hex color value to be used for highlighted text when the TextInput is in the "disabled" state. Format like "#FF0000" (red).
 * When this is null, the base TextHighlightedColor style will be used.
 */
TextInputElement._StyleTypes.DisabledTextHighlightedColor = 			StyleableBase.EStyleType.NORMAL;		// color "#FFFFFF"

/**
 * @style DisabledTextHighlightedBackgroundColor String
 * 
 * Hex color value to be used for highlighted text background when the TextInput is in the "disabled" state. Format like "#FF0000" (red).
 * When this is null, the base TextHighlightedBackgroundColor style will be used.
 */
TextInputElement._StyleTypes.DisabledTextHighlightedBackgroundColor = 	StyleableBase.EStyleType.NORMAL;		// color "#000000"


/////////////Default Styles///////////////////////////

TextInputElement.StyleDefault = new StyleDefinition();

TextInputElement.StyleDefault.setStyle("MaxChars", 									0);
TextInputElement.StyleDefault.setStyle("Enabled", 									true);

TextInputElement.StyleDefault.setStyle("UpTextColor", 								"#000000");
TextInputElement.StyleDefault.setStyle("UpTextHighlightedColor", 					"#FFFFFF");
TextInputElement.StyleDefault.setStyle("UpTextHighlightedBackgroundColor", 			"#000000");

TextInputElement.StyleDefault.setStyle("DisabledTextColor", 						"#888888");
TextInputElement.StyleDefault.setStyle("DisabledTextHighlightedColor", 				"#FFFFFF");
TextInputElement.StyleDefault.setStyle("DisabledTextHighlightedBackgroundColor", 	"#000000");

TextInputElement.StyleDefault.setStyle("PaddingTop",								3);
TextInputElement.StyleDefault.setStyle("PaddingBottom",								3);
TextInputElement.StyleDefault.setStyle("PaddingLeft",								3);
TextInputElement.StyleDefault.setStyle("PaddingRight",								3);

TextInputElement.StyleDefault.setStyle("TabStop", 									0);
TextInputElement.StyleDefault.setStyle("Cursor", 									"text");

TextInputElement.StyleDefault.setStyle("SkinClass", 								CanvasElement);
TextInputElement.StyleDefault.setStyle("UpSkinClass", 								CanvasElement);
TextInputElement.StyleDefault.setStyle("DisabledSkinClass", 						CanvasElement);

/////Skin styles//
TextInputElement.DisabledSkinStyleDefault = new StyleDefinition();

TextInputElement.DisabledSkinStyleDefault.setStyle("BorderType", 					"inset");
TextInputElement.DisabledSkinStyleDefault.setStyle("BorderThickness", 				1);
TextInputElement.DisabledSkinStyleDefault.setStyle("BorderColor", 					"#999999");
TextInputElement.DisabledSkinStyleDefault.setStyle("BackgroundColor", 				"#ECECEC");
TextInputElement.DisabledSkinStyleDefault.setStyle("AutoGradientType", 				"linear");
TextInputElement.DisabledSkinStyleDefault.setStyle("AutoGradientStart", 			(+.05));
TextInputElement.DisabledSkinStyleDefault.setStyle("AutoGradientStop", 				(-.05));

TextInputElement.UpSkinStyleDefault = new StyleDefinition();

TextInputElement.UpSkinStyleDefault.setStyle("BorderType", 							"inset");
TextInputElement.UpSkinStyleDefault.setStyle("BorderThickness", 					1);
TextInputElement.UpSkinStyleDefault.setStyle("BorderColor", 						"#606060");
TextInputElement.UpSkinStyleDefault.setStyle("BackgroundColor", 					"#F5F5F5");

//Apply skin defaults
TextInputElement.StyleDefault.setStyle("UpSkinStyle", 								TextInputElement.UpSkinStyleDefault);
TextInputElement.StyleDefault.setStyle("DisabledSkinStyle", 						TextInputElement.DisabledSkinStyleDefault);



////////Public///////////////////////

/**
 * @function setText
 * Sets the text to be displayed.
 * 
 * @param text String
 * Text to be displayed.
 */
TextInputElement.prototype.setText = 
	function (text)
	{
		this._textField.setText(text);
	};

/**
 * @function getText
 * Gets the text currently displayed.
 * 
 * @returns String
 * Text currently displayed.
 */	
TextInputElement.prototype.getText = 
	function ()
	{
		return this._textField.getText();
	};


////////Internal/////////////////////

/**
 * @function _onTextInputTextFieldChanged
 * Event handler for the internal TextField "changed" event. Only active when TextInput is Enabled.
 * Dispatches a "changed" event from this TextInput element.
 * 
 * @param elementEvent ElementEvent
 * ElementEvent to be processed.
 */	
TextInputElement.prototype._onTextInputTextFieldChanged = 
	function (elementEvent)
	{
		//Pass on the changed event
	
		if (this.hasEventListener("changed", null) == true)
			this._dispatchEvent(new ElementEvent("changed", false));
	};
	
/**
 * @function _onTextInputKeyDown
 * Event handler for "keydown" event. Only active when TextInput is enabled. 
 * Proxies keyboard event to internal TextField.
 * 
 * @param keyboardEvent ElementKeyboardEvent
 * ElementKeyboardEvent to process.
 */	
TextInputElement.prototype._onTextInputKeyDown = 
	function (keyboardEvent)
	{
		if (keyboardEvent.getDefaultPrevented() == true)
			return;
		
		var clonedEvent = keyboardEvent.clone();
		clonedEvent._bubbles = false; //Dont bubble.
		
		//Dispatch non-bubbling keyboard event to our text field.
		this._textField._dispatchEvent(clonedEvent);
		
		if (clonedEvent.getIsCanceled() == true)
			keyboardEvent.cancelEvent();
			
		if (clonedEvent.getDefaultPrevented() == true)
			keyboardEvent.preventDefault();
	};

/**
 * @function _onTextInputFocusIn
 * Event handler for "focusin" event. 
 * Proxies focus event to internal TextField.
 * 
 * @param elementEvent ElementEvent
 * ElementEvent to process.
 */		
TextInputElement.prototype._onTextInputFocusIn = 
	function (elementEvent)
	{
		//This only works because TextField doesnt look at _isFocused (manages caret state with different flag)
		this._textField._dispatchEvent(elementEvent.clone()); 
	};

/**
 * @function _onTextInputFocusOut
 * Event handler for "focusout" event. 
 * Proxies focus event to internal TextField.
 * 
 * @param elementEvent ElementEvent
 * ElementEvent to process.
 */		
TextInputElement.prototype._onTextInputFocusOut = 
	function (elementEvent)
	{
		//This only works because TextField doesnt look at _isFocused (manages caret state with different flag)
		this._textField._dispatchEvent(elementEvent.clone());
	};
	
//@Override
TextInputElement.prototype._getSkinClass = 
	function (state)
	{
		var stateSkinClass = null;
		
		if (state == "up")
			stateSkinClass = this.getStyleData("UpSkinClass");
		else if (state == "disabled")
			stateSkinClass = this.getStyleData("DisabledSkinClass");
		
		var skinClass = this.getStyleData("SkinClass");
		
		//Shouldnt have null stateSkinClass
		if (stateSkinClass == null || skinClass.comparePriority(stateSkinClass) > 0) //Use skinClass if higher priority
			return skinClass.value;
		
		return stateSkinClass.value;
	};
	
//@override	
TextInputElement.prototype._getSubStyleNameForSkinState = 
	function (state)
	{
		if (state == "up")
			return "UpSkinStyle";
		if (state == "disabled")
			return "DisabledSkinStyle";
		
		return TextInputElement.base.prototype._getSubStyleNameForSkinState.call(this, state);
	};			
	
/**
 * @function _updateState
 * Updates the current SkinState in response to style changes.
 */	
TextInputElement.prototype._updateState = 
	function ()
	{
		var newState = "up";

		if (this.getStyle("Enabled") == false)
			newState = "disabled";
		
		this.setStyle("SkinState", newState);
	};	
	
//@Override
TextInputElement.prototype._changeState = 
	function (state)
	{
		TextInputElement.base.prototype._changeState.call(this, state);
	
		this._updateTextColors();
	};
	
/**
 * @function _updateTextColors
 * Updates the text colors based on the current state. Called when state changes and when added to display hierarchy.
 */	
TextInputElement.prototype._updateTextColors = 
	function ()
	{
		this._textField.setStyle("TextColor", this._getTextColor(this._currentSkinState));
		this._textField.setStyle("TextHighlightedColor", this._getTextHighlightedColor(this._currentSkinState));
		this._textField.setStyle("TextHighlightedBackgroundColor", this._getTextHighlightedBackgroundColor(this._currentSkinState));
	};
	
/**
 * @function _getTextColor
 * Gets the text color for the supplied state based on text styles.
 * 
 * @param state String
 * The skin state to return the text color.
 * 
 * @returns String
 * Hex color value.
 */	
TextInputElement.prototype._getTextColor = 
	function (state)
	{
		var stateTextColor = null;
		
		if (state == "up")
			stateTextColor = this.getStyleData("UpTextColor");
		else if (state == "disabled")
			stateTextColor = this.getStyleData("DisabledTextColor");
	
		var textColor = this.getStyleData("TextColor");
		
		//Shouldnt have null stateTextColor
		if (stateTextColor == null || textColor.comparePriority(stateTextColor) > 0) //Use textColor if higher priority
			return textColor.value;
		
		return stateTextColor.value;
	};
	
/**
 * @function _getTextHighlightedColor
 * Gets the highlighted text color for the supplied state based on text styles.
 * 
 * @param state String
 * The skin state to return the highlighted text color.
 * 
 * @returns String
 * Hex color value.
 */		
TextInputElement.prototype._getTextHighlightedColor = 
	function (state)
	{
		var stateTextColor = null;
		
		if (state == "up")
			stateTextColor = this.getStyleData("UpTextHighlightedColor");
		else if (state == "disabled")
			stateTextColor = this.getStyleData("DisabledTextHighlightedColor");
	
		var textColor = this.getStyleData("TextHighlightedColor");
		
		//Shouldnt have null stateTextColor
		if (stateTextColor == null || textColor.comparePriority(stateTextColor) > 0) //Use textColor if higher priority
			return textColor.value;
		
		return stateTextColor.value;
	};
	
/**
 * @function _getTextHighlightedBackgroundColor
 * Gets the highlighted text background color for the supplied state based on text styles.
 * 
 * @param state String
 * The skin state to return the highlighted text background color.
 * 
 * @returns String
 * Hex color value.
 */		
TextInputElement.prototype._getTextHighlightedBackgroundColor = 
	function (state)
	{
		var stateTextColor = null;
		
		if (state == "up")
			stateTextColor = this.getStyleData("UpTextHighlightedBackgroundColor");
		else if (state == "disabled")
			stateTextColor = this.getStyleData("DisabledTextHighlightedBackgroundColor");
	
		var textColor = this.getStyleData("TextHighlightedBackgroundColor");
		
		//Shouldnt have null stateTextColor
		if (stateTextColor == null || textColor.comparePriority(stateTextColor) > 0) //Use textColor if higher priority
			return textColor.value;
		
		return stateTextColor.value;
	};
	
//@Override
TextInputElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		TextInputElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("MaxChars" in stylesMap)
			this._textField.setStyle("MaxChars", this.getStyle("MaxChars"));
		
		if ("Enabled" in stylesMap)
		{
			var enabled = this.getStyle("Enabled");
			this._textField.setStyle("Enabled", enabled);
			
			if (enabled == true)
			{
				if (this.hasEventListener("keydown", this._onTextInputKeyDownInstance) == false)
					this.addEventListener("keydown", this._onTextInputKeyDownInstance);
				
				if (this._textField.hasEventListener("changed", this._onTextInputTextFieldChangedInstance) == false)
					this._textField.addEventListener("changed", this._onTextInputTextFieldChangedInstance);					
			}
			else
			{
				if (this.hasEventListener("keydown", this._onTextInputKeyDownInstance) == true)
					this.removeEventListener("keydown", this._onTextInputKeyDownInstance);
				
				if (this._textField.hasEventListener("changed", this._onTextInputTextFieldChangedInstance) == true)
					this._textField.removeEventListener("changed", this._onTextInputTextFieldChangedInstance);
			}
		}
		
		if ("TextLinePaddingTop" in stylesMap || 
			"TextLinePaddingBottom" in stylesMap)
		{
			this._invalidateMeasure();
		}
		
		if ("Padding" in stylesMap ||
			"PaddingTop" in stylesMap ||
			"PaddingBottom" in stylesMap ||
			"PaddingLeft" in stylesMap ||
			"PaddingRight" in stylesMap)
		{
			var paddingSize = this._getPaddingSize();
			
			this._textField.setStyle("PaddingTop", paddingSize.paddingTop);
			this._textField.setStyle("PaddingBottom", paddingSize.paddingBottom);
			this._textField.setStyle("PaddingLeft", paddingSize.paddingLeft);
			this._textField.setStyle("PaddingRight", paddingSize.paddingRight);
			
			this._invalidateMeasure();
		}
		
		////Update skin classes and sub styles.
		if ("SkinClass" in stylesMap || "UpSkinClass" in stylesMap)
			this._updateSkinClass("up");
		if ("UpSkinStyle" in stylesMap)
			this._updateSkinStyleDefinitions("up");
		
		if ("SkinClass" in stylesMap || "DisabledSkinClass" in stylesMap)
			this._updateSkinClass("disabled");
		if ("DisabledSkinStyle" in stylesMap)
			this._updateSkinStyleDefinitions("disabled");

		
		this._updateState();
		this._updateTextColors();
	};
	
//@Override
TextInputElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		var measuredSize = {width:0, height:this.getStyle("TextSize") + this.getStyle("TextLinePaddingTop") + this.getStyle("TextLinePaddingBottom")};
		measuredSize.width = measuredSize.height * 10;
		
		measuredSize.width += padWidth;
		measuredSize.height += padHeight;
	
		return measuredSize;
	};
	
//@Override	
TextInputElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		TextInputElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		//Ignore padding, proxied to TextField for proper mouse handling.		
		this._textField._setActualPosition(0, 0);
		this._textField._setActualSize(this._width, this._height);
	};
	
	


/**
 * @depends CanvasElement.js
 */

/////////////////////////////////////////////////////////
/////////////////LabelElement////////////////////////////	
	
/**
 * @class LabelElement
 * @inherits CanvasElement
 * 
 * Basic label for rendering single line style-able text. 
 * Can be styled to automatically truncate text to fit the available 
 * space with a supplied string like ellipses "...".
 * 
 * 
 * @constructor LabelElement 
 * Creates new LabelElement instance.
 */
function LabelElement()
{
	LabelElement.base.prototype.constructor.call(this);
	
	this._textWidth = null;
	this._textHeight = null;
	this._truncateStringWidth = null;
}

//Inherit from CanvasElement
LabelElement.prototype = Object.create(CanvasElement.prototype);
LabelElement.prototype.constructor = LabelElement;
LabelElement.base = CanvasElement;

/////////////Style Types///////////////////////////////

LabelElement._StyleTypes = Object.create(null);

/**
 * @style Text String
 * Text to be rendered by the Label.
 */
LabelElement._StyleTypes.Text = 				StyleableBase.EStyleType.NORMAL;		// "any string" || null

/**
 * @style TruncateToFit String
 * String to use when truncating a label that does not fit the available area. Defaults to "...".
 */
LabelElement._StyleTypes.TruncateToFit = 		StyleableBase.EStyleType.NORMAL;		// null || "string" ("...")


////////////Default Styles////////////////////////////

LabelElement.StyleDefault = new StyleDefinition();

//Override base class styles
LabelElement.StyleDefault.setStyle("PaddingTop",					2);
LabelElement.StyleDefault.setStyle("PaddingBottom",					2);
LabelElement.StyleDefault.setStyle("PaddingLeft",					2);
LabelElement.StyleDefault.setStyle("PaddingRight",					2);

//LabelElement specific styles
LabelElement.StyleDefault.setStyle("Text", 							null);
LabelElement.StyleDefault.setStyle("TruncateToFit", 				"...");


/////////////LabelElement Internal Functions///////////////////

//@Override
LabelElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		LabelElement.base.prototype._doStylesUpdated.call(this, stylesMap);
	
		if ("TextStyle" in stylesMap ||
			"TextFont" in stylesMap ||
			"TextSize" in stylesMap ||
			"Text" in stylesMap ||
			"TextLinePaddingTop" in stylesMap || 
			"TextLinePaddingBottom" in stylesMap)
		{
			this._textWidth = null;
			this._textHeight = null;
			
			this._invalidateMeasure();
			this._invalidateRender();
		}
		
		if ("TruncateToFit" in stylesMap)
		{
			this._truncateStringWidth = null;
			
			this._invalidateRender();
		}
		
		if ("TextHorizontalAlign" in stylesMap ||
			"TextVerticalAlign" in stylesMap ||
			"TextColor" in stylesMap ||
			"TextFillType" in stylesMap)
		{
			this._invalidateRender();
		}
	};	
	
//@Override
LabelElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		if (this._textWidth == null || this._textHeight == null)
		{
			var measureText = this.getStyle("Text");
			if (measureText == null)
				measureText = "";
		
			this._textHeight = this.getStyle("TextSize") + this.getStyle("TextLinePaddingTop") + this.getStyle("TextLinePaddingBottom");
			this._textWidth = CanvasElement._measureText(measureText, this._getFontString());
		}
		
		return {width:this._textWidth + padWidth, height:this._textHeight + padHeight};
	};	

//@override
LabelElement.prototype._doRender = 
	function ()
	{
		LabelElement.base.prototype._doRender.call(this);
		
		var text = this.getStyle("Text");
		if (text == null || text.length == 0)
			return;
		
		var ctx = this._getGraphicsCtx();
		var paddingMetrics = this._getPaddingMetrics();
		
		//For convienence
		var x = paddingMetrics.getX();
		var y = paddingMetrics.getY();
		var w = paddingMetrics.getWidth();
		var h = paddingMetrics.getHeight();
		
		var fontString = this._getFontString();
		var totalWidth =  this._textWidth;
		
		//Truncate if necessary
		if (totalWidth > w)
		{
			var truncateString = this.getStyle("TruncateToFit");
			
			//Get number of truncate chars
			var numTruncateChars = 0;
			if (truncateString != null)
				numTruncateChars = truncateString.length;
			
			//Get truncate chars width
			if (this._truncateStringWidth == null)
			{
				if (truncateString == null)
					this._truncateStringWidth = 0;
				else
					this._truncateStringWidth = CanvasElement._measureText(truncateString, fontString);
			}
			
			var charWidth = 0;
			var numTextChars = text.length;
			totalWidth = this._textWidth + this._truncateStringWidth;
			
			//Remove text characters until we fit or run out.
			while (numTextChars > 0 && totalWidth > w)
			{
				charWidth = CanvasElement._measureText(text[numTextChars - 1], fontString);
				
				numTextChars--;
				totalWidth -= charWidth;
			}
			
			//Remove truncate characters until we fit or run out
			while (numTruncateChars > 0 && totalWidth > w)
			{
				charWidth = CanvasElement._measureText(truncateString[numTruncateChars - 1], fontString);
				
				numTruncateChars--;
				totalWidth -= charWidth;
			}
			
			text = text.substring(0, numTextChars) + truncateString.substring(0, numTruncateChars);
		}
		
		var linePaddingTop = this.getStyle("TextLinePaddingTop");
		var linePaddingBottom = this.getStyle("TextLinePaddingBottom");
		
		var textBaseline = this.getStyle("TextVerticalAlign");
		var textAlign = this.getStyle("TextHorizontalAlign");
		var textFillType = this.getStyle("TextFillType");
		var textColor = this.getStyle("TextColor");
		
		//Get x position
		var textXPosition;
		if (textAlign == "left")
			textXPosition = x;
		else if (textAlign == "right")
			textXPosition = x + w - totalWidth;
		else //center
			textXPosition = Math.round(x + (w / 2) - (totalWidth / 2));
		
		//Get y position
		var textYPosition;
		if (textBaseline == "top")
			textYPosition = y + linePaddingTop;
		else if (textBaseline == "bottom")
			textYPosition = y + h - linePaddingBottom;
		else //middle
			textYPosition = Math.round(y + (h / 2) + (linePaddingTop / 2) - (linePaddingBottom / 2));
		
		//Render text
		if (textFillType == "stroke")
			CanvasElement._strokeText(ctx, text, textXPosition, textYPosition, fontString, textColor, textBaseline);
		else
			CanvasElement._fillText(ctx, text, textXPosition, textYPosition, fontString, textColor, textBaseline);
	};
	
	
	


/**
 * @depends CanvasElement.js
 */

////////////////////////////////////////////////////
//////////////////ImageElement//////////////////////

/**
 * @class ImageElement
 * @inherits CanvasElement
 * 
 * ImageElement renders an image (imagine that). 
 * Images can be loaded via "url" or pre-loaded via DOM image reference and can be stretched, tiled, or aligned. 
 * 
 * @constructor ImageElement 
 * Creates new ImageElement instance.
 */
function ImageElement()
{
	ImageElement.base.prototype.constructor.call(this);
	
	this._imageLoader = null;
	
	this._imageSource = null;
	
	/**
	 * @member _imageLoadComplete boolean
	 * Read Only - True if the image has completed loading, otherwise false.
	 */
	this._imageLoadComplete = false;
	
	var _self = this;
	
	//Private event handler, need different instance for each element.
	this._onImageElementLoadCompleteInstance = 
		function (event)
		{
			_self._imageLoader.removeEventListener("load", _self._onImageElementLoadCompleteInstance);
			_self._imageLoadComplete = true;
			
			_self._invalidateMeasure();
			_self._invalidateLayout();
			_self._invalidateRender();
		};
}

//Inherit from CanvasElement
ImageElement.prototype = Object.create(CanvasElement.prototype);
ImageElement.prototype.constructor = ImageElement;
ImageElement.base = CanvasElement;


/////////////Style Types///////////////////////////////

ImageElement._StyleTypes = Object.create(null);

/**
 * @style ImageSource String
 * Image to render. This may be a String URL, or a reference to a DOM image or canvas.
 */
ImageElement._StyleTypes.ImageSource = 					StyleableBase.EStyleType.NORMAL;		// null || image || "url" 

/**
 * @style ImageSourceClipX Number
 * X position in pixels of the clip area for the source image.
 */
ImageElement._StyleTypes.ImageSourceClipX = 			StyleableBase.EStyleType.NORMAL;		// null || number

/**
 * @style ImageSourceClipY Number
 * Y position in pixels of the clip area for the source image.
 */
ImageElement._StyleTypes.ImageSourceClipY = 			StyleableBase.EStyleType.NORMAL;		// null || number

/**
 * @style ImageSourceClipWidth Number
 * Width in pixels of the clip area for the source image.
 */
ImageElement._StyleTypes.ImageSourceClipWidth = 		StyleableBase.EStyleType.NORMAL;		// null || number

/**
 * @style ImageSourceClipHeight Number
 * Height in pixels of the clip area for the source image.
 */
ImageElement._StyleTypes.ImageSourceClipHeight = 		StyleableBase.EStyleType.NORMAL;		// null || number

/**
 * @style ImageScaleType String
 * Determines how the image should be stretched or scaled. Allowable values are "none", "fit", "stretch", "tile", or "tilefit".
 * "none" will not modify the original image, 
 * "fit" stretches the image but maintains the aspect ratio to fit the available area's minimum width/height constraint,
 * "stretch" stretches the image to fit the entire available area disregarding aspect ratio,
 * "tile" will not modify the original image but repeat it in both directions to fill the available area.
 * "tilefit" stretches the image but maintains the aspect ratio, any remaining space in the areas maximum width/height constraint is tiled with the stretched image.
 */
ImageElement._StyleTypes.ImageScaleType = 				StyleableBase.EStyleType.NORMAL;		// "none" || "fit" || "stretch" || "tile" || "tilefit"

/**
 * @style ImageVerticalAlign String
 * Aligns the image vertically when using ImageScaleType "none" or "fit" and not all of the available space is consumed.
 * Allowable values are "top", "middle", "bottom".
 */
ImageElement._StyleTypes.ImageVerticalAlign = 			StyleableBase.EStyleType.NORMAL;		// "top" || "middle" || "bottom"

/**
 * @style ImageHorizontalAlign String
 * Aligns the image horizontally when using ImageScaleType "none" or "fit" and not all of the available space is consumed.
 * Allowable values are "left", "center", "right".
 */
ImageElement._StyleTypes.ImageHorizontalAlign = 		StyleableBase.EStyleType.NORMAL;		// "left" || "center" || "right"


////////////Default Styles////////////////////////////

ImageElement.StyleDefault = new StyleDefinition();

ImageElement.StyleDefault.setStyle("ImageSource", 						null);			// null || image || "url"
ImageElement.StyleDefault.setStyle("ImageSourceClipX", 					null);			// null || number
ImageElement.StyleDefault.setStyle("ImageSourceClipY", 					null);			// null || number
ImageElement.StyleDefault.setStyle("ImageSourceClipWidth", 				null);			// null || number
ImageElement.StyleDefault.setStyle("ImageSourceClipHeight", 			null);			// null || number

ImageElement.StyleDefault.setStyle("ImageScaleType", 					"stretch");		// "none" || "fit" || "stretch" || "tile" || "tilefit"
ImageElement.StyleDefault.setStyle("ImageHorizontalAlign", 				"left");		// "left" || "center" || "right"
ImageElement.StyleDefault.setStyle("ImageVerticalAlign", 				"top");			// "top" || "middle" || "bottom"


/////////////ImageElement Protected Functions///////////////////

//@Override
ImageElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		ImageElement.base.prototype._doStylesUpdated.call(this, stylesMap);
	
		if ("ImageSource" in stylesMap)
		{
			var newSource = this.getStyle("ImageSource");
			if (this._imageSource != newSource)
			{
				//Clean up old loader
				if (this._imageLoader != null && this._imageLoadComplete == false)
					this._imageLoader.removeEventListener("load", this._onImageElementLoadCompleteInstance);
				
				this._imageLoader = null;
				this._imageLoadComplete = false;
				
				//May be img, string, TODO: Canvas / Video
				this._imageSource = newSource;
				
				if (this._imageSource instanceof HTMLImageElement)
				{
					this._imageLoader = this._imageSource;
					this._imageLoadComplete = this._imageSource.complete;
					
					if (this._imageLoadComplete == false)
						this._imageLoader.addEventListener("load", this._onImageElementLoadCompleteInstance, false);
				}
				else
				{
					this._imageLoader = new Image();
					this._imageLoader.addEventListener("load", this._onImageElementLoadCompleteInstance, false);
					this._imageLoader.src = this._imageSource;
				}
				
				this._invalidateMeasure();
				this._invalidateRender();
			}
		}
		else
		{
			if ("ImageSourceClipX" in stylesMap ||
				"ImageSourceClipY" in stylesMap ||
				"ImageSourceClipWidth" in stylesMap ||
				"ImageSourceClipHeight" in stylesMap)
			{
				this._invalidateMeasure();
				this._invalidateRender();
			}
			else if ("ImageScaleType" in stylesMap ||
					"ImageVerticalAlign" in stylesMap ||
					"ImageHorizontalAlign" in stylesMap)
			{
				this._invalidateRender();
			}
		}
	};
	
//@Override
ImageElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		var measuredSize = {width: padWidth, height: padHeight};
		
		var clipX = this.getStyle("ImageSourceClipX");
		var clipY = this.getStyle("ImageSourceClipY");
		
		var clipWidth = this.getStyle("ImageSourceClipWidth");
		var clipHeight = this.getStyle("ImageSourceClipHeight");
		
		if (clipX == null)
			clipX = 0;
		
		if (clipY == null)
			clipY = 0;
		
		if (clipWidth != null)
			measuredSize.width += clipWidth;
		else if (this._imageLoadComplete == true)
			measuredSize.width += (this._imageLoader.naturalWidth - clipX);

		if (clipHeight != null)
			measuredSize.height += clipHeight;
		else if (this._imageLoadComplete == true)
			measuredSize.height += (this._imageLoader.naturalHeight - clipY);
		
		return measuredSize;
	};	
	
//@Override
ImageElement.prototype._doRender =
	function()
	{
		ImageElement.base.prototype._doRender.call(this);
		
		if (this._imageLoadComplete == false)
			return;
		
		var paddingMetrics = this._getPaddingMetrics();
		var ctx = this._getGraphicsCtx();
		
		var x = paddingMetrics.getX();
		var y = paddingMetrics.getY();
		var w = paddingMetrics.getWidth();
		var h = paddingMetrics.getHeight();
		
		if (w <= 0 || h <= 0)
			return;
		
		var clipX = this.getStyle("ImageSourceClipX");
		var clipY = this.getStyle("ImageSourceClipY");
		var clipW = this.getStyle("ImageSourceClipWidth");
		var clipH = this.getStyle("ImageSourceClipHeight");
		
		var scaleType = this.getStyle("ImageScaleType");
		
		if (clipX == null)
			clipX = 0;
		if (clipY == null)
			clipY = 0;
		
		if (clipW == null)
			clipW = this._imageLoader.naturalWidth - clipX;
		if (clipH == null)
			clipH = this._imageLoader.naturalHeight - clipY;
		
		if (clipW <= 0 || clipH <= 0)
			return;
		
		if (scaleType == "stretch")
		{
			ctx.drawImage(
				this._imageLoader, 
				clipX, clipY, clipW, clipH, 
				x, y, w, h);
		}
		else if (scaleType == "tile")
		{
			var currentX = x;
			var currentY = y;
			
			var drawWidth = clipW;
			var drawHeight = clipH;
			
			while (true)
			{
				drawWidth = Math.min(clipW, x + w - currentX);
				drawHeight = Math.min(clipH, y + h - currentY);
				
				ctx.drawImage(
					this._imageLoader, 
					clipX, clipY, drawWidth, drawHeight, 
					currentX, currentY, drawWidth, drawHeight);
				
				currentX += drawWidth;
				if (currentX >= x + w)
				{
					currentX = x;
					currentY += drawHeight;
					
					if (currentY >= y + h)
						break;
				}
			}
		}
		else if (scaleType == "tilefit")
		{
			var thisRatio = w / h;
			var imageRatio = clipW / clipH;
			
			var drawWidth = clipW;
			var drawHeight = clipH;
			
			//Size to our height
			if (thisRatio > imageRatio)
			{
				var currentX = x;
				
				drawHeight = h;
				drawWidth = h * imageRatio;
				
				while (true)
				{
					if (currentX + drawWidth > x + w)
					{
						var availableWidth = x + w - currentX;
						var widthRatio = availableWidth / drawWidth;
						
						ctx.drawImage(
							this._imageLoader, 
							clipX, clipY, clipW * widthRatio, clipH, 
							currentX, y, drawWidth * widthRatio, drawHeight);
						
						break;
					}
					else
					{
						ctx.drawImage(
							this._imageLoader, 
							clipX, clipY, clipW, clipH, 
							currentX, y, drawWidth, drawHeight);
						
						currentX += drawWidth;
						if (currentX == x + w)
								break;
					}
				}
			}
			else //Size to our width
			{
				var currentY = y;
				
				drawWidth = w;
				drawHeight = w / imageRatio;
				
				while (true)
				{
					if (currentY + drawHeight > y + h)
					{
						var availableHeight = y + h - currentY;
						var heightRatio = availableHeight / drawHeight;
						
						ctx.drawImage(
							this._imageLoader, 
							clipX, clipY, clipW, clipH * heightRatio, 
							x, currentY, drawWidth, drawHeight * heightRatio);
						
						break;
					}
					else
					{
						ctx.drawImage(
							this._imageLoader, 
							clipX, clipY, clipW, clipH, 
							x, currentY, drawWidth, drawHeight);
						
						currentY += drawHeight;
						if (currentY == y + h)
							break;
					}
				}
			}
		}
		else if (scaleType == "fit" || scaleType == "none")
		{
			var verticalAlign = this.getStyle("ImageVerticalAlign");
			var horizontalAlign = this.getStyle("ImageHorizontalAlign");
			
			var drawWidth = clipW;
			var drawHeight = clipH;
			
			if (scaleType == "fit")
			{
				var thisRatio = w / h;
				var imageRatio = clipW / clipH;
				
				//Size to our height
				if (thisRatio > imageRatio)
				{
					drawHeight = h;
					drawWidth = h * imageRatio;
				}
				else //Size to our width
				{
					drawWidth = w;
					drawHeight = w / imageRatio;
				}
			}
			else //scaleType == "none"
			{
				//Reduce image clipping area to render size.
				if (w < clipW)
				{
					if (horizontalAlign == "right")
						clipX += (clipW - w);
					else if (horizontalAlign == "center")
						clipX += ((clipW - w) / 2);
					
					clipW = w;
					drawWidth = w;
				}
				if (h < clipH)
				{
					if (verticalAlign == "bottom")
						clipY += (clipH - h);
					else if (verticalAlign == "middle")
						clipY += ((clipH - h) / 2);
					
					clipH = h;
					drawHeight = h;
				}
			}
			
			var drawX = x;
			var drawY = y;
			
			if (horizontalAlign == "right")
				drawX += w - drawWidth;
			else if (horizontalAlign == "center")
				drawX += ((w - drawWidth) / 2);
			
			if (verticalAlign == "bottom")
				drawY += h - drawHeight;
			else if (verticalAlign == "middle")
				drawY += ((h - drawHeight) / 2);
			
			ctx.drawImage(
				this._imageLoader, 
				clipX, clipY, clipW, clipH, 
				drawX, drawY, drawWidth, drawHeight);
		}
		
	};
	
	
	


/**
 * @depends SkinnableElement.js
 */

///////////////////////////////////////////////////////////////////////
///////////////////////DataRendererBaseElement/////////////////////////
	
/**
 * @class DataRendererBaseElement
 * @inherits SkinnableElement
 * 
 * Abstract base class for DataList item rendering. Any CanvasElement
 * can be a data renderer. This class is just here for convenience as it
 * implements some commonly used functionality if you wish to subclass it. 
 * 
 * Adds skin states and styles for "up", "alt", "over", and "selected" states. 
 *  
 * 
 * @constructor DataRendererBaseElement 
 * Creates new DataRendererBaseElement instance.
 */
function DataRendererBaseElement()
{
	DataRendererBaseElement.base.prototype.constructor.call(this);
	
	var _self = this;
	
	//Private event handler, proxy to prototype.
	this._onDataRendererBaseEventInstance = 
		function (elementEvent)
		{
			if (elementEvent.getType() == "rollover")
				_self._onDataRendererRollover(elementEvent);
			else if (elementEvent.getType() == "rollout")
				_self._onDataRendererRollout(elementEvent);
		};
		
	this.addEventListener("rollover", this._onDataRendererBaseEventInstance);
	this.addEventListener("rollout", this._onDataRendererBaseEventInstance);
}
	
//Inherit from SkinnableElement
DataRendererBaseElement.prototype = Object.create(SkinnableElement.prototype);
DataRendererBaseElement.prototype.constructor = DataRendererBaseElement;
DataRendererBaseElement.base = SkinnableElement;


/////////////Style Types////////////////////////////////////////////

DataRendererBaseElement._StyleTypes = Object.create(null);

/**
 * @style SkinClass CanvasElement
 * 
 * The CanvasElement constructor type to apply to all skin states. 
 * Specific states such as UpSkinClass will override SkinClass.
 */
DataRendererBaseElement._StyleTypes.SkinClass =					StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style UpSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the data renderer skin when in the "up" state. 
 * This will override SkinClass.
 */
DataRendererBaseElement._StyleTypes.UpSkinClass = 				StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style UpSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "up" state skin element.
 */
DataRendererBaseElement._StyleTypes.UpSkinStyle = 				StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

/**
 * @style AltSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the data renderer skin when in the "alt" state. 
 * This is used to create different styles for alternating rows. 
 * This will override SkinClass.
 */
DataRendererBaseElement._StyleTypes.AltSkinClass = 				StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style AltSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "alt" state skin element.
 */
DataRendererBaseElement._StyleTypes.AltSkinStyle = 				StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

/**
 * @style OverSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the data renderer skin when in the "over" state. 
 * This will override SkinClass.
 */
DataRendererBaseElement._StyleTypes.OverSkinClass = 			StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style OverSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "over" state skin element.
 */
DataRendererBaseElement._StyleTypes.OverSkinStyle = 			StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

/**
 * @style SelectedSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the data renderer skin when in the "selected" state. 
 * This will override SkinClass.
 */
DataRendererBaseElement._StyleTypes.SelectedSkinClass = 		StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style SelectedSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "selected" state skin element.
 */
DataRendererBaseElement._StyleTypes.SelectedSkinStyle = 		StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

//Proxied from DataList (intended only for reading)
/**
 * @style Selectable boolean
 * 
 * When false, prevents "over" and "selected" states. Proxied from parent DataList.
 */
DataRendererBaseElement._StyleTypes.Selectable = 				StyleableBase.EStyleType.NORMAL;		// true || false


///////////Default Styles///////////////////////////////////////////

DataRendererBaseElement.StyleDefault = new StyleDefinition();

//Skin Defaults////////////////////////////
DataRendererBaseElement.OverSkinStyleDefault = new StyleDefinition();

DataRendererBaseElement.OverSkinStyleDefault.setStyle("BackgroundColor", 			"#E0E0E0");
DataRendererBaseElement.OverSkinStyleDefault.setStyle("AutoGradientType", 			"linear");
DataRendererBaseElement.OverSkinStyleDefault.setStyle("AutoGradientStart", 			(+.03));
DataRendererBaseElement.OverSkinStyleDefault.setStyle("AutoGradientStop", 			(-.03));

DataRendererBaseElement.SelectedSkinStyleDefault = new StyleDefinition();

DataRendererBaseElement.SelectedSkinStyleDefault.setStyle("BackgroundColor", 			"#CDCDCD");
DataRendererBaseElement.SelectedSkinStyleDefault.setStyle("AutoGradientType", 			"linear");
DataRendererBaseElement.SelectedSkinStyleDefault.setStyle("AutoGradientStart", 			(+.03));
DataRendererBaseElement.SelectedSkinStyleDefault.setStyle("AutoGradientStop", 			(-.03));
//////////////////////////////////////////

DataRendererBaseElement.StyleDefault.setStyle("Selectable", 			true);												// intended only for reading, its proxied from DataList

DataRendererBaseElement.StyleDefault.setStyle("SkinClass", 				CanvasElement);										// Element constructor()
DataRendererBaseElement.StyleDefault.setStyle("UpSkinClass", 			CanvasElement);										// Element constructor()
DataRendererBaseElement.StyleDefault.setStyle("AltSkinClass", 			CanvasElement);										// Element constructor()
DataRendererBaseElement.StyleDefault.setStyle("OverSkinClass", 			CanvasElement);										// Element constructor()
DataRendererBaseElement.StyleDefault.setStyle("SelectedSkinClass", 		CanvasElement);										// Element constructor()

DataRendererBaseElement.StyleDefault.setStyle("UpSkinStyle", 			null);												// StyleDefinition
DataRendererBaseElement.StyleDefault.setStyle("AltSkinStyle", 			null);												// StyleDefinition
DataRendererBaseElement.StyleDefault.setStyle("OverSkinStyle", 			DataRendererBaseElement.OverSkinStyleDefault);		// StyleDefinition
DataRendererBaseElement.StyleDefault.setStyle("SelectedSkinStyle", 		DataRendererBaseElement.SelectedSkinStyleDefault);	// StyleDefinition


/////////////Internal///////////////////////////

/**
 * @function _updateState
 * Updates the SkinState style in response to mouse and ListData changes.
 */
DataRendererBaseElement.prototype._updateState = 
	function ()
	{
		var newState = "";
	
		if (this._listSelected == true)
			newState = "selected";
		else if (this._mouseIsOver == true && this.getStyle("Selectable") == true)
			newState = "over";
		else // "up"
		{
			if (this._listData == null || this._listData._itemIndex % 2 == 0)
				newState = "up";
			else
				newState = "alt";
		}
		
		this.setStyle("SkinState", newState);
	};

//@Override
DataRendererBaseElement.prototype._getSkinClass = 
	function (state)
	{
		var stateSkinClass = null;
		
		if (state == "up")
			stateSkinClass = this.getStyleData("UpSkinClass");
		else if (state == "alt")
			stateSkinClass = this.getStyleData("AltSkinClass");
		else if (state == "over")
			stateSkinClass = this.getStyleData("OverSkinClass");
		else if (state == "selected")
			stateSkinClass = this.getStyleData("SelectedSkinClass");
		
		var skinClass = this.getStyleData("SkinClass");
		
		//Shouldnt have null stateSkinClass
		if (stateSkinClass == null || skinClass.comparePriority(stateSkinClass) > 0) //Use skinClass if higher priority
			return skinClass.value;
		
		return stateSkinClass.value;
	};
		
//@override	
DataRendererBaseElement.prototype._getSubStyleNameForSkinState = 
	function (state)
	{
		if (state == "up")
			return "UpSkinStyle";
		if (state == "alt")
			return "AltSkinStyle";
		if (state == "over")
			return "OverSkinStyle";
		if (state == "selected")
			return "SelectedSkinStyle";
		
		return DataRendererBaseElement.base.prototype._getSubStyleNameForSkinState.call(this, state);
	};	
	
/**
 * @function _onDataRendererRollover
 * Event handler for "rollover" event. Updates the skin state.
 * Overriding this is more efficient than adding an additional "rollover" event listener.
 * 
 * @param elementEvent ElementEvent
 * The ElementEvent to process.
 */		
DataRendererBaseElement.prototype._onDataRendererRollover = 
	function (elementEvent)
	{
		this._updateState();
	};
	
/**
 * @function _onDataRendererRollout
 * Event handler for "rollout" event. Updates the skin state.
 * Overriding this is more efficient than adding an additional "rollout" event listener.
 * 
 * @param elementEvent ElementEvent
 * The ElementEvent to process.
 */		
DataRendererBaseElement.prototype._onDataRendererRollout = 
	function (elementEvent)
	{
		this._updateState();
	};

//@Override	
DataRendererBaseElement.prototype._setListSelected = 
	function (selected)
	{
		DataRendererBaseElement.base.prototype._setListSelected.call(this, selected);
		
		this._updateState();
	};
	
//@Override	
DataRendererBaseElement.prototype._setListData = 
	function (listData, itemData)
	{
		DataRendererBaseElement.base.prototype._setListData.call(this, listData, itemData);
		
		this._updateState();
	};

//@Override
DataRendererBaseElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		DataRendererBaseElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		
		////Update skin classes and sub styles.
		if ("SkinClass" in stylesMap || "UpSkinClass" in stylesMap)
			this._updateSkinClass("up");
		if ("UpSkinStyle" in stylesMap)
			this._updateSkinStyleDefinitions("up");
		
		if ("SkinClass" in stylesMap || "AltSkinClass" in stylesMap)
			this._updateSkinClass("alt");
		if ("AltSkinStyle" in stylesMap)
			this._updateSkinStyleDefinitions("alt");
		
		if ("SkinClass" in stylesMap || "OverSkinClass" in stylesMap)
			this._updateSkinClass("over");
		if ("OverSkinStyle" in stylesMap)
			this._updateSkinStyleDefinitions("over");
		
		if ("SkinClass" in stylesMap || "SelectedSkinClass" in stylesMap)
			this._updateSkinClass("selected");
		if ("SelectedSkinStyle" in stylesMap)
			this._updateSkinStyleDefinitions("selected");		
		
		if ("Selectable" in stylesMap)
			this._updateState();
	};
	
	


/**
 * @depends DataRendererBaseElement.js
 */

///////////////////////////////////////////////////////////////////////
///////////////////////DataRendererLabelElement////////////////////////

/**
 * @class DataRendererLabelElement
 * @inherits DataRendererBaseElement
 * 
 * DataList DataRenderer for a basic label.
 * Adds text color styles for DataRenderer states and 
 * sets label text when the parent DataList sets our list data.
 * 
 * @constructor DataRendererLabelElement 
 * Creates new DataRendererLabelElement instance.
 */
function DataRendererLabelElement()
{
	DataRendererLabelElement.base.prototype.constructor.call(this);
	
	this._labelElement = new LabelElement();
	this._labelElement.setStyle("Padding", 0); //Wipe out default padding (no doubly padding, only this elements padding is necessary)
	
	this._addChild(this._labelElement);
}
	
//Inherit from DataRendererBaseElement
DataRendererLabelElement.prototype = Object.create(DataRendererBaseElement.prototype);
DataRendererLabelElement.prototype.constructor = DataRendererLabelElement;
DataRendererLabelElement.base = DataRendererBaseElement;


/////////////Style Types/////////////////////////

DataRendererLabelElement._StyleTypes = Object.create(null);

/**
 * @style UpTextColor String
 * 
 * Hex color value to be used for the label when in the "up" state. Format like "#FF0000" (red).
 * This will override the TextColor style of equal priority.
 */
DataRendererLabelElement._StyleTypes.UpTextColor = 				StyleableBase.EStyleType.NORMAL;		//"#000000"

/**
 * @style AltTextColor String
 * 
 * Hex color value to be used for the label when in the "alt" state. Format like "#FF0000" (red).
 * This will override the TextColor style of equal priority.
 */
DataRendererLabelElement._StyleTypes.AltTextColor = 			StyleableBase.EStyleType.NORMAL;		//"#000000"

/**
 * @style OverTextColor String
 * 
 * Hex color value to be used for the label when in the "over" state. Format like "#FF0000" (red).
 * This will override the TextColor style of equal priority.
 */
DataRendererLabelElement._StyleTypes.OverTextColor = 			StyleableBase.EStyleType.NORMAL;		//"#000000"

/**
 * @style SelectedTextColor String
 * 
 * Hex color value to be used for the label when in the "selected" state. Format like "#FF0000" (red).
 * This will override the TextColor style of equal priority.
 */
DataRendererLabelElement._StyleTypes.SelectedTextColor = 		StyleableBase.EStyleType.NORMAL;		//"#000000"


////////////Default Styles///////////////////////

DataRendererLabelElement.StyleDefault = new StyleDefinition();

DataRendererLabelElement.StyleDefault.setStyle("PaddingTop", 				4);
DataRendererLabelElement.StyleDefault.setStyle("PaddingBottom", 			4);
DataRendererLabelElement.StyleDefault.setStyle("PaddingLeft", 				4);
DataRendererLabelElement.StyleDefault.setStyle("PaddingRight", 				4);
DataRendererLabelElement.StyleDefault.setStyle("BorderType", 				"none");

DataRendererLabelElement.StyleDefault.setStyle("UpTextColor", 				"#000000");
DataRendererLabelElement.StyleDefault.setStyle("AltTextColor", 				"#000000");
DataRendererLabelElement.StyleDefault.setStyle("OverTextColor", 			"#000000");
DataRendererLabelElement.StyleDefault.setStyle("SelectedTextColor", 		"#000000");


////////////Internal/////////////////////////////

//@Override
DataRendererLabelElement.prototype._changeState = 
	function (state)
	{
		DataRendererLabelElement.base.prototype._changeState.call(this, state);
		
		this._updateLabelTextColor();
	};
	
/**
 * @function _getTextColor
 * Gets the text color style for the supplied state.
 * 
 * @param state String
 * The current state.
 * 
 * @returns String
 * Text color style for the supplied state.
 */	
DataRendererLabelElement.prototype._getTextColor = 
	function (state)
	{
		var stateTextColor = null;
		
		if (state == "up")
			stateTextColor = this.getStyleData("UpTextColor");
		else if (state == "alt")
			stateTextColor = this.getStyleData("AltTextColor");
		else if (state == "over")
			stateTextColor = this.getStyleData("OverTextColor");
		else if (state == "selected")
			stateTextColor = this.getStyleData("SelectedTextColor");
	
		var textColor = this.getStyleData("TextColor");
		
		//Shouldnt have null stateTextColor
		if (stateTextColor == null || textColor.comparePriority(stateTextColor) > 0) //Use textColor if higher priority
			return textColor.value;
		
		return stateTextColor.value;
	};

/**
 * @function _updateLabelTextColor
 * Updates the text color base on the current state.
 */	
DataRendererLabelElement.prototype._updateLabelTextColor = 
	function ()
	{
		var color = this._getTextColor(this._currentSkinState);
		if (color != null)
			this._labelElement.setStyle("TextColor", color);
	};
	
/**
 * @function _updateLabelTextColor
 * Updates the label text base on the list data and ItemLabelFunction.
 */		
DataRendererLabelElement.prototype._updateLabelText = 
	function ()
	{
		if (this._itemData == null)
			this._labelElement.setStyle("Text", "");
		else
		{
			var labelFunction = this._listData._parentList.getStyle("ItemLabelFunction");
			this._labelElement.setStyle("Text", labelFunction(this._itemData));
		}
	};
	
//@Override
DataRendererLabelElement.prototype._setListData = 
	function (listData, itemData)
	{
		DataRendererLabelElement.base.prototype._setListData.call(this, listData, itemData);
		
		this._updateLabelText();
	};

//@Override
DataRendererLabelElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		DataRendererLabelElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		this._updateLabelTextColor();
	};

//@Override
DataRendererLabelElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		return {width: this._labelElement._getStyledOrMeasuredWidth() + padWidth, 
				height: this._labelElement._getStyledOrMeasuredHeight() + padHeight};
	};

//@Override	
DataRendererLabelElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		DataRendererLabelElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		this._labelElement._setActualPosition(paddingMetrics.getX(), paddingMetrics.getY());
		this._labelElement._setActualSize(paddingMetrics.getWidth(), paddingMetrics.getHeight());
	};
	
	


/**
 * @depends CanvasElement.js
 * @depends DataRendererLabelElement.js
 */

///////////////////////////////////////////////////////////////////////
///////////////////////DataListElement/////////////////////////////////		
	
/**
 * @class DataListElement
 * @inherits CanvasElement
 * 
 * DataListElement is a data-driven container that renders items in a 
 * horizontal or vertical orientation via a supplied ListCollection and a supplied DataRenderer class.
 * A DataRenderer is any CanvasElement that implements _setListData() and _setListSelected()
 * and is used to render the corresponding ListCollection item. A scroll bar will be added
 * if the collection size exceeds the available area. DataListElement only renders visible 
 * DataRenderers so collection size does not impact performance.
 * 
 * DataRendereBaseElement is an abstract base class that implements common
 * features and can be sub-classed if desired.
 * 
 * The default DataRenderer is the DataRendererLabelElement which renders
 * a text label per the LabelFunction style. 
 * 
 * @seealso DataRendererBaseElement
 * @seealso DataRendererLabelElement
 * 
 * 
 * @constructor DataListElement 
 * Creates new DataListElement instance.
 */
function DataListElement()
{
	DataListElement.base.prototype.constructor.call(this);
	
	this._listCollection = null; //Data collection
	
	this._contentSize = 0;
	
	this._scrollBar = null;
	this._scrollIndex = 0;
	
	this._selectedIndex = -1;
	this._selectedItem = null;
	
	this._contentPane = new CanvasElement();
	this._contentPane.setStyle("ClipContent", true);
	this._addChild(this._contentPane);
	
	var _self = this;
	
	//Private event listener, need an instance for each DataList, proxy to prototype.
	this._onDataListCollectionChangedInstance = 
		function (collectionChangedEvent)
		{
			_self._onDataListCollectionChanged(collectionChangedEvent);
		};
	this._onDataListScrollBarChangedInstance = 
		function (elementEvent)
		{
			_self._onDataListScrollBarChanged(elementEvent);
		};
	this._onDataListMouseWheelEventInstance = 
		function (elementMouseWheelEvent)
		{
			_self._onDataListMouseWheelEvent(elementMouseWheelEvent);
		};
	this._onDataListRendererClickInstance = 
		function (elementMouseEvent)
		{
			_self._onDataListRendererClick(elementMouseEvent);
		};
	this._onContentPaneMeasureCompleteInstance = 
		function (event)
		{
			_self._onContentPaneMeasureComplete(event);
		};	
		
	this.addEventListener("wheel", this._onDataListMouseWheelEventInstance);	
	this._contentPane.addEventListener("measurecomplete", this._onContentPaneMeasureCompleteInstance);
}

//Inherit from SkinnableElement
DataListElement.prototype = Object.create(CanvasElement.prototype);
DataListElement.prototype.constructor = DataListElement;
DataListElement.base = CanvasElement;

/**
 * @function DefaultItemLabelFunction
 * @static
 * Default ItemLabelFunction function. Looks for typeof String or "label" property of supplied itemData.
 * 
 * @param itemData Object
 * Collection item to extract label text.
 * 
 * @returns String
 * Label text.
 */
DataListElement.DefaultItemLabelFunction = 
	function (itemData)
	{
		if (itemData == null)
			return "";
		
		if (typeof itemData === "string" || itemData instanceof String)
			return itemData;
	
		if ("label" in itemData)
			return itemData["label"];
		
		return itemData.toString();
	};


/////////////Events///////////////////////////////

/**
 * @event changed ElementEvent
 * Dispatched when the selected item/index changes as a result of user interaction.
 * 
 * @event listitemclick ElementListItemClickEvent
 * Dispatched when a DataRenderer is clicked. Includes associated collection item/index.
 */



/////////////Style Types////////////////////////////////////////////

DataListElement._StyleTypes = Object.create(null);

/**
 * @style LayoutDirection String
 * 
 * Determines the layout direction of this DataList. Allowable values are "horizontal" or "vertical".
 */
DataListElement._StyleTypes.LayoutDirection = 					StyleableBase.EStyleType.NORMAL;		// "horizontal" || "vertical

/**
 * @style LayoutGap Number
 * 
 * Space in pixels to leave between child elements. 
 * (Not yet implemented)
 */
DataListElement._StyleTypes.LayoutGap = 						StyleableBase.EStyleType.NORMAL;		// number

/**
 * @style LayoutVerticalAlign String
 * 
 * Child vertical alignment to be used when children do not fill all available space. Allowable values are "top", "bottom", or "middle". 
 * (Only partially implemented, depending on LayoutDirection)
 */
DataListElement._StyleTypes.LayoutVerticalAlign = 				StyleableBase.EStyleType.NORMAL;		// "top" || "bottom" || "middle" 

/**
 * @style LayoutHorizontalAlign String
 * 
 * Child horizontal alignment to be used when children do not fill all available space. Allowable values are "left", "right", or "center". 
 * (Only partially implemented, depending on LayoutDirection)
 */
DataListElement._StyleTypes.LayoutHorizontalAlign = 			StyleableBase.EStyleType.NORMAL;		//"left" || "right" || "center"

/**
 * @style Selectable boolean
 * 
 * When true, list items can be selected and the DataList will dispatch "changed" events.
 */
DataListElement._StyleTypes.Selectable = 						StyleableBase.EStyleType.NORMAL;		// true || false

/**
 * @style ScrollBarDisplay String
 * 
 * Determines the behavior of the scroll bar. Allowable values are "on", "off", and "auto".
 */
DataListElement._StyleTypes.ScrollBarDisplay = 					StyleableBase.EStyleType.NORMAL;		// "on" || "off" || "auto"

/**
 * @style ScrollBarPlacement String
 * 
 * Determines the placement of the scroll bar. 
 * Allowable values are "top" or "bottom" for horizontal layout and "left" or "right" for vertical layout.
 */
DataListElement._StyleTypes.ScrollBarPlacement = 				StyleableBase.EStyleType.NORMAL;		// "top" || "bottom" / "left || "right"

/**
 * @style ScrollBarStyle StyleDefinition
 * 
 * The StyleDefinition to be applied to the scroll bar.
 */
DataListElement._StyleTypes.ScrollBarStyle = 					StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition

//Returns the string to use for the label per provided data.
/**
 * @style ItemLabelFunction Function
 * 
 * A function that returns a text string per a supplied collection item.
 * function (itemData) { return "" }
 */
DataListElement._StyleTypes.ItemLabelFunction = 				StyleableBase.EStyleType.NORMAL; 		// function (itemData) { return "" }

/**
 * @style ListItemClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the DataRenderer.
 */
DataListElement._StyleTypes.ListItemClass = 					StyleableBase.EStyleType.NORMAL;		//DataRendererBaseElement constructor()

/**
 * @style ListItemStyle StyleDefinition
 * 
 * The StyleDefinition to be applied to the DataRenderer.
 */
DataListElement._StyleTypes.ListItemStyle = 					StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition


///////////Default Styles////////////////////////////////////

DataListElement.StyleDefault = new StyleDefinition();

DataListElement.StyleDefault.setStyle("LayoutDirection", 			"vertical");								// "horizontal" || "vertical
DataListElement.StyleDefault.setStyle("LayoutVerticalAlign", 		"top");										//"top" || "middle" || "bottom"
DataListElement.StyleDefault.setStyle("LayoutHorizontalAlign", 		"left");									//"left" || "center" || "right"
DataListElement.StyleDefault.setStyle("LayoutGap", 					0);											//number

DataListElement.StyleDefault.setStyle("ItemLabelFunction", 			DataListElement.DefaultItemLabelFunction);	// function (data) { return "" }

DataListElement.StyleDefault.setStyle("ListItemClass", 				DataRendererLabelElement); 					// Element constructor()
DataListElement.StyleDefault.setStyle("ListItemStyle", 				null);										// StyleDefinition

DataListElement.StyleDefault.setStyle("Selectable", 				true);										// true || false

DataListElement.StyleDefault.setStyle("ScrollBarDisplay", 			"auto");									// "on" || "off" || "auto"
DataListElement.StyleDefault.setStyle("ScrollBarPlacement", 		"right");									// "top" || "bottom" / "left || "right"
DataListElement.StyleDefault.setStyle("ScrollBarStyle", 			null);										// StyleDefinition


/////////DataRenderer Proxy Map/////////////////////////////

//Proxy map for styles we want to pass to the DataRenderer.
DataListElement._DataRendererProxyMap = Object.create(null);

DataListElement._DataRendererProxyMap.Selectable = 				true;
DataListElement._DataRendererProxyMap._Arbitrary = 				true;


/////////////Public///////////////////////////////

/**
 * @function setSelectedIndex
 * Sets the selected collection index/item.
 * 
 * @param index int
 * The collection index to be selected.
 */	
DataListElement.prototype.setSelectedIndex = 
	function (index)
	{
		if (this._selectedIndex == index)
			return true;
		
		if (index > this._listCollection.length -1)
			return false;
		
		if (index < -1)
			index = -1;
		
		var oldIndex = this._selectedIndex;
		
		this._selectedIndex = index;
		this._selectedItem = this._listCollection.getItemAt(index);
		
		//Update renderer data.
		if (this._contentPane._children.length > 0)
		{
			var firstIndex = this._contentPane._children[0]._listData._itemIndex;
			var lastIndex = this._contentPane._children[this._contentPane._children.length - 1]._listData._itemIndex;
			
			if (index != null && index >= firstIndex && index <= lastIndex)
				this._contentPane._children[index - firstIndex]._setListSelected(true);
			if (oldIndex != null && oldIndex >= firstIndex && oldIndex <= lastIndex)
				this._contentPane._children[oldIndex - firstIndex]._setListSelected(false);
		}
		
		return true;
	};

/**
 * @function getSelectedIndex
 * Gets the selected collection index. 
 * 
 * @returns int
 * The selected collection index or -1 if none selected.
 */		
DataListElement.prototype.getSelectedIndex = 
	function ()
	{
		return this._selectedIndex;
	};
	
/**
 * @function setSelectedItem
 * Sets the selected collection item/index.
 * 
 * @param item Object
 * The collection item to be selected.
 */	
DataListElement.prototype.setSelectedItem = 
	function (item)
	{
		var index = this._listCollection.getItemIndex(item);
		this.setSelectedIndex(index);
	};
	
/**
 * @function getSelectedItem
 * Gets the selected collection item. 
 * 
 * @returns Object
 * The selected collection item or null if none selected.
 */		
DataListElement.prototype.getSelectedItem = 
	function ()
	{
		return this._selectedItem;
	};
	
/**
 * @function setScrollIndex
 * Sets the collection item index to scroll too. 
 * 
 * @param scrollIndex int
 * Collection item index.
 */	
DataListElement.prototype.setScrollIndex = 
	function (scrollIndex)
	{
		scrollIndex = CanvasElement.roundToPrecision(scrollIndex, 6);
	
		this._invalidateLayout();
		
		if (this._contentPane._children.length == 0 || this._listCollection == null)
		{
			this._scrollIndex = 0;
			
			//No data, purge the renderers.
			while (this._contentPane._children.length > 0)
				this._contentPane._removeChildAt(0);
			
			return;
		}
		
		if (scrollIndex >= this._listCollection.getLength())
			scrollIndex = this._listCollection.getLength() - 1;
		if (scrollIndex < 0)
			scrollIndex = 0;		
		
		this._scrollIndex = scrollIndex;
		
		var itemIndex = Math.floor(scrollIndex);
		var currentIndex = this._contentPane._children[0]._listData._itemIndex;
		
		var renderer = null;
		
		if (itemIndex == currentIndex - 1) //Move bottom renderer to top
		{
			renderer = this._contentPane._children[this._contentPane._children.length - 1];
			this._contentPane._setChildIndex(renderer, 0);
			
			this._updateRendererData(renderer, itemIndex);
		}
		else if (itemIndex == currentIndex + 1) //Move top renderer to bottom (or delete)
		{
			if (this._listCollection.getLength() >= itemIndex + this._contentPane._children.length)
			{
				renderer = this._contentPane._children[0];
				this._contentPane._setChildIndex(renderer, this._contentPane._children.length - 1);
				
				this._updateRendererData(renderer, itemIndex + this._contentPane._children.length - 1);
			}
			else //No more data, purge the renderer.
				this._contentPane._removeChildAt(0);
		}
		else //Reset renderer data. (Even if index hasnt changed, we call this if the collection is sorted or changed)
		{
			for (var i = 0; i < this._contentPane._children.length; i++)
			{
				if (this._listCollection.getLength() > itemIndex + i)
				{
					//Update list data
					renderer = this._contentPane._children[i];
					this._updateRendererData(renderer, itemIndex + i);
				}
				else
				{
					//No more data, purge the rest of the renderers.
					while (this._contentPane._children.length > i)
						this._contentPane._removeChildAt(i);
				}
			}
		}
	};

/**
 * @function setListCollection
 * Sets the DataLists's associated ListCollection to generate DataRenderers.
 * 
 * @param listCollection ListCollection
 * The ListCollection to be used as the data-provider.
 */	
DataListElement.prototype.setListCollection = 
	function (listCollection)
	{
		if (this._listCollection == listCollection)
			return;
	
		if (this._manager == null)
		{
			this._listCollection = listCollection;
		}
		else
		{
			if (this._listCollection != null)
				this._listCollection.removeEventListener("collectionchanged", this._onDataListCollectionChangedInstance);
			
			this._listCollection = listCollection;
			
			if (this._listCollection != null)
				this._listCollection.addEventListener("collectionchanged", this._onDataListCollectionChangedInstance);
		}
		
		//Fix selected index/item
		if (this._listCollection == null)
		{
			this._selectedIndex = -1;
			this._selectedItem = null;
		}
		else
		{
			if (this._selectedItem != null)
			{
				this._selectedIndex = this._listCollection.getItemIndex(this._selectedItem);
				
				if (this._selectedIndex == -1)
					this._selectedItem = null;
			}
		}
		
		this.setScrollIndex(this._scrollIndex); //Reset renderer data.
		this._invalidateLayout();
	};
	
/**
 * @function getListCollection
 * Gets the DataLists's associated ListCollection. 
 * 
 * @returns ListCollection
 * The associated ListCollection or null if none assigned.
 */		
DataListElement.prototype.getListCollection = 
	function ()
	{
		return this._listCollection;
	};	
	
///////////Internal//////////////////////////////
	
/**
 * @function _getContentSize
 * Gets the content size of the DataList. This is only accurate after the DataList
 * has finished its layout phase. Currently only used by the Dropdown to fix the
 * vertical height of the drop down pop-up list when there are too few items.
 * 
 * @returns Number
 * Content size in pixels of the DataListElement. Only valid after layout phase completed.
 */	
//Helpers function (currently only used by dropdown) ///
DataListElement.prototype._getContentSize = 
	function ()
	{
		var paddingSize = this._getPaddingSize();
	
		if (this.getStyle("LayoutDirection") == "vertical")
			return this._contentSize + paddingSize.height;
		else //if (this.getStyle("LayoutDirection") == "horizontal")
			return this._contentSize + paddingSize.width;
	};

//@private
DataListElement.prototype._onContentPaneMeasureComplete = 
	function (event)
	{
		this._invalidateMeasure();
		this._invalidateLayout();
	};
	
/**
 * @function _getNumRenderers
 * Gets the number of DataRenderers that are currently being rendered.
 * 
 * @returns int
 * the number of DataRenderers that are currently being rendered.
 */	
DataListElement.prototype._getNumRenderers = 
	function ()
	{
		return this._contentPane._children.length;
	};	
	
/**
 * @function _onDataListMouseWheelEvent
 * Event handler for the DataList "wheel" event. Starts the scroll bar tween.
 * 
 * @param elementMouseWheelEvent ElementMouseWheelEvent
 * The ElementMouseWheelEvent to process.
 */		
DataListElement.prototype._onDataListMouseWheelEvent = 
	function (elementMouseWheelEvent)
	{
		if (elementMouseWheelEvent.getDefaultPrevented() == true)
			return;
	
		//No renderers or event prevented.
		if (this._contentPane._children.length == 0 || this._listCollection.getLength() == 0)
			return;
	
		var delta = 0;
		var listDirection = this.getStyle("LayoutDirection");
		
		var minScrolled = false;
		var maxScrolled = false;
		
		var firstRenderer = this._contentPane._children[0];
		var lastRenderer = this._contentPane._children[this._contentPane._children.length - 1];
		
		if (listDirection == "horizontal")
		{
			delta = elementMouseWheelEvent.getDeltaX();
			
			if (delta == 0)
				return;
			
			if (firstRenderer._listData._itemIndex == 0 && 
				firstRenderer._x >= 0)
			{
				minScrolled = true;
			}
			
			if (minScrolled == true && delta < 0)
				return;
			
			if (lastRenderer._listData._itemIndex == this._listCollection.getLength() - 1 && 
				lastRenderer._x <= this._contentPane._width - lastRenderer._width)
			{
				maxScrolled = true;
			}
			
			if (maxScrolled == true && delta > 0)
				return;
		}
		else //if (listDirection == "vertical")
		{
			delta = elementMouseWheelEvent.getDeltaY();
			
			if (delta == 0)
				return;
			
			if (firstRenderer._listData._itemIndex == 0 && 
				firstRenderer._y >= 0)
			{
				minScrolled = true;
			}
			
			if (minScrolled == true && delta < 0)
				return;
			
			if (lastRenderer._listData._itemIndex == this._listCollection.getLength() - 1 && 
				lastRenderer._y <= this._contentPane._height - lastRenderer._height)
			{
				maxScrolled = true;
			}
			
			if (maxScrolled == true && delta > 0)
				return;
		}
		
		if (this._scrollBar != null)
		{
			var tweeningTo = this._scrollBar.getTweenToValue();
			if (tweeningTo == null)
				tweeningTo = this._scrollIndex;
			
			this._scrollBar.startScrollTween(tweeningTo + delta);
		}
		else
			this.setScrollIndex(this._scrollIndex + delta);
		
		//We've consumed the wheel event, don't want parents double scrolling.
		elementMouseWheelEvent.preventDefault();
	};	

/**
 * @function _onDataListScrollBarChanged
 * Event handler for the scroll bar "changed" event. Updates DataRenderers.
 * 
 * @param elementEvent ElementEvent
 * The ElementEvent to process.
 */		
DataListElement.prototype._onDataListScrollBarChanged = 
	function (elementEvent)
	{
		//Handle rounding errors
		var scrollValue = CanvasElement.roundToPrecision(this._scrollBar.getScrollValue(), 6);
		var scrollPageSize = CanvasElement.roundToPrecision(this._scrollBar.getScrollPageSize(), 6);
		var scrollViewSize = CanvasElement.roundToPrecision(this._scrollBar.getScrollViewSize(), 6);
		
		//Fix for issue where last renderer is larger than first, resulting in exponential adjustments 
		//due to view size shrinking / scroll range increasing at the same time as scroll. We check if the
		//scroll bar hit the end and increment the Lists scroll index rather than taking the scroll bar value.
		if (scrollValue == scrollPageSize - scrollViewSize && scrollValue - this._scrollIndex < 1)
			scrollValue = this._scrollIndex + 1;
	
		this.setScrollIndex(scrollValue);
	};
	
/**
 * @function _onDataListCollectionChanged
 * Event handler for the ListCollection "collectionchanged" event. Updates DataRenderers.
 * 
 * @param collectionChangedEvent CollectionChangedEvent
 * The CollectionChangedEvent to process.
 */		
DataListElement.prototype._onDataListCollectionChanged = 
	function (collectionChangedEvent)
	{
		var type = collectionChangedEvent.getKind();
		var index = collectionChangedEvent.getIndex();
	
		//Always invalidate layout (we need to adjust the scroll bar)
		this._invalidateLayout();
		
		if (this._contentPane._children.length == 0)
			return;
	
		//Reset all renderers (collection was cleared, or swapped)
		if (type == "reset")
		{
			//Fix selected index/item
			if (this._selectedItem != null)
			{
				this._selectedIndex = this._listCollection.getItemIndex(this._selectedItem);
				
				if (this._selectedIndex == -1)
					this._selectedItem = null;
			}
			
			this.setScrollIndex(this._scrollIndex); //Reset renderer data.
		}
		else
		{
			var firstIndex = 0;
			var lastIndex = 0;
			
			if (this._contentPane._children.length > 0)
			{
				firstIndex = this._contentPane._children[0]._listData._itemIndex;
				lastIndex = this._contentPane._children[this._contentPane._children.length - 1]._listData._itemIndex;
			}
			
			if (this._selectedIndex == index && type == "remove") //We removed the selected item.
			{
				this._selectedIndex = -1;
				this._selectedItem = null;
			}
			
			if (index <= lastIndex && (type == "add" || type == "remove"))
			{
				//Adjust selected index
				if (index <= this._selectedIndex)
				{
					if (type == "add")
						this._selectedIndex++;
					else // if (type == "remove)
						this._selectedIndex--;
				}
				
				if (index < firstIndex)
				{
					var newIndex;
					var indexAdjust;
					
					//Fix scroll/item indexes (we added/removed an item on top thats out of the view)
					//Dont invalidate, only the index has changed, not the data, we dont want renderers shuffling around.
					if (type == "add")
						indexAdjust = 1;
					else // "remove"
						indexAdjust = -1;
					
					this._scrollIndex = this._scrollIndex + indexAdjust;
					
					//Adjust all indexes
					for (var i = 0; i < this._contentPane._children.length; i++)
					{
						newIndex = this._contentPane._children[i]._listData._itemIndex + indexAdjust;
						this._updateRendererData(this._contentPane._children[i], newIndex);
					}
				}
				else //Visible renderers changed
				{
					if (type == "add")
					{
						var newRenderer = this._createRenderer(index);
						
						//Push in a new renderer, layout will deal with purging excess if necessary
						this._contentPane._addChildAt(newRenderer, index - firstIndex);
						index++;
					}
					else // if (type == "remove")
					{
						//Pop the removed renderer, layout will deal with adding more if necessary
						this._contentPane._removeChildAt(index - firstIndex);
					}
					
					//Adjust downstream indexes.
					for (var i = index - firstIndex; i < this._contentPane._children.length; i++)
					{
						this._updateRendererData(this._contentPane._children[i], index);
						index++;
					}
				}
			}
			else if (type == "update" && index >= firstIndex && index <= lastIndex)
				this._updateRendererData(this._contentPane._children[index - firstIndex], index);
		}
	};
	
//@Override	
DataListElement.prototype._onCanvasElementAdded = 
	function (addedRemovedEvent)
	{
		DataListElement.base.prototype._onCanvasElementAdded.call(this, addedRemovedEvent);
	
		if (this._listCollection != null)
			this._listCollection.addEventListener("collectionchanged", this._onDataListCollectionChangedInstance);
	};

//@Override	
DataListElement.prototype._onCanvasElementRemoved = 
	function (addedRemovedEvent)
	{
		DataListElement.base.prototype._onCanvasElementRemoved.call(this, addedRemovedEvent);
		
		if (this._listCollection != null)
			this._listCollection.removeEventListener("collectionchanged", this._onDataListCollectionChangedInstance);
	};	

/**
 * @function _invalidateListRenderersLayout
 * Calls _invalidateLayout() on all DataRenderers.
 */	
DataListElement.prototype._invalidateListRenderersLayout = 
	function ()
	{
		for (var i = 0; i < this._contentPane._children.length; i++)
			this._contentPane._children[i]._invalidateLayout();
	};
	
/**
 * @function _invalidateListRenderersMeasure
 * Calls _invalidateMeasure() on all DataRenderers.
 */		
DataListElement.prototype._invalidateListRenderersMeasure = 
	function ()
	{
		for (var i = 0; i < this._contentPane._children.length; i++)
			this._contentPane._children[i]._invalidateMeasure();
	};
	
//@Override
DataListElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		DataListElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("ListItemClass" in stylesMap)
		{
			//Check if class changed
			if (this._contentPane._children.length > 0 && 
				this._contentPane._children[0].constructor != this.getStyle("ListItemClass"))
			{
				//Purge all renderers
				while (this._contentPane._children.length > 0)
					this._contentPane._removeChildAt(0);
				
				this._invalidateLayout();
			}
		}
		
		if ("ListItemStyle" in stylesMap)
		{
			for (var i = 0; i < this._contentPane._children.length; i++)
				this._applySubStylesToElement("ListItemStyle", this._contentPane._children[i]);
			
			this._invalidateLayout();
		}
		
		if ("LayoutDirection" in stylesMap)
		{
			this._invalidateMeasure();
			this._invalidateLayout();
		}
		else if ("ScrollBarPlacement" in stylesMap || 
				"ScrollBarDisplay" in stylesMap ||  
				"LayoutGap" in stylesMap ||
				"LayoutHorizontalAlign" in stylesMap ||
				"LayoutVerticalAlign" in stylesMap)
		{
			this._invalidateLayout();
		}
		
		if ("ScrollBarStyle" in stylesMap && this._scrollBar != null)
			this._applySubStylesToElement("ScrollBarStyle", this._scrollBar);
		
		if ("ItemLabelFunction" in stylesMap)
			this.setScrollIndex(this._scrollIndex); //Reset renderer data.
	};

/**
 * @function _onDataListRendererClick
 * Event handler for the DataRenderer "click" event. Updates selected index/item and dispatches "listitemclick" and "changed" events.
 * 
 * @param elementMouseEvent ElementMouseEvent
 * The ElementMouseEvent to process.
 */		
DataListElement.prototype._onDataListRendererClick = 
	function (elementMouseEvent)
	{
		var itemIndex = elementMouseEvent.getCurrentTarget()._listData._itemIndex;
		var itemData = elementMouseEvent.getCurrentTarget()._itemData;
		
		var dispatchChanged = false;
		var elementIsSelectable = elementMouseEvent.getCurrentTarget().getStyle("Selectable");
		
		//Update selected index
		if (this.getStyle("Selectable") == true && (elementIsSelectable === undefined || elementIsSelectable == true))
		{
			if (this.setSelectedIndex(itemIndex) == true)
				dispatchChanged = true;
		}
		
		//Dispatch events
		this._dispatchEvent(new ElementListItemClickEvent(itemData, itemIndex));
		
		if (dispatchChanged == true)
			this._dispatchEvent(new ElementEvent("changed", false));
	};
	
/**
 * @function _createRenderer
 * Generates a DataRenderer based on the ListItemClass style.
 * 
 * @param itemIndex int
 * Collection index associated with the DataRenderer.
 * 
 * @returns CanvasElement
 * The new DataRenderer instance.
 */	
DataListElement.prototype._createRenderer = 
	function (itemIndex)
	{
		var newRenderer = new (this.getStyle("ListItemClass"))();
		newRenderer._setStyleProxy(new StyleProxy(this, DataListElement._DataRendererProxyMap));
		
		this._applySubStylesToElement("ListItemStyle", newRenderer);
		this._updateRendererData(newRenderer, itemIndex);
		
		newRenderer.addEventListener("click", this._onDataListRendererClickInstance);
		
		return newRenderer;
	};

/**
 * @function _updateRendererData
 * Updates the DataRenderer list data and selected state.
 * 
 * @param renderer CanvasElement
 * DataRenderer to update.
 * 
 * @param itemIndex int
 * Collection index to associate with the DataRenderer.
 */	
DataListElement.prototype._updateRendererData = 
	function (renderer, itemIndex)
	{
		var listData = null;
		
		//Optimize, dont create new data unless its actually changed.
		if (renderer._listData != null && renderer._listData._itemIndex == itemIndex)
			listData = renderer._listData;
		else
			listData = new DataListData(this, itemIndex);
	
		//Always call the function even if data has not changed, this indicates to the
		//renderer to inspect its parent related data and it may make changes even if
		//this data is the same. An example is changes to a DataGrid's columns.
		renderer._setListData(
			listData,
			this._listCollection.getItemAt(itemIndex));
		
		if (this._selectedIndex == itemIndex)
			renderer._setListSelected(true);
		else
			renderer._setListSelected(false);
	};
	
//@override
DataListElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		//TODO: Sample text widths if label function is set.
		return {width:16, height:16};
	};	
	
//@override	
DataListElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		DataListElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		var x = paddingMetrics.getX();
		var y = paddingMetrics.getY();
		var w = paddingMetrics.getWidth();
		var h = paddingMetrics.getHeight();
		
		var availableSize = h;
		var listItem = null;
		var i;
		
		var listDirection = this.getStyle("LayoutDirection");
		var itemIndex = Math.floor(this._scrollIndex);
		
		var collectionLength = 0;
		if (this._listCollection != null)
			collectionLength = this._listCollection.getLength();
		
		if (collectionLength == 0)
		{
			itemIndex = 0;
			this._scrollIndex = itemIndex;
		}
		else if (itemIndex > collectionLength -1)
		{
			itemIndex = collectionLength -1;
			this._scrollIndex = itemIndex;
		}
		
		var clipFirst = 0;
		var clipLast = 0;
		
		this._contentSize = 0;
		var itemSize = 0;
		
		//Measure existing content & clipping amounts.
		for (i = 0; i < this._contentPane._children.length; i++)
		{
			listItem = this._contentPane._children[i];
			
			if (listDirection == "horizontal")
				itemSize = listItem._getStyledOrMeasuredWidth();
			else // if (listDirection == "vertical")
				itemSize = listItem._getStyledOrMeasuredHeight();
				
			this._contentSize += itemSize;
			
			if (listItem._listData._itemIndex <= itemIndex)
			{
				if (listItem._listData._itemIndex < itemIndex)
					clipFirst += itemSize;
				else
					clipFirst += itemSize * (this._scrollIndex - itemIndex);
			}
			
			if (this._contentSize - clipFirst >= availableSize)
			{
				clipLast = (this._contentSize - clipFirst - availableSize);
				
				//Purge Excess renderers.
				while (this._contentPane._children.length - 1 > i)
					this._contentPane._removeChildAt(this._contentPane._children.length - 1);
			}
		}
		
		//Adjust scroll index due to new renderer added on top.
		//Happens when we're max scrolled and DataList size increases.
		if (this._contentPane._children.length > 0 && 
			this._contentPane._children[0]._listData._itemIndex < itemIndex)
		{
			clipFirst += clipLast;
			clipLast = 0; //No clipping last item (scrolled to bottom)
			
			itemIndex = this._contentPane._children[0]._listData._itemIndex;
			
			//Fix scroll index
			if (listDirection == "horizontal")
				this._scrollIndex = itemIndex + (clipFirst / this._contentPane._children[0]._getStyledOrMeasuredWidth());
			else // if (listDirection == "vertical")
				this._scrollIndex = itemIndex + (clipFirst / this._contentPane._children[0]._getStyledOrMeasuredHeight());
			
			//Handle rounding errors
			this._scrollIndex = CanvasElement.roundToPrecision(this._scrollIndex, 6);
		}
		
		//Extra space - need another renderer or scroll shift
		if (this._contentSize - clipFirst - clipLast < availableSize)
		{
			if (itemIndex + this._contentPane._children.length < collectionLength)
			{//Create a new renderer and put it on bottom.
				
				var newRenderer = this._createRenderer(itemIndex + this._contentPane._children.length);
				this._contentPane._addChild(newRenderer);
				
				//Wait for the new renderer to measure.
				//Re-invalidate ourself, (content pane doesnt measure so wont do it for us).
				this._invalidateLayout();
				return;
			}
			else
			{//Add before (or shift up scroll position)
				
				var excessSize = availableSize - (this._contentSize - clipFirst - clipLast);
				
				if (clipFirst >= excessSize) 
				{//We have enough clipping to cover the gap, un-clip and adjust scroll index
					
					clipFirst -= excessSize;
					
					if (listDirection == "horizontal")
						this._scrollIndex = itemIndex + (clipFirst / this._contentPane._children[0]._getStyledOrMeasuredWidth());
					else // if (listDirection == "vertical")
						this._scrollIndex = itemIndex + (clipFirst / this._contentPane._children[0]._getStyledOrMeasuredHeight());
					
					//Handle rounding errors
					this._scrollIndex = CanvasElement.roundToPrecision(this._scrollIndex, 6);
				}
				else if (clipFirst > 0 && collectionLength == this._contentPane._children.length)
				{//We dont have enough clipping, but we're out of data (cannot make new renderer)
					
					clipFirst = 0;
					this._scrollIndex = 0;
				}
				else if (collectionLength > this._contentPane._children.length)
				{//Create a new renderer and put it on top
					
					var newRenderer = this._createRenderer(itemIndex - 1);
					this._contentPane._addChildAt(newRenderer, 0);
					
					//Wait for the new renderer to measure.
					//Re-invalidate ourself, (content pane doesnt measure so wont do it for us).
					this._invalidateLayout();
					return;
				}
			}
		}
		
		var needsScrollBar = false;
		var scrollDisplay = this.getStyle("ScrollBarDisplay");
		
		if (scrollDisplay == "on" || 
			(scrollDisplay == "auto" && availableSize > 0 && (this._contentSize > availableSize || this._contentPane._children.length < collectionLength)))
		{
			needsScrollBar = true;
		}
		
		//Create ScrollBar
		if (needsScrollBar == true && this._scrollBar == null)
		{
			this._scrollBar = new ScrollBarElement();
			
			this._applySubStylesToElement("ScrollBarStyle", this._scrollBar);
			
			this._scrollBar.setScrollLineSize(1);
			
			this._scrollBar.addEventListener("changed", this._onDataListScrollBarChangedInstance);
			this._addChild(this._scrollBar);
			
			//Wait for measure.
			return;
		}
		
		//Destroy ScrollBar
		if (needsScrollBar == false && this._scrollBar != null)
		{			
			this._removeChild(this._scrollBar);
			this._scrollBar = null;
			
			//Wait for measure
			return;
		}
		
		//Size / Position the scroll bar and content pane.
		if (this._scrollBar != null)
		{
			this._scrollBar.setStyle("LayoutDirection", listDirection);
			
			var scrollBarPlacement = this.getStyle("ScrollBarPlacement");
			
			if (listDirection == "horizontal")
			{
				this._scrollBar._setActualSize(w, this._scrollBar._getStyledOrMeasuredHeight());
				this._contentPane._setActualSize(w, h - this._scrollBar._height);
				
				if (scrollBarPlacement == "top" || scrollBarPlacement == "left")
				{
					this._contentPane._setActualPosition(x, y + this._scrollBar._height);
					this._scrollBar._setActualPosition(x, y);
				}
				else //if (scrollBarPlacement == "bottom" || scrollBarPlacement == "right")
				{
					this._contentPane._setActualPosition(x, y);
					this._scrollBar._setActualPosition(x, y + this._contentPane._height);
				}
			}
			else // if (listDirection == "vertical")
			{
				this._scrollBar._setActualSize(this._scrollBar._getStyledOrMeasuredWidth(), h);
				this._contentPane._setActualSize(w - this._scrollBar._width, h);
				
				if (scrollBarPlacement == "top" || scrollBarPlacement == "left")
				{
					this._scrollBar._setActualPosition(x, y);
					this._contentPane._setActualPosition(x + this._scrollBar._width, y);
				}
				else //if (scrollBarPlacement == "bottom" || scrollBarPlacement == "right")
				{
					this._scrollBar._setActualPosition(x + this._contentPane._width, y);
					this._contentPane._setActualPosition(x, y);
				}
			}
		}
		else
		{
			this._contentPane._setActualPosition(x, y);
			this._contentPane._setActualSize(w, h);
		}

		//Layout content pane children.
		var currentPosition = clipFirst * -1;
		if (this._contentSize < availableSize)
		{
			var listAlign = null;
			if (listDirection == "horizontal")
				listAlign = this.getStyle("LayoutHorizontalAlign");
			else //if (listDirection == "vertical")
				listAlign = this.getStyle("LayoutVerticalAlign");
			
			if (listAlign == "top" || listAlign == "left")
				currentPosition = 0;
			else if (listAlign == "center" || listAlign == "middle")
				currentPosition = (availableSize / 2) - (this._contentSize / 2);
			else //if (listAlign == "bottom" || listAlign == "right")
				currentPosition = availableSize - this._contentSize;
		}
		
		for (i = 0; i < this._contentPane._children.length; i++)
		{
			listItem = this._contentPane._children[i];
			
			if (listDirection == "horizontal")
			{
				listItem._setActualSize(listItem._getStyledOrMeasuredWidth(), this._contentPane._height);
				listItem._setActualPosition(currentPosition, 0);
				
				currentPosition += listItem._width;
			}
			else // if (listDirection == "vertical")
			{
				listItem._setActualSize(this._contentPane._width, listItem._getStyledOrMeasuredHeight());
				listItem._setActualPosition(0, currentPosition);
				
				currentPosition += listItem._height;
			}
		}
		
		//Adjust scroll bar parameters.
		if (this._scrollBar != null)
		{
			var viewSize = this._contentPane._children.length;
			
			if (this._contentPane._children.length)
			{
				if (listDirection == "horizontal")
				{
					viewSize -= clipFirst / this._contentPane._children[0]._width;
					viewSize -= clipLast / this._contentPane._children[this._contentPane._children.length - 1]._width;
				}
				else // if (listDirection == "vertical")
				{
					viewSize -= clipFirst / this._contentPane._children[0]._height;
					viewSize -= clipLast / this._contentPane._children[this._contentPane._children.length - 1]._height;
				}
			}
			
			this._scrollBar.setScrollPageSize(collectionLength);
			this._scrollBar.setScrollViewSize(viewSize);
			
			if (CanvasElement.roundToPrecision(this._scrollBar.getScrollValue(), 6) != this._scrollIndex)
			{
				this._scrollBar.endScrollTween();
				this._scrollBar.setScrollValue(this._scrollIndex);
			}
		}
	};
	
	


/**
 * @depends LabelElement.js
 */

///////////////////////////////////////////////////////////////////////
///////////////////DataGridLabelItemRenderer/////////////////////////	
	
/**
 * @class DataGridLabelItemRenderer
 * @inherits LabelElement
 * 
 * DataGrid ItemRenderer for a basic label. Updates label text via 
 * DataGridColumnDefiniton RowItemLabelFunction.
 * 
 * This class needs more work to add  text color styles for DataRenderer states.
 * 
 * @constructor DataGridLabelItemRenderer 
 * Creates new DataGridLabelItemRenderer instance.
 */
function DataGridLabelItemRenderer()
{
	DataGridLabelItemRenderer.base.prototype.constructor.call(this);
}

//Inherit from LabelElement
DataGridLabelItemRenderer.prototype = Object.create(LabelElement.prototype);
DataGridLabelItemRenderer.prototype.constructor = DataGridLabelItemRenderer;
DataGridLabelItemRenderer.base = LabelElement;


///////////Default Styles//////////////////////

DataGridLabelItemRenderer.StyleDefault = new StyleDefinition();

DataGridLabelItemRenderer.StyleDefault.setStyle("PaddingTop", 				4);
DataGridLabelItemRenderer.StyleDefault.setStyle("PaddingBottom", 			4);
DataGridLabelItemRenderer.StyleDefault.setStyle("PaddingLeft", 				5);
DataGridLabelItemRenderer.StyleDefault.setStyle("PaddingRight", 			5);			


//////////////Internal//////////////////////////////////////////

//@Override
DataGridLabelItemRenderer.prototype._setListData = 
	function (listData, itemData)
	{
		DataGridLabelItemRenderer.base.prototype._setListData.call(this, listData, itemData);
		
		this._updateLabelText();
	};

/**
 * @function _updateLabelText
 * Updates the label text in response to list data changes using the associated parent grid column's RowItemLabelFunction.
 */	
DataGridLabelItemRenderer.prototype._updateLabelText = 
	function ()
	{
		if (this._itemData == null || this._listData == null)
			this.setStyle("Text", "");
		else
		{
			var parentGrid = this._listData._parentGrid;
			var columnDefinition = parentGrid._gridColumns[this._listData._columnIndex];
			var labelFunction = columnDefinition.getStyle("RowItemLabelFunction");
			
			this.setStyle("Text", labelFunction(this._itemData, this._listData._columnIndex));
		}
	};
	
	


/**
 * @depends DataRendererBaseElement.js
 */

///////////////////////////////////////////////////////////////////////
///////////////////////DataGridDataRenderer////////////////////////////

/**
 * @class DataGridDataRenderer
 * @inherits DataRendererBaseElement
 * 
 * Default DataGrid ListItemClass used to render DataGrid rows. Renders
 * column items per the parent DataGrid's column definitions. 
 * 
 * @constructor DataGridDataRenderer 
 * Creates new DataGridDataRenderer instance.
 */

//Used to render the DataGrid rows. 
function DataGridDataRenderer()
{
	DataGridDataRenderer.base.prototype.constructor.call(this);
	
	//Use a containing element for the renderers so we dont interfere with our skins.
	this._itemRenderersContainer = new CanvasElement();
	this._addChild(this._itemRenderersContainer);
	
	var _self = this;
	
	this._onItemRenderersContainerMeasureCompleteInstance = 
		function (event)
		{
			_self.__onItemRenderersContainerMeasureComplete(event);
		};
	
	this._itemRenderersContainer.addEventListener("measurecomplete", this._onItemRenderersContainerMeasureCompleteInstance);
}
	
//Inherit from DataRendererBaseElement
DataGridDataRenderer.prototype = Object.create(DataRendererBaseElement.prototype);
DataGridDataRenderer.prototype.constructor = DataGridDataRenderer;
DataGridDataRenderer.base = DataRendererBaseElement;

//////////Default Styles/////////////////////////

DataGridDataRenderer.StyleDefault = new StyleDefinition();

//Skin Defaults///////
DataGridDataRenderer.UpSkinStyleDefault = new StyleDefinition();
DataGridDataRenderer.UpSkinStyleDefault.setStyle("BackgroundColor", 			"#FFFFFF");
DataGridDataRenderer.UpSkinStyleDefault.setStyle("AutoGradientType", 			"none");

DataGridDataRenderer.AltSkinStyleDefault = new StyleDefinition();
DataGridDataRenderer.AltSkinStyleDefault.setStyle("BackgroundColor", 			"#F0F0F0");
DataGridDataRenderer.AltSkinStyleDefault.setStyle("AutoGradientType", 			"none");
/////////////////////

DataGridDataRenderer.StyleDefault.setStyle("UpSkinStyle", 						DataGridDataRenderer.UpSkinStyleDefault);	// StyleDefinition
DataGridDataRenderer.StyleDefault.setStyle("AltSkinStyle", 						DataGridDataRenderer.AltSkinStyleDefault);	// StyleDefinition


//@private
DataGridDataRenderer.prototype.__onItemRenderersContainerMeasureComplete =
	function (event)
	{
		this._invalidateMeasure();
	};

//@Override
DataGridDataRenderer.prototype._setListData = 
	function (listData, itemData)
	{
		DataGridDataRenderer.base.prototype._setListData.call(this, listData, itemData);
		
		var renderer = null;
		for (var i = 0; i < listData._parentList._gridColumns.length; i++)
		{
			renderer = this._itemRenderersContainer._getChildAt(i);
			
			if (renderer == null)
			{
				renderer = listData._parentList._createRowItemRenderer(listData._itemIndex, i);
				this._itemRenderersContainer._addChildAt(renderer, i);
			}
			else
			{
				columnDef = listData._parentList._gridColumns[i];
				
				if (renderer.constructor != columnDef.getStyle("RowItemClass"))
				{ //Renderer Class changed
					
					this._itemRenderersContainer._removeChildAt(i);
					renderer = listData._parentList._createRowItemRenderer(listData._itemIndex, i);
					this._itemRenderersContainer._addChildAt(renderer, i);
				}
				else
				{ //Update DataGridData
					
					listData._parentList._updateRowItemRendererData(renderer, listData._itemIndex, i);
				}
			}
		}
		
		//Purge excess renderers.
		while (this._itemRenderersContainer._children.length > this._listData._parentList._gridColumns.length)
			this._itemRenderersContainer._removeChildAt(this._itemRenderersContainer._children.length - 1);
		
		//Invalidate, the item renderer container doesnt measure so wont do it for us.
		this._invalidateMeasure();
		this._invalidateLayout();
	};
	
//@Override
DataGridDataRenderer.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		var measuredSize = {width: 0, height: 0};
		var childSize = 0;
		
		for (var i = 0; i < this._itemRenderersContainer._children.length; i++)
		{
			childSize = this._itemRenderersContainer._children[i]._getStyledOrMeasuredHeight();
			
			if (measuredSize.height < childSize)
				measuredSize.height = childSize;
			
			measuredSize.width += this._itemRenderersContainer._children[i]._getStyledOrMeasuredWidth();
		}
	
		measuredSize.width += padWidth;
		measuredSize.height += padHeight;
		
		return measuredSize;
	};
	
//@Override	
DataGridDataRenderer.prototype._doLayout = 
	function (paddingMetrics)
	{
		DataGridDataRenderer.base.prototype._doLayout.call(this, paddingMetrics);
		
		if (this._listData == null)
			return;
		
		this._itemRenderersContainer._setActualPosition(paddingMetrics.getX(), paddingMetrics.getY());
		this._itemRenderersContainer._setActualSize(paddingMetrics.getWidth(), paddingMetrics.getHeight());
		
		var parentGrid = this._listData._parentList;
		var rowItemRenderer = null;
		var currentPosition = 0;
		var columnSize = 0;
		
		var paddingSize = this._getPaddingSize();
		
		for (var i = 0; i < parentGrid._columnSizes.length; i++)
		{
			rowItemRenderer = this._itemRenderersContainer._children[i];
			columnSize = parentGrid._columnSizes[i];
			
			if (i == 0)
				columnSize -= paddingSize.paddingLeft;
			else if (i == parentGrid._columnSizes.length - 1) //Consume the rest available.
				columnSize = this._itemRenderersContainer._width - currentPosition;
			
			rowItemRenderer._setActualPosition(currentPosition, 0);
			rowItemRenderer._setActualSize(columnSize, this._itemRenderersContainer._height);
			
			currentPosition += columnSize;
		}
	};	
	
	


/**
 * @depends CanvasElement.js
 */

///////////////////////////////////////////////////////////////////////////	
///////////////////////ContainerBaseElement////////////////////////////////

/**
 * @class ContainerBaseElement
 * @inherits CanvasElement
 * 
 * Abstract base class for Container elements. Wraps internal child modification functions
 * such as _addChild() and _removeChild() with public functions such as addElement() and removeElement() 
 * for proper index management when using skins and overlays in conjunction with content children. 
 * 
 * Container children are not all considered equal. Content children added via the addElement() and removeElement()
 * functions maintain their own indexes and are placed in between raw children, such as skins, which render
 * underneath and overlay children which render above (elements intended to always be on top of content children).
 * 
 * Raw children added via _addChild() or _addChildAt() will be indexed before content children.
 * Content children added via addElement() or addElementAt() will be indexed after raw children and before overlay children.
 * Overlay children added via _addOverlayChild() will be index last, after content children.
 * All 3 lists maintain their own indexes.
 * 
 * @constructor ContainerBaseElement 
 * Creates new ContainerBaseElement instance.
 */

function ContainerBaseElement()
{
	ContainerBaseElement.base.prototype.constructor.call(this);
	
	//Storage for user added elements.
	this._elements = [];
	
	//Children that come after user added elements
	this._overlayChildren = [];
}	
	
//Inherit from CanvasElement
ContainerBaseElement.prototype = Object.create(CanvasElement.prototype);
ContainerBaseElement.prototype.constructor = ContainerBaseElement;
ContainerBaseElement.base = CanvasElement;
	

/////////////Default Styles///////////////////////////////

ContainerBaseElement.StyleDefault = new StyleDefinition();
ContainerBaseElement.StyleDefault.setStyle("ClipContent",						true);


////////////ContainerBaseElement Public Functions//////////////////////////

//Expose child modification functions.

/**
 * @function addElement
 * Adds a content child element to the end of this element's content child list.
 * 
 * @param element CanvasElement
 * CanvasElement to be added as a content child of this element.
 * 
 * @returns CanvasElement
 * Returns the element just added.
 */	
ContainerBaseElement.prototype.addElement = 
	function (element)
	{
		return this.addElementAt(element, this._elements.length);
	};

/**
 * @function addElementAt
 * Inserts a content child element to this element's content child list at the specified index.
 * 
 * @param element CanvasElement
 * CanvasElement to be added as a content child of this element.
 * 
 * @param index int
 * Child index to insert the element.
 * 
 * @returns CanvasElement
 * Returns the element just added when successful, null if the element could not
 * be added due to the index being out of range.
 */		
ContainerBaseElement.prototype.addElementAt = 
	function (element, index)
	{
		if (!(element instanceof CanvasElement))
			return null;
	
		if (index < 0 || index > this._elements.length)
			return null;
		
		var childIndex = this._children.length - this._overlayChildren.length - this._elements.length + index;
		
		this._elements.splice(index, 0, element);
		ContainerBaseElement.base.prototype._addChildAt.call(this, element, childIndex);
		
		return element;
	};
	
/**
 * @function removeElement
 * Removes a content child element from this element's content children list.
 * 
 * @param element CanvasElement
 * Content child to be removed.
 * 
 * @returns CanvasElement
 * Returns the CanvasElement just removed if successful, null if the
 * element could not be removed due to it not being a content child of this element.
 */		
ContainerBaseElement.prototype.removeElement = 
	function (element)
	{
		var index = this._elements.indexOf(element);
		return this.removeElementAt(index);
	};
	
/**
 * @function removeElementAt
 * Removes a content child element at specified index.
 * 
 * @param index int
 * Content index to be removed.
 * 
 * @returns CanvasElement
 * Returns the CanvasElement just removed if successful, null if the element could
 * not be removed due it it not being a child of this element, or index out of range.
 */			
ContainerBaseElement.prototype.removeElementAt = 
	function (index)
	{
		if (index < 0 || index >= this._elements.length)
			return null;
	
		var childIndex = this._children.length - this._overlayChildren.length - this._elements.length + index;

		this._elements.splice(index, 1);
		return ContainerBaseElement.base.prototype._removeChildAt.call(this, childIndex);
	};

/**
 * @function getElementAt
 * Gets the content child element at the supplied index.
 * 
 * @param index int
 * Content index of child element to return;
 * 
 * @returns CanvasElement
 * The CanvasElement at the supplied index, or null if index is out of range. 
 */		
ContainerBaseElement.prototype.getElementAt = 
	function (index)
	{
		if (index < 0 || index >= this._elements.length)
			return null;
		
		return this._elements[index];
	};
	
/**
 * @function getElementIndex
 * Returns the index of the supplied content child element.
 * 
 * @param element CanvasElement
 * Content child element to return the index.
 * 
 * @returns int
 * Returns the child index or -1 if the element is not
 * a content child of this element.
 */		
ContainerBaseElement.prototype.getElementIndex = 
	function (element)
	{
		return this._elements.indexOf(element);
	};

/**
 * @function setElementIndex
 * Changes a content child element's index. 
 * 
 * @param element CanvasElement
 * Content child element to change index.
 * 
 * @param index int
 * New content index of the content child element.
 * 
 * @returns boolean
 * Returns true if the child's index is successfully changed, false if the element
 * is not a content child of this element or the index is out of range.
 */		
ContainerBaseElement.prototype.setElementIndex = 
	function (element, index)
	{
		if (index < 0 || index >= this._elements.length)
			return false;
		
		var currentIndex = this._elements.indexOf(element);
		if (currentIndex == -1 || currentIndex == index)
			return false;
		
		var childIndex = this._children.length - this._overlayChildren.length - this._elements.length + index;
		
		this._elements.splice(index, 0, this._elements.splice(currentIndex, 1)[0]);
		ContainerBaseElement.base.prototype._setChildIndex.call(this, element, childIndex);
		
		return true;
	};
	
/**
 * @function getNumElements
 * Gets this elements number of content children.
 * 
 * @returns int
 * The number of content child elements.
 */		
ContainerBaseElement.prototype.getNumElements = 
	function ()
	{
		return this._elements.length;
	};

/**
 * @function _addOverlayChild
 * Adds an overlay child element to the end of this element's overlay child list.
 * 
 * @param element CanvasElement
 * Element to be added as an overlay child of this element.
 * 
 * @returns CanvasElement
 * Returns the element just added.
 */		
ContainerBaseElement.prototype._addOverlayChild = 
	function (element)
	{
		return this._addOverlayChildAt(element, this._overlayChildren.length);
	};
	
/**
 * @function _addOverlayChildAt
 * Inserts an overlay child element to this elements overlay child list at the specified index.
 * 
 * @param element CanvasElement
 * Element to be added as an overlay child of this element.
 * 
 * @returns CanvasElement
 * Returns the element just added when successful, null if the element could not
 * be added due to the index being out of range.
 */			
ContainerBaseElement.prototype._addOverlayChildAt = 
	function (element, index)
	{
		if (!(element instanceof CanvasElement))
			return null;
	
		if (index < 0 || index > this._overlayChildren.length)
			return null;
		
		var childIndex = this._children.length - this._overlayChildren.length + index;
		
		this._overlayChildren.splice(index, 0, element);
		ContainerBaseElement.base.prototype._addChildAt.call(this, element, childIndex);
		
		return element;
	};	

/**
 * @function _removeOverlayChild
 * Removes an overlay child element from this elements overlay child list.
 * 
 * @param element CanvasElement
 * Overlay child to be removed.
 * 
 * @returns CanvasElement
 * Returns the element just removed if successful, null if the
 * element could not be removed due to it not being an overlay child of this element.
 */		
ContainerBaseElement.prototype._removeOverlayChild = 
	function (element)
	{
		var index = this._overlayChildren.indexOf(element);
		return this._removeOverlayChildAt(index);
	};

/**
 * @function _removeOverlayChildAt
 * Removes an overlay child element at specified index.
 * 
 * @param index int
 * Overlay index to be removed.
 * 
 * @returns CanvasElement
 * Returns the element just removed if successful, null if the element could
 * not be removed due it it not being an overlay child of this element, or index out of range.
 */			
ContainerBaseElement.prototype._removeOverlayChildAt = 
	function (index)
	{
		if (index < 0 || index >= this._overlayChildren.length)
			return null;
		
		var childIndex = this._children.length - this._overlayChildren.length + index;

		this._overlayChildren.splice(index, 1);
		return ContainerBaseElement.base.prototype._removeChildAt.call(this, childIndex);
	};	

/**
 * @function _getOverlayChildAt
 * Gets the overlay child element at the supplied index.
 * 
 * @param index int
 * Overlay index of child element to return;
 * 
 * @returns CanvasElement
 * The element at the supplied overlay index, or null if index is out of range. 
 */		
ContainerBaseElement.prototype._getOverlayChildAt = 
	function (index)
	{
		if (index < 0 || index >= this._overlayChildren.length)
			return null;
		
		return this._overlayChildren[index];
	};	
	
/**
 * @function _getOverlayChildIndex
 * Returns the overlay index of the supplied child element.
 * 
 * @param element CanvasElement
 * Child element to return the overlay index.
 * 
 * @returns int
 * Returns the child's overlay index or -1 if the element is not
 * an overlay child of this element.
 */		
ContainerBaseElement.prototype._getOverlayChildIndex = 
	function (element)
	{
		return this._overlayChildren.indexOf(element);
	};	
	
/**
 * @function _setOverlayChildIndex
 * Changes an overlay child element's overlay index. 
 * 
 * @param element CanvasElement
 * Overlay child element to change index.
 * 
 * @param index int
 * New overlay index of the child element.
 * 
 * @returns boolean
 * Returns true if the child's index is successfully changed, false if the element
 * is not an overlay child of this element or the index is out of range.
 */		
ContainerBaseElement.prototype._setOverlayChildIndex = 
	function (element, index)
	{
		if (index < 0 || index >= this._overlayChildren.length)
			return false;
		
		var currentIndex = this._overlayChildren.indexOf(element);
		if (currentIndex < 0 || currentIndex == index)
			return false;
		
		var childIndex = this._children.length - this._overlayChildren.length + index;
		
		this._overlayChildren.splice(index, 0, this._overlayChildren.splice(currentIndex, 1)[0]);
		ContainerBaseElement.base.prototype._setChildIndex.call(this, element, childIndex);
		
		return true;
	}; 	
	
/**
 * @function _getNumOverlayChildren
 * Gets this elements number of overlay children.
 * 
 * @returns int
 * The number of overlay child elements.
 */		
ContainerBaseElement.prototype._getNumOverlayChildren = 
	function ()
	{
		return this._overlayChildren.length;
	};
	
//Override - Add the child before elements & overlay
ContainerBaseElement.prototype._addChild = 
	function (element)
	{
		var index = this._children.length - this._elements.length - this._overlayChildren.length;
		return ContainerBaseElement.base.prototype._addChildAt.call(this, element, index);
	};
	
//Override - Dont allow insertion into elements or overlay range
ContainerBaseElement.prototype._addChildAt = 
	function (element, index)
	{
		var maxIndex = this._children.length - this._elements.length - this._overlayChildren.length;
		
		if (index < 0 || index > maxIndex)
			return null;
		
		return ContainerBaseElement.base.prototype._addChildAt.call(this, element, index);
	};

//Override - Remove from element or overlay if necessary
ContainerBaseElement.prototype._removeChildAt = 
	function (index)
	{
		if (index < 0 || index >= this._children.length)
			return null;
		
		var element = this._children.splice(index, 1)[0]; //Returns array of removed items.
		
		var subIndex = this._elements.indexOf(element);
		if (subIndex >= 0)
			return this.removeElementAt(subIndex);
		
		subIndex = this._overlayChildren.indexOf(element);
		if (subIndex >= 0)
			return this._removeOverlayChildAt(subIndex);
		
		return ContainerBaseElement.base.prototype._removeChildAt.call(this, index);
	};

//@Override	- Dont allow swapping in or out of element & overlay ranges.
ContainerBaseElement.prototype._setChildIndex = 
	function (element, index)
	{
		var maxIndex = this._children.length - this._elements.length - this._overlayChildren.length;
	
		if (index < 0 || index >= maxIndex)
			return false;
		
		var currentIndex = this._getChildIndex(element);
		if (currentIndex < 0 || currentIndex >= maxIndex || currentIndex == index)
			return false;
		
		return ContainerBaseElement.base.prototype._setChildIndex.call(this, element, index);
	};
	
	


/**
 * @depends ContainerBaseElement.js
 */

///////////////////////////////////////////////////////////////////////////	
///////////////////////ListContainerElement////////////////////////////////

/**
 * @class ListContainerElement
 * @inherits ContainerBaseElement
 * 
 * The ListContainer can be used to lay out children in a vertical or horizontal fashion.
 * This container uses children's styles Width, Height, PercentWidth, and PercentHeight.
 * Nesting containers is the best way to quickly and simply build complex layouts.
 * 
 * Width, and Height are treated as highest priority and will override PercentWidth and PercentHeight styles.
 * Exact behavior of conflicting styles is not defined and subject to change. 
 * 
 * See the associated style documentation for additional details.
 * 
 * @constructor ListContainerElement 
 * Creates new ListContainerElement instance.
 */
function ListContainerElement()
{
	ListContainerElement.base.prototype.constructor.call(this);
}

//Inherit from ContainerBaseElement
ListContainerElement.prototype = Object.create(ContainerBaseElement.prototype);
ListContainerElement.prototype.constructor = ListContainerElement;
ListContainerElement.base = ContainerBaseElement;	
	
/////////////Style Types///////////////////////////////

ListContainerElement._StyleTypes = Object.create(null);

/**
 * @style LayoutDirection String
 * 
 * Determines the layout direction of this ListContainer. Allowable values are "horizontal" or "vertical".
 */
ListContainerElement._StyleTypes.LayoutDirection = 			StyleableBase.EStyleType.NORMAL;		// "horizontal" || "vertical"

/**
 * @style LayoutGap Number
 * 
 * Space in pixels to leave between child elements.
 */
ListContainerElement._StyleTypes.LayoutGap = 				StyleableBase.EStyleType.NORMAL;		// number

/**
 * @style LayoutVerticalAlign String
 * 
 * Child vertical alignment to be used when children do not fill all available space. Allowable values are "top", "bottom", or "middle". 
 */
ListContainerElement._StyleTypes.LayoutVerticalAlign = 		StyleableBase.EStyleType.NORMAL;		// "top" || "bottom" || "middle" 

/**
 * @style LayoutHorizontalAlign String
 * 
 * Child horizontal alignment to be used when children do not fill all available space. Allowable values are "left", "right", or "center". 
 */
ListContainerElement._StyleTypes.LayoutHorizontalAlign = 	StyleableBase.EStyleType.NORMAL;		//"left" || "right" || "center"


////////////Default Styles////////////////////////////

ListContainerElement.StyleDefault = new StyleDefinition();

//ListContainerElement specific styles
ListContainerElement.StyleDefault.setStyle("LayoutDirection", 			"vertical");
ListContainerElement.StyleDefault.setStyle("LayoutGap", 				0);
ListContainerElement.StyleDefault.setStyle("LayoutVerticalAlign", 		"top");
ListContainerElement.StyleDefault.setStyle("LayoutHorizontalAlign", 	"left");


//////////////ListContainerElement Protected Functions//////////////

//@Override
ListContainerElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		ListContainerElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("LayoutDirection" in stylesMap ||
			"LayoutGap" in stylesMap)
		{
			this._invalidateMeasure();
			this._invalidateLayout();
		}
		else if ("LayoutVerticalAlign" in stylesMap || "LayoutHorizontalAlign" in stylesMap)
			this._invalidateLayout();
	};

//@Override
ListContainerElement.prototype._doMeasure = 
	function (padWidth, padHeight)
	{
		var contentSize = {width:0, height:0};
		
		var layoutGap = this.getStyle("LayoutGap");
		var layoutDirection = this.getStyle("LayoutDirection");
		
		var child = null;
		
		var width = null;
		var height = null;
		var rotateDegrees = null;
		
		var tempWidth;
		var tempHeight;
		var tempRotateDegrees;		
		
		var insertGap = false;
		
		for (var i = 0; i < this._elements.length; i++)
		{
			child = this._elements[i];
			if (child.getStyle("IncludeInLayout") == false)
				continue;
			
			rotateDegrees = child.getStyle("RotateDegrees");
			
			width = child._getStyledOrMeasuredWidth();
			height = child._getStyledOrMeasuredHeight();
			
			if (rotateDegrees != 0)
			{
				//Record child's current w/h & rotation
				tempWidth = child._width;
				tempHeight = child._height;
				tempRotateDegrees = child._rotateDegrees;
				
				//TODO: Update getMetrics() so we can pass child values.
				//Spoof the rotation position/size so we can get parent metrics.
				child._width = width;
				child._height = height;
				child._rotateDegrees = rotateDegrees;
				
				//Get parent metrics for spoof position
				rotatedMetrics = child.getMetrics(this);
				
				//Put back current values
				child._width = tempWidth;
				child._height = tempHeight;
				child._rotateDegrees = tempRotateDegrees;
				
				width = Math.ceil(rotatedMetrics.getWidth());
				height = Math.ceil(rotatedMetrics.getHeight());
			}
		
			if (layoutDirection == "horizontal")
			{
				//Increment width
				contentSize.width += width;
				
				//Use maximum child height
				if (height > contentSize.height)
					contentSize.height = height;
			}
			else //if (layoutDirection == "vertical")
			{
				//Increment height
				contentSize.height += height;
				
				//Use maximum child height
				if (width > contentSize.width)
					contentSize.width = width;
			}
			
			if (insertGap == true)
			{
				if (layoutDirection == "horizontal")
					contentSize.width += layoutGap;
				else //if (layoutDirection == "vertical")
					contentSize.height += layoutGap;
			}
			else
				insertGap = true;
		}
		
		contentSize.width += padWidth;
		contentSize.height += padHeight;
		
		return contentSize;		
	};

//@Override
ListContainerElement.prototype._doLayout =
	function(paddingMetrics)
	{
		ListContainerElement.base.prototype._doLayout.call(this, paddingMetrics);
	
		var layoutGap = this.getStyle("LayoutGap");
		var layoutDirection = this.getStyle("LayoutDirection");
		var layoutVerticalAlign = this.getStyle("LayoutVerticalAlign");
		var layoutHorizontalAlign = this.getStyle("LayoutHorizontalAlign");
	
		var x = paddingMetrics.getX();
		var y = paddingMetrics.getY();
		var w = paddingMetrics.getWidth();
		var h = paddingMetrics.getHeight();
		
		var i;
		
		var child = null;
		var childSizeData = [];
		
		var totalPercentUsed = 0;
		var numRenderables = 0;
		
		//Record element sizing data.
		for (i = 0; i < this._elements.length; i++)
		{
			child = this._elements[i];
			if (child.getStyle("IncludeInLayout") == false)
				continue;
			
			numRenderables++;
			
			var sizeData = {
				element:child,
				width:null, 
				height:null, 
				pWidth:null, 
				pHeight:null, 
				maxWidth:null, 
				maxHeight:null, 
				minWidth:null, 
				minHeight:null,
				rotateDegrees:null};
			
			sizeData.rotateDegrees = child.getStyle("RotateDegrees");
			
			sizeData.width = child.getStyle("Width");
			if (sizeData.width == null)
			{
				//Percent sizing not supported on transformed elements.
				if (sizeData.rotateDegrees == 0)
					sizeData.pWidth = child.getStyle("PercentWidth");
				
				sizeData.minWidth = child.getStyle("MinWidth");
				sizeData.maxWidth = child.getStyle("MaxWidth");
				
				if (sizeData.pWidth != null && layoutDirection == "horizontal")
					totalPercentUsed += sizeData.pWidth;
			}
			
			sizeData.height = child.getStyle("Height");
			if (sizeData.height == null)
			{
				//Percent sizing not supported on transformed elements.
				if (sizeData.rotateDegrees == 0)
					sizeData.pHeight = child.getStyle("PercentHeight");
				
				sizeData.minHeight = child.getStyle("MinHeight");
				sizeData.maxHeight = child.getStyle("MaxHeight");
				
				if (sizeData.pHeight != null && layoutDirection == "vertical")
					totalPercentUsed += sizeData.pHeight;
			}
			
			if (sizeData.minWidth == null)
				sizeData.minWidth = 0;
			if (sizeData.minHeight == null)
				sizeData.minHeight = 0;
			if (sizeData.maxWidth == null)
				sizeData.maxWidth = Number.MAX_VALUE;
			if (sizeData.maxHeight == null)
				sizeData.maxHeight = Number.MAX_VALUE;
			
			childSizeData.push(sizeData);
		}
		
		var totalGap = 0;
		if (numRenderables > 1)
			totalGap = (numRenderables - 1) * layoutGap;
		
		//Available space for children in layout axis.
		var availableSize = 0;
		if (layoutDirection == "horizontal")
			availableSize = w - totalGap;
		else
			availableSize = h - totalGap;
		
		////////////Calculate element sizes//////////////////
		
		var rotatedMetrics = null;
		var percentSizedElements = [];
		
		//Size all explicitly sized elements, record percent sized, and adjust available size for percent elements.
		for (i = 0; i < childSizeData.length; i++)
		{
			child = childSizeData[i];
			
			//Percent sized elements cannot be rotated
			child.element._setActualRotation(child.rotateDegrees, 0, 0);
			
			if (layoutDirection == "horizontal" && childSizeData[i].width == null && childSizeData[i].pWidth != null)
			{
				child.percentSize = child.pWidth;
				child.minSize = child.minWidth;
				child.maxSize = child.maxWidth;
				percentSizedElements.push(child);
				
				if (child.height == null)
				{
					if (child.pHeight != null)
						child.height = Math.round(h * (child.pHeight / 100));
					else
						child.height = child.element._measuredHeight;
					
					child.height = Math.min(child.maxHeight, child.height);
					child.height = Math.max(child.minHeight, child.height);
				}
			}
			else if (layoutDirection == "vertical" && childSizeData[i].height == null && childSizeData[i].pHeight != null)
			{
				child.percentSize = child.pHeight;
				child.minSize = child.minHeight;
				child.maxSize = child.maxHeight;
				percentSizedElements.push(child);
				
				if (child.width == null)
				{
					if (child.pWidth != null)
						child.width = Math.round(w * (child.pWidth / 100));
					else
						child.width = child.element._measuredWidth;
					
					child.width = Math.min(child.maxWidth, child.width);
					child.width = Math.max(child.minWidth, child.width);
				}
			}
			else
			{
				if (child.width == null)
				{
					if (child.pWidth != null)
						child.width = Math.round(w * (child.pWidth / 100));
					else
						child.width = child.element._measuredWidth;
					
					child.width = Math.min(child.maxWidth, child.width);
					child.width = Math.max(child.minWidth, child.width);
				}
				
				if (child.height == null)
				{
					if (child.pHeight != null)
						child.height = Math.round(h * (child.pHeight / 100));
					else
						child.height = child.element._measuredHeight;
					
					child.height = Math.min(child.maxHeight, child.height);
					child.height = Math.max(child.minHeight, child.height);
				}
				
				child.element._setActualSize(child.width, child.height);
				
				//Update the sizing to reflect size after rotation transform (for layout).
				if (child.rotateDegrees != 0)
				{
					rotatedMetrics = child.element.getMetrics(this);
					
					child.width = Math.ceil(rotatedMetrics.getWidth());
					child.height = Math.ceil(rotatedMetrics.getHeight());
				}
				
				if (layoutDirection == "horizontal")
					availableSize -= child.width;
				else // "vertical"
					availableSize -= child.height;
			}
		}
		
		//We're not using all the space, shrink us.
		if (totalPercentUsed < 100)
			availableSize = Math.round(availableSize * (totalPercentUsed / 100));
		
		//Calculate percent sized elements actual size.
		CanvasElement._calculateMinMaxPercentSizes(percentSizedElements, availableSize);
			
		//Size the percent sized elements.
		for (i = 0; i < percentSizedElements.length; i++)
		{
			child = percentSizedElements[i];
			
			if (layoutDirection == "horizontal")
				child.width = child.actualSize;
			else // "vertical"
				child.height = child.actualSize;
			
			child.element._setActualSize(child.width, child.height);
		}
			
		//Get total content size (gap + elements).
		var totalContentSize = totalGap;
		for (i = 0; i < childSizeData.length; i++)
		{
			if (layoutDirection == "horizontal")
				totalContentSize += childSizeData[i].width;
			else // "vertical"
				totalContentSize += childSizeData[i].height;
		}
		
		var actualX = x;
		var actualY = y;
		
		//Adjust starting position.
		if (layoutDirection == "horizontal" && totalContentSize != w)
		{
			if (layoutHorizontalAlign == "center")
				actualX += Math.round((w / 2) - (totalContentSize / 2));
			else if (layoutHorizontalAlign == "right")
				actualX += (w - totalContentSize);
		}
		else if (layoutDirection == "vertical" && totalContentSize != h)
		{
			if (layoutVerticalAlign == "middle")
				actualY += Math.round((h / 2) - (totalContentSize / 2));
			else if (layoutVerticalAlign == "bottom")
				actualY += (h - totalContentSize);
		}

		//Place elements.
		var insertGap = false;
		for (i = 0; i < childSizeData.length; i++)
		{
			child = childSizeData[i];
			
			if (layoutDirection == "horizontal")
			{
				if (insertGap == true)
					actualX += layoutGap;
				else
					insertGap = true;
				
				if (layoutVerticalAlign == "top")
					actualY = y;
				else if (layoutVerticalAlign == "bottom")
					actualY = y + h - child.height;
				else //middle
					actualY = Math.round(y + (h / 2) - (child.height / 2));
				
				if (child.rotateDegees == 0)
					child.element._setActualPosition(actualX, actualY);
				else
					child.element._setRelativePosition(actualX, actualY, this);
				
				actualX += child.width;
			}
			else // "vertical"
			{
				if (insertGap == true)
					actualY += layoutGap;
				else
					insertGap = true;
				
				if (layoutHorizontalAlign == "left")
					actualX = x;
				else if (layoutHorizontalAlign == "right")
					actualX = x + w - child.width;
				else //center
					actualX = Math.round(x + (w / 2) - (child.width / 2));
				
				if (child.rotateDegrees == 0)
					child.element._setActualPosition(actualX, actualY);
				else
					child.element._setRelativePosition(actualX, actualY, this);				
				
				actualY += child.height;
			}
		}
	};
	
	


/**
 * @depends ListContainerElement.js
 * @depends ScrollButtonSkinElement.js
 */

///////////////////////////////////////////////////////////////////////
///////////////////////ScrollBarElement/////////////////////////////////

/**
 * @class ScrollBarElement
 * @inherits ListContainerElement
 * 
 * ScrollBarElement renders a skin-able scroll bar that can be
 * oriented horizontally or vertically and assigns a default
 * skin to the scroll buttons.
 * 
 * See the default skin ScrollButtonSkinElement for additional skin styles.
 * 
 * @seealso ScrollButtonSkinElement
 * 
 * 
 * @constructor ScrollBarElement 
 * Creates new ScrollBarElement instance.
 */
function ScrollBarElement()
{
	ScrollBarElement.base.prototype.constructor.call(this);
	
	this._buttonIncrement = null;
	this._buttonDecrement = null;
	this._buttonTrack = null;
	this._buttonTab = null;
	
	this._trackAndTabContainer = new CanvasElement();
	this._trackAndTabContainer.setStyle("ClipContent", false);
	this._trackAndTabContainer.setStyle("PercentWidth", 100);
	this._trackAndTabContainer.setStyle("PercentHeight", 100);
	this._trackAndTabContainer.setStyle("MinWidth", 0);	//We dont want base measuring this container
	this._trackAndTabContainer.setStyle("MinHeight", 0); //We dont want base measuring this container
	
	this.addElement(this._trackAndTabContainer);
	
	this._scrollPageSize = 0;
	this._scrollViewSize = 0;
	this._scrollLineSize = 1;
	
	this._scrollValue = 0;
	
	this._scrollTween = null;
	
	var _self = this;
	
	//Private event handlers, need different instance for each ScrollBar, proxy to prototype.
	this._onScrollButtonClickInstance = 
		function (elementMouseEvent)
		{
			_self._onScrollButtonClick(elementMouseEvent);
		};
	this._onScrollTabDragInstance = 
		function (elementEvent)
		{
			_self._onScrollTabDrag(elementEvent);
		};
	this._onScrollBarEnterFrameInstance = 
		function (event)
		{
			_self._onScrollBarEnterFrame(event);
		};
	this._onTrackAndTabContainerMeasureCompleteInstance = 
		function (event)
		{
			_self._onTrackAndTabContainerMeasureComplete(event);
		};
		
	this._trackAndTabContainer.addEventListener("measurecomplete", this._onTrackAndTabContainerMeasureCompleteInstance);
}

//Inherit from ListContainerElement
ScrollBarElement.prototype = Object.create(ListContainerElement.prototype);
ScrollBarElement.prototype.constructor = ScrollBarElement;
ScrollBarElement.base = ListContainerElement;

/////////////Events////////////////////////////////////

/**
 * @event changed ElementEvent
 * Dispatched when the scroll position changes as a result of user interaction or tween.
 */


/////////////Style Types///////////////////////////////

ScrollBarElement._StyleTypes = Object.create(null);

/**
 * @style ScrollTweenDuration Number
 * Time in milliseconds the scroll tween animation should run.
 */
ScrollBarElement._StyleTypes.ScrollTweenDuration =			StyleableBase.EStyleType.NORMAL;		// number (milliseconds)

//ScrollButton / Button styles.
/**
 * @style ButtonIncrementStyle StyleDefinition
 * StyleDefinition to be applied to the Scroll increment Button.
 */
ScrollBarElement._StyleTypes.ButtonIncrementStyle = 	StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition

/**
 * @style ButtonDecrementStyle StyleDefinition
 * StyleDefinition to be applied to the Scroll decrement Button.
 */
ScrollBarElement._StyleTypes.ButtonDecrementStyle = 	StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition

/**
 * @style ButtonTrackStyle StyleDefinition
 * StyleDefinition to be applied to the scroll bar track Button.
 */
ScrollBarElement._StyleTypes.ButtonTrackStyle = 			StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition

/**
 * @style ButtonTabStyle StyleDefinition
 * StyleDefinition to be applied to the scroll bar tab (draggable) Button.
 */
ScrollBarElement._StyleTypes.ButtonTabStyle = 				StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition


////////////Default Styles////////////////////////////

//////TRACK

//up/over/down skins of track
ScrollBarElement.TrackSkinStyleDefault = new StyleDefinition();
ScrollBarElement.TrackSkinStyleDefault.setStyle("BorderType", 						"solid");
ScrollBarElement.TrackSkinStyleDefault.setStyle("BorderThickness", 					1);
ScrollBarElement.TrackSkinStyleDefault.setStyle("BorderColor", 						"#333333");
ScrollBarElement.TrackSkinStyleDefault.setStyle("BackgroundColor", 					"#D9D9D9");
ScrollBarElement.TrackSkinStyleDefault.setStyle("AutoGradientType", 				"none");

//disabled skin of track
ScrollBarElement.DisabledTrackSkinStyleDefault = new StyleDefinition();
ScrollBarElement.DisabledTrackSkinStyleDefault.setStyle("BorderType", 				"solid");
ScrollBarElement.DisabledTrackSkinStyleDefault.setStyle("BorderThickness", 			1);
ScrollBarElement.DisabledTrackSkinStyleDefault.setStyle("BorderColor", 				"#999999");
ScrollBarElement.DisabledTrackSkinStyleDefault.setStyle("BackgroundColor", 			"#ECECEC");
ScrollBarElement.DisabledTrackSkinStyleDefault.setStyle("AutoGradientType", 		"linear");
ScrollBarElement.DisabledTrackSkinStyleDefault.setStyle("AutoGradientStart", 		(+.05));
ScrollBarElement.DisabledTrackSkinStyleDefault.setStyle("AutoGradientStop", 		(-.05));

//track button
ScrollBarElement.ButtonTrackStyleDefault = new StyleDefinition();
ScrollBarElement.ButtonTrackStyleDefault.setStyle("BorderType", 					"none");
ScrollBarElement.ButtonTrackStyleDefault.setStyle("MinWidth", 						15);
ScrollBarElement.ButtonTrackStyleDefault.setStyle("MinHeight", 						15);
ScrollBarElement.ButtonTrackStyleDefault.setStyle("UpSkinStyle", 					ScrollBarElement.TrackSkinStyleDefault);  
ScrollBarElement.ButtonTrackStyleDefault.setStyle("OverSkinStyle", 					ScrollBarElement.TrackSkinStyleDefault); 
ScrollBarElement.ButtonTrackStyleDefault.setStyle("DownSkinStyle", 					ScrollBarElement.TrackSkinStyleDefault);
ScrollBarElement.ButtonTrackStyleDefault.setStyle("DisabledSkinStyle", 				ScrollBarElement.DisabledTrackSkinStyleDefault); 

////Dynamically added based on LayoutDirection

//track button
ScrollBarElement.VButtonTrackStyleDefault = new StyleDefinition();
ScrollBarElement.VButtonTrackStyleDefault.setStyle("PercentWidth", 					100);

//track button
ScrollBarElement.HButtonTrackStyleDefault = new StyleDefinition();
ScrollBarElement.HButtonTrackStyleDefault.setStyle("PercentHeight", 				100);


//////ARROWS

//disabled skin of arrow buttons
ScrollBarElement.DisabledButtonScrollArrowSkinStyleDefault = new StyleDefinition();
ScrollBarElement.DisabledButtonScrollArrowSkinStyleDefault.setStyle("ArrowColor", 			"#777777");

//up / over / down skin of arrow buttons
ScrollBarElement.ButtonScrollArraySkinStyleDefault = new StyleDefinition();
ScrollBarElement.ButtonScrollArraySkinStyleDefault.setStyle("ArrowColor", 					"#000000");

//arrow buttons common
ScrollBarElement.ButtonScrollArrowStyleDefault = new StyleDefinition();
ScrollBarElement.ButtonScrollArrowStyleDefault.setStyle("SkinClass", 						ScrollButtonSkinElement);	
ScrollBarElement.ButtonScrollArrowStyleDefault.setStyle("MinWidth", 						15);
ScrollBarElement.ButtonScrollArrowStyleDefault.setStyle("MinHeight", 						15);
ScrollBarElement.ButtonScrollArrowStyleDefault.setStyle("UpSkinStyle", 						ScrollBarElement.ButtonScrollArraySkinStyleDefault);
ScrollBarElement.ButtonScrollArrowStyleDefault.setStyle("OverSkinStyle", 					ScrollBarElement.ButtonScrollArraySkinStyleDefault);
ScrollBarElement.ButtonScrollArrowStyleDefault.setStyle("DownSkinStyle", 					ScrollBarElement.ButtonScrollArraySkinStyleDefault);
ScrollBarElement.ButtonScrollArrowStyleDefault.setStyle("DisabledSkinStyle", 				ScrollBarElement.DisabledButtonScrollArrowSkinStyleDefault);

////Dynamically added based on LayoutDirection

//arrow button (vertical increment)
ScrollBarElement.VButtonScrollArrowIncSkinStyleDefault = new StyleDefinition();
ScrollBarElement.VButtonScrollArrowIncSkinStyleDefault.setStyle("ArrowDirection", 			"down");

ScrollBarElement.VButtonScrollArrowIncStyleDefault = new StyleDefinition();
ScrollBarElement.VButtonScrollArrowIncStyleDefault.setStyle("PercentWidth", 				100);
ScrollBarElement.VButtonScrollArrowIncStyleDefault.setStyle("UpSkinStyle", 					ScrollBarElement.VButtonScrollArrowIncSkinStyleDefault);
ScrollBarElement.VButtonScrollArrowIncStyleDefault.setStyle("OverSkinStyle", 				ScrollBarElement.VButtonScrollArrowIncSkinStyleDefault);
ScrollBarElement.VButtonScrollArrowIncStyleDefault.setStyle("DownSkinStyle", 				ScrollBarElement.VButtonScrollArrowIncSkinStyleDefault);
ScrollBarElement.VButtonScrollArrowIncStyleDefault.setStyle("DisabledSkinStyle", 			ScrollBarElement.VButtonScrollArrowIncSkinStyleDefault);

//arrow button (vertical decrement)
ScrollBarElement.VButtonScrollArrowDecSkinStyleDefault = new StyleDefinition();
ScrollBarElement.VButtonScrollArrowDecSkinStyleDefault.setStyle("ArrowDirection", 			"up");

ScrollBarElement.VButtonScrollArrowDecStyleDefault = new StyleDefinition();
ScrollBarElement.VButtonScrollArrowDecStyleDefault.setStyle("PercentWidth", 				100);
ScrollBarElement.VButtonScrollArrowDecStyleDefault.setStyle("UpSkinStyle", 					ScrollBarElement.VButtonScrollArrowDecSkinStyleDefault);
ScrollBarElement.VButtonScrollArrowDecStyleDefault.setStyle("OverSkinStyle", 				ScrollBarElement.VButtonScrollArrowDecSkinStyleDefault);
ScrollBarElement.VButtonScrollArrowDecStyleDefault.setStyle("DownSkinStyle", 				ScrollBarElement.VButtonScrollArrowDecSkinStyleDefault);
ScrollBarElement.VButtonScrollArrowDecStyleDefault.setStyle("DisabledSkinStyle", 			ScrollBarElement.VButtonScrollArrowDecSkinStyleDefault);

//arrow button (horizontal increment)
ScrollBarElement.HButtonScrollArrowIncSkinStyleDefault = new StyleDefinition();
ScrollBarElement.HButtonScrollArrowIncSkinStyleDefault.setStyle("ArrowDirection", 			"right");

ScrollBarElement.HButtonScrollArrowIncStyleDefault = new StyleDefinition();
ScrollBarElement.HButtonScrollArrowIncStyleDefault.setStyle("PercentHeight", 				100);
ScrollBarElement.HButtonScrollArrowIncStyleDefault.setStyle("UpSkinStyle", 					ScrollBarElement.HButtonScrollArrowIncSkinStyleDefault);
ScrollBarElement.HButtonScrollArrowIncStyleDefault.setStyle("OverSkinStyle", 				ScrollBarElement.HButtonScrollArrowIncSkinStyleDefault);
ScrollBarElement.HButtonScrollArrowIncStyleDefault.setStyle("DownSkinStyle", 				ScrollBarElement.HButtonScrollArrowIncSkinStyleDefault);
ScrollBarElement.HButtonScrollArrowIncStyleDefault.setStyle("DisabledSkinStyle", 			ScrollBarElement.HButtonScrollArrowIncSkinStyleDefault);

//arrow button (horizontal decrement)
ScrollBarElement.HButtonScrollArrowDecSkinStyleDefault = new StyleDefinition();
ScrollBarElement.HButtonScrollArrowDecSkinStyleDefault.setStyle("ArrowDirection", 			"left");

ScrollBarElement.HButtonScrollArrowDecStyleDefault = new StyleDefinition();
ScrollBarElement.HButtonScrollArrowDecStyleDefault.setStyle("PercentHeight", 				100);
ScrollBarElement.HButtonScrollArrowDecStyleDefault.setStyle("UpSkinStyle", 					ScrollBarElement.HButtonScrollArrowDecSkinStyleDefault);
ScrollBarElement.HButtonScrollArrowDecStyleDefault.setStyle("OverSkinStyle", 				ScrollBarElement.HButtonScrollArrowDecSkinStyleDefault);
ScrollBarElement.HButtonScrollArrowDecStyleDefault.setStyle("DownSkinStyle", 				ScrollBarElement.HButtonScrollArrowDecSkinStyleDefault);
ScrollBarElement.HButtonScrollArrowDecStyleDefault.setStyle("DisabledSkinStyle", 			ScrollBarElement.HButtonScrollArrowDecSkinStyleDefault);


//////TAB

//Applied dynamically based on LayoutDirection (vertical)
ScrollBarElement.VButtonTabStyleDefault = new StyleDefinition();
ScrollBarElement.VButtonTabStyleDefault.setStyle("MinWidth", 						15);
ScrollBarElement.VButtonTabStyleDefault.setStyle("MinHeight", 						30);
ScrollBarElement.VButtonTabStyleDefault.setStyle("PercentWidth", 					100);

//Applied dynamically based on LayoutDirection (horizontal)
ScrollBarElement.HButtonTabStyleDefault = new StyleDefinition();
ScrollBarElement.HButtonTabStyleDefault.setStyle("MinWidth", 						30);
ScrollBarElement.HButtonTabStyleDefault.setStyle("MinHeight", 						15);
ScrollBarElement.HButtonTabStyleDefault.setStyle("PercentHeight", 					100);


//////ROOT SCROLLBAR

ScrollBarElement.StyleDefault = new StyleDefinition();
ScrollBarElement.StyleDefault.setStyle("ScrollTweenDuration", 						180); 			// number (milliseconds)
ScrollBarElement.StyleDefault.setStyle("LayoutDirection", 							"vertical");	// "vertical" || "horizontal"
ScrollBarElement.StyleDefault.setStyle("ClipContent", 								false);
ScrollBarElement.StyleDefault.setStyle("LayoutGap", 								-1); //Collapse borders
ScrollBarElement.StyleDefault.setStyle("LayoutHorizontalAlign", 					"center");
ScrollBarElement.StyleDefault.setStyle("LayoutVerticalAlign", 						"middle"); 
ScrollBarElement.StyleDefault.setStyle("ButtonTrackStyle", 							ScrollBarElement.ButtonTrackStyleDefault);
ScrollBarElement.StyleDefault.setStyle("ButtonIncrementStyle", 						ScrollBarElement.ButtonScrollArrowStyleDefault); 
ScrollBarElement.StyleDefault.setStyle("ButtonDecrementStyle", 						ScrollBarElement.ButtonScrollArrowStyleDefault);

//Applied dynamically based on LayoutDirection
//ScrollBarElement.StyleDefault.setStyle("ButtonTabStyle", 							ScrollBarElement.ButtonTabStyleDefault); 



/////////////ScrollBarElement Public Functions///////////////////

/**
 * @function setScrollPageSize
 * Sets the total number of scroll lines.
 * 
 * @param pageSize int
 * The total number of scroll lines.
 */
ScrollBarElement.prototype.setScrollPageSize = 
	function (pageSize)
	{
		if (this._scrollPageSize == pageSize)
			return;
	
		this._scrollPageSize = pageSize;
		this._invalidateLayout();
	};

/**
 * @function getScrollPageSize
 * Gets the total number of scroll lines.
 * 
 * @returns int
 * The total number of scroll lines.
 */	
ScrollBarElement.prototype.getScrollPageSize = 
	function ()
	{
		return this._scrollPageSize;
	};
	
/**
 * @function setScrollViewSize
 * Sets the number of scroll lines that fit within the view.
 * 
 * @param viewSize int
 * The number of scroll lines that fit within the view.
 */	
ScrollBarElement.prototype.setScrollViewSize = 
	function (viewSize)
	{
		if (this._scrollViewSize == viewSize)
			return;
		
		this._scrollViewSize = viewSize;
		this._invalidateLayout();
	};
	
/**
 * @function getScrollViewSize
 * Gets the number of scroll lines that fit within the view.
 * 
 * @returns int
 * The number of scroll lines that fit within the view.
 */	
ScrollBarElement.prototype.getScrollViewSize = 
	function ()
	{
		return this._scrollViewSize;
	};
	
/**
 * @function setScrollLineSize
 * Sets the number of lines to scroll when a scroll button is pressed.
 * 
 * @param lineSize int
 * The number of lines to scroll when a scroll button is pressed.
 */	
ScrollBarElement.prototype.setScrollLineSize = 
	function (lineSize)
	{
		this._scrollLineSize = lineSize;
	};		
	
/**
 * @function getScrollLineSize
 * Gets the number of lines to scroll when a scroll button is pressed.
 * 
 * @returns int
 * The number of lines to scroll when a scroll button is pressed.
 */	
ScrollBarElement.prototype.getScrollLineSize = 
	function ()
	{
		return this._scrollLineSize;
	};
	
/**
 * @function setScrollValue
 * Sets the position to scroll too. Range is 0 to (page size - view size).
 * 
 * @param value int
 * The position to scroll too.
 */	
ScrollBarElement.prototype.setScrollValue = 
	function (value)
	{
		if (this._scrollValue == value)
			return;
		
		this._scrollValue = value;
		this._invalidateLayout();
	};

/**
 * @function getScrollValue
 * Gets the scroll position.  Range is 0 to (page size - view size).
 * 
 * @returns int
 * The scroll position.
 */	
ScrollBarElement.prototype.getScrollValue = 
	function ()
	{
		return this._scrollValue;
	};

/**
 * @function startScrollTween
 * Starts a tween animation to scroll bar to the supplied scroll position.
 * 
 * @param tweenToValue int
 * The position to scroll too.
 */	
ScrollBarElement.prototype.startScrollTween = 
	function (tweenToValue)
	{
		var tweenDuration = this.getStyle("ScrollTweenDuration");
		if (tweenDuration > 0)
		{
			if (this._scrollTween == null)
			{
				this._scrollTween = new Tween();
				this._scrollTween.startVal = this._scrollValue;
				this._scrollTween.endVal = tweenToValue;
				this._scrollTween.duration = tweenDuration;
				this._scrollTween.startTime = Date.now();
				this._scrollTween.easingFunction = Tween.easeInOutSine;
				
				this.addEventListener("enterframe", this._onScrollBarEnterFrameInstance);
			}
			else
			{
				this._scrollTween.startVal = this._scrollValue;
				this._scrollTween.endVal = tweenToValue;
				this._scrollTween.startTime = Date.now();
				this._scrollTween.easingFunction = Tween.easeOutSine;
			}
		}
		else
		{
			this.endScrollTween();
			this.setScrollValue(tweenToValue);
			this._dispatchEvent(new ElementEvent("changed", false));
		}
	};
	
/**
 * @function endScrollTween
 * Ends the scroll tween animation. Immediately moves the scroll position to
 * the ending position if the tween is still running.
 */		
ScrollBarElement.prototype.endScrollTween = 
	function ()
	{
		if (this._scrollTween != null)
		{
			this.setScrollValue(this._scrollTween.endVal);
			this.removeEventListener("enterframe", this._onScrollBarEnterFrameInstance);
			this._scrollTween = null;
		}
	};	
	
/**
 * @function getTweenToValue
 * Gets the scroll position being tweened too.
 * 
 * @returns int
 * The scroll position beeing tweened too or null if no tween is running.
 */	
ScrollBarElement.prototype.getTweenToValue = 
	function ()
	{
		if (this._scrollTween == null)
			return null;
		
		return this._scrollTween.endVal;
	};
	
/////////////ScrollBarElement Internal Functions///////////////////

//@private container doesnt measure need to be notified by track & tab buttons	
ScrollBarElement.prototype._onTrackAndTabContainerMeasureComplete =
	function (event)
	{
		this._invalidateMeasure();
		this._invalidateLayout();
	};
	
//@private - only active when a tween is running.
ScrollBarElement.prototype._onScrollBarEnterFrame = 
	function (event)
	{
		var scrollValue = this._scrollTween.getValue(Date.now());
		
		if (scrollValue == this._scrollTween.endVal)
			this.endScrollTween();
		else
			this.setScrollValue(scrollValue);
		
		this._dispatchEvent(new ElementEvent("changed", false));
	};
	
//@Override	
ScrollBarElement.prototype._onCanvasElementRemoved = 
	function (addedRemovedEvent)
	{
		ScrollBarElement.base.prototype._onCanvasElementRemoved.call(this, addedRemovedEvent);
		
		this.endScrollTween();
	};		
	
/**
 * @function _onScrollButtonClick
 * Event handler for Buttons (increment, decrement, and track) "click" event. 
 * 
 * @param elementMouseEvent ElementMouseEvent
 * The ElementMouseEvent to process.
 */		
ScrollBarElement.prototype._onScrollButtonClick = 
	function (elementMouseEvent)
	{
		var incrementSize = null;
		
		var startScrollValue = this._scrollValue;
		if (this._scrollTween != null)
			startScrollValue = this._scrollTween.endVal;
		
		startScrollValue = Math.min(this._scrollPageSize - this._scrollViewSize, startScrollValue);
		startScrollValue = Math.max(0, startScrollValue);
		
		if (elementMouseEvent.getTarget() == this._buttonIncrement || 
			elementMouseEvent.getTarget() == this._buttonDecrement)
		{
			incrementSize = this.getScrollLineSize();
			
			if (elementMouseEvent.getTarget() == this._buttonDecrement)
				incrementSize = incrementSize * -1;
		}
		else if (elementMouseEvent.getTarget() == this._buttonTrack)
		{
			incrementSize = this._scrollViewSize * .75;
			
			if (this.getStyle("LayoutDirection") == "horizontal")
			{
				if (elementMouseEvent.getX() <= this._buttonTab._x + (this._buttonTab._width / 2))
					incrementSize = incrementSize * -1;
			}
			else //vertical
			{
				if (elementMouseEvent.getY() <= this._buttonTab._y + (this._buttonTab._height / 2))
					incrementSize = incrementSize * -1;
			}
		}
		
		var endScrollValue = startScrollValue + incrementSize;
		
		endScrollValue = Math.min(this._scrollPageSize - this._scrollViewSize, endScrollValue);
		endScrollValue = Math.max(0, endScrollValue);
		
		if (endScrollValue != startScrollValue)
			this.startScrollTween(endScrollValue);
	};

/**
 * @function _onScrollTabDrag
 * Event handler for Tab Button's "dragging" event. 
 * 
 * @param elementEvent ElementEvent
 * The ElementEvent to process.
 */		
ScrollBarElement.prototype._onScrollTabDrag = 
	function (elementEvent)
	{
		var tabPosition = null;
		var trackSize = null;
		var tabSize = null;
		
		var direction = this.getStyle("LayoutDirection");
		var oldScrollValue = this._scrollValue;
		
		if (direction == "horizontal")
		{
			trackSize = this._buttonTrack._width;
			tabPosition = this._buttonTab._x - this._buttonTrack._x;
			tabSize = this._buttonTab._width;
		}
		else
		{
			trackSize = this._buttonTrack._height;
			tabPosition = this._buttonTab._y - this._buttonTrack._y;
			tabSize = this._buttonTab._height;
		}
		
		//Correct position
		if (tabPosition > trackSize - tabSize)
			tabPosition = trackSize - tabSize;
		if (tabPosition < 0)
			tabPosition = 0;
		
		trackSize = trackSize - tabSize;
		
		//Calculate new ScrollValue
		var scrollRange = this._scrollPageSize - this._scrollViewSize;
		var pixelsPerScaleUnit = trackSize / scrollRange;
		
		var newScrollValue = (tabPosition / pixelsPerScaleUnit);
		if (oldScrollValue != newScrollValue)
		{
			this.setScrollValue(newScrollValue);
			this._dispatchEvent(new ElementEvent("changed", false));
		}
		
		//Always invalidate layout, need to correct drag position.
		this._invalidateLayout();
	};

//@override
ScrollBarElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		ScrollBarElement.base.prototype._doStylesUpdated.call(this, stylesMap);
	
		//////Create Elements//////
		if (this._buttonDecrement == null)
		{
			this._buttonDecrement = new ButtonElement();
			this._buttonDecrement.addEventListener("click", this._onScrollButtonClickInstance);
			this.addElementAt(this._buttonDecrement, 0);
		}
		
		if (this._buttonTrack == null)
		{
			this._buttonTrack = new ButtonElement();
			this._buttonTrack.addEventListener("click", this._onScrollButtonClickInstance);
			this._trackAndTabContainer._addChild(this._buttonTrack);
		}
		
		if (this._buttonTab == null)
		{
			this._buttonTab = new ButtonElement();
			this._buttonTab.setStyle("Draggable", true);
			this._buttonTab.addEventListener("dragging", this._onScrollTabDragInstance);
			this._trackAndTabContainer._addChild(this._buttonTab);
		}
		
		if (this._buttonIncrement == null)
		{
			this._buttonIncrement = new ButtonElement();
			this._buttonIncrement.addEventListener("click", this._onScrollButtonClickInstance);
			this.addElementAt(this._buttonIncrement, this.getNumElements());
		}
		
		if ("LayoutDirection" in stylesMap)
		{
			this._invalidateMeasure();
			this._invalidateLayout();
		}
		else if ("Enabled" in stylesMap)
			this._invalidateLayout();
		

		var layoutDirection = this.getStyle("LayoutDirection");
		
		//We need to inject the default styles specific to LayoutDirection before other styling.
		if ("LayoutDirection" in stylesMap || "ButtonDecrementStyle" in stylesMap)
		{
			this._applySubStylesToElement("ButtonDecrementStyle", this._buttonDecrement);
			
			if (layoutDirection == "horizontal")
				this._buttonDecrement._addStyleDefinitionAt(ScrollBarElement.HButtonScrollArrowDecStyleDefault, 0, true);
			else
				this._buttonDecrement._addStyleDefinitionAt(ScrollBarElement.VButtonScrollArrowDecStyleDefault, 0, true);
		}
		
		if ("LayoutDirection" in stylesMap || "ButtonTrackStyle" in stylesMap)
		{
			this._applySubStylesToElement("ButtonTrackStyle", this._buttonTrack);
			
			if (layoutDirection == "horizontal")
				this._buttonTrack._addStyleDefinitionAt(ScrollBarElement.HButtonTrackStyleDefault, 0, true);
			else
				this._buttonTrack._addStyleDefinitionAt(ScrollBarElement.VButtonTrackStyleDefault, 0, true);
		}
		
		if ("LayoutDirection" in stylesMap || "ButtonTabStyle" in stylesMap)
		{
			this._applySubStylesToElement("ButtonTabStyle", this._buttonTab);
			
			if (layoutDirection == "horizontal")
				this._buttonTab._addStyleDefinitionAt(ScrollBarElement.HButtonTabStyleDefault, 0, true);
			else
				this._buttonTab._addStyleDefinitionAt(ScrollBarElement.VButtonTabStyleDefault, 0, true);
		}
		
		if ("LayoutDirection" in stylesMap || "ButtonIncrementStyle" in stylesMap)
		{
			this._applySubStylesToElement("ButtonIncrementStyle", this._buttonIncrement);
			
			if (layoutDirection == "horizontal")
				this._buttonIncrement._addStyleDefinitionAt(ScrollBarElement.HButtonScrollArrowIncStyleDefault, 0, true);
			else
				this._buttonIncrement._addStyleDefinitionAt(ScrollBarElement.VButtonScrollArrowIncStyleDefault, 0, true);
		}
		
		if ("ScrollTweenDuration" in stylesMap && this.getStyle("ScrollTweenDuration") == 0)
			this.endScrollTween();
	};
	
	
//@override
ScrollBarElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		//Get the ListContainer measured height
		var measuredSize = ScrollBarElement.base.prototype._doMeasure.call(this, padWidth, padHeight);
	
		//Account for the tab and track (container doesnt measure)
		
		//TODO: Handle rotation of tab?? 
		
		if (this.getStyle("LayoutDirection") == "vertical")
		{
			var tabMinHeight = this._buttonTab.getStyle("MinHeight");
			var trackWidth = this._buttonTrack._getStyledOrMeasuredWidth() + padWidth;
			var tabWidth = this._buttonTab._getStyledOrMeasuredWidth() + padWidth;
			
			measuredSize.height += (tabMinHeight * 2);
			
			if (tabWidth > measuredSize.width)
				measuredSize.width = tabWidth;
			if (trackWidth > measuredSize.width)
				measuredSize.width = trackWidth;
		}
		else //horizontal
		{
			var tabMinWidth = this._buttonTab.getStyle("MinWidth");
			var tabHeight = this._buttonTab._getStyledOrMeasuredHeight() + padHeight;
			var trackHeight = this._buttonTrack._getStyledOrMeasuredHeight() + padHeight;
			
			measuredSize.width += (tabMinWidth * 2);
			
			if (tabHeight > measuredSize.width)
				measuredSize.width = tabHeight;
			if (trackHeight > measuredSize.width)
				measuredSize.width = trackHeight;
		}
		
		return measuredSize;
	};	
	
//@Override	
ScrollBarElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		ScrollBarElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		//Correct the scroll value (size reduction forces us to scroll up)
		this._scrollValue = Math.min(this._scrollValue, this._scrollPageSize - this._scrollViewSize);
		this._scrollValue = Math.max(this._scrollValue, 0);
		
		//Disable / Enable components
		if (this._scrollViewSize >= this._scrollPageSize || this.getStyle("Enabled") == false)
		{
			this._buttonIncrement.setStyle("Enabled", false);
			this._buttonDecrement.setStyle("Enabled", false);
			this._buttonTrack.setStyle("Enabled", false);
			this._buttonTab.setStyle("Visible", false);
		}
		else
		{
			this._buttonIncrement.clearStyle("Enabled");
			this._buttonDecrement.clearStyle("Enabled");
			this._buttonTrack.clearStyle("Enabled");
			this._buttonTab.clearStyle("Visible");
		}
		
		var availableTrackSize;
		var pixelsPerScaleUnit = 0;
		
		//TODO: Handle rotation of tab??
		var tabWidth = this._buttonTab.getStyle("Width");
		var tabMinWidth = this._buttonTab.getStyle("MinWidth");
		var tabMaxWidth = this._buttonTab.getStyle("MaxWidth");
		var tabPWidth = this._buttonTab.getStyle("PercentWidth");
		
		if (tabMinWidth == null)
			tabMinWidth = 0;
		if (tabMaxWidth == null)
			tabMaxWidth = Number.MAX_VALUE;
		
		var tabHeight = this._buttonTab.getStyle("Height");
		var tabMinHeight = this._buttonTab.getStyle("MinHeight");
		var tabMaxHeight = this._buttonTab.getStyle("MaxHeight");
		var tabPHeight = this._buttonTab.getStyle("PercentHeight");
		
		if (tabMinHeight == null)
			tabMinHeight = 0;
		if (tabMaxHeight == null)
			tabMaxHeight = Number.MAX_VALUE;
		
		var trackWidth = this._buttonTrack.getStyle("Width");
		var trackMinWidth = this._buttonTrack.getStyle("MinWidth");
		var trackMaxWidth = this._buttonTrack.getStyle("MaxWidth");
		var trackPWidth = this._buttonTrack.getStyle("PercentWidth");		
		
		if (trackMinWidth == null)
			trackMinWidth = 0;
		if (trackMaxWidth == null)
			trackMaxWidth = Number.MAX_VALUE;
		
		var trackHeight = this._buttonTrack.getStyle("Height");
		var trackMinHeight = this._buttonTrack.getStyle("MinHeight");
		var trackMaxHeight = this._buttonTrack.getStyle("MaxHeight");
		var trackPHeight = this._buttonTrack.getStyle("PercentHeight");
		
		if (trackMinHeight == null)
			trackMinHeight = 0;
		if (trackMaxHeight == null)
			trackMaxHeight = Number.MAX_VALUE;
		
		//Size and position the track and tab (their parent container doesnt layout or measure)
		var direction = this.getStyle("LayoutDirection");
		if (direction == "vertical")
		{
			if (tabHeight == null)
			{
				if (this._scrollPageSize > 0)
					tabHeight = Math.round(this._trackAndTabContainer._height * (this._scrollViewSize / this._scrollPageSize));
				else
					tabHeight = 0;
				
				tabHeight = Math.min(tabHeight, tabMaxHeight);
				tabHeight = Math.max(tabHeight, tabMinHeight);
			}
			
			var tabActualWidth = tabWidth;
			if (tabActualWidth == null)
			{
				if (tabPWidth != null)
					tabActualWidth = Math.round(this._trackAndTabContainer._width * (tabPWidth / 100));
				
				if (tabActualWidth == null)
					tabActualWidth = tabMinWidth;
				
				tabActualWidth = Math.min(tabActualWidth, tabMaxWidth);
				tabActualWidth = Math.max(tabActualWidth, tabMinWidth);
			}
			
			var trackActualWidth = trackWidth;
			if (trackActualWidth == null)
			{
				if (trackPWidth != null)
					trackActualWidth = Math.round(this._trackAndTabContainer._width * (trackPWidth / 100));
				
				if (trackActualWidth == null)
					trackActualWidth = trackMinWidth;
				
				trackActualWidth = Math.min(tabActualWidth, trackMaxWidth);
				trackActualWidth = Math.max(tabActualWidth, trackMinWidth);
			}
			
			if (this._scrollPageSize > this._scrollViewSize)
			{
				availableTrackSize = this._trackAndTabContainer._height - tabHeight;
				pixelsPerScaleUnit = availableTrackSize / (this._scrollPageSize - this._scrollViewSize);
			}
			
			this._buttonTrack._setActualSize(trackActualWidth, this._trackAndTabContainer._height);
			this._buttonTab._setActualSize(tabActualWidth, tabHeight);
			
			var hAlign = this.getStyle("LayoutHorizontalAlign");
			if (hAlign == "left")
			{
				this._buttonTrack._setActualPosition(0, 0);
				this._buttonTab._setActualPosition(0, Math.round(this._scrollValue * pixelsPerScaleUnit));
			}
			else if (hAlign == "center")
			{
				this._buttonTrack._setActualPosition(Math.round((this._trackAndTabContainer._width / 2) - (this._buttonTrack._width / 2)), 0);
				this._buttonTab._setActualPosition(Math.round((this._trackAndTabContainer._width / 2) - (this._buttonTab._width / 2)), Math.round(this._scrollValue * pixelsPerScaleUnit));
			}
			else //right
			{
				this._buttonTrack._setActualPosition(this._trackAndTabContainer._width - this._buttonTrack._width, 0);
				this._buttonTab._setActualPosition(this._trackAndTabContainer._width - this._buttonTab._width, Math.round(this._scrollValue * pixelsPerScaleUnit));
			}
		}
		else //horizontal
		{
			if (tabWidth == null)
			{
				if (this._scrollPageSize > 0)
					tabWidth = Math.round(this._trackAndTabContainer._width * (this._scrollViewSize / this._scrollPageSize));
				else
					tabWidth = 0;
				
				tabWidth = Math.min(tabWidth, tabMaxWidth);
				tabWidth = Math.max(tabWidth, tabMinWidth);
			}
			
			var tabActualHeight = tabHeight;
			if (tabActualHeight == null)
			{
				if (tabPHeight != null)
					tabActualHeight = Math.round(this._trackAndTabContainer._height * (tabPHeight / 100));
				
				if (tabActualHeight == null)
					tabActualHeight = tabMinHeight;
				
				tabActualHeight = Math.min(tabActualHeight, tabMaxHeight);
				tabActualHeight = Math.max(tabActualHeight, tabMinHeight);
			}
			
			var trackActualHeight = trackHeight;
			if (trackActualHeight == null)
			{
				if (trackPHeight != null)
					trackActualHeight = Math.round(this._trackAndTabContainer._height * (trackPHeight / 100));
				
				if (trackActualHeight == null)
					trackActualHeight = trackMinHeight;
				
				trackActualHeight = Math.min(tabActualHeight, trackMaxHeight);
				trackActualHeight = Math.max(tabActualHeight, trackMinHeight);
			}
			
			if (this._scrollPageSize > this._scrollViewSize)
			{
				availableTrackSize = this._trackAndTabContainer._width - tabWidth;
				pixelsPerScaleUnit = availableTrackSize / (this._scrollPageSize - this._scrollViewSize);
			}
			
			this._buttonTrack._setActualSize(this._trackAndTabContainer._width, trackActualHeight);
			this._buttonTab._setActualSize(tabWidth,tabActualHeight);
			
			var vAlign = this.getStyle("LayoutVerticalAlign");
			if (vAlign == "top")
			{
				this._buttonTrack._setActualPosition(0, 0);
				this._buttonTab._setActualPosition(Math.round(this._scrollValue * pixelsPerScaleUnit), 0);
			}
			else if (vAlign == "middle")
			{
				this._buttonTrack._setActualPosition(0, Math.round((this._trackAndTabContainer._height / 2) - (this._buttonTrack._height / 2)));
				this._buttonTab._setActualPosition(Math.round(this._scrollValue * pixelsPerScaleUnit), Math.round((this._trackAndTabContainer._height / 2) - (this._buttonTab._height / 2)));
			}
			else //bottom
			{
				this._buttonTrack._setActualPosition(0, this._trackAndTabContainer._height - this._buttonTrack._height);
				this._buttonTab._setActualPosition(Math.round(this._scrollValue * pixelsPerScaleUnit), this._trackAndTabContainer._height - this._buttonTab._height);
			}
		}
	};	
	
	


/**
 * @depends SkinnableElement.js
 */

/////////////////////////////////////////////////
//////////////////ButtonElement//////////////////

/**
 * @class ButtonElement
 * @inherits SkinnableElement
 * 
 * Button is a skin-able element that supports 4 states corresponding to mouse states
 * "up", "over", "down" and "disabled". It also has an optional label. 
 * 
 * Being a SkinnableElement, Button proxies its styles to its skins. 
 * You may assign custom skins and assign any styles you wish to apply to all skins to the Button itself. 
 * 
 * Button is used as a base class for many click-able elements such as
 * ToggleButton, Checkbox, RadioButton, etc. 
 * 
 * 
 * @constructor ButtonElement 
 * Creates new ButtonElement instance.
 */
function ButtonElement()
{
	ButtonElement.base.prototype.constructor.call(this);

	var _self = this;
	
	this._labelElement = null;
	
	//Private handler, need different instance for each button, proxy to prototype.	
	this._onButtonEventInstance = 
		function (elementEvent)
		{
			if (elementEvent.getType() == "mousedown")
				_self._onButtonMouseDown(elementEvent);
			else if (elementEvent.getType() == "mouseup")
				_self._onButtonMouseUp(elementEvent);
			else if (elementEvent.getType() == "click")
				_self._onButtonClick(elementEvent);
			else if (elementEvent.getType() == "rollover")
				_self._onButtonRollover(elementEvent);
			else if (elementEvent.getType() == "rollout")
				_self._onButtonRollout(elementEvent);
		};
		
	this.addEventListener("mousedown", this._onButtonEventInstance);
	this.addEventListener("mouseup", this._onButtonEventInstance);
	this.addEventListener("rollover", this._onButtonEventInstance);
	this.addEventListener("rollout", this._onButtonEventInstance);
	this.addEventListener("click", this._onButtonEventInstance);
}

//Inherit from SkinnableElement
ButtonElement.prototype = Object.create(SkinnableElement.prototype);
ButtonElement.prototype.constructor = ButtonElement;
ButtonElement.base = SkinnableElement;


/////////////Style Types///////////////////////////////

ButtonElement._StyleTypes = Object.create(null);

//New button specific styles.

/**
 * @style Text String
 * 
 * Text string to be displayed as the button label.
 */
ButtonElement._StyleTypes.Text = 						StyleableBase.EStyleType.NORMAL;		// "any string" || null

/**
 * @style SkinClass CanvasElement
 * 
 * The CanvasElement constructor type to apply to all skin states. 
 * Specific states such as UpSkinClass will override SkinClass when they are equal priority.
 */
ButtonElement._StyleTypes.SkinClass =					StyleableBase.EStyleType.NORMAL;	//Element constructor()

/**
 * @style UpSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the button skin when the button is in the "up" state. 
 * This will override SkinClass when equal or higher priority than SkinClass.
 */
ButtonElement._StyleTypes.UpSkinClass = 				StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style UpSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "up" state skin element.
 */
ButtonElement._StyleTypes.UpSkinStyle = 				StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

/**
 * @style UpTextColor String
 * 
 * Hex color value to be used for the button label when the button is in the "up" state. Format like "#FF0000" (red).
 * This will override TextColor when equal or higher priority than TextColor.
 */
ButtonElement._StyleTypes.UpTextColor = 				StyleableBase.EStyleType.NORMAL;		//"#000000"

/**
 * @style OverSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the button skin when the button is in the "over" state. 
 * This will override SkinClass when equal or higher priority than SkinClass.
 */
ButtonElement._StyleTypes.OverSkinClass = 				StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style OverSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "over" state skin element.
 */
ButtonElement._StyleTypes.OverSkinStyle = 				StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

/**
 * @style OverTextColor String
 * 
 * Hex color value to be used for the button label when the button is in the "over" state. Format like "#FF0000" (red).
 * This will override TextColor when equal or higher priority than TextColor.
 */
ButtonElement._StyleTypes.OverTextColor = 				StyleableBase.EStyleType.NORMAL;		//"#000000"

/**
 * @style DownSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the button skin when the button is in the "down" state. 
 * This will override SkinClass when equal or higher priority than SkinClass.
 */
ButtonElement._StyleTypes.DownSkinClass = 				StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style DownSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "down" state skin element.
 */
ButtonElement._StyleTypes.DownSkinStyle = 				StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

/**
 * @style DownTextColor String
 * 
 * Hex color value to be used for the button label when the button is in the "down" state. Format like "#FF0000" (red).
 * This will override TextColor when equal or higher priority than TextColor.
 */
ButtonElement._StyleTypes.DownTextColor = 				StyleableBase.EStyleType.NORMAL;		//"#000000"

/**
 * @style DisabledSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the button skin when the button is in the "disabled" state. 
 * This will override SkinClass when equal or higher priority than SkinClass.
 */
ButtonElement._StyleTypes.DisabledSkinClass = 			StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style DisabledSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "disabled" state skin element.
 */
ButtonElement._StyleTypes.DisabledSkinStyle = 			StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

/**
 * @style DisabledTextColor String
 * 
 * Hex color value to be used for the button label when the button is in the "disabled" state. Format like "#FF0000" (red).
 * This will override TextColor when equal or higher priority than TextColor.
 */
ButtonElement._StyleTypes.DisabledTextColor = 			StyleableBase.EStyleType.NORMAL;		//"#000000"


//Change some of the text styles not to inherit, we'll set these to the label 
//so the label will use button defaults if no style explicitly set.

/**
 * @style TextHorizontalAlign String
 * 
 * Determines alignment when rendering text. Available values are "left", "center", and "right".
 */
ButtonElement._StyleTypes.TextHorizontalAlign =			StyleableBase.EStyleType.NORMAL;		// "left" || "center" || "right"

/**
 * @style TextVerticalAlign String
 * 
 * Determines the baseline when rendering text. Available values are "top", "middle", or "bottom".
 */
ButtonElement._StyleTypes.TextVerticalAlign =			StyleableBase.EStyleType.NORMAL;  		// "top" || "middle" || "bottom"


/////////Default Styles//////////////////////////////

ButtonElement.StyleDefault = new StyleDefinition();

//Override base class styles
ButtonElement.StyleDefault.setStyle("PaddingTop",						3);
ButtonElement.StyleDefault.setStyle("PaddingBottom",                    3);
ButtonElement.StyleDefault.setStyle("PaddingLeft",                      4);
ButtonElement.StyleDefault.setStyle("PaddingRight",                     4);

ButtonElement.StyleDefault.setStyle("TextHorizontalAlign", 				"center"); 
ButtonElement.StyleDefault.setStyle("TextVerticalAlign", 				"middle");

ButtonElement.StyleDefault.setStyle("TabStop", 							0);			// number

//ButtonElement specific styles.
ButtonElement.StyleDefault.setStyle("Text", 							null);
ButtonElement.StyleDefault.setStyle("SkinClass", 						CanvasElement); //Not necessary, just for completeness

ButtonElement.StyleDefault.setStyle("UpSkinClass", 						CanvasElement);
ButtonElement.StyleDefault.setStyle("OverSkinClass", 					CanvasElement);
ButtonElement.StyleDefault.setStyle("DownSkinClass", 					CanvasElement);
ButtonElement.StyleDefault.setStyle("DisabledSkinClass", 				CanvasElement);

ButtonElement.StyleDefault.setStyle("UpTextColor", 						"#000000");
ButtonElement.StyleDefault.setStyle("OverTextColor", 					"#000000");
ButtonElement.StyleDefault.setStyle("DownTextColor", 					"#000000");
ButtonElement.StyleDefault.setStyle("DisabledTextColor", 				"#888888");

//Skin Defaults////////////////////////////
ButtonElement.UpSkinStyleDefault = new StyleDefinition();

ButtonElement.UpSkinStyleDefault.setStyle("BorderType", 				"solid");
ButtonElement.UpSkinStyleDefault.setStyle("BorderThickness", 			1);
ButtonElement.UpSkinStyleDefault.setStyle("BorderColor", 				"#333333");
ButtonElement.UpSkinStyleDefault.setStyle("BackgroundColor", 			"#EBEBEB");
ButtonElement.UpSkinStyleDefault.setStyle("AutoGradientType", 			"linear");
ButtonElement.UpSkinStyleDefault.setStyle("AutoGradientStart", 			(+.05));
ButtonElement.UpSkinStyleDefault.setStyle("AutoGradientStop", 			(-.05));

ButtonElement.OverSkinStyleDefault = new StyleDefinition();

ButtonElement.OverSkinStyleDefault.setStyle("BorderType", 				"solid");
ButtonElement.OverSkinStyleDefault.setStyle("BorderThickness", 			1);
ButtonElement.OverSkinStyleDefault.setStyle("BorderColor", 				"#333333");
ButtonElement.OverSkinStyleDefault.setStyle("BackgroundColor", 			"#DDDDDD");
ButtonElement.OverSkinStyleDefault.setStyle("AutoGradientType", 		"linear");
ButtonElement.OverSkinStyleDefault.setStyle("AutoGradientStart", 		(+.05));
ButtonElement.OverSkinStyleDefault.setStyle("AutoGradientStop", 		(-.05));

ButtonElement.DownSkinStyleDefault = new StyleDefinition();

ButtonElement.DownSkinStyleDefault.setStyle("BorderType", 				"solid");
ButtonElement.DownSkinStyleDefault.setStyle("BorderThickness", 			1);
ButtonElement.DownSkinStyleDefault.setStyle("BorderColor", 				"#333333");
ButtonElement.DownSkinStyleDefault.setStyle("BackgroundColor", 			"#CCCCCC");
ButtonElement.DownSkinStyleDefault.setStyle("AutoGradientType", 		"linear");
ButtonElement.DownSkinStyleDefault.setStyle("AutoGradientStart", 		(-.06));
ButtonElement.DownSkinStyleDefault.setStyle("AutoGradientStop", 		(+.02));

ButtonElement.DisabledSkinStyleDefault = new StyleDefinition();

ButtonElement.DisabledSkinStyleDefault.setStyle("BorderType", 			"solid");
ButtonElement.DisabledSkinStyleDefault.setStyle("BorderThickness", 		1);
ButtonElement.DisabledSkinStyleDefault.setStyle("BorderColor", 			"#999999");
ButtonElement.DisabledSkinStyleDefault.setStyle("BackgroundColor", 		"#ECECEC");
ButtonElement.DisabledSkinStyleDefault.setStyle("AutoGradientType", 	"linear");
ButtonElement.DisabledSkinStyleDefault.setStyle("AutoGradientStart", 	(+.05));
ButtonElement.DisabledSkinStyleDefault.setStyle("AutoGradientStop", 	(-.05));
/////////////////////////////////////////////////

//Apply Skin Defaults
ButtonElement.StyleDefault.setStyle("UpSkinStyle", 						ButtonElement.UpSkinStyleDefault);
ButtonElement.StyleDefault.setStyle("OverSkinStyle", 					ButtonElement.OverSkinStyleDefault);
ButtonElement.StyleDefault.setStyle("DownSkinStyle", 					ButtonElement.DownSkinStyleDefault);
ButtonElement.StyleDefault.setStyle("DisabledSkinStyle", 				ButtonElement.DisabledSkinStyleDefault);


	
/////////////ButtonElement Protected Functions/////////////////////	
	
/**
 * @function _updateState
 * Called in response to mouse events, and when the Button is added to the display hierarchy (if mouse is enabled).
 * Updates the Button skin state.
 */
ButtonElement.prototype._updateState = 
	function ()
	{
		var newState = "up";
	
		if (this.getStyle("Enabled") == false)
			newState = "disabled";
		else
		{
			if (this._mouseIsDown == true)
				newState = "down";
			else if (this._mouseIsOver == true)
				newState = "over";
		}
		
		this.setStyle("SkinState", newState);
	};

/**
 * @function _onButtonMouseDown
 * Event handler for "mousedown" event. Updates the Button skin state.
 * Overriding this is more efficient than adding an additional "mousedown" event listener.
 * 
 * @param elementMouseEvent ElementMouseEvent
 * The ElementMouseEvent to process.
 */	
ButtonElement.prototype._onButtonMouseDown = 
	function (elementMouseEvent)
	{
		this._updateState();
	};
	
/**
 * @function _onButtonMouseUp
 * Event handler for "mouseup" event. Updates the Button skin state.
 * Overriding this is more efficient than adding an additional "mouseup" event listener.
 * 
 * @param elementMouseEvent ElementMouseEvent
 * The ElementMouseEvent to process.
 */		
ButtonElement.prototype._onButtonMouseUp = 
	function (elementMouseEvent)
	{
		this._updateState();
	};		

/**
 * @function _onButtonRollover
 * Event handler for "rollover" event. Updates the Button skin state.
 * Overriding this is more efficient than adding an additional "rollover" event listener.
 * 
 * @param elementEvent ElementEvent
 * The ElementEvent to process.
 */		
ButtonElement.prototype._onButtonRollover = 
	function (elementEvent)
	{
		this._updateState();
	};

/**
 * @function _onButtonRollout
 * Event handler for "rollout" event. Updates the Button skin state.
 * Overriding this is more efficient than adding an additional "rollout" event listener.
 * 
 * @param elementEvent ElementEvent
 * The ElementEvent to process.
 */		
ButtonElement.prototype._onButtonRollout = 
	function (elementEvent)
	{
		this._updateState();
	};	
	
/**
 * @function _onButtonClick
 * Event handler for "click" event. Cancels the event if the Button is disabled.
 * Overriding this is more efficient than adding an additional "click" event listener.
 * 
 * @param elementMouseEvent ElementMouseEvent
 * The ElementMouseEvent to process.
 */			
ButtonElement.prototype._onButtonClick = 
	function (elementMouseEvent)
	{
		//Implementor will not expect a click event when button is disabled. 
		if (this.getStyle("Enabled") == false)
			elementMouseEvent.cancelEvent();
	};
	
//@override
ButtonElement.prototype._getSkinClass = 
	function (state)
	{
		var stateSkinClass = null;
	
		if (state == "up")
			stateSkinClass = this.getStyleData("UpSkinClass");
		else if (state == "over")
			stateSkinClass = this.getStyleData("OverSkinClass");
		else if (state == "down")
			stateSkinClass = this.getStyleData("DownSkinClass");
		else if (state == "disabled")
			stateSkinClass = this.getStyleData("DisabledSkinClass");
		
		var skinClass = this.getStyleData("SkinClass");
		
		//Shouldnt have null stateSkinClass
		if (stateSkinClass == null || skinClass.comparePriority(stateSkinClass) > 0) //Use skinClass if higher priority
			return skinClass.value;
		
		return stateSkinClass.value;
	};

//@override	
ButtonElement.prototype._getSubStyleNameForSkinState = 
	function (state)
	{
		if (state == "up")
			return "UpSkinStyle";
		if (state == "over")
			return "OverSkinStyle";
		if (state == "down")
			return "DownSkinStyle";
		if (state == "disabled")
			return "DisabledSkinStyle";
		
		return ButtonElement.base.prototype._getSubStyleNameForSkinState.call(this, state);
	};	
	
//@override
ButtonElement.prototype._changeState = 
	function (state)
	{
		ButtonElement.base.prototype._changeState.call(this, state);
		
		this._updateTextColor();
	};
	
/**
 * @function _getTextColor
 * Gets the text color to be used for the supplied state. 
 * Override this to add styles for additional states.
 * 
 * @param state String
 * String representing the state to return the text color style.
 * 
 * @returns string
 * Text color for the supplied state.
 */	
ButtonElement.prototype._getTextColor = 
	function (state)
	{
		var stateTextColor = null;
		
		if (state == "up")
			stateTextColor = this.getStyleData("UpTextColor");
		else if (state == "over")
			stateTextColor = this.getStyleData("OverTextColor");
		else if (state == "down")
			stateTextColor = this.getStyleData("DownTextColor");
		else if (state == "disabled")
			stateTextColor = this.getStyleData("DisabledTextColor");

		var textColor = this.getStyleData("TextColor");
		
		//Shouldnt have null stateTextColor
		if (stateTextColor == null || textColor.comparePriority(stateTextColor) > 0) //Use textColor if higher priority
			return textColor.value;
		
		return stateTextColor.value;
	};

/**
 * @function _updateTextColor
 * Updates the text color in response to state changes.
 */		
ButtonElement.prototype._updateTextColor = 
	function ()
	{
		if (this._labelElement == null)
			return;
		
		this._labelElement.setStyle("TextColor", this._getTextColor(this._currentSkinState));
	};
	
/**
 * @function _updateText
 * Updates the buttons label text in response to style changes.
 */	
ButtonElement.prototype._updateText = 
	function ()
	{
		var text = this.getStyle("Text");
		if (text == null || text == "")
		{
			if (this._labelElement != null)
			{
				this._removeChild(this._labelElement);
				this._labelElement = null;
			}
		}
		else
		{
			if (this._labelElement == null)
			{
				this._labelElement = this._createLabel();
				if (this._labelElement != null)
				{
					this._updateTextColor();
					this._addChild(this._labelElement);
				}
			}
			
			if (this._labelElement != null)
				this._labelElement.setStyle("Text", text);
		}	
	};
	
//@override
ButtonElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		ButtonElement.base.prototype._doStylesUpdated.call(this, stylesMap);
	
		////Update skin classes and sub styles.
		if ("SkinClass" in stylesMap || "UpSkinClass" in stylesMap)
			this._updateSkinClass("up");
		if ("UpSkinStyle" in stylesMap)
			this._updateSkinStyleDefinitions("up");
		
		if ("SkinClass" in stylesMap || "OverSkinClass" in stylesMap)
			this._updateSkinClass("over");
		if ("OverSkinStyle" in stylesMap)
			this._updateSkinStyleDefinitions("over");
		
		if ("SkinClass" in stylesMap || "DownSkinClass" in stylesMap)
			this._updateSkinClass("down");
		if ("DownSkinStyle" in stylesMap)
			this._updateSkinStyleDefinitions("down");
		
		if ("SkinClass" in stylesMap || "DisabledSkinClass" in stylesMap)
			this._updateSkinClass("disabled");
		if ("DisabledSkinStyle" in stylesMap)
			this._updateSkinStyleDefinitions("disabled");
		
		//Create / Destroy and proxy text to label.
		if ("Text" in stylesMap)
			this._updateText();
		
		//Only update the state if mouse is enabled, when disabled it means states are being manually controlled.
		if ("Enabled" in stylesMap && this.getStyle("MouseEnabled") == true)
			this._updateState();
		
		if ("TextHorizontalAlign" in stylesMap && this._labelElement != null)
			this._labelElement.setStyle("TextHorizontalAlign", this.getStyle("TextHorizontalAlign"));
		
		if ("TextVerticalAlign" in stylesMap && this._labelElement != null)
			this._labelElement.setStyle("TextVerticalAlign", this.getStyle("TextVerticalAlign"));
		
		//Always call (can optimize by checking for all text color styles)
		this._updateTextColor();
	};	
	
/**
 * @function _createLabel
 * Creates the Button's label instance when Text style is not null or empty.
 * 
 * @returns LabelElement
 * New LabelElement instance
 */	
ButtonElement.prototype._createLabel = 
	function ()
	{
		var label = new LabelElement();
	
		label.setStyle("MouseEnabled", false);
		label.setStyle("TextHorizontalAlign", this.getStyle("TextHorizontalAlign"));
		label.setStyle("TextVerticalAlign", this.getStyle("TextVerticalAlign"));
		
		label.setStyle("Padding", 0); //Wipe out default padding (no doubly padding, only this elements padding is necessary)
		
		return label;
	};
	
//@override
ButtonElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		var measuredSize = null;
	
		//Base size off of label.
		if (this._labelElement != null)
		{
			var labelWidth = this._labelElement._getStyledOrMeasuredWidth();
			var labelHeight = this._labelElement._getStyledOrMeasuredHeight();
			
			measuredSize = {width:labelWidth + padWidth, height:labelHeight + padHeight};
		}
		else
			measuredSize = ButtonElement.base.prototype._doMeasure.call(this, padWidth, padHeight);

		return measuredSize;
	};

//@override	
ButtonElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		ButtonElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		if (this._labelElement != null)
		{
			this._labelElement._setActualPosition(paddingMetrics.getX(), paddingMetrics.getY());
			this._labelElement._setActualSize(paddingMetrics.getWidth(), paddingMetrics.getHeight());
		}
	};	
	


/**
 * @depends ButtonElement.js
 */

///////////////////////////////////////////////////////////////////////////	
///////////////////////ToggleButtonElement/////////////////////////////////

/**
 * @class ToggleButtonElement
 * @inherits ButtonElement
 * 
 * ToggleButton is identical to a button except that it adds "selected" versions of
 * the 4 button states and Toggles from selected to not-selected when clicked. It also
 * dispatches a "changed" event when the selected state changes.
 * 
 * ToggleButton selected states:
 * "selectedUp", "selectedOver", "selectedDown", "selectedDisabled".
 * 
 * Being a SkinnableElement, ToggleButton proxies its styles to its skins. 
 * You may assign custom skins and assign any styles you wish to apply to all skins to the ToggleButton itself. 
 * 
 * ToggleButton is a base class for components such as Checkbox and RadioButton.
 * 
 * 
 * @constructor ToggleButtonElement 
 * Creates new ToggleButtonElement instance.
 */
function ToggleButtonElement()
{
	ToggleButtonElement.base.prototype.constructor.call(this);
	
	this._isSelected = false;
}

//Inherit from ButtonElement
ToggleButtonElement.prototype = Object.create(ButtonElement.prototype);
ToggleButtonElement.prototype.constructor = ToggleButtonElement;
ToggleButtonElement.base = ButtonElement;

////////////Events/////////////////////////////////////

/**
 * @event changed ElementEvent
 * Dispatched when the ToggleButton's selection state changes as a result of user interaction.
 */


/////////////Style Types///////////////////////////////

ToggleButtonElement._StyleTypes = Object.create(null);

//New toggle button specific styles.

/**
 * @style AllowDeselect boolean
 * 
 * When false, the ToggleButton cannot be de-selected by the user and the "selectedOver" and "selectedDown" states are not used, 
 * as with the case for most tab or radio button type elements.
 */
ToggleButtonElement._StyleTypes.AllowDeselect = 				StyleableBase.EStyleType.NORMAL;		// true || false

/**
 * @style SelectedUpSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the button skin when the button is in the "selectedUp" state. 
 * This will override SkinClass when equal or higher priority than SkinClass.
 */
ToggleButtonElement._StyleTypes.SelectedUpSkinClass = 			StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style SelectedUpSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "selectedUp" state skin element.
 */
ToggleButtonElement._StyleTypes.SelectedUpSkinStyle = 			StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

/**
 * @style SelectedUpTextColor String
 * 
 * Hex color value to be used for the button label when the button is in the "selectedUp" state. Format like "#FF0000" (red).
 * This will override TextColor when equal or higher priority than TextColor.
 */
ToggleButtonElement._StyleTypes.SelectedUpTextColor = 			StyleableBase.EStyleType.NORMAL;		//"#000000"

/**
 * @style SelectedOverSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the button skin when the button is in the "selectedOver" state. 
 * This will override SkinClass when equal or higher priority than SkinClass.
 */
ToggleButtonElement._StyleTypes.SelectedOverSkinClass = 		StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style SelectedOverSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "selectedOver" state skin element. 
 */
ToggleButtonElement._StyleTypes.SelectedOverSkinStyle = 		StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

/**
 * @style SelectedOverTextColor String
 * 
 * Hex color value to be used for the button label when the button is in the "selectedOver" state. Format like "#FF0000" (red).
 * This will override TextColor when equal or higher priority than TextColor.
 */
ToggleButtonElement._StyleTypes.SelectedOverTextColor = 		StyleableBase.EStyleType.NORMAL;		//"#000000"

/**
 * @style SelectedDownSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the button skin when the button is in the "selectedDown" state. 
 * This will override SkinClass when equal or higher priority than SkinClass.
 */
ToggleButtonElement._StyleTypes.SelectedDownSkinClass = 		StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style SelectedDownSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "selectedDown" state skin element. 
 */
ToggleButtonElement._StyleTypes.SelectedDownSkinStyle = 		StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

/**
 * @style SelectedDownTextColor String
 * 
 * Hex color value to be used for the button label when the button is in the "selectedDown" state. Format like "#FF0000" (red).
 * This will override TextColor when equal or higher priority than TextColor.
 */
ToggleButtonElement._StyleTypes.SelectedDownTextColor = 		StyleableBase.EStyleType.NORMAL;		//"#000000"

/**
 * @style SelectedDisabledSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the button skin when the button is in the "selectedDisabled" state. 
 * This will override SkinClass when equal or higher priority than SkinClass.
 */
ToggleButtonElement._StyleTypes.SelectedDisabledSkinClass = 	StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style SelectedDisabledSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "selectedDisabled" state skin element. 
 */
ToggleButtonElement._StyleTypes.SelectedDisabledSkinStyle = 	StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

/**
 * @style SelectedDisabledTextColor String
 * 
 * Hex color value to be used for the button label when the button is in the "selectedDisabled" state. Format like "#FF0000" (red).
 * This will override TextColor when equal or higher priority than TextColor.
 */
ToggleButtonElement._StyleTypes.SelectedDisabledTextColor = 	StyleableBase.EStyleType.NORMAL;		//"#000000"


////////////Default Styles/////////////////////////////

ToggleButtonElement.StyleDefault = new StyleDefinition();

//ToggleButtonElement specific styles
ToggleButtonElement.StyleDefault.setStyle("AllowDeselect", 							true);

ToggleButtonElement.StyleDefault.setStyle("SelectedUpSkinClass", 					CanvasElement);
ToggleButtonElement.StyleDefault.setStyle("SelectedOverSkinClass", 					CanvasElement);
ToggleButtonElement.StyleDefault.setStyle("SelectedDownSkinClass", 					CanvasElement);
ToggleButtonElement.StyleDefault.setStyle("SelectedDisabledSkinClass", 				CanvasElement);

ToggleButtonElement.StyleDefault.setStyle("SelectedOverTextColor", 					"#000000");
ToggleButtonElement.StyleDefault.setStyle("SelectedUpTextColor", 					"#000000");
ToggleButtonElement.StyleDefault.setStyle("SelectedDownTextColor", 					"#000000");
ToggleButtonElement.StyleDefault.setStyle("SelectedDisabledTextColor", 				"#888888");

//Skin Defaults /////////////////////////////////////
ToggleButtonElement.SelectedUpSkinStyleDefault = new StyleDefinition();

ToggleButtonElement.SelectedUpSkinStyleDefault.setStyle("BorderType", 				"solid");
ToggleButtonElement.SelectedUpSkinStyleDefault.setStyle("BorderThickness", 			1);
ToggleButtonElement.SelectedUpSkinStyleDefault.setStyle("BorderColor", 				"#333333");
ToggleButtonElement.SelectedUpSkinStyleDefault.setStyle("BackgroundColor", 			"#CCCCCC");
ToggleButtonElement.SelectedUpSkinStyleDefault.setStyle("AutoGradientType", 		"linear");
ToggleButtonElement.SelectedUpSkinStyleDefault.setStyle("AutoGradientStart", 		(-.06));
ToggleButtonElement.SelectedUpSkinStyleDefault.setStyle("AutoGradientStop", 		(+.02));

ToggleButtonElement.SelectedOverSkinStyleDefault = new StyleDefinition();

ToggleButtonElement.SelectedOverSkinStyleDefault.setStyle("BorderType", 			"solid");
ToggleButtonElement.SelectedOverSkinStyleDefault.setStyle("BorderThickness", 		1);
ToggleButtonElement.SelectedOverSkinStyleDefault.setStyle("BorderColor", 			"#333333");
ToggleButtonElement.SelectedOverSkinStyleDefault.setStyle("BackgroundColor", 		"#BDBDBD");
ToggleButtonElement.SelectedOverSkinStyleDefault.setStyle("AutoGradientType", 		"linear");
ToggleButtonElement.SelectedOverSkinStyleDefault.setStyle("AutoGradientStart", 		(-.08));
ToggleButtonElement.SelectedOverSkinStyleDefault.setStyle("AutoGradientStop", 		(+.05));

ToggleButtonElement.SelectedDownSkinStyleDefault = new StyleDefinition();

ToggleButtonElement.SelectedDownSkinStyleDefault.setStyle("BorderType", 			"solid");
ToggleButtonElement.SelectedDownSkinStyleDefault.setStyle("BorderThickness", 		1);
ToggleButtonElement.SelectedDownSkinStyleDefault.setStyle("BorderColor", 			"#333333");
ToggleButtonElement.SelectedDownSkinStyleDefault.setStyle("BackgroundColor", 		"#B0B0B0");
ToggleButtonElement.SelectedDownSkinStyleDefault.setStyle("AutoGradientType", 		"linear");
ToggleButtonElement.SelectedDownSkinStyleDefault.setStyle("AutoGradientStart", 		(-.08));
ToggleButtonElement.SelectedDownSkinStyleDefault.setStyle("AutoGradientStop", 		(+.05));

ToggleButtonElement.SelectedDisabledSkinStyleDefault = new StyleDefinition();

ToggleButtonElement.SelectedDisabledSkinStyleDefault.setStyle("BorderType", 		"solid");
ToggleButtonElement.SelectedDisabledSkinStyleDefault.setStyle("BorderThickness", 	1);
ToggleButtonElement.SelectedDisabledSkinStyleDefault.setStyle("BorderColor", 		"#777777");
ToggleButtonElement.SelectedDisabledSkinStyleDefault.setStyle("BackgroundColor", 	"#C7C7C7");
ToggleButtonElement.SelectedDisabledSkinStyleDefault.setStyle("AutoGradientType", 	"linear");
ToggleButtonElement.SelectedDisabledSkinStyleDefault.setStyle("AutoGradientStart", 	(-.08));
ToggleButtonElement.SelectedDisabledSkinStyleDefault.setStyle("AutoGradientStop", 	(+.05));
///////////////////////////////////////////////////////

ToggleButtonElement.StyleDefault.setStyle("SelectedUpSkinStyle", 					ToggleButtonElement.SelectedUpSkinStyleDefault);
ToggleButtonElement.StyleDefault.setStyle("SelectedOverSkinStyle", 					ToggleButtonElement.SelectedOverSkinStyleDefault);
ToggleButtonElement.StyleDefault.setStyle("SelectedDownSkinStyle", 					ToggleButtonElement.SelectedDownSkinStyleDefault);
ToggleButtonElement.StyleDefault.setStyle("SelectedDisabledSkinStyle", 				ToggleButtonElement.SelectedDisabledSkinStyleDefault);


//////////////Public Functions/////////////////////////////////////////

/**
 * @function setSelected
 * Sets the selected state of the ToggleButton.
 * 
 * @param isSelected boolean
 * When true the toggle button is selected.
 */	
ToggleButtonElement.prototype.setSelected = 
	function (isSelected)
	{
		if (this._isSelected == isSelected)
			return;
		
		this._isSelected = isSelected;
		this._updateState();
	};
	
/**
 * @function getSelected
 * Gets the selected state of the ToggleButton.
 * 
 * @returns boolean
 * When true the toggle button is selected.
 */	
ToggleButtonElement.prototype.getSelected = 
	function ()
	{
		return this._isSelected;
	};



/////////////Internal Functions/////////////////////	

//@Override
ToggleButtonElement.prototype._updateState = 
	function ()
	{
		if (this._isSelected == false)
		{
			//Call base if we're not selected, handles non-selected states.
			ToggleButtonElement.base.prototype._updateState.call(this);
		}
		else
		{
			var newState = "selectedUp";
			
			if (this.getStyle("Enabled") == false)
				newState = "selectedDisabled";
			else if (this.getStyle("AllowDeselect") == true)
			{
				if (this._mouseIsDown == true)
					newState = "selectedDown";
				else if (this._mouseIsOver == true)
					newState = "selectedOver";
			}
			
			this.setStyle("SkinState", newState);
		}
	};

//@Override	
ToggleButtonElement.prototype._onButtonClick = 
	function (elementMouseEvent)
	{
		//Not calling base
	
		//Implementor will not expect a click event when button is disabled. 
		if (this.getStyle("Enabled") == false)
			elementMouseEvent.cancelEvent();
		else
		{
			if (this._isSelected == false || this.getStyle("AllowDeselect") == true) 
			{
				//Toggle selected state.
				this._isSelected = !this._isSelected;
				
				this._updateState();
				
				//Dispatch changed event.
				if (this.hasEventListener("changed", null) == true)
					this._dispatchEvent(new ElementEvent("changed", false));
			}	
		}
	};
	
//@override
ToggleButtonElement.prototype._getSkinClass = 
	function (state)
	{
		var stateSkinClass = null;
	
		if (state == "selectedUp")
			stateSkinClass = this.getStyleData("SelectedUpSkinClass");
		else if (state == "selectedOver")
			stateSkinClass = this.getStyleData("SelectedOverSkinClass");
		else if (state == "selectedDown")
			stateSkinClass = this.getStyleData("SelectedDownSkinClass");
		else if (state == "selectedDisabled")
			stateSkinClass = this.getStyleData("SelectedDisabledSkinClass");
		else //base class state
			return ToggleButtonElement.base.prototype._getSkinClass.call(this, state);
		
		var skinClass = this.getStyleData("SkinClass");
		
		if (skinClass.comparePriority(stateSkinClass) > 0) //Use skinClass if higher priority
			return skinClass.value;
		
		return stateSkinClass.value;
	};	
	
//@override	
ToggleButtonElement.prototype._getSubStyleNameForSkinState = 
	function (state)
	{
		if (state == "selectedUp")
			return "SelectedUpSkinStyle";
		if (state == "selectedOver")
			return "SelectedOverSkinStyle";
		if (state == "selectedDown")
			return "SelectedDownSkinStyle";
		if (state == "selectedDisabled")
			return "SelectedDisabledSkinStyle";
		
		return ToggleButtonElement.base.prototype._getSubStyleNameForSkinState.call(this, state);
	};		
	
//@Override
ToggleButtonElement.prototype._getTextColor = 
	function (state)
	{
		var stateTextColor = null;
	
		if (state == "selectedUp")
			stateTextColor = this.getStyleData("SelectedUpTextColor");
		else if (state == "selectedOver")
			stateTextColor = this.getStyleData("SelectedOverTextColor");
		else if (state == "selectedDown")
			stateTextColor = this.getStyleData("SelectedDownTextColor");
		else if (state == "selectedDisabled")
			stateTextColor = this.getStyleData("SelectedDisabledTextColor");
		else //base class state
			return ToggleButtonElement.base.prototype._getTextColor.call(this, state);
	
		var textColor = this.getStyleData("TextColor");
		
		if (textColor.comparePriority(stateTextColor) > 0) //Use textColor if higher priority
			return textColor.value;
		
		return stateTextColor.value;
	};

//@Override
ToggleButtonElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		ToggleButtonElement.base.prototype._doStylesUpdated.call(this, stylesMap);
	
		////Update skin classes and sub styles.
		if ("SkinClass" in stylesMap || "SelectedUpSkinClass" in stylesMap)
			this._updateSkinClass("selectedUp");
		if ("SelectedUpSkinStyle" in stylesMap)
			this._updateSkinStyleDefinitions("selectedUp");
		
		if ("SkinClass" in stylesMap || "SelectedOverSkinClass" in stylesMap)
			this._updateSkinClass("selectedOver");
		if ("SelectedOverSkinStyle" in stylesMap)
			this._updateSkinStyleDefinitions("selectedOver");
		
		if ("SkinClass" in stylesMap || "SelectedDownSkinClass" in stylesMap)
			this._updateSkinClass("selectedDown");
		if ("SelectedDownSkinStyle" in stylesMap)
			this._updateSkinStyleDefinitions("selectedDown");
		
		if ("SkinClass" in stylesMap || "SelectedDisabledSkinClass" in stylesMap)
			this._updateSkinClass("selectedDisabled");
		if ("SelectedDisabledSkinStyle" in stylesMap)
			this._updateSkinStyleDefinitions("selectedDisabled");
		
		if ("AllowDeselect" in stylesMap)
			this._updateState();
	};	
	

	
	


/**
 * @depends ToggleButtonElement.js
 * @depends RadioButtonSkinElement.js
 * @depends EllipseShape.js
 */

///////////////////////////////////////////////////////////////////////
/////////////////////RadioButtonElement////////////////////////////////

/**
 * @class RadioButtonElement
 * @inherits ToggleButtonElement
 * 
 * RadioButton is a skinned ToggleButton that adjusts the placement of the skin and label. 
 * ToggleButtonGroup may be used to group radio buttons so only 1 may be selected at a time.
 * 
 * When a label is in use, the skin is placed next to the label rather than underneath and is assumed to be square. 
 * When a label is not in use, the skin will span the entire bounding box.
 * 
 * Being a SkinnableElement, RadioButton proxies its styles to its skins. 
 * You may assign custom skins and assign any styles you wish to apply to all skins to the RadioButton itself. 
 * 
 * See the default skin RadioButtonSkinElement for additional skin styles.
 * 
 * @seealso RadioButtonSkinElement
 * @seealso ToggleButtonGroup
 * 
 * 
 * @constructor RadioButtonElement 
 * Creates new RadioButtonElement instance.
 */
function RadioButtonElement()
{
	RadioButtonElement.base.prototype.constructor.call(this);
}

//Inherit from ToggleButtonElement
RadioButtonElement.prototype = Object.create(ToggleButtonElement.prototype);
RadioButtonElement.prototype.constructor = RadioButtonElement;
RadioButtonElement.base = ToggleButtonElement;	


/////////////Style Types///////////////////////////////

RadioButtonElement._StyleTypes = Object.create(null);

//New RadioButtonElement specific styles

/**
 * @style LabelPlacement String
 * 
 * Determines if the label should be placed to the left or right of the skin. 
 * Allowable values are "left" or "right".
 */
RadioButtonElement._StyleTypes.LabelPlacement =						StyleableBase.EStyleType.NORMAL;		// "left" || "right"

/**
 * @style LabelGap Number
 * 
 * Determines distance in pixels the label should be placed from the skin.
 */
RadioButtonElement._StyleTypes.LabelGap =							StyleableBase.EStyleType.NORMAL;		// number



////////////Default Styles//////////////////////

RadioButtonElement.StyleDefault = new StyleDefinition();

//New RadioButton styles
RadioButtonElement.StyleDefault.setStyle("LabelPlacement", 						"right");
RadioButtonElement.StyleDefault.setStyle("LabelGap", 							5);

//Override base class styles
RadioButtonElement.StyleDefault.setStyle("AllowDeselect", 						false);

RadioButtonElement.StyleDefault.setStyle("PaddingTop",                          0);
RadioButtonElement.StyleDefault.setStyle("PaddingBottom",                       0);
RadioButtonElement.StyleDefault.setStyle("PaddingLeft",                         0);
RadioButtonElement.StyleDefault.setStyle("PaddingRight",                        0);

RadioButtonElement.StyleDefault.setStyle("TextHorizontalAlign", 				"left");
RadioButtonElement.StyleDefault.setStyle("TextVerticalAlign", 					"middle");

RadioButtonElement.StyleDefault.setStyle("SkinClass", 							RadioButtonSkinElement); //Not necessary, just for completeness

RadioButtonElement.StyleDefault.setStyle("UpSkinClass", 						RadioButtonSkinElement);
RadioButtonElement.StyleDefault.setStyle("OverSkinClass", 						RadioButtonSkinElement);
RadioButtonElement.StyleDefault.setStyle("DownSkinClass", 						RadioButtonSkinElement);
RadioButtonElement.StyleDefault.setStyle("DisabledSkinClass", 					RadioButtonSkinElement);

RadioButtonElement.StyleDefault.setStyle("SelectedUpSkinClass", 				RadioButtonSkinElement);
RadioButtonElement.StyleDefault.setStyle("SelectedOverSkinClass", 				RadioButtonSkinElement);
RadioButtonElement.StyleDefault.setStyle("SelectedDownSkinClass", 				RadioButtonSkinElement);
RadioButtonElement.StyleDefault.setStyle("SelectedDisabledSkinClass", 			RadioButtonSkinElement);


//Skin Defaults
RadioButtonElement.UpSkinStyleDefault = new StyleDefinition();

RadioButtonElement.UpSkinStyleDefault.setStyle("BackgroundShape",				new EllipseShape());
RadioButtonElement.UpSkinStyleDefault.setStyle("BorderType", 					"solid");
RadioButtonElement.UpSkinStyleDefault.setStyle("BorderThickness", 				1);
RadioButtonElement.UpSkinStyleDefault.setStyle("BorderColor", 					"#333333");
RadioButtonElement.UpSkinStyleDefault.setStyle("BackgroundColor", 				"#EBEBEB");
RadioButtonElement.UpSkinStyleDefault.setStyle("AutoGradientType", 				"linear");
RadioButtonElement.UpSkinStyleDefault.setStyle("AutoGradientStart", 			(+.05));
RadioButtonElement.UpSkinStyleDefault.setStyle("AutoGradientStop", 				(-.05));
RadioButtonElement.UpSkinStyleDefault.setStyle("CheckColor", 					"#000000");

RadioButtonElement.OverSkinStyleDefault = new StyleDefinition();

RadioButtonElement.OverSkinStyleDefault.setStyle("BackgroundShape",				new EllipseShape());
RadioButtonElement.OverSkinStyleDefault.setStyle("BorderType", 					"solid");
RadioButtonElement.OverSkinStyleDefault.setStyle("BorderThickness", 			1);
RadioButtonElement.OverSkinStyleDefault.setStyle("BorderColor", 				"#333333");
RadioButtonElement.OverSkinStyleDefault.setStyle("BackgroundColor", 			"#DDDDDD");
RadioButtonElement.OverSkinStyleDefault.setStyle("AutoGradientType", 			"linear");
RadioButtonElement.OverSkinStyleDefault.setStyle("AutoGradientStart", 			(+.05));
RadioButtonElement.OverSkinStyleDefault.setStyle("AutoGradientStop", 			(-.05));
RadioButtonElement.OverSkinStyleDefault.setStyle("CheckColor", 					"#000000");

RadioButtonElement.DownSkinStyleDefault = new StyleDefinition();

RadioButtonElement.DownSkinStyleDefault.setStyle("BackgroundShape",				new EllipseShape());
RadioButtonElement.DownSkinStyleDefault.setStyle("BorderType", 					"solid");
RadioButtonElement.DownSkinStyleDefault.setStyle("BorderThickness", 			1);
RadioButtonElement.DownSkinStyleDefault.setStyle("BorderColor", 				"#333333");
RadioButtonElement.DownSkinStyleDefault.setStyle("BackgroundColor", 			"#CCCCCC");
RadioButtonElement.DownSkinStyleDefault.setStyle("AutoGradientType", 			"linear");
RadioButtonElement.DownSkinStyleDefault.setStyle("AutoGradientStart", 			(-.06));
RadioButtonElement.DownSkinStyleDefault.setStyle("AutoGradientStop", 			(+.02));
RadioButtonElement.DownSkinStyleDefault.setStyle("CheckColor", 					"#000000");

RadioButtonElement.DisabledSkinStyleDefault = new StyleDefinition();

RadioButtonElement.DisabledSkinStyleDefault.setStyle("BackgroundShape",			new EllipseShape());
RadioButtonElement.DisabledSkinStyleDefault.setStyle("BorderType", 				"solid");
RadioButtonElement.DisabledSkinStyleDefault.setStyle("BorderThickness", 		1);
RadioButtonElement.DisabledSkinStyleDefault.setStyle("BorderColor", 			"#999999");
RadioButtonElement.DisabledSkinStyleDefault.setStyle("BackgroundColor", 		"#ECECEC");
RadioButtonElement.DisabledSkinStyleDefault.setStyle("AutoGradientType", 		"linear");
RadioButtonElement.DisabledSkinStyleDefault.setStyle("AutoGradientStart", 		(+.05));
RadioButtonElement.DisabledSkinStyleDefault.setStyle("AutoGradientStop", 		(-.05));
RadioButtonElement.DisabledSkinStyleDefault.setStyle("CheckColor", 				"#777777");

//Apply Skin Defaults
RadioButtonElement.StyleDefault.setStyle("UpSkinStyle", 						RadioButtonElement.UpSkinStyleDefault);
RadioButtonElement.StyleDefault.setStyle("OverSkinStyle", 						RadioButtonElement.OverSkinStyleDefault);
RadioButtonElement.StyleDefault.setStyle("DownSkinStyle", 						RadioButtonElement.DownSkinStyleDefault);
RadioButtonElement.StyleDefault.setStyle("DisabledSkinStyle", 					RadioButtonElement.DisabledSkinStyleDefault);

RadioButtonElement.StyleDefault.setStyle("SelectedUpSkinStyle", 				RadioButtonElement.UpSkinStyleDefault);
RadioButtonElement.StyleDefault.setStyle("SelectedOverSkinStyle", 				RadioButtonElement.OverSkinStyleDefault);
RadioButtonElement.StyleDefault.setStyle("SelectedDownSkinStyle", 				RadioButtonElement.DownSkinStyleDefault);
RadioButtonElement.StyleDefault.setStyle("SelectedDisabledSkinStyle", 			RadioButtonElement.DisabledSkinStyleDefault);


/////////////Internal Functions/////////////////////	

//@override
RadioButtonElement.prototype._doStylesUpdated = 
	function (stylesMap)
	{
		RadioButtonElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("LabelGap" in stylesMap)
		{
			this._invalidateMeasure();
			this._invalidateLayout();
		}
		else if ("LabelPlacement" in stylesMap)
			this._invalidateLayout();
	};

//@override
RadioButtonElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		var measuredSize = {width: padWidth, height: padHeight};
	
		if (this._labelElement != null)
		{
			var labelWidth = this._labelElement._getStyledOrMeasuredWidth();
			var labelHeight = this._labelElement._getStyledOrMeasuredHeight();
			
			measuredSize.height = padHeight + labelHeight;
			measuredSize.width = measuredSize.height + padWidth + labelWidth + this.getStyle("LabelGap");
		}
		else
		{
		    measuredSize.height = padHeight + 14;
		    measuredSize.width = padWidth + 14;
		}
		
		return measuredSize;
	};

//@override	
RadioButtonElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		if (this._labelElement != null)
		{
			var labelPlacement = this.getStyle("LabelPlacement");
			var labelGap = this.getStyle("LabelGap");
			
			for (var prop in this._skins)
			{
				this._skins[prop]._setActualSize(this._height, this._height);
				
				if (labelPlacement == "left")
					this._skins[prop]._setActualPosition(this._width - this._height, 0);
				else
					this._skins[prop]._setActualPosition(0, 0);
			}
			
			if (labelPlacement == "left")
				this._labelElement._setActualPosition(paddingMetrics.getX(), paddingMetrics.getY());
			else
				this._labelElement._setActualPosition(this._height + labelGap + paddingMetrics.getX(), paddingMetrics.getY());
			
			this._labelElement._setActualSize(paddingMetrics.getWidth() - labelGap - this._height, paddingMetrics.getHeight());
		}
		else
		{
			for (var prop in this._skins)
			{
				this._skins[prop]._setActualSize(this._width, this._height);
				this._skins[prop]._setActualPosition(0, 0);
			}
		}
	};	




/**
 * @depends ButtonElement.js
 * @depends DropdownArrowButtonSkinElement.js
 * @depends DataGridDataRenderer.js
 * @depends DataRendererLabelElement.js
 * @depends Tween.js
 * @depends DataListElement.js
 */

//////////////////////////////////////////////////////////////
//////////////////DropdownElement/////////////////////////////

/**
 * @class DropdownElement
 * @inherits ButtonElement
 * 
 * DropdownElement is a compound button that creates a pop-up drop-down list which the user
 * can select a value which is then displayed on the by the Dropdown. The values
 * in the list are generated by a supplied ListCollection and associated styling.
 * 
 * The Dropdown button itself contains a child button which is used to render
 * the divider line and arrow. Dropdown proxies its SkinState style to the arrow
 * button so the arrow button will change states along with the Dropdown itself.
 * See the default skin for the arrow button DropdownArrowButtonSkinElement for additional styles.
 * 
 * @seealso DropdownArrowButtonSkinElement
 * 
 * 
 * @constructor DropdownElement 
 * Creates new DropdownElement instance.
 */
function DropdownElement()
{
	DropdownElement.base.prototype.constructor.call(this);

	this._listCollection = null; //Data collection
	
	this._arrowButton = null;
	
	this._selectedIndex = -1;
	this._selectedItem = null;
	
	this._dataListPopupClipContainer = new CanvasElement();
	this._dataListPopupClipContainer.setStyle("ClipContent", true);
	this._dataListPopup = null;
	
	this._openDirection = null;
	this._openHeight = null;
	this._dropdownManagerMetrics = null;
	
	this._sampledTextWidth = null;
	
	this._openCloseTween = null;
	
	var _self = this;
	
	//Private event listener, need an instance for each DropdownElement, proxy to prototype.
	this._onDropdownListCollectionChangedInstance = 
		function (collectionChangedEvent)
		{
			_self._onDropdownListCollectionChanged(collectionChangedEvent);
		};
		
	this._onDropdownDataListPopupChangedInstance = 
		function (event)
		{
			_self._onDropdownDataListPopupChanged(event);
		};
	
	this._onDropdownDataListPopupListItemClickedInstance = 
		function (event)
		{
			_self._onDropdownDataListPopupListItemClicked(event);
		};
		
	this._onDropdownDataListPopupLayoutCompleteInstance = 
		function (event)
		{
			_self._onDropdownDataListPopupLayoutComplete(event);
		};
		
	this._onDropdownManagerCaptureEventInstance = 
		function (event)
		{
			_self._onDropdownManagerCaptureEvent(event);
		};
		
	this._onDropdownManagerResizeEventInstance = 
		function (event)
		{
			_self._onDropdownManagerResizeEvent(event);
		};
		
	this._onDropDownEnterFrameInstance = 
		function (event)
		{
			_self._onDropDownEnterFrame(event);
		};
}

//Inherit from ButtonElement
DropdownElement.prototype = Object.create(ButtonElement.prototype);
DropdownElement.prototype.constructor = DropdownElement;
DropdownElement.base = ButtonElement;

////////////Events///////////////////////////////

/**
 * @event changed ElementEvent
 * Dispatched when the drop down selection changes as a result of user input.
 * 
 * @event listitemclick ElementListItemClickEvent
 * Dispatched when a DataRenderer in the popup list is clicked. Includes associated collection item/index.
 */



/////////////Style Types/////////////////////////

DropdownElement._StyleTypes = Object.create(null);

/**
 * @style ItemLabelFunction Function
 * 
 * A function that returns a text string per a supplied collection item.
 * function (itemData) { return "" }
 */
DropdownElement._StyleTypes.ItemLabelFunction = 			StyleableBase.EStyleType.NORMAL; 		// function (itemData) { return "" }

/**
 * @style PopupDataListClass DataListElement
 * 
 * The DataListElement or subclass constructor to be used for the pop up list. 
 */
DropdownElement._StyleTypes.PopupDataListClass =			StyleableBase.EStyleType.NORMAL;		// DataListElement constructor.

/**
 * @style PopupDataListStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the pop up list element.
 */
DropdownElement._StyleTypes.PopupDataListStyle = 			StyleableBase.EStyleType.SUBSTYLE; 		// StyleDefinition

/**
 * @style MaxPopupHeight Number
 * Maximum height in pixels of the pop up list element.
 */
DropdownElement._StyleTypes.MaxPopupHeight = 				StyleableBase.EStyleType.NORMAL; 		// number

/**
 * @style ArrowButtonClass CanvasElement
 * 
 * The CanvasElement or subclass constructor to be used for the arrow icon. Defaults to Button. 
 * Note that Dropdown proxies its SkinState style to the arrow button so the arrow will change states with the Dropdown.
 */
DropdownElement._StyleTypes.ArrowButtonClass = 				StyleableBase.EStyleType.NORMAL; 		// CanvasElement constructor

/**
 * @style ArrowButtonStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the arrow icon class.
 */
DropdownElement._StyleTypes.ArrowButtonStyle = 				StyleableBase.EStyleType.SUBSTYLE; 		// StyleDefinition

/**
 * @style OpenCloseTweenDuration Number
 * 
 * Duration in milliseconds the open and close animation should run.
 */
DropdownElement._StyleTypes.OpenCloseTweenDuration = 		StyleableBase.EStyleType.NORMAL; 		// number (milliseconds)

/**
 * @style OpenCloseTweenEasingFunction Function
 * 
 * Easing function used on the open and close animations. Defaults to Tween.easeInOutSine().
 */
DropdownElement._StyleTypes.OpenCloseTweenEasingFunction = 	StyleableBase.EStyleType.NORMAL; 		// function (fraction) { return fraction} - see Tween.easing

/**
 * @style PopupDataListClipTopOrBottom Number
 * 
 * Size in pixels to clip off the pop up list. Clips top when opening down, bottom when opening up. 
 * Defaults to 1 to collapse pop up list and dropdown default borders.
 */
DropdownElement._StyleTypes.PopupDataListClipTopOrBottom = 	StyleableBase.EStyleType.NORMAL; 		// number


////////////Default Styles////////////////////


DropdownElement.ArrowButtonSkinStyleDefault = new StyleDefinition();
DropdownElement.ArrowButtonSkinStyleDefault.setStyle("BorderType", 					null);
DropdownElement.ArrowButtonSkinStyleDefault.setStyle("BackgroundColor", 			null);

/////Arrow default style///////
DropdownElement.ArrowButtonStyleDefault = new StyleDefinition();
DropdownElement.ArrowButtonStyleDefault.setStyle("SkinClass", 					DropdownArrowButtonSkinElement);

//Note that SkinState is proxied to the arrow button, so the arrow will change state along with the Dropdown (unless you turn mouse back on)
DropdownElement.ArrowButtonStyleDefault.setStyle("MouseEnabled", 				false);

DropdownElement.ArrowButtonStyleDefault.setStyle("UpSkinStyle", 				DropdownElement.ArrowButtonSkinStyleDefault);
DropdownElement.ArrowButtonStyleDefault.setStyle("OverSkinStyle", 				DropdownElement.ArrowButtonSkinStyleDefault);
DropdownElement.ArrowButtonStyleDefault.setStyle("DownSkinStyle", 				DropdownElement.ArrowButtonSkinStyleDefault);
DropdownElement.ArrowButtonStyleDefault.setStyle("DisabledSkinStyle", 			DropdownElement.ArrowButtonSkinStyleDefault);
///////////////////////////////

/////Dropdown DataList Style//////

//DataList Scrollbar style
DropdownElement.DataListScrollBarStyleDefault = new StyleDefinition();
DropdownElement.DataListScrollBarStyleDefault.setStyle("Padding", -1);			//Expand by 1px to share borders

//DataList ListItem style
DropdownElement.DataListItemStyleDefault = new StyleDefinition();
DropdownElement.DataListItemStyleDefault.setStyle("UpSkinStyle", 				DataGridDataRenderer.UpSkinStyleDefault);
DropdownElement.DataListItemStyleDefault.setStyle("AltSkinStyle", 				DataGridDataRenderer.AltSkinStyleDefault);

//DataList style
DropdownElement.DataListStyleDefault = new StyleDefinition();
DropdownElement.DataListStyleDefault.setStyle("ScrollBarStyle", 				DropdownElement.DataListScrollBarStyleDefault);
DropdownElement.DataListStyleDefault.setStyle("ListItemClass", 					DataRendererLabelElement);	//Same as DataList default (not needed)
DropdownElement.DataListStyleDefault.setStyle("ListItemStyle", 					DropdownElement.DataListItemStyleDefault);										
DropdownElement.DataListStyleDefault.setStyle("BorderType", 					"solid");
DropdownElement.DataListStyleDefault.setStyle("BorderThickness", 				1);
DropdownElement.DataListStyleDefault.setStyle("PaddingTop",						1);
DropdownElement.DataListStyleDefault.setStyle("PaddingBottom",					1);
DropdownElement.DataListStyleDefault.setStyle("PaddingLeft",					1);
DropdownElement.DataListStyleDefault.setStyle("PaddingRight",					1);
///////////////////////////////////

DropdownElement.StyleDefault = new StyleDefinition();
DropdownElement.StyleDefault.setStyle("PaddingTop",								3);
DropdownElement.StyleDefault.setStyle("PaddingBottom",							3);
DropdownElement.StyleDefault.setStyle("PaddingRight",							4);
DropdownElement.StyleDefault.setStyle("PaddingLeft",							4);

DropdownElement.StyleDefault.setStyle("PopupDataListClass", 					DataListElement); 								// DataListElement constructor
DropdownElement.StyleDefault.setStyle("PopupDataListStyle", 					DropdownElement.DataListStyleDefault); 			// StyleDefinition
DropdownElement.StyleDefault.setStyle("ArrowButtonClass", 						ButtonElement); 								// Element constructor
DropdownElement.StyleDefault.setStyle("ArrowButtonStyle", 						DropdownElement.ArrowButtonStyleDefault); 		// StyleDefinition
DropdownElement.StyleDefault.setStyle("TextHorizontalAlign", 					"left"); 								
DropdownElement.StyleDefault.setStyle("MaxPopupHeight", 						200); 											// number
DropdownElement.StyleDefault.setStyle("OpenCloseTweenDuration", 				300); 											// number (milliseconds)
DropdownElement.StyleDefault.setStyle("OpenCloseTweenEasingFunction", 			Tween.easeInOutSine); 							// function (fraction) { return fraction}
DropdownElement.StyleDefault.setStyle("PopupDataListClipTopOrBottom", 			1); 											// number
DropdownElement.StyleDefault.setStyle("ItemLabelFunction", 						DataListElement.DefaultItemLabelFunction); 		// function (itemData) { return "" }


/////////Style Proxy Maps/////////////////////////////

//Proxy map for styles we want to pass to the DataList popup.
DropdownElement._PopupDataListProxyMap = Object.create(null);
DropdownElement._PopupDataListProxyMap.ItemLabelFunction = 				true;
DropdownElement._PopupDataListProxyMap._Arbitrary = 					true;

//Proxy map for styles we want to pass to the arrow button.
DropdownElement._ArrowButtonProxyMap = Object.create(null);
DropdownElement._ArrowButtonProxyMap.SkinState = 						true;
DropdownElement._ArrowButtonProxyMap._Arbitrary = 						true;


/////////////Public///////////////////////////////

/**
 * @function setSelectedIndex
 * Sets the selection collection index. Also updates selected item.
 * 
 * @param index int
 * Collection index to select.
 */
DropdownElement.prototype.setSelectedIndex = 
	function (index)
	{
		if (this._selectedIndex == index)
			return false;
		
		if (this._listCollection == null || index > this._listCollection.length -1)
			return false;
		
		if (index < -1)
			index = -1;
		
		if (this._dataListPopup != null)
			this._dataListPopup.setSelectedIndex(index);
		
		this._selectedIndex = index;
		this._selectedItem = this._listCollection.getItemAt(index);
		this._updateText();

		return true;
	};

/**
 * @function getSelectedIndex
 * Gets the selected collection index.
 * 
 * @returns int
 * Selected collection index or -1 if none selected.
 */	
DropdownElement.prototype.getSelectedIndex = 
	function ()
	{
		return this._selectedIndex;
	};
	
/**
 * @function setSelectedItem
 * Sets the collection item to select, also updates selected index.
 * 
 * @param item Object
 * Collection item to select.
 */	
DropdownElement.prototype.setSelectedItem = 
	function (item)
	{
		var index = this._listCollection.getItemIndex(item);
		this._setSelectedIndex(index);
	};
	
/**
 * @function getSelectedItem
 * Gets the selected collection item.
 * 
 * @returns Object
 * Selected collection item or null if none selected.
 */	
DropdownElement.prototype.getSelectedItem = 
	function ()
	{
		return this._selectedItem;
	};
	
/**
 * @function setListCollection
 * Sets the ListCollection to be used as the data-provider.
 * 
 * @param listCollection ListCollection
 * ListCollection to be used as the data-provider.
 */	
DropdownElement.prototype.setListCollection = 
	function (listCollection)
	{
		if (this._listCollection == listCollection)
			return;
	
		if (this._manager == null)
		{
			this._listCollection = listCollection;
		}
		else
		{
			if (this._listCollection != null)
				this._listCollection.removeEventListener("collectionchanged", this._onDropdownListCollectionChangedInstance);
			
			this._listCollection = listCollection;
			
			if (this._listCollection != null)
				this._listCollection.addEventListener("collectionchanged", this._onDropdownListCollectionChangedInstance);
		}
		
		//Fix selected index/item
		if (this._listCollection == null)
		{
			this._selectedIndex = -1;
			this._selectedItem = null;
		}
		else
		{
			if (this._selectedItem != null)
			{
				this._selectedIndex = this._listCollection.getItemIndex(this._selectedItem);
				
				if (this._selectedIndex == -1)
					this._selectedItem = null;
			}
		}
		
		this._updateText();
		this._sampledTextWidth = null;
		this._invalidateMeasure();
		
		if (this._dataListPopup != null)
			this._dataListPopup.setListCollection(listCollection);
	};	

/**
 * @function open
 * Opens the Dropdown pop up list.
 * 
 * @param animate boolean
 * When true animates the appearance of the pop-up list.
 */	
DropdownElement.prototype.open = 
	function (animate)
	{
		if (this._manager == null || this._listCollection == null || this._listCollection.getLength() == 0)
			return;
	
		if (this._dataListPopup == null)
		{
			this._dataListPopup = this._createDataListPopup();
			this._dataListPopupClipContainer._addChild(this._dataListPopup);
		}
		
		if (this._dropdownManagerMetrics == null)
			this._dropdownManagerMetrics = this.getMetrics(this._manager);
		
		//Add the pop-up list. Wait for layoutcomplete to adjust positioning and size (will set openHeight once done)
		this._addDataListPopup(); 
		
		var tweenDuration = this.getStyle("OpenCloseTweenDuration");
		
		if (animate == false || tweenDuration <= 0)
		{
			if (this._openCloseTween != null && this._openHeight != null) //Tween running 
			{
				this._endOpenCloseTween();
				this._updateTweenPosition(this._openHeight);
			}
		}
		else
		{
			if (this._openCloseTween != null) //Tween running
			{
				if (this._openCloseTween.startVal != 0) //Reverse if closing, ignore if opening.
					this._reverseTween();
			}
			else if (this._openHeight == null) //Dont open if already open
			{
				this._openCloseTween = new Tween();
				this._openCloseTween.startVal = 0; 
				this._openCloseTween.endVal = null;	//Dont know the end val yet (popup size unknown)
				this._openCloseTween.duration = tweenDuration;
				this._openCloseTween.startTime = Date.now();
				this._openCloseTween.easingFunction = this.getStyle("OpenCloseTweenEasingFunction");
				
				this.addEventListener("enterframe", this._onDropDownEnterFrameInstance);
			}
		}
	};
	
/**
 * @function close
 * Closes the Dropdown pop up list.
 * 
 * @param animate boolean
 * When true animates the disappearance of the pop-up list.
 */		
DropdownElement.prototype.close = 
	function (animate)
	{
		var tweenDuration = this.getStyle("OpenCloseTweenDuration");
	
		if (animate == false || tweenDuration <= 0)
		{
			this._endOpenCloseTween();		
			this._removeDataListPopup();
		}
		else 
		{
			if (this._openCloseTween != null) //Tween running
			{
				if (this._openCloseTween.startVal == 0) //Reverse if opening, ignore if closing.
					this._reverseTween();
			}
			else if (this._openHeight != null) //Dont close if already closed
			{
				this._openCloseTween = new Tween();
				this._openCloseTween.startVal = this._openHeight - this.getStyle("PopupDataListClipTopOrBottom");
				this._openCloseTween.endVal = 0;
				this._openCloseTween.duration = tweenDuration;
				this._openCloseTween.startTime = Date.now();
				this._openCloseTween.easingFunction = this.getStyle("OpenCloseTweenEasingFunction");
				
				this.addEventListener("enterframe", this._onDropDownEnterFrameInstance);
			}
		}
	};

	
/////////////Internal///////////////////////////////	
	
/**
 * @function _removeDataListPopup
 * Removes the pop up list and cleans up event listeners.
 */	
DropdownElement.prototype._removeDataListPopup = 
	function ()
	{
		if (this._dataListPopupClipContainer._parent == null)
			return;
	
		this._dataListPopupClipContainer._manager.removeCaptureListener("wheel", this._onDropdownManagerCaptureEventInstance);
		this._dataListPopupClipContainer._manager.removeCaptureListener("mousedown", this._onDropdownManagerCaptureEventInstance);
		this._dataListPopupClipContainer._manager.removeEventListener("resize", this._onDropdownManagerResizeEventInstance);
		
		this._dataListPopupClipContainer._manager.removeElement(this._dataListPopupClipContainer);
		
		this._dropdownManagerMetrics = null;
		this._openDirection = null;
		this._openHeight = null;
	};

/**
 * @function _addDataListPopup
 * Adds the pop up list and registers event listeners.
 */		
DropdownElement.prototype._addDataListPopup = 
	function ()
	{
		if (this._dataListPopupClipContainer._parent != null)
			return;
		
		var popupHeight = this.getStyle("MaxPopupHeight");
		
		this._dataListPopupClipContainer.setStyle("Width", this._dropdownManagerMetrics._width);
		this._dataListPopupClipContainer.setStyle("Height", popupHeight);
		this._dataListPopupClipContainer.setStyle("X", this._dropdownManagerMetrics._x);
		this._dataListPopupClipContainer.setStyle("Y", this._dropdownManagerMetrics._y + this._dropdownManagerMetrics._height);
		
		this._dataListPopup._setActualPosition(0, 0);
		this._dataListPopup._setActualSize(this._dropdownManagerMetrics._width, popupHeight);
		
		this._manager.addElement(this._dataListPopupClipContainer);
		
		this._dataListPopupClipContainer._manager.addCaptureListener("wheel", this._onDropdownManagerCaptureEventInstance);
		this._dataListPopupClipContainer._manager.addCaptureListener("mousedown", this._onDropdownManagerCaptureEventInstance);
		this._dataListPopupClipContainer._manager.addEventListener("resize", this._onDropdownManagerResizeEventInstance);
	};
	
//@private	
DropdownElement.prototype._onDropDownEnterFrame = 
	function (event)
	{
		//Tween created, but layoutcomplete has not yet finished. 
		//When we first create the popup list, we need to wait a cycle for the list layout to finish.
		//However, enter frame fires first *before* the list cycle has finished.
		if (this._openCloseTween.endVal == null)
			return;
	
		var value = this._openCloseTween.getValue(Date.now());
		this._updateTweenPosition(value);
		
		if (value == this._openCloseTween.endVal)
		{
			if (value == 0)
				this.close(false);
			else
				this._endOpenCloseTween();
		}
	};
	
//@private
DropdownElement.prototype._endOpenCloseTween = 
	function ()
	{
		if (this._openCloseTween != null)
		{
			this.removeEventListener("enterframe", this._onDropDownEnterFrameInstance);
			this._openCloseTween = null;
		}
	};
	
//@private	
DropdownElement.prototype._updateTweenPosition = 
	function (value)
	{
		this._dataListPopupClipContainer.setStyle("Height", value);
		
		if (this._openDirection == "up")
			this._dataListPopupClipContainer.setStyle("Y", this._dropdownManagerMetrics._y - value);
		else //if (this._openDirection == "down")
			this._dataListPopup._setActualPosition(0, value - this._dataListPopup._height);
	};
	
/**
 * @function _onDropdownManagerCaptureEvent
 * Capture event handler for CanvasManager "wheel" and "mousedown". Used to close 
 * the drop down when events happen outside the Dropdown or pop up list. Only active when pop up list is open.
 * 
 * @param event ElementEvent
 * ElementEvent to process.
 */	
DropdownElement.prototype._onDropdownManagerCaptureEvent = 
	function (event)
	{
		//Check if the dropdown list is in this target's parent chain.
		var target = event.getTarget();
		while (target != null)
		{
			//Yes, leave the drop down open
			if (target == this._dataListPopup || 
				(event.getType() == "mousedown" && target == this))
				return;
			
			target = target._parent;
		}
		
		//Kill the drop down, event happened outside the popup list.
		this.close(false);
	};
	
/**
 * @function _onDropdownManagerResizeEvent
 * Capture event handler for CanvasManager "resize". Used to close the dropdown.
 * Only active when pop up list is open.
 * 
 * @param event DispatcherEvent
 * DispatcherEvent to process.
 */		
DropdownElement.prototype._onDropdownManagerResizeEvent = 
	function (event)
	{
		this.close(false);
	};

/**
 * @function _onDropdownDataListPopupLayoutComplete
 * Event handler for pop up list "layoutcomplete". 
 * Updates the pop up list height after content size is known and determines
 * if drop down opens up or down depending on available space.
 * 
 * @param event DispatcherEvent
 * DispatcherEvent to process.
 */		
DropdownElement.prototype._onDropdownDataListPopupLayoutComplete =
	function (event)
	{
		var maxHeight = this.getStyle("MaxPopupHeight");
		var height = null;
		
		if (this._dataListPopup.getStyle("ListDirection") == "horizontal")
			height = maxHeight;
		else
		{
			//Get actual Popup list height.
			var contentSize = this._dataListPopup._getContentSize();
			
			if (contentSize < maxHeight)
			{
				if (this._listCollection != null && this._dataListPopup._getNumRenderers() < this._listCollection.getLength())
					height = maxHeight;
				else
					height = contentSize;
			}
			else //contentSize >= maxHeight
				height = maxHeight;
		}
		
		//Determine open up/down and correct if not enough available space.
		var availableBottom = this._manager._height - (this._dropdownManagerMetrics._y + this._dropdownManagerMetrics._height);
		if (availableBottom >= height)
		{
			this._openDirection = "down";
			this._openHeight = height;
		}
		else //if (availableBottom < height)
		{
			var availableTop = this._dropdownManagerMetrics._y;
			if (availableTop >= height)
			{
				this._openDirection = "up";
				this._openHeight = height;
			}
			else //if (availableTop < height)
			{
				if (availableBottom >= availableTop)
				{
					this._openDirection = "down";
					this._openHeight = availableBottom;
				}
				else
				{
					this._openDirection = "up";
					this._openHeight = availableTop;
				}
			}
		}

		//Fix list height
		this._dataListPopup._setActualSize(this._dataListPopup._width, this._openHeight);
		this._dataListPopupClipContainer.setStyle("Height", this._openHeight);
		
		var clipTopOrBottom = this.getStyle("PopupDataListClipTopOrBottom");
		
		if (this._openCloseTween != null)
		{
			if (this._openCloseTween.startVal == 0) //Closing
				this._openCloseTween.endVal = this._openHeight - clipTopOrBottom;
			else //Opening
				this._openCloseTween.startVal = this._openHeight - clipTopOrBottom;
			
			this._onDropDownEnterFrame(null); //Force a tween update.
		}
		else
			this._updateTweenPosition(this._openHeight - clipTopOrBottom);
	};
	
/**
 * @function _onDropdownDataListPopupChanged
 * Event handler for pop up list "changed" event. Updates selected item/index and re-dispatches "changed" event.
 * 
 * @param elementEvent ElementEvent
 * ElementEvent to process.
 */	
DropdownElement.prototype._onDropdownDataListPopupChanged = 
	function (elementEvent)
	{
		this.setSelectedIndex(this._dataListPopup.getSelectedIndex());
		this.close(true);
		
		if (this.hasEventListener("changed", null) == true)
			this._dispatchEvent(new ElementEvent("changed", false));
	};

/**
 * @function _onDropdownDataListPopupListItemClicked
 * Event handler for pop up list "listitemclick" event. 
 * 
 * @param elementListItemClickEvent ElementListItemClickEvent
 * ElementListItemClickEvent to process.
 */		
DropdownElement.prototype._onDropdownDataListPopupListItemClicked = 
	function (elementListItemClickEvent)
	{
		//Just proxy the event from the popup list
		if (this.hasEventListener("listitemclick", null) == true)
			this._dispatchEvent(elementListItemClickEvent);
	};
	
/**
 * @function _createDataListPopup
 * Generates and sets up a pop up list element instance per styling.
 * 
 * @returns DataListElement
 * New pop up list instance.
 */	
DropdownElement.prototype._createDataListPopup = 
	function ()
	{
		//TODO: Use PopupDataListClass style.
	
		var dataListPopup = new DataListElement();
		
		dataListPopup._setStyleProxy(new StyleProxy(this, DropdownElement._PopupDataListProxyMap));
		this._applySubStylesToElement("PopupDataListStyle", dataListPopup);
		
		dataListPopup.setListCollection(this._listCollection);
		dataListPopup.setSelectedIndex(this._selectedIndex);
		
		dataListPopup.addEventListener("changed", this._onDropdownDataListPopupChangedInstance);
		dataListPopup.addEventListener("listitemclick", this._onDropdownDataListPopupListItemClickedInstance);
		dataListPopup.addEventListener("layoutcomplete", this._onDropdownDataListPopupLayoutCompleteInstance);
		
		return dataListPopup;
	};
	
//@override	
DropdownElement.prototype._updateText = 
	function ()
	{
		var text = null;
		var labelFunction = this.getStyle("ItemLabelFunction");
		
		if (this._selectedItem == null || labelFunction == null)
			text = this.getStyle("Text");
		else
			text = labelFunction(this._selectedItem);
		
		if (text == null || text == "")
		{
			if (this._labelElement != null)
			{
				this._removeChild(this._labelElement);
				this._labelElement = null;
			}
		}
		else
		{
			if (this._labelElement == null)
			{
				this._labelElement = this._createLabel();
				if (this._labelElement != null)
				{
					this._updateTextColor();
					this._addChild(this._labelElement);
				}
			}
			
			if (this._labelElement != null)
				this._labelElement.setStyle("Text", text);
		}
	};	
	
/**
 * @function _onDropdownListCollectionChanged
 * Event handler for the ListCollection data-providers "collectionchanged" event. 
 * 
 * @param collectionChangedEvent CollectionChangedEvent
 * CollectionChangedEvent to process.
 */	
DropdownElement.prototype._onDropdownListCollectionChanged = 
	function (collectionChangedEvent)
	{
		//Room to optimize here
//		var type = collectionChangedEvent.getKind();
//		var index = collectionChangedEvent.getIndex();
	
		//Fix selected index/item 
		if (this._selectedItem != null)
		{
			this._selectedIndex = this._listCollection.getItemIndex(this._selectedItem);
			
			if (this._selectedIndex == -1)
				this._selectedItem = null;
		}
		
		this._updateText();
		
		this._sampledTextWidth = null;
		this._invalidateMeasure();
	};	
	
//@Override	
DropdownElement.prototype._onCanvasElementAdded = 
	function (addedRemovedEvent)
	{
		DropdownElement.base.prototype._onCanvasElementAdded.call(this, addedRemovedEvent);
	
		if (this._listCollection != null && this._listCollection.hasEventListener("collectionchanged", this._onDropdownListCollectionChangedInstance) == false)
			this._listCollection.addEventListener("collectionchanged", this._onDropdownListCollectionChangedInstance);
	};

//@Override	
DropdownElement.prototype._onCanvasElementRemoved = 
	function (addedRemovedEvent)
	{
		DropdownElement.base.prototype._onCanvasElementRemoved.call(this, addedRemovedEvent);
		
		if (this._listCollection != null && this._listCollection.hasEventListener("collectionchanged", this._onDropdownListCollectionChangedInstance) == true)
			this._listCollection.removeEventListener("collectionchanged", this._onDropdownListCollectionChangedInstance);
		
		this.close(false);
	};	

//@private	
DropdownElement.prototype._reverseTween = 
	function ()
	{
		var start = this._openCloseTween.startVal;
		var end = this._openCloseTween.endVal;
		var now = Date.now();
		var elapsed = now - this._openCloseTween.startTime;
		
		this._openCloseTween.startVal = end;
		this._openCloseTween.endVal = start;
		this._openCloseTween.startTime = now + elapsed - this._openCloseTween.duration;		
	};
	
//@Override	
DropdownElement.prototype._onButtonClick = 
	function (elementMouseEvent)
	{
		//Just cancels event if we're disabled.
		DropdownElement.base.prototype._onButtonClick.call(this, elementMouseEvent);
		
		if (elementMouseEvent.getIsCanceled() == true)
			return;
		
		if (this._openCloseTween != null)
			this._reverseTween();
		else 
		{
			if (this._openHeight == null)
				this.open(true);
			else
				this.close(true);
		}
	};	
	
/**
 * @function _createArrowButton
 * Generates and sets up the arrow element instance per styling.
 * 
 * @returns DataListElement
 * New arrow element instance.
 */		
DropdownElement.prototype._createArrowButton = 
	function (arrowClass)
	{
		var newIcon = new (arrowClass)();
		newIcon._setStyleProxy(new StyleProxy(this, DropdownElement._ArrowButtonProxyMap));
		this._applySubStylesToElement("ArrowButtonStyle", newIcon);
	
		return newIcon;
	};
	
//@private	
DropdownElement.prototype._updateArrowButton = 
	function ()
	{
		var arrowClass = this.getStyle("ArrowButtonClass");
		
		if (arrowClass == null)
		{
			if (this._arrowButton != null)
			{
				this._removeChild(this._arrowButton);
				this._arrowButton = null;
			}
		}
		else
		{
			if (this._arrowButton == null)
			{
				this._arrowButton = this._createArrowButton(arrowClass);
				this._addChild(this._arrowButton);
			}
			else if (this._arrowButton.constructor != arrowClass)
			{ //Class changed
				this._removeChild(this._arrowButton);
				this._arrowButton = this._createArrowButton(arrowClass);
				this._addChild(this._arrowButton);
			}
			else
				this._applySubStylesToElement("ArrowButtonStyle", this._arrowButton);
		}
	};
	
//@Override
DropdownElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		DropdownElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("ItemLabelFunction" in stylesMap)
		{
			this._sampledTextWidth = null;
			this._invalidateMeasure();
			this._updateText();
		}
		
		if ("PopupDataListStyle" in stylesMap && this._dataListPopup != null)
			this._applySubStylesToElement("PopupDataListStyle", this._dataListPopup);
		
		if ("ArrowButtonClass" in stylesMap || "ArrowButtonStyle" in stylesMap)
			this._updateArrowButton();
		
		if ("TextStyle" in stylesMap ||
			"TextFont" in stylesMap ||
			"TextSize" in stylesMap ||
			"TextHorizontalAlign" in stylesMap ||
			"TextVerticalAlign" in stylesMap || 
			"Text" in stylesMap)
		{
			this._sampledTextWidth = null;
			this._invalidateMeasure();
		}
	};
	
/**
 * @function _sampleTextWidths
 * Measures text width of first 10 ListCollection items for measurement.
 * 
 * @returns Number
 * Largest text width in pixels.
 */	
DropdownElement.prototype._sampleTextWidths = 
	function ()
	{
		var labelFont = this._getFontString();
		
		var text = this.getStyle("Text");
		if (text == null)
			text = "";
		
		var measuredTextWidth = CanvasElement._measureText(text, labelFont);
		
		//Sample the first 10 items.
		var labelFunction = this.getStyle("ItemLabelFunction");
		if (this._listCollection != null && labelFunction != null)
		{
			var textWidth = 0;
			for (var i = 0; i < 10; i++)
			{
				if (i == this._listCollection.getLength())
					break;
				
				textWidth = CanvasElement._measureText(labelFunction(this._listCollection.getItemAt(i)), labelFont);
				
				if (textWidth > measuredTextWidth)
					measuredTextWidth = textWidth;
			}
		}
		
		return measuredTextWidth;
	};
	
//@Override
DropdownElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		if (this._sampledTextWidth == null)
			this._sampledTextWidth = this._sampleTextWidths();
		
		var textHeight = this.getStyle("TextSize") + this.getStyle("TextLinePaddingTop") + this.getStyle("TextLinePaddingBottom");
		
		var measuredSize = {width: this._sampledTextWidth + padWidth, height: textHeight + padHeight};
		measuredSize.width += 20; //Add some extra space
		
		if (this._arrowButton != null)
		{
			var iconWidth = this._arrowButton.getStyle("Width");
			var iconHeight = this._arrowButton.getStyle("Height");
			
			if (iconHeight != null && iconHeight > measuredSize.height)
				measuredSize.height = iconHeight;
			if (iconWidth != null)
				measuredSize.width += iconWidth;
			else
				measuredSize.width += Math.round(measuredSize.height * .85);
		}

		return measuredSize;
	};	
	
//@Override	
DropdownElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		DropdownElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		if (this._openDirection != null) //dropdown open
		{
			//Update the dropdown metrics
			this._dropdownManagerMetrics = this.getMetrics(this._manager);
			
			//Update the widths of the popup container and list. (Heights handled by tween / list layoutcomplete)
			//This is here so that when the Dropdown is using measured width, and the collection changes,
			//it may change the width of the dropdown button, so we need to make sure we keep the widths in sync.
			this._dataListPopupClipContainer.setStyle("Width", this._dropdownManagerMetrics._width);
			this._dataListPopupClipContainer.setStyle("X", this._dropdownManagerMetrics._x);
			this._dataListPopupClipContainer.setStyle("Y", this._dropdownManagerMetrics._y + this._dropdownManagerMetrics._height);
			
			this._dataListPopup._setActualSize(this._dropdownManagerMetrics._width, this._dataListPopup._height);
		}
		
		if (this._arrowButton != null)
		{
			var x = paddingMetrics.getX();
			var y = paddingMetrics.getY();
			var w = paddingMetrics.getWidth();
			var h = paddingMetrics.getHeight();
			
			var iconWidth = this._arrowButton.getStyle("Width");
			var iconHeight = this._arrowButton.getStyle("Height");
			
			if (iconHeight == null)
				iconHeight = this._height;
			if (iconWidth == null)
				iconWidth = this._height * .85;
			
			if (this._width < iconWidth)
			{
				this._arrowButton._setActualSize(0, 0);
				this._labelElement._setActualSize(0, 0);
			}
			else
			{
				if (this._labelElement != null)
				{
					this._labelElement._setActualPosition(x, y);
					this._labelElement._setActualSize(w - iconWidth, h);
				}
					
				this._arrowButton._setActualPosition(this._width - iconWidth, y + (h / 2) - (iconHeight / 2));
				this._arrowButton._setActualSize(iconWidth, iconHeight);
			}
		}
	};


/**
 * @depends ButtonElement.js
 */

//////////////////////////////////////////////////////////////////
/////////////DataGridHeaderItemRenderer////////////////////////////

/**
 * @class DataGridHeaderItemRenderer
 * @inherits ButtonElement
 * 
 * Default DataGrid HeaderItem renderer based on Button. 
 * Adds sort icons.
 * 
 * @constructor DataGridHeaderItemRenderer 
 * Creates new DataGridHeaderItemRenderer instance.
 */
function DataGridHeaderItemRenderer()
{
	DataGridHeaderItemRenderer.base.prototype.constructor.call(this);
	
	this._sortAscIcon = null;
	this._sortDescIcon = null;
	this._currentSortDirection = null;
}

//Inherit from ButtonElement
DataGridHeaderItemRenderer.prototype = Object.create(ButtonElement.prototype);
DataGridHeaderItemRenderer.prototype.constructor = DataGridHeaderItemRenderer;
DataGridHeaderItemRenderer.base = ButtonElement;

//////Style Types//////////////////////
DataGridHeaderItemRenderer._StyleTypes = Object.create(null);

/**
 * @style SortAscIconClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the ascending sort icon. 
 * Defaults to Button. HeaderItemRenderer proxies its SkinState style to the sort icons so
 * the sort icons will change state along with the HeaderItemRenderer.
 */
DataGridHeaderItemRenderer._StyleTypes.SortAscIconClass =			StyleableBase.EStyleType.NORMAL;		// CanvasElement constructor

/**
 * @style SortAscIconStyle StyleDefinition
 * 
 * The StyleDefinition to apply ascending sort icon element.
 */
DataGridHeaderItemRenderer._StyleTypes.SortAscIconStyle =			StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition

/**
 * @style SortDescIconClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the descending sort icon. 
 * Defaults to Button. HeaderItemRenderer proxies its SkinState style to the sort icons so
 * the sort icons will change state along with the HeaderItemRenderer.
 */
DataGridHeaderItemRenderer._StyleTypes.SortDescIconClass =			StyleableBase.EStyleType.NORMAL;		// CanvasElement constructor

/**
 * @style SortDescIconStyle StyleDefinition
 * 
 * The StyleDefinition to apply descending sort icon element.
 */
DataGridHeaderItemRenderer._StyleTypes.SortDescIconStyle =			StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition

/**
 * @style IconGap Number
 * 
 * Distance in pixels between the sort icon and the header label.
 */
DataGridHeaderItemRenderer._StyleTypes.IconGap =					StyleableBase.EStyleType.NORMAL;		// number

/**
 * @style IconPlacement String
 * 
 * Determines placement of the sort icon. Allowable values are "left" or "right".
 */
DataGridHeaderItemRenderer._StyleTypes.IconPlacement =				StyleableBase.EStyleType.NORMAL;		// "left" || "right"


/////////Default Styles///////////////

//Make disabled skin look like "up" skin (just not click-able)
DataGridHeaderItemRenderer.DisabledSkinStyleDefault = new StyleDefinition();
DataGridHeaderItemRenderer.DisabledSkinStyleDefault.setStyle("BackgroundColor", 		"#EBEBEB");
DataGridHeaderItemRenderer.DisabledSkinStyleDefault.setStyle("BorderType", 				null);

//Other up/over/down skins (kill border)
DataGridHeaderItemRenderer.SkinStyleDefault = new StyleDefinition();
DataGridHeaderItemRenderer.SkinStyleDefault.setStyle("BorderType", 						null);


DataGridHeaderItemRenderer.StyleDefault = new StyleDefinition();
DataGridHeaderItemRenderer.StyleDefault.setStyle("UpSkinStyle", 						DataGridHeaderItemRenderer.SkinStyleDefault);
DataGridHeaderItemRenderer.StyleDefault.setStyle("OverSkinStyle", 						DataGridHeaderItemRenderer.SkinStyleDefault);
DataGridHeaderItemRenderer.StyleDefault.setStyle("DownSkinStyle", 						DataGridHeaderItemRenderer.SkinStyleDefault);
DataGridHeaderItemRenderer.StyleDefault.setStyle("DisabledSkinStyle", 					DataGridHeaderItemRenderer.DisabledSkinStyleDefault);
DataGridHeaderItemRenderer.StyleDefault.setStyle("DisabledTextColor", 					"#000000");

DataGridHeaderItemRenderer.StyleDefault.setStyle("TextHorizontalAlign", 				"left");
DataGridHeaderItemRenderer.StyleDefault.setStyle("PaddingTop",							4);
DataGridHeaderItemRenderer.StyleDefault.setStyle("PaddingBottom",						4);
DataGridHeaderItemRenderer.StyleDefault.setStyle("PaddingLeft",							8);
DataGridHeaderItemRenderer.StyleDefault.setStyle("PaddingRight",						8);

/////Sort Icon default styles //////

//Ascending Sort Icon
DataGridHeaderItemRenderer.SortAscIconSkinBgShapeDefault = new ArrowShape();
DataGridHeaderItemRenderer.SortAscIconSkinBgShapeDefault.setStyle("Direction", 				"up");

DataGridHeaderItemRenderer.SortAscIconSkinStyleDefault = new StyleDefinition();
DataGridHeaderItemRenderer.SortAscIconSkinStyleDefault.setStyle("BorderType", 				null);
DataGridHeaderItemRenderer.SortAscIconSkinStyleDefault.setStyle("BackgroundColor", 			"#444444");
DataGridHeaderItemRenderer.SortAscIconSkinStyleDefault.setStyle("BackgroundShape", 			DataGridHeaderItemRenderer.SortAscIconSkinBgShapeDefault);

DataGridHeaderItemRenderer.SortAscIconStyleDefault = new StyleDefinition();
DataGridHeaderItemRenderer.SortAscIconStyleDefault.setStyle("UpSkinStyle", 					DataGridHeaderItemRenderer.SortAscIconSkinStyleDefault);
DataGridHeaderItemRenderer.SortAscIconStyleDefault.setStyle("OverSkinStyle", 				DataGridHeaderItemRenderer.SortAscIconSkinStyleDefault);
DataGridHeaderItemRenderer.SortAscIconStyleDefault.setStyle("DownSkinStyle", 				DataGridHeaderItemRenderer.SortAscIconSkinStyleDefault);
//Note that SkinState is proxied to the sort icons, so the sort icons will change state along with the HeaderRenderer (unless you turn mouse back on)
DataGridHeaderItemRenderer.SortAscIconStyleDefault.setStyle("MouseEnabled", 				false);

//Descending Sort Icon
DataGridHeaderItemRenderer.SortDescIconSkinBgShapeDefault = new ArrowShape();
DataGridHeaderItemRenderer.SortDescIconSkinBgShapeDefault.setStyle("Direction", 			"down");

DataGridHeaderItemRenderer.SortDescIconSkinStyleDefault = new StyleDefinition();
DataGridHeaderItemRenderer.SortDescIconSkinStyleDefault.setStyle("BorderType", 				null);
DataGridHeaderItemRenderer.SortDescIconSkinStyleDefault.setStyle("BackgroundColor", 		"#444444");
DataGridHeaderItemRenderer.SortDescIconSkinStyleDefault.setStyle("BackgroundShape", 		DataGridHeaderItemRenderer.SortDescIconSkinBgShapeDefault);

DataGridHeaderItemRenderer.SortDescIconStyleDefault = new StyleDefinition();
DataGridHeaderItemRenderer.SortDescIconStyleDefault.setStyle("UpSkinStyle", 				DataGridHeaderItemRenderer.SortDescIconSkinStyleDefault);
DataGridHeaderItemRenderer.SortDescIconStyleDefault.setStyle("OverSkinStyle", 				DataGridHeaderItemRenderer.SortDescIconSkinStyleDefault);
DataGridHeaderItemRenderer.SortDescIconStyleDefault.setStyle("DownSkinStyle", 				DataGridHeaderItemRenderer.SortDescIconSkinStyleDefault);

//Note that SkinState is proxied to the sort icons, so the sort icons will change state along with the HeaderRenderer (unless you turn mouse back on)
DataGridHeaderItemRenderer.SortDescIconStyleDefault.setStyle("MouseEnabled", 			false);

///////////////////////////////////

DataGridHeaderItemRenderer.StyleDefault.setStyle("SortAscIconClass",					ButtonElement);											// CanvasElement constructor
DataGridHeaderItemRenderer.StyleDefault.setStyle("SortAscIconStyle",					DataGridHeaderItemRenderer.SortAscIconStyleDefault);	// StyleDefinition
DataGridHeaderItemRenderer.StyleDefault.setStyle("SortDescIconClass",					ButtonElement);											// CanvasElement constructor
DataGridHeaderItemRenderer.StyleDefault.setStyle("SortDescIconStyle",					DataGridHeaderItemRenderer.SortDescIconStyleDefault);	// StyleDefinition

DataGridHeaderItemRenderer.StyleDefault.setStyle("IconGap",								3);			// number
DataGridHeaderItemRenderer.StyleDefault.setStyle("IconPlacement",						"right");	// "left" || "right"



//////Proxy////////////////////////////
DataGridHeaderItemRenderer._SortIconProxyMap = Object.create(null);

//Proxy the SkinState this way we can trigger icon skin changes when our skin changes without
//impacting the functionality of a custom icon. We'll also disable mouse on the default style.
DataGridHeaderItemRenderer._SortIconProxyMap.SkinState = 		true;


///////////Internal/////////////////////

/**
 * @function _createSortIcon
 * Generates a sort icon based on the IconClass styles.
 * 
 * @param isDecending boolean
 * True if the icon should be a descending icon, false otherwise.
 * 
 * @returns CanvasElement
 * The resulting sort icon element instance.
 */
DataGridHeaderItemRenderer.prototype._createSortIcon = 
	function (isDecending)
	{
		var iconClass = null;
		
		if (isDecending == true)
			iconClass = this.getStyle("SortDescIconClass");
		else
			iconClass = this.getStyle("SortAscIconClass");
		
		var newIcon = new (iconClass)();
		newIcon._setStyleProxy(new StyleProxy(this,DataGridHeaderItemRenderer._SortIconProxyMap));
		
		if (isDecending == true)
			this._applySubStylesToElement("SortDescIconStyle", newIcon);
		else
			this._applySubStylesToElement("SortAscIconStyle", newIcon);
		
		return newIcon;
	};

/**
 * @function _updateSortIcons
 * Updates sort icons in response to style and list data changes.
 */
DataGridHeaderItemRenderer.prototype._updateSortIcons = 
	function ()
	{
		if (this._listData == null)
			return;
	
		var listData = this._listData;
		var dataCollection = listData._parentGrid._listCollection;
		
		var sortDirection = null;
		
		if (dataCollection != null && 
			dataCollection._collectionSort != null && 
			dataCollection._collectionSort == listData._parentGrid._gridColumns[listData._columnIndex].getStyle("CollectionSort"))
		{
			if (dataCollection._collectionSort._isDecending == true)
				sortDirection = "down";
			else
				sortDirection = "up";
		}

		if (this._currentSortDirection != sortDirection)
		{
			this._currentSortDirection = sortDirection;
			this._invalidateLayout();
		}
		
		if (sortDirection == null)
		{
			if (this._sortAscIcon != null)
				this._sortAscIcon.setStyle("Visible", false);
			if (this._sortDescIcon != null)
				this._sortDescIcon.setStyle("Visible", false);
		}
		else if (sortDirection == "up")
		{
			var upIconClass = this.getStyle("SortAscIconClass");
			
			if (upIconClass == null)
			{
				if (this._sortAscIcon != null)
				{
					this._removeChild(this._sortAscIcon);
					this._sortAscIcon = null;
				}
			}
			else
			{
				if (this._sortAscIcon == null)
				{
					this._sortAscIcon = this._createSortIcon(false);
					this._addChild(this._sortAscIcon);
				}
				else if (this._sortAscIcon.constructor != upIconClass)
				{ //Icon Class changed
					this._removeChild(this._sortAscIcon);
					this._sortAscIcon = this._createSortIcon(false);
					this._addChild(this._sortAscIcon);
				}
				else
					this._applySubStylesToElement("SortAscIconStyle", this._sortAscIcon);
				
				if (this._sortDescIcon != null)
					this._sortDescIcon.setStyle("Visible", false);
				
				this._sortAscIcon.setStyle("Visible", true);
			}
		}
		else if (sortDirection == "down")
		{
			var downIconClass = this.getStyle("SortDescIconClass");
			
			if (downIconClass == null)
			{
				if (this._sortDescIcon != null)
				{
					this._removeChild(this._sortDescIcon);
					this._sortDescIcon = null;
				}
			}
			else
			{
				if (this._sortDescIcon == null)
				{
					this._sortDescIcon = this._createSortIcon(true);
					this._addChild(this._sortDescIcon);
				}
				else if (this._sortDescIcon.constructor != downIconClass)
				{ //Icon Class changed
					this._removeChild(this._sortDescIcon);
					this._sortDescIcon = this._createSortIcon(true);
					this._addChild(this._sortDescIcon);
				}
				else
					this._applySubStylesToElement("SortDescIconStyle", this._sortDescIcon);
				
				if (this._sortAscIcon != null)
					this._sortAscIcon.setStyle("Visible", false);
				
				this._sortDescIcon.setStyle("Visible", true);
			}
		}
	};

//@Override
DataGridHeaderItemRenderer.prototype._setListData = 
	function (listData, itemData)
	{
		DataGridHeaderItemRenderer.base.prototype._setListData.call(this, listData, itemData);
		
		if (listData == null)
			return;
		
		this.setStyle("Text", listData._parentGrid._gridColumns[listData._columnIndex].getStyle("HeaderLabel"));
		this._updateSortIcons();
	};

//@Override
DataGridHeaderItemRenderer.prototype._doStylesUpdated =
	function (stylesMap)
	{
		DataGridHeaderItemRenderer.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("SortAscIconClass" in stylesMap ||
			"SortAscIconStyle" in stylesMap ||
			"SortDescIconClass" in stylesMap ||
			"SortDescIconStyle" in stylesMap)
		{
			this._updateSortIcons();
		}
		
		if ("IconGap" in stylesMap || "IconPlacement" in stylesMap)
			this._invalidateLayout();
	};	
	
//@Override	
DataGridHeaderItemRenderer.prototype._doLayout = 
	function (paddingMetrics)
	{
		DataGridHeaderItemRenderer.base.prototype._doLayout.call(this, paddingMetrics);
	
		//Fix label position to leave room for sort indicator.
		if (this._labelElement != null && this._currentSortDirection != null)
		{
			var sortIcon = null;
			if (this._currentSortDirection == "up")
				sortIcon = this._sortAscIcon;
			else
				sortIcon = this._sortDescIcon;
			
			if (sortIcon != null)
			{
				var x = paddingMetrics.getX();
				var y = paddingMetrics.getY();
				var w = paddingMetrics.getWidth();
				var h = paddingMetrics.getHeight();
				
				var iconWidth = sortIcon.getStyle("Width");
				var iconHeight = sortIcon.getStyle("Height");
				
				if (iconHeight == null)
					iconHeight = paddingMetrics.getHeight() * .35;
				if (iconWidth == null)
					iconWidth = iconHeight * 1.5;
				
				if (w < iconWidth)
				{
					sortIcon._setActualSize(0, 0);
					this._labelElement._setActualSize(0, 0);
				}
				else
				{
					var gap = this.getStyle("IconGap");
					var iconPlacement = this.getStyle("IconPlacement");
					
					if (iconPlacement == "left")
					{
						this._labelElement._setActualPosition(x + iconWidth + gap, y);
						this._labelElement._setActualSize(w - iconWidth - gap, h);
						
						sortIcon._setActualPosition(x, y + (h / 2) - (iconHeight / 2));
						sortIcon._setActualSize(iconWidth, iconHeight);
					}
					else // "right"
					{
						this._labelElement._setActualPosition(x, y);
						this._labelElement._setActualSize(w - iconWidth - gap, h);
						
						sortIcon._setActualPosition(x + w - iconWidth, y + (h / 2) - (iconHeight / 2));
						sortIcon._setActualSize(iconWidth, iconHeight);
					}
				}
			}
		}
	};	


/**
 * @depends DataGridDataRenderer.js
 * @depends DataGridHeaderColumnDividerSkinElement.js
 * @depends ButtonElement.js
 */

//////////////////////////////////////////////////////////////////
/////////////DataGridHeaderElement////////////////////////////////

/**
 * @class DataGridHeaderElement
 * @inherits DataGridDataRenderer
 * 
 * Default DataGrid header element. 
 * Renders header items per parent grid's columns. 
 * Adds drag-able column dividers and updates parent grid's column widths.
 * 
 * 
 * @constructor DataGridHeaderElement 
 * Creates new DataGridHeaderElement instance.
 */
function DataGridHeaderElement()
{
	DataGridHeaderElement.base.prototype.constructor.call(this);
	
	var _self = this;
	
	this._onColumnDividerDragInstance = 
		function (elementEvent)
		{
			_self._onColumnDividerDrag(elementEvent);
		};
}
	
//Inherit from DataGridDataRenderer
DataGridHeaderElement.prototype = Object.create(DataGridDataRenderer.prototype);
DataGridHeaderElement.prototype.constructor = DataGridHeaderElement;
DataGridHeaderElement.base = DataGridDataRenderer;	

/////////////Style Types/////////////////////////

DataGridHeaderElement._StyleTypes = Object.create(null);

/**
 * @style ColumnDividerClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the draggable column divider (defaults to Button). 
 */
DataGridHeaderElement._StyleTypes.ColumnDividerClass = 		StyleableBase.EStyleType.NORMAL; 	// Element constructor()

/**
 * @style ColumnDividerStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the column divider element.
 * See default skin class is DataGridHeaderColumnDividerSkinElement for additional styles.
 * 
 * @seealso DataGridHeaderColumnDividerSkinElement
 */
DataGridHeaderElement._StyleTypes.ColumnDividerStyle = 		StyleableBase.EStyleType.SUBSTYLE; 	// StyleDefinition

/**
 * @style DraggableColumns boolean
 * 
 * When true, column dividers are draggable.
 */
DataGridHeaderElement._StyleTypes.DraggableColumns = 		StyleableBase.EStyleType.NORMAL; 	// StyleDefinition


////////////Default Styles////////////////////

DataGridHeaderElement.StyleDefault = new StyleDefinition();
DataGridHeaderElement.StyleDefault.setStyle("PaddingBottom", 				1);
DataGridHeaderElement.StyleDefault.setStyle("BorderType", 					"solid");
DataGridHeaderElement.StyleDefault.setStyle("BorderThickness", 				1);
DataGridHeaderElement.StyleDefault.setStyle("BorderColor", 					"#000000");

//Column Divider button style
DataGridHeaderElement.ColumnDividerSkinStyleDefault = new StyleDefinition();
DataGridHeaderElement.ColumnDividerSkinStyleDefault.setStyle("DividerLineColor", 		"#777777");
DataGridHeaderElement.ColumnDividerSkinStyleDefault.setStyle("DividerArrowColor", 		"#444444");
DataGridHeaderElement.ColumnDividerSkinStyleDefault.setStyle("BorderType", 				null);
DataGridHeaderElement.ColumnDividerSkinStyleDefault.setStyle("BackgroundColor", 		null);

DataGridHeaderElement.ColumnDividerStyleDefault = new StyleDefinition();
DataGridHeaderElement.ColumnDividerStyleDefault.setStyle("SkinClass", 				DataGridHeaderColumnDividerSkinElement); 
DataGridHeaderElement.ColumnDividerStyleDefault.setStyle("Width", 					11);
DataGridHeaderElement.ColumnDividerStyleDefault.setStyle("TabStop", 				-1);
DataGridHeaderElement.ColumnDividerStyleDefault.setStyle("UpSkinStyle", 			DataGridHeaderElement.ColumnDividerSkinStyleDefault);
DataGridHeaderElement.ColumnDividerStyleDefault.setStyle("OverSkinStyle", 			DataGridHeaderElement.ColumnDividerSkinStyleDefault);
DataGridHeaderElement.ColumnDividerStyleDefault.setStyle("DownSkinStyle", 			DataGridHeaderElement.ColumnDividerSkinStyleDefault);
DataGridHeaderElement.ColumnDividerStyleDefault.setStyle("DisabledSkinStyle", 		DataGridHeaderElement.ColumnDividerSkinStyleDefault);

DataGridHeaderElement.StyleDefault.setStyle("ColumnDividerClass", 					ButtonElement);
DataGridHeaderElement.StyleDefault.setStyle("ColumnDividerStyle", 					DataGridHeaderElement.ColumnDividerStyleDefault); 

DataGridHeaderElement.StyleDefault.setStyle("DraggableColumns", 					true);



////////Internal////////////////////////////////

//@override, we dont need skinning for this element. 
//We inherit from skinnable because it uses the same renderer used for rows for column logic.
DataGridHeaderElement.prototype._getSkinClass = 
	function ()
	{
		return null;
	};


/**
 * @function _onColumnDividerDrag
 * Event handler for column divider "dragging" event. Updates the header item renderers and 
 * parent grid column widths.
 * 
 * @param elementEvent ElementEvent
 * The ElementEvent to process.
 */	
DataGridHeaderElement.prototype._onColumnDividerDrag = 
	function (elementEvent)
	{
		if (this._listData == null)
			return;
		
		var parentGrid = this._listData._parentList;
		var dividerRenderer = null;
		var expectedPosition = 0;
		var totalSize = 0;
		var totalPercent = 0;
		var i;
		
		//Record column data
		var columnData = []; 
		for (i = 0; i < parentGrid._gridColumns.length; i++)
		{
			columnData.push(
				{actualSize:parentGrid._columnSizes[i], 
				percentSize:parentGrid._columnPercents[i],
				oldPercentSize:parentGrid._columnPercents[i],
				minSize:parentGrid._gridColumns[i].getStyle("MinSize"),
				minPercent:0});
			
			totalSize += columnData[i].actualSize;
			totalPercent += columnData[i].percentSize;
		}
		
		//Min percent per column based on its min pixel size.
		for (i = 0; i < columnData.length; i++)
			columnData[i].minPercent = columnData[i].minSize / totalSize * totalPercent;
		
		//Calculate new column widths
		var currentColumn = 0;
		for (i = columnData.length; i < this._itemRenderersContainer._children.length; i++)
		{
			dividerRenderer = this._itemRenderersContainer._children[i];
			currentColumn = i - columnData.length;
			
			expectedPosition += columnData[currentColumn].actualSize;
			
			if (dividerRenderer == elementEvent.getCurrentTarget())
			{
				//Columns left of the divider we adjust by pixel and re-calculate their approximate percents.
				//Columns right of the divider we re-calculate their percents, and then determine the pixel size.
				
				expectedPosition = Math.round(expectedPosition - (dividerRenderer._width / 2)); //Round here
				
				var minPosition = expectedPosition;
				var maxPosition = expectedPosition;
				
				//Record "right" side column data, determine maximum slide position.
				var remainingPercent = 0;
				var remainingSize = 0;
				var remainingColumns = [];
				for (var i2 = currentColumn + 1; i2 < columnData.length; i2++)
				{
					remainingColumns.push(columnData[i2]);
					remainingPercent += columnData[i2].percentSize;
					remainingSize += columnData[i2].actualSize;
					maxPosition += columnData[i2].actualSize - columnData[currentColumn].minSize;
				}
				
				//Minimum slide position.
				for (var i2 = currentColumn; i2 >= 0; i2--)
					minPosition -= (columnData[i2].actualSize - columnData[i2].minSize);

				//Correct if we're outside of min/max
				var actualPosition = dividerRenderer._x;
				if (actualPosition < minPosition)
					actualPosition = minPosition;
				if (actualPosition > maxPosition)
					actualPosition = maxPosition;
				
				//Adjust left side columns
				var percentDelta = 0;
				var availableDelta = actualPosition - expectedPosition;
				remainingSize -= availableDelta;
				
				for (var i2 = currentColumn; i2 >= 0; i2--)
				{
					//Adjust size
					if (columnData[i2].actualSize + availableDelta < columnData[i2].minSize)
					{
						availableDelta -= columnData[i2].actualSize - columnData[i2].minSize;
						columnData[i2].actualSize = columnData[i2].minSize;
					}
					else
					{
						columnData[i2].actualSize += availableDelta;
						availableDelta = 0;
					}
					
					//Calculate column's new percent
					columnData[i2].percentSize = columnData[i2].actualSize / totalSize * totalPercent;
					
					//Add up the percent delta to distribute to "right" side columns.
					percentDelta += columnData[i2].percentSize - columnData[i2].oldPercentSize;
					
					if (availableDelta == 0)
						break;
				}
				
				//Calculate new percentages for remaining columns.
				var percentColumns = remainingColumns.slice();		
				var done = false;
				while (done == false)
				{
					done = true;
					for (var i2 = 0; i2 < percentColumns.length; i2++)
					{
						//Break the percent delta up by ratio.
						var delta = percentDelta * (percentColumns[i2].oldPercentSize / remainingPercent);
						
						//We hit minimum percent, use the minimum, remove it from the calculation and restart.
						if (percentColumns[i2].oldPercentSize - delta < percentColumns[i2].minPercent)
						{
							percentColumns[i2].percentSize = percentColumns[i2].minPercent;
							remainingPercent -= percentColumns[i2].minPercent;
							percentDelta -= (percentColumns[i2].oldPercentSize - percentColumns[i2].percentSize);
							
							percentColumns.splice(i2, 1);
							
							done = false;
							break;
						}
						else
							percentColumns[i2].percentSize = percentColumns[i2].oldPercentSize - delta;
					}
				}
	
				//Translate remaining column percents to actual widths.
				CanvasElement._calculateMinMaxPercentSizes(remainingColumns, remainingSize);
				
				break;
			}
		}
		
		//Update Grids column data.
		for (i = 0; i < columnData.length; i++)
		{
			parentGrid._columnSizes[i] = columnData[i].actualSize;
			parentGrid._columnPercents[i] = columnData[i].percentSize;
		}
		
		this._invalidateLayout();
		parentGrid._invalidateLayout(); //For gridlines
		parentGrid._invalidateListRenderersLayout(); //Adjust columns
	};

//@Override
DataGridHeaderElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		DataGridHeaderElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("ColumnDividerClass" in stylesMap || "ColumnDividerStyle" in stylesMap)
			this._setListData(this._listData, this._itemData);
		
		if ("DraggableColumns" in stylesMap && this._listData != null)
		{
			var parentGrid = this._listData._parentList;
			var draggableColumns = this.getStyle("DraggableColumns");
			var dividerRenderer = null;
			var hasListener = null;
			
			for (var i = parentGrid._gridColumns.length; i < this._itemRenderersContainer._children.length; i++)
			{
				dividerRenderer = this._itemRenderersContainer._children[i];
				dividerRenderer.setStyle("Draggable", draggableColumns);
				
				hasListener = dividerRenderer.hasEventListener("dragging", this._onColumnDividerDragInstance);
				
				if (draggableColumns == true && hasListener == false)
					dividerRenderer.addEventListener("dragging", this._onColumnDividerDragInstance);
				else if (draggableColumns == false && hasListener == true)
					dividerRenderer.removeEventListener("dragging", this._onColumnDividerDragInstance);
				
				if (draggableColumns == true)
					dividerRenderer.setStyle("Enabled", true);
				else
					dividerRenderer.setStyle("Enabled", false);
			}
		}
	};
	
//@Override
DataGridHeaderElement.prototype._setListData = 
	function (listData, itemData)
	{
		// Call base.base
		DataGridDataRenderer.base.prototype._setListData.call(this, listData, itemData);
		
		if (listData == null)
			return;
		
		var i = 0;
		var renderer = null;
		for (i = 0; i < listData._parentList._gridColumns.length; i++)
		{
			renderer = this._itemRenderersContainer._getChildAt(i);
			
			if (renderer == null)
			{
				renderer = listData._parentList._createHeaderItemRenderer(i);
				this._itemRenderersContainer._addChildAt(renderer, i);
			}
			else
			{
				columnDef = listData._parentList._gridColumns[i];
				
				if (renderer.constructor != columnDef.getStyle("HeaderItemClass"))
				{ //Renderer Class changed
					
					this._itemRenderersContainer._removeChildAt(i);
					renderer = listData._parentList._createHeaderItemRenderer(i);
					this._itemRenderersContainer._addChildAt(renderer, i);
				}
				else
				{ //Update DataGridData
					
					listData._parentList._updateHeaderItemRendererData(renderer, i);
				}
			}
		}
		
		var dividerClass = this.getStyle("ColumnDividerClass");
		var draggableColumns = this.getStyle("DraggableColumns");
		
		var totalElements = listData._parentList._gridColumns.length;
		
		if (dividerClass != null)
			totalElements = (totalElements * 2) - 1;
		
		for (var i2 = i; i2 < totalElements; i2++)
		{
			renderer = this._itemRenderersContainer._getChildAt(i2);
			
			if (renderer != null && renderer.constructor != dividerClass)
			{
				this._itemRenderersContainer._removeChildAt(i2);
				renderer = null;
			}
			
			if (renderer == null)
			{
				renderer = new (dividerClass)();
				this._applySubStylesToElement("ColumnDividerStyle", renderer);
				renderer.setStyle("Draggable", draggableColumns);
				
				if (draggableColumns == true)
					renderer.addEventListener("dragging", this._onColumnDividerDragInstance);
				
				this._itemRenderersContainer._addChildAt(renderer, i2);
			}
			else
				this._applySubStylesToElement("ColumnDividerStyle", renderer);
		}
		
		//Purge excess renderers.
		while (this._itemRenderersContainer._children.length > totalElements)
			this._itemRenderersContainer._removeChildAt(this._itemRenderersContainer._children.length - 1);
		
		//Invalidate, the item renderer container doesnt measure so wont do it for us.
		this._invalidateMeasure();
		this._invalidateLayout();
	};

//@Override	
DataGridHeaderElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		DataGridHeaderElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		if (this._listData == null)
			return;
		
		var parentGrid = this._listData._parentList;
		var dividerRenderer = null;
		var currentPosition = 0;
		var columnSize = 0;
		
		//Size / Position divider lines
		for (var i = parentGrid._columnSizes.length; i < this._itemRenderersContainer._children.length; i++)
		{
			dividerRenderer = this._itemRenderersContainer._children[i];
			columnSize = parentGrid._columnSizes[i - parentGrid._columnSizes.length];
			currentPosition += columnSize;
			
			var dividerHeight = dividerRenderer.getStyle("Height");
			if (dividerHeight == null)
				dividerHeight = Math.round(this._itemRenderersContainer._height * .7);
			
			dividerRenderer._setActualSize(dividerRenderer._getStyledOrMeasuredWidth(), dividerHeight);
			dividerRenderer._setActualPosition(currentPosition - (dividerRenderer._getStyledOrMeasuredWidth() / 2), (this._itemRenderersContainer._height / 2) - (dividerRenderer._height / 2));
		}
	};
	
	
//@override - render ourself. Not using skins.
DataGridHeaderElement.prototype._doRender = 
	function ()
	{
		SkinnableElement.base.prototype._doRender.call(this);
	};		


/**
 * @depends DataListElement.js
 * @depends DataGridDataRenderer.js
 * @depends DataGridHeaderElement.js
 * @depends CanvasElement.js
 */

///////////////////////////////////////////////////////////////////////
///////////////////////DataGridElement/////////////////////////////////		
	
/**
 * @class DataGridElement
 * @inherits DataListElement
 * 
 * DataGridElement is a data-driven container that renders a header and rows
 * via a supplied ListCollection, DataGridColumnDefinition(s), and Data/Item Renderers.
 * A scroll bar will be added if the collection size exceeds the available area. 
 * DataGridElement only renders visible DataRenderers so collection size does not impact performance
 * and allows the header, rows, header item, and row item classes to be specified and styled if desired.
 * 
 * The default header class is DataGridHeaderElement.
 * The default ListItem DataRenderer (renders a row) is DataGridDataRenderer.
 * 
 * Default header/row ItemRenderers are supplied by the DataGridColumnDefinition and are as follows.
 * The default HeaderItem DataRenderer is DataGridHeaderItemRenderer.
 * The default RowItem DataRenderer DataGridLabelItemRenderer.
 * 
 * 
 * @seealso DataGridHeaderElement
 * @seealso DataGridDataRenderer
 * @seealso DataGridColumnDefinition
 * @seealso DataGridHeaderItemRenderer
 * @seealso DataGridLabelItemRenderer
 * 
 * 
 * @constructor DataGridElement 
 * Creates new DataGridElement instance.
 */
function DataGridElement()
{
	DataGridElement.base.prototype.constructor.call(this);
	
	/**
	 * @member _gridColumns Array
	 * Read Only - Array of DataGridColumnDefinition.
	 */
	this._gridColumns = [];
	
	this._columnSizes = [];
	this._columnPercents = [];	
	
	this._gridHeader = null;
	
	this._gridLineContainer = new CanvasElement();
	this._gridLineContainer.setStyle("MouseEnabled", false);
	this._gridLineContainer.setStyle("ClipContent", true);
	this._addChild(this._gridLineContainer);
	
	var _self = this;
	
	//Private event handler, proxy to prototype.
	this._onDataGridColumnDefinitionChangedInstance = 
		function (styleChangedEvent)
		{
			_self._onDataGridColumnDefinitionChanged(styleChangedEvent);
		};
		
	this._onDataGridRowItemClickInstance = 
		function (elementMouseEvent)
		{
			_self._onDataGridRowItemClick(elementMouseEvent);
		};
		
	this._onDataGridHeaderItemClickInstance = 
		function (elementMouseEvent)
		{
			_self._onDataGridHeaderItemClick(elementMouseEvent);
		};
	this._onGridLineContainerMeasureCompleteInstance = 
		function (event)
		{
			_self._onGridLineContainerMeasureComplete(event);
		};
		
	
	this._gridLineContainer.addEventListener("measurecomplete", this._onGridLineContainerMeasureCompleteInstance);	
}

//Inherit from DataListElement
DataGridElement.prototype = Object.create(DataListElement.prototype);
DataGridElement.prototype.constructor = DataGridElement;
DataGridElement.base = DataListElement;

////////////Events////////////////////////////////////////

/**
 * @event listitemclick ElementGridItemClickEvent
 * Dispatched when an ItemRenderer or header is clicked. Includes associated collection item/index.
 */


/////////////Style Types////////////////////////////////////////////

DataGridElement._StyleTypes = Object.create(null);

/**
 * @style HeaderClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the DataGrid header. Default is DataGridHeaderElement.
 * 
 * @seealso DataGridHeaderElement
 */
DataGridElement._StyleTypes.HeaderClass = 						StyleableBase.EStyleType.NORMAL;		// Element constructor()

/**
 * @style HeaderStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the header element.
 */
DataGridElement._StyleTypes.HeaderStyle = 						StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition

/**
 * @style GridLinesPriority String
 * 
 * Determines which set of grid lines will be rendered first. Allowable values are "vertical" or "horizontal".
 */
DataGridElement._StyleTypes.GridLinesPriority = 				StyleableBase.EStyleType.NORMAL;		// "vertical" || "horizontal" (Which lines are drawn first / below)

/**
 * @style VerticalGridLinesClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the DataGrid vertical grid lines. Default is CanvasElement.
 */
DataGridElement._StyleTypes.VerticalGridLinesClass = 			StyleableBase.EStyleType.NORMAL;		// Element constructor()

/**
 * @style VerticalGridLinesStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the vertical grid line elements.
 */
DataGridElement._StyleTypes.VerticalGridLinesStyle = 			StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition

/**
 * @style HorizontalGridLinesClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the DataGrid horizontal grid lines. Default is null.
 */
DataGridElement._StyleTypes.HorizontalGridLinesClass = 			StyleableBase.EStyleType.NORMAL;		// Element constructor()

/**
 * @style HorizontalGridLinesStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the horizontal grid line elements.
 */
DataGridElement._StyleTypes.HorizontalGridLinesStyle = 			StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition


////////////Default Styles/////////////////////////////////////////

DataGridElement.StyleDefault = new StyleDefinition();

/////GridLines default style //////
DataGridElement.GridLineStyleDefault = new StyleDefinition();
DataGridElement.GridLineStyleDefault.setStyle("Width", 					1);				// number
DataGridElement.GridLineStyleDefault.setStyle("Height", 				1); 			// number
DataGridElement.GridLineStyleDefault.setStyle("BackgroundColor", 		"#BBBBBB");		// "#000000"
///////////////////////////////////

/////ScrollBar default style //////
DataGridElement.ScrollBarStyleDefault = new StyleDefinition();
DataGridElement.ScrollBarStyleDefault.setStyle("Padding", 				-1);			// number
///////////////////////////////////

//Override base class styles
DataGridElement.StyleDefault.setStyle("ListItemClass", 					DataGridDataRenderer); 					// Element constructor()	
DataGridElement.StyleDefault.setStyle("ListItemStyle", 					null); 									// StyleDefinition

DataGridElement.StyleDefault.setStyle("BorderType",		 				"solid"); 	
DataGridElement.StyleDefault.setStyle("BorderThickness",	 			1);
DataGridElement.StyleDefault.setStyle("PaddingTop",	 					1);
DataGridElement.StyleDefault.setStyle("PaddingBottom", 					1);
DataGridElement.StyleDefault.setStyle("PaddingLeft",					1);
DataGridElement.StyleDefault.setStyle("PaddingRight", 					1);
DataGridElement.StyleDefault.setStyle("ScrollBarStyle", 				DataGridElement.ScrollBarStyleDefault);	// StyleDefinition

//DataGrid specific
DataGridElement.StyleDefault.setStyle("HeaderClass", 					DataGridHeaderElement); 				// Element constructor()
DataGridElement.StyleDefault.setStyle("HeaderStyle", 					null); 									// StyleDefinition

DataGridElement.StyleDefault.setStyle("GridLinesPriority", 				"vertical"); 							// "vertical" || "horizontal"

DataGridElement.StyleDefault.setStyle("VerticalGridLinesClass", 		CanvasElement); 						// Element constructor()
DataGridElement.StyleDefault.setStyle("VerticalGridLinesStyle", 		DataGridElement.GridLineStyleDefault); 	// StyleDefinition

DataGridElement.StyleDefault.setStyle("HorizontalGridLinesClass", 		CanvasElement); 						// Element constructor()
DataGridElement.StyleDefault.setStyle("HorizontalGridLinesStyle", 		DataGridElement.GridLineStyleDefault); 	// StyleDefinition
DataGridElement.StyleDefault.setStyle("TabStop", 						0);


///////////Public//////////////////////////////////

/**
 * @function addColumnDefinition
 * Adds a column definition to be rendered by the DataGrid.
 * 
 * @param columnDefinition DataGridColumnDefinition
 * Column definition to be rendered by the DataGrid.
 */
DataGridElement.prototype.addColumnDefinition = 
	function (columnDefinition)
	{
		return this.addColumnDefinitionAt(columnDefinition, this._gridColumns.length);
	};
	
/**
 * @function addColumnDefinitionAt
 * Adds a column definition to be rendered by the DataGrid at a supplied column index.
 * 
 * @param columnDefinition DataGridColumnDefinition
 * Column definition to be rendered by the DataGrid.
 * 
 * @param index int
 * The index to insert the column definition.
 */	
DataGridElement.prototype.addColumnDefinitionAt = 
	function (columnDefinition, index)
	{
		if (!(columnDefinition instanceof DataGridColumnDefinition))
			throw "Invalid DataGridColumnDefinition";
		
		this._gridColumns.splice(index, 0, columnDefinition);
		this._columnPercents.splice(index, 0, columnDefinition.getStyle("PercentSize"));
		
		if (this._manager != null)
			columnDefinition.addEventListener("stylechanged", this._onDataGridColumnDefinitionChangedInstance);
		
		this._columnSizes = []; //Force grid to re-calculate column sizes
		this._columnsChanged();
		
		return columnDefinition;
	};
	
/**
 * @function getColumnDefinitionAt
 * Gets the DataGridColumnDefinition at a supplied column index.
 * 
 * @param index int
 * The index to return the DataGridColumnDefinition.
 * 
 * @returns DataGridColumnDefinition
 * The DataGridColumnDefinition at the supplied index.
 */	
DataGridElement.prototype.getColumnDefinitionAt = 
	function (index)
	{
		if (index < 0 || index >= this._gridColumns.length)
			return null;
	
		return this._gridColumns[index];
	};	
	
/**
 * @function removeColumnDefinition
 * Removes a column definition from the DataGrid.
 * 
 * @param columnDefinition DataGridColumnDefinition
 * Column definition to be removed.
 * 
 * @returns DataGridColumnDefinition
 * The removed column definition.
 */	
DataGridElement.prototype.removeColumnDefinition = 
	function (columnDefinition)
	{
		return this.removeColumnDefinitionAt(this._gridColumns.indexOf(columnDefinition));
	};

/**
 * @function removeColumnDefinitionAt
 * Removes a column definition from the DataGrid.
 * 
 * @param index int
 * Column index of definition to be removed.
 * 
 * @returns DataGridColumnDefinition
 * The removed column definition or null if the index was out of range.
 */		
DataGridElement.prototype.removeColumnDefinitionAt = 
	function (index)
	{
		if (index < 0 || index >= this._gridColumns.length)
			return null;
		
		var removed = this._gridColumns.splice(index, 1)[0]; //Returns array of removed items.
		this._columnPercents.splice(index, 1);
		
		if (this._manager != null)
			removed.removeEventListener("stylechanged", this._onDataGridColumnDefinitionChangedInstance);
		
		this._columnSizes = []; //Force grid to re-calculate column sizes
		this._columnsChanged();
		
		return removed;
	};

/**
 * @function getNumColumns
 * Gets the number of column definitions.
 * 
 * @returns int
 * Number of column definitions.
 */		
DataGridElement.prototype.getNumColumns = 
	function ()
	{
		return this._gridColumns.length;
	};
	
	
///////////Internal////////////////////////////////
	
//@private
DataGridElement.prototype._onGridLineContainerMeasureComplete = 
	function (event)
	{
		this._invalidateLayout();
	};
	
/**
 * @function _onDataGridColumnDefinitionChanged
 * Event handler for DataGridColumnDefinition "stylechanged" event. Updates the DataGrid column.
 * 
 * @param styleChangedEvent StyleChangedEvent
 * The StyleChangedEvent to process.
 */	
DataGridElement.prototype._onDataGridColumnDefinitionChanged = 
	function (styleChangedEvent)
	{
		var styleName = styleChangedEvent.getStyleName();
		
		if (styleName == "PercentSize")
		{
			var columnIndex = this._gridColumns.indexOf(styleChangedEvent.getTarget());
			this._columnPercents[columnIndex] = styleChangedEvent.getNewValue();
			this._columnSizes = []; //Force grid to re-calculate column sizes
			this._invalidateLayout();
		}
		else if (styleName == "MinSize")
		{
			this._columnSizes = []; //Force grid to re-calculate column sizes
			this._invalidateLayout();
		}
		else
			this._columnsChanged();
	};

/**
 * @function _columnsChanged
 * Called in response to columns being added/removed or their styles changed.
 * Updates the DataGrid columns.
 */	
DataGridElement.prototype._columnsChanged = 
	function ()
	{
		//Refresh all the ListData, data hasnt changed, but this
		//also tells the renderer to inspect and adjust the columns.
		if (this._gridHeader != null)
		{
			this._gridHeader._setListData(
				this._gridHeader._listData,
				null);
		}
		
		var renderer = null;
		for (var i = 0; i < this._contentPane._children.length; i++)
		{
			renderer = this._contentPane._children[i];
			
			renderer._setListData(
				renderer._listData,
				renderer._itemData);
		}
		
		this._invalidateLayout();
	};

//Override	
DataGridElement.prototype._onDataListCollectionChanged = 
	function (collectionChangedEvent)
	{
		DataGridElement.base.prototype._onDataListCollectionChanged.call(this, collectionChangedEvent);
		
		//Sort may have happened, update the header's data so it can adjust sort icon.
		if (collectionChangedEvent.getKind() == "reset" && this._gridHeader != null)
		{
			//Data hasnt actually changed.
			this._gridHeader._setListData(
				this._gridHeader._listData,
				null);
		}
	};
	
//@Override	
DataGridElement.prototype._onCanvasElementAdded = 
	function (addedRemovedEvent)
	{
		DataGridElement.base.prototype._onCanvasElementAdded.call(this, addedRemovedEvent);
	
		for (var i = 0; i < this._gridColumns.length; i++)
			this._gridColumns[i].addEventListener("stylechanged", this._onDataGridColumnDefinitionChangedInstance);
	};

//@Override	
DataGridElement.prototype._onCanvasElementRemoved = 
	function (addedRemovedEvent)
	{
		DataGridElement.base.prototype._onCanvasElementRemoved.call(this, addedRemovedEvent);
		
		for (var i = 0; i < this._gridColumns.length; i++)
			this._gridColumns[i].removeEventListener("stylechanged", this._onDataGridColumnDefinitionChangedInstance);
	};		
	
//@Override
DataGridElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		DataGridElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("HeaderClass" in stylesMap)
		{
			var headerClass = this.getStyle("HeaderClass");
			
			//Destroy if class is null or does not match existing
			if ((headerClass == null && this._gridHeader != null) ||
				this._gridHeader != null && this._gridHeader.constructor != headerClass)
			{
				this._removeChild(this._gridHeader);
				this._gridHeader = null;
			}
			
			//Create
			if (headerClass != null && this._gridHeader == null)
			{
				this._gridHeader = new (headerClass)();
				
				this._gridHeader._setListData(
					new DataListData(this, -1),
					null);
				
				this._addChild(this._gridHeader);
			}
			
			this._invalidateLayout();
		}
		
		if ("HeaderStyle" in stylesMap && this._gridHeader != null)
			this._applySubStylesToElement("HeaderStyle", this._gridHeader);
		
		if ("GridLinesPriority" in stylesMap ||
			"VerticalGridLinesClass" in stylesMap ||
			"VerticalGridLinesStyle" in stylesMap ||
			"HorizontalGridLinesClass" in stylesMap ||
			"HorizontalGridLinesStyle" in stylesMap)
		{
			this._invalidateLayout();
		}
	};	
	
//@Override		
DataGridElement.prototype._createRenderer = 
	function (itemIndex)
	{
		var newRenderer = new (this.getStyle("ListItemClass"))();
		this._applySubStylesToElement("ListItemStyle", newRenderer);
		this._updateRendererData(newRenderer, itemIndex);
		
		return newRenderer;
	};	

/**
 * @function _createHeaderItemRenderer
 * Generates a header ItemRenderer base on the column definition HeaderItemClass style.
 * 
 * @param columnIndex int
 * Column index associated with the header ItemRenderer.
 * 
 * @returns CanvasElement
 * The new header ItemRenderer instance.
 */		
DataGridElement.prototype._createHeaderItemRenderer = 
	function (columnIndex)
	{
		var columnDefinition = this._gridColumns[columnIndex];
		
		var headerItemClass = columnDefinition.getStyle("HeaderItemClass");
		var newRenderer = new (headerItemClass)();
		columnDefinition._applySubStylesToElement("HeaderItemStyle", newRenderer);
		
		this._updateHeaderItemRendererData(newRenderer, columnIndex);		
		
		newRenderer.addEventListener("click", this._onDataGridHeaderItemClickInstance);
		
		return newRenderer;
	};
	
/**
 * @function _updateHeaderItemRendererData
 * Updates the header ItemRenderer list data.
 * 
 * @param renderer CanvasElement
 * Header ItemRenderer to update.
 * 
 * @param columnIndex int
 * Column index to associate with the header ItemRenderer.
 */		
DataGridElement.prototype._updateHeaderItemRendererData = 
	function (renderer, columnIndex)
	{
		var columnDefinition = this._gridColumns[columnIndex];
		
		//Optimize, only create new data if its actually changed.
		var listData = null;
		if (renderer._listData != null && renderer._listData._columnIndex == columnIndex)
			listData = renderer._listData;
		else
			listData = new DataGridItemData(this, -1, columnIndex);
		
		columnDefinition._applySubStylesToElement("HeaderItemStyle", renderer);
		
		renderer._setListData(
			listData,
			null);
	};
	
/**
 * @function _onDataGridHeaderItemClick
 * Event handler for header ItemRenderer "click" event. Sorts the collection if a 
 * CollectionSort is assigned to the DataGridColumDefinition and dispatched "listitemclick" event.
 * 
 * @param elementMouseEvent ElementMouseEvent
 * The ElementMouseEvent to process.
 */			
DataGridElement.prototype._onDataGridHeaderItemClick = 
	function (elementMouseEvent)
	{
		var columnIndex = elementMouseEvent.getCurrentTarget()._listData._columnIndex;
		
		var collectionSort = this._gridColumns[columnIndex].getStyle("CollectionSort");
		if (collectionSort != null && collectionSort instanceof CollectionSort)
		{
			if (this._listCollection._collectionSort != collectionSort)
			{
				collectionSort._isDecending = false;
				this._listCollection.setCollectionSort(collectionSort);
				this._listCollection.sort();
			}
			else
			{
				collectionSort._isDecending = !(collectionSort._isDecending);
				this._listCollection.sort();
			}
		}
		
		this._dispatchEvent(new ElementGridItemClickEvent(-1, columnIndex, null));
	};
	
/**
 * @function _createRowItemRenderer
 * Generates a row ItemRenderer base on the column definition RowItemClass style.
 * 
 * @param itemIndex int
 * Collection item index to associate with the row ItemRenderer.
 * 
 * @param columnIndex int
 * Column index to associate with the row ItemRenderer.
 * 
 * @returns CanvasElement
 * The new row ItemRenderer instance.
 */		
DataGridElement.prototype._createRowItemRenderer = 
	function (itemIndex, columnIndex)
	{
		var columnDefinition = this._gridColumns[columnIndex];
	
		var rowItemClass = columnDefinition.getStyle("RowItemClass");
		var newRenderer = new (rowItemClass)();
		columnDefinition._applySubStylesToElement("RowItemStyle", newRenderer);
		
		this._updateRowItemRendererData(newRenderer, itemIndex, columnIndex);		
		
		newRenderer.addEventListener("click", this._onDataGridRowItemClickInstance);
		
		return newRenderer;
	};

/**
 * @function _updateRowItemRendererData
 * Updates the row ItemRenderer list data.
 * 
 * @param renderer CanvasElement
 * Row ItemRenderer to update.
 * 
 * @param itemIndex int
 * Collection item index to associate with the row ItemRenderer.
 * 
 * @param columnIndex int
 * Column index to associate with the row ItemRenderer.
 */		
DataGridElement.prototype._updateRowItemRendererData = 
	function (renderer, itemIndex, columnIndex)
	{
		var columnDefinition = this._gridColumns[columnIndex];
		
		//Optimize, only create new data if its actually changed.
		var listData = null;
		if (renderer._listData != null && renderer._listData._columnIndex == columnIndex && renderer._listData._itemIndex == itemIndex)
			listData = renderer._listData;
		else
			listData = new DataGridItemData(this, itemIndex, columnIndex);
		
		columnDefinition._applySubStylesToElement("RowItemStyle", renderer);
	
		renderer._setListData(
			listData,
			this._listCollection.getItemAt(itemIndex));
	};
	
/**
 * @function _onDataGridRowItemClick
 * Event handler for the row ItemRenderer "click" event. Updates selected index/item and dispatches "listitemclick" and "changed" events.
 * 
 * @param elementMouseEvent ElementMouseEvent
 * The ElementMouseEvent to process.
 */
DataGridElement.prototype._onDataGridRowItemClick = 
	function (elementMouseEvent)
	{
		var itemIndex = elementMouseEvent.getCurrentTarget()._listData._itemIndex;
		var columnIndex = elementMouseEvent.getCurrentTarget()._listData._columnIndex;
		var itemData = elementMouseEvent.getCurrentTarget()._itemData;
		
		var dispatchChanged = false;
		
		if (this.getStyle("Selectable") == true && this.setSelectedIndex(itemIndex) == true)
			dispatchChanged = true;
		
		this._dispatchEvent(new ElementGridItemClickEvent(itemIndex, columnIndex, itemData));
		
		if (dispatchChanged == true)
			this._dispatchEvent(new ElementEvent("changed", false));
	};
	
//@Override
DataGridElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		return {width:16, height:16};
	};
	
/**
 * @function _createGridLine
 * Generates a grid line element based on vertical/horizontal GridLinesClass style.
 * 
 * @param direction String
 * The grid line direction "vertical" or "horizontal"
 * 
 * @returns CanvasElement
 * The new grid line element.
 */		
DataGridElement.prototype._createGridLine = 
	function (direction)
	{
		var line = null;
		if (direction == "vertical")
		{
			line = new (this.getStyle("VerticalGridLinesClass"))();
			this._applySubStylesToElement("VerticalGridLinesStyle", line);
		}
		else
		{
			line = new (this.getStyle("HorizontalGridLinesClass"))();
			this._applySubStylesToElement("HorizontalGridLinesStyle", line);
		}
		
		return line;
	};
	
//@Override	
DataGridElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		if (this._gridHeader != null)
		{
			var headerHeight = this._gridHeader._getStyledOrMeasuredHeight();
			
			var adjustedPadding = new DrawMetrics();
			adjustedPadding._x = paddingMetrics._x;
			adjustedPadding._y = paddingMetrics._y + headerHeight;
			adjustedPadding._width = paddingMetrics._width;
			adjustedPadding._height = paddingMetrics._height - headerHeight;
			
			//Adjust the padding so base() leaves us room for the header
			DataGridElement.base.prototype._doLayout.call(this, adjustedPadding);
		}
		else
			DataGridElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		//Base makes multiple passes, no reason to run below if we're waiting for the DataList to finish anyway.
		if (this._layoutInvalid == true)
			return;
		
		//Size / Position the grid header
		if (this._gridHeader != null)
		{
			this._gridHeader._setActualPosition(this._contentPane._x, paddingMetrics.getY());
			this._gridHeader._setActualSize(paddingMetrics.getWidth(), this._gridHeader._getStyledOrMeasuredHeight());
		}
		
		var i;
		var calculateColumnSizes = false;
		
		//Determine if we need to recalculate column widths (new columns or size change)
		if (this._columnSizes.length != this._gridColumns.length)
			calculateColumnSizes = true;
		else
		{
			var totalSize = 0;
			for (i = 0; i < this._columnSizes.length; i++)
				totalSize += this._columnSizes[i];
			
			if (totalSize != this._contentPane._width)
				calculateColumnSizes = true;
		}
		
		if (calculateColumnSizes == true)
		{
			var columnData = [];
			
			//Record column size info.
			for (i = 0; i < this._gridColumns.length; i++)
			{
				columnData.push(
					{percentSize: this._columnPercents[i], //We dont use column style, its maintained separately. Header can change the percents.
					minSize: this._gridColumns[i].getStyle("MinSize")});
			}
			
			//Calculate actual widths.
			CanvasElement._calculateMinMaxPercentSizes(columnData, this._contentPane._width);
			
			//Update recorded sizes.
			var newColumnSizes = [];
			for (i = 0; i < columnData.length; i++)
				newColumnSizes.push(columnData[i].actualSize);
			
			this._columnSizes = newColumnSizes;
			
			//Invalidate children.
			if (this._gridHeader != null)
				this._gridHeader._invalidateLayout();
			
			this._invalidateListRenderersLayout();
		}
		
		////////Grid Lines//////////////////////////////////////////////////////////////////////////
		this._gridLineContainer._setActualPosition(this._contentPane._x, this._contentPane._y);
		this._gridLineContainer._setActualSize(this._contentPane._width, this._contentPane._height);
		
		var itemIndex = null;
		var lineIndex = 0;
		var gridLine = null;
		var rowRenderer = null;
		var verticalComplete = false;
		var horizontalComplete = false;
		var linePriority = this.getStyle("GridLinesPriority");
		var verticalClass = this.getStyle("VerticalGridLinesClass");
		var horizontalClass = this.getStyle("HorizontalGridLinesClass");
		
		while (verticalComplete == false || horizontalComplete == false)
		{
			if ((linePriority == "horizontal" && horizontalComplete == false) || (verticalComplete == true && horizontalComplete == false))
			{
				if (horizontalClass != null)
				{
					for (i = 0; i < this._contentPane._children.length; i++)
					{
						rowRenderer = this._contentPane._children[i];
						itemIndex = rowRenderer._listData._itemIndex;
						if (itemIndex == 0)
							continue;
						
						gridLine = this._gridLineContainer._getChildAt(lineIndex);
						if (gridLine == null)
						{
							gridLine = this._createGridLine("horizontal");
							this._gridLineContainer._addChildAt(gridLine, lineIndex);
						}
						else if (gridLine.constructor != horizontalClass)
						{
							this._gridLineContainer._removeChildAt(lineIndex);
							gridLine = this._createGridLine("horizontal");
							this._gridLineContainer._addChildAt(gridLine, lineIndex);
						}
						else
							this._applySubStylesToElement("HorizontalGridLinesStyle", gridLine);
						
						gridLine._setActualSize(this._gridLineContainer._width, gridLine.getStyle("Height"));
						gridLine._setActualPosition(0, rowRenderer._y - (gridLine._height / 2));
						
						lineIndex++;
					}
				}
				
				horizontalComplete = true;
			}
			
			if ((linePriority == "vertical" && verticalComplete == false) || (horizontalComplete == true && verticalComplete == false))
			{
				if (verticalClass != null)
				{
					var linePosition = 0;
					for (i = 0; i < this._columnSizes.length - 1; i++)
					{
						linePosition += this._columnSizes[i];
						gridLine = this._gridLineContainer._getChildAt(lineIndex);
						
						if (gridLine == null)
						{
							gridLine = this._createGridLine("vertical");
							this._gridLineContainer._addChildAt(gridLine, lineIndex);
						}
						else if (gridLine.constructor != verticalClass)
						{
							this._gridLineContainer._removeChildAt(lineIndex);
							gridLine = this._createGridLine("vertical");
							this._gridLineContainer._addChildAt(gridLine, lineIndex);
						}
						else
							this._applySubStylesToElement("VerticalGridLinesStyle", gridLine);
						
						gridLine._setActualSize(gridLine.getStyle("Width"), this._gridLineContainer._height);
						gridLine._setActualPosition(linePosition - (gridLine._width / 2), 0);
						
						lineIndex++;
					}
				}
				
				verticalComplete = true;
			}
		}
		
		//Purge excess line renderers.
		while (lineIndex < this._gridLineContainer._children.length)
			this._gridLineContainer._removeChildAt(this._gridLineContainer._children.length - 1);
	};
	
	




/**
 * @depends StyleableBase.js
 * @depends DataGridHeaderItemRenderer.js
 * @depends DataGridLabelItemRenderer.js
 */

///////////////////////////////////////////////////////////////////////
///////////////////DataGridColumnDefinition////////////////////////////		
	
/**
 * @class DataGridColumnDefinition
 * @inherits StyleableBase
 * 
 * DataGridColumnDefinition defines and stores styles necessary for the DataGrid to render columns.
 * 
 * The default HeaderItemClass is DataGridHeaderItemRenderer.
 * The default RowItemClass is DataGridLabelItemRenderer.
 * 
 * 
 * @seealso DataGridElement
 * @seealso DataGridHeaderItemRenderer
 * @seealso DataGridLabelItemRenderer
 * 
 * @constructor DataGridColumnDefinition 
 * Creates new DataGridColumnDefinition instance.
 */
function DataGridColumnDefinition()
{
	DataGridColumnDefinition.base.prototype.constructor.call(this);
}
	
//Inherit from StyleableBase
DataGridColumnDefinition.prototype = Object.create(StyleableBase.prototype);
DataGridColumnDefinition.prototype.constructor = DataGridColumnDefinition;
DataGridColumnDefinition.base = StyleableBase;

/////////////Style Types///////////////////////////////

DataGridColumnDefinition._StyleTypes = Object.create(null);

/**
 * @style PercentSize Number
 * 
 * The percentage of available space the column should consume. Percentages
 * are allowed to add to more than 100 and will consume all of the available space. 
 */
DataGridColumnDefinition._StyleTypes.PercentSize = 					StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style MinSize Number
 * 
 * Minimum number of pixels the column should consume.
 */
DataGridColumnDefinition._StyleTypes.MinSize = 						StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style HeaderLabel String
 * Text label to be used for the column header.
 */
DataGridColumnDefinition._StyleTypes.HeaderLabel = 					StyleableBase.EStyleType.NORMAL;		// "string"

/**
 * @style HeaderItemClass CanvasElement
 * 
 * The DataRenderer CanvasElement constructor to be used for the column header. 
 */
DataGridColumnDefinition._StyleTypes.HeaderItemClass = 				StyleableBase.EStyleType.NORMAL;		// Element constructor()

/**
 * @style HeaderItemStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the HeaderItem DataRenderer.
 */
DataGridColumnDefinition._StyleTypes.HeaderItemStyle = 				StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition

/**
 * @style CollectionSort CollectionSort
 * 
 * CollectionSort to be used to sort the column.
 */
DataGridColumnDefinition._StyleTypes.CollectionSort = 				StyleableBase.EStyleType.NORMAL;		// CollectionSort() 

/**
 * @style RowItemClass CanvasElement
 * 
 * The DataRenderer CanvasElement constructor to be used for this columns rows. 
 */
DataGridColumnDefinition._StyleTypes.RowItemClass = 				StyleableBase.EStyleType.NORMAL;		// Element constructor()

/**
 * @style RowItemStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the RowItem DataRenderer.
 */
DataGridColumnDefinition._StyleTypes.RowItemStyle = 				StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition

/**
 * @style RowItemLabelFunction Function
 * 
 * A function that returns a text string per a supplied collection item and columnIndex. 
 * function (itemData, columnIndex) { return "" }
 */
DataGridColumnDefinition._StyleTypes.RowItemLabelFunction = 		StyleableBase.EStyleType.NORMAL;		// function (data, columnIndex) { return "" }


/////////Default Styles///////////////////////////////

DataGridColumnDefinition.StyleDefault = new StyleDefinition();

DataGridColumnDefinition.StyleDefault.setStyle("PercentSize", 				100);							// number || null
DataGridColumnDefinition.StyleDefault.setStyle("MinSize", 					12);							// number || null

DataGridColumnDefinition.StyleDefault.setStyle("HeaderLabel", 				"");							// "string"
DataGridColumnDefinition.StyleDefault.setStyle("HeaderItemClass", 			DataGridHeaderItemRenderer);	// Element constructor()
DataGridColumnDefinition.StyleDefault.setStyle("HeaderItemStyle", 			null);							// StyleDefinition
DataGridColumnDefinition.StyleDefault.setStyle("CollectionSort", 			null);							// CollectionSort()

DataGridColumnDefinition.StyleDefault.setStyle("RowItemClass", 				DataGridLabelItemRenderer);		// Element constructor()
DataGridColumnDefinition.StyleDefault.setStyle("RowItemStyle", 				null);							// StyleDefinition
DataGridColumnDefinition.StyleDefault.setStyle("RowItemLabelFunction", 		null);							// function (data, columnIndex) { return "" }




/**
 * @depends RadioButtonElement.js
 * @depends CheckboxSkinElement.js
 */

///////////////////////////////////////////////////////////////////////
///////////////////////CheckboxElement/////////////////////////////////

/**
 * @class CheckboxElement
 * @inherits RadioButtonElement
 * 
 * Checkbox adds "halfSelected" versions of the 4 button states and assigns a default skin. 
 * The HalfSelected state may only be set programmatically. 
 * 
 * Checkbox half selected states:
 * "halfSelectedUp", "halfSelectedOver", "halfSelectedDown", "halfSelectedDisabled".
 * 
 * Being a SkinnableElement, Checkbox proxies its styles to its skins. 
 * You may assign custom skins and assign any styles you wish to apply to all skins to the Checkbox itself. 
 * 
 * See the default skin CheckBoxSkin for additional skin styles.
 * 
 * @seealso CheckboxSkinElement
 * 
 * 
 * @constructor CheckboxElement 
 * Creates new CheckboxElement instance.
 */
function CheckboxElement()
{
	CheckboxElement.base.prototype.constructor.call(this);
}

//Inherit from ToggleButtonElement
CheckboxElement.prototype = Object.create(RadioButtonElement.prototype);
CheckboxElement.prototype.constructor = CheckboxElement;
CheckboxElement.base = RadioButtonElement;	
	
/////////////Style Types///////////////////////////////

CheckboxElement._StyleTypes = Object.create(null);

//New checkbox specific styles, add half selected state.

/**
 * @style HalfSelectedUpSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the checkbox skin when the checkbox is in the "halfSelectedUp" state. 
 * This will override SkinClass when equal or higher priority than SkinClass.
 */
CheckboxElement._StyleTypes.HalfSelectedUpSkinClass = 			StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style HalfSelectedUpSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "halfSelectedUp" state skin element.
 */
CheckboxElement._StyleTypes.HalfSelectedUpSkinStyle = 			StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

/**
 * @style HalfSelectedUpTextColor String
 * 
 * Hex color value to be used for the checkbox label when the checkbox is in the "halfSelectedUp" state. Format like "#FF0000" (red).
 * This will override TextColor when equal or higher priority than TextColor.
 */
CheckboxElement._StyleTypes.HalfSelectedUpTextColor = 			StyleableBase.EStyleType.NORMAL;		//"#000000"

/**
 * @style HalfSelectedOverSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the checkbox skin when the checkbox is in the "halfSelectedOver" state. 
 * This will override SkinClass when equal or higher priority than SkinClass.
 */
CheckboxElement._StyleTypes.HalfSelectedOverSkinClass = 		StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style HalfSelectedOverSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "halfSelectedOver" state skin element.
 */
CheckboxElement._StyleTypes.HalfSelectedOverSkinStyle = 		StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

/**
 * @style HalfSelectedOverTextColor String
 * 
 * Hex color value to be used for the checkbox label when the checkbox is in the "halfSelectedOver" state. Format like "#FF0000" (red).
 * This will override TextColor when equal or higher priority than TextColor.
 */
CheckboxElement._StyleTypes.HalfSelectedOverTextColor = 		StyleableBase.EStyleType.NORMAL;		//"#000000"

/**
 * @style HalfSelectedDownSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the checkbox skin when the checkbox is in the "halfSelectedDown" state. 
 * This will override SkinClass when equal or higher priority than SkinClass.
 */
CheckboxElement._StyleTypes.HalfSelectedDownSkinClass = 		StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style HalfSelectedDownSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "halfSelectedDown" state skin element.
 */
CheckboxElement._StyleTypes.HalfSelectedDownSkinStyle = 		StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

/**
 * @style HalfSelectedDownTextColor String
 * 
 * Hex color value to be used for the checkbox label when the checkbox is in the "halfSelectedDown" state. Format like "#FF0000" (red).
 * This will override TextColor when equal or higher priority than TextColor.
 */
CheckboxElement._StyleTypes.HalfSelectedDownTextColor = 		StyleableBase.EStyleType.NORMAL;		//"#000000"

/**
 * @style HalfSelectedDisabledSkinClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the checkbox skin when the checkbox is in the "halfSelectedDisabled" state. 
 * This will override SkinClass when equal or higher priority than SkinClass.
 */
CheckboxElement._StyleTypes.HalfSelectedDisabledSkinClass = 	StyleableBase.EStyleType.NORMAL;		//Element constructor()

/**
 * @style HalfSelectedDisabledSkinStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the "halfSelectedDisabled" state skin element.
 */
CheckboxElement._StyleTypes.HalfSelectedDisabledSkinStyle = 	StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

/**
 * @style HalfSelectedDisabledTextColor String
 * 
 * Hex color value to be used for the checkbox label when the checkbox is in the "halfSelectedDisabled" state. Format like "#FF0000" (red).
 * This will override TextColor when equal or higher priority than TextColor.
 */
CheckboxElement._StyleTypes.HalfSelectedDisabledTextColor = 	StyleableBase.EStyleType.NORMAL;		//"#000000"	


////////////Default Styles//////////////////////

CheckboxElement.StyleDefault = new StyleDefinition();

CheckboxElement.StyleDefault.setStyle("AllowDeselect", 							true);

CheckboxElement.StyleDefault.setStyle("SkinClass", 								CheckboxSkinElement); //Not necessary, just for completeness

CheckboxElement.StyleDefault.setStyle("UpSkinClass", 							CheckboxSkinElement);
CheckboxElement.StyleDefault.setStyle("OverSkinClass", 							CheckboxSkinElement);
CheckboxElement.StyleDefault.setStyle("DownSkinClass", 							CheckboxSkinElement);
CheckboxElement.StyleDefault.setStyle("DisabledSkinClass", 						CheckboxSkinElement);

CheckboxElement.StyleDefault.setStyle("SelectedUpSkinClass", 					CheckboxSkinElement);
CheckboxElement.StyleDefault.setStyle("SelectedOverSkinClass", 					CheckboxSkinElement);
CheckboxElement.StyleDefault.setStyle("SelectedDownSkinClass", 					CheckboxSkinElement);
CheckboxElement.StyleDefault.setStyle("SelectedDisabledSkinClass", 				CheckboxSkinElement);

CheckboxElement.StyleDefault.setStyle("HalfSelectedUpSkinClass", 				CheckboxSkinElement);
CheckboxElement.StyleDefault.setStyle("HalfSelectedOverSkinClass", 				CheckboxSkinElement);
CheckboxElement.StyleDefault.setStyle("HalfSelectedDownSkinClass", 				CheckboxSkinElement);
CheckboxElement.StyleDefault.setStyle("HalfSelectedDisabledSkinClass", 			CheckboxSkinElement);

CheckboxElement.StyleDefault.setStyle("HalfSelectedUpTextColor", 				"#000000");
CheckboxElement.StyleDefault.setStyle("HalfSelectedOverTextColor", 				"#000000");
CheckboxElement.StyleDefault.setStyle("HalfSelectedDownTextColor", 				"#000000");
CheckboxElement.StyleDefault.setStyle("HalfSelectedDisabledTextColor", 			"#888888");


//Skin Defaults
CheckboxElement.UpSkinStyleDefault = new StyleDefinition();

CheckboxElement.UpSkinStyleDefault.setStyle("BackgroundShape",					null);
CheckboxElement.UpSkinStyleDefault.setStyle("BorderType", 						"solid");
CheckboxElement.UpSkinStyleDefault.setStyle("BorderThickness", 					1);
CheckboxElement.UpSkinStyleDefault.setStyle("BorderColor", 						"#333333");
CheckboxElement.UpSkinStyleDefault.setStyle("BackgroundColor", 					"#EBEBEB");
CheckboxElement.UpSkinStyleDefault.setStyle("AutoGradientType", 				"linear");
CheckboxElement.UpSkinStyleDefault.setStyle("AutoGradientStart", 				(+.05));
CheckboxElement.UpSkinStyleDefault.setStyle("AutoGradientStop", 				(-.05));
CheckboxElement.UpSkinStyleDefault.setStyle("CheckColor", 						"#000000");

CheckboxElement.OverSkinStyleDefault = new StyleDefinition();

CheckboxElement.OverSkinStyleDefault.setStyle("BackgroundShape",				null);
CheckboxElement.OverSkinStyleDefault.setStyle("BorderType", 					"solid");
CheckboxElement.OverSkinStyleDefault.setStyle("BorderThickness", 				1);
CheckboxElement.OverSkinStyleDefault.setStyle("BorderColor", 					"#333333");
CheckboxElement.OverSkinStyleDefault.setStyle("BackgroundColor", 				"#DDDDDD");
CheckboxElement.OverSkinStyleDefault.setStyle("AutoGradientType", 				"linear");
CheckboxElement.OverSkinStyleDefault.setStyle("AutoGradientStart", 				(+.05));
CheckboxElement.OverSkinStyleDefault.setStyle("AutoGradientStop", 				(-.05));
CheckboxElement.OverSkinStyleDefault.setStyle("CheckColor", 					"#000000");

CheckboxElement.DownSkinStyleDefault = new StyleDefinition();

CheckboxElement.DownSkinStyleDefault.setStyle("BackgroundShape",				null);
CheckboxElement.DownSkinStyleDefault.setStyle("BorderType", 					"solid");
CheckboxElement.DownSkinStyleDefault.setStyle("BorderThickness", 				1);
CheckboxElement.DownSkinStyleDefault.setStyle("BorderColor", 					"#333333");
CheckboxElement.DownSkinStyleDefault.setStyle("BackgroundColor", 				"#CCCCCC");
CheckboxElement.DownSkinStyleDefault.setStyle("AutoGradientType", 				"linear");
CheckboxElement.DownSkinStyleDefault.setStyle("AutoGradientStart", 				(-.06));
CheckboxElement.DownSkinStyleDefault.setStyle("AutoGradientStop", 				(+.02));
CheckboxElement.DownSkinStyleDefault.setStyle("CheckColor", 					"#000000");

CheckboxElement.DisabledSkinStyleDefault = new StyleDefinition();

CheckboxElement.DisabledSkinStyleDefault.setStyle("BackgroundShape",			null);
CheckboxElement.DisabledSkinStyleDefault.setStyle("BorderType", 				"solid");
CheckboxElement.DisabledSkinStyleDefault.setStyle("BorderThickness", 			1);
CheckboxElement.DisabledSkinStyleDefault.setStyle("BorderColor", 				"#999999");
CheckboxElement.DisabledSkinStyleDefault.setStyle("BackgroundColor", 			"#ECECEC");
CheckboxElement.DisabledSkinStyleDefault.setStyle("AutoGradientType", 			"linear");
CheckboxElement.DisabledSkinStyleDefault.setStyle("AutoGradientStart", 			(+.05));
CheckboxElement.DisabledSkinStyleDefault.setStyle("AutoGradientStop", 			(-.05));
CheckboxElement.DisabledSkinStyleDefault.setStyle("CheckColor", 				"#777777");


//Apply Skin Defaults
CheckboxElement.StyleDefault.setStyle("UpSkinStyle", 							CheckboxElement.UpSkinStyleDefault);
CheckboxElement.StyleDefault.setStyle("OverSkinStyle", 							CheckboxElement.OverSkinStyleDefault);
CheckboxElement.StyleDefault.setStyle("DownSkinStyle", 							CheckboxElement.DownSkinStyleDefault);
CheckboxElement.StyleDefault.setStyle("DisabledSkinStyle", 						CheckboxElement.DisabledSkinStyleDefault);

CheckboxElement.StyleDefault.setStyle("SelectedUpSkinStyle", 					CheckboxElement.UpSkinStyleDefault);
CheckboxElement.StyleDefault.setStyle("SelectedOverSkinStyle", 					CheckboxElement.OverSkinStyleDefault);
CheckboxElement.StyleDefault.setStyle("SelectedDownSkinStyle", 					CheckboxElement.DownSkinStyleDefault);
CheckboxElement.StyleDefault.setStyle("SelectedDisabledSkinStyle", 				CheckboxElement.DisabledSkinStyleDefault);

CheckboxElement.StyleDefault.setStyle("HalfSelectedUpSkinStyle", 				CheckboxElement.UpSkinStyleDefault);
CheckboxElement.StyleDefault.setStyle("HalfSelectedOverSkinStyle", 				CheckboxElement.OverSkinStyleDefault);
CheckboxElement.StyleDefault.setStyle("HalfSelectedDownSkinStyle", 				CheckboxElement.DownSkinStyleDefault);
CheckboxElement.StyleDefault.setStyle("HalfSelectedDisabledSkinStyle", 			CheckboxElement.DisabledSkinStyleDefault);

/////////////Public Functions////////////////////////////////////////

/**
 * @function setSelected
 * @override
 * Sets the selected state of the Checkbox.
 * 
 * @param isSelected boolean
 * Checkbox adds a half selected state by setting isSelected = 2.
 * 0 (or false) is unchecked, 1 (or true) is checked, and 2 is half checked.
 */	
CheckboxElement.prototype.setSelected = 
	function (isSelected)
	{
		CheckboxElement.base.prototype.setSelected.call(this, isSelected);
	};


/////////////Internal Functions/////////////////////	

//@override
CheckboxElement.prototype._updateState = 
	function ()
	{
		if (this.getStyle("Selected") == 2)
		{
			var newState = "halfSelectedUp";
			
			if (this.getStyle("Enabled") == false)
				newState = "halfSelectedDisabled";
			else
			{
				if (this._mouseIsDown == true)
					newState = "halfSelectedDown";
				else if (this._mouseIsOver == true)
					newState = "halfSelectedOver";
			}
			
			this.setStyle("SkinState", newState);
		}
		else
		{
			//Call base if we're not selected, handles non-selected states.
			CheckboxElement.base.prototype._updateState.call(this);
		}
	};

//@override
CheckboxElement.prototype._getSkinClass = 
	function (state)
	{
		var stateSkinClass = null;
		
		if (state == "halfSelectedUp")
			stateSkinClass = this.getStyleData("HalfSelectedUpSkinClass");
		else if (state == "halfSelectedOver")
			stateSkinClass = this.getStyleData("HalfSelectedOverSkinClass");
		else if (state == "halfSelectedDown")
			stateSkinClass = this.getStyleData("HalfSelectedDownSkinClass");
		else if (state == "halfSelectedDisabled")
			stateSkinClass = this.getStyleData("HalfSelectedDisabledSkinClass");
		else //base class state
			return CheckboxElement.base.prototype._getSkinClass.call(this, state);
		
		var skinClass = this.getStyleData("SkinClass");
		
		if (skinClass.comparePriority(stateSkinClass) > 0) //Use skinClass if higher priority
			return skinClass.value;
		
		return stateSkinClass.value;
	};
	
//@override	
CheckboxElement.prototype._getSubStyleNameForSkinState = 
	function (state)
	{
		if (state == "halfSelectedUp")
			return "HalfSelectedUpSkinStyle";
		if (state == "halfSelectedOver")
			return "HalfSelectedOverSkinStyle";
		if (state == "halfSelectedDown")
			return "HalfSelectedDownSkinStyle";
		if (state == "halfSelectedDisabled")
			return "HalfSelectedDisabledSkinStyle";
		
		return CheckboxElement.base.prototype._getSubStyleNameForSkinState.call(this, state);
	};	
	
//@override
CheckboxElement.prototype._getTextColor = 
	function (state)
	{
		var stateTextColor = null;
		
		if (state == "halfSelectedUp")
			stateTextColor = this.getStyleData("HalfSelectedUpTextColor");
		else if (state == "halfSelectedOver")
			stateTextColor = this.getStyleData("HalfSelectedOverTextColor");
		else if (state == "halfSelectedDown")
			stateTextColor = this.getStyleData("HalfSelectedDownTextColor");
		else if (state == "halfSelectedDisabled")
			stateTextColor = this.getStyleData("HalfSelectedDisabledTextColor");
		else //base class state
			return CheckboxElement.base.prototype._getTextColor.call(this, state);
	
		var textColor = this.getStyleData("TextColor");
		
		if (textColor.comparePriority(stateTextColor) > 0) //Use textColor if higher priority
			return textColor.value;
		
		return stateTextColor.value;
	};

//@override
CheckboxElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		CheckboxElement.base.prototype._doStylesUpdated.call(this, stylesMap);

		////Update skin classes and sub styles.
		if ("SkinClass" in stylesMap || "HalfSelectedUpSkinClass" in stylesMap)
			this._updateSkinClass("halfSelectedUp");
		if ("HalfSelectedUpSkinStyle" in stylesMap)
			this._updateSkinStyleDefinitions("halfSelectedUp");
		
		if ("SkinClass" in stylesMap || "HalfSelectedOverSkinClass" in stylesMap)
			this._updateSkinClass("halfSelectedOver");
		if ("HalfSelectedOverSkinStyle" in stylesMap)
			this._updateSkinStyleDefinitions("halfSelectedOver");
		
		if ("SkinClass" in stylesMap || "HalfSelectedDownSkinClass" in stylesMap)
			this._updateSkinClass("halfSelectedDown");
		if ("HalfSelectedDownSkinStyle" in stylesMap)
			this._updateSkinStyleDefinitions("halfSelectedDown");
		
		if ("SkinClass" in stylesMap || "HalfSelectedDisabledSkinClass" in stylesMap)
			this._updateSkinClass("halfSelectedDisabled");
		if ("HalfSelectedDisabledSkinStyle" in stylesMap)
			this._updateSkinStyleDefinitions("halfSelectedDisabled");
	};	
	
	


/**
 * @depends ContainerBaseElement.js
 */

///////////////////////////////////////////////////////////////////////////	
///////////////////////AnchorContainerElement//////////////////////////////

/**
 * @class AnchorContainerElement
 * @inherits ContainerBaseElement
 * 
 * The AnchorContainer can be used to lay out children via absolute or constraint positioning.
 * This container uses children's styles X, Y, Width, Height, PercentWidth, PercentHeight,
 * Top, Bottom, Left, Right, Horizontal Center, and Vertical Center. Nesting containers
 * is the best way to quickly and simply build complex layouts.
 * 
 * X, Y, Width, and Height are treated as highest priority and will override other styles.
 * Elements Z index is determined by the order they are added (child index).
 * You may use styles such as Top and Bottom in conjunction to relatively size elements.
 * You may also combine styles such as Left or X and PercentWidth. Most styles are combine-able unless
 * they are in direct conflict with each other such as having a Left, Right, and Width which under
 * this scenario the Right style will be ignored. Exact behavior of conflicting styles is not defined 
 * and subject to change. 
 * 
 * See the associated style documentation for additional details.
 * 
 * @constructor AnchorContainerElement 
 * Creates new AnchorContainerElement instance.
 */
function AnchorContainerElement()
{
	AnchorContainerElement.base.prototype.constructor.call(this);
}

//Inherit from ContainerBaseElement
AnchorContainerElement.prototype = Object.create(ContainerBaseElement.prototype);
AnchorContainerElement.prototype.constructor = AnchorContainerElement;
AnchorContainerElement.base = ContainerBaseElement;	
	
//@Override
AnchorContainerElement.prototype._doMeasure = 
	function (padWidth, padHeight)
	{
		var contentSize = {width:0, height:0}; 
		
		var child = null; //for convienence
		
		var x;
		var y;
		var width;
		var height;

		var top;
		var left;
		var bottom;
		var right;
		var hCenter;
		var vCenter;
		var rotateDegrees;
		var rotateCenterX;
		var rotateCenterY;
		var rotatedMetrics;
		
		var tempX;
		var tempY;
		var tempWidth;
		var tempHeight;
		var tempRotateDegrees;
		var tempRotateCenterX;
		var tempRotateCenterY;
		
		for (var i = 0; i < this._elements.length; i++)
		{
			child = this._elements[i];
			if (child.getStyle("IncludeInLayout") == false)
				continue;
			
			var childSize = {width: 0, height:0};
			
			width = child._getStyledOrMeasuredWidth();
			height = child._getStyledOrMeasuredHeight();
			
			x = child.getStyle("X");
			y = child.getStyle("Y");
			top = child.getStyle("Top");
			left = child.getStyle("Left");
			bottom = child.getStyle("Bottom");
			right = child.getStyle("Right");
			
			//prioritize x/y over left/top (but they're the same)
			if (x == null)
				x = left;
			if (y == null)
				y = top;
			
			hCenter = child.getStyle("HorizontalCenter");
			vCenter = child.getStyle("VerticalCenter");
			
			rotateDegrees = child.getStyle("RotateDegrees");
			rotateCenterX = child.getStyle("RotateCenterX");
			rotateCenterY = child.getStyle("RotateCenterY");
			
			if (rotateDegrees != 0)
			{
				//Record child's current x/y & w/h & rotation
				tempX = child._x;
				tempY = child._y;
				tempWidth = child._width;
				tempHeight = child._height;
				tempRotateDegrees = child._rotateDegrees;
				tempRotateCenterX = child._rotateCenterX;
				tempRotateCenterY = child._rotateCenterY;
				
				//TODO: Update getMetrics() so we can pass child values.
				//Spoof the rotation position/size so we can get parent metrics.
				child._x = x == null ? 0 : x;
				child._y = y == null ? 0 : y;
				child._width = width;
				child._height = height;
				child._rotateDegrees = rotateDegrees;
				child._rotateCenterX = rotateCenterX == null ? 0 : rotateCenterX;
				child._rotateCenterY = rotateCenterY == null ? 0 : rotateCenterY;
				
				//Get parent metrics for spoof position
				rotatedMetrics = child.getMetrics(this);
				
				//Put back current values
				child._x = tempX;
				child._y = tempY;
				child._width = tempWidth;
				child._height = tempHeight;
				child._rotateDegrees = tempRotateDegrees;
				child._rotateCenterX = tempRotateCenterX;
				child._rotateCenterY = tempRotateCenterY;
				
				if (rotateCenterX != null && rotateCenterY != null)
				{
					x = Math.max(rotatedMetrics.getX(), 0);
					y = Math.max(rotatedMetrics.getY(), 0);
				}
				
				childSize.width += Math.ceil(rotatedMetrics.getWidth());
				childSize.height += Math.ceil(rotatedMetrics.getHeight());
			}
			else //Non-Rotated Element
			{
				childSize.width += width;
				childSize.height += height;
			}
			
			if (right != null)
				childSize.width += right;
			if (bottom != null)
				childSize.height += bottom;
			
			if (x == null && right == null && hCenter != null)
				childSize.width += Math.abs(hCenter * 2);
			if (y == null && bottom == null && vCenter != null)
				childSize.height += Math.abs(vCenter * 2);
			
			if (x == null || x < 0)
				x = 0;
			if (y == null || y < 0)
				y = 0;
			
			childSize.width += x;
			childSize.height += y;
			
			contentSize.width = Math.max(contentSize.width, Math.ceil(childSize.width));
			contentSize.height = Math.max(contentSize.height, Math.ceil(childSize.height));
		}
		
		return contentSize;
	};
	
//@Override
AnchorContainerElement.prototype._doLayout =
	function(paddingMetrics)
	{
		AnchorContainerElement.base.prototype._doLayout.call(this, paddingMetrics);
	
		var child = null;
		
		var x = null;
		var y = null;
		var width = null;
		var height = null;
		var pWidth = null;
		var pHeight = null;
		var minWidth = null;
		var maxWidth = null;
		var minHeight = null;
		var maxHeight = null;		
		var top = null;
		var left = null;
		var bottom = null;
		var right = null;
		var hCenter = null;
		var vCenter = null;
		var rotateDegrees = null;
		var rotateCenterX = null;
		var rotateCenterY = null;
		var rotatedMetrics = null;
		
		for (var i = 0; i < this._elements.length; i++)
		{
			child = this._elements[i];
			if (child.getStyle("IncludeInLayout") == false)
				continue;
			
			x = child.getStyle("X");
			y = child.getStyle("Y");
			top = child.getStyle("Top");
			left = child.getStyle("Left");
			bottom = child.getStyle("Bottom");
			right = child.getStyle("Right");
			width = child.getStyle("Width");
			height = child.getStyle("Height");
			minWidth = child.getStyle("MinWidth");
			minHeight = child.getStyle("MinHeight");
			maxWidth = child.getStyle("MaxWidth");
			maxHeight = child.getStyle("MaxHeight");
			hCenter = child.getStyle("HorizontalCenter");
			vCenter = child.getStyle("VerticalCenter");
			rotateDegrees = child.getStyle("RotateDegrees");
			rotateCenterX = child.getStyle("RotateCenterX");
			rotateCenterY = child.getStyle("RotateCenterY");
			
			if (minWidth == null)
				minWidth = 0;
			if (minHeight == null)
				minHeight = 0;
			if (maxWidth == null)
				maxWidth = Number.MAX_VALUE;
			if (maxHeight == null)
				maxHeight = Number.MAX_VALUE;
			
			child._setActualRotation(rotateDegrees, rotateCenterX, rotateCenterY);
			
			if (rotateDegrees != 0)
			{
				if (width == null)
				{
					width = child._measuredWidth;
					width = Math.min(width, maxWidth);
					width = Math.max(width, minWidth);
				}
				
				if (height == null)
				{
					height = child._measuredHeight;
					height = Math.min(height, maxHeight);
					height = Math.max(height, minHeight);
				}
				
				child._setActualSize(width, height);
				
				if (rotateCenterX == null || rotateCenterY == null)
				{
					//prioritize x/y over left/top (but they're the same)
					if (x == null)
						x = left;
					if (y == null)
						y = top;
					
					if (x == null || y == null)
					{
						rotatedMetrics = child.getMetrics(this);
						
						width = Math.ceil(rotatedMetrics.getWidth());
						height = Math.ceil(rotatedMetrics.getHeight());
						
						if (x == null && right != null)
							x = this._width - width - right;
						
						if (y == null && bottom != null)
							y = this._height - height - bottom;
						
						if (x == null && hCenter != null)
							x = Math.round((this._width / 2) - (width / 2) + hCenter);
						
						if (y == null && vCenter != null)
							y = Math.round((this._height / 2) - (height / 2) + vCenter);
					}
					
					if (x == null)
						x = 0;
					if (y == null)
						y = 0;
					
					child._setRelativePosition(x, y, this);
				}
				else
				{
					if (x == null)
						x = 0;
					if (y == null)
						y = 0;
					
					child._setActualPosition(x, y);
				}
			}
			else //Non-Rotated Element
			{
				pWidth = child.getStyle("PercentWidth");
				pHeight = child.getStyle("PercentHeight");
			
				//prioritize x/y over left/top (but they're the same)
				if (x == null)
					x = left;
				if (y == null)
					y = top;
				
				if (width == null)
				{
					if (x != null && right != null)
						width = this._width - x - right;
					else
					{
						if (pWidth != null)
							width = Math.round(this._width * (pWidth / 100));
						else
							width = child._measuredWidth;
					}
					
					width = Math.min(width, maxWidth);
					width = Math.max(width, minWidth);
				}
				
				if (height == null)
				{
					if (y != null && bottom != null)
						height = this._height - y - bottom;
					else
					{
						if (pHeight != null)
							height = Math.round(this._height * (pHeight / 100));
						else
							height = child._measuredHeight;
					}
					
					height = Math.min(height, maxHeight);
					height = Math.max(height, minHeight);
				}
				
				if (x == null && right != null)
					x = this._width - width - right;
				
				if (y == null && bottom != null)
					y = this._height - height - bottom;
				
				if (x == null && hCenter != null)
					x = Math.round((this._width / 2) - (width / 2) + hCenter);
				
				if (y == null && vCenter != null)
					y = Math.round((this._height / 2) - (height / 2) + vCenter);
				
				if (x == null)
					x = 0;
				if (y == null)
					y = 0;
				
				child._setActualPosition(x, y);
				child._setActualSize(width, height);
			}
		}
	};	
	
	


/**
 * @depends AnchorContainerElement.js
 */

//////////////////////////////////////////////////////////////
////////////////////CanvasManager/////////////////////////////

/**
 * @class CanvasManager
 * @inherits AnchorContainerElement
 * 
 * CanvasManager is the root of the display hierarchy, manages a single canvas, and is essentially
 * the brain of the system, its responsible things such as driving the component life cycle, 
 * managing CanvasElements, requesting render frames from the browser, etc.  
 * For elements to be rendered to the canvas, they must be added to CanvasManager, or be a descendant of
 * an element that has been added to CanvasManager. 
 * 
 * CanvasManager itself is a subclass of an AnchorContainer and can be used as such, although typically
 * for more complex layouts you will nest containers inside of CanvasManager.
 * 
 * @constructor CanvasManager 
 * Creates new CanvasManager instance.
 */

function CanvasManager()
{
	//Life cycle phases
	this._updateStylesQueue = new CmDepthQueue();
	this._updateMeasureQueue = new CmDepthQueue();
	this._updateLayoutQueue = new CmDepthQueue();
	this._updateRenderQueue = new CmDepthQueue();

	this._compositeRenderQueue = new CmDepthQueue();
	
	//Used to store the add/remove events we need to dispatch after elements are added/removed from the display chain.
	//Adding and removing elements is a recursive process which must finish prior to dispatching any events.
	this._addRemoveDisplayChainQueue = new CmLinkedList();
	this._addRemoveDisplayChainQueueProcessing = false; //Recursion guard
	
	this._broadcastDispatcher = new EventDispatcher(); //Dispatches broadcast events.
	
	this._browserCursor = null;
	this._cursorChain = new CmLinkedList();	//Priority Chain (cursor)
	
	this._tabStopReverse = false;
	this._focusElement = null;				//Target with focus
	
	this._canvas = null;
	this._canvasContext = null;
	this._canvasRenderFramePending = false;
	
	this._mouseX = -1;
	this._mouseY = -1;
	
	this._rollOverInvalid = true;
	this._rollOverElement = null;	//Last roll over target.
	this._rollOverX = -1;			//Position within target (used for mousemove)
	this._rollOverY = -1;
	
	this._mouseDownElement = null; 	//Target to dispatch mouseup
	
	this._draggingElement = null;	//Target currently being dragged.
	this._draggingOffsetX = null;
	this._draggingOffsetY = null;	
	
	this._currentLocale = "en-us";
	
	this._redrawRegionInvalid = true;
	this._redrawRegionPrevMetrics = null;
	
	//Now call base
	CanvasManager.base.prototype.constructor.call(this);

	this._cursorContainer = new CanvasElement();
	this._cursorContainer.setStyle("MouseEnabled", false);
	this._addOverlayChild(this._cursorContainer);	
	
	var _self = this;
	
	//Private handlers, need instance for every CanvasManager
	this._onCursorDefinitionStyleChangedInstance = 
		function (styleChangedEvent)
		{
			_self._onCursorDefinitionStyleChanged(styleChangedEvent);
		};
		
	this._onCanvasFrame = 
		function ()
		{
			//Prevent double render frames if someone changes our associated canvas.
			if (_self._canvasContext == null)
			{
				_self._canvasRenderFramePending = false;
				return;
			}
			
			_self.updateNow();
			
			window.requestAnimationFrame(_self._onCanvasFrame);	
		};
	
	this._canvasResizeEventHandler = 
		function ()
		{
			//Fix canvas manager size.
			_self.setStyle("Width", _self._canvas.clientWidth);
			_self.setStyle("Height", _self._canvas.clientHeight);
			_self._setActualSize(_self._canvas.clientWidth, _self._canvas.clientHeight);
			
			_self._redrawRegionPrevMetrics = null;
			_self._updateRedrawRegion(_self.getMetrics(null));
			
			_self.updateNow();
		};
	
	this._canvasFocusEventHandler = 
		function (browserEvent)
		{
			//Tab focus only (if focused via mouse we'll get the mouse event first)
			if (_self._focusElement == null && browserEvent.type == "focus")
			{
				if (_self._tabStopReverse == true)
					_self._updateFocusElement(_self._findChildTabStopReverse(_self, null, null), true);
				else
					_self._updateFocusElement(_self._findChildTabStopForward(_self, null), true);
			}
			else if (_self._focusElement != null && browserEvent.type == "blur")
				_self._updateFocusElement(null, true);
		};		
		
	this._canvasKeyboardEventHandler = 
		function (browserEvent)
		{
			if (browserEvent.type == "keydown")
			{
				if (browserEvent.key == "Tab" && browserEvent.shiftKey == true)
					_self._tabStopReverse = true;
				else if (browserEvent.key == "Tab" && browserEvent.shiftKey == false)
					_self._tabStopReverse = false;
			}
		
			if (_self._focusElement != null)
			{
				var keyboardEvent = new ElementKeyboardEvent(browserEvent.type, 
											browserEvent.key, browserEvent.which, 
											browserEvent.ctrlKey, browserEvent.altKey, 
											browserEvent.shiftKey, browserEvent.metaKey);
				
				_self._focusElement._dispatchEvent(keyboardEvent);
				
				if (keyboardEvent._canceled == true || keyboardEvent._defaultPrevented == true)
					browserEvent.preventDefault();
				else if (browserEvent.type == "keydown" && keyboardEvent.getKey() == "Tab")
				{
					var tabStopElement = null;
					var currentParent = _self._focusElement;
					var lastParent = null;
					
					if (_self._tabStopReverse == false)
					{
						while (currentParent != null)
						{
							tabStopElement = _self._findChildTabStopForward(currentParent, lastParent);
							
							if (tabStopElement != null)
								break;
							
							lastParent = currentParent;
							currentParent = currentParent._parent;
						}
					}
					else //Tab backwards
					{
						while (currentParent != null)
						{
							tabStopElement = _self._findChildTabStopReverse(currentParent, lastParent, null);
							
							if (tabStopElement != null)
								break;
							
							lastParent = currentParent;
							currentParent = currentParent._parent;
						}
					}
					
					_self._updateFocusElement(tabStopElement, true);
					if (tabStopElement != null)
						browserEvent.preventDefault();
				}
			}
		};
	
	this._canvasMouseEventHandler = 
		function(browserEvent)
		{
			//Translate mouse to local position
			var mousePoint = CanvasManager.getLocalMousePos(browserEvent, _self._canvas);
			
			var i = 0;

			if (browserEvent.type == "mouseup")
			{
				window.removeEventListener('mouseup', _self._canvasMouseEventHandler);

				_self._clearDraggingElement();
				_self._mouseDownElement._mouseIsDown = false;

				//Start at mousedown target, record parents up to canvas manager, fix state.
				var parentChain = [];
				parentChain.push(_self._mouseDownElement);
				
				while (parentChain[parentChain.length - 1]._parent != null)
				{
					parentChain[parentChain.length - 1]._parent._mouseIsDown = false;
					parentChain.push(parentChain[parentChain.length - 1]._parent);
				}

				var clickElement = null;
				var clickPoint = {x:0, y:0};
				
				//Adjust mouse point for target element to dispatch mouseup
				for (i = parentChain.length - 1; i >= 0; i--) //Start at CanvasManager child, work down to target.
				{
					//Rotate the point backwards so we can translate the point to the element's rotated plane.
					parentChain[i].rotatePoint(mousePoint, true);
					
					//Adjust the mouse point to within this element rather than its position in parent.
					mousePoint.x = mousePoint.x - parentChain[i]._x;
					mousePoint.y = mousePoint.y - parentChain[i]._y;
					
					//Dispatch click if we're still over the target element.
					if (mousePoint.x >= 0 && 
						mousePoint.x <= parentChain[i]._width &&
						mousePoint.y >= 0 &&
						mousePoint.y <= parentChain[i]._height)
					{
						clickElement = parentChain[i];
						
						clickPoint.x = mousePoint.x;
						clickPoint.y = mousePoint.y;
					}
				}
				
				_self._mouseDownElement = null;

				//Dispatch mouseup
				parentChain[0]._dispatchEvent(new ElementMouseEvent("mouseup", mousePoint.x, mousePoint.y));
				
				//Dispatch click if we're still over the target element.
				if (clickElement != null)
					clickElement._dispatchEvent(new ElementMouseEvent("click", clickPoint.x, clickPoint.y));
			}
			else if (browserEvent.type == "wheel")
			{
				//Mouse is disabled on CanvasManager
				if (_self.getStyle("MouseEnabled") == false || _self.getStyle("Visible") == false)
					return;
				
				var currentElement = null;
				
				if (mousePoint.x >= 0 && mousePoint.x <= _self._width &&
					mousePoint.y >= 0 && mousePoint.y <= _self._height)
				{
					currentElement = _self;
					
					var foundChild = false;
					while (true)
					{
						foundChild = false;
						for (i = currentElement._children.length -1; i >= 0; i--)
						{
							//Skip element if mouse is disabled or visibility is off.
							if (currentElement._children[i].getStyle("MouseEnabled") == false || 
								currentElement._children[i].getStyle("Visible") == false)
								continue;
							
							//Rotate the point backwards so we can translate the point to the element's rotated plane.
							currentElement._children[i].rotatePoint(mousePoint, true);
							
							if (mousePoint.x >= currentElement._children[i]._x && 
								mousePoint.x <= currentElement._children[i]._x + currentElement._children[i]._width &&
								mousePoint.y >= currentElement._children[i]._y &&
								mousePoint.y <= currentElement._children[i]._y + currentElement._children[i]._height)
							{
								currentElement = currentElement._children[i];
								
								//Adjust the mouse point to within this element rather than its position in parent.
								mousePoint.x = mousePoint.x - currentElement._x;
								mousePoint.y = mousePoint.y - currentElement._y;
								
								foundChild = true;
								break;
							}
							
							//Rotate forwards, we're not over this child, undo the rotation.
							currentElement._children[i].rotatePoint(mousePoint, false);
						}
						
						if (foundChild == false)
							break;
					}
				}
				
				if (currentElement != null)
				{
					var deltaX = 0;
					if (browserEvent.deltaX > 0)
						deltaX = 1;
					else if (browserEvent.deltaX < 0)
						deltaX = -1;
					
					var deltaY = 0;
					if (browserEvent.deltaY > 0)
						deltaY = 1;
					else if (browserEvent.deltaY < 0)
						deltaY = -1;
					
					var mouseWheelEvent = new ElementMouseWheelEvent(mousePoint.x, mousePoint.y, deltaX, deltaY);
					currentElement._dispatchEvent(mouseWheelEvent);
					
					if (mouseWheelEvent._canceled == true || mouseWheelEvent._defaultPrevented == true)
						browserEvent.preventDefault();
				}
			}
			else if (browserEvent.type == "mousedown")
			{
				//Kill focus if we're not over the canvas				
				if (mousePoint.x < 0 || mousePoint.x > this._width || 
					mousePoint.y < 0 || mousePoint.y > this._height)
				{
					_self._updateFocusElement(null, false);
					return;
				}
					
				//Mouse is disabled on CanvasManager
				if (_self.getStyle("MouseEnabled") == false || _self.getStyle("Visible") == false || _self._mouseDownElement != null)
					return;
				
				var draggingElement = null;
				var draggingOffset = {x:0, y:0};
				
				var focusElement = null;
				var focusElementTabStop = -1;
				var currentElementTabStop = -1;
				
				var currentElement = _self; 
				var foundChild = false;
				while (true)
				{
					currentElement._mouseIsDown = true;
					
					//Only allow dragging if we're not in a container, or an AnchorContainer
					if (currentElement.getStyle("Draggable") == true && 
						(currentElement._parent instanceof AnchorContainerElement || !(currentElement._parent instanceof ContainerBaseElement)))
					{
						draggingElement = currentElement;
						draggingOffset = {x:mousePoint.x, y:mousePoint.y};
					}
				
					currentElementTabStop = currentElement.getStyle("TabStop");
					if (currentElementTabStop >= 0 || focusElementTabStop < 0)
					{
						focusElement = currentElement;
						focusElementTabStop = currentElementTabStop;
					}
					
					foundChild = false;
					for (i = currentElement._children.length -1; i >= 0; i--)
					{
						//Skip element if mouse is disabled or visibility is off.
						if (currentElement._children[i].getStyle("MouseEnabled") == false || 
							currentElement._children[i].getStyle("Visible") == false)
							continue;
						
						//Rotate the point backwards so we can translate the point to the element's rotated plane.
						currentElement._children[i].rotatePoint(mousePoint, true);
						
						if (mousePoint.x >= currentElement._children[i]._x && 
							mousePoint.x <= currentElement._children[i]._x + currentElement._children[i]._width &&
							mousePoint.y >= currentElement._children[i]._y &&
							mousePoint.y <= currentElement._children[i]._y + currentElement._children[i]._height)
						{
							currentElement = currentElement._children[i];
							
							//Adjust the mouse point to within this element rather than its position in parent.
							mousePoint.x = mousePoint.x - currentElement._x;
							mousePoint.y = mousePoint.y - currentElement._y;
							
							foundChild = true;
							break;
						}
						
						//Rotate forwards, we're not over this child, undo the rotation.
						currentElement._children[i].rotatePoint(mousePoint, false);
					}
					
					if (foundChild == false)
						break;
				}

				_self._mouseDownElement = currentElement;
				window.addEventListener('mouseup', _self._canvasMouseEventHandler, false);
					
				if (draggingElement != null)
					_self._setDraggingElement(draggingElement, draggingOffset.x, draggingOffset.y);
				
				currentElement._dispatchEvent(new ElementMouseEvent(browserEvent.type, mousePoint.x, mousePoint.y));
				
				_self._updateFocusElement(focusElement, false);
				
				//Always shut off focus ring (even if focus doesnt change)
				if (_self._focusElement != null)
					_self._focusElement._setRenderFocusRing(false);
			}
			else if (browserEvent.type == "mousemove")
			{
				//Mouse is disabled on CanvasManager
				if (_self.getStyle("MouseEnabled") == false)
					return;
				
				_self._mouseX = mousePoint.x;
				_self._mouseY = mousePoint.y;
				_self._rollOverInvalid = true;
				
				_self._updateCursor();
				
				//Adjust dragging element.
				if (_self._draggingElement != null)
				{
					//We use metrics relative to the parent of the element being dragged. We
					//want to keep the element within parent bounds even if its transformed (rotated).
					
					//Get drag element's metrics relative to its parent.
					var metrics = _self._draggingElement.getMetrics(_self._draggingElement._parent);
					
					//Get the drag offset relative to parent.
					var offset = {x: _self._draggingOffsetX, y: _self._draggingOffsetY};
					_self._draggingElement.translatePointTo(offset, _self._draggingElement._parent);
					
					//Get the mouse position relative to parent.
					var newPosition = {	x: mousePoint.x, y: mousePoint.y };
					_self.translatePointTo(newPosition, _self._draggingElement._parent);
					
					//Adjust mouse position for drag start offset.
					newPosition.x += metrics.getX() - offset.x;
					newPosition.y += metrics.getY() - offset.y;
					
					//Correct if we're out of bounds.
					if (newPosition.x < 0)
						newPosition.x = 0;
					if (newPosition.x > _self._draggingElement._parent._width - metrics.getWidth())
						newPosition.x = _self._draggingElement._parent._width - metrics.getWidth();
					if (newPosition.y < 0)
						newPosition.y = 0;
					if (newPosition.y > _self._draggingElement._parent._height - metrics.getHeight())
						newPosition.y = _self._draggingElement._parent._height - metrics.getHeight();
					
					//Set position relative to parent.
					_self._draggingElement._setRelativePosition(
							newPosition.x, 
							newPosition.y, 
							 _self._draggingElement._parent);
					
					//TODO: Can probably be smarter about this... Check style states
					if (_self._draggingElement._parent instanceof AnchorContainerElement)
					{
						if (_self._draggingElement.getStyle("RotateCenterX") == null || _self._draggingElement.getStyle("RotateCenterY") == null)
						{
							if (_self._draggingElement.getStyle("X") != null)
								_self._draggingElement.setStyle("X", newPosition.x);
							if (_self._draggingElement.getStyle("Y") != null)
								_self._draggingElement.setStyle("Y", newPosition.y);
						}
						else
						{
							if (_self._draggingElement.getStyle("X") != null)
								_self._draggingElement.setStyle("X", _self._draggingElement._x);
							if (_self._draggingElement.getStyle("Y") != null)
								_self._draggingElement.setStyle("Y", _self._draggingElement._y);
							
							_self._draggingElement.setStyle("RotateCenterX", _self._draggingElement._rotateCenterX);
							_self._draggingElement.setStyle("RotateCenterY", _self._draggingElement._rotateCenterY);
						}
					}
					
					//Dispatch dragging.
					_self._draggingElement._dispatchEvent(new ElementEvent("dragging", false));
				}
			}
		};
}

//Inherit from AnchorContainerElement
CanvasManager.prototype = Object.create(AnchorContainerElement.prototype);
CanvasManager.prototype.constructor = CanvasManager;
CanvasManager.base = AnchorContainerElement;	


/////////////Style Types///////////////////////////////

CanvasManager._StyleTypes = Object.create(null);

/**
 * @style ShowRedrawRegion boolean
 * 
 * When true the canvas redraw region will be displayed.
 */
CanvasManager._StyleTypes.ShowRedrawRegion = 								StyleableBase.EStyleType.NORMAL;		


/////////////Default Styles///////////////////////////////

CanvasManager.StyleDefault = new StyleDefinition();

CanvasManager.StyleDefault.setStyle("ShowRedrawRegion", 					false);		// true || false



///////////////////CanvasManager Public Functions//////////////////////

/**
 * @function setCanvas
 * Sets the canvas that CanvasManager should manage.
 * 
 * @param canvas Canvas
 * Reference to the DOM canvas that CanvasManager should manage.
 */
CanvasManager.prototype.setCanvas = 
	function (canvas)
	{
		if (this._canvas == canvas)
			return;
	
		var addedOrRemoved = (this._canvas == null || canvas == null);
		
		//Clean up old canvas
		if (this._canvas != null)
		{
			window.removeEventListener('mousedown', this._canvasMouseEventHandler, false);
			window.removeEventListener('mousemove', this._canvasMouseEventHandler, false);
			window.removeEventListener("wheel", this._canvasMouseEventHandler, false);
			window.removeEventListener("keydown", this._canvasKeyboardEventHandler, false);
			window.removeEventListener("keyup", this._canvasKeyboardEventHandler, false);
			window.removeEventListener("resize", this._canvasResizeEventHandler, false);
			
			this._canvas.removeEventListener("focus", this._canvasFocusEventHandler, true);
			this._canvas.removeEventListener("blur", this._canvasFocusEventHandler, true);
			
			this._canvas = null;
			this._canvasContext = null;
		}

		if (canvas != null)
		{
			this._canvas = canvas;
			this._canvasContext = canvas.getContext("2d");
			
			window.addEventListener("mousedown", this._canvasMouseEventHandler, false);
			window.addEventListener("mousemove", this._canvasMouseEventHandler, false);
			window.addEventListener("wheel", this._canvasMouseEventHandler, false);
			window.addEventListener("keydown", this._canvasKeyboardEventHandler, false);
			window.addEventListener("keyup", this._canvasKeyboardEventHandler, false);
			window.addEventListener("resize", this._canvasResizeEventHandler, false);
			
			this._canvas.addEventListener("focus", this._canvasFocusEventHandler, true);
			this._canvas.addEventListener("blur", this._canvasFocusEventHandler, true);
					
			this._canvas.tabIndex = 1;
			this._canvas.style.outline = "none";
			this._canvas.style.cursor = "default";
			
			//Disable text selection cursor.
//			canvas.onselectstart = function () { return false; }; 
//			canvas.style.userSelect = "none";
//			canvas.style.webkitUserSelect = "none";
//			canvas.style.MozUserSelect = "none";
//			canvas.style.mozUserSelect = "none";
//			canvas.setAttribute("unselectable", "on"); // For IE and Opera

			if (navigator.userAgent.indexOf("Firefox") > 0)
				CanvasElement._browserType = "Firefox";
			
			//Prevent double render frames if someone changes our associated canvas.
			if (this._canvasRenderFramePending == false)
			{
				this._canvasRenderFramePending = true;
				window.requestAnimationFrame(this._onCanvasFrame);	
			}
		}
		
		if (addedOrRemoved == true)
		{
			this._propagateChildData();
			this._processAddRemoveDisplayChainQueue();
		}
		
		if (this._canvas != null)
		{
			this._rollOverInvalid = true;
			this._canvasResizeEventHandler();
		}
	};

/**
 * @function getCanvas
 * Gets the DOM canvas reference CanvasManager is currently managing.
 * 
 * @returns Canvas
 * The DOM canvas reference CanvasManager is currently managing.
 */	
CanvasManager.prototype.getCanvas = 
	function ()
	{
		return this._canvas;
	};

/**
 * @function setLocale
 * Sets the locale to be used when using localized strings. The actual
 * locale value is arbitrary, this simply dispatches an event to notify elements
 * that the locale has changed. Its up to implementors to store their locale strings
 * and update/lookup accordingly. CanvasManager defaults locale to "en-us". 
 * 
 * @param locale String
 * The locale to change too.
 */	
CanvasManager.prototype.setLocale = 
	function (locale)
	{
		if (this._currentLocale == locale)
			return;
		
		this._currentLocale = locale;
		
		if (this._broadcastDispatcher.hasEventListener("localechanged", null) == true)
			this._broadcastDispatcher._dispatchEvent(new DispatcherEvent("localechanged"));
	};
	
/**
 * @function getLocale
 * Gets CanvasManager's current locale.
 * 
 * @returns String
 * String representing CanvasManager's current locale.
 */	
CanvasManager.prototype.getLocale = 
	function ()
	{
		return this._currentLocale;
	};
	
/**
 * @function addCursor
 * Adds a cursor to be used when the mouse is over the canvas. Cursors are managed
 * as a priority chain. Element roll-over cursors use priority 0 so setting any explicit
 * cursor such as a busy cursor should use a priority higher than 0, unless you want Elements
 * to override the canvas cursor on roll-over.
 * 
 * @param cursorDefinition CursorDefinition
 * The cursor to add. This may be a custom CursorDefinition and CanvasManager will hide
 * the native browser cursor and render the custom cursor. It also may be a standard
 * browser CSS cursor String such as "text".
 * 
 * @param priority int
 * The priority to assign to the cursor. Higher priorities override lower priorities.
 * 
 * @returns Object
 * A "cursor instance" object that is to be used to remove the cursor.
 */	
CanvasManager.prototype.addCursor = 
	function (cursorDefinition, priority)
	{
		if (priority == null)
			priority = 0;
	
		if (cursorDefinition instanceof CursorDefinition)
		{
			if (cursorDefinition._addedCount == 0)
				cursorDefinition.addEventListener("stylechanged", this._onCursorDefinitionStyleChangedInstance);
				
			cursorDefinition._addedCount++;
		}
		
		var cursorInstance = new CmLinkedNode();
		cursorInstance.data = cursorDefinition;
		cursorInstance.priority = priority;
		
		var lastCursor = this._cursorChain.back;
		if (lastCursor == null)
			this._cursorChain.pushBack(cursorInstance);
		else
		{
			while (lastCursor != null && lastCursor.priority > cursorInstance.priority)
				lastCursor = lastCursor.prev;
			
			if (lastCursor == null)
				this._cursorChain.pushFront(cursorInstance);
			else
				this._cursorChain.insertAfter(cursorInstance, lastCursor);
		}
		
		this._updateCursor();
		
		return cursorInstance;
	};

/**
 * @function removeCursor
 * Removes a cursor via the cursor instance object returned by addCursor().
 * 
 * @param cursorInstance Object
 * The cursor instance Object returned by addCursor().
 */	
CanvasManager.prototype.removeCursor = 
	function (cursorInstance)
	{
		if (cursorDefinition instanceof CursorDefinition)
		{
			var cursorDefinition = cursorInstance.data;
			cursorDefinition._addedCount--;
				
			if (cursorDefinition._addedCount == 0)
				cursorDefinition.removeEventListener("stylechanged", this._onCursorDefinitionStyleChangedInstance);
		}

		this._cursorChain.removeNode(cursorInstance);
		this._updateCursor();
		
		return true;
	};	
	
/**
 * @function updateNow
 * This is an internal function and should conceivably *never* be called.
 * This forces a full pass of the component life cycle and is incredibly expensive.
 * The system calls this once per render frame with the only known exception being immediately after a canvas resize.
 * If you think you need to call this, you probably have a design problem.
 * Documentation added for unforeseen circumstances. 
 */	
CanvasManager.prototype.updateNow = 
	function ()
	{
		if (this._broadcastDispatcher.hasEventListener("enterframe", null) == true)
			this._broadcastDispatcher._dispatchEvent(new DispatcherEvent("enterframe"));
	
		//Process state updates.
		while (this._updateStylesQueue.length > 0 || 
				this._updateMeasureQueue.length > 0 || 
				this._updateLayoutQueue.length > 0 || 
				this._rollOverInvalid == true ||
				this._updateRenderQueue.length > 0)
		{
			//Process styles queue.
			while (this._updateStylesQueue.length > 0)
				this._updateStylesQueue.removeSmallest().data._validateStyles();
			
			//Process measure queue.
			while (this._updateMeasureQueue.length > 0 && 
					this._updateStylesQueue.length == 0)
			{
				this._updateMeasureQueue.removeLargest().data._validateMeasure();
			}
			
			//Process layout queue.
			while (this._updateLayoutQueue.length > 0 && 
					this._updateMeasureQueue.length == 0 && 
					this._updateStylesQueue.length == 0)
			{
				this._updateLayoutQueue.removeSmallest().data._validateLayout();
			}
			
			//Do rollover/rollout/mousemove
			if (this._rollOverInvalid == true && 
				this._updateLayoutQueue.length == 0 && 
				this._updateMeasureQueue.length == 0 && 
				this._updateStylesQueue.length == 0)
			{
				this._rollOverInvalid = false;
				
				var i;
				var currentElement = null;
				var mousePoint = {x: this._mouseX, y:this._mouseY};
				
				var lastRollOverTarget = this._rollOverElement;
				var lastRollOverX = this._rollOverX;
				var lastRollOverY = this._rollOverY;
				
				this._rollOverElement = null;
				
				var rollOverCommonParent = null;
				var rollOverElements = [];
				
				//Make sure we're over the canvas.				
				if (mousePoint.x >= 0 && mousePoint.x <= this._width &&
					mousePoint.y >= 0 && mousePoint.y <= this._height)
				{
					currentElement = this;
					if (currentElement._mouseIsOver == false)
					{
						rollOverElements.push(currentElement);
						currentElement._mouseIsOver = true;
					}
					else
						rollOverCommonParent = currentElement;
					
					this._rollOverElement = currentElement; 
					this._rollOverX = mousePoint.x;
					this._rollOverY = mousePoint.y;
					
					var foundChild = false;
					while (true)
					{
						foundChild = false;
						for (i = currentElement._children.length -1; i >= 0; i--)
						{
							//Skip element if mouse is disabled or not visible.
							if (currentElement._children[i].getStyle("MouseEnabled") == false ||
								currentElement._children[i].getStyle("Visible") == false)
								continue;
							
							//Rotate the point backwards so we can translate the point to the element's rotated plane.
							currentElement._children[i].rotatePoint(mousePoint, true);
							
							if (mousePoint.x >= currentElement._children[i]._x && 
								mousePoint.x <= currentElement._children[i]._x + currentElement._children[i]._width &&
								mousePoint.y >= currentElement._children[i]._y &&
								mousePoint.y <= currentElement._children[i]._y + currentElement._children[i]._height)
							{
								currentElement = currentElement._children[i];
								if (currentElement._mouseIsOver == false)
								{
									rollOverElements.push(currentElement);
									currentElement._mouseIsOver = true;
								}								
								else
									rollOverCommonParent = currentElement;
								
								//Adjust the mouse point to within this element rather than its position in parent.
								mousePoint.x = mousePoint.x - currentElement._x;
								mousePoint.y = mousePoint.y - currentElement._y;
								
								this._rollOverElement = currentElement;
								this._rollOverX = mousePoint.x;
								this._rollOverY = mousePoint.y;
								
								foundChild = true;
								break;
							}
							
							//Rotate forwards, we're not over this child, undo the rotation.
							currentElement._children[i].rotatePoint(mousePoint, false);
						}
						
						if (foundChild == false)
							break;
					}
				}

				if (currentElement != null && 
					(this._rollOverElement != lastRollOverTarget || 
					this._rollOverX != lastRollOverX || 
					this._rollOverY != lastRollOverY))
				{
					currentElement._dispatchEvent(new ElementMouseEvent("mousemove", mousePoint.x, mousePoint.y));
				}
				
				this._broadcastDispatcher._dispatchEvent(new ElementMouseEvent("mousemoveex", this._mouseX, this._mouseY));
				
				if (lastRollOverTarget != null && this._rollOverElement != lastRollOverTarget)
				{
					var rollOutElements = [];
					currentElement = lastRollOverTarget;
					while (currentElement != rollOverCommonParent)
					{
						currentElement._mouseIsOver = false;
						rollOutElements.push(currentElement);
						currentElement = currentElement._parent;
					}
					
					for (i = 0; i < rollOutElements.length; i++)
						rollOutElements[i]._dispatchEvent(new ElementEvent("rollout", false));
				}
				
				for (i = 0; i < rollOverElements.length; i++)
					rollOverElements[i]._dispatchEvent(new ElementEvent("rollover", false));
			}
			
			//Process render queue.
			while (this._updateRenderQueue.length > 0 && 
					this._rollOverInvalid == false &&
					this._updateLayoutQueue.length == 0 && 
					this._updateMeasureQueue.length == 0 && 
					this._updateStylesQueue.length == 0)
			{
				this._updateRenderQueue.removeSmallest().data._validateRender();
			}
		}
		
		if (this._redrawRegionInvalid == true)
		{
			this._validateRedrawRegion(this, false);
			this._redrawRegionInvalid = false;
		}
		
		//Render composite layers.
		while (this._compositeRenderQueue.length > 0)
			this._compositeRenderQueue.removeLargest().data._validateCompositeRender();
		
		//Render redraw region
		if (this._redrawRegionPrevMetrics != null)
			this._invalidateCompositeRender();
	};

/////////////CanvasManager Static Public Functions///////////////	

/**
 * @function getLocalMousePos
 * @static
 * Translates browser mouse event coordinates to canvas relative coordinates.
 * The system automatically calls this and translates raw browser events to 
 * system events to be consumed by CanvasElements. You probably never need to call this.
 * 
 * @param event BrowserEvent
 * The browser mouse event.
 * 
 * @param canvas Canvas
 * The DOM Canvas reference to translate the mouse coordinates too.
 * 
 * @returns Object
 * A point object containing {x, y}.
 */	
CanvasManager.getLocalMousePos = 
	function (event, canvas)
	{
		//Reliable way to get position with canvas scaling.
		var rect = canvas.getBoundingClientRect();
		return {
			x: Math.round((event.clientX - rect.left) / (rect.right - rect.left) * canvas.width),
			y: Math.round((event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height)
		};
	};	

//////////////Internal Functions////////////////

//@override	
CanvasManager.prototype._updateCompositeCanvas = 
	function ()
	{
		if (this._compositeCanvas == null)
		{
			this._compositeCanvas = this._canvas;
			this._compositeCtx = this._canvasContext;
		}
		
		if (this._compositeCanvas.width != this._width || 
			this._compositeCanvas.height != this._height)
		{
			this._compositeCanvas.width = this._width;
			this._compositeCanvas.height = this._height;
			
			if (this._compositeCanvasMetrics == null)
				this._compositeCanvasMetrics = new DrawMetrics();
			
			this._compositeCanvasMetrics._x = 0;
			this._compositeCanvasMetrics._y = 0;
			this._compositeCanvasMetrics._width = this._width;
			this._compositeCanvasMetrics._height = this._height;
			
			//Expand the redraw region to this whole canvas.
			if (this._redrawRegionMetrics == null)
				this._redrawRegionMetrics = this._compositeCanvasMetrics.clone();
			else
				this._redrawRegionMetrics.mergeExpand(this._compositeCanvasMetrics);
		}
	};	

//@private (recursive function)	
CanvasManager.prototype._validateRedrawRegion = 
	function (element, forceRegionUpdate)
	{
		var newCompositeMetrics = [];
		var oldVisible = element._renderVisible;
		
		//Get new visibility
		var newVisible = true;
		if ((element._parent != null && element._parent._renderVisible == false) || 
			element.getStyle("Visible") == false || 
			element.getStyle("Alpha") <= 0)
		{
			newVisible = false;
		}
		
		//Composite effect on this element changed, we *must* update the region on ourself and all of our children.
		if (element._compositeEffectChanged == true)
			forceRegionUpdate = true;
		
		//Wipe out the composite metrics (rebuild as we recurse children if we're a composite layer)
		element._compositeVisibleMetrics = null;
		element._transformVisibleMetrics = null;
		element._transformDrawableMetrics = null;
		
		if ((element._renderChanged == true || element._graphicsClear == false) &&
			(oldVisible == true || newVisible == true))
		{
			var parent = element;
			var rawMetrics = element.getMetrics();		//Transformed via points up parent chain
			
			var drawableMetrics = rawMetrics.clone();	//Transformed via metrics up parent chain (recalculated each layer, expands, and clips)
			
			//Used for transforming the raw metrics up the parent chain.
			var pointRawTl = {x:rawMetrics._x, y:rawMetrics._y};
			var pointRawTr = {x:rawMetrics._x + rawMetrics._width, y:rawMetrics._y};
			var pointRawBr = {x:rawMetrics._x + rawMetrics._width, y:rawMetrics._y + rawMetrics._height};
			var pointRawBl = {x:rawMetrics._x, y:rawMetrics._y + rawMetrics._height};
			
			var pointDrawableTl = {x:0, y:0};
			var pointDrawableTr = {x:0, y:0};
			var pointDrawableBr = {x:0, y:0};
			var pointDrawableBl = {x:0, y:0};
			
			var minX = null;
			var maxX = null;
			var minY = null;
			var maxY = null;
			
			//Cached storage of previous metrics per composite parent.
			var oldMetrics = null;	//{element:element, metrics:DrawMetrics, drawableMetrics:DrawMetrics}
			
			var clipMetrics = new DrawMetrics();
			var shadowMetrics = new DrawMetrics();
			var shadowSize = 0;
			
			var drawableMetricsChanged = false;
			var rawMetricsChanged = false;
			
			//Walk up the parent chain invalidating the redraw region and updating _compositeVisibleMetrics
			while (parent != null)
			{
				//Apply clipping to drawable metrics (Always clip root manager)
				if (drawableMetrics != null && (parent == this || parent.getStyle("ClipContent") == true))
				{
					//Clip metrics relative to current element
					clipMetrics._x = 0;
					clipMetrics._y = 0;
					clipMetrics._width = parent._width;
					clipMetrics._height = parent._height;
					
					//Reduce drawable metrics via clipping metrics.
					drawableMetrics.mergeReduce(clipMetrics);
					
					//Kill metrics if completely clipped
					if (drawableMetrics._width <= 0 || drawableMetrics._height <= 0)
						drawableMetrics = null;
				}
				
				//Update redraw region, _compositeVisibleMetrics, and record new stored composite metrics.
				if (parent._isCompositeElement() == true)
				{
					oldMetrics = element._getCompositeMetrics(parent);
					
					if (drawableMetrics != null && newVisible == true && element._graphicsClear == false)
					{
						newCompositeMetrics.push({element:parent, metrics:rawMetrics.clone(), drawableMetrics:drawableMetrics.clone()});
						
						//Update composite parents visible metrics
						if (parent._compositeVisibleMetrics == null)
							parent._compositeVisibleMetrics = drawableMetrics.clone();
						else
							parent._compositeVisibleMetrics.mergeExpand(drawableMetrics);
					}
					else
						newMetrics = null;
					
					drawableMetricsChanged = true;
					if ((oldMetrics == null && drawableMetrics == null) ||
						(oldMetrics != null && drawableMetrics != null && oldMetrics.drawableMetrics.equals(drawableMetrics) == true))
					{
						drawableMetricsChanged = false;
					}
					
					rawMetricsChanged = true;
					if (oldMetrics != null && oldMetrics.metrics.equals(rawMetrics) == true)
					{
						rawMetricsChanged = false;
					}
					
					//Update the composite element's redraw region
					if (forceRegionUpdate == true || 			//Composite effect changed	
						element._renderChanged == true ||		//Render changed
						oldVisible != newVisible ||				//Visible changed
						drawableMetricsChanged == true ||		//Drawable region changed (clipping)
						rawMetricsChanged)						//Position changed
					{
						//If was visible, redraw old metrics
						if (oldVisible == true && oldMetrics != null)
							parent._updateRedrawRegion(oldMetrics.drawableMetrics);
						
						//Redraw new metrics
						if (newVisible == true)
							parent._updateRedrawRegion(drawableMetrics);
					}
				}				
				
				//Drawable metrics will be null if we've been completely clipped. No reason to do any more translation.
				if (drawableMetrics != null)
				{	//Fix current metrics so that we're now relative to our parent.
					
					//Update position
					
					//Drawable metrics////
					drawableMetrics._x += parent._x;
					drawableMetrics._y += parent._y;
					
					shadowSize = parent.getStyle("ShadowSize");
					
					//Expand metrics for shadow
					if (shadowSize > 0 && parent.getStyle("ShadowColor") != null)
					{
						//Copy drawable metrics
						shadowMetrics.copyFrom(drawableMetrics);
						
						//Create shadow position metrics
						shadowMetrics._width += (shadowSize * 2);
						shadowMetrics._height += (shadowSize * 2);
						shadowMetrics._x -= shadowSize;
						shadowMetrics._y -= shadowSize;
						shadowMetrics._x += parent.getStyle("ShadowOffsetX");
						shadowMetrics._y += parent.getStyle("ShadowOffsetY");
						
						//Merge the shadow metrics with the drawable metrics
						drawableMetrics.mergeExpand(shadowMetrics);
						
						//Handle transform
						if (CanvasElement.normalizeDegrees(parent._rotateDegrees) != 0)
						{
							//Transform drawable metrics/////////////
							pointDrawableTl.x = drawableMetrics._x;
							pointDrawableTl.y = drawableMetrics._y;
							
							pointDrawableTr.x = drawableMetrics._x + drawableMetrics._width;
							pointDrawableTr.y = drawableMetrics._y;
							
							pointDrawableBr.x = drawableMetrics._x + drawableMetrics._width;
							pointDrawableBr.y = drawableMetrics._y + drawableMetrics._height;
							
							pointDrawableBl.x = drawableMetrics._x;
							pointDrawableBl.y = drawableMetrics._y + drawableMetrics._height;
							
							parent.rotatePoint(pointDrawableTl, false);
							parent.rotatePoint(pointDrawableTr, false);
							parent.rotatePoint(pointDrawableBl, false);
							parent.rotatePoint(pointDrawableBr, false);
							
							minX = Math.min(pointDrawableTl.x, pointDrawableTr.x, pointDrawableBr.x, pointDrawableBl.x);
							maxX = Math.max(pointDrawableTl.x, pointDrawableTr.x, pointDrawableBr.x, pointDrawableBl.x);
							minY = Math.min(pointDrawableTl.y, pointDrawableTr.y, pointDrawableBr.y, pointDrawableBl.y);
							maxY = Math.max(pointDrawableTl.y, pointDrawableTr.y, pointDrawableBr.y, pointDrawableBl.y);
							
							drawableMetrics._x = minX;
							drawableMetrics._y = minY;
							drawableMetrics._width = maxX - minX;
							drawableMetrics._height = maxY - minY;
						}
						
						//Use drawable metrics as the new raw metrics (shadow uses context of parent applying shadow)
						rawMetrics.copyFrom(drawableMetrics);
						
						pointRawTl.x += rawMetrics._x;
						pointRawTl.y += rawMetrics._y;
						
						pointRawTr.x += rawMetrics._x + rawMetrics._width;
						pointRawTr.y += rawMetrics._y;
						
						pointRawBr.x += rawMetrics._x + rawMetrics._width;
						pointRawBr.y += rawMetrics._y + rawMetrics._height;
						
						pointRawBl.x += rawMetrics._x;
						pointRawBl.y += rawMetrics._y + rawMetrics._height;
					}
					else
					{
						//Raw metrics
						pointRawTl.x += parent._x;
						pointRawTl.y += parent._y;
						
						pointRawTr.x += parent._x;
						pointRawTr.y += parent._y;
						
						pointRawBr.x += parent._x;
						pointRawBr.y += parent._y;
						
						pointRawBl.x += parent._x;
						pointRawBl.y += parent._y;
						
						//Handle transform
						if (CanvasElement.normalizeDegrees(parent._rotateDegrees) != 0)
						{
							//Rotate raw metrics points
							parent.rotatePoint(pointRawTl, false);
							parent.rotatePoint(pointRawTr, false);
							parent.rotatePoint(pointRawBl, false);
							parent.rotatePoint(pointRawBr, false);
							
							//Transform drawable metrics/////////////
							pointDrawableTl.x = drawableMetrics._x;
							pointDrawableTl.y = drawableMetrics._y;
							
							pointDrawableTr.x = drawableMetrics._x + drawableMetrics._width;
							pointDrawableTr.y = drawableMetrics._y;
							
							pointDrawableBr.x = drawableMetrics._x + drawableMetrics._width;
							pointDrawableBr.y = drawableMetrics._y + drawableMetrics._height;
							
							pointDrawableBl.x = drawableMetrics._x;
							pointDrawableBl.y = drawableMetrics._y + drawableMetrics._height;
							
							parent.rotatePoint(pointDrawableTl, false);
							parent.rotatePoint(pointDrawableTr, false);
							parent.rotatePoint(pointDrawableBl, false);
							parent.rotatePoint(pointDrawableBr, false);
							
							minX = Math.min(pointDrawableTl.x, pointDrawableTr.x, pointDrawableBr.x, pointDrawableBl.x);
							maxX = Math.max(pointDrawableTl.x, pointDrawableTr.x, pointDrawableBr.x, pointDrawableBl.x);
							minY = Math.min(pointDrawableTl.y, pointDrawableTr.y, pointDrawableBr.y, pointDrawableBl.y);
							maxY = Math.max(pointDrawableTl.y, pointDrawableTr.y, pointDrawableBr.y, pointDrawableBl.y);
							
							drawableMetrics._x = minX;
							drawableMetrics._y = minY;
							drawableMetrics._width = maxX - minX;
							drawableMetrics._height = maxY - minY;
							/////////////////////////////////////
						}
						
						//Update transformed raw metrics
						minX = Math.min(pointRawTl.x, pointRawTr.x, pointRawBr.x, pointRawBl.x);
						maxX = Math.max(pointRawTl.x, pointRawTr.x, pointRawBr.x, pointRawBl.x);
						minY = Math.min(pointRawTl.y, pointRawTr.y, pointRawBr.y, pointRawBl.y);
						maxY = Math.max(pointRawTl.y, pointRawTr.y, pointRawBr.y, pointRawBl.y);
						
						rawMetrics._x = minX;
						rawMetrics._y = minY;
						rawMetrics._width = maxX - minX;
						rawMetrics._height = maxY - minY;
					}
					
					//Reduce the precision (random rounding errors at *very* high decimal points)
					rawMetrics.roundToPrecision(3);
					
					//Reduce drawable metrics via raw metrics.
					drawableMetrics.mergeReduce(rawMetrics);
					
					//Reduce the precision (random rounding errors at *very* high decimal points)
					drawableMetrics.roundToPrecision(3);
				}
				
				parent = parent._parent;
			}
		}
		
		element._compositeMetrics = newCompositeMetrics;
		element._renderVisible = newVisible;
		element._renderChanged = false;
		
		//Recurse children if we were or are visible.
		if (oldVisible == true || newVisible == true)
		{
			for (var i = 0; i < element._children.length; i++)
				this._validateRedrawRegion(element._children[i], forceRegionUpdate);
			
			if (element._isCompositeElement() == true)
				this._updateTransformMetrics(element);
		}
	};
	
CanvasManager.prototype._updateTransformMetrics = 
	function(compositeElement)
	{
		//No transform of root manager, or invisible layers.
		if (compositeElement == this || compositeElement._compositeVisibleMetrics == null)
			return;
		
		var pointTl = {x:0, y:0};
		var pointTr = {x:0, y:0};
		var pointBr = {x:0, y:0};
		var pointBl = {x:0, y:0};
		
		var minX = null;
		var maxX = null;
		var minY = null;
		var maxY = null;
		
		var shadowSize = 0;
		
		var parent = compositeElement;
		compositeElement._transformVisibleMetrics = compositeElement._compositeVisibleMetrics.clone();
		compositeElement._transformDrawableMetrics = compositeElement._compositeVisibleMetrics.clone();
		
		var clipMetrics = new DrawMetrics();
		var done = false;
		
		while (true)
		{
			if (compositeElement._transformDrawableMetrics != null && parent.getStyle("ClipContent") == true)
			{
				//Clip metrics relative to current element
				clipMetrics._x = 0;
				clipMetrics._y = 0;
				clipMetrics._width = parent._width;
				clipMetrics._height = parent._height;
				
				//Reduce drawable metrics via clipping metrics.
				compositeElement._transformDrawableMetrics.mergeReduce(clipMetrics);
				
				//Kill metrics if completely clipped
				if (compositeElement._transformDrawableMetrics._width <= 0 || compositeElement._transformDrawableMetrics._height <= 0)
				{
					compositeElement._transformDrawableMetrics = null;
					compositeElement._transformVisibleMetrics = null;
					
					return;
				}
			}
			
			if (done == true)
				break;
			
			compositeElement._transformVisibleMetrics._x += parent._x;
			compositeElement._transformVisibleMetrics._y += parent._y;
			
			compositeElement._transformDrawableMetrics._x += parent._x;
			compositeElement._transformDrawableMetrics._y += parent._y;

			shadowSize = parent.getStyle("ShadowSize");
			
			//Expand metrics for shadow
			if (shadowSize > 0 && parent.getStyle("ShadowColor") != null)
			{
				//Copy drawable metrics
				var shadowMetrics = compositeElement._transformDrawableMetrics.clone();
				
				//Create shadow position metrics
				shadowMetrics._width += (shadowSize * 2);
				shadowMetrics._height += (shadowSize * 2);
				shadowMetrics._x -= shadowSize;
				shadowMetrics._y -= shadowSize;
				shadowMetrics._x += parent.getStyle("ShadowOffsetX");
				shadowMetrics._y += parent.getStyle("ShadowOffsetY");
				
				//Merge the shadow metrics with the drawable metrics
				compositeElement._transformDrawableMetrics.mergeExpand(shadowMetrics);
			}
			
			if (CanvasElement.normalizeDegrees(parent._rotateDegrees) != 0)
			{
				//Transform visible
				pointTl.x = compositeElement._transformVisibleMetrics._x;
				pointTl.y = compositeElement._transformVisibleMetrics._y;
				
				pointTr.x = compositeElement._transformVisibleMetrics._x + compositeElement._transformVisibleMetrics._width;
				pointTr.y = compositeElement._transformVisibleMetrics._y;

				pointBr.x = compositeElement._transformVisibleMetrics._x + compositeElement._transformVisibleMetrics._width;
				pointBr.y = compositeElement._transformVisibleMetrics._y + compositeElement._transformVisibleMetrics._height;
				
				pointBl.x = compositeElement._transformVisibleMetrics._x;
				pointBl.y = compositeElement._transformVisibleMetrics._y + compositeElement._transformVisibleMetrics._height;
				
				parent.rotatePoint(pointTl, false);
				parent.rotatePoint(pointTr, false);
				parent.rotatePoint(pointBl, false);
				parent.rotatePoint(pointBr, false);
				
				minX = Math.min(pointTl.x, pointTr.x, pointBr.x, pointBl.x);
				maxX = Math.max(pointTl.x, pointTr.x, pointBr.x, pointBl.x);
				minY = Math.min(pointTl.y, pointTr.y, pointBr.y, pointBl.y);
				maxY = Math.max(pointTl.y, pointTr.y, pointBr.y, pointBl.y);
				
				compositeElement._transformVisibleMetrics._x = minX;
				compositeElement._transformVisibleMetrics._y = minY;
				compositeElement._transformVisibleMetrics._width = maxX - minX;
				compositeElement._transformVisibleMetrics._height = maxY - minY;
				
				compositeElement._transformVisibleMetrics.roundToPrecision(3);
				
				//Transform Drawable
				pointTl.x = compositeElement._transformDrawableMetrics._x;
				pointTl.y = compositeElement._transformDrawableMetrics._y;
				
				pointTr.x = compositeElement._transformDrawableMetrics._x + compositeElement._transformDrawableMetrics._width;
				pointTr.y = compositeElement._transformDrawableMetrics._y;
				
				pointBr.x = compositeElement._transformDrawableMetrics._x + compositeElement._transformDrawableMetrics._width;
				pointBr.y = compositeElement._transformDrawableMetrics._y + compositeElement._transformDrawableMetrics._height;
				
				pointBl.x = compositeElement._transformDrawableMetrics._x;
				pointBl.y = compositeElement._transformDrawableMetrics._y + compositeElement._transformDrawableMetrics._height;
				
				parent.rotatePoint(pointTl, false);
				parent.rotatePoint(pointTr, false);
				parent.rotatePoint(pointBl, false);
				parent.rotatePoint(pointBr, false);
				
				minX = Math.min(pointTl.x, pointTr.x, pointBr.x, pointBl.x);
				maxX = Math.max(pointTl.x, pointTr.x, pointBr.x, pointBl.x);
				minY = Math.min(pointTl.y, pointTr.y, pointBr.y, pointBl.y);
				maxY = Math.max(pointTl.y, pointTr.y, pointBr.y, pointBl.y);
				
				compositeElement._transformDrawableMetrics._x = minX;
				compositeElement._transformDrawableMetrics._y = minY;
				compositeElement._transformDrawableMetrics._width = maxX - minX;
				compositeElement._transformDrawableMetrics._height = maxY - minY;
				
				compositeElement._transformDrawableMetrics.roundToPrecision(3);
			}
			
			parent = parent._parent;
			
			if (parent._isCompositeElement() == true)
				done = true;
		}
	};
	
//@override (add redraw region visibility)	
CanvasManager.prototype._validateCompositeRender =
	function ()
	{
		if (this.getStyle("ShowRedrawRegion") == true)
		{
			var currentRegion = null;
			if (this._redrawRegionMetrics != null)
			{
				currentRegion = this._redrawRegionMetrics.clone();
				currentRegion._x -= 1;
				currentRegion._y -= 1;
				currentRegion._width += 2;
				currentRegion._height += 2;
				currentRegion.roundUp();
				
				//Expand the redraw region to this whole canvas.
				if (this._redrawRegionPrevMetrics != null)
					this._redrawRegionMetrics.mergeExpand(this._redrawRegionPrevMetrics);
			}
			else if (this._redrawRegionPrevMetrics != null)
				this._redrawRegionMetrics = this._redrawRegionPrevMetrics.clone();
			
			CanvasManager.base.prototype._validateCompositeRender.call(this);
			
			if (currentRegion != null)
			{
				this._canvasContext.lineWidth = 1;
				this._canvasContext.strokeStyle = "#FF0000";
				
				this._canvasContext.beginPath();
				this._canvasContext.moveTo(currentRegion._x + .5, currentRegion._y + .5);
				this._canvasContext.lineTo(currentRegion._x + currentRegion._width - .5, currentRegion._y + .5);
				this._canvasContext.lineTo(currentRegion._x + currentRegion._width - .5, currentRegion._y + currentRegion._height - .5);
				this._canvasContext.lineTo(currentRegion._x + .5, currentRegion._y + currentRegion._height - .5);
				this._canvasContext.closePath();
				this._canvasContext.stroke();	
			}
			
			this._redrawRegionPrevMetrics = currentRegion;
		}
		else
		{
			CanvasManager.base.prototype._validateCompositeRender.call(this);
			this._redrawRegionPrevMetrics = null;
		}
	};	
	
//@private	
CanvasManager.prototype._updateFocusElement = 
	function (newFocusElement, renderFocusRing)
	{
		if (newFocusElement != this._focusElement)
		{
			if (this._focusElement != null)
			{
				this._focusElement._isFocused = false;
				this._focusElement._setRenderFocusRing(false);
				
				if (this._focusElement.hasEventListener("focusout", null) == true)
					this._focusElement._dispatchEvent(new ElementEvent("focusout", false));
			}
			
			this._focusElement = newFocusElement;
			
			if (this._focusElement != null)
			{
				this._focusElement._isFocused = true;
				this._focusElement._setRenderFocusRing(renderFocusRing);
				
				if (this._focusElement.hasEventListener("focusin", null) == true)
					this._focusElement._dispatchEvent(new ElementEvent("focusin", false));
			}
		}
	};
	
//@private	
CanvasManager.prototype._findChildTabStopForward = 
	function (parent, afterChild)
	{
		var index = 0;
		if (afterChild != null)
			index = parent._children.indexOf(afterChild) + 1;
		
		var tabToElement = null;
		
		for (var i = index; i < parent._children.length; i++)
		{
			if (parent._children[i].getStyle("MouseEnabled") == false ||
				parent._children[i].getStyle("Visible") == false || 
				parent._children[i].getStyle("Enabled") == false)
				continue;
			
			if (parent._children[i].getStyle("TabStop") >= 0)
				return parent._children[i];
			
			tabToElement = this._findChildTabStopForward(parent._children[i], null);
			if (tabToElement != null)
				return tabToElement;
		}
		
		return tabToElement;
	};

//@private	
CanvasManager.prototype._findChildTabStopReverse = 
	function (parent, beforeChild, lastTabStopElement)
	{
		var index = parent._children.length - 1;
		if (beforeChild != null)
			index = parent._children.indexOf(beforeChild) - 1;
		
		for (var i = index; i >= 0; i--)
		{
			if (parent._children[i].getStyle("MouseEnabled") == false ||
				parent._children[i].getStyle("Visible") == false || 
				parent._children[i].getStyle("Enabled") == false)
				continue;
			
			if (parent._children[i].getStyle("TabStop") >= 0)
				lastTabStopElement = parent._children[i];
			
			this._findChildTabStopReverse(parent._children[i], null, lastTabStopElement);
			
			if (lastTabStopElement != null)
				return lastTabStopElement;
		}
		
		return lastTabStopElement;
	};	
	
//@private	
CanvasManager.prototype._updateCursor = 
	function ()
	{
		var cursorDefinition = null;
		if (this._cursorChain.back != null)
			cursorDefinition = this._cursorChain.back.data;
		
		var displayedCursorElement = null;
		if (this._cursorContainer._getNumChildren() > 0)
			displayedCursorElement = this._cursorContainer._getChildAt(0);
		
		if (cursorDefinition != null)
		{
			var cursorElement = null;
			if (!(typeof cursorDefinition === "string" || cursorDefinition instanceof String))
			{
				var cursorClass = cursorDefinition.getStyle("CursorClass");
				
				if (cursorClass == null)
					cursorDefinition._cursorElement = null;
				else
				{
					if (cursorDefinition._cursorElement == null || 
						cursorDefinition._cursorElement.constructor != cursorClass)
					{
						cursorDefinition._cursorElement = new (cursorClass)();
						cursorDefinition._cursorElement.setStyleDefinitions(cursorDefinition.getStyle("CursorStyle"));
					}
					else
						cursorDefinition._cursorElement.setStyleDefinitions(cursorDefinition.getStyle("CursorStyle"));
					
					cursorElement = cursorDefinition._cursorElement;
				}
			}
			
			if (displayedCursorElement != cursorElement)
			{
				if (displayedCursorElement != null)
					this._cursorContainer._removeChild(displayedCursorElement);
				if (cursorElement != null)
					this._cursorContainer._addChild(cursorElement);
			}
			
			if (cursorElement != null)
			{
				if (this._browserCursor != "none")
				{
					this._browserCursor = "none";
					this._canvas.style.cursor = "none";
				}
					
				//Make visible if we're over canvas			
				if (this._mouseX >= 0 && this._mouseX <= this._width &&
					this._mouseY >= 0 && this._mouseY <= this._height)
				{
					var cursorWidth = cursorDefinition._cursorElement._getStyledOrMeasuredWidth();
					var cursorHeight = cursorDefinition._cursorElement._getStyledOrMeasuredHeight();
					var offsetX = cursorDefinition.getStyle("CursorOffsetX");
					var offsetY = cursorDefinition.getStyle("CursorOffsetY");
					
					cursorElement._setActualPosition(this._mouseX + offsetX, this._mouseY + offsetY);
					cursorElement._setActualSize(cursorWidth, cursorHeight);
					cursorElement.setStyle("Visible", true);
				}
				else //Hide' mouse is no longer over canvas
					cursorElement.setStyle("Visible", false);
			}
			else if (this._browserCursor != cursorDefinition)
			{
				this._browserCursor = cursorDefinition;
				this._canvas.style.cursor = cursorDefinition;
			}
		}
		else
		{
			if (displayedCursorElement != null)
				this._cursorContainer._removeChildAt(0);
			
			if (this._browserCursor != "default")
			{
				this._browserCursor = "default";
				this._canvas.style.cursor = "default";
			}
		}
	};
	
//@private	
CanvasManager.prototype._onCursorDefinitionStyleChanged = 
	function (styleChangedEvent)
	{
		var cursorDefinition = styleChangedEvent.getTarget();
		
		var styleName = styleChangedEvent.getStyleName();
		if (styleName == "CursorClass" && cursorDefinition._cursorElement != null)
		{
			var cursorClass = cursorDefinition.getStyle("CursorClass");
			if (cursorDefinition._cursorElement.constructor != cursorClass)
				cursorDefinition._cursorElement = null;
		}
		if (styleName == "CursorStyle" && cursorDefinition._cursorElement != null)
			cursorDefinition._cursorElement.setStyleDefinitions(this.getStyle("CursorStyle"));
		
		this._updateCursor();
	};
	
//@private	
CanvasManager.prototype._pushAddRemoveDisplayChainQueue = 
	function (element, type)
	{
		var node = new CmLinkedNode();
		node.data = {element:element, type:type};
		
		this._addRemoveDisplayChainQueue.pushBack(node);
	};

//@private	
CanvasManager.prototype._popAddRemoveDisplayChainQueue = 
	function ()
	{
		if (this._addRemoveDisplayChainQueue.length == 0)
			return null;
		
		var data = this._addRemoveDisplayChainQueue.front.data;
		this._addRemoveDisplayChainQueue.removeNode(this._addRemoveDisplayChainQueue.front);
		
		return data;
	};

//@private	
CanvasManager.prototype._processAddRemoveDisplayChainQueue = 
	function ()
	{
		//Recursion guard. An event may add or remove other elements, we dont want this function to recurse.
		if (this._addRemoveDisplayChainQueueProcessing == true)
			return;
		
		//Block recursion
		this._addRemoveDisplayChainQueueProcessing = true;
		
		var addRemoveData = this._popAddRemoveDisplayChainQueue();
		while (addRemoveData != null)
		{
			addRemoveData.element._dispatchEvent(new AddedRemovedEvent(addRemoveData.type, this));
			addRemoveData = this._popAddRemoveDisplayChainQueue();
		}
		
		//Queue emtpy, allow processing again.
		this._addRemoveDisplayChainQueueProcessing = false;
	};

//@private	
CanvasManager.prototype._clearDraggingElement = 
	function ()
	{
		if (this._draggingElement == null)
			return;

		this._draggingElement = null;
		this._draggingOffsetX = null;
		this._draggingOffsetY = null;
	};

//@private	
CanvasManager.prototype._setDraggingElement = 
	function (element, offsetX, offsetY)
	{
		if (this._draggingElement != null)
			return;

		this._draggingElement = element;
		this._draggingOffsetX = offsetX;
		this._draggingOffsetY = offsetY;
	};
	
//@Override	
CanvasManager.prototype._doLayout = 
function (paddingMetrics)
{
	CanvasManager.base.prototype._doLayout.call(this, paddingMetrics);
	
	this._cursorContainer._setActualSize(this._width, this._height);
};	



//////////Private Helper Classes////////////////////

//Used exclusively by CanvasManager//

//Queue used for processing component cycles (styles, measure, layout) based on display chain depth.
function CmDepthQueue()
{
	this.depthArrayOfLists = []; //Array of CmLinkedList, index based on depth.
	this.length = 0;
	
	//Stores current start/end populated indexes of depthArrayOfLists for performance.
	this.minDepth = -1;
	this.maxDepth = -1;
}

CmDepthQueue.prototype.addNode = 
	function (node, depth)
	{
		var depthToIndex = depth - 1;
	
		if (this.depthArrayOfLists[depthToIndex] == null)
			this.depthArrayOfLists[depthToIndex] = new CmLinkedList();
		
		this.depthArrayOfLists[depthToIndex].pushBack(node);
		
		this.length = this.length + 1;
		
		if (depthToIndex < this.minDepth || this.minDepth == -1)
			this.minDepth = depthToIndex;
		if (depthToIndex > this.maxDepth)
			this.maxDepth = depthToIndex;
	};
	
CmDepthQueue.prototype.removeNode = 
	function (node, depth)
	{
		var depthToIndex = depth - 1; 
	
		this.depthArrayOfLists[depthToIndex].removeNode(node);
		
		this.length = this.length - 1;
		if (this.length == 0)
		{
			this.minDepth = -1;
			this.maxDepth = -1;
		}
	};
	
CmDepthQueue.prototype.removeSmallest = 
	function ()
	{
		if (this.length == 0)
			return null;
		
		for (var i = this.minDepth; i < this.depthArrayOfLists.length; i++)
		{
			this.minDepth = i;
			if (this.depthArrayOfLists[i] == null || this.depthArrayOfLists[i].length == 0)
				continue;
			
			var node = this.depthArrayOfLists[i].front;
			this.depthArrayOfLists[i].removeNode(node);
			
			this.length = this.length - 1;
			if (this.length == 0)
			{
				this.minDepth = -1;
				this.maxDepth = -1;
			}
			
			return node;
		}
	};
	
CmDepthQueue.prototype.removeLargest = 
	function ()
	{
		if (this.length == 0)
			return null;
		
		for (var i = this.maxDepth; i >= 0; i--)
		{
			this.maxDepth = i;
			if (this.depthArrayOfLists[i] == null || this.depthArrayOfLists[i].length == 0)
				continue;
			
			var node = this.depthArrayOfLists[i].back;
			this.depthArrayOfLists[i].removeNode(node);
			
			this.length = this.length - 1;
			if (this.length == 0)
			{
				this.minDepth = -1;
				this.maxDepth = -1;
			}
			
			return node;
		}
	};
	
//Basic linked list	
function CmLinkedList()
{
	this.front = null;
	this.back = null;
	
	this.length = 0;
}

CmLinkedList.prototype.pushFront = 
	function (cmLinkedNode)
	{
		this.length++;
		
		if (this.front == null)
		{
			cmLinkedNode.prev = null;
			cmLinkedNode.next = null;
			
			this.front = cmLinkedNode;
			this.back = cmLinkedNode;
		}
		else
		{
			cmLinkedNode.prev = null;
			cmLinkedNode.next = this.front;
			
			this.front.prev = cmLinkedNode;
			this.front = cmLinkedNode;
		}
	};
	
CmLinkedList.prototype.pushBack =
	function (cmLinkedNode)
	{
		this.length++;
	
		if (this.back == null)
		{
			cmLinkedNode.prev = null;
			cmLinkedNode.next = null;
			
			this.front = cmLinkedNode;
			this.back = cmLinkedNode;
		}
		else
		{
			cmLinkedNode.prev = this.back;
			cmLinkedNode.next = null;
			
			this.back.next = cmLinkedNode;
			this.back = cmLinkedNode;
		}
	};

CmLinkedList.prototype.insertBefore = 
	function (cmLinkedNode, beforeCmLinkedNode)	
	{
		this.length++;
		
		if (this.front == beforeCmLinkedNode)
			this.front = cmLinkedNode;
		
		if (beforeCmLinkedNode.prev != null)
			beforeCmLinkedNode.prev.next = cmLinkedNode;
		
		cmLinkedNode.prev = beforeCmLinkedNode.prev;
		cmLinkedNode.next = beforeCmLinkedNode;
		beforeCmLinkedNode.prev = cmLinkedNode;
	};

CmLinkedList.prototype.insertAfter = 
	function (cmLinkedNode, afterCmLinkedNode)
	{
		this.length++;
		
		if (this.back == afterCmLinkedNode)
			this.back = cmLinkedNode;
		
		if (afterCmLinkedNode.next != null)
			afterCmLinkedNode.next.prev = cmLinkedNode;
		
		cmLinkedNode.next = afterCmLinkedNode.next;
		cmLinkedNode.prev = afterCmLinkedNode;
		afterCmLinkedNode.next = cmLinkedNode;		
	};
	
CmLinkedList.prototype.removeNode = 
	function (cmLinkedNode)
	{
		if (cmLinkedNode == null)
			return null;
		
		this.length--;
		
		if (this.front == cmLinkedNode)
			this.front = cmLinkedNode.next;
		if (this.back == cmLinkedNode)
			this.back = cmLinkedNode.prev;
		
		if (cmLinkedNode.prev != null)
			cmLinkedNode.prev.next = cmLinkedNode.next;
		if (cmLinkedNode.next != null)
			cmLinkedNode.next.prev = cmLinkedNode.prev;
		
		cmLinkedNode.next = null;
		cmLinkedNode.prev = null;
	};
	
//Linked list iterator	
function CmLinkedNode()
{
	this.prev = null;
	this.next = null;
	
	this.data = null;
}




