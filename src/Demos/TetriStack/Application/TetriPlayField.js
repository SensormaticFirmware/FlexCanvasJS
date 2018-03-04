
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
				this._nextLabel.setStyle("TextFont", "Audiowide");
				this._nextLabel.setStyle("TextColor", "#DDDDDD");
				this._nextLabel.setStyle("Y", 8);
				this._nextLabel.setStyle("HorizontalCenter", 0);
				
				this._nextPieceContainer = new AnchorContainerElement();
				this._nextPieceContainer.setStyle("PercentWidth", 100);
				this._nextPieceContainer.setStyle("Top", 32);
				this._nextPieceContainer.setStyle("Bottom", 3);
				
					this._nextPieceBlockContainer = new AnchorContainerElement();
					this._nextPieceBlockContainer.setStyle("HorizontalCenter", 0);
					this._nextPieceBlockContainer.setStyle("VerticalCenter", 0);
					
				this._nextPieceContainer.addElement(this._nextPieceBlockContainer);
				
			this._nextContainer.addElement(this._nextLabel);
			this._nextContainer.addElement(this._nextPieceContainer);
			
		this._nextRoundedBorder.addElement(this._nextContainer);
		
		this._holdRoundedBorder = new AnchorContainerElement();
		this._holdRoundedBorder.setStyle("X", 315);
		this._holdRoundedBorder.setStyle("Y", 125);
		this._holdRoundedBorder.setStyle("Width", 140);
		this._holdRoundedBorder.setStyle("Height", 120);
		this._holdRoundedBorder.setStyle("BackgroundColor", "#DDDDDD");
		this._holdRoundedBorder.setStyle("BackgroundShape", gridRoundedBorderShape);	
		
			this._holdContainer = new AnchorContainerElement();
			this._holdContainer.setStyle("BackgroundColor", "#202020");
			this._holdContainer.setStyle("X", 3);
			this._holdContainer.setStyle("Y", 3);
			this._holdContainer.setStyle("Width", 134);
			this._holdContainer.setStyle("Height", 114);
			
				this._holdLabel = new LabelElement();
				this._holdLabel.setStyle("Text", "Hold");
				this._holdLabel.setStyle("TextSize", 24);
				this._holdLabel.setStyle("TextStyle", "bold");
				this._holdLabel.setStyle("TextFont", "Audiowide");
				this._holdLabel.setStyle("TextColor", "#DDDDDD");
				this._holdLabel.setStyle("Y", 8);
				this._holdLabel.setStyle("HorizontalCenter", 0);
				
				this._holdPieceContainer = new AnchorContainerElement();
				this._holdPieceContainer.setStyle("PercentWidth", 100);
				this._holdPieceContainer.setStyle("Top", 32);
				this._holdPieceContainer.setStyle("Bottom", 3);
				
					this._holdPieceBlockContainer = new AnchorContainerElement();
					this._holdPieceBlockContainer.setStyle("HorizontalCenter", 0);
					this._holdPieceBlockContainer.setStyle("VerticalCenter", 0);
					
				this._holdPieceContainer.addElement(this._holdPieceBlockContainer);
				
			this._holdContainer.addElement(this._holdLabel);
			this._holdContainer.addElement(this._holdPieceContainer);
			
		this._holdRoundedBorder.addElement(this._holdContainer);
		
		this._scoreRoundedBorder = new AnchorContainerElement();
		this._scoreRoundedBorder.setStyle("X", 315);
		this._scoreRoundedBorder.setStyle("Y", 250);
		this._scoreRoundedBorder.setStyle("Width", 140);
		this._scoreRoundedBorder.setStyle("Height", 320);
		this._scoreRoundedBorder.setStyle("BackgroundColor", "#DDDDDD");
		this._scoreRoundedBorder.setStyle("BackgroundShape", gridRoundedBorderShape);	
		
			this._scoreContainer = new ListContainerElement();
			this._scoreContainer.setStyle("BackgroundColor", "#202020");
			this._scoreContainer.setStyle("Left", 3);
			this._scoreContainer.setStyle("Top", 3);
			this._scoreContainer.setStyle("Bottom", 3);
			this._scoreContainer.setStyle("Right", 3);
			this._scoreContainer.setStyle("LayoutHorizontalAlign", "center");
			
				this._scoreContainerSpacer0 = new CanvasElement();
				this._scoreContainerSpacer0.setStyle("PercentHeight", 100);
			
				this._labelLevel = new LabelElement();
				this._labelLevel.setStyle("Text", "Level");
				this._labelLevel.setStyle("TextSize", 24);
				this._labelLevel.setStyle("TextStyle", "bold");
				this._labelLevel.setStyle("TextFont", "Audiowide");
				this._labelLevel.setStyle("TextColor", "#DDDDDD");
				
				this._labelLevelValue = new LabelElement();
				this._labelLevelValue.setStyle("Text", "0");
				this._labelLevelValue.setStyle("TextSize", 20);
				this._labelLevelValue.setStyle("TextStyle", "normal");
				this._labelLevelValue.setStyle("TextFont", "Audiowide");
				this._labelLevelValue.setStyle("TextColor", "#DDDDDD");
				this._labelLevelValue.setStyle("PaddingTop", 8);
			
				this._scoreContainerSpacer1 = new CanvasElement();
				this._scoreContainerSpacer1.setStyle("PercentHeight", 100);
			
				this._scoreContainerDivider1 = new CanvasElement();
				this._scoreContainerDivider1.setStyle("PercentWidth", 80);
				this._scoreContainerDivider1.setStyle("Height", 1);
				this._scoreContainerDivider1.setStyle("BackgroundColor", "#DDDDDD");
				
				this._scoreContainerSpacer2 = new CanvasElement();
				this._scoreContainerSpacer2.setStyle("PercentHeight", 100);
				
				this._labelLines = new LabelElement();
				this._labelLines.setStyle("Text", "Lines");
				this._labelLines.setStyle("TextSize", 24);
				this._labelLines.setStyle("TextStyle", "bold");
				this._labelLines.setStyle("TextFont", "Audiowide");
				this._labelLines.setStyle("TextColor", "#DDDDDD");
				
				this._labelLineCount = new LabelElement();
				this._labelLineCount.setStyle("Text", "0");
				this._labelLineCount.setStyle("TextSize", 20);
				this._labelLineCount.setStyle("TextStyle", "normal");
				this._labelLineCount.setStyle("TextFont", "Audiowide");
				this._labelLineCount.setStyle("TextColor", "#DDDDDD");
				this._labelLineCount.setStyle("PaddingTop", 8);
				
				this._scoreContainerSpacer3 = new CanvasElement();
				this._scoreContainerSpacer3.setStyle("PercentHeight", 100);
				
				this._scoreContainerDivider2 = new CanvasElement();
				this._scoreContainerDivider2.setStyle("PercentWidth", 80);
				this._scoreContainerDivider2.setStyle("Height", 1);
				this._scoreContainerDivider2.setStyle("BackgroundColor", "#DDDDDD");
				
				this._scoreContainerSpacer4 = new CanvasElement();
				this._scoreContainerSpacer4.setStyle("PercentHeight", 100);
				
				this._labelScore = new LabelElement();
				this._labelScore.setStyle("Text", "Score");
				this._labelScore.setStyle("TextSize", 24);
				this._labelScore.setStyle("TextStyle", "bold");
				this._labelScore.setStyle("TextFont", "Audiowide");
				this._labelScore.setStyle("TextColor", "#DDDDDD");
				
				this._labelScoreValue = new LabelElement();
				this._labelScoreValue.setStyle("Text", "0");
				this._labelScoreValue.setStyle("TextSize", 20);
				this._labelScoreValue.setStyle("TextStyle", "normal");
				this._labelScoreValue.setStyle("TextFont", "Audiowide");
				this._labelScoreValue.setStyle("TextColor", "#DDDDDD");
				this._labelScoreValue.setStyle("PaddingTop", 8);
				
				this._scoreContainerSpacer5 = new CanvasElement();
				this._scoreContainerSpacer5.setStyle("PercentHeight", 100);
			
			this._scoreContainer.addElement(this._scoreContainerSpacer0);	
			this._scoreContainer.addElement(this._labelLevel);
			this._scoreContainer.addElement(this._labelLevelValue);
			this._scoreContainer.addElement(this._scoreContainerSpacer1);
			this._scoreContainer.addElement(this._scoreContainerDivider1);
			this._scoreContainer.addElement(this._scoreContainerSpacer2);
			this._scoreContainer.addElement(this._labelLines);
			this._scoreContainer.addElement(this._labelLineCount);
			this._scoreContainer.addElement(this._scoreContainerSpacer3);
			this._scoreContainer.addElement(this._scoreContainerDivider2);
			this._scoreContainer.addElement(this._scoreContainerSpacer4);
			this._scoreContainer.addElement(this._labelScore);
			this._scoreContainer.addElement(this._labelScoreValue);
			this._scoreContainer.addElement(this._scoreContainerSpacer5);
			
		this._scoreRoundedBorder.addElement(this._scoreContainer);
		
		this._pauseButton = new ButtonElement();
		this._pauseButton.setStyle("Text", "MENU");
		this._pauseButton.setStyle("TextFont", "Audiowide");
		this._pauseButton.setStyle("TextSize", 22);
		this._pauseButton.setStyle("TextStyle", "bold");
		this._pauseButton.setStyleDefinitions([buttonBackgroundColors]);
		this._pauseButton.setStyle("Width", 140);
		this._pauseButton.setStyle("Height", 45);
		this._pauseButton.setStyle("X", 315);
		this._pauseButton.setStyle("Y", 575);
		
	this.addElement(this._gridRoundedBorder);
	this.addElement(this._nextRoundedBorder);
	this.addElement(this._holdRoundedBorder);
	this.addElement(this._scoreRoundedBorder);
	this.addElement(this._pauseButton);


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
			tetriBlock.setStyle("Width", 30);
			tetriBlock.setStyle("Height", 30);
			tetriBlock.setStyle("X", i2 * 30);
			tetriBlock.setStyle("Y", i * 30);
			
			this._blockContainer.addElement(tetriBlock);
		}
	}
	
	this._randomBag = [];
	this._level = 0;
	this._lineCount = 0;
	
	this._fallTime = -1;
	this._lockTime = -1;
	this._lockRemaining = TetriStackApplication.GetLockDelayTime();
	
	
	////Key state tracking////
	
	//Key hold / repeat timers
	this._leftTime = -1;
	this._rightTime = -1;
	this._softDropTime = -1;
	
	//Prevent repeat key press / hold (record key first pressed, ignore all keys till released)
	this._rotateRightKey = null;
	this._rotateLeftKey = null;
	this._hardDropKey = null;
	this._holdKey = null;
	
	//Allow key hold, respect any keys while pressed, most recent key if left/right
	this._softDropKeys = [];
	this._leftRightKeys = [];
	
	this._currentBlocks = [];
	this._currentPiece = 0;
	this._currentOrient = 0;
	this._currentOriginX = 0;
	this._currentOriginY = 0;
	
	this._currentResetLockY = -1;
	
	this._ghostBlocks = [];
	
	this._currentLines = [];
	this._linesClearTime = -1;
	
	this._nextPiece = 0;
	this._holdPiece = null;
	this._holdAvailable = true;
}

//Inherit from AnchorContainerElement
TetriPlayField.prototype = Object.create(AnchorContainerElement.prototype);
TetriPlayField.prototype.constructor = TetriPlayField;
TetriPlayField.base = AnchorContainerElement;

TetriPlayField.KeyholdDelay1 = 200;
TetriPlayField.KeyholdDelay2 = 50;

TetriPlayField.prototype._onPlayFieldEnterFrame = 
	function (event)
	{
		var currentTime = Date.now();
		
		if (this._currentPiece != null && this._lockTime != -1 && currentTime >= this._lockTime)
		{
			//Not over ground
			if (this._testPosition(this._currentPiece, this._currentOrient, this._currentOriginX, this._currentOriginY + 1) != null)
			{
				//Turn off lock time, zero remaining time, instant lock if we dont drop down further.
				this._lockRemaining = 0;
				this._lockTime = -1;
			}
			else //Lock complete
				this._lockCurrentPiece(this._lockTime);
		}
		
		if (this._currentPiece != null)
		{
			while (this._leftTime != -1 && this._rightTime == -1 && currentTime >= this._leftTime)
			{
				this._moveCurrentPiece(this._leftTime, "left");
				this._leftTime += TetriPlayField.KeyholdDelay2;
			}
			
			while (this._rightTime != -1 && this._leftTime == -1 && currentTime >= this._rightTime)
			{
				this._moveCurrentPiece(this._rightTime, "right");
				this._rightTime += TetriPlayField.KeyholdDelay2;
			}
			
			while (this._softDropTime != -1 && currentTime >= this._softDropTime)
			{
				this._softDropTime += Math.ceil(TetriStackApplication.GetFallSpeed(this._level) / 20);
				this._moveCurrentPiece(this._softDropTime, "down");
			}
			
			while (this._fallTime != -1 && currentTime >= this._fallTime)
			{
				this._moveCurrentPiece(this._fallTime, "down");
			}
		}
		
		if (this._currentLines.length > 0 && currentTime >= this._linesClearTime)
		{
			this._clearLines();
			this._generatePiece(this._linesClearTime);
		}
	};
	
TetriPlayField.prototype._lockCurrentPiece = 
	function (fromTime)
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
		{
			this._linesClearTime = fromTime + 300;
			this._currentPiece = null;
		}
		else
			this._generatePiece(fromTime);
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
		this._labelLineCount.setStyle("Text", this._lineCount.toString());
		
		if (Math.floor(this._lineCount / 10) + 1 > this._level)
			this._setLevel(Math.floor(this._lineCount / 10) + 1);
		
		this._currentLines.splice(0, this._currentLines.length);
	};
	
TetriPlayField.prototype.startGame = 
	function (currentTime, startLevel)
	{
		this._setLevel(startLevel);
		this._nextPiece = this._getNextPiece();
		
		this._generatePiece(currentTime);
	};
	
TetriPlayField.prototype._setLevel = 
	function (level)
	{
		if (this._level == level)
			return;
		
		this._level = level;
		this._labelLevelValue.setStyle("Text", level.toString());
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
	
TetriPlayField.prototype._updateHoldPiece = 
	function ()
	{
		var block;
		var point;
		var blockPoints = TetriStackApplication.PieceData[this._holdPiece][0];
		var blockColor = TetriStackApplication.GetBlockColor(this._holdPiece);
		
		for (var i = 0; i < blockPoints.length; i++)
		{
			if (this._holdPieceBlockContainer.getNumElements() < i + 1)
			{
				block = new TetriBlock();
				block.setStyle("Width", 25);
				block.setStyle("Height", 25);
				
				this._holdPieceBlockContainer.addElement(block);
			}
			else
				block = this._holdPieceBlockContainer.getElementAt(i);
			
			point = blockPoints[i];
			
			block.setBlockColor(blockColor);
			block.setStyle("X", point.x * 25);
			
			if (this._holdPiece != 0)
				block.setStyle("Y", point.y * 25);
			else
				block.setStyle("Y", 0);
		}
	};	
	
TetriPlayField.prototype._generatePiece = 
	function (fromTime, useHoldPiece)
	{
		if (useHoldPiece == true && this._holdPiece != null)
			this._currentPiece = this._holdPiece;
		else
		{
			this._currentPiece = this._nextPiece;
			this._nextPiece = this._getNextPiece();
			this._updateNextPiece();
		}
		
		this._currentOrient = 0;
		this._currentOriginX = 3;
		this._currentOriginY = 1;
		this._currentBlocks.splice(0, this._currentBlocks.length);
		
		this._currentResetLockY = -1;
		this._fallTime = -1;
		this._lockTime = -1;
		this._lockRemaining = TetriStackApplication.GetLockDelayTime();
		this._linesClearTime = -1;
		this._holdAvailable = true;
		
		if (this._currentPiece == 1)
			this._currentOriginX = 4;
		
		if (this._updatePosition(this._currentPiece, this._currentOrient, this._currentOriginX, this._currentOriginY) == false)
			return; //TODO: Game over
		
		this._moveCurrentPiece(fromTime, "down");
		this._updateGhost();
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
	
TetriPlayField.prototype._moveCurrentPiece = 
	function (fromTime, direction)
	{
		if (this._currentPiece == null)
			return false;
	
		var originX = this._currentOriginX;
		var originY = this._currentOriginY;
	
		if (direction == "left")
			originX -= 1;
		else if (direction == "right")
			originX += 1;
		else if (direction == "down")
			originY += 1;
		
		result = this._updatePosition(this._currentPiece, this._currentOrient, originX, originY);
		
		//Always reset fall time, reset lock time if origin increased.
		if (direction == "down")
		{
			this._fallTime = fromTime + Math.ceil(TetriStackApplication.GetFallSpeed(this._level));
			
			if (this._currentResetLockY < this._currentOriginY)
			{
				//Prevent floor kicks from restarting the lock timer.
				this._currentResetLockY = this._currentOriginY;
				
				this._lockTime = -1;
				this._lockRemaining = TetriStackApplication.GetLockDelayTime();
			}
		}
		
		//Touching ground
		if (this._testPosition(this._currentPiece, this._currentOrient, this._currentOriginX, this._currentOriginY + 1) == null)
		{
			//Lock is not running, turn it on with remaining time.
			if (this._lockTime == -1)
				this._lockTime = fromTime + this._lockRemaining;
		}
		else //Not touching ground (or moved off of ground)
		{
			//Lock is running, shut if off, record remaining time.
			if (this._lockTime != -1)
			{
				this._lockRemaining = this._lockTime - fromTime;
				this._lockTime = -1;
			}
		}
		
		if (result == true && (direction == "right" || direction == "left"))
			this._updateGhost();
		
		return result;
	};
	
TetriPlayField.prototype._rotateCurrentPiece = 
	function (direction, fromTime)
	{
		if (this._currentPiece == null)
			return;
	
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
		
		var result = false;
		
		for (var i = 0; i < kickTable.length; i++)
		{
			originX = this._currentOriginX + kickTable[i].x;
			originY = this._currentOriginY + kickTable[i].y;
			
			if (this._updatePosition(this._currentPiece, newOrient, originX, originY) == true)
			{
				result = true;
				break;
			}
		}
		
		if (result == true)
		{
			//Touching ground
			if (this._testPosition(this._currentPiece, this._currentOrient, this._currentOriginX, this._currentOriginY + 1) == null)
			{
				//Lock not started, start it.
				if (this._lockTime == -1)
					this._lockTime = fromTime + TetriStackApplication.GetLockDelayTime();
			}
			else //Not touching ground
			{
				//Lock started, stop it and record remaining time.
				if (this._lockTime != -1)
				{
					this._lockRemaining = this._lockTime - fromTime;
					this._lockTime = -1;
				}
			}
			
			this._updateGhost();
		}
		
		return result;
	};
	
TetriPlayField.prototype._holdCurrentPiece = 
	function (fromTime)
	{
		if (this._currentPiece == null || this._holdAvailable == false)
			return;
		
		var block = null;
		for (var i = 0; i < this._currentBlocks.length; i++)
		{
			block = this._currentBlocks[i];
			block.setBlockColor(TetriStackApplication.BlockColors.BLACK);
		}
		
		var currentPiece = this._currentPiece;
		this._generatePiece(fromTime, true);
		
		this._holdPiece = currentPiece;
		this._updateHoldPiece();
		this._holdAvailable = false;
	};
	
TetriPlayField.prototype._hardDropCurrentPiece = 
	function (fromTime)
	{
		if (this._currentPiece == null)
			return;
		
		var y = this._currentOriginY + 1;
		var blocks = null;
		
		while (true)
		{
			blocks = this._testPosition(this._currentPiece, this._currentOrient, this._currentOriginX, y);
			
			if (blocks == null)
			{
				y--;
				break;
			}
			
			y++;
		}
		
		this._updatePosition(this._currentPiece, this._currentOrient, this._currentOriginX, y);
		this._lockCurrentPiece(fromTime);
	};
	
TetriPlayField.prototype._onApplicationKeyup = 
	function (keyboardEvent)
	{
		var keycode = keyboardEvent.getKeyCode();
		
		if (keycode == this._hardDropKey)
		{
			this._hardDropKey = null;
			return;
		}
		if (keycode == this._rotateLeftKey)
		{
			this._rotateLeftKey = null;
			return;
		}
		if (keycode == this._rotateRightKey)
		{
			this._rotateRightKey = null;
			return;
		}
		if (keycode == this._holdKey)
		{
			this._holdKey = null;
			return;
		}
		
		if (this._softDropKeys.indexOf(keycode) != -1)
		{
			this._softDropKeys.splice(this._softDropKeys.indexOf(keycode), 1);
			
			if (this._softDropKeys.length == 0)
				this._softDropTime = -1;
			
			return;
		}
		
		if (this._leftRightKeys.indexOf(keycode) != -1)
		{
			this._leftRightKeys.splice(this._leftRightKeys.indexOf(keycode), 1);
			
			if (this._leftRightKeys.length == 0)
			{
				this._leftTime = -1;
				this._rightTime = -1;
			}
			else
			{
				var keytype = null;
				var keycode = this._leftRightKeys[this._leftRightKeys.length - 1];
				
				if (keycode == 65 || keycode == 37 || keycode == 100)
					keytype = "left";
				else
					keytype = "right";
					
				var currentTime = Date.now();
				
				if (this._leftTime == -1 && keytype == "left")
				{
					this._rightTime = -1;
					this._leftTime = currentTime + TetriPlayField.KeyholdDelay1;
				}
				else if (this._rightTime == -1 && keytype == "right")
				{
					this._leftTime = -1;
					this._rightTime = currentTime + TetriPlayField.KeyholdDelay1;
				}
			}
		}
	};
	
TetriPlayField.prototype._onApplicationKeydown = 
	function (keyboardEvent)
	{
		//block input while waiting for lines to clear.
		if (this._currentLines.length > 0)
			return;
	
		var keycode = keyboardEvent.getKeyCode();
		var keytype = null;
		
		if (keycode == 65 || keycode == 37 || keycode == 100)
			keytype = "left";
		else if (keycode == 68 || keycode == 39 || keycode == 102)
			keytype = "right";
		else if (keycode == 83 || keycode == 40 || keycode == 101)
			keytype = "down";
		else if (keycode == 87 || keycode == 38 || keycode == 104)
			keytype = "up";
		else if (keycode == 81 || keycode == 74 || keycode == 103)
			keytype = "rleft";
		else if (keycode == 69 || keycode == 76 || keycode == 105)
			keytype = "rright";
		else if (keycode == 32 || keycode == 75 || keycode == 96)
			keytype = "hold";
	
		if (keytype == null)
			return;
		
		var currentTime = Date.now();
		
		if (keytype == "left")
		{
			//Key already down (keyboard auto repeat)
			if (this._leftRightKeys.indexOf(keycode) != -1)
				return;
			
			this._leftRightKeys.push(keycode);
			
			this._rightTime = -1;
			
			if (this._leftTime == -1)
			{
				this._leftTime = currentTime + TetriPlayField.KeyholdDelay1;
				this._moveCurrentPiece(currentTime, "left");
			}
			
			return;
		}
		if (keytype == "right")
		{
			//Key already down (keyboard auto repeat)
			if (this._leftRightKeys.indexOf(keycode) != -1)
				return;
			
			this._leftRightKeys.push(keycode);
			
			this._leftTime = -1;
			
			if (this._rightTime == -1)
			{
				this._rightTime = currentTime + TetriPlayField.KeyholdDelay1;
				this._moveCurrentPiece(currentTime, "right");
			}
			
			return;
		}
		if (keytype == "down")
		{
			//Key already down (keyboard auto repeat)
			if (this._softDropKeys.indexOf(keycode) != -1)
				return;
			
			this._softDropKeys.push(keycode);
			
			if (this._softDropKeys.length == 1)
			{
				this._softDropTime = currentTime + Math.ceil(TetriStackApplication.GetFallSpeed(this._level) / 20);
				this._moveCurrentPiece(currentTime, "down");
			}
			
			return;
		}
		if (keytype == "up")
		{
			//Only allow 1 press from 1 key at a time
			if (this._hardDropKey != null)
				return;
			
			this._hardDropKey = keycode;
			this._hardDropCurrentPiece(currentTime);
			
			return;
		}
		if (keytype == "rleft")
		{
			//Only allow 1 press from 1 key at a time
			if (this._rotateLeftKey != null)
				return;
			
			this._rotateLeftKey = keycode;
			this._rotateCurrentPiece("left", currentTime);
			
			return;
		}
		if (keytype == "rright")
		{
			//Only allow 1 press from 1 key at a time
			if (this._rotateRightKey != null)
				return;
			
			this._rotateRightKey = keycode;
			this._rotateCurrentPiece("right", currentTime);
			
			return;
		}
		if (keytype == "hold")
		{
			//Only allow 1 press from 1 key at a time
			if (this._holdKey != null)
				return;
			
			this._holdKey = keycode;
			this._holdCurrentPiece(currentTime);
			
			return;
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
			
			//Existing block (not ourself & not a ghost)
			if (newBlocks[i].getBlockColor() != TetriStackApplication.BlockColors.BLACK && 
				newBlocks[i].getIsGhost() == false &&
				this._currentBlocks.indexOf(newBlocks[i]) == -1)
			{
				return null;
			}
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
	
TetriPlayField.prototype._updateGhost = 
	function ()
	{
		var i;
		var y = this._currentOriginY;
	
		var ghostBlocks = null;
		var ghostBlocks2 = null;
		
		while (true)
		{
			y++;
			ghostBlocks2 = this._testPosition(this._currentPiece, this._currentOrient, this._currentOriginX, y);
			
			if (ghostBlocks2 != null)
				ghostBlocks = ghostBlocks2;
			else
				break;
		}
		
		if (ghostBlocks == null)
		{
			for (i = 0; i < this._ghostBlocks.length; i++)
			{
				this._ghostBlocks[i].setIsGhost(false);
				this._ghostBlocks[i].setBlockColor(TetriStackApplication.BlockColors.BLACK);
			}
			
			this._ghostBlocks.splice(0, this._ghostBlocks.length);
		}
		else
		{
			var blockColor = TetriStackApplication.GetBlockColor(this._currentPiece);
			
			for (i = ghostBlocks.length - 1; i >= 0; i--)
			{	
				if (this._currentBlocks.indexOf(ghostBlocks[i]) > -1)
				{	
					//Purge any ghost blocks that overlap actual blocks
					ghostBlocks.splice(i, 1);
				}
				else
				{
					//Apply ghost color
					ghostBlocks[i].setBlockColor(blockColor);
					ghostBlocks[i].setIsGhost(true);
				}
			}
			
			//Shut off any old ghost blocks
			for (i = this._ghostBlocks.length - 1; i >= 0; i--)
			{
				if (ghostBlocks.indexOf(this._ghostBlocks[i]) == -1)
				{
					this._ghostBlocks[i].setBlockColor(TetriStackApplication.BlockColors.BLACK);
					this._ghostBlocks[i].setIsGhost(false);
				}
			}
			
			this._ghostBlocks = ghostBlocks;
		}
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
			{
				this._currentBlocks[i].setBlockColor(TetriStackApplication.BlockColors.BLACK);
				this._currentBlocks[i].setIsGhost(false);
			}
		}
		
		var blockColor = TetriStackApplication.GetBlockColor(this._currentPiece);
		var ghostIndex = -1;
		
		for (i = 0; i < newBlocks.length; i++)
		{
			newBlocks[i].setBlockColor(blockColor);
			newBlocks[i].setIsGhost(false);
			
			//Purge ghost block if we just overlapped it.
			ghostIndex = this._ghostBlocks.indexOf(newBlocks[i]);
			if (ghostIndex > -1)
				this._ghostBlocks.splice(ghostIndex, 1);
		}
		
		this._currentBlocks = newBlocks;
		this._currentOriginX = originX;
		this._currentOriginY = originY;
		this._currentOrient = orient;
		
		return true;
	};
	
	