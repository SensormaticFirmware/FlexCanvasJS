
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
 * Used to create and set the Canvas2DContext.fillStyle
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
	
	