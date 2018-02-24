

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
		
		//Temporary, till we do the actual block rendering.
		this.setStyle("BackgroundColor", color);
		
		//this._invalidateRender();
	};
	
TetriBlock.prototype.getBlockColor = 
	function()
	{
		return this._blockColor;
	};