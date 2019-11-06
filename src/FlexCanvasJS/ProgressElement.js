
/**
 * @depends CanvasElement.js
 */

///////////////////////////////////////////////////////
/////////////ProgressElement///////////////////////////
	
/**
 * @class ProgressElement
 * @inherits CanvasElement
 * 
 * ProgressElement is a CanvasElement that adds a second FillBase style
 * called "ProgressFill". The progress fill is drawn on top of the background fill
 * and clipped according to the current progress value. This can be used to make
 * progress bar type elements of any shape or styling.
 * 
 * @constructor ProgressElement 
 * Creates new ProgressElement instance.
 */
function ProgressElement() //extends CanvasElement
{
	ProgressElement.base.prototype.constructor.call(this);
	
	this._progressValue = 0;
	
	//Storage for the current progress fill FillBase() per styling. We need to store a reference 
	//because we listen for style changed events and need to be able to remove the listener when
	//this is changed (via styles) or added/removed to display chain.
	this._progressFill = null;
	
	
	var _self = this;
	
	this._onProgressFillStyleChangedInstance = 
		function (styleChangedEvent)
		{
			_self._onProgressFillStyleChanged(styleChangedEvent);
		};
}

//Inherit from CanvasElement
ProgressElement.prototype = Object.create(CanvasElement.prototype);
ProgressElement.prototype.constructor = ProgressElement;
ProgressElement.base = CanvasElement;


/////////////Style Types///////////////////////////////

ProgressElement._StyleTypes = Object.create(null);


/**
 * @style ProgressFill FillBase
 * 
 * Fill to use when filling the progress indicator. May be any FillBase subclass instance or "color" string. 
 */
ProgressElement._StyleTypes.ProgressFill = 								StyleableBase.EStyleType.NORMAL;		// FillBase() || "#FF0000" || null

/**
 * @style ProgressFillStart String
 * 
 * Determines the start position of the progress fill indicator, available values are "top", "bottom", "left" or "right". 
 */
ProgressElement._StyleTypes.ProgressFillStart = 						StyleableBase.EStyleType.NORMAL;		// "top" || "bottom" || "left" || "right"


////////////Default Styles///////////////////////////

ProgressElement.StyleDefault = new StyleDefinition();

ProgressElement.StyleDefault.setStyle("BackgroundFill", 				"#CCCCCC");
ProgressElement.StyleDefault.setStyle("ProgressFill", 					"#00FF00");	
ProgressElement.StyleDefault.setStyle("ProgressFillStart", 				"left");



///////Public////////

/**
 * @function setProgressValue
 * Sets the progress value, this determines how much of the progress bar will be filled.
 * 
 * @param value Number
 * Value between 0 and 1 (inclusive)
 */	
ProgressElement.prototype.setProgressValue = 
	function (value)
	{
		if (value < 0)
			value = 0;
		if (value > 1)
			value = 1;
		
		this._progressValue = value;
		
		this._invalidateRender();
	};

/**
 * @function getProgressValue
 * Gets the progress value, this determines how much of the progress bar will be filled.
 * 
 * @returns Number
 * Value between 0 and 1 (inclusive)
 */		
ProgressElement.prototype.getProgressValue = 
	function ()
	{
		return this._progressValue;
	};

////////Internal////////	
	
ProgressElement.prototype._onProgressFillStyleChanged = 
	function (styleChangedEvent)
	{
		this._invalidateRender();
	};
	
//@override
ProgressElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		ProgressElement.base.prototype._doStylesUpdated.call(this, stylesMap);
	
		//Copied from CanvasElement
		if ("ProgressFill" in stylesMap)
		{
			var bgFill = this.getStyle("ProgressFill"); //FillBase or color string
			
			//Only handle if changed, attached/detached handles initial add/remove listener.
			if (bgFill != this._progressFill)
			{
				//Check if new fill is solid (SolidFill or color string)
				var isSolidFillOrColor = false;
				if ((bgFill != null && bgFill instanceof FillBase == false) || bgFill instanceof SolidFill) //We're a color or a SolidFill class
					isSolidFillOrColor = true;
				
				if (this._progressFill instanceof SolidFill == true && isSolidFillOrColor == true) //Existing and new are both SolidFill
				{
					if (bgFill instanceof SolidFill == true) //Swap the solid fill classes
					{
						this._progressFill.removeEventListener("stylechanged", this._onProgressFillStyleChangedInstance);
						this._progressFill = bgFill;
						this._progressFill.addEventListener("stylechanged", this._onProgressFillStyleChangedInstance);
						
						this._invalidateRender();
					}
					else //Set the color to the current SolidFill
						this._progressFill.setStyle("FillColor", bgFill); //Will invalidate render if fill color changed
				}
				else //Definately different fill classes
				{
					//Purge the old background fill
					if (this._progressFill != null)
						this._progressFill.removeEventListener("stylechanged", this._onProgressFillStyleChangedInstance);
					
					this._progressFill = null;
					
					if (bgFill != null)
					{
						if (bgFill instanceof FillBase == false) //color
						{
							//Create new solid fill
							this._progressFill = new SolidFill();
							this._progressFill.setStyle("FillColor", bgFill);
						}
						else //Fill class
							this._progressFill = bgFill;
						
						this._progressFill.addEventListener("stylechanged", this._onProgressFillStyleChangedInstance);
					}
					
					this._invalidateRender();
				}
			}
		}
		
		if ("ProgressFillStart" in stylesMap)
			this._invalidateRender();
	};	

//@override	
ProgressElement.prototype._onCanvasElementAdded = 
	function (addedRemovedEvent)
	{
		ProgressElement.base.prototype._onCanvasElementAdded.call(this, addedRemovedEvent);
		
		if (this._progressFill != null && this._progressFill.hasEventListener("stylechanged", this._onProgressFillStyleChangedInstance) == false)
			this._progressFill.addEventListener("stylechanged", this._onProgressFillStyleChangedInstance);
	};
	
//@override	
ProgressElement.prototype._onCanvasElementRemoved = 
	function (addedRemovedEvent)
	{
		ProgressElement.base.prototype._onCanvasElementRemoved.call(this, addedRemovedEvent);
		
		if (this._progressFill != null && this._progressFill.hasEventListener("stylechanged", this._onProgressFillStyleChangedInstance) == true)
			this._progressFill.removeEventListener("stylechanged", this._onProgressFillStyleChangedInstance);
	};		
	
//override	
ProgressElement.prototype._fillBackground = 
	function (borderMetrics)
	{
		ProgressElement.base.prototype._fillBackground.call(this, borderMetrics);
	
		if (this._progressFill == null || this._progressValue == 0)
			return;
		
		var ctx = this._getGraphicsCtx();
		var fillStart = this.getStyle("ProgressFillStart");
		
		var fillSize;
		if (fillStart == "top" || fillStart == "bottom")
			fillSize = Math.round(borderMetrics._height * this._progressValue);
		else
			fillSize = Math.round(borderMetrics._width * this._progressValue);
		
		//Clip the region we need to re-draw
		if (this._progressValue < 1)
		{
			if (this._progressValue > 0)
			{
				ctx.save();
				
				ctx.beginPath();
				
				if (fillStart == "left")
				{
					ctx.moveTo(borderMetrics._x, borderMetrics._y);
					ctx.lineTo(borderMetrics._x + fillSize, borderMetrics._y);
					ctx.lineTo(borderMetrics._x + fillSize, borderMetrics._y + borderMetrics._height);
					ctx.lineTo(borderMetrics._x, borderMetrics._y + borderMetrics._height);
					ctx.closePath();
				}
				else if (fillStart == "bottom")
				{
					ctx.moveTo(borderMetrics._x, borderMetrics._y + borderMetrics._height - fillSize);
					ctx.lineTo(borderMetrics._x + borderMetrics._width, borderMetrics._y + borderMetrics._height - fillSize);
					ctx.lineTo(borderMetrics._x + borderMetrics._width, borderMetrics._y + borderMetrics._height);
					ctx.lineTo(borderMetrics._x, borderMetrics._y + borderMetrics._height);
					ctx.closePath();
				}
				else if (fillStart == "top")
				{
					ctx.moveTo(borderMetrics._x, borderMetrics._y);
					ctx.lineTo(borderMetrics._x + borderMetrics._width, borderMetrics._y);
					ctx.lineTo(borderMetrics._x + borderMetrics._width, borderMetrics._y + fillSize);
					ctx.lineTo(borderMetrics._x, borderMetrics._y + fillSize);
					ctx.closePath();
				}
				else //if (fillStart == "right")
				{
					ctx.moveTo(borderMetrics._x + borderMetrics._width - fillSize, borderMetrics._y);
					ctx.lineTo(borderMetrics._x + borderMetrics._width, borderMetrics._y);
					ctx.lineTo(borderMetrics._x + borderMetrics._width, borderMetrics._y + borderMetrics._height);
					ctx.lineTo(borderMetrics._x + borderMetrics._width - fillSize, borderMetrics._y + borderMetrics._height);
					ctx.closePath();
				}
		
				ctx.clip();
				
				ctx.beginPath();
				this._drawBackgroundShape(ctx, borderMetrics);
				this._progressFill.drawFill(ctx, borderMetrics);
				
				ctx.restore();
			}
		}
		else
		{
			ctx.beginPath();
			this._drawBackgroundShape(ctx, borderMetrics);
			this._progressFill.drawFill(ctx, borderMetrics);
		}
	};
	
	