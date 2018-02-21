
//////STRINGS/////////////////////

var localeStrings = Object.create(null);

//all/////////
localeStrings["all"] = Object.create(null);
localeStrings["all"]["FlexCanvasJS"] = 				"FlexCanvasJS";
localeStrings["all"]["Style Explorer"] = 			"Style Explorer";


//en-us////////
localeStrings["en-us"] = Object.create(null);
localeStrings["en-us"]["Powered By"] = 				"Powered By"; 


//es-es////////
localeStrings["es-es"] = Object.create(null);
localeStrings["es-es"]["Powered By"] = 				"Desarrollado Por";


//////IMAGES///////////////////////



//////STYLES//////////////////////

var canvasManagerStyle = new StyleDefinition();
//canvasManagerStyle.setStyle("BackgroundColor", 			"#CCDD99");
canvasManagerStyle.setStyle("BackgroundColor", 				"#D9C7A6");



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