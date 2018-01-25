
/**
 * @depends CanvasElement.js
 */

///////////////////////////////////////////////////////////////////////
/////////////////////ScrollButtonSkinElement///////////////////////////

/**
 * @class ScrollButtonSkinElement
 * @inherits CanvasElement
 * 
 * Default skin class for the ScrollButton.
 * 
 * 
 * @constructor ScrollButtonSkinElement 
 * Creates new ScrollButtonSkinElement instance.
 */
function ScrollButtonSkinElement()
{
	ScrollButtonSkinElement.base.prototype.constructor.call(this);
}

//Inherit from CanvasElement
ScrollButtonSkinElement.prototype = Object.create(CanvasElement.prototype);
ScrollButtonSkinElement.prototype.constructor = ScrollButtonSkinElement;
ScrollButtonSkinElement.base = CanvasElement;		
	
//////Style Types//////////////////////
ScrollButtonSkinElement._StyleTypes = Object.create(null);

/**
 * @style ArrowColor String
 * 
 * Hex color value to be used for the arrow icon. Format like "#FF0000" (red).
 */
ScrollButtonSkinElement._StyleTypes.ArrowColor =					{inheritable:false};		//"#000000"

/**
 * @style ArrowDirection String
 * 
 * Determines the arrow direction. Allowable values are "up", "down", "left", "right". 
 * Note that ScrollBar sets this style directly to the parent button depending on the scroll bar orientation.
 */
ScrollButtonSkinElement._StyleTypes.ArrowDirection =						{inheritable:false};	//"up" || "down" || "left" || "right"


////////Default Styles//////////////////

ScrollButtonSkinElement.StyleDefault = new StyleDefinition();

ScrollButtonSkinElement.StyleDefault.setStyle("ArrowColor", 						"#000000");
ScrollButtonSkinElement.StyleDefault.setStyle("ArrowDirection", 					"up");


/////////Internal Functions////////////////////////

//@Override
ScrollButtonSkinElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		ScrollButtonSkinElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("ArrowColor" in stylesMap || 
			"ArrowDirection" in stylesMap)
		{
			this._invalidateRender();
		}
	};

//@Override
ScrollButtonSkinElement.prototype._doRender = 
	function()
	{
		ScrollButtonSkinElement.base.prototype._doRender.call(this);
		
		var arrowDirection = this.getStyle("ArrowDirection");
		var arrowColor = this.getStyle("ArrowColor");
		
		if (arrowColor == null || arrowDirection == null)
			return;
		
		var ctx = this._getGraphicsCtx();
		
		var borderThickness = this._getBorderThickness();
		
		var x = borderThickness;
		var y = borderThickness;
		var width = this._width - (borderThickness * 2);
		var height = this._height - (borderThickness * 2);
		
		ctx.beginPath();
		
		if (arrowDirection == "up")
		{
			ctx.moveTo(x + (width / 2), y + (height * .35));
			ctx.lineTo(x + (width * .80), y + (height * .65));
			ctx.lineTo(x + (width * .20), y + (height * .65));
		}
		else if (arrowDirection == "down")
		{
			ctx.moveTo(x + (width / 2), y + (height * .65));
			ctx.lineTo(x + (width * .80), y + (height * .35));
			ctx.lineTo(x + (width * .20), y + (height * .35));
		}
		else if (arrowDirection == "left")
		{
			ctx.moveTo(x + (width * .35), y + (height / 2));
			ctx.lineTo(x + (width * .65), y + (height * .20));
			ctx.lineTo(x + (width * .65), y + (height * .80));
		}
		else if (arrowDirection == "right")
		{
			ctx.moveTo(x + (width * .65), y + (height / 2));
			ctx.lineTo(x + (width * .35), y + (height * .20));
			ctx.lineTo(x + (width * .35), y + (height * .80));
		}
		
		ctx.closePath();
		
		ctx.fillStyle = arrowColor;
		ctx.fill();
		
	};		
	
	
	