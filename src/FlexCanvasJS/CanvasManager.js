
/**
 * @depends AnchorContainerElement.js
 */

//////////////////////////////////////////////////////////////
////////////////////CanvasManager/////////////////////////////

/**
 * @class CanvasManager
 * @inherits AnchorContainerElement
 * 
 * CanvasManager is the root of the display hierarchy, manages a single canvas, and is essentially
 * the brain of the system, its responsible things such as driving the component life cycle, 
 * managing CanvasElements, requesting render frames from the browser, etc.  
 * For elements to be rendered to the canvas, they must be added to CanvasManager, or be a descendant of
 * an element that has been added to CanvasManager. 
 * 
 * CanvasManager itself is a subclass of an AnchorContainer and can be used as such, although typically
 * for more complex layouts you will nest containers inside of CanvasManager.
 * 
 * @constructor CanvasManager 
 * Creates new CanvasManager instance.
 */

function CanvasManager()
{
	//Life cycle phases
	this._updateStylesQueue = new CmDepthQueue();
	this._updateMeasureQueue = new CmDepthQueue();
	this._updateLayoutQueue = new CmDepthQueue();
	this._updateRenderQueue = new CmDepthQueue();
	this._updateRedrawRegionQueue = new CmDepthQueue();
	this._updateTransformRegionQueue = new CmDepthQueue();
	this._compositeRenderQueue = new CmDepthQueue();
	
	//Used to store the add/remove events we need to dispatch after elements are added/removed from the display chain.
	//Adding and removing elements is a recursive process which must finish prior to dispatching any events.
	this._addRemoveDisplayChainQueue = new CmLinkedList();
	this._addRemoveDisplayChainQueueProcessing = false; //Recursion guard
	
	this._broadcastDispatcher = new EventDispatcher(); //Dispatches broadcast events.
	
	this._browserCursor = null;
	this._cursorChain = new CmLinkedList();	//Priority Chain (cursor)
	
	this._tabStopReverse = false;
	this._focusElement = null;				//Target with focus
	
	this._canvas = null;
	this._canvasContext = null;
	this._canvasRenderFramePending = false;
	
	this._mouseX = -1;
	this._mouseY = -1;
	
	this._rollOverInvalid = true;
	this._rollOverElement = null;	//Last roll over target.
	this._rollOverX = -1;			//Position within target (used for mousemove)
	this._rollOverY = -1;
	
	this._mouseDownElement = null; 	//Target to dispatch mouseup
	
	this._draggingElement = null;	//Target currently being dragged.
	this._draggingOffsetX = null;
	this._draggingOffsetY = null;	
	
	this._currentLocale = "en-us";
	
	this._redrawRegionCachePool = new CmRedrawRegionCachePool();
	this._redrawRegionPrevMetrics = null;
	
	//Now call base
	CanvasManager.base.prototype.constructor.call(this);

	this._alertQueue = [];
	this._alertModal = null;
	
	this._cursorContainer = new CanvasElement();
	this._cursorContainer.setStyle("MouseEnabled", false);
	this._addOverlayChild(this._cursorContainer);	
	
	var _self = this;
	
	//Private handlers, need instance for every CanvasManager
	this._onCursorDefinitionStyleChangedInstance = 
		function (styleChangedEvent)
		{
			_self._onCursorDefinitionStyleChanged(styleChangedEvent);
		};
		
	this._onCanvasFrame = 
		function ()
		{
			//Prevent double render frames if someone changes our associated canvas.
			if (_self._canvasContext == null)
			{
				_self._canvasRenderFramePending = false;
				return;
			}
			
			_self.updateNow();
			
			window.requestAnimationFrame(_self._onCanvasFrame);	
		};
	
	this._canvasResizeEventHandler = 
		function ()
		{
			var clientRect = _self._canvas.getBoundingClientRect();
			
			var w = Math.round(clientRect.width * window.devicePixelRatio);
			var h = Math.round(clientRect.height * window.devicePixelRatio);
		
			//Fix canvas manager size.
			_self.setStyle("Width", w);
			_self.setStyle("Height", h);
			_self._setActualSize(w, h);
			
			_self._redrawRegionPrevMetrics = null;
			_self._updateRedrawRegion(_self.getMetrics(null));
			
			_self.updateNow();
		};
	
	this._canvasFocusEventHandler = 
		function (browserEvent)
		{
			//Tab focus only (if focused via mouse we'll get the mouse event first)
			if (_self._focusElement == null && browserEvent.type == "focus")
			{
				if (_self._tabStopReverse == true)
					_self._updateFocusElement(_self._findChildTabStopReverse(_self, null, null), true);
				else
					_self._updateFocusElement(_self._findChildTabStopForward(_self, null), true);
			}
			else if (_self._focusElement != null && browserEvent.type == "blur")
				_self._updateFocusElement(null, true);
		};		
		
	this._canvasKeyboardEventHandler = 
		function (browserEvent)
		{
			if (browserEvent.type == "keydown")
			{
				if (browserEvent.key == "Tab" && browserEvent.shiftKey == true)
					_self._tabStopReverse = true;
				else if (browserEvent.key == "Tab" && browserEvent.shiftKey == false)
					_self._tabStopReverse = false;
			}
		
			if (_self._focusElement != null)
			{
				var keyboardEvent = new ElementKeyboardEvent(browserEvent.type, 
											browserEvent.key, browserEvent.which, 
											browserEvent.ctrlKey, browserEvent.altKey, 
											browserEvent.shiftKey, browserEvent.metaKey);
				
				_self._focusElement.dispatchEvent(keyboardEvent);
				
				if (keyboardEvent._canceled == true || keyboardEvent._defaultPrevented == true)
					browserEvent.preventDefault();
				else if (browserEvent.type == "keydown" && keyboardEvent.getKey() == "Tab")
				{
					var tabStopElement = null;
					var currentParent = _self._focusElement;
					var lastParent = null;
					
					if (_self._tabStopReverse == false)
					{
						while (currentParent != null)
						{
							tabStopElement = _self._findChildTabStopForward(currentParent, lastParent);
							
							if (tabStopElement != null)
								break;
							
							lastParent = currentParent;
							currentParent = currentParent._parent;
						}
					}
					else //Tab backwards
					{
						while (currentParent != null)
						{
							tabStopElement = _self._findChildTabStopReverse(currentParent, lastParent, null);
							
							if (tabStopElement != null)
								break;
							
							lastParent = currentParent;
							currentParent = currentParent._parent;
						}
					}
					
					_self._updateFocusElement(tabStopElement, true);
					if (tabStopElement != null)
						browserEvent.preventDefault();
				}
			}
		};
	
	this._canvasMouseEventHandler = 
		function(browserEvent)
		{
			//Translate mouse to local position
			var mousePoint = CanvasManager.getLocalMousePos(browserEvent, _self._canvas);
			
			var i = 0;

			if (browserEvent.type == "mouseup")
			{
				window.removeEventListener('mouseup', _self._canvasMouseEventHandler);

				_self._clearDraggingElement();
				_self._mouseDownElement._mouseIsDown = false;

				//Start at mousedown target, record parents up to canvas manager, fix state.
				var parentChain = [];
				parentChain.push(_self._mouseDownElement);
				
				while (parentChain[parentChain.length - 1]._parent != null)
				{
					parentChain[parentChain.length - 1]._parent._mouseIsDown = false;
					parentChain.push(parentChain[parentChain.length - 1]._parent);
				}

				var clickElement = null;
				var clickPoint = {x:0, y:0};
				
				//Adjust mouse point for target element to dispatch mouseup
				for (i = parentChain.length - 1; i >= 0; i--) //Start at CanvasManager child, work down to target.
				{
					//Rotate the point backwards so we can translate the point to the element's rotated plane.
					parentChain[i].rotatePoint(mousePoint, true);
					
					//Adjust the mouse point to within this element rather than its position in parent.
					mousePoint.x = mousePoint.x - parentChain[i]._x;
					mousePoint.y = mousePoint.y - parentChain[i]._y;
					
					//Dispatch click if we're still over the target element.
					if (mousePoint.x >= 0 && 
						mousePoint.x <= parentChain[i]._width &&
						mousePoint.y >= 0 &&
						mousePoint.y <= parentChain[i]._height)
					{
						clickElement = parentChain[i];
						
						clickPoint.x = mousePoint.x;
						clickPoint.y = mousePoint.y;
					}
				}
				
				_self._mouseDownElement = null;

				//Dispatch mouseup
				parentChain[0].dispatchEvent(new ElementMouseEvent("mouseup", mousePoint.x, mousePoint.y));
				
				//Dispatch click if we're still over the target element.
				if (clickElement != null)
					clickElement.dispatchEvent(new ElementMouseEvent("click", clickPoint.x, clickPoint.y));
			}
			else if (browserEvent.type == "wheel")
			{
				//Mouse is disabled on CanvasManager
				if (_self.getStyle("MouseEnabled") == false || _self.getStyle("Visible") == false)
					return;
				
				var currentElement = null;
				
				if (mousePoint.x >= 0 && mousePoint.x <= _self._width &&
					mousePoint.y >= 0 && mousePoint.y <= _self._height)
				{
					currentElement = _self;
					
					var foundChild = false;
					while (true)
					{
						foundChild = false;
						for (i = currentElement._children.length -1; i >= 0; i--)
						{
							//Skip element if mouse is disabled or visibility is off.
							if (currentElement._children[i].getStyle("MouseEnabled") == false || 
								currentElement._children[i].getStyle("Visible") == false)
								continue;
							
							//Rotate the point backwards so we can translate the point to the element's rotated plane.
							currentElement._children[i].rotatePoint(mousePoint, true);
							
							if (mousePoint.x >= currentElement._children[i]._x && 
								mousePoint.x <= currentElement._children[i]._x + currentElement._children[i]._width &&
								mousePoint.y >= currentElement._children[i]._y &&
								mousePoint.y <= currentElement._children[i]._y + currentElement._children[i]._height)
							{
								currentElement = currentElement._children[i];
								
								//Adjust the mouse point to within this element rather than its position in parent.
								mousePoint.x = mousePoint.x - currentElement._x;
								mousePoint.y = mousePoint.y - currentElement._y;
								
								foundChild = true;
								break;
							}
							
							//Rotate forwards, we're not over this child, undo the rotation.
							currentElement._children[i].rotatePoint(mousePoint, false);
						}
						
						if (foundChild == false)
							break;
					}
				}
				
				if (currentElement != null)
				{
					var deltaX = 0;
					if (browserEvent.deltaX > 0)
						deltaX = 1;
					else if (browserEvent.deltaX < 0)
						deltaX = -1;
					
					var deltaY = 0;
					if (browserEvent.deltaY > 0)
						deltaY = 1;
					else if (browserEvent.deltaY < 0)
						deltaY = -1;
					
					var mouseWheelEvent = new ElementMouseWheelEvent(mousePoint.x, mousePoint.y, deltaX, deltaY);
					currentElement.dispatchEvent(mouseWheelEvent);
					
					if (mouseWheelEvent._canceled == true || mouseWheelEvent._defaultPrevented == true)
						browserEvent.preventDefault();
				}
			}
			else if (browserEvent.type == "mousedown")
			{
				//Kill focus if we're not over the canvas				
				if (mousePoint.x < 0 || mousePoint.x > this._width || 
					mousePoint.y < 0 || mousePoint.y > this._height)
				{
					_self._updateFocusElement(null, false);
					return;
				}
					
				//Mouse is disabled on CanvasManager
				if (_self.getStyle("MouseEnabled") == false || _self.getStyle("Visible") == false || _self._mouseDownElement != null)
					return;
				
				var draggingElement = null;
				var draggingOffset = {x:0, y:0};
				
				var focusElement = null;
				var focusElementTabStop = -1;
				var currentElementTabStop = -1;
				
				var currentElement = _self; 
				var foundChild = false;
				while (true)
				{
					currentElement._mouseIsDown = true;
					
					//Only allow dragging if we're not in a container, or an AnchorContainer
					if (currentElement.getStyle("Draggable") == true && 
						(currentElement._parent instanceof AnchorContainerElement || !(currentElement._parent instanceof ContainerBaseElement)))
					{
						draggingElement = currentElement;
						draggingOffset = {x:mousePoint.x, y:mousePoint.y};
					}
				
					currentElementTabStop = currentElement.getStyle("TabStop");
					if (currentElementTabStop >= 0 || focusElementTabStop < 0)
					{
						focusElement = currentElement;
						focusElementTabStop = currentElementTabStop;
					}
					
					foundChild = false;
					for (i = currentElement._children.length -1; i >= 0; i--)
					{
						//Skip element if mouse is disabled or visibility is off.
						if (currentElement._children[i].getStyle("MouseEnabled") == false || 
							currentElement._children[i].getStyle("Visible") == false)
							continue;
						
						//Rotate the point backwards so we can translate the point to the element's rotated plane.
						currentElement._children[i].rotatePoint(mousePoint, true);
						
						if (mousePoint.x >= currentElement._children[i]._x && 
							mousePoint.x <= currentElement._children[i]._x + currentElement._children[i]._width &&
							mousePoint.y >= currentElement._children[i]._y &&
							mousePoint.y <= currentElement._children[i]._y + currentElement._children[i]._height)
						{
							currentElement = currentElement._children[i];
							
							//Adjust the mouse point to within this element rather than its position in parent.
							mousePoint.x = mousePoint.x - currentElement._x;
							mousePoint.y = mousePoint.y - currentElement._y;
							
							foundChild = true;
							break;
						}
						
						//Rotate forwards, we're not over this child, undo the rotation.
						currentElement._children[i].rotatePoint(mousePoint, false);
					}
					
					if (foundChild == false)
						break;
				}

				_self._mouseDownElement = currentElement;
				window.addEventListener('mouseup', _self._canvasMouseEventHandler, false);
					
				if (draggingElement != null)
					_self._setDraggingElement(draggingElement, draggingOffset.x, draggingOffset.y);
				
				//Dispatch focus change before mouse event - implementor likely does not want "mousedown" before "focusout"
				_self._updateFocusElement(focusElement, false);
				
				currentElement.dispatchEvent(new ElementMouseEvent(browserEvent.type, mousePoint.x, mousePoint.y));
				
				//Always shut off focus ring (even if focus doesnt change)
				if (_self._focusElement != null)
					_self._focusElement._setRenderFocusRing(false);
			}
			else if (browserEvent.type == "mousemove")
			{
				//Mouse is disabled on CanvasManager
				if (_self.getStyle("MouseEnabled") == false)
					return;
				
				_self._mouseX = mousePoint.x;
				_self._mouseY = mousePoint.y;
				_self._rollOverInvalid = true;
				
				_self._updateCursor();
				
				//Adjust dragging element.
				if (_self._draggingElement != null)
				{
					//We use metrics relative to the parent of the element being dragged. We
					//want to keep the element within parent bounds even if its transformed (rotated).
					
					//Get drag element's metrics relative to its parent.
					var metrics = _self._draggingElement.getMetrics(_self._draggingElement._parent);
					
					//Get the drag offset relative to parent.
					var offset = {x: _self._draggingOffsetX, y: _self._draggingOffsetY};
					_self._draggingElement.translatePointTo(offset, _self._draggingElement._parent);
					
					//Get the mouse position relative to parent.
					var newPosition = {	x: mousePoint.x, y: mousePoint.y };
					_self.translatePointTo(newPosition, _self._draggingElement._parent);
					
					//Adjust mouse position for drag start offset.
					newPosition.x += metrics.getX() - offset.x;
					newPosition.y += metrics.getY() - offset.y;
					
					//Correct if we're out of bounds.
					if (newPosition.x < 0)
						newPosition.x = 0;
					if (newPosition.x > _self._draggingElement._parent._width - metrics.getWidth())
						newPosition.x = _self._draggingElement._parent._width - metrics.getWidth();
					if (newPosition.y < 0)
						newPosition.y = 0;
					if (newPosition.y > _self._draggingElement._parent._height - metrics.getHeight())
						newPosition.y = _self._draggingElement._parent._height - metrics.getHeight();
					
					//Set position relative to parent.
					_self._draggingElement._setRelativePosition(
							newPosition.x, 
							newPosition.y, 
							 _self._draggingElement._parent);
					
					//TODO: Can probably be smarter about this... Check style states
					if (_self._draggingElement._parent instanceof AnchorContainerElement)
					{
						if (_self._draggingElement.getStyle("RotateCenterX") == null || _self._draggingElement.getStyle("RotateCenterY") == null)
						{
							if (_self._draggingElement.getStyle("X") != null)
								_self._draggingElement.setStyle("X", newPosition.x);
							if (_self._draggingElement.getStyle("Y") != null)
								_self._draggingElement.setStyle("Y", newPosition.y);
						}
						else
						{
							if (_self._draggingElement.getStyle("X") != null)
								_self._draggingElement.setStyle("X", _self._draggingElement._x);
							if (_self._draggingElement.getStyle("Y") != null)
								_self._draggingElement.setStyle("Y", _self._draggingElement._y);
							
							_self._draggingElement.setStyle("RotateCenterX", _self._draggingElement._rotateCenterX);
							_self._draggingElement.setStyle("RotateCenterY", _self._draggingElement._rotateCenterY);
						}
					}
					
					//Dispatch dragging.
					_self._draggingElement.dispatchEvent(new ElementEvent("dragging", false));
				}
			}
		};
}

//Inherit from AnchorContainerElement
CanvasManager.prototype = Object.create(AnchorContainerElement.prototype);
CanvasManager.prototype.constructor = CanvasManager;
CanvasManager.base = AnchorContainerElement;	


/////////////Style Types///////////////////////////////

CanvasManager._StyleTypes = Object.create(null);

/**
 * @style ShowRedrawRegion boolean
 * 
 * When true the canvas redraw region will be displayed.
 */
CanvasManager._StyleTypes.ShowRedrawRegion = 								StyleableBase.EStyleType.NORMAL;		

/**
 * @style AlertModalClass CanvasElement
 * 
 * CanvasElement constructor to be used for the alert overlay. Defaults to CanvasElement.
 * This may be set to null if you do not wish to block interactivity with the underlying UI when
 * an alert is triggered. 
 */
CanvasManager._StyleTypes.AlertModalClass = 								StyleableBase.EStyleType.NORMAL;		

/**
 * @style AlertModalStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to the alert modal overlay.
 * Default definition sets BackgroundFill to "rgba(180,180,180,.4)".
 * If styled to be transparent, the modal element will still block user interactivity.
 */
CanvasManager._StyleTypes.AlertModalStyle = 								StyleableBase.EStyleType.SUBSTYLE;		


/////////////Default Styles///////////////////////////////

CanvasManager.AlertModalStyle = new StyleDefinition();
CanvasManager.AlertModalStyle.setStyle("BackgroundFill", 					"rgba(180,180,180,.4)");


CanvasManager.StyleDefault = new StyleDefinition();

CanvasManager.StyleDefault.setStyle("ShowRedrawRegion", 					false);							// true || false
CanvasManager.StyleDefault.setStyle("AlertModalClass", 						CanvasElement);
CanvasManager.StyleDefault.setStyle("AlertModalStyle", 						CanvasManager.AlertModalStyle);	



///////////////////CanvasManager Public Functions//////////////////////

/**
 * @function setCanvas
 * Sets the canvas that CanvasManager should manage.
 * 
 * @param canvas Canvas
 * Reference to the DOM canvas that CanvasManager should manage.
 */
CanvasManager.prototype.setCanvas = 
	function (canvas)
	{
		if (this._canvas == canvas)
			return;
	
		var addedOrRemoved = (this._canvas == null || canvas == null);
		
		//Clean up old canvas
		if (this._canvas != null)
		{
			window.removeEventListener('mousedown', this._canvasMouseEventHandler, false);
			window.removeEventListener('mousemove', this._canvasMouseEventHandler, false);
			window.removeEventListener("wheel", this._canvasMouseEventHandler, false);
			window.removeEventListener("keydown", this._canvasKeyboardEventHandler, false);
			window.removeEventListener("keyup", this._canvasKeyboardEventHandler, false);
			window.removeEventListener("resize", this._canvasResizeEventHandler, false);
			
			this._canvas.removeEventListener("focus", this._canvasFocusEventHandler, true);
			this._canvas.removeEventListener("blur", this._canvasFocusEventHandler, true);
			
			this._canvas = null;
			this._canvasContext = null;
		}

		if (canvas != null)
		{
			this._canvas = canvas;
			this._canvasContext = canvas.getContext("2d");
			
			window.addEventListener("mousedown", this._canvasMouseEventHandler, false);
			window.addEventListener("mousemove", this._canvasMouseEventHandler, false);
			window.addEventListener("wheel", this._canvasMouseEventHandler, false);
			window.addEventListener("keydown", this._canvasKeyboardEventHandler, false);
			window.addEventListener("keyup", this._canvasKeyboardEventHandler, false);
			window.addEventListener("resize", this._canvasResizeEventHandler, false);
			
			this._canvas.addEventListener("focus", this._canvasFocusEventHandler, true);
			this._canvas.addEventListener("blur", this._canvasFocusEventHandler, true);
					
			this._canvas.tabIndex = 1;
			this._canvas.style.outline = "none";
			this._canvas.style.cursor = "default";
			
			if (navigator.userAgent.indexOf("Firefox") > 0)
				CanvasElement._browserType = "Firefox";
			
			//Prevent double render frames if someone changes our associated canvas.
			if (this._canvasRenderFramePending == false)
			{
				this._canvasRenderFramePending = true;
				window.requestAnimationFrame(this._onCanvasFrame);	
			}
		}
		
		if (addedOrRemoved == true)
		{
			this._propagateChildData();
			this._processAddRemoveDisplayChainQueue();
		}
		
		if (this._canvas != null)
		{
			this._rollOverInvalid = true;
			this._canvasResizeEventHandler();
		}
	};

/**
 * @function getCanvas
 * Gets the DOM canvas reference CanvasManager is currently managing.
 * 
 * @returns Canvas
 * The DOM canvas reference CanvasManager is currently managing.
 */	
CanvasManager.prototype.getCanvas = 
	function ()
	{
		return this._canvas;
	};

/**
 * @function addAlert
 * Adds an element to be displayed as an alert. Only one alert may
 * be displayed at a time, subsequent will be queued and displayed in the
 * order they have been queued as previous alerts are removed. 
 * If an AlertModalClass style is set (defaults to CanvasElement), the modal 
 * element will be placed covering all content under the alert element.
 * 
 * @returns CanvasElement
 * The element supplied to addAlert().
 */		
CanvasManager.prototype.addAlert = 
	function (element)
	{
		this._alertQueue.push(element);
		
		if (this._alertQueue.length == 1)
		{
			if (this._alertModal != null)
				this.addElement(this._alertModal);
			
			this.addElement(element);
		}
		
		return element;
	};
	
/**
 * @function removeAlert
 * Removes an alert element. If this is the last alert, the modal
 * element will also be removed.
 * 
 * @param element CanvasElement
 * The element to remove from the alert list.
 * 
 * @returns CanvasElement
 * The element supplied to removeAlert() or null if invalid.
 */		
CanvasManager.prototype.removeAlert = 
	function (element)
	{
		var index = this._alertQueue.indexOf(element);
		if (index == -1)
			return null;
	
		this._alertQueue.splice(index, 1);
		
		//We removed the current alert
		if (index == 0)
		{
			this.removeElement(element);
			
			if (this._alertModal != null)
			{
				if (this._alertQueue.length == 0)
					this.removeElement(this._alertModal); //No more alerts, remove modal
				else
					this.setElementIndex(this._alertModal, this.getNumElements() - 1); //more alerts in queue, push modal to end
			}
			
			//Add next alert in queue
			if (this._alertQueue.length > 0)
				this.addElement(this._alertQueue[0]);
		}			
		
		return element;
	};
	
/**
 * @function setLocale
 * Sets the locale to be used when using localized strings. The actual
 * locale value is arbitrary, this simply dispatches an event to notify elements
 * that the locale has changed. Its up to implementors to store their locale strings
 * and update/lookup accordingly. CanvasManager defaults locale to "en-us". 
 * 
 * @param locale String
 * The locale to change too.
 */	
CanvasManager.prototype.setLocale = 
	function (locale)
	{
		if (this._currentLocale == locale)
			return;
		
		this._currentLocale = locale;
		
		if (this._broadcastDispatcher.hasEventListener("localechanged", null) == true)
			this._broadcastDispatcher.dispatchEvent(new DispatcherEvent("localechanged"));
	};
	
/**
 * @function getLocale
 * Gets CanvasManager's current locale.
 * 
 * @returns String
 * String representing CanvasManager's current locale.
 */	
CanvasManager.prototype.getLocale = 
	function ()
	{
		return this._currentLocale;
	};
	
/**
 * @function addCursor
 * Adds a cursor to be used when the mouse is over the canvas. Cursors are managed
 * as a priority chain. Element roll-over cursors use priority 0 so setting any explicit
 * cursor such as a busy cursor should use a priority higher than 0, unless you want Elements
 * to override the canvas cursor on roll-over.
 * 
 * @param cursorDefinition CursorDefinition
 * The cursor to add. This may be a custom CursorDefinition and CanvasManager will hide
 * the native browser cursor and render the custom cursor. It also may be a standard
 * browser CSS cursor String such as "text".
 * 
 * @param priority int
 * The priority to assign to the cursor. Higher priorities override lower priorities.
 * 
 * @returns Object
 * A "cursor instance" object that is to be used to remove the cursor.
 */	
CanvasManager.prototype.addCursor = 
	function (cursorDefinition, priority)
	{
		if (priority == null)
			priority = 0;
	
		if (cursorDefinition instanceof CursorDefinition)
		{
			if (cursorDefinition._addedCount == 0)
				cursorDefinition.addEventListener("stylechanged", this._onCursorDefinitionStyleChangedInstance);
				
			cursorDefinition._addedCount++;
		}
		
		var cursorInstance = new CmLinkedNode();
		cursorInstance.data = cursorDefinition;
		cursorInstance.priority = priority;
		
		var lastCursor = this._cursorChain.back;
		if (lastCursor == null)
			this._cursorChain.pushBack(cursorInstance);
		else
		{
			while (lastCursor != null && lastCursor.priority > cursorInstance.priority)
				lastCursor = lastCursor.prev;
			
			if (lastCursor == null)
				this._cursorChain.pushFront(cursorInstance);
			else
				this._cursorChain.insertAfter(cursorInstance, lastCursor);
		}
		
		this._updateCursor();
		
		return cursorInstance;
	};

/**
 * @function removeCursor
 * Removes a cursor via the cursor instance object returned by addCursor().
 * 
 * @param cursorInstance Object
 * The cursor instance Object returned by addCursor().
 */	
CanvasManager.prototype.removeCursor = 
	function (cursorInstance)
	{
		if (cursorDefinition instanceof CursorDefinition)
		{
			var cursorDefinition = cursorInstance.data;
			cursorDefinition._addedCount--;
				
			if (cursorDefinition._addedCount == 0)
				cursorDefinition.removeEventListener("stylechanged", this._onCursorDefinitionStyleChangedInstance);
		}

		this._cursorChain.removeNode(cursorInstance);
		this._updateCursor();
		
		return true;
	};	
	
/**
 * @function updateNow
 * This is an internal function and should conceivably *never* be called.
 * This forces a full pass of the component life cycle and is incredibly expensive.
 * The system calls this once per render frame with the only known exception being immediately after a canvas resize.
 * If you think you need to call this, you probably have a design problem.
 * Documentation added for unforeseen circumstances. 
 */	
CanvasManager.prototype.updateNow = 
	function ()
	{
		if (this._broadcastDispatcher.hasEventListener("enterframe", null) == true)
			this._broadcastDispatcher.dispatchEvent(new DispatcherEvent("enterframe"));
	
		//Process state updates.
		while (this._updateStylesQueue.length > 0 || 
				this._updateMeasureQueue.length > 0 || 
				this._updateLayoutQueue.length > 0 || 
				this._rollOverInvalid == true ||
				this._updateRenderQueue.length > 0)
		{
			//Process styles queue.
			while (this._updateStylesQueue.length > 0)
				this._updateStylesQueue.removeSmallest().data._validateStyles();
			
			//Process measure queue.
			while (this._updateMeasureQueue.length > 0 && 
					this._updateStylesQueue.length == 0)
			{
				this._updateMeasureQueue.removeLargest().data._validateMeasure();
			}
			
			//Process layout queue.
			while (this._updateLayoutQueue.length > 0 && 
					this._updateMeasureQueue.length == 0 && 
					this._updateStylesQueue.length == 0)
			{
				this._updateLayoutQueue.removeSmallest().data._validateLayout();
			}
			
			//Do rollover/rollout/mousemove
			if (this._rollOverInvalid == true && 
				this._updateLayoutQueue.length == 0 && 
				this._updateMeasureQueue.length == 0 && 
				this._updateStylesQueue.length == 0)
			{
				this._rollOverInvalid = false;
				
				var i;
				var currentElement = null;
				var mousePoint = {x: this._mouseX, y:this._mouseY};
				
				var lastRollOverTarget = this._rollOverElement;
				var lastRollOverX = this._rollOverX;
				var lastRollOverY = this._rollOverY;
				
				this._rollOverElement = null;
				
				var rollOverCommonParent = null;
				var rollOverElements = [];
				
				//Make sure we're over the canvas.				
				if (mousePoint.x >= 0 && mousePoint.x <= this._width &&
					mousePoint.y >= 0 && mousePoint.y <= this._height)
				{
					currentElement = this;
					if (currentElement._mouseIsOver == false)
					{
						rollOverElements.push(currentElement);
						currentElement._mouseIsOver = true;
					}
					else
						rollOverCommonParent = currentElement;
					
					this._rollOverElement = currentElement; 
					this._rollOverX = mousePoint.x;
					this._rollOverY = mousePoint.y;
					
					var foundChild = false;
					while (true)
					{
						foundChild = false;
						for (i = currentElement._children.length -1; i >= 0; i--)
						{
							//Skip element if mouse is disabled or not visible.
							if (currentElement._children[i].getStyle("MouseEnabled") == false ||
								currentElement._children[i].getStyle("Visible") == false)
								continue;
							
							//Rotate the point backwards so we can translate the point to the element's rotated plane.
							currentElement._children[i].rotatePoint(mousePoint, true);
							
							if (mousePoint.x >= currentElement._children[i]._x && 
								mousePoint.x <= currentElement._children[i]._x + currentElement._children[i]._width &&
								mousePoint.y >= currentElement._children[i]._y &&
								mousePoint.y <= currentElement._children[i]._y + currentElement._children[i]._height)
							{
								currentElement = currentElement._children[i];
								if (currentElement._mouseIsOver == false)
								{
									rollOverElements.push(currentElement);
									currentElement._mouseIsOver = true;
								}								
								else
									rollOverCommonParent = currentElement;
								
								//Adjust the mouse point to within this element rather than its position in parent.
								mousePoint.x = mousePoint.x - currentElement._x;
								mousePoint.y = mousePoint.y - currentElement._y;
								
								this._rollOverElement = currentElement;
								this._rollOverX = mousePoint.x;
								this._rollOverY = mousePoint.y;
								
								foundChild = true;
								break;
							}
							
							//Rotate forwards, we're not over this child, undo the rotation.
							currentElement._children[i].rotatePoint(mousePoint, false);
						}
						
						if (foundChild == false)
							break;
					}
				}

				if (currentElement != null && 
					(this._rollOverElement != lastRollOverTarget || 
					this._rollOverX != lastRollOverX || 
					this._rollOverY != lastRollOverY))
				{
					currentElement.dispatchEvent(new ElementMouseEvent("mousemove", mousePoint.x, mousePoint.y));
				}
				
				this._broadcastDispatcher.dispatchEvent(new ElementMouseEvent("mousemoveex", this._mouseX, this._mouseY));
				
				if (lastRollOverTarget != null && this._rollOverElement != lastRollOverTarget)
				{
					var rollOutElements = [];
					currentElement = lastRollOverTarget;
					while (currentElement != rollOverCommonParent)
					{
						currentElement._mouseIsOver = false;
						rollOutElements.push(currentElement);
						currentElement = currentElement._parent;
					}
					
					for (i = 0; i < rollOutElements.length; i++)
						rollOutElements[i].dispatchEvent(new ElementEvent("rollout", false));
				}
				
				for (i = 0; i < rollOverElements.length; i++)
					rollOverElements[i].dispatchEvent(new ElementEvent("rollover", false));
			}
			
			//Process render queue.
			while (this._updateRenderQueue.length > 0 && 
					this._rollOverInvalid == false &&
					this._updateLayoutQueue.length == 0 && 
					this._updateMeasureQueue.length == 0 && 
					this._updateStylesQueue.length == 0)
			{
				this._updateRenderQueue.removeSmallest().data._validateRender();
			}
		}
		
		//Update redraw region
		while (this._updateRedrawRegionQueue.length > 0)
			this._updateRedrawRegionQueue.removeSmallest().data._validateRedrawRegion(this._redrawRegionCachePool);
		
		this._redrawRegionCachePool.cleanup();
		
		//Update transform region
		while (this._updateTransformRegionQueue.length > 0)
			this._updateTransformRegionQueue.removeLargest().data._validateTransformRegion();
		
		//Render composite layers.
		while (this._compositeRenderQueue.length > 0)
			this._compositeRenderQueue.removeLargest().data._validateCompositeRender();
		
		//Render redraw region
		if (this._redrawRegionPrevMetrics != null)
			this._invalidateCompositeRender();
		
		if (this._broadcastDispatcher.hasEventListener("exitframe", null) == true)
			this._broadcastDispatcher.dispatchEvent(new DispatcherEvent("exitframe"));
	};

/////////////CanvasManager Static Public Functions///////////////	

/**
 * @function getLocalMousePos
 * @static
 * Translates browser mouse event coordinates to canvas relative coordinates.
 * The system automatically calls this and translates raw browser events to 
 * system events to be consumed by CanvasElements. You probably never need to call this.
 * 
 * @param event BrowserEvent
 * The browser mouse event.
 * 
 * @param canvas Canvas
 * The DOM Canvas reference to translate the mouse coordinates too.
 * 
 * @returns Object
 * A point object containing {x, y}.
 */	
CanvasManager.getLocalMousePos = 
	function (event, canvas)
	{
		//Reliable way to get position with canvas scaling.
		var rect = canvas.getBoundingClientRect();
		return {
			x: Math.round((event.clientX - rect.left) / (rect.right - rect.left) * canvas.width),
			y: Math.round((event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height)
		};
	};	

//////////////Internal Functions////////////////

//@override	
CanvasManager.prototype._updateCompositeCanvas = 
	function ()
	{
		if (this._compositeCanvas == null)
		{
			this._compositeCanvas = this._canvas;
			this._compositeCtx = this._canvasContext;
		}
		
		if (this._compositeCanvas.width != this._width || 
			this._compositeCanvas.height != this._height)
		{
			this._compositeCanvas.width = this._width;
			this._compositeCanvas.height = this._height;
			
			if (this._compositeCanvasMetrics == null)
				this._compositeCanvasMetrics = new DrawMetrics();
			
			this._compositeCanvasMetrics._x = 0;
			this._compositeCanvasMetrics._y = 0;
			this._compositeCanvasMetrics._width = this._width;
			this._compositeCanvasMetrics._height = this._height;
			
			//Expand the redraw region to this whole canvas.
			if (this._redrawRegionMetrics == null)
				this._redrawRegionMetrics = this._compositeCanvasMetrics.clone();
			else
				this._redrawRegionMetrics.mergeExpand(this._compositeCanvasMetrics);
		}
	};	
	
//@override (add redraw region visibility)	
CanvasManager.prototype._validateCompositeRender =
	function ()
	{
		if (this.getStyle("ShowRedrawRegion") == true)
		{
			var currentRegion = null;
			if (this._redrawRegionMetrics != null)
			{
				currentRegion = this._redrawRegionMetrics.clone();
				currentRegion._x -= 1;
				currentRegion._y -= 1;
				currentRegion._width += 2;
				currentRegion._height += 2;
				currentRegion.roundUp();
				
				//Expand the redraw region to this whole canvas.
				if (this._redrawRegionPrevMetrics != null)
					this._redrawRegionMetrics.mergeExpand(this._redrawRegionPrevMetrics);
			}
			else if (this._redrawRegionPrevMetrics != null)
				this._redrawRegionMetrics = this._redrawRegionPrevMetrics.clone();
			
			CanvasManager.base.prototype._validateCompositeRender.call(this);
			
			if (currentRegion != null)
			{
				this._canvasContext.lineWidth = 1;
				this._canvasContext.strokeStyle = "#FF0000";
				
				this._canvasContext.beginPath();
				this._canvasContext.moveTo(currentRegion._x + .5, currentRegion._y + .5);
				this._canvasContext.lineTo(currentRegion._x + currentRegion._width - .5, currentRegion._y + .5);
				this._canvasContext.lineTo(currentRegion._x + currentRegion._width - .5, currentRegion._y + currentRegion._height - .5);
				this._canvasContext.lineTo(currentRegion._x + .5, currentRegion._y + currentRegion._height - .5);
				this._canvasContext.closePath();
				this._canvasContext.stroke();	
			}
			
			this._redrawRegionPrevMetrics = currentRegion;
		}
		else
		{
			CanvasManager.base.prototype._validateCompositeRender.call(this);
			this._redrawRegionPrevMetrics = null;
		}
	};	
	
//@private	
CanvasManager.prototype._updateFocusElement = 
	function (newFocusElement, renderFocusRing)
	{
		if (newFocusElement != this._focusElement)
		{
			if (this._focusElement != null)
			{
				this._focusElement._isFocused = false;
				this._focusElement._setRenderFocusRing(false);
				
				if (this._focusElement.hasEventListener("focusout", null) == true)
					this._focusElement.dispatchEvent(new ElementEvent("focusout", false));
			}
			
			this._focusElement = newFocusElement;
			
			if (this._focusElement != null)
			{
				this._focusElement._isFocused = true;
				this._focusElement._setRenderFocusRing(renderFocusRing);
				
				if (this._focusElement.hasEventListener("focusin", null) == true)
					this._focusElement.dispatchEvent(new ElementEvent("focusin", false));
			}
		}
	};
	
//@private	
CanvasManager.prototype._findChildTabStopForward = 
	function (parent, afterChild)
	{
		var index = 0;
		if (afterChild != null)
			index = parent._children.indexOf(afterChild) + 1;
		
		var tabToElement = null;
		
		for (var i = index; i < parent._children.length; i++)
		{
			if (parent._children[i].getStyle("MouseEnabled") == false ||
				parent._children[i].getStyle("Visible") == false || 
				parent._children[i].getStyle("Enabled") == false)
				continue;
			
			if (parent._children[i].getStyle("TabStop") >= 0)
				return parent._children[i];
			
			tabToElement = this._findChildTabStopForward(parent._children[i], null);
			if (tabToElement != null)
				return tabToElement;
		}
		
		return tabToElement;
	};

//@private	
CanvasManager.prototype._findChildTabStopReverse = 
	function (parent, beforeChild, lastTabStopElement)
	{
		var index = parent._children.length - 1;
		if (beforeChild != null)
			index = parent._children.indexOf(beforeChild) - 1;
		
		for (var i = index; i >= 0; i--)
		{
			if (parent._children[i].getStyle("MouseEnabled") == false ||
				parent._children[i].getStyle("Visible") == false || 
				parent._children[i].getStyle("Enabled") == false)
				continue;
			
			if (parent._children[i].getStyle("TabStop") >= 0)
				lastTabStopElement = parent._children[i];
			
			this._findChildTabStopReverse(parent._children[i], null, lastTabStopElement);
			
			if (lastTabStopElement != null)
				return lastTabStopElement;
		}
		
		return lastTabStopElement;
	};	
	
//@private	
CanvasManager.prototype._updateCursor = 
	function ()
	{
		var cursorDefinition = null;
		if (this._cursorChain.back != null)
			cursorDefinition = this._cursorChain.back.data;
		
		var displayedCursorElement = null;
		if (this._cursorContainer._getNumChildren() > 0)
			displayedCursorElement = this._cursorContainer._getChildAt(0);
		
		if (cursorDefinition != null)
		{
			var cursorElement = null;
			if (!(typeof cursorDefinition === "string" || cursorDefinition instanceof String))
			{
				var cursorClass = cursorDefinition.getStyle("CursorClass");
				
				if (cursorClass == null)
					cursorDefinition._cursorElement = null;
				else
				{
					if (cursorDefinition._cursorElement == null || 
						cursorDefinition._cursorElement.constructor != cursorClass)
					{
						cursorDefinition._cursorElement = new (cursorClass)();
						cursorDefinition._cursorElement.setStyleDefinitions(cursorDefinition.getStyle("CursorStyle"));
					}
					else
						cursorDefinition._cursorElement.setStyleDefinitions(cursorDefinition.getStyle("CursorStyle"));
					
					cursorElement = cursorDefinition._cursorElement;
				}
			}
			
			if (displayedCursorElement != cursorElement)
			{
				if (displayedCursorElement != null)
					this._cursorContainer._removeChild(displayedCursorElement);
				if (cursorElement != null)
					this._cursorContainer._addChild(cursorElement);
			}
			
			if (cursorElement != null)
			{
				if (this._browserCursor != "none")
				{
					this._browserCursor = "none";
					this._canvas.style.cursor = "none";
				}
					
				//Make visible if we're over canvas			
				if (this._mouseX >= 0 && this._mouseX <= this._width &&
					this._mouseY >= 0 && this._mouseY <= this._height)
				{
					var cursorWidth = cursorDefinition._cursorElement._getStyledOrMeasuredWidth();
					var cursorHeight = cursorDefinition._cursorElement._getStyledOrMeasuredHeight();
					var offsetX = cursorDefinition.getStyle("CursorOffsetX");
					var offsetY = cursorDefinition.getStyle("CursorOffsetY");
					
					cursorElement._setActualPosition(this._mouseX + offsetX, this._mouseY + offsetY);
					cursorElement._setActualSize(cursorWidth, cursorHeight);
					cursorElement.setStyle("Visible", true);
				}
				else //Hide' mouse is no longer over canvas
					cursorElement.setStyle("Visible", false);
			}
			else if (this._browserCursor != cursorDefinition)
			{
				this._browserCursor = cursorDefinition;
				this._canvas.style.cursor = cursorDefinition;
			}
		}
		else
		{
			if (displayedCursorElement != null)
				this._cursorContainer._removeChildAt(0);
			
			if (this._browserCursor != "default")
			{
				this._browserCursor = "default";
				this._canvas.style.cursor = "default";
			}
		}
	};
	
//@private	
CanvasManager.prototype._onCursorDefinitionStyleChanged = 
	function (styleChangedEvent)
	{
		var cursorDefinition = styleChangedEvent.getTarget();
		
		var styleName = styleChangedEvent.getStyleName();
		if (styleName == "CursorClass" && cursorDefinition._cursorElement != null)
		{
			var cursorClass = cursorDefinition.getStyle("CursorClass");
			if (cursorDefinition._cursorElement.constructor != cursorClass)
				cursorDefinition._cursorElement = null;
		}
		if (styleName == "CursorStyle" && cursorDefinition._cursorElement != null)
			cursorDefinition._cursorElement.setStyleDefinitions(this.getStyle("CursorStyle"));
		
		this._updateCursor();
	};
	
//@private	
CanvasManager.prototype._pushAddRemoveDisplayChainQueue = 
	function (element, type)
	{
		var node = new CmLinkedNode();
		node.data = {element:element, type:type};
		
		this._addRemoveDisplayChainQueue.pushBack(node);
	};

//@private	
CanvasManager.prototype._popAddRemoveDisplayChainQueue = 
	function ()
	{
		if (this._addRemoveDisplayChainQueue.length == 0)
			return null;
		
		var data = this._addRemoveDisplayChainQueue.front.data;
		this._addRemoveDisplayChainQueue.removeNode(this._addRemoveDisplayChainQueue.front);
		
		return data;
	};

//@private	
CanvasManager.prototype._processAddRemoveDisplayChainQueue = 
	function ()
	{
		//Recursion guard. An event may add or remove other elements, we dont want this function to recurse.
		if (this._addRemoveDisplayChainQueueProcessing == true)
			return;
		
		//Block recursion
		this._addRemoveDisplayChainQueueProcessing = true;
		
		var addRemoveData = this._popAddRemoveDisplayChainQueue();
		while (addRemoveData != null)
		{
			addRemoveData.element.dispatchEvent(new AddedRemovedEvent(addRemoveData.type, this));
			addRemoveData = this._popAddRemoveDisplayChainQueue();
		}
		
		//Queue emtpy, allow processing again.
		this._addRemoveDisplayChainQueueProcessing = false;
	};

//@private	
CanvasManager.prototype._clearDraggingElement = 
	function ()
	{
		if (this._draggingElement == null)
			return;

		this._draggingElement = null;
		this._draggingOffsetX = null;
		this._draggingOffsetY = null;
	};

//@private	
CanvasManager.prototype._setDraggingElement = 
	function (element, offsetX, offsetY)
	{
		if (this._draggingElement != null)
			return;

		this._draggingElement = element;
		this._draggingOffsetX = offsetX;
		this._draggingOffsetY = offsetY;
	};
	
//@override	
CanvasManager.prototype._doStylesUpdated = 
	function (stylesMap)
	{
		CanvasManager.base.prototype._doStylesUpdated.call(this, stylesMap);
	
		var newModal = false;
		if ("AlertModalClass" in stylesMap)
		{
			var modalClass = this.getStyle("AlertModalClass");
			
			//Destroy if class is null or does not match existing
			if ((modalClass == null && this._alertModal != null) ||
				this._alertModal != null && this._alertModal.constructor != modalClass)
			{
				//Try to remove it (it may not be attached)
				this.removeElementAt(this.getElementIndex(this._alertModal));
				this._alertModal = null;
			}
			
			//Create
			if (modalClass != null && this._alertModal == null)
			{
				newModal = true;
				this._alertModal = new (modalClass)();
				this._alertModal.setStyle("IncludeInLayout", false); //Always false, we do this manually to prevent layout styles
				
				//Add behind first alert position
				if (this._alertQueue.length > 0)
					this.addElementAt(this._alertModal, this.getElementIndex(this._alertQueue[0]));
			}
		}
		
		if (this._alertModal != null && ("AlertModalStyle" in stylesMap || newModal == true))
			this._applySubStylesToElement("AlertModalStyle", this._alertModal);
	};
	
//@override	
CanvasManager.prototype._doLayout = 
	function (paddingMetrics)
	{
		CanvasManager.base.prototype._doLayout.call(this, paddingMetrics);
		
		this._alertModal._setActualSize(this._width, this._height);
		this._cursorContainer._setActualSize(this._width, this._height);
	};	



//////////Private Helper Classes////////////////////

function CmRedrawRegionCachePool()
{
	this.pointRawTl = {x:0, y:0};
	this.pointRawTr = {x:0, y:0};
	this.pointRawBr = {x:0, y:0};
	this.pointRawBl = {x:0, y:0};
	
	this.pointDrawableTl = {x:0, y:0};
	this.pointDrawableTr = {x:0, y:0};
	this.pointDrawableBr = {x:0, y:0};
	this.pointDrawableBl = {x:0, y:0};
	
	this.compositeMetrics = [];
	
	this.rawMetrics = new DrawMetrics();		
	this.drawableMetrics = new DrawMetrics();	
	this.clipMetrics = new DrawMetrics();
	this.shadowMetrics = new DrawMetrics();
};

CmRedrawRegionCachePool.prototype.cleanup = 
	function ()
	{
		this.compositeMetrics.length = 0;
	};

//Used exclusively by CanvasManager//

//Queue used for processing component cycles (styles, measure, layout) based on display chain depth.
function CmDepthQueue()
{
	this.depthArrayOfLists = []; //Array of CmLinkedList, index based on depth.
	this.length = 0;
	
	//Stores current start/end populated indexes of depthArrayOfLists for performance.
	this.minDepth = -1;
	this.maxDepth = -1;
}

CmDepthQueue.prototype.addNode = 
	function (node, depth)
	{
		var depthToIndex = depth - 1;
	
		if (this.depthArrayOfLists[depthToIndex] == null)
			this.depthArrayOfLists[depthToIndex] = new CmLinkedList();
		
		this.depthArrayOfLists[depthToIndex].pushBack(node);
		
		this.length = this.length + 1;
		
		if (depthToIndex < this.minDepth || this.minDepth == -1)
			this.minDepth = depthToIndex;
		if (depthToIndex > this.maxDepth)
			this.maxDepth = depthToIndex;
	};
	
CmDepthQueue.prototype.removeNode = 
	function (node, depth)
	{
		var depthToIndex = depth - 1; 
	
		this.depthArrayOfLists[depthToIndex].removeNode(node);
		
		this.length = this.length - 1;
		if (this.length == 0)
		{
			this.minDepth = -1;
			this.maxDepth = -1;
		}
	};
	
CmDepthQueue.prototype.removeSmallest = 
	function ()
	{
		if (this.length == 0)
			return null;
		
		for (var i = this.minDepth; i < this.depthArrayOfLists.length; i++)
		{
			this.minDepth = i;
			if (this.depthArrayOfLists[i] == null || this.depthArrayOfLists[i].length == 0)
				continue;
			
			var node = this.depthArrayOfLists[i].front;
			this.depthArrayOfLists[i].removeNode(node);
			
			this.length = this.length - 1;
			if (this.length == 0)
			{
				this.minDepth = -1;
				this.maxDepth = -1;
			}
			
			return node;
		}
	};
	
CmDepthQueue.prototype.removeLargest = 
	function ()
	{
		if (this.length == 0)
			return null;
		
		for (var i = this.maxDepth; i >= 0; i--)
		{
			this.maxDepth = i;
			if (this.depthArrayOfLists[i] == null || this.depthArrayOfLists[i].length == 0)
				continue;
			
			var node = this.depthArrayOfLists[i].back;
			this.depthArrayOfLists[i].removeNode(node);
			
			this.length = this.length - 1;
			if (this.length == 0)
			{
				this.minDepth = -1;
				this.maxDepth = -1;
			}
			
			return node;
		}
	};
	
//Basic linked list	
function CmLinkedList()
{
	this.front = null;
	this.back = null;
	
	this.length = 0;
}

CmLinkedList.prototype.pushFront = 
	function (cmLinkedNode)
	{
		this.length++;
		
		if (this.front == null)
		{
			cmLinkedNode.prev = null;
			cmLinkedNode.next = null;
			
			this.front = cmLinkedNode;
			this.back = cmLinkedNode;
		}
		else
		{
			cmLinkedNode.prev = null;
			cmLinkedNode.next = this.front;
			
			this.front.prev = cmLinkedNode;
			this.front = cmLinkedNode;
		}
	};
	
CmLinkedList.prototype.pushBack =
	function (cmLinkedNode)
	{
		this.length++;
	
		if (this.back == null)
		{
			cmLinkedNode.prev = null;
			cmLinkedNode.next = null;
			
			this.front = cmLinkedNode;
			this.back = cmLinkedNode;
		}
		else
		{
			cmLinkedNode.prev = this.back;
			cmLinkedNode.next = null;
			
			this.back.next = cmLinkedNode;
			this.back = cmLinkedNode;
		}
	};

CmLinkedList.prototype.insertBefore = 
	function (cmLinkedNode, beforeCmLinkedNode)	
	{
		this.length++;
		
		if (this.front == beforeCmLinkedNode)
			this.front = cmLinkedNode;
		
		if (beforeCmLinkedNode.prev != null)
			beforeCmLinkedNode.prev.next = cmLinkedNode;
		
		cmLinkedNode.prev = beforeCmLinkedNode.prev;
		cmLinkedNode.next = beforeCmLinkedNode;
		beforeCmLinkedNode.prev = cmLinkedNode;
	};

CmLinkedList.prototype.insertAfter = 
	function (cmLinkedNode, afterCmLinkedNode)
	{
		this.length++;
		
		if (this.back == afterCmLinkedNode)
			this.back = cmLinkedNode;
		
		if (afterCmLinkedNode.next != null)
			afterCmLinkedNode.next.prev = cmLinkedNode;
		
		cmLinkedNode.next = afterCmLinkedNode.next;
		cmLinkedNode.prev = afterCmLinkedNode;
		afterCmLinkedNode.next = cmLinkedNode;		
	};
	
CmLinkedList.prototype.removeNode = 
	function (cmLinkedNode)
	{
		if (cmLinkedNode == null)
			return null;
		
		this.length--;
		
		if (this.front == cmLinkedNode)
			this.front = cmLinkedNode.next;
		if (this.back == cmLinkedNode)
			this.back = cmLinkedNode.prev;
		
		if (cmLinkedNode.prev != null)
			cmLinkedNode.prev.next = cmLinkedNode.next;
		if (cmLinkedNode.next != null)
			cmLinkedNode.next.prev = cmLinkedNode.prev;
		
		cmLinkedNode.next = null;
		cmLinkedNode.prev = null;
	};
	
//Linked list iterator	
function CmLinkedNode()
{
	this.prev = null;
	this.next = null;
	
	this.data = null;
}


