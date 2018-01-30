
/**
 * @depends StyleableBase.js
 * @depends DataGridHeaderItemRenderer.js
 * @depends DataGridLabelItemRenderer.js
 */

///////////////////////////////////////////////////////////////////////
///////////////////DataGridColumnDefinition////////////////////////////		
	
/**
 * @class DataGridColumnDefinition
 * @inherits StyleableBase
 * 
 * DataGridColumnDefinition defines and stores styles necessary for the DataGrid to render columns.
 * 
 * The default HeaderItemClass is DataGridHeaderItemRenderer.
 * The default RowItemClass is DataGridLabelItemRenderer.
 * 
 * 
 * @seealso DataGridElement
 * @seealso DataGridHeaderItemRenderer
 * @seealso DataGridLabelItemRenderer
 * 
 * @constructor DataGridColumnDefinition 
 * Creates new DataGridColumnDefinition instance.
 */
function DataGridColumnDefinition()
{
	DataGridColumnDefinition.base.prototype.constructor.call(this);
}
	
//Inherit from StyleableBase
DataGridColumnDefinition.prototype = Object.create(StyleableBase.prototype);
DataGridColumnDefinition.prototype.constructor = DataGridColumnDefinition;
DataGridColumnDefinition.base = StyleableBase;

/////////////Style Types///////////////////////////////

DataGridColumnDefinition._StyleTypes = Object.create(null);

/**
 * @style PercentSize Number
 * 
 * The percentage of available space the column should consume. Percentages
 * are allowed to add to more than 100 and will consume all of the available space. 
 */
DataGridColumnDefinition._StyleTypes.PercentSize = 					StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style MinSize Number
 * 
 * Minimum number of pixels the column should consume.
 */
DataGridColumnDefinition._StyleTypes.MinSize = 						StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style HeaderLabel String
 * Text label to be used for the column header.
 */
DataGridColumnDefinition._StyleTypes.HeaderLabel = 					StyleableBase.EStyleType.NORMAL;		// "string"

/**
 * @style HeaderItemClass CanvasElement
 * 
 * The DataRenderer CanvasElement constructor to be used for the column header. 
 */
DataGridColumnDefinition._StyleTypes.HeaderItemClass = 				StyleableBase.EStyleType.NORMAL;		// Element constructor()

/**
 * @style HeaderItemStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the HeaderItem DataRenderer.
 */
DataGridColumnDefinition._StyleTypes.HeaderItemStyle = 				StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition

/**
 * @style CollectionSort CollectionSort
 * 
 * CollectionSort to be used to sort the column.
 */
DataGridColumnDefinition._StyleTypes.CollectionSort = 				StyleableBase.EStyleType.NORMAL;		// CollectionSort() 

/**
 * @style RowItemClass CanvasElement
 * 
 * The DataRenderer CanvasElement constructor to be used for this columns rows. 
 */
DataGridColumnDefinition._StyleTypes.RowItemClass = 				StyleableBase.EStyleType.NORMAL;		// Element constructor()

/**
 * @style RowItemStyle StyleDefinition
 * 
 * The StyleDefinition to apply to the RowItem DataRenderer.
 */
DataGridColumnDefinition._StyleTypes.RowItemStyle = 				StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition

/**
 * @style RowItemLabelFunction Function
 * 
 * A function that returns a text string per a supplied collection item and columnIndex. 
 * function (itemData, columnIndex) { return "" }
 */
DataGridColumnDefinition._StyleTypes.RowItemLabelFunction = 		StyleableBase.EStyleType.NORMAL;		// function (data, columnIndex) { return "" }


/////////Default Styles///////////////////////////////

DataGridColumnDefinition.StyleDefault = new StyleDefinition();

DataGridColumnDefinition.StyleDefault.setStyle("PercentSize", 				100);							// number || null
DataGridColumnDefinition.StyleDefault.setStyle("MinSize", 					12);							// number || null

DataGridColumnDefinition.StyleDefault.setStyle("HeaderLabel", 				"");							// "string"
DataGridColumnDefinition.StyleDefault.setStyle("HeaderItemClass", 			DataGridHeaderItemRenderer);	// Element constructor()
DataGridColumnDefinition.StyleDefault.setStyle("HeaderItemStyle", 			null);							// StyleDefinition
DataGridColumnDefinition.StyleDefault.setStyle("CollectionSort", 			null);							// CollectionSort()

DataGridColumnDefinition.StyleDefault.setStyle("RowItemClass", 				DataGridLabelItemRenderer);		// Element constructor()
DataGridColumnDefinition.StyleDefault.setStyle("RowItemStyle", 				null);							// StyleDefinition
DataGridColumnDefinition.StyleDefault.setStyle("RowItemLabelFunction", 		null);							// function (data, columnIndex) { return "" }

