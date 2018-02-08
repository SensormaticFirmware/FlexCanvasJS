
/**
 * @depends ShapeBase.js
 */

////////////////////////////////////////////////////////
/////////////////ArrowShape/////////////////////////////	

/**
 * @class ArrowShape
 * @inherits ShapeBase
 * 
 * Draws a variety of arrow-ish shapes such as triangles, rounded pointers,
 * and traditional arrows.
 * 
 * @constructor ArrowShape 
 * Creates new ArrowShape instance.
 */
function ArrowShape()
{
	ArrowShape.base.prototype.constructor.call(this);
}

//Inherit from ShapeBase
ArrowShape.prototype = Object.create(ShapeBase.prototype);
ArrowShape.prototype.constructor = ArrowShape;
ArrowShape.base = ShapeBase;

/////////////Style Types///////////////////////////////

ArrowShape._StyleTypes = Object.create(null);

/**
 * @style Direction String
 * 
 * Determines the direction that the arrow or triangle will point. Acceptable values are "up", "down", "left", and "right".
 * Other styles are named as such when the Arrow is pointed "up". Styles do not change with orientation.
 */
ArrowShape._StyleTypes.Direction = 						StyleableBase.EStyleType.NORMAL;		// "up" || "down" || "left" || "right"

/**
 * @style RectBaseWidth Number
 * 
 * The size in pixels used for the width of the rectangular base of the arrow. Setting this to zero creates a triangle.
 * It is preferrable to use RectBasePercentWidth so that the arrow can scale.
 */
ArrowShape._StyleTypes.RectBaseWidth = 					StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style RectBaseHeight Number
 * 
 * The size in pixels used for the height of the rectangular base of the arrow. Setting this to zero creates a triangle.
 * It is preferrable to use RectBasePercentHeight so that the arrow can scale.
 */
ArrowShape._StyleTypes.RectBaseHeight = 				StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style RectBasePercentWidth Number
 * 
 * The percentage of available width to use for the width of the rectangular base of the arrow. 
 * Acceptable values are between 0 and 100. Setting this to zero will create a triangle.
 */
ArrowShape._StyleTypes.RectBasePercentWidth = 			StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style RectBasePercentHeight Number
 * 
 * The percentage of available height to use for the height of the rectangular base of the arrow. 
 * Acceptable values are between 0 and 100. Setting this to zero will create a triangle.
 */
ArrowShape._StyleTypes.RectBasePercentHeight = 			StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style CornerRadius Number
 * 
 * Radius size in pixels for the rectangular base's corners. 
 * CornerRadius effects all corners of the rectangular base. 
 */
ArrowShape._StyleTypes.CornerRadius = 					StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style CornerRadiusTopLeft Number
 * 
 * Radius size in pixels for the rectangular base's top left corner. 
 * This will override the CornerRadius style unless it is null.
 */
ArrowShape._StyleTypes.CornerRadiusTopLeft = 			StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style CornerRadiusTopRight Number
 * 
 * Radius size in pixels for the rectangular base's top right corner. 
 * This will override the CornerRadius style unless it is null.
 */
ArrowShape._StyleTypes.CornerRadiusTopRight = 			StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style CornerRadiusBottomLeft Number
 * 
 * Radius size in pixels for the rectangular base's bottom left corner. 
 * This will override the CornerRadius style unless it is null. Rounding both bottom corners
 * will give the effect of a rounded pointer. 
 */
ArrowShape._StyleTypes.CornerRadiusBottomLeft = 		StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style CornerRadiusBottomRight Number
 * 
 * Radius size in pixels for the rectangular base's bottom right corner. 
 * This will override the CornerRadius style unless it is null. Rounding both bottom corners
 * will give the effect of a rounded pointer. 
 */
ArrowShape._StyleTypes.CornerRadiusBottomRight = 		StyleableBase.EStyleType.NORMAL;		// number || null


////////////Default Styles///////////////////////////

ArrowShape.StyleDefault = new StyleDefinition();

ArrowShape.StyleDefault.setStyle("Direction", 						"up");	// "up" || "down" || "left" || "right"

ArrowShape.StyleDefault.setStyle("RectBaseWidth", 					null); 	// number || null
ArrowShape.StyleDefault.setStyle("RectBaseHeight", 					null); 	// number || null
ArrowShape.StyleDefault.setStyle("RectBasePercentWidth", 			null);	// number || null
ArrowShape.StyleDefault.setStyle("RectBasePercentHeight", 			null); 	// number || null

ArrowShape.StyleDefault.setStyle("CornerRadius", 					0);		// number || null
ArrowShape.StyleDefault.setStyle("CornerRadiusTopLeft",				null);	// number || null
ArrowShape.StyleDefault.setStyle("CornerRadiusTopRight",			null);	// number || null
ArrowShape.StyleDefault.setStyle("CornerRadiusBottomLeft",			null);	// number || null
ArrowShape.StyleDefault.setStyle("CornerRadiusBottomRight",			null);	// number || null


////////////Public//////////////////////

ArrowShape.prototype.drawShape = 
	function (ctx, metrics)
	{
		var direction = this.getStyle("Direction");
		
		if (direction != "up" && direction != "down" && direction != "left" && direction != "right")
			return;
		
		var x = metrics.getX();
		var y = metrics.getY();
		var width = metrics.getWidth();
		var height = metrics.getHeight();
		
		var c = this.getStyle("CornerRadius");
		var cornerTl = this.getStyle("CornerRadiusTopLeft");
		var cornerTr = this.getStyle("CornerRadiusTopRight");
		var cornerBl = this.getStyle("CornerRadiusBottomLeft");
		var cornerBr = this.getStyle("CornerRadiusBottomRight");
		
		if (c == null)
			c = 0;
		if (cornerTl == null)
			cornerTl = c;
		if (cornerTr == null)
			cornerTr = c;
		if (cornerBl == null)
			cornerBl = c;
		if (cornerBr == null)
			cornerBr = c;
		
		var baseWidth = this.getStyle("RectBaseWidth");
		var baseHeight = this.getStyle("RectBaseHeight");
		
		if (baseWidth == null)
		{
			var rectWidthPercent = this.getStyle("RectBasePercentWidth");
			if (rectWidthPercent == null)
				baseWidth = 0;
			else
				baseWidth = Math.round(width * (rectWidthPercent / 100));
		}
		if (baseHeight == null)
		{
			var rectHeightPercent = this.getStyle("RectBasePercentHeight");
			if (rectHeightPercent == null)
				baseHeight = 0;
			else
				baseHeight = Math.round(height * (rectHeightPercent / 100));
		}
		
		if (baseWidth == 0 || baseHeight == 0)
		{
			baseWidth = 0;
			baseHeight = 0;
		}
		
		if (direction == "down")
		{
			ctx.moveTo(x + ((width - baseWidth) / 2), 
				y + cornerTl);
			
			if (cornerTl > 0)
				ctx.arcTo(x + ((width - baseWidth) / 2), y, 
					x + ((width - baseWidth) / 2) + cornerTl, y, 
					cornerTl);
			
			ctx.lineTo(x + ((width - baseWidth) / 2) + baseWidth - cornerTr, 
				y);
			
			if (cornerTr > 0)
				ctx.arcTo(x + ((width - baseWidth) / 2) + baseWidth, y, 
					x + ((width - baseWidth) / 2) + baseWidth, y + cornerTr, 
					cornerTr);
			
			ctx.lineTo(x + ((width - baseWidth) / 2) + baseWidth, y + baseHeight - cornerBr);
			
			if (cornerBr > 0)
				ctx.arcTo(x + ((width - baseWidth) / 2) + baseWidth, y + baseHeight,
					Math.min(x + ((width - baseWidth) / 2) + baseWidth + cornerBr, x + width), y + baseHeight,
					Math.min(cornerBr, (width - baseWidth) / 2));			
			
			ctx.lineTo(x + width, y + baseHeight);
			ctx.lineTo(x + (width / 2), y + height);
			ctx.lineTo(x, y + baseHeight);
			
			ctx.lineTo(Math.max(x + ((width - baseWidth) / 2) - cornerBl, x), y + baseHeight);
			
			if (cornerBl > 0)
				ctx.arcTo(x + ((width - baseWidth) / 2), y + baseHeight,
					x + ((width - baseWidth) / 2), y + baseHeight - cornerBl,
					Math.min(cornerBl, (width - baseWidth) / 2));
		}
		else if (direction == "left")
		{
			ctx.moveTo(x + width - cornerTr, 
					y +  ((height - baseHeight) / 2));
			
			if (cornerTr > 0)
				ctx.arcTo(x + width, y +  ((height - baseHeight) / 2), 
					x + width, y +  ((height - baseHeight) / 2) + cornerTr, 
					cornerTr);
			
			ctx.lineTo(x + width, 
				y + ((height - baseHeight) / 2) + baseHeight - cornerBr);
			
			if (cornerBr > 0)
				ctx.arcTo(x + width, y + ((height - baseHeight) / 2) + baseHeight, 
					x + width - cornerBr, y + ((height - baseHeight) / 2) + baseHeight, 
					cornerBr);
			
			ctx.lineTo(x + width - baseWidth + cornerBl, y + ((height - baseHeight) / 2) + baseHeight);
			
			if (cornerBl > 0)
				ctx.arcTo(x + width - baseWidth, y + ((height - baseHeight) / 2) + baseHeight,
					x + width - baseWidth, Math.min(y + ((height - baseHeight) / 2) + baseHeight + cornerBl, y + height),
					Math.min(cornerBl, (height - baseHeight) / 2));
			
			
			ctx.lineTo(x + width - baseWidth, y + height);
			ctx.lineTo(x, y + (height / 2));
			ctx.lineTo(x + width - baseWidth, y);
			
			ctx.lineTo(x + width - baseWidth, Math.max(y, y + ((height - baseHeight) / 2) - cornerTl));

			if (cornerTl > 0)
				ctx.arcTo(x + width - baseWidth, y + ((height - baseHeight) / 2),
					x + width - baseWidth + cornerTl, y + ((height - baseHeight) / 2),
					Math.min(cornerTl, (height - baseHeight) / 2));
		}
		else if (direction == "up")
		{
			ctx.moveTo(x + ((width - baseWidth) / 2) + baseWidth, 
				y + height - cornerBr);
			
			if (cornerBr > 0)
				ctx.arcTo(x + ((width - baseWidth) / 2) + baseWidth, y + height, 
					x + ((width - baseWidth) / 2) + baseWidth - cornerBr, y + height, 
					cornerBr);
			
			ctx.lineTo(x + ((width - baseWidth) / 2) + cornerBl, 
				y + height);
			
			if (cornerBl > 0)
				ctx.arcTo(x + ((width - baseWidth) / 2), y + height, 
					x + ((width - baseWidth) / 2), y + height - cornerBl, 
					cornerBl);
			
			ctx.lineTo(x + ((width - baseWidth) / 2), y + height - baseHeight + cornerTl);
			
			if (cornerTl > 0)
				ctx.arcTo(x + ((width - baseWidth) / 2), y + height - baseHeight,
					Math.max(x + ((width - baseWidth) / 2) - cornerTl, x), y + height - baseHeight,
					Math.min(cornerTl, (width - baseWidth) / 2));			
			
			
			ctx.lineTo(x, y + height - baseHeight);
			ctx.lineTo(x + (width / 2), y);
			ctx.lineTo(x + width, y + height - baseHeight);
			
			
			ctx.lineTo(Math.min(x + ((width - baseWidth) / 2) + baseWidth + cornerTr, x + width), y + height - baseHeight);
			
			if (cornerTr > 0)
				ctx.arcTo(x + ((width - baseWidth) / 2) + baseWidth, y + height - baseHeight,
					x + ((width - baseWidth) / 2) + baseWidth, y + height - baseHeight + cornerTr,
					Math.min(cornerTr, (width - baseWidth) / 2));
		}
		else if (direction == "right")
		{
			ctx.moveTo(x + cornerBl, 
				y +  ((height - baseHeight) / 2) + baseHeight);
			
			if (cornerBl > 0)
				ctx.arcTo(x, y +  ((height - baseHeight) / 2) + baseHeight, 
					x, y +  ((height - baseHeight) / 2) + baseHeight - cornerBl, 
					cornerBl);
			
			ctx.lineTo(x, 
				y + ((height - baseHeight) / 2) + cornerTl);
			
			if (cornerTl > 0)
				ctx.arcTo(x, y + ((height - baseHeight) / 2), 
					x + cornerTl, y + ((height - baseHeight) / 2), 
					cornerTl);
			
			ctx.lineTo(x + baseWidth - cornerTr, y + ((height - baseHeight) / 2));
			
			if (cornerTr > 0)
				ctx.arcTo(x + baseWidth, y + ((height - baseHeight) / 2),
					x + baseWidth, Math.max(y + ((height - baseHeight) / 2) - cornerTr, y),
					Math.min(cornerTr, (height - baseHeight) / 2));
			
			
			ctx.lineTo(x + baseWidth, y);
			ctx.lineTo(x + width, y + (height / 2));
			ctx.lineTo(x + baseWidth, y + height);
			
			ctx.lineTo(x + baseWidth, Math.min(y + height, y + ((height - baseHeight) / 2) + baseHeight + cornerBr));

			if (cornerBr > 0)
				ctx.arcTo(x + baseWidth, y + ((height - baseHeight) / 2) + baseHeight,
					x + baseWidth - cornerBr, y + ((height - baseHeight) / 2) + baseHeight,
					Math.min(cornerBr, (height - baseHeight) / 2));
		}
		
		ctx.closePath();
	};	
	
	