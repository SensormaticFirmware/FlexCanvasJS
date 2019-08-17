
/**
 * @depends CanvasElement.js
 * @depends ButtonElement.js
 * @depends DropdownArrowButtonSkinElement.js
 * @depends Tween.js
 */

//////////////////////////////////////////////////////////////
///////////////DatePickerButtonElement///////////////////////

/**
 * @class DatePickerButtonElement
 * @inherits ButtonElement
 * 
 * DatePickerButtonElement is a compound button that creates a pop-up DatePicker
 * which the user can select a date which is then displayed on the button. 
 * 
 * The DatePickerButtonElement button itself contains a child button which is used to render
 * the divider line and arrow. DatePickerButtonElement proxies its SkinState style to the arrow
 * button so the arrow button will change states along with the DatePickerButtonElement itself.
 * See the default skin for the arrow button DropdownArrowButtonSkinElement for additional styles.
 * 
 * @seealso DropdownArrowButtonSkinElement
 * 
 * 
 * @constructor DatePickerButtonElement 
 * Creates new DatePickerButtonElement instance.
 */
function DatePickerButtonElement()
{
	DatePickerButtonElement.base.prototype.constructor.call(this);

	this._arrowButton = null;
	
	this._datePickerPopup = new CanvasElement();
	this._datePicker = new DatePickerElement();
	this._datePickerPopup._addChild(this._datePicker);
	
	this._openCloseTween = null;
	
	var _self = this;
	
	//Private event listeners, need an instance for each DatePickerButton, proxy to prototype.
		
	this._onDateButtonManagerCaptureEventInstance = 
		function (event)
		{
			_self._onDateButtonManagerCaptureEvent(event);
		};
	this._onDateButtonManagerResizeEventInstance = 
		function (event)
		{
			_self._onDateButtonManagerResizeEvent(event);
		};
	this._onDateButtonEnterFrameInstance = 
		function (event)
		{
			_self._onDateButtonEnterFrame(event);
		};
	this._onDatePickerChangedInstance = 
		function (event)
		{
			_self._onDatePickerChanged(event);
		};
	this._onDatePickerLayoutCompleteInstance = 
		function (event)
		{
			_self._onDatePickerLayoutComplete(event);
		};	
		
	this._datePicker.addEventListener("changed", this._onDatePickerChangedInstance);	
	this._datePicker.addEventListener("layoutcomplete", this._onDatePickerLayoutCompleteInstance);
}

//Inherit from ButtonElement
DatePickerButtonElement.prototype = Object.create(ButtonElement.prototype);
DatePickerButtonElement.prototype.constructor = DatePickerButtonElement;
DatePickerButtonElement.base = ButtonElement;

////////////Static///////////////////////////////

DatePickerButtonElement.DefaultDateFormatLabelFunction = 
	function (date)
	{
		var year = date.getFullYear().toString();
		var month = (date.getMonth() + 1).toString();
		var day = date.getDate().toString();
		
		while (month.length < 2)
			month = "0" + month;
		
		while (day.length < 2)
			day = "0" + day;
		
		return year + "-" + month + "-" + day;
	};

////////////Events///////////////////////////////

/**
 * @event changed ElementEvent
 * 
 * Dispatched when the date selection changes as a result of user input.
 * 
 * 
 * @event opened ElementEvent
 * 
 * Dispatched when the DatePicker pop up is opened as a result of user input.
 * 
 * 
 * @event closed ElementEvent
 * 
 * Dispatched when the DatePicker pop up is closed as a result of user input.
 */


/////////////Style Types/////////////////////////

DatePickerButtonElement._StyleTypes = Object.create(null);

/**
 * @style DateFormatLabelFunction Function
 * 
 * A function that accepts a date and returns a string to be displayed as the date label.
 * Signature: function (date) { return "" }
 * The default label function returns returns international date format "YYYY-MM-DD".
 */
DatePickerButtonElement._StyleTypes.DateFormatLabelFunction = 			StyleableBase.EStyleType.NORMAL; 

/**
 * @style PopupDatePickerStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to the pop up DatePicker element.
 */
DatePickerButtonElement._StyleTypes.PopupDatePickerStyle = 				StyleableBase.EStyleType.SUBSTYLE; 		// StyleDefinition

/**
 * @style ArrowButtonClass CanvasElement
 * 
 * The CanvasElement or subclass constructor to be used for the arrow icon. Defaults to Button. 
 * Note that DatePickerButton proxies its SkinState style to the arrow button so the arrow 
 * will change states with the DatePickerButton.
 */
DatePickerButtonElement._StyleTypes.ArrowButtonClass = 					StyleableBase.EStyleType.NORMAL; 		// CanvasElement constructor

/**
 * @style ArrowButtonStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to the arrow icon class.
 */
DatePickerButtonElement._StyleTypes.ArrowButtonStyle = 					StyleableBase.EStyleType.SUBSTYLE; 		// StyleDefinition

/**
 * @style OpenCloseTweenDuration Number
 * 
 * Duration in milliseconds the open and close animation should run.
 */
DatePickerButtonElement._StyleTypes.OpenCloseTweenDuration = 			StyleableBase.EStyleType.NORMAL; 		// number (milliseconds)

/**
 * @style OpenCloseTweenEasingFunction Function
 * 
 * Easing function used on the open and close animations. Defaults to Tween.easeInOutSine().
 */
DatePickerButtonElement._StyleTypes.OpenCloseTweenEasingFunction = 		StyleableBase.EStyleType.NORMAL; 		// function (fraction) { return fraction} - see Tween.easing

/**
 * @style PopupDatePickerDistance Number
 * 
 * Vertical distance in pixels to place the DatePicker pop up from the button.
 * Defaults to -1 to collapse default 1 pixel borders.
 */
DatePickerButtonElement._StyleTypes.PopupDatePickerDistance = 			StyleableBase.EStyleType.NORMAL; 		


////////////Default Styles////////////////////

/////Arrow default skin styles//////
DatePickerButtonElement.ArrowButtonSkinStyleDefault = new StyleDefinition();
DatePickerButtonElement.ArrowButtonSkinStyleDefault.setStyle("BorderType", 					null);
DatePickerButtonElement.ArrowButtonSkinStyleDefault.setStyle("BackgroundFill", 				null);

DatePickerButtonElement.ArrowButtonDisabledSkinStyleDefault = new StyleDefinition();
DatePickerButtonElement.ArrowButtonDisabledSkinStyleDefault.setStyle("BorderType", 			null);
DatePickerButtonElement.ArrowButtonDisabledSkinStyleDefault.setStyle("BackgroundFill", 		null);
DatePickerButtonElement.ArrowButtonDisabledSkinStyleDefault.setStyle("ArrowColor", 			"#888888");
DatePickerButtonElement.ArrowButtonDisabledSkinStyleDefault.setStyle("LineColor", 			"#888888");


/////Arrow default style///////
DatePickerButtonElement.ArrowButtonStyleDefault = new StyleDefinition();
DatePickerButtonElement.ArrowButtonStyleDefault.setStyle("SkinClass", 						DropdownArrowButtonSkinElement);

//Note that SkinState is proxied to the arrow button, so the arrow will change state along with the Button (unless you turn mouse back on)
DatePickerButtonElement.ArrowButtonStyleDefault.setStyle("MouseEnabled", 					false);

DatePickerButtonElement.ArrowButtonStyleDefault.setStyle("UpSkinStyle", 					DatePickerButtonElement.ArrowButtonSkinStyleDefault);
DatePickerButtonElement.ArrowButtonStyleDefault.setStyle("OverSkinStyle", 					DatePickerButtonElement.ArrowButtonSkinStyleDefault);
DatePickerButtonElement.ArrowButtonStyleDefault.setStyle("DownSkinStyle", 					DatePickerButtonElement.ArrowButtonSkinStyleDefault);
DatePickerButtonElement.ArrowButtonStyleDefault.setStyle("DisabledSkinStyle", 				DatePickerButtonElement.ArrowButtonDisabledSkinStyleDefault);

////DatePickerButton default style/////
DatePickerButtonElement.StyleDefault = new StyleDefinition();
DatePickerButtonElement.StyleDefault.setStyle("PaddingTop",								3);
DatePickerButtonElement.StyleDefault.setStyle("PaddingBottom",							3);
DatePickerButtonElement.StyleDefault.setStyle("PaddingRight",							4);
DatePickerButtonElement.StyleDefault.setStyle("PaddingLeft",							4);
DatePickerButtonElement.StyleDefault.setStyle("TextHorizontalAlign", 					"left"); 	
DatePickerButtonElement.StyleDefault.setStyle("DateFormatLabelFunction",				DatePickerButtonElement.DefaultDateFormatLabelFunction)		
DatePickerButtonElement.StyleDefault.setStyle("PopupDatePickerStyle", 					null);
DatePickerButtonElement.StyleDefault.setStyle("PopupDatePickerDistance", 				-1);			
DatePickerButtonElement.StyleDefault.setStyle("ArrowButtonClass", 						ButtonElement); 									// Element constructor
DatePickerButtonElement.StyleDefault.setStyle("ArrowButtonStyle", 						DatePickerButtonElement.ArrowButtonStyleDefault); 	// StyleDefinition
DatePickerButtonElement.StyleDefault.setStyle("OpenCloseTweenDuration", 				150); 												// number (milliseconds)
DatePickerButtonElement.StyleDefault.setStyle("OpenCloseTweenEasingFunction", 			Tween.easeInOutSine); 								// function (fraction) { return fraction}


/////////Style Proxy Maps/////////////////////////////

//Proxy map for styles we want to pass to the arrow button.
DatePickerButtonElement._ChildButtonProxyMap = Object.create(null);
DatePickerButtonElement._ChildButtonProxyMap.SkinState = 						true;
DatePickerButtonElement._ChildButtonProxyMap._Arbitrary = 						true;


/////////////Public///////////////////////////////

/**
 * @function setSelectedDate
 * Sets the selected date of the DatePickerButton.
 * 
 * @param date Date
 * Date to set as the selected date or null for no selection.
 */		
DatePickerButtonElement.prototype.setSelectedDate = 
	function (date)
	{
		this._datePicker.setSelectedDate(date);
		this._updateText();
	};
	
/**
 * @function getSelectedDate
 * Gets the selected date of the DatePickerButton.
 * 
 * @returns Date
 * Currently selected date or null if none selected.
 */	
DatePickerButtonElement.prototype.getSelectedDate = 
	function ()
	{
		return this._datePicker.getSelectedDate();
	};

/**
 * @function open
 * Opens the pop up DatePicker.
 * 
 * @param animate boolean
 * When true animates the appearance of the pop-up DatePicker.
 */	
DatePickerButtonElement.prototype.open = 
	function (animate)
	{
		if (this._manager == null)
			return;
	
		//Add the pop-up DatePicker. Wait for layoutcomplete to adjust positioning and size.
		var added = this._addDatePickerPopup(); 
		
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
			else if (added == true) //Start tween if popup is new
			{
				this._openCloseTween = new Tween();
				this._openCloseTween.startVal = 0; 
				this._openCloseTween.endVal = 1;	
				this._openCloseTween.duration = tweenDuration;
				this._openCloseTween.startTime = Date.now();
				this._openCloseTween.easingFunction = this.getStyle("OpenCloseTweenEasingFunction");
				
				this.addEventListener("enterframe", this._onDateButtonEnterFrameInstance);
			}
		}
	};
	
/**
 * @function close
 * Closes the pop up DatePicker.
 * 
 * @param animate boolean
 * When true animates the disappearance of the pop-up DatePicker.
 */		
DatePickerButtonElement.prototype.close = 
	function (animate)
	{
		var tweenDuration = this.getStyle("OpenCloseTweenDuration");
	
		if (animate == false || tweenDuration <= 0)
		{
			this._endOpenCloseTween();		
			this._removeDatePickerPopup();
		}
		else 
		{
			if (this._openCloseTween != null) //Tween running
			{
				if (this._openCloseTween.startVal == 0) //Reverse if opening, ignore if closing.
					this._reverseTween();
			}
			else if (this._datePickerPopup._parent != null) //Start tween if popup exists.
			{
				this._openCloseTween = new Tween();
				this._openCloseTween.startVal = 1;
				this._openCloseTween.endVal = 0;
				this._openCloseTween.duration = tweenDuration;
				this._openCloseTween.startTime = Date.now();
				this._openCloseTween.easingFunction = this.getStyle("OpenCloseTweenEasingFunction");
				
				this.addEventListener("enterframe", this._onDateButtonEnterFrameInstance);
			}
		}
	};

	
/////////////Internal///////////////////////////////	
	
/**
 * @function _removeDatePickerPopup
 * Removes the pop up DatePicker and cleans up event listeners.
 * 
 * @returns bool
 * Returns true if the pop up was removed, false if the pop up does not exist.
 */	
DatePickerButtonElement.prototype._removeDatePickerPopup = 
	function ()
	{
		if (this._datePickerPopup._parent == null)
			return false;
	
		this._datePickerPopup._manager.removeCaptureListener("wheel", this._onDateButtonManagerCaptureEventInstance);
		this._datePickerPopup._manager.removeCaptureListener("mousedown", this._onDateButtonManagerCaptureEventInstance);
		this._datePickerPopup._manager.removeEventListener("resize", this._onDateButtonManagerResizeEventInstance);
		
		this._datePickerPopup._manager.removeElement(this._datePickerPopup);
		
		return true;
	};

/**
 * @function _addDatePickerPopup
 * Adds the DatePicker pop up to CanvasManager and registers event listeners.
 * 
 * @returns bool
 * Returns true if the pop up was added, false if the pop up already exists.
 */		
DatePickerButtonElement.prototype._addDatePickerPopup = 
	function ()
	{
		if (this._datePickerPopup._parent != null)
			return false;
		
		this._manager.addElement(this._datePickerPopup);
		
		this._datePickerPopup._manager.addCaptureListener("wheel", this._onDateButtonManagerCaptureEventInstance);
		this._datePickerPopup._manager.addCaptureListener("mousedown", this._onDateButtonManagerCaptureEventInstance);
		this._datePickerPopup._manager.addEventListener("resize", this._onDateButtonManagerResizeEventInstance);
		
		return true;
	};
	
//@private	
DatePickerButtonElement.prototype._onDateButtonEnterFrame = 
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
DatePickerButtonElement.prototype._endOpenCloseTween = 
	function ()
	{
		if (this._openCloseTween != null)
		{
			this.removeEventListener("enterframe", this._onDateButtonEnterFrameInstance);
			this._openCloseTween = null;
		}
	};
	
//@private	
DatePickerButtonElement.prototype._updateTweenPosition = 
	function (value)
	{
		this._datePickerPopup.setStyle("Alpha", value);
	};
	
/**
 * @function _onDateButtonManagerCaptureEvent
 * Capture event handler for CanvasManager "wheel" and "mousedown". Used to close 
 * the DatePicker when events happen outside the Button or pop up DatePicker. 
 * Only active when pop up is open.
 * 
 * @param event ElementEvent
 * ElementEvent to process.
 */	
DatePickerButtonElement.prototype._onDateButtonManagerCaptureEvent = 
	function (event)
	{
		//Check if the DatePicker pop up is in this target's parent chain.
		var target = event.getTarget();
		
		while (target != null)
		{
			//Yes, leave the DatePicker open
			if (target == this._datePickerPopup || 
				(event.getType() == "mousedown" && target == this))
			{
				return;
			}
			
			target = target._parent;
		}
		
		this.close(false);
		
		//Dispatch closed event.
		if (this.hasEventListener("closed", null) == true)
			this.dispatchEvent(new ElementEvent("closed", false));
	};
	
/**
 * @function _onDateButtonManagerResizeEvent
 * Capture event handler for CanvasManager "resize". Used to close the DatePicker.
 * Only active when DatePicker is open.
 * 
 * @param event DispatcherEvent
 * DispatcherEvent to process.
 */		
DatePickerButtonElement.prototype._onDateButtonManagerResizeEvent = 
	function (event)
	{
		this.close(false);
		
		//Dispatch closed event.
		if (this.hasEventListener("closed", null) == true)
			this.dispatchEvent(new ElementEvent("closed", false));
	};

/**
 * @function _onDatePickerLayoutComplete
 * Event handler for pop up DatePicker "layoutcomplete". 
 * Updates the pop up size when content size is known and determines
 * position of the pop up depending on available space.
 * 
 * @param event DispatcherEvent
 * DispatcherEvent to process.
 */		
DatePickerButtonElement.prototype._onDatePickerLayoutComplete =
	function (event)
	{
		this._layoutDatePickerPopup();
	};
	
/**
 * @function _onDatePickerChangedInstance
 * Event handler for pop up DatePicker "changed" event. 
 * Updates date label and re-dispatches "changed" event.
 * 
 * @param elementEvent ElementEvent
 * ElementEvent to process.
 */	
DatePickerButtonElement.prototype._onDatePickerChanged = 
	function (elementEvent)
	{
		if (this.hasEventListener("changed", null) == true)
			this.dispatchEvent(new ElementEvent("changed", false));
	
		//Update label
		this._updateText();
		
		//Dispatch closed event.
		if (this.hasEventListener("closed", null) == true)
			this.dispatchEvent(new ElementEvent("closed", false));
		
		this.close(true);
	};

//@override	
DatePickerButtonElement.prototype._onCanvasElementRemoved = 
	function (addedRemovedEvent)
	{
		DatePickerButtonElement.base.prototype._onCanvasElementRemoved.call(this, addedRemovedEvent);
		
		this.close(false);
	};	

//@private	
DatePickerButtonElement.prototype._reverseTween = 
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
DatePickerButtonElement.prototype._onButtonClick = 
	function (elementMouseEvent)
	{
		//Just cancels event if we're disabled.
		DatePickerButtonElement.base.prototype._onButtonClick.call(this, elementMouseEvent);
		
		if (elementMouseEvent.getIsCanceled() == true)
			return;
		
		if (this._openCloseTween != null)
		{
			if (this._openCloseTween.startVal == 0) //Now opening
			{
				//Dispatch opened event.
				if (this.hasEventListener("opened", null) == true)
					this.dispatchEvent(new ElementEvent("opened", false));
			}
			else //Now closing
			{
				//Dispatch closed event.
				if (this.hasEventListener("closed", null) == true)
					this.dispatchEvent(new ElementEvent("closed", false));
			}
			
			this._reverseTween();
		}
		else 
		{
			if (this._datePickerPopup._parent == null)
			{
				//Dispatch opened event.
				if (this.hasEventListener("opened", null) == true)
					this.dispatchEvent(new ElementEvent("opened", false));
				
				this.open(true);
			}
			else
			{
				//Dispatch closed event.
				if (this.hasEventListener("closed", null) == true)
					this.dispatchEvent(new ElementEvent("closed", false));
				
				this.close(true);
			}
		}
	};	

/**
 * @function _updateText
 * Updates the date label text via the styled DateFormatLabelFunction
 */
DatePickerButtonElement.prototype._updateText = 
	function ()
	{
		var labelFunction = this.getStyle("DateFormatLabelFunction");
		
		if (this._datePicker.getSelectedDate() != null && labelFunction != null)
			text = labelFunction(this._datePicker.getSelectedDate());
		else
			text = this.getStyle("Text");
		
		this._setLabelText(text);
	};
	
/**
 * @function _createArrowButton
 * Generates and sets up the arrow element instance per styling.
 * 
 * @returns CanvasElement
 * New arrow element instance.
 */		
DatePickerButtonElement.prototype._createArrowButton = 
	function (arrowClass)
	{
		var newIcon = new (arrowClass)();
		newIcon._setStyleProxy(new StyleProxy(this, DatePickerButtonElement._ChildButtonProxyMap));
		return newIcon;
	};
	
//@private	
DatePickerButtonElement.prototype._updateArrowButton = 
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

//@override
DatePickerButtonElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		DatePickerButtonElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("ArrowButtonClass" in stylesMap || "ArrowButtonStyle" in stylesMap)
		{
			this._updateArrowButton();
			this._invalidateMeasure();
			this._invalidateLayout();
		}
		
		if ("PopupDatePickerStyle" in stylesMap)
		{
			this._applySubStylesToElement("PopupDatePickerStyle", this._datePicker);
			this._invalidateLayout();
		}
		
		if ("PopupDatePickerDistance" in stylesMap)
			this._invalidateLayout();
		
		if ("DateFormatLabelFunction" in stylesMap)
			this._updateText();
	};
	
//@override
DatePickerButtonElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		var fontString = this._getFontString();
			
		var dateTextWidth = 20;
		var labelFunction = this.getStyle("DateFormatLabelFunction");
		if (labelFunction != null)
			dateTextWidth += CanvasElement._measureText(labelFunction(new Date()), fontString);
		
		var textLabelWidth = 20;
		var textLabel = this.getStyle("Text");
		if (textLabel != null)
			textLabelWidth += CanvasElement._measureText(textLabel, fontString);
		
		var textWidth = Math.max(dateTextWidth, textLabelWidth);		
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
		
		var h = Math.ceil(Math.max(arrowHeight, textHeight + padHeight));
		var w = Math.ceil(padWidth + textWidth + arrowWidth);
		
		this._setMeasuredSize(w, h);
	};	
	
/**
 * @function _layoutDatePickerPopup
 * Sizes and positions the DatePicker pop up.
 */	
DatePickerButtonElement.prototype._layoutDatePickerPopup = 
	function ()
	{
		//DatePicker not displayed - bail.
		if (this._datePickerPopup._parent == null || 
			this._datePicker._layoutInvalid == true)
		{
			return;
		}
	
		var managerMetrics = this.getMetrics(this._manager);
		
		var pickerDistance = this.getStyle("PopupDatePickerDistance");
		
		var pickerWidth = this._datePicker.getStyle("Width");
		if (pickerWidth == null)
			pickerWidth = this._datePicker._measuredWidth;
		
		var pickerHeight = this._datePicker.getStyle("Height");
		if (pickerHeight == null)
			pickerHeight = this._datePicker._measuredHeight;
		
		//Figure out the available space around the button that we have to place the pop up
		var availableBottom = this._manager._height - (managerMetrics._y + managerMetrics._height) - pickerDistance;
		var availableTop = managerMetrics._y - pickerDistance;
		var availableRight = this._manager._width - managerMetrics._x;
		var availableLeft = managerMetrics._x + managerMetrics._width;
		
		var pickerX = 0;
		var pickerY = 0;
		
		//Open bottom
		if (availableBottom > pickerHeight || pickerHeight > availableTop)
			pickerY = managerMetrics._y + managerMetrics._height + pickerDistance;
		else //Open top
			pickerY = managerMetrics._y - pickerHeight - pickerDistance;

		//Left aligned
		if (availableRight > pickerWidth || pickerWidth < availableRight)
			pickerX = managerMetrics._x;
		else //Right aligned
			pickerX = managerMetrics._x + managerMetrics._width - pickerWidth;
		
		this._datePickerPopup.setStyle("X", pickerX);
		this._datePickerPopup.setStyle("Y", pickerY);
		this._datePickerPopup.setStyle("Width", pickerWidth);
		this._datePickerPopup.setStyle("Height", pickerHeight);
		
		this._datePicker._setActualPosition(0, 0);
		this._datePicker._setActualSize(pickerWidth, pickerHeight);
	};
	
//@override	
DatePickerButtonElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		DatePickerButtonElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		this._layoutDatePickerPopup();
		
		var x = paddingMetrics.getX();
		var y = paddingMetrics.getY();
		var w = paddingMetrics.getWidth();
		var h = paddingMetrics.getHeight();
		
		var arrowWidth = 0;
		var arrowHeight = 0;
		
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
	
	