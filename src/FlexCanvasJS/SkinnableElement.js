
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
 * related styles to its skins (such as BackgroundFill).
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
SkinnableElement._SkinProxyMap.BackgroundFill = 			true;
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
	
	