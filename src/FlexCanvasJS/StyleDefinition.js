
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
	
	