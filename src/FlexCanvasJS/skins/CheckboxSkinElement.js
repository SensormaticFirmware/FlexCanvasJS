
/**
 * @depends CanvasElement.js
 */

///////////////////////////////////////////////////////////////////////
///////////////////////CheckboxSkinElement/////////////////////////////

/**
 * @class CheckboxSkinElement
 * @inherits CanvasElement
 * 
 * Default skin class for the CheckboxElement.
 * 
 * 
 * @constructor CheckboxSkinElement 
 * Creates new CheckboxSkinElement instance.
 */
function CheckboxSkinElement()
{
	CheckboxSkinElement.base.prototype.constructor.call(this);
}

//Inherit from CanvasElement
CheckboxSkinElement.prototype = Object.create(CanvasElement.prototype);
CheckboxSkinElement.prototype.constructor = CheckboxSkinElement;
CheckboxSkinElement.base = CanvasElement;		
	
//////Style Types//////////////////////
CheckboxSkinElement._StyleTypes = Object.create(null);

/**
 * @style CheckColor String
 * 
 * Hex color value to be used for the check icon. Format like "#FF0000" (red).
 */
CheckboxSkinElement._StyleTypes.CheckColor =				StyleableBase.EStyleType.NORMAL;		//"#000000"

/**
 * @style CheckSize Number
 * 
 * Value between 0 and 1 used to determine the size that the "selected" indicator 
 * should be rendered relative to this element's size.
 */
CheckboxSkinElement._StyleTypes.CheckSize = 				StyleableBase.EStyleType.NORMAL;


////////Default Styles////////////////

CheckboxSkinElement.StyleDefault = new StyleDefinition();

//CheckboxSkinElement specific styles
CheckboxSkinElement.StyleDefault.setStyle("CheckColor", 						"#000000");
CheckboxSkinElement.StyleDefault.setStyle("CheckSize", 							.80);




/////////Protected Functions////////////////////////

//@Override
CheckboxSkinElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		CheckboxSkinElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("SkinState" in stylesMap || "CheckColor" in stylesMap || "CheckSize" in stylesMap)
			this._invalidateRender();
	};

//@Override
CheckboxSkinElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		this._setMeasuredSize(14, 14);
	};

//@Override
CheckboxSkinElement.prototype._doRender = 
	function()
	{
		CheckboxSkinElement.base.prototype._doRender.call(this);
		
		var currentState = this.getStyle("SkinState");
		
		//Draw check or dash.
		if (currentState.indexOf("selected") == 0 || 
			currentState.indexOf("half") == 0)
		{
			var ctx = this._getGraphicsCtx();
			
			var borderThickness = this._getBorderThickness();
			var checkColor = this.getStyle("CheckColor");
			
			var checkSize = this.getStyle("CheckSize");
			var width = this._width * checkSize;
			var height = this._height * checkSize;
			
			var x = 0 + ((this._width - width) / 2);
			var y = 0 + ((this._height - height) / 2);
			
			if (currentState.indexOf("selected") == 0) //Draw check
			{
				ctx.beginPath();
				
				ctx.moveTo(x + (width * .10), 
							y + (height * .60));
				
				ctx.lineTo(x + (width * .40),
							y + height * .90);
				
				ctx.lineTo(x + (width * .90),
							y + (height * .26));
				
				ctx.lineTo(x + (width * .78),
							y + (height * .10));
				
				ctx.lineTo(x + (width * .38),
							y + height * .65);
				
				ctx.lineTo(x + (width * .20),
							y + height * .45);
				
				ctx.closePath();
			}
			else //Half selected - Draw dash
			{
				ctx.beginPath();
				
				ctx.moveTo(x + (width * .12), 
							y + (height * .42));
				
				ctx.lineTo(x + (width * .12),
							y + height * .58);
				
				ctx.lineTo(x + (width * .88),
							y + (height * .58));
				
				ctx.lineTo(x + (width * .88),
							y + (height * .42));
				
				ctx.closePath();
			}
			
			ctx.fillStyle = checkColor;
			ctx.fill();
		}
	};		
	
	