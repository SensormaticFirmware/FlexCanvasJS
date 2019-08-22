# FlexCanvasJS

#### RIA Web Application Framework for HTML5 Canvas ####

Easily create rich internet applications using the HTML5 canvas.

FlexCanvasJS provides highly customizable user interactive canvas display elements, hierarchical parent / child display list, UI events, styling and skinning, relative and dynamic layouts, automatic redraw regions, and includes many UI controls such as buttons, checkboxes, dropdowns, datagrids, color pickers, date pickers, editable and wrapping text controls, and more, while also allowing easy creation of custom components or controls.

Most typical UI events including capture and bubbling phases are supported including but not limited to mouse, keyboard, focus, rollover, etc... 

Complex scalable layouts are easily achieved by nesting container elements. Data driven containers such as DataList and DataGrid allow displaying very large data sets while only rendering what is visible on screen to maintain excellent performance and will bind too and automatically update as their associated data collection changes. 

A robust styling and skinning system is provided allowing you to easily modify and customize the appearance and behaviour of any UI control. 

FlexCanvasJS does the heavy lifting for you. Render caching, redraw regions, composite layers and effects are all automatic, for good performance  even in the most complex, animated, and heavily layered applications and games. 

### Getting Started ###

All you need is the minified FlexCanvasJS library and a HTML canvas.
Download the minified library from the latest release. 

Example below is using a full screen canvas, although any canvas will work.
  
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset=utf-8>
    <title>FlexCanvasJS Web Application</title>
    <style>
      html, body, canvas { width: 100%; height: 100%; margin: 0; overflow: hidden; }
    </style>
    <script src="FlexCanvasJS_min.js" type="text/javascript"></script> 
  </head>
  <body>
    <!-- Full screen canvas -->
    <canvas id="flexCanvasApplication"></canvas>
  </body>
</html>
```
Now attach the DOM canvas to the FlexCanvasJS CanvasManager and create and style our elements:

```javascript
//Create elements
var canvasManager = new CanvasManager();
var colorPicker = new ColorPickerElement();

function init()
{
	//Attach the DOM canvas to our CanvasManager
	canvasManager.setCanvas(document.getElementById("flexCanvasApplication"));
	
	//Set up our color picker - add style definitions, event listeners, etc.
	colorPicker.setStyle("X", 50);
	colorPicker.setStyle("Y", 50);
	
	//Add colorPicker to CanvasManager
	canvasManager.addElement(colorPicker);
}
```
