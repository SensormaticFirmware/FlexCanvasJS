/**
 * @depends StyleableBase.js
 */

///////////////////////////////////////////////////////////////////////////	
/////////////////GridContainerRowColumnDefinition//////////////////////////

/**
 * @class GridContainerRowColumnDefinition
 * @inherits StyleableBase
 * 
 * GridContainerRowColumnDefinition defines and stores styles used by 
 * the GridContainerElement to layout rows and columns.
 * 
 * @constructor GridContainerRowColumnDefinition 
 * Creates new GridContainerRowColumnDefinition instance.
 */

function GridContainerRowColumnDefinition()
{
	GridContainerRowColumnDefinition.base.prototype.constructor.call(this);
}

//Inherit from StyleableBase
GridContainerRowColumnDefinition.prototype = Object.create(StyleableBase.prototype);
GridContainerRowColumnDefinition.prototype.constructor = GridContainerRowColumnDefinition;
GridContainerRowColumnDefinition.base = StyleableBase;


/////////////Style Types///////////////////////////////

GridContainerRowColumnDefinition._StyleTypes = Object.create(null);

/**
 * @style Size Number
 * 
 * Size in pixels this row or column should consume. This style overrides all other sizing styles.
 */
GridContainerRowColumnDefinition._StyleTypes.Size = 						StyleableBase.EStyleType.NORMAL;		// number

/**
 * @style PercentSize Number
 * 
 * The percentage of available size the row or column should consume relative to its parent GridContainer. 
 * Note that percentage width is calculated based on the available space left over *after* static sized rows 
 * and columns are considered. Percentages are allowed to add to more than 100 and will consume all of the 
 * available space. When percents add to more than 100 the elements will share the available space
 * per the ratio of percent vs total percent used.
 */
GridContainerRowColumnDefinition._StyleTypes.PercentSize = 					StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style MinSize Number
 * 
 * Minimum number of pixels the row or column should consume.
 * This does not affect rows or columns that have the Size style set.
 */
GridContainerRowColumnDefinition._StyleTypes.MinSize = 						StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style MaxSize Number
 * 
 * Maximum number of pixels the row or column should consume.
 * This does not affect rows or columns that have the Size style set.
 */
GridContainerRowColumnDefinition._StyleTypes.MaxSize = 						StyleableBase.EStyleType.NORMAL;		// number || null

/**
 * @style StretchPriority Number
 * 
 * When rows or columns are forced to stretch due to cells spanning multiple rows or columns,
 * rows or columns with the highest StretchPriority will stretch first, equal priorities will stretch evenly.
 * This does not affect rows or columns that have Size or PercentSize styles set.
 */
GridContainerRowColumnDefinition._StyleTypes.StretchPriority = 				StyleableBase.EStyleType.NORMAL;		// number || null


////////////Default Styles////////////////////////////

GridContainerRowColumnDefinition.StyleDefault = new StyleDefinition();

GridContainerRowColumnDefinition.StyleDefault.setStyle("Size", 						null);
GridContainerRowColumnDefinition.StyleDefault.setStyle("PercentSize", 				null);
GridContainerRowColumnDefinition.StyleDefault.setStyle("MinSize", 					null);
GridContainerRowColumnDefinition.StyleDefault.setStyle("MaxSize", 					null);
GridContainerRowColumnDefinition.StyleDefault.setStyle("StretchPriority", 			0);


