
/**
 * @depends FillBase.js
 */

////////////////////////////////////////////////////////
/////////////////LinearGradientFill/////////////////////	

/**
 * @class LinearGradientFill
 * @inherits FillBase
 * 
 * Fills a linear gradient across the element with supplied angle and color stops.
 * 
 * @constructor LinearGradientFill 
 * Creates new LinearGradientFill instance.
 */
function LinearGradientFill()
{
	LinearGradientFill.base.prototype.constructor.call(this);
}

//Inherit from ShapeBase
LinearGradientFill.prototype = Object.create(FillBase.prototype);
LinearGradientFill.prototype.constructor = LinearGradientFill;
LinearGradientFill.base = FillBase;


/////////////Style Types///////////////////////////////

LinearGradientFill._StyleTypes = Object.create(null);


/**
 * @style GradientDegrees Number
 * 
 * Angle which the gradient should be drawn across the element
 */
LinearGradientFill._StyleTypes.GradientDegrees = 						StyleableBase.EStyleType.NORMAL;		// 45

/**
 * @style GradientColorStops Array
 * 
 * Array of color stops to apply to the gradient.
 * Format like [[percent, "color"], [percent, "color"], ...]
 */
LinearGradientFill._StyleTypes.GradientColorStops = 					StyleableBase.EStyleType.NORMAL;		// [[0, "#FFFFFF"], [1, "#000000]]


////////////Default Styles///////////////////////////

LinearGradientFill.StyleDefault = new StyleDefinition();

LinearGradientFill.StyleDefault.setStyle("GradientDegrees", 			0);	// 45
LinearGradientFill.StyleDefault.setStyle("GradientColorStops", 			[[0, "#FF0000"], [1, "#00FF00"]]);


////////////Public//////////////////////

//@override
LinearGradientFill.prototype.drawFill = 
	function (ctx, metrics)
	{
		var degrees = CanvasElement.normalizeDegrees(this.getStyle("GradientDegrees"));
		var colorStops = this.getStyle("GradientColorStops");
		
		var pointsStart = this._calculateInnerOuterPoints(degrees, metrics);
		var pointsStop = this._calculateInnerOuterPoints(CanvasElement.normalizeDegrees(degrees + 180), metrics);
		
		//Currently always use outer butterfly
		var pointStart = pointsStart[1];
		var pointStop = pointsStop[1];
		
		var gradient = ctx.createLinearGradient(pointStart.x, pointStart.y, pointStop.x, pointStop.y);
		
		for (var i = 0; i < colorStops.length; i++)
			gradient.addColorStop(colorStops[i][0], colorStops[i][1]);
		
		ctx.fillStyle = gradient;
		ctx.fill();
	};	
	
	
///////////Internal////////////////////
	
//@private	
LinearGradientFill.prototype._calculateInnerOuterPoints =
	function (degrees, metrics)
	{
		degrees = CanvasElement.normalizeDegrees(degrees);
	
		var x = metrics.getX();
		var y = metrics.getY();
		var w = metrics.getWidth();
		var h = metrics.getHeight();

		var radians = CanvasElement.degreesToRadians(degrees);
		
		var xRadius = (w / 2);
		var yRadius = (h / 2);
		
		var x1 = CanvasElement.cot(radians) * yRadius;
		var y1 = Math.tan(radians) * xRadius;
		
		if (Math.abs(x1) > xRadius)
		{
			if (x1 < 0)
				x1 = xRadius * -1;
			else
				x1 = xRadius;
		}
		if (Math.abs(y1) > yRadius)
		{
			if (y1 < 0)
				y1 = yRadius * -1;
			else
				y1 = yRadius;
		}
		
		if (degrees > 90 && degrees <= 180)
		{
			y1 = y1 * -1;
		}
		else if (degrees > 180 && degrees <= 270)
		{
			x1 = x1 * -1;
			y1 = y1 * -1;
		}
		else if (degrees > 270)
		{
			x1 = x1 * -1;
		}	
		
		var edgeRadius = Math.sqrt((x1 * x1) + (y1 * y1));
		
		var finalRadius;
		if (Math.abs(y1) < yRadius)
			finalRadius = edgeRadius + Math.abs(((yRadius - Math.abs(y1)) * Math.sin(radians)));
		else
			finalRadius = edgeRadius + Math.abs(((xRadius - Math.abs(x1)) * Math.cos(radians)));
		
		var x2 = finalRadius * Math.cos(radians);
		var y2 = finalRadius * Math.sin(radians);
		
		return [{x:x1 + xRadius, y:y1 + yRadius}, 
				{x:x2 + xRadius, y:y2 + yRadius}];
	};
	
	