
//Root application.

function TetriStackApplication() //extends CanvasManager
{
	//Call base constructor
	TetriStackApplication.base.prototype.constructor.call(this);
	
	////////////////LAYOUT & STYLING/////////////////////////////
	//This section could be handled by an XML markup interpreter.
	
	//Using indentation to help visualize nest level of elements.
	
	this.setStyle("BackgroundColor", "#444444");
	
		this._menuView = new ListContainerElement();
		this._menuView.setStyle("LayoutHorizontalAlign", "center");
		this._menuView.setStyle("LayoutVerticalAlign", "middle");
		this._menuView.setStyle("PercentWidth", 100);
		this._menuView.setStyle("PercentHeight", 100);
		
			this._buttonPlay = new ButtonElement();
			this._buttonPlay.setStyle("Text", "Play");
			
		this._menuView.addElement(this._buttonPlay);	
	
		this._gameView = new ListContainerElement();
		this._gameView.setStyle("LayoutHorizontalAlign", "center");
		this._gameView.setStyle("LayoutVerticalAlign", "middle");
		this._gameView.setStyle("PercentWidth", 100);
		this._gameView.setStyle("PercentHeight", 100);
		this._gameView.setStyle("Visible", false);
		this._gameView.setStyle("IncludeInLayout", false);
		
	this.addElement(this._menuView);
	this.addElement(this._gameView);
	
	//////////////////EVENT HANDLING//////////////////////////
	//This section could be handled by a XML markup interpreter.
	
	var _self = this;
	
	this._onButtonPlayClickInstance = 
		function (event)
		{
			_self._onButtonPlayClick(event);
		};
	
	this._buttonPlay.addEventListener("click", this._onButtonPlayClickInstance);
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
		
		playField.startGame(Date.now(), 1);
	};

////STATIC////

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
         {orientStart:2, orientEnd:2, kickTable:[{x:0, y:0},	{x:-2, y:0},	{x:1, y:0},		{x:-2, y:1},	{x:1, y:-2}]},
         {orientStart:3, orientEnd:0, kickTable:[{x:0, y:0},	{x:1, y:0},		{x:-2, y:0},	{x:1, y:2},		{x:-2, y:-1}]},
         {orientStart:0, orientEnd:3, kickTable:[{x:0, y:0},	{x:-1, y:0},	{x:2, y:0},		{x:-1, y:-2},	{x:2, y:1}]} ],
        
        //Kick table for all other pieces
        [{orientStart:0, orientEnd:1, kickTable:[{x:0, y:0},	{x:-1, y:0},	{x:-1, y:-1},  	{x:0, y:2},		{x:-1, y:2}]},
         {orientStart:1, orientEnd:0, kickTable:[{x:0, y:0},	{x:1, y:0},		{x:1, y:1},	  	{x:0, y:-2},	{x:1, y:-2}]},
         {orientStart:1, orientEnd:2, kickTable:[{x:0, y:0},	{x:1, y:0},		{x:1, y:1},	  	{x:0, y:-2},	{x:1, y:-2}]},
         {orientStart:2, orientEnd:1, kickTable:[{x:0, y:0},	{x:-1, y:0},	{x:-1, y:-1},  	{x:0, y:2},		{x:-1, y:2}]},
         {orientStart:2, orientEnd:3, kickTable:[{x:0, y:0},	{x:1, y:0},		{x:1, y:-1},   	{x:0, y:2},		{x:1, y:2}]},
         {orientStart:2, orientEnd:2, kickTable:[{x:0, y:0},	{x:-1, y:0},	{x:-1, y:1},	{x:0, y:-2},	{x:-1, y:-2}]},
         {orientStart:3, orientEnd:0, kickTable:[{x:0, y:0},	{x:-1, y:0},	{x:-1, y:1},	{x:0, y:-2},	{x:-1, y:-2}]},
         {orientStart:0, orientEnd:3, kickTable:[{x:0, y:0},	{x:1, y:0},		{x:1, y:-1},	{x:0, y:2},		{x:1, y:2}]} ]
        
	];	
	
//Standard guideline spawn and basic rotation tables
TetriStackApplication.PieceData = [	//[piece][orientation][point]
                                    	
      [	 //XXXX
	 	
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









