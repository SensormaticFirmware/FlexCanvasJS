
/**
 * @depends DataGridDataRenderer.js
 * @depends DataGridHeaderColumnDividerSkinElement.js
 * @depends ButtonElement.js
 */

//////////////////////////////////////////////////////////////////
/////////////DataGridHeaderElement////////////////////////////////

/**
 * @class DataGridHeaderElement
 * @inherits DataGridDataRenderer
 * 
 * Default DataGrid header element. 
 * Renders header items per parent grid's columns. 
 * Adds drag-able column dividers and updates parent grid's column widths.
 * 
 * 
 * @constructor DataGridHeaderElement 
 * Creates new DataGridHeaderElement instance.
 */
function DataGridHeaderElement()
{
	DataGridHeaderElement.base.prototype.constructor.call(this);
	
	var _self = this;
	
	this._onColumnDividerDragInstance = 
		function (elementEvent)
		{
			_self._onColumnDividerDrag(elementEvent);
		};
}
	
//Inherit from DataGridDataRenderer
DataGridHeaderElement.prototype = Object.create(DataGridDataRenderer.prototype);
DataGridHeaderElement.prototype.constructor = DataGridHeaderElement;
DataGridHeaderElement.base = DataGridDataRenderer;	

/////////////Style Types/////////////////////////

DataGridHeaderElement._StyleTypes = Object.create(null);

/**
 * @style ColumnDividerClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the draggable column divider (defaults to Button). 
 */
DataGridHeaderElement._StyleTypes.ColumnDividerClass = 		StyleableBase.EStyleType.NORMAL; 	// Element constructor()

/**
 * @style ColumnDividerStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the column divider element.
 * See default skin class is DataGridHeaderColumnDividerSkinElement for additional styles.
 * 
 * @seealso DataGridHeaderColumnDividerSkinElement
 */
DataGridHeaderElement._StyleTypes.ColumnDividerStyle = 		StyleableBase.EStyleType.SUBSTYLE; 	// StyleDefinition

/**
 * @style DraggableColumns boolean
 * 
 * When true, column dividers are draggable.
 */
DataGridHeaderElement._StyleTypes.DraggableColumns = 		StyleableBase.EStyleType.NORMAL; 	// StyleDefinition


////////////Default Styles////////////////////

DataGridHeaderElement.StyleDefault = new StyleDefinition();
DataGridHeaderElement.StyleDefault.setStyle("PaddingBottom", 				1);
DataGridHeaderElement.StyleDefault.setStyle("BorderType", 					"solid");
DataGridHeaderElement.StyleDefault.setStyle("BorderThickness", 				1);
DataGridHeaderElement.StyleDefault.setStyle("BorderColor", 					"#000000");

//Column Divider button style
DataGridHeaderElement.ColumnDividerSkinStyleDefault = new StyleDefinition();
DataGridHeaderElement.ColumnDividerSkinStyleDefault.setStyle("DividerLineColor", 		"#777777");
DataGridHeaderElement.ColumnDividerSkinStyleDefault.setStyle("DividerArrowColor", 		"#444444");
DataGridHeaderElement.ColumnDividerSkinStyleDefault.setStyle("BorderType", 				null);
DataGridHeaderElement.ColumnDividerSkinStyleDefault.setStyle("BackgroundColor", 		null);

DataGridHeaderElement.ColumnDividerStyleDefault = new StyleDefinition();
DataGridHeaderElement.ColumnDividerStyleDefault.setStyle("SkinClass", 				DataGridHeaderColumnDividerSkinElement); 
DataGridHeaderElement.ColumnDividerStyleDefault.setStyle("Width", 					11);
DataGridHeaderElement.ColumnDividerStyleDefault.setStyle("TabStop", 				-1);
DataGridHeaderElement.ColumnDividerStyleDefault.setStyle("UpSkinStyle", 			DataGridHeaderElement.ColumnDividerSkinStyleDefault);
DataGridHeaderElement.ColumnDividerStyleDefault.setStyle("OverSkinStyle", 			DataGridHeaderElement.ColumnDividerSkinStyleDefault);
DataGridHeaderElement.ColumnDividerStyleDefault.setStyle("DownSkinStyle", 			DataGridHeaderElement.ColumnDividerSkinStyleDefault);
DataGridHeaderElement.ColumnDividerStyleDefault.setStyle("DisabledSkinStyle", 		DataGridHeaderElement.ColumnDividerSkinStyleDefault);

DataGridHeaderElement.StyleDefault.setStyle("ColumnDividerClass", 					ButtonElement);
DataGridHeaderElement.StyleDefault.setStyle("ColumnDividerStyle", 					DataGridHeaderElement.ColumnDividerStyleDefault); 

DataGridHeaderElement.StyleDefault.setStyle("DraggableColumns", 					true);



////////Internal////////////////////////////////

//@override, we dont need skinning for this element. 
//We inherit from skinnable because it uses the same renderer used for rows for column logic.
DataGridHeaderElement.prototype._getSkinClass = 
	function ()
	{
		return null;
	};


/**
 * @function _onColumnDividerDrag
 * Event handler for column divider "dragging" event. Updates the header item renderers and 
 * parent grid column widths.
 * 
 * @param elementEvent ElementEvent
 * The ElementEvent to process.
 */	
DataGridHeaderElement.prototype._onColumnDividerDrag = 
	function (elementEvent)
	{
		if (this._listData == null)
			return;
		
		var parentGrid = this._listData._parentList;
		var dividerRenderer = null;
		var expectedPosition = 0;
		var totalSize = 0;
		var totalPercent = 0;
		var i;
		
		//Record column data
		var columnData = []; 
		for (i = 0; i < parentGrid._gridColumns.length; i++)
		{
			columnData.push(
				{actualSize:parentGrid._columnSizes[i], 
				percentSize:parentGrid._columnPercents[i],
				oldPercentSize:parentGrid._columnPercents[i],
				minSize:parentGrid._gridColumns[i].getStyle("MinSize"),
				minPercent:0});
			
			totalSize += columnData[i].actualSize;
			totalPercent += columnData[i].percentSize;
		}
		
		//Min percent per column based on its min pixel size.
		for (i = 0; i < columnData.length; i++)
			columnData[i].minPercent = columnData[i].minSize / totalSize * totalPercent;
		
		//Calculate new column widths
		var currentColumn = 0;
		for (i = columnData.length; i < this._itemRenderersContainer._children.length; i++)
		{
			dividerRenderer = this._itemRenderersContainer._children[i];
			currentColumn = i - columnData.length;
			
			expectedPosition += columnData[currentColumn].actualSize;
			
			if (dividerRenderer == elementEvent.getCurrentTarget())
			{
				//Columns left of the divider we adjust by pixel and re-calculate their approximate percents.
				//Columns right of the divider we re-calculate their percents, and then determine the pixel size.
				
				expectedPosition = Math.round(expectedPosition - (dividerRenderer._width / 2)); //Round here
				
				var minPosition = expectedPosition;
				var maxPosition = expectedPosition;
				
				//Record "right" side column data, determine maximum slide position.
				var remainingPercent = 0;
				var remainingSize = 0;
				var remainingColumns = [];
				for (var i2 = currentColumn + 1; i2 < columnData.length; i2++)
				{
					remainingColumns.push(columnData[i2]);
					remainingPercent += columnData[i2].percentSize;
					remainingSize += columnData[i2].actualSize;
					maxPosition += columnData[i2].actualSize - columnData[currentColumn].minSize;
				}
				
				//Minimum slide position.
				for (var i2 = currentColumn; i2 >= 0; i2--)
					minPosition -= (columnData[i2].actualSize - columnData[i2].minSize);

				//Correct if we're outside of min/max
				var actualPosition = dividerRenderer._x;
				if (actualPosition < minPosition)
					actualPosition = minPosition;
				if (actualPosition > maxPosition)
					actualPosition = maxPosition;
				
				//Adjust left side columns
				var percentDelta = 0;
				var availableDelta = actualPosition - expectedPosition;
				remainingSize -= availableDelta;
				
				for (var i2 = currentColumn; i2 >= 0; i2--)
				{
					//Adjust size
					if (columnData[i2].actualSize + availableDelta < columnData[i2].minSize)
					{
						availableDelta -= columnData[i2].actualSize - columnData[i2].minSize;
						columnData[i2].actualSize = columnData[i2].minSize;
					}
					else
					{
						columnData[i2].actualSize += availableDelta;
						availableDelta = 0;
					}
					
					//Calculate column's new percent
					columnData[i2].percentSize = columnData[i2].actualSize / totalSize * totalPercent;
					
					//Add up the percent delta to distribute to "right" side columns.
					percentDelta += columnData[i2].percentSize - columnData[i2].oldPercentSize;
					
					if (availableDelta == 0)
						break;
				}
				
				//Calculate new percentages for remaining columns.
				var percentColumns = remainingColumns.slice();		
				var done = false;
				while (done == false)
				{
					done = true;
					for (var i2 = 0; i2 < percentColumns.length; i2++)
					{
						//Break the percent delta up by ratio.
						var delta = percentDelta * (percentColumns[i2].oldPercentSize / remainingPercent);
						
						//We hit minimum percent, use the minimum, remove it from the calculation and restart.
						if (percentColumns[i2].oldPercentSize - delta < percentColumns[i2].minPercent)
						{
							percentColumns[i2].percentSize = percentColumns[i2].minPercent;
							remainingPercent -= percentColumns[i2].minPercent;
							percentDelta -= (percentColumns[i2].oldPercentSize - percentColumns[i2].percentSize);
							
							percentColumns.splice(i2, 1);
							
							done = false;
							break;
						}
						else
							percentColumns[i2].percentSize = percentColumns[i2].oldPercentSize - delta;
					}
				}
	
				//Translate remaining column percents to actual widths.
				CanvasElement._calculateMinMaxPercentSizes(remainingColumns, remainingSize);
				
				break;
			}
		}
		
		//Update Grids column data.
		for (i = 0; i < columnData.length; i++)
		{
			parentGrid._columnSizes[i] = columnData[i].actualSize;
			parentGrid._columnPercents[i] = columnData[i].percentSize;
		}
		
		this._invalidateLayout();
		parentGrid._invalidateLayout(); //For gridlines
		parentGrid._invalidateListRenderersLayout(); //Adjust columns
	};

//@Override
DataGridHeaderElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		DataGridHeaderElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("ColumnDividerClass" in stylesMap || "ColumnDividerStyle" in stylesMap)
			this._setListData(this._listData, this._itemData);
		
		if ("DraggableColumns" in stylesMap && this._listData != null)
		{
			var parentGrid = this._listData._parentList;
			var draggableColumns = this.getStyle("DraggableColumns");
			var dividerRenderer = null;
			var hasListener = null;
			
			for (var i = parentGrid._gridColumns.length; i < this._itemRenderersContainer._children.length; i++)
			{
				dividerRenderer = this._itemRenderersContainer._children[i];
				dividerRenderer.setStyle("Draggable", draggableColumns);
				
				hasListener = dividerRenderer.hasEventListener("dragging", this._onColumnDividerDragInstance);
				
				if (draggableColumns == true && hasListener == false)
					dividerRenderer.addEventListener("dragging", this._onColumnDividerDragInstance);
				else if (draggableColumns == false && hasListener == true)
					dividerRenderer.removeEventListener("dragging", this._onColumnDividerDragInstance);
				
				if (draggableColumns == true)
					dividerRenderer.setStyle("Enabled", true);
				else
					dividerRenderer.setStyle("Enabled", false);
			}
		}
	};
	
//@Override
DataGridHeaderElement.prototype._setListData = 
	function (listData, itemData)
	{
		// Call base.base
		DataGridDataRenderer.base.prototype._setListData.call(this, listData, itemData);
		
		if (listData == null)
			return;
		
		var i = 0;
		var renderer = null;
		for (i = 0; i < listData._parentList._gridColumns.length; i++)
		{
			renderer = this._itemRenderersContainer._getChildAt(i);
			
			if (renderer == null)
			{
				renderer = listData._parentList._createHeaderItemRenderer(i);
				this._itemRenderersContainer._addChildAt(renderer, i);
			}
			else
			{
				columnDef = listData._parentList._gridColumns[i];
				
				if (renderer.constructor != columnDef.getStyle("HeaderItemClass"))
				{ //Renderer Class changed
					
					this._itemRenderersContainer._removeChildAt(i);
					renderer = listData._parentList._createHeaderItemRenderer(i);
					this._itemRenderersContainer._addChildAt(renderer, i);
				}
				else
				{ //Update DataGridData
					
					listData._parentList._updateHeaderItemRendererData(renderer, i);
				}
			}
		}
		
		var dividerClass = this.getStyle("ColumnDividerClass");
		var draggableColumns = this.getStyle("DraggableColumns");
		
		var totalElements = listData._parentList._gridColumns.length;
		
		if (dividerClass != null)
			totalElements = (totalElements * 2) - 1;
		
		for (var i2 = i; i2 < totalElements; i2++)
		{
			renderer = this._itemRenderersContainer._getChildAt(i2);
			
			if (renderer != null && renderer.constructor != dividerClass)
			{
				this._itemRenderersContainer._removeChildAt(i2);
				renderer = null;
			}
			
			if (renderer == null)
			{
				renderer = new (dividerClass)();
				this._applySubStylesToElement("ColumnDividerStyle", renderer);
				renderer.setStyle("Draggable", draggableColumns);
				
				if (draggableColumns == true)
				{
					renderer.addEventListener("dragging", this._onColumnDividerDragInstance);
					renderer.setStyle("Enabled", true);
				}
				else
					renderer.setStyle("Enabled", false);
				
				this._itemRenderersContainer._addChildAt(renderer, i2);
			}
			else
				this._applySubStylesToElement("ColumnDividerStyle", renderer);
		}
		
		//Purge excess renderers.
		while (this._itemRenderersContainer._children.length > totalElements)
			this._itemRenderersContainer._removeChildAt(this._itemRenderersContainer._children.length - 1);
		
		//Invalidate, the item renderer container doesnt measure so wont do it for us.
		this._invalidateMeasure();
		this._invalidateLayout();
	};

//@Override	
DataGridHeaderElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		DataGridHeaderElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		if (this._listData == null)
			return;
		
		var parentGrid = this._listData._parentList;
		var dividerRenderer = null;
		var currentPosition = 0;
		var columnSize = 0;
		
		//Size / Position divider lines
		for (var i = parentGrid._columnSizes.length; i < this._itemRenderersContainer._children.length; i++)
		{
			dividerRenderer = this._itemRenderersContainer._children[i];
			columnSize = parentGrid._columnSizes[i - parentGrid._columnSizes.length];
			currentPosition += columnSize;
			
			var dividerHeight = dividerRenderer.getStyle("Height");
			if (dividerHeight == null)
				dividerHeight = Math.round(this._itemRenderersContainer._height * .7);
			
			dividerRenderer._setActualSize(dividerRenderer._getStyledOrMeasuredWidth(), dividerHeight);
			dividerRenderer._setActualPosition(currentPosition - (dividerRenderer._getStyledOrMeasuredWidth() / 2), (this._itemRenderersContainer._height / 2) - (dividerRenderer._height / 2));
		}
	};
	
	
//@override - render ourself. Not using skins.
DataGridHeaderElement.prototype._doRender = 
	function ()
	{
		SkinnableElement.base.prototype._doRender.call(this);
	};		