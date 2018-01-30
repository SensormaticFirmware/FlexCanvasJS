
/**
 * @depends ShapeBase.js
 */

////////////////////////////////////////////////////////
/////////////RoundedRectangleShape//////////////////////	

/**
 * @class RoundedRectangleShape
 * @inherits ShapeBase
 * 
 * Draws rectangles and rounded rectangles.
 * 
 * @constructor RoundedRectangleShape 
 * Creates new RoundedRectangleShape instance.
 */
function RoundedRectangleShape()
{
	RoundedRectangleShape.base.prototype.constructor.call(this);
}

//Inherit from ShapeBase
RoundedRectangleShape.prototype = Object.create(ShapeBase.prototype);
RoundedRectangleShape.prototype.constructor = RoundedRectangleShape;
RoundedRectangleShape.base = ShapeBase;

/////////////Style Types///////////////////////////////

RoundedRectangleShape._StyleTypes = Object.create(null);

/**
 * @style CornerRadius Number
 * 
 * Radius size in pixels for the rectangle's corners. 
 * CornerRadius effects all corners of the rectangle.
 */
RoundedRectangleShape._StyleTypes.CornerRadius = 					StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style CornerRadiusTopLeft Number
 * 
 * Radius size in pixels for the rectangle's top left corner.  
 * This will override the CornerRadius style unless it is null.
 */
RoundedRectangleShape._StyleTypes.CornerRadiusTopLeft = 			StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style CornerRadiusTopRight Number
 * 
 * Radius size in pixels for the rectangle's top right corner.  
 * This will override the CornerRadius style unless it is null.
 */
RoundedRectangleShape._StyleTypes.CornerRadiusTopRight = 			StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style CornerRadiusBottomLeft Number
 * 
 * Radius size in pixels for the rectangle's bottom left corner.  
 * This will override the CornerRadius style unless it is null.
 */
RoundedRectangleShape._StyleTypes.CornerRadiusBottomLeft = 			StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style CornerRadiusBottomRight Number
 * 
 * Radius size in pixels for the rectangle's bottom right corner.  
 * This will override the CornerRadius style unless it is null.
 */
RoundedRectangleShape._StyleTypes.CornerRadiusBottomRight = 		StyleableBase.EStyleType.NORMAL;		// number || null


////////////Style Defaults////////////////////////////

RoundedRectangleShape.StyleDefault = new StyleDefinition();

RoundedRectangleShape.StyleDefault.setStyle("CornerRadius", 					0);
RoundedRectangleShape.StyleDefault.setStyle("CornerRadiusTopLeft",				null);
RoundedRectangleShape.StyleDefault.setStyle("CornerRadiusTopRight",				null);
RoundedRectangleShape.StyleDefault.setStyle("CornerRadiusBottomLeft",			null);
RoundedRectangleShape.StyleDefault.setStyle("CornerRadiusBottomRight",			null);

////////////Public//////////////////////

//@Override
RoundedRectangleShape.prototype.drawShape = 
	function (ctx, metrics)
	{
		var x = metrics.getX();
		var y = metrics.getY();
		
		var width = metrics.getWidth();
		var height = metrics.getHeight();
		
		var c = this.getStyle("CornerRadius");
		var cTl = this.getStyle("CornerRadiusTopLeft");
		var cTr = this.getStyle("CornerRadiusTopRight");
		var cBl = this.getStyle("CornerRadiusBottomLeft");
		var cBr = this.getStyle("CornerRadiusBottomRight");
		
		if (c == null)
			c = 0;
		if (cTl == null)
			cTl = c;
		if (cTr == null)
			cTr = c;
		if (cBl == null)
			cBl = c;
		if (cBr == null)
			cBr = c;
		
		ctx.moveTo(x, y + cTl);
		
		if (cTl > 0)
			ctx.arcTo(x, y, 
				x + cTl, y, 
				cTl);
		
		ctx.lineTo(x + width - cTr, y);
		
		if (cTr > 0)
			ctx.arcTo(x + width, y, 
				x + width, y + cTr, 
				cTr);
		
		ctx.lineTo(x + width, y + height - cBr);
		
		if (cBr > 0)
			ctx.arcTo(x + width, y + height, 
				x + width - cBr, y + height, 
				cBr);
		
		ctx.lineTo(x + cBl, y + height);
		
		if (cBl > 0)
			ctx.arcTo(x, y + height, 
				x, y + height - cBl, 
				cBl);
		
		ctx.closePath();
	};
	
	