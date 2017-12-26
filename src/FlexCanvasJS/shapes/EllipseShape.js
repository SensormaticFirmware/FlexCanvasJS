
/**
 * @depends ShapeBase.js
 */

////////////////////////////////////////////////////////
/////////////////EllipseShape///////////////////////////

/**
 * @class EllipseShape
 * @inherits ShapeBase
 * 
 * Draws an ellipse that fills the supplied metrics rectangle.
 * 
 * @constructor EllipseShape 
 * Creates new EllipseShape instance.
 */
function EllipseShape()
{
	EllipseShape.base.prototype.constructor.call(this);
}

//Inherit from ShapeBase
EllipseShape.prototype = Object.create(ShapeBase.prototype);
EllipseShape.prototype.constructor = EllipseShape;
EllipseShape.base = ShapeBase;

////////////Public//////////////////////

//@Override
EllipseShape.prototype.drawShape = 
	function (ctx, metrics)
	{
		var w = metrics.getWidth();
		var h = metrics.getHeight();
		
		var spline4Magic = 0.551784;
		var xOffset = (w / 2) * spline4Magic;
		var yOffset = (h / 2) * spline4Magic;
		
		var xStart = metrics.getX();
		var yStart = metrics.getY();
		var xMiddle = xStart + (w / 2);
		var yMiddle = yStart + (h / 2);
		var xEnd = xStart + w;
		var yEnd = yStart + h;
		
		ctx.moveTo(xStart, yMiddle);
		ctx.bezierCurveTo(xStart, yMiddle - yOffset, xMiddle - xOffset, yStart, xMiddle, yStart);
		ctx.bezierCurveTo(xMiddle + xOffset, yStart, xEnd, yMiddle - yOffset, xEnd, yMiddle);
		ctx.bezierCurveTo(xEnd, yMiddle + yOffset, xMiddle + xOffset, yEnd, xMiddle, yEnd);
		ctx.bezierCurveTo(xMiddle - xOffset, yEnd, xStart, yMiddle + yOffset, xStart, yMiddle);
		ctx.closePath();
	};
	
	