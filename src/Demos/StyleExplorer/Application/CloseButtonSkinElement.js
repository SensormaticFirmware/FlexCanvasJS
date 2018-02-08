
//Basic skin class. Used for the remove style button. 
//Draws an X across the button.

function CloseButtonSkinElement() //extends CanvasElement
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
		//Base renders our background & border based on our state.
		CloseButtonSkinElement.base.prototype._doRender.call(this);
		
		//Get the CanvasRenderingContext2D context for this element.
		var ctx = this._getGraphicsCtx();
		
		//Convienence
		var x = this._x;
		var y = this._y;
		var w = this._width;
		var h = this._height;
		
		//Draw an "X" across the button.
		//This is not done in a scalable, or style-able manner, its just for our specific button.
		var state = this.getStyle("SkinState");
		var color = null;
		
		if (state == "up")
			color = "#444444";
		else if (state = "over")
			color = "#222222";
		else //down
			color = "#000000";		
		
		ctx.beginPath();
		
		ctx.moveTo(x + 4.5, y + 4.5);
		ctx.lineTo(x + w - 4.5, y + h - 4.5);
		ctx.moveTo(x + w - 4.5, y + 4.5);
		ctx.lineTo(x + 4.5, y + h - 4.5);
		
		ctx.strokeStyle = color;
		ctx.lineWidth = 2;
		ctx.stroke();
	};		
	
	
	