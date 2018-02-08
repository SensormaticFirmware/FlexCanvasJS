
/**
 * @depends DataRendererBaseElement.js
 */

///////////////////////////////////////////////////////////////////////
////////////////////DataGridItemRendererBase////////////////////////

/**
 * @class DataGridItemRendererBase
 * @inherits DataRendererBaseElement
 * 
 * Abstract base class for DataGrid row item rendering. Any CanvasElement
 * can be a data renderer. This class is just here for convenience as it
 * implements some commonly used functionality if you wish to subclass it. 
 * 
 * Adds skin states and styles for "up", "alt", "over", and "selected" states. 
 * 
 * @constructor DataGridItemRendererBase 
 * Creates new DataGridItemRendererBase instance.
 */
function DataGridItemRendererBase()
{
	DataGridItemRendererBase.base.prototype.constructor.call(this);
}
	
//Inherit from DataRendererBaseElement
DataGridItemRendererBase.prototype = Object.create(DataRendererBaseElement.prototype);
DataGridItemRendererBase.prototype.constructor = DataGridItemRendererBase;
DataGridItemRendererBase.base = DataRendererBaseElement;

DataGridItemRendererBase.UpSkinStyleDefault = new StyleDefinition();
DataGridItemRendererBase.UpSkinStyleDefault.setStyle("BackgroundColor", 			"#FFFFFF");
DataGridItemRendererBase.UpSkinStyleDefault.setStyle("AutoGradientType", 			"none");

DataGridItemRendererBase.AltSkinStyleDefault = new StyleDefinition();
DataGridItemRendererBase.AltSkinStyleDefault.setStyle("BackgroundColor", 			"#F0F0F0");
DataGridItemRendererBase.AltSkinStyleDefault.setStyle("AutoGradientType", 			"none");

DataGridItemRendererBase.StyleDefault = new StyleDefinition();
DataGridItemRendererBase.StyleDefault.setStyle("UpSkinStyle", DataGridItemRendererBase.UpSkinStyleDefault);
DataGridItemRendererBase.StyleDefault.setStyle("AltSkinStyle", DataGridItemRendererBase.AltSkinStyleDefault);


/////////////Internal///////////////////////////

//@override
DataGridItemRendererBase.prototype._updateState = 
	function ()
	{
		DataGridItemRendererBase.base.prototype._updateState.call(this);
		
		if (this._listSelected != null && this._listSelected.selected == true)
			newState = "selected";
		else if (this._listSelected != null && this._listSelected.highlight == true)
			newState = "over";
		else
		{
			if (this._listData == null || this._listData._itemIndex % 2 == 0)
				newState = "up";
			else
				newState = "alt";
		}
	
		this.setStyle("SkinState", newState);
	};



