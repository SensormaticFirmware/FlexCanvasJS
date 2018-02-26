

function TetriBlock()
{
	TetriBlock.base.prototype.constructor.call(this);
	
	this._gridX = -1;
	this._gridY = -1;
	
	this._blockType = "normal"; //"normal" || "ghost"
	this._blockColor = "#0055FF";
	
	//Temporary, till we do the actual block rendering.
	this.setStyle("BorderType", "solid");
	this.setStyle("BackgroundColor", this._blockColor);
	
	//this.setStyle("BorderColor", "#FF0000");
}

//Inherit from CanvasElement
TetriBlock.prototype = Object.create(CanvasElement.prototype);
TetriBlock.prototype.constructor = TetriBlock;
TetriBlock.base = CanvasElement;

TetriBlock.prototype.setBlockColor = 
	function (color)
	{
		if (this._blockColor == color)
			return;
		
		this._blockColor = color;
		
		this._invalidateRender();
	};
	
TetriBlock.prototype.getBlockColor = 
	function()
	{
		return this._blockColor;
	};
	
TetriBlock.prototype._doRender = 
	function()
	{
		TetriBlock.base.prototype._doRender.call(this);
	};
	
TetriBlock.prototype._doRender = 
	function ()
	{
		var ctx = this._getGraphicsCtx();
		
		var x = 0;
		var y = 0;
		var w = this._width;
		var h = this._height;
		
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + w, y);
		ctx.lineTo(x + w, y + h);
		ctx.lineTo(x, y + h);
		ctx.closePath();
		
		ctx.fillStyle = this._blockColor;
		ctx.fill();
		
		x = .5;
		y = .5;
		w = this._width - 1;
		h = this._height - 1;
		
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + w, y);
		ctx.lineTo(x + w, y + h);
		ctx.lineTo(x, y + h);
		ctx.closePath();
		
		ctx.strokeStyle = "#000000";
		ctx.stroke();
		
		x = 1;
		y = 1;
		w = this._width - 2;
		h = this._height - 2;
		
		var bevelWidth = Math.ceil(w / 5);
		var bevelHeight = Math.ceil(h / 5);
		
		var lighterFill = null;
		var darkerFill = null;
		
		if (this._blockColor == "#202020")
		{
			lighterFill = CanvasElement.adjustColorLight(this._blockColor, +.03);
			darkerFill = CanvasElement.adjustColorLight(this._blockColor, -.04);
		}
		else
		{
			lighterFill = CanvasElement.adjustColorLight(this._blockColor, +.12);
			darkerFill = CanvasElement.adjustColorLight(this._blockColor, -.12);
		}
		
		
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + w, y);
		ctx.lineTo(x + w - bevelWidth, y + bevelHeight);
		ctx.lineTo(x + bevelWidth, y + bevelHeight);
		ctx.lineTo(x + bevelWidth, y + h - bevelHeight);
		ctx.lineTo(x, y + h);
		ctx.closePath();
		
		ctx.fillStyle = lighterFill;
		ctx.fill();
		
		
		ctx.beginPath();
		ctx.moveTo(x + w, y + h);
		ctx.lineTo(x, y + h);
		ctx.lineTo(x + bevelWidth, y + h - bevelHeight);
		ctx.lineTo(x + w - bevelWidth, y + h - bevelHeight);
		ctx.lineTo(x + w - bevelWidth, y + bevelHeight);
		ctx.lineTo(x + w, y);
		ctx.closePath();
		
		ctx.fillStyle = darkerFill;
		ctx.fill();
		
	};
	
	
	
	