
/**
 * @depends TextInputElement.js
 */

/////////////////////////////////////////////////////////
/////////////TimeInputElement////////////////////////////
	
/**
 * @class TimeInputElement
 * @inherits TextInputElement
 * 
 * TimeInputElement is an editable time field.
 * Note that TimeInput supports both 12 and 24 hour time, but does not supply AM/PM.
 * 
 * @constructor TimeInputElement 
 * Creates new TimeInputElement instance.
 */
function TimeInputElement()
{
	TimeInputElement.base.prototype.constructor.call(this);
	
	//Steal the text field from base TextInput - re-use as hour field
	this._textFieldHour = this._textField;
	this._removeChild(this._textField);
	
		//Use list container to layout text fields
		this._listContainer = new ListContainerElement();
		this._listContainer.setStyle("LayoutDirection", "horizontal");
		
			this._textFieldHour.setStyle("Selectable", true);
			this._textFieldHour.setStyle("PercentHeight", 100);
			this._textFieldHour.setStyle("PercentWidth", 100);
			this._textFieldHour.setStyle("MaxChars", 2);
			this._textFieldHour.setStyle("TabStop", -1);
			
			this._labelColon1 = new LabelElement();
			this._labelColon1.setStyle("PercentHeight", 100);
			this._labelColon1.setStyle("TextHorizontalAlign", "center");
			this._labelColon1.setStyle("Text", ":");
			this._labelColon1.setStyle("PaddingLeft", 0);
			this._labelColon1.setStyle("PaddingRight", 0);
			this._labelColon1.setStyle("TextStyle", "bold");
			
			this._textFieldMinute = new TextFieldElement();
			this._textFieldMinute.setStyle("Selectable", true);
			this._textFieldMinute.setStyle("PercentHeight", 100);
			this._textFieldMinute.setStyle("PercentWidth", 100);
			this._textFieldMinute.setStyle("MaxChars", 2);
			this._textFieldMinute.setStyle("TabStop", -1);
			
			this._labelColon2 = new LabelElement();
			this._labelColon2.setStyle("PercentHeight", 100);
			this._labelColon2.setStyle("TextHorizontalAlign", "center");
			this._labelColon2.setStyle("Text", ":");
			this._labelColon2.setStyle("PaddingLeft", 0);
			this._labelColon2.setStyle("PaddingRight", 0);
			this._labelColon2.setStyle("TextStyle", "bold");
			
			this._textFieldSecond = new TextFieldElement();
			this._textFieldSecond.setStyle("Selectable", true);
			this._textFieldSecond.setStyle("PercentHeight", 100);
			this._textFieldSecond.setStyle("PercentWidth", 100);
			this._textFieldSecond.setStyle("MaxChars", 2);
			this._textFieldSecond.setStyle("TabStop", -1);
			
		this._listContainer.addElement(this._textFieldHour);
		this._listContainer.addElement(this._labelColon1);
		this._listContainer.addElement(this._textFieldMinute);
		this._listContainer.addElement(this._labelColon2);
		this._listContainer.addElement(this._textFieldSecond);
		
	this._addChild(this._listContainer);
	
	////////////////////////
	
	var _self = this;
	
	//Private event handlers, need different instance for each TimeInput. Proxy to prototype.
	this._onTimeInputTextFieldMouseDownInstance = 
		function (mouseEvent)
		{
			_self._onTimeInputTextFieldMouseDown(mouseEvent);
		};	
		
	this._onTimeInputTextFieldFocusOutInstance = 
		function (event)
		{
			_self._onTimeInputTextFieldFocusOut(event);
		};
		
	this._onTimeInputEnterFrameInstance = 
		function (event)
		{
			_self._onTimeInputEnterFrame(event);
		};
		
	this._textFieldHour.addEventListener("focusout", this._onTimeInputTextFieldFocusOutInstance);
	this._textFieldMinute.addEventListener("focusout", this._onTimeInputTextFieldFocusOutInstance);
	this._textFieldSecond.addEventListener("focusout", this._onTimeInputTextFieldFocusOutInstance);
	
	this.addEventListener("enterframe", this._onTimeInputEnterFrameInstance);
	
	/////
	
	//Currently focused text field
	this._textFieldFocused = null;
	
	this._hour = -1;
	this._minute = -1;
	this._second = -1;
	
	var time = new Date();
	this._clockBase = Date.now();
	
	this.setHours(time.getHours());
	this.setMinutes(time.getMinutes());
	this.setSeconds(time.getSeconds());
}

//Inherit from SkinnableElement
TimeInputElement.prototype = Object.create(TextInputElement.prototype);
TimeInputElement.prototype.constructor = TimeInputElement;
TimeInputElement.base = TextInputElement;

/////////////Events////////////////////////////////////

/**
 * @event changed ElementEvent
 * Dispatched when the text is modified as a result of user input.
 */


/////////////Style Types///////////////////////////////

TimeInputElement._StyleTypes = Object.create(null);

/**
 * @style Is24HourTime boolean
 * 
 * Defaults to true, valid hours are 0-23.
 * When false, valid hours are 1-12. (AM / PM not supplied by this control)
 */
TimeInputElement._StyleTypes.Is24HourTime =								StyleableBase.EStyleType.NORMAL;		//Element constructor()


/////////////Default Styles///////////////////////////

TimeInputElement.StyleDefault = new StyleDefinition();

TimeInputElement.StyleDefault.setStyle("Is24HourTime", 								true);
TimeInputElement.StyleDefault.setStyle("TextHorizontalAlign", 						"center");
TimeInputElement.StyleDefault.setStyle("TextVerticalAlign", 						"middle");

TimeInputElement.StyleDefault.setStyle("PaddingLeft",								5);
TimeInputElement.StyleDefault.setStyle("PaddingRight",								5);


////////Public///////////////////////

/**
 * @function setText
 * @override
 * Sets time to be displayed. 
 * 
 * @param text String
 * Time to be displayed. Expected format is "hour:minute:second".
 */
TimeInputElement.prototype.setText = 
	function (text)
	{
		var hour = 0; 
		var minute = 0;
		var second = 0;
		var n;
		
		var timeArray = ip.split(":");
		for (var i = 0; i < timeArray.length; i++)
		{
			if (i == 3)
				return;
			
			n = Number(timeArray[i])
			if (isNaN(n) == true)
				n = 0;
			
			if (i == 0)
				hour = n;
			else if (i == 1)
				minute = n;
			else 
				second = n;
		}
		
		this.setHours(hour);
		this.setMinutes(minute);
		this.setSeconds(second);		
	};

/**
 * @function getText
 * @override
 * Gets the time string currently displayed.
 * 
 * @returns String
 * Time currently displayed, formatted as "HH:MM:SS"
 */	
TimeInputElement.prototype.getText = 
	function ()
	{
		var hour = this._hour.toString();
		var minute = this._minute.toString();
		var second = this._second.toString();
		
		while (hour.length < 2)
			hour = "0" + hour;
		
		while (minute.length < 2)
			minute = "0" + minute;
		
		while (second.length < 2)
			second = "0" + second;
		
		return hour + ":" + minute + ":" + second;
	};	
	
/**
 * @function setHours
 * Sets the hours to be displayed.
 * Range is 0-23 when "Is24HourTime" style is true, otherwise 1-12
 * Will wrap hours when out of range, hence allowing easy addition and subtraction.
 * 
 * @param hour int
 * Hour to be displayed.
 */
TimeInputElement.prototype.setHours = 
	function (hour)
	{
		this._setHoursInternal(hour, false);
	};

/**
 * @function getHour
 * Gets the hours currently displayed. 
 * 
 * @returns int
 * Hour currently displayed.
 */	
TimeInputElement.prototype.getHours = 
	function ()
	{
		return this._hour;
	};

/**
 * @function setMinutes
 * Sets the minutes to be displayed. Range is 0-59.
 * Will wrap minutes and update hours when out of range, hence allowing easy addition and subtraction.
 * 
 * @param minute int
 * Minute to be displayed.
 */
TimeInputElement.prototype.setMinutes = 
	function (minute)
	{
		this._setMinutesInternal(minute, false)
	};

/**
 * @function getMinutes
 * Gets the minutes currently displayed. 
 * 
 * @returns int
 * Minute currently displayed.
 */	
TimeInputElement.prototype.getMinutes = 
	function ()
	{
		return this._minute;
	};	
	
/**
 * @function setSeconds
 * Sets the seconds to be displayed. Range is 0-59.
 * Will wrap seconds and update minutes when out of range, hence allowing easy addition and subtraction.
 * 
 * @param second int
 * Seconds to be displayed.
 */
TimeInputElement.prototype.setSeconds = 
	function (second)
	{
		this._setSecondsInternal(second, false);
	};

/**
 * @function getSeconds
 * Gets the seconds currently displayed. 
 * 
 * @returns int
 * Seconds currently displayed.
 */	
TimeInputElement.prototype.getSeconds = 
	function ()
	{
		return this._second;
	};		
	

////////Internal/////////////////////

/**
 * @function _setHoursInternal
 * Sets the hours to be displayed, ignored if set by clock when user has hour field focused.
 * 
 * @param hour int
 * Hours to be displayed.
 * 
 * @param isClock boolean
 * True when this is called via clock change.
 */	
TimeInputElement.prototype._setHoursInternal = 
	function (hour, isClock)
	{
		if (hour == null || hour.length == 0)
			return;
		
		//Dont update if its the clock and field is focused by user
		if (isClock == true && this._textFieldFocused == this._textFieldHour)
			return;
		
		var h = Number(hour);
		if (isNaN(h) == true)
			h = 0;
		
		h = Math.round(h);
		
		var is24Hour = this.getStyle("Is24HourTime");
		
		//Wrap the hour
		if (is24Hour == true)
		{
			while (h < 0)
				h += 24;
			while (h > 23)
				h -= 24;
		}
		else
		{
			while (h < 1)
				h += 12;
			while (h > 12)
				h -= 12;
		}
		
		this._hour = h;
		
		var textHour = h.toString();
		while (textHour.length < 2)
			textHour = "0" + textHour;
		
		this._textFieldHour.setText(textHour);
		
		if (isClock == false)
			this._clockBase = Date.now();
	};
	
/**
 * @function _setMinutesInternal
 * Sets the minutes to be displayed, ignored if set by clock when user has minutes field focused.
 * 
 * @param minute int
 * Minutes to be displayed.
 * 
 * @param isClock boolean
 * True when this is called via clock change.
 */	
TimeInputElement.prototype._setMinutesInternal = 
	function (minute, isClock)
	{
		if (minute == null || minute.length == 0)
			return;
		
		//Dont update if its the clock and field is focused by user
		if (isClock == true && this._textFieldFocused == this._textFieldMinute)
			return;
		
		var m = Number(minute);
		if (isNaN(m) == true)
			m = 0;
		
		m = Math.round(m);
		
		var currentHour = this._hour;
		
		//Wrap minutes
		while (m > 59)
		{
			m = m - 60;
			currentHour++;
		}
		
		while (m < 0)
		{
			m = m + 60
			currentHour--;
		}
		
		this._minute = m;
		this._setHoursInternal(currentHour, isClock);
		
		var textMinute = m.toString();
		while (textMinute.length < 2)
			textMinute = "0" + textMinute;
		
		this._textFieldMinute.setText(textMinute);
		
		if (isClock == false)
			this._clockBase = Date.now();
	};
	
/**
 * @function _setSecondsInternal
 * Sets the seconds to be displayed, ignored if set by clock when user has seconds field focused.
 * 
 * @param second int
 * Seconds to be displayed.
 * 
 * @param isClock boolean
 * True when this is called via clock change.
 */		
TimeInputElement.prototype._setSecondsInternal = 
	function (second, isClock)
	{
		if (second == null || second.length == 0)
			return;
		
		//Dont update if its the clock and field is focused by user	
		if (isClock == true && this._textFieldFocused == this._textFieldSecond)
			return;
		
		var s = Number(second);
		if (isNaN(s) == true)
			m = 0;
		
		s = Math.round(s);
		
		var currentMinute = this._minute;
		
		//Wrap seconds
		while (s > 59)
		{
			s = s - 60;
			currentMinute++;
		}
		
		while (s < 0)
		{
			s = s + 60
			currentMinute--;
		}
		
		this._second = s;
		this._setMinutesInternal(currentMinute, isClock);
		
		var textSecond = s.toString();
		while (textSecond.length < 2)
			textSecond = "0" + textSecond;
		
		this._textFieldSecond.setText(textSecond);
		
		if (isClock == false)
			this._clockBase = Date.now();
	};
	
/**
 * @function _onTimeInputEnterFrame
 * Event handler for "enterframe" event.  Updates the time displayed via clock.
 * 
 * @param event DispatcherEvent
 * DispatcherEvent to be processed.
 */	
TimeInputElement.prototype._onTimeInputEnterFrame = 
	function (event)
	{
		if (this._renderVisible == false)
			return;
	
		var time = Date.now();
		var delta = time - this._clockBase;
		var deltaSeconds = Math.floor(delta / 1000);
		
		if (deltaSeconds > 0)
		{
			this._setSecondsInternal(this._second + deltaSeconds, true);
			this._clockBase += deltaSeconds * 1000;
		}
	};
	
//@override
TimeInputElement.prototype._onTextInputKeyDown = 
	function (keyboardEvent)
	{
		if (keyboardEvent.getDefaultPrevented() == true)
			return;
		
		var key = keyboardEvent.getKey();
		
		if (key.length == 1 && 
			key != "0" && key != "1" &&
			key != "2" && key != "3" &&
			key != "4" && key != "5" &&
			key != "6" && key != "7" &&
			key != "8" && key != "9" &&
			key != ":")
		{
			return;
		}
		
		if (key == "Tab" || key == ":") //Move focus
		{
			var shiftPressed = false;
			
			if (key == "Tab")
				shiftPressed = keyboardEvent.getShift();
			
			if (shiftPressed == false)
			{
				if (this._textFieldFocused == this._textFieldSecond)
					return;
				else	
				{
					//Prevent normal tab stop handling
					keyboardEvent.preventDefault();
					
					this._textFieldFocused.dispatchEvent(new ElementEvent("focusout", false));
					
					if (this._textFieldFocused == this._textFieldHour)
						this._textFieldFocused = this._textFieldMinute;
					else //if (this._textFieldFocused == this._textFieldMinute)
						this._textFieldFocused = this._textFieldSecond;
					
					this._textFieldFocused.dispatchEvent(new ElementEvent("focusin", false));
				}
			}
			else //if (shiftPressed == true)
			{
				if (this._textFieldFocused == this._textFieldHour)
					return;
				else
				{
					//Prevent normal tab stop handling
					keyboardEvent.preventDefault();
					
					this._textFieldFocused.dispatchEvent(new ElementEvent("focusout", false));
					
					if (this._textFieldFocused == this._textFieldSecond)
						this._textFieldFocused = this._textFieldMinute;
					else //if (this._textFieldFocused == this._textFieldMinute)
						this._textFieldFocused = this._textFieldHour;
					
					this._textFieldFocused.dispatchEvent(new ElementEvent("focusin", false));
				}
			}
		}
		else
		{
			var clonedEvent = keyboardEvent.clone();
			clonedEvent._bubbles = false; //Dont bubble.
			
			//Dispatch non-bubbling keyboard event to our text field.
			this._textFieldFocused.dispatchEvent(clonedEvent);
			
			if (clonedEvent.getIsCanceled() == true)
				keyboardEvent.cancelEvent();
				
			if (clonedEvent.getDefaultPrevented() == true)
				keyboardEvent.preventDefault();
		}
	};

//@override
TimeInputElement.prototype._onTextInputKeyUp = 
	function (keyboardEvent)
	{
		if (keyboardEvent.getDefaultPrevented() == true)
			return;
		
		var key = keyboardEvent.getKey();
		
		if (key.length == 1 && 
			key != "0" && key != "1" &&
			key != "2" && key != "3" &&
			key != "4" && key != "5" &&
			key != "6" && key != "7" &&
			key != "8" && key != "9")
		{
			return;
		}
		
		var clonedEvent = keyboardEvent.clone();
		clonedEvent._bubbles = false; //Dont bubble.
		
		//Dispatch non-bubbling keyboard event to our text field.
		this._textFieldFocused.dispatchEvent(clonedEvent);
		
		if (clonedEvent.getIsCanceled() == true)
			keyboardEvent.cancelEvent();
			
		if (clonedEvent.getDefaultPrevented() == true)
			keyboardEvent.preventDefault();
	};	
	
//@override	
TimeInputElement.prototype._onTextInputFocusIn = 
	function (elementEvent)
	{
		//This only works because TextField doesnt look at _isFocused (manages caret state with different flag)
		this._textFieldHour.dispatchEvent(elementEvent.clone()); 
		this._textFieldFocused = this._textFieldHour;
	};

//@override	
TimeInputElement.prototype._onTextInputFocusOut = 
	function (elementEvent)
	{
		//This only works because TextField doesnt look at _isFocused (manages caret state with different flag)
		this._textFieldFocused.dispatchEvent(elementEvent.clone());
		this._textFieldFocused = null; 
	};

/**
 * @function _onTimeInputTextFieldMouseDown
 * Event handler for the internal TextField's "mousedown" event. Only active when TimeInput is enabled. 
 * 
 * @param mouseEvent ElementMouseEvent
 * ElementMouseEvent to process.
 */	
TimeInputElement.prototype._onTimeInputTextFieldMouseDown = 
	function (mouseEvent)
	{
		if (mouseEvent.getTarget() != this._textFieldFocused && this._textFieldFocused != null)
			this._textFieldFocused.dispatchEvent(new ElementEvent("focusout", false));
		
		this._textFieldFocused = mouseEvent.getTarget();
	};	
	
/**
 * @function _onTimeInputTextFieldFocusOut
 * Event handler for the internal TextField's "focusout" event.
 * 
 * @param elementEvent ElementEvent
 * ElementEvent to process.
 */		
TimeInputElement.prototype._onTimeInputTextFieldFocusOut = 
	function (event)
	{
		var textField = event.getTarget();
		var text = textField.getText();
		
		if (text.length == 0)
			return;
		
		if (textField == this._textFieldHour)
			this.setHours(text);
		else if (textField == this._textFieldMinute)
			this.setMinutes(text)
		else //if (textField == this._textFieldSecond
			this.setSeconds(text);
	};
	
//@override
TimeInputElement.prototype._updateTextColors = 
	function ()
	{
		this._textFieldHour.setStyle("TextColor", this._getTextColor(this._currentSkinState));
		this._textFieldHour.setStyle("TextHighlightedColor", this._getTextHighlightedColor(this._currentSkinState));
		this._textFieldHour.setStyle("TextHighlightedBackgroundColor", this._getTextHighlightedBackgroundColor(this._currentSkinState));
		
		this._textFieldMinute.setStyle("TextColor", this._getTextColor(this._currentSkinState));
		this._textFieldMinute.setStyle("TextHighlightedColor", this._getTextHighlightedColor(this._currentSkinState));
		this._textFieldMinute.setStyle("TextHighlightedBackgroundColor", this._getTextHighlightedBackgroundColor(this._currentSkinState));
		
		this._textFieldSecond.setStyle("TextColor", this._getTextColor(this._currentSkinState));
		this._textFieldSecond.setStyle("TextHighlightedColor", this._getTextHighlightedColor(this._currentSkinState));
		this._textFieldSecond.setStyle("TextHighlightedBackgroundColor", this._getTextHighlightedBackgroundColor(this._currentSkinState));
	};
	
//@override
TimeInputElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		//TimeInputElement.base.base - skip TextInput._doStylesUpdated()
		TimeInputElement.base.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		//Force the textField to use our defaults rather than inherited.
		if ("TextHorizontalAlign" in stylesMap)
		{
			this._textFieldHour.setStyle("TextHorizontalAlign", this.getStyle("TextHorizontalAlign"));
			this._textFieldMinute.setStyle("TextHorizontalAlign", this.getStyle("TextHorizontalAlign"));
			this._textFieldSecond.setStyle("TextHorizontalAlign", this.getStyle("TextHorizontalAlign"));
		}
		
		if ("TextVerticalAlign" in stylesMap)
		{
			this._textFieldHour.setStyle("TextVerticalAlign", this.getStyle("TextVerticalAlign"));
			this._textFieldMinute.setStyle("TextVerticalAlign", this.getStyle("TextVerticalAlign"));
			this._textFieldSecond.setStyle("TextVerticalAlign", this.getStyle("TextVerticalAlign"));
			
			this._labelColon1.setStyle("TextVerticalAlign", this.getStyle("TextVerticalAlign"));
			this._labelColon2.setStyle("TextVerticalAlign", this.getStyle("TextVerticalAlign"));
		}
		
		if ("Enabled" in stylesMap)
		{
			var enabled = this.getStyle("Enabled");
			
			this._textFieldHour.setStyle("Enabled", enabled);
			this._textFieldMinute.setStyle("Enabled", enabled);
			this._textFieldSecond.setStyle("Enabled", enabled);
			
			if (enabled == true)
			{
				if (this.hasEventListener("keydown", this._onTextInputKeyUpDownInstance) == false)
					this.addEventListener("keydown", this._onTextInputKeyUpDownInstance);
				
				if (this.hasEventListener("keyup", this._onTextInputKeyUpDownInstance) == false)
					this.addEventListener("keyup", this._onTextInputKeyUpDownInstance);
				
				if (this._textFieldHour.hasEventListener("changed", this._onTextInputTextFieldChangedInstance) == false)
					this._textFieldHour.addEventListener("changed", this._onTextInputTextFieldChangedInstance);		
				
				if (this._textFieldMinute.hasEventListener("changed", this._onTextInputTextFieldChangedInstance) == false)
					this._textFieldMinute.addEventListener("changed", this._onTextInputTextFieldChangedInstance);	
				
				if (this._textFieldSecond.hasEventListener("changed", this._onTextInputTextFieldChangedInstance) == false)
					this._textFieldSecond.addEventListener("changed", this._onTextInputTextFieldChangedInstance);	
				
				if (this._textFieldHour.hasEventListener("mousedown", this._onTimeInputTextFieldMouseDownInstance) == false)
					this._textFieldHour.addEventListener("mousedown", this._onTimeInputTextFieldMouseDownInstance);
				
				if (this._textFieldMinute.hasEventListener("mousedown", this._onTimeInputTextFieldMouseDownInstance) == false)
					this._textFieldMinute.addEventListener("mousedown", this._onTimeInputTextFieldMouseDownInstance);
				
				if (this._textFieldSecond.hasEventListener("mousedown", this._onTimeInputTextFieldMouseDownInstance) == false)
					this._textFieldSecond.addEventListener("mousedown", this._onTimeInputTextFieldMouseDownInstance);
			}
			else
			{
				if (this.hasEventListener("keydown", this._onTextInputKeyUpDownInstance) == true)
					this.removeEventListener("keydown", this._onTextInputKeyUpDownInstance);
				
				if (this.hasEventListener("keyup", this._onTextInputKeyUpDownInstance) == true)
					this.removeEventListener("keyup", this._onTextInputKeyUpDownInstance);
				
				if (this._textFieldHour.hasEventListener("changed", this._onTextInputTextFieldChangedInstance) == true)
					this._textFieldHour.removeEventListener("changed", this._onTextInputTextFieldChangedInstance);
				
				if (this._textFieldMinute.hasEventListener("changed", this._onTextInputTextFieldChangedInstance) == true)
					this._textFieldMinute.removeEventListener("changed", this._onTextInputTextFieldChangedInstance);
				
				if (this._textFieldSecond.hasEventListener("changed", this._onTextInputTextFieldChangedInstance) == true)
					this._textFieldSecond.removeEventListener("changed", this._onTextInputTextFieldChangedInstance);
				
				if (this._textFieldHour.hasEventListener("mousedown", this._onTimeInputTextFieldMouseDownInstance) == true)
					this._textFieldHour.removeEventListener("mousedown", this._onTimeInputTextFieldMouseDownInstance);
				
				if (this._textFieldMinute.hasEventListener("mousedown", this._onTimeInputTextFieldMouseDownInstance) == true)
					this._textFieldMinute.removeEventListener("mousedown", this._onTimeInputTextFieldMouseDownInstance);
				
				if (this._textFieldSecond.hasEventListener("mousedown", this._onTimeInputTextFieldMouseDownInstance) == true)
					this._textFieldSecond.removeEventListener("mousedown", this._onTimeInputTextFieldMouseDownInstance);
			}
		}
		
		if ("TextLinePaddingTop" in stylesMap || 
			"TextLinePaddingBottom" in stylesMap)
		{
			this._invalidateMeasure();
		}
		
		if ("Padding" in stylesMap ||
			"PaddingTop" in stylesMap ||
			"PaddingBottom" in stylesMap ||
			"PaddingLeft" in stylesMap ||
			"PaddingRight" in stylesMap)
		{
			var paddingSize = this._getPaddingSize();
			
			this._textFieldHour.setStyle("PaddingLeft", paddingSize.paddingLeft);
			this._textFieldHour.setStyle("PaddingTop", paddingSize.paddingTop);
			this._textFieldHour.setStyle("PaddingBottom", paddingSize.paddingBottom);
			
			this._textFieldMinute.setStyle("PaddingTop", paddingSize.paddingTop);
			this._textFieldMinute.setStyle("PaddingBottom", paddingSize.paddingBottom);
			
			this._textFieldSecond.setStyle("PaddingRight", paddingSize.paddingRight);
			this._textFieldSecond.setStyle("PaddingTop", paddingSize.paddingTop);
			this._textFieldSecond.setStyle("PaddingBottom", paddingSize.paddingBottom);
			
			this._labelColon1.setStyle("PaddingTop", paddingSize.paddingTop);
			this._labelColon1.setStyle("PaddingBottom", paddingSize.paddingBottom);
			
			this._labelColon2.setStyle("PaddingTop", paddingSize.paddingTop);
			this._labelColon2.setStyle("PaddingBottom", paddingSize.paddingBottom);
			
			this._invalidateMeasure();
		}
		
		//Will adjust 24 -> 12 hour
		if ("Is24HourTime" in stylesMap)
			this.setHours(this._hour);
		
		this._updateSkinStyles(stylesMap);
	};
	
//@override
TimeInputElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		var fontString = this._getFontString();
	
		var measuredHeight = this.getStyle("TextSize") + this.getStyle("TextLinePaddingTop") + this.getStyle("TextLinePaddingBottom");
		
		var measuredWidth = (CanvasElement._measureText("00", fontString) + 6) * 3;
		measuredWidth += this._labelColon1._getStyledOrMeasuredWidth() * 2;
		
		measuredWidth += padWidth;
		measuredHeight += padHeight;
	
		this._setMeasuredSize(measuredWidth, measuredHeight);
	};
	
//@override	
TimeInputElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		//TimeInputElement.base.base - Skip TextInput._doLayout()
		TimeInputElement.base.base.prototype._doLayout.call(this, paddingMetrics);
		
		//Ignore padding, proxied to TextFields for proper mouse handling.		
		this._listContainer._setActualPosition(0, 0);
		this._listContainer._setActualSize(this._width, this._height);
	};
	
	