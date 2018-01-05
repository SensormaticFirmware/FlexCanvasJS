
/**
 * @depends DataRendererBaseElement.js
 */

///////////////////////////////////////////////////////////////////////
///////////////////////DataGridDataRenderer////////////////////////////

/**
 * @class DataGridDataRenderer
 * @inherits DataRendererBaseElement
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
}
	
//Inherit from DataRendererBaseElement
DataGridDataRenderer.prototype = Object.create(DataRendererBaseElement.prototype);
DataGridDataRenderer.prototype.constructor = DataGridDataRenderer;
DataGridDataRenderer.base = DataRendererBaseElement;

//////////Default Styles/////////////////////////

DataGridDataRenderer.StyleDefault = new StyleDefinition();

//Skin Defaults///////
DataGridDataRenderer.UpSkinStyleDefault = new StyleDefinition();
DataGridDataRenderer.UpSkinStyleDefault.setStyle("BackgroundColor", 			"#FFFFFF");
DataGridDataRenderer.UpSkinStyleDefault.setStyle("AutoGradientType", 			"none");

DataGridDataRenderer.AltSkinStyleDefault = new StyleDefinition();
DataGridDataRenderer.AltSkinStyleDefault.setStyle("BackgroundColor", 			"#F0F0F0");
DataGridDataRenderer.AltSkinStyleDefault.setStyle("AutoGradientType", 			"none");
/////////////////////

DataGridDataRenderer.StyleDefault.setStyle("UpSkinStyle", 						DataGridDataRenderer.UpSkinStyleDefault);	// StyleDefinition
DataGridDataRenderer.StyleDefault.setStyle("AltSkinStyle", 						DataGridDataRenderer.AltSkinStyleDefault);	// StyleDefinition


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
		
		//Invalidate, the item renderer container doesnt measure so wont do it for us.
		this._invalidateMeasure();
		this._invalidateLayout();
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
	
	