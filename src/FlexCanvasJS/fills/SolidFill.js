
/**
 * @depends FillBase.js
 */

////////////////////////////////////////////////////////
/////////////////SolidFill//////////////////////////////	

/**
 * @class SolidFill
 * @inherits FillBase
 * 
 * Fills an element a solid color. This class is automatically used when
 * an element's BackgroundFill style is set to a color string like "#FF0000".
 * 
 * @constructor SolidFill 
 * Creates new SolidFill instance.
 */
function SolidFill()
{
	SolidFill.base.prototype.constructor.call(this);
}

//Inherit from FillBase
SolidFill.prototype = Object.create(FillBase.prototype);
SolidFill.prototype.constructor = SolidFill;
SolidFill.base = FillBase;


/////////////Style Types///////////////////////////////

SolidFill._StyleTypes = Object.create(null);


/**
 * @style FillColor color
 * 
 * Color which the element should be filled.
 */
SolidFill._StyleTypes.FillColor = 							StyleableBase.EStyleType.NORMAL;		// "#FF0000"


////////////Default Styles///////////////////////////

SolidFill.StyleDefault = new StyleDefinition();

SolidFill.StyleDefault.setStyle("FillColor", 				"#FF0000");	// "#FF0000"


////////////Public//////////////////////

//@override
SolidFill.prototype.drawFill = 
	function (ctx, metrics)
	{
		ctx.fillStyle = this.getStyle("FillColor");
		ctx.fill();
	};	
	
