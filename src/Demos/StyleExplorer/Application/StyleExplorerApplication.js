
//Root application.

function StyleExplorerApplication() //extends CanvasManager
{
	//Call base constructor
	StyleExplorerApplication.base.prototype.constructor.call(this);
	
	////////////////LAYOUT & STYLING/////////////////////////////
	//This section could be handled by an XML markup interpreter.
	
	//Using indentation to help visualize nest level of elements.
	
	this.setStyleDefinitions(canvasManagerStyle); //Set root styles
	this.setStyle("TextSize", 12);
	
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
							this._stylesControlViewport.setStyleDefinitions(stylesControlViewportStyle);
							
								//Stores the root StyleListRenderer
								this._stylesControlContainer = new ListContainerElement();
								
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
									this._sandboxControlPanelBackground.setStyle("BackgroundFill", "#FFFFFF");
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
								this._sandboxCopyCodeContainer.setStyle("MinWidth", 200);	
								this._sandboxCopyCodeContainer.setStyle("PaddingLeft", 5);
								this._sandboxCopyCodeContainer.setStyle("PaddingRight", 5);
								
									this._toggleButtonCopyCode = new ToggleButtonElement();
									this._toggleButtonCopyCode.setStyle("PercentWidth", 100);
									this._toggleButtonCopyCode.setStyle("AllowDeselect", false);
								
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
	
	//Select style list we're currently displaying.
	this._currentListRenderer = null;
	
	//Build locale Dropdown data
	this._dropdownLocaleCollection = new ListCollection();
	this._dropdownLocaleCollection.addItem({key:"en-us", label:"English"});
	this._dropdownLocaleCollection.addItem({key:"es-es", label:"Español"});
	
	//Apply data to Dropdown.
	this._dropdownLocale.setListCollection(this._dropdownLocaleCollection);
	this._dropdownLocale.setSelectedIndex(0);
	
	//////Build controls and style data//////
	this._dataListControlsCollection = new ListCollection();
	
	//Button
	var buttonDef = new StyleDefinition();
	buttonDef.setStyle("Text", "My Text");
	
	var buttonControl = new ButtonElement();
	buttonControl.setStyleDefinitions(buttonDef);
	
	var buttonControlStyleType = new ControlStyleType("", "ButtonStyle", "root", false, false, buttonControl, null, null, null);
	buttonControlStyleType.styleListCodeString = "var ButtonStyle = new StyleDefinition();\r\n";
	
	buttonControlStyleType.buildControlStyleTypeLists(buttonDef);
	
	this._dataListControlsCollection.addItem({label:"Button", 
											control:buttonControl, 
											rootControlStyleType:buttonControlStyleType,
											list:null});
	//CanvasElement
	var canvasElementBgFill = new SolidFill();
	canvasElementBgFill.setStyle("FillColor", "#FFFF00");
	
	var canvasElementDef = new StyleDefinition();
	canvasElementDef.setStyle("BackgroundFill", canvasElementBgFill);
	canvasElementDef.setStyle("Width", 75);
	canvasElementDef.setStyle("Height", 75);
	
	var canvasElementControl = new CanvasElement();
	canvasElementControl.setStyleDefinitions(canvasElementDef);
	
	var canvasElementControlStyleType = new ControlStyleType("", "CanvasElementStyle", "root", false, false, canvasElementControl, null, null, null);
	canvasElementControlStyleType.styleListCodeString = "var CanvasElementStyle = new StyleDefinition();\r\n";
	
	canvasElementControlStyleType.buildControlStyleTypeLists(canvasElementDef);
	
	this._dataListControlsCollection.addItem({label:"CanvasElement", 
											control:canvasElementControl, 
											rootControlStyleType:canvasElementControlStyleType,
											list:null});
	
	//AlertElement
	var alertElementDef = new StyleDefinition();
	
	var alertElementControl = new AlertElement();
	alertElementControl.setStyleDefinitions(alertElementDef);
	alertElementControl.setTitleText("Lorem Ipsum");
	alertElementControl.setContentText("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam feugiat ultricies ante et semper.");
	alertElementControl.setButtons(["Ante", "Elit"]);
	
	var alertElementControlStyleType = new ControlStyleType("", "AlertStyle", "root", false, false, alertElementControl, null, null, null);
	alertElementControlStyleType.styleListCodeString = "var AlertStyle = new StyleDefinition();\r\n";
	
	alertElementControlStyleType.buildControlStyleTypeLists(alertElementDef);
	
	this._dataListControlsCollection.addItem({label:"AlertElement", 
											control:alertElementControl, 
											rootControlStyleType:alertElementControlStyleType,
											list:null});
	//ToggleButtonElement
	var toggleButtonDef = new StyleDefinition();
	toggleButtonDef.setStyle("Text", "My Text");
	
	var toggleButtonControl = new ToggleButtonElement();
	toggleButtonControl.setStyleDefinitions(toggleButtonDef);
	
	var toggleButtonControlStyleType = new ControlStyleType("", "ToggleButtonStyle", "root", false, false, toggleButtonControl, null, null, null);
	toggleButtonControlStyleType.styleListCodeString = "var ToggleButtonStyle = new StyleDefinition();\r\n";
	
	toggleButtonControlStyleType.buildControlStyleTypeLists(toggleButtonDef);
	
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
	
	radioButtonControlStyleType.buildControlStyleTypeLists(radioButtonDef);
	
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
	
	checkboxControlStyleType.buildControlStyleTypeLists(checkboxDef);
	
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
	
	textInputControlStyleType.buildControlStyleTypeLists(textInputDef);
	
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
	
	labelControlStyleType.buildControlStyleTypeLists(labelDef);
	
	this._dataListControlsCollection.addItem({label:"Label", 
											control:labelControl, 
											rootControlStyleType:labelControlStyleType,
											list:null});
	//LabelElement
	var imageDef = new StyleDefinition();
	imageDef.setStyle("ImageSource", urlImgBlueMarble);
	
	var imageControl = new ImageElement();
	imageControl.setStyleDefinitions(imageDef);
	
	var imageControlStyleType = new ControlStyleType("", "ImageStyle", "root", false, false, imageControl, null, null, null);
	imageControlStyleType.styleListCodeString = "var ImageStyle = new StyleDefinition();\r\n";
	
	imageControlStyleType.buildControlStyleTypeLists(imageDef);
	
	this._dataListControlsCollection.addItem({label:"Image", 
											control:imageControl, 
											rootControlStyleType:imageControlStyleType,
											list:null});
	//TextElement
	var textDef = new StyleDefinition();
	textDef.setStyle("PercentWidth", 100);
	textDef.setStyle("WordWrap", true);
	textDef.setStyle("Multiline", true);
	textDef.setStyle("Text", 
		"1) Lorem ipsum dolor sit amet, consectetur adipiscing elit.\r\n" +
		"2) Cras posuere sem varius, luctus erat id, tincidunt nibh.\r\n" +
		"3) Nam nec augue imperdiet massa porta ultricies nec vel eros.\r\n" +
		"4) Nulla tincidunt quam vitae nisi hendrerit, ut commodo mauris pretium.\r\n" +
		"5) Maecenas mattis ante in sapien lacinia, in consectetur urna vulputate.\r\n" +
		"\r\n" +
		"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam feugiat ultricies ante et semper. Quisque eget vulputate massa. In hac habitasse platea dictumst. Cras consequat leo nec mauris facilisis, vel bibendum dui vulputate. Nulla facilisi.");
	
	var textControl = new TextElement();
	textControl.setStyleDefinitions(textDef);
	
	var textControlStyleType = new ControlStyleType("", "TextStyle", "root", false, false, textControl, null, null, null);
	textControlStyleType.styleListCodeString = "var TextStyle = new StyleDefinition();\r\n";
	
	textControlStyleType.buildControlStyleTypeLists(textDef);
	
	this._dataListControlsCollection.addItem({label:"Text", 
											control:textControl, 
											rootControlStyleType:textControlStyleType,
											list:null});
	//ScrollBarElement
	var scrollBarDef = new StyleDefinition();
	scrollBarDef.setStyle("LayoutDirection", "vertical");
	scrollBarDef.setStyle("PercentHeight", 100);
	scrollBarDef.setStyle("PercentWidth", null);
	
	var scrollBarControl = new ScrollBarElement();
	scrollBarControl.setStyleDefinitions(scrollBarDef);
	
	//Set some arbitrary page / view size so bar is not disabled. 
	scrollBarControl.setScrollPageSize(1000);
	scrollBarControl.setScrollViewSize(150);
	scrollBarControl.setScrollLineSize(50);
	
	var scrollBarControlStyleType = new ControlStyleType("", "ScrollBarStyle", "root", false, false, scrollBarControl, null, null, null);
	scrollBarControlStyleType.styleListCodeString = "var ScrollBarStyle = new StyleDefinition();\r\n";
	
	scrollBarControlStyleType.buildControlStyleTypeLists(scrollBarDef);
	
	this._dataListControlsCollection.addItem({label:"ScrollBar", 
											control:scrollBarControl, 
											rootControlStyleType:scrollBarControlStyleType,
											list:null});
	//DataListElement
	var dataListScrollBarDef = new StyleDefinition();
	dataListScrollBarDef.setStyle("PaddingTop", -1);
	dataListScrollBarDef.setStyle("PaddingBottom", -1);
	
	var dataListBgFill = new SolidFill();
	dataListBgFill.setStyle("FillColor", "#FAFAFA");
	
	var dataListDef = new StyleDefinition();
	dataListDef.setStyle("LayoutDirection", "vertical");
	dataListDef.setStyle("PercentHeight", 100);
	dataListDef.setStyle("Width", 200);
	dataListDef.setStyle("BackgroundFill", dataListBgFill);
	dataListDef.setStyle("BorderType", "solid");
	dataListDef.setStyle("BorderThickness", 1);
	dataListDef.setStyle("PaddingTop", 1);
	dataListDef.setStyle("PaddingLeft", 1);
	dataListDef.setStyle("PaddingBottom", 1);
	dataListDef.setStyle("ScrollBarStyle", dataListScrollBarDef);
	
	var dataListControl = new DataListElement();
	dataListControl.setStyleDefinitions(dataListDef);
	
	//Set some arbitrary data. 
	var dataListCollection = new ListCollection();
	for (i = 1; i <= 500; i++)
		dataListCollection.addItem("Data Item - " + i);
	
	dataListControl.setListCollection(dataListCollection);
	
	var dataListControlStyleType = new ControlStyleType("", "DataListStyle", "root", false, false, dataListControl, null, null, null);
	dataListControlStyleType.styleListCodeString = "var DataListStyle = new StyleDefinition();\r\n";
	
	dataListControlStyleType.buildControlStyleTypeLists(dataListDef);
	
	this._dataListControlsCollection.addItem({label:"DataList", 
											control:dataListControl, 
											rootControlStyleType:dataListControlStyleType,
											list:null});
	//DropdownElement
	var dropdownDef = new StyleDefinition();
	dropdownDef.setStyle("Text", "My Text");
	
	var dropdownControl = new DropdownElement();
	dropdownControl.setStyleDefinitions(dropdownDef);
	
	//Set some arbitrary data. 
	var dropdownListCollection = new ListCollection();
	for (i = 1; i <= 50; i++)
		dropdownListCollection.addItem("Data Item - " + i);
	
	dropdownControl.setListCollection(dropdownListCollection);
	
	var dropdownControlStyleType = new ControlStyleType("", "DropdownStyle", "root", false, false, dropdownControl, null, null, null);
	dropdownControlStyleType.styleListCodeString = "var DropdownStyle = new StyleDefinition();\r\n";
	
	dropdownControlStyleType.buildControlStyleTypeLists(dropdownDef);
	
	this._dataListControlsCollection.addItem({label:"Dropdown", 
											control:dropdownControl, 
											rootControlStyleType:dropdownControlStyleType,
											list:null});
	//ListContainerElement
	var listContainerBgFill = new SolidFill();
	listContainerBgFill.setStyle("FillColor", "#FFFFFF");
	
	var listContainerDef = new StyleDefinition();
	listContainerDef.setStyle("PercentWidth", 75);
	listContainerDef.setStyle("PercentHeight", 50);
	listContainerDef.setStyle("BackgroundFill", listContainerBgFill);
	listContainerDef.setStyle("LayoutDirection", "vertical");
	
	var listContainerControl = new ListContainerElement();
	listContainerControl.setStyleDefinitions(listContainerDef);
	
	//Add some arbitrary controls.
	var listContainerButton1 = new ButtonElement();
	listContainerButton1.setStyle("Text", "Measured X Measured");
	
	var listContainerButton2 = new ButtonElement();
	listContainerButton2.setStyle("Text", "25% X 25%");
	listContainerButton2.setStyle("PercentWidth", 25);
	listContainerButton2.setStyle("PercentHeight", 25);
	
	var listContainerButton3 = new ButtonElement();
	listContainerButton3.setStyle("Text", "50% X 50%");
	listContainerButton3.setStyle("PercentWidth", 50);
	listContainerButton3.setStyle("PercentHeight", 50);
	
	listContainerControl.addElement(listContainerButton1);
	listContainerControl.addElement(listContainerButton2);
	listContainerControl.addElement(listContainerButton3);
	
	var listContainerControlStyleType = new ControlStyleType("", "ListContainerStyle", "root", false, false, listContainerControl, null, null, null);
	listContainerControlStyleType.styleListCodeString = "var ListContainerStyle = new StyleDefinition();\r\n";
	
	listContainerControlStyleType.buildControlStyleTypeLists(listContainerDef);
	
	this._dataListControlsCollection.addItem({label:"ListContainer", 
											control:listContainerControl, 
											rootControlStyleType:listContainerControlStyleType,
											list:null});
	//DataGridElement
	var dataGridDef = new StyleDefinition();
	dataGridDef.setStyle("PercentWidth", 100);
	dataGridDef.setStyle("PercentHeight", 100);
	
	var dataGridControl = new DataGridElement();
	dataGridControl.setStyleDefinitions(dataGridDef);
	
	//Set some arbitrary columns & data.
	var column1 = new DataGridColumnDefinition();
	column1.setStyle("RowItemLabelFunction", function (data, columnIndex) { return data.col1; });
	column1.setStyle("CollectionSort", new CollectionSort(function (objA, objB) { return objA.col1 < objB.col1 ? -1 : objA.col1 > objB.col1 ? 1 : 0; }));
	column1.setStyle("HeaderText", "Column1");
	dataGridControl.addColumnDefinition(column1);
	
	var column2 = new DataGridColumnDefinition();
	column2.setStyle("RowItemLabelFunction", function (data, columnIndex) { return data.col2; });
	column2.setStyle("CollectionSort", new CollectionSort(function (objA, objB) { return objA.col2 < objB.col2 ? -1 : objA.col2 > objB.col2 ? 1 : 0; }));
	column2.setStyle("HeaderText", "Column2");
	dataGridControl.addColumnDefinition(column2);
	
	var column3HeaderItemStyle = new StyleDefinition();
	column3HeaderItemStyle.setStyle("TextHorizontalAlign", "right");
	column3HeaderItemStyle.setStyle("PaddingRight", 18);
	
	var column3RowItemStyle = new StyleDefinition();
	column3RowItemStyle.setStyle("TextHorizontalAlign", "right");
	
	var column3 = new DataGridColumnDefinition();
	column3.setStyle("RowItemLabelFunction", function (data, columnIndex) { return data.col3; });
	column3.setStyle("CollectionSort", new CollectionSort(function (objA, objB) { return Number(objA.col3) < Number(objB.col3) ? -1 : Number(objA.col3) > Number(objB.col3) ? 1 : 0; }));
	column3.setStyle("HeaderText", "Column3");
	column3.setStyle("HeaderItemStyle", column3HeaderItemStyle);
	column3.setStyle("RowItemStyle", column3RowItemStyle);
	dataGridControl.addColumnDefinition(column3);
	
	var dataGridListCollection = new ListCollection();
	for (i = 1; i <= 500; i++)
		dataGridListCollection.addItem({col1:"Column1 Data " + i, col2:"Column2 Data " + i, col3:i.toString()});
	
	dataGridControl.setListCollection(dataGridListCollection);
	
	var dataGridControlStyleType = new ControlStyleType("", "DataGridStyle", "root", false, false, dataGridControl, null, null, null);
	dataGridControlStyleType.styleListCodeString = "var DataGridStyle = new StyleDefinition();\r\n";
	dataGridControlStyleType.buildControlStyleTypeLists(dataGridDef);
	
	var dataGridColumn1ControlStyleType = new ControlStyleType("", "DataGridColumn1Style", "class", false, false, dataGridControl, null, null, null);
	dataGridColumn1ControlStyleType.styleListCodeString = "var DataGridColumn1Style = new DataGridColumnDefinition();\r\n";
	dataGridColumn1ControlStyleType.buildControlStyleTypeLists(column1);
	
	var dataGridColumn2ControlStyleType = new ControlStyleType("", "DataGridColumn2Style", "class", false, false, dataGridControl, null, null, null);
	dataGridColumn2ControlStyleType.styleListCodeString = "var DataGridColumn2Style = new DataGridColumnDefinition();\r\n";
	dataGridColumn2ControlStyleType.buildControlStyleTypeLists(column2);
	
	var dataGridColumn3ControlStyleType = new ControlStyleType("", "DataGridColumn3Style", "class", false, false, dataGridControl, null, null, null);
	dataGridColumn3ControlStyleType.styleListCodeString = "var DataGridColumn3Style = new DataGridColumnDefinition();\r\n";
	dataGridColumn3ControlStyleType.buildControlStyleTypeLists(column3);
	
	this._dataListControlsCollection.addItem({label:"DataGrid", 
											control:dataGridControl, 
											rootControlStyleType:[dataGridControlStyleType, dataGridColumn1ControlStyleType, dataGridColumn2ControlStyleType, dataGridColumn3ControlStyleType],
											list:null});
	////////////////////////////////////
	
	//Associate sort with controls collection
	this._dataListControlsCollection.setCollectionSort(new CollectionSort(StyleExplorerApplication.LabelSortFunction));
	
	//Do sort
	this._dataListControlsCollection.sort();
	
	//Apply data to controls DataList
	this._dataListControls.setListCollection(this._dataListControlsCollection);
	
	//////
	
	//Setup Sandbox / Code views (spoof event)
	this._onSandboxHeaderRadioButtonGroupChanged(null);
}

//Inherit from CanvasManager
StyleExplorerApplication.prototype = Object.create(CanvasManager.prototype);
StyleExplorerApplication.prototype.constructor = StyleExplorerApplication;
StyleExplorerApplication.base = CanvasManager;

/////Static
StyleExplorerApplication.LabelSortFunction = 
	function (objA, objB)
	{
		if (objA.label < objB.label)
			return -1;
		if (objA.label > objB.label)
			return 1;
		
		return 0;
	};

/////Internal
StyleExplorerApplication.prototype._onLocaleChanged = 
	function (event)
	{
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
	
//Toggle visibility and layout of sandbox / style code. For best performance, 
//always turn layout off with visibility unless you *want* the item to consume container space.
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
		var i;
		var element;
		
		//Hide - much less expensive than adding/removing
		for (i = 0; i < this._sandboxControlContainer.getNumElements(); i++)
		{
			element = this._sandboxControlContainer.getElementAt(i);
			element.setStyle("Visible", false);
			element.setStyle("IncludeInLayout", false);
		}
		
		//Bail if no selection
		if (this._dataListControls.getSelectedIndex() == -1)
		{
			//Purge style code
			this._textSandboxStyleCode.setStyle("Text", "");
			return;
		}
		
		var controlData = this._dataListControls.getSelectedItem();
		
		//Add control to sandbox
		if (controlData.control.getParent() == null)
			this._sandboxControlContainer.addElement(controlData.control);
		
		//Turn on visibility
		controlData.control.setStyle("Visible", true);
		controlData.control.setStyle("IncludeInLayout", true);
		
		//Create Select Style root StyleListRenderer if does not exist.
		if (controlData.list == null)
		{
			if (Array.isArray(controlData.rootControlStyleType))
			{
				controlData.list = new ListContainerElement();
				controlData.list.setStyle("PercentWidth", 100);
				controlData.list.setStyle("LayoutGap", 4);
				
				for (var i = 0; i < controlData.rootControlStyleType.length; i++)
				{
					var subList = new StyleListRenderer();
					subList.setStyleControlType(controlData.rootControlStyleType[i]);
					controlData.list.addElement(subList);
					
					//Add some gap between lists.
					if (i != controlData.rootControlStyleType.length - 1)
						subList.setStyle("PaddingBottom", 12);
					
					if (i < controlData.rootControlStyleType.length - 1)
					{
						var divider = new CanvasElement();
						divider.setStyleDefinitions(hDividerLineStyle);
						controlData.list.addElement(divider);
					}
				}
			}
			else
			{
				controlData.list = new StyleListRenderer();
				controlData.list.setStyleControlType(controlData.rootControlStyleType);
			}
			
			this._stylesControlContainer.addElement(controlData.list);
		}
		
		//Hide old list (its much more expensive to re-build the list than just hide/show it).
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
		
		//Update style code (spoof event).
		this._onStylingChanged(null);
	};
	
StyleExplorerApplication.prototype._onStylingChanged = 
	function (event)
	{
		//Updating the style code is expensive, so we defer till the next frame to spread the load and
		//also make sure if this event gets dispatched multiple times we only process once per frame.
		if (this.hasEventListener("enterframe", this._onEnterFrameStyleCodeUpdateInstance) == false)
			this.addEventListener("enterframe", this._onEnterFrameStyleCodeUpdateInstance);
	};
	
StyleExplorerApplication.prototype._onEnterFrameStyleCodeUpdate = 
	function (event)
	{
		//Purge the enterframe listener
		this.removeEventListener("enterframe", this._onEnterFrameStyleCodeUpdateInstance);
		
		//Update style code
		var rootControlStyleTypes = this._dataListControls.getSelectedItem().rootControlStyleType;
		if (Array.isArray(rootControlStyleTypes))
		{
			var text = "";
			for (var i = 0; i < rootControlStyleTypes.length; i++)
				text += rootControlStyleTypes[i].generateStylingCode();
		}
		else
			text = rootControlStyleTypes.generateStylingCode();
			
		this._textSandboxStyleCode.setStyle("Text", text);
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
		
		this._onToggleButtonCopyCodeFocusout(null);
	};	
	
