
//Renders an Add Style dropdown and a list of StyleItemRenderer(s).

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
	
	//Manually handling the dropdown listitemclick, because we're disabling the list's normal selection mechanism via styling.
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
		//Sometimes manager is null cause we fire this when we set the controlStyleType
		//which is sometimes prior to being attached to the display chain. Just bail.
		if (this.getManager() == null)
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
			itemRenderer.setStyleControlType(styleControlType);
			
			this.addElementAt(itemRenderer, 1);
			
			this._styleControlType.styleList.indexUpdated(this._styleControlType.styleList.getItemIndex(styleControlType));
		}
	};

//Clear button clicked on StyleItemRenderer	
StyleListRenderer.prototype._onItemRendererCleared = 
	function (event)
	{
		this._clearItemRenderer(event.getTarget());		
	};
	
StyleListRenderer.prototype._clearItemRenderer = 
	function (itemRenderer)
	{
		//This is one of the values in our this._styleControlType.styleList (which is bound to the Add Style dropdown)
		var rendererStyleControlType = itemRenderer._styleControlType;
		
		//Wipe out the style & code string cache
		rendererStyleControlType.styleDefinition.clearStyle(rendererStyleControlType.styleName);
		rendererStyleControlType.styleListCodeString = "";
		rendererStyleControlType.styleItemCodeString = "";
		
		//Fire an indexUpdated event (Update the Add Style dropdown checked state for this style).
		this._styleControlType.styleList.indexUpdated(this._styleControlType.styleList.getItemIndex(rendererStyleControlType));
		
		//Purge StyleItemRenderer
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

	
	