
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
	