
/**
 * @depends CanvasElement.js
 * @depends DataRendererLabelElement.js
 */

///////////////////////////////////////////////////////////////////////
///////////////////////DataListElement/////////////////////////////////		
	
/**
 * @class DataListElement
 * @inherits CanvasElement
 * 
 * DataListElement is a data-driven container that renders items in a 
 * horizontal or vertical orientation via a supplied ListCollection and a supplied DataRenderer class.
 * A DataRenderer is any CanvasElement that implements _setListData() and _setListSelected()
 * and is used to render the corresponding ListCollection item. A scroll bar will be added
 * if the collection size exceeds the available area. DataListElement only renders visible 
 * DataRenderers so collection size does not impact performance.
 * 
 * DataRendereBaseElement is an abstract base class that implements common
 * features and can be sub-classed if desired.
 * 
 * The default DataRenderer is the DataRendererLabelElement which renders
 * a text label per the LabelFunction style. 
 * 
 * @seealso DataRendererBaseElement
 * @seealso DataRendererLabelElement
 * 
 * 
 * @constructor DataListElement 
 * Creates new DataListElement instance.
 */
function DataListElement()
{
	DataListElement.base.prototype.constructor.call(this);
	
	this._listCollection = null; //Data collection
	
	this._contentSize = 0;
	
	this._scrollBar = null;
	this._scrollIndex = 0;
	
	this._selectedIndex = -1;
	this._selectedItem = null;
	
	this._contentPane = new CanvasElement();
	this._contentPane.setStyle("ClipContent", true);
	this._addChild(this._contentPane);
	
	var _self = this;
	
	//Private event listener, need an instance for each DataList, proxy to prototype.
	this._onDataListCollectionChangedInstance = 
		function (collectionChangedEvent)
		{
			_self._onDataListCollectionChanged(collectionChangedEvent);
		};
		
	this._onDataListScrollBarChangedInstance = 
		function (elementEvent)
		{
			_self._onDataListScrollBarChanged(elementEvent);
		};
		
	this._onDataListMouseWheelEventInstance = 
		function (elementMouseWheelEvent)
		{
			_self._onDataListMouseWheelEvent(elementMouseWheelEvent);
		};
	
	this._onDataListRendererClickInstance = 
		function (elementMouseEvent)
		{
			_self._onDataListRendererClick(elementMouseEvent);
		};
		
	this.addEventListener("wheel", this._onDataListMouseWheelEventInstance);	
}

//Inherit from SkinnableElement
DataListElement.prototype = Object.create(CanvasElement.prototype);
DataListElement.prototype.constructor = DataListElement;
DataListElement.base = CanvasElement;

/**
 * @function DefaultItemLabelFunction
 * @static
 * Default ItemLabelFunction function. Looks for typeof String or "label" property of supplied itemData.
 * 
 * @param itemData Object
 * Collection item to extract label text.
 * 
 * @returns String
 * Label text.
 */
DataListElement.DefaultItemLabelFunction = 
	function (itemData)
	{
		if (itemData == null)
			return "";
		
		if (typeof itemData === "string" || itemData instanceof String)
			return itemData;
	
		if ("label" in itemData)
			return itemData["label"];
		
		return itemData.toString();
	};


/////////////Events///////////////////////////////

/**
 * @event changed ElementEvent
 * Dispatched when the selected item/index changes as a result of user interaction.
 * 
 * @event listitemclick ElementListItemClickEvent
 * Dispatched when a DataRenderer is clicked. Includes associated collection item/index.
 */



/////////////Style Types////////////////////////////////////////////

DataListElement._StyleTypes = Object.create(null);

/**
 * @style ListDirection String
 * 
 * Determines the layout direction of this DataList. Allowable values are "horizontal" or "vertical".
 */
DataListElement._StyleTypes.ListDirection = 					{inheritable:false};		// "horizontal" || "vertical

/**
 * @style ListAlign String
 * 
 * Determines the alignment of content when there is not enough data in the ListCollection to fill the DataList.
 * Allowable values are "left", "center", "right" for horizontal layout, and "top", "middle", "bottom" for vertical layout. 
 */
DataListElement._StyleTypes.ListAlign = 						{inheritable:false};		// "left" || "center" || "right" / "top" || "middle" || "bottom"

/**
 * @style Selectable boolean
 * 
 * When true, list items can be selected and the DataList will dispatch "changed" events.
 */
DataListElement._StyleTypes.Selectable = 						{inheritable:false};		// true || false

/**
 * @style ScrollBarDisplay String
 * 
 * Determines the behavior of the scroll bar. Allowable values are "on", "off", and "auto".
 */
DataListElement._StyleTypes.ScrollBarDisplay = 					{inheritable:false};		// "on" || "off" || "auto"

/**
 * @style ScrollBarPlacement String
 * 
 * Determines the placement of the scroll bar. 
 * Allowable values are "top" or "bottom" for horizontal layout and "left" or "right" for vertical layout.
 */
DataListElement._StyleTypes.ScrollBarPlacement = 				{inheritable:false};		// "top" || "bottom" / "left || "right"

/**
 * @style ScrollBarStyle StyleDefinition
 * 
 * The StyleDefinition to be applied to the scroll bar.
 */
DataListElement._StyleTypes.ScrollBarStyle = 					{inheritable:false};		// StyleDefinition

//Returns the string to use for the label per provided data.
/**
 * @style ItemLabelFunction Function
 * 
 * A function that returns a text string per a supplied collection item.
 * function (itemData) { return "" }
 */
DataListElement._StyleTypes.ItemLabelFunction = 				{inheritable:false}; 		// function (itemData) { return "" }

/**
 * @style ListItemClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the DataRenderer.
 */
DataListElement._StyleTypes.ListItemClass = 					{inheritable:false};		//DataRendererBaseElement constructor()

/**
 * @style ListItemStyle StyleDefinition
 * 
 * The StyleDefinition to be applied to the DataRenderer.
 */
DataListElement._StyleTypes.ListItemStyle = 					{inheritable:false};		//StyleDefinition


///////////Default Styles////////////////////////////////////

DataListElement.StyleDefault = new StyleDefinition();

DataListElement.StyleDefault.setStyle("ListDirection", 				"vertical");								// "horizontal" || "vertical
DataListElement.StyleDefault.setStyle("ListAlign", 					"top");										// "left" || "center" || "right" / "top" || "middle" || "bottom"

DataListElement.StyleDefault.setStyle("ItemLabelFunction", 			DataListElement.DefaultItemLabelFunction);	// function (data) { return "" }

DataListElement.StyleDefault.setStyle("ListItemClass", 				DataRendererLabelElement); 					// Element constructor()
DataListElement.StyleDefault.setStyle("ListItemStyle", 				null);										// StyleDefinition

DataListElement.StyleDefault.setStyle("Selectable", 				true);										// true || false

DataListElement.StyleDefault.setStyle("ScrollBarDisplay", 			"auto");									// "on" || "off" || "auto"
DataListElement.StyleDefault.setStyle("ScrollBarPlacement", 		"right");									// "top" || "bottom" / "left || "right"
DataListElement.StyleDefault.setStyle("ScrollBarStyle", 			null);										// StyleDefinition


/////////DataRenderer Proxy Map/////////////////////////////

//Proxy map for styles we want to pass to the DataRenderer.
DataListElement._DataRendererProxyMap = Object.create(null);

DataListElement._DataRendererProxyMap.Selectable = 				true;
DataListElement._DataRendererProxyMap._Arbitrary = 				true;


/////////////Public///////////////////////////////

/**
 * @function setSelectedIndex
 * Sets the selected collection index/item.
 * 
 * @param index int
 * The collection index to be selected.
 */	
DataListElement.prototype.setSelectedIndex = 
	function (index)
	{
		if (this._selectedIndex == index)
			return true;
		
		if (index > this._listCollection.length -1)
			return false;
		
		if (index < -1)
			index = -1;
		
		var oldIndex = this._selectedIndex;
		
		this._selectedIndex = index;
		this._selectedItem = this._listCollection.getItemAt(index);
		
		//Update renderer data.
		if (this._contentPane._children.length > 0)
		{
			var firstIndex = this._contentPane._children[0]._listData._itemIndex;
			var lastIndex = this._contentPane._children[this._contentPane._children.length - 1]._listData._itemIndex;
			
			if (index != null && index >= firstIndex && index <= lastIndex)
				this._contentPane._children[index - firstIndex]._setListSelected(true);
			if (oldIndex != null && oldIndex >= firstIndex && oldIndex <= lastIndex)
				this._contentPane._children[oldIndex - firstIndex]._setListSelected(false);
		}
		
		return true;
	};

/**
 * @function getSelectedIndex
 * Gets the selected collection index. 
 * 
 * @returns int
 * The selected collection index or -1 if none selected.
 */		
DataListElement.prototype.getSelectedIndex = 
	function ()
	{
		return this._selectedIndex;
	};
	
/**
 * @function setSelectedItem
 * Sets the selected collection item/index.
 * 
 * @param item Object
 * The collection item to be selected.
 */	
DataListElement.prototype.setSelectedItem = 
	function (item)
	{
		var index = this._listCollection.getItemIndex(item);
		this.setSelectedIndex(index);
	};
	
/**
 * @function getSelectedItem
 * Gets the selected collection item. 
 * 
 * @returns Object
 * The selected collection item or null if none selected.
 */		
DataListElement.prototype.getSelectedItem = 
	function ()
	{
		return this._selectedItem;
	};
	
/**
 * @function setScrollIndex
 * Sets the collection item index to scroll too. 
 * 
 * @param scrollIndex int
 * Collection item index.
 */	
DataListElement.prototype.setScrollIndex = 
	function (scrollIndex)
	{
		this._invalidateLayout();
		
		if (this._contentPane._children.length == 0 || this._listCollection == null)
		{
			this._scrollIndex = 0;
			
			//No data, purge the renderers.
			while (this._contentPane._children.length > 0)
				this._contentPane._removeChildAt(0);
			
			return;
		}
		
		if (scrollIndex >= this._listCollection.getLength())
			scrollIndex = this._listCollection.getLength() - 1;
		if (scrollIndex < 0)
			scrollIndex = 0;		
		
		this._scrollIndex = scrollIndex;
		
		var itemIndex = Math.floor(scrollIndex);
		var currentIndex = this._contentPane._children[0]._listData._itemIndex;
		
		var renderer = null;
		
		if (itemIndex == currentIndex - 1) //Move bottom renderer to top
		{
			renderer = this._contentPane._children[this._contentPane._children.length - 1];
			this._contentPane._setChildIndex(renderer, 0);
			
			this._updateRendererData(renderer, itemIndex);
		}
		else if (itemIndex == currentIndex + 1) //Move top renderer to bottom (or delete)
		{
			if (this._listCollection.getLength() >= itemIndex + this._contentPane._children.length)
			{
				renderer = this._contentPane._children[0];
				this._contentPane._setChildIndex(renderer, this._contentPane._children.length - 1);
				
				this._updateRendererData(renderer, itemIndex + this._contentPane._children.length - 1);
			}
			else //No more data, purge the renderer.
				this._contentPane._removeChildAt(0);
		}
		else //Reset renderer data. (Even if index hasnt changed, we call this if the collection is sorted or changed)
		{
			for (var i = 0; i < this._contentPane._children.length; i++)
			{
				if (this._listCollection.getLength() > itemIndex + i)
				{
					//Update list data
					renderer = this._contentPane._children[i];
					this._updateRendererData(renderer, itemIndex + i);
				}
				else
				{
					//No more data, purge the rest of the renderers.
					while (this._contentPane._children.length > i)
						this._contentPane._removeChildAt(i);
				}
			}
		}
	};

/**
 * @function setListCollection
 * Sets the DataLists's associated ListCollection to generate DataRenderers.
 * 
 * @param listCollection ListCollection
 * The ListCollection to be used as the data-provider.
 */	
DataListElement.prototype.setListCollection = 
	function (listCollection)
	{
		if (this._listCollection == listCollection)
			return;
	
		if (this._manager == null)
		{
			this._listCollection = listCollection;
		}
		else
		{
			if (this._listCollection != null)
				this._listCollection.removeEventListener("collectionchanged", this._onDataListCollectionChangedInstance);
			
			this._listCollection = listCollection;
			
			if (this._listCollection != null)
				this._listCollection.addEventListener("collectionchanged", this._onDataListCollectionChangedInstance);
		}
		
		//Fix selected index/item
		if (this._listCollection == null)
		{
			this._selectedIndex = -1;
			this._selectedItem = null;
		}
		else
		{
			if (this._selectedItem != null)
			{
				this._selectedIndex = this._listCollection.getItemIndex(this._selectedItem);
				
				if (this._selectedIndex == -1)
					this._selectedItem = null;
			}
		}
		
		this.setScrollIndex(this._scrollIndex); //Reset renderer data.
		this._invalidateLayout();
	};
	
/**
 * @function getListCollection
 * Gets the DataLists's associated ListCollection. 
 * 
 * @returns ListCollection
 * The associated ListCollection or null if none assigned.
 */		
DataListElement.prototype.getListCollection = 
	function ()
	{
		return this._listCollection;
	};	
	
///////////Internal//////////////////////////////
	
/**
 * @function _getContentSize
 * Gets the content size of the DataList. This is only accurate after the DataList
 * has finished its layout phase. Currently only used by the Dropdown to fix the
 * vertical height of the drop down pop-up list when there are too few items.
 * 
 * @returns Number
 * Content size in pixels of the DataListElement. Only valid after layout phase completed.
 */	
//Helpers function (currently only used by dropdown) ///
DataListElement.prototype._getContentSize = 
	function ()
	{
		var paddingSize = this._getPaddingSize();
	
		if (this.getStyle("ListDirection") == "vertical")
			return this._contentSize + paddingSize.height;
		else //if (this.getStyle("ListDirection") == "horizontal")
			return this._contentSize + paddingSize.width;
	};

/**
 * @function _getNumRenderers
 * Gets the number of DataRenderers that are currently being rendered.
 * 
 * @returns int
 * the number of DataRenderers that are currently being rendered.
 */	
DataListElement.prototype._getNumRenderers = 
	function ()
	{
		return this._contentPane._children.length;
	};	
	
/**
 * @function _onDataListMouseWheelEvent
 * Event handler for the DataList "wheel" event. Starts the scroll bar tween.
 * 
 * @param elementMouseWheelEvent ElementMouseWheelEvent
 * The ElementMouseWheelEvent to process.
 */		
DataListElement.prototype._onDataListMouseWheelEvent = 
	function (elementMouseWheelEvent)
	{
		if (elementMouseWheelEvent.getDefaultPrevented() == true)
			return;
	
		//No renderers or event prevented.
		if (this._contentPane._children.length == 0 || this._listCollection.getLength() == 0)
			return;
	
		var delta = 0;
		var listDirection = this.getStyle("ListDirection");
		
		var minScrolled = false;
		var maxScrolled = false;
		
		var firstRenderer = this._contentPane._children[0];
		var lastRenderer = this._contentPane._children[this._contentPane._children.length - 1];
		
		if (listDirection == "horizontal")
		{
			delta = elementMouseWheelEvent.getDeltaX();
			
			if (delta == 0)
				return;
			
			if (firstRenderer._listData._itemIndex == 0 && 
				firstRenderer._x >= 0)
			{
				minScrolled = true;
			}
			
			if (minScrolled == true && delta < 0)
				return;
			
			if (lastRenderer._listData._itemIndex == this._listCollection.getLength() - 1 && 
				lastRenderer._x <= this._contentPane._width - lastRenderer._width)
			{
				maxScrolled = true;
			}
			
			if (maxScrolled == true && delta > 0)
				return;
		}
		else //if (listDirection == "vertical")
		{
			delta = elementMouseWheelEvent.getDeltaY();
			
			if (delta == 0)
				return;
			
			if (firstRenderer._listData._itemIndex == 0 && 
				firstRenderer._y >= 0)
			{
				minScrolled = true;
			}
			
			if (minScrolled == true && delta < 0)
				return;
			
			if (lastRenderer._listData._itemIndex == this._listCollection.getLength() - 1 && 
				lastRenderer._y <= this._contentPane._height - lastRenderer._height)
			{
				maxScrolled = true;
			}
			
			if (maxScrolled == true && delta > 0)
				return;
		}
		
		if (this._scrollBar != null)
		{
			var tweeningTo = this._scrollBar.getTweenToValue();
			if (tweeningTo == null)
				tweeningTo = this._scrollIndex;
			
			this._scrollBar.startScrollTween(tweeningTo + delta);
		}
		else
			this.setScrollIndex(this._scrollIndex + delta);
		
		//We've consumed the wheel event, don't want parents double scrolling.
		elementMouseWheelEvent.preventDefault();
	};	

/**
 * @function _onDataListScrollBarChanged
 * Event handler for the scroll bar "changed" event. Updates DataRenderers.
 * 
 * @param elementEvent ElementEvent
 * The ElementEvent to process.
 */		
DataListElement.prototype._onDataListScrollBarChanged = 
	function (elementEvent)
	{
		var scrollValue = this._scrollBar.getScrollValue();
		var scrollPageSize = this._scrollBar.getScrollPageSize();
		var scrollViewSize = this._scrollBar.getScrollViewSize();
		
		//Fix for issue where last renderer is larger than first, resulting in exponential adjustments 
		//due to view size shrinking / scroll range increasing at the same time as scroll. We check if the
		//scroll bar hit the end and increment the Lists scroll index rather than taking the scroll bar value.
		if (scrollValue == scrollPageSize - scrollViewSize && scrollValue - this._scrollIndex < 1)
			scrollValue = this._scrollIndex + 1;
	
		this.setScrollIndex(scrollValue);
	};
	
/**
 * @function _onDataListCollectionChanged
 * Event handler for the ListCollection "collectionchanged" event. Updates DataRenderers.
 * 
 * @param collectionChangedEvent CollectionChangedEvent
 * The CollectionChangedEvent to process.
 */		
DataListElement.prototype._onDataListCollectionChanged = 
	function (collectionChangedEvent)
	{
		var type = collectionChangedEvent.getKind();
		var index = collectionChangedEvent.getIndex();
	
		//Always invalidate layout (we need to adjust the scroll bar)
		this._invalidateLayout();
		
		if (this._contentPane._children.length == 0)
			return;
	
		//Reset all renderers (collection was cleared, or swapped)
		if (type == "reset")
		{
			//Fix selected index/item
			if (this._selectedItem != null)
			{
				this._selectedIndex = this._listCollection.getItemIndex(this._selectedItem);
				
				if (this._selectedIndex == -1)
					this._selectedItem = null;
			}
			
			this.setScrollIndex(this._scrollIndex); //Reset renderer data.
		}
		else
		{
			var firstIndex = 0;
			var lastIndex = 0;
			
			if (this._contentPane._children.length > 0)
			{
				firstIndex = this._contentPane._children[0]._listData._itemIndex;
				lastIndex = this._contentPane._children[this._contentPane._children.length - 1]._listData._itemIndex;
			}
			
			if (this._selectedIndex == index && type == "remove") //We removed the selected item.
			{
				this._selectedIndex = -1;
				this._selectedItem = null;
			}
			
			if (index <= lastIndex && (type == "add" || type == "remove"))
			{
				//Adjust selected index
				if (index <= this._selectedIndex)
				{
					if (type == "add")
						this._selectedIndex++;
					else // if (type == "remove)
						this._selectedIndex--;
				}
				
				if (index < firstIndex)
				{
					var newIndex;
					var indexAdjust;
					
					//Fix scroll/item indexes (we added/removed an item on top thats out of the view)
					//Dont invalidate, only the index has changed, not the data, we dont want renderers shuffling around.
					if (type == "add")
						indexAdjust = 1;
					else // "remove"
						indexAdjust = -1;
					
					this._scrollIndex = this._scrollIndex + indexAdjust;
					
					//Adjust all indexes
					for (var i = 0; i < this._contentPane._children.length; i++)
					{
						newIndex = this._contentPane._children[i]._listData._itemIndex + indexAdjust;
						this._updateRendererData(this._contentPane._children[i], newIndex);
					}
				}
				else //Visible renderers changed
				{
					if (type == "add")
					{
						var newRenderer = this._createRenderer(index);
						
						//Push in a new renderer, layout will deal with purging excess if necessary
						this._contentPane._addChildAt(newRenderer, index - firstIndex);
						index++;
					}
					else // if (type == "remove")
					{
						//Pop the removed renderer, layout will deal with adding more if necessary
						this._contentPane._removeChildAt(index - firstIndex);
					}
					
					//Adjust downstream indexes.
					for (var i = index - firstIndex; i < this._contentPane._children.length; i++)
					{
						this._updateRendererData(this._contentPane._children[i], index);
						index++;
					}
				}
			}
			else if (type == "update" && index >= firstIndex && index <= lastIndex)
				this._updateRendererData(this._contentPane._children[index - firstIndex], index);
		}
	};
	
//@Override	
DataListElement.prototype._onCanvasElementAdded = 
	function (addedRemovedEvent)
	{
		DataListElement.base.prototype._onCanvasElementAdded.call(this, addedRemovedEvent);
	
		if (this._listCollection != null)
			this._listCollection.addEventListener("collectionchanged", this._onDataListCollectionChangedInstance);
	};

//@Override	
DataListElement.prototype._onCanvasElementRemoved = 
	function (addedRemovedEvent)
	{
		DataListElement.base.prototype._onCanvasElementRemoved.call(this, addedRemovedEvent);
		
		if (this._listCollection != null)
			this._listCollection.removeEventListener("collectionchanged", this._onDataListCollectionChangedInstance);
	};	

/**
 * @function _invalidateListRenderersLayout
 * Calls _invalidateLayout() on all DataRenderers.
 */	
DataListElement.prototype._invalidateListRenderersLayout = 
	function ()
	{
		for (var i = 0; i < this._contentPane._children.length; i++)
			this._contentPane._children[i]._invalidateLayout();
	};
	
/**
 * @function _invalidateListRenderersMeasure
 * Calls _invalidateMeasure() on all DataRenderers.
 */		
DataListElement.prototype._invalidateListRenderersMeasure = 
	function ()
	{
		for (var i = 0; i < this._contentPane._children.length; i++)
			this._contentPane._children[i]._invalidateMeasure();
	};
	
//@Override
DataListElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		DataListElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("ListItemClass" in stylesMap)
		{
			//Check if class changed
			if (this._contentPane._children.length > 0 && 
				this._contentPane._children[0].constructor != this.getStyle("ListItemClass"))
			{
				//Purge all renderers
				while (this._contentPane._children.length > 0)
					this._contentPane._removeChildAt(0);
				
				this._invalidateLayout();
			}
		}
		else if ("ListItemStyle" in stylesMap)
		{
			var listItemStyle = this.getStyle("ListItemStyle");
			
			for (var i = 0; i < this._contentPane._children.length; i++)
				this._contentPane._children[i].setStyleDefinitions(listItemStyle);
			
			this._invalidateLayout();
		}
		
		if ("ListDirection" in stylesMap)
		{
			this._invalidateMeasure();
			this._invalidateLayout();
		}
		else if ("ScrollBarPlacement" in stylesMap || "ScrollBarDisplay" in stylesMap ||  "ListAlign" in stylesMap)
			this._invalidateLayout();
		
		if ("ScrollBarStyle" in stylesMap && this._scrollBar != null)
			this._scrollBar.setStyleDefinitions(this.getStyle("ScrollBarStyle"));
		
		if ("ItemLabelFunction" in stylesMap)
			this.setScrollIndex(this._scrollIndex); //Reset renderer data.
	};

//@Override
DataListElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		return {width:16, height:16};
	};

/**
 * @function _onDataListRendererClick
 * Event handler for the DataRenderer "click" event. Updates selected index/item and dispatches "listitemclick" and "changed" events.
 * 
 * @param elementMouseEvent ElementMouseEvent
 * The ElementMouseEvent to process.
 */		
DataListElement.prototype._onDataListRendererClick = 
	function (elementMouseEvent)
	{
		var itemIndex = elementMouseEvent.getCurrentTarget()._listData._itemIndex;
		var itemData = elementMouseEvent.getCurrentTarget()._itemData;
		
		var dispatchChanged = false;
		
		if (this.getStyle("Selectable") == true && this.setSelectedIndex(itemIndex) == true)
			dispatchChanged = true;
		
		this._dispatchEvent(new ElementListItemClickEvent(itemData, itemIndex));
		
		if (dispatchChanged == true)
			this._dispatchEvent(new ElementEvent("changed", false));
	};
	
/**
 * @function _createRenderer
 * Generates a DataRenderer based on the ListItemClass style.
 * 
 * @param itemIndex int
 * Collection index associated with the DataRenderer.
 * 
 * @returns CanvasElement
 * The new DataRenderer instance.
 */	
DataListElement.prototype._createRenderer = 
	function (itemIndex)
	{
		var newRenderer = new (this.getStyle("ListItemClass"))();
		newRenderer._setStyleDefinitionDefault(this._getDefaultStyle("ListItemStyle"));
		newRenderer._setStyleProxy(new StyleProxy(this, DataListElement._DataRendererProxyMap));
		newRenderer.setStyleDefinitions(this.getStyle("ListItemStyle"));
		
		this._updateRendererData(newRenderer, itemIndex);
		
		newRenderer.addEventListener("click", this._onDataListRendererClickInstance);
		
		return newRenderer;
	};

/**
 * @function _updateRendererData
 * Updates the DataRenderer list data and selected state.
 * 
 * @param renderer CanvasElement
 * DataRenderer to update.
 * 
 * @param itemIndex int
 * Collection index to associate with the DataRenderer.
 */	
DataListElement.prototype._updateRendererData = 
	function (renderer, itemIndex)
	{
		var listData = null;
		
		//Optimize, dont create new data unless its actually changed.
		if (renderer._listData != null && renderer._listData._itemIndex == itemIndex)
			listData = renderer._listData;
		else
			listData = new DataListData(this, itemIndex);
	
		//Always call the function even if data has not changed, this indicates to the
		//renderer to inspect its parent related data and it may make changes even if
		//this data is the same. An example is changes to a DataGrid's columns.
		renderer._setListData(
			listData,
			this._listCollection.getItemAt(itemIndex));
		
		if (this._selectedIndex == itemIndex)
			renderer._setListSelected(true);
		else
			renderer._setListSelected(false);
	};
	
//@Override	
DataListElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		DataListElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		var x = paddingMetrics.getX();
		var y = paddingMetrics.getY();
		var w = paddingMetrics.getWidth();
		var h = paddingMetrics.getHeight();
		
		var availableSize = h;
		var listItem = null;
		var i;
		
		var listDirection = this.getStyle("ListDirection");
		var itemIndex = Math.floor(this._scrollIndex);
		
		var collectionLength = 0;
		if (this._listCollection != null)
			collectionLength = this._listCollection.getLength();
		
		if (collectionLength == 0)
		{
			itemIndex = 0;
			this._scrollIndex = itemIndex;
		}
		else if (itemIndex > collectionLength -1)
		{
			itemIndex = collectionLength -1;
			this._scrollIndex = itemIndex;
		}
		
		var clipFirst = 0;
		var clipLast = 0;
		
		this._contentSize = 0;
		var itemSize = 0;
		
		//Measure existing content & clipping amounts.
		for (i = 0; i < this._contentPane._children.length; i++)
		{
			listItem = this._contentPane._children[i];
			
			if (listDirection == "horizontal")
				itemSize = listItem._getStyledOrMeasuredWidth();
			else // if (listDirection == "vertical")
				itemSize = listItem._getStyledOrMeasuredHeight();
				
			this._contentSize += itemSize;
			
			if (listItem._listData._itemIndex <= itemIndex)
			{
				if (listItem._listData._itemIndex < itemIndex)
					clipFirst += itemSize;
				else
					clipFirst += itemSize * (this._scrollIndex - itemIndex);
			}
			
			if (this._contentSize - clipFirst >= availableSize)
			{
				clipLast = (this._contentSize - clipFirst - availableSize);
				
				//Purge Excess renderers.
				while (this._contentPane._children.length - 1 > i)
					this._contentPane._removeChildAt(this._contentPane._children.length - 1);
			}
		}
		
		//Adjust scroll index due to new renderer added on top.
		//Happens when we're max scrolled and DataList size increases.
		if (this._contentPane._children.length > 0 && 
			this._contentPane._children[0]._listData._itemIndex < itemIndex)
		{
			clipFirst += clipLast;
			clipLast = 0; //No clipping last item (scrolled to bottom)
			
			itemIndex = this._contentPane._children[0]._listData._itemIndex;
			
			//Fix scroll index
			if (listDirection == "horizontal")
				this._scrollIndex = itemIndex + (clipFirst / this._contentPane._children[0]._getStyledOrMeasuredWidth());
			else // if (listDirection == "vertical")
				this._scrollIndex = itemIndex + (clipFirst / this._contentPane._children[0]._getStyledOrMeasuredHeight());
			
			//Handle rounding errors
			this._scrollIndex = CanvasElement.roundToPrecision(this._scrollIndex, 3);
		}
		
		//Extra space - need another renderer or scroll shift
		if (this._contentSize - clipFirst - clipLast < availableSize)
		{
			if (itemIndex + this._contentPane._children.length < collectionLength)
			{//Create a new renderer and put it on bottom.
				
				var newRenderer = this._createRenderer(itemIndex + this._contentPane._children.length);
				this._contentPane._addChild(newRenderer);
				
				//Wait for the new renderer to measure.
				//Re-invalidate ourself, (content pane doesnt measure so wont do it for us).
				this._invalidateLayout();
				return;
			}
			else
			{//Add before (or shift up scroll position)
				
				var excessSize = availableSize - (this._contentSize - clipFirst - clipLast);
				
				if (clipFirst >= excessSize) 
				{//We have enough clipping to cover the gap, un-clip and adjust scroll index
					
					clipFirst -= excessSize;
					
					if (listDirection == "horizontal")
						this._scrollIndex = itemIndex + (clipFirst / this._contentPane._children[0]._getStyledOrMeasuredWidth());
					else // if (listDirection == "vertical")
						this._scrollIndex = itemIndex + (clipFirst / this._contentPane._children[0]._getStyledOrMeasuredHeight());
					
					//Handle rounding errors
					this._scrollIndex = CanvasElement.roundToPrecision(this._scrollIndex, 3);
				}
				else if (clipFirst > 0 && collectionLength == this._contentPane._children.length)
				{//We dont have enough clipping, but we're out of data (cannot make new renderer)
					
					clipFirst = 0;
					this._scrollIndex = 0;
				}
				else if (collectionLength > this._contentPane._children.length)
				{//Create a new renderer and put it on top
					
					var newRenderer = this._createRenderer(itemIndex - 1);
					this._contentPane._addChildAt(newRenderer, 0);
					
					//Wait for the new renderer to measure.
					//Re-invalidate ourself, (content pane doesnt measure so wont do it for us).
					this._invalidateLayout();
					return;
				}
			}
		}
		
		var needsScrollBar = false;
		var scrollDisplay = this.getStyle("ScrollBarDisplay");
		
		if (scrollDisplay == "on" || 
			(scrollDisplay == "auto" && availableSize > 0 && (this._contentSize > availableSize || this._contentPane._children.length < collectionLength)))
		{
			needsScrollBar = true;
		}
		
		//Create ScrollBar
		if (needsScrollBar == true && this._scrollBar == null)
		{
			this._scrollBar = new ScrollBarElement();
			this._scrollBar._setStyleDefinitionDefault(this._getDefaultStyle("ScrollBarStyle"));
			this._scrollBar.setStyleDefinitions(this.getStyle("ScrollBarStyle"));
			this._scrollBar.setStyle("ScrollBarDirection", listDirection);
			this._scrollBar.setScrollLineSize(1);
			
			this._scrollBar.addEventListener("changed", this._onDataListScrollBarChangedInstance);
			this._addChild(this._scrollBar);
			
			//Wait for measure.
			return;
		}
		
		//Destroy ScrollBar
		if (needsScrollBar == false && this._scrollBar != null)
		{			
			this._removeChild(this._scrollBar);
			this._scrollBar = null;
			
			//Wait for measure
			return;
		}
		
		//Size / Position the scroll bar and content pane.
		if (this._scrollBar != null)
		{
			var scrollBarPlacement = this.getStyle("ScrollBarPlacement");
			
			if (listDirection == "horizontal")
			{
				this._scrollBar._setActualSize(w, this._scrollBar._getStyledOrMeasuredHeight());
				this._contentPane._setActualSize(w, h - this._scrollBar._height);
				
				if (scrollBarPlacement == "top" || scrollBarPlacement == "left")
				{
					this._contentPane._setActualPosition(x, y + this._scrollBar._height);
					this._scrollBar._setActualPosition(x, y);
				}
				else //if (scrollBarPlacement == "bottom" || scrollBarPlacement == "right")
				{
					this._contentPane._setActualPosition(x, y);
					this._scrollBar._setActualPosition(x, y + this._contentPane._height);
				}
			}
			else // if (listDirection == "vertical")
			{
				this._scrollBar._setActualSize(this._scrollBar._getStyledOrMeasuredWidth(), h);
				this._contentPane._setActualSize(w - this._scrollBar._width, h);
				
				if (scrollBarPlacement == "top" || scrollBarPlacement == "left")
				{
					this._scrollBar._setActualPosition(x, y);
					this._contentPane._setActualPosition(x + this._scrollBar._width, y);
				}
				else //if (scrollBarPlacement == "bottom" || scrollBarPlacement == "right")
				{
					this._scrollBar._setActualPosition(x + this._contentPane._width, y);
					this._contentPane._setActualPosition(x, y);
				}
			}
		}
		else
		{
			this._contentPane._setActualPosition(x, y);
			this._contentPane._setActualSize(w, h);
		}

		//Layout content pane children.
		var currentPosition = clipFirst * -1;
		if (this._contentSize < availableSize)
		{
			var listAlign = this.getStyle("ListAlign");
			
			if (listAlign == "top" || listAlign == "left")
				currentPosition = 0;
			else if (listAlign == "center" || listAlign == "middle")
				currentPosition = (availableSize / 2) - (this._contentSize / 2);
			else //if (listAlign == "bottom" || listAlign == "right")
				currentPosition = availableSize - this._contentSize;
		}
		
		for (i = 0; i < this._contentPane._children.length; i++)
		{
			listItem = this._contentPane._children[i];
			
			if (listDirection == "horizontal")
			{
				listItem._setActualSize(listItem._getStyledOrMeasuredWidth(), this._contentPane._height);
				listItem._setActualPosition(currentPosition, 0);
				
				currentPosition += listItem._width;
			}
			else // if (listDirection == "vertical")
			{
				listItem._setActualSize(this._contentPane._width, listItem._getStyledOrMeasuredHeight());
				listItem._setActualPosition(0, currentPosition);
				
				currentPosition += listItem._height;
			}
		}
		
		//Adjust scroll bar parameters.
		if (this._scrollBar != null)
		{
			var viewSize = this._contentPane._children.length;
			
			if (this._contentPane._children.length)
			{
				if (listDirection == "horizontal")
				{
					viewSize -= clipFirst / this._contentPane._children[0]._width;
					viewSize -= clipLast / this._contentPane._children[this._contentPane._children.length - 1]._width;
				}
				else // if (listDirection == "vertical")
				{
					viewSize -= clipFirst / this._contentPane._children[0]._height;
					viewSize -= clipLast / this._contentPane._children[this._contentPane._children.length - 1]._height;
				}
			}
			
			this._scrollBar.setScrollPageSize(collectionLength);
			this._scrollBar.setScrollViewSize(viewSize);
			
			if (this._scrollBar.getScrollValue() != this._scrollIndex)
			{
				this._scrollBar.endScrollTween();
				this._scrollBar.setScrollValue(this._scrollIndex);
			}
		}
	};
	
	