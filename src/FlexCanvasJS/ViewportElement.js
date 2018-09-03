
/**
 * @depends CanvasElement.js
 */

///////////////////////////////////////////////////////////////////////
///////////////////////ViewportElement/////////////////////////////////	
	
/**
 * @class ViewportElement
 * @inherits CanvasElement
 * 
 * Viewport is a container that only supports one child element (usually another container).
 * When the child's content size is too large for the view area, the Viewport will optionally 
 * pop up scroll bars, otherwise the child element will assume the size of the ViewportElement.
 * 
 * This class needs more work. More styles are needed for controlling tween behavior and allowing
 * scrolling even if scroll bars are disabled.
 *  
 * 
 * @constructor ViewportElement 
 * Creates new ViewportElement instance.
 */
function ViewportElement()
{
	ViewportElement.base.prototype.constructor.call(this);
	
	this._viewElement = null;
	
	this._horizontalScrollBar = null;
	this._verticalScrollBar = null;
	
	this._viewPortContainer = new CanvasElement();
	this._viewPortContainer.setStyle("ClipContent", true);
	this._addChild(this._viewPortContainer);
	
	var _self = this;
	
	//Private event handler, need different instance for each Viewport, proxy to prototype.
	this._onViewportScrollBarChangeInstance =
		function (elementEvent)
		{
			_self._onViewportScrollBarChange(elementEvent);
		};
		
	this._onViewportMouseWheelEventInstance = 
		function (elementMouseWheelEvent)
		{
			_self._onViewportMouseWheelEvent(elementMouseWheelEvent);
		};
		
	this._onViewElementMeasureCompleteInstance = 
		function (event)
		{
			_self._onViewElementMeasureComplete(event);
		};
		
		
	this.addEventListener("wheel", this._onViewportMouseWheelEventInstance);
}

//Inherit from CanvasElement
ViewportElement.prototype = Object.create(CanvasElement.prototype);
ViewportElement.prototype.constructor = ViewportElement;
ViewportElement.base = CanvasElement;

/////////////Style Types////////////////////////////////////////////

ViewportElement._StyleTypes = Object.create(null);

/**
 * @style MeasureContentWidth boolean
 * When true, the viewport's measured width will use its content element's measured width. 
 * Use this when you want the viewport to expand its width when possible rather than scroll, 
 * causing scrolling to happen on a parent viewport.
 */
ViewportElement._StyleTypes.MeasureContentWidth = 				StyleableBase.EStyleType.NORMAL;		// true || false

/**
 * @style MeasureContentHeight boolean
 * When true, the viewport's measured height will use its content element's measured height.
 * Use this when you want the viewport to expand when its height possible rather than scroll, 
 * causing scrolling to happen on a parent viewport.
 */
ViewportElement._StyleTypes.MeasureContentHeight = 				StyleableBase.EStyleType.NORMAL;		// true || false

/**
 * @style HorizontalScrollBarDisplay String
 * Determines the behavior of the horizontal scroll bar. Allowable values are "on", "off", or "auto".
 */
ViewportElement._StyleTypes.HorizontalScrollBarDisplay = 		StyleableBase.EStyleType.NORMAL;		// "on" || "off" || "auto"

/**
 * @style HorizontalScrollBarPlacement String
 * Determines the position of the horizontal scroll bar. Allowable values are "top" or "bottom".
 */
ViewportElement._StyleTypes.HorizontalScrollBarPlacement = 		StyleableBase.EStyleType.NORMAL;		// "top" || "bottom"

/**
 * @style VerticalScrollBarDisplay String
 * Determines the behavior of the vertical scroll bar. Allowable values are "on", "off", or "auto".
 */
ViewportElement._StyleTypes.VerticalScrollBarDisplay = 			StyleableBase.EStyleType.NORMAL;		// "on" || "off" || "auto"

/**
 * @style VerticalScrollBarPlacement String
 * Determines the position of the vertical scroll bar. Allowable values are "left" or "right".
 */
ViewportElement._StyleTypes.VerticalScrollBarPlacement = 		StyleableBase.EStyleType.NORMAL;		// "left" || "right"

//ScrollBar styles.
/**
 * @style HorizontalScrollBarStyle StyleDefinition
 * The StyleDefinition or [StyleDefinition] array to be applied to the horizontal scroll bar.
 */
ViewportElement._StyleTypes.HorizontalScrollBarStyle = 			StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition

/**
 * @style VerticalScrollBarStyle StyleDefinition
 * The StyleDefinition or [StyleDefinition] array to be applied to the vertical scroll bar.
 */
ViewportElement._StyleTypes.VerticalScrollBarStyle = 			StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition


////////////Default Styles///////////////////////////////////////

ViewportElement.StyleDefault = new StyleDefinition();

ViewportElement.StyleDefault.setStyle("HorizontalScrollBarDisplay", 					"auto");
ViewportElement.StyleDefault.setStyle("HorizontalScrollBarPlacement", 					"bottom");

ViewportElement.StyleDefault.setStyle("VerticalScrollBarDisplay", 						"auto");
ViewportElement.StyleDefault.setStyle("VerticalScrollBarPlacement", 					"right");

ViewportElement.StyleDefault.setStyle("HorizontalScrollBarStyle", 						null);
ViewportElement.StyleDefault.setStyle("VerticalScrollBarStyle", 						null);

ViewportElement.StyleDefault.setStyle("MeasureContentWidth", 							false);
ViewportElement.StyleDefault.setStyle("MeasureContentHeight", 							false);



/////////////Public///////////////////////////////

/**
 * @function setElement
 * Sets the child element of the Viewport.
 * 
 * @param element CanvasElement
 * The child element of the Viewport (or null).
 */
ViewportElement.prototype.setElement = 
	function (element)
	{
		if (this._viewElement != null)
		{
			this._viewElement.removeEventListener("measurecomplete", this._onViewElementMeasureCompleteInstance);
			this._viewPortContainer._removeChild(this._viewElement);
		}
		
		this._viewElement = element;
		
		if (this._viewElement != null)
		{
			this._viewElement.addEventListener("measurecomplete", this._onViewElementMeasureCompleteInstance);
			this._viewPortContainer._addChild(this._viewElement);
		}
		
		this._invalidateMeasure();
		this._invalidateLayout();
	};


////////////Internal//////////////////////////////
	
/**
 * @function _onViewportScrollBarChange
 * Event handler for the scroll bar "changed" event. Updates the child elements position within the Viewport.
 * 
 * @param elementEvent ElementEvent
 * The ElementEvent to process.
 */		
ViewportElement.prototype._onViewportScrollBarChange = 
	function (elementEvent)
	{
		this._invalidateLayout();
	};

ViewportElement.prototype._onViewElementMeasureComplete = 
	function (event)
	{
		this._invalidateLayout();
	};
	
/**
 * @function _onViewportMouseWheelEvent
 * Event handler for the Viewport's "wheel" event. Starts the scroll bar tween.
 * 
 * @param elementMouseWheelEvent ElementMouseWheelEvent
 * The ElementMouseWheelEvent to process.
 */		
ViewportElement.prototype._onViewportMouseWheelEvent = 
	function (elementMouseWheelEvent)
	{
		if (elementMouseWheelEvent.getDefaultPrevented() == true)
			return;
	
		var consumeEvent = false;
		
		var scrollPageSize = null;
		var scrollViewSize = null;
		var scrollLineSize = null;
		var scrollValue = null;
		var maxScrollValue = null;
		
		var deltaX = elementMouseWheelEvent.getDeltaX();
		var deltaY = elementMouseWheelEvent.getDeltaY();
		
		if (deltaX != 0 && this._horizontalScrollBar != null)
		{
			scrollPageSize = this._horizontalScrollBar.getScrollPageSize();
			scrollViewSize = this._horizontalScrollBar.getScrollViewSize();
			scrollLineSize = this._horizontalScrollBar.getScrollLineSize();
			
			maxScrollValue = scrollPageSize - scrollViewSize;
			if (maxScrollValue > 0)
			{
				scrollValue = this._horizontalScrollBar.getTweenToValue();
				if (scrollValue == null)
					scrollValue = this._horizontalScrollBar.getScrollValue();
				
				if (deltaX < 0 && scrollValue > 0)
				{
					this._horizontalScrollBar.startScrollTween(Math.max(scrollValue + (deltaX * (scrollLineSize * 3)), 0));
					consumeEvent = true;
				}
				else if (deltaX > 0 && scrollValue < maxScrollValue)
				{
					this._horizontalScrollBar.startScrollTween(Math.min(scrollValue + (deltaX * (scrollLineSize * 3)), maxScrollValue));
					consumeEvent = true;
				}
			}
		}
		
		if (deltaY != 0 && this._verticalScrollBar != null)
		{
			scrollPageSize = this._verticalScrollBar.getScrollPageSize();
			scrollViewSize = this._verticalScrollBar.getScrollViewSize();
			scrollLineSize = this._verticalScrollBar.getScrollLineSize();
			
			maxScrollValue = scrollPageSize - scrollViewSize;
			if (maxScrollValue > 0)
			{
				scrollValue = this._verticalScrollBar.getTweenToValue();
				if (scrollValue == null)
					scrollValue = this._verticalScrollBar.getScrollValue();
				
				if (deltaY < 0 && scrollValue > 0)
				{
					this._verticalScrollBar.startScrollTween(Math.max(scrollValue + (deltaY * (scrollLineSize * 3)), 0));
					consumeEvent = true;
				}
				else if (deltaY > 0 && scrollValue < maxScrollValue)
				{
					this._verticalScrollBar.startScrollTween(Math.min(scrollValue + (deltaY * (scrollLineSize * 3)), maxScrollValue));
					consumeEvent = true;
				}
			}
		}
		
		//We've consumed the wheel event, don't want parents double scrolling.
		if (consumeEvent == true)
		{
			elementMouseWheelEvent.preventDefault();
			this._invalidateLayout();
		}
	};
	
//@Override
ViewportElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		ViewportElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("HorizontalScrollBarDisplay" in stylesMap ||
			"VerticalScrollBarDisplay" in stylesMap)
		{
			this._invalidateLayout();
			this._invalidateMeasure();
		}
		else 
		{	
			if ("HorizontalScrollBarPlacement" in stylesMap ||
				"VerticalScrollBarPlacement" in stylesMap)
			{
				this._invalidateLayout();
			}
			
			if ("MeasureContentWidth" in stylesMap || 
				"MeasureContentHeight" in stylesMap)
			{
				this._invalidateMeasure();
			}
		}
		
		if ("HorizontalScrollBarStyle" in stylesMap && this._horizontalScrollBar != null)
			this._applySubStylesToElement("HorizontalScrollBarStyle", this._horizontalScrollBar);
		if ("VerticalScrollBarStyle" in stylesMap && this._verticalScrollBar != null)
			this._applySubStylesToElement("VerticalScrollBarStyle", this._verticalScrollBar);
	};

//@Override
ViewportElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		var vBarWidth = 0;
		var vBarHeight = 0;
		
		var hBarWidth = 0;
		var hBarHeight = 0;
		
		var w = 0;
		var h = 0;
		
		if (this._viewElement != null)
		{
			if (this.getStyle("MeasureContentWidth") == true)
				w = this._viewElement._getStyledOrMeasuredWidth();
			
			if (this.getStyle("MeasureContentHeight") == true)
				h = this._viewElement._getStyledOrMeasuredHeight();
		}
		
		if (this._verticalScrollBar != null)
		{
			vBarWidth = this._verticalScrollBar._getStyledOrMeasuredWidth();
			vBarHeight = this._verticalScrollBar._getStyledOrMeasuredHeight();
		}
		if (this._horizontalScrollBar != null)
		{
			hBarWidth = this._horizontalScrollBar._getStyledOrMeasuredWidth();
			hBarHeight = this._horizontalScrollBar._getStyledOrMeasuredHeight();
		}
		
		if (w == 0)
			w = hBarWidth;
		if (h == 0)
			h = vBarHeight;
		
		w += vBarWidth;
		h += hBarHeight;
		
		return {width:w + padWidth, height:h + padHeight};
	};
	
//@Override	
ViewportElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		var hDisplay = this.getStyle("HorizontalScrollBarDisplay");
		var vDisplay = this.getStyle("VerticalScrollBarDisplay");
		
		var paneWidth = paddingMetrics.getWidth();
		var paneHeight = paddingMetrics.getHeight();
		
		var contentWidth = 0;
		var contentHeight = 0;
		if (this._viewElement != null)
		{
			contentWidth = this._viewElement._getStyledOrMeasuredWidth();
			contentHeight = this._viewElement._getStyledOrMeasuredHeight();
		}
		
		var scrollBarsChanged = false;
		var needsHScroll = false;
		var needsVScroll = false;
		
		//We need the scroll bar.
		if (hDisplay == "on" || (hDisplay == "auto" && contentWidth > paneWidth))
			needsHScroll = true;
			
		if (vDisplay == "on" || (vDisplay == "auto" && contentHeight > paneHeight))
			needsVScroll = true;
		
		//2nd pass, we need the *other* scroll bar because the first took some of our content area.
		if (needsHScroll == true && needsVScroll == false && vDisplay == "auto" && this._horizontalScrollBar != null)
		{
			if (contentHeight > paneHeight - this._horizontalScrollBar._getStyledOrMeasuredHeight())
				needsVScroll = true;
		}

		if (needsVScroll == true && needsHScroll == false && hDisplay == "auto" && this._verticalScrollBar != null)
		{
			if (contentWidth > paneWidth - this._verticalScrollBar._getStyledOrMeasuredWidth())
				needsHScroll = true;
		}
		
		//Destroy
		if (needsHScroll == false)
		{
			if (this._horizontalScrollBar != null)
			{
				this._removeChild(this._horizontalScrollBar);
				this._horizontalScrollBar = null;
				scrollBarsChanged = true;
			}
		}
		else //Create
		{
			if (this._horizontalScrollBar == null)
			{
				this._horizontalScrollBar = new ScrollBarElement();
				this._applySubStylesToElement("HorizontalScrollBarStyle", this._horizontalScrollBar);

				this._horizontalScrollBar.setStyle("LayoutDirection", "horizontal");
				this._horizontalScrollBar.setScrollLineSize(25);
				
				this._horizontalScrollBar.addEventListener("changed", this._onViewportScrollBarChangeInstance);
				this._addChild(this._horizontalScrollBar);
				scrollBarsChanged = true;
			}
		}
		
		//Destroy
		if (needsVScroll == false)
		{
			if (this._verticalScrollBar != null)
			{
				this._removeChild(this._verticalScrollBar);
				this._verticalScrollBar = null;
				scrollBarsChanged = true;
			}
		}
		else //Create
		{
			if (this._verticalScrollBar == null)
			{
				this._verticalScrollBar = new ScrollBarElement();
				this._applySubStylesToElement("VerticalScrollBarStyle", this._verticalScrollBar);
				
				this._verticalScrollBar.setStyle("LayoutDirection", "vertical");
				this._verticalScrollBar.setScrollLineSize(25);
				
				this._verticalScrollBar.addEventListener("changed", this._onViewportScrollBarChangeInstance);
				this._addChild(this._verticalScrollBar);
				scrollBarsChanged = true;
			}
		}
		
		//Wait for next pass, adding / removing bars changes content size, need bars to measure.
		if (scrollBarsChanged == true)
			return;
		
		var horizontalBarHeight = 0;
		var verticalBarWidth = 0;
		
		var horizontalScrollValue = 0;
		var verticalScrollValue = 0;
		
		if (this._horizontalScrollBar != null)
		{
			horizontalScrollValue = this._horizontalScrollBar.getScrollValue();
			horizontalBarHeight = this._horizontalScrollBar._getStyledOrMeasuredHeight();
			paneHeight -= horizontalBarHeight;
		}
		
		if (this._verticalScrollBar != null)
		{
			verticalScrollValue = this._verticalScrollBar.getScrollValue();
			verticalBarWidth = this._verticalScrollBar._getStyledOrMeasuredWidth();
			paneWidth -= verticalBarWidth;
		}
		
		//Fix scroll values (size reduction forces us to scroll up)
		horizontalScrollValue = Math.min(horizontalScrollValue, contentWidth - paneWidth);
		horizontalScrollValue = Math.max(horizontalScrollValue, 0);
		
		verticalScrollValue = Math.min(verticalScrollValue, contentHeight - paneHeight);
		verticalScrollValue = Math.max(verticalScrollValue, 0);
		
		var horizontalBarPlacement = this.getStyle("HorizontalScrollBarPlacement");
		var verticalBarPlacement = this.getStyle("VerticalScrollBarPlacement");
		
		var x = paddingMetrics.getX();
		var y = paddingMetrics.getY();
		
		if (this._horizontalScrollBar != null)
		{
			this._horizontalScrollBar.setScrollPageSize(contentWidth);
			this._horizontalScrollBar.setScrollViewSize(paneWidth);
			this._horizontalScrollBar.setScrollValue(horizontalScrollValue);
			
			this._horizontalScrollBar._setActualSize(paneWidth, horizontalBarHeight);
			
			if (horizontalBarPlacement == "top")
			{
				if (verticalBarPlacement == "left")
					this._horizontalScrollBar._setActualPosition(x + verticalBarWidth, y);
				else
					this._horizontalScrollBar._setActualPosition(x, y);
			}
			else
			{
				if (verticalBarPlacement == "left")
					this._horizontalScrollBar._setActualPosition(x + verticalBarWidth, y + paneHeight);
				else
					this._horizontalScrollBar._setActualPosition(x, y + paneHeight);
			}
		}
		
		if (this._verticalScrollBar != null)
		{
			this._verticalScrollBar.setScrollPageSize(contentHeight);
			this._verticalScrollBar.setScrollViewSize(paneHeight);
			this._verticalScrollBar.setScrollValue(verticalScrollValue);
			
			this._verticalScrollBar._setActualSize(verticalBarWidth, paneHeight);
			
			if (verticalBarPlacement == "left")
			{
				if (horizontalBarPlacement == "top")
					this._verticalScrollBar._setActualPosition(x, y + horizontalBarHeight);
				else
					this._verticalScrollBar._setActualPosition(x, y);
			}
			else
			{
				if (horizontalBarPlacement == "top")
					this._verticalScrollBar._setActualPosition(x + paneWidth, y + horizontalBarHeight);
				else
					this._verticalScrollBar._setActualPosition(x + paneWidth, y);
			}
		}
		
		var containerX = x;
		var containerY = y;
		
		if (horizontalBarPlacement == "top")
			containerY += horizontalBarHeight;
		if (verticalBarPlacement == "left")
			containerX += verticalBarWidth;		
		
		this._viewPortContainer._setActualSize(paneWidth, paneHeight);
		this._viewPortContainer._setActualPosition(containerX, containerY);
		
		if (this._viewElement != null)
		{
			this._viewElement._setActualSize(Math.max(paneWidth, contentWidth), Math.max(paneHeight, contentHeight));
			this._viewElement._setActualPosition(horizontalScrollValue * -1, verticalScrollValue * -1);
		}
	};
	
	