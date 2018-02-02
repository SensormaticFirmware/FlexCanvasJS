
function StyleItemRenderer()
{
	StyleItemRenderer.base.prototype.constructor.call(this);
	
	////Layout
	this.setStyle("PercentWidth", 100);
	this.setStyle("LayoutGap", 4);
	
		this._styleSelectBox = new ListContainerElement();
		this._styleSelectBox.setStyle("LayoutDirection", "horizontal");
		this._styleSelectBox.setStyle("LayoutVerticalAlign", "middle");
		this._styleSelectBox.setStyle("LayoutGap", 4);
		this._styleSelectBox.setStyle("PercentWidth", 100);
		this._styleSelectBox.setStyle("MinHeight", 18);
	
			this._labelStyleName = new LabelElement();
			this._labelStyleName.setStyle("PercentWidth", 100);
			this._labelStyleName.setStyle("PaddingRight", 20);
			
			this._buttonClearStyle = new ButtonElement();
			this._buttonClearStyle.setStyleDefinitions(clearStyleButtonStyle);
			
			this._styleNullCheckbox = null;		//null checkbox
			this._styleChangeControl = null; 	//Dynamic
			
		this._styleSelectBox.addElement(this._labelStyleName);
		this._styleSelectBox.addElement(this._buttonClearStyle);
	
		this._styleListRenderer = null; 	//Renders our list of substyles
		
	this.addElement(this._styleSelectBox);
	
	
	////Event handlers
	var _self = this;
	
	this._onValueChangedInstance = 
		function (event)
		{
			_self._onValueChanged(event);
		};
		
	this._onButtonClearStyleClickInstance = 
		function (event)
		{
			_self._onButtonClearStyleClick(event);
		};
	
	this._onNullCheckboxChangedInstance = 
		function (event)
		{
			_self._onNullCheckboxChanged(event);
		};
		
	this._buttonClearStyle.addEventListener("click", this._onButtonClearStyleClickInstance);
	
	
	////Functional
	this._styleControlType = null;
	
}

//Inherit from ListContainer
StyleItemRenderer.prototype = Object.create(ListContainerElement.prototype);
StyleItemRenderer.prototype.constructor = StyleItemRenderer;
StyleItemRenderer.base = ListContainerElement;

StyleItemRenderer.prototype.setStyleControlType = 
	function (styleControlType)
	{
		this._styleControlType = styleControlType;
	
		this._labelStyleName.setStyle("Text", styleControlType.styleName);
		
		//Remove elements and clean up listener.
		while (this._styleSelectBox.getNumElements() > 2)
			this._styleSelectBox.removeElementAt(1).removeEventListener("changed", this._onValueChangedInstance);
		
		var currentValue = undefined;
		if (styleControlType.styleName in styleControlType.styleDefinition._styleMap)
			currentValue = styleControlType.styleDefinition._styleMap[styleControlType.styleName];

		if (currentValue === undefined)
		{
			if (styleControlType.allowNull == true && styleControlType.initNull == true)
				currentValue = null;
			else
				currentValue = styleControlType.initValue;	
		}
		else if (currentValue instanceof StyleDefinition)
			currentValue =  Object.getPrototypeOf(currentValue).constructor;
		
		if (styleControlType.allowValues == null)
		{
			this._styleChangeControl = new TextInputElement();
			
			if (currentValue == null)
				this._styleChangeControl.setText(styleControlType.initValue);
			else
				this._styleChangeControl.setText(currentValue.toString());
				
			this._styleChangeControl.addEventListener("changed", this._onValueChangedInstance);
		}
		else if (styleControlType.allowValues.length == 1)
		{
			this._styleChangeControl = new LabelElement();
			this._styleChangeControl.setStyle("Text", styleControlType.allowValues[0].label);
		}
		else
		{
			this._styleChangeControl = new DropdownElement();
			this._styleChangeControl.setListCollection(new ListCollection(styleControlType.allowValues));
			
			var index = -1;
			for (var i = 0; i < styleControlType.allowValues.length; i++)
			{
				if ((currentValue != null && currentValue == styleControlType.allowValues[i].value) ||
					(currentValue == null && styleControlType.initValue == styleControlType.allowValues[i].value))
				{
					index = i;
					break;
				}
			}
				
			if (index != -1)
				this._styleChangeControl.setSelectedIndex(index);
			else
				this._styleChangeControl.setSelectedIndex(0);
			
			this._styleChangeControl.addEventListener("changed", this._onValueChangedInstance);
		}
		
		if (styleControlType.allowNull == true)
		{
			this._styleNullCheckbox = new CheckboxElement();
			this._styleNullCheckbox.setStyle("Text", "null");
			this._styleNullCheckbox.setStyle("PaddingRight", 15);
			this._styleNullCheckbox.addEventListener("changed", this._onNullCheckboxChangedInstance);
			
			if (currentValue == null)
				this._styleNullCheckbox.setSelected(true);
			
			this._styleSelectBox.addElementAt(this._styleNullCheckbox, this._styleSelectBox.getNumElements() - 1);
		}
		
		this._styleChangeControl.setStyle("Width", 150);
		this._styleSelectBox.addElementAt(this._styleChangeControl, this._styleSelectBox.getNumElements() - 1);
		
		this._onNullCheckboxChanged(null);
	};

StyleItemRenderer.prototype._onButtonClearStyleClick = 
	function (event)
	{
		this._dispatchEvent(new DispatcherEvent("cleared"));
	};
	
StyleItemRenderer.prototype._onNullCheckboxChanged = 
	function (event)
	{
		if (this._styleNullCheckbox != null && this._styleNullCheckbox.getSelected() == true)
		{
			this._updateStyleValue(null);
			this._styleChangeControl.setStyle("Enabled", false);
		}
		else
		{
			this._onValueChanged(null);
			this._styleChangeControl.setStyle("Enabled", true);
		}
	};
	
StyleItemRenderer.prototype._onValueChanged =
	function (event)
	{
		var value;
		
		if (this._styleControlType.allowValues != null && this._styleControlType.allowValues.length == 1)
			value = this._styleControlType.allowValues[0].value;
		else
		{
			if (this._styleChangeControl instanceof TextInputElement)
				value = this._styleChangeControl.getText();
			else //dropdown 
				value = this._styleChangeControl.getSelectedItem().value;
		}
		
		this._updateStyleValue(value);
	};
	
StyleItemRenderer.prototype._updateStyleValue = 
	function (value)
	{
		var styleDefName = "";
		var parent = this._styleControlType.parent;
		while (parent != null)
		{
			styleDefName = parent.styleName + styleDefName;
			parent = parent.parent;
		}

		//Trim out all the "Style" text except for at the end. (Reduce ridiculously long substyle names)
		var sIndexOf = styleDefName.indexOf("Style");
		while (sIndexOf != -1 && sIndexOf != styleDefName.length - 5)
		{
			styleDefName = (styleDefName.substring(0, sIndexOf) + styleDefName.substring(sIndexOf + 5));
			sIndexOf = styleDefName.indexOf("Style");
		}
		
		this._styleControlType.styleListCodeString = "";
		this._styleControlType.styleItemCodeString = (styleDefName + ".setStyle(\"" + this._styleControlType.styleName + "\", ");
		
		if (value != null)
		{
			if (this._styleControlType.styleType == "number")
			{
				value = Number(value);
				this._styleControlType.styleItemCodeString += (value + ");"); 
			}
			else if (this._styleControlType.styleType == "class")
			{
				var subStyleName = styleDefName + this._styleControlType.styleName;
				
				//Trim sub style name of excessive "Style" text.
				sIndexOf = subStyleName.indexOf("Style");
				while (sIndexOf != -1 && sIndexOf != subStyleName.length - 5)
				{
					subStyleName = (subStyleName.substring(0, sIndexOf) + subStyleName.substring(sIndexOf + 5));
					sIndexOf = subStyleName.indexOf("Style");
				}
				
				this._styleControlType.styleListCodeString = "var " + subStyleName + " = new " + value.toString().match(/function ([A-Z]{1}[a-zA-Z]*)/)[1] + "();\r\n";
				this._styleControlType.styleItemCodeString += (subStyleName + ");"); 
				
				var existingInstance = undefined;
				if (this._styleControlType.styleName in this._styleControlType.styleDefinition._styleMap)
					existingInstance = this._styleControlType.styleDefinition._styleMap[this._styleControlType.styleName];
					
				if (existingInstance instanceof value)
					value = existingInstance;
				else
					value = (new value());
			}
			else if (this._styleControlType.styleType == "bool")
			{
				if (value == true)
					this._styleControlType.styleItemCodeString += "true);";
				else
					this._styleControlType.styleItemCodeString += "false);";
			}
			else 
			{
				value = value.toString();
				this._styleControlType.styleItemCodeString += ("\"" + value + "\");");
			}
		}
		else
			this._styleControlType.styleItemCodeString += "null);"; 
		
		this._styleControlType.styleItemCodeString += "\r\n";
		
		this._styleControlType.styleDefinition.setStyle(this._styleControlType.styleName, value);
		
		if (value instanceof StyleDefinition)
		{
			this._styleControlType.buildControlStyleTypeLists();
			if (this._styleControlType.styleList.getLength() > 0)
			{
				this._labelStyleName.setStyle("TextStyle", "bold");
				
				if (this._styleListRenderer == null)
				{
					this._styleListRenderer = new StyleListRenderer();
					this._styleListRenderer.setStyle("PaddingLeft", 30);
					
					this.addElement(this._styleListRenderer);
				}
				
				this._styleListRenderer.setStyleControlType(this._styleControlType);
			}
			else
			{
				this._labelStyleName.setStyle("TextStyle", "normal");
				
				if (this._styleListRenderer != null)
				{
					this.removeElement(this._styleListRenderer);
					this._styleListRenderer = null;
				}
			}
		}
		else 
		{
			this._labelStyleName.setStyle("TextStyle", "normal");
			
			if (this._styleListRenderer != null)
			{
				this.removeElement(this._styleListRenderer);
				this._styleListRenderer = null;
			}
		}
		
		//Dispatch an event from the manager to fire the styling code re-build.
		if (this.getManager() != null)
			this.getManager()._dispatchEvent(new DispatcherEvent("stylingchanged"));
	};	
	