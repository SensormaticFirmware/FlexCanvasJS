
/**
 * @depends EventDispatcher.js
 */

///////////////////////////////////////////////////////////////////
///////////////////////ToggleButtonGroup///////////////////////////

/**
 * @class ToggleButtonGroup
 * @inherits EventDispatcher
 * 
 * Convenience helper class for grouping ToggleButtons or subclasses.
 * The ToggleButtonGroup can be assigned to set of toggle buttons
 * and will only allow a single ToggleButton to be selected at a time.
 * When a ToggleButton changes state, the ToggleButtonGroup will dispatch
 * a changed event. Use this for functionality like RadioButtons and Tabs.
 * 
 * @constructor ToggleButtonGroup 
 * Creates new ToggleButtonGroup instance.
 */
function ToggleButtonGroup()
{
	ToggleButtonGroup.base.prototype.constructor.call(this);
	
	this._selectedButton = null;
	
	this._toggleButtons = [];
	
	var _self = this;
	
	this._toggleButtonChangedInstance =
		function (event)
		{
			_self._toggleButtonChanged(event);
		};
}

//Inherit from EventDispatcher
ToggleButtonGroup.prototype = Object.create(EventDispatcher.prototype);
ToggleButtonGroup.prototype.constructor = ToggleButtonGroup;
ToggleButtonGroup.base = EventDispatcher;

////////////Events/////////////////////////////////////

/**
 * @event changed DispatcherEvent
 * Dispatched when the selected ToggleButton is changed due to user interaction.
 */

//////////////Public Functions/////////////////////////////////////////

/**
 * @function addButton
 * Adds a ToggleButton or subclass to be managed by ToggleButtonGroup.
 * 
 * @param toggleButton ToggleButtonElement
 * ToggleButton or subclass to be managed by ToggleButtonGroup.
 * 
 * @returns boolean
 * True when successfully added, false if is not a instance of ToggleButton or already added.
 */	
ToggleButtonGroup.prototype.addButton = 
	function (toggleButton)
	{
		if (toggleButton == null || 
			toggleButton instanceof ToggleButtonElement == false ||
			this._toggleButtons.indexOf(toggleButton) > -1)
			return false;
		
		this._toggleButtons.push(toggleButton);
		toggleButton.addEventListener("changed", this._toggleButtonChangedInstance);
		
		return true;
	};

/**
 * @function removeButton
 * Removes a ToggleButton or subclass currently being managed by ToggleButtonGroup
 * 
 * @param toggleButton ToggleButtonElement
 * ToggleButton or subclass to be removed from ToggleButtonGroup.
 * 
 * @returns boolean
 * True when successfully removed, false if the toggle button is not currently managed by ToggleButtonGroup.
 */		
ToggleButtonGroup.prototype.removeButton = 
	function (toggleButton)
	{
		var index = this._toggleButtons.indexOf(toggleButton);
	
		if (index == -1)
			return false;
		
		this._toggleButtons.splice(index, 1);
		toggleButton.removeEventListener("changed", this._toggleButtonChangedInstance);
	};	

/**
 * @function clearButtons
 * Removes all ToggleButtons currently managed by ToggleButtonGroup.
 */		
ToggleButtonGroup.prototype.clearButtons = 
	function ()
	{
		for (var i = 0; i < this._toggleButtons.length; i++)
			this._toggleButtons[i].removeEventListener("changed", this._toggleButtonChangedInstance);
		
		this._toggleButtons = [];
	};
	
/**
 * @function setSelectedButton
 * Sets the ToggleButton to be selected.
 * 
 * @param toggleButton ToggleButtonElement
 * ToggleButton or subclass to be selected. May be set to null.
 */	
ToggleButtonGroup.prototype.setSelectedButton = 
	function (toggleButton)
	{
		if (this._selectedButton == toggleButton)
			return;
			
		if (toggleButton == null || this._toggleButtons.indexOf(toggleButton) > -1)
		{
			this._selectedButton = toggleButton;
			
			if (this._selectedButton != null)
				this._selectedButton.setSelected(true);
			
			for (var i = 0; i < this._toggleButtons.length; i++)
			{
				if (this._toggleButtons[i] != toggleButton)
					this._toggleButtons[i].setSelected(false);
			}
		}
	};
	
/**
 * @function getSelectedButton
 * Gets the selected ToggleButton.
 * 
 * @returns ToggleButtonElement
 * ToggleButton or subclass currently selected. May be null.
 */		
ToggleButtonGroup.prototype.getSelectedButton = 
	function ()
	{
		return this._selectedButton;
	};
	
////////////////////Internal/////////////////////////
	
	
/**
 * @function _toggleButtonChanged
 * Event handler for managed ToggleButton's "changed" event. 
 * Updates toggle button selected states and dispatches "changed" event.
 * 
 * @param event ElementEvent
 * ElementEvent to be processed.
 */		
ToggleButtonGroup.prototype._toggleButtonChanged = 
	function (elementEvent)
	{
		var toggleButton = elementEvent.getTarget();
		
		if (toggleButton.getSelected() == true)
			this._selectedButton = toggleButton;
		else
			this._selectedButton = null;
		
		for (var i = 0; i < this._toggleButtons.length; i++)
		{
			if (this._toggleButtons[i] != toggleButton)
				this._toggleButtons[i].setSelected(false);
		}
		
		//Dispatch changed event.
		if (this.hasEventListener("changed", null) == true)
			this.dispatchEvent(new DispatcherEvent("changed", false));
	};
	
	