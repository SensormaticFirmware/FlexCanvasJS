
//////STYLES//////////////////////

var applicationStyles = new StyleDefinition();
applicationStyles.setStyle("BackgroundColor", "#444444");

/////
var ButtonDownSkinStyle = new StyleDefinition();
ButtonDownSkinStyle.setStyle("BackgroundColor", "#BEBEBE");

var ButtonOverSkinStyle = new StyleDefinition();
ButtonOverSkinStyle.setStyle("BackgroundColor", "#AFAFAF");

var ButtonUpSkinStyle = new StyleDefinition();
ButtonUpSkinStyle.setStyle("BackgroundColor", "#9F9F9F");

var ButtonDisabledSkinStyle = new StyleDefinition();
ButtonDisabledSkinStyle.setStyle("BackgroundColor", "#777777");

var buttonBackgroundShapeStyle = new RoundedRectangleShape();
buttonBackgroundShapeStyle.setStyle("CornerRadius", 5);

var buttonBackgroundStyle = new StyleDefinition();
buttonBackgroundStyle.setStyle("DownSkinStyle", ButtonDownSkinStyle);
buttonBackgroundStyle.setStyle("OverSkinStyle", ButtonOverSkinStyle);
buttonBackgroundStyle.setStyle("UpSkinStyle", ButtonUpSkinStyle);
buttonBackgroundStyle.setStyle("DisabledSkinStyle", ButtonDisabledSkinStyle);
buttonBackgroundStyle.setStyle("BorderType", null);
buttonBackgroundStyle.setStyle("AutoGradientType", null);
buttonBackgroundStyle.setStyle("BackgroundShape", buttonBackgroundShapeStyle);
/////

var buttonPlayStyle = new StyleDefinition();
buttonPlayStyle.setStyle("Padding", 5);
buttonPlayStyle.setStyle("PaddingLeft", 30);
buttonPlayStyle.setStyle("PaddingRight", 30);
buttonPlayStyle.setStyle("TextFont", "Audiowide");
buttonPlayStyle.setStyle("TextSize", 22);
buttonPlayStyle.setStyle("TextStyle", "bold");
buttonPlayStyle.setStyle("Text", "PLAY");

var buttonMenuStyle = new StyleDefinition();
buttonMenuStyle.setStyle("TextFont", "Audiowide");
buttonMenuStyle.setStyle("TextSize", 22);
buttonMenuStyle.setStyle("TextStyle", "bold");
buttonMenuStyle.setStyle("Text", "MENU");

var labelSelectLevelStyle = new StyleDefinition();
labelSelectLevelStyle.setStyle("Text", "Start At Level");
labelSelectLevelStyle.setStyle("TextSize", 22);
labelSelectLevelStyle.setStyle("TextStyle", "bold");
labelSelectLevelStyle.setStyle("TextFont", "Audiowide");
labelSelectLevelStyle.setStyle("TextColor", "#DDDDDD");

var labelControlsStyle = new StyleDefinition();
labelControlsStyle.setStyle("TextSize", 17);
labelControlsStyle.setStyle("TextFont", "Audiowide");
labelControlsStyle.setStyle("TextColor", "#DDDDDD");
labelControlsStyle.setStyle("TextStyle", "bold");
labelControlsStyle.setStyle("TextHorizontalAlign", "center");
labelControlsStyle.setStyle("PercentWidth", 100);
labelControlsStyle.setStyle("TextHorizontalAlign", "left");

var labelControlsValueStyle = new StyleDefinition();
labelControlsValueStyle.setStyle("TextSize", 17);
labelControlsValueStyle.setStyle("TextFont", "Audiowide");
labelControlsValueStyle.setStyle("TextColor", "#DDDDDD");
labelControlsValueStyle.setStyle("TextHorizontalAlign", "center");

var labelControlsValueCol1Style = new StyleDefinition();
labelControlsValueCol1Style.setStyle("Width", 100);

var labelControlsValueCol2Style = new StyleDefinition();
labelControlsValueCol2Style.setStyle("Width", 150);

var labelControlsValueCol3Style = new StyleDefinition();
labelControlsValueCol3Style.setStyle("Width", 120);
labelControlsValueCol3Style.setStyle("TextHorizontalAlign", "right");

var labelControlsDividerStyle = new StyleDefinition();
labelControlsDividerStyle.setStyle("PercentHeight", 70);
labelControlsDividerStyle.setStyle("Width", 1);
labelControlsDividerStyle.setStyle("BackgroundColor", "#DDDDDD");

var labelPlayFieldStyle = new StyleDefinition();
labelPlayFieldStyle.setStyle("TextStyle", "bold");
labelPlayFieldStyle.setStyle("TextFont", "Audiowide");
labelPlayFieldStyle.setStyle("TextColor", "#DDDDDD");

var labelPlayFieldStartCountSizeStyle = new StyleDefinition();
labelPlayFieldStartCountSizeStyle.setStyle("TextSize", 80);

var labelPlayFieldExLargeSizeStyle = new StyleDefinition();
labelPlayFieldExLargeSizeStyle.setStyle("TextSize", 36);

var labelPlayFieldLargeSizeStyle = new StyleDefinition();
labelPlayFieldLargeSizeStyle.setStyle("TextSize", 24);

var labelPlayFieldSmallSizeStyle = new StyleDefinition();
labelPlayFieldSmallSizeStyle.setStyle("TextSize", 18);

var scoreControlsDividerStyle = new StyleDefinition();
scoreControlsDividerStyle.setStyle("PercentWidth", 80);
scoreControlsDividerStyle.setStyle("Height", 1);
scoreControlsDividerStyle.setStyle("BackgroundColor", "#DDDDDD");

////
var playFieldOuterContainerBackgroundShapeStyle = new RoundedRectangleShape();
playFieldOuterContainerBackgroundShapeStyle.setStyle("CornerRadius", 5);

var playFieldOuterContainerStyle = new StyleDefinition();
playFieldOuterContainerStyle.setStyle("BackgroundColor", "#DDDDDD");
playFieldOuterContainerStyle.setStyle("BackgroundShape", playFieldOuterContainerBackgroundShapeStyle);
////

var playFieldInnerContainerStyle = new StyleDefinition();
playFieldInnerContainerStyle.setStyle("BackgroundColor", "#202020");
playFieldInnerContainerStyle.setStyle("Top", 3);
playFieldInnerContainerStyle.setStyle("Bottom", 3);
playFieldInnerContainerStyle.setStyle("Left", 3);
playFieldInnerContainerStyle.setStyle("Right", 3);


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

