
function StyleListRenderer()
{
	StyleListRenderer.base.prototype.constructor.call(this);
	
	////Layout
	this.setStyle("LayoutGap", 4);
	this.setStyle("PercentWidth", 100);
	
		this._dropdownAdd = new DropdownElement();
		this._dropdownAdd.setStyle("PercentWidth", 100);
		this._dropdownAdd.setStyle("ItemLabelFunction", StyleListRenderer.addStyleDropdownLabelFunction);
		this._dropdownAdd.setStyleDefinitions(addStyleDropdownStyle);
	
	this.addElement(this._dropdownAdd);	
		
	
	////Event handlers
	var _self = this;
	
	//Private event handlers, proxy to prototype.
	this._onLocaleChangedInstance = 
		function (event)
		{
			_self._onLocaleChanged(event);
		};
	this._onDropdownAddListItemClickInstance = 
		function (event)
		{
			_self._onDropdownAddListItemClick(event);
		};
	this._onItemRendererClearedInstance = 
		function (event)
		{
			_self._onItemRendererCleared(event);
		};
		
	this.addEventListener("localechanged", this._onLocaleChangedInstance);
	this._dropdownAdd.addEventListener("listitemclick", this._onDropdownAddListItemClickInstance);
	
	
	////Functional
	this._styleControlType = null;
}

//Inherit from ListContainer
StyleListRenderer.prototype = Object.create(ListContainerElement.prototype);
StyleListRenderer.prototype.constructor = StyleListRenderer;
StyleListRenderer.base = ListContainerElement;

//////STATIC//////////////////// 

StyleListRenderer.addStyleDropdownLabelFunction = 
	function (itemData)
	{
		if (itemData.styleName != "")
			return itemData.styleName;
		
		return itemData.category;
	};

//////INTERNAL/////////////////

StyleListRenderer.prototype._onLocaleChanged = 
	function (event)
	{
		if (this._styleControlType == null || this.getManager() == null)
			return;
	
		var currentLocale = this.getManager().getLocale();
		
		var dropdownText = localeStrings[currentLocale]["Add"] + " " + this._styleControlType.styleName;
		
		//Most substyles end with "Style", the ones that dont like "BackgroundShape" we add it to the end for consistency.
		if (dropdownText.indexOf("Style") != dropdownText.length - 5)
			dropdownText = dropdownText + "Style";
		
		this._dropdownAdd.setStyle("Text", dropdownText);
	};

StyleListRenderer.prototype._onDropdownAddListItemClick = 
	function (elementListItemClickEvent)
	{
		var styleControlType = elementListItemClickEvent.getItem();
		
		//Header (ignore)
		if (styleControlType.styleName == "")
			return;
		
		var itemRenderer;
		
		//Unchecked
		if (styleControlType.styleName in styleControlType.styleDefinition._styleMap)
		{
			for (var i = 1; i < this.getNumElements(); i++)
			{
				itemRenderer = this.getElementAt(i);
				if (itemRenderer._styleControlType == styleControlType)
				{
					this._clearItemRenderer(itemRenderer);
					break;
				}
			}
		}
		else //Checked
		{
			itemRenderer = new StyleItemRenderer();
			itemRenderer.addEventListener("cleared", this._onItemRendererClearedInstance);
			
			this.addElementAt(itemRenderer, 1);
			itemRenderer.setStyleControlType(styleControlType);
			
			this._styleControlType.styleList.indexUpdated(this._styleControlType.styleList.getItemIndex(styleControlType));
		}
	};

StyleListRenderer.prototype._onItemRendererCleared = 
	function (event)
	{
		this._clearItemRenderer(event.getTarget());		
	}	;
	
StyleListRenderer.prototype._clearItemRenderer = 
	function (itemRenderer)
	{
		var styleControlType = itemRenderer._styleControlType;
		
		styleControlType.styleDefinition.clearStyle(styleControlType.styleName);
		styleControlType.styleListCodeString = "";
		styleControlType.styleItemCodeString = "";
		
		itemRenderer.removeEventListener("cleared", this._onItemRendererClearedInstance);
		this._styleControlType.styleList.indexUpdated(this._styleControlType.styleList.getItemIndex(styleControlType));
		
		this.removeElement(itemRenderer);
		
		//Dispatch an event from the manager to fire the styling code re-build.
		this.getManager()._dispatchEvent(new DispatcherEvent("stylingchanged"));
	};

//////PUBLIC///////////////////

StyleListRenderer.prototype.setStyleControlType = 
	function (styleControlType)
	{
		this._styleControlType = styleControlType;
		this._onLocaleChanged(null); //Update localized labels.
		
		while (this.getNumElements() > 1)
		{
			this.getElementAt(1).removeEventListener("cleared", this._onItemRendererClearedInstance);
			this.removeElementAt(1);
		}
		
		this._dropdownAdd.setListCollection(styleControlType.styleList);
		
		var sct;
		for (var i = 0; i < styleControlType.styleList.getLength(); i++)
		{
			sct = styleControlType.styleList.getItemAt(i);
			
			//Header Item
			if (sct.styleName == "")
				continue;
			
			//Defined style item
			if (sct.styleName in sct.styleDefinition._styleMap)
			{
				var itemRenderer = new StyleItemRenderer();
				itemRenderer.addEventListener("cleared", this._onItemRendererClearedInstance);
				itemRenderer.setStyleControlType(sct);
				
				this.addElementAt(itemRenderer, 1);
			}
		}
	};

	
	