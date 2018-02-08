
/**
 * @depends ContainerBaseElement.js
 */

///////////////////////////////////////////////////////////////////////////	
///////////////////////ListContainerElement////////////////////////////////

/**
 * @class ListContainerElement
 * @inherits ContainerBaseElement
 * 
 * The ListContainer can be used to lay out children in a vertical or horizontal fashion.
 * This container uses children's styles Width, Height, PercentWidth, and PercentHeight.
 * Nesting containers is the best way to quickly and simply build complex layouts.
 * 
 * Width, and Height are treated as highest priority and will override PercentWidth and PercentHeight styles.
 * Exact behavior of conflicting styles is not defined and subject to change. 
 * 
 * See the associated style documentation for additional details.
 * 
 * @constructor ListContainerElement 
 * Creates new ListContainerElement instance.
 */
function ListContainerElement()
{
	ListContainerElement.base.prototype.constructor.call(this);
}

//Inherit from ContainerBaseElement
ListContainerElement.prototype = Object.create(ContainerBaseElement.prototype);
ListContainerElement.prototype.constructor = ListContainerElement;
ListContainerElement.base = ContainerBaseElement;	
	
/////////////Style Types///////////////////////////////

ListContainerElement._StyleTypes = Object.create(null);

/**
 * @style LayoutDirection String
 * 
 * Determines the layout direction of this ListContainer. Allowable values are "horizontal" or "vertical".
 */
ListContainerElement._StyleTypes.LayoutDirection = 			StyleableBase.EStyleType.NORMAL;		// "horizontal" || "vertical"

/**
 * @style LayoutGap Number
 * 
 * Space in pixels to leave between child elements.
 */
ListContainerElement._StyleTypes.LayoutGap = 				StyleableBase.EStyleType.NORMAL;		// number

/**
 * @style LayoutVerticalAlign String
 * 
 * Child vertical alignment to be used when children do not fill all available space. Allowable values are "top", "bottom", or "middle". 
 */
ListContainerElement._StyleTypes.LayoutVerticalAlign = 		StyleableBase.EStyleType.NORMAL;		// "top" || "bottom" || "middle" 

/**
 * @style LayoutHorizontalAlign String
 * 
 * Child horizontal alignment to be used when children do not fill all available space. Allowable values are "left", "right", or "center". 
 */
ListContainerElement._StyleTypes.LayoutHorizontalAlign = 	StyleableBase.EStyleType.NORMAL;		//"left" || "right" || "center"


////////////Default Styles////////////////////////////

ListContainerElement.StyleDefault = new StyleDefinition();

//ListContainerElement specific styles
ListContainerElement.StyleDefault.setStyle("LayoutDirection", 			"vertical");
ListContainerElement.StyleDefault.setStyle("LayoutGap", 				0);
ListContainerElement.StyleDefault.setStyle("LayoutVerticalAlign", 		"top");
ListContainerElement.StyleDefault.setStyle("LayoutHorizontalAlign", 	"left");


//////////////ListContainerElement Protected Functions//////////////

//@Override
ListContainerElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		ListContainerElement.base.prototype._doStylesUpdated.call(this, stylesMap);
		
		if ("LayoutDirection" in stylesMap ||
			"LayoutGap" in stylesMap)
		{
			this._invalidateMeasure();
			this._invalidateLayout();
		}
		else if ("LayoutVerticalAlign" in stylesMap || "LayoutHorizontalAlign" in stylesMap)
			this._invalidateLayout();
	};

//@Override
ListContainerElement.prototype._doMeasure = 
	function (padWidth, padHeight)
	{
		var contentSize = {width:0, height:0};
		
		var layoutGap = this.getStyle("LayoutGap");
		var layoutDirection = this.getStyle("LayoutDirection");
		
		var child = null;
		
		var width = null;
		var height = null;
		var rotateDegrees = null;
		
		var tempWidth;
		var tempHeight;
		var tempRotateDegrees;		
		
		var insertGap = false;
		
		for (var i = 0; i < this._elements.length; i++)
		{
			child = this._elements[i];
			if (child.getStyle("IncludeInLayout") == false)
				continue;
			
			rotateDegrees = child.getStyle("RotateDegrees");
			
			width = child._getStyledOrMeasuredWidth();
			height = child._getStyledOrMeasuredHeight();
			
			if (rotateDegrees != 0)
			{
				//Record child's current w/h & rotation
				tempWidth = child._width;
				tempHeight = child._height;
				tempRotateDegrees = child._rotateDegrees;
				
				//TODO: Update getMetrics() so we can pass child values.
				//Spoof the rotation position/size so we can get parent metrics.
				child._width = width;
				child._height = height;
				child._rotateDegrees = rotateDegrees;
				
				//Get parent metrics for spoof position
				rotatedMetrics = child.getMetrics(this);
				
				//Put back current values
				child._width = tempWidth;
				child._height = tempHeight;
				child._rotateDegrees = tempRotateDegrees;
				
				width = Math.ceil(rotatedMetrics.getWidth());
				height = Math.ceil(rotatedMetrics.getHeight());
			}
		
			if (layoutDirection == "horizontal")
			{
				//Increment width
				contentSize.width += width;
				
				//Use maximum child height
				if (height > contentSize.height)
					contentSize.height = height;
			}
			else //if (layoutDirection == "vertical")
			{
				//Increment height
				contentSize.height += height;
				
				//Use maximum child height
				if (width > contentSize.width)
					contentSize.width = width;
			}
			
			if (insertGap == true)
			{
				if (layoutDirection == "horizontal")
					contentSize.width += layoutGap;
				else //if (layoutDirection == "vertical")
					contentSize.height += layoutGap;
			}
			else
				insertGap = true;
		}
		
		contentSize.width += padWidth;
		contentSize.height += padHeight;
		
		return contentSize;		
	};

//@Override
ListContainerElement.prototype._doLayout =
	function(paddingMetrics)
	{
		ListContainerElement.base.prototype._doLayout.call(this, paddingMetrics);
	
		var layoutGap = this.getStyle("LayoutGap");
		var layoutDirection = this.getStyle("LayoutDirection");
		var layoutVerticalAlign = this.getStyle("LayoutVerticalAlign");
		var layoutHorizontalAlign = this.getStyle("LayoutHorizontalAlign");
	
		var x = paddingMetrics.getX();
		var y = paddingMetrics.getY();
		var w = paddingMetrics.getWidth();
		var h = paddingMetrics.getHeight();
		
		var i;
		
		var child = null;
		var childSizeData = [];
		
		var totalPercentUsed = 0;
		var numRenderables = 0;
		
		//Record element sizing data.
		for (i = 0; i < this._elements.length; i++)
		{
			child = this._elements[i];
			if (child.getStyle("IncludeInLayout") == false)
				continue;
			
			numRenderables++;
			
			var sizeData = {
				element:child,
				width:null, 
				height:null, 
				pWidth:null, 
				pHeight:null, 
				maxWidth:null, 
				maxHeight:null, 
				minWidth:null, 
				minHeight:null,
				rotateDegrees:null};
			
			sizeData.rotateDegrees = child.getStyle("RotateDegrees");
			
			sizeData.width = child.getStyle("Width");
			if (sizeData.width == null)
			{
				//Percent sizing not supported on transformed elements.
				if (sizeData.rotateDegrees == 0)
					sizeData.pWidth = child.getStyle("PercentWidth");
				
				sizeData.minWidth = child.getStyle("MinWidth");
				sizeData.maxWidth = child.getStyle("MaxWidth");
				
				if (sizeData.pWidth != null && layoutDirection == "horizontal")
					totalPercentUsed += sizeData.pWidth;
			}
			
			sizeData.height = child.getStyle("Height");
			if (sizeData.height == null)
			{
				//Percent sizing not supported on transformed elements.
				if (sizeData.rotateDegrees == 0)
					sizeData.pHeight = child.getStyle("PercentHeight");
				
				sizeData.minHeight = child.getStyle("MinHeight");
				sizeData.maxHeight = child.getStyle("MaxHeight");
				
				if (sizeData.pHeight != null && layoutDirection == "vertical")
					totalPercentUsed += sizeData.pHeight;
			}
			
			if (sizeData.minWidth == null)
				sizeData.minWidth = 0;
			if (sizeData.minHeight == null)
				sizeData.minHeight = 0;
			if (sizeData.maxWidth == null)
				sizeData.maxWidth = Number.MAX_VALUE;
			if (sizeData.maxHeight == null)
				sizeData.maxHeight = Number.MAX_VALUE;
			
			childSizeData.push(sizeData);
		}
		
		var totalGap = 0;
		if (numRenderables > 1)
			totalGap = (numRenderables - 1) * layoutGap;
		
		//Available space for children in layout axis.
		var availableSize = 0;
		if (layoutDirection == "horizontal")
			availableSize = w - totalGap;
		else
			availableSize = h - totalGap;
		
		////////////Calculate element sizes//////////////////
		
		var rotatedMetrics = null;
		var percentSizedElements = [];
		
		//Size all explicitly sized elements, record percent sized, and adjust available size for percent elements.
		for (i = 0; i < childSizeData.length; i++)
		{
			child = childSizeData[i];
			
			//Percent sized elements cannot be rotated
			child.element._setActualRotation(child.rotateDegrees, 0, 0);
			
			if (layoutDirection == "horizontal" && childSizeData[i].width == null && childSizeData[i].pWidth != null)
			{
				child.percentSize = child.pWidth;
				child.minSize = child.minWidth;
				child.maxSize = child.maxWidth;
				percentSizedElements.push(child);
				
				if (child.height == null)
				{
					if (child.pHeight != null)
						child.height = Math.round(h * (child.pHeight / 100));
					else
						child.height = child.element._measuredHeight;
					
					child.height = Math.min(child.maxHeight, child.height);
					child.height = Math.max(child.minHeight, child.height);
				}
			}
			else if (layoutDirection == "vertical" && childSizeData[i].height == null && childSizeData[i].pHeight != null)
			{
				child.percentSize = child.pHeight;
				child.minSize = child.minHeight;
				child.maxSize = child.maxHeight;
				percentSizedElements.push(child);
				
				if (child.width == null)
				{
					if (child.pWidth != null)
						child.width = Math.round(w * (child.pWidth / 100));
					else
						child.width = child.element._measuredWidth;
					
					child.width = Math.min(child.maxWidth, child.width);
					child.width = Math.max(child.minWidth, child.width);
				}
			}
			else
			{
				if (child.width == null)
				{
					if (child.pWidth != null)
						child.width = Math.round(w * (child.pWidth / 100));
					else
						child.width = child.element._measuredWidth;
					
					child.width = Math.min(child.maxWidth, child.width);
					child.width = Math.max(child.minWidth, child.width);
				}
				
				if (child.height == null)
				{
					if (child.pHeight != null)
						child.height = Math.round(h * (child.pHeight / 100));
					else
						child.height = child.element._measuredHeight;
					
					child.height = Math.min(child.maxHeight, child.height);
					child.height = Math.max(child.minHeight, child.height);
				}
				
				child.element._setActualSize(child.width, child.height);
				
				//Update the sizing to reflect size after rotation transform (for layout).
				if (child.rotateDegrees != 0)
				{
					rotatedMetrics = child.element.getMetrics(this);
					
					child.width = Math.ceil(rotatedMetrics.getWidth());
					child.height = Math.ceil(rotatedMetrics.getHeight());
				}
				
				if (layoutDirection == "horizontal")
					availableSize -= child.width;
				else // "vertical"
					availableSize -= child.height;
			}
		}
		
		//We're not using all the space, shrink us.
		if (totalPercentUsed < 100)
			availableSize = Math.round(availableSize * (totalPercentUsed / 100));
		
		//Calculate percent sized elements actual size.
		CanvasElement._calculateMinMaxPercentSizes(percentSizedElements, availableSize);
			
		//Size the percent sized elements.
		for (i = 0; i < percentSizedElements.length; i++)
		{
			child = percentSizedElements[i];
			
			if (layoutDirection == "horizontal")
				child.width = child.actualSize;
			else // "vertical"
				child.height = child.actualSize;
			
			child.element._setActualSize(child.width, child.height);
		}
			
		//Get total content size (gap + elements).
		var totalContentSize = totalGap;
		for (i = 0; i < childSizeData.length; i++)
		{
			if (layoutDirection == "horizontal")
				totalContentSize += childSizeData[i].width;
			else // "vertical"
				totalContentSize += childSizeData[i].height;
		}
		
		var actualX = x;
		var actualY = y;
		
		//Adjust starting position.
		if (layoutDirection == "horizontal" && totalContentSize != w)
		{
			if (layoutHorizontalAlign == "center")
				actualX += Math.round((w / 2) - (totalContentSize / 2));
			else if (layoutHorizontalAlign == "right")
				actualX += (w - totalContentSize);
		}
		else if (layoutDirection == "vertical" && totalContentSize != h)
		{
			if (layoutVerticalAlign == "middle")
				actualY += Math.round((h / 2) - (totalContentSize / 2));
			else if (layoutVerticalAlign == "bottom")
				actualY += (h - totalContentSize);
		}

		//Place elements.
		var insertGap = false;
		for (i = 0; i < childSizeData.length; i++)
		{
			child = childSizeData[i];
			
			if (layoutDirection == "horizontal")
			{
				if (insertGap == true)
					actualX += layoutGap;
				else
					insertGap = true;
				
				if (layoutVerticalAlign == "top")
					actualY = y;
				else if (layoutVerticalAlign == "bottom")
					actualY = y + h - child.height;
				else //middle
					actualY = Math.round(y + (h / 2) - (child.height / 2));
				
				if (child.rotateDegees == 0)
					child.element._setActualPosition(actualX, actualY);
				else
					child.element._setRelativePosition(actualX, actualY, this);
				
				actualX += child.width;
			}
			else // "vertical"
			{
				if (insertGap == true)
					actualY += layoutGap;
				else
					insertGap = true;
				
				if (layoutHorizontalAlign == "left")
					actualX = x;
				else if (layoutHorizontalAlign == "right")
					actualX = x + w - child.width;
				else //center
					actualX = Math.round(x + (w / 2) - (child.width / 2));
				
				if (child.rotateDegrees == 0)
					child.element._setActualPosition(actualX, actualY);
				else
					child.element._setRelativePosition(actualX, actualY, this);				
				
				actualY += child.height;
			}
		}
	};
	
	