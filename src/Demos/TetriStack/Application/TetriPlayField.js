
function TetriPlayField()
{
	TetriPlayField.base.prototype.constructor.call(this);
	
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
		
		this._nextRoundedBorder = new AnchorContainerElement();
		this._nextRoundedBorder.setStyle("X", 315);
		this._nextRoundedBorder.setStyle("Width", 140);
		this._nextRoundedBorder.setStyle("Height", 120);
		this._nextRoundedBorder.setStyle("BackgroundColor", "#DDDDDD");
		this._nextRoundedBorder.setStyle("BackgroundShape", gridRoundedBorderShape);	
		
			this._nextContainer = new AnchorContainerElement();
			this._nextContainer.setStyle("BackgroundColor", "#202020");
			this._nextContainer.setStyle("X", 3);
			this._nextContainer.setStyle("Y", 3);
			this._nextContainer.setStyle("Width", 134);
			this._nextContainer.setStyle("Height", 114);
			
				this._nextLabel = new LabelElement();
				this._nextLabel.setStyle("Text", "Next");
				this._nextLabel.setStyle("TextSize", 24);
				this._nextLabel.setStyle("TextStyle", "bold");
				this._nextLabel.setStyle("TextFont", "Roboto");
				this._nextLabel.setStyle("TextColor", "#DDDDDD");
				this._nextLabel.setStyle("Y", 4);
				this._nextLabel.setStyle("HorizontalCenter", 0);
				
				this._nextPieceContainer = new AnchorContainerElement();
				this._nextPieceContainer.setStyle("PercentWidth", 100);
				this._nextPieceContainer.setStyle("Top", 30);
				this._nextPieceContainer.setStyle("Bottom", 5);
				
					this._nextPieceBlockContainer = new AnchorContainerElement();
					this._nextPieceBlockContainer.setStyle("HorizontalCenter", 0);
					this._nextPieceBlockContainer.setStyle("VerticalCenter", 0);
					
				this._nextPieceContainer.addElement(this._nextPieceBlockContainer);
				
			this._nextContainer.addElement(this._nextLabel);
			this._nextContainer.addElement(this._nextPieceContainer);
			
		this._nextRoundedBorder.addElement(this._nextContainer);
		
		
		this._linesRoundedBorder = new AnchorContainerElement();
		this._linesRoundedBorder.setStyle("X", 315);
		this._linesRoundedBorder.setStyle("Y", 125);
		this._linesRoundedBorder.setStyle("Width", 140);
		this._linesRoundedBorder.setStyle("Height", 80);
		this._linesRoundedBorder.setStyle("BackgroundColor", "#DDDDDD");
		this._linesRoundedBorder.setStyle("BackgroundShape", gridRoundedBorderShape);	
		
			this._linesContainer = new AnchorContainerElement();
			this._linesContainer.setStyle("BackgroundColor", "#202020");
			this._linesContainer.setStyle("X", 3);
			this._linesContainer.setStyle("Y", 3);
			this._linesContainer.setStyle("Width", 134);
			this._linesContainer.setStyle("Height", 74);
			
				this._linesLabel = new LabelElement();
				this._linesLabel.setStyle("Text", "Lines");
				this._linesLabel.setStyle("TextSize", 24);
				this._linesLabel.setStyle("TextStyle", "bold");
				this._linesLabel.setStyle("TextFont", "Roboto");
				this._linesLabel.setStyle("TextColor", "#DDDDDD");
				this._linesLabel.setStyle("Y", 4);
				this._linesLabel.setStyle("HorizontalCenter", 0);
				
				this._lineCountLabel = new LabelElement();
				this._lineCountLabel.setStyle("Text", "0");
				this._lineCountLabel.setStyle("TextSize", 24);
				this._lineCountLabel.setStyle("TextStyle", "bold");
				this._lineCountLabel.setStyle("TextFont", "Roboto");
				this._lineCountLabel.setStyle("TextColor", "#DDDDDD");
				this._lineCountLabel.setStyle("Y", 38);
				this._lineCountLabel.setStyle("HorizontalCenter", 0);
				
			this._linesContainer.addElement(this._linesLabel);
			this._linesContainer.addElement(this._lineCountLabel);
			
		this._linesRoundedBorder.addElement(this._linesContainer);
		
	this.addElement(this._gridRoundedBorder);
	this.addElement(this._nextRoundedBorder);
	this.addElement(this._linesRoundedBorder);


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
			addedRemovedEvent.getManager().addEventListener("keyup", _self._onApplicationKeyupInstance);
		};
	this._onPlayFieldRemovedInstance = 
		function (addedRemovedEvent)
		{
			addedRemovedEvent.getManager().removeEventListener("keydown", _self._onApplicationKeydownInstance);
			addedRemovedEvent.getManager().removeEventListener("keyup", _self._onApplicationKeyupInstance);
		};	
	this._onApplicationKeydownInstance = 
		function (keyboardEvent)
		{
			_self._onApplicationKeydown(keyboardEvent);
		};
	this._onApplicationKeyupInstance = 
		function (keyboardEvent)
		{
			_self._onApplicationKeyup(keyboardEvent);
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
			tetriBlock.setBlockColor(TetriStackApplication.BlockColors.BLACK);
			tetriBlock.setStyle("Width", 30);
			tetriBlock.setStyle("Height", 30);
			tetriBlock.setStyle("X", i2 * 30);
			tetriBlock.setStyle("Y", i * 30);
			
			this._blockContainer.addElement(tetriBlock);
		}
	}
	
	this._randomBag = [];
	this._level = 1;
	this._lineCount = 0;
	this._phase = "fall";
	
	this._fallTime = -1;
	this._lockTime = -1;
	this._suspendLock = false;
	
	this._rightTime = -1;
	this._leftTime = -1;
	this._downTime = -1;
	
	//this._currentState = null;
	
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
	
	this._currentResetLockY = -1;
	
	this._currentLines = [];
	this._linesClearTime = -1;
	
	this._nextPiece = 0;
}

//Inherit from AnchorContainerElement
TetriPlayField.prototype = Object.create(AnchorContainerElement.prototype);
TetriPlayField.prototype.constructor = TetriPlayField;
TetriPlayField.base = AnchorContainerElement;

TetriPlayField.KeyholdDelay1 = 150;
TetriPlayField.KeyholdDelay2 = 75;

TetriPlayField.prototype._onPlayFieldEnterFrame = 
	function (event)
	{
		var currentTime = Date.now();
		
		if (this._currentLines.length == 0)
		{
			if (this._leftTime != -1 && this._rightTime == -1 && currentTime >= this._leftTime)
			{
				this._movePiece(this._leftTime, "left");
				this._leftTime += TetriPlayField.KeyholdDelay2;
			}
			
			if (this._rightTime != -1 && this._leftTime == -1 && currentTime >= this._rightTime)
			{
				this._movePiece(this._rightTime, "right");
				this._rightTime += TetriPlayField.KeyholdDelay2;
			}
			
			if (this._downTime != -1 && currentTime >= this._downTime)
			{
				this._movePiece(this._downTime, "down");
				this._downTime += TetriPlayField.KeyholdDelay2;
			}
			else if (this._fallTime != -1 && currentTime >= this._fallTime)
			{
				this._movePiece(this._fallTime, "down");
				
				if (this._downTime != -1)
					this._downTime = this._fallTime + KeyholdDelay2;
			}
			
			if (this._lockTime != -1 && 
				this._suspendLock == false &&
				currentTime >= this._lockTime)
			{
				//Piece moved, suspend the lock timer and the fall will unsuspend.			
				if (this._testPosition(this._currentPiece, this._currentOrient, this._currentOriginX, this._currentOriginY + 1) != null)
					this._suspendLock = true;
				else
				{
					var i;
					var currentYPositions = [];
					var gridPosition;
					for (i = 0; i < this._currentBlocks.length; i++)
					{
						gridPosition = this._getGridPositionFromBlock(this._currentBlocks[i]);
						if (currentYPositions.indexOf(gridPosition.y) == -1)
							currentYPositions.push(gridPosition.y);
					}
					
					var x;
					var lineComplete = true;
					var block;
					for (i = 0; i < currentYPositions.length; i++)
					{
						lineComplete = true;
						
						for (x = 0; x < 10; x++)
						{
							block = this._getBlockAtGridPosition(x, currentYPositions[i]);
							
							if (block.getBlockColor() == TetriStackApplication.BlockColors.BLACK)
							{
								lineComplete = false;
								break;
							}
						}
						
						if (lineComplete == true)
						{
							this._currentLines.push(currentYPositions[i]);
							
							for (x = 0; x < 10; x++)
							{
								block = this._getBlockAtGridPosition(x, currentYPositions[i]);
								block.setBlockColor(TetriStackApplication.BlockColors.WHITE);
							}
						}
					}
					
					if (this._currentLines.length > 0)
						this._linesClearTime = this._lockTime + 300;
					else
						this._generatePiece(this._lockTime);
				}
			}
		}
		
		if (this._currentLines.length > 0 && currentTime >= this._linesClearTime)
		{
			this._clearLines();
			this._generatePiece(this._linesClearTime);
		}
		
	};
	
TetriPlayField.prototype._clearLines = 
	function ()
	{
		var maxY = -1;
		var i;
		
		for (i = 0; i < this._currentLines.length; i++)
		{
			if (this._currentLines[i] > maxY)
				maxY = this._currentLines[i];
		}
		
		var x;
		var y;
		var block1;
		var block2;
		var offsetY = 0;
		for (y = maxY; y >= offsetY * -1; y--)
		{
			if (y >= 0 && this._currentLines.indexOf(y) > -1)
				offsetY++;
			else
			{
				for (x = 0; x < 10; x++)
				{
					if (i < 0)
						block1 = null;
					else
						block1 = this._getBlockAtGridPosition(x, y);
					
					block2 = this._getBlockAtGridPosition(x, y + offsetY);
					
					if (block1 == null)
						block2.setBlockColor(TetriStackApplication.BlockColors.BLACK);
					else
						block2.setBlockColor(block1.getBlockColor());
				}
			}
		}
		
		this._lineCount += this._currentLines.length;
		this._lineCountLabel.setStyle("Text", this._lineCount.toString());
		
		if (Math.ceil(this._lineCount / 10) > this._level)
			this._level = Math.ceil(this._lineCount / 10)
		
		this._currentLines.splice(0, this._currentLines.length);
	};
	
TetriPlayField.prototype.startGame = 
	function (currentTime, startLevel)
	{
		this._level = startLevel;
		this._nextPiece = this._getNextPiece();
		
		this._generatePiece(currentTime);
	};
	
TetriPlayField.prototype._updateNextPiece = 
	function ()
	{
		var block;
		var point;
		var blockPoints = TetriStackApplication.PieceData[this._nextPiece][0];
		var blockColor = TetriStackApplication.GetBlockColor(this._nextPiece);
		
		for (var i = 0; i < blockPoints.length; i++)
		{
			if (this._nextPieceBlockContainer.getNumElements() < i + 1)
			{
				block = new TetriBlock();
				block.setStyle("Width", 25);
				block.setStyle("Height", 25);
				
				this._nextPieceBlockContainer.addElement(block);
			}
			else
				block = this._nextPieceBlockContainer.getElementAt(i);
			
			point = blockPoints[i];
			
			block.setBlockColor(blockColor);
			block.setStyle("X", point.x * 25);
			
			if (this._nextPiece != 0)
				block.setStyle("Y", point.y * 25);
			else
				block.setStyle("Y", 0);
		}
	};
	
TetriPlayField.prototype._generatePiece = 
	function (fromTime)
	{
		this._currentPiece = this._nextPiece;
		this._nextPiece = this._getNextPiece();
		
		this._updateNextPiece();
		
		this._currentOrient = 0;
		this._currentOriginX = 3;
		this._currentOriginY = 1;
		this._currentBlocks.splice(0, this._currentBlocks.length);
		
		this._currentResetLockY = -1;
		this._fallTime = -1;
		this._lockTime = -1;
		this._linesClearTime = -1;
		this._suspendLock = false;
		
		if (this._currentPiece == 1)
			this._currentOriginX = 4;
		
		if (this._updatePosition(this._currentPiece, this._currentOrient, this._currentOriginX, this._currentOriginY) == false)
			return; //TODO: Game over
		
		this._movePiece(fromTime, "down");
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
	
TetriPlayField.prototype._movePiece = 
	function (fromTime, direction)
	{
		var originX = this._currentOriginX;
		var originY = this._currentOriginY;
	
		if (direction == "left")
			originX -= 1;
		else if (direction == "right")
			originX += 1;
		else if (direction == "down")
			originY += 1;
		
		this._updatePosition(this._currentPiece, this._currentOrient, originX, originY);
		this._suspendLock = false;
		
		if (direction == "down")
		{
			this._fallTime = fromTime + TetriStackApplication.GetFallSpeed(this._level);
			
			if (this._currentResetLockY < this._currentOriginY)
			{
				//Prevent floor kicks from restarting the lock timer.
				this._currentResetLockY = this._currentOriginY;
				this._lockTime = -1;
			}
		}
		
		if (this._testPosition(this._currentPiece, this._currentOrient, this._currentOriginX, this._currentOriginY + 1) == null)
		{
			if (this._lockTime == -1)
				this._lockTime = fromTime + 500;
		}
	};
	
TetriPlayField.prototype._rotatePiece = 
	function (direction)
	{
		if (direction == "left")
			newOrient = this._currentOrient - 1;
		else //if (direction == "right")
			newOrient = this._currentOrient + 1;
		
		if (newOrient < 0)
			newOrient = 3;
		if (newOrient > 3)
			newOrient = 0;
		
		var kickTable = TetriStackApplication.GetKickTable(this._currentPiece, this._currentOrient, newOrient);
		var originX = 0;
		var originY = 0;
		
		for (var i = 0; i < kickTable.length; i++)
		{
			originX = this._currentOriginX + kickTable[i].x;
			originY = this._currentOriginY + kickTable[i].y;
			
			if (this._updatePosition(this._currentPiece, newOrient, originX, originY) == true)
				return true;
		}
		
		if (this._testPosition(this._currentPiece, this._currentOrient, this._currentOriginX, this._currentOriginY + 1) == null)
		{
			if (this._lockTime == -1)
				this._lockTime = fromTime + 500;
		}
		
		return false;
	};
	
TetriPlayField.prototype._onApplicationKeyup = 
	function (keyboardEvent)
	{
		var keycode = keyboardEvent.getKeyCode();
		
		if (keycode == 65)
		{
			this._leftTime = -1;
			return;
		}
		
		if (keycode == 68)
		{
			this._rightTime = -1;
			return;
		}
		
		if (keycode == 83)
		{
			this._downTime = -1;
			return;
		}
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
	
		var currentTime = Date.now();
		var keycode = keyboardEvent.getKeyCode();
		
		if (keycode == 65)
		{
			if (this._leftTime != -1)
				return;
			
			this._leftTime = currentTime + TetriPlayField.KeyholdDelay1;
			this._movePiece(currentTime, "left");
			
			return;
		}
		
		if (keycode == 68)
		{
			if (this._rightTime != -1)
				return;
			
			this._rightTime = currentTime + TetriPlayField.KeyholdDelay1;
			this._movePiece(currentTime, "right");
			
			return;
		}
		
		if (keycode == 83)
		{
			if (this._downTime != -1)
				return;
			
			this._downTime = currentTime + TetriPlayField.KeyholdDelay1;
			this._movePiece(currentTime, "down");
			
			return;
		}
		
		
		
		
		if (keycode == 81 || keycode == 69)
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
				
				if (this._updatePosition(this._currentPiece, newOrient, newOriginX, newOriginY) == true)
					return;
			}
		}
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
			
			block = this._getBlockAtGridPosition(gridX, gridY);
			newBlocks.push(block);
		}
		
		for (var i = 0; i < newBlocks.length; i++)
		{
			//Off screen
			if (newBlocks[i] == null)
				return null;
			
			//Existing block (not ourself)
			if (newBlocks[i].getBlockColor() != TetriStackApplication.BlockColors.BLACK && this._currentBlocks.indexOf(newBlocks[i]) == -1)
				return null;
		}
		
		return newBlocks;
	};
	
TetriPlayField.prototype._getBlockAtGridPosition = 
	function (gridX, gridY)
	{
		return this._blockContainer.getElementAt((gridY * 10) + gridX);
	};
	
TetriPlayField.prototype._getGridPositionFromBlock = 
	function (block)
	{
		var blockIndex = this._blockContainer.getElementIndex(block);
		
		if (block == null)
			return null;
		
		var result = {x:0, y:0};
		result.y = Math.floor(blockIndex / 10);
		result.x = Math.floor(blockIndex % 10);
		
		return result;
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
				this._currentBlocks[i].setBlockColor(TetriStackApplication.BlockColors.BLACK);
		}
		
		var blockColor = TetriStackApplication.GetBlockColor(this._currentPiece);
		
		for (i = 0; i < newBlocks.length; i++)
			newBlocks[i].setBlockColor(blockColor);
		
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
	
	