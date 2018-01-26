
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
	
	this._redrawRegionInvalid = true;
	this._redrawRegionPrevMetrics = null;
	
	//Now call base
	CanvasManager.base.prototype.constructor.call(this);

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
			//Fix canvas manager size.
			_self.setStyle("Width", _self._canvas.clientWidth);
			_self.setStyle("Height", _self._canvas.clientHeight);
			_self._setActualSize(_self._canvas.clientWidth, _self._canvas.clientHeight);
			
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
				
				_self._focusElement._dispatchEvent(keyboardEvent);
				
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
				parentChain[0]._dispatchEvent(new ElementMouseEvent("mouseup", mousePoint.x, mousePoint.y));
				
				//Dispatch click if we're still over the target element.
				if (clickElement != null)
					clickElement._dispatchEvent(new ElementMouseEvent("click", clickPoint.x, clickPoint.y));
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
					currentElement._dispatchEvent(mouseWheelEvent);
					
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
				
				currentElement._dispatchEvent(new ElementMouseEvent(browserEvent.type, mousePoint.x, mousePoint.y));
				
				_self._updateFocusElement(focusElement, false);
				
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
					_self._draggingElement._dispatchEvent(new ElementEvent("dragging", false));
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
CanvasManager._StyleTypes.ShowRedrawRegion = 								{inheritable:false};		


/////////////Default Styles///////////////////////////////

CanvasManager.StyleDefault = new StyleDefinition();

CanvasManager.StyleDefault.setStyle("ShowRedrawRegion", 					false);		// true || false



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
			
			//Disable text selection cursor.
//			canvas.onselectstart = function () { return false; }; 
//			canvas.style.userSelect = "none";
//			canvas.style.webkitUserSelect = "none";
//			canvas.style.MozUserSelect = "none";
//			canvas.style.mozUserSelect = "none";
//			canvas.setAttribute("unselectable", "on"); // For IE and Opera

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
			this._broadcastDispatcher._dispatchEvent(new DispatcherEvent("localechanged"));
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
			this._broadcastDispatcher._dispatchEvent(new DispatcherEvent("enterframe"));
	
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
					currentElement._dispatchEvent(new ElementMouseEvent("mousemove", mousePoint.x, mousePoint.y));
				}
				
				this._broadcastDispatcher._dispatchEvent(new ElementMouseEvent("mousemoveex", this._mouseX, this._mouseY));
				
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
						rollOutElements[i]._dispatchEvent(new ElementEvent("rollout", false));
				}
				
				for (i = 0; i < rollOverElements.length; i++)
					rollOverElements[i]._dispatchEvent(new ElementEvent("rollover", false));
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
		
		if (this._redrawRegionInvalid == true)
		{
			this._validateRedrawRegion(this, false);
			this._redrawRegionInvalid = false;
		}
		
		//Render composite layers.
		while (this._compositeRenderQueue.length > 0)
			this._compositeRenderQueue.removeLargest().data._validateCompositeRender();
		
		//Render redraw region
		if (this._redrawRegionPrevMetrics != null)
			this._invalidateCompositeRender();
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

//@private (recursive function)	
CanvasManager.prototype._validateRedrawRegion = 
	function (element, forceRegionUpdate)
	{
		var newCompositeMetrics = [];
		var oldVisible = element._renderVisible;
		
		//Get new visibility
		var newVisible = true;
		if ((element._parent != null && element._parent._renderVisible == false) || 
			element.getStyle("Visible") == false || 
			element.getStyle("Alpha") <= 0)
		{
			newVisible = false;
		}
		
		//Composite effect on this element changed, we *must* update the region on ourself and all of our children.
		if (element._compositeEffectChanged == true)
			forceRegionUpdate = true;
		
		//Wipe out the composite metrics (rebuild as we recurse children if we're a composite layer)
		element._compositeVisibleMetrics = null;
		element._transformVisibleMetrics = null;
		element._transformDrawableMetrics = null;
		
		if ((element._renderChanged == true || element._graphicsClear == false) &&
			(oldVisible == true || newVisible == true))
		{
			var parent = element;
			var rawMetrics = element.getMetrics();		//Transformed via points up parent chain
			
			var drawableMetrics = rawMetrics.clone();	//Transformed via metrics up parent chain (recalculated each layer, expands, and clips)
			
			//Used for transforming the raw metrics up the parent chain.
			var pointRawTl = {x:rawMetrics._x, y:rawMetrics._y};
			var pointRawTr = {x:rawMetrics._x + rawMetrics._width, y:rawMetrics._y};
			var pointRawBr = {x:rawMetrics._x + rawMetrics._width, y:rawMetrics._y + rawMetrics._height};
			var pointRawBl = {x:rawMetrics._x, y:rawMetrics._y + rawMetrics._height};
			
			var pointDrawableTl = {x:0, y:0};
			var pointDrawableTr = {x:0, y:0};
			var pointDrawableBr = {x:0, y:0};
			var pointDrawableBl = {x:0, y:0};
			
			var minX = null;
			var maxX = null;
			var minY = null;
			var maxY = null;
			
			//Cached storage of previous metrics per composite parent.
			var oldMetrics = null;	//{element:element, metrics:DrawMetrics, drawableMetrics:DrawMetrics}
			
			var clipMetrics = new DrawMetrics();
			var shadowMetrics = new DrawMetrics();
			var shadowSize = 0;
			
			var drawableMetricsChanged = false;
			var rawMetricsChanged = false;
			
			//Walk up the parent chain invalidating the redraw region and updating _compositeVisibleMetrics
			while (parent != null)
			{
				//Apply clipping to drawable metrics (Always clip root manager)
				if (drawableMetrics != null && (parent == this || parent.getStyle("ClipContent") == true))
				{
					//Clip metrics relative to current element
					clipMetrics._x = 0;
					clipMetrics._y = 0;
					clipMetrics._width = parent._width;
					clipMetrics._height = parent._height;
					
					//Reduce drawable metrics via clipping metrics.
					drawableMetrics.mergeReduce(clipMetrics);
					
					//Kill metrics if completely clipped
					if (drawableMetrics._width <= 0 || drawableMetrics._height <= 0)
						drawableMetrics = null;
				}
				
				//Update redraw region, _compositeVisibleMetrics, and record new stored composite metrics.
				if (parent._isCompositeElement() == true)
				{
					oldMetrics = element._getCompositeMetrics(parent);
					
					if (drawableMetrics != null && newVisible == true && element._graphicsClear == false)
					{
						newCompositeMetrics.push({element:parent, metrics:rawMetrics.clone(), drawableMetrics:drawableMetrics.clone()});
						
						//Update composite parents visible metrics
						if (parent._compositeVisibleMetrics == null)
							parent._compositeVisibleMetrics = drawableMetrics.clone();
						else
							parent._compositeVisibleMetrics.mergeExpand(drawableMetrics);
					}
					else
						newMetrics = null;
					
					drawableMetricsChanged = true;
					if ((oldMetrics == null && drawableMetrics == null) ||
						(oldMetrics != null && drawableMetrics != null && oldMetrics.drawableMetrics.equals(drawableMetrics) == true))
					{
						drawableMetricsChanged = false;
					}
					
					rawMetricsChanged = true;
					if (oldMetrics != null && oldMetrics.metrics.equals(rawMetrics) == true)
					{
						rawMetricsChanged = false;
					}
					
					//Update the composite element's redraw region
					if (forceRegionUpdate == true || 			//Composite effect changed	
						element._renderChanged == true ||		//Render changed
						oldVisible != newVisible ||				//Visible changed
						drawableMetricsChanged == true ||		//Drawable region changed (clipping)
						rawMetricsChanged)						//Position changed
					{
						//If was visible, redraw old metrics
						if (oldVisible == true && oldMetrics != null)
							parent._updateRedrawRegion(oldMetrics.drawableMetrics);
						
						//Redraw new metrics
						if (newVisible == true)
							parent._updateRedrawRegion(drawableMetrics);
					}
				}				
				
				//Drawable metrics will be null if we've been completely clipped. No reason to do any more translation.
				if (drawableMetrics != null)
				{	//Fix current metrics so that we're now relative to our parent.
					
					//Update position
					
					//Drawable metrics////
					drawableMetrics._x += parent._x;
					drawableMetrics._y += parent._y;
					
					shadowSize = parent.getStyle("ShadowSize");
					
					//Expand metrics for shadow
					if (shadowSize > 0 && parent.getStyle("ShadowColor") != null)
					{
						//Copy drawable metrics
						shadowMetrics.copyFrom(drawableMetrics);
						
						//Create shadow position metrics
						shadowMetrics._width += (shadowSize * 2);
						shadowMetrics._height += (shadowSize * 2);
						shadowMetrics._x -= shadowSize;
						shadowMetrics._y -= shadowSize;
						shadowMetrics._x += parent.getStyle("ShadowOffsetX");
						shadowMetrics._y += parent.getStyle("ShadowOffsetY");
						
						//Merge the shadow metrics with the drawable metrics
						drawableMetrics.mergeExpand(shadowMetrics);
						
						//Handle transform
						if (CanvasElement.normalizeDegrees(parent._rotateDegrees) != 0)
						{
							//Transform drawable metrics/////////////
							pointDrawableTl.x = drawableMetrics._x;
							pointDrawableTl.y = drawableMetrics._y;
							
							pointDrawableTr.x = drawableMetrics._x + drawableMetrics._width;
							pointDrawableTr.y = drawableMetrics._y;
							
							pointDrawableBr.x = drawableMetrics._x + drawableMetrics._width;
							pointDrawableBr.y = drawableMetrics._y + drawableMetrics._height;
							
							pointDrawableBl.x = drawableMetrics._x;
							pointDrawableBl.y = drawableMetrics._y + drawableMetrics._height;
							
							parent.rotatePoint(pointDrawableTl, false);
							parent.rotatePoint(pointDrawableTr, false);
							parent.rotatePoint(pointDrawableBl, false);
							parent.rotatePoint(pointDrawableBr, false);
							
							minX = Math.min(pointDrawableTl.x, pointDrawableTr.x, pointDrawableBr.x, pointDrawableBl.x);
							maxX = Math.max(pointDrawableTl.x, pointDrawableTr.x, pointDrawableBr.x, pointDrawableBl.x);
							minY = Math.min(pointDrawableTl.y, pointDrawableTr.y, pointDrawableBr.y, pointDrawableBl.y);
							maxY = Math.max(pointDrawableTl.y, pointDrawableTr.y, pointDrawableBr.y, pointDrawableBl.y);
							
							drawableMetrics._x = minX;
							drawableMetrics._y = minY;
							drawableMetrics._width = maxX - minX;
							drawableMetrics._height = maxY - minY;
						}
						
						//Use drawable metrics as the new raw metrics (shadow uses context of parent applying shadow)
						rawMetrics.copyFrom(drawableMetrics);
						
						pointRawTl.x += rawMetrics._x;
						pointRawTl.y += rawMetrics._y;
						
						pointRawTr.x += rawMetrics._x + rawMetrics._width;
						pointRawTr.y += rawMetrics._y;
						
						pointRawBr.x += rawMetrics._x + rawMetrics._width;
						pointRawBr.y += rawMetrics._y + rawMetrics._height;
						
						pointRawBl.x += rawMetrics._x;
						pointRawBl.y += rawMetrics._y + rawMetrics._height;
					}
					else
					{
						//Raw metrics
						pointRawTl.x += parent._x;
						pointRawTl.y += parent._y;
						
						pointRawTr.x += parent._x;
						pointRawTr.y += parent._y;
						
						pointRawBr.x += parent._x;
						pointRawBr.y += parent._y;
						
						pointRawBl.x += parent._x;
						pointRawBl.y += parent._y;
						
						//Handle transform
						if (CanvasElement.normalizeDegrees(parent._rotateDegrees) != 0)
						{
							//Rotate raw metrics points
							parent.rotatePoint(pointRawTl, false);
							parent.rotatePoint(pointRawTr, false);
							parent.rotatePoint(pointRawBl, false);
							parent.rotatePoint(pointRawBr, false);
							
							//Transform drawable metrics/////////////
							pointDrawableTl.x = drawableMetrics._x;
							pointDrawableTl.y = drawableMetrics._y;
							
							pointDrawableTr.x = drawableMetrics._x + drawableMetrics._width;
							pointDrawableTr.y = drawableMetrics._y;
							
							pointDrawableBr.x = drawableMetrics._x + drawableMetrics._width;
							pointDrawableBr.y = drawableMetrics._y + drawableMetrics._height;
							
							pointDrawableBl.x = drawableMetrics._x;
							pointDrawableBl.y = drawableMetrics._y + drawableMetrics._height;
							
							parent.rotatePoint(pointDrawableTl, false);
							parent.rotatePoint(pointDrawableTr, false);
							parent.rotatePoint(pointDrawableBl, false);
							parent.rotatePoint(pointDrawableBr, false);
							
							minX = Math.min(pointDrawableTl.x, pointDrawableTr.x, pointDrawableBr.x, pointDrawableBl.x);
							maxX = Math.max(pointDrawableTl.x, pointDrawableTr.x, pointDrawableBr.x, pointDrawableBl.x);
							minY = Math.min(pointDrawableTl.y, pointDrawableTr.y, pointDrawableBr.y, pointDrawableBl.y);
							maxY = Math.max(pointDrawableTl.y, pointDrawableTr.y, pointDrawableBr.y, pointDrawableBl.y);
							
							drawableMetrics._x = minX;
							drawableMetrics._y = minY;
							drawableMetrics._width = maxX - minX;
							drawableMetrics._height = maxY - minY;
							/////////////////////////////////////
						}
						
						//Update transformed raw metrics
						minX = Math.min(pointRawTl.x, pointRawTr.x, pointRawBr.x, pointRawBl.x);
						maxX = Math.max(pointRawTl.x, pointRawTr.x, pointRawBr.x, pointRawBl.x);
						minY = Math.min(pointRawTl.y, pointRawTr.y, pointRawBr.y, pointRawBl.y);
						maxY = Math.max(pointRawTl.y, pointRawTr.y, pointRawBr.y, pointRawBl.y);
						
						rawMetrics._x = minX;
						rawMetrics._y = minY;
						rawMetrics._width = maxX - minX;
						rawMetrics._height = maxY - minY;
					}
					
					//Reduce the precision (random rounding errors at *very* high decimal points)
					rawMetrics.roundToPrecision(3);
					
					//Reduce drawable metrics via raw metrics.
					drawableMetrics.mergeReduce(rawMetrics);
					
					//Reduce the precision (random rounding errors at *very* high decimal points)
					drawableMetrics.roundToPrecision(3);
				}
				
				parent = parent._parent;
			}
		}
		
		element._compositeMetrics = newCompositeMetrics;
		element._renderVisible = newVisible;
		element._renderChanged = false;
		
		//Recurse children if we were or are visible.
		if (oldVisible == true || newVisible == true)
		{
			for (var i = 0; i < element._children.length; i++)
				this._validateRedrawRegion(element._children[i], forceRegionUpdate);
			
			if (element._isCompositeElement() == true)
				this._updateTransformMetrics(element);
		}
	};
	
CanvasManager.prototype._updateTransformMetrics = 
	function(compositeElement)
	{
		//No transform of root manager, or invisible layers.
		if (compositeElement == this || compositeElement._compositeVisibleMetrics == null)
			return;
		
		var pointTl = {x:0, y:0};
		var pointTr = {x:0, y:0};
		var pointBr = {x:0, y:0};
		var pointBl = {x:0, y:0};
		
		var minX = null;
		var maxX = null;
		var minY = null;
		var maxY = null;
		
		var shadowSize = 0;
		
		var parent = compositeElement;
		compositeElement._transformVisibleMetrics = compositeElement._compositeVisibleMetrics.clone();
		compositeElement._transformDrawableMetrics = compositeElement._compositeVisibleMetrics.clone();
		
		var clipMetrics = new DrawMetrics();
		var done = false;
		
		while (true)
		{
			if (compositeElement._transformDrawableMetrics != null && parent.getStyle("ClipContent") == true)
			{
				//Clip metrics relative to current element
				clipMetrics._x = 0;
				clipMetrics._y = 0;
				clipMetrics._width = parent._width;
				clipMetrics._height = parent._height;
				
				//Reduce drawable metrics via clipping metrics.
				compositeElement._transformDrawableMetrics.mergeReduce(clipMetrics);
				
				//Kill metrics if completely clipped
				if (compositeElement._transformDrawableMetrics._width <= 0 || compositeElement._transformDrawableMetrics._height <= 0)
				{
					compositeElement._transformDrawableMetrics = null;
					compositeElement._transformVisibleMetrics = null;
					
					return;
				}
			}
			
			if (done == true)
				break;
			
			compositeElement._transformVisibleMetrics._x += parent._x;
			compositeElement._transformVisibleMetrics._y += parent._y;
			
			compositeElement._transformDrawableMetrics._x += parent._x;
			compositeElement._transformDrawableMetrics._y += parent._y;

			shadowSize = parent.getStyle("ShadowSize");
			
			//Expand metrics for shadow
			if (shadowSize > 0 && parent.getStyle("ShadowColor") != null)
			{
				//Copy drawable metrics
				var shadowMetrics = compositeElement._transformDrawableMetrics.clone();
				
				//Create shadow position metrics
				shadowMetrics._width += (shadowSize * 2);
				shadowMetrics._height += (shadowSize * 2);
				shadowMetrics._x -= shadowSize;
				shadowMetrics._y -= shadowSize;
				shadowMetrics._x += parent.getStyle("ShadowOffsetX");
				shadowMetrics._y += parent.getStyle("ShadowOffsetY");
				
				//Merge the shadow metrics with the drawable metrics
				compositeElement._transformDrawableMetrics.mergeExpand(shadowMetrics);
			}
			
			if (CanvasElement.normalizeDegrees(parent._rotateDegrees) != 0)
			{
				//Transform visible
				pointTl.x = compositeElement._transformVisibleMetrics._x;
				pointTl.y = compositeElement._transformVisibleMetrics._y;
				
				pointTr.x = compositeElement._transformVisibleMetrics._x + compositeElement._transformVisibleMetrics._width;
				pointTr.y = compositeElement._transformVisibleMetrics._y;

				pointBr.x = compositeElement._transformVisibleMetrics._x + compositeElement._transformVisibleMetrics._width;
				pointBr.y = compositeElement._transformVisibleMetrics._y + compositeElement._transformVisibleMetrics._height;
				
				pointBl.x = compositeElement._transformVisibleMetrics._x;
				pointBl.y = compositeElement._transformVisibleMetrics._y + compositeElement._transformVisibleMetrics._height;
				
				parent.rotatePoint(pointTl, false);
				parent.rotatePoint(pointTr, false);
				parent.rotatePoint(pointBl, false);
				parent.rotatePoint(pointBr, false);
				
				minX = Math.min(pointTl.x, pointTr.x, pointBr.x, pointBl.x);
				maxX = Math.max(pointTl.x, pointTr.x, pointBr.x, pointBl.x);
				minY = Math.min(pointTl.y, pointTr.y, pointBr.y, pointBl.y);
				maxY = Math.max(pointTl.y, pointTr.y, pointBr.y, pointBl.y);
				
				compositeElement._transformVisibleMetrics._x = minX;
				compositeElement._transformVisibleMetrics._y = minY;
				compositeElement._transformVisibleMetrics._width = maxX - minX;
				compositeElement._transformVisibleMetrics._height = maxY - minY;
				
				compositeElement._transformVisibleMetrics.roundToPrecision(3);
				
				//Transform Drawable
				pointTl.x = compositeElement._transformDrawableMetrics._x;
				pointTl.y = compositeElement._transformDrawableMetrics._y;
				
				pointTr.x = compositeElement._transformDrawableMetrics._x + compositeElement._transformDrawableMetrics._width;
				pointTr.y = compositeElement._transformDrawableMetrics._y;
				
				pointBr.x = compositeElement._transformDrawableMetrics._x + compositeElement._transformDrawableMetrics._width;
				pointBr.y = compositeElement._transformDrawableMetrics._y + compositeElement._transformDrawableMetrics._height;
				
				pointBl.x = compositeElement._transformDrawableMetrics._x;
				pointBl.y = compositeElement._transformDrawableMetrics._y + compositeElement._transformDrawableMetrics._height;
				
				parent.rotatePoint(pointTl, false);
				parent.rotatePoint(pointTr, false);
				parent.rotatePoint(pointBl, false);
				parent.rotatePoint(pointBr, false);
				
				minX = Math.min(pointTl.x, pointTr.x, pointBr.x, pointBl.x);
				maxX = Math.max(pointTl.x, pointTr.x, pointBr.x, pointBl.x);
				minY = Math.min(pointTl.y, pointTr.y, pointBr.y, pointBl.y);
				maxY = Math.max(pointTl.y, pointTr.y, pointBr.y, pointBl.y);
				
				compositeElement._transformDrawableMetrics._x = minX;
				compositeElement._transformDrawableMetrics._y = minY;
				compositeElement._transformDrawableMetrics._width = maxX - minX;
				compositeElement._transformDrawableMetrics._height = maxY - minY;
				
				compositeElement._transformDrawableMetrics.roundToPrecision(3);
			}
			
			parent = parent._parent;
			
			if (parent._isCompositeElement() == true)
				done = true;
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
					this._focusElement._dispatchEvent(new ElementEvent("focusout", false));
			}
			
			this._focusElement = newFocusElement;
			
			if (this._focusElement != null)
			{
				this._focusElement._isFocused = true;
				this._focusElement._setRenderFocusRing(renderFocusRing);
				
				if (this._focusElement.hasEventListener("focusin", null) == true)
					this._focusElement._dispatchEvent(new ElementEvent("focusin", false));
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
			addRemoveData.element._dispatchEvent(new AddedRemovedEvent(addRemoveData.type, this));
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
	
//@Override	
CanvasManager.prototype._doLayout = 
function (paddingMetrics)
{
	CanvasManager.base.prototype._doLayout.call(this, paddingMetrics);
	
	this._cursorContainer._setActualSize(this._width, this._height);
};	



//////////Private Helper Classes////////////////////

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


