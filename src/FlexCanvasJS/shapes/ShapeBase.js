
/**
 * @depends StyleableBase.js
 */

////////////////////////////////////////////////////////
////////////////////ShapeBase///////////////////////////

/**
 * @class ShapeBase
 * @inherits StyleableBase
 * 
 * Abstract base class for drawing vector shape paths. 
 * This is used by CanvasElements when drawing their background shape
 * and can be assigned to CanvasElement's "BackgroundShape" style.
 * When sub-classing, add any necessary styles and implement the drawShape() function.
 * 
 * @constructor ShapeBase 
 * Creates new ShapeBase instance.
 */
function ShapeBase()
{
	ShapeBase.base.prototype.constructor.call(this);
}

//Inherit from StyleableBase
ShapeBase.prototype = Object.create(StyleableBase.prototype);
ShapeBase.prototype.constructor = ShapeBase;
ShapeBase.base = StyleableBase;

////////////Public//////////////////////

/**
 * @function drawShape
 * Used to draw a sub-path shape path to the supplied Canvas2DContext using the supplied metrics.
 * Override this to draw custom shapes. Do *not* call beginPath() as that will destroy previous 
 * sub-paths and *do not* do any filling or other context calls. Only draw and closePath() the sub-path.
 * 
 * @param ctx Canvas2DContext
 * The Canvas2DContext to draw the sub-path on.
 * 
 * @param metrics DrawMetrics
 * DrawMetrics object to use as the bounding box for the sub-path.
 */
ShapeBase.prototype.drawShape = 
	function (ctx, metrics)
	{
		//Stub for override.
	};
	
	