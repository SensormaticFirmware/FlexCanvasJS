
/**
 * @depends ListContainerElement.js
 * @depends ButtonElement.js
 */

//////////////////////////////////////////////////////////////
//////////////////AlertElement////////////////////////////////

/**
 * @class AlertElement
 * @inherits ListContainerElement
 * 
 * AlertElement is a class used to render pop up alerts.  Any element 
 * may be used as an alert. This class is a helper that implements
 * common features, styles, and functionality for basic alerts. 
 * 
 * See CanvasManager addAlert() and removeAlert() for more info.
 * 
 * @constructor AlertElement 
 * Creates new AlertElement instance.
 */

function AlertElement() //extends ListContainerElement
{
	AlertElement.base.prototype.constructor.call(this);
	
		this._labelTitle = new LabelElement();
		this._contentContainer = new ListContainerElement();
		
			this._textContent = new TextElement();
			this._buttonContainer = new ListContainerElement();
			
		this._contentContainer.addElement(this._textContent);
		this._contentContainer.addElement(this._buttonContainer);
		
	this.addElement(this._labelTitle);
	this.addElement(this._contentContainer);
	
	
	///////Event handlers////////////
	
	var _self = this;
	
	//Private event handlers, proxy to prototype.
	
	this._onAlertClickInstance = 
		function (mouseEvent)
		{
			_self._onAlertClick(mouseEvent);
		}
	
	this.addEventListener("click", this._onAlertClickInstance);
	
	
	/////////////////////////////////
	
	this._selectionCallback = null;
	this._buttonTextArray = [];
}

//Inherit from ListContainerElement
AlertElement.prototype = Object.create(ListContainerElement.prototype);
AlertElement.prototype.constructor = AlertElement;
AlertElement.base = ListContainerElement;


/////////////Style Types///////////////////////////////

AlertElement._StyleTypes = Object.create(null);

/**
 * @style AlertTitleLabelStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to the title LabelElement.
 */
AlertElement._StyleTypes.AlertTitleLabelStyle = 							StyleableBase.EStyleType.SUBSTYLE;

/**
 * @style AlertContentListContainerStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to content ListContainer.
 * This container parents the content text and button list.
 */
AlertElement._StyleTypes.AlertContentListContainerStyle = 					StyleableBase.EStyleType.SUBSTYLE;

/**
 * @style AlertButtonListContainerStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to button ListContainer.
 * This container parents the alert selection buttons.
 */
AlertElement._StyleTypes.AlertButtonListContainerStyle = 					StyleableBase.EStyleType.SUBSTYLE;

/**
 * @style AlertContentTextStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to the content TextElement.
 */
AlertElement._StyleTypes.AlertContentTextStyle = 							StyleableBase.EStyleType.SUBSTYLE;

/**
 * @style AlertButtonClass CanvasElement
 * 
 * The CanvasElement or subclass constructor type used to generate the alert selection buttons.
 * Default value is ButtonElement. Alert will set the "Text" style and the _listData on this element 
 * via the text supplied by the array passed to setButtons().
 */
AlertElement._StyleTypes.AlertButtonClass = 								StyleableBase.EStyleType.NORMAL;

/**
 * @style AlertButtonStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to the alert selection buttons.
 */
AlertElement._StyleTypes.AlertButtonStyle = 								StyleableBase.EStyleType.SUBSTYLE;


////////////Default Styles///////////////////////////

AlertElement.AlertTitleLabelStyle = new StyleDefinition();
AlertElement.AlertTitleLabelStyle.setStyle("TextStyle", 						"bold");
AlertElement.AlertTitleLabelStyle.setStyle("Padding", 							5);
AlertElement.AlertTitleLabelStyle.setStyle("PaddingTop", 						10);
AlertElement.AlertTitleLabelStyle.setStyle("TextHorizontalAlign", 				"center");
AlertElement.AlertTitleLabelStyle.setStyle("PercentWidth", 						100);

AlertElement.AlertContentListContainerStyle = new StyleDefinition();
AlertElement.AlertContentListContainerStyle.setStyle("Padding", 				5);
AlertElement.AlertContentListContainerStyle.setStyle("LayoutGap", 				10);
AlertElement.AlertContentListContainerStyle.setStyle("PercentWidth", 			100);
AlertElement.AlertContentListContainerStyle.setStyle("PercentHeight", 			100);

AlertElement.AlertContentTextStyle = new StyleDefinition();
AlertElement.AlertContentTextStyle.setStyle("TextHorizontalAlign", 				"center");
AlertElement.AlertContentTextStyle.setStyle("PercentWidth", 					100);
AlertElement.AlertContentTextStyle.setStyle("PercentHeight", 					100);

AlertElement.AlertButtonListContainerStyle = new StyleDefinition();
AlertElement.AlertButtonListContainerStyle.setStyle("LayoutHorizontalAlign", 	"center");
AlertElement.AlertButtonListContainerStyle.setStyle("LayoutDirection", 			"horizontal");
AlertElement.AlertButtonListContainerStyle.setStyle("LayoutGap", 				10);
AlertElement.AlertButtonListContainerStyle.setStyle("Padding", 					5);
AlertElement.AlertButtonListContainerStyle.setStyle("PercentWidth", 			100);

AlertElement.AlertButtonStyle = new StyleDefinition();
AlertElement.AlertButtonStyle.setStyle("MinWidth", 								70);

AlertElement.StyleDefault = new StyleDefinition();
AlertElement.StyleDefault.setStyle("BorderType", 								"solid");
AlertElement.StyleDefault.setStyle("BorderThickness", 							1);
AlertElement.StyleDefault.setStyle("BackgroundFill", 							"#FFFFFF");
AlertElement.StyleDefault.setStyle("ShadowSize", 								2);
AlertElement.StyleDefault.setStyle("ShadowOffsetX", 							1);
AlertElement.StyleDefault.setStyle("ShadowOffsetY", 							1);
AlertElement.StyleDefault.setStyle("HorizontalCenter", 							0);
AlertElement.StyleDefault.setStyle("VerticalCenter", 							0);
AlertElement.StyleDefault.setStyle("MinWidth", 									300);
AlertElement.StyleDefault.setStyle("MinHeight", 								100);
AlertElement.StyleDefault.setStyle("AlertButtonClass", 							ButtonElement);
AlertElement.StyleDefault.setStyle("AlertButtonStyle", 							AlertElement.AlertButtonStyle);
AlertElement.StyleDefault.setStyle("AlertTitleLabelStyle", 						AlertElement.AlertTitleLabelStyle);
AlertElement.StyleDefault.setStyle("AlertContentListContainerStyle", 			AlertElement.AlertContentListContainerStyle);
AlertElement.StyleDefault.setStyle("AlertContentTextStyle", 					AlertElement.AlertContentTextStyle);
AlertElement.StyleDefault.setStyle("AlertButtonListContainerStyle", 			AlertElement.AlertButtonListContainerStyle);

/**
 * @function createAlert
 * @static
 * Helper function for automatically creating, showing, and closing an alert.
 * 
 * @param canvasManager CanvasManager
 * The CanvasManager instance the alert should be shown.
 * 
 * @param titleText String
 * Text that should be applied to the title LabelElement
 * 
 * @param contentText String
 * Text that should be applied to the content TextElement
 * 
 * @param buttonTextArray Array
 * Array of String used to generate the alert selection buttons and text.
 * 
 * @param styleDefinitions StyleDefinition
 * StyleDefinition or [StyleDefinition] array to apply to the alert instance.
 * 
 * @param alertClosedCallback Function
 * Function to be called when the alert is closed via one of the selection buttons being clicked.
 * Signature: function onButtonClicked(index, text)
 * 
 * @returns AlertElement
 * The newly created alert instance
 */
AlertElement.createAlert = 
	function (canvasManager, titleText, contentText, buttonTextArray, styleDefinitions, alertClosedCallback)
	{
		var alert = new AlertElement();
		alert.setStyleDefinitions(styleDefinitions);
		alert.setTitleText(titleText);
		alert.setContentText(contentText);
		alert.setButtons(buttonTextArray);
		
		alert.setSelectionCallback(
			function(index, text)
			{
				canvasManager.removeAlert(alert);
				
				if (alertClosedCallback != null)
					alertCloseCallback(index, text);
			});
		
		canvasManager.addAlert(alert);
		return alert;
	};
	

///////////Public/////////////////////////////////////

/**
 * @function setTitleText
 * Sets the text to apply to the alert title LabelElement
 * 
 * @param text String
 * The string use as the title text.
 */
AlertElement.prototype.setTitleText = 
	function (text)
	{
		this._labelTitle.setStyle("Text", text);
	};
	
/**
 * @function setContentText
 * Sets the text to apply to the alert content TextElement
 * 
 * @param text String
 * The string use as the content text.
 */	
AlertElement.prototype.setContentText = 
	function (text)
	{
		this._textContent.setStyle("Text", text);
	};
	
/**
 * @function setButtons
 * Sets the array of text to used to generate the alert's selection buttons.
 * 
 * @param buttonTextArray Array
 * Array of Strings used to generate buttons and apply text. 
 */		
AlertElement.prototype.setButtons = 
	function (buttonTextArray)
	{
		//Use emtpy array rather than null
		if (buttonTextArray == null)
			buttonTextArray = [];
	
		//Copy the buttons in case styles change later
		if (this._buttonTextArray != buttonTextArray)
			this._buttonTextArray = buttonTextArray.slice();
	
		var i;
		var button;
		var buttonClass = this.getStyle("AlertButtonClass");
		
		//Handle button class change - happens when called due to style change (purge all buttons)
		if (buttonClass == null || 
			(this._buttonContainer.getNumElements() > 0 && this._buttonContainer.getElementAt(0).constructor != buttonClass))
		{
			while (this._buttonContainer.getNumElements() > 0)
				this._buttonContainer.removeElementAt(0);
		}
		
		//Purge excess buttons
		while (this._buttonContainer.getNumElements() > buttonTextArray.length)
			this._buttonContainer.removeElementAt(this._buttonContainer.getNumElements() - 1);
		
		//Create new buttons & set text
		if (buttonClass != null)
		{
			for (i = 0; i < buttonTextArray.length; i++)
			{
				button = this._buttonContainer.getElementAt(i);
				
				if (button == null)
				{
					button = new (buttonClass)();
					this._applySubStylesToElement("AlertButtonStyle", button);
					this._buttonContainer.addElementAt(button, i);
				}
				
				button.setStyle("Text", buttonTextArray[i]);
				button._setListData(new DataListData(this, i), buttonTextArray[i]);
			}
		}
	};

/**
 * @function setSelectionCallback
 * Sets the callback to be called when an alert button is clicked.
 * 
 * @param callbackFunction Function
 * Function to call when an alert button is clicked.
 * Signature: function onAlertButtonClicked(index, text) 
 */		
AlertElement.prototype.setSelectionCallback = 
	function (callbackFunction)
	{
		this._selectionCallback = callbackFunction
	};

///////////Internal/////////////////////////////////////

//@override
AlertElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		AlertElement.base.prototype._doStylesUpdated.call(this, stylesMap);
	
		////Update Substyles/////////
		
		if ("AlertTitleLabelStyle" in stylesMap)
			this._applySubStylesToElement("AlertTitleLabelStyle", this._labelTitle);
		
		if ("AlertContentListContainerStyle" in stylesMap)
			this._applySubStylesToElement("AlertContentListContainerStyle", this._contentContainer);
		
		if ("AlertButtonListContainerStyle" in stylesMap)
			this._applySubStylesToElement("AlertButtonListContainerStyle", this._buttonContainer);
		
		if ("AlertContentTextStyle" in stylesMap)
			this._applySubStylesToElement("AlertContentTextStyle", this._textContent);
		
		if ("AlertButtonStyle" in stylesMap || "AlertButtonClass" in stylesMap)
			this.setButtons(this._buttonTextArray);
	};	

AlertElement.prototype._onAlertClick = 
	function (mouseEvent)
	{
		//Bail if no callback
		if (this._selectionCallback == null)
			return;
		
		var buttonIndex = this._buttonContainer.getElementIndex(mouseEvent.getTarget());
		
		//Bail if it wasn't one of the buttons that fired the event
		if (buttonIndex == -1)
			return;
		
		//Do callback
		this._selectionCallback(buttonIndex, this._buttonTextArray[buttonIndex]);
	};


