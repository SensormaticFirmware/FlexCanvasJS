
/**
 * @depends CanvasElement.js
 */

///////////////////////////////////////////////////////////////////////
/////////////////DropdownArrowButtonSkinElement////////////////////////

/**
 * @class DropdownArrowButtonSkinElement
 * @inherits CanvasElement
 * 
 * Default skin class for Arrow button in the DropdownElement.
 * Renders the divider line and an arrow.
 *  
 * 
 * @constructor DropdownArrowButtonSkinElement 
 * Creates new DropdownArrowButtonSkinElement instance.
 */
function DropdownArrowButtonSkinElement()
{
	DropdownArrowButtonSkinElement.base.prototype.constructor.call(this);
}

//Inherit from CanvasElement
DropdownArrowButtonSkinElement.prototype = Object.create(CanvasElement.prototype);
DropdownArrowButtonSkinElement.prototype.constructor = DropdownArrowButtonSkinElement;
DropdownArrowButtonSkinElement.base = CanvasElement;		
	
//////Style Types//////////////////////
DropdownArrowButtonSkinElement._StyleTypes = Object.create(null);

/**
 * @style ArrowColor String
 * 
 * Hex color value to be used for the arrow. Format like "#FF0000" (red).
 */
DropdownArrowButtonSkinElement._StyleTypes.ArrowColor =				StyleableBase.EStyleType.NORMAL;		//"#000000"

/**
 * @style LineColor String
 * 
 * Hex color value to be used for the divider line. Format like "#FF0000" (red).
 */
DropdownArrowButtonSkinElement._StyleTypes.LineColor =				StyleableBase.EStyleType.NORMAL;		//"#000000"


//////Default Styles///////////////////

DropdownArrowButtonSkinElement.StyleDefault = new StyleDefinition();

DropdownArrowButtonSkinElement.StyleDefault.setStyle("ArrowColor", 				"#000000"); 		
DropdownArrowButtonSkinElement.StyleDefault.setStyle("LineColor", 				"#000000");


/////////Internal Functions////////////////////////

//@Override
DropdownArrowButtonSkinElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		DropdownArrowButtonSkinElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("ArrowColor" in stylesMap || 
			"LineColor" in stylesMap)
		{
			this._invalidateRender();
		}
	};

//@Override
DropdownArrowButtonSkinElement.prototype._doRender = 
	function()
	{
		DropdownArrowButtonSkinElement.base.prototype._doRender.call(this);
		
		var ctx = this._getGraphicsCtx();
		var paddingMetrics = this._getPaddingMetrics();
		
		var lineColor = this.getStyle("LineColor");
		var arrowColor = this.getStyle("ArrowColor");
		
		var x = paddingMetrics.getX();
		var y = paddingMetrics.getY();
		var width = paddingMetrics.getWidth();
		var height = paddingMetrics.getHeight();
		
		if (arrowColor != null)
		{
			ctx.beginPath();
			
			ctx.moveTo(x + (width / 2), y + (height * .60));
			ctx.lineTo(x + (width * .70), y + (height * .40));
			ctx.lineTo(x + (width * .30), y + (height * .40));
			
			ctx.closePath();
			
			ctx.fillStyle = arrowColor;
			ctx.fill();
		}

		if (lineColor != null)
		{
			var lineHeight = height * .65;
			
			ctx.beginPath();
	
			ctx.moveTo(x, y + (height / 2) - (lineHeight / 2));
			ctx.lineTo(x, y + (height / 2) + (lineHeight / 2));
			ctx.lineTo(x + 1, y + (height / 2) + (lineHeight / 2));
			ctx.lineTo(x + 1, y + (height / 2) - (lineHeight / 2));
			
			ctx.closePath();
			
			ctx.fillStyle = lineColor;
			ctx.fill();
		}
	};	
	
	