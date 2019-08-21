
/**
 * @depends CanvasElement.js
 * @depends DropdownBaseElement.js
 */

//////////////////////////////////////////////////////////////
///////////////ColorPickerButtonElement///////////////////////

/**
 * @class ColorPickerButtonElement
 * @inherits DropdownBaseElement
 * 
 * ColorPickerButtonElement is a compound button that creates a pop-up ColorPicker
 * which the user can select a color which is then displayed on the button. 
 * 
 * The ColorPickerButtonElement button itself contains a child button which is used to render
 * the divider line and arrow. ColorPickerButtonElement proxies its SkinState style to the arrow
 * button so the arrow button will change states along with the ColorPickerButtonElement itself.
 * See the default skin for the arrow button DropdownArrowButtonSkinElement for additional styles.
 * 
 * @seealso DropdownArrowButtonSkinElement
 * 
 * 
 * @constructor ColorPickerButtonElement 
 * Creates new ColorPickerButtonElement instance.
 */
function ColorPickerButtonElement()
{
	ColorPickerButtonElement.base.prototype.constructor.call(this);

	this._colorSwatch = null;
	this._colorPickerPopup = null;
	this._selectedHexColor = "#FFFFFF";
	
	////////////////
	
	var _self = this;
	
	this._onColorPickerChangedInstance = 
		function (event)
		{
			_self._onColorPickerChanged(event);
		};
	this._onColorPickerKeydownInstance = 
		function (keyboardEvent)
		{
			_self._onColorPickerKeydown(keyboardEvent);
		};	
	this._onColorPickerLayoutCompleteInstance = 
		function (event)
		{
			_self._onColorPickerLayoutComplete(event);
		};	
}

//Inherit from ButtonElement
ColorPickerButtonElement.prototype = Object.create(DropdownBaseElement.prototype);
ColorPickerButtonElement.prototype.constructor = ColorPickerButtonElement;
ColorPickerButtonElement.base = DropdownBaseElement;


////////////Events///////////////////////////////

/**
 * @event changed ElementEvent
 * Dispatched when the color selection changes as a result of user input.
 */


/////////////Style Types/////////////////////////

ColorPickerButtonElement._StyleTypes = Object.create(null);

/**
 * @style PopupColorPickerStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to the pop up ColorPicker element.
 */
ColorPickerButtonElement._StyleTypes.PopupColorPickerStyle = 			StyleableBase.EStyleType.SUBSTYLE; 		// StyleDefinition

/**
 * @style ColorSwatchClass CanvasElement
 * 
 * The CanvasElement or subclass constructor to be used for the color swatch icon. Defaults to CanvasElement. 
 * Note that ColorPickerButton sets the swatch class's BackgroundFill style to the selected color
 */
ColorPickerButtonElement._StyleTypes.ColorSwatchClass = 				StyleableBase.EStyleType.NORMAL; 		// CanvasElement constructor

/**
 * @style ColorSwatchStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to the color swatch. Note that the
 * ColorPickerButton sets the color swatch's BackgroundFill style to the selected color.
 */
ColorPickerButtonElement._StyleTypes.ColorSwatchStyle = 				StyleableBase.EStyleType.SUBSTYLE; 		// StyleDefinition

/**
 * @style PopupColorPickerDistance Number
 * 
 * Vertical distance in pixels to place the ColorPicker pop up from the button.
 * Defaults to -1 to collapse default 1 pixel borders.
 */
ColorPickerButtonElement._StyleTypes.PopupColorPickerDistance = 		StyleableBase.EStyleType.NORMAL; 		


////////////Default Styles////////////////////

////Color swatch default style////
ColorPickerButtonElement.ColorSwatchStyleDefault = new StyleDefinition();
ColorPickerButtonElement.ColorSwatchStyleDefault.setStyle("BorderType", "solid");
ColorPickerButtonElement.ColorSwatchStyleDefault.setStyle("BorderColor", "#CFCFCF");

////ColorPicker pop up default style////
ColorPickerButtonElement.PopupColorPickerStyleDefault = new StyleDefinition();
ColorPickerButtonElement.PopupColorPickerStyleDefault.setStyle("BorderType", "solid");
ColorPickerButtonElement.PopupColorPickerStyleDefault.setStyle("BackgroundFill", "#FFFFFF");

////ColorPickerButton default style/////
ColorPickerButtonElement.StyleDefault = new StyleDefinition();
ColorPickerButtonElement.StyleDefault.setStyle("PopupColorPickerStyle", 				ColorPickerButtonElement.PopupColorPickerStyleDefault);
ColorPickerButtonElement.StyleDefault.setStyle("PopupColorPickerDistance", 				-1);			
ColorPickerButtonElement.StyleDefault.setStyle("ColorSwatchClass", 						CanvasElement);
ColorPickerButtonElement.StyleDefault.setStyle("ColorSwatchStyle", 						ColorPickerButtonElement.ColorSwatchStyleDefault); 			


/////////////Public///////////////////////////////

/**
 * @function setHexColor
 * Sets the selected color of the ColorPickerElement.
 * 
 * @param value String
 * RGB hex color value formatted as "#FF0000".
 */	
ColorPickerButtonElement.prototype.setHexColor = 
	function (value)
	{
		this._selectedHexColor = value;
		
		if (this._colorSwatch != null)
			this._colorSwatch.setStyle("BackgroundFill", this._selectedHexColor);
		
		if (this._colorPickerPopup != null)
			this._colorPickerPopup.setHexColor(value);
	};
	
/**
 * @function getHexColor
 * Gets the selected color of the ColorPickerElement.
 * 
 * @returns String
 * RGB hex color value formatted as "#FF0000".
 */		
ColorPickerButtonElement.prototype.getHexColor = 
	function ()
	{
		return this._selectedHexColor;
	};


/////////////Internal///////////////////////////////	
	
//@override
ColorPickerButtonElement.prototype._createPopup = 
	function ()
	{
		this._colorPickerPopup = new ColorPickerElement();
		
		this._colorPickerPopup.addEventListener("changed", this._onColorPickerChangedInstance);	
		this._colorPickerPopup.addEventListener("keydown", this._onColorPickerKeydownInstance);
		this._colorPickerPopup.addEventListener("layoutcomplete", this._onColorPickerLayoutCompleteInstance);
		
		this._applySubStylesToElement("PopupColorPickerStyle", this._colorPickerPopup);
		this._colorPickerPopup.setHexColor(this._selectedHexColor);
		
		return this._colorPickerPopup;
	};	

//@override	
ColorPickerButtonElement.prototype._updateTweenPosition = 
	function (value)
	{
		this._colorPickerPopup.setStyle("Alpha", value);
	};

/**
 * @function _onColorPickerLayoutComplete
 * Event handler for pop up ColorPicker "layoutcomplete". 
 * Updates the pop up size content size is known and determines
 * position the pop up opens depending on available space.
 * 
 * @param event DispatcherEvent
 * DispatcherEvent to process.
 */		
ColorPickerButtonElement.prototype._onColorPickerLayoutComplete =
	function (event)
	{
		this._layoutColorPickerPopup();
	};
	
/**
 * @function _onColorPickerChangedInstance
 * Event handler for pop up ColorPicker "changed" event. 
 * Updates selected color and re-dispatches "changed" event.
 * 
 * @param elementEvent ElementEvent
 * ElementEvent to process.
 */	
ColorPickerButtonElement.prototype._onColorPickerChanged = 
	function (elementEvent)
	{
		this._selectedHexColor = this._colorPickerPopup.getHexColor();
	
		if (this._colorSwatch != null)
			this._colorSwatch.setStyle("BackgroundFill", this._selectedHexColor);
		
		if (this.hasEventListener("changed", null) == true)
			this.dispatchEvent(new ElementEvent("changed", false));
	};

/**
 * @function _onColorPickerKeydown
 * Event handler for pop up ColorPicker "keydown" event. 
 * Closes the pop up when enter or tab is pressed. 
 * 
 * @param elementKeyboardEvent ElementKeyboardEvent
 * ElementKeyboardEvent to process.
 */	
ColorPickerButtonElement.prototype._onColorPickerKeydown = 
	function (elementKeyboardEvent)
	{
		if (elementKeyboardEvent.getKeyCode() == 13 ||
			elementKeyboardEvent.getKeyCode() == 9)
		{
			this.close(true);
			
			//Dispatch closed event.
			if (this.hasEventListener("closed", null) == true)
				this.dispatchEvent(new ElementEvent("closed", false));
		}
	};
	
//@private	
ColorPickerButtonElement.prototype._updateColorSwatch = 
	function ()
	{
		var colorSwatchClass = this.getStyle("ColorSwatchClass");
		
		if (colorSwatchClass == null)
		{
			if (this._colorSwatch != null)
			{
				this._removeChild(this._colorSwatch);
				this._colorSwatch = null;
			}
		}
		else
		{
			if (this._colorSwatch == null || this._colorSwatch.constructor != colorSwatchClass)
			{
				var newColorSwatch = new (colorSwatchClass)();
				
				if (this._colorSwatch != null)
					this._removeChild(this._colorSwatch);
				
				this._colorSwatch = newColorSwatch;

				this._addChild(this._colorSwatch);
			}
			
			this._applySubStylesToElement("ColorSwatchStyle", this._colorSwatch);
			this._colorSwatch.setStyle("BackgroundFill", this._selectedHexColor);
		}
	};

//@override
ColorPickerButtonElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		ColorPickerButtonElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("ColorSwatchClass" in stylesMap || "ColorSwatchStyle" in stylesMap)
		{
			this._updateColorSwatch();
			this._invalidateMeasure();
			this._invalidateLayout();
		}
		
		if ("PopupColorPickerStyle" in stylesMap && this._colorPickerPopup != null)
		{
			this._applySubStylesToElement("PopupColorPickerStyle", this._colorPickerPopup);
			this._invalidateLayout();
		}
		
		if ("PopupColorPickerDistance" in stylesMap)
			this._invalidateLayout();
	};
	
//@override
ColorPickerButtonElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		//We still use the text height for measuring so the sizing is the same as DropDown
		var textHeight = this.getStyle("TextSize") + this.getStyle("TextLinePaddingTop") + this.getStyle("TextLinePaddingBottom");
		
		var arrowWidth = null;
		var arrowHeight = null;
		
		if (this._arrowButton != null)
		{
			arrowWidth = this._arrowButton.getStyle("Width");
			arrowHeight = this._arrowButton.getStyle("Height");
		}
		
		if (arrowHeight == null)
			arrowHeight = textHeight + padHeight;
		if (arrowWidth == null)
			arrowWidth = Math.round(arrowHeight * .85); 
			
		var swatchWidth = null;
		var swatchHeight = null;
		
		if (this._colorSwatch != null)
		{
			swatchWidth = this._colorSwatch.getStyle("Width");
			swatchHeight = this._colorSwatch.getStyle("Height");
		}
		
		if (swatchWidth == null)
			swatchWidth = 60;
		if (swatchHeight == null)
			swatchHeight = textHeight;
		
		var h = Math.max(swatchHeight + padHeight, arrowHeight, textHeight + padHeight);
		var w = padWidth + swatchWidth + arrowWidth;
		
		this._setMeasuredSize(w, h);
	};	
	
/**
 * @function _layoutColorPickerPopup
 * Sizes and positions the ColorPicker pop up.
 */	
ColorPickerButtonElement.prototype._layoutColorPickerPopup = 
	function ()
	{
		//Color picker not displayed - bail.
		if (this._colorPickerPopup == null ||
			this._colorPickerPopup._parent == null || 
			this._colorPickerPopup._layoutInvalid == true)
		{
			return;
		}
	
		var managerMetrics = this.getMetrics(this._manager);
		
		var colorPickerDistance = this.getStyle("PopupColorPickerDistance");
		
		var colorPickerWidth = this._colorPickerPopup.getStyle("Width");
		if (colorPickerWidth == null)
			colorPickerWidth = this._colorPickerPopup._measuredWidth;
		
		var colorPickerHeight = this._colorPickerPopup.getStyle("Height");
		if (colorPickerHeight == null)
			colorPickerHeight = this._colorPickerPopup._measuredHeight;
		
		//Figure out the available space around the button that we have to place the pop up
		var availableBottom = this._manager._height - (managerMetrics._y + managerMetrics._height) - colorPickerDistance;
		var availableTop = managerMetrics._y - colorPickerDistance;
		var availableRight = this._manager._width - managerMetrics._x;
		var availableLeft = managerMetrics._x + managerMetrics._width;
		
		var pickerX = 0;
		var pickerY = 0;
		
		//Open bottom
		if (availableBottom > colorPickerHeight || colorPickerHeight > availableTop)
			pickerY = managerMetrics._y + managerMetrics._height + colorPickerDistance;
		else //Open top
			pickerY = managerMetrics._y - colorPickerHeight - colorPickerDistance;

		//Left aligned
		if (availableRight > colorPickerWidth || colorPickerWidth < availableRight)
			pickerX = managerMetrics._x;
		else //Right aligned
			pickerX = managerMetrics._x + managerMetrics._width - colorPickerWidth;
		
		this._colorPickerPopup.setStyle("X", pickerX);
		this._colorPickerPopup.setStyle("Y", pickerY);
		this._colorPickerPopup.setStyle("Width", colorPickerWidth);
		this._colorPickerPopup.setStyle("Height", colorPickerHeight);
	};
	
//@override	
ColorPickerButtonElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		ColorPickerButtonElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		this._layoutColorPickerPopup();
		
		var x = paddingMetrics.getX();
		var y = paddingMetrics.getY();
		var w = paddingMetrics.getWidth();
		var h = paddingMetrics.getHeight();
		
		var arrowWidth = 0;
		var arrowHeight = 0;
		
		if (this._arrowButton != null)
		{
			arrowWidth = this._arrowButton.getStyle("Width");
			arrowHeight = this._arrowButton.getStyle("Height");
			
			if (arrowHeight == null)
				arrowHeight = this._height;
			if (arrowWidth == null)
				arrowWidth = Math.round(this._height * .85);
			
			if (w < arrowWidth)
			{
				this._arrowButton._setActualSize(0, 0);
				arrowWidth = 0;
				arrowHeight = 0;
			}
			else
			{
				this._arrowButton._setActualPosition(this._width - arrowWidth, y + (h / 2) - (arrowHeight / 2));
				this._arrowButton._setActualSize(arrowWidth, arrowHeight);
			}
		}
		
		if (this._colorSwatch != null)
		{
			var swatchWidth = this._colorSwatch.getStyle("Width");
			var swatchHeight = this._colorSwatch.getStyle("Height");
			
			if (swatchWidth == null)
				swatchWidth = w - arrowWidth;
			if (swatchHeight == null)
				swatchHeight = h;
			
			this._colorSwatch._setActualPosition(x, y + (h / 2) - (swatchHeight / 2));
			this._colorSwatch._setActualSize(swatchWidth, swatchHeight);
		}
	};
	
	