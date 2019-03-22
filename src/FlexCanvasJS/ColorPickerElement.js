
/**
 * @depends CanvasElement.js
 * @depends SolidFill.js
 */

//////////////////////////////////////////////////////////////
///////////////ColorPickerElement/////////////////////////////

/**
 * @class ColorPickerElement
 * @inherits CanvasElement
 * 
 * ColorPickerElement is a class used to select colors.  
 * 
 * @constructor ColorPickerElement 
 * Creates new ColorPickerElement instance.
 */

function ColorPickerElement() //extends CanvasElement
{
	ColorPickerElement.base.prototype.constructor.call(this);
	
	//Setup static fill
	if (ColorPickerElement._HueBarLinearGradient == null)
	{
		ColorPickerElement._HueBarLinearGradientFill = new LinearGradientFill();
		ColorPickerElement._HueBarLinearGradientFill.setStyle("GradientDegrees", 180); //Left to right
		ColorPickerElement._HueBarLinearGradientFill.setStyle("GradientColorStops", [[0,"#FF0000"],[.1666,"#FFFF00"],[.3333,"#00FF00"],[.5,"#00FFFF"],[.6666,"#0000FF"],[.8333,"#FF00FF"],[1,"#FF0000"]]);
	}
	
	//Setup static shape
	if (ColorPickerElement._CaretRoundedRectangleShape == null)
	{
		ColorPickerElement._CaretRoundedRectangleShape = new RoundedRectangleShape();
		ColorPickerElement._CaretRoundedRectangleShape.setStyle("CornerRadiusPercent", 50);
	}
	
	//Hsl background fill for picker area
	this._pickerAreaFill = new HslPickerFill();
	this._pickerAreaFill.setStyle("FillColor", "#FF0000");
	
	/////////////
	
	//Use list container to control layout
	this._rootListContainer = new ListContainerElement();
	this._rootListContainer.setStyle("LayoutGap", 5);
	
		this._hueBar = new CanvasElement();
		this._hueBar.setStyle("BackgroundFill", ColorPickerElement._HueBarLinearGradientFill);
		this._hueBar.setStyle("PercentWidth", 100);
		this._hueBar.setStyle("PercentHeight", 12);
		
		this._pickerAreaBorderContainer = new AnchorContainerElement();
		this._pickerAreaBorderContainer.setStyle("BorderType", "solid");
		this._pickerAreaBorderContainer.setStyle("BorderColor", "#CFCFCF");
		this._pickerAreaBorderContainer.setStyle("PercentWidth", 100);
		this._pickerAreaBorderContainer.setStyle("PercentHeight", 88);
		
			this._pickerArea = new CanvasElement();
			this._pickerArea.setStyle("BackgroundFill", this._pickerAreaFill);
			this._pickerArea.setStyle("Top", 1);
			this._pickerArea.setStyle("Bottom", 1);
			this._pickerArea.setStyle("Left", 1);
			this._pickerArea.setStyle("Right", 1);
			
		this._pickerAreaBorderContainer.addElement(this._pickerArea);
		
		this._colorSelectionContainer = new ListContainerElement();
		this._colorSelectionContainer.setStyle("LayoutDirection", "horizontal");
		this._colorSelectionContainer.setStyle("LayoutGap", 10);
		this._colorSelectionContainer.setStyle("PercentWidth", 100);
			
			this._textInputColor = new TextInputElement();
			this._textInputColor.setStyle("MaxChars", 7);
			this._textInputColor.setText("#FF0000");
			
			this._selectedColorSwatch = new CanvasElement();
			this._selectedColorSwatch.setStyle("PercentHeight", 100);
			this._selectedColorSwatch.setStyle("PercentWidth", 100);
			this._selectedColorSwatch.setStyle("BorderType", "solid");
			this._selectedColorSwatch.setStyle("BorderColor", "#CFCFCF");
			this._selectedColorSwatch.setStyle("BackgroundFill", "#FF0000");
			
		this._colorSelectionContainer.addElement(this._textInputColor);
		this._colorSelectionContainer.addElement(this._selectedColorSwatch);	
			
	this._rootListContainer.addElement(this._hueBar);
	this._rootListContainer.addElement(this._pickerAreaBorderContainer);
	this._rootListContainer.addElement(this._colorSelectionContainer);

	//Put carets on top, we position these per current selection via _doLayout()
	this._hueCaret = new CanvasElement();
	this._hueCaret.setStyle("MouseEnabled", false);
	this._hueCaret.setStyle("BorderType", "solid");
	this._hueCaret.setStyle("BackgroundFill", "#FFFFFF");
	
	this._pickerCaret = new AnchorContainerElement();
	this._pickerCaret.setStyle("MouseEnabled", false);
	this._pickerCaret.setStyle("BackgroundShape", ColorPickerElement._CaretRoundedRectangleShape);
	this._pickerCaret.setStyle("BorderType", "solid");
	this._pickerCaret.setStyle("BorderColor", "#FFFFFF");
		
		this._pickerCaretInner = new CanvasElement();
		this._pickerCaretInner.setStyle("MouseEnabled", false);
		this._pickerCaretInner.setStyle("BackgroundShape", ColorPickerElement._CaretRoundedRectangleShape);
		this._pickerCaretInner.setStyle("BorderType", "solid");
		this._pickerCaretInner.setStyle("BorderColor", "#444444");
		this._pickerCaretInner.setStyle("Top", 1);
		this._pickerCaretInner.setStyle("Bottom", 1);
		this._pickerCaretInner.setStyle("Left", 1);
		this._pickerCaretInner.setStyle("Right", 1);
	
	this._pickerCaret.addElement(this._pickerCaretInner);	
		
	this._addChild(this._rootListContainer);
	this._addChild(this._hueCaret);
	this._addChild(this._pickerCaret);

	
	///////Event Handlers///////////
	
	//Private event handlers, different instance needed for each ColorPicker, proxy to prototype
	
	var _self = this;
	
	this._onRootListContainerLayoutCompleteInstance = 
		function (event)
		{
			_self._onRootListContainerLayoutComplete(event);
		};
	this._onTextInputColorMeasureCompleteInstance = 
		function (event)
		{
			_self._onTextInputColorMeasureComplete();
		};
	this._onHueBarMouseDownInstance = 
		function (mouseEvent)
		{
			_self._onHueBarMouseDown(mouseEvent);
		};
	this._onHueBarMouseMoveExInstance = 
		function (mouseEvent)
		{
			_self._onHueBarMouseMoveEx(mouseEvent);
		};
	this._onHueBarMouseUpInstance = 
		function (mouseEvent)
		{
			_self._onHueBarMouseUp(mouseEvent);
		};
	this._onPickerAreaMouseDownInstance = 
		function (mouseEvent)
		{
			_self._onPickerAreaMouseDown(mouseEvent);
		};
	this._onPickerAreaMouseMoveExInstance = 
		function (mouseEvent)
		{
			_self._onPickerAreaMouseMoveEx(mouseEvent);
		};
	this._onPickerAreaMouseUpInstance = 
		function (mouseEvent)
		{
			_self._onPickerAreaMouseUp(mouseEvent);
		};	
	this._onTextInputColorChangedInstance = 
		function (event)
		{
			_self._onTextInputColorChanged(event);
		};
		
	//For adjusting caret position when the list container finishes layout	
	this._rootListContainer.addEventListener("layoutcomplete", this._onRootListContainerLayoutCompleteInstance);	
		
	//We're tweaking the TextInput's measured width
	this._textInputColor.addEventListener("measurecomplete", this._onTextInputColorMeasureCompleteInstance);	
	this._textInputColor.addEventListener("changed", this._onTextInputColorChangedInstance);
	
	this._hueBar.addEventListener("mousedown", this._onHueBarMouseDownInstance);
	this._hueBar.addEventListener("mouseup", this._onHueBarMouseUpInstance);
	
	this._pickerArea.addEventListener("mousedown", this._onPickerAreaMouseDownInstance);
	this._pickerArea.addEventListener("mouseup", this._onPickerAreaMouseUpInstance);
	
	
	////////////////////////////////
	
	this._selectedHue = 0;
	this._selectedSat = 0;
	this._selectedLight = 0;
}

//Inherit from CanvasElement
ColorPickerElement.prototype = Object.create(CanvasElement.prototype);
ColorPickerElement.prototype.constructor = ColorPickerElement;
ColorPickerElement.base = CanvasElement;


////////////Events/////////////////////////////////////

/**
 * @event changed ElementEvent
 * 
 * Dispatched when the ColorPicker's selection state changes as a result of user interaction.
 */

/////////////Style Types///////////////////////////////

ColorPickerElement._StyleTypes = Object.create(null);

/**
 * @style TextInputColorStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to the TextInput color element.
 */
ColorPickerElement._StyleTypes.TextInputColorStyle = 			StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition


////////////Default Styles/////////////////////////////

ColorPickerElement.StyleDefault = new StyleDefinition();

ColorPickerElement.StyleDefault.setStyle("TextInputColorStyle", 	null);

ColorPickerElement.StyleDefault.setStyle("PaddingLeft", 			5);
ColorPickerElement.StyleDefault.setStyle("PaddingRight", 			5);
ColorPickerElement.StyleDefault.setStyle("PaddingBottom", 			5);
ColorPickerElement.StyleDefault.setStyle("PaddingTop", 				5);


/////////////Static////////////////////

//Static Internal, all color pickers can use the same fill/shape instances
ColorPickerElement._HueBarLinearGradientFill = null;
ColorPickerElement._CaretRoundedRectangleShape = null;

/**
 * @function rgbToHex
 * @static
 * Converts RGB values to hex format.
 * 
 * @param r Number
 * Value of the red channel (0-255)
 * 
 * @param g Number
 * Value of the green channel (0-255)
 * 
 * @param b Number
 * Value of the blue channel (0-255)
 * 
 * @returns String
 * Hex string value formatted like "#FF0000"
 */
ColorPickerElement.rgbToHex = 
	function (r, g, b)
	{
		var rx = r.toString(16);
		var gx = g.toString(16);
		var bx = b.toString(16);
		
		if (r < 16) 
			rx = '0' + rx;
		
		if (g < 16) 
			gx = '0' + gx;
		
		if (b < 16) 
			bx = '0' + bx;
		
		var result = '#' + rx + gx + bx;
		
		return result.toUpperCase();
	};

/**
 * @function rgbToHsl
 * @static
 * Converts RGB values to HSL values.
 * 
 * @param r Number
 * Value of the red channel (0-255)
 * 
 * @param g Number
 * Value of the green channel (0-255)
 * 
 * @param b Number
 * Value of the blue channel (0-255)
 * 
 * @returns Object
 * An object {h:0, s:0, l:0} containing h, s, and l  
 * properties representing hue, saturation, and lightness.
 * Note that fractional HSL values may be returned.
 */	
ColorPickerElement.rgbToHsl = 
	function (r, g, b) 
	{
		var red = r / 255;
		var green = g / 255;
		var blue = b / 255;

		var cmax = Math.max(red, green, blue);
		var cmin = Math.min(red, green, blue);
		var delta = cmax - cmin;
		
		var hue = 0;
		var sat = 0;
		var light = (cmax + cmin) / 2;
		
		var X = (1 - Math.abs(2 * light - 1));

		if (delta != 0)
		{
			if (cmax == red) 
				hue = ((green - blue) / delta);
			
			if (cmax == green)
				hue = 2 + ((blue - red) / delta);
			
			if (cmax == blue)
				hue = 4 + ((red - green) / delta);
			
			if (cmax != 0) 
				sat = delta / X;
		}

		var result = {h:0, s:0, l:0};
		
		result.h = CanvasElement.normalizeDegrees(60 * hue);
		result.s = sat * 100;
		result.l = light * 100;

		return result;
};	
	
/**
 * @function hslToRgb
 * @static
 * Converts HSL values to RGB values. Fractional HSL 
 * values are allowed.
 * 
 * @param h Number
 * Value of the hue (0 - 360)
 * 
 * @param s Number
 * Value of the saturation (0-100)
 * 
 * @param l Number
 * Value of lightness (0-100)
 * 
 * @returns Object
 * An object {r:0, g:0, b:0} containing r, g, and b  
 * properties representing red, green, and blue channels.
 */
ColorPickerElement.hslToRgb = 
	function (h, s, l) 
	{
		var sat = s / 100;
		var light = l / 100;
		var hue = h / 60;
		
		var c = sat * (1 - Math.abs(2 * light - 1));
		var x = c * (1 - Math.abs(hue % 2 - 1));
		var m = light - (c / 2);
	
		c = Math.trunc((c + m) * 255);
		x = Math.trunc((x + m) * 255);
		m = Math.trunc(m * 255);
	
		if (hue >= 0 && hue < 1)
			return {r:c, g:x, b:m};
		
		if (hue >= 1 && hue < 2)
			return {r:x, g:c, b:m};
			
		if (hue >= 2 && hue < 3)
			return {r:m, g:c, b:x};
		
		if (hue >= 3 && hue < 4)
			return {r:m, g:x, b:c};
			
		if (hue >= 4 && hue < 5)
			return {r:x, g:m, b:c};
			
		//if (hue >= 5 && hue <= 6)
			return {r:c, g:m, b:x};
	};


////////////Public////////////////
	
/**
 * @function setHexColor
 * Sets the selected color of the ColorPickerElement.
 * 
 * @param value String
 * RGB hex color value formatted as "#FF0000".
 */	
ColorPickerElement.prototype.setHexColor = 
	function (value)
	{
		this._textInputColor.setText(value);
		value = this._fixInvalidHexColor(value);
	
		//Get rgb from hex
		var r = parseInt(value.substr(1, 2), 16);
		var g = parseInt(value.substr(3, 2), 16);
		var b = parseInt(value.substr(5, 2), 16);
		
		//Translate to hsl
		var hsl = ColorPickerElement.rgbToHsl(r, g, b);
		
		//Update selection
		this._selectedHue = hsl.h;
		this._selectedSat = hsl.s;
		this._selectedLight = hsl.l;
		
		//Fix UI
		this._updateSelectedHue();
		this._selectedColorSwatch.setStyle("BackgroundFill", value);
	};
	
/**
 * @function getHexColor
 * Gets the selected color of the ColorPickerElement.
 * 
 * @returns String
 * RGB hex color value formatted as "#FF0000".
 */		
ColorPickerElement.prototype.getHexColor = 
	function ()
	{
		return this._fixInvalidHexColor(this._textInputColor.getText());
	};
	
	
////////////Internal//////////////
	
//@private	
ColorPickerElement.prototype._fixInvalidHexColor = 
	function (value)
	{
		value = value.toUpperCase();
	
		if (value.length == 0)
			value = "#";
		
		//Make sure the "#" token is present
		if (value[0] != "#")
			value = "#" + value;
		
		//Too short - pad zeros
		while (value.length < 7)
			value = value + "0";
		
		//Too long - truncate
		if (value.length > 7)
			value = value.slice(0, 7);
		
		//Replace invalid characters with "F"
		for (var i = 1; i < value.length; i++)
		{
			if (value[i] != "0" && 
				value[i] != "1" &&
				value[i] != "2" &&
				value[i] != "3" &&
				value[i] != "4" &&
				value[i] != "5" &&
				value[i] != "6" &&
				value[i] != "7" &&
				value[i] != "8" &&
				value[i] != "9" &&
				value[i] != "A" &&
				value[i] != "B" &&
				value[i] != "C" &&
				value[i] != "D" &&
				value[i] != "E" &&
				value[i] != "F")
			{
				value[i] = "F";
			}
		}
		
		return value;
	};	
	
//@private - Root list's layout complete handler, adjusts caret positions.
ColorPickerElement.prototype._onRootListContainerLayoutComplete = 
	function (event)
	{
		this._layoutCarets();
	};
	
//@private - Adjust the TextInput measured width based on font size
ColorPickerElement.prototype._onTextInputColorMeasureComplete = 
	function (event)
	{
		var textInputPadding = this._textInputColor._getPaddingSize();
		var textWidth = CanvasElement._measureText("#BBBBBB", this._textInputColor._getFontString());
		
		var textInputWidth = textWidth + textInputPadding.width + 10;
		var textInputHeight = this._textInputColor._getStyledOrMeasuredHeight();
		
		this._textInputColor._setMeasuredSize(textInputWidth, textInputHeight);
	};

/**
 * @function _onHueBarMouseDown
 * Event handler for the hue bar's "mousedown" event. 
 * Updates the ColorPicker's selected hue & color and dispatches changed event.
 * 
 * @param elementMouseEvent ElementMouseEvent
 * The ElementMouseEvent to process.
 */		
ColorPickerElement.prototype._onHueBarMouseDown =
	function (elementMouseEvent)
	{
		//Listen for global mouse movement
		if (this.hasEventListener("mousemoveex", this._onHueBarMouseMoveExInstance) == false)
			this.addEventListener("mousemoveex", this._onHueBarMouseMoveExInstance);
		
		//Infer the hue via the mouse position
		var hue = (elementMouseEvent.getX() / this._hueBar._width) * 360;
		
		//Update hue
		if (hue != this._selectedHue)
		{
			this._selectedHue = hue;
			
			//Fix UI for new hue
			this._updateSelectedHue();
			this._updateSelectedColor();
			
			//Dispatch changed event.
			if (this.hasEventListener("changed", null) == true)
				this.dispatchEvent(new ElementEvent("changed", false));
		}
	};
	
/**
 * @function _onHueBarMouseMoveEx
 * Event handler for the hue bar's "mousemoveex" event. 
 * Updates the ColorPicker's selected hue & color and dispatches changed event.
 * 
 * @param elementMouseEvent ElementMouseEvent
 * The ElementMouseEvent to process.
 */		
ColorPickerElement.prototype._onHueBarMouseMoveEx = 
	function (elementMouseEvent)
	{
		//Translate global (Canvas based) mouse position to the position within the hue bar
		var mousePoint = {x:elementMouseEvent.getX(), y:elementMouseEvent.getY()};
		this._hueBar.translatePointFrom(mousePoint, this._manager);
	
		//Mouse is out of bounds, cap it
		if (mousePoint.x < 0)
			mousePoint.x = 0;
		if (mousePoint.x > this._hueBar._width)
			mousePoint.x = this._hueBar._width;
		
		//Infer hue via the mouse position
		var hue = (mousePoint.x / this._hueBar._width) * 360;
		
		//Update hue
		if (hue != this._selectedHue)
		{
			this._selectedHue = hue;
			
			//Fix UI for new hue
			this._updateSelectedHue();
			this._updateSelectedColor();
			
			//Dispatch changed event.
			if (this.hasEventListener("changed", null) == true)
				this.dispatchEvent(new ElementEvent("changed", false));
		}
	};
	
/**
 * @function _onHueBarMouseUp
 * Event handler for the hue bar's "mouseup" event. 
 * 
 * @param elementMouseEvent ElementMouseEvent
 * The ElementMouseEvent to process.
 */	
ColorPickerElement.prototype._onHueBarMouseUp = 
	function (elementMouseEvent)
	{
		//Remove global mouse listener
		if (this.hasEventListener("mousemoveex", this._onHueBarMouseMoveExInstance) == true)
			this.removeEventListener("mousemoveex", this._onHueBarMouseMoveExInstance);
	};	
	
/**
 * @function _updateSelectedHue
 * Updates the picker area's background hue.  
 */
ColorPickerElement.prototype._updateSelectedHue =
	function ()
	{
		//Get color of current hue
		var rgb = ColorPickerElement.hslToRgb(this._selectedHue, 100, 50);
		var rgbX = ColorPickerElement.rgbToHex(rgb.r, rgb.g, rgb.b);
		
		//Set picker area hue
		this._pickerAreaFill.setStyle("FillColor", rgbX);
		this._invalidateLayout();	//Need to move caret
	};
	
/**
 * @function _onPickerAreaMouseDown
 * Event handler for the picker area's "mousedown" event. 
 * Updates the ColorPicker's selected color and dispatches changed event.
 * 
 * @param elementMouseEvent ElementMouseEvent
 * The ElementMouseEvent to process.
 */		
ColorPickerElement.prototype._onPickerAreaMouseDown = 
	function (elementMouseEvent)
	{
		//Add global mouse move listener
		if (this.hasEventListener("mousemoveex", this._onPickerAreaMouseMoveExInstance) == false)
			this.addEventListener("mousemoveex", this._onPickerAreaMouseMoveExInstance);
	
		//Infer saturation and lightness via mouse position
		this._selectedSat = (elementMouseEvent.getX() / this._pickerArea._width) * 100;
		this._selectedLight = 100 - ((elementMouseEvent.getY() / this._pickerArea._height) * 100);
		
		//Fix UI for new color
		this._updateSelectedColor();
		
		//Dispatch changed event.
		if (this.hasEventListener("changed", null) == true)
			this.dispatchEvent(new ElementEvent("changed", false));
	};
	
/**
 * @function _onPickerAreaMouseMoveEx
 * Event handler for the picker area's "mousemoveex" event. 
 * Updates the ColorPicker's selected color and dispatches changed event.
 * 
 * @param elementMouseEvent ElementMouseEvent
 * The ElementMouseEvent to process.
 */		
ColorPickerElement.prototype._onPickerAreaMouseMoveEx = 
	function (elementMouseEvent)
	{
		//Translate global (Canvas based) mouse position to the position within the picker area
		var mousePoint = {x:elementMouseEvent.getX(), y:elementMouseEvent.getY()};
		this._pickerArea.translatePointFrom(mousePoint, this._manager);
	
		//Mouse is out of bounds - cap it
		if (mousePoint.x < 0)
			mousePoint.x = 0;
		if (mousePoint.x > this._pickerArea._width)
			mousePoint.x = this._pickerArea._width;
		
		if (mousePoint.y < 0)
			mousePoint.y = 0;
		if (mousePoint.y > this._pickerArea._height)
			mousePoint.y = this._pickerArea._height;
		
		//Infer saturation and lightness via mouse position
		this._selectedSat = (mousePoint.x / this._pickerArea._width) * 100;
		this._selectedLight = 100 - ((mousePoint.y / this._pickerArea._height) * 100);
		
		//Fix UI for new color
		this._updateSelectedColor();
		
		//Dispatch changed event.
		if (this.hasEventListener("changed", null) == true)
			this.dispatchEvent(new ElementEvent("changed", false));
	};	
	
/**
 * @function _onPickerAreaMouseUp
 * Event handler for the picker area's "mouseup" event. 
 * 
 * @param elementMouseEvent ElementMouseEvent
 * The ElementMouseEvent to process.
 */	
ColorPickerElement.prototype._onPickerAreaMouseUp = 
	function (elementMouseEvent)
	{
		//Remove global mouse listener
		if (this.hasEventListener("mousemoveex", this._onPickerAreaMouseMoveExInstance) == true)
			this.removeEventListener("mousemoveex", this._onPickerAreaMouseMoveExInstance);
	};	
	
/**
 * @function _updateSelectedColor
 * Updates the selected color swatch and TextInput text.  
 */
ColorPickerElement.prototype._updateSelectedColor = 
	function ()
	{
		//Translate hsl color selection to hex rgb string
		var rgb = ColorPickerElement.hslToRgb(this._selectedHue, this._selectedSat, this._selectedLight);
		var rgbX = ColorPickerElement.rgbToHex(rgb.r, rgb.g, rgb.b);
		
		//Fix UI
		this._selectedColorSwatch.setStyle("BackgroundFill", rgbX);
		this._textInputColor.setText(rgbX);
		this._invalidateLayout();	//Need to move caret
	};
	
/**
 * @function _onTextInputColorChanged
 * Event handler for the text input's "changed" event. 
 * Updates the picker's selected color.
 * 
 * @param elementEvent ElementEvent
 * The ElementEvent to process.
 */		
ColorPickerElement.prototype._onTextInputColorChanged = 
	function (elementEvent)
	{
		this.setHexColor(this._textInputColor.getText());
		
		//Dispatch changed event.
		if (this.hasEventListener("changed", null) == true)
			this.dispatchEvent(new ElementEvent("changed", false));
	};
	
//@override
ColorPickerElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		ColorPickerElement.base.prototype._doStylesUpdated.call(this, stylesMap);
	
		if ("TextInputColorStyle" in stylesMap)
			this._applySubStylesToElement("TextInputColorStyle", this._textInputColor);
	};	

//@override
ColorPickerElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		var textInputHeight = this._textInputColor._getStyledOrMeasuredHeight();
		var totalGap = this._rootListContainer.getStyle("LayoutGap") * (this._rootListContainer.getNumElements() - 1);
		
		//176 x 176 measured picker area, 176 x 24 measured hue bar
		return {width:padWidth + 176, height:padHeight + 24 + 176 + textInputHeight + totalGap};
	};

/**
 * @function _layoutCarets
 * Sizes and positions the hue bar and picker area carets.
 */
ColorPickerElement.prototype._layoutCarets = 
	function ()
	{
		//Hue caret
		this._hueCaret._setActualSize(4, this._hueBar._height + 2);
		
		var hueCaretPos = {x:0, y:-1};
		hueCaretPos.x = (this._selectedHue / 360) * this._hueBar._width;
		this.translatePointFrom(hueCaretPos, this._hueBar);
		
		hueCaretPos.x = Math.round(hueCaretPos.x - (this._hueCaret._width / 2));
		
		this._hueCaret._setActualPosition(hueCaretPos.x, hueCaretPos.y);
		
		//Picker caret
		this._pickerCaret._setActualSize(12, 12);
	
		var pickerCaretPos = {x:0, y:0};
		pickerCaretPos.x = (this._selectedSat / 100) * this._pickerArea._width;
		pickerCaretPos.y = ((100 - this._selectedLight) / 100) * this._pickerArea._height;
		this.translatePointFrom(pickerCaretPos, this._pickerArea);
		
		pickerCaretPos.x = Math.round(pickerCaretPos.x - (this._pickerCaret._width / 2));
		pickerCaretPos.y = Math.round(pickerCaretPos.y - (this._pickerCaret._height / 2));
		
		this._pickerCaret._setActualPosition(pickerCaretPos.x, pickerCaretPos.y);
	};
	
//@override	
ColorPickerElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		ColorPickerElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		var x = paddingMetrics.getX();
		var y = paddingMetrics.getY();
		var w = paddingMetrics.getWidth();
		var h = paddingMetrics.getHeight();
		
		this._rootListContainer._setActualSize(w, h);
		this._rootListContainer._setActualPosition(x, y);
		
		this._layoutCarets();
	};	
	
	
/////////////HslPickerFill//////////////////////
	
//@private
function HslPickerFill() //Extends SolidFill
{
	HslPickerFill.base.prototype.constructor.call(this);
}

//Inherit from SolidFill
HslPickerFill.prototype = Object.create(SolidFill.prototype);
HslPickerFill.prototype.constructor = HslPickerFill;
HslPickerFill.base = SolidFill;

//@override
HslPickerFill.prototype.drawFill = 
	function (ctx, metrics)
	{
		//Do solid fill
		HslPickerFill.base.prototype.drawFill.call(this, ctx, metrics);
	
		var x = metrics.getX();
		var y = metrics.getY();
		var w = metrics.getWidth();
		var h = metrics.getHeight();
		
		var gradient;
		
		//Do saturation fill
		gradient = ctx.createLinearGradient(x, y, x + w, y);
		gradient.addColorStop(0, "hsla(0, 0%, 50%, 1)");
		gradient.addColorStop(1, "hsla(0, 0%, 50%, 0)");
		
		ctx.fillStyle = gradient;
		ctx.fill();
		
		//Do lightness fills
		gradient = ctx.createLinearGradient(x, y, x, y + h);
		gradient.addColorStop(0, "hsla(0, 0%, 100%, 1)");
		gradient.addColorStop(.5, "hsla(0, 0%, 100%, 0)");
		
		ctx.fillStyle = gradient;
		ctx.fill();
		
		gradient = ctx.createLinearGradient(x, y, x, y + h);
		gradient.addColorStop(.5, "hsla(0, 0%, 0%, 0)");
		gradient.addColorStop(1, "hsla(0, 0%, 0%, 1)");
		
		ctx.fillStyle = gradient;
		ctx.fill();
	};	
	