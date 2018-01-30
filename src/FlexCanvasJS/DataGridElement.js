
/**
 * @depends DataListElement.js
 * @depends DataGridDataRenderer.js
 * @depends DataGridHeaderElement.js
 * @depends CanvasElement.js
 */

///////////////////////////////////////////////////////////////////////
///////////////////////DataGridElement/////////////////////////////////		
	
/**
 * @class DataGridElement
 * @inherits DataListElement
 * 
 * DataGridElement is a data-driven container that renders a header and rows
 * via a supplied ListCollection, DataGridColumnDefinition(s), and Data/Item Renderers.
 * A scroll bar will be added if the collection size exceeds the available area. 
 * DataGridElement only renders visible DataRenderers so collection size does not impact performance
 * and allows the header, rows, header item, and row item classes to be specified and styled if desired.
 * 
 * The default header class is DataGridHeaderElement.
 * The default ListItem DataRenderer (renders a row) is DataGridDataRenderer.
 * 
 * Default header/row ItemRenderers are supplied by the DataGridColumnDefinition and are as follows.
 * The default HeaderItem DataRenderer is DataGridHeaderItemRenderer.
 * The default RowItem DataRenderer DataGridLabelItemRenderer.
 * 
 * 
 * @seealso DataGridHeaderElement
 * @seealso DataGridDataRenderer
 * @seealso DataGridColumnDefinition
 * @seealso DataGridHeaderItemRenderer
 * @seealso DataGridLabelItemRenderer
 * 
 * 
 * @constructor DataGridElement 
 * Creates new DataGridElement instance.
 */
function DataGridElement()
{
	DataGridElement.base.prototype.constructor.call(this);
	
	/**
	 * @member _gridColumns Array
	 * Read Only - Array of DataGridColumnDefinition.
	 */
	this._gridColumns = [];
	
	this._columnSizes = [];
	this._columnPercents = [];	
	
	this._gridHeader = null;
	
	this._gridLineContainer = new CanvasElement();
	this._gridLineContainer.setStyle("MouseEnabled", false);
	this._gridLineContainer.setStyle("ClipContent", true);
	this._addChild(this._gridLineContainer);
	
	var _self = this;
	
	//Private event handler, proxy to prototype.
	this._onDataGridColumnDefinitionChangedInstance = 
		function (styleChangedEvent)
		{
			_self._onDataGridColumnDefinitionChanged(styleChangedEvent);
		};
		
	this._onDataGridRowItemClickInstance = 
		function (elementMouseEvent)
		{
			_self._onDataGridRowItemClick(elementMouseEvent);
		};
		
	this._onDataGridHeaderItemClickInstance = 
		function (elementMouseEvent)
		{
			_self._onDataGridHeaderItemClick(elementMouseEvent);
		};
}

//Inherit from DataListElement
DataGridElement.prototype = Object.create(DataListElement.prototype);
DataGridElement.prototype.constructor = DataGridElement;
DataGridElement.base = DataListElement;

////////////Events////////////////////////////////////////

/**
 * @event listitemclick ElementGridItemClickEvent
 * Dispatched when an ItemRenderer or header is clicked. Includes associated collection item/index.
 */


/////////////Style Types////////////////////////////////////////////

DataGridElement._StyleTypes = Object.create(null);

/**
 * @style HeaderClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the DataGrid header. Default is DataGridHeaderElement.
 * 
 * @seealso DataGridHeaderElement
 */
DataGridElement._StyleTypes.HeaderClass = 						StyleableBase.EStyleType.NORMAL;		// Element constructor()

/**
 * @style HeaderStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the header element.
 */
DataGridElement._StyleTypes.HeaderStyle = 						StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition

/**
 * @style GridLinesPriority String
 * 
 * Determines which set of grid lines will be rendered first. Allowable values are "vertical" or "horizontal".
 */
DataGridElement._StyleTypes.GridLinesPriority = 				StyleableBase.EStyleType.NORMAL;		// "vertical" || "horizontal" (Which lines are drawn first / below)

/**
 * @style VerticalGridLinesClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the DataGrid vertical grid lines. Default is CanvasElement.
 */
DataGridElement._StyleTypes.VerticalGridLinesClass = 			StyleableBase.EStyleType.NORMAL;		// Element constructor()

/**
 * @style VerticalGridLinesStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the vertical grid line elements.
 */
DataGridElement._StyleTypes.VerticalGridLinesStyle = 			StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition

/**
 * @style HorizontalGridLinesClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the DataGrid horizontal grid lines. Default is null.
 */
DataGridElement._StyleTypes.HorizontalGridLinesClass = 			StyleableBase.EStyleType.NORMAL;		// Element constructor()

/**
 * @style HorizontalGridLinesStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the horizontal grid line elements.
 */
DataGridElement._StyleTypes.HorizontalGridLinesStyle = 			StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition


////////////Default Styles/////////////////////////////////////////

DataGridElement.StyleDefault = new StyleDefinition();

/////GridLines default style //////
DataGridElement.GridLineStyleDefault = new StyleDefinition();
DataGridElement.GridLineStyleDefault.setStyle("Width", 					1);				// number
DataGridElement.GridLineStyleDefault.setStyle("Height", 				1); 			// number
DataGridElement.GridLineStyleDefault.setStyle("BackgroundColor", 		"#BBBBBB");		// "#000000"
///////////////////////////////////

/////ScrollBar default style //////
DataGridElement.ScrollBarStyleDefault = new StyleDefinition();
DataGridElement.ScrollBarStyleDefault.setStyle("Padding", 				-1);			// number
///////////////////////////////////

//Override base class styles
DataGridElement.StyleDefault.setStyle("ListItemClass", 					DataGridDataRenderer); 					// Element constructor()	
DataGridElement.StyleDefault.setStyle("ListItemStyle", 					null); 									// StyleDefinition

DataGridElement.StyleDefault.setStyle("BorderType",		 				"solid"); 	
DataGridElement.StyleDefault.setStyle("BorderThickness",	 			1);
DataGridElement.StyleDefault.setStyle("PaddingTop",	 					1);
DataGridElement.StyleDefault.setStyle("PaddingBottom", 					1);
DataGridElement.StyleDefault.setStyle("PaddingLeft",					1);
DataGridElement.StyleDefault.setStyle("PaddingRight", 					1);
DataGridElement.StyleDefault.setStyle("ScrollBarStyle", 				DataGridElement.ScrollBarStyleDefault);	// StyleDefinition

//DataGrid specific
DataGridElement.StyleDefault.setStyle("HeaderClass", 					DataGridHeaderElement); 				// Element constructor()
DataGridElement.StyleDefault.setStyle("HeaderStyle", 					null); 									// StyleDefinition

DataGridElement.StyleDefault.setStyle("GridLinesPriority", 				"vertical"); 							// "vertical" || "horizontal"

DataGridElement.StyleDefault.setStyle("VerticalGridLinesClass", 		CanvasElement); 						// Element constructor()
DataGridElement.StyleDefault.setStyle("VerticalGridLinesStyle", 		DataGridElement.GridLineStyleDefault); 	// StyleDefinition

DataGridElement.StyleDefault.setStyle("HorizontalGridLinesClass", 		null); 									// Element constructor()
DataGridElement.StyleDefault.setStyle("HorizontalGridLinesStyle", 		DataGridElement.GridLineStyleDefault); 	// StyleDefinition
DataGridElement.StyleDefault.setStyle("TabStop", 						0);


///////////Public//////////////////////////////////

/**
 * @function addColumnDefinition
 * Adds a column definition to be rendered by the DataGrid.
 * 
 * @param columnDefinition DataGridColumnDefinition
 * Column definition to be rendered by the DataGrid.
 */
DataGridElement.prototype.addColumnDefinition = 
	function (columnDefinition)
	{
		return this.addColumnDefinitionAt(columnDefinition, this._gridColumns.length);
	};
	
/**
 * @function addColumnDefinitionAt
 * Adds a column definition to be rendered by the DataGrid at a supplied column index.
 * 
 * @param columnDefinition DataGridColumnDefinition
 * Column definition to be rendered by the DataGrid.
 * 
 * @param index int
 * The index to insert the column definition.
 */	
DataGridElement.prototype.addColumnDefinitionAt = 
	function (columnDefinition, index)
	{
		if (!(columnDefinition instanceof DataGridColumnDefinition))
			throw "Invalid DataGridColumnDefinition";
		
		this._gridColumns.splice(index, 0, columnDefinition);
		this._columnPercents.splice(index, 0, columnDefinition.getStyle("PercentSize"));
		
		if (this._manager != null)
			columnDefinition.addEventListener("stylechanged", this._onDataGridColumnDefinitionChangedInstance);
		
		this._columnSizes = []; //Force grid to re-calculate column sizes
		this._columnsChanged();
		
		return columnDefinition;
	};
	
/**
 * @function getColumnDefinitionAt
 * Gets the DataGridColumnDefinition at a supplied column index.
 * 
 * @param index int
 * The index to return the DataGridColumnDefinition.
 * 
 * @returns DataGridColumnDefinition
 * The DataGridColumnDefinition at the supplied index.
 */	
DataGridElement.prototype.getColumnDefinitionAt = 
	function (index)
	{
		if (index < 0 || index >= this._gridColumns.length)
			return null;
	
		return this._gridColumns[index];
	};	
	
/**
 * @function removeColumnDefinition
 * Removes a column definition from the DataGrid.
 * 
 * @param columnDefinition DataGridColumnDefinition
 * Column definition to be removed.
 * 
 * @returns DataGridColumnDefinition
 * The removed column definition.
 */	
DataGridElement.prototype.removeColumnDefinition = 
	function (columnDefinition)
	{
		return this.removeColumnDefinitionAt(this._gridColumns.indexOf(columnDefinition));
	};

/**
 * @function removeColumnDefinitionAt
 * Removes a column definition from the DataGrid.
 * 
 * @param index int
 * Column index of definition to be removed.
 * 
 * @returns DataGridColumnDefinition
 * The removed column definition or null if the index was out of range.
 */		
DataGridElement.prototype.removeColumnDefinitionAt = 
	function (index)
	{
		if (index < 0 || index >= this._gridColumns.length)
			return null;
		
		var removed = this._gridColumns.splice(index, 1)[0]; //Returns array of removed items.
		this._columnPercents.splice(index, 1);
		
		if (this._manager != null)
			removed.removeEventListener("stylechanged", this._onDataGridColumnDefinitionChangedInstance);
		
		this._columnSizes = []; //Force grid to re-calculate column sizes
		this._columnsChanged();
		
		return removed;
	};

/**
 * @function getNumColumns
 * Gets the number of column definitions.
 * 
 * @returns int
 * Number of column definitions.
 */		
DataGridElement.prototype.getNumColumns = 
	function ()
	{
		return this._gridColumns.length;
	};
	
	
///////////Internal////////////////////////////////
	
/**
 * @function _onDataGridColumnDefinitionChanged
 * Event handler for DataGridColumnDefinition "stylechanged" event. Updates the DataGrid column.
 * 
 * @param styleChangedEvent StyleChangedEvent
 * The StyleChangedEvent to process.
 */	
DataGridElement.prototype._onDataGridColumnDefinitionChanged = 
	function (styleChangedEvent)
	{
		var styleName = styleChangedEvent.getStyleName();
		
		if (styleName == "PercentSize")
		{
			var columnIndex = this._gridColumns.indexOf(styleChangedEvent.getTarget());
			this._columnPercents[columnIndex] = styleChangedEvent.getNewValue();
			this._columnSizes = []; //Force grid to re-calculate column sizes
			this._invalidateLayout();
		}
		else if (styleName == "MinSize")
		{
			this._columnSizes = []; //Force grid to re-calculate column sizes
			this._invalidateLayout();
		}
		else
			this._columnsChanged();
	};

/**
 * @function _columnsChanged
 * Called in response to columns being added/removed or their styles changed.
 * Updates the DataGrid columns.
 */	
DataGridElement.prototype._columnsChanged = 
	function ()
	{
		//Refresh all the ListData, data hasnt changed, but this
		//also tells the renderer to inspect and adjust the columns.
		if (this._gridHeader != null)
		{
			this._gridHeader._setListData(
				this._gridHeader._listData,
				null);
		}
		
		var renderer = null;
		for (var i = 0; i < this._contentPane._children.length; i++)
		{
			renderer = this._contentPane._children[i];
			
			renderer._setListData(
				renderer._listData,
				renderer._itemData);
		}
		
		this._invalidateLayout();
	};

//Override	
DataGridElement.prototype._onDataListCollectionChanged = 
	function (collectionChangedEvent)
	{
		DataGridElement.base.prototype._onDataListCollectionChanged.call(this, collectionChangedEvent);
		
		//Sort may have happened, update the header's data so it can adjust sort icon.
		if (collectionChangedEvent.getKind() == "reset" && this._gridHeader != null)
		{
			//Data hasnt actually changed.
			this._gridHeader._setListData(
				this._gridHeader._listData,
				null);
		}
	};
	
//@Override	
DataGridElement.prototype._onCanvasElementAdded = 
	function (addedRemovedEvent)
	{
		DataGridElement.base.prototype._onCanvasElementAdded.call(this, addedRemovedEvent);
	
		for (var i = 0; i < this._gridColumns.length; i++)
			this._gridColumns[i].addEventListener("stylechanged", this._onDataGridColumnDefinitionChangedInstance);
	};

//@Override	
DataGridElement.prototype._onCanvasElementRemoved = 
	function (addedRemovedEvent)
	{
		DataGridElement.base.prototype._onCanvasElementRemoved.call(this, addedRemovedEvent);
		
		for (var i = 0; i < this._gridColumns.length; i++)
			this._gridColumns[i].removeEventListener("stylechanged", this._onDataGridColumnDefinitionChangedInstance);
	};		
	
//@Override
DataGridElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		DataGridElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("HeaderClass" in stylesMap)
		{
			var headerClass = this.getStyle("HeaderClass");
			
			//Destroy if class is null or does not match existing
			if ((headerClass == null && this._gridHeader != null) ||
				this._gridHeader != null && this._gridHeader.constructor != headerClass)
			{
				this._removeChild(this._gridHeader);
				this._gridHeader = null;
			}
			
			//Create
			if (headerClass != null && this._gridHeader == null)
			{
				this._gridHeader = new (headerClass)();
				
				this._gridHeader._setListData(
					new DataListData(this, -1),
					null);
				
				this._addChild(this._gridHeader);
			}
			
			this._invalidateLayout();
		}
		
		if ("HeaderStyle" in stylesMap && this._gridHeader != null)
			this._applySubStylesToElement("HeaderStyle", this._gridHeader);
		
		if ("GridLinesPriority" in stylesMap ||
			"VerticalGridLinesClass" in stylesMap ||
			"VerticalGridLinesStyle" in stylesMap ||
			"HorizontalGridLinesClass" in stylesMap ||
			"HorizontalGridLinesStyle" in stylesMap)
		{
			this._invalidateLayout();
		}
	};	
	
//@Override		
DataGridElement.prototype._createRenderer = 
	function (itemIndex)
	{
		var newRenderer = new (this.getStyle("ListItemClass"))();
		this._applySubStylesToElement("ListItemStyle", newRenderer);
		this._updateRendererData(newRenderer, itemIndex);
		
		return newRenderer;
	};	

/**
 * @function _createHeaderItemRenderer
 * Generates a header ItemRenderer base on the column definition HeaderItemClass style.
 * 
 * @param columnIndex int
 * Column index associated with the header ItemRenderer.
 * 
 * @returns CanvasElement
 * The new header ItemRenderer instance.
 */		
DataGridElement.prototype._createHeaderItemRenderer = 
	function (columnIndex)
	{
		var columnDefinition = this._gridColumns[columnIndex];
		
		var headerItemClass = columnDefinition.getStyle("HeaderItemClass");
		var newRenderer = new (headerItemClass)();
		columnDefinition._applySubStylesToElement("HeaderItemStyle", newRenderer);
		
		this._updateHeaderItemRendererData(newRenderer, columnIndex);		
		
		newRenderer.addEventListener("click", this._onDataGridHeaderItemClickInstance);
		
		return newRenderer;
	};
	
/**
 * @function _updateHeaderItemRendererData
 * Updates the header ItemRenderer list data.
 * 
 * @param renderer CanvasElement
 * Header ItemRenderer to update.
 * 
 * @param columnIndex int
 * Column index to associate with the header ItemRenderer.
 */		
DataGridElement.prototype._updateHeaderItemRendererData = 
	function (renderer, columnIndex)
	{
		var columnDefinition = this._gridColumns[columnIndex];
		
		//Optimize, only create new data if its actually changed.
		var listData = null;
		if (renderer._listData != null && renderer._listData._columnIndex == columnIndex)
			listData = renderer._listData;
		else
			listData = new DataGridItemData(this, -1, columnIndex);
		
		columnDefinition._applySubStylesToElement("HeaderItemStyle", renderer);
		
		renderer._setListData(
			listData,
			null);
	};
	
/**
 * @function _onDataGridHeaderItemClick
 * Event handler for header ItemRenderer "click" event. Sorts the collection if a 
 * CollectionSort is assigned to the DataGridColumDefinition and dispatched "listitemclick" event.
 * 
 * @param elementMouseEvent ElementMouseEvent
 * The ElementMouseEvent to process.
 */			
DataGridElement.prototype._onDataGridHeaderItemClick = 
	function (elementMouseEvent)
	{
		var columnIndex = elementMouseEvent.getCurrentTarget()._listData._columnIndex;
		
		var collectionSort = this._gridColumns[columnIndex].getStyle("CollectionSort");
		if (collectionSort != null && collectionSort instanceof CollectionSort)
		{
			if (this._listCollection._collectionSort != collectionSort)
			{
				collectionSort._isDecending = false;
				this._listCollection.setCollectionSort(collectionSort);
				this._listCollection.sort();
			}
			else
			{
				collectionSort._isDecending = !(collectionSort._isDecending);
				this._listCollection.sort();
			}
		}
		
		this._dispatchEvent(new ElementGridItemClickEvent(-1, columnIndex, null));
	};
	
/**
 * @function _createRowItemRenderer
 * Generates a row ItemRenderer base on the column definition RowItemClass style.
 * 
 * @param itemIndex int
 * Collection item index to associate with the row ItemRenderer.
 * 
 * @param columnIndex int
 * Column index to associate with the row ItemRenderer.
 * 
 * @returns CanvasElement
 * The new row ItemRenderer instance.
 */		
DataGridElement.prototype._createRowItemRenderer = 
	function (itemIndex, columnIndex)
	{
		var columnDefinition = this._gridColumns[columnIndex];
	
		var rowItemClass = columnDefinition.getStyle("RowItemClass");
		var newRenderer = new (rowItemClass)();
		columnDefinition._applySubStylesToElement("RowItemStyle", newRenderer);
		
		this._updateRowItemRendererData(newRenderer, itemIndex, columnIndex);		
		
		newRenderer.addEventListener("click", this._onDataGridRowItemClickInstance);
		
		return newRenderer;
	};

/**
 * @function _updateRowItemRendererData
 * Updates the row ItemRenderer list data.
 * 
 * @param renderer CanvasElement
 * Row ItemRenderer to update.
 * 
 * @param itemIndex int
 * Collection item index to associate with the row ItemRenderer.
 * 
 * @param columnIndex int
 * Column index to associate with the row ItemRenderer.
 */		
DataGridElement.prototype._updateRowItemRendererData = 
	function (renderer, itemIndex, columnIndex)
	{
		var columnDefinition = this._gridColumns[columnIndex];
		
		//Optimize, only create new data if its actually changed.
		var listData = null;
		if (renderer._listData != null && renderer._listData._columnIndex == columnIndex && renderer._listData._itemIndex == itemIndex)
			listData = renderer._listData;
		else
			listData = new DataGridItemData(this, itemIndex, columnIndex);
		
		columnDefinition._applySubStylesToElement("RowItemStyle", renderer);
	
		renderer._setListData(
			listData,
			this._listCollection.getItemAt(itemIndex));
	};
	
/**
 * @function _onDataGridRowItemClick
 * Event handler for the row ItemRenderer "click" event. Updates selected index/item and dispatches "listitemclick" and "changed" events.
 * 
 * @param elementMouseEvent ElementMouseEvent
 * The ElementMouseEvent to process.
 */
DataGridElement.prototype._onDataGridRowItemClick = 
	function (elementMouseEvent)
	{
		var itemIndex = elementMouseEvent.getCurrentTarget()._listData._itemIndex;
		var columnIndex = elementMouseEvent.getCurrentTarget()._listData._columnIndex;
		var itemData = elementMouseEvent.getCurrentTarget()._itemData;
		
		var dispatchChanged = false;
		
		if (this.getStyle("Selectable") == true && this.setSelectedIndex(itemIndex) == true)
			dispatchChanged = true;
		
		this._dispatchEvent(new ElementGridItemClickEvent(itemIndex, columnIndex, itemData));
		
		if (dispatchChanged == true)
			this._dispatchEvent(new ElementEvent("changed", false));
	};
	
//@Override
DataGridElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		return {width:16, height:16};
	};
	
/**
 * @function _createGridLine
 * Generates a grid line element based on vertical/horizontal GridLinesClass style.
 * 
 * @param direction String
 * The grid line direction "vertical" or "horizontal"
 * 
 * @returns CanvasElement
 * The new grid line element.
 */		
DataGridElement.prototype._createGridLine = 
	function (direction)
	{
		var line = null;
		if (direction == "vertical")
		{
			line = new (this.getStyle("VerticalGridLinesClass"))();
			this._applySubStylesToElement("VerticalGridLinesStyle", line);
		}
		else
		{
			line = new (this.getStyle("HorizontalGridLinesClass"))();
			this._applySubStylesToElement("HorizontalGridLinesStyle", line);
		}
		
		return line;
	};
	
//@Override	
DataGridElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		if (this._gridHeader != null)
		{
			var headerHeight = this._gridHeader._getStyledOrMeasuredHeight();
			
			var adjustedPadding = new DrawMetrics();
			adjustedPadding._x = paddingMetrics._x;
			adjustedPadding._y = paddingMetrics._y + headerHeight;
			adjustedPadding._width = paddingMetrics._width;
			adjustedPadding._height = paddingMetrics._height - headerHeight;
			
			//Adjust the padding so base() leaves us room for the header
			DataGridElement.base.prototype._doLayout.call(this, adjustedPadding);
		}
		else
			DataGridElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		//Base makes multiple passes, no reason to run below if we're waiting for the DataList to finish anyway.
		if (this._layoutInvalid == true)
			return;
		
		//Size / Position the grid header
		if (this._gridHeader != null)
		{
			this._gridHeader._setActualPosition(this._contentPane._x, paddingMetrics.getY());
			this._gridHeader._setActualSize(paddingMetrics.getWidth(), this._gridHeader._getStyledOrMeasuredHeight());
		}
		
		var i;
		var calculateColumnSizes = false;
		
		//Determine if we need to recalculate column widths (new columns or size change)
		if (this._columnSizes.length != this._gridColumns.length)
			calculateColumnSizes = true;
		else
		{
			var totalSize = 0;
			for (i = 0; i < this._columnSizes.length; i++)
				totalSize += this._columnSizes[i];
			
			if (totalSize != this._contentPane._width)
				calculateColumnSizes = true;
		}
		
		if (calculateColumnSizes == true)
		{
			var columnData = [];
			
			//Record column size info.
			for (i = 0; i < this._gridColumns.length; i++)
			{
				columnData.push(
					{percentSize: this._columnPercents[i], //We dont use column style, its maintained separately. Header can change the percents.
					minSize: this._gridColumns[i].getStyle("MinSize")});
			}
			
			//Calculate actual widths.
			CanvasElement._calculateMinMaxPercentSizes(columnData, this._contentPane._width);
			
			//Update recorded sizes.
			var newColumnSizes = [];
			for (i = 0; i < columnData.length; i++)
				newColumnSizes.push(columnData[i].actualSize);
			
			this._columnSizes = newColumnSizes;
			
			//Invalidate children.
			if (this._gridHeader != null)
				this._gridHeader._invalidateLayout();
			
			this._invalidateListRenderersLayout();
		}
		
		////////Grid Lines//////////////////////////////////////////////////////////////////////////
		this._gridLineContainer._setActualPosition(this._contentPane._x, this._contentPane._y);
		this._gridLineContainer._setActualSize(this._contentPane._width, this._contentPane._height);
		
		var itemIndex = null;
		var lineIndex = 0;
		var gridLine = null;
		var rowRenderer = null;
		var verticalComplete = false;
		var horizontalComplete = false;
		var linePriority = this.getStyle("GridLinesPriority");
		var verticalClass = this.getStyle("VerticalGridLinesClass");
		var horizontalClass = this.getStyle("HorizontalGridLinesClass");
		
		while (verticalComplete == false || horizontalComplete == false)
		{
			if ((linePriority == "horizontal" && horizontalComplete == false) || (verticalComplete == true && horizontalComplete == false))
			{
				if (horizontalClass != null)
				{
					for (i = 0; i < this._contentPane._children.length; i++)
					{
						rowRenderer = this._contentPane._children[i];
						itemIndex = rowRenderer._listData._itemIndex;
						if (itemIndex == 0)
							continue;
						
						gridLine = this._gridLineContainer._getChildAt(lineIndex);
						if (gridLine == null)
						{
							gridLine = this._createGridLine("horizontal");
							this._gridLineContainer._addChildAt(gridLine, lineIndex);
						}
						else if (gridLine.constructor != horizontalClass)
						{
							this._gridLineContainer._removeChildAt(lineIndex);
							gridLine = this._createGridLine("horizontal");
							this._gridLineContainer._addChildAt(gridLine, lineIndex);
						}
						else
							this._applySubStylesToElement("HorizontalGridLinesStyle", gridLine);
						
						gridLine._setActualSize(this._gridLineContainer._width, gridLine.getStyle("Height"));
						gridLine._setActualPosition(0, rowRenderer._y - (gridLine._height / 2));
						
						lineIndex++;
					}
				}
				
				horizontalComplete = true;
			}
			
			if ((linePriority == "vertical" && verticalComplete == false) || (horizontalComplete == true && verticalComplete == false))
			{
				if (verticalClass != null)
				{
					var linePosition = 0;
					for (i = 0; i < this._columnSizes.length - 1; i++)
					{
						linePosition += this._columnSizes[i];
						gridLine = this._gridLineContainer._getChildAt(lineIndex);
						
						if (gridLine == null)
						{
							gridLine = this._createGridLine("vertical");
							this._gridLineContainer._addChildAt(gridLine, lineIndex);
						}
						else if (gridLine.constructor != verticalClass)
						{
							this._gridLineContainer._removeChildAt(lineIndex);
							gridLine = this._createGridLine("vertical");
							this._gridLineContainer._addChildAt(gridLine, lineIndex);
						}
						else
							this._applySubStylesToElement("VerticalGridLinesStyle", gridLine);
						
						gridLine._setActualSize(gridLine.getStyle("Width"), this._gridLineContainer._height);
						gridLine._setActualPosition(linePosition - (gridLine._width / 2), 0);
						
						lineIndex++;
					}
				}
				
				verticalComplete = true;
			}
		}
		
		//Purge excess line renderers.
		while (lineIndex < this._gridLineContainer._children.length)
			this._gridLineContainer._removeChildAt(this._gridLineContainer._children.length - 1);
	};
	
	

