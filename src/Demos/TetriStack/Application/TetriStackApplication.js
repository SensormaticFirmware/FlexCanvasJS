
//Root application.

function TetriStackApplication() //extends CanvasManager
{
	//Call base constructor
	TetriStackApplication.base.prototype.constructor.call(this);
	
	////////////////LAYOUT & STYLING/////////////////////////////
	//This section could be handled by an XML markup interpreter.
	
	//Using indentation to help visualize nest level of elements.
	
		this._buttonRotateLeft = new ButtonElement();
		this._buttonRotateLeft.setStyle("Text", "Rotate Left");
		
		this._buttonRotateRight = new ButtonElement();
		this._buttonRotateRight.setStyle("Text", "Rotate Right");
		this._buttonRotateRight.setStyle("X", 100);
		
		this._buttonNextPiece = new ButtonElement();
		this._buttonNextPiece.setStyle("Text", "Next Piece");
		this._buttonNextPiece.setStyle("X", 200);
		
		this._grid = new CanvasElement();
		this._grid.setStyle("Width", 200);
		this._grid.setStyle("Height", 400);
		this._grid.setStyle("X", 20);
		this._grid.setStyle("Y", 100);
		this._grid.setStyle("BorderType", "solid");
		
		
	this.addElement(this._buttonRotateLeft);
	this.addElement(this._buttonRotateRight);
	this.addElement(this._buttonNextPiece);
	
	this.addElement(this._grid);
	
	
	//////////////////EVENT HANDLING//////////////////////////
	//This section could be handled by a XML markup interpreter.
	
	var _self = this;
	
	this._onButtonClickInstance = 
		function (event)
		{
			while (_self.currentBlocks.length < 4)
			{
				var newBlock = new CanvasElement();
				newBlock.setStyle("BorderType", "solid");
				newBlock.setStyle("BackgroundColor", "#0055FF");
				newBlock._setActualSize(20, 20);
				
				_self.currentBlocks.push(newBlock);
				_self._grid._addChild(newBlock);
			}
		
			if (event.getTarget() == _self._buttonNextPiece)
			{
				_self.currentPiece++;
				if (_self.currentPiece > TetriStackApplication.PieceData.length - 1)
					_self.currentPiece = 0;
				
				_self.currentOrient = 0;
			}
			else if (event.getTarget() == _self._buttonRotateLeft)
			{
				_self.currentOrient--;
				if (_self.currentOrient < 0)
					_self.currentOrient = 3;
			}
			else if (event.getTarget() == _self._buttonRotateRight)
			{
				_self.currentOrient++;
				if (_self.currentOrient > 3)
					_self.currentOrient = 0;
			}
			
			var points = TetriStackApplication.PieceData[_self.currentPiece][_self.currentOrient];
			var point;
			for (var i = 0; i < 4; i++)
			{
				point = points[i];
				_self.currentBlocks[i]._setActualPosition((_self.currentOrigin.x + point.x) * 20, (_self.currentOrigin.y + point.y) * 20);
			}
		};
	
	this._buttonRotateLeft.addEventListener("click", this._onButtonClickInstance);
	this._buttonRotateRight.addEventListener("click", this._onButtonClickInstance);
	this._buttonNextPiece.addEventListener("click", this._onButtonClickInstance);
		
	
	/////////////////FUNCTIONAL///////////////////////////////
	
	this.currentBlocks = [];
	this.currentPiece = -1;
	this.currentOrient = 0;
	this.currentOrigin = {x:2, y:3};
	
	
}

//Inherit from CanvasManager
TetriStackApplication.prototype = Object.create(CanvasManager.prototype);
TetriStackApplication.prototype.constructor = TetriStackApplication;
TetriStackApplication.base = CanvasManager;


////STATIC////

TetriStackApplication.PieceData = [	//[piece][orientation][point]
                                    	
      [	 //XXXX
	 	
           [{x:1, y:0},		//OXOO
           {x:1, y:1},		//OXOO
           {x:1, y:2},		//OXOO
           {x:1, y:3}],		//OXOO
       
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
           {x:3, y:2}]		//OOOO
     ],
     [	//XX
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
	 [	// X
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
	 [	// XX
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
	 [	//XX
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
	 [	//X
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
	 [	//  X
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








