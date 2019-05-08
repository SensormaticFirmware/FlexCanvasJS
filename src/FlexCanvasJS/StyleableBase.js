
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
 * There are three different types of styles, NORMAL, INHERITABLE, and SUBSTYLE.
 * 
 * StyleableBase.EStyleType.NORMAL: No special behavior.
 * 
 * StyleableBase.EStyleType.INHERITABLE: Only applicable for CanvasElements.
 * If no explicit style is set (instance, style definition, or proxy) look up the
 * parent chain for the first element supporting the style with inheritable.
 * If no style is found up the parent chain, use the element's default style.
 * 
 * StyleableBase.EStyleType.SUBSTYLE: Only applicable for CanvasElements.
 * Sub styles are a StyleDefinition or array of [StyleDefinition]s to be applied
 * as the style definition(s) of an element's sub component. For example, elements
 * that supports skins, will have several sub styles, one for each skin element. 
 * You can apply styles to the skin elements, by setting StyleDefinitions to the elements
 * "___SkinStyle" sub styles. This is not limited to skins, many elements have sub styles
 * for many sub components, such as built in scroll bars, buttons, or other sub components.
 * 
 * The system handles sub styles differently than other styles, as sub styles are [StyleDefinition]s
 * that can contain many individual styles. When implementing a sub style for a custom component, you 
 * should use CanvasElement's _applySubStylesToElement() function to apply the sub style [StyleDefinition]s 
 * to your sub component, such as within the _doStylesUpdated() function when the sub style has changed.
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
	
	//Map of StyleData by styleName, (allocation of StyleData can be expensive considering how often its queried) 
	this._stylesCache = Object.create(null); // {styleData:new StyleData(styleName), cacheInvalid:true};
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
		
		if (value === undefined)
			delete this._styleMap[styleName];
		else
			this._styleMap[styleName] = value;
		
		//Get the cache for this style.
		var styleCache = this._stylesCache[styleName];
		
		//Create cache if doesnt exist, flag cache as invalid to cause a full lookup by getStyleData()
		if (styleCache == null)
		{
			styleCache = {styleData:new StyleData(styleName), cacheInvalid:true};
			this._stylesCache[styleName] = styleCache;
		}
		else
			styleCache.cacheInvalid = true;
		
		if (this.hasEventListener("stylechanged", null) == true)
			this.dispatchEvent(new StyleChangedEvent(styleName));
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
		//Create cache if does not exist.
		var styleCache = this._stylesCache[styleName];
		if (styleCache == null)
		{
			styleCache = {styleData:new StyleData(styleName), cacheInvalid:true};
			
			//We always only have a depth of 1, so we push this now, and just update it as necessary.
			styleCache.styleData.priority.push(StyleableBase.EStylePriorities.INSTANCE); 
			
			this._stylesCache[styleName] = styleCache;
		}
	
		if (styleCache.cacheInvalid == false)
			return styleCache.styleData;
		
		styleCache.cacheInvalid = false;
	
		styleCache.styleData.value = StyleableBase.base.prototype.getStyle.call(this, styleName);
		if (styleCache.styleData.value !== undefined)
		{
			styleCache.styleData.priority[0] = StyleableBase.EStylePriorities.INSTANCE;
			return styleCache.styleData;			
		}
		
		styleCache.styleData.value = this._getClassStyle(styleName);
		styleCache.styleData.priority[0] = StyleableBase.EStylePriorities.CLASS;
		return styleCache.styleData;
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
		var instanceDefinitions = [];

		//Set default style definitions (class styles)
		elementToApply._setStyleDefinitions(this._getClassStyleList(styleName), true);
		
		//Get instance style or array of styles
		var instanceStyle = this._getInstanceStyle(styleName);
		
		if (instanceStyle !== undefined)
		{
			if (Array.isArray(instanceStyle) == true)
			{
				for (var i = 0; i < instanceStyle.length; i++)
					instanceDefinitions.push(instanceStyle[i]);
			}
			else 
				instanceDefinitions.push(instanceStyle);
		}
		
		//Set style definitions
		elementToApply._setStyleDefinitions(instanceDefinitions, false);
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
	
		var i;
		var i2;
		var styleList = [];
		var styleValue;
		var styleFlatArray;
		
		if (styleName in this.constructor.__StyleDefaultsFlatMap)
		{
			styleFlatArray = this.constructor.__StyleDefaultsFlatMap[styleName];
			
			for (i = 0; i < styleFlatArray.length; i++)
			{
				styleValue = styleFlatArray[i];
				
				//Flatten any values that are arrays
				if (Array.isArray(styleValue) == true)
				{
					for (i2 = 0; i2 < styleValue.length; i2++)
						styleList.push(styleValue[i2]);
				}
				else
					styleList.push(styleValue);
			}
		}
	
		return styleList;
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
	