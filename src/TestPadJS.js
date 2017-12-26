







//var textField1 = new TextFieldElement();
//var label1 = new LabelElement();
//var text1 = new TextElement();
//var textInput1 = new TextInputElement();
//var element1 = new CanvasElement();
//
//var radioButton1 = new RadioButtonElement();
//var checkbox1 = new CheckboxElement();
//var button1 = new ButtonElement();

//var button1DefaultOverDef = new StyleDefinition();
//button1DefaultOverDef.setStyle("BackgroundColor", "#00FF00");

//var button1DefaultDef = new StyleDefinition();
//button1DefaultDef.setStyle("BackgroundColor", "#0000FF");

//button1DefaultDef.setStyle("OverSkinStyle", button1DefaultOverDef);


var canvasManager = new CanvasManager();

var button1 = new CheckboxElement();

//var button1StyleDef = new StyleDefinition();
//button1StyleDef.setStyle("TextColor", "#FF0000");
//button1StyleDef.setStyle("OverTextColor", "#00FF00");
//
//var label1 = new LabelElement();
//var toggleButton1 = new ToggleButtonElement();
//var radioButton1 = new RadioButtonElement();
//var checkbox1 = new CheckboxElement();

function init()
{
	
	button1.setStyle("Text", "Test Button");
	button1.setStyle("X", 50);
	button1.setStyle("Y", 50);
	//button1.setStyle("PaddingTop", 5);
	button1.setStyle("AllowDeselect", true);
//	button1.setStyle("TextLinePaddingTop", 5);
//	button1.setStyle("TextLinePaddingBottom", 18);
//	button1.setStyleDefinition(button1StyleDef);
	
//	label1.setStyle("Text", "Test Button");
//	label1.setStyle("X", 50);
//	label1.setStyle("Y", 50);
	
	canvasManager.addElement(button1);
	canvasManager.setCanvas(document.getElementById("canvasTest"));
	
	
//	button1.setStyle("Text", "Test Button");
//	button1._setStyleDefinitionDefault(button1DefaultDef);
//	
//	canvasManager.addElement(button1);
//	canvasManager.setCanvas(document.getElementById("canvasTest"));
	
	
	
	//canvasManager.setStyle("ShowRedrawRegion", true);
	
}





