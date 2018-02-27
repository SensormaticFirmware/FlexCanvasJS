

function TetriBlock()
{
	TetriBlock.base.prototype.constructor.call(this);
	
	this._isGhost = false;
	this._blockColor = TetriStackApplication.BlockColors.BLACK;
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
	
TetriBlock.prototype.setIsGhost = 
	function (isGhost)
	{
		if (this._isGhost == isGhost)
			return;
		
		this._isGhost = isGhost;
		this._invalidateRender();
	};
	
TetriBlock.prototype.getIsGhost = 
	function ()
	{
		return this._isGhost;
	};
	
TetriBlock.prototype._doRender = 
	function ()
	{
		//Don't call base, we're completely custom rendering.
		
		var ctx = this._getGraphicsCtx();
		
		var x = 0;
		var y = 0;
		var w = this._width;
		var h = this._height;
		
		var base = null;
		var lighter = null;
		var darker = null;
		var ghost = null;
		
		if (this._isGhost == true)
		{
			var black = TetriStackApplication.BlockColors.BLACK;
			
			base = black.base;
			lighter = black.lighter;
			darker = black.darker;
			
			if (this._blockColor != black)
				ghost = this._blockColor.base;
		}
		else
		{
			base = this._blockColor.base;
			lighter = this._blockColor.lighter;
			darker = this._blockColor.darker;
		}
		
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + w, y);
		ctx.lineTo(x + w, y + h);
		ctx.lineTo(x, y + h);
		ctx.closePath();
		
		ctx.fillStyle = base;
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
		
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + w, y);
		ctx.lineTo(x + w - bevelWidth, y + bevelHeight);
		ctx.lineTo(x + bevelWidth, y + bevelHeight);
		ctx.lineTo(x + bevelWidth, y + h - bevelHeight);
		ctx.lineTo(x, y + h);
		ctx.closePath();
		
		ctx.fillStyle = lighter;
		ctx.fill();
		
		ctx.beginPath();
		ctx.moveTo(x + w, y + h);
		ctx.lineTo(x, y + h);
		ctx.lineTo(x + bevelWidth, y + h - bevelHeight);
		ctx.lineTo(x + w - bevelWidth, y + h - bevelHeight);
		ctx.lineTo(x + w - bevelWidth, y + bevelHeight);
		ctx.lineTo(x + w, y);
		ctx.closePath();
		
		ctx.fillStyle = darker;
		ctx.fill();
		
		if (ghost != null)
		{
			//Stoke on half pixel (anti-alias / fuzz the outer border)
			x = 1;
			y = 1;
			w = this._width - 2;
			h = this._height - 2;
			
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x + w, y);
			ctx.lineTo(x + w, y + h);
			ctx.lineTo(x, y + h);
			ctx.closePath();
			
			ctx.strokeStyle = ghost;
			ctx.stroke();
			
			//Stroke inner border (solid)
			x = 1.5;
			y = 1.5;
			w = this._width - 3;
			h = this._height - 3;
			
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x + w, y);
			ctx.lineTo(x + w, y + h);
			ctx.lineTo(x, y + h);
			ctx.closePath();
			
			ctx.strokeStyle = ghost;
			ctx.stroke();
			
		}
	};
	
	
	
	