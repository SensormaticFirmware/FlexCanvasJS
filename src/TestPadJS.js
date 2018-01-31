

//Create elements
var canvasManager = new CanvasManager();
var dropdown = new DropdownElement();

function init()
{
	//Attach the DOM canvas to our CanvasManager
	canvasManager.setCanvas(document.getElementById("flexCanvasApplication"));
	
	var dropdownLocaleCollection = new ListCollection();
	dropdownLocaleCollection.addItem({key:"en-us", label:"English"});
	dropdownLocaleCollection.addItem({key:"es-es", label:"Espanol"});
	
	dropdown.setListCollection(dropdownLocaleCollection);
	dropdown.setSelectedIndex(0);
	
	//Add dropdown to CanvasManager
	canvasManager.addElement(dropdown);
}





