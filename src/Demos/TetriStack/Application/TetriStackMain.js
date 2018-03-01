
//////IMAGES///////////////////////



//////STYLES//////////////////////

var ButtonDownSkinStyle = new StyleDefinition();
ButtonDownSkinStyle.setStyle("BackgroundColor", "#BEBEBE");

var ButtonOverSkinStyle = new StyleDefinition();
ButtonOverSkinStyle.setStyle("BackgroundColor", "#AFAFAF");

var ButtonUpSkinStyle = new StyleDefinition();
ButtonUpSkinStyle.setStyle("BackgroundColor", "#9F9F9F");

var ButtonDisabledSkinStyle = new StyleDefinition();
ButtonDisabledSkinStyle.setStyle("BackgroundColor", "#777777");

var buttonBackgroundColors = new StyleDefinition();
buttonBackgroundColors.setStyle("DownSkinStyle", ButtonDownSkinStyle);
buttonBackgroundColors.setStyle("OverSkinStyle", ButtonOverSkinStyle);
buttonBackgroundColors.setStyle("UpSkinStyle", ButtonUpSkinStyle);
buttonBackgroundColors.setStyle("DisabledSkinStyle", ButtonDisabledSkinStyle);
buttonBackgroundColors.setStyle("BorderType", null);
buttonBackgroundColors.setStyle("AutoGradientType", null);


var buttonPlayBackgroundShape = new RoundedRectangleShape();
buttonPlayBackgroundShape.setStyle("CornerRadius", 5);

var buttonPlayStyle = new StyleDefinition();
buttonPlayStyle.setStyle("Padding", 5);
buttonPlayStyle.setStyle("PaddingLeft", 30);
buttonPlayStyle.setStyle("PaddingRight", 30);
buttonPlayStyle.setStyle("TextFont", "Audiowide");
buttonPlayStyle.setStyle("TextSize", 22);
buttonPlayStyle.setStyle("TextStyle", "bold");
buttonPlayStyle.setStyle("BackgroundShape", buttonPlayBackgroundShape);

var labelControlsStyle = new StyleDefinition();
labelControlsStyle.setStyle("TextSize", 17);
labelControlsStyle.setStyle("TextFont", "Audiowide");
labelControlsStyle.setStyle("TextColor", "#DDDDDD");
labelControlsStyle.setStyle("TextHorizontalAlign", "center");

var labelControlsDividerStyle = new StyleDefinition();
labelControlsDividerStyle.setStyle("PercentHeight", 70);
labelControlsDividerStyle.setStyle("Width", 1);
labelControlsDividerStyle.setStyle("BackgroundColor", "#DDDDDD");




//////APPLICATION////////////////

//Globals go here...//

//Root application
var tetriStack = null; //Best not to initialize here, avoid file ordering dependencies.

//Run application
function init()
{
	//Initialize globals
	tetriStack = new TetriStackApplication();
	tetriStack.setCanvas(document.getElementById("canvasTetriStack"));
}

