
/**
 * @depends CanvasElement.js
 * @depends ButtonElement.js
 * @depends DropdownArrowButtonSkinElement.js
 * @depends Tween.js
 */

//////////////////////////////////////////////////////////////
///////////////ColorPickerButtonElement///////////////////////

/**
 * @class ColorPickerButtonElement
 * @inherits ButtonElement
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
	this._arrowButton = null;
	
	this._colorPickerPopup = new CanvasElement();
	this._colorPicker = new ColorPickerElement();
	this._colorPickerPopup._addChild(this._colorPicker);
	
	this._openCloseTween = null;
	
	var _self = this;
	
	//Private event listeners, need an instance for each ColorPickerButton, proxy to prototype.
		
	this._onColorButtonManagerCaptureEventInstance = 
		function (event)
		{
			_self._onColorButtonManagerCaptureEvent(event);
		};
	this._onColorButtonManagerResizeEventInstance = 
		function (event)
		{
			_self._onColorButtonManagerResizeEvent(event);
		};
	this._onColorButtonEnterFrameInstance = 
		function (event)
		{
			_self._onColorButtonEnterFrame(event);
		};
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
		
	this._colorPicker.addEventListener("changed", this._onColorPickerChangedInstance);	
	this._colorPicker.addEventListener("keydown", this._onColorPickerKeydownInstance);
	this._colorPicker.addEventListener("layoutcomplete", this._onColorPickerLayoutCompleteInstance);
}

//Inherit from ButtonElement
ColorPickerButtonElement.prototype = Object.create(ButtonElement.prototype);
ColorPickerButtonElement.prototype.constructor = ColorPickerButtonElement;
ColorPickerButtonElement.base = ButtonElement;

////////////Events///////////////////////////////

/**
 * @event changed ElementEvent
 * Dispatched when the color selection changes as a result of user input.
 * 
 * @event opened ElementEvent
 * Dispatched when the ColorPicker pop up is opened as a result of user input.
 * 
 * @event closed ElementEvent
 * Dispatched when the ColorPicker pop up is closed as a result of user input.
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
 * @style ArrowButtonClass CanvasElement
 * 
 * The CanvasElement or subclass constructor to be used for the arrow icon. Defaults to Button. 
 * Note that ColorPickerButton proxies its SkinState style to the arrow button so the arrow 
 * will change states with the ColorPickerButton.
 */
ColorPickerButtonElement._StyleTypes.ArrowButtonClass = 				StyleableBase.EStyleType.NORMAL; 		// CanvasElement constructor

/**
 * @style ArrowButtonStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to the arrow icon class.
 */
ColorPickerButtonElement._StyleTypes.ArrowButtonStyle = 				StyleableBase.EStyleType.SUBSTYLE; 		// StyleDefinition

/**
 * @style OpenCloseTweenDuration Number
 * 
 * Duration in milliseconds the open and close animation should run.
 */
ColorPickerButtonElement._StyleTypes.OpenCloseTweenDuration = 			StyleableBase.EStyleType.NORMAL; 		// number (milliseconds)

/**
 * @style OpenCloseTweenEasingFunction Function
 * 
 * Easing function used on the open and close animations. Defaults to Tween.easeInOutSine().
 */
ColorPickerButtonElement._StyleTypes.OpenCloseTweenEasingFunction = 	StyleableBase.EStyleType.NORMAL; 		// function (fraction) { return fraction} - see Tween.easing

/**
 * @style PopupColorPickerDistance Number
 * 
 * Vertican distance in pixels to place the ColorPicker pop up from the button.
 * Defaults to -1 to collapse default 1 pixel borders
 */
ColorPickerButtonElement._StyleTypes.PopupColorPickerDistance = 		StyleableBase.EStyleType.NORMAL; 		


////////////Default Styles////////////////////

/////Arrow default skin styles//////
ColorPickerButtonElement.ArrowButtonSkinStyleDefault = new StyleDefinition();
ColorPickerButtonElement.ArrowButtonSkinStyleDefault.setStyle("BorderType", 					null);
ColorPickerButtonElement.ArrowButtonSkinStyleDefault.setStyle("BackgroundFill", 				null);
ColorPickerButtonElement.ArrowButtonSkinStyleDefault.setStyle("PaddingLeft", 					6);

ColorPickerButtonElement.ArrowButtonDisabledSkinStyleDefault = new StyleDefinition();
ColorPickerButtonElement.ArrowButtonDisabledSkinStyleDefault.setStyle("BorderType", 			null);
ColorPickerButtonElement.ArrowButtonDisabledSkinStyleDefault.setStyle("BackgroundFill", 		null);
ColorPickerButtonElement.ArrowButtonDisabledSkinStyleDefault.setStyle("ArrowColor", 			"#888888");
ColorPickerButtonElement.ArrowButtonDisabledSkinStyleDefault.setStyle("LineColor", 				"#888888");
ColorPickerButtonElement.ArrowButtonDisabledSkinStyleDefault.setStyle("PaddingLeft", 			5);


/////Arrow default style///////
ColorPickerButtonElement.ArrowButtonStyleDefault = new StyleDefinition();
ColorPickerButtonElement.ArrowButtonStyleDefault.setStyle("SkinClass", 					DropdownArrowButtonSkinElement);

//Note that SkinState is proxied to the arrow button, so the arrow will change state along with the Button (unless you turn mouse back on)
ColorPickerButtonElement.ArrowButtonStyleDefault.setStyle("MouseEnabled", 				false);

ColorPickerButtonElement.ArrowButtonStyleDefault.setStyle("UpSkinStyle", 				ColorPickerButtonElement.ArrowButtonSkinStyleDefault);
ColorPickerButtonElement.ArrowButtonStyleDefault.setStyle("OverSkinStyle", 				ColorPickerButtonElement.ArrowButtonSkinStyleDefault);
ColorPickerButtonElement.ArrowButtonStyleDefault.setStyle("DownSkinStyle", 				ColorPickerButtonElement.ArrowButtonSkinStyleDefault);
ColorPickerButtonElement.ArrowButtonStyleDefault.setStyle("DisabledSkinStyle", 			ColorPickerButtonElement.ArrowButtonDisabledSkinStyleDefault);


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
ColorPickerButtonElement.StyleDefault.setStyle("PaddingTop",							3);
ColorPickerButtonElement.StyleDefault.setStyle("PaddingBottom",							3);
ColorPickerButtonElement.StyleDefault.setStyle("PaddingRight",							4);
ColorPickerButtonElement.StyleDefault.setStyle("PaddingLeft",							4);
ColorPickerButtonElement.StyleDefault.setStyle("PopupColorPickerStyle", 				ColorPickerButtonElement.PopupColorPickerStyleDefault);
ColorPickerButtonElement.StyleDefault.setStyle("PopupColorPickerDistance", 				-1);			
ColorPickerButtonElement.StyleDefault.setStyle("ColorSwatchClass", 						CanvasElement);
ColorPickerButtonElement.StyleDefault.setStyle("ColorSwatchStyle", 						ColorPickerButtonElement.ColorSwatchStyleDefault); 			
ColorPickerButtonElement.StyleDefault.setStyle("ArrowButtonClass", 						ButtonElement); 								// Element constructor
ColorPickerButtonElement.StyleDefault.setStyle("ArrowButtonStyle", 						ColorPickerButtonElement.ArrowButtonStyleDefault); 		// StyleDefinition
ColorPickerButtonElement.StyleDefault.setStyle("OpenCloseTweenDuration", 				150); 											// number (milliseconds)
ColorPickerButtonElement.StyleDefault.setStyle("OpenCloseTweenEasingFunction", 			Tween.easeInOutSine); 							// function (fraction) { return fraction}


/////////Style Proxy Maps/////////////////////////////

//Proxy map for styles we want to pass to the arrow button.
ColorPickerButtonElement._ChildButtonProxyMap = Object.create(null);
ColorPickerButtonElement._ChildButtonProxyMap.SkinState = 						true;
ColorPickerButtonElement._ChildButtonProxyMap._Arbitrary = 						true;


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
		this._colorPicker.setHexColor(value);
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
	return this._colorPicker.getHexColor();
};

/**
 * @function open
 * Opens the pop up ColorPicker.
 * 
 * @param animate boolean
 * When true animates the appearance of the pop-up ColorPicker.
 */	
ColorPickerButtonElement.prototype.open = 
	function (animate)
	{
		if (this._manager == null)
			return;
	
		//Add the pop-up ColorPicker. Wait for layoutcomplete to adjust positioning and size (will set _openDirection)
		var added = this._addColorPickerPopup(); 
		
		var tweenDuration = this.getStyle("OpenCloseTweenDuration");
		
		if (animate == false || tweenDuration <= 0)
		{
			if (this._openCloseTween != null) //Tween running (kill it)
				this._endOpenCloseTween();
			
			this._updateTweenPosition(1);	//Immediately show
		}
		else
		{
			if (this._openCloseTween != null) //Tween running
			{
				if (this._openCloseTween.startVal == 1) //Reverse if closing, ignore if opening.
					this._reverseTween();
			}
			else if (added == true) //Only add tween if pop up did not already exist
			{
				this._openCloseTween = new Tween();
				this._openCloseTween.startVal = 0; 
				this._openCloseTween.endVal = 1;	
				this._openCloseTween.duration = tweenDuration;
				this._openCloseTween.startTime = Date.now();
				this._openCloseTween.easingFunction = this.getStyle("OpenCloseTweenEasingFunction");
				
				this.addEventListener("enterframe", this._onColorButtonEnterFrameInstance);
			}
		}
	};
	
/**
 * @function close
 * Closes the pop up ColorPicker.
 * 
 * @param animate boolean
 * When true animates the disappearance of the pop-up ColorPicker.
 */		
ColorPickerButtonElement.prototype.close = 
	function (animate)
	{
		var tweenDuration = this.getStyle("OpenCloseTweenDuration");
	
		if (animate == false || tweenDuration <= 0)
		{
			this._endOpenCloseTween();		
			this._removeColorPickerPopup();
		}
		else 
		{
			if (this._openCloseTween != null) //Tween running
			{
				if (this._openCloseTween.startVal == 0) //Reverse if opening, ignore if closing.
					this._reverseTween();
			}
			else if (this._colorPickerPopup._parent != null) 
			{
				this._openCloseTween = new Tween();
				this._openCloseTween.startVal = 1;
				this._openCloseTween.endVal = 0;
				this._openCloseTween.duration = tweenDuration;
				this._openCloseTween.startTime = Date.now();
				this._openCloseTween.easingFunction = this.getStyle("OpenCloseTweenEasingFunction");
				
				this.addEventListener("enterframe", this._onColorButtonEnterFrameInstance);
			}
		}
	};

	
/////////////Internal///////////////////////////////	
	
/**
 * @function _removeColorPickerPopup
 * Removes the pop up ColorPicker and cleans up event listeners.
 * 
 * @returns bool
 * Returns true if the pop up was removed, false if the pop up does not exist.
 */	
ColorPickerButtonElement.prototype._removeColorPickerPopup = 
	function ()
	{
		if (this._colorPickerPopup._parent == null)
			return false;
	
		this._colorPickerPopup._manager.removeCaptureListener("wheel", this._onColorButtonManagerCaptureEventInstance);
		this._colorPickerPopup._manager.removeCaptureListener("mousedown", this._onColorButtonManagerCaptureEventInstance);
		this._colorPickerPopup._manager.removeEventListener("resize", this._onColorButtonManagerResizeEventInstance);
		
		this._colorPickerPopup._manager.removeElement(this._colorPickerPopup);
		
		return true;
	};

/**
 * @function _addColorPickerPopup
 * Adds the pop ColorPicker and registers event listeners.
 * 
 * @returns bool
 * Returns true if the pop up was added, false if the pop up already exists.
 */		
ColorPickerButtonElement.prototype._addColorPickerPopup = 
	function ()
	{
		if (this._colorPickerPopup._parent != null)
			return false;
		
		this._manager.addElement(this._colorPickerPopup);
		
		this._colorPickerPopup._manager.addCaptureListener("wheel", this._onColorButtonManagerCaptureEventInstance);
		this._colorPickerPopup._manager.addCaptureListener("mousedown", this._onColorButtonManagerCaptureEventInstance);
		this._colorPickerPopup._manager.addEventListener("resize", this._onColorButtonManagerResizeEventInstance);
		
		return true;
	};
	
//@private	
ColorPickerButtonElement.prototype._onColorButtonEnterFrame = 
	function (event)
	{
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
ColorPickerButtonElement.prototype._endOpenCloseTween = 
	function ()
	{
		if (this._openCloseTween != null)
		{
			this.removeEventListener("enterframe", this._onColorButtonEnterFrameInstance);
			this._openCloseTween = null;
		}
	};
	
//@private	
ColorPickerButtonElement.prototype._updateTweenPosition = 
	function (value)
	{
		this._colorPickerPopup.setStyle("Alpha", value);
	};
	
/**
 * @function _onColorButtonManagerCaptureEvent
 * Capture event handler for CanvasManager "wheel" and "mousedown". Used to close 
 * the ColorPicker when events happen outside the Button or pop up ColorPicker. 
 * Only active when pop up list is open.
 * 
 * @param event ElementEvent
 * ElementEvent to process.
 */	
ColorPickerButtonElement.prototype._onColorButtonManagerCaptureEvent = 
	function (event)
	{
		//Check if the ColorPicker pop up is in this target's parent chain.
		var target = event.getTarget();
		
		while (target != null)
		{
			//Yes, leave the ColorPicker open
			if (target == this._colorPickerPopup || 
				(event.getType() == "mousedown" && target == this))
				return;
			
			target = target._parent;
		}
		
		this.close(false);
	};
	
/**
 * @function _onColorButtonManagerResizeEvent
 * Capture event handler for CanvasManager "resize". Used to close the ColorPicker.
 * Only active when ColorPicker is open.
 * 
 * @param event DispatcherEvent
 * DispatcherEvent to process.
 */		
ColorPickerButtonElement.prototype._onColorButtonManagerResizeEvent = 
	function (event)
	{
		this.close(false);
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
		this._colorSwatch.setStyle("BackgroundFill", this._colorPicker.getHexColor());
		
		if (this.hasEventListener("changed", null) == true)
			this.dispatchEvent(new ElementEvent("changed", false));
	};

/**
 * @function _onColorPickerKeydown
 * Event handler for pop up ColorPicker "keydown" event. 
 * Closes the pop up when enter or tab is pressed. 
 * Note that only the TextInput of the color picker is focus-able so 
 * keydown only fires when TextInput is focused.
 * 
 * @param elementKeyboardEvent ElementKeyboardEvent
 * ElementKeyboardEvent to process.
 */	
ColorPickerButtonElement.prototype._onColorPickerKeydown = 
	function (elementKeyboardEvent)
	{
	
	};
	
//@override	
ColorPickerButtonElement.prototype._onCanvasElementRemoved = 
	function (addedRemovedEvent)
	{
		ColorPickerButtonElement.base.prototype._onCanvasElementRemoved.call(this, addedRemovedEvent);
		
		this.close(false);
	};	

//@private	
ColorPickerButtonElement.prototype._reverseTween = 
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
	
//@override	
ColorPickerButtonElement.prototype._onButtonClick = 
	function (elementMouseEvent)
	{
		//Just cancels event if we're disabled.
		ColorPickerButtonElement.base.prototype._onButtonClick.call(this, elementMouseEvent);
		
		if (elementMouseEvent.getIsCanceled() == true)
			return;
		
		if (this._openCloseTween != null)
			this._reverseTween();
		else 
		{
			if (this._colorPickerPopup._parent == null)
				this.open(true);
			else
				this.close(true);
		}
	};	
	
/**
 * @function _createArrowButton
 * Generates and sets up the arrow element instance per styling.
 * 
 * @returns CanvasElement
 * New arrow element instance.
 */		
ColorPickerButtonElement.prototype._createArrowButton = 
	function (arrowClass)
	{
		var newIcon = new (arrowClass)();
		newIcon._setStyleProxy(new StyleProxy(this, ColorPickerButtonElement._ChildButtonProxyMap));
		return newIcon;
	};
	
//@private	
ColorPickerButtonElement.prototype._updateArrowButton = 
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
			
			this._applySubStylesToElement("ArrowButtonStyle", this._arrowButton);
		}
	};
	
/**
 * @function _createColorSwatch
 * Generates and sets up the color swatch element instance per styling.
 * 
 * @returns CanvasElement
 * New color swatch element instance.
 */		
ColorPickerButtonElement.prototype._createColorSwatch = 
	function (swatchClass)
	{
		var newIcon = new (swatchClass)();
		newIcon._setStyleProxy(new StyleProxy(this, ColorPickerButtonElement._ChildButtonProxyMap));
		return newIcon;
	}	
	
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
			if (this._colorSwatch == null)
			{
				this._colorSwatch = this._createColorSwatch(colorSwatchClass);
				this._addChild(this._colorSwatch);
			}
			else if (this._colorSwatch.constructor != colorSwatchClass)
			{ //Class changed
				this._removeChild(this._colorSwatch);
				this._arrowButton = this._createColorSwatch(colorSwatchClass);
				this._addChild(this._colorSwatch);
			}
			
			this._applySubStylesToElement("ColorSwatchStyle", this._colorSwatch);
			
			this._colorSwatch.setStyle("BackgroundFill", this._colorPicker.getHexColor());
		}
	};

//@override
ColorPickerButtonElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		ColorPickerButtonElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("ArrowButtonClass" in stylesMap || "ArrowButtonStyle" in stylesMap)
		{
			this._updateArrowButton();
			this._invalidateMeasure();
			this._invalidateLayout();
		}
		
		if ("ColorSwatchClass" in stylesMap || "ColorSwatchStyle" in stylesMap)
		{
			this._updateColorSwatch();
			this._invalidateMeasure();
			this._invalidateLayout();
		}
		
		if ("PopupColorPickerStyle" in stylesMap)
		{
			this._applySubStylesToElement("PopupColorPickerStyle", this._colorPicker);
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
		
		if (arrowWidth == null)
			arrowWidth = 20; 
		if (arrowHeight == null)
			arrowHeight = textHeight;
		
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
		
		return {width:padWidth + swatchWidth + arrowWidth, height:padHeight + Math.max(textHeight, swatchHeight, arrowHeight)};
	};	
	
/**
 * @function _layoutColorPickerPopup
 * Sizes and positions the ColorPicker pop up.
 */	
ColorPickerButtonElement.prototype._layoutColorPickerPopup = 
	function ()
	{
		//Color picker not displayed - bail.
		if (this._colorPickerPopup._parent == null)
			return;
	
		var managerMetrics = this.getMetrics(this._manager);
		
		var colorPickerDistance = this.getStyle("PopupColorPickerDistance");
		var colorPickerDirection = "br";
		
		var colorPickerWidth = this._colorPicker.getStyle("Width");
		if (colorPickerWidth == null)
			colorPickerWidth = this._colorPicker._measuredWidth;
		
		var colorPickerHeight = this._colorPicker.getStyle("Height");
		if (colorPickerHeight == null)
			colorPickerHeight = this._colorPicker._measuredHeight;
		
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
		if (availableRight > colorPickerWidth || colorPickerWidth > availableRight)
			pickerX = managerMetrics._x;
		else //Right aligned
			pickerX = managerMetrics._x + managerMetrics._width - colorPickerWidth;
		
		this._colorPickerPopup.setStyle("X", pickerX);
		this._colorPickerPopup.setStyle("Y", pickerY);
		this._colorPickerPopup.setStyle("Width", colorPickerWidth);
		this._colorPickerPopup.setStyle("Height", colorPickerHeight);
		
		this._colorPicker._setActualPosition(0, 0);
		this._colorPicker._setActualSize(colorPickerWidth, colorPickerHeight);
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
				arrowHeight = h;
			if (arrowWidth == null)
				arrowWidth = 20;
			
			if (w < arrowWidth)
			{
				this._arrowButton._setActualSize(0, 0);
				arrowWidth = 0;
				arrowHeight = 0;
			}
			else
			{
				this._arrowButton._setActualPosition(w - arrowWidth, y + (h / 2) - (arrowHeight / 2));
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
	
	