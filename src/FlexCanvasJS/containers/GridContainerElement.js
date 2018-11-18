/**
 * @depends ContainerBaseElement.js
 */

///////////////////////////////////////////////////////////////////////////	
///////////////////////GridContainerElement////////////////////////////////

/**
 * @class GridContainerElement
 * @inherits ContainerBaseElement
 * 
 * GridContainerElement is used to layout children in a grid or table-like manner.
 * This is effectively a two dimensional ListContainerElement that also supports
 * elements spanning multiple rows and/or columns. 
 * 
 * The grid container does not respect any layout styling of cell elements (other
 * than measured/min sizes), rather it only respects layout styling of supplied row and
 * column definitions (GridContainerRowColumnDefinition). It is recommended that
 * other containers (such as ListContainerElements) are used for the cell elements
 * that wrap the content elements being added to the GridContainerElement. This way the 
 * cells may stretch as necessary and content elements can be independently aligned
 * within the cell without stretching the content element itself.
 * 
 * The GridContainerElement is more expensive than a ListContainerElement so should 
 * only be used when it is needed to maintain row/column alignment.
 * 
 * @constructor GridContainerElement 
 * Creates new GridContainerElement instance.
 */
function GridContainerElement()
{
	GridContainerElement.base.prototype.constructor.call(this);
	
	this._rowDefinitions = Object.create(null);		//Map by rowIndex
	this._columnDefinitions = Object.create(null);	//Map by columnIndex
	
	//Since the same definition may be used on multiple rows & columns
	//This stores the number of map entries by GridContainerRowColumnDefinition
	this._rowColumnDefinitionCount = [];			//{definition, count}
	
	this._gridCells = [];  							//{element, rowIndexStart, columnIndexStart, rowIndexEnd, columnIndexEnd} 
	
	var _self = this;
	
	this._onRowColumnDefinitionChangedInstance = 
		function (event)
		{
			_self._onRowColumnDefinitionChanged(event);
		};
}	
	
//Inherit from CanvasElement
GridContainerElement.prototype = Object.create(ContainerBaseElement.prototype);
GridContainerElement.prototype.constructor = GridContainerElement;
GridContainerElement.base = ContainerBaseElement;


/////////////Style Types///////////////////////////////

GridContainerElement._StyleTypes = Object.create(null);

/**
 * @style LayoutVerticalGap int
 * 
 * Space in pixels to leave between rows.
 */
GridContainerElement._StyleTypes.LayoutVerticalGap = 		StyleableBase.EStyleType.NORMAL;		// number

/**
 * @style LayoutHorizontalGap int
 * 
 * Space in pixels to leave between columns.
 */
GridContainerElement._StyleTypes.LayoutHorizontalGap = 		StyleableBase.EStyleType.NORMAL;		// number

/**
 * @style LayoutVerticalAlign String
 * 
 * Vertical alignment to be used when the grid does not fill all available space. Allowable values are "top", "bottom", or "middle". 
 */
GridContainerElement._StyleTypes.LayoutVerticalAlign = 		StyleableBase.EStyleType.NORMAL;		// "top" || "bottom" || "middle" 

/**
 * @style LayoutHorizontalAlign String
 * 
 * Horizontal alignment to be used when the grid does not fill all available space. Allowable values are "left", "right", or "center". 
 */
GridContainerElement._StyleTypes.LayoutHorizontalAlign = 	StyleableBase.EStyleType.NORMAL;		//"left" || "right" || "center"


////////////Default Styles////////////////////////////

GridContainerElement.StyleDefault = new StyleDefinition();

GridContainerElement.StyleDefault.setStyle("LayoutVerticalGap", 				0);
GridContainerElement.StyleDefault.setStyle("LayoutHorizontalGap", 				0);
GridContainerElement.StyleDefault.setStyle("LayoutVerticalAlign", 				"top");
GridContainerElement.StyleDefault.setStyle("LayoutHorizontalAlign", 			"left");


////////PUBLIC///////////////////////

/**
 * @function setRowDefinition
 * Sets a row definition to the supplied row index.
 * 
 * @param definition GridContainerRowColumnDefinition
 * The definition to apply to the supplied row index.
 * 
 * @param index int
 * The row index to apply the definition.
 */
GridContainerElement.prototype.setRowDefinition = 
	function (definition, index)
	{
		var mapKey = Number(index).toString();
		var oldDefinition = this._rowDefinitions[mapKey];
		
		if (oldDefinition == definition)
			return;
		
		if (definition != null)
			this._rowDefinitions[mapKey] = definition;
		else
			delete this._rowDefinitions[mapKey];
		
		this._removeRowColumnDefinition(oldDefinition);
		this._addRowColumnDefinition(definition);
		
		this._invalidateMeasure();
		this._invalidateLayout();
	};

/**
 * @function getRowDefinition
 * Gets the row definition associated with the supplied row index.
 * 
 * @param index int
 * The row index to return the associated GridContainerRowColumnDefinition.
 * 
 * @returns GridContainerRowColumnDefinition
 * The GridContainerRowColumnDefinition associated with the supplied row index or null.
 */	
GridContainerElement.prototype.getRowDefinition = 
	function (index)
	{
		var mapKey = Number(index).toString();
		if (mapKey in this._rowDefinitions)
			return this._rowDefinitions[mapKey];
		
		return null;
	};

/**
 * @function clearRowDefinitions
 * Clears all row definitions.
 */		
GridContainerElement.prototype.clearRowDefinitions = 
	function ()
	{
		for (var mapKey in this._rowDefinitions)
			this._removeRowColumnDefinition(this._rowDefinitions[mapKey]);
		
		this._rowDefinitions = Object.create(null);		
		
		this._invalidateMeasure();
		this._invalidateLayout();
	};	
	
/**
 * @function setColumnDefinition
 * Sets a column definition to the supplied column index.
 * 
 * @param definition GridContainerRowColumnDefinition
 * The definition to apply to the supplied column index.
 * 
 * @param index int
 * The column index to apply the definition.
 */	
GridContainerElement.prototype.setColumnDefinition = 
	function (definition, index)
	{
		var mapKey = Number(index).toString();
		var oldDefinition = this._columnDefinitions[mapKey];
		
		if (oldDefinition == definition)
			return;
		
		if (definition != null)
			this._columnDefinitions[mapKey] = definition;
		else
			delete this._columnDefinitions[mapKey];
		
		this._removeRowColumnDefinition(oldDefinition);
		this._addRowColumnDefinition(definition);
		
		this._invalidateMeasure();
		this._invalidateLayout();
	};
	
/**
 * @function getColumnDefinition
 * Gets the column definition associated with the supplied column index.
 * 
 * @param index int
 * The column index to return the associated GridContainerRowColumnDefinition.
 * 
 * @returns GridContainerRowColumnDefinition
 * The GridContainerRowColumnDefinition associated with the supplied column index or null.
 */		
GridContainerElement.prototype.getColumnDefinition = 
	function (index)
	{
		var mapKey = Number(index).toString();
		if (mapKey in this._columnDefinitions)
			return this._columnDefinitions[mapKey];
		
		return null;
	};
	
/**
 * @function clearColumnDefinitions
 * Clears all column definitions.
 */		
GridContainerElement.prototype.clearColumnDefinitions = 
	function ()
	{
		for (var mapKey in this._columnDefinitions)
			this._removeRowColumnDefinition(this._columnDefinitions[mapKey]);
		
		this._columnDefinitions = Object.create(null);		
		
		this._invalidateMeasure();
		this._invalidateLayout();
	};	
	
/**
 * @function setCellElement
 * Sets an element to be used for the supplied row and column indexes
 * or spans. If any element(s) already occupies the supplied
 * row or column spans, they will be removed.
 * 
 * @param element CanvasElement
 * The element to insert into grid spanning the supplied row and column indexes.
 * 
 * @param rowIndexStart int
 * The row index to insert the element.
 * 
 * @param columnIndexStart int
 * The column index to insert the element.
 * 
 * @param rowIndexEnd int
 * Optional - If the element is to span multiple rows this is the last
 * row index (inclusive) the element should occupy. If omitted this will
 * be automatically set to rowIndexStart. 
 * 
 * @param columnIndexEnd int
 * Optional - If the element is to span multiple columns this is the last
 * column index (inclusive) the element should occupy. If omitted this will
 * be automatically set to columnIndexStart.
 */		
GridContainerElement.prototype.setCellElement = 
	function (element, rowIndexStart, columnIndexStart, rowIndexEnd, columnIndexEnd)
	{
		if (rowIndexEnd == null)
			rowIndexEnd = rowIndexStart;
		
		if (columnIndexEnd == null)
			columnIndexEnd = columnIndexStart;
	
		var swap;
		if (rowIndexStart > rowIndexEnd)
		{
			swap = rowIndexEnd;
			rowIndexEnd = rowIndexStart;
			rowIndexStart = swap;
		}
		
		if (columnIndexStart > columnIndexEnd)
		{
			swap = columnIndexEnd;
			columnIndexEnd = columnIndexStart;
			columnIndexStart = swap;
		}
		
		//Purge any overlapping elements (or ourself if we're moving an element to a different cell)
		for (var i = this._gridCells.length - 1; i >= 0; i--)
		{
			if (this._gridCells[i].element == element || 
				(this._gridCells[i].rowIndexStart <= rowIndexEnd && this._gridCells[i].rowIndexEnd >= rowIndexStart && 
				this._gridCells[i].columnIndexStart <= columnIndexEnd && this._gridCells[i].columnIndexEnd >= columnIndexStart))
			{
				this.removeElement(this._gridCells[i].element);
				this._gridCells.splice(i, 1);
			}
		}
		
		if (element != null)
		{
			this._gridCells.push({element:element, 
								rowIndexStart:rowIndexStart, 
								columnIndexStart:columnIndexStart, 
								rowIndexEnd:rowIndexEnd, 
								columnIndexEnd:columnIndexEnd});
			
			this.addElement(element);
		}
	};
	
/**
 * @function getCellElement
 * Gets the CanvasElement associated with (or spanning) the supplied row and column indexes.
 * 
 * @param rowIndex int
 * The row index to return the associated CanvasElement.
 * 
 * @param columnIndex int
 * The column index to return the associated CanvasElement.
 * 
 * @returns CanvasElement
 * The CanvasElement associated with the supplied row and column index or null.
 */	
GridContainerElement.prototype.getCellElement = 
	function (rowIndex, columnIndex)
	{
		for (var i = 0; i < this._gridCells.length; i++)
		{
			if (rowIndex >= this._gridCells[i].rowIndexStart && rowIndex <= this._gridCells[i].rowIndexEnd &&
				columnIndex >= this._gridCells[i].columnIndexStart && columnIndex <= this._gridCells[i].columnIndexEnd)
			{
				return this._gridCells[i].element;
			}
		}
		
		return null;
	};
	
/**
 * @function clearCellElements
 * Clears all element from the GridContainerElement.
 */	
GridContainerElement.prototype.clearCellElements = 
	function ()
	{
		for (var i = 0; i < this._gridCells.length; i++)
			this.removeElement(this._gridCells[i].element);
		
		this._gridCells.length = 0;
	};
	

////////STATIC INTERNAL/////////////////
	
////Sort comparators for measure / layout array sorting////
	
//Sort by span and maxStretch
GridContainerElement._stretchSpanMaxStretchComparator = 
	function (dataA, dataB)
	{
		//ascending
		if (dataA.span < dataB.stretchSpan)
			return -1;
		else if (dataA.span > dataB.stretchSpan)
			return 1;
		
		//ascending
		if (dataA.maxStretch < dataB.maxStretch)
			return -1;
		else if (dataA.maxStretch > dataB.maxStretch)
			return 1;
		
		return 0;
	};
	
//Sort by stretch priority (descending) and actual size	
GridContainerElement._stretchPriorityActualSizeComparator = 
	function (dataA, dataB)
	{
		//descending
		if (dataA.stretchPriority > dataB.stretchPriority)
			return -1;
		else if (dataA.stretchPriority < dataB.stretchPriority)
			return 1;
	
		//ascending
		if (dataA.actualSize < dataB.actualSize)
			return -1;
		else if (dataA.actualSize > dataB.actualSize)
			return 1;

		return 0;
	};
	
//Sort by index	
GridContainerElement._indexComparator = 
	function (dataA, dataB)
	{
		//ascending
		if (dataA.index < dataB.index)
			return -1;
		else if (dataA.index > dataB.index)
			return 1;
		
		return 0;
	};	
	
	
////////INTERNAL/////////////////////
	
/**
 * @function _onRowColumnDefinitionChanged
 * Event handler for row and columns GridContainerRowColumnDefinition "stylechanged" event. 
 * Updates the GridContainerElement.
 * 
 * @param styleChangedEvent StyleChangedEvent
 * The StyleChangedEvent to process.
 */		
GridContainerElement.prototype._onRowColumnDefinitionChanged = 
	function (event)
	{
		this._invalidateMeasure();
		this._invalidateLayout();
	};

//@private	
GridContainerElement.prototype._addRowColumnDefinition = 
	function (definition)
	{
		if (definition == null)
			return;
		
		for (var i = 0; i < this._rowColumnDefinitionCount.length; i++)
		{
			if (this._rowColumnDefinitionCount[i].definition == definition)
			{
				this._rowColumnDefinitionCount[i].count++;
				return;
			}
		}
		
		this._rowColumnDefinitionCount.push({definition:definition, count:1});
		
		if (this._manager != null)
			definition.addEventListener("stylechanged", this._onRowColumnDefinitionChangedInstance);
	};
	
//@private	
GridContainerElement.prototype._removeRowColumnDefinition = 
	function (definition)
	{
		if (definition == null)
			return;
		
		for (var i = 0; i < this._rowColumnDefinitionCount.length; i++)
		{
			if (this._rowColumnDefinitionCount[i].definition == definition)
			{
				this._rowColumnDefinitionCount[i].count--;
				
				if (this._rowColumnDefinitionCount[i].count == 0)
				{
					this._rowColumnDefinitionCount.splice(i, 1);
					
					if (this._manager != null)
						definition.removeEventListener("stylechanged", this._onRowColumnDefinitionChangedInstance);
				}
				
				return;
			}
		}
	};	
	
//@override	
GridContainerElement.prototype._onCanvasElementAdded = 
	function (addedRemovedEvent)
	{
		GridContainerElement.base.prototype._onCanvasElementAdded.call(this, addedRemovedEvent);
		
		for (var i = 0; i < this._rowColumnDefinitionCount.length; i++)
			this._rowColumnDefinitionCount[i].definition.addEventListener("stylechanged", this._onRowColumnDefinitionChangedInstance);
	};
	
//@override	
GridContainerElement.prototype._onCanvasElementRemoved = 
	function (addedRemovedEvent)
	{
		GridContainerElement.base.prototype._onCanvasElementRemoved.call(this, addedRemovedEvent);
		
		for (var i = 0; i < this._rowColumnDefinitionCount.length; i++)
			this._rowColumnDefinitionCount[i].definition.removeEventListener("stylechanged", this._onRowColumnDefinitionChangedInstance);
	};		
	
//@private	
GridContainerElement.prototype._createRowOrColumnData = 
	function (index, isRow)
	{
		var data = {size:null,
					percentSize:null,
					minSize:null,
					maxSize:null,
					stretchPriority:0,
					index:index,
					actualSize:0,
					actualPosition:0};
	
		var map = (isRow == true ? this._rowDefinitions : this._columnDefinitions);
		var mapKey = index.toString();
		
		if (map[mapKey] != null)
		{
			data.size = map[mapKey].getStyle("Size");
			
			if (data.size == null) //Stretch-able row/column
			{
				data.percentSize = map[mapKey].getStyle("PercentSize");
				data.minSize = map[mapKey].getStyle("MinSize");
				data.maxSize = map[mapKey].getStyle("MaxSize");
				
				if (data.percentSize == null)
					data.stretchPriority = map[mapKey].getStyle("StretchPriority");
				else
					data.stretchPriority = Number.MAX_VALUE;
				
				if (data.minSize != null)
					data.actualSize = data.minSize;
			}
			else //Fixed size row/column
			{
				data.stretchPriority = null;
				data.actualSize = data.size;
			}
		}
	
		if (data.minSize == null)
			data.minSize = 0;
		if (data.maxSize == null)
			data.maxSize = Number.MAX_VALUE;
		
		return data;
	};
	
//@private	
GridContainerElement.prototype._getRowsAndColumnsMeasuredData = 
	function ()
	{
		var layoutVerticalGap = this.getStyle("LayoutVerticalGap");
		var layoutHorizontalGap = this.getStyle("LayoutHorizontalGap");
	
		//Cache for row/column layout data, we use both map for lookup and array for sorting
		var rowDataMap = Object.create(null);
		var columnDataMap = Object.create(null);
		
		//Create data for all styled rows and columns
		var mapKey;
		for (mapKey in this._rowDefinitions)
			rowDataMap[mapKey] = this._createRowOrColumnData(Number(mapKey), true);
	
		for (mapKey in this._columnDefinitions)
			columnDataMap[mapKey] = this._createRowOrColumnData(Number(mapKey), false);
	
		var i;
		var i2;
		var i3;
		var cellData;
		var cellRowData;
		var cellColumnData;
		
		var rowSpan;			//Number of stretch-able rows a cell spans
		var columnSpan;			//Number of stretch-able columns a cell spans
		var rowMaxStretch;		//Maximum stretch priority of rows that cell spans
		var columnMaxStretch;	//Maximum stretch priority of columns that cell spans
		
		//Sorted array of cells (2 priority sort, first by span, second by maxStretch)
		var cellsByRowSorted = [];
		var cellsByColumnSorted = [];
		
		//Scan the cells, record data for stretch-able rows/columns and sort them by span & maxStretch.
		for (i = 0; i < this._gridCells.length; i++)
		{
			cellData = this._gridCells[i];
			
			rowStretchSpan = 0;
			columnStretchSpan = 0;
			rowMaxStretch = null;
			columnMaxStretch = null;
			
			//Scan the rows this cell spans.
			for (i2 = cellData.rowIndexStart; i2 <= cellData.rowIndexEnd; i2++)
			{
				//Get row data / create if does not exist
				if (rowDataMap[i2] == null)
					rowDataMap[i2] = this._createRowOrColumnData(i2, true);
				
				//If this is stretch-able row, increment span and adjust maxStretch
				if (rowDataMap[i2].stretchPriority != null)
				{
					rowStretchSpan++;
					
					if (rowMaxStretch == null)
						rowMaxStretch = rowDataMap[i2].stretchPriority;
					else
						rowMaxStretch = Math.max(rowMaxStretch, rowDataMap[i2].stretchPriority);
				}
			}
			
			//Scan the columns this cell spans.
			for (i2 = cellData.columnIndexStart; i2 <= cellData.columnIndexEnd; i2++)
			{
				//Get column data / create if does not exist
				if (columnDataMap[i2] == null)
					columnDataMap[i2] = this._createRowOrColumnData(i2, false);
				
				//If this column is stretch-able, increment span and adjust maxStretch
				if (columnDataMap[i2].stretchPriority != null)
				{
					columnStretchSpan++;
					
					if (columnMaxStretch == null)
						columnMaxStretch = columnDataMap[i2].stretchPriority;
					else
						columnMaxStretch = Math.max(columnMaxStretch, columnDataMap[i2].stretchPriority);
				}
			}
			
			//Store cell row data if this cell has stretch-able row(s)
			if (rowStretchSpan > 0)
			{
				cellRowData = {startIndex:cellData.rowIndexStart,
								endIndex:cellData.rowIndexEnd,
								stretchSpan:rowStretchSpan,
								maxStretch:rowMaxStretch,
								minSize:Math.max(cellData.element.getStyle("MinHeight"), cellData.element._measuredHeight),
								span:cellData.rowIndexEnd - cellData.rowIndexStart};
				
				cellsByRowSorted.push(cellRowData);
			}
			
			//Store cell column data if this cell has stretch-able column(s)
			if (columnStretchSpan > 0)
			{
				cellColumnData = {startIndex:cellData.columnIndexStart,
									endIndex:cellData.columnIndexEnd,
									stretchSpan:columnStretchSpan,
									maxStretch:columnMaxStretch,
									minSize:Math.max(cellData.element.getStyle("MinWidth"), cellData.element._measuredWidth),
									span:cellData.columnIndexEnd - cellData.columnIndexStart};
				
				cellsByColumnSorted.push(cellColumnData);
			}
		}
		
		//Sort cell data by stretch span and max stretch
		cellsByRowSorted.sort(GridContainerElement._stretchSpanMaxStretchComparator);
		cellsByColumnSorted.sort(GridContainerElement._stretchSpanMaxStretchComparator);
		
		//Row/Column calculation is identical, so these represent either when we loop twice (once for rows, again for columns)
		var layoutGap;
		var rowColumnDataMap;
		var cellsByRowColumnSorted;
		
		var actualSize;
		var distributeCount; 		//Number of rows/columns to distribute size too
		var distributeSize;  		//Current size to be distributed across distributeCount columns/rows
		var distributeSizeTotal;	//Total size to be distributed
		var stretchRowsColumns = [];
		
		//Calculate measured sizes of stretch-able rows / columns
		for (i = 0; i < 2; i++) //Run twice, rows then columns
		{
			layoutGap = (i == 0 ? layoutVerticalGap : layoutHorizontalGap);
			rowColumnDataMap = (i == 0 ? rowDataMap : columnDataMap);
			cellsByRowColumnSorted = (i == 0 ? cellsByRowSorted : cellsByColumnSorted);
			
			//Scan over cells
			for (i2 = 0; i2 < cellsByRowColumnSorted.length; i2++)
			{
				actualSize = 0;
				stretchRowsColumns.length = 0;
				cellData = cellsByRowColumnSorted[i2];
				
				//Scan the rows/columns this cell is spanning
				for (i3 = cellData.startIndex; i3 <= cellData.endIndex; i3++)
				{
					//Ignore rows/columns that size is maxed or are not stretch-able (fixed size)
					if (rowColumnDataMap[i3].actualSize < rowColumnDataMap[i3].maxSize && rowColumnDataMap[i3].stretchPriority != null)
						stretchRowsColumns.push(rowColumnDataMap[i3]);
					
					actualSize += rowColumnDataMap[i3].actualSize;
				}
				
				//Sort row/column data by stretch priority then current size (we stretch equally among smallest)
				stretchRowsColumns.sort(GridContainerElement._stretchPriorityActualSizeComparator);
				
				//Record total size that needs to be distributed, adjust for layout gap
				distributeSizeTotal = cellData.minSize - actualSize - (layoutGap * cellData.span);
				
				//Stretch the rows/columns
				while (distributeSizeTotal >= 1 && stretchRowsColumns.length > 0)
				{
					distributeCount = 0;
					distributeSize = distributeSizeTotal;
					
					//Scan rows/columns that we need to stretch
					for (i3 = 0; i3 < stretchRowsColumns.length; i3++)
					{
						//Equal size and priority
						if (stretchRowsColumns[i3].actualSize == stretchRowsColumns[0].actualSize && 
							stretchRowsColumns[i3].stretchPriority == stretchRowsColumns[0].stretchPriority)
						{
							distributeCount++;
							
							//Reduce distribute size to limiting max size
							if ((stretchRowsColumns[i3].maxSize - stretchRowsColumns[i3].actualSize) * distributeCount < distributeSize)
								distributeSize = (stretchRowsColumns[i3].maxSize - stretchRowsColumns[i3].actualSize) * distributeCount;
						}
						else
						{
							//Same priority but size is larger, stretch to this size.
							if (stretchRowsColumns[i3].stretchPriority == stretchRowsColumns[0].stretchPriority)
							{
								//Reduce distribute size to limiting size of larger row/column
								if ((stretchRowsColumns[i3].actualSize - stretchRowsColumns[0].actualSize) * distributeCount < distributeSize)
									distributeSize = (stretchRowsColumns[i3].actualSize - stretchRowsColumns[0].actualSize) * distributeCount;
							}
							
							break;
						}
					}
					
					//Distribute size equally across rows/columns to stretch
					if (distributeSize >= distributeCount)
					{
						//Divide for per row/column and round down
						distributeSize = Math.floor(distributeSize / distributeCount);
						distributeSizeTotal -= (distributeSize * distributeCount);
						
						for (i3 = 0; i3 < distributeCount; i3++)
							stretchRowsColumns[i3].actualSize += distributeSize;
					}
					else //Fractional size left over, distribute remainder by pixel 
					{
						distributeSizeTotal -= distributeSize;
						
						for (i3 = 0; i3 < distributeSize; i3++)
							stretchRowsColumns[i3].actualSize++;
					}
					
					//Purge rows/columns that are at max size
					if (distributeSizeTotal >= 1)
					{
						for (i3 = stretchRowsColumns.length - 1; i3 >= 0; i3--)
						{
							if (stretchRowsColumns[i3].actualSize >= stretchRowsColumns[i3].maxSize)
								stretchRowsColumns.splice(i3, 1);
						}
					}
				}
			}
		}
		
		return {rowDataMap:rowDataMap, columnDataMap:columnDataMap};
	};
	
//@override
GridContainerElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		GridContainerElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("LayoutVerticalGap" in stylesMap ||
			"LayoutHorizontalGap" in stylesMap)
		{
			this._invalidateMeasure();
			this._invalidateLayout();
		}
		else if ("LayoutVerticalAlign" in stylesMap || 
				"LayoutHorizontalAlign" in stylesMap)
		{
			this._invalidateLayout();
		}
	};	
	
//@override
GridContainerElement.prototype._doMeasure = 
	function (padWidth, padHeight)
	{
		var layoutVerticalGap = this.getStyle("LayoutVerticalGap");
		var layoutHorizontalGap = this.getStyle("LayoutHorizontalGap");
	
		//Get measured row and column sizes.
		var measuredRowsAndColumns = this._getRowsAndColumnsMeasuredData();
		
		//For convenience
		var rowDataMap = measuredRowsAndColumns.rowDataMap;
		var columnDataMap = measuredRowsAndColumns.columnDataMap;
		
		var rowsTotalSize = 0;
		var columnsTotalSize = 0;
		
		var addGap;
		var mapKey;
		
		addGap = false;
		for (mapKey in rowDataMap)
		{
			rowsTotalSize += rowDataMap[mapKey].actualSize;
			
			if (addGap == false)
				addGap = true;
			else
				rowsTotalSize += layoutVerticalGap;
		}

		addGap = false;
		for (mapKey in columnDataMap)
		{
			columnsTotalSize += columnDataMap[mapKey].actualSize;
			
			if (addGap == false)
				addGap = true;
			else
				columnsTotalSize += layoutHorizontalGap;
		}
		
		return {width:padWidth + columnsTotalSize, height:padHeight + rowsTotalSize};
	};	
	
//@override
GridContainerElement.prototype._doLayout =
	function(paddingMetrics)
	{
		GridContainerElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		var layoutVerticalGap = this.getStyle("LayoutVerticalGap");
		var layoutHorizontalGap = this.getStyle("LayoutHorizontalGap");
	
		//Copy draw metrics from paddingMetrics (for convenience)
		var x = paddingMetrics.getX();
		var y = paddingMetrics.getY();
		var w = paddingMetrics.getWidth();
		var h = paddingMetrics.getHeight();
		
		//Get measured row and column sizes.
		var measuredRowsAndColumns = this._getRowsAndColumnsMeasuredData();
		
		//For convenience
		var rowDataMap = measuredRowsAndColumns.rowDataMap;
		var columnDataMap = measuredRowsAndColumns.columnDataMap;
		
		var rowDataSorted = [];
		var columnDataSorted = [];
		
		var percentSizedRows = [];
		var percentSizedColumns = [];
		
		var rowsTotalPercent = 0;
		var columnsTotalPercent = 0;
		
		var rowsTotalGap = 0;
		var columnsTotalGap = 0;
		
		var rowsTotalSize = 0;
		var columnsTotalSize = 0;
		
		var rowsAvailableSize = 0;
		var columnsAvailableSize = 0;
		
		var mapKey;
		for (mapKey in rowDataMap)
		{
			rowDataSorted.push(rowDataMap[mapKey]);
			
			if (rowDataMap[mapKey].percentSize != null)
			{
				rowDataMap[mapKey].minSize = Math.max(rowDataMap[mapKey].actualSize, rowDataMap[mapKey].minSize);
				percentSizedRows.push(rowDataMap[mapKey]);
				rowsTotalPercent += rowDataMap[mapKey].percentSize;
			}
		}

		for (mapKey in columnDataMap)
		{
			columnDataSorted.push(columnDataMap[mapKey]);
			
			if (columnDataMap[mapKey].percentSize != null)
			{
				columnDataMap[mapKey].minSize = Math.max(columnDataMap[mapKey].actualSize, columnDataMap[mapKey].minSize);
				percentSizedColumns.push(columnDataMap[mapKey]);
				columnsTotalPercent += columnDataMap[mapKey].percentSize;
			}
		}

		//Sort row and column data by index
		rowDataSorted.sort(GridContainerElement._indexComparator);
		columnDataSorted.sort(GridContainerElement._indexComparator);
		
		//Calculate the total row/column gap size
		if (rowDataSorted.length > 1)
			rowsTotalGap = (rowDataSorted.length - 1) * layoutVerticalGap;
		
		if (columnDataSorted.length > 1)
			columnsTotalGap = (columnDataSorted.length - 1) * layoutHorizontalGap;
		
		//Get the total size of non-percent sized rows
		for (i = 0; i < rowDataSorted.length; i++)
		{
			if (rowDataSorted[i].percentSize == null)
				rowsTotalSize += rowDataSorted[i].actualSize;
		}
		
		//Add gap
		rowsTotalSize += rowsTotalGap;
		
		//Get the total size of non-percent sized columns
		for (i = 0; i < columnDataSorted.length; i++)
		{
			if (columnDataSorted[i].percentSize == null)
				columnsTotalSize += columnDataSorted[i].actualSize;
		}
		
		//Add gap
		columnsTotalSize += columnsTotalGap;		
		
		//Calculate the available size for percent sized rows/columns
		rowsAvailableSize = h - rowsTotalSize;
		if (rowsTotalPercent < 100 )
			rowsAvailableSize = Math.round(rowsAvailableSize * (rowsTotalPercent / 100));
		
		columnsAvailableSize = w - columnsTotalSize;
		if (columnsTotalPercent < 100)
			columnsAvailableSize = Math.round(columnsAvailableSize * (columnsTotalPercent / 100));
		
		//Calculate the size of percent sized rows
		CanvasElement._calculateMinMaxPercentSizes(percentSizedRows, rowsAvailableSize);
		
		//Calculate the size of percent sized columns
		CanvasElement._calculateMinMaxPercentSizes(percentSizedColumns, columnsAvailableSize);
		
		//Update total content size of rows
		for (i = 0; i < percentSizedRows.length; i++)
			rowsTotalSize += percentSizedRows[i].actualSize;
		
		//Update total content size of columns
		for (i = 0; i < percentSizedColumns.length; i++)
			columnsTotalSize += percentSizedColumns[i].actualSize;
		
		//Get rows/columns start position
		var actualX = x;
		var actualY = y;
		
		//Adjust vertical start position based on layout styles
		if (rowsTotalSize != h)
		{
			var layoutVerticalAlign = this.getStyle("LayoutVerticalAlign");
			
			if (layoutVerticalAlign == "middle")
				actualY += Math.round((h / 2) - (rowsTotalSize / 2));
			else if (layoutVerticalAlign == "bottom")
				actualY += (h - rowsTotalSize);
		}
		
		//Adjust horizontal start position based on layout styles
		if (columnsTotalSize != w)
		{
			var layoutHorizontalAlign = this.getStyle("LayoutHorizontalAlign");
			
			if (layoutHorizontalAlign == "center")
				actualX += Math.round((w / 2) - (columnsTotalSize / 2));
			else if (layoutHorizontalAlign == "right")
				actualX += (w - columnsTotalSize);
		}
		
		//Calculate position of rows/columns
		var lastSize;
		var layoutGap;
		var lastPosition;
		var rowColumnDataSorted;
		
		for (i = 0; i < 2; i++) //Run twice, rows then columns
		{
			lastSize = 0;
			layoutGap = (i == 0 ? layoutVerticalGap : layoutHorizontalGap);
			lastPosition = (i == 0 ? actualY : actualX);
			rowColumnDataSorted = (i == 0 ? rowDataSorted : columnDataSorted);
			
			for (i2 = 0; i2 < rowColumnDataSorted.length; i2++)
			{
				rowColumnDataSorted[i2].actualPosition = lastPosition + lastSize;
				
				//Insert gap
				if (i2 > 0)
					rowColumnDataSorted[i2].actualPosition += layoutGap;
				
				lastSize = rowColumnDataSorted[i2].actualSize;
				lastPosition = rowColumnDataSorted[i2].actualPosition;
			}
		}
		
		//Size & place cells
		var cellX;
		var cellY;
		var cellW;
		var cellH;
		var insertRowGap;
		var insertColumnGap;
		
		for (i = 0; i < this._gridCells.length; i++)
		{
			cell = this._gridCells[i];
			
			cellX = null;
			cellY = null;
			cellW = 0;
			cellH = 0;
			
			insertRowGap = false;
			insertColumnGap = false;
			
			for (i2 = cell.rowIndexStart; i2 <= cell.rowIndexEnd; i2++)
			{
				if (cellY == null)
					cellY = rowDataMap[i2].actualPosition;
				
				cellH += rowDataMap[i2].actualSize;
				
				if (insertRowGap == false)
					insertRowGap = true;
				else
					cellH += layoutVerticalGap;
			}
			
			for (i2 = cell.columnIndexStart; i2 <= cell.columnIndexEnd; i2++)
			{
				if (cellX == null)
					cellX = columnDataMap[i2].actualPosition;
				
				cellW += columnDataMap[i2].actualSize;
				
				if (insertColumnGap == false)
					insertColumnGap = true;
				else
					cellW += layoutHorizontalGap;
			}
			
			cell.element._setActualPosition(cellX, cellY);
			cell.element._setActualSize(cellW, cellH);
		}
	};
	
	
	