
/**
 * @depends ButtonElement.js
 * @depends DropdownArrowButtonSkinElement.js
 * @depends Tween.js
 * @depends ColorPickerElement.js
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

	this._arrowButton = null;
	
	this._colorPickerPopupContainer = new CanvasElement();
	this._colorPickerPopup = new ColorPickerElement();
	this._colorPickerPopupContainer._addChild(this._colorPickerPopup);
	
	this._openPosition = null;					//"tl || tr || bl || br" || null
	this._colorButtonManagerMetrics = null;
	this._openCloseTween = null;
	
	var _self = this;
	
	//Private event listeners, need an instance for each ColorPickerButton, proxy to prototype.
		
	this._onColorPickerPopupLayoutCompleteInstance = 
		function (event)
		{
			_self._onColorPickerPopupLayoutComplete(event);
		};
		
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
		
	this._onColorPickerPopupKeydownInstance = 
		function (keyboardEvent)
		{
			_self._onColorPickerPopupKeydown(keyboardEvent);
		};
	
	this._onColorPickerPopupChangedInstance = 
		function (event)
		{
			_self._onColorPickerPopupChanged(event);
		};
		
	this._colorPickerPopup.addEventListener("changed", this._onColorPickerPopupChangedInstance);	
	this._colorPickerPopup.addEventListener("keydown", this._onColorPickerPopupKeydownInstance);
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


////////////Default Styles////////////////////

/////Arrow default skin styles//////
ColorPickerButtonElement.ArrowButtonSkinStyleDefault = new StyleDefinition();
ColorPickerButtonElement.ArrowButtonSkinStyleDefault.setStyle("BorderType", 					null);
ColorPickerButtonElement.ArrowButtonSkinStyleDefault.setStyle("BackgroundFill", 				null);

ColorPickerButtonElement.ArrowButtonDisabledSkinStyleDefault = new StyleDefinition();
ColorPickerButtonElement.ArrowButtonDisabledSkinStyleDefault.setStyle("BorderType", 			null);
ColorPickerButtonElement.ArrowButtonDisabledSkinStyleDefault.setStyle("BackgroundFill", 		null);
ColorPickerButtonElement.ArrowButtonDisabledSkinStyleDefault.setStyle("ArrowColor", 			"#888888");
ColorPickerButtonElement.ArrowButtonDisabledSkinStyleDefault.setStyle("LineColor", 				"#888888");


/////Arrow default style///////
ColorPickerButtonElement.ArrowButtonStyleDefault = new StyleDefinition();
ColorPickerButtonElement.ArrowButtonStyleDefault.setStyle("SkinClass", 					DropdownArrowButtonSkinElement);

//Note that SkinState is proxied to the arrow button, so the arrow will change state along with the Dropdown (unless you turn mouse back on)
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
ColorPickerButtonElement.StyleDefault.setStyle("ColorSwatchStyle", 						ColorPickerButtonElement.ColorSwatchStyleDefault); 			
ColorPickerButtonElement.StyleDefault.setStyle("ArrowButtonClass", 						ButtonElement); 								// Element constructor
ColorPickerButtonElement.StyleDefault.setStyle("ArrowButtonStyle", 						ColorPickerButtonElement.ArrowButtonStyleDefault); 		// StyleDefinition
ColorPickerButtonElement.StyleDefault.setStyle("OpenCloseTweenDuration", 				300); 											// number (milliseconds)
ColorPickerButtonElement.StyleDefault.setStyle("OpenCloseTweenEasingFunction", 			Tween.easeInOutSine); 							// function (fraction) { return fraction}


/////////Style Proxy Maps/////////////////////////////

//Proxy map for styles we want to pass to the arrow button.
ColorPickerButtonElement._ArrowButtonProxyMap = Object.create(null);
ColorPickerButtonElement._ArrowButtonProxyMap.SkinState = 						true;
ColorPickerButtonElement._ArrowButtonProxyMap._Arbitrary = 						true;


/////////////Public///////////////////////////////


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
	
		if (this._colorButtonManagerMetrics == null)
			this._colorButtonManagerMetrics = this.getMetrics(this._manager);
		
		//Add the pop-up ColorPicker. Wait for layoutcomplete to adjust positioning and size (will set _openDirection)
		this._addColorPickerPopup(); 
		
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
			else if (this._openPosition == null && this._openCloseTween == null) //Dont open if already open or opening
			{
				this._openCloseTween = new Tween();
				this._openCloseTween.startVal = 0; 
				this._openCloseTween.endVal = 1;	
				this._openCloseTween.duration = tweenDuration;
				this._openCloseTween.startTime = Date.now();
				this._openCloseTween.easingFunction = this.getStyle("OpenCloseTweenEasingFunction");
				
				this.addEventListener("enterframe", this._onDropDownEnterFrameInstance);
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
			else if (this._openPosition != null) //Dont close if already closed or closing
			{
				this._openCloseTween = new Tween();
				this._openCloseTween.startVal = this._openHeight - this.getStyle("PopupDataListClipTopOrBottom");
				this._openCloseTween.endVal = 0;
				this._openCloseTween.duration = tweenDuration;
				this._openCloseTween.startTime = Date.now();
				this._openCloseTween.easingFunction = this.getStyle("OpenCloseTweenEasingFunction");
				
				this.addEventListener("enterframe", this._onDropDownEnterFrameInstance);
			}
		}
	};

	
/////////////Internal///////////////////////////////	
	
/**
 * @function _removeColorPickerPopup
 * Removes the pop up ColorPicker and cleans up event listeners.
 */	
ColorPickerButtonElement.prototype._removeColorPickerPopup = 
	function ()
	{
		if (this._colorPickerPopupContainer._parent == null)
			return;
	
		this._colorPickerPopupContainer._manager.removeCaptureListener("wheel", this._onColorButtonManagerCaptureEventInstance);
		this._colorPickerPopupContainer._manager.removeCaptureListener("mousedown", this._onColorButtonManagerCaptureEventInstance);
		this._colorPickerPopupContainer._manager.removeEventListener("resize", this._onColorButtonManagerResizeEventInstance);
		
		this._colorPickerPopupContainer._manager.removeElement(this._colorPickerPopupContainer);
		
		this._colorButtonManagerMetrics = null;
		this._openDirection = null;
		this._openHeight = null;
	};

/**
 * @function _addDataListPopup
 * Adds the pop up list and registers event listeners.
 */		
DropdownElement.prototype._addDataListPopup = 
	function ()
	{
		if (this._dataListPopupClipContainer._parent != null)
			return;
		
		var popupHeight = this.getStyle("MaxPopupHeight");
		
		this._dataListPopupClipContainer.setStyle("Width", this._dropdownManagerMetrics._width);
		this._dataListPopupClipContainer.setStyle("Height", popupHeight);
		this._dataListPopupClipContainer.setStyle("X", this._dropdownManagerMetrics._x);
		this._dataListPopupClipContainer.setStyle("Y", this._dropdownManagerMetrics._y + this._dropdownManagerMetrics._height);
		
		this._dataListPopup._setActualPosition(0, 0);
		this._dataListPopup._setActualSize(this._dropdownManagerMetrics._width, popupHeight);
		
		this._manager.addElement(this._dataListPopupClipContainer);
		
		this._dataListPopupClipContainer._manager.addCaptureListener("wheel", this._onDropdownManagerCaptureEventInstance);
		this._dataListPopupClipContainer._manager.addCaptureListener("mousedown", this._onDropdownManagerCaptureEventInstance);
		this._dataListPopupClipContainer._manager.addEventListener("resize", this._onDropdownManagerResizeEventInstance);
	};
	
//@private	
DropdownElement.prototype._onDropDownEnterFrame = 
	function (event)
	{
		//Tween created, but layoutcomplete has not yet finished. 
		//When we first create the popup list, we need to wait a cycle for the list layout to finish.
		//However, enter frame fires first *before* the list cycle has finished.
		if (this._openCloseTween.endVal == null)
			return;
	
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
DropdownElement.prototype._endOpenCloseTween = 
	function ()
	{
		if (this._openCloseTween != null)
		{
			this.removeEventListener("enterframe", this._onDropDownEnterFrameInstance);
			this._openCloseTween = null;
		}
	};
	
//@private	
DropdownElement.prototype._updateTweenPosition = 
	function (value)
	{
		this._dataListPopupClipContainer.setStyle("Height", value);
		
		if (this._openDirection == "up")
			this._dataListPopupClipContainer.setStyle("Y", this._dropdownManagerMetrics._y - value);
		else //if (this._openDirection == "down")
			this._dataListPopup._setActualPosition(0, value - this._dataListPopup._height);
	};
	
/**
 * @function _onDropdownManagerCaptureEvent
 * Capture event handler for CanvasManager "wheel" and "mousedown". Used to close 
 * the drop down when events happen outside the Dropdown or pop up list. Only active when pop up list is open.
 * 
 * @param event ElementEvent
 * ElementEvent to process.
 */	
DropdownElement.prototype._onDropdownManagerCaptureEvent = 
	function (event)
	{
		//Check if the dropdown list is in this target's parent chain.
		var target = event.getTarget();
		while (target != null)
		{
			//Yes, leave the drop down open
			if (target == this._dataListPopup || 
				(event.getType() == "mousedown" && target == this))
				return;
			
			target = target._parent;
		}
		
		//Kill the drop down, event happened outside the popup list.
		this.close(false);
	};
	
/**
 * @function _onDropdownManagerResizeEvent
 * Capture event handler for CanvasManager "resize". Used to close the dropdown.
 * Only active when pop up list is open.
 * 
 * @param event DispatcherEvent
 * DispatcherEvent to process.
 */		
DropdownElement.prototype._onDropdownManagerResizeEvent = 
	function (event)
	{
		this.close(false);
	};

/**
 * @function _onDropdownDataListPopupLayoutComplete
 * Event handler for pop up list "layoutcomplete". 
 * Updates the pop up list height after content size is known and determines
 * if drop down opens up or down depending on available space.
 * 
 * @param event DispatcherEvent
 * DispatcherEvent to process.
 */		
DropdownElement.prototype._onDropdownDataListPopupLayoutComplete =
	function (event)
	{
		var maxHeight = this.getStyle("MaxPopupHeight");
		var height = null;
		
		if (this._dataListPopup.getStyle("ListDirection") == "horizontal")
			height = maxHeight;
		else
		{
			//Get actual Popup list height.
			var contentSize = this._dataListPopup._getContentSize();
			
			if (contentSize < maxHeight)
			{
				if (this._listCollection != null && this._dataListPopup._getNumRenderers() < this._listCollection.getLength())
					height = maxHeight;
				else
					height = contentSize;
			}
			else //contentSize >= maxHeight
				height = maxHeight;
		}
		
		//Determine open up/down and correct if not enough available space.
		var availableBottom = this._manager._height - (this._dropdownManagerMetrics._y + this._dropdownManagerMetrics._height);
		if (availableBottom >= height)
		{
			this._openDirection = "down";
			this._openHeight = height;
		}
		else //if (availableBottom < height)
		{
			var availableTop = this._dropdownManagerMetrics._y;
			if (availableTop >= height)
			{
				this._openDirection = "up";
				this._openHeight = height;
			}
			else //if (availableTop < height)
			{
				if (availableBottom >= availableTop)
				{
					this._openDirection = "down";
					this._openHeight = availableBottom;
				}
				else
				{
					this._openDirection = "up";
					this._openHeight = availableTop;
				}
			}
		}

		//Fix list height
		this._dataListPopup._setActualSize(this._dataListPopup._width, this._openHeight);
		this._dataListPopupClipContainer.setStyle("Height", this._openHeight);
		
		var clipTopOrBottom = this.getStyle("PopupDataListClipTopOrBottom");
		
		if (this._openCloseTween != null)
		{
			if (this._openCloseTween.startVal == 0) //Closing
				this._openCloseTween.endVal = this._openHeight - clipTopOrBottom;
			else //Opening
				this._openCloseTween.startVal = this._openHeight - clipTopOrBottom;
			
			this._onDropDownEnterFrame(null); //Force a tween update.
		}
		else
			this._updateTweenPosition(this._openHeight - clipTopOrBottom);
	};
	
/**
 * @function _onDropdownDataListPopupChanged
 * Event handler for pop up list "changed" event. Updates selected item/index and re-dispatches "changed" event.
 * 
 * @param elementEvent ElementEvent
 * ElementEvent to process.
 */	
DropdownElement.prototype._onDropdownDataListPopupChanged = 
	function (elementEvent)
	{
		this.setSelectedIndex(this._dataListPopup.getSelectedIndex());
		this.close(true);
		
		if (this.hasEventListener("changed", null) == true)
			this.dispatchEvent(new ElementEvent("changed", false));
	};

/**
 * @function _onDropdownDataListPopupListItemClicked
 * Event handler for pop up list "listitemclick" event. 
 * 
 * @param elementListItemClickEvent ElementListItemClickEvent
 * ElementListItemClickEvent to process.
 */		
DropdownElement.prototype._onDropdownDataListPopupListItemClicked = 
	function (elementListItemClickEvent)
	{
		//Just proxy the event from the popup list
		if (this.hasEventListener("listitemclick", null) == true)
			this.dispatchEvent(elementListItemClickEvent);
	};
	
/**
 * @function _createDataListPopup
 * Generates and sets up a pop up list element instance per styling.
 * 
 * @returns DataListElement
 * New pop up list instance.
 */	
DropdownElement.prototype._createDataListPopup = 
	function ()
	{
		//TODO: Use PopupDataListClass style.
	
		var dataListPopup = new DataListElement();
		
		dataListPopup._setStyleProxy(new StyleProxy(this, DropdownElement._PopupDataListProxyMap));
		this._applySubStylesToElement("PopupDataListStyle", dataListPopup);
		
		dataListPopup.setListCollection(this._listCollection);
		dataListPopup.setSelectedIndex(this._selectedIndex);
		
		dataListPopup.addEventListener("changed", this._onDropdownDataListPopupChangedInstance);
		dataListPopup.addEventListener("listitemclick", this._onDropdownDataListPopupListItemClickedInstance);
		dataListPopup.addEventListener("layoutcomplete", this._onDropdownDataListPopupLayoutCompleteInstance);
		
		return dataListPopup;
	};
	
//@override	
DropdownElement.prototype._updateText = 
	function ()
	{
		var text = null;
		var labelFunction = this.getStyle("ItemLabelFunction");
		
		if (this._selectedItem == null || labelFunction == null)
			text = this.getStyle("Text");
		else
			text = labelFunction(this._selectedItem);
		
		this._setLabelText(text);
	};	
	
/**
 * @function _onDropdownListCollectionChanged
 * Event handler for the ListCollection data-providers "collectionchanged" event. 
 * 
 * @param collectionChangedEvent CollectionChangedEvent
 * CollectionChangedEvent to process.
 */	
DropdownElement.prototype._onDropdownListCollectionChanged = 
	function (collectionChangedEvent)
	{
		//Room to optimize here
//		var type = collectionChangedEvent.getKind();
//		var index = collectionChangedEvent.getIndex();
	
		//Fix selected index/item 
		if (this._selectedItem != null)
		{
			this._selectedIndex = this._listCollection.getItemIndex(this._selectedItem);
			
			if (this._selectedIndex == -1)
				this._selectedItem = null;
		}
		
		this._updateText();
		
		this._sampledTextWidth = null;
		this._invalidateMeasure();
	};	
	
//@override	
DropdownElement.prototype._onCanvasElementRemoved = 
	function (addedRemovedEvent)
	{
		DropdownElement.base.prototype._onCanvasElementRemoved.call(this, addedRemovedEvent);
		
		this.close(false);
	};	

//@private	
DropdownElement.prototype._reverseTween = 
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
	
//@Override	
DropdownElement.prototype._onButtonClick = 
	function (elementMouseEvent)
	{
		//Just cancels event if we're disabled.
		DropdownElement.base.prototype._onButtonClick.call(this, elementMouseEvent);
		
		if (elementMouseEvent.getIsCanceled() == true)
			return;
		
		if (this._openCloseTween != null)
			this._reverseTween();
		else 
		{
			if (this._openHeight == null)
				this.open(true);
			else
				this.close(true);
		}
	};	
	
/**
 * @function _createArrowButton
 * Generates and sets up the arrow element instance per styling.
 * 
 * @returns DataListElement
 * New arrow element instance.
 */		
DropdownElement.prototype._createArrowButton = 
	function (arrowClass)
	{
		var newIcon = new (arrowClass)();
		newIcon._setStyleProxy(new StyleProxy(this, DropdownElement._ArrowButtonProxyMap));
		this._applySubStylesToElement("ArrowButtonStyle", newIcon);
	
		return newIcon;
	};
	
//@private	
DropdownElement.prototype._updateArrowButton = 
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
			else
				this._applySubStylesToElement("ArrowButtonStyle", this._arrowButton);
		}
	};
	
//@Override
DropdownElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		DropdownElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("ItemLabelFunction" in stylesMap)
		{
			this._sampledTextWidth = null;
			this._invalidateMeasure();
			this._updateText();
		}
		
		if ("PopupDataListStyle" in stylesMap && this._dataListPopup != null)
			this._applySubStylesToElement("PopupDataListStyle", this._dataListPopup);
		
		if ("ArrowButtonClass" in stylesMap || "ArrowButtonStyle" in stylesMap)
			this._updateArrowButton();
		
		if ("TextStyle" in stylesMap ||
			"TextFont" in stylesMap ||
			"TextSize" in stylesMap ||
			"TextHorizontalAlign" in stylesMap ||
			"TextVerticalAlign" in stylesMap || 
			"Text" in stylesMap)
		{
			this._sampledTextWidth = null;
			this._invalidateMeasure();
		}
	};
	
//@override
DropdownElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		if (this._sampledTextWidth == null)
			this._sampledTextWidth = this._sampleTextWidths();
		
		var textHeight = this.getStyle("TextSize") + this.getStyle("TextLinePaddingTop") + this.getStyle("TextLinePaddingBottom");
		
		var measuredSize = {width: this._sampledTextWidth + padWidth, height: textHeight + padHeight};
		measuredSize.width += 20; //Add some extra space
		
		if (this._arrowButton != null)
		{
			var iconWidth = this._arrowButton.getStyle("Width");
			var iconHeight = this._arrowButton.getStyle("Height");
			
			if (iconHeight != null && iconHeight > measuredSize.height)
				measuredSize.height = iconHeight;
			if (iconWidth != null)
				measuredSize.width += iconWidth;
			else
				measuredSize.width += Math.round(measuredSize.height * .85);
		}

		return measuredSize;
	};	
	
//@Override	
DropdownElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		DropdownElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		if (this._openDirection != null) //dropdown open
		{
			//Update the dropdown metrics
			this._dropdownManagerMetrics = this.getMetrics(this._manager);
			
			//Update the widths of the popup container and list. (Heights handled by tween / list layoutcomplete)
			//This is here so that when the Dropdown is using measured width, and the collection changes,
			//it may change the width of the dropdown button, so we need to make sure we keep the widths in sync.
			this._dataListPopupClipContainer.setStyle("Width", this._dropdownManagerMetrics._width);
			this._dataListPopupClipContainer.setStyle("X", this._dropdownManagerMetrics._x);
			this._dataListPopupClipContainer.setStyle("Y", this._dropdownManagerMetrics._y + this._dropdownManagerMetrics._height);
			
			this._dataListPopup._setActualSize(this._dropdownManagerMetrics._width, this._dataListPopup._height);
		}
		
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