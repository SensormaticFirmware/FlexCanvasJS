
/**
 * @depends TextInputElement.js
 */

/////////////////////////////////////////////////////////
///////////////TextAreaElement///////////////////////////	
	
/**
 * @class TextAreaElement
 * @inherits TextInputElement
 * 
 * TextAreaElement is a skin-able multi-line editable text box
 * which supports two skin states, "up" and "disabled".
 * Scroll bars will optionally be added when the text becomes
 * larger than the TextArea's visible region.
 * 
 * @constructor TextAreaElement 
 * Creates new TextAreaElement instance.
 */
function TextAreaElement() //extends TextInputElement
{
	TextAreaElement.base.prototype.constructor.call(this);
	
	this._horizontalScrollBar = null;
	this._verticalScrollBar = null;
	
	var _self = this;
	
	this._onTextAreaTextFieldLayoutCompleteInstance = 
		function (event)
		{
			_self._onTextAreaTextFieldLayoutComplete(event);
		};
	
	this._onTextAreaMouseWheelEventInstance = 
		function (elementMouseWheelEvent)
		{
			_self._onTextAreaMouseWheelEvent(elementMouseWheelEvent);
		};
		
	this._onTextAreaScrollBarChangeInstance =
		function (elementEvent)
		{
			_self._onTextAreaScrollBarChange(elementEvent);
		};	
		
	this.addEventListener("wheel", this._onTextAreaMouseWheelEventInstance);	
	this._textField.addEventListener("layoutcomplete", this._onTextAreaTextFieldLayoutCompleteInstance);
}

//Inherit from SkinnableElement
TextAreaElement.prototype = Object.create(TextInputElement.prototype);
TextAreaElement.prototype.constructor = TextAreaElement;
TextAreaElement.base = TextInputElement;


/////////////Style Types///////////////////////////////

TextAreaElement._StyleTypes = Object.create(null);

/**
 * @style Selectable boolean
 * When true, text can be highlighted and copied.
 */
TextAreaElement._StyleTypes.Selectable = 						StyleableBase.EStyleType.NORMAL;		// true || false

/**
 * @style Multiline boolean
 * When true, newline characters are respected and text will be rendered on multiple lines if necessary.
 */
TextAreaElement._StyleTypes.Multiline = 						StyleableBase.EStyleType.NORMAL;		// true || false

/**
 * @style WordWrap boolean
 * When true, text will wrap when width is constrained and will be rendered on multiple lines if necessary. 
 */
TextAreaElement._StyleTypes.WordWrap = 							StyleableBase.EStyleType.NORMAL;		// true || false

/**
 * @style MeasureContentWidth boolean
 * When true, the TextArea's measured width will use its text measured width. 
 * Use this when you want the TextArea to expand its width when possible rather than scroll, 
 * causing scrolling to happen on a parent viewport.
 */
TextAreaElement._StyleTypes.MeasureContentWidth = 				StyleableBase.EStyleType.NORMAL;		// true || false

/**
 * @style MeasureContentHeight boolean
 * When true, the TextArea's measured height will use its text measured height.
 * Use this when you want the TextArea to expand when its height possible rather than scroll, 
 * causing scrolling to happen on a parent viewport.
 */
TextAreaElement._StyleTypes.MeasureContentHeight = 				StyleableBase.EStyleType.NORMAL;		// true || false

/**
 * @style HorizontalScrollBarDisplay String
 * Determines the behavior of the horizontal scroll bar. Allowable values are "on", "off", or "auto".
 */
TextAreaElement._StyleTypes.HorizontalScrollBarDisplay = 		StyleableBase.EStyleType.NORMAL;		// "on" || "off" || "auto"

/**
 * @style HorizontalScrollBarPlacement String
 * Determines the position of the horizontal scroll bar. Allowable values are "top" or "bottom".
 */
TextAreaElement._StyleTypes.HorizontalScrollBarPlacement = 		StyleableBase.EStyleType.NORMAL;		// "top" || "bottom"

/**
 * @style VerticalScrollBarDisplay String
 * Determines the behavior of the vertical scroll bar. Allowable values are "on", "off", or "auto".
 */
TextAreaElement._StyleTypes.VerticalScrollBarDisplay = 			StyleableBase.EStyleType.NORMAL;		// "on" || "off" || "auto"

/**
 * @style VerticalScrollBarPlacement String
 * Determines the position of the vertical scroll bar. Allowable values are "left" or "right".
 */
TextAreaElement._StyleTypes.VerticalScrollBarPlacement = 		StyleableBase.EStyleType.NORMAL;		// "left" || "right"

//ScrollBar styles.
/**
 * @style HorizontalScrollBarStyle StyleDefinition
 * The StyleDefinition or [StyleDefinition] array to be applied to the horizontal scroll bar.
 */
TextAreaElement._StyleTypes.HorizontalScrollBarStyle = 			StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition

/**
 * @style VerticalScrollBarStyle StyleDefinition
 * The StyleDefinition or [StyleDefinition] array to be applied to the vertical scroll bar.
 */
TextAreaElement._StyleTypes.VerticalScrollBarStyle = 			StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition


////////////Default Styles////////////////////////////

TextAreaElement.StyleDefault = new StyleDefinition();

TextAreaElement.StyleDefault.setStyle("MinWidth", 									10);
TextAreaElement.StyleDefault.setStyle("MinHeight", 									10);

TextAreaElement.StyleDefault.setStyle("TextHorizontalAlign", 						"left");
TextAreaElement.StyleDefault.setStyle("TextVerticalAlign", 							"top");

TextAreaElement.StyleDefault.setStyle("Selectable", 								true);
TextAreaElement.StyleDefault.setStyle("Multiline", 									true);
TextAreaElement.StyleDefault.setStyle("WordWrap", 									true);

TextAreaElement.StyleDefault.setStyle("Cursor", 									null);

TextAreaElement.StyleDefault.setStyle("HorizontalScrollBarDisplay", 				"auto");
TextAreaElement.StyleDefault.setStyle("HorizontalScrollBarPlacement", 				"bottom");

TextAreaElement.StyleDefault.setStyle("VerticalScrollBarDisplay", 					"auto");
TextAreaElement.StyleDefault.setStyle("VerticalScrollBarPlacement", 				"right");

TextAreaElement.StyleDefault.setStyle("HorizontalScrollBarStyle", 					null);
TextAreaElement.StyleDefault.setStyle("VerticalScrollBarStyle", 					null);

TextAreaElement.StyleDefault.setStyle("MeasureContentWidth", 						false);
TextAreaElement.StyleDefault.setStyle("MeasureContentHeight", 						false);


/////////////Internal Functions///////////////////

/**
 * @function _onTextAreaTextFieldLayoutComplete
 * Event handler for the scroll bar "layoutcomplete" event. 
 * Updates the scroll bar position.
 * 
 * @param event DispatcherEvent
 * The DispatcherEvent to process.
 */	
TextAreaElement.prototype._onTextAreaTextFieldLayoutComplete = 
	function (event)
	{
		//Our layout is dependent on the TextField layout for determining
		//scroll bars and actual content size. TextField itself requires
		//multiple layout passes due to the word wrap. If not careful
		//we can end up with an infinite loop because of this dependency.
	
		this._invalidateMeasure();
		this._invalidateLayout();
	};

/**
 * @function _onTextAreaScrollBarChange
 * Event handler for the scroll bar "changed" event. 
 * Updates the child elements position within the Viewport.
 * 
 * @param elementEvent ElementEvent
 * The ElementEvent to process.
 */		
TextAreaElement.prototype._onTextAreaScrollBarChange = 
	function (elementEvent)
	{
		if (elementEvent.getTarget() == this._horizontalScrollBar)
			this._textField._setHorizontalScrollValue(this._horizontalScrollBar.getScrollValue());
		else // if (elementEvent.getTarget() == this._verticalScrollBar)
			this._textField._setVerticalScrollValue(this._verticalScrollBar.getScrollValue());
	};

/**
 * @function _onTextAreaMouseWheelEvent
 * Event handler for the Viewport's "wheel" event. Starts the scroll bar tween.
 * 
 * @param elementMouseWheelEvent ElementMouseWheelEvent
 * The ElementMouseWheelEvent to process.
 */		
TextAreaElement.prototype._onTextAreaMouseWheelEvent = 
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

//@override
TextAreaElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		TextAreaElement.base.prototype._doStylesUpdated.call(this, stylesMap);
	
		if ("Selectable" in stylesMap)
			this._textField.setStyle("Selectable", this.getStyle("Selectable"));
		
		if ("Multiline" in stylesMap)
			this._textField.setStyle("Multiline", this.getStyle("Multiline"));
		
		if ("WordWrap" in stylesMap)
			this._textField.setStyle("WordWrap", this.getStyle("WordWrap"));
		
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
	
//@override
TextAreaElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		var vBarWidth = 0;
		var vBarHeight = 0;
		
		var hBarWidth = 0;
		var hBarHeight = 0;
		
		var w = 0;
		var h = 0;
		
		if (this.getStyle("MeasureContentWidth") == true)
			w = this._textField._getStyledOrMeasuredWidth();
		
		if (this.getStyle("MeasureContentHeight") == true)
			h = this._textField._getStyledOrMeasuredHeight();
		
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
		
		w += vBarWidth;
		h += hBarHeight;
		
		//Padding included by textField
		this._setMeasuredSize(w, h);
	};	

//@override
TextAreaElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		//base.base - Skip the TextInput _doLayout()
		TextAreaElement.base.base.prototype._doLayout.call(this, paddingMetrics);
		
		var hDisplay = this.getStyle("HorizontalScrollBarDisplay");
		var vDisplay = this.getStyle("VerticalScrollBarDisplay");
		
		var horizontalBarPlacement = this.getStyle("HorizontalScrollBarPlacement");
		var verticalBarPlacement = this.getStyle("VerticalScrollBarPlacement");
		
		var vScrollParams = this._textField._getVerticalScrollParameters();
		var hScrollParams = this._textField._getHorizontalScrollParameters();
		
		var needsHScroll = false;
		var needsVScroll = false;
		
		//We need the scroll bar.
		if (hDisplay == "on" || (hDisplay == "auto" && hScrollParams.page > hScrollParams.view))
			needsHScroll = true;
			
		if (vDisplay == "on" || (vDisplay == "auto" && vScrollParams.page > vScrollParams.view))
			needsVScroll = true;
		
		//Destroy
		if (needsHScroll == false)
		{
			if (this._horizontalScrollBar != null)
			{
				this._removeChild(this._horizontalScrollBar);
				this._horizontalScrollBar = null;
			}
		}
		else //Create
		{
			if (this._horizontalScrollBar == null)
			{
				this._horizontalScrollBar = new ScrollBarElement();
				this._applySubStylesToElement("HorizontalScrollBarStyle", this._horizontalScrollBar);
	
				this._horizontalScrollBar.setStyle("LayoutDirection", "horizontal");
				
				this._horizontalScrollBar.addEventListener("changed", this._onTextAreaScrollBarChangeInstance);
				this._addChild(this._horizontalScrollBar);
			}
		}
		
		//Destroy
		if (needsVScroll == false)
		{
			if (this._verticalScrollBar != null)
			{
				this._removeChild(this._verticalScrollBar);
				this._verticalScrollBar = null;
			}
		}
		else //Create
		{
			if (this._verticalScrollBar == null)
			{
				this._verticalScrollBar = new ScrollBarElement();
				this._applySubStylesToElement("VerticalScrollBarStyle", this._verticalScrollBar);
				
				this._verticalScrollBar.setStyle("LayoutDirection", "vertical");
				
				this._verticalScrollBar.addEventListener("changed", this._onTextAreaScrollBarChangeInstance);
				this._addChild(this._verticalScrollBar);
			}
		}
		
		var verticalBarWidth = 0;
		var horizontalBarHeight = 0;
		
		//Distribute horizontal padding and setup vertical scroll bar
		if (this._verticalScrollBar != null)
		{
			this._verticalScrollBar.setScrollPageSize(vScrollParams.page);
			this._verticalScrollBar.setScrollViewSize(vScrollParams.view);
			this._verticalScrollBar.setScrollLineSize(vScrollParams.line);
			this._verticalScrollBar.setScrollValue(vScrollParams.value);
			
			verticalBarWidth = this._verticalScrollBar._getStyledOrMeasuredWidth();
		}
		
		//Distribute vertical padding and setup horizontal scroll bar
		if (this._horizontalScrollBar != null)
		{
			this._horizontalScrollBar.setScrollPageSize(hScrollParams.page);
			this._horizontalScrollBar.setScrollViewSize(hScrollParams.view);
			this._horizontalScrollBar.setScrollLineSize(hScrollParams.line);
			this._horizontalScrollBar.setScrollValue(hScrollParams.value);
			
			horizontalBarHeight = this._horizontalScrollBar._getStyledOrMeasuredHeight();
		}			

		
		//Size and position vertical scroll bar
		if (this._verticalScrollBar != null)
		{
			this._verticalScrollBar._setActualSize(verticalBarWidth, this._height - horizontalBarHeight);
			
			if (verticalBarPlacement == "left")
			{
				if (horizontalBarPlacement == "top")
					this._verticalScrollBar._setActualPosition(0, horizontalBarHeight);
				else
					this._verticalScrollBar._setActualPosition(0, 0);
			}
			else //if (verticalBarPlacement == "right")
			{
				if (horizontalBarPlacement == "top")
					this._verticalScrollBar._setActualPosition(this._width - verticalBarWidth, horizontalBarHeight);
				else
					this._verticalScrollBar._setActualPosition(this._width - verticalBarWidth, 0);
			}				
		}
		
		//Size and position horizontal scroll bar
		if (this._horizontalScrollBar != null)
		{
			this._horizontalScrollBar._setActualSize(this._width - verticalBarWidth, horizontalBarHeight);
			
			if (horizontalBarPlacement == "top")
			{
				if (verticalBarPlacement == "left")
					this._horizontalScrollBar._setActualPosition(verticalBarWidth, 0);
				else
					this._horizontalScrollBar._setActualPosition(0, 0);
			}
			else //if (horizontalBarPlacement == "bottom")
			{
				if (verticalBarPlacement == "left")
					this._horizontalScrollBar._setActualPosition(verticalBarWidth, this._height - horizontalBarHeight);
				else
					this._horizontalScrollBar._setActualPosition(0, this._height - horizontalBarHeight);
			}	
		}
		
		//Size and position the TextField
		this._textField._setActualSize(this._width - verticalBarWidth, this._height - horizontalBarHeight);
		
		var tfX = 0;
		if (this._verticalScrollBar != null && verticalBarPlacement == "left")
			tfX = verticalBarWidth;
		
		var tfY = 0;
		if (this._horizontalScrollBar != null && horizontalBarPlacement == "top")
			tfY = horizontalBarHeight;
		
		this._textField._setActualPosition(tfX, tfY);
	};
