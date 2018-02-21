
/**
 * @depends ButtonElement.js
 */

//////////////////////////////////////////////////////////////////
/////////////DataGridHeaderItemRenderer////////////////////////////

/**
 * @class DataGridHeaderItemRenderer
 * @inherits ButtonElement
 * 
 * Default DataGrid HeaderItem renderer based on Button. 
 * Adds sort icons.
 * 
 * @constructor DataGridHeaderItemRenderer 
 * Creates new DataGridHeaderItemRenderer instance.
 */
function DataGridHeaderItemRenderer()
{
	DataGridHeaderItemRenderer.base.prototype.constructor.call(this);
	
	this._sortAscIcon = null;
	this._sortDescIcon = null;
	this._currentSortDirection = null;
}

//Inherit from ButtonElement
DataGridHeaderItemRenderer.prototype = Object.create(ButtonElement.prototype);
DataGridHeaderItemRenderer.prototype.constructor = DataGridHeaderItemRenderer;
DataGridHeaderItemRenderer.base = ButtonElement;

//////Style Types//////////////////////
DataGridHeaderItemRenderer._StyleTypes = Object.create(null);

/**
 * @style SortAscIconClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the ascending sort icon. 
 * Defaults to Button. HeaderItemRenderer proxies its SkinState style to the sort icons so
 * the sort icons will change state along with the HeaderItemRenderer.
 */
DataGridHeaderItemRenderer._StyleTypes.SortAscIconClass =			StyleableBase.EStyleType.NORMAL;		// CanvasElement constructor

/**
 * @style SortAscIconStyle StyleDefinition
 * 
 * The StyleDefinition to apply ascending sort icon element.
 */
DataGridHeaderItemRenderer._StyleTypes.SortAscIconStyle =			StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition

/**
 * @style SortDescIconClass CanvasElement
 * 
 * The CanvasElement constructor to be used for the descending sort icon. 
 * Defaults to Button. HeaderItemRenderer proxies its SkinState style to the sort icons so
 * the sort icons will change state along with the HeaderItemRenderer.
 */
DataGridHeaderItemRenderer._StyleTypes.SortDescIconClass =			StyleableBase.EStyleType.NORMAL;		// CanvasElement constructor

/**
 * @style SortDescIconStyle StyleDefinition
 * 
 * The StyleDefinition to apply descending sort icon element.
 */
DataGridHeaderItemRenderer._StyleTypes.SortDescIconStyle =			StyleableBase.EStyleType.SUBSTYLE;		// StyleDefinition

/**
 * @style SortIconGap Number
 * 
 * Distance in pixels between the sort icon and the header label.
 */
DataGridHeaderItemRenderer._StyleTypes.SortIconGap =					StyleableBase.EStyleType.NORMAL;		// number

/**
 * @style SortIconPlacement String
 * 
 * Determines placement of the sort icon. Allowable values are "left" or "right".
 */
DataGridHeaderItemRenderer._StyleTypes.SortIconPlacement =				StyleableBase.EStyleType.NORMAL;		// "left" || "right"


/////////Default Styles///////////////

//Make disabled skin look like "up" skin (just not click-able)
DataGridHeaderItemRenderer.DisabledSkinStyleDefault = new StyleDefinition();
DataGridHeaderItemRenderer.DisabledSkinStyleDefault.setStyle("BackgroundColor", 		"#EBEBEB");
DataGridHeaderItemRenderer.DisabledSkinStyleDefault.setStyle("BorderType", 				null);

//Other up/over/down skins (kill border)
DataGridHeaderItemRenderer.SkinStyleDefault = new StyleDefinition();
DataGridHeaderItemRenderer.SkinStyleDefault.setStyle("BorderType", 						null);


DataGridHeaderItemRenderer.StyleDefault = new StyleDefinition();
DataGridHeaderItemRenderer.StyleDefault.setStyle("UpSkinStyle", 						DataGridHeaderItemRenderer.SkinStyleDefault);
DataGridHeaderItemRenderer.StyleDefault.setStyle("OverSkinStyle", 						DataGridHeaderItemRenderer.SkinStyleDefault);
DataGridHeaderItemRenderer.StyleDefault.setStyle("DownSkinStyle", 						DataGridHeaderItemRenderer.SkinStyleDefault);
DataGridHeaderItemRenderer.StyleDefault.setStyle("DisabledSkinStyle", 					DataGridHeaderItemRenderer.DisabledSkinStyleDefault);
DataGridHeaderItemRenderer.StyleDefault.setStyle("DisabledTextColor", 					"#000000");

DataGridHeaderItemRenderer.StyleDefault.setStyle("TextHorizontalAlign", 				"left");
DataGridHeaderItemRenderer.StyleDefault.setStyle("PaddingTop",							4);
DataGridHeaderItemRenderer.StyleDefault.setStyle("PaddingBottom",						4);
DataGridHeaderItemRenderer.StyleDefault.setStyle("PaddingLeft",							8);
DataGridHeaderItemRenderer.StyleDefault.setStyle("PaddingRight",						8);

/////Sort Icon default styles //////

//Ascending Sort Icon
DataGridHeaderItemRenderer.SortAscIconSkinBgShapeDefault = new ArrowShape();
DataGridHeaderItemRenderer.SortAscIconSkinBgShapeDefault.setStyle("Direction", 				"up");

DataGridHeaderItemRenderer.SortAscIconSkinStyleDefault = new StyleDefinition();
DataGridHeaderItemRenderer.SortAscIconSkinStyleDefault.setStyle("BorderType", 				null);
DataGridHeaderItemRenderer.SortAscIconSkinStyleDefault.setStyle("BackgroundColor", 			"#444444");
DataGridHeaderItemRenderer.SortAscIconSkinStyleDefault.setStyle("BackgroundShape", 			DataGridHeaderItemRenderer.SortAscIconSkinBgShapeDefault);

DataGridHeaderItemRenderer.SortAscIconStyleDefault = new StyleDefinition();
DataGridHeaderItemRenderer.SortAscIconStyleDefault.setStyle("UpSkinStyle", 					DataGridHeaderItemRenderer.SortAscIconSkinStyleDefault);
DataGridHeaderItemRenderer.SortAscIconStyleDefault.setStyle("OverSkinStyle", 				DataGridHeaderItemRenderer.SortAscIconSkinStyleDefault);
DataGridHeaderItemRenderer.SortAscIconStyleDefault.setStyle("DownSkinStyle", 				DataGridHeaderItemRenderer.SortAscIconSkinStyleDefault);
//Note that SkinState is proxied to the sort icons, so the sort icons will change state along with the HeaderRenderer (unless you turn mouse back on)
DataGridHeaderItemRenderer.SortAscIconStyleDefault.setStyle("MouseEnabled", 				false);

//Descending Sort Icon
DataGridHeaderItemRenderer.SortDescIconSkinBgShapeDefault = new ArrowShape();
DataGridHeaderItemRenderer.SortDescIconSkinBgShapeDefault.setStyle("Direction", 			"down");

DataGridHeaderItemRenderer.SortDescIconSkinStyleDefault = new StyleDefinition();
DataGridHeaderItemRenderer.SortDescIconSkinStyleDefault.setStyle("BorderType", 				null);
DataGridHeaderItemRenderer.SortDescIconSkinStyleDefault.setStyle("BackgroundColor", 		"#444444");
DataGridHeaderItemRenderer.SortDescIconSkinStyleDefault.setStyle("BackgroundShape", 		DataGridHeaderItemRenderer.SortDescIconSkinBgShapeDefault);

DataGridHeaderItemRenderer.SortDescIconStyleDefault = new StyleDefinition();
DataGridHeaderItemRenderer.SortDescIconStyleDefault.setStyle("UpSkinStyle", 				DataGridHeaderItemRenderer.SortDescIconSkinStyleDefault);
DataGridHeaderItemRenderer.SortDescIconStyleDefault.setStyle("OverSkinStyle", 				DataGridHeaderItemRenderer.SortDescIconSkinStyleDefault);
DataGridHeaderItemRenderer.SortDescIconStyleDefault.setStyle("DownSkinStyle", 				DataGridHeaderItemRenderer.SortDescIconSkinStyleDefault);

//Note that SkinState is proxied to the sort icons, so the sort icons will change state along with the HeaderRenderer (unless you turn mouse back on)
DataGridHeaderItemRenderer.SortDescIconStyleDefault.setStyle("MouseEnabled", 				false);

///////////////////////////////////

DataGridHeaderItemRenderer.StyleDefault.setStyle("SortAscIconClass",						ButtonElement);											// CanvasElement constructor
DataGridHeaderItemRenderer.StyleDefault.setStyle("SortAscIconStyle",						DataGridHeaderItemRenderer.SortAscIconStyleDefault);	// StyleDefinition
DataGridHeaderItemRenderer.StyleDefault.setStyle("SortDescIconClass",						ButtonElement);											// CanvasElement constructor
DataGridHeaderItemRenderer.StyleDefault.setStyle("SortDescIconStyle",						DataGridHeaderItemRenderer.SortDescIconStyleDefault);	// StyleDefinition

DataGridHeaderItemRenderer.StyleDefault.setStyle("SortIconGap",								3);			// number
DataGridHeaderItemRenderer.StyleDefault.setStyle("SortIconPlacement",						"right");	// "left" || "right"



//////Proxy////////////////////////////
DataGridHeaderItemRenderer._SortIconProxyMap = Object.create(null);

//Proxy the SkinState this way we can trigger icon skin changes when our skin changes without
//impacting the functionality of a custom icon. We'll also disable mouse on the default style.
DataGridHeaderItemRenderer._SortIconProxyMap.SkinState = 		true;


///////////Internal/////////////////////

/**
 * @function _createSortIcon
 * Generates a sort icon based on the IconClass styles.
 * 
 * @param isDecending boolean
 * True if the icon should be a descending icon, false otherwise.
 * 
 * @returns CanvasElement
 * The resulting sort icon element instance.
 */
DataGridHeaderItemRenderer.prototype._createSortIcon = 
	function (isDecending)
	{
		var iconClass = null;
		
		if (isDecending == true)
			iconClass = this.getStyle("SortDescIconClass");
		else
			iconClass = this.getStyle("SortAscIconClass");
		
		var newIcon = new (iconClass)();
		newIcon._setStyleProxy(new StyleProxy(this,DataGridHeaderItemRenderer._SortIconProxyMap));
		
		if (isDecending == true)
			this._applySubStylesToElement("SortDescIconStyle", newIcon);
		else
			this._applySubStylesToElement("SortAscIconStyle", newIcon);
		
		return newIcon;
	};

/**
 * @function _updateSortIcons
 * Updates sort icons in response to style and list data changes.
 */
DataGridHeaderItemRenderer.prototype._updateSortIcons = 
	function ()
	{
		if (this._listData == null)
			return;
	
		var listData = this._listData;
		var dataCollection = listData._parentGrid._listCollection;
		
		var sortDirection = null;
		
		if (dataCollection != null && 
			dataCollection._collectionSort != null && 
			dataCollection._collectionSort == listData._parentGrid._gridColumns[listData._columnIndex].getStyle("CollectionSort"))
		{
			if (dataCollection._collectionSort._isDecending == true)
				sortDirection = "down";
			else
				sortDirection = "up";
		}

		if (this._currentSortDirection != sortDirection)
		{
			this._currentSortDirection = sortDirection;
			this._invalidateLayout();
		}
		
		if (sortDirection == null)
		{
			if (this._sortAscIcon != null)
				this._sortAscIcon.setStyle("Visible", false);
			if (this._sortDescIcon != null)
				this._sortDescIcon.setStyle("Visible", false);
		}
		else if (sortDirection == "up")
		{
			var upIconClass = this.getStyle("SortAscIconClass");
			
			if (upIconClass == null)
			{
				if (this._sortAscIcon != null)
				{
					this._removeChild(this._sortAscIcon);
					this._sortAscIcon = null;
				}
			}
			else
			{
				if (this._sortAscIcon == null)
				{
					this._sortAscIcon = this._createSortIcon(false);
					this._addChild(this._sortAscIcon);
				}
				else if (this._sortAscIcon.constructor != upIconClass)
				{ //Icon Class changed
					this._removeChild(this._sortAscIcon);
					this._sortAscIcon = this._createSortIcon(false);
					this._addChild(this._sortAscIcon);
				}
				else
					this._applySubStylesToElement("SortAscIconStyle", this._sortAscIcon);
				
				if (this._sortDescIcon != null)
					this._sortDescIcon.setStyle("Visible", false);
				
				this._sortAscIcon.setStyle("Visible", true);
			}
		}
		else if (sortDirection == "down")
		{
			var downIconClass = this.getStyle("SortDescIconClass");
			
			if (downIconClass == null)
			{
				if (this._sortDescIcon != null)
				{
					this._removeChild(this._sortDescIcon);
					this._sortDescIcon = null;
				}
			}
			else
			{
				if (this._sortDescIcon == null)
				{
					this._sortDescIcon = this._createSortIcon(true);
					this._addChild(this._sortDescIcon);
				}
				else if (this._sortDescIcon.constructor != downIconClass)
				{ //Icon Class changed
					this._removeChild(this._sortDescIcon);
					this._sortDescIcon = this._createSortIcon(true);
					this._addChild(this._sortDescIcon);
				}
				else
					this._applySubStylesToElement("SortDescIconStyle", this._sortDescIcon);
				
				if (this._sortAscIcon != null)
					this._sortAscIcon.setStyle("Visible", false);
				
				this._sortDescIcon.setStyle("Visible", true);
			}
		}
	};

//@Override
DataGridHeaderItemRenderer.prototype._setListData = 
	function (listData, itemData)
	{
		DataGridHeaderItemRenderer.base.prototype._setListData.call(this, listData, itemData);
		
		if (listData == null)
			return;
		
		this.setStyle("Text", listData._parentGrid._gridColumns[listData._columnIndex].getStyle("HeaderText"));
		this._updateSortIcons();
	};

//@Override
DataGridHeaderItemRenderer.prototype._doStylesUpdated =
	function (stylesMap)
	{
		DataGridHeaderItemRenderer.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("SortAscIconClass" in stylesMap ||
			"SortAscIconStyle" in stylesMap ||
			"SortDescIconClass" in stylesMap ||
			"SortDescIconStyle" in stylesMap)
		{
			this._updateSortIcons();
		}
		
		if ("SortIconGap" in stylesMap || "SortIconPlacement" in stylesMap)
			this._invalidateLayout();
	};	
	
//@Override	
DataGridHeaderItemRenderer.prototype._doLayout = 
	function (paddingMetrics)
	{
		DataGridHeaderItemRenderer.base.prototype._doLayout.call(this, paddingMetrics);
	
		//Fix label position to leave room for sort indicator.
		if (this._labelElement != null && this._currentSortDirection != null)
		{
			var sortIcon = null;
			if (this._currentSortDirection == "up")
				sortIcon = this._sortAscIcon;
			else
				sortIcon = this._sortDescIcon;
			
			if (sortIcon != null)
			{
				var x = paddingMetrics.getX();
				var y = paddingMetrics.getY();
				var w = paddingMetrics.getWidth();
				var h = paddingMetrics.getHeight();
				
				var iconWidth = sortIcon.getStyle("Width");
				var iconHeight = sortIcon.getStyle("Height");
				
				if (iconHeight == null)
					iconHeight = paddingMetrics.getHeight() * .35;
				if (iconWidth == null)
					iconWidth = iconHeight * 1.5;
				
				if (w < iconWidth)
				{
					sortIcon._setActualSize(0, 0);
					this._labelElement._setActualSize(0, 0);
				}
				else
				{
					var gap = this.getStyle("SortIconGap");
					var iconPlacement = this.getStyle("SortIconPlacement");
					
					if (iconPlacement == "left")
					{
						this._labelElement._setActualPosition(x + iconWidth + gap, y);
						this._labelElement._setActualSize(w - iconWidth - gap, h);
						
						sortIcon._setActualPosition(x, y + (h / 2) - (iconHeight / 2));
						sortIcon._setActualSize(iconWidth, iconHeight);
					}
					else // "right"
					{
						this._labelElement._setActualPosition(x, y);
						this._labelElement._setActualSize(w - iconWidth - gap, h);
						
						sortIcon._setActualPosition(x + w - iconWidth, y + (h / 2) - (iconHeight / 2));
						sortIcon._setActualSize(iconWidth, iconHeight);
					}
				}
			}
		}
	};	