
/**
 * @depends StyleableBase.js
 */

////////////////////////////////////////////////////////
//////////////CursorDefinition//////////////////////////	

/**
 * @class CursorDefinition
 * @inherits StyleableBase
 * 
 * CursorDefintion stores styles necessary to render/animate custom cursors.
 * This is used for CanvasElement's Cursor style (roll-over cursor) and can
 * also be added directly to CanvasManager. 
 *  
 * 
 * @constructor CursorDefinition 
 * Creates new CursorDefinition instance.
 */
function CursorDefinition()
{
	CursorDefinition.base.prototype.constructor.call(this);
	
	this._cursorElement = null;
	this._addedCount = 0;
}

//Inherit from StyleableBase
CursorDefinition.prototype = Object.create(StyleableBase.prototype);
CursorDefinition.prototype.constructor = CursorDefinition;
CursorDefinition.base = StyleableBase;

/////////////Style Types///////////////////////////////

CursorDefinition._StyleTypes = Object.create(null);

/**
 * @style CursorClass CanvasElement
 * 
 * The CanvasElement constructor or browser string type to use for the cursor.
 */
CursorDefinition._StyleTypes.CursorClass = 						{inheritable:false};		// CanvasElement() constructor

/**
 * @style CursorStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the cursor class. (Including Width and Height, unless you've implemented
 * the doMeasure() function into a custom CanvasElement subclass).
 */
CursorDefinition._StyleTypes.CursorStyle = 						{inheritable:false};		// StyleDefinition

/**
 * @style CursorOffsetX Number
 * 
 * The X offset from the actual mouse position the cursor should be rendered.
 */
CursorDefinition._StyleTypes.CursorOffsetX = 					{inheritable:false};		// number

/**
 * @style CursorOffsetY Number
 * 
 * The Y offset from the actual mouse position the cursor should be rendered.
 */
CursorDefinition._StyleTypes.CursorOffsetY = 					{inheritable:false};		// number


///////////Default Styles/////////////////////////////

CursorDefinition.StyleDefault = new StyleDefinition();

CursorDefinition.StyleDefault.setStyle("CursorClass", 							"default"); 	// "browsertype" || CanvasElement() constructor
CursorDefinition.StyleDefault.setStyle("CursorStyle", 							null); 			// StyleDefinition
CursorDefinition.StyleDefault.setStyle("CursorOffsetX", 						0); 			// number
CursorDefinition.StyleDefault.setStyle("CursorOffsetY", 						0); 			// number

