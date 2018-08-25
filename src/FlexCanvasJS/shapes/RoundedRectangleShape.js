
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
 * Radius of the rectangles corners in pixels. 
 * CornerRadius effects all corners of the rectangle.
 * This will override CornerRadiusPercent style.
 */
RoundedRectangleShape._StyleTypes.CornerRadius = 					StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style CornerRadiusPercent Number
 * 
 * Radius of the rectangles corners as a percent size of the minimum dimension (width/height). 
 * CornerRadiusPercent effects all corners of the rectangle.
 */
RoundedRectangleShape._StyleTypes.CornerRadiusPercent = 			StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style CornerRadiusTopLeft Number
 * 
 * Radius size of the rectangles top left corner in pixels.  
 * This will override the CornerRadius, CornerRadiusPercent, & CornerRadiusTopLeftPercent styles.
 */
RoundedRectangleShape._StyleTypes.CornerRadiusTopLeft = 			StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style CornerRadiusTopLeftPercent Number
 * 
 * Radius of the rectangles top left corner as a percent size of the minimum dimension (width/height).  
 * This will override the CornerRadius & CornerRadiusPercent styles.
 */
RoundedRectangleShape._StyleTypes.CornerRadiusTopLeft = 			StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style CornerRadiusTopRight Number
 * 
 * Radius size of the rectangles top right corner in pixels.  
 * This will override the CornerRadius, CornerRadiusPercent, & CornerRadiusTopRightPercent styles.
 */
RoundedRectangleShape._StyleTypes.CornerRadiusTopRight = 			StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style CornerRadiusTopRightPercent Number
 * 
 * Radius of the rectangles top right corner as a percent size of the minimum dimension (width/height).  
 * This will override the CornerRadius & CornerRadiusPercent styles.
 */
RoundedRectangleShape._StyleTypes.CornerRadiusTopRightPercent = 	StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style CornerRadiusBottomLeft Number
 * 
 * Radius size of the rectangles bottom left corner in pixels.  
 * This will override the CornerRadius, CornerRadiusPercent, & CornerRadiusBottomLeftPercent styles.
 */
RoundedRectangleShape._StyleTypes.CornerRadiusBottomLeft = 			StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style CornerRadiusBottomLeftPercent Number
 * 
 * Radius of the rectangles bottom left corner as a percent size of the minimum dimension (width/height).  
 * This will override the CornerRadius & CornerRadiusPercent styles.
 */
RoundedRectangleShape._StyleTypes.CornerRadiusBottomLeftPercent = 	StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style CornerRadiusBottomRight Number
 * 
 * Radius size of the rectangles bottom right corner in pixels.  
 * This will override the CornerRadius, CornerRadiusPercent, & CornerRadiusBottomRightPercent styles.
 */
RoundedRectangleShape._StyleTypes.CornerRadiusBottomRight = 		StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style CornerRadiusBottomRightPercent Number
 * 
 * Radius of the rectangles bottom right corner as a percent size of the minimum dimension (width/height).  
 * This will override the CornerRadius & CornerRadiusPercent styles.
 */
RoundedRectangleShape._StyleTypes.CornerRadiusBottomRightPercent = 	StyleableBase.EStyleType.NORMAL;		// number || null


////////////Style Defaults////////////////////////////

RoundedRectangleShape.StyleDefault = new StyleDefinition();

RoundedRectangleShape.StyleDefault.setStyle("CornerRadius", 					null);
RoundedRectangleShape.StyleDefault.setStyle("CornerRadiusPercent", 				null);

RoundedRectangleShape.StyleDefault.setStyle("CornerRadiusTopLeft",				null);
RoundedRectangleShape.StyleDefault.setStyle("CornerRadiusTopLeftPercent",		null);

RoundedRectangleShape.StyleDefault.setStyle("CornerRadiusTopRight",				null);
RoundedRectangleShape.StyleDefault.setStyle("CornerRadiusTopRightPercent",		null);

RoundedRectangleShape.StyleDefault.setStyle("CornerRadiusBottomLeft",			null);
RoundedRectangleShape.StyleDefault.setStyle("CornerRadiusBottomLeftPercent",	null);

RoundedRectangleShape.StyleDefault.setStyle("CornerRadiusBottomRight",			null);
RoundedRectangleShape.StyleDefault.setStyle("CornerRadiusBottomRightPercent",	null);


////////////Public//////////////////////

//@Override
RoundedRectangleShape.prototype.drawShape = 
	function (ctx, metrics)
	{
		var x = metrics.getX();
		var y = metrics.getY();
		
		var width = metrics.getWidth();
		var height = metrics.getHeight();
		var size = Math.min(width, height);
		
		var c = this.getStyle("CornerRadius");
		var cTl = this.getStyle("CornerRadiusTopLeft");
		var cTr = this.getStyle("CornerRadiusTopRight");
		var cBl = this.getStyle("CornerRadiusBottomLeft");
		var cBr = this.getStyle("CornerRadiusBottomRight");
		
		if (c == null)
		{
			var cp = this.getStyle("CornerRadiusPercent");
			if (cp == null)
				c = 0;
			else
				c = size * (cp / 100);
		}
		
		if (cTl == null)
		{
			var cTlp = this.getStyle("CornerRadiusTopLeftPercent");
			if (cTlp == null)
				cTl = c;
			else
				cTl = size * (cTlp / 100);
		}
		
		if (cTr == null)
		{
			var cTrp = this.getStyle("CornerRadiusTopRightPercent");
			if (cTrp == null)
				cTr = c;
			else
				cTr = size * (cTrp / 100);
		}
		
		if (cBl == null)
		{
			var cBlp = this.getStyle("CornerRadiusBottomLeftPercent");
			if (cBlp == null)
				cBl = c;
			else
				cBl = size * (cBlp / 100);
		}
		
		if (cBr == null)
		{
			var cBrp = this.getStyle("CornerRadiusBottomRightPercent");
			if (cBrp == null)
				cBr = c;
			else
				cBr = size * (cBrp / 100);
		}
		
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
	
	