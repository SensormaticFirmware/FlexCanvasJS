
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
	
	