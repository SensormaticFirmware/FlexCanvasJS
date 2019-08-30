
/**
 * @depends CanvasElement.js
 */

///////////////////////////////////////////////////////////////////////////	
///////////////////////ContainerBaseElement////////////////////////////////

/**
 * @class ContainerBaseElement
 * @inherits CanvasElement
 * 
 * Abstract base class for Container elements. Wraps internal child modification functions
 * such as _addChild() and _removeChild() with public functions such as addElement() and removeElement() 
 * for proper index management when using skins and overlays in conjunction with content children. 
 * 
 * Container children are not all considered equal. Content children added via the addElement() and removeElement()
 * functions maintain their own indexes and are placed in between raw children, such as skins, which render
 * underneath and overlay children which render above (elements intended to always be on top of content children).
 * 
 * Raw children added via _addChild() or _addChildAt() will be indexed before content children.
 * Content children added via addElement() or addElementAt() will be indexed after raw children and before overlay children.
 * Overlay children added via _addOverlayChild() will be index last, after content children.
 * All 3 lists maintain their own indexes.
 * 
 * @constructor ContainerBaseElement 
 * Creates new ContainerBaseElement instance.
 */

function ContainerBaseElement()
{
	ContainerBaseElement.base.prototype.constructor.call(this);
	
	//Storage for user added elements.
	this._elements = [];
	
	//Children that come after user added elements
	this._overlayChildren = [];
}	
	
//Inherit from CanvasElement
ContainerBaseElement.prototype = Object.create(CanvasElement.prototype);
ContainerBaseElement.prototype.constructor = ContainerBaseElement;
ContainerBaseElement.base = CanvasElement;
	

/////////////Style Types///////////////////////////////

ContainerBaseElement._StyleTypes = Object.create(null);

/**
 * @style ClipContent boolean
 * @inheritable
 * 
 * Determines if out of bounds rendering is allowed. If true the element will clip all rendering
 * and children's rendering to the elements bounding box. This style is inheritable for container elements.
 */
ContainerBaseElement._StyleTypes.ClipContent = 			StyleableBase.EStyleType.INHERITABLE;		// number (true || false)


/////////////Default Styles///////////////////////////////

ContainerBaseElement.StyleDefault = new StyleDefinition();
ContainerBaseElement.StyleDefault.setStyle("ClipContent",						true);


////////////ContainerBaseElement Public Functions//////////////////////////

//Expose child modification functions.

/**
 * @function addElement
 * Adds a content child element to the end of this element's content child list.
 * 
 * @param element CanvasElement
 * CanvasElement to be added as a content child of this element.
 * 
 * @returns CanvasElement
 * Returns the element just added.
 */	
ContainerBaseElement.prototype.addElement = 
	function (element)
	{
		return this.addElementAt(element, this._elements.length);
	};

/**
 * @function addElementAt
 * Inserts a content child element to this element's content child list at the specified index.
 * 
 * @param element CanvasElement
 * CanvasElement to be added as a content child of this element.
 * 
 * @param index int
 * Child index to insert the element.
 * 
 * @returns CanvasElement
 * Returns the element just added when successful, null if the element could not
 * be added due to the index being out of range.
 */		
ContainerBaseElement.prototype.addElementAt = 
	function (element, index)
	{
		if (!(element instanceof CanvasElement))
			return null;
	
		if (index < 0 || index > this._elements.length)
			return null;
		
		var childIndex = this._children.length - this._overlayChildren.length - this._elements.length + index;
		
		this._elements.splice(index, 0, element);
		ContainerBaseElement.base.prototype._addChildAt.call(this, element, childIndex);
		
		return element;
	};
	
/**
 * @function removeElement
 * Removes a content child element from this element's content children list.
 * 
 * @param element CanvasElement
 * Content child to be removed.
 * 
 * @returns CanvasElement
 * Returns the CanvasElement just removed if successful, null if the
 * element could not be removed due to it not being a content child of this element.
 */		
ContainerBaseElement.prototype.removeElement = 
	function (element)
	{
		var index = this._elements.indexOf(element);
		return this.removeElementAt(index);
	};
	
/**
 * @function removeElementAt
 * Removes a content child element at specified index.
 * 
 * @param index int
 * Content index to be removed.
 * 
 * @returns CanvasElement
 * Returns the CanvasElement just removed if successful, null if the element could
 * not be removed due it it not being a child of this element, or index out of range.
 */			
ContainerBaseElement.prototype.removeElementAt = 
	function (index)
	{
		if (index < 0 || index >= this._elements.length)
			return null;
	
		var childIndex = this._children.length - this._overlayChildren.length - this._elements.length + index;

		this._elements.splice(index, 1);
		return ContainerBaseElement.base.prototype._removeChildAt.call(this, childIndex);
	};

/**
 * @function getElementAt
 * Gets the content child element at the supplied index.
 * 
 * @param index int
 * Content index of child element to return;
 * 
 * @returns CanvasElement
 * The CanvasElement at the supplied index, or null if index is out of range. 
 */		
ContainerBaseElement.prototype.getElementAt = 
	function (index)
	{
		if (index < 0 || index >= this._elements.length)
			return null;
		
		return this._elements[index];
	};
	
/**
 * @function getElementIndex
 * Returns the index of the supplied content child element.
 * 
 * @param element CanvasElement
 * Content child element to return the index.
 * 
 * @returns int
 * Returns the child index or -1 if the element is not
 * a content child of this element.
 */		
ContainerBaseElement.prototype.getElementIndex = 
	function (element)
	{
		return this._elements.indexOf(element);
	};

/**
 * @function setElementIndex
 * Changes a content child element's index. 
 * 
 * @param element CanvasElement
 * Content child element to change index.
 * 
 * @param index int
 * New content index of the content child element.
 * 
 * @returns boolean
 * Returns true if the child's index is successfully changed, false if the element
 * is not a content child of this element or the index is out of range.
 */		
ContainerBaseElement.prototype.setElementIndex = 
	function (element, index)
	{
		if (index < 0 || index >= this._elements.length)
			return false;
		
		var currentIndex = this._elements.indexOf(element);
		if (currentIndex == -1 || currentIndex == index)
			return false;
		
		var childIndex = this._children.length - this._overlayChildren.length - this._elements.length + index;
		
		this._elements.splice(index, 0, this._elements.splice(currentIndex, 1)[0]);
		ContainerBaseElement.base.prototype._setChildIndex.call(this, element, childIndex);
		
		return true;
	};
	
/**
 * @function getNumElements
 * Gets this elements number of content children.
 * 
 * @returns int
 * The number of content child elements.
 */		
ContainerBaseElement.prototype.getNumElements = 
	function ()
	{
		return this._elements.length;
	};

/**
 * @function _addOverlayChild
 * Adds an overlay child element to the end of this element's overlay child list.
 * 
 * @param element CanvasElement
 * Element to be added as an overlay child of this element.
 * 
 * @returns CanvasElement
 * Returns the element just added.
 */		
ContainerBaseElement.prototype._addOverlayChild = 
	function (element)
	{
		return this._addOverlayChildAt(element, this._overlayChildren.length);
	};
	
/**
 * @function _addOverlayChildAt
 * Inserts an overlay child element to this elements overlay child list at the specified index.
 * 
 * @param element CanvasElement
 * Element to be added as an overlay child of this element.
 * 
 * @returns CanvasElement
 * Returns the element just added when successful, null if the element could not
 * be added due to the index being out of range.
 */			
ContainerBaseElement.prototype._addOverlayChildAt = 
	function (element, index)
	{
		if (!(element instanceof CanvasElement))
			return null;
	
		if (index < 0 || index > this._overlayChildren.length)
			return null;
		
		var childIndex = this._children.length - this._overlayChildren.length + index;
		
		this._overlayChildren.splice(index, 0, element);
		ContainerBaseElement.base.prototype._addChildAt.call(this, element, childIndex);
		
		return element;
	};	

/**
 * @function _removeOverlayChild
 * Removes an overlay child element from this elements overlay child list.
 * 
 * @param element CanvasElement
 * Overlay child to be removed.
 * 
 * @returns CanvasElement
 * Returns the element just removed if successful, null if the
 * element could not be removed due to it not being an overlay child of this element.
 */		
ContainerBaseElement.prototype._removeOverlayChild = 
	function (element)
	{
		var index = this._overlayChildren.indexOf(element);
		return this._removeOverlayChildAt(index);
	};

/**
 * @function _removeOverlayChildAt
 * Removes an overlay child element at specified index.
 * 
 * @param index int
 * Overlay index to be removed.
 * 
 * @returns CanvasElement
 * Returns the element just removed if successful, null if the element could
 * not be removed due it it not being an overlay child of this element, or index out of range.
 */			
ContainerBaseElement.prototype._removeOverlayChildAt = 
	function (index)
	{
		if (index < 0 || index >= this._overlayChildren.length)
			return null;
		
		var childIndex = this._children.length - this._overlayChildren.length + index;

		this._overlayChildren.splice(index, 1);
		return ContainerBaseElement.base.prototype._removeChildAt.call(this, childIndex);
	};	

/**
 * @function _getOverlayChildAt
 * Gets the overlay child element at the supplied index.
 * 
 * @param index int
 * Overlay index of child element to return;
 * 
 * @returns CanvasElement
 * The element at the supplied overlay index, or null if index is out of range. 
 */		
ContainerBaseElement.prototype._getOverlayChildAt = 
	function (index)
	{
		if (index < 0 || index >= this._overlayChildren.length)
			return null;
		
		return this._overlayChildren[index];
	};	
	
/**
 * @function _getOverlayChildIndex
 * Returns the overlay index of the supplied child element.
 * 
 * @param element CanvasElement
 * Child element to return the overlay index.
 * 
 * @returns int
 * Returns the child's overlay index or -1 if the element is not
 * an overlay child of this element.
 */		
ContainerBaseElement.prototype._getOverlayChildIndex = 
	function (element)
	{
		return this._overlayChildren.indexOf(element);
	};	
	
/**
 * @function _setOverlayChildIndex
 * Changes an overlay child element's overlay index. 
 * 
 * @param element CanvasElement
 * Overlay child element to change index.
 * 
 * @param index int
 * New overlay index of the child element.
 * 
 * @returns boolean
 * Returns true if the child's index is successfully changed, false if the element
 * is not an overlay child of this element or the index is out of range.
 */		
ContainerBaseElement.prototype._setOverlayChildIndex = 
	function (element, index)
	{
		if (index < 0 || index >= this._overlayChildren.length)
			return false;
		
		var currentIndex = this._overlayChildren.indexOf(element);
		if (currentIndex < 0 || currentIndex == index)
			return false;
		
		var childIndex = this._children.length - this._overlayChildren.length + index;
		
		this._overlayChildren.splice(index, 0, this._overlayChildren.splice(currentIndex, 1)[0]);
		ContainerBaseElement.base.prototype._setChildIndex.call(this, element, childIndex);
		
		return true;
	}; 	
	
/**
 * @function _getNumOverlayChildren
 * Gets this elements number of overlay children.
 * 
 * @returns int
 * The number of overlay child elements.
 */		
ContainerBaseElement.prototype._getNumOverlayChildren = 
	function ()
	{
		return this._overlayChildren.length;
	};
	
//Override - Add the child before elements & overlay
ContainerBaseElement.prototype._addChild = 
	function (element)
	{
		var index = this._children.length - this._elements.length - this._overlayChildren.length;
		return ContainerBaseElement.base.prototype._addChildAt.call(this, element, index);
	};
	
//Override - Dont allow insertion into elements or overlay range
ContainerBaseElement.prototype._addChildAt = 
	function (element, index)
	{
		var maxIndex = this._children.length - this._elements.length - this._overlayChildren.length;
		
		if (index < 0 || index > maxIndex)
			return null;
		
		return ContainerBaseElement.base.prototype._addChildAt.call(this, element, index);
	};

//Override - Remove from element or overlay if necessary
ContainerBaseElement.prototype._removeChildAt = 
	function (index)
	{
		if (index < 0 || index >= this._children.length)
			return null;
		
		var element = this._children[index];
		
		var subIndex = this._elements.indexOf(element);
		if (subIndex >= 0)
			return this.removeElementAt(subIndex);
		
		subIndex = this._overlayChildren.indexOf(element);
		if (subIndex >= 0)
			return this._removeOverlayChildAt(subIndex);
		
		return ContainerBaseElement.base.prototype._removeChildAt.call(this, index);
	};

//@Override	- Dont allow swapping in or out of element & overlay ranges.
ContainerBaseElement.prototype._setChildIndex = 
	function (element, index)
	{
		var maxIndex = this._children.length - this._elements.length - this._overlayChildren.length;
	
		if (index < 0 || index >= maxIndex)
			return false;
		
		var currentIndex = this._getChildIndex(element);
		if (currentIndex < 0 || currentIndex >= maxIndex || currentIndex == index)
			return false;
		
		return ContainerBaseElement.base.prototype._setChildIndex.call(this, element, index);
	};
	
	