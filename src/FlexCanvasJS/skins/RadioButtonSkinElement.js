
/**
 * @depends CanvasElement.js
 */

///////////////////////////////////////////////////////////////////////
/////////////////////RadioButtonSkinElement////////////////////////////

/**
 * @class RadioButtonSkinElement
 * @inherits CanvasElement
 * 
 * Default skin class for the RadioButtonElement.  
 * Renders an inner selected indicator using the BackgroundShape style.
 * 
 * 
 * @constructor RadioButtonSkinElement 
 * Creates new RadioButtonSkinElement instance.
 */
function RadioButtonSkinElement()
{
	RadioButtonSkinElement.base.prototype.constructor.call(this);
}

//Inherit from CanvasElement
RadioButtonSkinElement.prototype = Object.create(CanvasElement.prototype);
RadioButtonSkinElement.prototype.constructor = RadioButtonSkinElement;
RadioButtonSkinElement.base = CanvasElement;		
	
//////Style Types//////////////////////
RadioButtonSkinElement._StyleTypes = Object.create(null);

/**
 * @style CheckColor String
 * 
 * Hex color value to be used for the check icon. Format like "#FF0000" (red).
 */
RadioButtonSkinElement._StyleTypes.CheckColor =						{inheritable:false};		//"#000000"

/**
 * @style CheckSize Number
 * 
 * Value between 0 and 1 used to determine the size that the "selected" indicator 
 * should be rendered relative to this element's size.
 */
RadioButtonSkinElement._StyleTypes.CheckSize = 						{inheritable:false};


////////Default Styles////////////////
RadioButtonSkinElement.StyleDefault = new StyleDefinition();

//RadioButtonSkinElement specific styles
RadioButtonSkinElement.StyleDefault.setStyle("CheckColor", 			"#000000");
RadioButtonSkinElement.StyleDefault.setStyle("CheckSize", 			.35);


/////////Protected Functions////////////////////////

//@Override
RadioButtonSkinElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		RadioButtonSkinElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("SkinState" in stylesMap || "CheckColor" in stylesMap)
			this._invalidateRender();
	};

//@Override
RadioButtonSkinElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		return {width:14, height:14};
	};

//@Override
RadioButtonSkinElement.prototype._doRender = 
	function()
	{
		RadioButtonSkinElement.base.prototype._doRender.call(this);
		
		var currentState = this.getStyle("SkinState");
		
		//Draw indicator.
		if (currentState.indexOf("selected") == 0)
		{
			var ctx = this._getGraphicsCtx();
			
			var checkSize = this.getStyle("CheckSize");
			
			var indicatorMetrics = new DrawMetrics();
			indicatorMetrics._width = this._width * checkSize;
			indicatorMetrics._height = this._height * checkSize;
			indicatorMetrics._x = (this._width - indicatorMetrics._width) / 2;
			indicatorMetrics._y = (this._height - indicatorMetrics._height) / 2;
			
			if (indicatorMetrics._width <= 0 || indicatorMetrics._height <= 0)
				return;
			
			ctx.beginPath();
			this._drawBackgroundShape(ctx, indicatorMetrics);
			
			ctx.fillStyle = this.getStyle("CheckColor");
			ctx.fill();
		}
	};		
	
	