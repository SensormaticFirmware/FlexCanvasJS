
/**
 * @depends ToggleButtonElement.js
 * @depends RadioButtonSkinElement.js
 * @depends EllipseShape.js
 */

///////////////////////////////////////////////////////////////////////
/////////////////////RadioButtonElement////////////////////////////////

/**
 * @class RadioButtonElement
 * @inherits ToggleButtonElement
 * 
 * RadioButton is a skinned ToggleButton that adjusts the placement of the skin and label. 
 * ToggleButtonGroup may be used to group radio buttons so only 1 may be selected at a time.
 * 
 * When a label is in use, the skin is placed next to the label rather than underneath and is assumed to be square. 
 * When a label is not in use, the skin will span the entire bounding box.
 * 
 * Being a SkinnableElement, RadioButton proxies its styles to its skins. 
 * You may assign custom skins and assign any styles you wish to apply to all skins to the RadioButton itself. 
 * 
 * See the default skin RadioButtonSkinElement for additional skin styles.
 * 
 * @seealso RadioButtonSkinElement
 * @seealso ToggleButtonGroup
 * 
 * 
 * @constructor RadioButtonElement 
 * Creates new RadioButtonElement instance.
 */
function RadioButtonElement()
{
	RadioButtonElement.base.prototype.constructor.call(this);
}

//Inherit from ToggleButtonElement
RadioButtonElement.prototype = Object.create(ToggleButtonElement.prototype);
RadioButtonElement.prototype.constructor = RadioButtonElement;
RadioButtonElement.base = ToggleButtonElement;	


/////////////Style Types///////////////////////////////

RadioButtonElement._StyleTypes = Object.create(null);

//New RadioButtonElement specific styles

/**
 * @style LabelPlacement String
 * 
 * Determines if the label should be placed to the left or right of the skin. 
 * Allowable values are "left" or "right".
 */
RadioButtonElement._StyleTypes.LabelPlacement =						StyleableBase.EStyleType.NORMAL;		// "left" || "right"

/**
 * @style LabelGap Number
 * 
 * Determines distance in pixels the label should be placed from the skin.
 */
RadioButtonElement._StyleTypes.LabelGap =							StyleableBase.EStyleType.NORMAL;		// number



////////////Default Styles//////////////////////

RadioButtonElement.StyleDefault = new StyleDefinition();

//New RadioButton styles
RadioButtonElement.StyleDefault.setStyle("LabelPlacement", 						"right");
RadioButtonElement.StyleDefault.setStyle("LabelGap", 							5);

//Override base class styles
RadioButtonElement.StyleDefault.setStyle("AllowDeselect", 						false);

RadioButtonElement.StyleDefault.setStyle("PaddingTop",                          0);
RadioButtonElement.StyleDefault.setStyle("PaddingBottom",                       0);
RadioButtonElement.StyleDefault.setStyle("PaddingLeft",                         0);
RadioButtonElement.StyleDefault.setStyle("PaddingRight",                        0);

RadioButtonElement.StyleDefault.setStyle("TextHorizontalAlign", 				"left");
RadioButtonElement.StyleDefault.setStyle("TextVerticalAlign", 					"middle");

RadioButtonElement.StyleDefault.setStyle("SkinClass", 							RadioButtonSkinElement); //Not necessary, just for completeness

RadioButtonElement.StyleDefault.setStyle("UpSkinClass", 						RadioButtonSkinElement);
RadioButtonElement.StyleDefault.setStyle("OverSkinClass", 						RadioButtonSkinElement);
RadioButtonElement.StyleDefault.setStyle("DownSkinClass", 						RadioButtonSkinElement);
RadioButtonElement.StyleDefault.setStyle("DisabledSkinClass", 					RadioButtonSkinElement);

RadioButtonElement.StyleDefault.setStyle("SelectedUpSkinClass", 				RadioButtonSkinElement);
RadioButtonElement.StyleDefault.setStyle("SelectedOverSkinClass", 				RadioButtonSkinElement);
RadioButtonElement.StyleDefault.setStyle("SelectedDownSkinClass", 				RadioButtonSkinElement);
RadioButtonElement.StyleDefault.setStyle("SelectedDisabledSkinClass", 			RadioButtonSkinElement);


//Skin Defaults
RadioButtonElement.UpSkinStyleDefault = new StyleDefinition();

RadioButtonElement.UpSkinStyleDefault.setStyle("BackgroundShape",				new EllipseShape());
RadioButtonElement.UpSkinStyleDefault.setStyle("BorderType", 					"solid");
RadioButtonElement.UpSkinStyleDefault.setStyle("BorderThickness", 				1);
RadioButtonElement.UpSkinStyleDefault.setStyle("BorderColor", 					"#333333");
RadioButtonElement.UpSkinStyleDefault.setStyle("BackgroundColor", 				"#EBEBEB");
RadioButtonElement.UpSkinStyleDefault.setStyle("AutoGradientType", 				"linear");
RadioButtonElement.UpSkinStyleDefault.setStyle("AutoGradientStart", 			(+.05));
RadioButtonElement.UpSkinStyleDefault.setStyle("AutoGradientStop", 				(-.05));
RadioButtonElement.UpSkinStyleDefault.setStyle("CheckColor", 					"#000000");

RadioButtonElement.OverSkinStyleDefault = new StyleDefinition();

RadioButtonElement.OverSkinStyleDefault.setStyle("BackgroundShape",				new EllipseShape());
RadioButtonElement.OverSkinStyleDefault.setStyle("BorderType", 					"solid");
RadioButtonElement.OverSkinStyleDefault.setStyle("BorderThickness", 			1);
RadioButtonElement.OverSkinStyleDefault.setStyle("BorderColor", 				"#333333");
RadioButtonElement.OverSkinStyleDefault.setStyle("BackgroundColor", 			"#DDDDDD");
RadioButtonElement.OverSkinStyleDefault.setStyle("AutoGradientType", 			"linear");
RadioButtonElement.OverSkinStyleDefault.setStyle("AutoGradientStart", 			(+.05));
RadioButtonElement.OverSkinStyleDefault.setStyle("AutoGradientStop", 			(-.05));
RadioButtonElement.OverSkinStyleDefault.setStyle("CheckColor", 					"#000000");

RadioButtonElement.DownSkinStyleDefault = new StyleDefinition();

RadioButtonElement.DownSkinStyleDefault.setStyle("BackgroundShape",				new EllipseShape());
RadioButtonElement.DownSkinStyleDefault.setStyle("BorderType", 					"solid");
RadioButtonElement.DownSkinStyleDefault.setStyle("BorderThickness", 			1);
RadioButtonElement.DownSkinStyleDefault.setStyle("BorderColor", 				"#333333");
RadioButtonElement.DownSkinStyleDefault.setStyle("BackgroundColor", 			"#CCCCCC");
RadioButtonElement.DownSkinStyleDefault.setStyle("AutoGradientType", 			"linear");
RadioButtonElement.DownSkinStyleDefault.setStyle("AutoGradientStart", 			(-.06));
RadioButtonElement.DownSkinStyleDefault.setStyle("AutoGradientStop", 			(+.02));
RadioButtonElement.DownSkinStyleDefault.setStyle("CheckColor", 					"#000000");

RadioButtonElement.DisabledSkinStyleDefault = new StyleDefinition();

RadioButtonElement.DisabledSkinStyleDefault.setStyle("BackgroundShape",			new EllipseShape());
RadioButtonElement.DisabledSkinStyleDefault.setStyle("BorderType", 				"solid");
RadioButtonElement.DisabledSkinStyleDefault.setStyle("BorderThickness", 		1);
RadioButtonElement.DisabledSkinStyleDefault.setStyle("BorderColor", 			"#999999");
RadioButtonElement.DisabledSkinStyleDefault.setStyle("BackgroundColor", 		"#ECECEC");
RadioButtonElement.DisabledSkinStyleDefault.setStyle("AutoGradientType", 		"linear");
RadioButtonElement.DisabledSkinStyleDefault.setStyle("AutoGradientStart", 		(+.05));
RadioButtonElement.DisabledSkinStyleDefault.setStyle("AutoGradientStop", 		(-.05));
RadioButtonElement.DisabledSkinStyleDefault.setStyle("CheckColor", 				"#777777");

//Apply Skin Defaults
RadioButtonElement.StyleDefault.setStyle("UpSkinStyle", 						RadioButtonElement.UpSkinStyleDefault);
RadioButtonElement.StyleDefault.setStyle("OverSkinStyle", 						RadioButtonElement.OverSkinStyleDefault);
RadioButtonElement.StyleDefault.setStyle("DownSkinStyle", 						RadioButtonElement.DownSkinStyleDefault);
RadioButtonElement.StyleDefault.setStyle("DisabledSkinStyle", 					RadioButtonElement.DisabledSkinStyleDefault);

RadioButtonElement.StyleDefault.setStyle("SelectedUpSkinStyle", 				RadioButtonElement.UpSkinStyleDefault);
RadioButtonElement.StyleDefault.setStyle("SelectedOverSkinStyle", 				RadioButtonElement.OverSkinStyleDefault);
RadioButtonElement.StyleDefault.setStyle("SelectedDownSkinStyle", 				RadioButtonElement.DownSkinStyleDefault);
RadioButtonElement.StyleDefault.setStyle("SelectedDisabledSkinStyle", 			RadioButtonElement.DisabledSkinStyleDefault);


/////////////Internal Functions/////////////////////	

//@override
RadioButtonElement.prototype._doStylesUpdated = 
	function (stylesMap)
	{
		RadioButtonElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("LabelGap" in stylesMap)
		{
			this._invalidateMeasure();
			this._invalidateLayout();
		}
		else if ("LabelPlacement" in stylesMap)
			this._invalidateLayout();
	};

//@override
RadioButtonElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		var measuredSize = {width: padWidth, height: padHeight};
	
		if (this._labelElement != null)
		{
			var labelWidth = this._labelElement._getStyledOrMeasuredWidth();
			var labelHeight = this._labelElement._getStyledOrMeasuredHeight();
			
			measuredSize.height = padHeight + labelHeight;
			measuredSize.width = measuredSize.height + padWidth + labelWidth + this.getStyle("LabelGap");
		}
		else
		{
		    measuredSize.height = padHeight + 14;
		    measuredSize.width = padWidth + 14;
		}
		
		return measuredSize;
	};

//@override	
RadioButtonElement.prototype._doLayout = 
	function (paddingMetrics)
	{
		if (this._labelElement != null)
		{
			var labelPlacement = this.getStyle("LabelPlacement");
			var labelGap = this.getStyle("LabelGap");
			
			for (var prop in this._skins)
			{
				this._skins[prop]._setActualSize(this._height, this._height);
				
				if (labelPlacement == "left")
					this._skins[prop]._setActualPosition(this._width - this._height, 0);
				else
					this._skins[prop]._setActualPosition(0, 0);
			}
			
			if (labelPlacement == "left")
				this._labelElement._setActualPosition(paddingMetrics.getX(), paddingMetrics.getY());
			else
				this._labelElement._setActualPosition(this._height + labelGap + paddingMetrics.getX(), paddingMetrics.getY());
			
			this._labelElement._setActualSize(paddingMetrics.getWidth() - labelGap - this._height, paddingMetrics.getHeight());
		}
		else
		{
			for (var prop in this._skins)
			{
				this._skins[prop]._setActualSize(this._width, this._height);
				this._skins[prop]._setActualPosition(0, 0);
			}
		}
	};	

