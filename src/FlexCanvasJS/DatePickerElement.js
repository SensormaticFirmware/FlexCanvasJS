
/**
 * @depends CanvasElement.js
 * @depends ArrowShape.js
 */

//////////////////////////////////////////////////////////////
///////////////DatePickerElement/////////////////////////////

/**
 * @class DatePickerElement
 * @inherits CanvasElement
 * 
 * DatePickerElement is a calendar class used to select dates.  
 * 
 * @constructor ColorPickerElement 
 * Creates new ColorPickerElement instance.
 */

function DatePickerElement() //extends CanvasElement
{
	DatePickerElement.base.prototype.constructor.call(this);
	
	//Setup static style for days grid (all instances use same style for all rows/columns)
	if (DatePickerElement._GridDaysRowColumnStyle == null)
	{
		DatePickerElement._GridDaysRowColumnStyle = new GridContainerRowColumnDefinition();
		DatePickerElement._GridDaysRowColumnStyle.setStyle("PercentSize", 100);
	}
	
	/////////////
	
	//Use list container to control layout
	this._rootListContainer = new ListContainerElement();
	this._rootListContainer.setStyle("LayoutGap", 5);
	this._rootListContainer.setStyle("LayoutDirection", "vertical");
	this._rootListContainer.setStyle("LayoutHorizontalAlign", "center");
	
		this._listContainerYearMonthSelection = new ListContainerElement();
		this._listContainerYearMonthSelection.setStyle("PercentWidth", 100);
		this._listContainerYearMonthSelection.setStyle("LayoutDirection", "horizontal");
		this._listContainerYearMonthSelection.setStyle("LayoutHorizontalAlign", "center");
		this._listContainerYearMonthSelection.setStyle("LayoutVerticalAlign", "middle");
		
			this._buttonMonthDecrement = new ButtonElement();
			
			this._anchorContainerLabelMonths = new AnchorContainerElement();
			
				this._labelMonth1 = new LabelElement();
				this._labelMonth1.setStyle("Visible", false);
				this._labelMonth1.setStyle("PercentWidth", 100);
				
				this._labelMonth2 = new LabelElement();
				this._labelMonth2.setStyle("Visible", false);
				this._labelMonth2.setStyle("PercentWidth", 100);
				
				this._labelMonth3 = new LabelElement();
				this._labelMonth3.setStyle("Visible", false);
				this._labelMonth3.setStyle("PercentWidth", 100);
				
				this._labelMonth4 = new LabelElement();
				this._labelMonth4.setStyle("Visible", false);
				this._labelMonth4.setStyle("PercentWidth", 100);
				
				this._labelMonth5 = new LabelElement();
				this._labelMonth5.setStyle("Visible", false);
				this._labelMonth5.setStyle("PercentWidth", 100);
				
				this._labelMonth6 = new LabelElement();
				this._labelMonth6.setStyle("Visible", false);
				this._labelMonth6.setStyle("PercentWidth", 100);
				
				this._labelMonth7 = new LabelElement();
				this._labelMonth7.setStyle("Visible", false);
				this._labelMonth7.setStyle("PercentWidth", 100);
				
				this._labelMonth8 = new LabelElement();
				this._labelMonth8.setStyle("Visible", false);
				this._labelMonth8.setStyle("PercentWidth", 100);
				
				this._labelMonth9 = new LabelElement();
				this._labelMonth9.setStyle("Visible", false);
				this._labelMonth9.setStyle("PercentWidth", 100);
				
				this._labelMonth10 = new LabelElement();
				this._labelMonth10.setStyle("Visible", false);
				this._labelMonth10.setStyle("PercentWidth", 100);
				
				this._labelMonth11 = new LabelElement();
				this._labelMonth11.setStyle("Visible", false);
				this._labelMonth11.setStyle("PercentWidth", 100);
				
				this._labelMonth12 = new LabelElement();
				this._labelMonth12.setStyle("Visible", false);
				this._labelMonth12.setStyle("PercentWidth", 100);
				
			this._anchorContainerLabelMonths.addElement(this._labelMonth1);
			this._anchorContainerLabelMonths.addElement(this._labelMonth2);
			this._anchorContainerLabelMonths.addElement(this._labelMonth3);
			this._anchorContainerLabelMonths.addElement(this._labelMonth4);
			this._anchorContainerLabelMonths.addElement(this._labelMonth5);
			this._anchorContainerLabelMonths.addElement(this._labelMonth6);
			this._anchorContainerLabelMonths.addElement(this._labelMonth7);
			this._anchorContainerLabelMonths.addElement(this._labelMonth8);
			this._anchorContainerLabelMonths.addElement(this._labelMonth9);
			this._anchorContainerLabelMonths.addElement(this._labelMonth10);
			this._anchorContainerLabelMonths.addElement(this._labelMonth11);
			this._anchorContainerLabelMonths.addElement(this._labelMonth12);
				
			this._buttonMonthIncrement = new ButtonElement();
			
			this._spacerYearMonth = new CanvasElement();
			this._spacerYearMonth.setStyle("PercentWidth", 100);
			this._spacerYearMonth.setStyle("MinWidth", 20);
			
			this._buttonYearDecrement = new ButtonElement();
			this._labelYear = new LabelElement();
			this._buttonYearIncrement = new ButtonElement();

		this._listContainerYearMonthSelection.addElement(this._buttonMonthDecrement);
		this._listContainerYearMonthSelection.addElement(this._anchorContainerLabelMonths);
		this._listContainerYearMonthSelection.addElement(this._buttonMonthIncrement);	
		this._listContainerYearMonthSelection.addElement(this._spacerYearMonth);	
		this._listContainerYearMonthSelection.addElement(this._buttonYearDecrement);
		this._listContainerYearMonthSelection.addElement(this._labelYear);
		this._listContainerYearMonthSelection.addElement(this._buttonYearIncrement);
		
		this._gridDaysContainer = new GridContainerElement();
		this._gridDaysContainer.setStyle("PercentWidth", 100);
		this._gridDaysContainer.setStyle("PercentHeight", 100);
		this._gridDaysContainer.setStyle("LayoutVerticalGap", 1);
		this._gridDaysContainer.setStyle("LayoutHorizontalGap", 1);
		
			//All rows and columns set to 100% except days label row
			this._gridDaysContainer.setRowDefinition(DatePickerElement._GridDaysRowColumnStyle, 1);
			this._gridDaysContainer.setRowDefinition(DatePickerElement._GridDaysRowColumnStyle, 2);
			this._gridDaysContainer.setRowDefinition(DatePickerElement._GridDaysRowColumnStyle, 3);
			this._gridDaysContainer.setRowDefinition(DatePickerElement._GridDaysRowColumnStyle, 4);
			this._gridDaysContainer.setRowDefinition(DatePickerElement._GridDaysRowColumnStyle, 5);
			this._gridDaysContainer.setRowDefinition(DatePickerElement._GridDaysRowColumnStyle, 6);
			
			this._gridDaysContainer.setColumnDefinition(DatePickerElement._GridDaysRowColumnStyle, 0);
			this._gridDaysContainer.setColumnDefinition(DatePickerElement._GridDaysRowColumnStyle, 1);
			this._gridDaysContainer.setColumnDefinition(DatePickerElement._GridDaysRowColumnStyle, 2);
			this._gridDaysContainer.setColumnDefinition(DatePickerElement._GridDaysRowColumnStyle, 3);
			this._gridDaysContainer.setColumnDefinition(DatePickerElement._GridDaysRowColumnStyle, 4);
			this._gridDaysContainer.setColumnDefinition(DatePickerElement._GridDaysRowColumnStyle, 5);
			this._gridDaysContainer.setColumnDefinition(DatePickerElement._GridDaysRowColumnStyle, 6);
			
			this._labelDay1 = new LabelElement();
			this._labelDay2 = new LabelElement();
			this._labelDay3 = new LabelElement();
			this._labelDay4 = new LabelElement();
			this._labelDay5 = new LabelElement();
			this._labelDay6 = new LabelElement();
			this._labelDay7 = new LabelElement();
			
			//Toggle buttons added dynamically
			
		this._gridDaysContainer.setCellElement(this._labelDay1, 0, 0);
		this._gridDaysContainer.setCellElement(this._labelDay2, 0, 1);
		this._gridDaysContainer.setCellElement(this._labelDay3, 0, 2);
		this._gridDaysContainer.setCellElement(this._labelDay4, 0, 3);
		this._gridDaysContainer.setCellElement(this._labelDay5, 0, 4);
		this._gridDaysContainer.setCellElement(this._labelDay6, 0, 5);
		this._gridDaysContainer.setCellElement(this._labelDay7, 0, 6);

	this._rootListContainer.addElement(this._listContainerYearMonthSelection);
	this._rootListContainer.addElement(this._gridDaysContainer);

	this._addChild(this._rootListContainer);


	///////Event Handlers///////////
	
	//Private event handlers, different instance needed for each ColorPicker, proxy to prototype
	
	var _self = this;
	
	this._onButtonYearDecrementClickInstance = 
		function (mouseEvent)
		{
			_self._buttonYearDecrementClick(mouseEvent);
		};
		
	this._onButtonYearIncrementClickInstance = 
		function (mouseEvent)
		{
			_self._buttonYearIncrementClick(mouseEvent);
		};
		
	this._onButtonMonthDecrementClickInstance = 
		function (mouseEvent)
		{
			_self._buttonMonthDecrementClick(mouseEvent);
		};		
		
	this._onButtonMonthIncrementClickInstance = 
		function (mouseEvent)
		{
			_self._buttonMonthIncrementClick(mouseEvent);
		};
	
	this._buttonDayChangedInstance = 
		function (event)
		{
			_self._buttonDayChanged(event);
		};
		
	this._listContainerYearMonthSelectionLayoutCompleteInstance = 
		function (event)
		{
			_self._listContainerYearMonthSelectionLayoutComplete(event);
		};
		
	//////////////////
		
	//Populate days grid buttons
	var buttonDay = null;
	for (var week = 1; week < 7; week++)
	{
		for (var day = 0; day < 7; day++)
		{
			buttonDay = new ToggleButtonElement();
			buttonDay.setStyle("Enabled", false);
			buttonDay.setStyle("AllowDeselect", false);
			buttonDay.addEventListener("changed", this._buttonDayChangedInstance);
			
			this._gridDaysContainer.setCellElement(buttonDay, week, day);
		}
	}
	
	this._buttonYearDecrement.addEventListener("click", this._onButtonYearDecrementClickInstance);
	this._buttonYearIncrement.addEventListener("click", this._onButtonYearIncrementClickInstance);
	this._buttonMonthDecrement.addEventListener("click", this._onButtonMonthDecrementClickInstance);
	this._buttonMonthIncrement.addEventListener("click", this._onButtonMonthIncrementClickInstance);
	
	this._listContainerYearMonthSelection.addEventListener("layoutcomplete", this._listContainerYearMonthSelectionLayoutCompleteInstance);
	
	//////////////////
	
	this._displayedYear = null;
	this._displayedMonth = null;
	
	this._selectedDate = null;
	this.setSelectedDate(null);
}

//Inherit from CanvasElement
DatePickerElement.prototype = Object.create(CanvasElement.prototype);
DatePickerElement.prototype.constructor = DatePickerElement;
DatePickerElement.base = CanvasElement;


////////////Static//////////////////////

DatePickerElement._GridDaysRowColumnStyle = null;


////////////Events/////////////////////////////////////

/**
 * @event changed ElementEvent
 * Dispatched when the DatePicker selection state changes as a result of user interaction.
 */

/////////////Style Types///////////////////////////////

DatePickerElement._StyleTypes = Object.create(null);

/**
 * @style LabelYearStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to the year label element.
 */
DatePickerElement._StyleTypes.LabelYearStyle = 				StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

/**
 * @style ButtonYearIncrementStyle StyleDefinition
 * StyleDefinition or [StyleDefinition] array to be applied to the year increment Button.
 */
DatePickerElement._StyleTypes.ButtonYearIncrementStyle = 	StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition

/**
 * @style ButtonYearDecrementStyle StyleDefinition
 * StyleDefinition or [StyleDefinition] array to be applied to the year decrement Button.
 */
DatePickerElement._StyleTypes.ButtonYearDecrementStyle = 	StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition

/**
 * @style LabelMonthStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to the month label element.
 */
DatePickerElement._StyleTypes.LabelMonthStyle = 			StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

/**
 * @style ButtonMonthIncrementStyle StyleDefinition
 * StyleDefinition or [StyleDefinition] array to be applied to the month increment Button.
 */
DatePickerElement._StyleTypes.ButtonMonthIncrementStyle = 	StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition

/**
 * @style ButtonMonthDecrementStyle StyleDefinition
 * StyleDefinition or [StyleDefinition] array to be applied to the month decrement Button.
 */
DatePickerElement._StyleTypes.ButtonMonthDecrementStyle = 	StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition

/**
 * @style LabelDayStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to the day label elements.
 */
DatePickerElement._StyleTypes.LabelDayStyle = 				StyleableBase.EStyleType.SUBSTYLE;		//StyleDefinition

/**
 * @style ButtonDaysStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to the day ToggleButton elements.
 */
DatePickerElement._StyleTypes.ToggleButtonDaysStyle = 		StyleableBase.EStyleType.SUBSTYLE;			//StyleDefinition

/**
 * @style Month1String String
 * String to use for month 1's name.
 */
DatePickerElement._StyleTypes.Month1String = 				StyleableBase.EStyleType.NORMAL;		// String

/**
 * @style Month2String String
 * String to use for month 2's name.
 */
DatePickerElement._StyleTypes.Month2String = 				StyleableBase.EStyleType.NORMAL;		// String

/**
 * @style Month3String String
 * String to use for month 3's name.
 */
DatePickerElement._StyleTypes.Month3String = 				StyleableBase.EStyleType.NORMAL;		// String

/**
 * @style Month4String String
 * String to use for month 4's name.
 */
DatePickerElement._StyleTypes.Month4String = 				StyleableBase.EStyleType.NORMAL;		// String

/**
 * @style Month5String String
 * String to use for month 5's name.
 */
DatePickerElement._StyleTypes.Month5String = 				StyleableBase.EStyleType.NORMAL;		// String

/**
 * @style Month6String String
 * String to use for month 6's name.
 */
DatePickerElement._StyleTypes.Month6String = 				StyleableBase.EStyleType.NORMAL;		// String

/**
 * @style Month7String String
 * String to use for month 7's name.
 */
DatePickerElement._StyleTypes.Month7String = 				StyleableBase.EStyleType.NORMAL;		// String

/**
 * @style Month8String String
 * String to use for month 8's name.
 */
DatePickerElement._StyleTypes.Month8String = 				StyleableBase.EStyleType.NORMAL;		// String

/**
 * @style Month9String String
 * String to use for month 9's name.
 */
DatePickerElement._StyleTypes.Month9String = 				StyleableBase.EStyleType.NORMAL;		// String

/**
 * @style Month10String String
 * String to use for month 10's name.
 */
DatePickerElement._StyleTypes.Month10String = 				StyleableBase.EStyleType.NORMAL;		// String

/**
 * @style Month11String String
 * String to use for month 11's name.
 */
DatePickerElement._StyleTypes.Month11String = 				StyleableBase.EStyleType.NORMAL;		// String

/**
 * @style Month12String String
 * String to use for month 12's name.
 */
DatePickerElement._StyleTypes.Month12String = 				StyleableBase.EStyleType.NORMAL;		// String

/**
 * @style Day1String String
 * String to use for day 1's name.
 */
DatePickerElement._StyleTypes.Day1String = 					StyleableBase.EStyleType.NORMAL;		// String

/**
 * @style Day2String String
 * String to use for day 2's name.
 */
DatePickerElement._StyleTypes.Day2String = 					StyleableBase.EStyleType.NORMAL;		// String

/**
 * @style Day3String String
 * String to use for day 3's name.
 */
DatePickerElement._StyleTypes.Day3String = 					StyleableBase.EStyleType.NORMAL;		// String

/**
 * @style Day4String String
 * String to use for day 4's name.
 */
DatePickerElement._StyleTypes.Day4String = 					StyleableBase.EStyleType.NORMAL;		// String

/**
 * @style Day5String String
 * String to use for day 5's name.
 */
DatePickerElement._StyleTypes.Day5String = 					StyleableBase.EStyleType.NORMAL;		// String

/**
 * @style Day6String String
 * String to use for day 6's name.
 */
DatePickerElement._StyleTypes.Day6String = 					StyleableBase.EStyleType.NORMAL;		// String

/**
 * @style Day7String String
 * String to use for day 7's name.
 */
DatePickerElement._StyleTypes.Day7String = 					StyleableBase.EStyleType.NORMAL;		// String


////////////Default Styles/////////////////////////////

DatePickerElement.StyleDefault = new StyleDefinition();

////Default Sub Styles/////

DatePickerElement.LabelYearMonthStyleDefault = new StyleDefinition();
DatePickerElement.LabelYearMonthStyleDefault.setStyle("TextHorizontalAlign", 	"center");
DatePickerElement.LabelYearMonthStyleDefault.setStyle("PaddingLeft", 			8);
DatePickerElement.LabelYearMonthStyleDefault.setStyle("PaddingRight", 			8);

DatePickerElement.ArrowShapeLeft = new ArrowShape();
DatePickerElement.ArrowShapeLeft.setStyle("Direction", "left");

DatePickerElement.ArrowShapeRight = new ArrowShape();
DatePickerElement.ArrowShapeRight.setStyle("Direction", "right");

DatePickerElement.ButtonYearMonthDecSkinStyleDefault = new StyleDefinition();
DatePickerElement.ButtonYearMonthDecSkinStyleDefault.setStyle("BackgroundShape", DatePickerElement.ArrowShapeLeft);

DatePickerElement.ButtonYearMonthIncSkinStyleDefault = new StyleDefinition();
DatePickerElement.ButtonYearMonthIncSkinStyleDefault.setStyle("BackgroundShape", DatePickerElement.ArrowShapeRight);

DatePickerElement.ButtonYearMonthDecStyleDefault = new StyleDefinition();
DatePickerElement.ButtonYearMonthDecStyleDefault.setStyle("PercentHeight", 		75);
DatePickerElement.ButtonYearMonthDecStyleDefault.setStyle("UpSkinStyle", 		DatePickerElement.ButtonYearMonthDecSkinStyleDefault);
DatePickerElement.ButtonYearMonthDecStyleDefault.setStyle("OverSkinStyle", 		DatePickerElement.ButtonYearMonthDecSkinStyleDefault);
DatePickerElement.ButtonYearMonthDecStyleDefault.setStyle("DownSkinStyle", 		DatePickerElement.ButtonYearMonthDecSkinStyleDefault);

DatePickerElement.ButtonYearMonthIncStyleDefault = new StyleDefinition();
DatePickerElement.ButtonYearMonthIncStyleDefault.setStyle("PercentHeight", 		75);
DatePickerElement.ButtonYearMonthIncStyleDefault.setStyle("UpSkinStyle", 		DatePickerElement.ButtonYearMonthIncSkinStyleDefault);
DatePickerElement.ButtonYearMonthIncStyleDefault.setStyle("OverSkinStyle", 		DatePickerElement.ButtonYearMonthIncSkinStyleDefault);
DatePickerElement.ButtonYearMonthIncStyleDefault.setStyle("DownSkinStyle", 		DatePickerElement.ButtonYearMonthIncSkinStyleDefault);

DatePickerElement.LabelDayStyleDefault = new StyleDefinition();
DatePickerElement.LabelDayStyleDefault.setStyle("TextHorizontalAlign",			"center");

DatePickerElement.ToggleButtonDaysSkinStyleDefault = new StyleDefinition();
DatePickerElement.ToggleButtonDaysSkinStyleDefault.setStyle("BorderType",		null);		

DatePickerElement.ToggleButtonDaysStyleDefault = new StyleDefinition();
DatePickerElement.ToggleButtonDaysStyleDefault.setStyle("UpSkinStyle", 			DatePickerElement.ToggleButtonDaysSkinStyleDefault);
DatePickerElement.ToggleButtonDaysStyleDefault.setStyle("OverSkinStyle", 		DatePickerElement.ToggleButtonDaysSkinStyleDefault);
DatePickerElement.ToggleButtonDaysStyleDefault.setStyle("DownSkinStyle", 		DatePickerElement.ToggleButtonDaysSkinStyleDefault);
DatePickerElement.ToggleButtonDaysStyleDefault.setStyle("DisabledSkinStyle", 	DatePickerElement.ToggleButtonDaysSkinStyleDefault);
DatePickerElement.ToggleButtonDaysStyleDefault.setStyle("PaddingTop", 			5);
DatePickerElement.ToggleButtonDaysStyleDefault.setStyle("PaddingBottom", 		5);
DatePickerElement.ToggleButtonDaysStyleDefault.setStyle("PaddingLeft", 			5);
DatePickerElement.ToggleButtonDaysStyleDefault.setStyle("PaddingRight", 		5);


////Root Styles////

DatePickerElement.StyleDefault.setStyle("LabelYearStyle", 						DatePickerElement.LabelYearMonthStyleDefault);
DatePickerElement.StyleDefault.setStyle("ButtonYearDecrementStyle", 			DatePickerElement.ButtonYearMonthDecStyleDefault);
DatePickerElement.StyleDefault.setStyle("ButtonYearIncrementStyle", 			DatePickerElement.ButtonYearMonthIncStyleDefault);
DatePickerElement.StyleDefault.setStyle("LabelMonthStyle", 						DatePickerElement.LabelYearMonthStyleDefault);
DatePickerElement.StyleDefault.setStyle("ButtonMonthDecrementStyle", 			DatePickerElement.ButtonYearMonthDecStyleDefault);
DatePickerElement.StyleDefault.setStyle("ButtonMonthIncrementStyle", 			DatePickerElement.ButtonYearMonthIncStyleDefault);
DatePickerElement.StyleDefault.setStyle("LabelDayStyle", 						DatePickerElement.LabelDayStyleDefault);
DatePickerElement.StyleDefault.setStyle("ToggleButtonDaysStyle", 				DatePickerElement.ToggleButtonDaysStyleDefault);
DatePickerElement.StyleDefault.setStyle("PaddingTop", 							5);
DatePickerElement.StyleDefault.setStyle("PaddingBottom", 						5);
DatePickerElement.StyleDefault.setStyle("PaddingLeft", 							5);
DatePickerElement.StyleDefault.setStyle("PaddingRight", 						5);
DatePickerElement.StyleDefault.setStyle("BorderType", 							"solid");

DatePickerElement.StyleDefault.setStyle("Month1String", 						"Jan");
DatePickerElement.StyleDefault.setStyle("Month2String", 						"Feb");
DatePickerElement.StyleDefault.setStyle("Month3String", 						"Mar");
DatePickerElement.StyleDefault.setStyle("Month4String", 						"Apr");
DatePickerElement.StyleDefault.setStyle("Month5String", 						"May");
DatePickerElement.StyleDefault.setStyle("Month6String", 						"Jun");
DatePickerElement.StyleDefault.setStyle("Month7String", 						"Jul");
DatePickerElement.StyleDefault.setStyle("Month8String", 						"Aug");
DatePickerElement.StyleDefault.setStyle("Month9String", 						"Sep");
DatePickerElement.StyleDefault.setStyle("Month10String", 						"Oct");
DatePickerElement.StyleDefault.setStyle("Month11String", 						"Nov");
DatePickerElement.StyleDefault.setStyle("Month12String", 						"Dec");

DatePickerElement.StyleDefault.setStyle("Day1String", 							"S");
DatePickerElement.StyleDefault.setStyle("Day2String", 							"M");
DatePickerElement.StyleDefault.setStyle("Day3String", 							"T");
DatePickerElement.StyleDefault.setStyle("Day4String", 							"W");
DatePickerElement.StyleDefault.setStyle("Day5String", 							"T");
DatePickerElement.StyleDefault.setStyle("Day6String", 							"F");
DatePickerElement.StyleDefault.setStyle("Day7String", 							"S");



////////////Public////////////////
	
DatePickerElement.prototype.getSelectedDate = 
	function ()
	{
		return this._selectedDate;
	};

DatePickerElement.prototype.setSelectedDate = 
	function (date)
	{
		if (date != null && date instanceof Date == false)
			throw ("invalid date");
	
		this._selectedDate = date;
		
		if (date == null)
			date = new Date();
		
		this._displayedYear = date.getFullYear();
		this._displayedMonth = date.getMonth();
		
		this._updateCalendar();		
	};
	
	
////////////Internal//////////////
	
DatePickerElement.prototype._buttonYearDecrementClick = 
	function (mouseEvent)
	{
		this._displayedYear--;
		this._updateCalendar();
	};

DatePickerElement.prototype._buttonYearIncrementClick = 
	function (mouseEvent)
	{
		this._displayedYear++;
		this._updateCalendar();
	};	
	
DatePickerElement.prototype._buttonMonthDecrementClick = 
	function (mouseEvent)
	{
		this._displayedMonth--;
		if (this._displayedMonth == -1)
		{
			this._displayedYear--;
			this._displayedMonth = 11;
		}
		
		this._updateCalendar();
	};

DatePickerElement.prototype._buttonMonthIncrementClick = 
	function (mouseEvent)
	{
		this._displayedMonth++;
		if (this._displayedMonth == 12)
		{
			this._displayedYear++;
			this._displayedMonth = 0;
		}
		
		this._updateCalendar();
	};		
	
DatePickerElement.prototype._listContainerYearMonthSelectionLayoutComplete = 
	function (event)
	{
		this._buttonYearDecrement._setMeasuredSize(Math.round(this._buttonYearDecrement._height * .8), this._buttonYearDecrement._height);
		this._buttonYearIncrement._setMeasuredSize(Math.round(this._buttonYearIncrement._height * .8), this._buttonYearIncrement._height);

		this._buttonMonthDecrement._setMeasuredSize(Math.round(this._buttonMonthDecrement._height * .8), this._buttonMonthDecrement._height);
		this._buttonMonthIncrement._setMeasuredSize(Math.round(this._buttonMonthIncrement._height * .8), this._buttonMonthIncrement._height);
	};
	
DatePickerElement.prototype._buttonDayChanged = 
	function (event)
	{
		var day = Number(event.getTarget().getStyle("Text"));
		
		this._selectedDate = new Date(null);
		this._selectedDate.setFullYear(this._displayedYear);
		this._selectedDate.setMonth(this._displayedMonth);
		this._selectedDate.setDate(day);
		
		this._updateCalendar();
		
		if (this.hasEventListener("changed", null) == true)
			this.dispatchEvent(new ElementEvent("changed", false));
	};
	
DatePickerElement.prototype._updateCalendar = 
	function ()
	{
		var date = new Date();
		date.setFullYear(this._displayedYear);
		date.setMonth(this._displayedMonth);
		
		this._labelYear.setStyle("Text", date.getFullYear().toString());
		
		for (var i = 0; i < 12; i++)
		{
			if (this._displayedMonth == i)
				this["_labelMonth" + (i + 1).toString()].setStyle("Visible", true);
			else
				this["_labelMonth" + (i + 1).toString()].setStyle("Visible", false);
		}
		
		date.setDate(0);
		date.setDate(date.getDate() - date.getDay());
		
		var toggleButton = null;
		for (var week = 1; week < 7; week++)
		{
			for (var day = 0; day < 7; day++)
			{
				toggleButton = this._gridDaysContainer.getCellElement(week, day);
				toggleButton.setStyle("Text", date.getDate().toString());
				
				if (date.getMonth() == this._displayedMonth)
				{
					toggleButton.setStyle("Enabled", true);
					
					if (this._selectedDate != null &&
						date.getFullYear() == this._selectedDate.getFullYear() && 
						date.getMonth() == this._selectedDate.getMonth() &&
						date.getDate() == this._selectedDate.getDate())
					{
						toggleButton.setSelected(true);
					}
					else
						toggleButton.setSelected(false);
				}
				else
				{
					toggleButton.setStyle("Enabled", false);
					toggleButton.setSelected(false);
				}
					
				date.setDate(date.getDate() + 1);
			}
		}
	};

//@override
DatePickerElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		DatePickerElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("LabelYearStyle" in stylesMap)
			this._applySubStylesToElement("LabelYearStyle", this._labelYear);
		
		if ("ButtonYearDecrementStyle" in stylesMap)
			this._applySubStylesToElement("ButtonYearDecrementStyle", this._buttonYearDecrement);
		
		if ("ButtonYearIncrementStyle" in stylesMap)
			this._applySubStylesToElement("ButtonYearIncrementStyle", this._buttonYearIncrement);
		
		if ("LabelMonthStyle" in stylesMap)
		{
			for (var i = 0; i < 12; i++)
				this._applySubStylesToElement("LabelMonthStyle", this["_labelMonth" + (i + 1).toString() ]);
		}
		
		if ("ButtonMonthDecrementStyle" in stylesMap)
			this._applySubStylesToElement("ButtonMonthDecrementStyle", this._buttonMonthDecrement);
		
		if ("ButtonMonthIncrementStyle" in stylesMap)
			this._applySubStylesToElement("ButtonMonthIncrementStyle", this._buttonMonthIncrement);
		
		if ("LabelDayStyle" in stylesMap)
		{
			for (var day = 0; day < 7; day++)
				this._applySubStylesToElement("LabelDayStyle", this._gridDaysContainer.getCellElement(0, day));
		}
		
		if ("ToggleButtonDaysStyle" in stylesMap)
		{
			for (var week = 1; week < 7; week++)
			{
				for (var day = 0; day < 7; day++)
					this._applySubStylesToElement("ToggleButtonDaysStyle", this._gridDaysContainer.getCellElement(week, day));
			}
		}
		
		//Update day strings
		if ("Day1String" in stylesMap)
			this._labelDay1.setStyle("Text", this.getStyle("Day1String"));
		if ("Day2String" in stylesMap)
			this._labelDay2.setStyle("Text", this.getStyle("Day2String"));
		if ("Day3String" in stylesMap)
			this._labelDay3.setStyle("Text", this.getStyle("Day3String"));
		if ("Day4String" in stylesMap)
			this._labelDay4.setStyle("Text", this.getStyle("Day4String"));
		if ("Day5String" in stylesMap)
			this._labelDay5.setStyle("Text", this.getStyle("Day5String"));
		if ("Day6String" in stylesMap)
			this._labelDay6.setStyle("Text", this.getStyle("Day6String"));
		if ("Day7String" in stylesMap)
			this._labelDay7.setStyle("Text", this.getStyle("Day7String"));
		
		//Update month string
		if ("Month1String" in stylesMap)
			this._labelMonth1.setStyle("Text", this.getStyle("Month1String"));
		if ("Month2String" in stylesMap)
			this._labelMonth2.setStyle("Text", this.getStyle("Month2String"));
		if ("Month3String" in stylesMap)
			this._labelMonth3.setStyle("Text", this.getStyle("Month3String"));
		if ("Month4String" in stylesMap)
			this._labelMonth4.setStyle("Text", this.getStyle("Month4String"));
		if ("Month5String" in stylesMap)
			this._labelMonth5.setStyle("Text", this.getStyle("Month5String"));
		if ("Month6String" in stylesMap)
			this._labelMonth6.setStyle("Text", this.getStyle("Month6String"));
		if ("Month7String" in stylesMap)
			this._labelMonth7.setStyle("Text", this.getStyle("Month7String"));
		if ("Month8String" in stylesMap)
			this._labelMonth8.setStyle("Text", this.getStyle("Month8String"));
		if ("Month9String" in stylesMap)
			this._labelMonth9.setStyle("Text", this.getStyle("Month9String"));
		if ("Month10String" in stylesMap)
			this._labelMonth10.setStyle("Text", this.getStyle("Month10String"));
		if ("Month11String" in stylesMap)
			this._labelMonth11.setStyle("Text", this.getStyle("Month11String"));
		if ("Month12String" in stylesMap)
			this._labelMonth12.setStyle("Text", this.getStyle("Month12String"));
	};	

//@override
DatePickerElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		this._setMeasuredSize(padWidth + this._rootListContainer._measuredWidth, padHeight + this._rootListContainer._measuredHeight);
	};
	
//@override	
DatePickerElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		DatePickerElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		var x = paddingMetrics.getX();
		var y = paddingMetrics.getY();
		var w = paddingMetrics.getWidth();
		var h = paddingMetrics.getHeight();
		
		this._rootListContainer._setActualSize(w, h);
		this._rootListContainer._setActualPosition(x, y);
	};	
	
	

	