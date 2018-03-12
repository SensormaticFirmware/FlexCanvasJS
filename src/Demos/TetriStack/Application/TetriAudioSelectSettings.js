
function TetriAudioSelectSettings()
{
	//Call base constructor
	TetriAudioSelectSettings.base.prototype.constructor.call(this);
	
	////Layout////
	this.setStyle("LayoutDirection", "horizontal");
	
		this._checkboxMusic = new CheckboxElement(); 
		this._checkboxMusic.setStyleDefinitions([labelSelectStyle, labelPlayFieldSmallSizeStyle, buttonBackgroundStyle]);
		this._checkboxMusic.setStyle("Text", "Music");
		this._checkboxMusic.setSelected(TetriStackApplication.MusicEnabled);
		
		this._audioSelectContainerSpacer = new CanvasElement();
		this._audioSelectContainerSpacer.setStyle("Width", 50);
		
		this._checkboxSFX = new CheckboxElement(); 
		this._checkboxSFX.setStyleDefinitions([labelSelectStyle, labelPlayFieldSmallSizeStyle, buttonBackgroundStyle]);
		this._checkboxSFX.setStyle("Text", "SFX");
		this._checkboxSFX.setSelected(TetriStackApplication.SFXEnabled);
		
	this.addElement(this._checkboxMusic);
	this.addElement(this._audioSelectContainerSpacer);
	this.addElement(this._checkboxSFX);
	
	
	////Event Handling////
	var _self = this;
	
	//Need a different function instance for each handler, proxy to prototype.
	this._onCheckboxMusicChangedInstance = 
		function (event)
		{
			_self._onCheckboxMusicChanged(event);
		};
	this._onCheckboxSFXChangedInstance = 
		function (event)
		{
			_self._onCheckboxSFXChanged(event);
		};	
	this._onGlobalValueChangedInstance = 
		function (event)
		{
			_self._onGlobalValueChanged(event);
		};
	this._onTetriAudioSelectSettingsAddedInstance = 
		function (addedRemovedEvent)
		{
			_self._onTetriAudioSelectSettingsAdded(addedRemovedEvent);
		};
	this._onTetriAudioSelectSettingsRemovedInstance = 
		function (addedRemovedEvent)
		{
			_self._onTetriAudioSelectSettingsRemoved(addedRemovedEvent);
		};	
		
	this._checkboxMusic.addEventListener("changed", this._onCheckboxMusicChangedInstance);
	this._checkboxSFX.addEventListener("changed", this._onCheckboxSFXChangedInstance);
	this.addEventListener("added", this._onTetriAudioSelectSettingsAddedInstance);
	this.addEventListener("removed", this._onTetriAudioSelectSettingsRemovedInstance);
}

//Inherit from ListContainerElement
TetriAudioSelectSettings.prototype = Object.create(ListContainerElement.prototype);
TetriAudioSelectSettings.prototype.constructor = TetriAudioSelectSettings;
TetriAudioSelectSettings.base = ListContainerElement;


////INTERNAL////

//Added to display
TetriAudioSelectSettings.prototype._onTetriAudioSelectSettingsAdded = 
	function (addedRemovedEvent)
	{
		//Add a listener to global event dispatcher to detect settings changes from other instances.
		TetriStackApplication.GlobalEventDispatcher.addEventListener("audiochanged", this._onGlobalValueChangedInstance);
	};

//Removed from display
TetriAudioSelectSettings.prototype._onTetriAudioSelectSettingsRemoved = 
	function (addedRemovedEvent)
	{
		//Remove listener from global event dispatcher.
		TetriStackApplication.GlobalEventDispatcher.removeEventListener("audiochanged", this._onGlobalValueChangedInstance);
	};	
	
//Music toggled	
TetriAudioSelectSettings.prototype._onCheckboxMusicChanged = 
	function (event)
	{
		//Update static value
		TetriStackApplication.MusicEnabled = this._checkboxMusic.getSelected();
		
		//Dispatch event from global event dispatcher (update other instances of TetriAudioSelectSettings)
		TetriStackApplication.GlobalEventDispatcher._dispatchEvent(new DispatcherEvent("audiochanged"));
	};

//SFX toggled	
TetriAudioSelectSettings.prototype._onCheckboxSFXChanged = 
	function (event)
	{
		//Update static value
		TetriStackApplication.SFXEnabled = this._checkboxSFX.getSelected();
		
		//Dispatch event from global event dispatcher (update other instances of TetriAudioSelectSettings)
		TetriStackApplication.GlobalEventDispatcher._dispatchEvent(new DispatcherEvent("audiochanged"));
	};	

//Listener for global event dispatcher (detect settings change from any instance of TetriAudioSelectSettings)
TetriAudioSelectSettings.prototype._onGlobalValueChanged = 
	function (event)
	{
		//Update UI
		this._checkboxMusic.setSelected(TetriStackApplication.MusicEnabled);
		this._checkboxSFX.setSelected(TetriStackApplication.SFXEnabled);
	};	

	