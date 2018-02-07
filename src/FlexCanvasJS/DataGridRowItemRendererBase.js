
/**
 * @depends DataRendererBaseElement.js
 */

///////////////////////////////////////////////////////////////////////
////////////////////DataGridRowItemRendererBase////////////////////////

/**
 * @class DataGridRowItemRendererBase
 * @inherits DataRendererBaseElement
 * 
 * Abstract base class for DataGrid row item rendering. Any CanvasElement
 * can be a data renderer. This class is just here for convenience as it
 * implements some commonly used functionality if you wish to subclass it. 
 * 
 * Adds skin states and styles for "up", "alt", "over", and "selected" states. 
 * 
 * @constructor DataGridRowItemRendererBase 
 * Creates new DataGridRowItemRendererBase instance.
 */
function DataGridRowItemRendererBase()
{
	DataGridRowItemRendererBase.base.prototype.constructor.call(this);
}
	
//Inherit from DataRendererBaseElement
DataGridRowItemRendererBase.prototype = Object.create(DataRendererBaseElement.prototype);
DataGridRowItemRendererBase.prototype.constructor = DataGridRowItemRendererBase;
DataGridRowItemRendererBase.base = DataRendererBaseElement;


/////////////Internal///////////////////////////

//@override
DataGridRowItemRendererBase.prototype._updateState = 
	function ()
	{
		DataGridRowItemRendererBase.base.prototype._updateState.call(this);
	
//		var newState = "";
//	
//		if (this._listSelected == true)
//			newState = "selected";
//		else if (this._mouseIsOver == true && this.getStyle("Selectable") == true)
//			newState = "over";
//		else // "up"
//		{
//			if (this._listData == null || this._listData._itemIndex % 2 == 0)
//				newState = "up";
//			else
//				newState = "alt";
//		}
//		
//		this.setStyle("SkinState", newState);
	};



