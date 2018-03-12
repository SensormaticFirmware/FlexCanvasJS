
function CCAttributeLinks() //extends ListContainerElement
{
	//Call base constructor
	CCAttributeLinks.base.prototype.constructor.call(this);
	
	this.setStyle("LayoutDirection", "horizontal");
	this.setStyle("LayoutVerticalAlign", "middle");
	
		this._labelCreditSoundName = new LabelElement();
		this._labelCreditSoundName.setStyleDefinitions([textCreditsStyle, textLinkStyle]);
	
		this._labelCreditSoundBy = new LabelElement();
		this._labelCreditSoundBy.setStyleDefinitions([textCreditsStyle]);
		this._labelCreditSoundBy.setStyle("Text", " By ");
		
		this._labelCreditSoundAuthor = new LabelElement();
		this._labelCreditSoundAuthor.setStyleDefinitions([textCreditsStyle, textLinkStyle]);
		
		this._labelCreditSoundSpace = new LabelElement();
		this._labelCreditSoundSpace.setStyleDefinitions([textCreditsStyle]);
		this._labelCreditSoundSpace.setStyle("Text", " ");
		
		this._labelCreditSoundLicense = new LabelElement();
		this._labelCreditSoundLicense.setStyleDefinitions([textCreditsStyle, textLinkStyle]);
		
	this.addElement(this._labelCreditSoundName);
	this.addElement(this._labelCreditSoundBy);
	this.addElement(this._labelCreditSoundAuthor);
	this.addElement(this._labelCreditSoundSpace);
	this.addElement(this._labelCreditSoundLicense);
	
	////////////
	
	
	var _self = this;
	
	this._onLabelClickInstance = 
		function (event)
		{
			_self._onLabelClick(event);
		};
		
	this._labelCreditSoundName.addEventListener("click", this._onLabelClickInstance);
	this._labelCreditSoundAuthor.addEventListener("click", this._onLabelClickInstance);
	this._labelCreditSoundLicense.addEventListener("click", this._onLabelClickInstance);
	
	
	///////////
	
	this._licenseData = null;
}

//Inherit from ListContainerElement
CCAttributeLinks.prototype = Object.create(ListContainerElement.prototype);
CCAttributeLinks.prototype.constructor = CCAttributeLinks;
CCAttributeLinks.base = ListContainerElement;

CCAttributeLinks.prototype.setLicenseData = 
	function (data)
	{
		this._licenseData = data;
		
		this._labelCreditSoundName.setStyle("Text", data.name);
		this._labelCreditSoundAuthor.setStyle("Text", data.author);
		this._labelCreditSoundLicense.setStyle("Text", data.license);
	};

CCAttributeLinks.prototype._onLabelClick = 
	function (event)
	{
		var URL = null;
	
		if (event.getTarget() == this._labelCreditSoundName)
			URL = this._licenseData.link;
		else if (event.getTarget() == this._labelCreditSoundAuthor)
			URL = this._licenseData.authorLink;
		else
			URL = this._licenseData.licenseLink;
			
		window.open(URL, "_blank", " ");
	};


