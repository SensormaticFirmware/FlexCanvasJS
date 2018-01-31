

function ControlStyleType(category, styleName, styleType, allowNull, initNull, styleDefinition, parent, initValue, allowValues)
{
	this.category = category;
	this.styleName = styleName;
	this.styleType = styleType;
	this.allowNull = allowNull;
	this.initNull = initNull,
	this.initValue = initValue;
	this.allowValues = allowValues;
	
	this.styleDefinition = styleDefinition; //Definition, this value is stored (bound to control)
	this.parent = parent;	
	
	//Populated by StyleItem renderers.
	this.styleListCodeString = "";
	this.styleItemCodeString = "";
	
	this.styleList = new ListCollection(); 
	
	//Set static CollectionSort
	if (ControlStyleType.StyleCategoryNameSort == null)
		ControlStyleType.StyleCategoryNameSort = new CollectionSort(ControlStyleType.StyleCategoryNameSortFunction, false);
	
	this.styleList.setCollectionSort(ControlStyleType.StyleCategoryNameSort);
}

ControlStyleType.prototype.constructor = ControlStyleType; 

//////STATIC/////////////////

ControlStyleType.StyleCategoryNameSortFunction = 
	function (objA, objB)
	{
		if (objA.category < objB.category)
			return -1;
		if (objA.category > objB.category)
			return 1;
		
		if (objA.styleName < objB.styleName)
			return -1;
		if (objA.styleName > objB.styleName)
			return 1;
		
		return 0;
	};
	
ControlStyleType.StyleCategoryNameSort = null; //Set via constructor (avoid file ordering dependencies)

ControlStyleType._GenerateStylingCodeRecurse = 
	function (resultArray, controlStyleType, parentData)
	{
		if (controlStyleType.styleListCodeString != "")
		{
			var newData = {value:controlStyleType.styleListCodeString};
			for (var i = 0; i < controlStyleType.styleList.getLength(); i++)
			{
				ControlStyleType._GenerateStylingCodeRecurse(resultArray, controlStyleType.styleList.getItemAt(i), newData);
			}
			
			resultArray.push(newData);
		}
		
		if (parentData != null && controlStyleType.styleItemCodeString != "")
			parentData.value += controlStyleType.styleItemCodeString;
	};

//////PUBLIC//////////////////

ControlStyleType.prototype.hasParentStyleName = 
	function (styleName)
	{
		var parent = this.parent;
		while (parent != null)
		{
			if (parent.styleName == styleName)
				return true;
			
			parent = parent.parent;
		}
		
		return false;
	};
	
ControlStyleType.prototype.generateStylingCode = 
	function ()
	{
		var result = [];
		ControlStyleType._GenerateStylingCodeRecurse(result, this, null);
		
		var stringResult = "";
		for (var i = 0; i < result.length; i++)
			stringResult += (result[i].value + "\n");

		return stringResult;
	};	
	
ControlStyleType.prototype.buildControlStyleTypeLists = 
	function ()
	{
		var styleDef;
		if (this.styleType == "root")
			styleDef = this.styleDefinition.getStyleDefinitionAt(0); //Root control definition
		else
			styleDef = this.styleDefinition.getStyle(this.styleName); //Sub style definition
		
		this.styleList.clear();
		
		//This style selection does not support sub styles.
		if (styleDef instanceof StyleDefinition == true)
		{
//			CanvasElement.StyleDefault.setStyle("TextLineSpacing", 					0);
			
			if (this.styleType == "root") //Container styles (Root only)
			{
				this.styleList.addItem(new ControlStyleType("Container", 	"Top", 										"number", 	true, 	true, 	styleDef, this,	10, 						null));
				this.styleList.addItem(new ControlStyleType("Container", 	"Bottom", 									"number", 	true, 	true, 	styleDef, this,	10, 						null));
				this.styleList.addItem(new ControlStyleType("Container", 	"Left", 									"number", 	true, 	true, 	styleDef, this,	10, 						null));
				this.styleList.addItem(new ControlStyleType("Container", 	"Right", 									"number", 	true, 	true, 	styleDef, this,	10, 						null));
				this.styleList.addItem(new ControlStyleType("Container", 	"X", 										"number", 	true, 	true, 	styleDef, this,	10, 						null));
				this.styleList.addItem(new ControlStyleType("Container", 	"Y", 										"number", 	true, 	true, 	styleDef, this,	10, 						null));
				this.styleList.addItem(new ControlStyleType("Container", 	"HorizontalCenter", 						"number", 	true, 	true, 	styleDef, this,	0, 							null));
				this.styleList.addItem(new ControlStyleType("Container", 	"VerticalCenter", 							"number", 	true, 	true, 	styleDef, this,	0, 							null));
				this.styleList.addItem(new ControlStyleType("Container", 	"RotateDegrees", 							"number", 	false, 	false, 	styleDef, this,	0, 							null));
				this.styleList.addItem(new ControlStyleType("Container", 	"RotateCenterY", 							"number", 	true, 	true, 	styleDef, this,	50, 						null));
				this.styleList.addItem(new ControlStyleType("Container", 	"RotateCenterY", 							"number", 	true, 	true, 	styleDef, this,	50, 						null));
				
				this.styleList.addItem(new ControlStyleType("Rendering", 	"ShadowSize", 								"number", 	false, 	false, 	styleDef, this,	0,							null));
				this.styleList.addItem(new ControlStyleType("Rendering", 	"ShadowOffsetX", 							"number", 	false, 	false, 	styleDef, this,	0,							null));
				this.styleList.addItem(new ControlStyleType("Rendering", 	"ShadowOffsetY", 							"number", 	false, 	false, 	styleDef, this,	0, 							null));
				this.styleList.addItem(new ControlStyleType("Rendering", 	"ShadowColor", 								"color", 	false, 	false, 	styleDef, this,	"#000000",					null));
				this.styleList.addItem(new ControlStyleType("Rendering", 	"BackgroundShape", 							"class", 	true, 	true,	styleDef, this, RoundedRectangleShape,		[{label:"RoundedRectangle", value:RoundedRectangleShape}, {label:"Arrow", value:ArrowShape}, {label:"Ellipse", value:EllipseShape}]));
				
				this.styleList.addItem(new ControlStyleType("Functional", 	"Draggable", 								"bool", 	false, 	false, 	styleDef, this, false,						[{label:"true", value:true}, {label:"false", value:false}]));
			}
			
			//ListContainer Styles
			if (this.styleType == "root" ||
				this.styleName == "ScrollButtonIncrementStyle" || 
				this.styleName == "ScrollButtonDecrementStyle" ||
				this.styleName == "ButtonTrackStyle" || 
				this.styleName == "ButtonTabStyle")
			{
				this.styleList.addItem(new ControlStyleType("Functional", 	"Cursor", 									"string", 	true, 	true, 	styleDef, this, false,						[{label:"pointer", value:"pointer"}, {label:"text", value:"text"}, {label:"none", value:"none"}]));
				
				this.styleList.addItem(new ControlStyleType("Container", 	"Width", 									"number", 	true, 	true, 	styleDef, this,	50, 						null));
				this.styleList.addItem(new ControlStyleType("Container", 	"Height", 									"number", 	true, 	true, 	styleDef, this,	50, 						null));
				this.styleList.addItem(new ControlStyleType("Container", 	"PercentWidth", 							"number", 	true, 	true, 	styleDef, this,	50, 						null));
				this.styleList.addItem(new ControlStyleType("Container", 	"PercentHeight", 							"number", 	true, 	true, 	styleDef, this,	50, 						null));
				this.styleList.addItem(new ControlStyleType("Container", 	"MinWidth", 								"number", 	true, 	true, 	styleDef, this,	50, 						null));
				this.styleList.addItem(new ControlStyleType("Container", 	"MinHeight", 								"number", 	true, 	true, 	styleDef, this,	50, 						null));
				this.styleList.addItem(new ControlStyleType("Container", 	"MaxWidth", 								"number", 	true, 	true, 	styleDef, this,	50, 						null));
				this.styleList.addItem(new ControlStyleType("Container", 	"MaxHeight", 								"number", 	true, 	true, 	styleDef, this,	50, 						null));
			}
			
			if (this.styleType == "root" || 
				this.styleName == "ScrollButtonIncrementStyle" || 
				this.styleName == "ScrollButtonDecrementStyle" ||
				this.styleName == "ButtonTrackStyle" || 
				this.styleName == "ButtonTabStyle" ||
				this.styleName.indexOf("SkinStyle") >= 0) 
			{
				this.styleList.addItem(new ControlStyleType("Functional", 	"Visible", 									"bool", 	false, 	false, 	styleDef, this,	true,						[{label:"true", value:true}, {label:"false", value:false}]));
				
				this.styleList.addItem(new ControlStyleType("Rendering", 	"Alpha", 									"number", 	false, 	false, 	styleDef, this,	.5,							null));
				this.styleList.addItem(new ControlStyleType("Rendering", 	"BackgroundColor", 							"color", 	true, 	false,	styleDef, this, "#FFFFFF",					null));
				this.styleList.addItem(new ControlStyleType("Rendering", 	"BorderType", 								"string", 	true, 	false, 	styleDef, this,	"solid",					[{label:"solid", value:"solid"}, {label:"inset", value:"inset"}, {label:"outset", value:"outset"}]));
				this.styleList.addItem(new ControlStyleType("Rendering", 	"BorderColor", 								"color", 	true, 	false,	styleDef, this, "#000000",					null));
				this.styleList.addItem(new ControlStyleType("Rendering", 	"BorderThickness", 							"number", 	false, 	false, 	styleDef, this,	1,							null));
				this.styleList.addItem(new ControlStyleType("Rendering", 	"AutoGradientType", 						"string", 	true, 	false, 	styleDef, this,	"linear",					[{label:"linear", value:"linear"}, {label:"radial", value:"radial"}]));
				this.styleList.addItem(new ControlStyleType("Rendering", 	"AutoGradientStart", 						"number", 	false, 	false, 	styleDef, this,	(+.05),						null));
				this.styleList.addItem(new ControlStyleType("Rendering", 	"AutoGradientStop", 						"number", 	false, 	false, 	styleDef, this,	(-.05),						null));
			}
			
			if (this.styleName == "LabelStyle" || 
				this.styleName == "TextInputStyle" ||
				this.styleName == "ButtonStyle" || 
				this.styleName == "ToggleButtonStyle" ||
				this.styleName == "RadioButtonStyle" ||
				this.styleName == "CheckboxStyle" ||
				this.styleName == "ScrollButtonIncrementStyle" || 
				this.styleName == "ScrollButtonDecrementStyle" ||
				this.styleName == "ButtonTrackStyle" || 
				this.styleName == "ButtonTabStyle" ||
				this.styleName == "DataListStyle" ||
				this.styleName == "ListItemStyle")
			{
				this.styleList.addItem(new ControlStyleType("Text", 		"TextColor", 								"color", 	false, 	false, 	styleDef, this,	"#000000",					null));
				this.styleList.addItem(new ControlStyleType("Text", 		"TextStyle", 								"string", 	false, 	false, 	styleDef, this,	"normal",					[{label:"normal", value:"normal"}, {label:"bold", value:"bold"}, {label:"italic", value:"italic"}, {label:"bold italic", value:"bold italic"}]));
				this.styleList.addItem(new ControlStyleType("Text", 		"TextFont", 								"string", 	false, 	false, 	styleDef, this,	"Arial",					[{label:"Arial", value:"Arial"}, {label:"Times New Roman", value:"Times New Roman"}, {label:"Comic Sans MS", value:"Comic Sans MS"}, {label:"Verdana", value:"Verdana"}, {label:"Roboto (Google)", value:"Roboto"}]));
				this.styleList.addItem(new ControlStyleType("Text", 		"TextSize", 								"number", 	false, 	false, 	styleDef, this,	12,							null));
				this.styleList.addItem(new ControlStyleType("Text", 		"TextHorizontalAlign", 						"string", 	false, 	false, 	styleDef, this,	"center",					[{label:"left", value:"left"}, {label:"center", value:"center"}, {label:"right", value:"right"}]));
				this.styleList.addItem(new ControlStyleType("Text", 		"TextVerticalAlign", 						"string", 	false, 	false, 	styleDef, this,	"middle",					[{label:"top", value:"top"}, {label:"middle", value:"middle"}, {label:"bottom", value:"bottom"}]));
				this.styleList.addItem(new ControlStyleType("Text", 		"TextLinePaddingTop", 						"number", 	false, 	false, 	styleDef, this,	1,							null));
				this.styleList.addItem(new ControlStyleType("Text", 		"TextLinePaddingBottom", 					"number", 	false, 	false, 	styleDef, this,	1,							null));
				this.styleList.addItem(new ControlStyleType("Text", 		"TextFillType", 							"string", 	false, 	false, 	styleDef, this,	"fill",						[{label:"fill", value:"fill"}, {label:"stroke", value:"stroke"}]));
			}
			
			if (this.styleName == "LabelStyle" || 
				this.styleName == "TextInputStyle" ||
				this.styleName == "ButtonStyle" || 
				this.styleName == "ToggleButtonStyle" ||
				this.styleName == "RadioButtonStyle" ||
				this.styleName == "CheckboxStyle" ||
				this.styleName == "ScrollBarStyle" ||
				this.styleName == "ScrollButtonIncrementStyle" || 
				this.styleName == "ScrollButtonDecrementStyle" ||
				this.styleName == "ButtonTrackStyle" || 
				this.styleName == "ButtonTabStyle" ||
				this.styleName == "ListItemStyle" ||
				this.styleName == "DataListStyle")
			{
				this.styleList.addItem(new ControlStyleType("Layout", 		"Padding", 									"number", 	false, 	false, 	styleDef, this,	2,							null));
				this.styleList.addItem(new ControlStyleType("Layout", 		"PaddingTop", 								"number", 	false, 	false, 	styleDef, this,	2,							null));
				this.styleList.addItem(new ControlStyleType("Layout", 		"PaddingBottom", 							"number", 	false, 	false, 	styleDef, this,	2,							null));
				this.styleList.addItem(new ControlStyleType("Layout", 		"PaddingRight", 							"number", 	false, 	false, 	styleDef, this,	2,							null));
				this.styleList.addItem(new ControlStyleType("Layout", 		"PaddingLeft", 								"number", 	false, 	false, 	styleDef, this,	2,							null));
			}
			
			if (this.styleName == "LabelStyle" || 
				this.styleName == "ButtonStyle" || 
				this.styleName == "ToggleButtonStyle" ||
				this.styleName == "RadioButtonStyle" ||
				this.styleName == "CheckboxStyle" ||
				this.styleName == "ScrollButtonIncrementStyle" || 
				this.styleName == "ScrollButtonDecrementStyle" ||
				this.styleName == "ButtonTrackStyle" || 
				this.styleName == "ButtonTabStyle")
			{
				this.styleList.addItem(new ControlStyleType("Functional", 	"Text", 									"string", 	true, 	false, 	styleDef, this, "My Text",					null));
			}
			
			if (this.styleName == "TextInputStyle" ||
				this.styleName == "ButtonStyle" || 
				this.styleName == "ToggleButtonStyle" ||
				this.styleName == "RadioButtonStyle" ||
				this.styleName == "CheckboxStyle" ||
				this.styleName == "ScrollBarStyle" ||
				this.styleName == "ScrollButtonIncrementStyle" || 
				this.styleName == "ScrollButtonDecrementStyle" ||
				this.styleName == "ButtonTrackStyle" || 
				this.styleName == "ButtonTabStyle")
			{
				this.styleList.addItem(new ControlStyleType("Functional", 	"Enabled", 									"bool", 	false, 	false, 	styleDef, this,	true,						[{label:"true", value:true}, {label:"false", value:false}]));
			}
			
			if (this.styleName == "ButtonStyle" || 
				this.styleName == "ToggleButtonStyle" ||
				this.styleName == "RadioButtonStyle" ||
				this.styleName == "CheckboxStyle" ||
				this.styleName == "ScrollButtonIncrementStyle" || 
				this.styleName == "ScrollButtonDecrementStyle" ||
				this.styleName == "ButtonTrackStyle" || 
				this.styleName == "ButtonTabStyle" || 
				this.styleName == "TextInputStyle" ||
				this.styleName == "ListItemStyle")
			{
				this.styleList.addItem(new ControlStyleType("Text", 		"UpTextColor", 								"color", 	false, 	false, 	styleDef, this,	"#000000",					null));
				this.styleList.addItem(new ControlStyleType("Sub Styles", 	"UpSkinStyle", 								"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
			}
			
			if (this.styleName == "ButtonStyle" || 
				this.styleName == "ToggleButtonStyle" ||
				this.styleName == "RadioButtonStyle" ||
				this.styleName == "CheckboxStyle" ||
				this.styleName == "ScrollButtonIncrementStyle" || 
				this.styleName == "ScrollButtonDecrementStyle" ||
				this.styleName == "ButtonTrackStyle" || 
				this.styleName == "ButtonTabStyle" || 
				this.styleName == "TextInputStyle")
			{
				this.styleList.addItem(new ControlStyleType("Text", 		"DisabledTextColor", 						"color", 	false, 	false, 	styleDef, this,	"#000000",					null));
				this.styleList.addItem(new ControlStyleType("Sub Styles", 	"DisabledSkinStyle", 						"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
			}
			
			if (this.styleName == "ButtonStyle" || 
				this.styleName == "ToggleButtonStyle" ||
				this.styleName == "RadioButtonStyle" ||
				this.styleName == "CheckboxStyle" ||
				this.styleName == "ScrollButtonIncrementStyle" || 
				this.styleName == "ScrollButtonDecrementStyle" ||
				this.styleName == "ButtonTrackStyle" || 
				this.styleName == "ButtonTabStyle" ||
				this.styleName == "ListItemStyle")
			{
				this.styleList.addItem(new ControlStyleType("Sub Styles", 	"OverSkinStyle", 							"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
				this.styleList.addItem(new ControlStyleType("Text", 		"OverTextColor", 							"color", 	false, 	false, 	styleDef, this,	"#000000",					null));
			}
			
			if (this.styleName == "ListItemStyle")
			{
				this.styleList.addItem(new ControlStyleType("Sub Styles", 	"AltSkinStyle", 							"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
				this.styleList.addItem(new ControlStyleType("Text", 		"AltTextColor", 							"color", 	false, 	false, 	styleDef, this,	"#000000",					null));

				this.styleList.addItem(new ControlStyleType("Sub Styles", 	"SelectedSkinStyle", 							"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
				this.styleList.addItem(new ControlStyleType("Text", 		"SelectedTextColor", 							"color", 	false, 	false, 	styleDef, this,	"#000000",					null));
			}
			
			if (this.styleName == "ButtonStyle" || 
				this.styleName == "ToggleButtonStyle" ||
				this.styleName == "RadioButtonStyle" ||
				this.styleName == "CheckboxStyle" ||
				this.styleName == "ScrollButtonIncrementStyle" || 
				this.styleName == "ScrollButtonDecrementStyle" ||
				this.styleName == "ButtonTrackStyle" || 
				this.styleName == "ButtonTabStyle")
			{
				this.styleList.addItem(new ControlStyleType("Sub Styles", 	"DownSkinStyle", 							"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
				this.styleList.addItem(new ControlStyleType("Text", 		"DownTextColor", 							"color", 	false, 	false, 	styleDef, this,	"#000000",					null));
				
			}
			
			if (this.styleName == "TextInputStyle")
			{
				this.styleList.addItem(new ControlStyleType("Functional", 	"MaxChars", 								"number", 	false, 	false, 	styleDef, this,	0,							null));
				
				this.styleList.addItem(new ControlStyleType("Text", 		"TextHighlightedColor", 					"color", 	false, 	false, 	styleDef, this,	"#FFFFFF",					null));
				this.styleList.addItem(new ControlStyleType("Text", 		"TextHighlightedBackgroundColor", 			"color", 	false, 	false, 	styleDef, this,	"#000000",					null));
				this.styleList.addItem(new ControlStyleType("Text", 		"UpTextHighlightedColor", 					"color", 	false, 	false, 	styleDef, this,	"#FFFFFF",					null));
				this.styleList.addItem(new ControlStyleType("Text", 		"UpTextHighlightedBackgroundColor", 		"color", 	false, 	false, 	styleDef, this,	"#000000",					null));
				this.styleList.addItem(new ControlStyleType("Text", 		"DisabledTextHighlightedColor", 			"color", 	false, 	false, 	styleDef, this,	"#FFFFFF",					null));
				this.styleList.addItem(new ControlStyleType("Text", 		"DisabledTextHighlightedBackgroundColor", 	"color", 	false, 	false, 	styleDef, this,	"#000000",					null));
				this.styleList.addItem(new ControlStyleType("Text", 		"TextCaretColor", 							"color", 	false, 	false, 	styleDef, this,	"#000000",					null));
			}
			
			if (this.styleName == "LabelStyle")
			{
				this.styleList.addItem(new ControlStyleType("Functional", 	"TruncateToFit", 							"string", 	false, 	false, 	styleDef, this, "...",						null));
			}
			
			if (this.styleName == "DataListStyle" ||
				this.styleName == "ScrollBarStyle")
			{
				this.styleList.addItem(new ControlStyleType("Layout", 		"LayoutDirection", 							"string", 	false, 	false, 	styleDef, this,	"vertical",					[{label:"vertical", value:"vertical"}, {label:"horizontal", value:"horizontal"}]));
				this.styleList.addItem(new ControlStyleType("Layout", 		"LayoutGap", 								"number", 	false, 	false, 	styleDef, this,	-1,							null));
				this.styleList.addItem(new ControlStyleType("Layout", 		"LayoutVerticalAlign", 						"string", 	false, 	false, 	styleDef, this,	"middle",					[{label:"top", value:"top"}, {label:"middle", value:"middle"}, {label:"bottom", value:"bottom"}]));
				this.styleList.addItem(new ControlStyleType("Layout", 		"LayoutHorizontalAlign", 					"string", 	false, 	false, 	styleDef, this,	"center",					[{label:"left", value:"left"}, {label:"center", value:"center"}, {label:"right", value:"right"}]));
			}
			
			if (this.styleName == "DataListStyle")
			{
				this.styleList.addItem(new ControlStyleType("Layout", 		"ScrollBarPlacement", 						"string", 	false, 	false, 	styleDef, this,	"right",					[{label:"left", value:"left"}, {label:"right", value:"right"}, {label:"top", value:"top"}, {label:"bottom", value:"bottom"}]));
				
				this.styleList.addItem(new ControlStyleType("Functional", 	"Selectable", 								"bool", 	false, 	false, 	styleDef, this,	true,						[{label:"true", value:true}, {label:"false", value:false}]));
				this.styleList.addItem(new ControlStyleType("Functional", 	"ScrollBarDisplay", 						"string", 	false, 	false, 	styleDef, this,	"auto",						[{label:"auto", value:"auto"}, {label:"on", value:"on"}, {label:"off", value:"off"}]));
				
				this.styleList.addItem(new ControlStyleType("Sub Styles", 	"ScrollBarStyle", 							"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
				this.styleList.addItem(new ControlStyleType("Sub Styles", 	"ListItemStyle", 							"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
			}
			
			if (this.styleName == "ScrollBarStyle")
			{
				this.styleList.addItem(new ControlStyleType("Functional", 	"ScrollTweenDuration", 						"number", 	false, 	false, 	styleDef, this,	180,						null));
				
				this.styleList.addItem(new ControlStyleType("Sub Styles", 	"ScrollButtonIncrementStyle", 				"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
				this.styleList.addItem(new ControlStyleType("Sub Styles", 	"ScrollButtonDecrementStyle", 				"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
				this.styleList.addItem(new ControlStyleType("Sub Styles", 	"ButtonTrackStyle", 						"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
				this.styleList.addItem(new ControlStyleType("Sub Styles", 	"ButtonTabStyle", 							"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
			}
			
			if (this.styleName == "ToggleButtonStyle" || 
				this.styleName == "RadioButtonStyle" ||
				this.styleName == "CheckboxStyle")
			{
				this.styleList.addItem(new ControlStyleType("Functional", 	"AllowDeselect", 							"bool", 	false, 	false, 	styleDef, this,	true,						[{label:"true", value:true}, {label:"false", value:false}]));
				
				this.styleList.addItem(new ControlStyleType("Sub Styles", 	"SelectedUpSkinStyle", 						"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
				this.styleList.addItem(new ControlStyleType("Sub Styles", 	"SelectedOverSkinStyle", 					"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
				this.styleList.addItem(new ControlStyleType("Sub Styles", 	"SelectedDownSkinStyle", 					"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
				this.styleList.addItem(new ControlStyleType("Sub Styles", 	"SelectedDisabledSkinStyle", 				"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));

				this.styleList.addItem(new ControlStyleType("Text", 		"SelectedUpTextColor", 						"color", 	false, 	false, 	styleDef, this,	"#000000",					null));
				this.styleList.addItem(new ControlStyleType("Text", 		"SelectedOverTextColor", 					"color", 	false, 	false, 	styleDef, this,	"#000000",					null));
				this.styleList.addItem(new ControlStyleType("Text", 		"SelectedDownTextColor", 					"color", 	false, 	false, 	styleDef, this,	"#000000",					null));
				this.styleList.addItem(new ControlStyleType("Text", 		"SelectedDisabledTextColor",				"color", 	false, 	false, 	styleDef, this,	"#000000",					null));
			}
			
			if (this.styleName == "RadioButtonStyle" || 
				this.styleName == "CheckboxStyle")
			{
				this.styleList.addItem(new ControlStyleType("Layout", 		"LabelPlacement", 							"string", 	false, 	false, 	styleDef, this,	"right",					[{label:"right", value:"right"}, {label:"left", value:"left"}]));
				this.styleList.addItem(new ControlStyleType("Layout", 		"LabelGap", 								"number", 	false, 	false, 	styleDef, this,	5,							null));
			}
			
			//Skin styles specific to Checkbox / RadioButton
			if (this.styleName == "RadioButtonStyle" ||		//root
				this.styleName == "CheckboxStyle" ||		//root
				(this.styleName.indexOf("SkinStyle") >= 0 && (this.hasParentStyleName("RadioButtonStyle") || this.hasParentStyleName("CheckboxStyle"))))	//skin
			{
				var checkSize = .35;
				if (this.styleName == "CheckboxStyle" || this.hasParentStyleName("CheckboxStyle"))
					checkSize = .80;
				
				this.styleList.addItem(new ControlStyleType("Rendering", 	"CheckColor", 								"color", 	false, 	false, 	styleDef, this,	"#000000",					null));
				this.styleList.addItem(new ControlStyleType("Rendering", 	"CheckSize", 								"number", 	false, 	false, 	styleDef, this,	checkSize,					null));
			}
			
			if (this.styleName == "ScrollButtonIncrementStyle" || 
				this.styleName == "ScrollButtonDecrementStyle" ||
				(this.styleName.indexOf("SkinStyle") >= 0 && (this.hasParentStyleName("ScrollButtonIncrementStyle") || this.hasParentStyleName("ScrollButtonDecrementStyle"))))	//skin
			{
				this.styleList.addItem(new ControlStyleType("Rendering", 	"ArrowColor", 								"color", 	false, 	false, 	styleDef, this,	"#000000",					null));
				this.styleList.addItem(new ControlStyleType("Rendering", 	"ArrowDirection", 							"string", 	false, 	false, 	styleDef, this,	"up",						[{label:"up", value:"up"}, {label:"down", value:"down"}, {label:"left", value:"left"}, {label:"right", value:"right"}]));
			}
			
			if (styleDef instanceof ArrowShape || 
				styleDef instanceof RoundedRectangleShape)
			{
				this.styleList.addItem(new ControlStyleType("Rendering", 	"CornerRadius", 							"number", 	false, 	false, 	styleDef, this,	0, 							null));
				this.styleList.addItem(new ControlStyleType("Rendering", 	"CornerRadiusTopLeft", 						"number", 	true, 	true, 	styleDef, this,	0, 							null));
				this.styleList.addItem(new ControlStyleType("Rendering", 	"CornerRadiusTopRight", 					"number", 	true, 	true, 	styleDef, this,	0, 							null));
				this.styleList.addItem(new ControlStyleType("Rendering", 	"CornerRadiusBottomLeft", 					"number", 	true, 	true, 	styleDef, this,	0, 							null));
				this.styleList.addItem(new ControlStyleType("Rendering", 	"CornerRadiusBottomRight", 					"number", 	true, 	true, 	styleDef, this,	0, 							null));
			}
			
			if (styleDef instanceof ArrowShape)
			{
				this.styleList.addItem(new ControlStyleType("Rendering", 	"Direction", 								"string", 	false, 	false, 	styleDef, this, "up", 						[{label:"up", value:"up"}, {label:"down", value:"down"}, {label:"left", value:"left"}, {label:"right", value:"right"}]));
				this.styleList.addItem(new ControlStyleType("Rendering", 	"RectBaseWidth",							"number", 	true, 	true, 	styleDef, this,	6, 							null));
				this.styleList.addItem(new ControlStyleType("Rendering", 	"RectBaseHeight", 							"number", 	true, 	true, 	styleDef, this,	6, 							null));
				this.styleList.addItem(new ControlStyleType("Rendering", 	"RectBasePercentWidth", 					"number", 	true, 	true, 	styleDef, this,	50, 						null));
				this.styleList.addItem(new ControlStyleType("Rendering", 	"RectBasePercentHeight", 					"number", 	true, 	true, 	styleDef, this,	50, 						null));
			}
			
			//Get a list of all categories
			var headerMap = Object.create(null);
			for (var i = 0; i < this.styleList.getLength(); i++)
				headerMap[this.styleList.getItemAt(i).category] = true;
			
			//Create header item for categories
			for (var category in headerMap)
				this.styleList.addItem(new ControlStyleType(category, "", null, false, false, null, this, null, null));
			
			this.styleList.sort();
		}
	};
	
	