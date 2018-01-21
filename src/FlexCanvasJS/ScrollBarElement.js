
/**
 * @depends CanvasElement.js
 * @depends ScrollButtonSkinElement.js
 * @depends ButtonElement.js
 */

///////////////////////////////////////////////////////////////////////
///////////////////////ScrollBarElement/////////////////////////////////

/**
 * @class ScrollBarElement
 * @inherits CanvasElement
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
}

//Inherit from CanvasElement
ScrollBarElement.prototype = Object.create(CanvasElement.prototype);
ScrollBarElement.prototype.constructor = ScrollBarElement;
ScrollBarElement.base = CanvasElement;

/////////////Events////////////////////////////////////

/**
 * @event changed ElementEvent
 * Dispatched when the scroll position changes as a result of user interation or tween.
 */


/////////////Style Types///////////////////////////////

ScrollBarElement._StyleTypes = Object.create(null);

/**
 * @style ScrollBarDirection String
 * Determines the orientation of the scroll bar. Allowable values are "horizontal" or "vertical".
 */
ScrollBarElement._StyleTypes.ScrollBarDirection = 			{inheritable:false};		// "horizontal" || "vertical"

/**
 * @style ScrollTweenDuration Number
 * Time in milliseconds the scroll tween animation should run.
 */
ScrollBarElement._StyleTypes.ScrollTweenDuration =			{inheritable:false};		// number (milliseconds)

//ScrollButton / Button styles.
/**
 * @style ScrollButtonIncrementStyle StyleDefinition
 * StyleDefinition to be applied to the Scroll increment Button.
 * ScrollBar automatically sets an inline "ArrowDirection" style to this button which is either "down" or "right" depending on ScrollBarDirection.
 */
ScrollBarElement._StyleTypes.ScrollButtonIncrementStyle = 	{inheritable:false};		// StyleDefinition

/**
 * @style ScrollButtonDecrementStyle StyleDefinition
 * StyleDefinition to be applied to the Scroll decrement Button.
 * ScrollBar automatically sets an inline "ArrowDirection" style to this button which is either "up" or "left" depending on ScrollBarDirection.
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

ScrollBarElement.StyleDefault = new StyleDefinition();

ScrollBarElement.TrackSkinStyleDefault = new StyleDefinition();
ScrollBarElement.TrackSkinStyleDefault.setStyle("BorderType", 				"solid");
ScrollBarElement.TrackSkinStyleDefault.setStyle("BorderThickness", 			1);
ScrollBarElement.TrackSkinStyleDefault.setStyle("BorderColor", 				"#333333");
ScrollBarElement.TrackSkinStyleDefault.setStyle("BackgroundColor", 			"#D9D9D9");
ScrollBarElement.TrackSkinStyleDefault.setStyle("AutoGradientType", 		"none");

//Button style defaults
ScrollBarElement.ButtonTrackStyleDefault = new StyleDefinition();
ScrollBarElement.ButtonTrackStyleDefault.setStyle("BorderType", 					"none");
ScrollBarElement.ButtonTrackStyleDefault.setStyle("UpSkinStyle", 					ScrollBarElement.TrackSkinStyleDefault);  
ScrollBarElement.ButtonTrackStyleDefault.setStyle("OverSkinStyle", 					ScrollBarElement.TrackSkinStyleDefault); 
ScrollBarElement.ButtonTrackStyleDefault.setStyle("DownSkinStyle", 					ScrollBarElement.TrackSkinStyleDefault);
ScrollBarElement.ButtonTrackStyleDefault.setStyle("DisabledSkinStyle", 				ButtonElement.DisabledSkinStyleDefault); //Dont need this same as button default

ScrollBarElement.ButtonTabStyleDefault = new StyleDefinition();
ScrollBarElement.ButtonTabStyleDefault.setStyle("UpSkinStyle", 						ButtonElement.UpSkinStyleDefault);		//Dont actually need these (could be null)	
ScrollBarElement.ButtonTabStyleDefault.setStyle("OverSkinStyle", 					ButtonElement.OverSkinStyleDefault);
ScrollBarElement.ButtonTabStyleDefault.setStyle("DownSkinStyle", 					ButtonElement.DownSkinStyleDefault);
ScrollBarElement.ButtonTabStyleDefault.setStyle("DisabledSkinStyle", 				ButtonElement.DisabledSkinStyleDefault);

ScrollBarElement.ButtonScrollArrowIncStyleDefault = new StyleDefinition();
ScrollBarElement.ButtonScrollArrowIncStyleDefault.setStyle("SkinClass", 			ScrollButtonSkinElement);			
ScrollBarElement.ButtonScrollArrowIncStyleDefault.setStyle("ArrowColor", 			"#000000");
ScrollBarElement.ButtonScrollArrowIncStyleDefault.setStyle("UpSkinStyle", 			ButtonElement.UpSkinStyleDefault);		//Dont actually need these (could be null)	
ScrollBarElement.ButtonScrollArrowIncStyleDefault.setStyle("OverSkinStyle", 		ButtonElement.OverSkinStyleDefault);
ScrollBarElement.ButtonScrollArrowIncStyleDefault.setStyle("DownSkinStyle", 		ButtonElement.DownSkinStyleDefault);
ScrollBarElement.ButtonScrollArrowIncStyleDefault.setStyle("DisabledSkinStyle", 	ButtonElement.DisabledSkinStyleDefault);

ScrollBarElement.ButtonScrollArrowDecStyleDefault = new StyleDefinition();
ScrollBarElement.ButtonScrollArrowDecStyleDefault.setStyle("SkinClass", 			ScrollButtonSkinElement);			
ScrollBarElement.ButtonScrollArrowDecStyleDefault.setStyle("ArrowColor", 			"#000000");
ScrollBarElement.ButtonScrollArrowDecStyleDefault.setStyle("UpSkinStyle", 			ButtonElement.UpSkinStyleDefault);		//Dont actually need these (could be null)	
ScrollBarElement.ButtonScrollArrowDecStyleDefault.setStyle("OverSkinStyle", 		ButtonElement.OverSkinStyleDefault);
ScrollBarElement.ButtonScrollArrowDecStyleDefault.setStyle("DownSkinStyle", 		ButtonElement.DownSkinStyleDefault);
ScrollBarElement.ButtonScrollArrowDecStyleDefault.setStyle("DisabledSkinStyle", 	ButtonElement.DisabledSkinStyleDefault);

ScrollBarElement.StyleDefault.setStyle("ScrollButtonIncrementStyle", 				ScrollBarElement.ButtonScrollArrowIncStyleDefault); 
ScrollBarElement.StyleDefault.setStyle("ScrollButtonDecrementStyle", 				ScrollBarElement.ButtonScrollArrowDecStyleDefault); 
ScrollBarElement.StyleDefault.setStyle("ButtonTrackStyle", 							ScrollBarElement.ButtonTrackStyleDefault);
ScrollBarElement.StyleDefault.setStyle("ButtonTabStyle", 							ScrollBarElement.ButtonTabStyleDefault);
ScrollBarElement.StyleDefault.setStyle("ScrollTweenDuration", 						180); 			// number (milliseconds)

ScrollBarElement.StyleDefault.setStyle("ScrollBarDirection", 						"vertical");	// "vertical" || "horizontal"



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
			
			if (this.getStyle("ScrollBarDirection") == "horizontal")
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
		
		var direction = this.getStyle("ScrollBarDirection");
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
		this._buttonIncrement = new ButtonElement();
		this._buttonIncrement._setStyleDefinitionDefault(this._getDefaultStyle("ScrollButtonIncrementStyle"));
		
		this._buttonIncrement.addEventListener("click", this._onScrollButtonClickInstance);
		this._addChild(this._buttonIncrement);

		this._buttonDecrement = new ButtonElement();
		this._buttonDecrement._setStyleDefinitionDefault(this._getDefaultStyle("ScrollButtonDecrementStyle"));
		
		this._buttonDecrement.addEventListener("click", this._onScrollButtonClickInstance);
		this._addChild(this._buttonDecrement);

		this._buttonTrack = new ButtonElement();
		this._buttonTrack._setStyleDefinitionDefault(this._getDefaultStyle("ButtonTrackStyle"));
		
		this._buttonTrack.addEventListener("click", this._onScrollButtonClickInstance);
		this._addChild(this._buttonTrack);

		this._buttonTab = new ButtonElement();
		this._buttonTab._setStyleDefinitionDefault(this._getDefaultStyle("ButtonTabStyle"));
		this._buttonTab.setStyle("Draggable", true);
		
		this._buttonTab.addEventListener("dragging", this._onScrollTabDragInstance);
		this._addChild(this._buttonTab);
	};
	
//@Override
ScrollBarElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		ScrollBarElement.base.prototype._doStylesUpdated.call(this, stylesMap);
	
		if (this._buttonIncrement == null)
			this._createChildren();
		
		if ("ScrollButtonIncrementStyle" in stylesMap)
			this._buttonIncrement.setStyleDefinitions(this.getStyle("ScrollButtonIncrementStyle"));
		
		if ("ScrollButtonDecrementStyle" in stylesMap)
			this._buttonDecrement.setStyleDefinitions(this.getStyle("ScrollButtonDecrementStyle"));
		
		if ("ButtonTrackStyle" in stylesMap)
			this._buttonTrack.setStyleDefinitions(this.getStyle("ButtonTrackStyle"));
		
		if ("ButtonTabStyle" in stylesMap)
			this._buttonTab.setStyleDefinitions(this.getStyle("ButtonTabStyle"));
		
		if ("ScrollBarDirection" in stylesMap)
		{
			if (this.getStyle("ScrollBarDirection") == "horizontal")
			{
				this._buttonIncrement.setStyle("ArrowDirection", "right");
				this._buttonDecrement.setStyle("ArrowDirection", "left");
			}
			else
			{
				this._buttonIncrement.setStyle("ArrowDirection", "down");
				this._buttonDecrement.setStyle("ArrowDirection", "up");
			}
			
			this._invalidateMeasure();
			this._invalidateLayout();
		}
		
		if ("ScrollTweenDuration" in stylesMap && this.getStyle("ScrollTweenDuration") == 0)
			this.endScrollTween();
	};
	
	
//@Override
ScrollBarElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		var largestSize = 0;
		if (this.getStyle("ScrollBarDirection") == "horizontal")
		{
			var buttonDecHeight = this._buttonDecrement.getStyle("Height");
			var buttonIncHeight = this._buttonIncrement.getStyle("Height");
			var buttonTrackHeight = this._buttonTrack.getStyle("Height");
			var buttonTabHeight = this._buttonTab.getStyle("Height");
			
			largestSize = Math.max(largestSize, buttonDecHeight);
			largestSize = Math.max(largestSize, buttonIncHeight);
			largestSize = Math.max(largestSize, buttonTrackHeight);
			largestSize = Math.max(largestSize, buttonTabHeight);

			if (largestSize == 0)
				largestSize = 15;
			
			var buttonDecWidth = this._buttonDecrement.getStyle("Width");
			var buttonIncWidth = this._buttonIncrement.getStyle("Width");
			var buttonTabWidth = this._buttonTab.getStyle("Width");
			
			if (buttonDecWidth == null)
				buttonDecWidth = largestSize;
			if (buttonIncWidth == null)
				buttonIncWidth = largestSize;
			if (buttonTabWidth == null)
				buttonTabWidth = buttonDecWidth + buttonIncWidth;			
			
			return {width: padWidth + buttonDecWidth + buttonIncWidth + (buttonTabWidth * 2),
					height: padHeight + largestSize};
		}
		else
		{
			var buttonDecWidth = this._buttonDecrement.getStyle("Width");
			var buttonIncWidth = this._buttonIncrement.getStyle("Width");
			var buttonTrackWidth = this._buttonTrack.getStyle("Width");
			var buttonTabWidth = this._buttonTab.getStyle("Width");
			
			largestSize = Math.max(largestSize, buttonDecWidth);
			largestSize = Math.max(largestSize, buttonIncWidth);
			largestSize = Math.max(largestSize, buttonTrackWidth);
			largestSize = Math.max(largestSize, buttonTabWidth);
			
			if (largestSize == 0)
				largestSize = 15;
			
			var buttonDecHeight = this._buttonDecrement.getStyle("Height");
			var buttonIncHeight = this._buttonIncrement.getStyle("Height");
			var buttonTabHeight = this._buttonTab.getStyle("Height");
			
			if (buttonDecHeight == null)
				buttonDecHeight = largestSize;
			if (buttonIncHeight == null)
				buttonIncHeight = largestSize;
			if (buttonTabHeight == null)
				buttonTabHeight = buttonDecWidth + buttonIncWidth;			
			
			return {width: padWidth + largestSize,
					height: padHeight + buttonDecHeight + buttonIncHeight + (buttonTabHeight * 2)};
		}
	};	
	
//@Override	
ScrollBarElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		ScrollBarElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		var direction = this.getStyle("ScrollBarDirection");

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
		
		var x = paddingMetrics.getX();
		var y = paddingMetrics.getY();
		var w = paddingMetrics.getWidth();
		var h = paddingMetrics.getHeight();
		
		var buttonDecWidth = this._buttonDecrement.getStyle("Width");
		var buttonDecHeight = this._buttonDecrement.getStyle("Height");
		
		var buttonIncWidth = this._buttonIncrement.getStyle("Width");
		var buttonIncHeight = this._buttonIncrement.getStyle("Height");
		
		var buttonTabWidth = this._buttonTab.getStyle("Width");
		var buttonTabHeight = this._buttonTab.getStyle("Height");
		
		var minTabSize = null;
		var availableTrackSize = null;
		var pixelsPerScaleUnit = null;
		
		if (direction == "horizontal")
		{
			if (buttonDecWidth == null)
				buttonDecWidth = h;
			if (buttonDecHeight == null)
				buttonDecHeight = h;
			
			if (buttonIncWidth == null)
				buttonIncWidth = h;
			if (buttonIncHeight == null)
				buttonIncHeight = h;
			
			var trackHeight = this._buttonTrack.getStyle("Height");
			if (trackHeight == null)
				trackHeight = h;
			
			//Center vertically
			this._buttonDecrement._setActualPosition(x, y + (h / 2) - (buttonDecHeight / 2));
			this._buttonDecrement._setActualSize(buttonDecWidth, buttonDecHeight);
			
			this._buttonIncrement._setActualPosition(x + w - buttonIncWidth, y + (h / 2) - (buttonIncHeight / 2));
			this._buttonIncrement._setActualSize(buttonIncWidth, buttonIncHeight);
			
			this._buttonTrack._setActualPosition(x + buttonDecWidth, y + (h / 2) - (trackHeight / 2));
			this._buttonTrack._setActualSize(w - buttonDecWidth - buttonIncWidth, trackHeight);
			
			if (buttonTabHeight == null)
				buttonTabHeight = h;
			if (buttonTabWidth == null)
			{
				minTabSize = (buttonDecWidth + buttonIncWidth);
				
				if (this._scrollPageSize > 0)
					buttonTabWidth = this._buttonTrack._width * (this._scrollViewSize / this._scrollPageSize);
				else
					buttonTabWidth = 0;
				
				buttonTabWidth = Math.max(minTabSize, buttonTabWidth);
			}
			
			availableTrackSize = this._buttonTrack._width - buttonTabWidth;
			pixelsPerScaleUnit = availableTrackSize / (this._scrollPageSize - this._scrollViewSize);
			
			this._buttonTab._setActualPosition(x + buttonDecWidth + (this._scrollValue * pixelsPerScaleUnit), y + (h / 2) - (buttonTabHeight / 2));
			this._buttonTab._setActualSize(buttonTabWidth, buttonTabHeight);
		}
		else
		{
			if (buttonDecWidth == null)
				buttonDecWidth = w;
			if (buttonDecHeight == null)
				buttonDecHeight = w;
			
			if (buttonIncWidth == null)
				buttonIncWidth = w;
			if (buttonIncHeight == null)
				buttonIncHeight = w;
			
			var trackWidth = this._buttonTrack.getStyle("Width");
			if (trackWidth == null)
				trackWidth = w;
			
			//Center horizontally
			this._buttonDecrement._setActualPosition(x + (w / 2) - (buttonDecWidth / 2), y);
			this._buttonDecrement._setActualSize(buttonDecWidth, buttonDecHeight);
			
			this._buttonIncrement._setActualPosition(x + (w / 2) - (buttonIncWidth / 2), y + h - buttonIncHeight);
			this._buttonIncrement._setActualSize(buttonIncWidth, buttonIncHeight);
			
			this._buttonTrack._setActualPosition(x + (w / 2) - (trackWidth / 2), y + buttonDecHeight);
			this._buttonTrack._setActualSize(trackWidth, h - buttonDecHeight - buttonIncHeight);
			
			if (buttonTabWidth == null)
				buttonTabWidth = w;
			if (buttonTabHeight == null)
			{
				minTabSize = (buttonDecHeight + buttonIncHeight);
				
				if (this._scrollPageSize > 0)
					buttonTabHeight = this._buttonTrack._height * (this._scrollViewSize / this._scrollPageSize);
				else
					buttonTabHeight = 0;
				
				buttonTabHeight = Math.max(minTabSize, buttonTabHeight);
			}
			
			availableTrackSize = this._buttonTrack._height - buttonTabHeight;
			pixelsPerScaleUnit = availableTrackSize / (this._scrollPageSize - this._scrollViewSize);
			
			this._buttonTab._setActualPosition(x + (w / 2) - (buttonTabWidth / 2), y + buttonDecHeight + (this._scrollValue * pixelsPerScaleUnit));
			this._buttonTab._setActualSize(buttonTabWidth, buttonTabHeight);
		}
	};	
	
	