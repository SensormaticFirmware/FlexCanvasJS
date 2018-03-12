
//////STYLES//////////////////////

var applicationStyles = new StyleDefinition();
applicationStyles.setStyle("BackgroundColor", "#444444");

//Increase the line padding to handle characters with low hanging decenders.
applicationStyles.setStyle("TextLinePaddingTop", 2);
applicationStyles.setStyle("TextLinePaddingBottom", 2);

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

//Handle button & checkbox
var buttonBackgroundStyle = new StyleDefinition();
buttonBackgroundStyle.setStyle("DownSkinStyle", ButtonDownSkinStyle);
buttonBackgroundStyle.setStyle("OverSkinStyle", ButtonOverSkinStyle);
buttonBackgroundStyle.setStyle("UpSkinStyle", ButtonUpSkinStyle);
buttonBackgroundStyle.setStyle("SelectedDownSkinStyle", ButtonDownSkinStyle);
buttonBackgroundStyle.setStyle("SelectedOverSkinStyle", ButtonOverSkinStyle);
buttonBackgroundStyle.setStyle("SelectedUpSkinStyle", ButtonUpSkinStyle);
buttonBackgroundStyle.setStyle("DisabledSkinStyle", ButtonDisabledSkinStyle);
buttonBackgroundStyle.setStyle("BorderType", null);
buttonBackgroundStyle.setStyle("AutoGradientType", null);
buttonBackgroundStyle.setStyle("BackgroundShape", buttonBackgroundShapeStyle);
/////

var textCreditsStyle = new StyleDefinition();
textCreditsStyle.setStyle("TextFont", "Arial");
textCreditsStyle.setStyle("TextStyle", "bold");
textCreditsStyle.setStyle("TextColor", "#DDDDDD");
textCreditsStyle.setStyle("TextSize", 14);

var textLinkStyle = new StyleDefinition();
textLinkStyle.setStyle("TextDecoration", "underline");
textLinkStyle.setStyle("Cursor", "pointer");

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

var labelSelectStyle = new StyleDefinition();
labelSelectStyle.setStyle("TextSize", 22);
labelSelectStyle.setStyle("TextStyle", "bold");
labelSelectStyle.setStyle("TextFont", "Audiowide");
labelSelectStyle.setStyle("TextColor", "#DDDDDD");

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
labelPlayFieldSmallSizeStyle.setStyle("TextSize", 20);

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


/////////SOUNDS//////////////////

var sound_countdownbeep = new Audio(["Sounds/37732__longhairman__1khz-1ds-peep.mp3"]);
var sound_countdownLicenseData = {
	
	name:"1khz-1ds-peep",
	link:"https://freesound.org/people/Longhairman/sounds/37732/",
	
	author:"Longhairman",
	authorLink:"https://freesound.org/people/Longhairman/",
	
	license:"CC0 1.0",
	licenseLink:"https://creativecommons.org/publicdomain/zero/1.0/"		
};
sound_countdownbeep.volume = 0.35;

var sound_rotate = new Audio(["Sounds/187024__lloydevans09__jump2.mp3"]);
var sound_rotateLicenseData = {
	
	name:"jump2",
	link:"https://freesound.org/people/LloydEvans09/sounds/187024/",
	
	author:"LloydEvans09",
	authorLink:"https://freesound.org/people/LloydEvans09/",
	
	license:"CC BY 3.0",
	licenseLink:"https://creativecommons.org/licenses/by/3.0/"	
};

var sound_lineComplete = new Audio(["Sounds/109662__grunz__success.mp3"]);
var sound_lineCompleteLicenseData = {
	
	name:"success",
	link:"https://freesound.org/people/grunz/sounds/109662/",
	
	author:"grunz",
	authorLink:"https://freesound.org/people/grunz/",
	
	license:"CC BY 3.0",
	licenseLink:"https://creativecommons.org/licenses/by/3.0/"		
};

var sound_levelUp = new Audio(["Sounds/320777__rhodesmas__action-01.mp3"]);
var sound_levelUpLicenseData = {
	
	name:"action-01",
	link:"https://freesound.org/people/rhodesmas/sounds/320777/",
	
	author:"rhodesmas",
	authorLink:"https://freesound.org/people/rhodesmas/",
	
	license:"CC BY 3.0",
	licenseLink:"https://creativecommons.org/licenses/by/3.0/"		
};

var sound_music = new Audio(["Sounds/382931__frankum__vintage-techno-house-loop-110bpm.mp3"]);
var sound_musicLicenseData = {
		
		name:"vintage-techno-house-loop-110bpm",
		link:"https://freesound.org/people/frankum/sounds/382931/",
		
		author:"frankum",
		authorLink:"https://freesound.org/people/frankum/",
		
		license:"CC BY 3.0",
		licenseLink:"https://creativecommons.org/licenses/by/3.0/"		
	};
sound_music.loop = true;


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

