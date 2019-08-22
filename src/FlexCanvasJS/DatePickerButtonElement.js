
/**
 * @depends DropdownBaseElement.js
 */

//////////////////////////////////////////////////////////////
///////////////DatePickerButtonElement///////////////////////

/**
 * @class DatePickerButtonElement
 * @inherits DropdownBaseElement
 * 
 * DatePickerButtonElement is a compound button that creates a pop-up DatePicker
 * where the user can select a date which is then displayed on the button. 
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

	this._datePickerPopup = null;
	this._selectedDate = null;

	
	////////////////
	
	var _self = this;
	
	//Private event listeners, need an instance for each DatePickerButton, proxy to prototype.
		
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
}

//Inherit from ButtonElement
DatePickerButtonElement.prototype = Object.create(DropdownBaseElement.prototype);
DatePickerButtonElement.prototype.constructor = DatePickerButtonElement;
DatePickerButtonElement.base = DropdownBaseElement;


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
 * Dispatched when the date selection changes as a result of user input.
 */


/////////////Style Types/////////////////////////

DatePickerButtonElement._StyleTypes = Object.create(null);

/**
 * @style AllowDeselect boolean
 * When false, the DatePicker day ToggleButtons cannot be de-selected by the user and the "selectedOver" and "selectedDown" states are not used.
 */
DatePickerButtonElement._StyleTypes.AllowDeselect = 					StyleableBase.EStyleType.NORMAL;		// true || false

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
 * @style PopupDatePickerDistance Number
 * 
 * Vertical distance in pixels to place the DatePicker pop up from the button.
 * Defaults to -1 to collapse default 1 pixel borders.
 */
DatePickerButtonElement._StyleTypes.PopupDatePickerDistance = 			StyleableBase.EStyleType.NORMAL; 		


////////////Default Styles////////////////////

////DatePickerButton default style/////
DatePickerButtonElement.StyleDefault = new StyleDefinition();
DatePickerButtonElement.StyleDefault.setStyle("AllowDeselect",							false);
DatePickerButtonElement.StyleDefault.setStyle("DateFormatLabelFunction",				DatePickerButtonElement.DefaultDateFormatLabelFunction)		
DatePickerButtonElement.StyleDefault.setStyle("PopupDatePickerStyle", 					null);
DatePickerButtonElement.StyleDefault.setStyle("PopupDatePickerDistance", 				-1);			


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
		this._selectedDate = date;
	
		if (this._datePickerPopup != null)
			this._datePickerPopup.setSelectedDate(date);
		
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
		return this._selectedDate;
	};

	
/////////////Internal///////////////////////////////	
	
//@override
DatePickerButtonElement.prototype._createPopup = 
	function ()
	{
		this._datePickerPopup = new DatePickerElement();
		
		this._datePickerPopup.addEventListener("changed", this._onDatePickerChangedInstance);	
		this._datePickerPopup.addEventListener("layoutcomplete", this._onDatePickerLayoutCompleteInstance);
		
		this._applySubStylesToElement("PopupDatePickerStyle", this._datePickerPopup);
		this._datePickerPopup.setSelectedDate(this._selectedDate);
		this._datePickerPopup.setStyle("AllowDeselect", this.getStyle("AllowDeselect"));
		
		return this._datePickerPopup;
	};	

//@override	
DatePickerButtonElement.prototype._updateTweenPosition = 
	function (value)
	{
		this._datePickerPopup.setStyle("Alpha", value);
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
		this.setSelectedDate(this._datePickerPopup.getSelectedDate());
		
		if (this.hasEventListener("changed", null) == true)
			this.dispatchEvent(new ElementEvent("changed", false));
	
		this.close(true);
		
		if (this.hasEventListener("closed", null) == true)
			this.dispatchEvent(new ElementEvent("closed", false));
	};

/**
 * @function _updateText
 * Updates the date label text via the styled DateFormatLabelFunction
 */
DatePickerButtonElement.prototype._updateText = 
	function ()
	{
		var labelFunction = this.getStyle("DateFormatLabelFunction");
		
		if (this._selectedDate != null && labelFunction != null)
			text = labelFunction(this._selectedDate);
		else
			text = this.getStyle("Text");
		
		this._setLabelText(text);
	};

//@override
DatePickerButtonElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		DatePickerButtonElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("PopupDatePickerStyle" in stylesMap && this._datePickerPopup != null)
		{
			this._applySubStylesToElement("PopupDatePickerStyle", this._datePickerPopup);
			this._invalidateLayout();
		}
		
		if ("AllowDeselect" in stylesMap && this._datePickerPopup != null)
			this._datePickerPopup.setStyle("AllowDeselect", this.getStyle("AllowDeselect"));
		
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
			dateTextWidth = CanvasElement._measureText(labelFunction(new Date()), fontString);
		
		var textLabelWidth = 20;
		var textLabel = this.getStyle("Text");
		if (textLabel != null)
			textLabelWidth = CanvasElement._measureText(textLabel, fontString);
		
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
		if (this._datePickerPopup == null ||
			this._datePickerPopup._parent == null || 
			this._datePickerPopup._layoutInvalid == true)
		{
			return;
		}
	
		var managerMetrics = this.getMetrics(this._manager);
		
		var pickerDistance = this.getStyle("PopupDatePickerDistance");
		
		var pickerWidth = this._datePickerPopup.getStyle("Width");
		if (pickerWidth == null)
			pickerWidth = this._datePickerPopup._measuredWidth;
		
		var pickerHeight = this._datePickerPopup.getStyle("Height");
		if (pickerHeight == null)
			pickerHeight = this._datePickerPopup._measuredHeight;
		
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
	
	