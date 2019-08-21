
/**
 * @depends ButtonElement.js
 * @depends DropdownArrowButtonSkinElement.js
 * @depends Tween.js
 */

//////////////////////////////////////////////////////////////
////////////////DropdownBaseElement///////////////////////////

/**
 * @class DropdownBaseElement
 * @inherits ButtonElement
 * 
 * DropdownBaseElement is an abstract base class for buttons that display 
 * a pop up when clicked.
 * 
 * The DropdownBase itself contains a child button which is used to render
 * the divider line and arrow. DropdownBase proxies its SkinState style to the arrow
 * button so the arrow button will change states along with the DropdownBase itself.
 * See the default skin for the arrow button, DropdownArrowButtonSkinElement for additional styles.
 * 
 * @seealso DropdownArrowButtonSkinElement
 * 
 * 
 * @constructor DropdownBaseElement 
 * Creates new DropdownBaseElement instance.
 */
function DropdownBaseElement()
{
	DropdownBaseElement.base.prototype.constructor.call(this);

	this._arrowButton = null;
	
	this._popupElement = null;
	this._openCloseTween = null;
	this._tweenIsOpening = true;
	
	
	//////////////////
	
	var _self = this;
	
	//Private event listeners, need an instance for each DropdownBaseElement, proxy to prototype.
		
	this._onDropdownBaseManagerCaptureEventInstance = 
		function (event)
		{
			_self._onDropdownBaseManagerCaptureEvent(event);
		};
		
	this._onDropdownBaseManagerResizeEventInstance = 
		function (event)
		{
			_self._onDropdownBaseManagerResizeEvent(event);
		};
		
	this._onDropdownBaseEnterFrameInstance = 
		function (event)
		{
			_self._onDropdownBaseEnterFrame(event);
		};
}

//Inherit from ButtonElement
DropdownBaseElement.prototype = Object.create(ButtonElement.prototype);
DropdownBaseElement.prototype.constructor = DropdownBaseElement;
DropdownBaseElement.base = ButtonElement;

////////////Events///////////////////////////////

/**
 * @event opened DispatcherEvent
 * Dispatched when the pop up is opened as a result of user input.
 * 
 * @event closed DispatcherEvent
 * Dispatched when the pop up is closed as a result of user input.
 */

/////////////Style Types/////////////////////////

DropdownBaseElement._StyleTypes = Object.create(null);

/**
 * @style ArrowButtonClass CanvasElement
 * The CanvasElement or subclass constructor to be used for the arrow icon. Defaults to Button. 
 * Note that Dropdown proxies its SkinState style to the arrow button so the arrow will change states with the Dropdown.
 */
DropdownBaseElement._StyleTypes.ArrowButtonClass = 				StyleableBase.EStyleType.NORMAL; 		// CanvasElement constructor

/**
 * @style ArrowButtonStyle StyleDefinition
 * The StyleDefinition or [StyleDefinition] array to apply to the arrow icon class.
 */
DropdownBaseElement._StyleTypes.ArrowButtonStyle = 				StyleableBase.EStyleType.SUBSTYLE; 		// StyleDefinition

/**
 * @style OpenCloseTweenDuration Number
 * Duration in milliseconds the open and close animation should run.
 */
DropdownBaseElement._StyleTypes.OpenCloseTweenDuration = 		StyleableBase.EStyleType.NORMAL; 		// number (milliseconds)

/**
 * @style OpenCloseTweenEasingFunction Function
 * Easing function used on the open and close animations. Defaults to Tween.easeInOutSine().
 */
DropdownBaseElement._StyleTypes.OpenCloseTweenEasingFunction = 	StyleableBase.EStyleType.NORMAL; 		// function (fraction) { return fraction} - see Tween.easing


////////////Default Styles////////////////////

DropdownBaseElement.ArrowButtonSkinStyleDefault = new StyleDefinition();
DropdownBaseElement.ArrowButtonSkinStyleDefault.setStyle("BorderType", 					null);
DropdownBaseElement.ArrowButtonSkinStyleDefault.setStyle("BackgroundFill", 				null);

DropdownBaseElement.ArrowButtonDisabledSkinStyleDefault = new StyleDefinition();
DropdownBaseElement.ArrowButtonDisabledSkinStyleDefault.setStyle("BorderType", 			null);
DropdownBaseElement.ArrowButtonDisabledSkinStyleDefault.setStyle("BackgroundFill", 		null);
DropdownBaseElement.ArrowButtonDisabledSkinStyleDefault.setStyle("ArrowColor", 			"#888888");
DropdownBaseElement.ArrowButtonDisabledSkinStyleDefault.setStyle("LineColor", 			"#888888");

/////Arrow default style///////
DropdownBaseElement.ArrowButtonStyleDefault = new StyleDefinition();
DropdownBaseElement.ArrowButtonStyleDefault.setStyle("SkinClass", 					DropdownArrowButtonSkinElement);

//Note that SkinState is proxied to the arrow button, so the arrow will change state along with the Dropdown (unless you turn mouse back on)
DropdownBaseElement.ArrowButtonStyleDefault.setStyle("MouseEnabled", 				false);

DropdownBaseElement.ArrowButtonStyleDefault.setStyle("UpSkinStyle", 				DropdownBaseElement.ArrowButtonSkinStyleDefault);
DropdownBaseElement.ArrowButtonStyleDefault.setStyle("OverSkinStyle", 				DropdownBaseElement.ArrowButtonSkinStyleDefault);
DropdownBaseElement.ArrowButtonStyleDefault.setStyle("DownSkinStyle", 				DropdownBaseElement.ArrowButtonSkinStyleDefault);
DropdownBaseElement.ArrowButtonStyleDefault.setStyle("DisabledSkinStyle", 			DropdownBaseElement.ArrowButtonDisabledSkinStyleDefault);
///////////////////////////////

DropdownBaseElement.StyleDefault = new StyleDefinition();
DropdownBaseElement.StyleDefault.setStyle("PaddingTop",								3);
DropdownBaseElement.StyleDefault.setStyle("PaddingBottom",							3);
DropdownBaseElement.StyleDefault.setStyle("PaddingRight",							4);
DropdownBaseElement.StyleDefault.setStyle("PaddingLeft",							4);

DropdownBaseElement.StyleDefault.setStyle("ArrowButtonClass", 						ButtonElement); 								// Element constructor
DropdownBaseElement.StyleDefault.setStyle("ArrowButtonStyle", 						DropdownBaseElement.ArrowButtonStyleDefault); 		// StyleDefinition
DropdownBaseElement.StyleDefault.setStyle("TextHorizontalAlign", 					"left"); 								
DropdownBaseElement.StyleDefault.setStyle("OpenCloseTweenDuration", 				300); 											// number (milliseconds)
DropdownBaseElement.StyleDefault.setStyle("OpenCloseTweenEasingFunction", 			Tween.easeInOutSine); 							// function (fraction) { return fraction}


/////////Style Proxy Maps/////////////////////////////

//Proxy map for styles we want to pass to the arrow button.
DropdownBaseElement._ArrowButtonProxyMap = Object.create(null);
DropdownBaseElement._ArrowButtonProxyMap.SkinState = 						true;
DropdownBaseElement._ArrowButtonProxyMap._Arbitrary = 						true;


/////////////Public///////////////////////////////

/**
 * @function open
 * Opens the pop up.
 * 
 * @param animate boolean
 * When true animates the appearance of the pop-up.
 */	
DropdownBaseElement.prototype.open = 
	function (animate)
	{
		if (this._manager == null)
			return;
	
		//Create popup element
		if (this._popupElement == null)
		{
			this._popupElement = this._createPopup();
			
			if (this._popupElement == null)
				return;
			
			this._popupElement._owner = this;
		}
		
		//Add the pop-up list. Wait for layoutcomplete to adjust positioning and size (will set openHeight once done)
		var added = this._addPopup(); 
		
		var tweenDuration = this.getStyle("OpenCloseTweenDuration");
		
		if (animate == false || tweenDuration <= 0)
		{
			this._endOpenCloseTween();
			this._updateTweenPosition(this._getOpenedTweenValue());
		}
		else
		{
			if (this._openCloseTween != null) //Tween running
			{
				if (this._openCloseTween.startVal != this._getClosedTweenValue()) //Reverse if closing, ignore if opening.
					this._reverseTween();
			}
			else if (added == true) //Only start tween if popup did not already exist
			{
				this._openCloseTween = new Tween();
				this._openCloseTween.duration = tweenDuration;
				this._openCloseTween.startTime = Date.now();
				this._openCloseTween.easingFunction = this.getStyle("OpenCloseTweenEasingFunction");
				
				this._tweenIsOpening = true;
				
				this.addEventListener("enterframe", this._onDropdownBaseEnterFrameInstance);
			}
		}
	};
	
/**
 * @function close
 * Closes the pop up.
 * 
 * @param animate boolean
 * When true animates the disappearance of the pop-up.
 */		
DropdownBaseElement.prototype.close = 
	function (animate)
	{
		if (this._popupElement == null)
			return;
	
		var tweenDuration = this.getStyle("OpenCloseTweenDuration");
	
		if (animate == false || tweenDuration <= 0)
		{
			this._endOpenCloseTween();		
			this._removePopup();
		}
		else 
		{
			if (this._openCloseTween != null) //Tween running
			{
				if (this._openCloseTween.startVal == this._getClosedTweenValue()) //Reverse if opening, ignore if closing.
					this._reverseTween();
			}
			else if (this._popupElement._parent != null) //Dont close if already closed
			{
				this._openCloseTween = new Tween();
				this._openCloseTween.duration = tweenDuration;
				this._openCloseTween.startTime = Date.now();
				this._openCloseTween.easingFunction = this.getStyle("OpenCloseTweenEasingFunction");
				
				this._tweenIsOpening = false;
				
				this.addEventListener("enterframe", this._onDropdownBaseEnterFrameInstance);
			}
		}
	};

	
/////////////Internal///////////////////////////////	
	
/**
 * @function _createPopup
 * Stub for creating the pop up element to be added to the pop up container.
 * Override this and return a new CanvasElement instance to be used as the pop up.
 * 
 * @returns CanvasElement
 * New pop up instance.
 */	
DropdownBaseElement.prototype._createPopup = 
	function ()
	{
		return null;
	};	
	
/**
 * @function _removePopup
 * Removes the pop up container from manager and cleans up event listeners.
 * 
 * @returns bool
 * Returns true if the pop up was removed, false if the pop up does not exist.
 */	
DropdownBaseElement.prototype._removePopup = 
	function ()
	{
		if (this._popupElement._parent == null)
			return false;
	
		this._manager.removeCaptureListener("wheel", this._onDropdownBaseManagerCaptureEventInstance);
		this._manager.removeCaptureListener("mousedown", this._onDropdownBaseManagerCaptureEventInstance);
		this._manager.removeEventListener("resize", this._onDropdownBaseManagerResizeEventInstance);
		this._manager.removeElement(this._popupElement);
		
		return true;
	};

/**
 * @function _addPopup
 * Adds the pop up container to manager and registers event listeners.
 * 
 * @returns bool
 * Returns true if the pop up was added, false if the pop up already exists.
 */		
DropdownBaseElement.prototype._addPopup = 
	function ()
	{
		if (this._popupElement._parent != null)
			return false;
		
		this._manager.addElement(this._popupElement);
		this._manager.addCaptureListener("wheel", this._onDropdownBaseManagerCaptureEventInstance);
		this._manager.addCaptureListener("mousedown", this._onDropdownBaseManagerCaptureEventInstance);
		this._manager.addEventListener("resize", this._onDropdownBaseManagerResizeEventInstance);
		
		return true;
	};
	
/**
 * @function _getTweenRunning
 * Returns true if the open/close tween is running. 
 * Needed by subclasses for positioning the pop up element.
 * 
 * @returns boolean
 * True if the open/close tween is running, otherwise false.
 */		
DropdownBaseElement.prototype._getTweenRunning = 
	function ()
	{
		if (this._openCloseTween == null)
			return false;
		
		return true;
	};
	
//@private	
DropdownBaseElement.prototype._onDropdownBaseEnterFrame = 
	function (event)
	{
		//Update tween start/stops
		if (this._tweenIsOpening == true)
		{
			this._openCloseTween.startVal = this._getClosedTweenValue();
			this._openCloseTween.endVal = this._getOpenedTweenValue();
		}
		else
		{
			this._openCloseTween.startVal = this._getOpenedTweenValue();
			this._openCloseTween.endVal = this._getClosedTweenValue();
		}
	
		//Get current tween value
		var value = this._openCloseTween.getValue(Date.now());
		
		//Update popup
		this._updateTweenPosition(value);
		
		//Handle tween finished
		if (value == this._openCloseTween.endVal)
		{
			if (value == this._getClosedTweenValue())
				this.close(false);			//Finished closing
			else
				this._endOpenCloseTween();	//Finished opening
		}
	};
	
//@private
DropdownBaseElement.prototype._endOpenCloseTween = 
	function ()
	{
		if (this._openCloseTween != null)
		{
			this.removeEventListener("enterframe", this._onDropdownBaseEnterFrameInstance);
			this._openCloseTween = null;
		}
	};

/**
 * @function _getOpenedTweenValue
 * Returns value to be used for the pop up's fully open position.
 * Override this to supply values for the open/close tween start & stop.
 * 
 * @returns Number
 * Value for open/closed tween's fully opened position.
 */	
DropdownBaseElement.prototype._getOpenedTweenValue = 
	function ()
	{
		return 1;
	};	

/**
 * @function _getClosedTweenValue
 * Returns value to be used for the pop up's fully closed position.
 * Override this to supply values for the open/close tween start & stop.
 * 
 * @returns Number
 * Value for open/closed tween's fully closed position.
 */	
DropdownBaseElement.prototype._getClosedTweenValue = 
	function ()
	{
		return 0;
	};
	
/**
 * @function _updateTweenPosition
 * Stub for updating the popup when the tween value changes.
 * Override this to adjust the popup during the open/close tween.
 * 
 * @param value Number
 * Current tween value.
 */
DropdownBaseElement.prototype._updateTweenPosition = 
	function (value)
	{
		//Stub for override
	};
	
/**
 * @function _onDropdownBaseManagerCaptureEvent
 * Capture event handler for CanvasManager "wheel" and "mousedown". Used to close 
 * the pop up when events happen outside the DropdownBase or pop up elements. 
 * Only active when pop up is open.
 * 
 * @param event ElementEvent
 * ElementEvent to process.
 */	
DropdownBaseElement.prototype._onDropdownBaseManagerCaptureEvent = 
	function (event)
	{
		//Check if the popup is in this target's parent chain.
		var target = event.getTarget();
		
		while (target != null)
		{
			//Yes, leave the drop down open
			if (target == this._popupElement || (event.getType() == "mousedown" && target == this))
				return;
			
			target = target._parent;
		}
		
		//Kill the drop down, event happened outside the popup list.
		this.close(false);
		
		if (this.hasEventListener("closed", null) == true)
			this.dispatchEvent(new DispatcherEvent("closed"));
	};
	
/**
 * @function _onDropdownManagerResizeEvent
 * Capture event handler for CanvasManager "resize". Used to close the pop up.
 * Only active when pop up is open.
 * 
 * @param event DispatcherEvent
 * DispatcherEvent to process.
 */		
DropdownBaseElement.prototype._onDropdownBaseManagerResizeEvent = 
	function (event)
	{
		this.close(false);
		
		if (this.hasEventListener("closed", null) == true)
			this.dispatchEvent(new DispatcherEvent("closed"));
	};

//@override	
DropdownBaseElement.prototype._onCanvasElementRemoved = 
	function (addedRemovedEvent)
	{
		DropdownBaseElement.base.prototype._onCanvasElementRemoved.call(this, addedRemovedEvent);
		
		this.close(false);
	};	

//@private	
DropdownBaseElement.prototype._reverseTween = 
	function ()
	{
		//Reverse direction flag
		this._tweenIsOpening = !this._tweenIsOpening;
	
		//Fix tween start time
		var now = Date.now();
		var elapsed = now - this._openCloseTween.startTime;
		
		this._openCloseTween.startTime = now + elapsed - this._openCloseTween.duration;		
	};
	
//@override	
DropdownBaseElement.prototype._onButtonClick = 
	function (elementMouseEvent)
	{
		//Just cancels event if we're disabled.
		DropdownBaseElement.base.prototype._onButtonClick.call(this, elementMouseEvent);
		
		if (elementMouseEvent.getIsCanceled() == true)
			return;
		
		if (this._openCloseTween != null)
		{
			this._reverseTween();
			
			if (this._tweenIsOpening == true)
			{
				if (this.hasEventListener("opened", null) == true)
					this.dispatchEvent(new DispatcherEvent("opened"));
			}
			else
			{
				if (this.hasEventListener("closed", null) == true)
					this.dispatchEvent(new DispatcherEvent("closed"));
			}
		}
		else 
		{
			if (this._popupElement == null || this._popupElement._parent == null)
			{
				this.open(true);
				
				if (this.hasEventListener("opened", null) == true)
					this.dispatchEvent(new DispatcherEvent("opened"));
			}
			else
			{
				this.close(true);
				
				if (this.hasEventListener("closed", null) == true)
					this.dispatchEvent(new DispatcherEvent("closed"));
			}
		}
	};	
	
//@private	
DropdownBaseElement.prototype._updateArrowButton = 
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
			if (this._arrowButton == null || this._arrowButton.constructor != arrowClass)
			{
				var newArrowButton = new (arrowClass)();
				newArrowButton._setStyleProxy(new StyleProxy(this, DropdownBaseElement._ArrowButtonProxyMap));
				
				if (this._arrowButton != null)
					this._removeChild(this._arrowButton);
				
				this._arrowButton = newArrowButton;
				
				this._addChild(this._arrowButton);
			}
			
			this._applySubStylesToElement("ArrowButtonStyle", this._arrowButton);
		}
	};
	
//@override
DropdownBaseElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		DropdownBaseElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("ArrowButtonClass" in stylesMap || "ArrowButtonStyle" in stylesMap)
			this._updateArrowButton();
	};
	
//@override
DropdownBaseElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		var textHeight = this.getStyle("TextSize") + this.getStyle("TextLinePaddingTop") + this.getStyle("TextLinePaddingBottom");
		var textWidth = 20;
		
		if (this._labelElement != null)
			textWidth = this._labelElement._getStyledOrMeasuredWidth();
		
		var measuredWidth = textWidth + padWidth; 
		var measuredHeight = textHeight + padHeight;
		
		if (this._arrowButton != null)
		{
			var arrowWidth = this._arrowButton.getStyle("Width");
			var arrowHeight = this._arrowButton.getStyle("Height");
			
			if (arrowHeight != null && arrowHeight > measuredHeight)
				measuredHeight = arrowHeight;
			if (arrowWidth != null)
				measuredWidth += arrowWidth;
			else
				measuredWidth += Math.round(measuredHeight * .85);
		}

		this._setMeasuredSize(measuredWidth, measuredHeight);
	};	
	
//@override	
DropdownBaseElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		DropdownBaseElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		if (this._arrowButton != null)
		{
			var x = paddingMetrics.getX();
			var y = paddingMetrics.getY();
			var w = paddingMetrics.getWidth();
			var h = paddingMetrics.getHeight();
			
			var arrowWidth = this._arrowButton.getStyle("Width");
			var arrowHeight = this._arrowButton.getStyle("Height");
			
			if (arrowHeight == null)
				arrowHeight = this._height;
			if (arrowWidth == null)
				arrowWidth = this._height * .85;
			
			if (this._width < arrowWidth)
			{
				this._arrowButton._setActualSize(0, 0);
				this._labelElement._setActualSize(0, 0);
			}
			else
			{
				if (this._labelElement != null)
				{
					this._labelElement._setActualPosition(x, y);
					this._labelElement._setActualSize(w - arrowWidth, h);
				}
					
				this._arrowButton._setActualPosition(this._width - arrowWidth, y + (h / 2) - (arrowHeight / 2));
				this._arrowButton._setActualSize(arrowWidth, arrowHeight);
			}
		}
	};