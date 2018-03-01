
//Root application.

function TetriStackApplication() //extends CanvasManager
{
	//Call base constructor
	TetriStackApplication.base.prototype.constructor.call(this);
	
	////////////////LAYOUT & STYLING/////////////////////////////
	//This section could be handled by an XML markup interpreter.
	
	//Using indentation to help visualize nest level of elements.
	
	this.setStyle("BackgroundColor", "#444444");
	
		this._rootContainer = new ListContainerElement();
		this._rootContainer.setStyle("PercentWidth", 100);
		this._rootContainer.setStyle("PercentHeight", 100);
		this._rootContainer.setStyle("PercentHeight", 100);
		
			this._contentContainer = new ListContainerElement();
			this._contentContainer.setStyle("PercentWidth", 100);
			this._contentContainer.setStyle("PercentHeight", 100);
		
				this._menuView = new ListContainerElement();
				this._menuView.setStyle("LayoutHorizontalAlign", "center");
				this._menuView.setStyle("LayoutVerticalAlign", "middle");
				this._menuView.setStyle("LayoutGap", 20);
				this._menuView.setStyle("PercentWidth", 100);
				this._menuView.setStyle("PercentHeight", 100);
				
					this._titleContainer = new AnchorContainerElement();
				
					this._labelSelectLevel = new LabelElement(); 
					this._labelSelectLevel.setStyle("Text", "Start At Level");
					this._labelSelectLevel.setStyle("TextSize", 22);
					this._labelSelectLevel.setStyle("TextStyle", "bold");
					this._labelSelectLevel.setStyle("TextFont", "Audiowide");
					this._labelSelectLevel.setStyle("TextColor", "#DDDDDD");
					this._labelSelectLevel.setStyle("PaddingTop", 20);
					
					this._levelSelectContainer = new ListContainerElement();
					this._levelSelectContainer.setStyle("LayoutDirection", "horizontal");
					this._levelSelectContainer.setStyle("LayoutVerticalAlign", "middle");
					this._levelSelectContainer.setStyle("LayoutGap", 30);
					this._levelSelectContainer.setStyle("PaddingBottom", 10);
					
						var arrowLeftShape = new ArrowShape();
						arrowLeftShape.setStyle("Direction", "left");
						this._buttonLowerLevel = new ButtonElement();
						this._buttonLowerLevel.setStyle("Width", 25);
						this._buttonLowerLevel.setStyle("Height", 25);
						this._buttonLowerLevel.setStyle("Enabled", false);
						this._buttonLowerLevel.setStyle("BackgroundShape", arrowLeftShape);
						this._buttonLowerLevel.setStyleDefinitions([buttonBackgroundColors]);
						
						this._labelSelectedLevel = new LabelElement();
						this._labelSelectedLevel.setStyle("Text", "1");
						this._labelSelectedLevel.setStyle("Width", 35);
						this._labelSelectedLevel.setStyle("TextSize", 22);
						this._labelSelectedLevel.setStyle("TextHorizontalAlign", "center");
						this._labelSelectedLevel.setStyle("TextStyle", "bold");
						this._labelSelectedLevel.setStyle("TextFont", "Audiowide");
						this._labelSelectedLevel.setStyle("TextColor", "#DDDDDD");
						
						var arrowRightShape = new ArrowShape();
						arrowRightShape.setStyle("Direction", "right");
						this._buttonHigherLevel = new ButtonElement();
						this._buttonHigherLevel.setStyle("Width", 25);
						this._buttonHigherLevel.setStyle("Height", 25);
						this._buttonHigherLevel.setStyle("BackgroundShape", arrowRightShape);
						this._buttonHigherLevel.setStyleDefinitions([buttonBackgroundColors]);
						
					this._levelSelectContainer.addElement(this._buttonLowerLevel);
					this._levelSelectContainer.addElement(this._labelSelectedLevel);
					this._levelSelectContainer.addElement(this._buttonHigherLevel);
					
					this._buttonPlay = new ButtonElement();
					this._buttonPlay.setStyle("Text", "PLAY");
					this._buttonPlay.setStyleDefinitions([buttonBackgroundColors, buttonPlayStyle]);
					
					this._controlsContainer = new ListContainerElement();
					this._controlsContainer.setStyle("PaddingTop", 30);
					this._controlsContainer.setStyle("LayoutGap", 5);
					this._controlsContainer.setStyle("LayoutHorizontalAlign", "center");
					
						this._controlsDivider = new CanvasElement();
						this._controlsDivider.setStyle("Height", 1);
						this._controlsDivider.setStyle("Width", 520);
						this._controlsDivider.setStyle("BackgroundColor", "#DDDDDD");
						
						this._controlMoveLeftContainer = new ListContainerElement();
						this._controlMoveLeftContainer.setStyle("LayoutDirection", "horizontal");
						this._controlMoveLeftContainer.setStyle("LayoutVerticalAlign", "middle");
						this._controlMoveLeftContainer.setStyle("PercentWidth", 100);
						
							this._labelControlMoveLeft = new LabelElement();
							this._labelControlMoveLeft.setStyle("Text", "Move Left:");
							this._labelControlMoveLeft.setStyle("TextStyle", "bold");
							this._labelControlMoveLeft.setStyleDefinitions(labelControlsStyle);
							this._labelControlMoveLeft.setStyle("PercentWidth", 100);
							this._labelControlMoveLeft.setStyle("TextHorizontalAlign", "left");
							
							this._labelControlMoveLeftKey1 = new LabelElement();
							this._labelControlMoveLeftKey1.setStyle("Text", "A");
							this._labelControlMoveLeftKey1.setStyle("Width", 100);
							this._labelControlMoveLeftKey1.setStyleDefinitions(labelControlsStyle);
							
							this._labelControlMoveLeftDivider1 = new CanvasElement();
							this._labelControlMoveLeftDivider1.setStyleDefinitions(labelControlsDividerStyle);
							
							this._labelControlMoveLeftKey2 = new LabelElement();
							this._labelControlMoveLeftKey2.setStyle("Text", "Arrow Left");
							this._labelControlMoveLeftKey2.setStyle("Width", 150);
							this._labelControlMoveLeftKey2.setStyleDefinitions(labelControlsStyle);
							
							this._labelControlMoveLeftDivider2 = new CanvasElement();
							this._labelControlMoveLeftDivider2.setStyleDefinitions(labelControlsDividerStyle);
							
							this._labelControlMoveLeftKey3 = new LabelElement();
							this._labelControlMoveLeftKey3.setStyle("Text", "NumPad 4");
							this._labelControlMoveLeftKey3.setStyle("Width", 120);
							this._labelControlMoveLeftKey3.setStyle("TextHorizontalAlign", "right");
							this._labelControlMoveLeftKey3.setStyleDefinitions(labelControlsStyle);
							
						this._controlMoveLeftContainer.addElement(this._labelControlMoveLeft);
						this._controlMoveLeftContainer.addElement(this._labelControlMoveLeftKey1);
						this._controlMoveLeftContainer.addElement(this._labelControlMoveLeftDivider1);
						this._controlMoveLeftContainer.addElement(this._labelControlMoveLeftKey2);
						this._controlMoveLeftContainer.addElement(this._labelControlMoveLeftDivider2);
						this._controlMoveLeftContainer.addElement(this._labelControlMoveLeftKey3);
						
						this._controlMoveRightContainer = new ListContainerElement();
						this._controlMoveRightContainer.setStyle("LayoutDirection", "horizontal");
						this._controlMoveRightContainer.setStyle("LayoutVerticalAlign", "middle");
						this._controlMoveRightContainer.setStyle("PercentWidth", 100);
						
							this._labelControlMoveRight = new LabelElement();
							this._labelControlMoveRight.setStyle("Text", "Move Right:");
							this._labelControlMoveRight.setStyle("TextStyle", "bold");
							this._labelControlMoveRight.setStyleDefinitions(labelControlsStyle);
							this._labelControlMoveRight.setStyle("PercentWidth", 100);
							this._labelControlMoveRight.setStyle("TextHorizontalAlign", "left");
							
							this._labelControlMoveRightKey1 = new LabelElement();
							this._labelControlMoveRightKey1.setStyle("Text", "D");
							this._labelControlMoveRightKey1.setStyle("Width", 100);
							this._labelControlMoveRightKey1.setStyleDefinitions(labelControlsStyle);
							
							this._labelControlMoveRightDivider1 = new CanvasElement();
							this._labelControlMoveRightDivider1.setStyleDefinitions(labelControlsDividerStyle);
							
							this._labelControlMoveRightKey2 = new LabelElement();
							this._labelControlMoveRightKey2.setStyle("Text", "Arrow Right");
							this._labelControlMoveRightKey2.setStyle("Width", 150);
							this._labelControlMoveRightKey2.setStyleDefinitions(labelControlsStyle);
							
							this._labelControlMoveRightDivider2 = new CanvasElement();
							this._labelControlMoveRightDivider2.setStyleDefinitions(labelControlsDividerStyle);
							
							this._labelControlMoveRightKey3 = new LabelElement();
							this._labelControlMoveRightKey3.setStyle("Text", "NumPad 6");
							this._labelControlMoveRightKey3.setStyle("Width", 120);
							this._labelControlMoveRightKey3.setStyle("TextHorizontalAlign", "right");
							this._labelControlMoveRightKey3.setStyleDefinitions(labelControlsStyle);
							
						this._controlMoveRightContainer.addElement(this._labelControlMoveRight);
						this._controlMoveRightContainer.addElement(this._labelControlMoveRightKey1);
						this._controlMoveRightContainer.addElement(this._labelControlMoveRightDivider1);
						this._controlMoveRightContainer.addElement(this._labelControlMoveRightKey2);
						this._controlMoveRightContainer.addElement(this._labelControlMoveRightDivider2);
						this._controlMoveRightContainer.addElement(this._labelControlMoveRightKey3);
						
						this._controlSoftDropContainer = new ListContainerElement();
						this._controlSoftDropContainer.setStyle("LayoutDirection", "horizontal");
						this._controlSoftDropContainer.setStyle("LayoutVerticalAlign", "middle");
						this._controlSoftDropContainer.setStyle("PercentWidth", 100);
						
							this._labelControlSoftDrop = new LabelElement();
							this._labelControlSoftDrop.setStyle("Text", "Soft Drop:");
							this._labelControlSoftDrop.setStyle("TextStyle", "bold");
							this._labelControlSoftDrop.setStyleDefinitions(labelControlsStyle);
							this._labelControlSoftDrop.setStyle("PercentWidth", 100);
							this._labelControlSoftDrop.setStyle("TextHorizontalAlign", "left");
							
							this._labelControlSoftDropKey1 = new LabelElement();
							this._labelControlSoftDropKey1.setStyle("Text", "S");
							this._labelControlSoftDropKey1.setStyle("Width", 100);
							this._labelControlSoftDropKey1.setStyleDefinitions(labelControlsStyle);
							
							this._labelControlSoftDropDivider1 = new CanvasElement();
							this._labelControlSoftDropDivider1.setStyleDefinitions(labelControlsDividerStyle);
							
							this._labelControlSoftDropKey2 = new LabelElement();
							this._labelControlSoftDropKey2.setStyle("Text", "Arrow Down");
							this._labelControlSoftDropKey2.setStyle("Width", 150);
							this._labelControlSoftDropKey2.setStyleDefinitions(labelControlsStyle);
							
							this._labelControlSoftDropDivider2 = new CanvasElement();
							this._labelControlSoftDropDivider2.setStyleDefinitions(labelControlsDividerStyle);
							
							this._labelControlSoftDropKey3 = new LabelElement();
							this._labelControlSoftDropKey3.setStyle("Text", "NumPad 5");
							this._labelControlSoftDropKey3.setStyle("Width", 120);
							this._labelControlSoftDropKey3.setStyle("TextHorizontalAlign", "right");
							this._labelControlSoftDropKey3.setStyleDefinitions(labelControlsStyle);
						
						this._controlSoftDropContainer.addElement(this._labelControlSoftDrop);
						this._controlSoftDropContainer.addElement(this._labelControlSoftDropKey1);
						this._controlSoftDropContainer.addElement(this._labelControlSoftDropDivider1);
						this._controlSoftDropContainer.addElement(this._labelControlSoftDropKey2);
						this._controlSoftDropContainer.addElement(this._labelControlSoftDropDivider2);
						this._controlSoftDropContainer.addElement(this._labelControlSoftDropKey3);
						
						this._controlHardDropContainer = new ListContainerElement();
						this._controlHardDropContainer.setStyle("LayoutDirection", "horizontal");
						this._controlHardDropContainer.setStyle("LayoutVerticalAlign", "middle");
						this._controlHardDropContainer.setStyle("PercentWidth", 100);
						
							this._labelControlHardDrop = new LabelElement();
							this._labelControlHardDrop.setStyle("Text", "Hard Drop:");
							this._labelControlHardDrop.setStyle("TextStyle", "bold");
							this._labelControlHardDrop.setStyleDefinitions(labelControlsStyle);
							this._labelControlHardDrop.setStyle("PercentWidth", 100);
							this._labelControlHardDrop.setStyle("TextHorizontalAlign", "left");
							
							this._labelControlHardDropKey1 = new LabelElement();
							this._labelControlHardDropKey1.setStyle("Text", "W");
							this._labelControlHardDropKey1.setStyle("Width", 100);
							this._labelControlHardDropKey1.setStyleDefinitions(labelControlsStyle);
							
							this._labelControlHardDropDivider1 = new CanvasElement();
							this._labelControlHardDropDivider1.setStyleDefinitions(labelControlsDividerStyle);
							
							this._labelControlHardDropKey2 = new LabelElement();
							this._labelControlHardDropKey2.setStyle("Text", "Arrow Up");
							this._labelControlHardDropKey2.setStyle("Width", 150);
							this._labelControlHardDropKey2.setStyleDefinitions(labelControlsStyle);
							
							this._labelControlHardDropDivider2 = new CanvasElement();
							this._labelControlHardDropDivider2.setStyleDefinitions(labelControlsDividerStyle);
							
							this._labelControlHardDropKey3 = new LabelElement();
							this._labelControlHardDropKey3.setStyle("Text", "NumPad 8");
							this._labelControlHardDropKey3.setStyle("Width", 120);
							this._labelControlHardDropKey3.setStyle("TextHorizontalAlign", "right");
							this._labelControlHardDropKey3.setStyleDefinitions(labelControlsStyle);
							
						this._controlHardDropContainer.addElement(this._labelControlHardDrop);
						this._controlHardDropContainer.addElement(this._labelControlHardDropKey1);
						this._controlHardDropContainer.addElement(this._labelControlHardDropDivider1);
						this._controlHardDropContainer.addElement(this._labelControlHardDropKey2);
						this._controlHardDropContainer.addElement(this._labelControlHardDropDivider2);
						this._controlHardDropContainer.addElement(this._labelControlHardDropKey3);
						
						this._controlRotateLeftContainer = new ListContainerElement();
						this._controlRotateLeftContainer.setStyle("LayoutDirection", "horizontal");
						this._controlRotateLeftContainer.setStyle("LayoutVerticalAlign", "middle");
						this._controlRotateLeftContainer.setStyle("PercentWidth", 100);
						
							this._labelControlRotateLeft = new LabelElement();
							this._labelControlRotateLeft.setStyle("Text", "Rotate Left:");
							this._labelControlRotateLeft.setStyle("TextStyle", "bold");
							this._labelControlRotateLeft.setStyleDefinitions(labelControlsStyle);
							this._labelControlRotateLeft.setStyle("PercentWidth", 100);
							this._labelControlRotateLeft.setStyle("TextHorizontalAlign", "left");
							
							this._labelControlRotateLeftKey1 = new LabelElement();
							this._labelControlRotateLeftKey1.setStyle("Text", "Q");
							this._labelControlRotateLeftKey1.setStyle("Width", 100);
							this._labelControlRotateLeftKey1.setStyleDefinitions(labelControlsStyle);
							
							this._labelControlRotateLeftDivider1 = new CanvasElement();
							this._labelControlRotateLeftDivider1.setStyleDefinitions(labelControlsDividerStyle);
							
							this._labelControlRotateLeftKey2 = new LabelElement();
							this._labelControlRotateLeftKey2.setStyle("Text", "J");
							this._labelControlRotateLeftKey2.setStyle("Width", 150);
							this._labelControlRotateLeftKey2.setStyleDefinitions(labelControlsStyle);
							
							this._labelControlRotateLeftDivider2 = new CanvasElement();
							this._labelControlRotateLeftDivider2.setStyleDefinitions(labelControlsDividerStyle);
							
							this._labelControlRotateLeftKey3 = new LabelElement();
							this._labelControlRotateLeftKey3.setStyle("Text", "NumPad 7");
							this._labelControlRotateLeftKey3.setStyle("Width", 120);
							this._labelControlRotateLeftKey3.setStyle("TextHorizontalAlign", "right");
							this._labelControlRotateLeftKey3.setStyleDefinitions(labelControlsStyle);
							
						this._controlRotateLeftContainer.addElement(this._labelControlRotateLeft);
						this._controlRotateLeftContainer.addElement(this._labelControlRotateLeftKey1);
						this._controlRotateLeftContainer.addElement(this._labelControlRotateLeftDivider1);
						this._controlRotateLeftContainer.addElement(this._labelControlRotateLeftKey2);
						this._controlRotateLeftContainer.addElement(this._labelControlRotateLeftDivider2);
						this._controlRotateLeftContainer.addElement(this._labelControlRotateLeftKey3);
						
						this._controlRotateRightContainer = new ListContainerElement();
						this._controlRotateRightContainer.setStyle("LayoutDirection", "horizontal");
						this._controlRotateRightContainer.setStyle("LayoutVerticalAlign", "middle");
						this._controlRotateRightContainer.setStyle("PercentWidth", 100);
						
							this._labelControlRotateRight = new LabelElement();
							this._labelControlRotateRight.setStyle("Text", "Rotate Right:");
							this._labelControlRotateRight.setStyle("TextStyle", "bold");
							this._labelControlRotateRight.setStyleDefinitions(labelControlsStyle);
							this._labelControlRotateRight.setStyle("PercentWidth", 100);
							this._labelControlRotateRight.setStyle("TextHorizontalAlign", "left");
							
							this._labelControlRotateRightKey1 = new LabelElement();
							this._labelControlRotateRightKey1.setStyle("Text", "E");
							this._labelControlRotateRightKey1.setStyle("Width", 100);
							this._labelControlRotateRightKey1.setStyleDefinitions(labelControlsStyle);
							
							this._labelControlRotateRightDivider1 = new CanvasElement();
							this._labelControlRotateRightDivider1.setStyleDefinitions(labelControlsDividerStyle);
							
							this._labelControlRotateRightKey2 = new LabelElement();
							this._labelControlRotateRightKey2.setStyle("Text", "L");
							this._labelControlRotateRightKey2.setStyle("Width", 150);
							this._labelControlRotateRightKey2.setStyleDefinitions(labelControlsStyle);
							
							this._labelControlRotateRightDivider2 = new CanvasElement();
							this._labelControlRotateRightDivider2.setStyleDefinitions(labelControlsDividerStyle);
							
							this._labelControlRotateRightKey3 = new LabelElement();
							this._labelControlRotateRightKey3.setStyle("Text", "NumPad 9");
							this._labelControlRotateRightKey3.setStyle("Width", 120);
							this._labelControlRotateRightKey3.setStyle("TextHorizontalAlign", "right");
							this._labelControlRotateRightKey3.setStyleDefinitions(labelControlsStyle);
							
						this._controlRotateRightContainer.addElement(this._labelControlRotateRight);
						this._controlRotateRightContainer.addElement(this._labelControlRotateRightKey1);
						this._controlRotateRightContainer.addElement(this._labelControlRotateRightDivider1);
						this._controlRotateRightContainer.addElement(this._labelControlRotateRightKey2);
						this._controlRotateRightContainer.addElement(this._labelControlRotateRightDivider2);
						this._controlRotateRightContainer.addElement(this._labelControlRotateRightKey3);
						
						this._controlHoldContainer = new ListContainerElement();
						this._controlHoldContainer.setStyle("LayoutDirection", "horizontal");
						this._controlHoldContainer.setStyle("LayoutVerticalAlign", "middle");
						this._controlHoldContainer.setStyle("PercentWidth", 100);
						
							this._labelControlHold = new LabelElement();
							this._labelControlHold.setStyle("Text", "Hold:");
							this._labelControlHold.setStyle("TextStyle", "bold");
							this._labelControlHold.setStyleDefinitions(labelControlsStyle);
							this._labelControlHold.setStyle("PercentWidth", 100);
							this._labelControlHold.setStyle("TextHorizontalAlign", "left");
							
							this._labelControlHoldKey1 = new LabelElement();
							this._labelControlHoldKey1.setStyle("Text", "Space");
							this._labelControlHoldKey1.setStyle("Width", 100);
							this._labelControlHoldKey1.setStyleDefinitions(labelControlsStyle);
							
							this._labelControlHoldDivider1 = new CanvasElement();
							this._labelControlHoldDivider1.setStyleDefinitions(labelControlsDividerStyle);
							
							this._labelControlHoldKey2 = new LabelElement();
							this._labelControlHoldKey2.setStyle("Text", "K");
							this._labelControlHoldKey2.setStyle("Width", 150);
							this._labelControlHoldKey2.setStyleDefinitions(labelControlsStyle);
							
							this._labelControlHoldDivider2 = new CanvasElement();
							this._labelControlHoldDivider2.setStyleDefinitions(labelControlsDividerStyle);
							
							this._labelControlHoldKey3 = new LabelElement();
							this._labelControlHoldKey3.setStyle("Text", "NumPad 0");
							this._labelControlHoldKey3.setStyle("Width", 120);
							this._labelControlHoldKey3.setStyle("TextHorizontalAlign", "right");
							this._labelControlHoldKey3.setStyleDefinitions(labelControlsStyle);
							
						this._controlHoldContainer.addElement(this._labelControlHold);
						this._controlHoldContainer.addElement(this._labelControlHoldKey1);
						this._controlHoldContainer.addElement(this._labelControlHoldDivider1);
						this._controlHoldContainer.addElement(this._labelControlHoldKey2);
						this._controlHoldContainer.addElement(this._labelControlHoldDivider2);
						this._controlHoldContainer.addElement(this._labelControlHoldKey3);
						
					this._controlsContainer.addElement(this._controlsDivider);
					this._controlsContainer.addElement(this._controlMoveLeftContainer);
					this._controlsContainer.addElement(this._controlMoveRightContainer);
					this._controlsContainer.addElement(this._controlSoftDropContainer);
					this._controlsContainer.addElement(this._controlHardDropContainer);
					this._controlsContainer.addElement(this._controlRotateLeftContainer);
					this._controlsContainer.addElement(this._controlRotateRightContainer);
					this._controlsContainer.addElement(this._controlHoldContainer);
					
				this._menuView.addElement(this._titleContainer);
				this._menuView.addElement(this._labelSelectLevel);
				this._menuView.addElement(this._levelSelectContainer);
				this._menuView.addElement(this._buttonPlay);
				this._menuView.addElement(this._controlsContainer);	
			
				this._gameView = new ListContainerElement();
				this._gameView.setStyle("LayoutHorizontalAlign", "center");
				this._gameView.setStyle("LayoutVerticalAlign", "middle");
				this._gameView.setStyle("PercentWidth", 100);
				this._gameView.setStyle("PercentHeight", 100);
				this._gameView.setStyle("Visible", false);
				this._gameView.setStyle("IncludeInLayout", false);
				
			this._contentContainer.addElement(this._menuView);
			this._contentContainer.addElement(this._gameView);
			
			this._footerContainer = new ListContainerElement();
			this._footerContainer.setStyle("PercentWidth", 100);
			this._footerContainer.setStyle("LayoutHorizontalAlign", "right");
			
				this._poweredByContainerBackgroundShape = new RoundedRectangleShape();
				this._poweredByContainerBackgroundShape.setStyle("CornerRadiusTopLeft", 5);
				this._poweredByContainer = new ListContainerElement();
				this._poweredByContainer.setStyle("LayoutGap", -1);
				this._poweredByContainer.setStyle("LayoutDirection", "horizontal");
				this._poweredByContainer.setStyle("BackgroundColor", "#777777");
				this._poweredByContainer.setStyle("Padding", 2);
				this._poweredByContainer.setStyle("BackgroundShape", this._poweredByContainerBackgroundShape);
				
					this._labelPoweredBy = new LabelElement();
					this._labelPoweredBy.setStyle("Text", "Powered By ");
					this._labelPoweredBy.setStyle("TextColor", "#000000");
					
					this._labelFlexCanvasJS = new LabelElement();
					this._labelFlexCanvasJS.setStyle("TextStyle", "bold italic");
					this._labelFlexCanvasJS.setStyle("Text", "FlexCanvasJS");
					this._labelFlexCanvasJS.setStyle("TextColor", "#000000");
					
				this._poweredByContainer.addElement(this._labelPoweredBy);
				this._poweredByContainer.addElement(this._labelFlexCanvasJS);
				
			this._footerContainer.addElement(this._poweredByContainer);
			
		this._rootContainer.addElement(this._contentContainer);
		this._rootContainer.addElement(this._footerContainer);
	
	this.addElement(this._rootContainer);	
		
	//////////////////EVENT HANDLING//////////////////////////
	//This section could be handled by a XML markup interpreter.
	
	var _self = this;
	
	this._onButtonPlayClickInstance = 
		function (event)
		{
			_self._onButtonPlayClick(event);
		};
	this._onButtonLowerLevelClickInstance = 
		function (event)
		{
			_self._onButtonLowerLevelClick(event);
		};
	this._onButtonHigherLevelClickInstance = 
		function (event)
		{
			_self._onButtonHigherLevelClick(event);
		};
	
	this._buttonPlay.addEventListener("click", this._onButtonPlayClickInstance);
	this._buttonLowerLevel.addEventListener("click", this._onButtonLowerLevelClickInstance);
	this._buttonHigherLevel.addEventListener("click", this._onButtonHigherLevelClickInstance);
	
	//////////////////////////////////////////////////////////
	
	this._selectedLevel = 1;
	
	
	////Build Tetristack logo////////////////
	var i;
	var i2;
	for (i = 0; i < 7; i++)
	{
		for (i2 = 0; i2 < 41; i2++)
		{
			block = new TetriBlock();
			block.setStyle("Width", 14);
			block.setStyle("Height", 14);
			block.setStyle("X", i2 * 13);
			block.setStyle("Y", i * 13);
			
			this._titleContainer.addElement(block);
		}
	}
	
	var titleString = "TETRISTACK";
	var letterPoints = null;
	var block;
	var blockX;
	var blockY;
	var blockIndex = 0;
	var offsetX = 1;
	var offsetY = 1;
	var blockColor = TetriStackApplication.BlockColors.ORANGE;
	
	for (i = 0; i < titleString.length; i++)
	{
		letterPoints = TetriStackApplication.TitleLetterCoordinates[titleString[i]];
		
		if (blockColor == TetriStackApplication.BlockColors.ORANGE)
			blockColor = TetriStackApplication.BlockColors.DARKBLUE;
		
		else if (blockColor == TetriStackApplication.BlockColors.DARKBLUE)
			blockColor = TetriStackApplication.BlockColors.GREEN;
		
		else if (blockColor == TetriStackApplication.BlockColors.GREEN)
			blockColor = TetriStackApplication.BlockColors.YELLOW;
		
		else if (blockColor == TetriStackApplication.BlockColors.YELLOW)
			blockColor = TetriStackApplication.BlockColors.LIGHTBLUE;
		
		else if (blockColor == TetriStackApplication.BlockColors.LIGHTBLUE)
			blockColor = TetriStackApplication.BlockColors.RED;
		
		else if (blockColor == TetriStackApplication.BlockColors.RED)
			blockColor = TetriStackApplication.BlockColors.PURPLE;
		
		else if (blockColor == TetriStackApplication.BlockColors.PURPLE)
			blockColor = TetriStackApplication.BlockColors.ORANGE;
		
		for (i2 = 0; i2 < letterPoints.length; i2++)
		{
			blockX = offsetX + letterPoints[i2].x;
			blockY = offsetY + letterPoints[i2].y;
			
			blockIndex = blockY * 41;
			blockIndex += blockX;
			
			block = this._titleContainer.getElementAt(blockIndex);
			block.setBlockColor(blockColor);
		}	
		
		offsetX += 4;
	}
}

//Inherit from CanvasManager
TetriStackApplication.prototype = Object.create(CanvasManager.prototype);
TetriStackApplication.prototype.constructor = TetriStackApplication;
TetriStackApplication.base = CanvasManager;


TetriStackApplication.prototype._onButtonPlayClick = 
	function (event)
	{
		this._menuView.setStyle("Visible", false);
		this._menuView.setStyle("IncludeInLayout", false);
		
		this._gameView.setStyle("Visible", true);
		this._gameView.setStyle("IncludeInLayout", true);
		
		var playField = new TetriPlayField();
		this._gameView.addElement(playField);
		
		playField.startGame(Date.now(), this._selectedLevel);
	};

TetriStackApplication.prototype._onButtonLowerLevelClick = 
	function (event)
	{
		this._selectedLevel--;
		this._labelSelectedLevel.setStyle("Text", this._selectedLevel.toString());
		
		this._buttonHigherLevel.setStyle("Enabled", true);
		
		if (this._selectedLevel == 1)
			this._buttonLowerLevel.setStyle("Enabled", false);
		else
			this._buttonLowerLevel.setStyle("Enabled", true);
	};
	
TetriStackApplication.prototype._onButtonHigherLevelClick = 
	function (event)
	{
		this._selectedLevel++;
		this._labelSelectedLevel.setStyle("Text", this._selectedLevel.toString());
		
		this._buttonLowerLevel.setStyle("Enabled", true);
		
		if (this._selectedLevel == 10)
			this._buttonHigherLevel.setStyle("Enabled", false);
		else
			this._buttonHigherLevel.setStyle("Enabled", true);
	};	
	
	
////STATIC////

TetriStackApplication.TitleLetterCoordinates = 
	{
	 	T:[{x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:1, y:1}, {x:1, y:2}, {x:1, y:3}, {x:1, y:4}], 
	 	E:[{x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:0, y:1}, {x:0, y:2}, {x:1, y:2}, {x:0, y:3}, {x:0, y:4},  {x:1, y:4},  {x:2, y:4}],
	 	R:[{x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:0, y:1}, {x:2, y:1}, {x:0, y:2}, {x:1, y:2}, {x:0, y:3},  {x:2, y:3},  {x:0, y:4},  {x:2, y:4}],
	 	I:[{x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:1, y:1}, {x:1, y:2}, {x:1, y:3}, {x:0, y:4}, {x:1, y:4}, {x:2, y:4}],
	 	S:[{x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:0, y:1}, {x:0, y:2}, {x:1, y:2}, {x:2, y:2}, {x:2, y:3}, {x:0, y:4},  {x:1, y:4},  {x:2, y:4}],
	 	A:[{x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:0, y:1}, {x:2, y:1}, {x:0, y:2}, {x:1, y:2}, {x:2, y:2}, {x:0, y:3},  {x:2, y:3},  {x:0, y:4},  {x:2, y:4}],
	 	C:[{x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:0, y:1}, {x:0, y:2}, {x:0, y:3}, {x:0, y:4}, {x:1, y:4}, {x:2, y:4}],
	 	K:[{x:0, y:0}, {x:2, y:0}, {x:0, y:1}, {x:2, y:1}, {x:0, y:2}, {x:1, y:2}, {x:0, y:3},  {x:2, y:3},  {x:0, y:4},  {x:2, y:4}]
	};
	
TetriStackApplication.BlockColors = 
{
	BLACK:{base:"#202020", lighter:CanvasElement.adjustColorLight("#202020", +.03), darker:CanvasElement.adjustColorLight("#202020", -.08)},
	WHITE:{base:"#DDDDDD", lighter:CanvasElement.adjustColorLight("#DDDDDD", +.12), darker:CanvasElement.adjustColorLight("#DDDDDD", -.12)},
	YELLOW:{base:"#BDBD00", lighter:CanvasElement.adjustColorLight("#BDBD00", +.18), darker:CanvasElement.adjustColorLight("#BDBD00", -.06)},
	LIGHTBLUE:{base:"#3F8FFF", lighter:CanvasElement.adjustColorLight("#3F8FFF", +.12), darker:CanvasElement.adjustColorLight("#3F8FFF", -.12)},
	DARKBLUE:{base:"#0033CC", lighter:CanvasElement.adjustColorLight("#0033CC", +.12), darker:CanvasElement.adjustColorLight("#0033CC", -.12)},
	ORANGE:{base:"#EA7A11", lighter:CanvasElement.adjustColorLight("#EA7A11", +.16), darker:CanvasElement.adjustColorLight("#EA7A11", -.08)},
	PURPLE:{base:"#8928BC", lighter:CanvasElement.adjustColorLight("#8928BC", +.12), darker:CanvasElement.adjustColorLight("#8928BC", -.12)},
	GREEN:{base:"#20B520", lighter:CanvasElement.adjustColorLight("#20B520", +.18), darker:CanvasElement.adjustColorLight("#20B520", -.08)},
	RED:{base:"#CC3333", lighter:CanvasElement.adjustColorLight("#CC3333", +.12), darker:CanvasElement.adjustColorLight("#CC3333", -.12)}
};
	
TetriStackApplication.GetBlockColor = 
	function (piece)
	{
		if (piece == 0)
			return TetriStackApplication.BlockColors.LIGHTBLUE;
		if (piece == 1)
			return TetriStackApplication.BlockColors.YELLOW;
		if (piece == 2)
			return TetriStackApplication.BlockColors.PURPLE;
		if (piece == 3)
			return TetriStackApplication.BlockColors.GREEN;
		if (piece == 4)
			return TetriStackApplication.BlockColors.RED;
		if (piece == 5)
			return TetriStackApplication.BlockColors.DARKBLUE;
		if (piece == 6)
			return TetriStackApplication.BlockColors.ORANGE;
		
		return TetriStackApplication.BlockColors.BLACK;
	};

TetriStackApplication.GetKickTable = 
	function (piece, orientStart, orientEnd)
	{
		var tableIndex = 0;
		
		if (piece != 0) //line
			tableIndex = 1;
		
		for (var i = 0; i < TetriStackApplication.PieceRotateData[tableIndex].length; i++)
		{
			if (TetriStackApplication.PieceRotateData[tableIndex][i].orientStart == orientStart && 
				TetriStackApplication.PieceRotateData[tableIndex][i].orientEnd == orientEnd)
			{
				return TetriStackApplication.PieceRotateData[tableIndex][i].kickTable;
			}
		}
		
		//Shouldnt get here!
		return [{x:0, y:0}];
	};

//Standard guideline delay (between lock and next piece)	
TetriStackApplication.GetGenerationDelayTime = 
	function ()
	{
		//Milliseconds
		return 200;
	};
	
//Standard guideline lock delay	
TetriStackApplication.GetLockDelayTime = 
	function ()
	{
		//Milliseconds
		return 500;
	};	
	
//Standard guideline fall speed	
TetriStackApplication.GetFallSpeed = 
	function (level)
	{
		//Milliseconds per line
		return (Math.pow(0.8 - ((level - 1) * 0.007), level - 1)) * 1000; 
	};
	
//Standard guideline rotation kick tables
TetriStackApplication.PieceRotateData = [
                                         
        //Kick table for line
        [{orientStart:0, orientEnd:1, kickTable:[{x:0, y:0},	{x:-2, y:0},	{x:1, y:0},		{x:-2, y:1},	{x:1, y:-2}]},
         {orientStart:1, orientEnd:0, kickTable:[{x:0, y:0},	{x:2, y:0},		{x:-1, y:0},	{x:2, y:-1},	{x:-1, y:2}]},
         {orientStart:1, orientEnd:2, kickTable:[{x:0, y:0},	{x:-1, y:0},	{x:2, y:0},		{x:-1, y:-2},	{x:2, y:1}]},
         {orientStart:2, orientEnd:1, kickTable:[{x:0, y:0},	{x:1, y:0},		{x:-2, y:0},	{x:1, y:2},		{x:-2, y:-1}]},
         {orientStart:2, orientEnd:3, kickTable:[{x:0, y:0},	{x:2, y:0},		{x:-1, y:0},	{x:2, y:-1},	{x:-1, y:2}]},
         {orientStart:3, orientEnd:2, kickTable:[{x:0, y:0},	{x:-2, y:0},	{x:1, y:0},		{x:-2, y:1},	{x:1, y:-2}]},
         {orientStart:3, orientEnd:0, kickTable:[{x:0, y:0},	{x:1, y:0},		{x:-2, y:0},	{x:1, y:2},		{x:-2, y:-1}]},
         {orientStart:0, orientEnd:3, kickTable:[{x:0, y:0},	{x:-1, y:0},	{x:2, y:0},		{x:-1, y:-2},	{x:2, y:1}]} ],
        
        //Kick table for all other pieces
        [{orientStart:0, orientEnd:1, kickTable:[{x:0, y:0},	{x:-1, y:0},	{x:-1, y:-1},  	{x:0, y:2},		{x:-1, y:2}]},
         {orientStart:1, orientEnd:0, kickTable:[{x:0, y:0},	{x:1, y:0},		{x:1, y:1},	  	{x:0, y:-2},	{x:1, y:-2}]},
         {orientStart:1, orientEnd:2, kickTable:[{x:0, y:0},	{x:1, y:0},		{x:1, y:1},	  	{x:0, y:-2},	{x:1, y:-2}]},
         {orientStart:2, orientEnd:1, kickTable:[{x:0, y:0},	{x:-1, y:0},	{x:-1, y:-1},  	{x:0, y:2},		{x:-1, y:2}]},
         {orientStart:2, orientEnd:3, kickTable:[{x:0, y:0},	{x:1, y:0},		{x:1, y:-1},   	{x:0, y:2},		{x:1, y:2}]},
         {orientStart:3, orientEnd:2, kickTable:[{x:0, y:0},	{x:-1, y:0},	{x:-1, y:1},	{x:0, y:-2},	{x:-1, y:-2}]},
         {orientStart:3, orientEnd:0, kickTable:[{x:0, y:0},	{x:-1, y:0},	{x:-1, y:1},	{x:0, y:-2},	{x:-1, y:-2}]},
         {orientStart:0, orientEnd:3, kickTable:[{x:0, y:0},	{x:1, y:0},		{x:1, y:-1},	{x:0, y:2},		{x:1, y:2}]} ]
        
	];	
	
//Standard guideline spawn and basic rotation tables
TetriStackApplication.PieceData = [	//[piece][orientation][point]
                                    	
      [	 //XXXX //0
	 	
           [{x:0, y:1},		//OOOO
           {x:1, y:1},		//XXXX
           {x:2, y:1},		//OOOO
           {x:3, y:1}],		//OOOO
        
           [{x:2, y:0},		//OOXO
           {x:2, y:1},		//OOXO
           {x:2, y:2},		//OOXO
           {x:2, y:3}],		//OOXO
           
           [{x:0, y:2},		//OOOO
           {x:1, y:2},		//OOOO
           {x:2, y:2},		//XXXX
           {x:3, y:2}],		//OOOO
           
           [{x:1, y:0},		//OXOO
           {x:1, y:1},		//OXOO
           {x:1, y:2},		//OXOO
           {x:1, y:3}]		//OXOO
     ],
     [	//XX //1
      	//XX
			[{x:0, y:0},	
			{x:1, y:0},
			{x:0, y:1},
			{x:1, y:1}],
			
			[{x:0, y:0},	
			{x:1, y:0},
			{x:0, y:1},
			{x:1, y:1}],
			
			[{x:0, y:0},	
			{x:1, y:0},
			{x:0, y:1},
			{x:1, y:1}],
			 
			[{x:0, y:0},	
			{x:1, y:0},
			{x:0, y:1},
			{x:1, y:1}],                                 
	 ],
	 [	// X 	//2
	  	//XXX
			[{x:1, y:0},	//OXO
			{x:0, y:1},		//XXX
			{x:1, y:1},		//OOO
			{x:2, y:1}],
			
			[{x:1, y:0},	//OXO
			{x:1, y:1},		//OXX
			{x:2, y:1},		//OXO
			{x:1, y:2}],
			
			[{x:0, y:1},	//OOO
			{x:1, y:1},		//XXX
			{x:2, y:1},		//OXO
			{x:1, y:2}],
			 
			[{x:1, y:0},	//OXO
			{x:0, y:1},		//XXO
			{x:1, y:1},		//OXO
			{x:1, y:2}],                                 
	 ],
	 [	// XX  //3
	  	//XX
			[{x:1, y:0},	//OXX
			{x:2, y:0},		//XXO
			{x:0, y:1},		//OOO
			{x:1, y:1}],
			
			[{x:1, y:0},	//OXO
			{x:1, y:1},		//OXX
			{x:2, y:1},		//OOX
			{x:2, y:2}],
			
			[{x:1, y:1},	//OOO
			{x:2, y:1},		//OXX
			{x:0, y:2},		//XXO
			{x:1, y:2}],
			 
			[{x:0, y:0},	//XOO
			{x:0, y:1},		//XXO
			{x:1, y:1},		//OXO
			{x:1, y:2}],                                 
	 ],
	 [	//XX	//4
	  	// XX
			[{x:0, y:0},	//XXO
			{x:1, y:0},		//OXX
			{x:1, y:1},		//OOO
			{x:2, y:1}],
			
			[{x:2, y:0},	//OOX
			{x:1, y:1},		//OXX
			{x:2, y:1},		//OXO
			{x:1, y:2}],
			
			[{x:0, y:1},	//OOO
			{x:1, y:1},		//XXO
			{x:1, y:2},		//OXX
			{x:2, y:2}],
			 
			[{x:1, y:0},	//OXO
			{x:0, y:1},		//XXO
			{x:1, y:1},		//XOO
			{x:0, y:2}],                                 
	 ],
	 [	//X		//5
	  	//XXX
			[{x:0, y:0},	//XOO
			{x:0, y:1},		//XXX
			{x:1, y:1},		//OOO
			{x:2, y:1}],
			
			[{x:1, y:0},	//OXX
			{x:2, y:0},		//OXO
			{x:1, y:1},		//OXO
			{x:1, y:2}],
			
			[{x:0, y:1},	//OOO
			{x:1, y:1},		//XXX
			{x:2, y:1},		//OOX
			{x:2, y:2}],
			 
			[{x:1, y:0},	//OXO
			{x:1, y:1},		//OXO
			{x:0, y:2},		//XXO
			{x:1, y:2}],                                 
	 ],
	 [	//  X	//6
	  	//XXX
			[{x:2, y:0},	//OOX
			{x:0, y:1},		//XXX
			{x:1, y:1},		//OOO
			{x:2, y:1}],
			
			[{x:1, y:0},	//OXO
			{x:1, y:1},		//OXO
			{x:1, y:2},		//OXX
			{x:2, y:2}],
			
			[{x:0, y:1},	//OOO
			{x:1, y:1},		//XXX
			{x:2, y:1},		//XOO
			{x:0, y:2}],
			 
			[{x:0, y:0},	//XXO
			{x:1, y:0},		//OXO
			{x:1, y:1},		//OXO
			{x:1, y:2}],                                 
	 ]
  ];









