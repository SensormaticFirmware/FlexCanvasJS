
function CloseButtonSkinElement()
{
	CloseButtonSkinElement.base.prototype.constructor.call(this);
}

//Inherit from CanvasElement
CloseButtonSkinElement.prototype = Object.create(CanvasElement.prototype);
CloseButtonSkinElement.prototype.constructor = CloseButtonSkinElement;
CloseButtonSkinElement.base = CanvasElement;		
	

/////////Internal Functions////////////////////////

//@override
CloseButtonSkinElement.prototype._doRender = 
	function()
	{
		CloseButtonSkinElement.base.prototype._doRender.call(this);
		
		var ctx = this._getGraphicsCtx();
		
		var borderThickness = this._getBorderThickness();
		
		var x = borderThickness;
		var y = borderThickness;
		var width = this._width - (borderThickness * 2);
		var height = this._height - (borderThickness * 2);
		
		ctx.beginPath();
		
		ctx.moveTo(x + 3.5, y + 3.5);
		ctx.lineTo(x + width - 3.5, y + height - 3.5);
		ctx.moveTo(x + width - 3.5, y + 3.5);
		ctx.lineTo(x + 3.5, y + height - 3.5);
		
		ctx.strokeStyle = "#000000";
		ctx.lineWidth = 2;
		ctx.stroke();
	};		
	
	
	