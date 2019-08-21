

//DataRenderer used to render the add style drop down list items.
//We're toggling some styles depending on if we're rendering a header
//or a style item. Also adding a horizontal divider line (visible when 
//we're a header) and a checkbox (visible when we're a style item).

//A DataRenderer is any element that implements _setListData(). Any 
//element can be a DataRenderer. We're using DataRendererLabelElement
//because it already implements a label, and up, alt, over, selected 
//skin states.

function AddStyleDataRenderer() //extends DataRendererLabelElement
{
	AddStyleDataRenderer.base.prototype.constructor.call(this);
	
	////Add children
	
	//Used only for header
	this._divider = new CanvasElement();
	this._divider.setStyle("BackgroundFill", "#000000");
	
	//Used only for selectable style
	this._checkboxSelected = new CheckboxElement();
	
	//Add both and we'll just toggle visibility based on state.
	this._addChild(this._divider);
	this._addChild(this._checkboxSelected);
	
	
	////Event handling
	var _self = this;
	
	//Private handler, need function for each instance, proxy to prototype.
	this._onAddStyleDataRendererClickInstance = 
		function (event)
		{
			_self._onAddStyleDataRendererClick(event);
		};
	
	this.addEventListener("click", this._onAddStyleDataRendererClickInstance);
}

//Inherit from DataRendererLabelElement
AddStyleDataRenderer.prototype = Object.create(DataRendererLabelElement.prototype);
AddStyleDataRenderer.prototype.constructor = AddStyleDataRenderer;
AddStyleDataRenderer.base = DataRendererLabelElement;

AddStyleDataRenderer.prototype._onAddStyleDataRendererClick =
	function (event)
	{
		//The popup DataList selection is disabled via styling (Selectable = "false"),
		//so we need to close it ourself.
	
		//Close the dropdown unless we clicked the checkbox itself and exclude headers.
		if (event.getTarget() != this._checkboxSelected && this._itemData.styleName != "")
			this._listData._parentList._owner.close(true);
	};

//@override - DataList sets our associated row / collection data.
AddStyleDataRenderer.prototype._setListData = 
	function (listData, itemData)
	{
		AddStyleDataRenderer.base.prototype._setListData.call(this, listData, itemData);
		
		////Adjust our state based on list supplied data////
		
		if (this._itemData.styleName == "") //Header
		{
			this.setStyle("PaddingTop", 2);
			this.setStyle("PaddingBottom", 1);
			this.setStyle("PaddingLeft", 4);
			this.setStyle("PaddingRight", 10);
			this.setStyle("TextStyle", "bold");
			this.setStyle("Selectable", false);
			this._divider.setStyle("Visible", true);
			this._checkboxSelected.setStyle("Visible", false);
		}
		else //Selectable style
		{
			this.setStyle("PaddingTop", 4);
			this.setStyle("PaddingBottom", 4);
			this.setStyle("PaddingLeft", 14);
			this.setStyle("PaddingRight", 10);
			this.setStyle("TextStyle", "normal");
			this.setStyle("Selectable", true);
			this._divider.setStyle("Visible", false);
			this._checkboxSelected.setStyle("Visible", true);
	
			//Style is defined
			if (this._itemData.styleName in this._itemData.styleDefinition._styleMap)
				this._checkboxSelected.setSelected(true);
			else //Style not defined
				this._checkboxSelected.setSelected(false);
		}
	};
	
//@override	
AddStyleDataRenderer.prototype._doLayout = 
	function (paddingMetrics)
	{
		AddStyleDataRenderer.base.prototype._doLayout.call(this, paddingMetrics);
		
		//Convienence
		var x = paddingMetrics.getX();
		var y = paddingMetrics.getY();
		var w = paddingMetrics.getWidth();
		var h = paddingMetrics.getHeight();
		
		////Size and position child elements////////////
		
		this._divider._setActualPosition(x, this._height - 1);
		this._divider._setActualSize(w, 1);
		
		this._checkboxSelected._setActualSize(this._labelElement._height, this._labelElement._height);
		this._checkboxSelected._setActualPosition(x + w - this._checkboxSelected._width, Math.round(y + (h / 2) - (this._checkboxSelected._height / 2)));
	};	
	
	
