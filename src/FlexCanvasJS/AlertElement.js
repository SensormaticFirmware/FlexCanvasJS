
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
		this._labelTitle.setStyle("PercentWidth", 100);
		
		this._contentContainer = new ListContainerElement();
		this._contentContainer.setStyle("PercentWidth", 100);
		this._contentContainer.setStyle("PercentHeight", 100);
	
			this._textContent = new TextElement();
			this._textContent.setStyle("PercentWidth", 100);
			this._textContent.setStyle("PercentHeight", 100);
			
			this._buttonContainer = new ListContainerElement();
			this._buttonContainer.setStyle("PercentWidth", 100);
			
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
 * @style TitleLabelStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to the title LabelElement.
 */
AlertElement._StyleTypes.TitleLabelStyle = 									StyleableBase.EStyleType.SUBSTYLE;

/**
 * @style ContentListContainerStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to content ListContainer.
 * This container parents the content text and button list.
 */
AlertElement._StyleTypes.ContentListContainerStyle = 						StyleableBase.EStyleType.SUBSTYLE;

/**
 * @style ButtonListContainerStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to button ListContainer.
 * This container parents the alert selection buttons.
 */
AlertElement._StyleTypes.ButtonListContainerStyle = 						StyleableBase.EStyleType.SUBSTYLE;

/**
 * @style ContentTextStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to the content TextElement.
 */
AlertElement._StyleTypes.ContentTextStyle = 								StyleableBase.EStyleType.SUBSTYLE;

/**
 * @style ButtonClass CanvasElement
 * 
 * The CanvasElement constructor type used to generate the alert selection buttons. 
 * Note that any CanvasElement type may be used, but must support the "Text" style. 
 */
AlertElement._StyleTypes.ButtonClass = 										StyleableBase.EStyleType.NORMAL;

/**
 * @style ButtonStyle StyleDefinition
 * 
 * The StyleDefinition or [StyleDefinition] array to apply to the alert selection buttons.
 */
AlertElement._StyleTypes.ButtonStyle = 										StyleableBase.EStyleType.SUBSTYLE;


////////////Default Styles///////////////////////////

AlertElement.TitleLabelStyle = new StyleDefinition();
AlertElement.TitleLabelStyle.setStyle("TextStyle", 							"bold");
AlertElement.TitleLabelStyle.setStyle("Padding", 							5);
AlertElement.TitleLabelStyle.setStyle("PaddingTop", 						10);
AlertElement.TitleLabelStyle.setStyle("TextHorizontalAlign", 				"center");

AlertElement.ContentListContainerStyle = new StyleDefinition();
AlertElement.ContentListContainerStyle.setStyle("Padding", 					5);
AlertElement.ContentListContainerStyle.setStyle("LayoutGap", 				10);

AlertElement.ContentTextStyle = new StyleDefinition();
AlertElement.ContentTextStyle.setStyle("TextHorizontalAlign", 				"center");

AlertElement.ButtonListContainerStyle = new StyleDefinition();
AlertElement.ButtonListContainerStyle.setStyle("LayoutHorizontalAlign", 	"center");
AlertElement.ButtonListContainerStyle.setStyle("LayoutDirection", 			"horizontal");
AlertElement.ButtonListContainerStyle.setStyle("LayoutGap", 				10);
AlertElement.ButtonListContainerStyle.setStyle("Padding", 					5);

AlertElement.ButtonStyle = new StyleDefinition();
AlertElement.ButtonStyle.setStyle("MinWidth", 70);

AlertElement.StyleDefault = new StyleDefinition();
AlertElement.StyleDefault.setStyle("BorderType", 							"solid");
AlertElement.StyleDefault.setStyle("BorderThickness", 						1);
AlertElement.StyleDefault.setStyle("BackgroundFill", 						"#FFFFFF");
AlertElement.StyleDefault.setStyle("ShadowSize", 							2);
AlertElement.StyleDefault.setStyle("ShadowOffsetX", 						1);
AlertElement.StyleDefault.setStyle("ShadowOffsetY", 						1);
AlertElement.StyleDefault.setStyle("HorizontalCenter", 						0);
AlertElement.StyleDefault.setStyle("VerticalCenter", 						0);
AlertElement.StyleDefault.setStyle("MinWidth", 								300);
AlertElement.StyleDefault.setStyle("MinHeight", 							100);
AlertElement.StyleDefault.setStyle("ButtonClass", 							ButtonElement);
AlertElement.StyleDefault.setStyle("ButtonStyle", 							AlertElement.ButtonStyle);
AlertElement.StyleDefault.setStyle("TitleLabelStyle", 						AlertElement.TitleLabelStyle);
AlertElement.StyleDefault.setStyle("ContentListContainerStyle", 			AlertElement.ContentListContainerStyle);
AlertElement.StyleDefault.setStyle("ContentTextStyle", 						AlertElement.ContentTextStyle);
AlertElement.StyleDefault.setStyle("ButtonListContainerStyle", 				AlertElement.ButtonListContainerStyle);

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
		var buttonClass = this.getStyle("ButtonClass");
		
		//Handle button class change - happens when called due to style change (purge all buttons)
		if (buttonClass == null || 
			(this._buttonContainer.getNumElements() > 0 && this._buttonContainer.getElementAt(0).constructor != buttonClass))
		{
			while (this._buttonContainer.getNumElements() > 0)
				this._buttonContainer.removeElementAt(0);
				
			return;
		}
		
		//Purge excess buttons
		while (this._buttonContainer.getNumElements() > buttonTextArray.length)
			this._buttonContainer.removeElementAt(this._buttonContainer.getNumElements() - 1);
		
		//Create new buttons & set text
		for (i = 0; i < buttonTextArray.length; i++)
		{
			button = this._buttonContainer.getElementAt(i);
			
			if (button == null)
			{
				button = new (buttonClass)();
				this._applySubStylesToElement("ButtonStyle", button);
				this._buttonContainer.addElementAt(button, i);
			}
			
			button.setStyle("Text", buttonTextArray[i]);
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
		
		if ("TitleLabelStyle" in stylesMap)
			this._applySubStylesToElement("TitleLabelStyle", this._labelTitle);
		
		if ("ContentListContainerStyle" in stylesMap)
			this._applySubStylesToElement("ContentListContainerStyle", this._contentContainer);
		
		if ("ButtonListContainerStyle" in stylesMap)
			this._applySubStylesToElement("ButtonListContainerStyle", this._buttonContainer);
		
		if ("ContentTextStyle" in stylesMap)
			this._applySubStylesToElement("ContentTextStyle", this._textContent);
		
		if ("ButtonStyle" in stylesMap || "ButtonClass" in stylesMap)
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


