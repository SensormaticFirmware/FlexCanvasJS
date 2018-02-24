
function TetriPlayField()
{
	TetriPlayField.base.prototype.constructor.call(this);
	
	this.setStyle("Width", 310);
	this.setStyle("Height", 620);
	
		var gridRoundedBorderShape = new RoundedRectangleShape();
		gridRoundedBorderShape.setStyle("CornerRadius", 5);
		
		this._gridRoundedBorder = new AnchorContainerElement();
		this._gridRoundedBorder.setStyle("Width", 310);
		this._gridRoundedBorder.setStyle("Height", 620);
		this._gridRoundedBorder.setStyle("BackgroundColor", "#DDDDDD");
		this._gridRoundedBorder.setStyle("BackgroundShape", gridRoundedBorderShape);		
		
			this._gridContainer = new AnchorContainerElement();
			this._gridContainer.setStyle("BackgroundColor", "#000000");
			this._gridContainer.setStyle("X", 3);
			this._gridContainer.setStyle("Y", 3);
			this._gridContainer.setStyle("Width", 304);
			this._gridContainer.setStyle("Height", 614);
			
				this._gridContainerInner = new AnchorContainerElement();
				this._gridContainerInner.setStyle("X", 2);
				this._gridContainerInner.setStyle("Y", 2);
				this._gridContainerInner.setStyle("Width", 300);
				this._gridContainerInner.setStyle("Height", 610);
			
					this._blockContainer = new AnchorContainerElement();
					this._blockContainer.setStyle("Width", 300);
					this._blockContainer.setStyle("Height", 690);
					this._blockContainer.setStyle("Bottom", 0);
				
				this._gridContainerInner.addElement(this._blockContainer);
					
			this._gridContainer.addElement(this._gridContainerInner);
		
		this._gridRoundedBorder.addElement(this._gridContainer);
			
	this.addElement(this._gridRoundedBorder);


	////Event Handling////////
	
	var _self = this;
	
	this._onPlayFieldEnterFrameInstance = 
		function (event)
		{
			_self._onPlayFieldEnterFrame(event);
		};
	this._onPlayFieldAddedInstance = 
		function (addedRemovedEvent)
		{
			addedRemovedEvent.getManager().addEventListener("keydown", _self._onApplicationKeydownInstance);
		};
	this._onPlayFieldRemovedInstance = 
		function (addedRemovedEvent)
		{
			addedRemovedEvent.getManager().removeEventListener("keydown", _self._onApplicationKeydownInstance);
		};	
	this._onApplicationKeydownInstance = 
		function (keyboardEvent)
		{
			_self._onApplicationKeydown(keyboardEvent);
		};
		
	this.addEventListener("enterframe", this._onPlayFieldEnterFrameInstance);	
	this.addEventListener("added", this._onPlayFieldAddedInstance);
	this.addEventListener("removed", this._onPlayFieldRemovedInstance);
	
	////////////
	
	var i = 0;
	var i2 = 0;
	var tetriBlock;
	
	for (i = 0; i < 23; i++)
	{
		for (i2 = 0; i2 < 10; i2++)
		{
			tetriBlock = new TetriBlock();
			tetriBlock.setBlockColor("#202020");
			tetriBlock.setStyle("Width", 30);
			tetriBlock.setStyle("Height", 30);
			tetriBlock.setStyle("X", i2 * 30);
			tetriBlock.setStyle("Y", i * 30);
			
			this._blockContainer.addElement(tetriBlock);
		}
	}
	
	this._randomBag = [];
	this._level = 1;
	this._nextEventTime = 0;
	this._currentState = null;
	
	//Key state tracking
	this._left = false;
	this._right = false;
	this._down = false;
	this._drop = false;
	this._rotateRight = false;
	this._rotateLeft = false;
	
	this._currentBlocks = [];
	this._currentPiece = 0;
	this._currentOrient = 0;
	this._currentOriginX = 0;
	this._currentOriginY = 0;
	
	this._nextPiece = 0;
}

//Inherit from AnchorContainerElement
TetriPlayField.prototype = Object.create(AnchorContainerElement.prototype);
TetriPlayField.prototype.constructor = TetriPlayField;
TetriPlayField.base = AnchorContainerElement;


TetriPlayField.prototype._onPlayFieldEnterFrame = 
	function (event)
	{
		var currentTime = Date.now();
		if (currentTime < this._nextEventTime)
			return;
		
		if (this._currentState == "fall")
			this._executeFall();
	};
	
TetriPlayField.prototype.startGame = 
	function (currentTime, startLevel)
	{
		this._nextEventTime = currentTime;
		this._level = startLevel;
		this._nextPiece = this._getNextPiece();
		this._currentBlocks = [];
		
		this._generatePiece();
	};
	
TetriPlayField.prototype._generatePiece = 
	function ()
	{
		this._currentPiece = this._nextPiece;
		this._nextPiece = this._getNextPiece();
		
		//TODO: Display next Piece
		
		this._currentOrient = 0;
		this._currentOriginX = 3;
		this._currentOriginY = 1;
		
		if (this._currentPiece == 1)
			this._currentOriginX = 4;
		
		if (this._updatePosition(this._currentPiece, this._currentOrient, this._currentOriginX, this._currentOriginY) == false)
			return; //TODO: Game over
		
		this._executeFall();
	};
	
TetriPlayField.prototype._executeFall = 
	function ()
	{
		if (this._updatePosition(this._currentPiece, this._currentOrient, this._currentOriginX, this._currentOriginY + 1) == false)
		{
			//Start lock timer
			
			return;
		}
		
		this._nextEventTime = this._nextEventTime + TetriStackApplication.GetFallSpeed(this._level);
		this._currentState = "fall";
	};
	
TetriPlayField.prototype._getNextPiece = 
	function ()
	{
		if (this._randomBag.length == 0)
		{
			for (var i = 0; i < 7; i++)
				this._randomBag.push(i);
		}
		
		var randomIndex = Math.floor(Math.random() * (this._randomBag.length - 1));
		return this._randomBag.splice(randomIndex, 1)[0];
	};
	
TetriPlayField.prototype._onApplicationKeydown = 
	function (keyboardEvent)
	{
		//"ArrowRight" 39
		//"ArrowLeft" 37
		//"ArrowDown" 40
	
		//	a 65
		//	s 83
		//	d 68
		//	w 87
		//
		//	q 81
		//	e 69 
	
		var i = 0;
		var newBlocks = null;
		var keycode = keyboardEvent.getKeyCode();
		var newOriginX = this._currentOriginX;
		var newOriginY = this._currentOriginY;
		var newOrient = this._currentOrient;
		
		if (keycode == 65 || keycode == 68 || keycode == 83)
		{
			if (keycode == 65) 
				newOriginX = this._currentOriginX - 1;
			else if (keycode == 68) 
				newOriginX = this._currentOriginX + 1;
			else if (keycode == 83) 
				newOriginY = this._currentOriginY + 1;
			
			newBlocks = this._getBlocks(this._currentPiece, this._currentOrient, newOriginX, newOriginY);
			
			if (this._testPosition(newBlocks) == false)
				return;
		}
		else if (keycode == 81 || keycode == 69)
		{ 
			if (keycode == 81)
				newOrient = this._currentOrient - 1;
			else
				newOrient = this._currentOrient + 1;
			
			if (newOrient < 0)
				newOrient = 3;
			if (newOrient > 3)
				newOrient = 0;
			
			var kickTable = TetriStackApplication.GetKickTable(this._currentPiece, this._currentOrient, newOrient);
			
			for (i = 0; i < kickTable.length; i++)
			{
				newOriginX = this._currentOriginX + kickTable[i].x;
				newOriginY = this._currentOriginY + kickTable[i].y;
				
				newBlocks = this._getBlocks(this._currentPiece, newOrient, newOriginX, newOriginY);
				
				if (this._testPosition(newBlocks) == true)
					break;
				else
					newBlocks = null;
			}
			
			if (newBlocks == null)
				return;
		}
		
		for (i = this._currentBlocks.length - 1; i >= 0; i--)
		{
			if (newBlocks.indexOf(this._currentBlocks[i]) == -1)
				this._currentBlocks[i].setBlockColor("#202020");
		}
		
		for (i = 0; i < newBlocks.length; i++)
			newBlocks[i].setBlockColor("#0055FF");
		
		this._currentBlocks = newBlocks;
		this._currentOriginX = newOriginX;
		this._currentOriginY = newOriginY;
		this._currentOrient = newOrient;
	};
	
TetriPlayField.prototype._testPosition = 
	function (piece, orient, originX, originY)
	{
		var i;
		var block;
		var gridX;
		var gridY;
		var newBlocks = [];
		var pieceData = TetriStackApplication.PieceData[piece][orient];
		
		for (i = 0; i < 4; i++)
		{
			gridX = originX + pieceData[i].x;
			gridY = originY + pieceData[i].y;
			
			if (gridX < 0 || gridX > 9 || gridY < 0 || gridY > 22)
				return null;
			
			block = this._blockContainer.getElementAt((gridY * 10) + gridX);
			newBlocks.push(block);
		}
		
		for (var i = 0; i < newBlocks.length; i++)
		{
			//Off screen
			if (newBlocks[i] == null)
				return null;
			
			//Existing block (not ourself)
			if (newBlocks[i].getBlockColor() != "#202020" && this._currentBlocks.indexOf(newBlocks[i]) == -1)
				return null;
		}
		
		return newBlocks;
	};
	
TetriPlayField.prototype._updatePosition = 
	function (piece, orient, originX, originY)
	{
		var newBlocks = this._testPosition(piece, orient, originX, originY);
		
		if (newBlocks == null)
			return false;
	
		var i = 0;
		for (i = this._currentBlocks.length - 1; i >= 0; i--)
		{
			if (newBlocks.indexOf(this._currentBlocks[i]) == -1)
				this._currentBlocks[i].setBlockColor("#202020");
		}
		
		for (i = 0; i < newBlocks.length; i++)
			newBlocks[i].setBlockColor("#0055FF");
		
		this._currentBlocks = newBlocks;
		this._currentOriginX = originX;
		this._currentOriginY = originY;
		this._currentOrient = orient;
		
		return true;
	};
	
TetriPlayField.prototype._getRandomPiece = 
	function ()
	{
		return Math.floor(Math.random() * 7);
	};
	
	