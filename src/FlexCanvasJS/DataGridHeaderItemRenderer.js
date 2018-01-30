
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
 * @style IconGap Number
 * 
 * Distance in pixels between the sort icon and the header label.
 */
DataGridHeaderItemRenderer._StyleTypes.IconGap =					StyleableBase.EStyleType.NORMAL;		// number

/**
 * @style IconPlacement String
 * 
 * Determines placement of the sort icon. Allowable values are "left" or "right".
 */
DataGridHeaderItemRenderer._StyleTypes.IconPlacement =				StyleableBase.EStyleType.NORMAL;		// "left" || "right"


/////////Default Styles///////////////

DataGridHeaderItemRenderer.StyleDefault = new StyleDefinition();

//Override disabled styles, make them same as "up" state styles.
DataGridHeaderItemRenderer.StyleDefault.setStyle("DisabledSkinStyle", 		ButtonElement.UpSkinStyleDefault);
DataGridHeaderItemRenderer.StyleDefault.setStyle("DisabledTextColor", 		null);

DataGridHeaderItemRenderer.StyleDefault.setStyle("BorderType", 				"none");		
DataGridHeaderItemRenderer.StyleDefault.setStyle("TextSize", 				12);
DataGridHeaderItemRenderer.StyleDefault.setStyle("TextHorizontalAlign", 	"left");
DataGridHeaderItemRenderer.StyleDefault.setStyle("PaddingTop",				3);
DataGridHeaderItemRenderer.StyleDefault.setStyle("PaddingBottom",			3);
DataGridHeaderItemRenderer.StyleDefault.setStyle("PaddingLeft",				8);
DataGridHeaderItemRenderer.StyleDefault.setStyle("PaddingRight",			8);

/////Sort Icon default styles //////

//Ascending Sort Icon
DataGridHeaderItemRenderer.SortAscIconBgShapeDefault = new ArrowShape();
DataGridHeaderItemRenderer.SortAscIconBgShapeDefault.setStyle("Direction", "up");

DataGridHeaderItemRenderer.SortAscIconStyleDefault = new StyleDefinition();
DataGridHeaderItemRenderer.SortAscIconStyleDefault.setStyle("BorderType", 				"none");
DataGridHeaderItemRenderer.SortAscIconStyleDefault.setStyle("BackgroundColor", 			"#444444");
DataGridHeaderItemRenderer.SortAscIconStyleDefault.setStyle("BackgroundShape", 			DataGridHeaderItemRenderer.SortAscIconBgShapeDefault);
//Note that SkinState is proxied to the sort icons, so the sort icons will change state along with the HeaderRenderer (unless you turn mouse back on)
DataGridHeaderItemRenderer.SortAscIconStyleDefault.setStyle("MouseEnabled", 			false);

//Wipe out the skin styles provided by button (we're currently just using the base state for all skins).
DataGridHeaderItemRenderer.SortAscIconStyleDefault.setStyle("UpSkinStyle", 				null);
DataGridHeaderItemRenderer.SortAscIconStyleDefault.setStyle("OverSkinStyle", 			null);
DataGridHeaderItemRenderer.SortAscIconStyleDefault.setStyle("DownSkinStyle", 			null);
DataGridHeaderItemRenderer.SortAscIconStyleDefault.setStyle("DisabledSkinStyle", 		null);

//Descending Sort Icon
DataGridHeaderItemRenderer.SortDescIconBgShapeDefault = new ArrowShape();
DataGridHeaderItemRenderer.SortDescIconBgShapeDefault.setStyle("Direction", "down");

DataGridHeaderItemRenderer.SortDescIconStyleDefault = new StyleDefinition();
DataGridHeaderItemRenderer.SortDescIconStyleDefault.setStyle("BorderType", 				"none");
DataGridHeaderItemRenderer.SortDescIconStyleDefault.setStyle("BackgroundColor", 		"#444444");
DataGridHeaderItemRenderer.SortDescIconStyleDefault.setStyle("BackgroundShape", 		DataGridHeaderItemRenderer.SortDescIconBgShapeDefault);
//Note that SkinState is proxied to the sort icons, so the sort icons will change state along with the HeaderRenderer (unless you turn mouse back on)
DataGridHeaderItemRenderer.SortDescIconStyleDefault.setStyle("MouseEnabled", 			false);

//Wipe out the skin styles provided by button (we're currently just using the base state for all skins).
DataGridHeaderItemRenderer.SortDescIconStyleDefault.setStyle("UpSkinStyle", 			null);
DataGridHeaderItemRenderer.SortDescIconStyleDefault.setStyle("OverSkinStyle", 			null);
DataGridHeaderItemRenderer.SortDescIconStyleDefault.setStyle("DownSkinStyle", 			null);
DataGridHeaderItemRenderer.SortDescIconStyleDefault.setStyle("DisabledSkinStyle", 		null);
///////////////////////////////////

DataGridHeaderItemRenderer.StyleDefault.setStyle("SortAscIconClass",					ButtonElement);											// CanvasElement constructor
DataGridHeaderItemRenderer.StyleDefault.setStyle("SortAscIconStyle",					DataGridHeaderItemRenderer.SortAscIconStyleDefault);	// StyleDefinition
DataGridHeaderItemRenderer.StyleDefault.setStyle("SortDescIconClass",					ButtonElement);											// CanvasElement constructor
DataGridHeaderItemRenderer.StyleDefault.setStyle("SortDescIconStyle",					DataGridHeaderItemRenderer.SortDescIconStyleDefault);	// StyleDefinition

DataGridHeaderItemRenderer.StyleDefault.setStyle("IconGap",								3);			// number
DataGridHeaderItemRenderer.StyleDefault.setStyle("IconPlacement",						"right");	// "left" || "right"



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
		var iconDefaultStyle = null;
		var iconStyle = null;
		
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
		
		this.setStyle("Text", listData._parentGrid._gridColumns[listData._columnIndex].getStyle("HeaderLabel"));
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
		
		if ("IconGap" in stylesMap || "IconPlacement" in stylesMap)
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
					var gap = this.getStyle("IconGap");
					var iconPlacement = this.getStyle("IconPlacement");
					
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