
/**
 * @depends CanvasElement.js
 */

///////////////////////////////////////////////////////////////////////
///////////////////////DataGridDataRenderer////////////////////////////

/**
 * @class DataGridDataRenderer
 * @inherits CanvasElement
 * 
 * Default DataGrid ListItemClass used to render DataGrid rows. Renders
 * column items per the parent DataGrid's column definitions. 
 * 
 * @constructor DataGridDataRenderer 
 * Creates new DataGridDataRenderer instance.
 */

//Used to render the DataGrid rows. 
function DataGridDataRenderer()
{
	DataGridDataRenderer.base.prototype.constructor.call(this);
	
	//Use a containing element for the renderers so we dont interfere with our skins.
	this._itemRenderersContainer = new CanvasElement();
	this._addChild(this._itemRenderersContainer);
	
	var _self = this;
	
	this._onItemRenderersContainerMeasureCompleteInstance = 
		function (event)
		{
			_self.__onItemRenderersContainerMeasureComplete(event);
		};
	
	this._itemRenderersContainer.addEventListener("measurecomplete", this._onItemRenderersContainerMeasureCompleteInstance);
}
	
//Inherit from CanvasElement
DataGridDataRenderer.prototype = Object.create(CanvasElement.prototype);
DataGridDataRenderer.prototype.constructor = DataGridDataRenderer;
DataGridDataRenderer.base = CanvasElement;

//@private
DataGridDataRenderer.prototype.__onItemRenderersContainerMeasureComplete =
	function (event)
	{
		this._invalidateMeasure();
		this._invalidateLayout();
	};

//@Override
DataGridDataRenderer.prototype._setListData = 
	function (listData, itemData)
	{
		DataGridDataRenderer.base.prototype._setListData.call(this, listData, itemData);
		
		var renderer = null;
		for (var i = 0; i < listData._parentList._gridColumns.length; i++)
		{
			renderer = this._itemRenderersContainer._getChildAt(i);
			
			if (renderer == null)
			{
				renderer = listData._parentList._createRowItemRenderer(listData._itemIndex, i);
				this._itemRenderersContainer._addChildAt(renderer, i);
			}
			else
			{
				columnDef = listData._parentList._gridColumns[i];
				
				if (renderer.constructor != columnDef.getStyle("RowItemClass"))
				{ //Renderer Class changed
					
					this._itemRenderersContainer._removeChildAt(i);
					renderer = listData._parentList._createRowItemRenderer(listData._itemIndex, i);
					this._itemRenderersContainer._addChildAt(renderer, i);
				}
				else
				{ //Update DataGridData
					
					listData._parentList._updateRowItemRendererData(renderer, listData._itemIndex, i);
				}
			}
		}
		
		//Purge excess renderers.
		while (this._itemRenderersContainer._children.length > this._listData._parentList._gridColumns.length)
			this._itemRenderersContainer._removeChildAt(this._itemRenderersContainer._children.length - 1);
	};
	
//@override	
DataGridDataRenderer.prototype._setListSelected = 
	function (selectedData)
	{
		DataGridDataRenderer.base.prototype._setListSelected.call(this, selectedData);
		
		var columnData;
		var columnSelectionType;
		var columnSelectable;
		var columnHighlightable;
		var itemRenderer;
		var itemRendererSelectedData;
		
		for (var i = 0; i < this._itemRenderersContainer._children.length; i++)
		{
			columnData = this._listData._parentList._gridColumns[i];
			columnSelectionType = columnData.getStyle("SelectionType");
			columnSelectable = columnData.getStyle("Selectable");
			columnHighlightable = columnData.getStyle("Highlightable");			
			itemRenderer = this._getChildAt(i);

			//Optimize, use existing data if available
			itemRendererSelectedData = itemRenderer._listSelected;
			if (itemRendererSelectedData == null)
				itemRendererSelectedData = {highlight:false, selected:false};
			
			if (columnSelectable == true)
			{
				if ((columnSelectionType == "row" && selectedData.rowIndex == this._listData._itemIndex) ||
					(columnSelectionType == "column" && i == selectedData.columnIndex) ||
					(columnSelectionType == "cell" && i == selectedData.columnIndex && this._listData._itemIndex == selectedData.rowIndex))
				{
					itemRendererSelectedData.selected = true;
				}
			}
			
			if (columnHighlightable == true)
			{
				if ((columnSelectionType == "row" && selectedData.rowOverIndex == this._listData._itemIndex) ||
					(columnSelectionType == "column" && i == selectedData.columnOverIndex) ||
					(columnSelectionType == "cell" && i == selectedData.columnOverIndex && this._listData._itemIndex == selectedData.rowOverIndex))
				{
					itemRendererSelectedData.highlight = true;
				}
			}
			
			itemRenderer._setListSelected(itemRendererSelectedData);
		}
	};
	
//@Override
DataGridDataRenderer.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		var measuredSize = {width: 0, height: 0};
		var childSize = 0;
		
		for (var i = 0; i < this._itemRenderersContainer._children.length; i++)
		{
			childSize = this._itemRenderersContainer._children[i]._getStyledOrMeasuredHeight();
			
			if (measuredSize.height < childSize)
				measuredSize.height = childSize;
			
			measuredSize.width += this._itemRenderersContainer._children[i]._getStyledOrMeasuredWidth();
		}
	
		measuredSize.width += padWidth;
		measuredSize.height += padHeight;
		
		return measuredSize;
	};
	
//@Override	
DataGridDataRenderer.prototype._doLayout = 
	function (paddingMetrics)
	{
		DataGridDataRenderer.base.prototype._doLayout.call(this, paddingMetrics);
		
		if (this._listData == null)
			return;
		
		this._itemRenderersContainer._setActualPosition(paddingMetrics.getX(), paddingMetrics.getY());
		this._itemRenderersContainer._setActualSize(paddingMetrics.getWidth(), paddingMetrics.getHeight());
		
		var parentGrid = this._listData._parentList;
		var rowItemRenderer = null;
		var currentPosition = 0;
		var columnSize = 0;
		
		var paddingSize = this._getPaddingSize();
		
		for (var i = 0; i < parentGrid._columnSizes.length; i++)
		{
			rowItemRenderer = this._itemRenderersContainer._children[i];
			columnSize = parentGrid._columnSizes[i];
			
			if (i == 0)
				columnSize -= paddingSize.paddingLeft;
			else if (i == parentGrid._columnSizes.length - 1) //Consume the rest available.
				columnSize = this._itemRenderersContainer._width - currentPosition;
			
			rowItemRenderer._setActualPosition(currentPosition, 0);
			rowItemRenderer._setActualSize(columnSize, this._itemRenderersContainer._height);
			
			currentPosition += columnSize;
		}
	};	
	
	