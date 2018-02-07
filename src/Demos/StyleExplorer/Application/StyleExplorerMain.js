
//////STRINGS/////////////////////

var localeStrings = Object.create(null);

//all/////////
localeStrings["all"] = Object.create(null);
localeStrings["all"]["FlexCanvasJS"] = 				"FlexCanvasJS";
localeStrings["all"]["Style Explorer"] = 			"Style Explorer";


//en-us////////
localeStrings["en-us"] = Object.create(null);
localeStrings["en-us"]["Language"] = 				"Language";
localeStrings["en-us"]["Powered By"] = 				"Powered By"; 
localeStrings["en-us"]["Select Control"] = 			"Select Control";
localeStrings["en-us"]["Select Styles"] = 			"Select Styles";
localeStrings["en-us"]["Sandbox"] = 				"Sandbox";
localeStrings["en-us"]["Add"] = 					"Add";
localeStrings["en-us"]["Styles"] = 					"Styles";
localeStrings["en-us"]["Style Code"] = 				"Style Code";
localeStrings["en-us"]["Copy"] = 					"Copy";
localeStrings["en-us"]["Text Size"] = 				"Text Size";
localeStrings["en-us"]["Press Ctrl C"] = 			"Press CTRL + C";


//es-es////////
localeStrings["es-es"] = Object.create(null);
localeStrings["es-es"]["Language"] = 				"Idioma"; 
localeStrings["es-es"]["Powered By"] = 				"Desarrollado Por";
localeStrings["es-es"]["Select Control"] = 			"Seleccionar Control";
localeStrings["es-es"]["Select Styles"] = 			"Seleccionar Estilos";
localeStrings["es-es"]["Sandbox"] = 				"Salvadera";
localeStrings["es-es"]["Add"] = 					"Añadir";
localeStrings["es-es"]["Styles"] = 					"Estilos";
localeStrings["es-es"]["Style Code"] = 				"Código De Estilo";
localeStrings["es-es"]["Copy"] = 					"Copiar";
localeStrings["es-es"]["Text Size"] = 				"Tamano Del Texto";
localeStrings["es-es"]["Press Ctrl C"] = 			"Presione CTRL + C";


//////IMAGES///////////////////////

//ImageElement loads image from URL when added to display.
var urlImgBlueMarble = "BlueMarble.jpg";

//Pre-load images (good for skins)
//var imgBlueMarble = new Image();
//imgBlueMarble.src = "BlueMarble.jpg";


//////STYLES//////////////////////

var canvasManagerStyle = new StyleDefinition();
//canvasManagerStyle.setStyle("BackgroundColor", 			"#CCDD99");
canvasManagerStyle.setStyle("BackgroundColor", 				"#D9C7A6");

var applicationContainerStyle = new StyleDefinition();
applicationContainerStyle.setStyle("PaddingTop", 			4);
applicationContainerStyle.setStyle("PaddingLeft", 			4);
applicationContainerStyle.setStyle("PaddingRight", 			4);
applicationContainerStyle.setStyle("PaddingBottom", 		2);
applicationContainerStyle.setStyle("LayoutGap", 			6);
applicationContainerStyle.setStyle("MinHeight", 			500);

var textTitleStyle = new StyleDefinition();
textTitleStyle.setStyle("TextSize", 						32);
textTitleStyle.setStyle("TextFont", 						"Roboto");

var panelBackgroundShape = new RoundedRectangleShape();
panelBackgroundShape.setStyle("CornerRadius", 				6);

var panelBackgroundStyle = new StyleDefinition();
panelBackgroundStyle.setStyle("BackgroundColor", 			"#FFFFFF");
panelBackgroundStyle.setStyle("BackgroundShape", 			panelBackgroundShape);
panelBackgroundStyle.setStyle("Alpha", 						.35);
panelBackgroundStyle.setStyle("PercentWidth", 				100);
panelBackgroundStyle.setStyle("PercentHeight", 				100);

var panelInnerContainerStyle = new StyleDefinition(); 		
panelInnerContainerStyle.setStyle("Padding", 				6);
panelInnerContainerStyle.setStyle("PercentWidth",			100);
panelInnerContainerStyle.setStyle("PercentHeight",			100);

var hDividerLineStyle = new StyleDefinition();				
hDividerLineStyle.setStyle("Height", 						1); 
hDividerLineStyle.setStyle("PercentWidth", 					100);
hDividerLineStyle.setStyle("BackgroundColor", 				"#999999");


//////Clear Style Button
var clearStyleButtonStyle = new StyleDefinition();

//Skin styles
var clearStyleButtonUpSkinStyleDef = new StyleDefinition();
clearStyleButtonUpSkinStyleDef.setStyle("BackgroundColor", "#FF7777");

var clearStyleButtonOverSkinStyleDef = new StyleDefinition();
clearStyleButtonOverSkinStyleDef.setStyle("BackgroundColor", "#EE5555");

var clearStyleButtonDownSkinStyleDef = new StyleDefinition();
clearStyleButtonDownSkinStyleDef.setStyle("BackgroundColor", "#DD3333");

clearStyleButtonStyle.setStyle("UpSkinStyle", clearStyleButtonUpSkinStyleDef);
clearStyleButtonStyle.setStyle("OverSkinStyle", clearStyleButtonOverSkinStyleDef);
clearStyleButtonStyle.setStyle("DownSkinStyle", clearStyleButtonDownSkinStyleDef);
clearStyleButtonStyle.setStyle("SkinClass", CloseButtonSkinElement);	//Draws an "X" across the button.
clearStyleButtonStyle.setStyle("Width", 15);
clearStyleButtonStyle.setStyle("Height", 15);
clearStyleButtonStyle.setStyle("BackgroundShape", new EllipseShape());


//////Add Style Dropdown
var addStyleDropdownListStyle = new StyleDefinition();
addStyleDropdownListStyle.setStyle("ListItemClass", AddStyleDataRenderer); //Custom item renderer (renders row in dropdown list)
addStyleDropdownListStyle.setStyle("Selectable", false); //Disable the list's normal selection mechanism

var addStyleDropdownStyle = new StyleDefinition();
addStyleDropdownStyle.setStyle("PopupDataListStyle", addStyleDropdownListStyle);

////Font size buttons
var fontSizeButtonStyle = new StyleDefinition();
fontSizeButtonStyle.setStyle("SkinClass", ScrollButtonSkinElement);
fontSizeButtonStyle.setStyle("Width", 14);
fontSizeButtonStyle.setStyle("PercentHeight", 100);



//////APPLICATION////////////////

//Globals go here...//

//Root application
var styleExplorer = null; //Best not to initialize here, avoid file ordering dependencies.

//Run application
function init()
{
	//Initialize globals
	styleExplorer = new StyleExplorerApplication();
	styleExplorer.setCanvas(document.getElementById("canvasStyleExplorer"));
}

