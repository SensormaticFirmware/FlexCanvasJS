
function StyleExplorerApplication() //extends CanvasManager
{
	//Call base constructor
	StyleExplorerApplication.base.prototype.constructor.call(this);
	
	////////////////LAYOUT & STYLING/////////////////////////////
	//This section could be handled by an XML markup interpreter.
	
	//Using indentation to help visualize nest level of elements.
	
	this.setStyleDefinitions(canvasManagerStyle); //Set root styles
	
		this._applicationViewport = new ViewportElement();
		this._applicationViewport.setStyle("PercentWidth", 100);
		this._applicationViewport.setStyle("PercentHeight", 100);

			this._applicationContainer = new ListContainerElement();
			this._applicationContainer.setStyle("LayoutDirection", "vertical");
			this._applicationContainer.addStyleDefinition(applicationContainerStyle);
			
				this._headerContainer = new ListContainerElement();
				this._headerContainer.setStyle("PercentWidth", 100);
				this._headerContainer.setStyle("LayoutDirection", "horizontal");
				
					this._textTitle = new TextElement();
					this._textTitle.setStyle("PercentWidth", 100);
					this._textTitle.addStyleDefinition(textTitleStyle);
					
					this._settingsSelectContainer = new ListContainerElement();
					this._settingsSelectContainer.setStyle("LayoutDirection", "horizontal");
					this._settingsSelectContainer.setStyle("LayoutVerticalAlign", "middle");
					this._settingsSelectContainer.setStyle("LayoutGap", 2);
					
						this._labelLanguage = new LabelElement();
						this._labelLanguage.setStyle("PaddingLeft", 20);
						this._dropdownLocale = new DropdownElement();
						
						this._labelFontSize = new LabelElement();
						this._labelFontSize.setStyle("PaddingLeft", 20);
						
						this._buttonFontSmaller = new ButtonElement();
						this._buttonFontSmaller.setStyleDefinitions(fontSizeButtonStyle);
						this._buttonFontSmaller.setStyle("ArrowDirection", "down");
						this._buttonFontSmaller.setStyle("Enabled", false);
					
						this._buttonFontLarger = new ButtonElement();
						this._buttonFontLarger.setStyleDefinitions(fontSizeButtonStyle);
						this._buttonFontLarger.setStyle("ArrowDirection", "up");
					
					this._settingsSelectContainer.addElement(this._labelLanguage);
					this._settingsSelectContainer.addElement(this._dropdownLocale);
					this._settingsSelectContainer.addElement(this._labelFontSize);
					this._settingsSelectContainer.addElement(this._buttonFontSmaller);
					this._settingsSelectContainer.addElement(this._buttonFontLarger);					
					
				this._headerContainer.addElement(this._textTitle);
				this._headerContainer.addElement(this._settingsSelectContainer);
				
				this._dividerHeader = new CanvasElement();
				this._dividerHeader.setStyleDefinitions(hDividerLineStyle);
				
				this._contentContainer = new ListContainerElement();
				this._contentContainer.setStyle("PercentWidth", 100);
				this._contentContainer.setStyle("PercentHeight", 100);
				this._contentContainer.setStyle("LayoutDirection", "horizontal");
				this._contentContainer.setStyle("LayoutGap", 8);
				
					this._controlSelectOuterContainer = new AnchorContainerElement();
					this._controlSelectOuterContainer.setStyle("PercentHeight", 100);
					this._controlSelectOuterContainer.setStyle("Width", 180);
					
						this._controlSelectPanelBackground = new CanvasElement();
						this._controlSelectPanelBackground.setStyleDefinitions(panelBackgroundStyle);
					
						this._controlSelectInnerContainer = new ListContainerElement();
						this._controlSelectInnerContainer.setStyleDefinitions(panelInnerContainerStyle);
						
							this._labelSelectControl = new LabelElement();
							this._labelSelectControl.setStyle("TextStyle", "bold");
							
							this._dividerSelectControl = new CanvasElement();
							this._dividerSelectControl.setStyleDefinitions(hDividerLineStyle);
							
							this._spacerSelectControl = new CanvasElement();
							this._spacerSelectControl.setStyle("PercentWidth", 100);
							this._spacerSelectControl.setStyle("Height", 5);
							
							this._dataListControls = new DataListElement();
							this._dataListControls.setStyle("PercentWidth", 100);
							this._dataListControls.setStyle("PercentHeight", 100);
							
						this._controlSelectInnerContainer.addElement(this._labelSelectControl);
						this._controlSelectInnerContainer.addElement(this._dividerSelectControl);
						this._controlSelectInnerContainer.addElement(this._spacerSelectControl);
						this._controlSelectInnerContainer.addElement(this._dataListControls);
						
					this._controlSelectOuterContainer.addElement(this._controlSelectPanelBackground);
					this._controlSelectOuterContainer.addElement(this._controlSelectInnerContainer);
					
					this._styleSelectOuterContainer = new AnchorContainerElement();
					this._styleSelectOuterContainer.setStyle("PercentHeight", 100);
					this._styleSelectOuterContainer.setStyle("Width", 450);
					
						this._styleSelectPanelBackground = new CanvasElement();
						this._styleSelectPanelBackground.setStyleDefinitions(panelBackgroundStyle);
					
						this._styleSelectInnerContainer = new ListContainerElement();
						this._styleSelectInnerContainer.setStyleDefinitions(panelInnerContainerStyle);
					
							this._labelSelectStyle = new LabelElement();
							this._labelSelectStyle.setStyle("TextStyle", "bold");
							
							this._dividerSelectStyle = new CanvasElement();
							this._dividerSelectStyle.setStyleDefinitions(hDividerLineStyle);
						
							this._spacerSelectStyle = new CanvasElement();
							this._spacerSelectStyle.setStyle("PercentWidth", 100);
							this._spacerSelectStyle.setStyle("Height", 5);
							
							this._stylesControlViewport = new ViewportElement();
							this._stylesControlViewport.setStyle("PercentWidth", 100);
							this._stylesControlViewport.setStyle("PercentHeight", 100);
							
								this._stylesControlContainer = new ListContainerElement();
								this._stylesControlContainer.setStyle("PaddingRight", 5);
								
							this._stylesControlViewport.setElement(this._stylesControlContainer);
							
						this._styleSelectInnerContainer.addElement(this._labelSelectStyle);
						this._styleSelectInnerContainer.addElement(this._dividerSelectStyle);
						this._styleSelectInnerContainer.addElement(this._spacerSelectStyle);
						this._styleSelectInnerContainer.addElement(this._stylesControlViewport);
							
					this._styleSelectOuterContainer.addElement(this._styleSelectPanelBackground);
					this._styleSelectOuterContainer.addElement(this._styleSelectInnerContainer);
					
					this._sandboxOuterContainer = new AnchorContainerElement();
					this._sandboxOuterContainer.setStyle("PercentHeight", 100);
					this._sandboxOuterContainer.setStyle("PercentWidth", 100);
					this._sandboxOuterContainer.setStyle("MinWidth", 300);
					
						this._sandboxPanelBackground = new CanvasElement();
						this._sandboxPanelBackground.setStyleDefinitions(panelBackgroundStyle);
					
						this._sandboxInnerContainer = new ListContainerElement();
						this._sandboxInnerContainer.setStyleDefinitions(panelInnerContainerStyle);
					
							this._sandboxHeaderContainer = new ListContainerElement();
							this._sandboxHeaderContainer.setStyle("PercentWidth", 100);
							this._sandboxHeaderContainer.setStyle("LayoutDirection", "horizontal");
							this._sandboxHeaderContainer.setStyle("LayoutVerticalAlign", "middle");
						
								this._sandboxHeaderRadioButtonContainer = new ListContainerElement();
								this._sandboxHeaderRadioButtonContainer.setStyle("Padding", 2);
								this._sandboxHeaderRadioButtonContainer.setStyle("LayoutGap", 15);
								this._sandboxHeaderRadioButtonContainer.setStyle("LayoutVerticalAlign", "middle");
								this._sandboxHeaderRadioButtonContainer.setStyle("LayoutDirection", "horizontal");
								
									this._radioButtonSandbox = new RadioButtonElement();
									this._radioButtonSandbox.setStyle("TextStyle", "bold");
									
									this._radioButtonStyleCode = new RadioButtonElement();
									this._radioButtonStyleCode.setStyle("TextStyle", "bold");
								
								this._sandboxHeaderRadioButtonContainer.addElement(this._radioButtonSandbox);
								this._sandboxHeaderRadioButtonContainer.addElement(this._radioButtonStyleCode);
									
							this._sandboxHeaderContainer.addElement(this._sandboxHeaderRadioButtonContainer);
								
							this._dividerSandbox = new CanvasElement();
							this._dividerSandbox.setStyleDefinitions(hDividerLineStyle);
							
							this._sandboxControlOuterContainer = new ListContainerElement();
							this._sandboxControlOuterContainer.setStyle("PercentWidth", 100);
							this._sandboxControlOuterContainer.setStyle("PercentHeight", 100);
							
								this._sandboxControlAndCodeContainer = new AnchorContainerElement();
								this._sandboxControlAndCodeContainer.setStyle("PercentWidth", 100);
								this._sandboxControlAndCodeContainer.setStyle("PercentHeight", 100);
							
									this._sandboxControlPanelBackground = new CanvasElement();
									this._sandboxControlPanelBackground.setStyle("Top", 5);
									this._sandboxControlPanelBackground.setStyle("Bottom", 5);
									this._sandboxControlPanelBackground.setStyle("Left", 5);
									this._sandboxControlPanelBackground.setStyle("Right", 5);
									this._sandboxControlPanelBackground.setStyle("BackgroundColor", "#FFFFFF");
									this._sandboxControlPanelBackground.setStyle("Alpha", .35);
								
									//Visibility Toggled
									this._sandboxControlContainer = new AnchorContainerElement();
									this._sandboxControlContainer.setStyle("Top", 5);
									this._sandboxControlContainer.setStyle("Bottom", 5);
									this._sandboxControlContainer.setStyle("Left", 5);
									this._sandboxControlContainer.setStyle("Right", 5);
								
									//Visibility Toggled
									this._viewportSandboxStyleCode = new ViewportElement();
									this._viewportSandboxStyleCode.setStyle("Top", 8);
									this._viewportSandboxStyleCode.setStyle("Bottom", 8);
									this._viewportSandboxStyleCode.setStyle("Left", 8);
									this._viewportSandboxStyleCode.setStyle("Right", 8);
									
										this._textSandboxStyleCode = new TextElement();
										this._textSandboxStyleCode.setStyle("TextVerticalAlign", "top");
										this._textSandboxStyleCode.setStyle("WordWrap", false);
									
									this._viewportSandboxStyleCode.setElement(this._textSandboxStyleCode);
									
								this._sandboxControlAndCodeContainer.addElement(this._sandboxControlPanelBackground);
								this._sandboxControlAndCodeContainer.addElement(this._sandboxControlContainer);
								this._sandboxControlAndCodeContainer.addElement(this._viewportSandboxStyleCode);
								
								this._sandboxCopyCodeContainer = new ListContainerElement();
								this._sandboxCopyCodeContainer.setStyle("PercentWidth", 100);
								this._sandboxCopyCodeContainer.setStyle("PaddingLeft", 5);
								this._sandboxCopyCodeContainer.setStyle("PaddingRight", 5);
								
									this._toggleButtonCopyCode = new ToggleButtonElement();
									this._toggleButtonCopyCode.setStyle("PercentWidth", 100);
								
								this._sandboxCopyCodeContainer.addElement(this._toggleButtonCopyCode);
									
							this._sandboxControlOuterContainer.addElement(this._sandboxControlAndCodeContainer);
							this._sandboxControlOuterContainer.addElement(this._sandboxCopyCodeContainer);
							
						this._sandboxInnerContainer.addElement(this._sandboxHeaderContainer);	
						this._sandboxInnerContainer.addElement(this._dividerSandbox);
						this._sandboxInnerContainer.addElement(this._sandboxControlOuterContainer);
						
					this._sandboxOuterContainer.addElement(this._sandboxPanelBackground);
					this._sandboxOuterContainer.addElement(this._sandboxInnerContainer);
					
				this._contentContainer.addElement(this._controlSelectOuterContainer);
				this._contentContainer.addElement(this._styleSelectOuterContainer);
				this._contentContainer.addElement(this._sandboxOuterContainer);
				
				this._dividerFooter = new CanvasElement();
				this._dividerFooter.setStyleDefinitions(hDividerLineStyle);
				
				this._footerContainer = new ListContainerElement();
				this._footerContainer.setStyle("PercentWidth", 100);
				this._footerContainer.setStyle("LayoutDirection", "horizontal");
				this._footerContainer.setStyle("LayoutHorizontalAlign", "right");
				
					this._labelPoweredBy = new LabelElement();
					this._labelFlexCanvasJS = new LabelElement();
					this._labelFlexCanvasJS.setStyle("TextStyle", "bold italic");
					
				this._footerContainer.addElement(this._labelPoweredBy);
				this._footerContainer.addElement(this._labelFlexCanvasJS);	
				
			this._applicationContainer.addElement(this._headerContainer);
			this._applicationContainer.addElement(this._dividerHeader);
			this._applicationContainer.addElement(this._contentContainer);
			this._applicationContainer.addElement(this._dividerFooter);
			this._applicationContainer.addElement(this._footerContainer);
		
		this._applicationViewport.setElement(this._applicationContainer);	
			
	this.addElement(this._applicationViewport);	
	
	////Non display////
	
	//ToggleButtonGroup (Helper class)
	this._sandboxHeaderRadioButtonGroup = new ToggleButtonGroup();
	this._sandboxHeaderRadioButtonGroup.addButton(this._radioButtonSandbox);
	this._sandboxHeaderRadioButtonGroup.addButton(this._radioButtonStyleCode);
	this._sandboxHeaderRadioButtonGroup.setSelectedButton(this._radioButtonSandbox);
	
	
	//////////////////EVENT HANDLING//////////////////////////
	//This section could be handled by a XML markup interpreter.
	
	var _self = this;
	
	//Private event handlers (need function for each instance), proxy to prototype.
	this._onLocaleChangedInstance = 
		function (event)
		{
			_self._onLocaleChanged(event);
		};
	this._onDropdownLocaleChangedInstance =
		function (event)
		{
			_self._onDropdownLocaleChanged(event);
		};
	this._onDataListControlsChangedInstance = 
		function (event)
		{
			_self._onDataListControlsChanged(event);
		};
	this._onSandboxHeaderRadioButtonGroupChangedInstance = 
		function (event)
		{
			_self._onSandboxHeaderRadioButtonGroupChanged(event);
		};
	this._onStylingChangedInstance = 
		function (event)
		{
			_self._onStylingChanged(event);
		};
	this._onEnterFrameStyleCodeUpdateInstance = 
		function (event)
		{
			_self._onEnterFrameStyleCodeUpdate(event);
		};
	this._onButtonFontClickInstance = 
		function (event)
		{
			if (event.getTarget() == _self._buttonFontSmaller)
				_self._onButtonFontSmallerClick(event);
			else
				_self._onButtonFontLargerClick(event);
		};
		
	//////Handle code copy... (Multi-line text highlight / copy is not yet implemented)	
	this._onToggleButtonCopyCodeEventHandlerInstance = 
		function (event)
		{
			if (event.getType() == "changed")
				_self._onToggleButtonCopyCodeChanged(event);
			else if (event.getType() == "keydown")
				_self._onToggleButtonCopyCodeKeydown(event);
			else if (event.getType() == "focusout")
				_self._onToggleButtonCopyCodeFocusout(event);
		};	
 	this._onCopyCutCodeInstance = //Handles *browser* event (FF, Chrome, Webkit)
 		function (event)
 		{
	 		window.removeEventListener("copy", _self._onCopyCutCodeInstance);
			
			try
			{
				if (event.clipboardData)
					_self._onCopyCutCode(event.clipboardData);
				
				if (event.preventDefault)
					event.preventDefault();
				
				return false;
			}
			catch (ex)
			{
				
			}
 		};
	this._onCopyCutCodeEnterFrameCleanupInstance = 
		function (event)
		{
			_self.removeEventListener("enterframe", _self._onCopyCutCodeEnterFrameCleanupInstance);
			window.removeEventListener("copy", _self._onCopyCutCodeInstance);
		};	
		
	//Add event listeners	
	this.addEventListener("localechanged", this._onLocaleChangedInstance);
	this.addEventListener("stylingchanged", this._onStylingChangedInstance); //Custom event
	this._dropdownLocale.addEventListener("changed", this._onDropdownLocaleChangedInstance);
	this._dataListControls.addEventListener("changed", this._onDataListControlsChangedInstance);
	this._sandboxHeaderRadioButtonGroup.addEventListener("changed", this._onSandboxHeaderRadioButtonGroupChangedInstance);
	this._buttonFontSmaller.addEventListener("click", this._onButtonFontClickInstance);
	this._buttonFontLarger.addEventListener("click", this._onButtonFontClickInstance);
	
	//Handle code copy... (Multi-line text highlight / copy is not yet implemented)
	this._toggleButtonCopyCode.addEventListener("changed", this._onToggleButtonCopyCodeEventHandlerInstance);
	this._toggleButtonCopyCode.addEventListener("keydown", this._onToggleButtonCopyCodeEventHandlerInstance);
	this._toggleButtonCopyCode.addEventListener("focusout", this._onToggleButtonCopyCodeEventHandlerInstance);
	
	/////////////////FUNCTIONAL///////////////////////////////
	
	var i = 0;
	
	this._currentListRenderer = null;
	this._currentFontSize = 12;
	this.setStyle("TextSize", this._currentFontSize);
	
	
	//////Build controls and style data//////
	this._dataListControlsCollection = new ListCollection();
	
	//Button
	var buttonDef = new StyleDefinition();
	buttonDef.setStyle("Text", "My Text");
	
	var buttonControl = new ButtonElement();
	buttonControl.setStyleDefinitions(buttonDef);
	
	var buttonControlStyleType = new ControlStyleType("", "ButtonStyle", "root", false, false, buttonControl, null, null, null);
	buttonControlStyleType.styleListCodeString = "var ButtonStyle = new StyleDefinition();\r\n";
	
	buttonControlStyleType.buildControlStyleTypeLists();
	
	this._dataListControlsCollection.addItem({label:"Button", 
											control:buttonControl, 
											rootControlStyleType:buttonControlStyleType,
											list:null});
	//CanvasElement
	var canvasElementDef = new StyleDefinition();
	canvasElementDef.setStyle("BackgroundColor", "#FFFF00");
	canvasElementDef.setStyle("MinWidth", 75);
	canvasElementDef.setStyle("MinHeight", 75);
	
	var canvasElementControl = new CanvasElement();
	canvasElementControl.setStyleDefinitions(canvasElementDef);
	
	var canvasElementControlStyleType = new ControlStyleType("", "CanvasElementStyle", "root", false, false, canvasElementControl, null, null, null);
	canvasElementControlStyleType.styleListCodeString = "var CanvasElementStyle = new StyleDefinition();\r\n";
	
	canvasElementControlStyleType.buildControlStyleTypeLists();
	
	this._dataListControlsCollection.addItem({label:"CanvasElement", 
											control:canvasElementControl, 
											rootControlStyleType:canvasElementControlStyleType,
											list:null});
	//ToggleButtonElement
	var toggleButtonDef = new StyleDefinition();
	toggleButtonDef.setStyle("Text", "My Text");
	
	var toggleButtonControl = new ToggleButtonElement();
	toggleButtonControl.setStyleDefinitions(toggleButtonDef);
	
	var toggleButtonControlStyleType = new ControlStyleType("", "ToggleButtonStyle", "root", false, false, toggleButtonControl, null, null, null);
	toggleButtonControlStyleType.styleListCodeString = "var ToggleButtonStyle = new StyleDefinition();\r\n";
	
	toggleButtonControlStyleType.buildControlStyleTypeLists();
	
	this._dataListControlsCollection.addItem({label:"ToggleButton", 
											control:toggleButtonControl, 
											rootControlStyleType:toggleButtonControlStyleType,
											list:null});
	//RadioButtonElement
	var radioButtonDef = new StyleDefinition();
	radioButtonDef.setStyle("Text", "My Text");
	
	var radioButtonControl = new RadioButtonElement();
	radioButtonControl.setStyleDefinitions(radioButtonDef);
	
	var radioButtonControlStyleType = new ControlStyleType("", "RadioButtonStyle", "root", false, false, radioButtonControl, null, null, null);
	radioButtonControlStyleType.styleListCodeString = "var RadioButtonStyle = new StyleDefinition();\r\n";
	
	radioButtonControlStyleType.buildControlStyleTypeLists();
	
	this._dataListControlsCollection.addItem({label:"RadioButton", 
											control:radioButtonControl, 
											rootControlStyleType:radioButtonControlStyleType,
											list:null});
	//CheckboxElement
	var checkboxDef = new StyleDefinition();
	checkboxDef.setStyle("Text", "My Text");
	
	var checkboxControl = new CheckboxElement();
	checkboxControl.setStyleDefinitions(checkboxDef);
	
	var checkboxControlStyleType = new ControlStyleType("", "CheckboxStyle", "root", false, false, checkboxControl, null, null, null);
	checkboxControlStyleType.styleListCodeString = "var CheckboxStyle = new StyleDefinition();\r\n";
	
	checkboxControlStyleType.buildControlStyleTypeLists();
	
	this._dataListControlsCollection.addItem({label:"Checkbox", 
											control:checkboxControl, 
											rootControlStyleType:checkboxControlStyleType,
											list:null});
	//TextInputElement
	var textInputDef = new StyleDefinition();
	
	var textInputControl = new TextInputElement();
	textInputControl.setStyleDefinitions(textInputDef);
	
	var textInputControlStyleType = new ControlStyleType("", "TextInputStyle", "root", false, false, textInputControl, null, null, null);
	textInputControlStyleType.styleListCodeString = "var TextInputStyle = new StyleDefinition();\r\n";
	
	textInputControlStyleType.buildControlStyleTypeLists();
	
	this._dataListControlsCollection.addItem({label:"TextInput", 
											control:textInputControl, 
											rootControlStyleType:textInputControlStyleType,
											list:null});
	//LabelElement
	var labelDef = new StyleDefinition();
	labelDef.setStyle("Text", "My Text");
	
	var labelControl = new LabelElement();
	labelControl.setStyleDefinitions(labelDef);
	
	var labelControlStyleType = new ControlStyleType("", "LabelStyle", "root", false, false, labelControl, null, null, null);
	labelControlStyleType.styleListCodeString = "var LabelStyle = new StyleDefinition();\r\n";
	
	labelControlStyleType.buildControlStyleTypeLists();
	
	this._dataListControlsCollection.addItem({label:"Label", 
											control:labelControl, 
											rootControlStyleType:labelControlStyleType,
											list:null});
	//ScrollBarElement
	var scrollBarDef = new StyleDefinition();
	scrollBarDef.setStyle("LayoutDirection", "vertical");
	scrollBarDef.setStyle("PercentHeight", 100);
	scrollBarDef.setStyle("PercentWidth", null);
	
	var scrollBarControl = new ScrollBarElement();
	scrollBarControl.setStyleDefinitions(scrollBarDef);
	
	//Set some arbitrary page / view size so bar is not disabled. 
	//TODO: Should be UI configured, property rather than style (somewhere..)
	scrollBarControl.setScrollPageSize(1000);
	scrollBarControl.setScrollViewSize(150);
	scrollBarControl.setScrollLineSize(50);
	
	var scrollBarControlStyleType = new ControlStyleType("", "ScrollBarStyle", "root", false, false, scrollBarControl, null, null, null);
	scrollBarControlStyleType.styleListCodeString = "var ScrollBarStyle = new StyleDefinition();\r\n";
	
	scrollBarControlStyleType.buildControlStyleTypeLists();
	
	this._dataListControlsCollection.addItem({label:"ScrollBar", 
											control:scrollBarControl, 
											rootControlStyleType:scrollBarControlStyleType,
											list:null});
	
	//DataListElement
	var dataListDef = new StyleDefinition();
	dataListDef.setStyle("LayoutDirection", "vertical");
	dataListDef.setStyle("PercentHeight", 100);
	dataListDef.setStyle("Width", 200);
	dataListDef.setStyle("BackgroundColor", "#FAFAFA");
	
	var dataListControl = new DataListElement();
	dataListControl.setStyleDefinitions(dataListDef);
	
	//Set some arbitrary data. 
	var dataListCollection = new ListCollection();
	for (i = 0; i < 100; i++)
		dataListCollection.addItem("Data Item - " + i);
	
	dataListControl.setListCollection(dataListCollection);
	
	var dataListControlStyleType = new ControlStyleType("", "DataListStyle", "root", false, false, dataListControl, null, null, null);
	dataListControlStyleType.styleListCodeString = "var DataListStyle = new StyleDefinition();\r\n";
	
	dataListControlStyleType.buildControlStyleTypeLists();
	
	this._dataListControlsCollection.addItem({label:"DataList", 
											control:dataListControl, 
											rootControlStyleType:dataListControlStyleType,
											list:null});
	
	
	
	//Set static collection sort
	if (StyleExplorerApplication.LabelSort == null)
		StyleExplorerApplication.LabelSort = new CollectionSort(StyleExplorerApplication.LabelSortFunction, false);
	
	//Apply sort
	this._dataListControlsCollection.setCollectionSort(StyleExplorerApplication.LabelSort);
	
	//Do sort
	this._dataListControlsCollection.sort();
	
	//Apply data to controls DataList
	this._dataListControls.setListCollection(this._dataListControlsCollection);
	
	//////
	
	//Build locale Dropdown data
	this._dropdownLocaleCollection = new ListCollection();
	this._dropdownLocaleCollection.addItem({key:"en-us", label:"English"});
	this._dropdownLocaleCollection.addItem({key:"es-es", label:"Español"});
	
	//Apply data to Dropdown.
	this._dropdownLocale.setListCollection(this._dropdownLocaleCollection);
	this._dropdownLocale.setSelectedIndex(0);
	
	this._onSandboxHeaderRadioButtonGroupChanged(null);
}

//Inherit from CanvasManager
StyleExplorerApplication.prototype = Object.create(CanvasManager.prototype);
StyleExplorerApplication.prototype.constructor = StyleExplorerApplication;
StyleExplorerApplication.base = CanvasManager;

//Static
StyleExplorerApplication.LabelSortFunction = 
	function (objA, objB)
	{
		if (objA.label < objB.label)
			return -1;
		if (objA.label > objB.label)
			return 1;
		
		return 0;
	};
	
StyleExplorerApplication.LabelSort = null; //Set via constructor (avoid file ordering dependencies)


/////Internal
StyleExplorerApplication.prototype._onLocaleChanged = 
	function (event)
	{
		//Bail if not attached to manager.
		//This is not necessary here (it'll never happen), but its possible
		//under other scenarios when an element is added and immediately removed
		//before this event gets to fire. Best always to check.
		if (this.getManager() == null) 
			return;
	
		//Get locale from manager
		var currentLocale = this.getManager().getLocale();
		
		//Update text per current locale
		this._labelFontSize.setStyle("Text", 				localeStrings[currentLocale]["Text Size"]);
		this._textTitle.setStyle("Text", 					localeStrings["all"]["FlexCanvasJS"] + " " + localeStrings["all"]["Style Explorer"]);
		this._labelLanguage.setStyle("Text", 				localeStrings[currentLocale]["Language"]);
		this._labelPoweredBy.setStyle("Text", 				localeStrings[currentLocale]["Powered By"] + " ");
		this._labelFlexCanvasJS.setStyle("Text", 			localeStrings["all"]["FlexCanvasJS"]);
		this._labelSelectControl.setStyle("Text", 			localeStrings[currentLocale]["Select Control"]);
		this._labelSelectStyle.setStyle("Text", 			localeStrings[currentLocale]["Select Styles"]);
		this._radioButtonSandbox.setStyle("Text", 			localeStrings[currentLocale]["Sandbox"] + " (AnchorContainer)");
		this._radioButtonStyleCode.setStyle("Text", 		localeStrings[currentLocale]["Style Code"]);
		this._toggleButtonCopyCode.setStyle("Text", 		localeStrings[currentLocale]["Copy"] + " " + localeStrings[currentLocale]["Style Code"]);
	};

StyleExplorerApplication.prototype._onButtonFontLargerClick =
	function (event)
	{
		var currentSize = this.getStyle("TextSize");
		this.setStyle("TextSize", currentSize + 2);
		
		if (currentSize + 2 == 16)
			this._buttonFontLarger.setStyle("Enabled", false);
		
		this._buttonFontSmaller.setStyle("Enabled", true);
	};	
	
StyleExplorerApplication.prototype._onButtonFontSmallerClick =
	function (event)
	{
		var currentSize = this.getStyle("TextSize");
		this.setStyle("TextSize", currentSize - 2);
		
		if (currentSize - 2 == 12)
			this._buttonFontSmaller.setStyle("Enabled", false);
		
		this._buttonFontLarger.setStyle("Enabled", true);
	};
	
StyleExplorerApplication.prototype._onSandboxHeaderRadioButtonGroupChanged =
	function (event)
	{
		if (this._sandboxHeaderRadioButtonGroup.getSelectedButton() == this._radioButtonSandbox)
		{
			this._sandboxControlContainer.setStyle("Visible", true);
			this._viewportSandboxStyleCode.setStyle("Visible", false);
			
			this._sandboxCopyCodeContainer.setStyle("Visible", false);
			this._sandboxCopyCodeContainer.setStyle("IncludeInLayout", false);
		}
		else
		{
			this._sandboxControlContainer.setStyle("Visible", false);
			this._viewportSandboxStyleCode.setStyle("Visible", true);
			
			this._sandboxCopyCodeContainer.setStyle("Visible", true);
			this._sandboxCopyCodeContainer.setStyle("IncludeInLayout", true);
		}
	};

StyleExplorerApplication.prototype._onDropdownLocaleChanged = 
	function (event)
	{
		//Update manager locale. Broadcasts localechanged event
		this.getManager().setLocale(this._dropdownLocale.getSelectedItem().key);
	};
	
StyleExplorerApplication.prototype._onDataListControlsChanged = 
	function (event)
	{
		//Purge sandbox
		while (this._sandboxControlContainer.getNumElements() > 0)
			this._sandboxControlContainer.removeElementAt(0);
		
		//Purge style code
		this._textSandboxStyleCode.setStyle("Text", "");
		
		//Bail if no selection
		if (this._dataListControls.getSelectedIndex() == -1)
			return;
		
		var controlData = this._dataListControls.getSelectedItem();
		
		//Add control to sandbox
		this._sandboxControlContainer.addElement(controlData.control);
		
		//Create select style root list if does not exist.
		if (controlData.list == null)
		{
			controlData.list = new StyleListRenderer();
			controlData.list.setStyleControlType(controlData.rootControlStyleType);
			this._stylesControlContainer.addElement(controlData.list);
		}
		
		//Hide old list
		if (this._currentListRenderer != null)
		{
			this._currentListRenderer.setStyle("Visible", false);
			this._currentListRenderer.setStyle("IncludeInLayout", false);
		}
		
		this._currentListRenderer = controlData.list;
		
		//Show new list
		if (this._currentListRenderer != null)
		{
			this._currentListRenderer.setStyle("Visible", true);
			this._currentListRenderer.setStyle("IncludeInLayout", true);
		}
		
		this._onStylingChanged(null);
	};
	
StyleExplorerApplication.prototype._onStylingChanged = 
	function (event)
	{
		//Updating the style code is expensive, so we defer till the next frame to spread the load.
		if (this.hasEventListener("enterframe", this._onEnterFrameStyleCodeUpdateInstance) == false)
			this.addEventListener("enterframe", this._onEnterFrameStyleCodeUpdateInstance);
	};
	
StyleExplorerApplication.prototype._onEnterFrameStyleCodeUpdate = 
	function (event)
	{
		//Purge the enterframe listener
		this.removeEventListener("enterframe", this._onEnterFrameStyleCodeUpdateInstance);
		
		//Update style code
		this._textSandboxStyleCode.setStyle("Text", this._dataListControls.getSelectedItem().rootControlStyleType.generateStylingCode());
	};
	
	
///////Handle code copy... (Multi-line text highlight / copy is not yet implemented)
StyleExplorerApplication.prototype._onToggleButtonCopyCodeChanged = 
	function (event)
	{
		this._toggleButtonCopyCode.setStyle("Text", localeStrings[this.getManager().getLocale()]["Press Ctrl C"]);
	};
	
StyleExplorerApplication.prototype._onToggleButtonCopyCodeKeydown = 
	function (elementKeyboardEvent)
	{
		var keyString = elementKeyboardEvent.getKey();
		
		if (keyString == "c" && elementKeyboardEvent.getCtrl() == true)
		{
			//IE
			if (window.clipboardData)
			{
				this._onCopyCutCode(window.clipboardData);
				elementKeyboardEvent.preventDefault();
			} 
			else //FF, Chrome, Webkit (Allow keyboard event to invoke the copy / paste listener)
			{
				window.addEventListener("copy", this._onCopyCutCodeInstance);
				
				//This is just to make sure we clean up the window "copy" listener.
				//If the keyboard event gets canceled up stream the "copy" event wont fire and we 
				//still need to remove the listener.
				this.addEventListener("enterframe", this._onCopyCutCodeEnterFrameCleanupInstance);
			}
		}
	};	
	
StyleExplorerApplication.prototype._onToggleButtonCopyCodeFocusout = 
	function (event)
	{
		var locale = this.getManager().getLocale();
	
		this._toggleButtonCopyCode.setSelected(false);
		this._toggleButtonCopyCode.setStyle("Text", localeStrings[locale]["Copy"] + " " + localeStrings[locale]["Style Code"]);
	};	
	
StyleExplorerApplication.prototype._onCopyCutCode = 
	function (clipboardData)
	{
		clipboardData.setData("Text", this._textSandboxStyleCode.getStyle("Text"));
		
		var locale = this.getManager().getLocale();
		
		this._toggleButtonCopyCode.setSelected(false);
		this._toggleButtonCopyCode.setStyle("Text", localeStrings[locale]["Copy"] + " " + localeStrings[locale]["Style Code"]);
	};	
	
