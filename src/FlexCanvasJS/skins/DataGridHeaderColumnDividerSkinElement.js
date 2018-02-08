
/**
 * @depends CanvasElement.js
 */

//////////////////////////////////////////////////////////////////
//////DataGridHeaderColumnDividerSkinElement//////////////////////		
	
/**
 * @class DataGridHeaderColumnDividerSkinElement
 * @inherits CanvasElement
 * 
 * Default skin class for the draggable DataGrid column dividers.
 * Renders a line, and drag arrows when mouse is over.
 * 
 * 
 * @constructor DataGridHeaderColumnDividerSkinElement 
 * Creates new DataGridHeaderColumnDividerSkinElement instance.
 */
function DataGridHeaderColumnDividerSkinElement()
{
	DataGridHeaderColumnDividerSkinElement.base.prototype.constructor.call(this);
}

//Inherit from CanvasElement
DataGridHeaderColumnDividerSkinElement.prototype = Object.create(CanvasElement.prototype);
DataGridHeaderColumnDividerSkinElement.prototype.constructor = DataGridHeaderColumnDividerSkinElement;
DataGridHeaderColumnDividerSkinElement.base = CanvasElement;		
	
//////Style Types//////////////////////
DataGridHeaderColumnDividerSkinElement._StyleTypes = Object.create(null);

/**
 * @style DividerLineColor String
 * 
 * Hex color value to be used for the divider line. Format like "#FF0000" (red).
 */
DataGridHeaderColumnDividerSkinElement._StyleTypes.DividerLineColor =			StyleableBase.EStyleType.NORMAL;		//"#000000"

/**
 * @style DividerArrowColor String
 * 
 * Hex color value to be used for the arrows. Format like "#FF0000" (red).
 */
DataGridHeaderColumnDividerSkinElement._StyleTypes.DividerArrowColor =			StyleableBase.EStyleType.NORMAL;		//"up" || "down" || "left" || "right"


////////Default Styles////////////////

DataGridHeaderColumnDividerSkinElement.StyleDefault = new StyleDefinition();

DataGridHeaderColumnDividerSkinElement.StyleDefault.setStyle("DividerLineColor", 		"#777777");
DataGridHeaderColumnDividerSkinElement.StyleDefault.setStyle("DividerArrowColor", 		"#444444");



//@Override
DataGridHeaderColumnDividerSkinElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		DataGridHeaderColumnDividerSkinElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("DividerLineColor" in stylesMap ||
			"DividerArrowColor" in stylesMap)
		{
			this._invalidateRender();
		}
	};

//@Override
DataGridHeaderColumnDividerSkinElement.prototype._doRender = 
	function()
	{
		DataGridHeaderColumnDividerSkinElement.base.prototype._doRender.call(this);
		
		var ctx = this._getGraphicsCtx();
		
		var lineColor = this.getStyle("DividerLineColor");
		var arrowColor = this.getStyle("DividerArrowColor");
		var currentState = this.getStyle("SkinState");
		
		var x = 0;
		var y = 0;
		var w = this._width;
		var h = this._height;
		
		ctx.beginPath();

		ctx.moveTo(x + (w / 2) - .5, y);
		ctx.lineTo(x + (w / 2) - .5, y + h);
		ctx.lineTo(x + (w / 2) + .5, y + h);
		ctx.lineTo(x + (w / 2) + .5, y);
		
		ctx.closePath();
		
		ctx.fillStyle = lineColor;
		ctx.fill();
		
		////////////////////////////
		
		if (currentState == "over" || currentState == "down")
		{
			var arrowHeight = h / 2;
			
			ctx.fillStyle = arrowColor;
			
			ctx.beginPath();
			
			ctx.moveTo(x + (w / 2) - .5 - 1, (h / 2) - (arrowHeight / 2));
			ctx.lineTo(x + (w / 2) - .5 - 1, (h / 2) + (arrowHeight / 2));
			ctx.lineTo(x, y + (h / 2));
			
			ctx.closePath();
			ctx.fill();
			
			ctx.beginPath();
			
			ctx.moveTo(x + (w / 2) + .5 + 1, (h / 2) - (arrowHeight / 2));
			ctx.lineTo(x + (w / 2) + .5 + 1, (h / 2) + (arrowHeight / 2));
			ctx.lineTo(x + w, y + (h / 2));
			
			ctx.closePath();
			ctx.fill();
		}
	};
	
	