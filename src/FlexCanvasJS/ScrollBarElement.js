
/**
 * @depends ListContainerElement.js
 * @depends ScrollButtonSkinElement.js
 */

///////////////////////////////////////////////////////////////////////
///////////////////////ScrollBarElement/////////////////////////////////

/**
 * @class ScrollBarElement
 * @inherits ListContainerElement
 * 
 * ScrollBarElement renders a skin-able scroll bar that can be
 * oriented horizontally or vertically and assigns a default
 * skin to the scroll buttons.
 * 
 * See the default skin ScrollButtonSkinElement for additional skin styles.
 * 
 * @seealso ScrollButtonSkinElement
 * 
 * 
 * @constructor ScrollBarElement 
 * Creates new ScrollBarElement instance.
 */
function ScrollBarElement()
{
	ScrollBarElement.base.prototype.constructor.call(this);
	
	this._buttonIncrement = null;
	this._buttonDecrement = null;
	this._buttonTrack = null;
	this._buttonTab = null;
	
	this._trackAndTabContainer = new CanvasElement();
	this._trackAndTabContainer.setStyle("ClipContent", false);
	this._trackAndTabContainer.setStyle("PercentWidth", 100);
	this._trackAndTabContainer.setStyle("PercentHeight", 100);
	this._trackAndTabContainer.setStyle("MinWidth", 0);	//We dont want base measuring this container
	this._trackAndTabContainer.setStyle("MinHeight", 0); //We dont want base measuring this container
	
	this._scrollPageSize = 0;
	this._scrollViewSize = 0;
	this._scrollLineSize = 1;
	
	this._scrollValue = 0;
	
	this._scrollTween = null;
	
	var _self = this;
	
	//Private event handlers, need different instance for each ScrollBar, proxy to prototype.
	this._onScrollButtonClickInstance = 
		function (elementMouseEvent)
		{
			_self._onScrollButtonClick(elementMouseEvent);
		};
	this._onScrollTabDragInstance = 
		function (elementEvent)
		{
			_self._onScrollTabDrag(elementEvent);
		};
	this._onScrollBarEnterFrameInstance = 
		function (event)
		{
			_self._onScrollBarEnterFrame(event);
		};
	this._onTrackAndTabContainerMeasureCompleteInstance = 
		function (event)
		{
			_self._onTrackAndTabContainerMeasureComplete(event);
		};
		
	this._trackAndTabContainer.addEventListener("measurecomplete", this._onTrackAndTabContainerMeasureCompleteInstance);
}

//Inherit from ListContainerElement
ScrollBarElement.prototype = Object.create(ListContainerElement.prototype);
ScrollBarElement.prototype.constructor = ScrollBarElement;
ScrollBarElement.base = ListContainerElement;

/////////////Events////////////////////////////////////

/**
 * @event changed ElementEvent
 * Dispatched when the scroll position changes as a result of user interaction or tween.
 */


/////////////Style Types///////////////////////////////

ScrollBarElement._StyleTypes = Object.create(null);

/**
 * @style ScrollTweenDuration Number
 * Time in milliseconds the scroll tween animation should run.
 */
ScrollBarElement._StyleTypes.ScrollTweenDuration =			{inheritable:false};		// number (milliseconds)

//ScrollButton / Button styles.
/**
 * @style ScrollButtonIncrementStyle StyleDefinition
 * StyleDefinition to be applied to the Scroll increment Button.
 */
ScrollBarElement._StyleTypes.ScrollButtonIncrementStyle = 	{inheritable:false};		// StyleDefinition

/**
 * @style ScrollButtonDecrementStyle StyleDefinition
 * StyleDefinition to be applied to the Scroll decrement Button.
 */
ScrollBarElement._StyleTypes.ScrollButtonDecrementStyle = 	{inheritable:false};		// StyleDefinition

/**
 * @style ButtonTrackStyle StyleDefinition
 * StyleDefinition to be applied to the scroll bar track Button.
 */
ScrollBarElement._StyleTypes.ButtonTrackStyle = 			{inheritable:false};		// StyleDefinition

/**
 * @style ButtonTabStyle StyleDefinition
 * StyleDefinition to be applied to the scroll bar tab (draggable) Button.
 */
ScrollBarElement._StyleTypes.ButtonTabStyle = 				{inheritable:false};		// StyleDefinition


////////////Default Styles////////////////////////////

//up/over/down skins of track
ScrollBarElement.TrackSkinStyleDefault = new StyleDefinition();
ScrollBarElement.TrackSkinStyleDefault.setStyle("BorderType", 						"solid");
ScrollBarElement.TrackSkinStyleDefault.setStyle("BorderThickness", 					1);
ScrollBarElement.TrackSkinStyleDefault.setStyle("BorderColor", 						"#333333");
ScrollBarElement.TrackSkinStyleDefault.setStyle("BackgroundColor", 					"#D9D9D9");
ScrollBarElement.TrackSkinStyleDefault.setStyle("AutoGradientType", 				"none");

//disabled skin of track
ScrollBarElement.DisabledTrackSkinStyleDefault = new StyleDefinition();
ScrollBarElement.DisabledTrackSkinStyleDefault.setStyle("BorderType", 				"solid");
ScrollBarElement.DisabledTrackSkinStyleDefault.setStyle("BorderThickness", 			1);
ScrollBarElement.DisabledTrackSkinStyleDefault.setStyle("BorderColor", 				"#999999");
ScrollBarElement.DisabledTrackSkinStyleDefault.setStyle("BackgroundColor", 			"#ECECEC");
ScrollBarElement.DisabledTrackSkinStyleDefault.setStyle("AutoGradientType", 		"linear");
ScrollBarElement.DisabledTrackSkinStyleDefault.setStyle("AutoGradientStart", 		(+.05));
ScrollBarElement.DisabledTrackSkinStyleDefault.setStyle("AutoGradientStop", 		(-.05));

//Applied dynamically based on LayoutDirection (vertical)
ScrollBarElement.VButtonTrackStyleDefault = new StyleDefinition();
ScrollBarElement.VButtonTrackStyleDefault.setStyle("BorderType", 					"none");
ScrollBarElement.VButtonTrackStyleDefault.setStyle("MinWidth", 						15);
ScrollBarElement.VButtonTrackStyleDefault.setStyle("MinHeight", 					15);
ScrollBarElement.VButtonTrackStyleDefault.setStyle("PercentWidth", 					100);
ScrollBarElement.VButtonTrackStyleDefault.setStyle("UpSkinStyle", 					ScrollBarElement.TrackSkinStyleDefault);  
ScrollBarElement.VButtonTrackStyleDefault.setStyle("OverSkinStyle", 				ScrollBarElement.TrackSkinStyleDefault); 
ScrollBarElement.VButtonTrackStyleDefault.setStyle("DownSkinStyle", 				ScrollBarElement.TrackSkinStyleDefault);
ScrollBarElement.VButtonTrackStyleDefault.setStyle("DisabledSkinStyle", 			ScrollBarElement.DisabledTrackSkinStyleDefault); 

//Applied dynamically based on LayoutDirection (horizontal)
ScrollBarElement.HButtonTrackStyleDefault = new StyleDefinition();
ScrollBarElement.HButtonTrackStyleDefault.setStyle("BorderType", 					"none");
ScrollBarElement.HButtonTrackStyleDefault.setStyle("MinWidth", 						15);
ScrollBarElement.HButtonTrackStyleDefault.setStyle("MinHeight", 					15);
ScrollBarElement.HButtonTrackStyleDefault.setStyle("PercentHeight", 				100);
ScrollBarElement.HButtonTrackStyleDefault.setStyle("UpSkinStyle", 					ScrollBarElement.TrackSkinStyleDefault);  
ScrollBarElement.HButtonTrackStyleDefault.setStyle("OverSkinStyle", 				ScrollBarElement.TrackSkinStyleDefault); 
ScrollBarElement.HButtonTrackStyleDefault.setStyle("DownSkinStyle", 				ScrollBarElement.TrackSkinStyleDefault);
ScrollBarElement.HButtonTrackStyleDefault.setStyle("DisabledSkinStyle", 			ScrollBarElement.DisabledTrackSkinStyleDefault); 

//disabled skin of arrow buttons (other states using Button defaults)
ScrollBarElement.DisabledButtonScrollArrowStyleDefault = new StyleDefinition();
ScrollBarElement.DisabledButtonScrollArrowStyleDefault.setStyle("BorderType", 					"solid");
ScrollBarElement.DisabledButtonScrollArrowStyleDefault.setStyle("BorderThickness", 				1);
ScrollBarElement.DisabledButtonScrollArrowStyleDefault.setStyle("BorderColor", 					"#999999");
ScrollBarElement.DisabledButtonScrollArrowStyleDefault.setStyle("BackgroundColor", 				"#ECECEC");
ScrollBarElement.DisabledButtonScrollArrowStyleDefault.setStyle("AutoGradientType", 			"linear");
ScrollBarElement.DisabledButtonScrollArrowStyleDefault.setStyle("AutoGradientStart", 			(+.05));
ScrollBarElement.DisabledButtonScrollArrowStyleDefault.setStyle("AutoGradientStop", 			(-.05));
ScrollBarElement.DisabledButtonScrollArrowStyleDefault.setStyle("ArrowColor", 					"#777777");

//Applied dynamically based on LayoutDirection (vertical)
ScrollBarElement.VButtonTabStyleDefault = new StyleDefinition();
ScrollBarElement.VButtonTabStyleDefault.setStyle("MinWidth", 		15);
ScrollBarElement.VButtonTabStyleDefault.setStyle("MinHeight", 		30);
ScrollBarElement.VButtonTabStyleDefault.setStyle("PercentWidth", 	100);

//Applied dynamically based on LayoutDirection (horizontal)
ScrollBarElement.HButtonTabStyleDefault = new StyleDefinition();
ScrollBarElement.HButtonTabStyleDefault.setStyle("MinWidth", 		30);
ScrollBarElement.HButtonTabStyleDefault.setStyle("MinHeight", 		15);
ScrollBarElement.HButtonTabStyleDefault.setStyle("PercentHeight", 	100);

//Applied dynamically based on LayoutDirection (vertical)
ScrollBarElement.VButtonScrollArrowIncStyleDefault = new StyleDefinition();
ScrollBarElement.VButtonScrollArrowIncStyleDefault.setStyle("SkinClass", 			ScrollButtonSkinElement);			
ScrollBarElement.VButtonScrollArrowIncStyleDefault.setStyle("ArrowColor", 			"#000000"); 
ScrollBarElement.VButtonScrollArrowIncStyleDefault.setStyle("ArrowDirection", 		"down");
ScrollBarElement.VButtonScrollArrowIncStyleDefault.setStyle("MinWidth", 			15);
ScrollBarElement.VButtonScrollArrowIncStyleDefault.setStyle("MinHeight", 			15);
ScrollBarElement.VButtonScrollArrowIncStyleDefault.setStyle("PercentWidth", 		100);
ScrollBarElement.VButtonScrollArrowIncStyleDefault.setStyle("DisabledSkinStyle", 	ScrollBarElement.DisabledButtonScrollArrowStyleDefault);

//Applied dynamically based on LayoutDirection (vertical)
ScrollBarElement.VButtonScrollArrowDecStyleDefault = new StyleDefinition();
ScrollBarElement.VButtonScrollArrowDecStyleDefault.setStyle("SkinClass", 			ScrollButtonSkinElement);			
ScrollBarElement.VButtonScrollArrowDecStyleDefault.setStyle("ArrowColor", 			"#000000");
ScrollBarElement.VButtonScrollArrowDecStyleDefault.setStyle("ArrowDirection", 		"up"); 
ScrollBarElement.VButtonScrollArrowDecStyleDefault.setStyle("MinWidth", 			15);
ScrollBarElement.VButtonScrollArrowDecStyleDefault.setStyle("MinHeight", 			15);
ScrollBarElement.VButtonScrollArrowDecStyleDefault.setStyle("PercentWidth", 		100);
ScrollBarElement.VButtonScrollArrowDecStyleDefault.setStyle("DisabledSkinStyle", 	ScrollBarElement.DisabledButtonScrollArrowStyleDefault);

//Applied dynamically based on LayoutDirection (horizontal)
ScrollBarElement.HButtonScrollArrowIncStyleDefault = new StyleDefinition();
ScrollBarElement.HButtonScrollArrowIncStyleDefault.setStyle("SkinClass", 			ScrollButtonSkinElement);			
ScrollBarElement.HButtonScrollArrowIncStyleDefault.setStyle("ArrowColor", 			"#000000"); 
ScrollBarElement.HButtonScrollArrowIncStyleDefault.setStyle("ArrowDirection", 		"right");
ScrollBarElement.HButtonScrollArrowIncStyleDefault.setStyle("MinWidth", 			15);
ScrollBarElement.HButtonScrollArrowIncStyleDefault.setStyle("MinHeight", 			15);
ScrollBarElement.HButtonScrollArrowIncStyleDefault.setStyle("PercentHeight", 		100);
ScrollBarElement.HButtonScrollArrowIncStyleDefault.setStyle("DisabledSkinStyle", 	ScrollBarElement.DisabledButtonScrollArrowStyleDefault);

//Applied dynamically based on LayoutDirection (horizontal)
ScrollBarElement.HButtonScrollArrowDecStyleDefault = new StyleDefinition();
ScrollBarElement.HButtonScrollArrowDecStyleDefault.setStyle("SkinClass", 			ScrollButtonSkinElement);			
ScrollBarElement.HButtonScrollArrowDecStyleDefault.setStyle("ArrowColor", 			"#000000");
ScrollBarElement.HButtonScrollArrowDecStyleDefault.setStyle("ArrowDirection", 		"left"); 
ScrollBarElement.HButtonScrollArrowDecStyleDefault.setStyle("MinWidth", 			15);
ScrollBarElement.HButtonScrollArrowDecStyleDefault.setStyle("MinHeight", 			15);
ScrollBarElement.HButtonScrollArrowDecStyleDefault.setStyle("PercentHeight", 		100);
ScrollBarElement.HButtonScrollArrowDecStyleDefault.setStyle("DisabledSkinStyle", 	ScrollBarElement.DisabledButtonScrollArrowStyleDefault);

ScrollBarElement.StyleDefault = new StyleDefinition();
ScrollBarElement.StyleDefault.setStyle("ScrollTweenDuration", 						180); 			// number (milliseconds)
ScrollBarElement.StyleDefault.setStyle("LayoutDirection", 							"vertical");	// "vertical" || "horizontal"
ScrollBarElement.StyleDefault.setStyle("ClipContent", 								false);
ScrollBarElement.StyleDefault.setStyle("LayoutGap", 								-1); //Collapse borders
ScrollBarElement.StyleDefault.setStyle("LayoutHorizontalAlign", 					"center");
ScrollBarElement.StyleDefault.setStyle("LayoutVerticalAlign", 						"middle"); 

//Applied dynamically based on LayoutDirection
//ScrollBarElement.StyleDefault.setStyle("ButtonTrackStyle", 						ScrollBarElement.ButtonTrackStyleDefault);
//ScrollBarElement.StyleDefault.setStyle("ScrollButtonIncrementStyle", 				ScrollBarElement.ButtonScrollArrowIncStyleDefault); 
//ScrollBarElement.StyleDefault.setStyle("ScrollButtonDecrementStyle", 				ScrollBarElement.ButtonScrollArrowDecStyleDefault);
//ScrollBarElement.StyleDefault.setStyle("ButtonTabStyle", 							ScrollBarElement.ButtonTabStyleDefault); 



/////////////ScrollBarElement Public Functions///////////////////

/**
 * @function setScrollPageSize
 * Sets the total number of scroll lines.
 * 
 * @param pageSize int
 * The total number of scroll lines.
 */
ScrollBarElement.prototype.setScrollPageSize = 
	function (pageSize)
	{
		if (this._scrollPageSize == pageSize)
			return;
	
		this._scrollPageSize = pageSize;
		this._invalidateLayout();
	};

/**
 * @function getScrollPageSize
 * Gets the total number of scroll lines.
 * 
 * @returns int
 * The total number of scroll lines.
 */	
ScrollBarElement.prototype.getScrollPageSize = 
	function ()
	{
		return this._scrollPageSize;
	};
	
/**
 * @function setScrollViewSize
 * Sets the number of scroll lines that fit within the view.
 * 
 * @param viewSize int
 * The number of scroll lines that fit within the view.
 */	
ScrollBarElement.prototype.setScrollViewSize = 
	function (viewSize)
	{
		if (this._scrollViewSize == viewSize)
			return;
		
		this._scrollViewSize = viewSize;
		this._invalidateLayout();
	};
	
/**
 * @function getScrollViewSize
 * Gets the number of scroll lines that fit within the view.
 * 
 * @returns int
 * The number of scroll lines that fit within the view.
 */	
ScrollBarElement.prototype.getScrollViewSize = 
	function ()
	{
		return this._scrollViewSize;
	};
	
/**
 * @function setScrollLineSize
 * Sets the number of lines to scroll when a scroll button is pressed.
 * 
 * @param lineSize int
 * The number of lines to scroll when a scroll button is pressed.
 */	
ScrollBarElement.prototype.setScrollLineSize = 
	function (lineSize)
	{
		this._scrollLineSize = lineSize;
	};		
	
/**
 * @function getScrollLineSize
 * Gets the number of lines to scroll when a scroll button is pressed.
 * 
 * @returns int
 * The number of lines to scroll when a scroll button is pressed.
 */	
ScrollBarElement.prototype.getScrollLineSize = 
	function ()
	{
		return this._scrollLineSize;
	};
	
/**
 * @function setScrollValue
 * Sets the position to scroll too. Range is 0 to (page size - view size).
 * 
 * @param value int
 * The position to scroll too.
 */	
ScrollBarElement.prototype.setScrollValue = 
	function (value)
	{
		if (this._scrollValue == value)
			return;
		
		this._scrollValue = value;
		this._invalidateLayout();
	};

/**
 * @function getScrollValue
 * Gets the scroll position.  Range is 0 to (page size - view size).
 * 
 * @returns int
 * The scroll position.
 */	
ScrollBarElement.prototype.getScrollValue = 
	function ()
	{
		return this._scrollValue;
	};

/**
 * @function startScrollTween
 * Starts a tween animation to scroll bar to the supplied scroll position.
 * 
 * @param tweenToValue int
 * The position to scroll too.
 */	
ScrollBarElement.prototype.startScrollTween = 
	function (tweenToValue)
	{
		var tweenDuration = this.getStyle("ScrollTweenDuration");
		if (tweenDuration > 0)
		{
			if (this._scrollTween == null)
			{
				this._scrollTween = new Tween();
				this._scrollTween.startVal = this._scrollValue;
				this._scrollTween.endVal = tweenToValue;
				this._scrollTween.duration = tweenDuration;
				this._scrollTween.startTime = Date.now();
				this._scrollTween.easingFunction = Tween.easeInOutSine;
				
				this.addEventListener("enterframe", this._onScrollBarEnterFrameInstance);
			}
			else
			{
				this._scrollTween.startVal = this._scrollValue;
				this._scrollTween.endVal = tweenToValue;
				this._scrollTween.startTime = Date.now();
				this._scrollTween.easingFunction = Tween.easeOutSine;
			}
		}
		else
		{
			this.endScrollTween();
			this.setScrollValue(tweenToValue);
			this._dispatchEvent(new ElementEvent("changed", false));
		}
	};
	
/**
 * @function endScrollTween
 * Ends the scroll tween animation. Immediately moves the scroll position to
 * the ending position if the tween is still running.
 */		
ScrollBarElement.prototype.endScrollTween = 
	function ()
	{
		if (this._scrollTween != null)
		{
			this.setScrollValue(this._scrollTween.endVal);
			this.removeEventListener("enterframe", this._onScrollBarEnterFrameInstance);
			this._scrollTween = null;
		}
	};	
	
/**
 * @function getTweenToValue
 * Gets the scroll position being tweened too.
 * 
 * @returns int
 * The scroll position beeing tweened too or null if no tween is running.
 */	
ScrollBarElement.prototype.getTweenToValue = 
	function ()
	{
		if (this._scrollTween == null)
			return null;
		
		return this._scrollTween.endVal;
	};
	
/////////////ScrollBarElement Internal Functions///////////////////

//@private container doesnt measure need to be notified by track & tab buttons	
ScrollBarElement.prototype._onTrackAndTabContainerMeasureComplete =
	function (event)
	{
		this._invalidateMeasure();
		this._invalidateLayout();
	};
	
//@private - only active when a tween is running.
ScrollBarElement.prototype._onScrollBarEnterFrame = 
	function (event)
	{
		var scrollValue = this._scrollTween.getValue(Date.now());
		
		if (scrollValue == this._scrollTween.endVal)
			this.endScrollTween();
		else
			this.setScrollValue(scrollValue);
		
		this._dispatchEvent(new ElementEvent("changed", false));
	};
	
//@Override	
ScrollBarElement.prototype._onCanvasElementRemoved = 
	function (addedRemovedEvent)
	{
		ScrollBarElement.base.prototype._onCanvasElementRemoved.call(this, addedRemovedEvent);
		
		this.endScrollTween();
	};		
	
/**
 * @function _onScrollButtonClick
 * Event handler for Buttons (increment, decrement, and track) "click" event. 
 * 
 * @param elementMouseEvent ElementMouseEvent
 * The ElementMouseEvent to process.
 */		
ScrollBarElement.prototype._onScrollButtonClick = 
	function (elementMouseEvent)
	{
		var incrementSize = null;
		
		var startScrollValue = this._scrollValue;
		if (this._scrollTween != null)
			startScrollValue = this._scrollTween.endVal;
		
		startScrollValue = Math.min(this._scrollPageSize - this._scrollViewSize, startScrollValue);
		startScrollValue = Math.max(0, startScrollValue);
		
		if (elementMouseEvent.getTarget() == this._buttonIncrement || 
			elementMouseEvent.getTarget() == this._buttonDecrement)
		{
			incrementSize = this.getScrollLineSize();
			
			if (elementMouseEvent.getTarget() == this._buttonDecrement)
				incrementSize = incrementSize * -1;
		}
		else if (elementMouseEvent.getTarget() == this._buttonTrack)
		{
			incrementSize = this._scrollViewSize * .75;
			
			if (this.getStyle("LayoutDirection") == "horizontal")
			{
				if (elementMouseEvent.getX() <= this._buttonTab._x + (this._buttonTab._width / 2))
					incrementSize = incrementSize * -1;
			}
			else //vertical
			{
				if (elementMouseEvent.getY() <= this._buttonTab._y + (this._buttonTab._height / 2))
					incrementSize = incrementSize * -1;
			}
		}
		
		var endScrollValue = startScrollValue + incrementSize;
		
		endScrollValue = Math.min(this._scrollPageSize - this._scrollViewSize, endScrollValue);
		endScrollValue = Math.max(0, endScrollValue);
		
		if (endScrollValue != startScrollValue)
			this.startScrollTween(endScrollValue);
	};

/**
 * @function _onScrollTabDrag
 * Event handler for Tab Button's "dragging" event. 
 * 
 * @param elementEvent ElementEvent
 * The ElementEvent to process.
 */		
ScrollBarElement.prototype._onScrollTabDrag = 
	function (elementEvent)
	{
		var tabPosition = null;
		var trackSize = null;
		var tabSize = null;
		
		var direction = this.getStyle("LayoutDirection");
		var oldScrollValue = this._scrollValue;
		
		if (direction == "horizontal")
		{
			trackSize = this._buttonTrack._width;
			tabPosition = this._buttonTab._x - this._buttonTrack._x;
			tabSize = this._buttonTab._width;
		}
		else
		{
			trackSize = this._buttonTrack._height;
			tabPosition = this._buttonTab._y - this._buttonTrack._y;
			tabSize = this._buttonTab._height;
		}
		
		//Correct position
		if (tabPosition > trackSize - tabSize)
			tabPosition = trackSize - tabSize;
		if (tabPosition < 0)
			tabPosition = 0;
		
		trackSize = trackSize - tabSize;
		
		//Calculate new ScrollValue
		var scrollRange = this._scrollPageSize - this._scrollViewSize;
		var pixelsPerScaleUnit = trackSize / scrollRange;
		
		var newScrollValue = (tabPosition / pixelsPerScaleUnit);
		if (oldScrollValue != newScrollValue)
		{
			this.setScrollValue(newScrollValue);
			this._dispatchEvent(new ElementEvent("changed", false));
		}
		
		//Always invalidate layout, need to correct drag position.
		this._invalidateLayout();
	};

/**
 * @function _createChildren
 * Creates the scroll bar child buttons when the ScrollBar is first added to the display hierarchy.
 */	
ScrollBarElement.prototype._createChildren = 
	function ()
	{
		//Add track to container
		this._buttonTrack = new ButtonElement();
		this._buttonTrack._setStyleDefinitionDefault(this._getDefaultStyle("ButtonTrackStyle"));
		this._buttonTrack.addEventListener("click", this._onScrollButtonClickInstance);
		this._trackAndTabContainer._addChild(this._buttonTrack);
	
		//Add tab to container
		this._buttonTab = new ButtonElement();
		this._buttonTab._setStyleDefinitionDefault(this._getDefaultStyle("ButtonTabStyle"));
		this._buttonTab.setStyle("Draggable", true);
		this._buttonTab.addEventListener("dragging", this._onScrollTabDragInstance);
		this._trackAndTabContainer._addChild(this._buttonTab);
	
		this._buttonDecrement = new ButtonElement();
		this._buttonDecrement.addEventListener("click", this._onScrollButtonClickInstance);
		
		this._buttonIncrement = new ButtonElement();
		this._buttonIncrement.addEventListener("click", this._onScrollButtonClickInstance);
		
		this.addElement(this._buttonDecrement);
		this.addElement(this._trackAndTabContainer);
		this.addElement(this._buttonIncrement);
	};
	
//@Override
ScrollBarElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		ScrollBarElement.base.prototype._doStylesUpdated.call(this, stylesMap);
	
		if (this._buttonIncrement == null)
			this._createChildren();
		
		if ("LayoutDirection" in stylesMap)
		{
			if (this.getStyle("LayoutDirection") == "horizontal")
			{
				this._buttonIncrement._setStyleDefinitionDefault(ScrollBarElement.HButtonScrollArrowIncStyleDefault);
				this._buttonDecrement._setStyleDefinitionDefault(ScrollBarElement.HButtonScrollArrowDecStyleDefault);
				this._buttonTrack._setStyleDefinitionDefault(ScrollBarElement.HButtonTrackStyleDefault);
				this._buttonTab._setStyleDefinitionDefault(ScrollBarElement.HButtonTabStyleDefault);
			}
			else //vertical
			{
				this._buttonIncrement._setStyleDefinitionDefault(ScrollBarElement.VButtonScrollArrowIncStyleDefault);
				this._buttonDecrement._setStyleDefinitionDefault(ScrollBarElement.VButtonScrollArrowDecStyleDefault);
				this._buttonTrack._setStyleDefinitionDefault(ScrollBarElement.VButtonTrackStyleDefault);
				this._buttonTab._setStyleDefinitionDefault(ScrollBarElement.VButtonTabStyleDefault);
			}
			
			this._invalidateMeasure();
			this._invalidateLayout();
		}
		
		if ("ScrollButtonIncrementStyle" in stylesMap)
			this._buttonIncrement.setStyleDefinitions(this.getStyle("ScrollButtonIncrementStyle"));
		
		if ("ScrollButtonDecrementStyle" in stylesMap)
			this._buttonDecrement.setStyleDefinitions(this.getStyle("ScrollButtonDecrementStyle"));
		
		if ("ButtonTrackStyle" in stylesMap)
			this._buttonTrack.setStyleDefinitions(this.getStyle("ButtonTrackStyle"));
		
		if ("ButtonTabStyle" in stylesMap)
			this._buttonTab.setStyleDefinitions(this.getStyle("ButtonTabStyle"));
		
		if ("ScrollTweenDuration" in stylesMap && this.getStyle("ScrollTweenDuration") == 0)
			this.endScrollTween();
	};
	
	
//@override
ScrollBarElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		//Get the ListContainer measured height
		var measuredSize = ScrollBarElement.base.prototype._doMeasure.call(this, padWidth, padHeight);
	
		//Account for the tab and track (container doesnt measure)
		
		//TODO: Handle rotation of tab?? 
		
		if (this.getStyle("LayoutDirection") == "vertical")
		{
			var tabMinHeight = this._buttonTab.getStyle("MinHeight");
			var trackWidth = this._buttonTrack._getStyledOrMeasuredWidth() + padWidth;
			var tabWidth = this._buttonTab._getStyledOrMeasuredWidth() + padWidth;
			
			measuredSize.height += (tabMinHeight * 2);
			
			if (tabWidth > measuredSize.width)
				measuredSize.width = tabWidth;
			if (trackWidth > measuredSize.width)
				measuredSize.width = trackWidth;
		}
		else //horizontal
		{
			var tabMinWidth = this._buttonTab.getStyle("MinWidth");
			var tabHeight = this._buttonTab._getStyledOrMeasuredHeight() + padHeight;
			var trackHeight = this._buttonTrack._getStyledOrMeasuredHeight() + padHeight;
			
			measuredSize.width += (tabMinWidth * 2);
			
			if (tabHeight > measuredSize.width)
				measuredSize.width = tabHeight;
			if (trackHeight > measuredSize.width)
				measuredSize.width = trackHeight;
		}
		
		return measuredSize;
	};	
	
//@Override	
ScrollBarElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		ScrollBarElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		//Correct the scroll value (size reduction forces us to scroll up)
		this._scrollValue = Math.min(this._scrollValue, this._scrollPageSize - this._scrollViewSize);
		this._scrollValue = Math.max(this._scrollValue, 0);
		
		//Disable / Enable components
		if (this._scrollViewSize >= this._scrollPageSize)
		{
			this._buttonIncrement.setStyle("Enabled", false);
			this._buttonDecrement.setStyle("Enabled", false);
			this._buttonTrack.setStyle("Enabled", false);
			this._buttonTab.setStyle("Visible", false);
		}
		else
		{
			this._buttonIncrement.setStyle("Enabled", true);
			this._buttonDecrement.setStyle("Enabled", true);
			this._buttonTrack.setStyle("Enabled", true);
			this._buttonTab.setStyle("Visible", true);
		}
		
		var availableTrackSize;
		var pixelsPerScaleUnit = 0;
		
		//TODO: Handle rotation of tab??
		var tabWidth = this._buttonTab.getStyle("Width");
		var tabMinWidth = this._buttonTab.getStyle("MinWidth");
		var tabMaxWidth = this._buttonTab.getStyle("MaxWidth");
		var tabPWidth = this._buttonTab.getStyle("PercentWidth");
		
		if (tabMinWidth == null)
			tabMinWidth = 0;
		if (tabMaxWidth == null)
			tabMaxWidth = Number.MAX_VALUE;
		
		var tabHeight = this._buttonTab.getStyle("Height");
		var tabMinHeight = this._buttonTab.getStyle("MinHeight");
		var tabMaxHeight = this._buttonTab.getStyle("MaxHeight");
		var tabPHeight = this._buttonTab.getStyle("PercentHeight");
		
		if (tabMinHeight == null)
			tabMinHeight = 0;
		if (tabMaxHeight == null)
			tabMaxHeight = Number.MAX_VALUE;
		
		var trackWidth = this._buttonTrack.getStyle("Width");
		var trackMinWidth = this._buttonTrack.getStyle("MinWidth");
		var trackMaxWidth = this._buttonTrack.getStyle("MaxWidth");
		var trackPWidth = this._buttonTrack.getStyle("PercentWidth");		
		
		if (trackMinWidth == null)
			trackMinWidth = 0;
		if (trackMaxWidth == null)
			trackMaxWidth = Number.MAX_VALUE;
		
		var trackHeight = this._buttonTrack.getStyle("Height");
		var trackMinHeight = this._buttonTrack.getStyle("MinHeight");
		var trackMaxHeight = this._buttonTrack.getStyle("MaxHeight");
		var trackPHeight = this._buttonTrack.getStyle("PercentHeight");
		
		if (trackMinHeight == null)
			trackMinHeight = 0;
		if (trackMaxHeight == null)
			trackMaxHeight = Number.MAX_VALUE;
		
		//Size and position the track and tab (their parent container doesnt layout or measure)
		var direction = this.getStyle("LayoutDirection");
		if (direction == "vertical")
		{
			if (tabHeight == null)
			{
				if (this._scrollPageSize > 0)
					tabHeight = Math.round(this._trackAndTabContainer._height * (this._scrollViewSize / this._scrollPageSize));
				else
					tabHeight = 0;
				
				tabHeight = Math.min(tabHeight, tabMaxHeight);
				tabHeight = Math.max(tabHeight, tabMinHeight);
			}
			
			var tabActualWidth = tabWidth;
			if (tabActualWidth == null)
			{
				if (tabPWidth != null)
					tabActualWidth = Math.round(this._trackAndTabContainer._width * (tabPWidth / 100));
				
				if (tabActualWidth == null)
					tabActualWidth = tabMinWidth;
				
				tabActualWidth = Math.min(tabActualWidth, tabMaxWidth);
				tabActualWidth = Math.max(tabActualWidth, tabMinWidth);
			}
			
			var trackActualWidth = trackWidth;
			if (trackActualWidth == null)
			{
				if (trackPWidth != null)
					trackActualWidth = Math.round(this._trackAndTabContainer._width * (trackPWidth / 100));
				
				if (trackActualWidth == null)
					trackActualWidth = trackMinWidth;
				
				trackActualWidth = Math.min(tabActualWidth, trackMaxWidth);
				trackActualWidth = Math.max(tabActualWidth, trackMinWidth);
			}
			
			if (this._scrollPageSize > this._scrollViewSize)
			{
				availableTrackSize = this._trackAndTabContainer._height - tabHeight;
				pixelsPerScaleUnit = availableTrackSize / (this._scrollPageSize - this._scrollViewSize);
			}
			
			this._buttonTrack._setActualSize(trackActualWidth, this._trackAndTabContainer._height);
			this._buttonTab._setActualSize(tabActualWidth, tabHeight);
			
			var hAlign = this.getStyle("LayoutHorizontalAlign");
			if (hAlign == "left")
			{
				this._buttonTrack._setActualPosition(0, 0);
				this._buttonTab._setActualPosition(0, Math.round(this._scrollValue * pixelsPerScaleUnit));
			}
			else if (hAlign == "center")
			{
				this._buttonTrack._setActualPosition(Math.round((this._trackAndTabContainer._width / 2) - (this._buttonTrack._width / 2)), 0);
				this._buttonTab._setActualPosition(Math.round((this._trackAndTabContainer._width / 2) - (this._buttonTab._width / 2), Math.round(this._scrollValue * pixelsPerScaleUnit)));
			}
			else //right
			{
				this._buttonTrack._setActualPosition(this._trackAndTabContainer._width - this._buttonTrack._width, 0);
				this._buttonTab._setActualPosition(this._trackAndTabContainer._width - this._buttonTab._width, Math.round(this._scrollValue * pixelsPerScaleUnit));
			}
		}
		else //horizontal
		{
			if (tabWidth == null)
			{
				if (this._scrollPageSize > 0)
					tabWidth = Math.round(this._trackAndTabContainer._width * (this._scrollViewSize / this._scrollPageSize));
				else
					tabWidth = 0;
				
				tabWidth = Math.min(tabWidth, tabMaxWidth);
				tabWidth = Math.max(tabWidth, tabMinWidth);
			}
			
			var tabActualHeight = tabHeight;
			if (tabActualHeight == null)
			{
				if (tabPHeight != null)
					tabActualHeight = Math.round(this._trackAndTabContainer._height * (tabPHeight / 100));
				
				if (tabActualHeight == null)
					tabActualHeight = tabMinHeight;
				
				tabActualHeight = Math.min(tabActualHeight, tabMaxHeight);
				tabActualHeight = Math.max(tabActualHeight, tabMinHeight);
			}
			
			var trackActualHeight = trackHeight;
			if (trackActualHeight == null)
			{
				if (trackPHeight != null)
					trackActualHeight = Math.round(this._trackAndTabContainer._height * (trackPHeight / 100));
				
				if (trackActualHeight == null)
					trackActualHeight = trackMinHeight;
				
				trackActualHeight = Math.min(tabActualHeight, trackMaxHeight);
				trackActualHeight = Math.max(tabActualHeight, trackMinHeight);
			}
			
			if (this._scrollPageSize > this._scrollViewSize)
			{
				availableTrackSize = this._trackAndTabContainer._width - tabWidth;
				pixelsPerScaleUnit = availableTrackSize / (this._scrollPageSize - this._scrollViewSize);
			}
			
			this._buttonTrack._setActualSize(this._trackAndTabContainer._width, trackActualHeight);
			this._buttonTab._setActualSize(tabWidth,tabActualHeight);
			
			var vAlign = this.getStyle("LayoutVerticalAlign");
			if (vAlign == "top")
			{
				this._buttonTrack._setActualPosition(0, 0);
				this._buttonTab._setActualPosition(Math.round(this._scrollValue * pixelsPerScaleUnit), 0);
			}
			else if (vAlign == "middle")
			{
				this._buttonTrack._setActualPosition(0, Math.round((this._trackAndTabContainer._height / 2) - (this._buttonTrack._height / 2)));
				this._buttonTab._setActualPosition(Math.round(this._scrollValue * pixelsPerScaleUnit), Math.round((this._trackAndTabContainer._height / 2) - (this._buttonTab._height / 2)));
			}
			else //bottom
			{
				this._buttonTrack._setActualPosition(0, this._trackAndTabContainer._height - this._buttonTrack._height);
				this._buttonTab._setActualPosition(Math.round(this._scrollValue * pixelsPerScaleUnit), this._trackAndTabContainer._height - this._buttonTab._height);
			}
		}
	};	
	
	