
/**
 * @depends CanvasElement.js
 */

/////////////////////////////////////////////////////////
/////////////////TextElement/////////////////////////////	
	
/**
 * @class TextElement
 * @inherits CanvasElement
 * 
 * Renders mutli-line style-able select-able text. 
 * TextElement respects newline characters and will
 * wrap text when width is constrained. If only a single
 * line of text is needed, you should use LabelElement.
 * 
 * @constructor TextElement 
 * Creates new TextElement instance.
 */
function TextElement()
{
	TextElement.base.prototype.constructor.call(this);
	
	this._textField = new TextFieldElement();
	this._textField.setStyle("Multiline", true);
	this._textField.setStyle("Cursor", null);
	this._textField.setStyle("TabStop", -1);
	this._addChild(this._textField);
}

//Inherit from CanvasElement
TextElement.prototype = Object.create(CanvasElement.prototype);
TextElement.prototype.constructor = TextElement;
TextElement.base = CanvasElement;

/////////////Style Types///////////////////////////////

TextElement._StyleTypes = Object.create(null);

/**
 * @style Text String
 * Text to be rendered by the TextElement.
 */
TextElement._StyleTypes.Text = 				{inheritable:false};		// "any string" || null

/**
 * @style Selectable boolean
 * When true, text can be highlighted and copied.
 */
TextElement._StyleTypes.Selectable = 			{inheritable:false};		// true || false


////////////Default Styles////////////////////////////

TextElement.StyleDefault = new StyleDefinition();

//Override base class styles
TextElement.StyleDefault.setStyle("PaddingTop", 					2);
TextElement.StyleDefault.setStyle("PaddingBottom", 					2);
TextElement.StyleDefault.setStyle("PaddingLeft", 					2);
TextElement.StyleDefault.setStyle("PaddingRight", 					2);

//TextElement specific styles
TextElement.StyleDefault.setStyle("Text", 							null);
TextElement.StyleDefault.setStyle("Selectable", 					false);


/////////////Internal Functions///////////////////

//@Override
TextElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		TextElement.base.prototype._doStylesUpdated.call(this, stylesMap);
	
		if ("Text" in stylesMap)
			this._textField.setText(this.getStyle("Text"));
		
		if ("Selectable" in stylesMap)
			this._textField.setStyle("Selectable", this.getStyle("Selectable"));
		
		//Proxy padding to TextField for proper mouse handling
		if ("Padding" in stylesMap ||
			"PaddingTop" in stylesMap ||
			"PaddingBottom" in stylesMap ||
			"PaddingLeft" in stylesMap ||
			"PaddingRight" in stylesMap)
		{
			var paddingSize = this._getPaddingSize();
			
			this._textField.setStyle("PaddingTop", paddingSize.paddingTop);
			this._textField.setStyle("PaddingBottom", paddingSize.paddingBottom);
			this._textField.setStyle("PaddingLeft", paddingSize.paddingLeft);
			this._textField.setStyle("PaddingRight", paddingSize.paddingRight);
		}
	};
	
//@Override
TextElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		//Ignore padding, proxied to TextField
		return {width:this._textField._measuredWidth, height:this._textField._measuredHeight};
	};	

//@Override	
TextElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		TextElement.base.prototype._doLayout.call(this, paddingMetrics);
		
		//Ignore padding, proxied to TextField for mouse handling.
		this._textField._setActualPosition(0, 0);
		this._textField._setActualSize(this._width, this._height);
	};
