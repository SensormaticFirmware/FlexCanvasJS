
/**
 * @depends StyleableBase.js
 */

///////////////////////////////////////////////////////////////////////////	
///////////////////////CanvasElement///////////////////////////////////////	
	
/**
 * @class CanvasElement
 * @inherits StyleableBase
 * 
 * Base class for all Elements to be rendered to the Canvas by CanvasManager. 
 * CanvasElement supports all basic system functions for render-able objects such 
 * as the display chain hierarchy, user interactivity and events, 
 * style management, vector based rendering, etc. 
 * 
 * CanvasElement is the most basic type that can be added to CanvasManager and can be
 * used to automatically draw shapes or any custom rendering to the canvas.
 * 
 * 
 * @constructor CanvasElement 
 * Creates new CanvasElement instance.
 */

function CanvasElement()
{
	CanvasElement.base.prototype.constructor.call(this);
	
	//Proxy styles from a different element.
	this._styleProxy = null;
	
	//This is *not* class based defaults. Its a default version of _styleDefinition.
	//Used when the framework wants to apply a default definition that override class 
	//based default styles but *not* user applied styles.
	this._styleDefinitionDefaults = []; 
	
	//Assigned style definitions
	this._styleDefinitions = [];
	
	//Storage for the current background shape ShapeBase() per styling. We need to store a reference 
	//because we listen for style changed events and need to be able to remove the listener when
	//this is changed (via styles) or added/removed to display chain.
	this._backgroundShape = null;
	
	//Storage for the current background fill FillBase() per styling. We need to store a reference 
	//because we listen for style changed events and need to be able to remove the listener when
	//this is changed (via styles) or added/removed to display chain.
	this._backgroundFill = null;
	
	this._manager = null; //Canvas Manager reference
	this._displayDepth = 0; //Depth in display chain hierarchy
	
	//Event listeners for capture phase. (Only ElementEvent events support capture)
	this._captureListeners = Object.create(null);
	
	
	this._name = null;	//User defined identifier
	
	/**
	 * @member _x Number
	 * Read only - X position in pixels relative to this elements parent. This is not updated immediately, only
	 * after our parent has finished its layout phase.
	 */
	this._x = 0;
	
	/**
	 * @member _y Number
	 * Read only - Y position in pixels relative to this elements parent. This is not updated immediately, only
	 * after our parent has finished its layout phase will this be valid.
	 */
	this._y = 0;
	
	/**
	 * @member _width Number
	 * Read only - This element's actual width in pixels. This is not updated immediately, only
	 * after our parent has finished its layout phase will this be valid.
	 */
	this._width = 0;
	
	/**
	 * @member _height Number
	 * Read only - This element's actual height in pixels. This is not updated immediately, only
	 * after our parent has finished its layout phase will this be valid.
	 */
	this._height = 0;
	
	/**
	 * @member _measuredWidth Number
	 * Read only - This element's measured width in pixels. This is not updated immediately, only
	 * after this element has finished its measure phase will this be valid.
	 */
	this._measuredWidth = 0;
	
	/**
	 * @member _measuredHeight Number
	 * Read only - This element's measured height in pixels. This is not updated immediately, only
	 * after this element has finished its measure phase will this be valid.
	 */
	this._measuredHeight = 0;
	
	/**
	 * @member _mouseIsOver boolean
	 * Read only - true if the mouse is over this element, otherwise false.
	 */
	this._mouseIsOver = false;
	
	/**
	 * @member _mouseIsDown boolean
	 * Read only - true if the mouse is pressed on this element, otherwise false.
	 */
	this._mouseIsDown = false;
	
	/**
	 * @member _isFocused boolean
	 * Read only - true if this element currently has focus, otherwise false.
	 */
	this._isFocused = false;
	
	/**
	 * @member _rotateDegrees Number
	 * Read only - Degrees this element is rotated. This is not updated immediately, only
	 * after our parent has finished its layout phase will this be valid.
	 */
	this._rotateDegrees = 0;
	
	/**
	 * @member _rotateCenterX Number
	 * Read only - The X position relative to the element's parent this element is rotated around. This is not updated immediately, only
	 * after our parent has finished its layout phase will this be valid.
	 */
	this._rotateCenterX = 0;
	
	/**
	 * @member _rotateCenterY Number
	 * Read only - The Y position relative to the element's parent this element is rotated around. This is not updated immediately, only
	 * after our parent has finished its layout phase will this be valid.
	 */
	this._rotateCenterY = 0;
	
	/**
	 * @member _parent CanvasElement
	 * Read only - This elements parent element.
	 */
	this._parent = null; 	
	
	this._children = [];
	
	this._stylesInvalid = true;
	this._stylesInvalidMap = Object.create(null);	//Dirty map of changed styles for _doStylesChanged()
	this._stylesValidateNode = new CmLinkedNode();	//Reference to linked list iterator
	this._stylesValidateNode.data = this;
	
	this._measureInvalid = true;					//Dirty flag for _doMeasure()
	this._measureValidateNode = new CmLinkedNode();	//Reference to linked list iterator
	this._measureValidateNode.data = this;
	
	this._layoutInvalid = true;						//Dirty flag for _doLayout()
	this._layoutValidateNode = new CmLinkedNode(); 	//Reference to linked list iterator
	this._layoutValidateNode.data = this;
	
	this._renderInvalid = true;						//Dirty flag for _doRender()
	this._renderValidateNode = new CmLinkedNode();	//Reference to linked list iterator
	this._renderValidateNode.data = this;
	
	this._redrawRegionInvalid = true;						//Dirty flag for redraw region
	this._redrawRegionValidateNode = new CmLinkedNode();	//Reference to linked list iterator
	this._redrawRegionValidateNode.data = this;
	
	this._transformRegionValidateNode = new CmLinkedNode();
	this._transformRegionValidateNode.data = this;
	
	//Off screen canvas for rendering this element.
	this._graphicsCanvas = null;
	this._graphicsCtx = null;
	this._graphicsClear = true;					//Optimization, sometimes we may *have* a canvas, but its been cleared so no need to render.
	
	//Metrics used for redraw region relative to composite parents (and ourself if we're a composite layer).
	this._compositeMetrics = [];				//Array of {element:element, metrics:DrawMetrics, drawableMetrics:DrawMetrics}
	
	this._forceRegionUpdate = false;			//Flag set by validateRedrawRegion() when update required due to composite effect on composite parent.
	this._renderChanged = true;					//Dirty flag for redraw region set to true when _graphicsCanvas has been modified.
	this._renderVisible = false; 				//False if any element in the composite parent chain is not visible.	
	
	/////////Composite Rendering////////////////
	
	//Composite rendering is used for effects like shadow, alpha, and transformations which
	//require aggregating child renderings, then re-rendering with the desired effect.
	//When an element requires composite rendering, it and its children are rendered to _compositeCanvas,
	//then _compositeCanvas is rendered to the parent composite (or root canvas) and appropriate effects are applied.
	//These values are only populated when this element requires composite rendering.
	
	this._compositeRenderInvalid = false;
	this._compositeRenderValidateNode = new CmLinkedNode();
	this._compositeRenderValidateNode.data = this;
	
	this._compositeEffectChanged = true;
	
	//Pre-effect / transform. Utilizes re-draw regions when rendering.
	this._compositeVisibleMetrics = null;			//Visible area of the composite layer.																			
	this._redrawRegionMetrics = null;				//Region to redraw																								
	
	this._compositeCtx = null;						//Graphics context																								
	this._compositeCanvas = null;					//Off screen canvas for aggregate rendering of this + child renderings.											
	this._compositeCanvasMetrics = null;			//Metrics of the composite canvas. 																				
	
	//Post-effect / transform. 
	this._transformVisibleMetrics = null;			//Transformed _compositeVisibleMetrics
	this._transformDrawableMetrics = null;			//Transformed _compositeVisibleMetrics region after clipping is applied															
	////////////////////////////////////////////
	
	
	this._rollOverCursorInstance = null; 			//Reference to cursor list iterator for roll-over cursor.
	
	this._renderFocusRing = false;
	
	var _self = this;
	
	//Private event handlers, need instance for each element, proxy to prototype.
	this._onExternalStyleChangedInstance = 
		function (styleChangedEvent)
		{
			_self._onExternalStyleChanged(styleChangedEvent);
		};
	
	this._onBackgroundShapeStyleChangedInstance = 
		function (styleChangedEvent)
		{
			_self._onBackgroundShapeStyleChanged(styleChangedEvent);
		};
		
	this._onBackgroundFillStyleChangedInstance = 
		function (styleChangedEvent)
		{
			_self._onBackgroundFillStyleChanged(styleChangedEvent);
		};
		
	this._onCanvasElementAddedRemovedInstance = 
		function (addedRemovedEvent)
		{
			if (addedRemovedEvent.getType() == "added")
				_self._onCanvasElementAdded(addedRemovedEvent);
			else if (addedRemovedEvent.getType() == "removed")
				_self._onCanvasElementRemoved(addedRemovedEvent);
		};
		
	this._onCanvasElementCursorOverOutInstance = 
		function (elementEvent)
		{
			_self._updateRolloverCursorDefinition();
		};
		
		
	//Listen for added/removed to display chain. (Setup / Cleanup)	
	this.addEventListener("added", this._onCanvasElementAddedRemovedInstance);
	this.addEventListener("removed", this._onCanvasElementAddedRemovedInstance);
	
	
	//////////Dynamic Properties////////////////  //Added at runtime when required.
	
	///////DataRenderer/////////////
	
	/**
	 * @member _listData DataListData
	 * Read only - List data provided by parent DataList when acting as a DataRenderer
	 */
	//this._listData = any;
	
	/**
	 * @member _itemData Object
	 * Read only - Collection item associated with this DataRenderer
	 */
	//this._itemData = any;
	
	/**
	 * @member _listSelected Any
	 * Read only - DataRenderer selected state.
	 */
	//this._listSelected = any;
	
	////////////////////////////////
}

//Inherit from StyleableBase
CanvasElement.prototype = Object.create(StyleableBase.prototype);
CanvasElement.prototype.constructor = CanvasElement;
CanvasElement.base = StyleableBase;

//Style priority enum
CanvasElement.EStylePriorities = 
{
	INSTANCE:0,
	DEFINITION:1,
	PROXY:2,
	INHERITED:3,
	DEFAULT_DEFINITION:4,
	CLASS:5
};

////////////Events/////////////////////////////////////

/**
 * @event localechanged DispatcherEvent
 * @broadcast
 * Dispatched when CanvasManager's locale selection changes.
 * 
 * @event enterframe DispatcherEvent
 * @broadcast
 * Dispatched at the beginning of the frame before any life cycle processing begins.
 * 
 * @event exitframe DispatcherEvent
 * @broadcast
 * Dispatched at the end of the frame after life cycle processing ends.
 * 
 * @event mousemoveex ElementMouseEvent
 * @broadcast
 * Dispatched when the mouse moves anywhere, even outside of the browser window. Mouse coordinates are relative to CanvasManager.
 * 
 * @event resize DispatcherEvent
 * Dispatched when the element's size changes.
 * 
 * @event layoutcomplete DispatcherEvent
 * Typically an internal event. Dispatched when an element has completed its
 * layout phase. This is used when it is necessary to wait for an element to
 * finish its layout pass so things such as its PercentWidth calculation is complete.
 * This is very expensive and should only be used when absolutely necessary. Its usually
 * only needed when elements are not directly related via parent/child. 
 * For example, DropdownElement uses this to adjust the height of the dropdown popup
 * since we do not know how much height it will need until after it has finished layout.
 * 
 * @event measurecomplete DispatcherEvent
 * Typically an internal event. Dispatched when an element has completed its 
 * measure phase. This is used when it is necessary to wait for an element to
 * finish its measure pass so that its content size or _measuredSize calculation is complete.
 * This is very expensive and should only be used when absolutely necessary.  Its usually
 * only needed when elements are not directly related via parent/child.
 * For example, ViewportElement uses this to invoke a layout pass when its content child
 * changes _measuredSize. The Viewport uses an intermediate CanvasElement as a clipping container
 * for the content child, which does not measure children, so an event is needed to notify the Viewport.
 * 
 * @event keydown ElementKeyboardEvent
 * Dispatched when the element has focus and a key is pressed, repeatedly dispatched if the key is held down.
 * 
 * @event keyup ElementKeyboardEvent
 * Dispatched when the element has focus and a key is released.
 * 
 * @event mousedown ElementMouseEvent
 * Dispatched when the mouse is pressed over this element.
 * 
 * @event mouseup ElementMouseEvent
 * Dispatched when the mouse is released. Note that the mouse may not still be over the element.
 * 
 * @event click ElementMouseEvent
 * Dispatched when the mouse is pressed and released over the same element.
 * 
 * @event mousemove ElementMouseEvent
 * Dispatched when the mouse moves over this element.
 * 
 * @event wheel ElementMouseWheelEvent
 * Dispatched when the mouse wheel is rolled while over this element.
 * 
 * @event dragging ElementEvent
 * Dispatched when this element is moved due to it being dragged.
 * 
 * @event rollover ElementEvent
 * Dispatched when the mouse moves over this element.
 * 
 * @event rollout ElementEvent
 * Dispatched when the mouse moves outside of this element.
 * 
 * @event focusin ElementEvent
 * Dispatched when this element gains focus.
 * 
 * @event focusout ElementEvent
 * Dispatched when this element loses focus.
 * 
 * @event added AddedRemovedEvent
 * Dispatched when this element is added to the display hierarchy and becomes a descendant of CanvasManager. 
 * 
 * @event removed AddedRemovedEvent
 * Dispatched when this element is removed from the display hierarchy and is no longer a descendant of CanvasManager. 
 */


/////////////Style Types///////////////////////////////

CanvasElement._StyleTypes = Object.create(null);

//Rendering
/**
 * @style Visible boolean
 * 
 * When false the element will not be rendered.
 */
CanvasElement._StyleTypes.Visible = 				StyleableBase.EStyleType.NORMAL;		// true || false

/**
 * @style BorderType String
 * 
 * Determines the border type the CanvasElement should render. Allowable values are
 * "solid", "inset", "outset" or "none" / null. Note that borders are internal and drawn on the inside
 * of the elements bounding area.
 */
CanvasElement._StyleTypes.BorderType = 				StyleableBase.EStyleType.NORMAL;		// "none"/null || "solid" || "inset" || "outset"

/**
 * @style BorderColor String
 * 
 * Hex color value to be used when drawing the border. Format like "#FF0000" (red)
 */
CanvasElement._StyleTypes.BorderColor = 			StyleableBase.EStyleType.NORMAL;		// "#FF0000" or null

/**
 * @style BorderThickness Number
 * 
 * Thickness in pixels to be used when drawing the border. 
 */
CanvasElement._StyleTypes.BorderThickness = 		StyleableBase.EStyleType.NORMAL;		// number

/**
 * @style BackgroundFill FillBase
 * 
 * Fill to use when filling the background. May be any FillBase subclass instance, 
 * "color" string, or null for transparent. 
 */
CanvasElement._StyleTypes.BackgroundFill = 			StyleableBase.EStyleType.NORMAL;		// FillBase() || "#FF0000" || null

/**
 * @style ShadowSize Number
 * 
 * Size in pixels that the drop shadow should be rendered. Note that the drop shadow may be rendered
 * outside the elements bounding area. This will cause the element to be composite rendered.
 */
CanvasElement._StyleTypes.ShadowSize = 				StyleableBase.EStyleType.NORMAL;		// number

/**
 * @style ShadowOffsetX Number
 * 
 * X offset that the drop shadow will be rendered.
 */
CanvasElement._StyleTypes.ShadowOffsetX = 			StyleableBase.EStyleType.NORMAL;		// number

/**
 * @style ShadowOffsetY Number
 * 
 * Y offset that the drop shadow will be rendered.
 */
CanvasElement._StyleTypes.ShadowOffsetY = 			StyleableBase.EStyleType.NORMAL;		// number

/**
 * @style ShadowColor String
 * 
 * Hex color value to be used when drawing the drop shadow. This may be set to null and no
 * shadow will be rendered. Format like "#FF0000" (red)
 */
CanvasElement._StyleTypes.ShadowColor = 			StyleableBase.EStyleType.NORMAL;		// "#FF0000" or null

/**
 * @style Alpha Number
 * 
 * Alpha value to use when rendering this component. Allowable values are between 0 and 1 with
 * 0 being transparent and 1 being opaque. This causes the element to perform composite rendering
 * when a value between 1 and 0 is used.
 */
CanvasElement._StyleTypes.Alpha = 					StyleableBase.EStyleType.NORMAL;		// number

/**
 * @style ClipContent boolean
 * 
 * Determines if out of bounds rendering is allowed. If true the element will clip all rendering
 * and children's rendering to the elements bounding box. This style is inheritable for container elements.
 */
CanvasElement._StyleTypes.ClipContent = 			StyleableBase.EStyleType.NORMAL;		// number (true || false)

/**
 * @style SkinState String
 * 
 * This is an internal style used to toggle an element's current skin for different states such
 * as normal, mouse-over, mouse-down, etc. Its also commonly used by skin classes to identify their skin state.
 */
CanvasElement._StyleTypes.SkinState = 				StyleableBase.EStyleType.NORMAL;		// "state"

/**
 * @style BackgroundShape ShapeBase
 * 
 * Shape to be used when rendering the elements background. May be any ShapeBase subclass instance.
 */
CanvasElement._StyleTypes.BackgroundShape = 		StyleableBase.EStyleType.NORMAL;		// ShapeBase()

/**
 * @style FocusColor String
 * @inheritable
 * 
 * Hex color value to be used when drawing the elements focus indicator. Format "#FF0000" (Red). 
 * The focus indicator is only rendered when the element gains focus due to a tab stop.
 */
CanvasElement._StyleTypes.FocusColor = 				StyleableBase.EStyleType.INHERITABLE;			// color ("#000000")

/**
 * @style FocusThickness Number
 * @inheritable
 * 
 * Size in pixels that the focus ring should be rendered. Note that the focus ring is rendered
 * outside the elements bounding area.
 */
CanvasElement._StyleTypes.FocusThickness =			StyleableBase.EStyleType.INHERITABLE;			// number


//Layout
/**
 * @style Padding Number
 * 
 * Size in pixels that inner content should be spaced from the outer bounds of the element. 
 * Padding effects all sides of the element. Padding may be negative under certain circumstances like
 * expanding an inner child to allow border collapsing with its parent.
 */
CanvasElement._StyleTypes.Padding = 				StyleableBase.EStyleType.NORMAL;		// number

/**
 * @style PaddingTop Number
 * 
 * Size in pixels that inner content should be spaced from the upper bounds of the element. 
 * This will override the Padding style.
 */
CanvasElement._StyleTypes.PaddingTop = 				StyleableBase.EStyleType.NORMAL;		// number or null

/**
 * @style PaddingBottom Number
 * 
 * Size in pixels that inner content should be spaced from the lower bounds of the element. 
 * This will override the Padding style.
 */
CanvasElement._StyleTypes.PaddingBottom = 			StyleableBase.EStyleType.NORMAL;		// number or null

/**
 * @style PaddingLeft Number
 * 
 * Size in pixels that inner content should be spaced from the left most bounds of the element. 
 * This will override the Padding style.
 */
CanvasElement._StyleTypes.PaddingLeft = 			StyleableBase.EStyleType.NORMAL;		// number or null

/**
 * @style PaddingRight Number
 * 
 * Size in pixels that inner content should be spaced from the right most bounds of the element. 
 * This will override the Padding style.
 */
CanvasElement._StyleTypes.PaddingRight = 			StyleableBase.EStyleType.NORMAL;		// number or null


//Functional

/**
 * @style Enabled boolean
 * 
 * When false disables user interaction with the element.
 */
CanvasElement._StyleTypes.Enabled = 				StyleableBase.EStyleType.NORMAL;		// true || false

/**
 * @style MouseEnabled boolean
 * 
 * When false disables mouse events for the element.
 */
CanvasElement._StyleTypes.MouseEnabled = 			StyleableBase.EStyleType.NORMAL;		// true || false

/**
 * @style Draggable boolean
 * 
 * When true allows the element to be dragged by the user. This does not work for containers
 * that do not allow absolute positioning such as a ListContainer.
 */
CanvasElement._StyleTypes.Draggable = 				StyleableBase.EStyleType.NORMAL;		// true || false

/**
 * @style Cursor CursorDefinition
 * 
 * Specifies the cursor to be displayed when the mouse is over the element. A custom CursorDefinition
 * may be used or a browser type String ("text", "none", etc) may be used.
 */
CanvasElement._StyleTypes.Cursor = 					StyleableBase.EStyleType.NORMAL;		// CursorDefinition()

/**
 * @style TabStop int
 * 
 * Determines if an element can be focused using tab stops. -1 indicates the element cannot
 * take focus, 0 is default and the element will be focused in the order it appears in the display chain.
 * Numbers higher than 0 indicate a specific order to be used (not yet implemented).
 */
CanvasElement._StyleTypes.TabStop = 				StyleableBase.EStyleType.NORMAL;		// number


//Container Placement
/**
 * @style X Number
 * 
 * The X position the element should be rendered relative to its parent container. This only
 * works if the element is a child of an AnchorContainer.
 */
CanvasElement._StyleTypes.X =						StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style Y Number
 * 
 * The Y position the element should be rendered relative to its parent container. This only
 * works if the element is a child of an AnchorContainer.
 */
CanvasElement._StyleTypes.Y =						StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style Width Number
 * 
 * The Width the element should be rendered relative to its parent container. This only
 * works if the element is a child of a Container element.
 */
CanvasElement._StyleTypes.Width =					StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style Height Number
 * 
 * The Height the element should be rendered relative to its parent container. This only
 * works if the element is a child of a Container element.
 */
CanvasElement._StyleTypes.Height =					StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style Top Number
 * 
 * The distance the element should be positioned from the upper bounds of the parent container. 
 * This only works if the element is a child of an AnchorContainer. 
 */
CanvasElement._StyleTypes.Top =						StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style Left Number
 * 
 * The distance the element should be positioned from the left most bounds of the parent container. 
 * This only works if the element is a child of an AnchorContainer. 
 */
CanvasElement._StyleTypes.Left =					StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style Bottom Number
 * 
 * The distance the element should be positioned from the lower bounds of the parent container. 
 * This only works if the element is a child of an AnchorContainer. 
 */
CanvasElement._StyleTypes.Bottom =					StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style Right Number
 * 
 * The distance the element should be positioned from the right most bounds of the parent container. 
 * This only works if the element is a child of an AnchorContainer. 
 */
CanvasElement._StyleTypes.Right =					StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style PercentWidth Number
 * 
 * The percentage of available width the element should consume relative to its parent container. This only
 * works if the element is a child of a Container element. Note that percentage width is calculated
 * based on the available space left over *after* static sized elements considered. Percentages
 * are allowed to add to more than 100 and will consume all of the available space. For containers
 * like ListContainers, when percents add to more than 100 the elements will share the available space
 * per the ratio of percent vs total percent used so it is perfectly reasonable to set 3 elements all
 * to 100 and allow them to split the real-estate by 3.
 */
CanvasElement._StyleTypes.PercentWidth =			StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style PercentHeight Number
 * 
 * The percentage of available height the element should consume relative to its parent container. This only
 * works if the element is a child of a Container element. Note that percentage height is calculated
 * based on the available space left over *after* static sized elements considered. Percentages
 * are allowed to add to more than 100 and will consume all of the available space. For containers
 * like ListContainers, when percents add to more than 100 the elements will share the available space
 * per the ratio of percent vs total percent used so it is perfectly reasonable to set 3 elements all
 * to 100 and allow them to split the real-estate by 3.
 */
CanvasElement._StyleTypes.PercentHeight =			StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style MinWidth Number
 * 
 * The minimum width in pixels the element should consume. This only
 * works if the element is a child of a Container element.
 */
CanvasElement._StyleTypes.MinWidth =				StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style MinHeight Number
 * 
 * The minimum height in pixels the element should consume. This only
 * works if the element is a child of a Container element.
 */
CanvasElement._StyleTypes.MinHeight =				StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style MaxWidth Number
 * 
 * The maximum width in pixels the element should consume. This only
 * works if the element is a child of a Container element.
 */
CanvasElement._StyleTypes.MaxWidth =				StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style MaxHeight Number
 * 
 * The maximum height in pixels the element should consume. This only
 * works if the element is a child of a Container element.
 */
CanvasElement._StyleTypes.MaxHeight =				StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style HorizontalCenter Number
 * 
 * The distance in pixels from the horizontal center of the parent the element should be positioned.
 * Negative numbers indicate left of center, positive right of center. 
 * This only works if the element is a child of an AnchorContainer. 
 */
CanvasElement._StyleTypes.HorizontalCenter =		StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style VerticalCenter Number
 * 
 * The distance in pixels from the vertical center of the parent the element should be positioned.
 * Negative numbers indicate left of center, positive right of center. 
 * This only works if the element is a child of an AnchorContainer. 
 */
CanvasElement._StyleTypes.VerticalCenter =			StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style RotateDegrees Number
 * 
 * The number of degrees the element should be rotated (clockwise). When no RotateCenterX or
 * RotateCenterY is set, the element is rotated via its center point and rotated objects are
 * still positioned relative to their parent's coordinate plane after the transform has occurred.
 */
CanvasElement._StyleTypes.RotateDegrees = 			StyleableBase.EStyleType.NORMAL;		// number

/**
 * @style RotateCenterX Number
 * 
 * The X position of the parent container the element should be rotated around. 
 * This only works if the element is a child of an AnchorContainer. 
 */
CanvasElement._StyleTypes.RotateCenterX = 			StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style RotateCenterY Number
 * 
 * The Y position of the parent container the element should be rotated around. 
 * This only works if the element is a child of an AnchorContainer. 
 */
CanvasElement._StyleTypes.RotateCenterY = 			StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style IncludeInLayout boolean
 * 
 * When false, the element is no longer considered in the parent container's layout. 
 * Typically this is used in conjunction with Visible, however sometimes you may want to
 * hide an element, but still have it consume container space.
 */
CanvasElement._StyleTypes.IncludeInLayout = 		StyleableBase.EStyleType.NORMAL;		// true || false

/**
 * @style IncludeInMeasure boolean
 * 
 * When false, the element is no longer considered in the parent container's measurement. 
 * This is useful if you do not want containers to respect this child's measured size and/or
 * do not care if content is clipped, such as when using MinSize, MaxSize, and percent sizing together.
 * This also prevents the element's _doMeasure() function from running and forces a 0x0 measured size.
 * However, this will not prevent the "measurecomplete" event after this element finishes its measure phase.
 */
CanvasElement._StyleTypes.IncludeInMeasure = 		StyleableBase.EStyleType.NORMAL;		// true || false

/**
 * @style CompositeLayer boolean
 * 
 * When true, this element renders itself and all children to a single layer and is treated
 * by its parent as a single element when rendering.  This is necessary and automatically enabled
 * for styles like alpha where the component and all its children must be pre-rendered, and then 
 * re-rendered with the appropriate effect.  
 * 
 * This is very expensive but can also be very beneficial when used appropriately.  
 * For example, if you have an application with a scrolling or constantly changing background
 * thereby always causing a full screen redraw, its beneficial to make the layer on top of the
 * background a composite layer.  This effectively buffers the layer. Only the delta changes
 * will be drawn to the composite. Otherwise the entire display chain would have to be re-drawn 
 * when the background moves. This is memory intensive as it effectively duplicates the rendering
 * area. Composite elements/children changing will update the composite layer, then that region of the 
 * composite layer needs to be copied up to the parent, resulting in an additional buffer copy.
 */
CanvasElement._StyleTypes.CompositeLayer = 					StyleableBase.EStyleType.NORMAL;		//true || false

//Text
/**
 * @style TextStyle String
 * @inheritable
 * 
 * Determines the style to render text. Available values are "normal", "bold", "italic", and "bold italic".
 */
CanvasElement._StyleTypes.TextStyle =						StyleableBase.EStyleType.INHERITABLE;		// "normal" || "bold" || "italic" || "bold italic"


/**
 * @style TextDecoration String
 * @inheritable
 * 
 * Determines the text decoration used.  Available values are "none" or "underline".
 */
CanvasElement._StyleTypes.TextDecoration =					StyleableBase.EStyleType.INHERITABLE;		// "none" || null || "underline"

/**
 * @style TextFont String
 * @inheritable
 * 
 * Determines the font family to use when rendering text such as "Arial".
 */
CanvasElement._StyleTypes.TextFont =						StyleableBase.EStyleType.INHERITABLE;		// "Arial"

/**
 * @style TextSize int
 * @inheritable
 * 
 * Determines the size in pixels to render text.
 */
CanvasElement._StyleTypes.TextSize =						StyleableBase.EStyleType.INHERITABLE;		// number

/**
 * @style TextHorizontalAlign String
 * @inheritable
 * 
 * Determines alignment when rendering text. Available values are "left", "center", and "right".
 */
CanvasElement._StyleTypes.TextHorizontalAlign =						StyleableBase.EStyleType.INHERITABLE;		// "left" || "center" || "right"

/**
 * @style TextVerticalAlign String
 * @inheritable
 * 
 * Determines the baseline when rendering text. Available values are "top", "middle", or "bottom".
 */
CanvasElement._StyleTypes.TextVerticalAlign =					StyleableBase.EStyleType.INHERITABLE;  	// "top" || "middle" || "bottom"

/**
 * @style TextLinePaddingTop Number
 * @inheritable
 * 
 * Padding to apply to the top of each line of text. This also impacts the size of the highlight background.
 * This is useful when using strange fonts that exceed their typical vertical bounds.
 */
CanvasElement._StyleTypes.TextLinePaddingTop = 				StyleableBase.EStyleType.INHERITABLE;		// number

/**
 * @style TextLinePaddingBottom Number
 * @inheritable
 * 
 * Padding to apply to the bottom of each line of text. This also impacts the size of the highlight background.
 * This is useful when using strange fonts that exceed their typical vertical bounds.
 */
CanvasElement._StyleTypes.TextLinePaddingBottom = 			StyleableBase.EStyleType.INHERITABLE;		// number

/**
 * @style TextLineSpacing Number
 * @inheritable
 * 
 * Vertical line spacing in pixels.
 */
CanvasElement._StyleTypes.TextLineSpacing = 				StyleableBase.EStyleType.INHERITABLE;		// number

/**
 * @style TextColor String
 * @inheritable
 * 
 * Hex color value to be used when drawing text. Format like "#FF0000" (red)
 */
CanvasElement._StyleTypes.TextColor =						StyleableBase.EStyleType.INHERITABLE;		// "#000000"

/**
 * @style TextFillType String
 * @inheritable
 * 
 * Determines the fill type when rendering text. Available values are "fill" and "stroke".
 * Stroke draws a border around characters, while fill completely fills them.
 */
CanvasElement._StyleTypes.TextFillType =					StyleableBase.EStyleType.INHERITABLE;		// "fill" || "stroke"

/**
 * @style TextHighlightedColor String
 * @inheritable
 * 
 * Hex color value to be used when drawing highlighted text. Format like "#FF0000" (red)
 */
CanvasElement._StyleTypes.TextHighlightedColor = 			StyleableBase.EStyleType.INHERITABLE;		// color "#000000"

/**
 * @style TextHighlightedColor String
 * @inheritable
 * 
 * Hex color value to be used when drawing highlighted text background. Format like "#FF0000" (red)
 */
CanvasElement._StyleTypes.TextHighlightedBackgroundColor = 	StyleableBase.EStyleType.INHERITABLE;		// color "#000000"

/**
 * @style TextCaretColor String
 * @inheritable
 * 
 * Hex color value to be used when drawing blinking text caret. "#FF0000" (red)
 */
CanvasElement._StyleTypes.TextCaretColor = 					StyleableBase.EStyleType.INHERITABLE;		// color "#000000"

/**
 * @style PasswordMaskCharacter String
 * @inheritable
 * 
 * Character to use when masking a password field
 */
CanvasElement._StyleTypes.PasswordMaskCharacter = 			StyleableBase.EStyleType.INHERITABLE;		// "●"



/////////////Default Styles///////////////////////////////

CanvasElement.StyleDefault = new StyleDefinition();
//CanvasElement specific styles.
CanvasElement.StyleDefault.setStyle("Visible", 							true);
CanvasElement.StyleDefault.setStyle("BorderType", 						"none");
CanvasElement.StyleDefault.setStyle("BorderColor", 						"#000000");
CanvasElement.StyleDefault.setStyle("BorderThickness", 					1);
CanvasElement.StyleDefault.setStyle("BackgroundFill", 					null); 
CanvasElement.StyleDefault.setStyle("ShadowSize", 						0);
CanvasElement.StyleDefault.setStyle("ShadowOffsetX",					0);
CanvasElement.StyleDefault.setStyle("ShadowOffsetY",					0);
CanvasElement.StyleDefault.setStyle("ShadowColor",						"#000000");
CanvasElement.StyleDefault.setStyle("Alpha", 							1);
CanvasElement.StyleDefault.setStyle("ClipContent",						false);
CanvasElement.StyleDefault.setStyle("SkinState", 						"");
CanvasElement.StyleDefault.setStyle("BackgroundShape", 					null); 		//ShapeBase
CanvasElement.StyleDefault.setStyle("FocusColor", 						"#3333FF");	// color ("#000000")
CanvasElement.StyleDefault.setStyle("FocusThickness", 					1);			// number

CanvasElement.StyleDefault.setStyle("Padding", 							0); 		//Not necessary, just for completeness
CanvasElement.StyleDefault.setStyle("PaddingTop", 						0);
CanvasElement.StyleDefault.setStyle("PaddingBottom",					0);
CanvasElement.StyleDefault.setStyle("PaddingLeft", 						0);
CanvasElement.StyleDefault.setStyle("PaddingRight", 					0);

CanvasElement.StyleDefault.setStyle("Enabled", 							true);
CanvasElement.StyleDefault.setStyle("MouseEnabled", 					true);
CanvasElement.StyleDefault.setStyle("Draggable", 						false);
CanvasElement.StyleDefault.setStyle("Cursor", 							null);		// "browsertype" || CursorDefinition
CanvasElement.StyleDefault.setStyle("TabStop", 							-1);		// number

CanvasElement.StyleDefault.setStyle("X", 								null);
CanvasElement.StyleDefault.setStyle("Y", 								null);
CanvasElement.StyleDefault.setStyle("Width", 							null);
CanvasElement.StyleDefault.setStyle("Height", 							null);
CanvasElement.StyleDefault.setStyle("Top", 								null);
CanvasElement.StyleDefault.setStyle("Left", 							null);
CanvasElement.StyleDefault.setStyle("Bottom", 							null);
CanvasElement.StyleDefault.setStyle("Right", 							null);
CanvasElement.StyleDefault.setStyle("PercentWidth", 					null);
CanvasElement.StyleDefault.setStyle("PercentHeight", 					null);
CanvasElement.StyleDefault.setStyle("MinWidth", 						5);		
CanvasElement.StyleDefault.setStyle("MinHeight", 						5);
CanvasElement.StyleDefault.setStyle("MaxWidth", 						null);
CanvasElement.StyleDefault.setStyle("MaxHeight", 						null);
CanvasElement.StyleDefault.setStyle("HorizontalCenter", 				null);
CanvasElement.StyleDefault.setStyle("VerticalCenter", 					null);
CanvasElement.StyleDefault.setStyle("RotateDegrees", 					0);
CanvasElement.StyleDefault.setStyle("RotateCenterX", 					null);
CanvasElement.StyleDefault.setStyle("RotateCenterY", 					null);
CanvasElement.StyleDefault.setStyle("IncludeInLayout", 					true);
CanvasElement.StyleDefault.setStyle("IncludeInMeasure", 				true);
CanvasElement.StyleDefault.setStyle("CompositeLayer",					false);

CanvasElement.StyleDefault.setStyle("TextStyle", 						"normal");
CanvasElement.StyleDefault.setStyle("TextDecoration", 					null);
CanvasElement.StyleDefault.setStyle("TextFont", 						"Arial");
CanvasElement.StyleDefault.setStyle("TextSize", 						12);
CanvasElement.StyleDefault.setStyle("TextHorizontalAlign",				"left");
CanvasElement.StyleDefault.setStyle("TextVerticalAlign", 				"middle");
CanvasElement.StyleDefault.setStyle("TextLinePaddingTop", 				2);
CanvasElement.StyleDefault.setStyle("TextLinePaddingBottom", 			0);
CanvasElement.StyleDefault.setStyle("TextLineSpacing", 					0);
CanvasElement.StyleDefault.setStyle("TextColor", 						"#000000");
CanvasElement.StyleDefault.setStyle("TextFillType", 					"fill");
CanvasElement.StyleDefault.setStyle("TextHighlightedColor", 			"#000000");
CanvasElement.StyleDefault.setStyle("TextHighlightedBackgroundColor", 	"#CCCCCC");
CanvasElement.StyleDefault.setStyle("TextCaretColor", 					"#000000");
CanvasElement.StyleDefault.setStyle("PasswordMaskCharacter", 			"●");


///////////CanvasElement Public Functions///////////////////////////////

/**
 * @function addStyleDefinition
 * Adds a style definition to the end element's definition list. Styles in this definition
 * will override styles in previously added definitions (lower index). Instance styles, set 
 * using setStyle() will override all definition styles.
 * Adding style definitions to elements already attached to the display chain is expensive, 
 * for better performance add definitions before attaching the element via addElement()
 * 
 * @param styleDefinition StyleDefinition
 * The StyleDefinition to add and associate with the element.
 * 
 * @returns StyleDefinition
 * The style definition just added.
 */
CanvasElement.prototype.addStyleDefinition = 
	function (styleDefinition)
	{
		return this.addStyleDefinitionAt(styleDefinition, this._styleDefinitions.length);
	};
	
/**
 * @function addStyleDefinitionAt
 * Inserts a style definition to this elements definition list at the specified index.
 * Definitions with higher indexes (added later) are higher priority. Instance styles, set 
 * using setStyle() will override all definition styles. 
 * Adding style definitions to elements already attached to the display chain is expensive, 
 * for better performance add definitions before attaching the element via addElement()
 * 
 * @param styleDefinition StyleDefinition
 * StyleDefinition to be added to this elements definition list.
 * 
 * @param index int
 * The index to insert the style definition within the elements definition list.
 * 
 * @returns StyleDefinition
 * Returns StyleDefinition just added when successfull, null if the StyleDefinition could not
 * be added due to the index being out of range or other error.
 */	
CanvasElement.prototype.addStyleDefinitionAt = 
	function (styleDefinition, index)
	{
		return this._addStyleDefinitionAt(styleDefinition, index, false);
	};
	
	
/**
 * @function getStyleDefinitionIndex
 * Returns the index of the supplied style definition or -1 if the style definition
 * has not been added.
 * 
 * @param styleDefinition StyleDefinition
 * StyleDefinition to return associated index.
 * 
 * @returns int
 * Index of the StyleDefinition supplied via the styleDefinition parameter, or -1 if does not exist.
 */
CanvasElement.prototype.getStyleDefinitionIndex = 
	function (styleDefinition)
	{
		return this._styleDefinitions.indexOf(styleDefinition);
	};
	
/**
 * @function removeStyleDefinition
 * Removes the supplied style definition from the element's style chain.
 * 
 * @param styleDefinition StyleDefinition
 * The StyleDefinition to remove from the element.
 * 
 * @returns StyleDefinition
 * The style definition just removed, or null if the supplied style 
 * definition is not associated with this element.
 */	
CanvasElement.prototype.removeStyleDefinition = 
	function (styleDefinition)
	{
		var index = this._styleDefinitions.indexOf(styleDefinition);
		if (index == -1)
			return null;
	
		return this.removeStyleDefinitionAt(index);
	};
	
/**
 * @function removeStyleDefinitionAt
 * Removes the style definition from the elements definition list at the supplied index.
 * 
 * @param index int
 * Index to be removed.
 * 
 * @returns StyleDefinition
 * Returns the StyleDefinition just removed if successfull, null if the definition could
 * not be removed due it it not being in this elements definition list, or index out of range.
 */		
CanvasElement.prototype.removeStyleDefinitionAt = 
	function (index)
	{
		return this._removeStyleDefinitionAt(index, false);
	};
	
/**
 * @function clearStyleDefinitions
 * Removes all style definitions from the element. This is more efficient than
 * removing definitions one at a time.
 */		
CanvasElement.prototype.clearStyleDefinitions = 
	function ()
	{
		return this._setStyleDefinitions([], false);
	};
	
/**
 * @function setStyleDefinitions
 * Replaces the elements current style definition list. This is more effecient than removing or 
 * adding style definitions one at a time.
 * 
 * @param styleDefinitions StyleDefinition
 * May be a StyleDefinition, or an Array of StyleDefinition
 */
CanvasElement.prototype.setStyleDefinitions = 
	function (styleDefinitions)
	{
		return this._setStyleDefinitions(styleDefinitions, false);
	};
	

	
/**
 * @function getNumStyleDefinitions
 * Gets the number of style definitions associated with this element.
 * 
 * @returns int
 * The number of style definitions.
 */		
CanvasElement.prototype.getNumStyleDefinitions = 
	function ()
	{
		return this._getNumStyleDefinitions(false);
	};
	
/**
 * @function _getNumStyleDefinitions
 * Gets the number of style definitions or default definitions associated with this element.
 * 
 * @param isDefault bool
 * When true, returns the number of default definitions.
 * 
 * @returns int
 * The number of style definitions.
 */			
CanvasElement.prototype._getNumStyleDefinitions = 
	function (isDefault)
	{
		if (isDefault == true)
			return this._styleDefinitionDefaults.length;

		return this._styleDefinitions.length;
	};
	
/**
 * @function getStyleDefinitionAt
 * Gets the style definition at the supplied zero base index.
 * 
 * @param index int
 * Index of the style definition to return;
 * 
 * @returns StyleDefinition
 * The style defenition at the supplied index, or null if index is out of range. 
 */		
CanvasElement.prototype.getStyleDefinitionAt = 
	function (index)
	{
		return this._getStyleDefinitionAt(index, false);
	};
	
/**
 * @function getStyle
 * @override
 * 
 * Gets the style value for this element. When retrieving a style, CanvasElements look
 * through their associated style chain, at each step if undefined is returned, they look
 * at the next step until a non-undefined value is found.
 * 
 * 1) Instance - Styles set directly to the element via setStyle()
 * 2) StyleDefinitions - Styles associated via its assigned StyleDefinitions
 * 3) StyleProxy - If proxy element is assigned, move to proxy element and repeat steps 1-3
 * 4) Inheritable - If style is inheritable, move up to parent element and repeat steps 1-4
 * 5) Default styles
 * 
 * @seealso StyleProxy
 * @seealso StyleableBase
 * 
 * @param styleName String
 * String representing the style value to be returned.
 * 
 * @returns Any
 * Returns the associated style value if found, otherwise undefined.
 * 
 */
CanvasElement.prototype.getStyle = 
	function (styleName)
	{
		return CanvasElement.base.prototype.getStyle.call(this, styleName);
	};	
	
//@override
CanvasElement.prototype.getStyleData = 
	function (styleName)
	{
		//Create cache if does not exist.
		var styleCache = this._stylesCache[styleName];
		if (styleCache == null)
		{
			styleCache = {styleData:new StyleData(styleName), cacheInvalid:true};
			this._stylesCache[styleName] = styleCache;
		}
		
		//Check cache
		if (styleCache.cacheInvalid == false)
			return styleCache.styleData;
		
		styleCache.cacheInvalid = false;
		var styleData = styleCache.styleData;
		
		//Reset the cache data.
		styleData.value = undefined;
		
		//Check instance
		if (styleName in this._styleMap)
			styleData.value = this._styleMap[styleName];
		
		if (styleData.value !== undefined)
		{
			styleData.priority.length = 1;
			styleData.priority[0] = CanvasElement.EStylePriorities.INSTANCE;
			
			return styleData;
		}
		
		//Counters (priority depth)
		var ctr = 0;
		
		//Check definitions
		for (ctr = this._styleDefinitions.length - 1; ctr >= 0; ctr--)
		{
			styleData.value = this._styleDefinitions[ctr].getStyle(styleName);
			
			if (styleData.value !== undefined)
			{
				styleData.priority.length = 2;
				styleData.priority[0] = CanvasElement.EStylePriorities.DEFINITION;
				styleData.priority[1] = (this._styleDefinitions.length - 1) - ctr; //StyleDefinition depth
				
				return styleData;
			}
		}
		
		var thisStyleType = this._getStyleType(styleName);
		
		var styleType = null;
		var proxy = null;
		var ctr2 = 0;
		
		//Proxy / Inheritable not allowed for sub styles.
		if (thisStyleType != StyleableBase.EStyleType.SUBSTYLE)
		{
			//Check proxy
			proxy =	this._styleProxy;
			while (proxy != null)
			{
				styleType = proxy._proxyElement._getStyleType(styleName);
				
				//Proxy not allowed for sub styles.
				if (styleType == StyleableBase.EStyleType.SUBSTYLE)
					break;
				
				if ((styleType != null && styleName in proxy._proxyMap == false) ||		//Defined & not in proxy map
					(styleType == null && "_Arbitrary" in proxy._proxyMap == false)) 	//Not defined and no _Arbitrary flag
					break;
				
				//Check proxy instance
				if (styleName in proxy._proxyElement._styleMap)
					styleData.value = proxy._proxyElement._styleMap[styleName];
				
				if (styleData.value !== undefined)
				{
					styleData.priority.length = 3;
					styleData.priority[0] = CanvasElement.EStylePriorities.PROXY;		
					styleData.priority[1] = ctr;	//Proxy depth (chained proxies)
					styleData.priority[2] = CanvasElement.EStylePriorities.INSTANCE;	
					
					return styleData;
				}
				
				//Check proxy definitions
				for (ctr2 = proxy._proxyElement._styleDefinitions.length - 1; ctr2 >= 0; ctr2--)
				{
					styleData.value = proxy._proxyElement._styleDefinitions[ctr2].getStyle(styleName);
					
					if (styleData.value !== undefined)
					{
						styleData.priority.length = 4;
						styleData.priority[0] = CanvasElement.EStylePriorities.PROXY;
						styleData.priority[1] = ctr;	//Proxy depth (chained proxies)
						styleData.priority[2] = CanvasElement.EStylePriorities.DEFINITION;	
						styleData.priority[3] = (proxy._proxyElement._styleDefinitions.length - 1) - ctr2; //definition depth	
						
						return styleData;
					}
				}
				
				ctr++;
				proxy = proxy._proxyElement._styleProxy;
			}
			
			//Check inherited
			proxy = null;
			styleType = thisStyleType;
			var parent = this;
			
			ctr = 0;
			ctr2 = 0;
			var ctr3 = 0;
			
			while (styleType == StyleableBase.EStyleType.INHERITABLE)
			{
				parent = parent._parent;
				
				if (parent == null)
					break;
				
				//Check parent instance
				if (styleName in parent._styleMap)
					styleData.value = parent._styleMap[styleName];
				
				if (styleData.value !== undefined)
				{
					styleData.priority.length = 3;	
					styleData.priority[0] = CanvasElement.EStylePriorities.INHERITED;	
					styleData.priority[1] = ctr;	//Parent depth
					styleData.priority[2] = CanvasElement.EStylePriorities.INSTANCE;
									
					return styleData;
				}
				
				//Check style definitions
				for (ctr2 = parent._styleDefinitions.length - 1; ctr2 >= 0; ctr2--)
				{
					styleData.value = parent._styleDefinitions[ctr2].getStyle(styleName);
					
					if (styleData.value !== undefined)
					{
						styleData.priority.length = 4;
						styleData.priority[0] = CanvasElement.EStylePriorities.INHERITED;	
						styleData.priority[1] = ctr;	//Parent depth
						styleData.priority[2] = CanvasElement.EStylePriorities.DEFINITION;
						styleData.priority[3] = (parent._styleDefinitions.length - 1) - ctr2; //Definition depth	
						
						return styleData;
					}
				}
				
				//Check parent proxy
				proxy = parent._styleProxy;
				ctr2 = 0;
				while (proxy != null)
				{
					styleType = proxy._proxyElement._getStyleType(styleName);
					
					//Proxy not allowed for sub styles.
					if (styleType == StyleableBase.EStyleType.SUBSTYLE)
						break;
					
					if ((styleType != null && styleName in proxy._proxyMap == false) ||		//Defined & not in proxy map
						(styleType == null && "_Arbitrary" in proxy._proxyMap == false)) 	//Not defined and no _Arbitrary flag
						break;
					
					//Check proxy instance
					if (styleName in proxy._proxyElement._styleMap)
						styleData.value = proxy._proxyElement._styleMap[styleName];
					
					if (styleData.value !== undefined)
					{
						styleData.priority.length = 5;
						styleData.priority[0] = CanvasElement.EStylePriorities.INHERITED;		
						styleData.priority[1] = ctr;	//Parent depth
						styleData.priority[2] = CanvasElement.EStylePriorities.PROXY;		
						styleData.priority[3] = ctr2;	//Proxy depth (chained proxies)
						styleData.priority[4] = CanvasElement.EStylePriorities.INSTANCE;		
						
						return styleData;
					}
					
					//Check proxy definition
					for (ctr3 = proxy._proxyElement._styleDefinitions.length - 1; ctr3 >= 0; ctr3--)
					{
						styleData.value = proxy._proxyElement._styleDefinitions[ctr3].getStyle(styleName);
						
						if (styleData.value !== undefined)
						{
							styleData.priority.length = 6;
							styleData.priority[0] = CanvasElement.EStylePriorities.INHERITED;	
							styleData.priority[1] = ctr;	//Parent depth
							styleData.priority[2] = CanvasElement.EStylePriorities.PROXY;	
							styleData.priority[3] = ctr2;	//Proxy depth (chained proxies)
							styleData.priority[4] = CanvasElement.EStylePriorities.DEFINITION;
							styleData.priority[5] = (parent._styleDefinitions.length - 1) - ctr3; //Definition depth	
														
							return styleData;
						}
					}
	
					ctr2++;
					proxy = proxy._proxyElement._styleProxy;
				}
				
				ctr++;
				styleType = parent._getStyleType(styleName);
			}
		}
		
		//Check default definitions
		for (ctr = this._styleDefinitionDefaults.length - 1; ctr >= 0; ctr--)
		{
			styleData.value = this._styleDefinitionDefaults[ctr].getStyle(styleName);
			
			if (styleData.value !== undefined)
			{
				styleData.priority.length = 2;
				styleData.priority[0] = CanvasElement.EStylePriorities.DEFAULT_DEFINITION;
				styleData.priority[1] = (this._styleDefinitionDefaults.length - 1) - ctr; //StyleDefinition depth
				
				return styleData;
			}
		}
		
		//Check class
		styleData.priority.length = 1;
		styleData.value = this._getClassStyle(styleName);
		styleData.priority[0] = CanvasElement.EStylePriorities.CLASS;
		
		return styleData;		
	};
	
//@override	
CanvasElement.prototype.setStyle = 
	function (styleName, value)
	{
		var oldValue = undefined;
		if (styleName in this._styleMap)
			oldValue = this._styleMap[styleName];

		//No change
		if (oldValue === value)
			return;
		
		if (value === undefined)
			delete this._styleMap[styleName];
		else
			this._styleMap[styleName] = value;
		
		//Spoof a style changed event and pass it to _onExternalStyleChanged for normal handling
		this._onExternalStyleChanged(new StyleChangedEvent(styleName));
	};			

/**
 * @function getManager
 * Gets the CanvasManager currently associated with this element.
 * 
 * @returns CanvasManager
 * The CanvasManager currently associated with this element.
 */	
CanvasElement.prototype.getManager = 
	function ()
	{
		return this._manager;
	};

/**
 * @function setName
 * Sets an arbitrary name to this element. The system does not use this value,
 * it is for use by implementors if a way to differentiate elements is needed.
 * 
 * @param name String
 * A String to use as the element's name.
 */	
CanvasElement.prototype.setName = 
	function (name)
	{
		if (this._name == name)
			return false;
		
		this._name = name;
		return true;
	};
	
/**
 * @function getName
 * Gets the name associated with this element.
 * 
 * @returns String
 * The name associated with this element.
 */		
CanvasElement.prototype.getName = 
	function ()
	{
		return this._name;
	};
	
/**
 * @function getMouseIsDown
 * Gets the state of the mouse for this element.
 * 
 * @returns boolean
 * Returns true if the mouse is currently pressed, false otherwise.
 */		
CanvasElement.prototype.getMouseIsDown = 
	function()
	{
		return this._mouseIsDown;
	};	

/**
 * @function getParent
 * Gets this element's parent element.
 * 
 * @returns CanvasElement
 * This element's parent element.
 */		
CanvasElement.prototype.getParent = 
	function ()
	{
		return this._parent;
	};
	
/**
 * @function rotatePoint
 * Rotates a point point on this element's parent relative to this element's rotation transformation.
 * This is used to transform a point from the parent's coordinate plane to a child's coordinate plane or vice versa.
 * Typically you should use translatePointFrom() or translatePointTo() rather than rotatePoint().
 * 
 * @param point Object
 * Point object {x:0, y:0};
 * 
 * @param reverse boolean
 * When true, rotates a point on the parent's plane, to the childs plane. 
 * When false, rotates a point on the childs plane, to the parents plane.
 */	
CanvasElement.prototype.rotatePoint = 
	function (point, reverse)
	{
		if (this._rotateDegrees == 0)
			return;
		
		var radius = 
			Math.sqrt(
					(Math.abs(point.x - this._rotateCenterX) * Math.abs(point.x - this._rotateCenterX)) +
					(Math.abs(point.y - this._rotateCenterY) * Math.abs(point.y - this._rotateCenterY))
					);
		
		var degrees;
		if (reverse == false)
			degrees = 360 - this._rotateDegrees + CanvasElement.radiansToDegrees(Math.atan2(point.x - this._rotateCenterX, point.y - this._rotateCenterY));
		else
			degrees = 360 + this._rotateDegrees + CanvasElement.radiansToDegrees(Math.atan2(point.x - this._rotateCenterX, point.y - this._rotateCenterY));
			
		point.x = Math.sin(CanvasElement.degreesToRadians(degrees)) * radius + this._rotateCenterX;
		point.y = Math.cos(CanvasElement.degreesToRadians(degrees)) * radius + this._rotateCenterY;
	};

/**
 * @function translatePointFrom
 * Translates a point from an element to this element regardless of this element's transformation,
 * depth, or position in the display hierarchy. For example, you can call this to translate a point on
 * the canvas to the relative point on this element.
 * 
 * @param point Object
 * Point - object containing {x:0, y:0}.
 * 
 * @param relativeFromElement CanvasElement
 * The element that the supplied point is relative too.
 */	
CanvasElement.prototype.translatePointFrom = 
	function (point, relativeFromElement)
	{
		return relativeFromElement.translatePointTo(point, this);
	};

/**
 * @function translatePointTo
 * Translates a point from this element to another element regardless of this element's transformation,
 * depth, or position in the display hierarchy. For example, you can call this to translate a point on
 * this element to a point on the canvas.
 * 
 * @param point Object
 * Point - object containing {x:0, y:0}.
 * 
 * @param relativeToElement CanvasElement
 * The element to translate this element's point too.
 */		
CanvasElement.prototype.translatePointTo = 
	function (point, relativeToElement)
	{
		if (relativeToElement == null || relativeToElement == this)
			return false;
		
		if (this._manager == null || this._manager != relativeToElement._manager)
			return false;
		
		//Build up both parent chains so we can find common parent//
		////////////////////////////////////////////////////////////
		
		var commonParent = null;
		
		//We are a child of relativeElement
		var thisChain = [];
		thisChain.push(this);
		while (commonParent == null && thisChain[thisChain.length - 1]._parent != null)
		{
			if (thisChain[thisChain.length - 1]._parent == relativeToElement)
				commonParent = relativeToElement;
			else
				thisChain.push(thisChain[thisChain.length - 1]._parent);
		}
		
		//Relative element is a child of us.
		var relativeChain = [];
		if (commonParent == null)
		{
			relativeChain.push(relativeToElement);
			while (commonParent == null && relativeChain[thisChain.length - 1]._parent != null)
			{
				if (relativeChain[relativeChain.length - 1]._parent == this)
					commonParent = this;
				else
					relativeChain.push(relativeChain[relativeChain.length - 1]._parent);
			}
		}
		
		//Someone is doing something weird and we're not in each others direct chains so we have to translate up AND down.
		if (commonParent == null)
		{
			//We know we have the same canvas manager, so just keep popping both arrays till we find something different.
			while (thisChain[thisChain.length - 1] == relativeChain[relativeChain.length - 1])
			{
				commonParent = thisChain[thisChain.length - 1];
				
				thisChain.pop();
				relativeChain.pop();
			}
		}
		
		//Translate up to common parent.
		var currentParent = this;
		while (currentParent != null && currentParent != commonParent)
		{
			point.x += currentParent._x;
			point.y += currentParent._y;
			
			currentParent.rotatePoint(point, false);
			
			currentParent = currentParent._parent;
		}
		
		//Translate down to relativeElement
		for (var i = relativeChain.length - 1; i >= 0; i--)
		{
			//Rotate the point backwards so we can translate the point to the element's rotated plane.
			relativeChain[i].rotatePoint(point, true);
			
			//Adjust the mouse point to within this element rather than its position in parent.
			point.x -= relativeChain[i]._x;
			point.y -= relativeChain[i]._y;
		}
		
		return true;
	};
	
/**
 * @function translateMetricsFrom
 * Translates a DrawMetrics from another element's to this element regardless of this element's transformation,
 * depth, or position in the display hierarchy. 
 * 
 * @param metrics DrawMetrics
 * Metrics to transform from the relative to this element.
 * 
 * @param relativeFromElement CanvasElement
 * The element to translate the supplied metrics too. If relativeToElement equals
 * null or this, will return metrics the same as the supplied metrics.
 * 
 * @returns DrawMetrics
 * Translated DrawMetrics relative to the supplied element.
 */	
CanvasElement.prototype.translateMetricsFrom = 	
	function (metrics, relativeFromElement)
	{
		return relativeFromElement.translateMetricsTo(metrics, this);
	};
	
/**
 * @function translateMetricsTo
 * Translates a DrawMetrics from this element's to another element regardless of this element's transformation,
 * depth, or position in the display hierarchy. 
 * 
 * @param metrics DrawMetrics
 * Metrics to transform to from this element to the supplied relative element.
 * 
 * @param relativeToElement CanvasElement
 * The element to translate the supplied metrics too. If relativeToElement equals
 * null or this, will return metrics the same as the supplied metrics.
 * 
 * @returns DrawMetrics
 * Translated DrawMetrics relative to the supplied element.
 */	
CanvasElement.prototype.translateMetricsTo = 
	function (metrics, relativeToElement)
	{
		var translatedMetrics = new DrawMetrics();
		if (relativeToElement == null || relativeToElement == this)
		{
			translatedMetrics._x = metrics._x;
			translatedMetrics._y = metrics._y;
			translatedMetrics._width = metrics._width;
			translatedMetrics._height = metrics._height;
			
			return translatedMetrics;
		}

		if (this._manager == null || this._manager != relativeToElement._manager)
			return null;
		
		//Build up both parent chains so we can find common parent.
		var commonParent = null;
		
		//We are a child of relativeElement
		var thisChain = [];
		thisChain.push(this);
		while (commonParent == null && thisChain[thisChain.length - 1]._parent != null)
		{
			if (thisChain[thisChain.length - 1]._parent == relativeToElement)
				commonParent = relativeToElement;
			else
				thisChain.push(thisChain[thisChain.length - 1]._parent);
		}
		
		//Relative element is a child of us.
		var relativeChain = [];
		if (commonParent == null)
		{
			relativeChain.push(relativeToElement);
			while (commonParent == null && relativeChain[thisChain.length - 1]._parent != null)
			{
				if (relativeChain[relativeChain.length - 1]._parent == this)
					commonParent = this;
				else
					relativeChain.push(relativeChain[relativeChain.length - 1]._parent);
			}
		}
		
		//Someone is doing something weird and we're not in each others direct chains so we have to translate up AND down.
		if (commonParent == null)
		{
			//We know we have the same canvas manager, so just keep popping both arrays till we find something different.
			while (thisChain[thisChain.length - 1] == relativeChain[relativeChain.length - 1])
			{
				commonParent = thisChain[thisChain.length - 1];
				
				thisChain.pop();
				relativeChain.pop();
			}
		}
		
		var pointTl = {x:metrics._x, y:metrics._y};
		var pointTr = {x:metrics._x + metrics._width, y:metrics._y};
		var pointBr = {x:metrics._x + metrics._width, y:metrics._y + metrics._height};
		var pointBl = {x:metrics._x, y:metrics._y + metrics._height};
		
		//Translate up to common parent.
		var currentParent = this;
		while (currentParent != null && currentParent != commonParent)
		{
			pointTl.x += currentParent._x;
			pointTl.y += currentParent._y;
			
			pointTr.x += currentParent._x;
			pointTr.y += currentParent._y;
			
			pointBr.x += currentParent._x;
			pointBr.y += currentParent._y;
			
			pointBl.x += currentParent._x;
			pointBl.y += currentParent._y;
			
			currentParent.rotatePoint(pointTl, false);
			currentParent.rotatePoint(pointTr, false);
			currentParent.rotatePoint(pointBl, false);
			currentParent.rotatePoint(pointBr, false);
			
			currentParent = currentParent._parent;
		}
		
		//Translate down to relativeElement
		for (var i = relativeChain.length - 1; i >= 0; i--) 
		{
			//Rotate the point backwards so we can translate the point to the element's rotated plane.
			relativeChain[i].rotatePoint(pointTl, true);
			relativeChain[i].rotatePoint(pointTr, true);
			relativeChain[i].rotatePoint(pointBl, true);
			relativeChain[i].rotatePoint(pointBr, true);
			
			//Adjust the mouse point to within this element rather than its position in parent.
			pointTl.x -= relativeChain[i]._x;
			pointTl.y -= relativeChain[i]._y;
			
			pointTr.x -= relativeChain[i]._x;
			pointTr.y -= relativeChain[i]._y;
			
			pointBr.x -= relativeChain[i]._x;
			pointBr.y -= relativeChain[i]._y;
			
			pointBl.x -= relativeChain[i]._x;
			pointBl.y -= relativeChain[i]._y;
		}
		
		var minX = Math.min(pointTl.x, pointTr.x, pointBr.x, pointBl.x);
		var maxX = Math.max(pointTl.x, pointTr.x, pointBr.x, pointBl.x);
		var minY = Math.min(pointTl.y, pointTr.y, pointBr.y, pointBl.y);
		var maxY = Math.max(pointTl.y, pointTr.y, pointBr.y, pointBl.y);
		
		translatedMetrics._x = minX;
		translatedMetrics._y = minY;
		translatedMetrics._width = maxX - minX;
		translatedMetrics._height = maxY - minY;
		
		return translatedMetrics;
	};	
	
/**
 * @function getMetrics
 * Gets a DrawMetrics object containing the elements bounding box information
 * x, y, width, height, relative to the supplied element regardless of this element's transformation,
 * depth, or position in the display hierarchy. For example, you can call this get the elements width and height,
 * or to get this element's bounding box relative to the canvas or any other element.
 * 
 * @param relativeToElement CanvasElement
 * The element to translate this elements bounding box too. If relativeToElement equals
 * null or this, will return metrics relative to this element: {x:0, y:0, width:thisWidth, height:thisHeight}.
 * 
 * @returns DrawMetrics
 * DrawMetrics of this element relative to the supplied element.
 */	
CanvasElement.prototype.getMetrics = 
	function (relativeToElement)
	{
		if (relativeToElement == null)
			relativeToElement = this;
	
		if (this._manager == null || this._manager != relativeToElement._manager)
			return null;
	
		var metrics = new DrawMetrics();
		metrics._x = 0;
		metrics._y = 0;
		metrics._width = this._width;
		metrics._height = this._height;
		
		if (relativeToElement == this)
			return metrics;
		
		return this.translateMetricsTo(metrics, relativeToElement);
	};

//@Override
CanvasElement.prototype.addEventListener = 	
	function (type, callback)
	{
		CanvasElement.base.prototype.addEventListener.call(this, type, callback);
	
		//Broadcast events (dispatched only by manager)
		if ((type == "enterframe" || 
			type == "exitframe" ||
			type == "localechanged" || 
			type == "mousemoveex") &&
			this._manager != null)
		{
			this._manager._broadcastDispatcher.addEventListener(type, callback);
		}
		
		return true;
	};

//@Override	
CanvasElement.prototype.removeEventListener = 
	function (type, callback)
	{
		if (CanvasElement.base.prototype.removeEventListener.call(this, type, callback) == true)
		{
			//Broadcast events (dispatched only by manager)
			if ((type == "enterframe" || 
				type == "exitframe" ||
				type == "localechanged" || 
				type == "mousemoveex") &&
				this._manager != null)
			{
				this._manager._broadcastDispatcher.removeEventListener(type, callback);
			}
			
			return true;
		}
		
		return false;
	};	

	
////////////Capture Phase Event Listeners///////////////////////	
	
/**
 * @function addCaptureListener
 * Registers an event listener function to be called during capture phase.
 * 
 * @seealso ElementEvent
 * 
 * 
 * @param type String
 * String representing the event type.
 * 
 * @param callback Function
 * Function to be called when the event occurs.
 */	
CanvasElement.prototype.addCaptureListener = 
	function (type, callback)
	{
		if (this._captureListeners[type] == null)
			this._captureListeners[type] = [];
		
		this._captureListeners[type].push(callback);
		
		return true;
	};

/**
 * @function removeCaptureListener
 * Removes a capture event listener.
 * 
 * @seealso ElementEvent
 * 
 * 
 * @param type String
 * String representing the event type.
 * 
 * @param callback Function
 * Function callback to be removed.
 * 
 * @returns boolean
 * Returns true if the callback was successfully removed, otherwise false
 * such as if the function callback was not previously registered.
 */		
CanvasElement.prototype.removeCaptureListener = 
	function (type, callback)
	{
		if (!(type in this._captureListeners))
			return false;
	
		for (var i = 0; i < this._captureListeners[type].length; i++)
		{
			if (this._captureListeners[type][i] == callback)
			{
				this._captureListeners[type].splice(i, 1);
				return true;
			}
		}
		
		return false;
	};

/**
 * @function hasCaptureListener
 * Checks if an event capture listener has been registered with this CanvasElement
 * 
 * @seealso ElementEvent
 * 
 * 
 * @param type String
 * String representing the event type.
 * 
 * @param callback Function
 * Function callback to be called when the event occurs. This may be null to check
 * if the CanvasElement has any capture events registered for the provided type.
 * 
 * @returns boolean
 * Returns true if the CanvasElement has the provided capture callback registered for the 
 * provided type, or any capture callback for the provided type if the callback parameter is null.
 * Otherwise, returns false.
 */		
CanvasElement.prototype.hasCaptureListener = 
	function (type, callback)
	{
		if (!(type in this._captureListeners))
			return false;
	
		if (callback == null && this._captureListeners[type].length > 0)
			return true;
		
		for (var i = 0; i < this._captureListeners[type].length; i++)
		{
			if (this._captureListeners[type][i] == callback)
				return true;
		}
		
		return false;
	};	
	
/////////////CanvasElement Public Static Functions//////////////////

/**
 * @function adjustColorLight
 * @static
 * Adjusts supplied color brightness.
 * 
 * @param color String
 * Hex color value be adjusted. Format like "#FF0000" (red)
 * 
 * @param percent Number
 * Value between -1 and +1. -1 will return white. +1 will return black.
 * 
 * @returns String
 * Adjusted Hex color value.
 */
//Looks complicated... not really. Its using a percentage of the distance between black(neg) or white(pos) on all 3 channels independently.
CanvasElement.adjustColorLight = 
	function (color, percent) 
	{   
	    var f = parseInt(color.slice(1), 16);
	    var t = percent < 0 ? 0 : 255;
	    var p = percent < 0 ? percent * -1 : percent;
	    var R = f >> 16;
	    var G = f >> 8 & 0x00FF;
	    var B = f & 0x0000FF;
	    
	    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
	};
	
/**
 * @function cot
 * @static
 * Calculates the cotangent of supplied radians.
 * 
 * @param radians Number
 * Radians to calculate cotangent
 * 
 * @returns Number
 * Resulting cotangent from radians
 */
CanvasElement.cot = 
	function (radians)
	{
		return 1 / Math.tan(radians);
	};
	
/**
 * @function radiansToDegrees
 * @static
 * Calculates radians to degrees.
 * 
 * @param radians Number
 * Radians to be calculated to degrees.
 * 
 * @returns Number
 * Resulting degrees from supplied radians.
 */	
CanvasElement.radiansToDegrees = 
	function (radians)
	{
		return radians * (180 / Math.PI);
	};
	
/**
 * @function degreesToRadians
 * @static
 * Calculates degrees to radians.
 * 
 * @param degrees Number
 * Degrees to be calculated to degrees.
 * 
 * @returns Number
 * Resulting radians from supplied degrees.
 */		
CanvasElement.degreesToRadians = 
	function (degrees)
	{
		return degrees * (Math.PI / 180);
	};

/**
 * @function normalizeDegrees
 * @static
 * Adjusts degrees less than 0 or greater than 360 to corresponding degrees between 0 and 360. 
 * This is useful when rotating an element by increments.
 * 
 * @param value Number
 * Degrees to normalize.
 * 
 * @returns Number
 * Degrees between 0 and 360.
 */	
CanvasElement.normalizeDegrees = 
	function (value)
	{
		while (value >= 360)
			value = value - 360;
		while (value < 0)
			value = value + 360;
		
		return value;
	};	

/**
 * @function roundToPrecision
 * @static
 * Rounds a number to specified precision (decimal points).
 * 
 * @param value Number
 * Number to round.
 * 
 * @param precision int
 * Number of decimal points.
 * 
 * @returns Number
 * Rounded value.
 */	
CanvasElement.roundToPrecision = 
	function (value, precision)
	{
		if (precision == 0)
			return Math.round(value);
		
		var multiplier = Math.pow(10, precision);
		
		value = value * multiplier;
		value = Math.round(value);
		return value / multiplier;
	};
	
/////////////CanvasElement Internal Static Functions//////////////////	
	
CanvasElement._browserType = "";	
	
//Map of maps for character widths by font size/style. Some browsers render canvas text by pixel rather 
//than character width. For example, an uppercase "T" with a lowercase "e" next to it ("Te"), 
//the "e" will actually render overlapping the "T" since the "e" is not tall enough to collide with the top of the "T". 
//This doesnt work for word processing, we need to be able to identify each character so we measure and 
//store character widths here, and render all text on a character by character basis for consistency.
CanvasElement._characterWidthMap = Object.create(null); 

CanvasElement._characterFillBitmapMap = Object.create(null);
CanvasElement._characterStrokeBitmapMap = Object.create(null);

CanvasElement._measureCharBitmap = null;
CanvasElement._measureCharContext = null;
(	function () 
	{
		CanvasElement._measureCharBitmap = document.createElement("canvas");
		CanvasElement._measureCharBitmap.width = 1;
		CanvasElement._measureCharBitmap.height = 1;
		
		CanvasElement._measureCharContext = CanvasElement._measureCharBitmap.getContext("2d");
	}
)();

/**
 * @function _measureText
 * @static
 * Measures text on a character by character basis. Unfortunately, browsers will give
 * different widths for strings of text, than text measured character by character. It appears
 * text width changes depending on which characters are next to which characters. This behavior
 * cannot be used for text that requires highlighting or editing. This function records the character
 * width per font in a map, and then uses that map to measure text widths. This surprisingly turns out to be 
 * just as fast as measuring full text via the canvas context (since canvas sucks so bad at text rendering).
 * 
 * @param text String
 * The text string to measure.
 * 
 * @param fontString String
 * Font styling to use when measuring. Use _getFontString()
 * 
 * @returns Number
 * Width of the text as measured via characters.
 */
CanvasElement._measureText = 
	function (text, fontString)
	{
		var charMap = CanvasElement._characterWidthMap[fontString];
		if (charMap == null)
		{
			charMap = Object.create(null);
			CanvasElement._characterWidthMap[fontString] = charMap;
		}
		
		var result = 0;
		var charWidth = 0;
		var fontSet = false;
		
		for (var i = 0; i < text.length; i++)
		{
			charWidth = charMap[text[i]];
			if (charWidth == null)
			{
				if (fontSet == false) 
				{
					CanvasElement._measureCharContext.font = fontString;
					fontSet = true;
				}
				
				charWidth = Math.ceil(CanvasElement._measureCharContext.measureText(text[i]).width);
				charMap[text[i]] = charWidth;
			}
			
			result += charWidth;
		}
		
		return result;
	};

/**
 * @function _fillText
 * @static
 * Renders text on a character by character basis. Unfortunately, browsers will give
 * different widths for strings of text, than text measured character by character. It appears
 * text width changes depending on which characters are next to which characters. This behavior
 * cannot be used for text that requires highlighting or editing. This function records character
 * bitmaps per font in a map, and then uses that map to render characters. This surprisingly turns out to be 
 * just as fast as rendering full text via the canvas context (since canvas sucks so bad at text rendering).
 * 
 * @param ctx Canvas2DContext
 * The canvas context to render the text. 
 * 
 * @param text String
 * The text string to render.
 * 
 * @param x Number
 * The X coordinate to render the text.
 * 
 * @param y Number
 * The Y coordinate to render the text.
 * 
 * @param fontString String
 * Font styling to use when measuring. Use _getFontString()
 * 
 * @param color String
 * Hex color value to be used to render the text. Format like "#FF0000" (red).
 * 
 * @param baseline String
 * Text Y position relative to Y coordinate. ("top", "middle", or "bottom")
 */	
CanvasElement._fillText = 
	function (ctx, text, x, y, fontString, color, baseline)
	{
		//Firefox weirdly renders text higher than normal
		if (CanvasElement._browserType == "Firefox")
			y += 2;
	
		var bitmapMap = CanvasElement._characterFillBitmapMap[fontString];
		if (bitmapMap == null)
		{
			bitmapMap = Object.create(null);
			CanvasElement._characterFillBitmapMap[fontString] = bitmapMap;
		}
		
		var charWidth = 0;
		for (var i = 0; i < text.length; i++)
		{
			charWidth = CanvasElement._measureText(text[i], fontString);
			if (charWidth <= 0)
				continue;
			
			var bitmapAndContext = bitmapMap[text[i]];
			
			if (bitmapAndContext == null)
			{
				bitmapAndContext = {canvas:null, context:null, fontSize:0};
				bitmapMap[text[i]] = bitmapAndContext;
				
				bitmapAndContext.canvas = document.createElement("canvas");
				
				var fontSplit = fontString.split(" ");
				var fontSize = 0;
				for (var i2 = 0; i2 < fontSplit.length; i2++)
				{
					if (fontSplit[i2].length >= 3)
					{
						var pxString = fontSplit[i2].substr(fontSplit[i2].length - 2, 2);
						if (pxString == "px")
						{
							fontSize = Number(fontSplit[i2].substr(0, fontSplit[i2].length - 2));
							break;
						}
					}
				}
				
				bitmapAndContext.fontSize = fontSize;
				
				bitmapAndContext.canvas.height = fontSize + 4;
				bitmapAndContext.canvas.width = charWidth;
				
				bitmapAndContext.context = bitmapAndContext.canvas.getContext("2d");
				bitmapAndContext.context.font = fontString;
				bitmapAndContext.context.textBaseline = "middle";
				bitmapAndContext.context.textAlign = "left";
				bitmapAndContext.context.strokeStyle = "#000000";
				bitmapAndContext.context.fillStyle = "#000000";
				bitmapAndContext.context.fillText(text[i], 0, bitmapAndContext.canvas.height / 2);
				
				bitmapAndContext.context.globalCompositeOperation = "source-atop";
			}
			
			if (bitmapAndContext.context.fillStyle != color) 
			{
				bitmapAndContext.context.fillStyle = color;
				
				bitmapAndContext.context.beginPath();
				bitmapAndContext.context.moveTo(0, 0);
				bitmapAndContext.context.lineTo(bitmapAndContext.canvas.width, 0);
				bitmapAndContext.context.lineTo(bitmapAndContext.canvas.width, bitmapAndContext.canvas.height);
				bitmapAndContext.context.lineTo(0, bitmapAndContext.canvas.height);
				bitmapAndContext.context.closePath();
				
				bitmapAndContext.context.fill();
			}
			
			if (baseline == "top")
				ctx.drawImage(bitmapAndContext.canvas, x, Math.round(y - ((bitmapAndContext.canvas.height - bitmapAndContext.fontSize) / 2)));
			else if (baseline == "bottom")
				ctx.drawImage(bitmapAndContext.canvas, x, Math.round(y - (((bitmapAndContext.canvas.height - bitmapAndContext.fontSize) / 2) + bitmapAndContext.fontSize)));
			else //	"middle"
				ctx.drawImage(bitmapAndContext.canvas, x, Math.round(y - (bitmapAndContext.canvas.height / 2)));
			
			if (text.length == 1)
				return;
			
			x += charWidth;
		}
	};	
	
/**
 * @function _strokeText
 * @static
 * Renders text on a character by character basis. Unfortunately, browsers will give
 * different widths for strings of text, than text measured character by character. It appears
 * text width changes depending on which characters are next to which characters. This behavior
 * cannot be used for text that requires highlighting or editing. This function records character
 * bitmaps per font in a map, and then uses that map to render characters. This surprisingly turns out to be 
 * just as fast as rendering full text via the canvas context (since canvas sucks so bad at text rendering).
 * 
 * @param ctx Canvas2DContext
 * The canvas context to render the text. 
 * 
 * @param text String
 * The text string to render.
 * 
 * @param x Number
 * The X coordinate to render the text (Upper left).
 * 
 * @param y Number
 * The Y coordinate to render the text (Uppder left).
 * 
 * @param fontString String
 * Font styling to use when measuring. Use _getFontString()
 * 
 * @param color String
 * Hex color value to be used to render the text. Format like "#FF0000" (red).
 * 
 * @param baseline String
 * Text Y position relative to Y coordinate. ("top", "middle", or "bottom")
 */	
CanvasElement._strokeText = 
	function (ctx, text, x, y, fontString, color, baseline)
	{
		//Firefox weirdly renders text higher than normal
		if (CanvasElement._browserType == "Firefox")
			y += 2;
	
		var bitmapMap = CanvasElement._characterStrokeBitmapMap[fontString];
		if (bitmapMap == null)
		{
			bitmapMap = Object.create(null);
			CanvasElement._characterStrokeBitmapMap[fontString] = bitmapMap;
		}
		
		var charWidth = 0;
		for (var i = 0; i < text.length; i++)
		{
			charWidth = CanvasElement._measureText(text[i], fontString);
			if (charWidth <= 0)
				continue;
			
			var bitmapAndContext = bitmapMap[text[i]];
			
			if (bitmapAndContext == null)
			{
				bitmapAndContext = {canvas:null, context:null};
				bitmapMap[text[i]] = bitmapAndContext;
				
				bitmapAndContext.canvas = document.createElement("canvas");
				
				var fontSplit = fontString.split(" ");
				var fontSize = 0;
				for (var i2 = 0; i2 < fontSplit.length; i2++)
				{
					if (fontSplit[i2].length >= 3)
					{
						var pxString = fontSplit[i2].substr(fontSplit[i2].length - 2, 2);
						if (pxString == "px")
						{
							fontSize = Number(fontSplit[i2].substr(0, fontSplit[i2].length - 2));
							break;
						}
					}
						
				}
				
				bitmapAndContext.fontSize = fontSize;
				
				bitmapAndContext.canvas.height = fontSize + 4;
				bitmapAndContext.canvas.width = charWidth;
				
				bitmapAndContext.context = bitmapAndContext.canvas.getContext("2d");
				bitmapAndContext.context.font = fontString;
				bitmapAndContext.context.textBaseline = "middle";
				bitmapAndContext.context.textAlign = "left";
				bitmapAndContext.context.strokeStyle = "#000000";
				bitmapAndContext.context.fillStyle = "#000000";
				bitmapAndContext.context.strokeText(text[i], 0, bitmapAndContext.canvas.height / 2);
				
				bitmapAndContext.context.globalCompositeOperation = "source-atop";
			}
			
			if (bitmapAndContext.context.fillStyle != color) 
			{
				bitmapAndContext.context.fillStyle = color;
				
				bitmapAndContext.context.beginPath();
				bitmapAndContext.context.moveTo(0, 0);
				bitmapAndContext.context.lineTo(bitmapAndContext.canvas.width, 0);
				bitmapAndContext.context.lineTo(bitmapAndContext.canvas.width, bitmapAndContext.canvas.height);
				bitmapAndContext.context.lineTo(0, bitmapAndContext.canvas.height);
				bitmapAndContext.context.closePath();
				
				bitmapAndContext.context.fill();
			}
			
			if (baseline == "top")
				ctx.drawImage(bitmapAndContext.canvas, x, Math.round(y - ((bitmapAndContext.canvas.height - bitmapAndContext.fontSize) / 2)));
			else if (baseline == "bottom")
				ctx.drawImage(bitmapAndContext.canvas, x, Math.round(y - (((bitmapAndContext.canvas.height - bitmapAndContext.fontSize) / 2) + bitmapAndContext.fontSize)));
			else //	"middle"
				ctx.drawImage(bitmapAndContext.canvas, x, Math.round(y - (bitmapAndContext.canvas.height / 2)));
			
			if (text.length == 1)
				return;
			
			x += charWidth;
		}
	};		
	
/**
 * @function _calculateMinMaxPercentSizes
 * @static
 * Used to calculate size in pixels that percent sized elements should consume given
 * a supplied size in pixels. Populates .actualSize field on objects in supplied 
 * percentSizedObjects array. This function automatically rounds all sizes to the
 * nearest pixel to prevent anti-aliasing and fuzzy lines.
 * 
 * @param percentSizedObjects Array
 * Array of objects containing size data: {minSize:Number, maxSize:Number, percentSize:Number}
 * 
 * @param size Number
 * Available size in pixels.
 */
CanvasElement._calculateMinMaxPercentSizes = 
	function (percentSizedObjects, size)
	{
		if (percentSizedObjects.length == 0)
			return;
	
		var percentObjects = percentSizedObjects.slice();
		var availableSize = size;
		var totalPercentUsed = 0;
		var i;
		
		//Fix values, record total percent used.
		for (i = 0; i < percentObjects.length; i++)
		{
			if (percentObjects[i].minSize == null)
				percentObjects[i].minSize = 0;
			if (percentObjects[i].maxSize == null)
				percentObjects[i].maxSize = Number.MAX_VALUE;
			if (percentObjects[i].percentSize == null)
				percentObjects[i].percentSize = 100;
			
			totalPercentUsed += percentObjects[i].percentSize;
		}
		
		//Size all percent sized elements.
		var done = false;
		while (done == false)
		{
			var size = 0;
			done = true;
			
			for (i = 0; i < percentObjects.length; i++)
			{
				size = availableSize * (percentObjects[i].percentSize / totalPercentUsed);
				if (size > percentObjects[i].maxSize)
				{
					percentObjects[i].actualSize = percentObjects[i].maxSize;
					totalPercentUsed -= percentObjects[i].percentSize;
					availableSize -= percentObjects[i].maxSize;
					
					percentObjects.splice(i, 1);
					done = false;
					break;
				}
				else if (size < percentObjects[i].minSize)
				{
					percentObjects[i].actualSize = percentObjects[i].minSize;
					totalPercentUsed -= percentObjects[i].percentSize;
					availableSize -= percentObjects[i].minSize;
					
					percentObjects.splice(i, 1);
					done = false;
					break;
				}
				else
					percentObjects[i].actualSize = Math.floor(size);
			}
		}
		
		for (i = 0; i < percentObjects.length; i++)
			availableSize -= percentObjects[i].actualSize;
		
		//Distribute excess pixels (rounding error)
		while (availableSize >= 1 && percentObjects.length > 0)
		{
			for (i = 0; i < percentObjects.length; i++)
			{
				while (percentObjects[i].actualSize + 1 > percentObjects[i].maxSize)
				{
					percentObjects.splice(i, 1);
					if (i == percentObjects.length)
						break;
				}
				
				if (i == percentObjects.length)
					break;
				
				percentObjects[i].actualSize++;
				availableSize--;
				
				if (availableSize <= 0)
					break;
			}
		}
	};
	
///////////////CanvasElement Internal Functions////////////////////////////////////

//@private	
CanvasElement.prototype._onBackgroundShapeStyleChanged = 
	function (styleChangedEvent)
	{
		this._invalidateRender();
	};
	
//@private
CanvasElement.prototype._onBackgroundFillStyleChanged = 
	function (styleChangedEvent)
	{
		this._invalidateRender();
	};
	
/**
 * @function _addStyleDefinitionAt
 * Inserts a style definition to this elements style definition or default definition lists.
 * Adding style definitions to elements already attached to the display chain is expensive, 
 * for better performance add definitions before attaching the element via addElement().
 * Default definitions are used when styling sub components with sub styles. 
 * 
 * @param styleDefinition StyleDefinition
 * StyleDefinition to be added to this elements definition list.
 * 
 * @param index int
 * The index to insert the style definition within the elements definition list.
 * 
 * @param isDefault bool
 * When true, inserts the definition into the element's default definition list.
 * 
 * @returns StyleDefinition
 * Returns StyleDefinition just added when successfull, null if the StyleDefinition could not
 * be added due to the index being out of range or other error.
 */		
CanvasElement.prototype._addStyleDefinitionAt = 
	function (styleDefinition, index, isDefault)
	{
		if (!(styleDefinition instanceof StyleDefinition))
			return null;
	
		//Get the appropriate style definition storage array.
		var styleDefArray;
		if (isDefault == true)
			styleDefArray = this._styleDefinitionDefaults;
		else
			styleDefArray = this._styleDefinitions;
		
		if (index < 0 || index > styleDefArray)
			return null;
		
		styleDefArray.splice(index, 0, styleDefinition);
		
		if (this._manager != null) //Attached to display chain
		{
			styleDefinition.addEventListener("stylechanged", this._onExternalStyleChangedInstance);
			
			//_onExternalStyleChanged() is expensive! We use the map to make sure we only do each style once.
			var styleNamesMap = Object.create(null);
			var styleName = null;
			
			//We're shifting the priority of all existing style definitions with a lower index (previously added) 
			//when we add a new one, so we need to invoke a style change on all associated styles.
			
			//Record relevant style names
			for (var i = index; i >= 0; i--)
			{
				for (styleName in styleDefArray[i]._styleMap)
					styleNamesMap[styleName] = true;
			}
			
			//Spoof style changed events for normal handling.
			for (styleName in styleNamesMap)
				this._onExternalStyleChanged(new StyleChangedEvent(styleName));
		}
		
		return styleDefinition;
	};	

/**
 * @function _removeStyleDefinitionAt
 * Removes a style definition from this elements style definition or default definitions at the supplied index.
 * Default definitions are used when styling sub components with sub styles. 
 * 
 * @param index int
 * Index to be removed.
 * 
 * @param isDefault bool
 * When true, removes the definition from the element's default definition list.
 * 
 * @returns StyleDefinition
 * Returns the StyleDefinition just removed if successfull, null if the definition could
 * not be removed due it it not being in this elements definition list, or index out of range.
 */			
CanvasElement.prototype._removeStyleDefinitionAt = 
	function (index, isDefault)
	{
		//Get the appropriate style definition storage array.
		var styleDefArray;
		if (isDefault == true)
			styleDefArray = this._styleDefinitionDefaults;
		else
			styleDefArray = this._styleDefinitions;
	
		if (index < 0 || index > styleDefArray - 1)
			return null;
		
		var styleDefinition = null;
		
		if (this._manager != null) //Attached to display chain
		{
			//_onExternalStyleChanged() is expensive! We use the map to make sure we only do each style once.
			var styleNamesMap = Object.create(null);
			var styleName = null;
			
			//We're shifting the priority of all existing style definitions with a lower index (previously added) 
			//when we add a new one, so we need to invoke a style change on all associated styles.
			
			//Record relevant styles
			for (var i = index; i >= 0; i--)
			{
				for (styleName in styleDefArray[i]._styleMap)
					styleNamesMap[styleName] = true;
			}
			
			//Remove definition
			styleDefinition = styleDefArray.splice(index, 1)[0]; //Returns array of removed items.
			styleDefinition.removeEventListener("stylechanged", this._onExternalStyleChangedInstance);
			
			//Spoof style changed event for relevant styles.
			for (styleName in styleNamesMap)
				this._onExternalStyleChanged(new StyleChangedEvent(styleName));
		}
		else //Not attached, just remove the definition
			styleDefinition = styleDefArray.splice(index, 1)[0]; //Returns array of removed items.
		
		return styleDefinition;
	};	

/**
 * @function _setStyleDefinitions
 * Replaces the elements current style definition or default definition lists. 
 * This is more effecient than removing or adding style definitions one at a time.
 * Default definitions are used when styling sub components with sub styles. 
 * 
 * @param styleDefinitions StyleDefinition
 * May be a StyleDefinition, or an Array of StyleDefinition
 * 
 * @param isDefault bool
 * When true, replaces the default definition list.
 * 
 * @param styleNamesChangedMap Object
 * Optional - A empty map object - Object.create(null) to populate style changes
 * due to swapping definitions while this element is attached to the display chain. 
 * When specified (not null), does not automatically invoke style changed events.
 */	
CanvasElement.prototype._setStyleDefinitions = 
	function (styleDefinitions, isDefault, styleNamesChangedMap)
	{
		if (styleDefinitions == null)
			styleDefinitions = [];
		
		if (Array.isArray(styleDefinitions) == false)
			styleDefinitions = [styleDefinitions];
		
		var i;
		
		//Remove any null definitions
		for (i = styleDefinitions.length - 1; i >= 0; i--)
		{
			if (styleDefinitions[i] == null)
				styleDefinitions.splice(i, 1);
		}
		
		//Get the appropriate style definition storage array.
		var styleDefArray;
		if (isDefault == true)
			styleDefArray = this._styleDefinitionDefaults;
		else
			styleDefArray = this._styleDefinitions;
		
		if (this._manager != null) //Attached to display chain
		{
			var oldIndex = styleDefArray.length - 1;
			var newIndex = styleDefinitions.length - 1;
			
			var styleName = null;
			var changed = false;
			
			var styleNamesMap = styleNamesChangedMap;
			if (styleNamesMap == null)
				styleNamesMap = Object.create(null);
			
			//Compare styles from the ends of the arrays
			while (oldIndex >= 0 || newIndex >= 0)
			{
				//Detect change
				if (changed == false && (oldIndex < 0 || newIndex < 0 || styleDefinitions[newIndex] != styleDefArray[oldIndex]))
					changed = true;
				
				//Change detected
				if (changed == true)
				{
					if (oldIndex >= 0)
					{
						//Record removed style names
						for (styleName in styleDefArray[oldIndex]._styleMap)
							styleNamesMap[styleName] = true;
					}
					if (newIndex >= 0)
					{
						//Record removed style names
						for (styleName in styleDefinitions[newIndex]._styleMap)
							styleNamesMap[styleName] = true;
					}
				}
				
				oldIndex--;
				newIndex--;
			}
			
			//Bail no changes
			if (changed == false)
				return;
			
			//Clear the definition list
			while (styleDefArray.length > 0)
			{
				styleDefArray[styleDefArray.length - 1].removeEventListener("stylechanged", this._onExternalStyleChangedInstance);
				styleDefArray.splice(styleDefArray.length - 1, 1);
			}
			
			//Add the new definitions.
			for (i = 0; i < styleDefinitions.length; i++)
			{
				styleDefinitions[i].addEventListener("stylechanged", this._onExternalStyleChangedInstance);
				styleDefArray.push(styleDefinitions[i]);
			}
			
			//Spoof style changed events for normal style changed handling.
			if (styleNamesChangedMap == null)
			{
				for (styleName in styleNamesMap)
					this._onExternalStyleChanged(new StyleChangedEvent(styleName));
			}
		}
		else //Not attached to display chain, just swap the definitions
		{
			//Clear the definition list
			styleDefArray.splice(0, styleDefArray.length);
			
			//Add the new definitions.
			for (i = 0; i < styleDefinitions.length; i++)
				styleDefArray.push(styleDefinitions[i]);
		}
	};	

/**
 * @function _getStyleDefinitionAt
 * Gets the style definition or default definition at the supplied zero base index.
 * 
 * @param index int
 * Index of the style definition to return;
 * 
 * @param isDefault bool
 * When true, returns the default definition at the supplied index.
 * 
 * @returns StyleDefinition
 * The style defenition at the supplied index, or null if index is out of range. 
 */		
CanvasElement.prototype._getStyleDefinitionAt = 
	function (index, isDefault)
	{
		//Get the appropriate style definition storage array.
		var styleDefArray;
		if (isDefault == true)
			styleDefArray = this._styleDefinitionDefaults;
		else
			styleDefArray = this._styleDefinitions;
	
		if (index < 0 || index >= styleDefArray.length)
			return null;
		
		return styleDefArray[index];
	};		
	
//@private	
CanvasElement.prototype._onExternalStyleChanged = 
	function (styleChangedEvent)
	{
		//Not attached to display chain, bail.
		if (this._manager == null)
			return;
		
		var isProxy = false;
		var isParent = false;
		var validStyle = false;
		var styleName = styleChangedEvent.getStyleName();	
		var styleType = this._getStyleType(styleName);
		
		if (this._styleProxy != null && styleChangedEvent.getTarget() == this._styleProxy._proxyElement)
			isProxy = true;
		if (this._parent != null && styleChangedEvent.getTarget() == this._parent)
			isParent = true;
		
		if (isProxy == true || isParent == true)
		{
			//If coming from proxy, we cannot be a substyle, and style name must be in proxy map, or _Arbitrary specified and not in proxy map.
			//If coming from parent, style must be inheritable.
			if ((isProxy == true && styleType != StyleableBase.EStyleType.SUBSTYLE && 
				(styleName in this._styleProxy._proxyMap == true || ("_Arbitrary" in this._styleProxy._proxyMap == true && this._styleProxy._proxyElement._getStyleType(styleName) == null))) ||
				(isParent == true && styleType == StyleableBase.EStyleType.INHERITABLE))
			{
				validStyle = true;
			}
			else
				validStyle = false;
		}
		else
			validStyle = true;
		
		//Style we dont care about, bail.
		if (validStyle == false)
			return;
		
		//Get the cache for this style.
		var styleCache = this._stylesCache[styleName];
		
		//Create cache if doesnt exist.
		if (styleCache == null)
		{
			styleCache = {styleData:new StyleData(styleName), cacheInvalid:true};
			this._stylesCache[styleName] = styleCache;
		}
		
		//Check if the StyleData changed (if we're not a sub style)
		if (styleType != StyleableBase.EStyleType.SUBSTYLE)
		{
			var oldStyleData = null;
			var newStyleData = null;
			
			//Cache valid, copy it for later compare.
			if (styleCache.cacheInvalid == false)
				oldStyleData = styleCache.styleData.clone();
			
			//Invalidate the cache
			styleCache.cacheInvalid = true;
			
			//Get updated data.
			newStyleData = this.getStyleData(styleName);
			
			//No change, bail.
			if (oldStyleData != null && oldStyleData.equals(newStyleData) == true)
				return;
		}
		else //Sub styles always invalidate (the entire chain is used)
		{
			//Invalidate the cache
			styleCache.cacheInvalid = true;
			
			//Update data
			this.getStyleData(styleName);
		}
		
		if (styleType != null)
			this._invalidateStyle(styleName);
		
		//Re-dispatch from ourself.
		this.dispatchEvent(styleChangedEvent); 
	};

/**
 * @function _getStyleList
 * 
 * Gets the style values for the supplied style name in this elements
 * style definition list and instance styles for the supplied style name. 
 * This is used for sub styles as all stub styles in the list are applied to sub components.
 * This list should be supplied to the sub components style definition list.
 *  
 * @param styleName String
 * String representing the style list to return.
 * 
 * @returns Array
 * Returns an array of all styles in this elements definition list and instance styles
 * for the associated style name. 
 */	
CanvasElement.prototype._getStyleList = 
	function (styleName)
	{
		var styleList = [];
		var i;
		
		//Add definitions
		for (var i = 0; i < this._styleDefinitions.length; i++)
		{
			styleValue = this._styleDefinitions[i].getStyle(styleName);
			
			if (styleValue !== undefined)
			{
				if (Array.isArray(styleValue) == true)
				{
					for (i = 0; i < styleValue.length; i++)
						styleList.push(styleValue[i]);
						
				}
				else
					styleList.push(styleValue);
			}
		}
		
		//Add instance
		if (styleName in this._styleMap && this._styleMap[styleName] != null)
		{
			styleValue = this._styleMap[styleName];
			
			if (Array.isArray(styleValue) == true)
			{
				for (i = 0; i < styleValue.length; i++)
					styleList.push(styleValue[i]);
			}
			else
				styleList.push(this._styleMap[styleName]);
		}
		
		return styleList;
	};
	
/**
 * @function _getDefaultStyleList
 * 
 * Gets the style values for the supplied style name in this elements
 * default style definition list and class list styles for the supplied style name. 
 * This is used for sub styles as all stub styles in the list are applied to sub components.
 * This list should be supplied to the sub components default style definition list.
 *  
 * @param styleName String
 * String representing the default style list to return.
 * 
 * @returns Array
 * Returns an array of all styles in this elements default definition and class list styles 
 * for the associated style name. 
 */	
CanvasElement.prototype._getDefaultStyleList = 
	function (styleName)
	{
		var styleValue = null;
		var i;
		
		//Get class list
		var styleList = this._getClassStyleList(styleName);
		
		//Check default definitions
		for (var i = 0; i < this._styleDefinitionDefaults.length; i++)
		{
			styleValue = this._styleDefinitionDefaults[i].getStyle(styleName);
			
			if (styleValue !== undefined)
			{
				if (Array.isArray(styleValue) == true)
				{
					for (i = 0; i < styleValue.length; i++)
						styleList.push(styleValue[i]);
				}
				else 
					styleList.push(styleValue);
			}
		}
		
		return styleList;
	};
	
/**
 * @function _applySubStylesToElement
 * @override
 * 
 * Convienence function for setting sub styles of sub components.
 * Applies appropriate sub styling from this element to the 
 * supplied elements definition and default definition style lists.
 * You should call this on sub components from within the _doStylesUpdated()
 * function when the associated sub style changes.
 *  
 * @param styleName String
 * String representing the sub style to apply.
 * 
 * @param elementToApply CanvasElement
 * The sub component element to apply sub styles.
 */		
CanvasElement.prototype._applySubStylesToElement = 
	function (styleName, elementToApply)
	{
		var changedStyleName = null;
		var styleNamesChangedMap = Object.create(null);
	
		elementToApply._setStyleDefinitions(this._getStyleList(styleName), false, styleNamesChangedMap);
		elementToApply._setStyleDefinitions(this._getDefaultStyleList(styleName), true, styleNamesChangedMap);
		
		//Spoof style changed events for normal style changed handling.
		for (changedStyleName in styleNamesChangedMap)
			elementToApply._onExternalStyleChanged(new StyleChangedEvent(changedStyleName));
	};
	
/**
 * @function _setStyleProxy
 * 
 * Sets the element which is to proxy styles to this element. See getStyle() and StyleProxy.
 * This should be set prior to added this element to the display hierarchy via addElement() or _addChild().
 * 
 * @param styleProxy StyleProxy
 * The StyleProxy element wrapper to use to proxy styles from the proxy element to this element.
 * 
 * @seealso StyleProxy
 */	
CanvasElement.prototype._setStyleProxy = 
	function (styleProxy)
	{
		this._styleProxy = styleProxy;
	};
	
/**
 * @function _onCanvasElementAdded
 * Invoked when the element is added to the canvas. Every CanvasElement already adds its own
 * "added" event listener so overriding this is identical but more efficient than adding your own "added" event listener.
 * You should *always* call the base class function.
 * 
 * @param addedRemovedEvent AddedRemovedEvent
 * The AddedRemovedEvent to process.
 */	
CanvasElement.prototype._onCanvasElementAdded = 
	function (addedRemovedEvent)
	{
		/////////Added to the Display Chain/////////////
	
		var i;
	
		for (i = 0; i < this._styleDefinitions.length; i++)
		{
			if (this._styleDefinitions[i].hasEventListener("stylechanged", this._onExternalStyleChangedInstance) == false)
				this._styleDefinitions[i].addEventListener("stylechanged", this._onExternalStyleChangedInstance);
		}

		//If proxy is our parent, we dont want duplicate listeners.
		if (this._styleProxy != null && this._styleProxy._proxyElement.hasEventListener("stylechanged", this._onExternalStyleChangedInstance) == false)
			this._styleProxy._proxyElement.addEventListener("stylechanged", this._onExternalStyleChangedInstance);
		
		if (this._backgroundShape != null && this._backgroundShape.hasEventListener("stylechanged", this._onBackgroundShapeStyleChangedInstance) == false)
			this._backgroundShape.addEventListener("stylechanged", this._onBackgroundShapeStyleChangedInstance);
		
		if (this._backgroundFill != null && this._backgroundFill.hasEventListener("stylechanged", this._onBackgroundFillStyleChangedInstance) == false)
			this._backgroundFill.addEventListener("stylechanged", this._onBackgroundFillStyleChangedInstance);
		
		for (i = 0; i < this._styleDefinitionDefaults.length; i++)
		{
			if (this._styleDefinitionDefaults[i].hasEventListener("stylechanged", this._onExternalStyleChangedInstance) == false)
				this._styleDefinitionDefaults[i].addEventListener("stylechanged", this._onExternalStyleChangedInstance);
		}
		
		//Add broadcast events to manager//
		if ("enterframe" in this._eventListeners && this._eventListeners["enterframe"].length > 0)
		{
			for (i = 0; i < this._eventListeners["enterframe"].length; i++)
				addedRemovedEvent.getManager()._broadcastDispatcher.addEventListener("enterframe", this._eventListeners["enterframe"][i]);
		}
		if ("exitframe" in this._eventListeners && this._eventListeners["exitframe"].length > 0)
		{
			for (i = 0; i < this._eventListeners["exitframe"].length; i++)
				addedRemovedEvent.getManager()._broadcastDispatcher.addEventListener("exitframe", this._eventListeners["exitframe"][i]);
		}
		if ("localechanged" in this._eventListeners && this._eventListeners["localechanged"].length > 0)
		{
			for (i = 0; i < this._eventListeners["localechanged"].length; i++)
				addedRemovedEvent.getManager()._broadcastDispatcher.addEventListener("localechanged", this._eventListeners["localechanged"][i]);
		}
		if ("mousemoveex" in this._eventListeners && this._eventListeners["mousemoveex"].length > 0)
		{
			for (i = 0; i < this._eventListeners["mousemoveex"].length; i++)
				addedRemovedEvent.getManager()._broadcastDispatcher.addEventListener("mousemoveex", this._eventListeners["mousemoveex"][i]);
		}
		
		//Invalidate redraw and composite render
		this._invalidateRedrawRegion();
		this._invalidateCompositeRender();
		
		///////////Invalidate All Styles////////////////
		
		//Invalidate all cache
		for (var prop in this._stylesCache)
			this._stylesCache[prop].cacheInvalid = true;
		
		//Invalidate *all* styles, don't need to propagate, display propagates when attaching.
		this._flattenStyleTypes();
		for (i = 0; i < this.constructor.__StyleTypesFlatArray.length; i++)
			this._invalidateStyle(this.constructor.__StyleTypesFlatArray[i].styleName);
		
		//Always dispatch when added.
		if (this.hasEventListener("localechanged", null) == true)
			this.dispatchEvent(new DispatcherEvent("localechanged"));
	};

/**
 * @function _onCanvasElementRemoved
 * Invoked when the element is removed to the canvas. Every CanvasElement already adds its own
 * "removed" event listener so overriding this is identical but more efficient than adding your own "removed" event listener.
 * You should *always* call the base class function.
 * 
 * @param addedRemovedEvent AddedRemovedEvent
 * The AddedRemovedEvent to process.
 */		
CanvasElement.prototype._onCanvasElementRemoved = 
	function (addedRemovedEvent)
	{
		///////Removed from display chain///////////////////
	
		var i = 0;
	
		for (i = 0; i < this._styleDefinitions.length; i++)
		{
			if (this._styleDefinitions[i].hasEventListener("stylechanged", this._onExternalStyleChangedInstance) == true)
				this._styleDefinitions[i].removeEventListener("stylechanged", this._onExternalStyleChangedInstance);
		}
		
		if (this._styleProxy != null && this._styleProxy._proxyElement.hasEventListener("stylechanged", this._onExternalStyleChangedInstance) == true)
			this._styleProxy._proxyElement.removeEventListener("stylechanged", this._onExternalStyleChangedInstance);
		
		if (this._backgroundShape != null && this._backgroundShape.hasEventListener("stylechanged", this._onBackgroundShapeStyleChangedInstance) == true)
			this._backgroundShape.removeEventListener("stylechanged", this._onBackgroundShapeStyleChangedInstance);
		
		if (this._backgroundFill != null && this._backgroundFill.hasEventListener("stylechanged", this._onBackgroundFillStyleChangedInstance) == true)
			this._backgroundFill.removeEventListener("stylechanged", this._onBackgroundFillStyleChangedInstance);
		
		for (i = 0; i < this._styleDefinitionDefaults.length; i++)
		{
			if (this._styleDefinitionDefaults[i].hasEventListener("stylechanged", this._onExternalStyleChangedInstance) == true)
				this._styleDefinitionDefaults[i].removeEventListener("stylechanged", this._onExternalStyleChangedInstance);
		}
		
		if (this._rollOverCursorInstance != null)
		{
			addedRemovedEvent.getManager().removeCursor(this._rollOverCursorInstance);
			this._rollOverCursorInstance = null;
		}
		
		//Update the redraw region of any composite parents still attached to the display chain.
		for (i = 0; i < this._compositeMetrics.length; i++)
		{
			if (this._compositeMetrics[i].element._manager != null)
				this._compositeMetrics[i].element._updateRedrawRegion(this._compositeMetrics[i].drawableMetrics);
		}
		
		//Reset cycle flags
		this._stylesInvalid = true;
		this._measureInvalid = true;
		this._layoutInvalid = true;
		this._renderInvalid = true;
		this._redrawRegionInvalid = true;
		
		//Nuke graphics canvas
		this._graphicsCanvas = null;
		this._graphicsCtx = null;
		this._graphicsClear = true;					
		
		//Nuke composite canvas
		this._compositeCtx = null;																														
		this._compositeCanvas = null;																
		this._compositeCanvasMetrics = null;			 
		
		//Reset redraw flags
		this._renderChanged = true;					
		this._renderVisible = false; 	
		this._forceRegionUpdate = false;
		this._compositeEffectChanged = true;
		
		//Nuke composite data
		this._compositeMetrics.length = 0;
		this._compositeVisibleMetrics = null;																						
		this._redrawRegionMetrics = null;																												
		this._transformVisibleMetrics = null;			
		this._transformDrawableMetrics = null;				
		
		//Remove broadcast events from manager//
		if ("enterframe" in this._eventListeners && this._eventListeners["enterframe"].length > 0)
		{
			for (i = 0; i < this._eventListeners["enterframe"].length; i++)
				addedRemovedEvent.getManager()._broadcastDispatcher.removeEventListener("enterframe", this._eventListeners["enterframe"][i]);
		}
		if ("exitframe" in this._eventListeners && this._eventListeners["exitframe"].length > 0)
		{
			for (i = 0; i < this._eventListeners["exitframe"].length; i++)
				addedRemovedEvent.getManager()._broadcastDispatcher.removeEventListener("exitframe", this._eventListeners["exitframe"][i]);
		}
		if ("localechanged" in this._eventListeners && this._eventListeners["localechanged"].length > 0)
		{
			for (i = 0; i < this._eventListeners["localechanged"].length; i++)
				addedRemovedEvent.getManager()._broadcastDispatcher.removeEventListener("localechanged", this._eventListeners["localechanged"][i]);
		}
		if ("mousemoveex" in this._eventListeners && this._eventListeners["mousemoveex"].length > 0)
		{
			for (i = 0; i < this._eventListeners["mousemoveex"].length; i++)
				addedRemovedEvent.getManager()._broadcastDispatcher.removeEventListener("mousemoveex", this._eventListeners["mousemoveex"][i]);
		}
	};	
	
/**
 * @function _getFontString
 * Gets a font string that can be applied to the canvas's Context2D via the element's text styles.
 * This is just a helper to gather and format the styles for the canvas context.
 * 
 * @returns String
 * String to be applied to the canvas contex's font. "bold 14px Arial".
 */	
CanvasElement.prototype._getFontString = 
	function ()
	{
		return this.getStyle("TextStyle") + " " + this.getStyle("TextSize") + "px " + this.getStyle("TextFont");
	};		
	
//@Override
CanvasElement.prototype.dispatchEvent = 
	function (dispatchEvent)
	{
		if (!(dispatchEvent instanceof ElementEvent))
		{
			CanvasElement.base.prototype.dispatchEvent.call(this, dispatchEvent);
			return;
		}
	
		dispatchEvent._canceled = false;
		dispatchEvent._defaultPrevented = false;
		
		//We're transforming the event as we bubble. We shouldn't change the instance given to the dispatcher. 
		var event = dispatchEvent.clone();
	
		event._target = this;
		
		//Clone the event when calling the handlers so they cannot fudge the event data.
		var handlerEvent = null;
		
		if (event._bubbles == true)
		{
			var currentElement = this;
			var currentMousePoint = {x:0, y:0};
			if (event instanceof ElementMouseEvent)
			{
				currentMousePoint.x = event._x;
				currentMousePoint.y = event._y;
			}
			
			//Get parent chain.
			var parentChain = [];
			while (currentElement != null)
			{
				parentChain.push({element:currentElement, 
								x:currentMousePoint.x, 
								y:currentMousePoint.y});
				
				//Adjust mouse point for parent.
				if (event instanceof ElementMouseEvent)
				{
					currentMousePoint.x += currentElement._x;
					currentMousePoint.y += currentElement._y;
					
					currentElement.rotatePoint(currentMousePoint, false);
				}
				
				currentElement = currentElement._parent;
			}
			
			//Dispatch Capture Events.
			event._phase = "capture";
			for (var i = parentChain.length -1; i >= 0; i--)
			{
				currentElement = parentChain[i].element;
				
				if (event._type in currentElement._captureListeners && currentElement._captureListeners[event._type].length > 0)
				{
					event._currentTarget = currentElement;
					if (event instanceof ElementMouseEvent)
					{
						event._x = parentChain[i].x;
						event._y = parentChain[i].y;
					}
					
					//Copy the list of event handlers, if event handlers add/remove other handlers or themselves, 
					//we dont want to miss an event, or inconsistently dispatch newly added events.
					var listeners = currentElement._captureListeners[event._type].slice();
					
					//TODO: Sort by priority (no priority available yet).
					
					for (var i2 = 0; i2 < listeners.length; i2++)
					{
						handlerEvent = event.clone(); //Clone the event so the handler can't fudge our event data.
						listeners[i2](handlerEvent);
						
						if (handlerEvent._defaultPrevented == true)
						{
							dispatchEvent._defaultPrevented = true;
							event._defaultPrevented = true;
						}
						
						if (handlerEvent._canceled == true)
						{
							dispatchEvent._canceled = true;
							return;
						}
					}
				}
			}
			
			//Dispatch Bubble Events.
			event._phase = "bubble";
			for (var i = 0; i < parentChain.length; i++)
			{
				currentElement = parentChain[i].element;
				
				if (event._type in currentElement._eventListeners && currentElement._eventListeners[event._type].length > 0)
				{
					event._currentTarget = currentElement;
					if (event instanceof ElementMouseEvent)
					{
						event._x = parentChain[i].x;
						event._y = parentChain[i].y;
					}
					
					//Copy the list of event handlers, if event handlers add/remove other handlers or themselves, 
					//we dont want to miss an event, or inconsistently dispatch newly added events.
					var listeners = currentElement._eventListeners[event._type].slice();
					
					//TODO: Sort by priority (no priority available yet).
					
					for (var i2 = 0; i2 < listeners.length; i2++)
					{
						handlerEvent = event.clone(); //Clone the event so the handler can't fudge our event data.
						listeners[i2](handlerEvent);
						
						if (handlerEvent._defaultPrevented == true)
						{
							dispatchEvent._defaultPrevented = true;
							event._defaultPrevented = true;
						}
						
						if (handlerEvent._canceled == true)
						{
							dispatchEvent._canceled = true;
							return;
						}
					}
				}
			}
			
		}
		else //Dispatch only target events.
		{ 
			event._currentTarget = this;

			event._phase = "capture";
			if (event._type in this._captureListeners && this._captureListeners[event._type].length > 0)
			{
				//Copy the list of event handlers, if event handlers add/remove other handlers or themselves, 
				//we dont want to miss an event, or inconsistently dispatch newly added events.
				var listeners = this._captureListeners[event._type].slice();
				
				//TODO: Sort by priority (no priority available yet).
				
				for (var i2 = 0; i2 < listeners.length; i2++)
				{
					handlerEvent = event.clone(); //Clone the event so the handler can't fudge our event data.
					listeners[i2](handlerEvent);
					
					if (handlerEvent._defaultPrevented == true)
					{
						dispatchEvent._defaultPrevented = true;
						event._defaultPrevented = true;
					}
					
					if (handlerEvent._canceled == true)
					{
						dispatchEvent._canceled = true;
						return;
					}
				}
			}
			
			event._phase = "bubble";
			if (event._type in this._eventListeners && this._eventListeners[event._type].length > 0)
			{
				//Copy the list of event handlers, if event handlers add/remove other handlers or themselves, 
				//we dont want to miss an event, or inconsistently dispatch newly added events.
				var listeners = this._eventListeners[event._type].slice();
				
				//TODO: Sort by priority (no priority available yet).
				
				for (var i2 = 0; i2 < listeners.length; i2++)
				{
					handlerEvent = event.clone(); //Clone the event so the handler can't fudge our event data.
					listeners[i2](handlerEvent);
					
					if (handlerEvent._defaultPrevented == true)
					{
						dispatchEvent._defaultPrevented = true;
						event._defaultPrevented = true;
					}
					
					if (handlerEvent._canceled == true)
					{
						dispatchEvent._canceled = true;
						return;
					}
				}
			}
		}
	};

/**
 * @function _addChild
 * Adds a child element to the end of this element's child list.
 * 
 * @param element CanvasElement
 * CanvasElement to be added as a child of this element.
 * 
 * @returns CanvasElement
 * Returns the element just added.
 */	
CanvasElement.prototype._addChild = 
	function (element)
	{
		return this._addChildAt(element, this._children.length);
	};

/**
 * @function _addChildAt
 * Inserts a child element to this elements child list at the specified index.
 * 
 * @param element CanvasElement
 * CanvasElement to be added as a child of this element.
 * 
 * @param index int
 * The index position to insert the child in the elements child list.
 * 
 * @returns CanvasElement
 * Returns the element just added when successfull, null if the element could not
 * be added due to the index being out of range.
 */		
CanvasElement.prototype._addChildAt = 
	function (element, index)
	{
		if (!(element instanceof CanvasElement))
			return null;
		
		if (index < 0 || index > this._children.length)
			return null;
		
		//Elements may only have 1 parent.
		if (element._parent != null)
			element._parent._removeChild(element);
		
		element._parent = this;
		this._children.splice(index, 0, element);
		this.addEventListener("stylechanged", element._onExternalStyleChangedInstance);
		
		element._propagateChildData();
		
		this._invalidateMeasure();
		this._invalidateLayout();
		
		if (this._manager != null)
		{
			this._manager._rollOverInvalid = true;
			this._manager._processAddRemoveDisplayChainQueue();
		}
		
		return element;
	};
	
/**
 * @function _removeChild
 * Removes a child element from this elements child list.
 * 
 * @param element CanvasElement
 * Child to be removed.
 * 
 * @returns CanvasElement
 * Returns the element just removed if successfull, null if the
 * element could not be removed due to it not being a child of this element.
 */	
CanvasElement.prototype._removeChild = 
	function (element)
	{
		var childIndex = this._children.indexOf(element);
		if (childIndex == -1)
			return null;
	
		return this._removeChildAt(childIndex);
	};

/**
 * @function _removeChildAt
 * Removes a child element at specified index.
 * 
 * @param index int
 * Index to be removed.
 * 
 * @returns CanvasElement
 * Returns the element just removed if successfull, null if the element could
 * not be removed due it it not being a child of this element, or index out of range.
 */		
CanvasElement.prototype._removeChildAt = 
	function (index)
	{
		if (index < 0 || index > this._children.length - 1)
			return null;
		
		var element = this._children.splice(index, 1)[0]; //Returns array of removed items.
		
		//We removed an element that is in mouse-down state. 
		//Change the mouseup target to the parent of this element.
		if (element._mouseIsDown == true)
			element._manager._mouseDownElement = element._parent;
		
		if (element._mouseIsOver == true)
			element._manager._rollOverElement = element._parent;
		
		element._parent = null;
		this.removeEventListener("stylechanged", element._onExternalStyleChangedInstance);
		
		element._propagateChildData();
		
		this._invalidateMeasure();
		this._invalidateLayout();
		
		if (this._manager != null)
		{
			this._manager._rollOverInvalid = true;
			this._manager._processAddRemoveDisplayChainQueue();
		}
		
		return element;
	};	

/**
 * @function _getChildAt
 * Gets the child element at the supplied index.
 * 
 * @param index int
 * Index of child element to return;
 * 
 * @returns CanvasElement
 * The element at the supplied index, or null if index is out of range. 
 */	
CanvasElement.prototype._getChildAt = 
	function (index)
	{
		if (index < 0 || index > this._children.length - 1)
			return null;
		
		return this._children[index];
	};
	
/**
 * @function _getChildIndex
 * Returns the index of the supplied child element.
 * 
 * @param element CanvasElement
 * Child element to return the index.
 * 
 * @returns int
 * Returns the child index or -1 if the element is not
 * a child of this element.
 */	
CanvasElement.prototype._getChildIndex = 
	function (element)
	{
		return this._children.indexOf(element);
	};
	
/**
 * @function _setChildIndex
 * Changes a child element's index. 
 * 
 * @param element CanvasElement
 * Child element to change index.
 * 
 * @param index int
 * New index of the child element.
 * 
 * @returns boolean
 * Returns true if the child's index is successfully changed, false if the element
 * is not a child of this element or the index is out of range.
 */	
CanvasElement.prototype._setChildIndex = 
	function (element, index)
	{
		if (index < 0 || index > this._children.length - 1)
			return false;
		
		var currentIndex = this._getChildIndex(element);
		if (currentIndex == -1 || currentIndex == index)
			return false;
		
		this._children.splice(index, 0, this._children.splice(currentIndex, 1)[0]);
		
		this._invalidateMeasure();
		this._invalidateLayout();
		
		return true;
	};
	
/**
 * @function _getNumChildren
 * Gets this elements number of children.
 * 
 * @returns int
 * The number of child elements.
 */	
CanvasElement.prototype._getNumChildren = 
	function ()
	{
		return this._children.length;
	};
	
//@private	
CanvasElement.prototype._propagateChildData = 
	function ()
	{
		var isManager = (this instanceof CanvasManager);
	
		if ((isManager == false && (this._parent == null || this._parent._displayDepth == 0)) || 
			isManager == true && this._manager != null)
		{//Removed from display chain
			
			//Purge manager data.
			if (this._manager != null)
			{
				if (this._stylesInvalid == true)
					this._manager._updateStylesQueue.removeNode(this._stylesValidateNode, this._displayDepth);
				
				if (this._measureInvalid == true)
					this._manager._updateMeasureQueue.removeNode(this._measureValidateNode, this._displayDepth);
				
				if (this._layoutInvalid == true)
					this._manager._updateLayoutQueue.removeNode(this._layoutValidateNode, this._displayDepth);
				
				if (this._renderInvalid == true)
					this._manager._updateRenderQueue.removeNode(this._renderValidateNode, this._displayDepth);
				
				if (this._redrawRegionInvalid == true)
					this._manager._updateRedrawRegionQueue.removeNode(this._redrawRegionValidateNode, this._displayDepth);
				
				if (this._compositeRenderInvalid == true)
					this._manager._compositeRenderQueue.removeNode(this._compositeRenderValidateNode, this._displayDepth);
				
				if (this == this._manager._draggingElement)
					this._manager._clearDraggingElement();
				
				if (this == this._manager._focusElement)
					this._manager._focusElement = null;
				
				this._manager._pushAddRemoveDisplayChainQueue(this, "removed");
			}
			
			this._renderFocusRing = false;
			this._isFocused = false;
			this._mouseIsOver = false;
			this._mouseIsDown = false;
			this._displayDepth = 0;
			this._manager = null;
		}
		else
		{//Added to display chain
			
			if (isManager == true)
			{
				this._displayDepth = 1;
				this._manager = this;
			}
			else
			{
				this._displayDepth = this._parent._displayDepth + 1;
				this._manager = this._parent._manager;
			}
			
			//Add manager data.
			if (this._manager != null)
			{
				if (this._stylesInvalid == true)
					this._manager._updateStylesQueue.addNode(this._stylesValidateNode, this._displayDepth);
				
				if (this._measureInvalid == true)
					this._manager._updateMeasureQueue.addNode(this._measureValidateNode, this._displayDepth);
				
				if (this._layoutInvalid == true)
					this._manager._updateLayoutQueue.addNode(this._layoutValidateNode, this._displayDepth);
				
				if (this._renderInvalid == true)
					this._manager._updateRenderQueue.addNode(this._renderValidateNode, this._displayDepth);
				
				if (this._redrawRegionInvalid == true)
					this._manager._updateRedrawRegionQueue.addNode(this._redrawRegionValidateNode, this._displayDepth);
				
				if (this._compositeRenderInvalid == true)
					this._manager._compositeRenderQueue.addNode(this._compositeRenderValidateNode, this._displayDepth);
				
				this._manager._pushAddRemoveDisplayChainQueue(this, "added");
			}
		}
		
		for (var i = 0; i < this._children.length; i++)
			this._children[i]._propagateChildData();
	};	

/**
 * @function _setRelativePosition
 * Sets the elements position relative to a supplied element regardless of this element's transformation,
 * depth, or position in the display hierarchy or relation to the supplied relativeToElement. This should typically
 * only be called during the parent element's layout phase. Setting relativeToElement to null has an identical
 * effect to calling _setActualPosition(). This is used by some containers to position the element relative
 * to a parent's coordinate plane rather than the child's transformed plane.
 * 
 * @param x Number
 * The relative X position to move this element's position.
 * 
 * @param y Number
 * The relative Y position to move this element's position.
 * 
 * @param relativeToElement CanvasElement
 * The CanvasElement to move this element relative too.
 */	
CanvasElement.prototype._setRelativePosition = 
	function (x, y, relativeToElement)
	{
		if (relativeToElement == null || relativeToElement == this)
		{
			if (this._x == x && this._y == y)
				return;
			
			this._x = x;
			this._y = y;
			
			if (this._manager != null)
				this._manager._rollOverInvalid = true;
			
			this._invalidateRedrawRegion();
		}
		
		if (this._manager == null || this._manager != relativeToElement._manager)
			return;
		
		//Use relative parent metrics. We want to shift this elements entire plane if its
		//transformed (rotated), we dont want to slide the element around on its transformed plane.
		var parentMetrics = this.getMetrics(this._parent);
		
		//Get the move-to position within our parent element.
		var newPosition = {x:x, y:y};
		relativeToElement.translatePointTo(newPosition, this._parent);
		
		//We haven't moved.
		if (newPosition.x == parentMetrics.getX() && newPosition.y == parentMetrics.getY())
			return;
		
		//Get the delta in its position.
		var deltaX = newPosition.x - parentMetrics.getX();
		var deltaY = newPosition.y - parentMetrics.getY();
		
		this._x = this._x + deltaX;
		this._y = this._y + deltaY;
		
		if (this._rotateDegrees != 0)
		{
			this._rotateCenterX += deltaX;
			this._rotateCenterY += deltaY;
		}
		
		if (this._manager != null)
			this._manager._rollOverInvalid = true;
		
		this._invalidateRedrawRegion();
	};	
		
/**
 * @function _setActualPosition
 * Sets the elements position within its parent. Note that if the element is transformed or rotated,
 * this sets the elements position within its transformed plane. If you wish to position a transformed
 * element relative to its parents coordinate plane, use _setRelativePosition(). This should typically
 * only be called from within the parents layout phase.
 * 
 * @param x int
 * The X position to move the element.
 * 
 * @param y int
 * The Y position to move the element.
 */	
CanvasElement.prototype._setActualPosition = 
	function (x, y)
	{
		x = Math.round(x);
		y = Math.round(y);
		
		if (this._x == x && this._y == y)
			return;
		
		this._x = x;
		this._y = y;
		
		if (this._manager != null)
			this._manager._rollOverInvalid = true;
		
		this._invalidateRedrawRegion();
	};	
	
/**
 * @function _setActualSize
 * Sets this element's size in pixels prior to any transformation or rotation. 
 * This should typically only be called from within the parents layout phase.
 * 
 * @param width Number
 * The width in pixels to size this element.
 * 
 * @param height Number
 * The height in pixels to size this element.
 */	
CanvasElement.prototype._setActualSize = 
	function (width, height)
	{
		//if (typeof width !== "number" || typeof height !== "number" || isNaN(width) || isNaN(height))
		//	throw "Invalid Size";
	
		//TODO: This is BAD!!!  This is effectively a fix for components that arent rounding / drawing on
		//		on even pixel lines causing anti-aliasing fuzz. This *needs* to be removed, and offending components fixed.
		width = Math.round(width);
		height = Math.round(height);
		
		if (this._width == width && this._height == height)
			return false;
		
		this._width = width;
		this._height = height;
		
		this._invalidateLayout();
		this._invalidateRender();
		this._invalidateRedrawRegion();
		
		if (this.hasEventListener("resize", null) == true)
			this.dispatchEvent(new DispatcherEvent("resize"), false);
		
		if (this._manager != null)
			this._manager._rollOverInvalid = true;
		
		return true;
	};
	
/**
 * @function _setActualRotation
 * Sets this elements rotation degrees and rotation point relative to its parent. This should typically
 * only be called from within the parent's layout phase.
 * 
 * @param degrees Number
 * Degrees to rotate the element (clockwise).
 * 
 * @param centerX Number
 * The X position relative to the elements parent to rotate around.
 * 
 * @param centerY Number
 * The Y position relative to the elements parent to rotate around.
 */	
CanvasElement.prototype._setActualRotation = 
	function (degrees, centerX, centerY)
	{
		if (centerX == null || centerY == null)
		{
			centerX = 0;
			centerY = 0;
		}
	
		if (this._rotateDegrees != degrees || this._rotateCenterX != centerX || this._rotateCenterY != centerY)
		{
			this._invalidateRedrawRegion();
			
			if (this._rotateDegrees != degrees)
			{
				this._compositeEffectChanged = true;
				this._invalidateCompositeRender();
			}
		}
		
		this._rotateDegrees = degrees;
		this._rotateCenterX = centerX;
		this._rotateCenterY = centerY;
	};
	
//@private
CanvasElement.prototype._setMeasuredSize = 
	function (width, height)
	{
		if (this._measuredWidth == width && this._measuredHeight == height)
			return;
		
		this._measuredWidth = width;
		this._measuredHeight = height;
		
		if (this._parent != null)
		{
			this._parent._invalidateMeasure();
			this._parent._invalidateLayout();
		}
	};
	
//@private	
CanvasElement.prototype._setRenderFocusRing = 
	function (shouldRender)
	{
		if (this._renderFocusRing == shouldRender)
			return;
		
		this._renderFocusRing = shouldRender;
		this._invalidateRender();
	};

//@private	
CanvasElement.prototype._createMetrics = 
	function ()
	{
		return new DrawMetrics();
	};
	
	
/**
 * @function _getGraphicsCtx
 * Returns the canvas context used when rendering this element. This should typically
 * only be called from within the element's _doRender() phase, and only if you intend
 * to actually draw. Calling this will impact the canvas redraw regions.
 *  
 * @returns Canvas2DContext
 * Canvas context used when rendering this element.
 */	
CanvasElement.prototype._getGraphicsCtx = 
	function ()
	{
		if (this._graphicsCanvas == null)
		{
			this._graphicsCanvas = document.createElement("canvas");
			this._graphicsCtx = this._graphicsCanvas.getContext("2d");
			
			this._graphicsCanvas.width = this._width;
			this._graphicsCanvas.height = this._height;
		}
		
		this._renderChanged = true;
		this._graphicsClear = false;
		
		this._invalidateRedrawRegion();
		
		return this._graphicsCtx;
	};
	
	
/**
 * @function _getPaddingSize
 * Helper function that returns the elements total padding width and height per its applied styles.
 * 
 * @returns Object
 * Returns an object containing 
 * {width:paddingWidth, height:paddingHeight,
 * paddingBottom:paddingBottom, paddingTop:paddingTop,
 * paddingLeft:paddingLeft, paddingRight:paddingRight}.
 */	
CanvasElement.prototype._getPaddingSize = 
	function ()
	{
		var paddingData = this.getStyleData("Padding");
		var paddingTopData = this.getStyleData("PaddingTop");
		var paddingBottomData = this.getStyleData("PaddingBottom");
		var paddingLeftData = this.getStyleData("PaddingLeft");
		var paddingRightData = this.getStyleData("PaddingRight");
		
		var paddingTop = paddingTopData.value;
		if (paddingData.comparePriority(paddingTopData) > 0) //Use Padding if higher priority
			paddingTop = paddingData.value;
		
		var paddingBottom = paddingBottomData.value;
		if (paddingData.comparePriority(paddingBottomData) > 0) //Use Padding if higher priority
			paddingBottom = paddingData.value;
		
		var paddingLeft = paddingLeftData.value;
		if (paddingData.comparePriority(paddingLeftData) > 0) //Use Padding if higher priority
			paddingLeft = paddingData.value;
		
		var paddingRight = paddingRightData.value;
		if (paddingData.comparePriority(paddingRightData) > 0) //Use Padding if higher priority
			paddingRight = paddingData.value;
		
		return { width: paddingLeft + paddingRight, 
				height: paddingTop + paddingBottom, 
				paddingBottom:paddingBottom, 
				paddingTop:paddingTop, 
				paddingLeft:paddingLeft, 
				paddingRight:paddingRight};
	};

/**
 * @function _getBorderThickness
 * Helper function that returns the elements border thickness per its applied styles.
 * 
 * @returns Number
 * The elements border thickness.
 */	
CanvasElement.prototype._getBorderThickness = 
	function ()
	{
		var borderThickness = 0;
		var borderType = this.getStyle("BorderType");
		var borderColor = this.getStyle("BorderColor");
		if ((borderType == "solid" || borderType == "inset" || borderType == "outset") && borderColor != null)
		{
			borderThickness = this.getStyle("BorderThickness");
			if (borderThickness < 0)
				borderThickness = 0;
		}
		
		return borderThickness;
	};

/**
 * @function _getStyledOrMeasuredWidth
 * Helper function that returns this elements styled width, or measured width if no style is set. Typically
 * called from within a parent containers layout phase.
 * 
 * @returns Number
 * The elements width.
 */	
CanvasElement.prototype._getStyledOrMeasuredWidth = 
	function ()
	{
		var width = this.getStyle("Width");
		
		if (width == null)
		{
			var maxWidth = this.getStyle("MaxWidth");
			var minWidth = this.getStyle("MinWidth");
			
			if (minWidth == null)
				minWidth = 0;
			if (maxWidth == null)
				maxWidth = Number.MAX_VALUE;
			
			width = this._measuredWidth;
			width = Math.min(width, maxWidth);
			width = Math.max(width, minWidth);
		}
		
		return width;
	};

/**
 * @function _getStyledOrMeasuredHeight
 * Helper function that returns this elements styled height, or measured height if no style is set. Typically
 * called from within a parent containers layout phase.
 * 
 * @returns Number
 * The elements height.
 */		
CanvasElement.prototype._getStyledOrMeasuredHeight = 
	function ()
	{
		var height = this.getStyle("Height");
		
		if (height == null)
		{
			var maxHeight = this.getStyle("MaxHeight");
			var minHeight = this.getStyle("MinHeight");			
			
			if (minHeight == null)
				minHeight = 0;
			if (maxHeight == null)
				maxHeight = Number.MAX_VALUE;	
			
			height = this._measuredHeight;
			height = Math.min(height, maxHeight);
			height = Math.max(height, minHeight);
		}
		
		return height;
	};
	
/**
 * @function _getBorderMetrics
 * Helper function that returns a DrawMetrics object whose bounding area is inside this elements border.
 * 
 * @returns DrawMetrics
 * Returns DrawMetrics that define a bounding area inside this elements border.
 */	
CanvasElement.prototype._getBorderMetrics = 
	function ()
	{
		var metrics = this._createMetrics();
		
		var borderThickness = this._getBorderThickness();
		
		metrics._x = borderThickness / 2;
		metrics._y = borderThickness / 2;
		
		metrics._width = this._width - borderThickness;
		metrics._height = this._height - borderThickness;
		
		return metrics;
	};
	
/**
 * @function _getPaddingMetrics
 * Helper function that returns a DrawMetrics object whose bounding area is inside this elements padding area.
 * 
 * @returns DrawMetrics
 * Returns DrawMetrics that define a bounding area inside this elements padding area.
 */		
CanvasElement.prototype._getPaddingMetrics = 
	function()
	{
		var metrics = this._createMetrics();
		var paddingSize = this._getPaddingSize();
		
		metrics._x = paddingSize.paddingLeft;
		metrics._y = paddingSize.paddingTop;
		metrics._width = this._width -  paddingSize.paddingLeft - paddingSize.paddingRight;
		metrics._height = this._height - paddingSize.paddingTop - paddingSize.paddingBottom;
		
		return metrics;
	};

/**
 * @function _drawBackgroundShape
 * Used to draw the path to the Canvas2DContext that is to be used to render the focus ring,
 * fill the background, and draw the border. You should never need to explicitly call this. 
 * The system calls this during render phase.
 * Typically you should use the BackgroundShape style
 * for this, but may override it under more complex scenarios.
 * 
 * @param ctx Canvas2DContext
 * Canvas2DContext to draw the background shape path.
 * 
 * @param borderMetrics DrawMetrics
 * The DrawMetrics containing x,y,width,height used to draw the background. These
 * metrics should be the same as the ones used to stroke a solid border.
 */	
CanvasElement.prototype._drawBackgroundShape = 
	function (ctx, borderMetrics)
	{
		if (this._backgroundShape == null)
		{
			//Full rectangle
			var x = borderMetrics.getX();
			var y = borderMetrics.getY();
			var w = borderMetrics.getWidth();
			var h = borderMetrics.getHeight();
			
			ctx.moveTo(x, y);
			ctx.lineTo(x + w, y);
			ctx.lineTo(x + w, y + h);
			ctx.lineTo(x, y + h);
			ctx.closePath();
		}
		else
		{
			this._backgroundShape.drawShape(ctx, borderMetrics);
		}
	};

/**
 * @function _drawFocusRing
 * Used to draw the focus ring when a tab-able element gains focus due to a tab stop per the elements styles.
 * You should never need to explicitly call this. The system calls this during
 * the render phase. You may override if you wish to draw a more complex focus indicator.
 * Focus ring is drawn *outside* the elements bounding box. Focus ring is rendered
 * before the background and border. 
 * 
 * @param ctx Canvas2DContext
 * Canvas2DContext to render the focus ring.
 * 
 * @param borderMetrics DrawMetrics
 * The DrawMetrics containing x,y,width,height used to draw the background. These
 * metrics should be the same as the ones used to stroke a solid border.
 */		
CanvasElement.prototype._drawFocusRing = 
	function (ctx, borderMetrics)
	{
		var focusRingThickness = this.getStyle("FocusThickness");
		if (focusRingThickness <= 0)
			return;
		
		var focusRingColor = this.getStyle("FocusColor");
		if (focusRingColor == null)
			return;		
		
		var metrics = this.getMetrics(this);
		
		var x = metrics.getX() - focusRingThickness;
		var y = metrics.getY() - focusRingThickness;
		var w = metrics.getWidth() + (focusRingThickness * 2);
		var h = metrics.getHeight() + (focusRingThickness * 2);
		
		ctx.beginPath();
		
		//Draw anticlockwise
		ctx.moveTo(x, y);
		ctx.lineTo(x, y + h);
		ctx.lineTo(x + w, y + h);
		ctx.lineTo(x + w, y);
		ctx.closePath();
		
		//Draws clockwise (shape inside shape)
		this._drawBackgroundShape(ctx, borderMetrics);
		
		//Clip the *inside* of the background shape
		ctx.clip();

		//Draw border
		ctx.beginPath();
		this._drawBackgroundShape(ctx, borderMetrics);
		
		ctx.strokeStyle = focusRingColor;

		//Increase thickness
		ctx.lineWidth = this._getBorderThickness() + (focusRingThickness * 2);
		ctx.stroke();
	};
	
/**
 * @function _fillBackground
 * Used to fill the elements background shape according to the element's BackgroundShape and BackgroundFill styles.
 * You should never need to explicitly call this. The system calls this during
 * the render phase. You may override if you need to do a more complex background fill. The background fill
 * is rendered after the focus ring and before the border. 
 * 
 * @param ctx Canvas2DContext
 * Canvas2DContext to fill the background shape.
 * 
 * @param borderMetrics DrawMetrics
 * The DrawMetrics containing x,y,width,height used to draw the background. These
 * metrics should be the same as the ones used to stroke a solid border.
 */	
CanvasElement.prototype._fillBackground = 
	function (borderMetrics)
	{
		if (this._backgroundFill == null)
			return;
	
		var ctx = this._getGraphicsCtx();
		
		ctx.beginPath();
		this._drawBackgroundShape(ctx, borderMetrics);
		
		this._backgroundFill.drawFill(ctx, borderMetrics);
	};

//@private	
CanvasElement.prototype._drawSolidBorder = 
	function (ctx, borderMetrics)
	{
		var borderColor = this.getStyle("BorderColor");
		if (borderColor == null)
			return;
		
		var borderThickness = this.getStyle("BorderThickness");
		if (borderThickness < 0)
			return;
	
		ctx.beginPath();
		this._drawBackgroundShape(ctx, borderMetrics);
		ctx.strokeStyle = borderColor;

		ctx.lineWidth = borderThickness;
		ctx.stroke();
	};
	
/**
 * @function _drawBorder
 * Used to render the elements border according to the element's style settings.
 * You should never need to explicitly call this. The system calls this during
 * the render phase. You may override if you need to do a more complex border. The border
 * is rendered last, on top of the focus ring and background fill.
 * 
 * @param ctx Canvas2DContext
 * Canvas2DContext to render the border.
 * 
 * @param borderMetrics DrawMetrics
 * The DrawMetrics containing x,y,width,height used to draw the background. These
 * metrics should be the same as the ones used to stroke a solid border.
 */		
CanvasElement.prototype._drawBorder = 
	function (borderMetrics)
	{
		var borderType = this.getStyle("BorderType");
	
		if (borderType != "solid" && borderType != "inset" && borderType != "outset")
			return;			
	
		var ctx = this._getGraphicsCtx();
		
		if (borderType == "solid")
		{
			this._drawSolidBorder(ctx, borderMetrics);
		}
		else //inset || outset
		{
			var borderColor = this.getStyle("BorderColor");
			var borderThickness = this.getStyle("BorderThickness");
			
			if (borderColor == null || borderThickness <= 0)
				return;
			
			var x = 0;
			var y = 0;
			var w = this._width;
			var h = this._height;
			
			var lighterColor = CanvasElement.adjustColorLight(borderColor, .3);
			var darkerColor = CanvasElement.adjustColorLight(borderColor, .3 * -1);
			
			var tlColor = borderType == "inset" ? darkerColor : lighterColor;
			var brColor = borderType == "inset" ? lighterColor : darkerColor;
			
			ctx.beginPath();
			ctx.moveTo(x, y + h);
			ctx.lineTo(x, y);
			ctx.lineTo(x + w, y);
			
			ctx.lineTo(x + w - borderThickness, y + borderThickness);
			ctx.lineTo(x + borderThickness, y + borderThickness);
			ctx.lineTo(x + borderThickness, y + h - borderThickness);
			ctx.closePath();
			
			ctx.fillStyle = tlColor;
			ctx.fill();
			
			ctx.beginPath();
			ctx.moveTo(x, y + h);
			ctx.lineTo(x + w, y + h);
			ctx.lineTo(x + w, y);
			
			ctx.lineTo(x + w - borderThickness, y + borderThickness);
			ctx.lineTo(x + w - borderThickness, y + h - borderThickness);
			ctx.lineTo(x + borderThickness, y + h - borderThickness);
			ctx.closePath();
			
			ctx.fillStyle = brColor;
			ctx.fill();
			
			ctx.lineWidth = 1;
			ctx.globalAlpha= .15;
			ctx.strokeStyle = "#000000";
			
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x + borderThickness, y + borderThickness);
			ctx.stroke();
			
			ctx.beginPath();
			ctx.moveTo(x + w, y + h);
			ctx.lineTo(x + w - borderThickness, y + h - borderThickness);
			ctx.stroke();
		}
	};

//@private	
CanvasElement.prototype._validateStyles = 
	function ()
	{
		this._stylesInvalid = false;
	
		//Reset and record the current set of invalid styles
		var stylesInvalidMap = Object.create(null);
		
		for (var prop in this._stylesInvalidMap)
		{
			if (this._stylesInvalidMap[prop] == true)
			{
				stylesInvalidMap[prop] = true; //Record
				this._stylesInvalidMap[prop] = false; //Reset
			}
		}
		
		this._doStylesUpdated(stylesInvalidMap);
	};
	
//@private	
CanvasElement.prototype._validateMeasure = 
	function ()
	{
		this._measureInvalid = false;
	
		if (this.getStyle("IncludeInMeasure") == true)
		{
			var paddingSize = this._getPaddingSize();
			this._doMeasure(paddingSize.width, paddingSize.height);
		}
		else
			this._setMeasuredSize(0, 0);
		
		if (this.hasEventListener("measurecomplete", null) == true)
			this.dispatchEvent(new DispatcherEvent("measurecomplete"));
	};
	
//@private	
CanvasElement.prototype._validateLayout = 
	function ()
	{
		this._layoutInvalid = false;
		this._doLayout(this._getPaddingMetrics());
		
		if (this._layoutInvalid == false && this.hasEventListener("layoutcomplete", null) == true)
			this.dispatchEvent(new DispatcherEvent("layoutcomplete"));
	};	
	
//@private
CanvasElement.prototype._validateRender = 
	function ()
	{
		this._renderInvalid = false;
		
		if (this._graphicsCanvas != null)
		{
			this._graphicsCanvas.width = this._width;
			this._graphicsCanvas.height = this._height;
			this._graphicsCtx.clearRect(0, 0, this._graphicsCanvas.width, this._graphicsCanvas.height);
		}
		
		if (this._graphicsClear == false)
		{
			this._renderChanged = true;
			this._graphicsClear = true;
			
			this._invalidateRedrawRegion();
		}
		
		this._doRender();
	};

//@private
CanvasElement.prototype._getCompositeMetrics = 
	function (compositeParent)
	{
		for (var i = 0; i < this._compositeMetrics.length; i++)
		{
			if (this._compositeMetrics[i].element == compositeParent)
				return this._compositeMetrics[i];
		}
		
		return null;
	};
	
//@private	
CanvasElement.prototype._validateRedrawRegion = 
	function (cachePool)
	{
		this._redrawRegionInvalid = false;
	
		var i;
		
		var newCompositeMetrics = cachePool.compositeMetrics;
		var newCompositeMetricsLength = 0;
		
		var oldVisible = this._renderVisible;
		var forceRegionUpdate = this._forceRegionUpdate; 
		
		//Get new visibility
		var newVisible = true;
		if ((this._parent != null && this._parent._renderVisible == false) || 
			this.getStyle("Visible") == false || 
			this.getStyle("Alpha") <= 0)
		{
			newVisible = false;
		}
		
		//Wipe out the composite metrics (rebuild as we recurse children if we're a composite layer)
		this._compositeVisibleMetrics = null;
		this._transformVisibleMetrics = null;
		this._transformDrawableMetrics = null;
		this._forceRegionUpdate = false;
		
		//Composite effect on this element changed, we *must* update the region on ourself and all of our children.
		if (this._compositeEffectChanged == true)
			forceRegionUpdate = true;
		
		if ((this._renderChanged == true || this._graphicsClear == false) &&
			(oldVisible == true || newVisible == true))
		{
			var parent = this;

			//Transformed via points up parent chain
			var rawMetrics = cachePool.rawMetrics; 
			rawMetrics._x = 0;
			rawMetrics._y = 0;
			rawMetrics._width = this._width;
			rawMetrics._height = this._height;
			
			//Transformed via metrics up parent chain (recalculated each layer, expands, and clips)
			var drawableMetrics = cachePool.drawableMetrics; 
			drawableMetrics.copyFrom(rawMetrics);
			
			//Used for transforming the raw metrics up the parent chain.
			var pointRawTl = cachePool.pointRawTl;
			var pointRawTr = cachePool.pointRawTr;
			var pointRawBr = cachePool.pointRawBr;
			var pointRawBl = cachePool.pointRawBl;
			
			pointRawTl.x = rawMetrics._x;
			pointRawTl.y = rawMetrics._y;
			pointRawTr.x = rawMetrics._x + rawMetrics._width;
			pointRawTr.y = rawMetrics._y;
			pointRawBr.x = rawMetrics._x + rawMetrics._width;
			pointRawBr.y = rawMetrics._y + rawMetrics._height;
			pointRawBl.x = rawMetrics._x;
			pointRawBl.y = rawMetrics._y + rawMetrics._height;
			
			var pointDrawableTl = cachePool.pointDrawableTl;
			var pointDrawableTr = cachePool.pointDrawableTr;
			var pointDrawableBr = cachePool.pointDrawableBr;
			var pointDrawableBl = cachePool.pointDrawableBl;
			
			pointDrawableTl.x = 0;
			pointDrawableTl.y = 0;
			pointDrawableTr.x = 0;
			pointDrawableTr.y = 0;
			pointDrawableBr.x = 0;
			pointDrawableBr.y = 0;
			pointDrawableBl.x = 0;
			pointDrawableBl.y = 0;
			
			var minX = null;
			var maxX = null;
			var minY = null;
			var maxY = null;
			
			//Cached storage of previous metrics per composite parent.
			var oldMetrics = null;	//{element:element, metrics:DrawMetrics, drawableMetrics:DrawMetrics}
			
			var clipMetrics = cachePool.clipMetrics;
			var shadowMetrics = cachePool.shadowMetrics;
			
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
					oldMetrics = this._getCompositeMetrics(parent);
					
					if (drawableMetrics != null && newVisible == true && this._graphicsClear == false)
					{
						//newCompositeMetrics.push({element:parent, metrics:rawMetrics.clone(), drawableMetrics:drawableMetrics.clone()});
						if (newCompositeMetrics[newCompositeMetricsLength] == null)
							newCompositeMetrics[newCompositeMetricsLength] = {element:parent, metrics:rawMetrics.clone(), drawableMetrics:drawableMetrics.clone()};
						else
						{
							newCompositeMetrics[newCompositeMetricsLength].element = parent;
							newCompositeMetrics[newCompositeMetricsLength].metrics.copyFrom(rawMetrics);
							newCompositeMetrics[newCompositeMetricsLength].drawableMetrics.copyFrom(drawableMetrics);
						}
						
						newCompositeMetricsLength++;
						
						//Update composite parents visible metrics
						if (parent._compositeVisibleMetrics == null)
							parent._compositeVisibleMetrics = drawableMetrics.clone();
						else
							parent._compositeVisibleMetrics.mergeExpand(drawableMetrics);
					}
					
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
					if (forceRegionUpdate == true || 		//Composite effect changed	
						this._renderChanged == true ||		//Render changed
						oldVisible != newVisible ||			//Visible changed
						drawableMetricsChanged == true ||	//Drawable region changed (clipping)
						rawMetricsChanged == true)			//Position changed
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
						
						pointRawTl.x = rawMetrics._x;
						pointRawTl.y = rawMetrics._y;
						
						pointRawTr.x = rawMetrics._x + rawMetrics._width;
						pointRawTr.y = rawMetrics._y;
						
						pointRawBr.x = rawMetrics._x + rawMetrics._width;
						pointRawBr.y = rawMetrics._y + rawMetrics._height;
						
						pointRawBl.x = rawMetrics._x;
						pointRawBl.y = rawMetrics._y + rawMetrics._height;
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
		
		this._compositeMetrics.length = newCompositeMetricsLength;
		for (i = 0; i < newCompositeMetricsLength; i++)
		{
			if (this._compositeMetrics[i] == null)
			{
				this._compositeMetrics[i] = {element:newCompositeMetrics[i].element, 
											 metrics:newCompositeMetrics[i].metrics.clone(),
											 drawableMetrics:newCompositeMetrics[i].drawableMetrics.clone()};
			}
			else
			{
				this._compositeMetrics[i].element = newCompositeMetrics[i].element;
				this._compositeMetrics[i].metrics.copyFrom(newCompositeMetrics[i].metrics);
				this._compositeMetrics[i].drawableMetrics.copyFrom(newCompositeMetrics[i].drawableMetrics);
			}
		}
		
		this._renderVisible = newVisible;
		this._renderChanged = false;
		
		//Recurse children if we were or are visible.
		if (oldVisible == true || newVisible == true)
		{
			for (i = 0; i < this._children.length; i++)
			{
				if (forceRegionUpdate == true)
					this._children[i]._forceRegionUpdate = true;
					
				this._children[i]._invalidateRedrawRegion();
			}
			
			if (this._isCompositeElement() == true)
				this._invalidateTransformRegion();
		}
	};
		
//@private	
CanvasElement.prototype._validateTransformRegion = 
	function()
	{
		//No transform of root manager, or invisible layers.
		if (this == this._manager || this._compositeVisibleMetrics == null)
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
		
		var parent = this;
		this._transformVisibleMetrics = this._compositeVisibleMetrics.clone();
		this._transformDrawableMetrics = this._compositeVisibleMetrics.clone();
		
		var clipMetrics = new DrawMetrics();
		var done = false;
		
		while (true)
		{
			if (this._transformDrawableMetrics != null && parent.getStyle("ClipContent") == true)
			{
				//Clip metrics relative to current element
				clipMetrics._x = 0;
				clipMetrics._y = 0;
				clipMetrics._width = parent._width;
				clipMetrics._height = parent._height;
				
				//Reduce drawable metrics via clipping metrics.
				this._transformDrawableMetrics.mergeReduce(clipMetrics);
				
				//Kill metrics if completely clipped
				if (this._transformDrawableMetrics._width <= 0 || this._transformDrawableMetrics._height <= 0)
				{
					this._transformDrawableMetrics = null;
					this._transformVisibleMetrics = null;
					
					return;
				}
			}
			
			if (done == true)
				break;
			
			this._transformVisibleMetrics._x += parent._x;
			this._transformVisibleMetrics._y += parent._y;
			
			this._transformDrawableMetrics._x += parent._x;
			this._transformDrawableMetrics._y += parent._y;

			shadowSize = parent.getStyle("ShadowSize");
			
			//Expand metrics for shadow
			if (shadowSize > 0 && parent.getStyle("ShadowColor") != null)
			{
				//Copy drawable metrics
				var shadowMetrics = this._transformDrawableMetrics.clone();
				
				//Create shadow position metrics
				shadowMetrics._width += (shadowSize * 2);
				shadowMetrics._height += (shadowSize * 2);
				shadowMetrics._x -= shadowSize;
				shadowMetrics._y -= shadowSize;
				shadowMetrics._x += parent.getStyle("ShadowOffsetX");
				shadowMetrics._y += parent.getStyle("ShadowOffsetY");
				
				//Merge the shadow metrics with the drawable metrics
				this._transformDrawableMetrics.mergeExpand(shadowMetrics);
			}
			
			if (CanvasElement.normalizeDegrees(parent._rotateDegrees) != 0)
			{
				//Transform visible
				pointTl.x = this._transformVisibleMetrics._x;
				pointTl.y = this._transformVisibleMetrics._y;
				
				pointTr.x = this._transformVisibleMetrics._x + this._transformVisibleMetrics._width;
				pointTr.y = this._transformVisibleMetrics._y;

				pointBr.x = this._transformVisibleMetrics._x + this._transformVisibleMetrics._width;
				pointBr.y = this._transformVisibleMetrics._y + this._transformVisibleMetrics._height;
				
				pointBl.x = this._transformVisibleMetrics._x;
				pointBl.y = this._transformVisibleMetrics._y + this._transformVisibleMetrics._height;
				
				parent.rotatePoint(pointTl, false);
				parent.rotatePoint(pointTr, false);
				parent.rotatePoint(pointBl, false);
				parent.rotatePoint(pointBr, false);
				
				minX = Math.min(pointTl.x, pointTr.x, pointBr.x, pointBl.x);
				maxX = Math.max(pointTl.x, pointTr.x, pointBr.x, pointBl.x);
				minY = Math.min(pointTl.y, pointTr.y, pointBr.y, pointBl.y);
				maxY = Math.max(pointTl.y, pointTr.y, pointBr.y, pointBl.y);
				
				this._transformVisibleMetrics._x = minX;
				this._transformVisibleMetrics._y = minY;
				this._transformVisibleMetrics._width = maxX - minX;
				this._transformVisibleMetrics._height = maxY - minY;
				
				this._transformVisibleMetrics.roundToPrecision(3);
				
				//Transform Drawable
				pointTl.x = this._transformDrawableMetrics._x;
				pointTl.y = this._transformDrawableMetrics._y;
				
				pointTr.x = this._transformDrawableMetrics._x + this._transformDrawableMetrics._width;
				pointTr.y = this._transformDrawableMetrics._y;
				
				pointBr.x = this._transformDrawableMetrics._x + this._transformDrawableMetrics._width;
				pointBr.y = this._transformDrawableMetrics._y + this._transformDrawableMetrics._height;
				
				pointBl.x = this._transformDrawableMetrics._x;
				pointBl.y = this._transformDrawableMetrics._y + this._transformDrawableMetrics._height;
				
				parent.rotatePoint(pointTl, false);
				parent.rotatePoint(pointTr, false);
				parent.rotatePoint(pointBl, false);
				parent.rotatePoint(pointBr, false);
				
				minX = Math.min(pointTl.x, pointTr.x, pointBr.x, pointBl.x);
				maxX = Math.max(pointTl.x, pointTr.x, pointBr.x, pointBl.x);
				minY = Math.min(pointTl.y, pointTr.y, pointBr.y, pointBl.y);
				maxY = Math.max(pointTl.y, pointTr.y, pointBr.y, pointBl.y);
				
				this._transformDrawableMetrics._x = minX;
				this._transformDrawableMetrics._y = minY;
				this._transformDrawableMetrics._width = maxX - minX;
				this._transformDrawableMetrics._height = maxY - minY;
				
				this._transformDrawableMetrics.roundToPrecision(3);
			}
			
			parent = parent._parent;
			
			if (parent._isCompositeElement() == true)
				done = true;
		}
	};	
	
//@private
CanvasElement.prototype._validateCompositeRender = 
	function ()
	{
		if (this._isCompositeElement() == true)
		{
			this._updateCompositeCanvas();
			
			if (this._redrawRegionMetrics != null && this._compositeCanvasMetrics != null)
			{
				//Add a 1 pixel buffer to the redraw region. 
				//This accounts for rounding errors considering redraw regions are calculated per element
				//and composite layers calculated are rendered as an aggregate.
				this._redrawRegionMetrics._x -= 1;
				this._redrawRegionMetrics._y -= 1;
				this._redrawRegionMetrics._width += 2;
				this._redrawRegionMetrics._height += 2;
				this._redrawRegionMetrics.roundUp();
				
				//Composite canvas may have shrunk to smaller than the redraw region, adjust the redraw region
				this._redrawRegionMetrics.mergeReduce(this._compositeCanvasMetrics);
				
				if (this._redrawRegionMetrics._width > 0 && this._redrawRegionMetrics._height > 0)
				{
					this._compositeCtx.clearRect(this._redrawRegionMetrics._x, this._redrawRegionMetrics._y, this._redrawRegionMetrics._width, this._redrawRegionMetrics._height);
					this._renderRedrawRegion(this);
				}
			}
		}
		else //No longer a composite element, nuke the compositing canvases
		{
			this._compositeCanvas = null;				
			this._compositeCtx = null;				
			this._compositeCanvasMetrics = null;		
		}
		
		this._compositeRenderInvalid = false;
		this._compositeEffectChanged = false;
		this._redrawRegionMetrics = null;
	};	
	
//@private	
CanvasElement.prototype._updateCompositeCanvas = 
	function ()
	{
		if (this._compositeVisibleMetrics == null)
		{
			this._compositeCanvas = null;
			this._compositeCtx = null;
			this._compositeCanvasMetrics = null;
		}
		else 
		{
			var newMetrics = this._compositeVisibleMetrics.clone();
			newMetrics.roundUp();
			
			if (this._compositeCanvas == null || this._compositeCanvasMetrics.equals(newMetrics) == false)
			{
				if (this._compositeCanvas == null)
				{
					this._compositeCanvas = document.createElement("canvas");
					this._compositeCtx = this._compositeCanvas.getContext("2d");
				}
				
				if (this._compositeCanvasMetrics == null)
					this._compositeCanvasMetrics = newMetrics;
				else
					this._compositeCanvasMetrics.copyFrom(newMetrics);
				
				this._compositeCanvas.width = this._compositeCanvasMetrics._width;
				this._compositeCanvas.height = this._compositeCanvasMetrics._height;
				
				//Translate x / y
				this._compositeCtx.setTransform(1, 0, 0, 1, this._compositeCanvasMetrics._x * -1, this._compositeCanvasMetrics._y * -1);
				
				//Expand the redraw region to this whole canvas.
				if (this._redrawRegionMetrics == null)
					this._redrawRegionMetrics = this._compositeCanvasMetrics.clone();
				else
					this._redrawRegionMetrics.mergeExpand(this._compositeCanvasMetrics);
			}
		}
	};
	
//@private	
CanvasElement.prototype._isCompositeElement = 
	function ()
	{
		if (this == this._manager)
			return true;
		
		var alpha = this.getStyle("Alpha");
		if (alpha > 0 && alpha < 1)
			return true;
		
		var rotateDegrees = CanvasElement.normalizeDegrees(this._rotateDegrees);
		if (rotateDegrees != 0)
			return true;
		
		if (this.getStyle("ShadowSize") > 0 && this.getStyle("ShadowColor") != null)
			return true;
		
		if (this.getStyle("CompositeLayer") == true)
			return true;
		
		return false;
	};
	
//@private	
CanvasElement.prototype._updateRedrawRegion = 
	function (changedMetrics)
	{
		if (changedMetrics == null || changedMetrics._width <= 0 || changedMetrics._height <= 0)
			return;
	
		if (this._redrawRegionMetrics == null)
			this._redrawRegionMetrics = changedMetrics.clone();
		else
			this._redrawRegionMetrics.mergeExpand(changedMetrics);
		
		this._invalidateCompositeRender();
	};	
	
//@private - This is here to handle a firefox bug. FF ignores clipping if shadow is applied prior to any other
//			 rendering. We draw one pixel outside the canvas bounds to make sure the clipping region gets applied.
CanvasElement.prototype._primeShadow = 
	function ()
	{
		this._compositeCtx.beginPath();
		this._compositeCtx.moveTo(this._compositeCanvasMetrics._x - 1, this._compositeCanvasMetrics._y - 1);
		this._compositeCtx.moveTo(this._compositeCanvasMetrics._x, this._compositeCanvasMetrics._y - 1);
		this._compositeCtx.moveTo(this._compositeCanvasMetrics._x, this._compositeCanvasMetrics._y);
		this._compositeCtx.moveTo(this._compositeCanvasMetrics._x - 1, this._compositeCanvasMetrics._y);
		this._compositeCtx.closePath();
		
		this._compositeCtx.fillStyle = "#000000";
		this._compositeCtx.fill();
	};
	
//@private	
CanvasElement.prototype._renderRedrawRegion = 
	function (element)
	{
		if (element._renderVisible == false)
			return;
	
		var isCompositeChildElement = false;
		if (this != element && element._isCompositeElement() == true)
			isCompositeChildElement = true;
		
		var elementGraphics = null;
		var drawableMetrics = null;
		var compositeMetrics = null;
		
		if (isCompositeChildElement == true && element._transformDrawableMetrics != null)
		{
			compositeMetrics = element._transformVisibleMetrics;
			drawableMetrics = element._transformDrawableMetrics;
			elementGraphics = element._compositeCanvas;
			
			this._compositeCtx.globalAlpha = element.getStyle("Alpha");
		}
		else if (isCompositeChildElement == false && element._compositeMetrics.length > 0 && element._graphicsClear == false)
		{
			compositeMetrics = element._compositeMetrics[0].metrics;
			drawableMetrics = element._compositeMetrics[0].drawableMetrics;
			elementGraphics = element._graphicsCanvas;
			
			this._compositeCtx.globalAlpha = 1;
		}
		
		if (elementGraphics != null &&
			drawableMetrics._width > 0 && drawableMetrics._height > 0 &&
			drawableMetrics._x < this._redrawRegionMetrics._x + this._redrawRegionMetrics._width && 
			drawableMetrics._x + drawableMetrics._width > this._redrawRegionMetrics._x && 
			drawableMetrics._y < this._redrawRegionMetrics._y + this._redrawRegionMetrics._height && 
			drawableMetrics._y + drawableMetrics._height > this._redrawRegionMetrics._y)
		{
			if (isCompositeChildElement == true && CanvasElement.normalizeDegrees(element._rotateDegrees) != 0)
			{
				var clipMetrics = drawableMetrics.clone();
				clipMetrics.mergeReduce(this._redrawRegionMetrics);
				
				this._compositeCtx.save();
				
				//Clip the region we need to re-draw
				this._compositeCtx.beginPath();
				this._compositeCtx.moveTo(clipMetrics._x, clipMetrics._y);
				this._compositeCtx.lineTo(clipMetrics._x + clipMetrics._width, clipMetrics._y);
				this._compositeCtx.lineTo(clipMetrics._x + clipMetrics._width, clipMetrics._y + clipMetrics._height);
				this._compositeCtx.lineTo(clipMetrics._x, clipMetrics._y + clipMetrics._height);
				this._compositeCtx.closePath();
				this._compositeCtx.clip();
				
				//Translate canvas to actual position
				var parent = element._parent;
				while (parent._isCompositeElement() == false)
				{
					this._compositeCtx.translate(parent._x, parent._y);
					parent = parent._parent;
				} 
				
				//Do rotation
				this._compositeCtx.translate(element._rotateCenterX, element._rotateCenterY);
				this._compositeCtx.rotate(CanvasElement.degreesToRadians(element._rotateDegrees));
				this._compositeCtx.translate(-element._rotateCenterX, -element._rotateCenterY);
			
				//Account for composite canvas translation.
				this._compositeCtx.translate(element._compositeCanvasMetrics._x, element._compositeCanvasMetrics._y);
				
				//Handle shadow
				if (element.getStyle("ShadowSize") > 0 && element.getStyle("ShadowColor") != null)
				{
					//Handle firefox bug.
					this._primeShadow();
					
					this._compositeCtx.shadowBlur = element.getStyle("ShadowSize");
					this._compositeCtx.shadowColor = element.getStyle("ShadowColor");
					
					//We need to rotate the shadow to match the element's rotation
					var shadowOffsetX = element.getStyle("ShadowOffsetX");
					var shadowOffsetY = element.getStyle("ShadowOffsetY");
					var radius = Math.sqrt((shadowOffsetX * shadowOffsetX) + (shadowOffsetY * shadowOffsetY));
					var degrees = 360 - element._rotateDegrees + CanvasElement.radiansToDegrees(Math.atan2(shadowOffsetX, shadowOffsetY));
					
					this._compositeCtx.shadowOffsetX = Math.sin(CanvasElement.degreesToRadians(degrees)) * radius;
					this._compositeCtx.shadowOffsetY = Math.cos(CanvasElement.degreesToRadians(degrees)) * radius;
				}
				
				this._compositeCtx.drawImage(
					elementGraphics, 
					0, 0, element._compositeCanvasMetrics._width, element._compositeCanvasMetrics._height, 
					element._x, element._y, element._compositeCanvasMetrics._width, element._compositeCanvasMetrics._height);
				
				this._compositeCtx.restore();
			}
			else if (isCompositeChildElement == true && element.getStyle("ShadowSize") > 0 && element.getStyle("ShadowColor") != null)
			{
				this._compositeCtx.save();
				
				var clipMetrics = drawableMetrics.clone();
				clipMetrics.mergeReduce(this._redrawRegionMetrics);
				
				//Clip the region we need to re-draw
				this._compositeCtx.beginPath();
				this._compositeCtx.moveTo(clipMetrics._x, clipMetrics._y);
				this._compositeCtx.lineTo(clipMetrics._x + clipMetrics._width, clipMetrics._y);
				this._compositeCtx.lineTo(clipMetrics._x + clipMetrics._width, clipMetrics._y + clipMetrics._height);
				this._compositeCtx.lineTo(clipMetrics._x, clipMetrics._y + clipMetrics._height);
				this._compositeCtx.closePath();
				this._compositeCtx.clip();
				
				//Handle firefox bug.
				this._primeShadow();
				
				this._compositeCtx.shadowBlur = element.getStyle("ShadowSize");
				this._compositeCtx.shadowColor = element.getStyle("ShadowColor");
				this._compositeCtx.shadowOffsetX = element.getStyle("ShadowOffsetX");
				this._compositeCtx.shadowOffsetY = element.getStyle("ShadowOffsetY");
				
				//Account for canvas edge buffer (visible - canvas)
				var destX = compositeMetrics._x - (element._compositeVisibleMetrics._x - element._compositeCanvasMetrics._x);
				var destY = compositeMetrics._y - (element._compositeVisibleMetrics._y - element._compositeCanvasMetrics._y);
				
				this._compositeCtx.drawImage(
						elementGraphics, 
						0, 0, element._compositeCanvasMetrics._width, element._compositeCanvasMetrics._height, 
						destX, destY, element._compositeCanvasMetrics._width, element._compositeCanvasMetrics._height);
				
				this._compositeCtx.restore();
			}
			else
			{
				var sourceX = 0;
				var sourceY = 0;
				
				var destX = 0;
				var destY = 0;

				var width = 0;
				var height = 0;
				
				if (drawableMetrics._x >= this._redrawRegionMetrics._x)
				{
					sourceX = drawableMetrics._x - compositeMetrics._x;
					destX = drawableMetrics._x;
					
					width = Math.min(drawableMetrics._width,  this._redrawRegionMetrics._width - (drawableMetrics._x - this._redrawRegionMetrics._x));
				}
				else
				{
					sourceX = this._redrawRegionMetrics._x - compositeMetrics._x;
					destX = this._redrawRegionMetrics._x;
					
					width = Math.min(this._redrawRegionMetrics._width,  drawableMetrics._width - (this._redrawRegionMetrics._x - drawableMetrics._x));
				}
				
				if (drawableMetrics._y >= this._redrawRegionMetrics._y)
				{
					sourceY = drawableMetrics._y - compositeMetrics._y;
					destY = drawableMetrics._y;
					
					height = Math.min(drawableMetrics._height,  this._redrawRegionMetrics._height - (drawableMetrics._y - this._redrawRegionMetrics._y));
				}
				else
				{
					sourceY = this._redrawRegionMetrics._y - compositeMetrics._y;
					destY = this._redrawRegionMetrics._y;
					
					height = Math.min(this._redrawRegionMetrics._height,  drawableMetrics._height - (this._redrawRegionMetrics._y - drawableMetrics._y));
				}
				
				this._compositeCtx.drawImage(
					elementGraphics, 
					sourceX, sourceY, width, height, 
					destX, destY, width, height);
			}
		}
		
		if (isCompositeChildElement == false)
		{
			for (var i = 0; i < element._children.length; i++)
				this._renderRedrawRegion(element._children[i]);
		}
	};			
	
/**
 * @function _invalidateStyle
 * Invalidates the supplied style and causes the system to invoke the _doStylesChanged() function.
 * This should never concievably be called and is exclusively handled by the system. 
 * This is the starting point for the element lifecycle. If you're program is dependent on 
 * _doStylesChanged() when no styles have actually changed, you might have a design issue. 
 * Do not override this function.
 * 
 * @param styleName String
 * String representing the style to be invalidated.
 */	
CanvasElement.prototype._invalidateStyle = 
	function (styleName)
	{
		if (this._stylesInvalid == false)
		{
			this._stylesInvalid = true;
			
			if (this._manager != null)
				this._manager._updateStylesQueue.addNode(this._stylesValidateNode, this._displayDepth);
		}
		
		this._stylesInvalidMap[styleName] = true;
	};	
	
/**
 * @function _invalidateMeasure
 * Invalidates the element's measured sizes and causes the system to invoke 
 * doMeasure() on the next measure phase. The system calls this automatically for all
 * existing components, this is only necessary for custom component development. 
 * This should only be called when a change is made
 * to the element that will impact its measurement. Such as property changes or from within the elements doStylesUpdated() 
 * when a style change impacts the elements measurement (such as Padding).  On rare occasions
 * you may need to re-invalidate measurement from within the doMeasure() function (such as wrapping text).
 * This will cause a 2nd measurement pass for that element which is valid (but expensive).
 * Do not override this function.
 */	
CanvasElement.prototype._invalidateMeasure = 
	function()
	{
		//Only invalidate once.
		if (this._measureInvalid == false)
		{
			this._measureInvalid = true;
			
			if (this._manager != null)
				this._manager._updateMeasureQueue.addNode(this._measureValidateNode, this._displayDepth);
		}
	};
	
/**
 * @function _invalidateLayout
 * Invalidates the elements child layout and causes the system to invoke doLayout() on
 * the next layout phase. The system calls this automatically for all existing components,
 * this is only necessary for custom component development.
 * This should only be called when a change is made to the element that will impact its layout.
 * Such as property changes or from within the elements doStylesUpdated() when a style change impacts
 * the element's layout (such as Padding). On rare occasions you may need to re-invalidate layout
 * from within the doLayout() function. An example is when a DataList adds a new DataRenderer it
 * re-invalidates layout to allow the renderer to measure before continuing layout.
 * Do not override this function.
 */	
CanvasElement.prototype._invalidateLayout = 
	function()
	{
		//Only invalidate once.
		if (this._layoutInvalid == false)
		{
			this._layoutInvalid = true;
			
			if (this._manager != null)
				this._manager._updateLayoutQueue.addNode(this._layoutValidateNode, this._displayDepth);
		}
	};	
	
/**
 * @function _invalidateRender
 * Invalidates the elements child render and causes the system to invoke doRender() on
 * the next render phase. The system calls this automatically for all existing components,
 * this is only necessary for custom component development.
 * This should only be called when a change is made to the element that will impact its rendering.
 * Such as property changes or from within the elements doStylesUpdated() when a style change impacts
 * the element's rendering (such as BackgroundFill). 
 * Do not override this function.
 */	
CanvasElement.prototype._invalidateRender =
	function ()
	{
		//Only invalidate once.
		if (this._renderInvalid == false)
		{
			this._renderInvalid = true;
			
			if (this._manager != null)
				this._manager._updateRenderQueue.addNode(this._renderValidateNode, this._displayDepth);
		}
	};	
	
//@private	
CanvasElement.prototype._invalidateRedrawRegion = 
	function ()
	{
		if (this._redrawRegionInvalid == false)
		{
			this._redrawRegionInvalid = true;
			
			if (this._manager != null)
				this._manager._updateRedrawRegionQueue.addNode(this._redrawRegionValidateNode, this._displayDepth);
		}
	};	

//@private - only called from within validateRedrawRegion()	
CanvasElement.prototype._invalidateTransformRegion = 
	function ()
	{
		this._manager._updateTransformRegionQueue.addNode(this._transformRegionValidateNode, this._displayDepth);
	};
	
//@private
CanvasElement.prototype._invalidateCompositeRender = 
	function ()
	{
		if (this._compositeRenderInvalid == false)
		{
			this._compositeRenderInvalid = true;
			
			if (this._manager != null)
				this._manager._compositeRenderQueue.addNode(this._compositeRenderValidateNode, this._displayDepth);
		}
	};
	
/**
 * @function _doStylesUpdated
 * Lifecycle method for custom component development. Never call this function directly. The system
 * calls this function in response to style changes or elements being added to the display hierarchy.
 * Override this function to handle style changes to the element. Style changes may impact other styles,
 * event listeners, layout, measurement, rendering, etc. You should call appropriate _invalidate() method per style.
 * Note that style handling should not be dependent on the *current* state of a style. This function
 * should be able to run repeatedly with the same values. An example of when this may happen is if
 * an element is temporarily removed from the display hierarchy then added back. Whenever an element is added
 * all of its styles are invalidated. This is necessary as when an element is *not* part of the display chain
 * style changes are not tracked. So when an element is added there is no way to know which styles may have changed
 * hence all of them are invalidated. 
 * 
 * @param stylesMap Object
 * An Object map containing all the style names that have been updated. Map contains entries {styleName:true}.
 * Elements should typically check this map before assuming a style has changed for performance reasons. 
 * You should always call the base method. If you wish to override the style handling behavior of a specific style, 
 * you can simply delete it from the map before passing it to the base function.
 */	
CanvasElement.prototype._doStylesUpdated = 
	function (stylesMap)
	{
		if (this._parent != null && 
			(this._parent._measureInvalid == false || this._parent._layoutInvalid == false))
		{
			if ("X" in stylesMap ||
				"Y" in stylesMap ||
				"Width" in stylesMap ||
				"Height" in stylesMap ||
				"PercentWidth" in stylesMap ||
				"PercentHeight" in stylesMap ||
				"MinWidth" in stylesMap ||
				"MinHeight" in stylesMap ||
				"MaxWidth" in stylesMap ||
				"MaxHeight" in stylesMap ||
				"Top" in stylesMap ||
				"Left" in stylesMap ||
				"Bottom" in stylesMap ||
				"Right" in stylesMap ||
				"HorizontalCenter" in stylesMap ||
				"VerticalCenter" in stylesMap ||
				"IncludeInLayout" in stylesMap ||
				"RotateDegrees" in stylesMap ||
				"RotateCenterX" in stylesMap ||
				"RotateCenterY" in stylesMap)
			{
				this._parent._invalidateMeasure();
				this._parent._invalidateLayout();
			}
		}
		
		if (this._measureInvalid == false || this._layoutInvalid == false)
		{
			if ("Padding" in stylesMap ||
				"PaddingTop" in stylesMap ||
				"PaddingBottom" in stylesMap ||
				"PaddingLeft" in stylesMap ||
				"PaddingRight" in stylesMap)
			{
				this._invalidateMeasure();
				this._invalidateLayout();
			}
			else if ("IncludeInMeasure" in stylesMap)
				this._invalidateMeasure();
		}
		
		if ("BorderThickness" in stylesMap || 
			"BorderType" in stylesMap || 
			"BorderColor" in stylesMap || 
			(this._renderFocusRing == true && ("FocusColor" in stylesMap || "FocusThickness" in stylesMap)))
		{
			this._invalidateRender();
		}
		
		if ("Visible" in stylesMap ||
			"ClipContent" in stylesMap)
		{
			this._invalidateRedrawRegion();
		}
		
		if ("Alpha" in stylesMap ||
			"ShadowSize" in stylesMap)
		{
			this._compositeEffectChanged = true;
			this._invalidateRedrawRegion();
			this._invalidateCompositeRender();
		}
		
		if ("BackgroundShape" in stylesMap)
		{
			var bgShape = this.getStyle("BackgroundShape");
			
			//Only handle if changed, attached/detached handles initial add/remove listener.
			if (bgShape != this._backgroundShape)
			{
				if (this._backgroundShape != null)
					this._backgroundShape.removeEventListener("stylechanged", this._onBackgroundShapeStyleChangedInstance);
				
				this._backgroundShape = bgShape;
				
				if (this._backgroundShape != null)
					this._backgroundShape.addEventListener("stylechanged", this._onBackgroundShapeStyleChangedInstance);
				
				this._invalidateRender();
			}
		}
		
		if ("BackgroundFill" in stylesMap)
		{
			var bgFill = this.getStyle("BackgroundFill"); //FillBase or color string
			
			//Only handle if changed, attached/detached handles initial add/remove listener.
			if (bgFill != this._backgroundFill)
			{
				//Check if new fill is solid (SolidFill or color string)
				var isSolidFillOrColor = false;
				if ((bgFill != null && bgFill instanceof FillBase == false) || bgFill instanceof SolidFill) //We're a color or a SolidFill class
					isSolidFillOrColor = true;
				
				if (this._backgroundFill instanceof SolidFill == true && isSolidFillOrColor == true) //Existing and new are both SolidFill
				{
					if (bgFill instanceof SolidFill == true) //Swap the solid fill classes
					{
						this._backgroundFill.removeEventListener("stylechanged", this._onBackgroundFillStyleChangedInstance);
						this._backgroundFill = bgFill;
						this._backgroundFill.addEventListener("stylechanged", this._onBackgroundFillStyleChangedInstance);
						
						this._invalidateRender();
					}
					else //Set the color to the current SolidFill
						this._backgroundFill.setStyle("FillColor", bgFill); //Will invalidate render if fill color changed
				}
				else //Definately different fill classes
				{
					//Purge the old background fill
					if (this._backgroundFill != null)
						this._backgroundFill.removeEventListener("stylechanged", this._onBackgroundFillStyleChangedInstance);
					
					this._backgroundFill = null;
					
					if (bgFill != null)
					{
						if (bgFill instanceof FillBase == false) //color
						{
							//Create new solid fill
							this._backgroundFill = new SolidFill();
							this._backgroundFill.setStyle("FillColor", bgFill);
						}
						else //Fill class
							this._backgroundFill = bgFill;
						
						this._backgroundFill.addEventListener("stylechanged", this._onBackgroundFillStyleChangedInstance);
					}
					
					this._invalidateRender();
				}
			}
		}
		
		if ("Cursor" in stylesMap)
		{
			var cursorDef = this.getStyle("Cursor");
			
			if (cursorDef == null && this.hasEventListener("rollover", this._onCanvasElementCursorOverOutInstance) == true)
			{
				this.removeEventListener("rollover", this._onCanvasElementCursorOverOutInstance);
				this.removeEventListener("rollout", this._onCanvasElementCursorOverOutInstance);
			}
			else if (cursorDef != null && this.hasEventListener("rollover", this._onCanvasElementCursorOverOutInstance) == false)
			{
				this.addEventListener("rollover", this._onCanvasElementCursorOverOutInstance);
				this.addEventListener("rollout", this._onCanvasElementCursorOverOutInstance);
			}
			
			this._updateRolloverCursorDefinition();
		}
		
		//Kill focus ring if disabled.
		if ("Enabled" in stylesMap && this.getStyle("Enabled") == false)
			this._setRenderFocusRing(false);
		
		if ("Visible" in stylesMap || "MouseEnabled" in stylesMap)
			this._manager._rollOverInvalid = true;
	};

//@private	
CanvasElement.prototype._updateRolloverCursorDefinition = 
	function ()
	{
		var cursorDef = this.getStyle("Cursor");
		
		if (this._rollOverCursorInstance != null && 
			(cursorDef == null || this._mouseIsOver == false))
		{
			this._manager.removeCursor(this._rollOverCursorInstance);
			this._rollOverCursorInstance = null;
		}
		else if (this._mouseIsOver == true && cursorDef != null)
		{
			if (this._rollOverCursorInstance == null)
				this._rollOverCursorInstance = this._manager.addCursor(cursorDef, 0);
			else if (this._rollOverCursorInstance.data != cursorDef)
			{
				this._manager.removeCursor(this._rollOverCursorInstance);
				this._rollOverCursorInstance = this._manager.addCursor(cursorDef, 0);
			}
		}
	};

/**
 * @function _doMeasure
 * Lifecycle method for custom component development. Never call this function directly. The system
 * calls this function in response to changes that effect measurement or elements being added to the display hierarchy.
 * Override this function to calculate the measured size of the element based on its styling, children, etc. 
 * You should set the elements measured size by calling _setMeasuredSize() from within this function.
 * 
 * @param padWidth Number
 * Simply a convienence as padding typically effects measurement (but not always) depending on the component.
 * Use any supporting functions such as _getBorderThickness that are needed to measure the element.
 * 
 * @param padHeight Number
 * Simply a convienence as padding typically effects measurement (but not always) depending on the component.
 * Use any supporting functions such as _getBorderThickness that are needed to measure the element.
 */		
CanvasElement.prototype._doMeasure = 
	function (padWidth, padHeight)
	{
		//Stub for override.
	
		this._setMeasuredSize(padWidth, padHeight);
	};
	
/**
 * @function _doLayout
 * Lifecycle method for custom component development. Never call this function directly. The system
 * calls this function in response to changes that effect layout or elements being added to the display hierarchy.
 * Override this function to layout its children. You should call layout functions such as _setActualPosition() and
 * _setActualSize() on child elements from within this function. Sometimes you may need to add/remove additional elements
 * during layout such as when a Datagrid or Viewport adds/removes scroll bars. Keep in mind that adding/removing elements
 * automatically re-invalidates layout, so its best to bail out and wait for the next layout pass for best performance
 * under this scenario.
 * 
 * @param paddingMetrics DrawMetrics
 * Contains metrics to use after considering the element's padding. Simply a convienence as padding typically 
 * effects layout (but not always) depending on the component. Use any supporting functions such as _getBorderMetrics()
 * that are needed to layout the element.
 */		
CanvasElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		//Stub for override.
	};	
	
/**
 * @function _doRender
 * Lifecycle method for custom component development. Never call this function directly. The system
 * calls this function in response to changes that effect rendering or elements being added to the display hierarchy.
 * Override this function to render the element. Keep in mind that any child elements are rendered on top of this
 * element. This function is typically not needed unless rendering a very primitive object such as a custom skin or 
 * a display object that cannot be handled via a BackgroundShape class and/or _fillBackground() function.
 * Most advanced objects should use skins and other means to render themselves.
 * 
 * CanvasElement draws its background and border via supplied shape and gradient settings.
 */		
CanvasElement.prototype._doRender =
	function()
	{
		var borderMetrics = this._getBorderMetrics();
		
		if (this._renderFocusRing == true)
		{
			//ctx.save();
			//this._drawFocusRing(borderMetrics);
			//ctx.restore();
		}
		
		this._fillBackground(borderMetrics);
		
		this._drawBorder(borderMetrics);
	};
	
	
//////////DataRenderer Dynamic Properties/////////////////
	
/**
 * @function _setListData
 * This function is called when the element is being used as a DataRenderer for containers
 * like DataList and DataGrid. Override this function to make any changes to the DataRenderer
 * per the supplied DataListData and itemData objects. Update any styles, states, add/remove children, call any
 * necessary _invalidate() functions, etc.
 * 
 * @param listData DataListData
 * A DataListData or subclass object passed by the parent DataList or subclass with data necessary
 * to update the DataRender like the parent DataList reference and row/column index being rendered.
 * 
 * @param itemData Object
 * The data Object (such as row data) supplied by the implementor's ListCollection to render the row/column DataRenderer.
 */	
CanvasElement.prototype._setListData = 
	function (listData, itemData)
	{
		this._listData = listData;
		this._itemData = itemData;
	};

/**
 * @function _setListSelected
 * This function is called when the element is being used as a DataRenderer for containers
 * like DataList and DataGrid to change the DataRenderer's selection state. 
 * Override this function to make any changes to the DataRenderer per the selection state.
 * Update any styles, states, add/remove children, call any necessary _invalidate() functions, etc.
 * 
 * @param selectedData Any
 * Selected data, differs per container.
 */	
CanvasElement.prototype._setListSelected = 
	function (selectedData)
	{
		this._listSelected = selectedData;
	};	
	
	