
//Hierarchical data storage class. Used for the select styles tree. 

function ControlStyleType(category, styleName, styleType, allowNull, initNull, styleDefinition, parent, initValue, allowValues)
{
	//Style data
	this.category = category;
	this.styleName = styleName;
	this.styleType = styleType;
	this.allowNull = allowNull;
	this.initNull = initNull,
	this.initValue = initValue;
	this.allowValues = allowValues;
	
	this.styleDefinition = styleDefinition; //set to sandbox controls.
	this.parent = parent; //parent ControlStyleType
	
	//Cache, populated by associated StyleItemRenderer.
	this.styleListCodeString = "";
	this.styleItemCodeString = "";
	
	//List of available styles for this control or substyle.
	//This is set to the add style Dropdown.
	this.styleList = new ListCollection(); 
	
	//Set static CollectionSort for styleList
	if (ControlStyleType.StyleCategoryNameSort == null)
		ControlStyleType.StyleCategoryNameSort = new CollectionSort(ControlStyleType.StyleCategoryNameSortFunction, false);
	
	//Associate sort with styleList
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
	
//We use the same CollectionSort for every ControlStyleType	
ControlStyleType.StyleCategoryNameSort = null; //Set via constructor (avoid file ordering dependencies)

//Recursive function to aggregate the style code.
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
			stringResult += (result[i].value + "\r\n");

		return stringResult;
	};	
	
ControlStyleType.prototype.buildControlStyleTypeLists = 
	function (styleDef)
	{
		if (styleDef == null)
			styleDef = this.styleDefinition.getStyle(this.styleName); //Sub style definition
		
		this.styleList.clear();
		
		//This style selection does not support sub styles. Bail
		if (styleDef instanceof StyleDefinition == false)
			return;
		
		//												category, 		styleName, 									styleType, allowNull, initNull, styleDefinition, parent, initValue, allowValues
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
			this.styleList.addItem(new ControlStyleType("Functional", 	"Draggable", 								"bool", 	false, 	false, 	styleDef, this, false,						[{label:"true", value:true}, {label:"false", value:false}]));
		}
		
		//ListContainer Styles
		if (this.styleType == "root" ||
			this.styleName == "ButtonIncrementStyle" || 
			this.styleName == "ButtonDecrementStyle" ||
			this.styleName == "ButtonTrackStyle" || 
			this.styleName == "ButtonTabStyle" || 
			this.styleName == "AlertButtonStyle" ||
			this.styleName == "AlertContentListContainerStyle" ||
			this.styleName == "AlertButtonListContainerStyle" ||
			this.styleName == "AlertTitleLabelStyle" ||
			this.styleName == "AlertContentTextStyle")
		{
			this.styleList.addItem(new ControlStyleType("Container", 	"PercentWidth", 							"number", 	true, 	true, 	styleDef, this,	50, 						null));
			this.styleList.addItem(new ControlStyleType("Container", 	"PercentHeight", 							"number", 	true, 	true, 	styleDef, this,	50, 						null));
			this.styleList.addItem(new ControlStyleType("Container", 	"MaxWidth", 								"number", 	true, 	true, 	styleDef, this,	50, 						null));
			this.styleList.addItem(new ControlStyleType("Container", 	"MaxHeight", 								"number", 	true, 	true, 	styleDef, this,	50, 						null));
		}
		
		//ListContainer Styles
		if (this.styleType == "root" ||
			this.styleName == "ButtonIncrementStyle" || 
			this.styleName == "ButtonDecrementStyle" ||
			this.styleName == "ButtonTrackStyle" || 
			this.styleName == "ButtonTabStyle" ||
			this.styleName == "AlertButtonStyle" ||
			this.styleName == "HeaderItemStyle" ||
			this.styleName == "RowItemStyle" ||
			this.styleName == "ListItemStyle" ||
			this.styleName == "AlertContentListContainerStyle" ||
			this.styleName == "AlertButtonListContainerStyle" ||
			this.styleName == "AlertTitleLabelStyle" ||
			this.styleName == "AlertContentTextStyle")
		{
			if (this.hasParentStyleName("DataGridStyle") == false && this.styleName != "HeaderItemStyle" && this.styleName != "RowItemStyle")
				this.styleList.addItem(new ControlStyleType("Container", 	"MinWidth", 							"number", 	true, 	true, 	styleDef, this,	50, 						null));
			
			this.styleList.addItem(new ControlStyleType("Container", 	"MinHeight", 								"number", 	true, 	true, 	styleDef, this,	50, 						null));
		}
		
		//Width / Height
		if (this.styleType == "root" ||
			this.styleName == "ButtonIncrementStyle" || 
			this.styleName == "ButtonDecrementStyle" ||
			this.styleName == "ButtonTrackStyle" || 
			this.styleName == "ButtonTabStyle" ||
			this.styleName == "AlertButtonStyle" ||
			this.styleName == "ArrowButtonStyle" ||
			this.styleName == "ColumnDividerStyle" ||
			this.styleName == "VerticalGridLinesStyle" ||
			this.styleName == "HorizontalGridLinesStyle" ||
			this.styleName == "ScrollBarStyle" ||
			this.styleName == "VerticalScrollBarStyle" ||
			this.styleName == "HorizontalScrollBarStyle" ||
			this.styleName == "SortAscIconStyle" ||
			this.styleName == "SortDescIconStyle" ||
			this.styleName == "HeaderItemStyle" ||
			this.styleName == "RowItemStyle" ||
			this.styleName == "ListItemStyle" ||
			this.styleName == "AlertContentListContainerStyle" ||
			this.styleName == "AlertButtonListContainerStyle" ||
			this.styleName == "AlertTitleLabelStyle" ||
			this.styleName == "AlertContentTextStyle" ||
			this.styleName == "TextInputColorStyle" ||
			this.styleName == "PopupColorPickerStyle")
		{
			var whValue = 10;
			if (this.styleType == "root")
				whValue = 50;
			else if (this.styleName == "VerticalGridLinesStyle" || this.styleName == "HorizontalGridLinesStyle")
				whValue = 1;
			
			if (this.hasParentStyleName("DataGridStyle") == false && this.styleName != "HeaderItemStyle" && this.styleName != "RowItemStyle")
				this.styleList.addItem(new ControlStyleType("Container", 	"Width", 								"number", 	true, 	true, 	styleDef, this,	whValue, 						null));
			
			this.styleList.addItem(new ControlStyleType("Container", 	"Height", 									"number", 	true, 	true, 	styleDef, this,	whValue, 						null));
		}
		
		if (this.styleType == "root" || 
			this.styleName == "ButtonIncrementStyle" || 
			this.styleName == "ButtonDecrementStyle" ||
			this.styleName == "ButtonTrackStyle" || 
			this.styleName == "ButtonTabStyle" ||
			this.styleName == "AlertButtonStyle" ||
			this.styleName == "ArrowButtonStyle" ||
			this.styleName == "PopupDataListStyle" ||
			this.styleName == "HeaderStyle" ||
			this.styleName == "ColumnDividerStyle" ||
			this.styleName == "VerticalGridLinesStyle" ||
			this.styleName == "HorizontalGridLinesStyle" ||
			this.styleName == "ListItemStyle" ||
			this.styleName == "HeaderItemStyle" ||
			this.styleName == "RowItemStyle" ||
			this.styleName == "SortAscIconStyle" ||
			this.styleName == "SortDescIconStyle" ||
			this.styleName == "AlertContentListContainerStyle" ||
			this.styleName == "AlertButtonListContainerStyle" ||
			this.styleName == "TextInputColorStyle" ||
			this.styleName == "ColorSwatchStyle" ||
			this.styleName == "PopupColorPickerStyle" ||
			this.styleName.indexOf("SkinStyle") >= 0) 
		{
			this.styleList.addItem(new ControlStyleType("Rendering", 	"Alpha", 									"number", 	false, 	false, 	styleDef, this,	.5,							null));
			this.styleList.addItem(new ControlStyleType("Rendering", 	"BackgroundShape", 							"class", 	true, 	true,	styleDef, this, RoundedRectangleShape,		[{label:"RoundedRectangle", value:RoundedRectangleShape}, {label:"Arrow", value:ArrowShape}, {label:"Ellipse", value:EllipseShape}]));
			this.styleList.addItem(new ControlStyleType("Rendering", 	"BackgroundFill", 							"class", 	true, 	false,	styleDef, this, SolidFill,					[{label:"Solid", value:SolidFill}, {label:"LinearGradient", value:LinearGradientFill}]));
			this.styleList.addItem(new ControlStyleType("Rendering", 	"BorderType", 								"string", 	true, 	false, 	styleDef, this,	"solid",					[{label:"solid", value:"solid"}, {label:"inset", value:"inset"}, {label:"outset", value:"outset"}]));
			this.styleList.addItem(new ControlStyleType("Rendering", 	"BorderColor", 								"color", 	true, 	false,	styleDef, this, "#000000",					null));
			this.styleList.addItem(new ControlStyleType("Rendering", 	"BorderThickness", 							"number", 	false, 	false, 	styleDef, this,	1,							null));
			this.styleList.addItem(new ControlStyleType("Rendering", 	"ShadowSize", 								"number", 	false, 	false, 	styleDef, this,	0,							null));
			this.styleList.addItem(new ControlStyleType("Rendering", 	"ShadowOffsetX", 							"number", 	false, 	false, 	styleDef, this,	0,							null));
			this.styleList.addItem(new ControlStyleType("Rendering", 	"ShadowOffsetY", 							"number", 	false, 	false, 	styleDef, this,	0, 							null));
			this.styleList.addItem(new ControlStyleType("Rendering", 	"ShadowColor", 								"color", 	false, 	false, 	styleDef, this,	"#000000",					null));
		}
		
		if (this.styleType == "root" || 
			this.styleName == "ButtonIncrementStyle" || 
			this.styleName == "ButtonDecrementStyle" ||
			this.styleName == "ButtonTrackStyle" || 
			this.styleName == "ButtonTabStyle" ||
			this.styleName == "ColumnDividerStyle" ||
			this.styleName == "TextInputColorStyle" ||
			this.styleName == "ColorSwatchStyle") 
		{
			this.styleList.addItem(new ControlStyleType("Functional", 	"Visible", 									"bool", 	false, 	false, 	styleDef, this,	true,						[{label:"true", value:true}, {label:"false", value:false}]));
		}
		
		if (this.styleType == "root" || 
			this.styleName == "ButtonIncrementStyle" || 
			this.styleName == "ButtonDecrementStyle" ||
			this.styleName == "ButtonTrackStyle" || 
			this.styleName == "ButtonTabStyle" ||
			this.styleName == "AlertButtonStyle" ||
			this.styleName == "HeaderStyle" ||
			this.styleName == "ColumnDividerStyle" ||
			this.styleName == "HeaderItemStyle" ||
			this.styleName == "RowItemStyle" ||
			this.styleName == "TextInputColorStyle" ||
			this.styleName == "PopupColorPickerStyle" ||
			this.styleName == "ScrollBarStyle" ||
			this.styleName == "VerticalScrollBarStyle" ||
			this.styleName == "HorizontalScrollBarStyle") 
		{
			this.styleList.addItem(new ControlStyleType("Functional", 	"Cursor", 									"string", 	true, 	true, 	styleDef, this, false,						[{label:"pointer", value:"pointer"}, {label:"text", value:"text"}, {label:"none", value:"none"}]));
		}
		
		if (this.styleName == "ProgressStyle")
		{
			this.styleList.addItem(new ControlStyleType("Functional", 	"ProgressFillStart", 						"string", 	true, 	true, 	styleDef, this, false,						[{label:"left", value:"left"}, {label:"right", value:"right"}, {label:"top", value:"top"}, {label:"bottom", value:"bottom"}]));
			this.styleList.addItem(new ControlStyleType("Rendering", 	"ProgressFill", 							"class", 	true, 	false,	styleDef, this, SolidFill,					[{label:"Solid", value:SolidFill}, {label:"LinearGradient", value:LinearGradientFill}]));
		}
		
		if (this.styleName == "LabelStyle" || 
			this.styleName == "AlertTitleLabelStyle" ||
			this.styleName == "AlertContentTextStyle" ||
			this.styleName == "TextInputStyle" ||
			this.styleName == "TextAreaStyle" ||
			this.styleName == "ButtonStyle" || 
			this.styleName == "AlertButtonStyle" ||
			this.styleName == "ToggleButtonStyle" ||
			this.styleName == "RadioButtonStyle" ||
			this.styleName == "CheckboxStyle" ||
			this.styleName == "DataListStyle" ||
			this.styleName == "ListItemStyle" ||
			this.styleName == "DropdownStyle" ||
			this.styleName == "PopupDataListStyle" ||
			this.styleName == "DataGridStyle" ||
			this.styleName == "HeaderStyle" ||
			this.styleName == "HeaderItemStyle" ||
			this.styleName == "RowItemStyle" ||
			this.styleName == "TextStyle" ||
			this.styleName == "TextInputColorStyle")
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
			this.styleName == "AlertStyle" ||
			this.styleName == "AlertTitleLabelStyle" ||
			this.styleName == "AlertContentTextStyle" ||
			this.styleName == "AlertContentListContainerStyle" ||
			this.styleName == "AlertButtonListContainerStyle" ||
			this.styleName == "TextInputStyle" ||
			this.styleName == "TextAreaStyle" ||
			this.styleName == "ButtonStyle" || 
			this.styleName == "AlertButtonStyle" ||
			this.styleName == "ToggleButtonStyle" ||
			this.styleName == "RadioButtonStyle" ||
			this.styleName == "CheckboxStyle" ||
			this.styleName == "ScrollBarStyle" ||
			this.styleName == "VerticalScrollBarStyle" ||
			this.styleName == "HorizontalScrollBarStyle" ||
			this.styleName == "ButtonIncrementStyle" || 
			this.styleName == "ButtonDecrementStyle" ||
			this.styleName == "ButtonTrackStyle" || 
			this.styleName == "ButtonTabStyle" ||
			this.styleName == "ListItemStyle" ||
			this.styleName == "DataListStyle" ||
			this.styleName == "DropdownStyle" ||
			this.styleName == "PopupDataListStyle" ||
			this.styleName == "ListContainerStyle" ||
			this.styleName == "DataGridStyle" ||
			this.styleName == "HeaderStyle" ||
			this.styleName == "HeaderItemStyle" ||
			this.styleName == "RowItemStyle" ||
			this.styleName == "TextStyle" ||
			this.styleName == "TextInputColorStyle" ||
			this.styleName == "ColorPickerStyle" ||
			this.styleName == "PopupColorPickerStyle" ||
			this.styleName == "ColorPickerButtonStyle")
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
			this.styleName == "DropdownStyle")
		{
			this.styleList.addItem(new ControlStyleType("Functional", 	"Text", 									"string", 	true, 	false, 	styleDef, this, "My Text",					null));
		}
		
		if (this.styleName == "TextInputStyle" ||
			this.styleName == "TextAreaStyle" ||
			this.styleName == "ButtonStyle" || 
			this.styleName == "ToggleButtonStyle" ||
			this.styleName == "RadioButtonStyle" ||
			this.styleName == "CheckboxStyle" ||
			this.styleName == "ScrollBarStyle" ||
			this.styleName == "VerticalScrollBarStyle" ||
			this.styleName == "HorizontalScrollBarStyle" ||
			this.styleName == "ButtonIncrementStyle" || 
			this.styleName == "ButtonDecrementStyle" ||
			this.styleName == "ButtonTrackStyle" || 
			this.styleName == "ButtonTabStyle" ||
			this.styleName == "DropdownStyle" ||
			this.styleName == "HeaderItemStyle" ||
			this.styleName == "SortAscIconStyle" ||
			this.styleName == "SortDescIconStyle" ||
			this.styleName == "TextInputColorStyle" ||
			this.styleName == "ColorPickerButtonStyle")
		{
			this.styleList.addItem(new ControlStyleType("Functional", 	"Enabled", 									"bool", 	false, 	false, 	styleDef, this,	true,						[{label:"true", value:true}, {label:"false", value:false}]));
		}
		
		if (this.styleName == "ButtonStyle" || 
			this.styleName == "ToggleButtonStyle" ||
			this.styleName == "RadioButtonStyle" ||
			this.styleName == "CheckboxStyle" ||
			this.styleName == "ButtonIncrementStyle" || 
			this.styleName == "ButtonDecrementStyle" ||
			this.styleName == "ButtonTrackStyle" || 
			this.styleName == "ButtonTabStyle" || 
			this.styleName == "AlertButtonStyle" ||
			this.styleName == "TextInputStyle" ||
			this.styleName == "TextAreaStyle" ||
			(this.styleName == "ListItemStyle" && (this.hasParentStyleName("DataListStyle") || this.hasParentStyleName("PopupDataListStyle"))) ||
			this.styleName == "DropdownStyle" ||
			this.styleName == "ArrowButtonStyle" ||
			this.styleName == "ColumnDividerStyle" ||
			this.styleName == "HeaderItemStyle" ||
			this.styleName == "RowItemStyle" ||
			this.styleName == "SortAscIconStyle" ||
			this.styleName == "SortDescIconStyle" ||
			this.styleName == "TextInputColorStyle" ||
			this.styleName == "ColorPickerButtonStyle")
		{
			this.styleList.addItem(new ControlStyleType("Sub Styles", 	"UpSkinStyle", 								"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
		}
		
		if (this.styleName == "ButtonStyle" || 
			this.styleName == "AlertButtonStyle" ||
			this.styleName == "ToggleButtonStyle" ||
			this.styleName == "RadioButtonStyle" ||
			this.styleName == "CheckboxStyle" ||
			this.styleName == "TextInputStyle" ||
			this.styleName == "TextAreaStyle" ||
			(this.styleName == "ListItemStyle" && (this.hasParentStyleName("DataListStyle") || this.hasParentStyleName("PopupDataListStyle"))) ||
			this.styleName == "DropdownStyle" ||
			this.styleName == "HeaderItemStyle" ||
			this.styleName == "RowItemStyle" ||
			this.styleName == "TextInputColorStyle")
		{
			this.styleList.addItem(new ControlStyleType("Text", 		"UpTextColor", 								"color", 	false, 	false, 	styleDef, this,	"#000000",				null));
		}
		
		if (this.styleName == "ButtonStyle" || 
			this.styleName == "ToggleButtonStyle" ||
			this.styleName == "RadioButtonStyle" ||
			this.styleName == "CheckboxStyle" ||
			this.styleName == "ButtonIncrementStyle" || 
			this.styleName == "ButtonDecrementStyle" ||
			this.styleName == "ButtonTrackStyle" || 
			this.styleName == "ButtonTabStyle" || 
			this.styleName == "TextInputStyle" ||
			this.styleName == "TextAreaStyle" ||
			this.styleName == "DropdownStyle" ||
			this.styleName == "ArrowButtonStyle" ||
			this.styleName == "ColumnDividerStyle" ||
			this.styleName == "HeaderItemStyle" ||
			this.styleName == "SortAscIconStyle" ||
			this.styleName == "SortDescIconStyle" ||
			this.styleName == "TextInputColorStyle" ||
			this.styleName == "ColorPickerButtonStyle")
		{
			this.styleList.addItem(new ControlStyleType("Sub Styles", 	"DisabledSkinStyle", 						"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
		}
		
		if (this.styleName == "ButtonStyle" || 
			this.styleName == "ToggleButtonStyle" ||
			this.styleName == "RadioButtonStyle" ||
			this.styleName == "CheckboxStyle" ||
			this.styleName == "TextInputStyle" ||
			this.styleName == "TextAreaStyle" ||
			this.styleName == "DropdownStyle" ||
			this.styleName == "HeaderItemStyle" ||
			this.styleName == "TextInputColorStyle")
		{
			this.styleList.addItem(new ControlStyleType("Text", 		"DisabledTextColor", 						"color", 	false, 	false, 	styleDef, this,	"#000000",					null));
		}
		
		if (this.styleName == "ButtonStyle" || 
			this.styleName == "AlertButtonStyle" ||
			this.styleName == "ToggleButtonStyle" ||
			this.styleName == "RadioButtonStyle" ||
			this.styleName == "CheckboxStyle" ||
			this.styleName == "ButtonIncrementStyle" || 
			this.styleName == "ButtonDecrementStyle" ||
			this.styleName == "ButtonTrackStyle" || 
			this.styleName == "ButtonTabStyle" ||
			(this.styleName == "ListItemStyle" && (this.hasParentStyleName("DataListStyle") || this.hasParentStyleName("PopupDataListStyle"))) ||
			this.styleName == "DropdownStyle" ||
			this.styleName == "ArrowButtonStyle" ||
			this.styleName == "ColumnDividerStyle" ||
			this.styleName == "HeaderItemStyle" || 
			this.styleName == "RowItemStyle" ||
			this.styleName == "SortAscIconStyle" ||
			this.styleName == "SortDescIconStyle" ||
			this.styleName == "ColorPickerButtonStyle")
		{
			this.styleList.addItem(new ControlStyleType("Sub Styles", 	"OverSkinStyle", 							"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
		}
		
		if (this.styleName == "ButtonStyle" || 
			this.styleName == "AlertButtonStyle" ||
			this.styleName == "ToggleButtonStyle" ||
			this.styleName == "RadioButtonStyle" ||
			this.styleName == "CheckboxStyle" ||
			(this.styleName == "ListItemStyle" && (this.hasParentStyleName("DataListStyle") || this.hasParentStyleName("PopupDataListStyle"))) ||
			this.styleName == "DropdownStyle" ||
			this.styleName == "HeaderItemStyle" ||
			this.styleName == "RowItemStyle")
		{
			this.styleList.addItem(new ControlStyleType("Text", 		"OverTextColor", 							"color", 	false, 	false, 	styleDef, this,	"#000000",					null));
		}
		
		if (this.styleName == "ButtonStyle" || 
			this.styleName == "AlertButtonStyle" ||
			this.styleName == "ToggleButtonStyle" ||
			this.styleName == "RadioButtonStyle" ||
			this.styleName == "CheckboxStyle" ||
			this.styleName == "ButtonIncrementStyle" || 
			this.styleName == "ButtonDecrementStyle" ||
			this.styleName == "ButtonTrackStyle" || 
			this.styleName == "ButtonTabStyle" ||
			this.styleName == "DropdownStyle" ||
			this.styleName == "ArrowButtonStyle" ||
			this.styleName == "ColumnDividerStyle" ||
			this.styleName == "HeaderItemStyle" ||
			this.styleName == "SortAscIconStyle" ||
			this.styleName == "SortDescIconStyle" ||
			this.styleName == "ColorPickerButtonStyle")
		{
			this.styleList.addItem(new ControlStyleType("Sub Styles", 	"DownSkinStyle", 							"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
		}
		
		if (this.styleName == "ButtonStyle" || 
			this.styleName == "AlertButtonStyle" ||
			this.styleName == "ToggleButtonStyle" ||
			this.styleName == "RadioButtonStyle" ||
			this.styleName == "CheckboxStyle" ||
			this.styleName == "DropdownStyle" ||
			this.styleName == "HeaderItemStyle")
		{
			this.styleList.addItem(new ControlStyleType("Text", 		"DownTextColor", 							"color", 	false, 	false, 	styleDef, this,	"#000000",					null));
		}
		
		if (this.styleName == "DropdownStyle" ||
			this.styleName == "ColorPickerButtonStyle")
		{
			if (this.styleName == "DropdownStyle")
			{
				this.styleList.addItem(new ControlStyleType("Functional", 	"MaxPopupHeight", 							"number", 	false, 	false, 	styleDef, this,	200,						null));
				this.styleList.addItem(new ControlStyleType("Layout", 		"PopupDataListClipTopOrBottom", 			"number", 	false, 	false, 	styleDef, this,	1,							null));
				this.styleList.addItem(new ControlStyleType("Sub Styles", 	"PopupDataListStyle", 						"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
			}
			
			this.styleList.addItem(new ControlStyleType("Sub Styles", 	"ArrowButtonStyle", 						"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
			this.styleList.addItem(new ControlStyleType("Functional", 	"OpenCloseTweenDuration", 					"number", 	false, 	false, 	styleDef, this,	300,						null));
		}
		
		if ((this.styleName == "ListItemStyle" && (this.hasParentStyleName("DataListStyle") || this.hasParentStyleName("PopupDataListStyle"))) ||
			this.styleName == "RowItemStyle")
		{
			this.styleList.addItem(new ControlStyleType("Sub Styles", 	"AltSkinStyle", 							"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
			this.styleList.addItem(new ControlStyleType("Sub Styles", 	"SelectedSkinStyle", 						"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
			
			this.styleList.addItem(new ControlStyleType("Text", 		"AltTextColor", 							"color", 	false, 	false, 	styleDef, this,	"#000000",					null));
			this.styleList.addItem(new ControlStyleType("Text", 		"SelectedTextColor", 						"color", 	false, 	false, 	styleDef, this,	"#000000",					null));
		}
		
		if (this.styleName == "TextInputStyle" ||
			this.styleName == "TextAreaStyle" ||
			this.styleName == "TextInputColorStyle")
		{
			this.styleList.addItem(new ControlStyleType("Functional", 	"MaxChars", 								"number", 	false, 	false, 	styleDef, this,	0,							null));
			this.styleList.addItem(new ControlStyleType("Functional", 	"DisplayAsPassword", 						"bool", 	false, 	false, 	styleDef, this,	true,						[{label:"true", value:true}, {label:"false", value:false}]));
			
			this.styleList.addItem(new ControlStyleType("Text", 		"TextHighlightedColor", 					"color", 	false, 	false, 	styleDef, this,	"#FFFFFF",					null));
			this.styleList.addItem(new ControlStyleType("Text", 		"TextHighlightedBackgroundColor", 			"color", 	false, 	false, 	styleDef, this,	"#000000",					null));
			this.styleList.addItem(new ControlStyleType("Text", 		"UpTextHighlightedColor", 					"color", 	false, 	false, 	styleDef, this,	"#FFFFFF",					null));
			this.styleList.addItem(new ControlStyleType("Text", 		"UpTextHighlightedBackgroundColor", 		"color", 	false, 	false, 	styleDef, this,	"#000000",					null));
			this.styleList.addItem(new ControlStyleType("Text", 		"DisabledTextHighlightedColor", 			"color", 	false, 	false, 	styleDef, this,	"#FFFFFF",					null));
			this.styleList.addItem(new ControlStyleType("Text", 		"DisabledTextHighlightedBackgroundColor", 	"color", 	false, 	false, 	styleDef, this,	"#000000",					null));
			this.styleList.addItem(new ControlStyleType("Text", 		"TextCaretColor", 							"color", 	false, 	false, 	styleDef, this,	"#000000",					null));
		}
		
		if (this.styleName == "LabelStyle"||
			this.styleName == "AlertTitleLabelStyle")
		{
			this.styleList.addItem(new ControlStyleType("Functional", 	"TruncateToFit", 							"string", 	false, 	false, 	styleDef, this, "...",						null));
		}
		
		if (this.styleName == "ImageStyle")
		{
			this.styleList.addItem(new ControlStyleType("Rendering", 	"ImageSourceClipX", 						"number", 	true, 	true, 	styleDef, this,	0,						null));
			this.styleList.addItem(new ControlStyleType("Rendering", 	"ImageSourceClipY", 						"number", 	true, 	true, 	styleDef, this,	0,						null));
			this.styleList.addItem(new ControlStyleType("Rendering", 	"ImageSourceClipWidth", 					"number", 	true, 	true, 	styleDef, this,	150,					null));
			this.styleList.addItem(new ControlStyleType("Rendering", 	"ImageSourceClipHeight", 					"number", 	true, 	true, 	styleDef, this,	150,					null));
			this.styleList.addItem(new ControlStyleType("Rendering", 	"ImageScaleType", 							"string", 	true, 	true, 	styleDef, this,	0,						[{label:"fit", value:"fit"}, {label:"stretch", value:"stretch"}, {label:"tile", value:"tile"}, {label:"tilefit", value:"tilefit"}]));
			
			this.styleList.addItem(new ControlStyleType("Layout", 		"ImageVerticalAlign", 						"string", 	false, 	false, 	styleDef, this,	"middle",				[{label:"top", value:"top"}, {label:"middle", value:"middle"}, {label:"bottom", value:"bottom"}]));
			this.styleList.addItem(new ControlStyleType("Layout", 		"ImageHorizontalAlign", 					"string", 	false, 	false, 	styleDef, this,	"center",				[{label:"left", value:"left"}, {label:"center", value:"center"}, {label:"right", value:"right"}]));
		}
		
		if (this.styleName == "TextStyle" ||
			this.styleName == "TextAreaStyle" ||
			this.styleName == "AlertContentTextStyle")
		{
			this.styleList.addItem(new ControlStyleType("Text", 		"Multiline", 								"bool", 	false, 	false, 	styleDef, this,	true,						[{label:"true", value:true}, {label:"false", value:false}]));
			this.styleList.addItem(new ControlStyleType("Text", 		"WordWrap", 								"bool", 	false, 	false, 	styleDef, this,	true,						[{label:"true", value:true}, {label:"false", value:false}]));
			
			this.styleList.addItem(new ControlStyleType("Text", 		"TextLineSpacing", 							"number", 	false, 	false, 	styleDef, this,	0,							null));
		}
		
		if (this.styleName == "DataListStyle" ||
			this.styleName == "ScrollBarStyle" ||
			this.styleName == "VerticalScrollBarStyle" ||
			this.styleName == "HorizontalScrollBarStyle" ||
			this.styleName == "AlertStyle" ||
			this.styleName == "ListContainerStyle" ||
			this.styleName == "AlertContentListContainerStyle" ||
			this.styleName == "AlertButtonListContainerStyle")
		{
			this.styleList.addItem(new ControlStyleType("Layout", 		"LayoutDirection", 							"string", 	false, 	false, 	styleDef, this,	"vertical",					[{label:"vertical", value:"vertical"}, {label:"horizontal", value:"horizontal"}]));
			this.styleList.addItem(new ControlStyleType("Layout", 		"LayoutGap", 								"number", 	false, 	false, 	styleDef, this,	-1,							null));
			this.styleList.addItem(new ControlStyleType("Layout", 		"LayoutVerticalAlign", 						"string", 	false, 	false, 	styleDef, this,	"middle",					[{label:"top", value:"top"}, {label:"middle", value:"middle"}, {label:"bottom", value:"bottom"}]));
			this.styleList.addItem(new ControlStyleType("Layout", 		"LayoutHorizontalAlign", 					"string", 	false, 	false, 	styleDef, this,	"center",					[{label:"left", value:"left"}, {label:"center", value:"center"}, {label:"right", value:"right"}]));
		}
		
		if (this.styleName == "DataListStyle" ||
			this.styleName == "PopupDataListStyle" ||
			this.styleName == "DataGridStyle")
		{
			this.styleList.addItem(new ControlStyleType("Layout", 		"ScrollBarPlacement", 						"string", 	false, 	false, 	styleDef, this,	"right",					[{label:"left", value:"left"}, {label:"right", value:"right"}, {label:"top", value:"top"}, {label:"bottom", value:"bottom"}]));
			
			this.styleList.addItem(new ControlStyleType("Functional", 	"Selectable", 								"bool", 	false, 	false, 	styleDef, this,	true,						[{label:"true", value:true}, {label:"false", value:false}]));
			this.styleList.addItem(new ControlStyleType("Functional", 	"ScrollBarDisplay", 						"string", 	false, 	false, 	styleDef, this,	"auto",						[{label:"auto", value:"auto"}, {label:"on", value:"on"}, {label:"off", value:"off"}]));
			
			this.styleList.addItem(new ControlStyleType("Sub Styles", 	"ScrollBarStyle", 							"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
			this.styleList.addItem(new ControlStyleType("Sub Styles", 	"ListItemStyle", 							"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
		}
		
		if (this.styleName == "TextAreaStyle")
		{
			this.styleList.addItem(new ControlStyleType("Layout", 		"VerticalScrollBarPlacement", 				"string", 	false, 	false, 	styleDef, this,	"right",					[{label:"left", value:"left"}, {label:"right", value:"right"}]));
			this.styleList.addItem(new ControlStyleType("Layout", 		"HorizontalScrollBarPlacement", 			"string", 	false, 	false, 	styleDef, this,	"bottom",					[{label:"bottom", value:"bottom"}, {label:"top", value:"top"}]));
			
			this.styleList.addItem(new ControlStyleType("Layout", 		"MeasureContentWidth", 						"bool", 	false, 	false, 	styleDef, this,	false,						[{label:"true", value:true}, {label:"false", value:false}]));
			this.styleList.addItem(new ControlStyleType("Layout", 		"MeasureContentHeight", 					"bool", 	false, 	false, 	styleDef, this,	false,						[{label:"true", value:true}, {label:"false", value:false}]));
			
			this.styleList.addItem(new ControlStyleType("Sub Styles", 	"VerticalScrollBarStyle", 					"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
			this.styleList.addItem(new ControlStyleType("Sub Styles", 	"HorizontalScrollBarStyle", 				"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
			
			this.styleList.addItem(new ControlStyleType("Functional", 	"VerticalScrollBarDisplay", 				"string", 	false, 	false, 	styleDef, this,	"auto",						[{label:"auto", value:"auto"}, {label:"on", value:"on"}, {label:"off", value:"off"}]));
			this.styleList.addItem(new ControlStyleType("Functional", 	"HorizontalScrollBarDisplay", 				"string", 	false, 	false, 	styleDef, this,	"auto",						[{label:"auto", value:"auto"}, {label:"on", value:"on"}, {label:"off", value:"off"}]));
		}
		
		if (this.styleName == "ColorPickerStyle" ||
			this.styleName == "PopupColorPickerStyle")
		{
			this.styleList.addItem(new ControlStyleType("Sub Styles", 	"TextInputColorStyle", 						"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
		}
		
		if (this.styleName == "ColorPickerButtonStyle")
		{
			this.styleList.addItem(new ControlStyleType("Sub Styles", 	"PopupColorPickerStyle", 					"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
			this.styleList.addItem(new ControlStyleType("Sub Styles", 	"ColorSwatchStyle", 						"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
			this.styleList.addItem(new ControlStyleType("Layout", 		"PopupColorPickerDistance", 				"number", 	false, 	false, 	styleDef, this,	-1,							null));
		}
		
		if (this.styleName == "AlertStyle")
		{
			this.styleList.addItem(new ControlStyleType("Sub Styles", 	"AlertTitleLabelStyle", 					"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
			this.styleList.addItem(new ControlStyleType("Sub Styles", 	"AlertContentListContainerStyle", 			"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
			this.styleList.addItem(new ControlStyleType("Sub Styles", 	"AlertButtonListContainerStyle", 			"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
			this.styleList.addItem(new ControlStyleType("Sub Styles", 	"AlertContentTextStyle", 					"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
			this.styleList.addItem(new ControlStyleType("Sub Styles", 	"AlertButtonStyle", 						"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
		}
		
		if (this.styleName == "DataGridStyle")
		{
			this.styleList.addItem(new ControlStyleType("Layout", 		"GridLinesPriority", 						"string", 	false, 	false, 	styleDef, this,	"vertical",					[{label:"vertical", value:"vertical"}, {label:"horizontal", value:"horizontal"}]));
			
			this.styleList.addItem(new ControlStyleType("Sub Styles", 	"HeaderStyle", 								"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
			this.styleList.addItem(new ControlStyleType("Sub Styles", 	"VerticalGridLinesStyle", 					"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
			this.styleList.addItem(new ControlStyleType("Sub Styles", 	"HorizontalGridLinesStyle", 				"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
		}
		
		if (this.styleName.indexOf("DataGridColumn") > -1)
		{
			this.styleList.addItem(new ControlStyleType("Container", 	"MinSize", 									"number", 	true, 	true, 	styleDef, this,	100, 						null));
			
			this.styleList.addItem(new ControlStyleType("Functional", 	"HeaderText", 								"string", 	false, 	false, 	styleDef, this, "My Text",					null));
			this.styleList.addItem(new ControlStyleType("Functional", 	"SelectionType", 							"string", 	false, 	false, 	styleDef, this, "row",						[{label:"row", value:"row"}, {label:"column", value:"column"}, {label:"cell", value:"cell"}]));
			this.styleList.addItem(new ControlStyleType("Functional", 	"Selectable", 								"bool", 	false, 	false, 	styleDef, this,	true,						[{label:"true", value:true}, {label:"false", value:false}]));
			this.styleList.addItem(new ControlStyleType("Functional", 	"Highlightable", 							"bool", 	false, 	false, 	styleDef, this,	true,						[{label:"true", value:true}, {label:"false", value:false}]));
			
			this.styleList.addItem(new ControlStyleType("Sub Styles", 	"HeaderItemStyle", 							"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
			this.styleList.addItem(new ControlStyleType("Sub Styles", 	"RowItemStyle", 							"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
		}
		
		if (this.styleName == "HeaderStyle")
		{
			this.styleList.addItem(new ControlStyleType("Functional", 	"DraggableColumns", 						"bool", 	false, 	false, 	styleDef, this,	true,						[{label:"true", value:true}, {label:"false", value:false}]));
			
			this.styleList.addItem(new ControlStyleType("Sub Styles", 	"ColumnDividerStyle", 						"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
		}
		
		if (this.styleName == "HeaderItemStyle")
		{
			this.styleList.addItem(new ControlStyleType("Layout", 		"SortIconGap", 								"number", 	false, 	false, 	styleDef, this,	3, 							null));
			this.styleList.addItem(new ControlStyleType("Layout", 		"SortIconPlacement", 						"string", 	false, 	false, 	styleDef, this,	"right", 					[{label:"left", value:"left"}, {label:"right", value:"right"}]));
			
			this.styleList.addItem(new ControlStyleType("Sub Styles", 	"SortAscIconStyle", 						"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
			this.styleList.addItem(new ControlStyleType("Sub Styles", 	"SortDescIconStyle", 						"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
		}
		
		if (this.styleName == "ColumnDividerStyle" ||
			(this.styleName.indexOf("SkinStyle") >= 0 && this.hasParentStyleName("ColumnDividerStyle")))
		{
			this.styleList.addItem(new ControlStyleType("Rendering", 	"DividerLineColor", 						"color", 	true, 	false, 	styleDef, this,	"#000000",					null));
			this.styleList.addItem(new ControlStyleType("Rendering", 	"DividerArrowColor", 						"color", 	true, 	false, 	styleDef, this,	"#000000",					null));
		}
		
		if (this.styleName == "ScrollBarStyle" ||
			this.styleName == "VerticalScrollBarStyle" ||
			this.styleName == "HorizontalScrollBarStyle")
		{
			this.styleList.addItem(new ControlStyleType("Functional", 	"ScrollTweenDuration", 						"number", 	false, 	false, 	styleDef, this,	180,						null));
			
			this.styleList.addItem(new ControlStyleType("Sub Styles", 	"ButtonIncrementStyle", 					"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
			this.styleList.addItem(new ControlStyleType("Sub Styles", 	"ButtonDecrementStyle", 					"class", 	false, 	false, 	styleDef, this,	StyleDefinition,			[{label:"StyleDefinition", value:StyleDefinition}]));
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
		
		if (this.styleName == "DropdownStyle" ||		//root
			this.styleName == "ArrowButtonStyle" || 	//sub button
			(this.styleName.indexOf("SkinStyle") >= 0 && this.hasParentStyleName("ArrowButtonStyle")))
		{
			//Proxied Dropdown to ArrowButton to ArrowButton skins
			this.styleList.addItem(new ControlStyleType("Rendering", 	"ArrowColor", 								"color", 	true, 	false, 	styleDef, this,	"#000000",					null));
			this.styleList.addItem(new ControlStyleType("Rendering", 	"LineColor", 								"color", 	true, 	false, 	styleDef, this,	"#000000",					null));
		}
		
		if (this.styleName == "ButtonIncrementStyle" || 
			this.styleName == "ButtonDecrementStyle" ||
			(this.styleName.indexOf("SkinStyle") >= 0 && (this.hasParentStyleName("ButtonIncrementStyle") || this.hasParentStyleName("ButtonDecrementStyle"))))	//skin
		{
			this.styleList.addItem(new ControlStyleType("Rendering", 	"ArrowColor", 								"color", 	true, 	false, 	styleDef, this,	"#000000",					null));
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
		
		if (styleDef instanceof RoundedRectangleShape)
		{
			this.styleList.addItem(new ControlStyleType("Rendering", 	"CornerRadiusPercent", 						"number", 	false, 	false, 	styleDef, this,	0, 							null));
			this.styleList.addItem(new ControlStyleType("Rendering", 	"CornerRadiusTopLeftPercent", 				"number", 	true, 	true, 	styleDef, this,	0, 							null));
			this.styleList.addItem(new ControlStyleType("Rendering", 	"CornerRadiusTopRightPercent", 				"number", 	true, 	true, 	styleDef, this,	0, 							null));
			this.styleList.addItem(new ControlStyleType("Rendering", 	"CornerRadiusBottomLeftPercent", 			"number", 	true, 	true, 	styleDef, this,	0, 							null));
			this.styleList.addItem(new ControlStyleType("Rendering", 	"CornerRadiusBottomRightPercent", 			"number", 	true, 	true, 	styleDef, this,	0, 							null));
		}
		
		if (styleDef instanceof ArrowShape)
		{
			this.styleList.addItem(new ControlStyleType("Rendering", 	"Direction", 								"string", 	false, 	false, 	styleDef, this, "up", 						[{label:"up", value:"up"}, {label:"down", value:"down"}, {label:"left", value:"left"}, {label:"right", value:"right"}]));
			this.styleList.addItem(new ControlStyleType("Rendering", 	"RectBaseWidth",							"number", 	true, 	true, 	styleDef, this,	6, 							null));
			this.styleList.addItem(new ControlStyleType("Rendering", 	"RectBaseHeight", 							"number", 	true, 	true, 	styleDef, this,	6, 							null));
			this.styleList.addItem(new ControlStyleType("Rendering", 	"RectBasePercentWidth", 					"number", 	true, 	true, 	styleDef, this,	50, 						null));
			this.styleList.addItem(new ControlStyleType("Rendering", 	"RectBasePercentHeight", 					"number", 	true, 	true, 	styleDef, this,	50, 						null));
		}
		
		if (styleDef instanceof SolidFill)
		{
			this.styleList.addItem(new ControlStyleType("Rendering", 	"FillColor", 								"color", 	false, 	false, 	styleDef, this,	"#FFFF00",					null));
		}
		
		if (styleDef instanceof LinearGradientFill)
		{
			this.styleList.addItem(new ControlStyleType("Rendering", 	"GradientDegrees", 							"number", 	false, 	false, 	styleDef, this,	0, 							null));
			this.styleList.addItem(new ControlStyleType("Rendering", 	"GradientColorStops", 						"json", 	false, 	false, 	styleDef, this,	"[[0,\"#000000\"],[1,\"#00FFFF\"]]", null));
			this.styleList.addItem(new ControlStyleType("Rendering", 	"GradientCoverage", 						"string", 	false, 	false, 	styleDef, this,	"inner", 					[{label:"inner", value:"inner"}, {label:"outer", value:"outer"}]));
		}
		
		//Get a list of all categories
		var headerMap = Object.create(null);
		for (var i = 0; i < this.styleList.getLength(); i++)
			headerMap[this.styleList.getItemAt(i).category] = true;
		
		//Create header item for categories
		for (var category in headerMap)
			this.styleList.addItem(new ControlStyleType(category, "", null, false, false, null, this, null, null));
		
		this.styleList.sort();
	};
	
	