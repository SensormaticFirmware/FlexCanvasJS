
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
 * StylableBaseSubclass._StyleTypes.Visible = 				{inheritable:false};		
 * StylableBaseSubclass._StyleTypes.BorderType = 			{inheritable:false};		
 * StylableBaseSubclass._StyleTypes.SkinStyle = 			{inheritable:false};		
 * StylableBaseSubclass._StyleTypes.TextStyle =				{inheritable:true};			
 * StylableBaseSubclass._StyleTypes.TextFont =				{inheritable:true};			
 * StylableBaseSubclass._StyleTypes.TextSize =				{inheritable:true};			
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
StyleableBase.StylePriorities = 
	{
		INSTANCE:0,
		CLASS:1
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
			styleData.priority.push(StyleableBase.StylePriorities.INSTANCE);
			return styleData;			
		}
		
		styleData.value = this._getClassStyle(styleName);
		styleData.priority.push(StyleableBase.StylePriorities.CLASS);
		
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
 * @function _getDefaultStyle
 * 
 * Gets default value for the supplied style. 
 * 
 * @param styleName String
 * String representing the default style to return.
 * 
 * @returns Any
 * Returns the associated default style value if found, otherwise undefined.
 */	
StyleableBase.prototype._getDefaultStyle = 
	function (styleName)
	{
		return this._getDefaultStyleData(styleName).value;
	};	
	
/**
 * @function _getDefaultStyleData
 * 
 * Gets default StyleData for the supplied style. 
 *  
 * @param styleName String
 * String representing the default style to return.
 * 
 * @returns StyleData
 * Returns the associated default StyleData.
 */	
StyleableBase.prototype._getDefaultStyleData = 
	function (styleName)
	{
		var styleData = new StyleData(styleName);
		
		styleData.value = this._getClassStyle(styleName);
		styleData.priority.push(StyleableBase.StylePriorities.CLASS);
		
		return styleData;
	};
	
//@private	
StyleableBase.prototype._getClassStyle = 
	function (styleName)
	{
		this._flattenClassStyles();
		
		if (styleName in this.constructor.__StyleDefaultsFlatMap)
			return this.constructor.__StyleDefaultsFlatMap[styleName];
		
		return undefined;
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
					if (styleName in this.constructor.__StyleDefaultsFlatMap)
						continue;
					
					this.constructor.__StyleDefaultsFlatMap[styleName] = thisClass.StyleDefault._styleMap[styleName];
				}
			}
			
			thisProto = Object.getPrototypeOf(thisProto);
			if (thisProto == null || thisProto.hasOwnProperty("constructor") == false)
				break;
			
			thisClass = thisProto.constructor;
		}
	};
	