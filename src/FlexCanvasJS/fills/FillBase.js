
/**
 * @depends StyleableBase.js
 */

////////////////////////////////////////////////////////
////////////////////FillBase///////////////////////////

/**
 * @class FillBase
 * @inherits StyleableBase
 * 
 * Abstract base class for filling element's background shape.
 * When sub-classing, add any necessary styles and implement the drawFill() function.
 * 
 * @constructor FillBase 
 * Creates new FillBase instance.
 */
function FillBase()
{
	FillBase.base.prototype.constructor.call(this);
}

//Inherit from StyleableBase
FillBase.prototype = Object.create(StyleableBase.prototype);
FillBase.prototype.constructor = FillBase;
FillBase.base = StyleableBase;

////////////Public//////////////////////

/**
 * @function drawFill
 * Abstract stub used to fill an elements background.
 * Override this, setup the Canvas2DContext's fill style via ctx.fillStyle and call ctx.fill().
 * The background shape path will have already been drawn by the elements ShapeBase class.
 * 
 * @param ctx Canvas2DContext
 * The Canvas2DContext to draw the fill on.
 * 
 * @param metrics DrawMetrics
 * DrawMetrics object to use as the bounding box for the fill.
 * 
 */
FillBase.prototype.drawFill = 
	function (ctx, metrics)
	{
		//Stub for override.
	};
	
	