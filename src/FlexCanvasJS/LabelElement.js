
/**
 * @depends CanvasElement.js
 */

/////////////////////////////////////////////////////////
/////////////////LabelElement////////////////////////////	
	
/**
 * @class LabelElement
 * @inherits CanvasElement
 * 
 * Basic label for rendering single line style-able text. 
 * Can be styled to automatically truncate text to fit the available 
 * space with a supplied string like ellipses "...".
 * 
 * 
 * @constructor LabelElement 
 * Creates new LabelElement instance.
 */
function LabelElement()
{
	LabelElement.base.prototype.constructor.call(this);
	
	this._textWidth = null;
	this._textHeight = null;
	this._truncateStringWidth = null;
}

//Inherit from CanvasElement
LabelElement.prototype = Object.create(CanvasElement.prototype);
LabelElement.prototype.constructor = LabelElement;
LabelElement.base = CanvasElement;

/////////////Style Types///////////////////////////////

LabelElement._StyleTypes = Object.create(null);

/**
 * @style Text String
 * Text to be rendered by the Label.
 */
LabelElement._StyleTypes.Text = 				{inheritable:false};		// "any string" || null

/**
 * @style TruncateToFit String
 * String to use when truncating a label that does not fit the available area. Defaults to "...".
 */
LabelElement._StyleTypes.TruncateToFit = 		{inheritable:false};		// null || "string" ("...")


////////////Default Styles////////////////////////////

LabelElement.StyleDefault = new StyleDefinition();

//Override base class styles
LabelElement.StyleDefault.setStyle("PaddingTop",					2);
LabelElement.StyleDefault.setStyle("PaddingBottom",					2);
LabelElement.StyleDefault.setStyle("PaddingLeft",					2);
LabelElement.StyleDefault.setStyle("PaddingRight",					2);

//LabelElement specific styles
LabelElement.StyleDefault.setStyle("Text", 							null);
LabelElement.StyleDefault.setStyle("TruncateToFit", 				"...");


/////////////LabelElement Internal Functions///////////////////

//@Override
LabelElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		LabelElement.base.prototype._doStylesUpdated.call(this, stylesMap);
	
		if ("TextStyle" in stylesMap ||
			"TextFont" in stylesMap ||
			"TextSize" in stylesMap ||
			"Text" in stylesMap ||
			"TextLinePaddingTop" in stylesMap || 
			"TextLinePaddingBottom" in stylesMap)
		{
			this._textWidth = null;
			this._textHeight = null;
			
			this._invalidateMeasure();
			this._invalidateRender();
		}
		
		if ("TruncateToFit" in stylesMap)
		{
			this._truncateStringWidth = null;
			
			this._invalidateRender();
		}
		
		if ("TextHorizontalAlign" in stylesMap ||
			"TextVerticalAlign" in stylesMap ||
			"TextColor" in stylesMap ||
			"TextFillType" in stylesMap)
		{
			this._invalidateRender();
		}
	};	
	
//@Override
LabelElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		if (this._textWidth == null || this._textHeight == null)
		{
			var measureText = this.getStyle("Text");
			if (measureText == null)
				measureText = "";
		
			this._textHeight = this.getStyle("TextSize") + this.getStyle("TextLinePaddingTop") + this.getStyle("TextLinePaddingBottom");
			this._textWidth = CanvasElement._measureText(measureText, this._getFontString());
		}
		
		return {width:this._textWidth + padWidth, height:this._textHeight + padHeight};
	};	

//@override
LabelElement.prototype._doRender = 
	function ()
	{
		LabelElement.base.prototype._doRender.call(this);
		
		var text = this.getStyle("Text");
		if (text == null || text.length == 0)
			return;
		
		var ctx = this._getGraphicsCtx();
		var paddingMetrics = this._getPaddingMetrics();
		
		//For convienence
		var x = paddingMetrics.getX();
		var y = paddingMetrics.getY();
		var w = paddingMetrics.getWidth();
		var h = paddingMetrics.getHeight();
		
		var fontString = this._getFontString();
		var totalWidth =  this._textWidth;
		
		//Truncate if necessary
		if (totalWidth > w)
		{
			var truncateString = this.getStyle("TruncateToFit");
			
			//Get number of truncate chars
			var numTruncateChars = 0;
			if (truncateString != null)
				numTruncateChars = truncateString.length;
			
			//Get truncate chars width
			if (this._truncateStringWidth == null)
			{
				if (truncateString == null)
					this._truncateStringWidth = 0;
				else
					this._truncateStringWidth = CanvasElement._measureText(truncateString, fontString);
			}
			
			var charWidth = 0;
			var numTextChars = text.length;
			totalWidth = this._textWidth + this._truncateStringWidth;
			
			//Remove text characters until we fit or run out.
			while (numTextChars > 0 && totalWidth > w)
			{
				charWidth = CanvasElement._measureText(text[numTextChars - 1], fontString);
				
				numTextChars--;
				totalWidth -= charWidth;
			}
			
			//Remove truncate characters until we fit or run out
			while (numTruncateChars > 0 && totalWidth > w)
			{
				charWidth = CanvasElement._measureText(truncateString[numTruncateChars - 1], fontString);
				
				numTruncateChars--;
				totalWidth -= charWidth;
			}
			
			text = text.substring(0, numTextChars) + truncateString.substring(0, numTruncateChars);
		}
		
		var linePaddingTop = this.getStyle("TextLinePaddingTop");
		var linePaddingBottom = this.getStyle("TextLinePaddingBottom");
		
		var textBaseline = this.getStyle("TextVerticalAlign");
		var textAlign = this.getStyle("TextHorizontalAlign");
		var textFillType = this.getStyle("TextFillType");
		var textColor = this.getStyle("TextColor");
		
		//Get x position
		var textXPosition;
		if (textAlign == "left")
			textXPosition = x;
		else if (textAlign == "right")
			textXPosition = x + w - totalWidth;
		else //center
			textXPosition = Math.round(x + (w / 2) - (totalWidth / 2));
		
		//Get y position
		var textYPosition;
		if (textBaseline == "top")
			textYPosition = y + linePaddingTop;
		else if (textBaseline == "bottom")
			textYPosition = y + h - linePaddingBottom;
		else //middle
			textYPosition = Math.round(y + (h / 2) + (linePaddingTop / 2) - (linePaddingBottom / 2));
		
		//Render text
		if (textFillType == "stroke")
			CanvasElement._strokeText(ctx, text, textXPosition, textYPosition, fontString, textColor, textBaseline);
		else
			CanvasElement._fillText(ctx, text, textXPosition, textYPosition, fontString, textColor, textBaseline);
	};
	
	
	