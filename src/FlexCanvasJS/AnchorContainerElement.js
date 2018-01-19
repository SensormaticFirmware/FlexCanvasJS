
/**
 * @depends ContainerBaseElement.js
 */

///////////////////////////////////////////////////////////////////////////	
///////////////////////AnchorContainerElement//////////////////////////////

/**
 * @class AnchorContainerElement
 * @inherits ContainerBaseElement
 * 
 * The AnchorContainer can be used to lay out children via absolute or constraint positioning.
 * This container uses children's styles X, Y, Width, Height, PercentWidth, PercentHeight,
 * Top, Bottom, Left, Right, Horizontal Center, and Vertical Center. Nesting containers
 * is the best way to quickly and simply build complex layouts.
 * 
 * X, Y, Width, and Height are treated as highest priority and will override other styles.
 * Elements Z index is determined by the order they are added (child index).
 * You may use styles such as Top and Bottom in conjunction to relatively size elements.
 * You may also combine styles such as Left or X and PercentWidth. Most styles are combine-able unless
 * they are in direct conflict with each other such as having a Left, Right, and Width which under
 * this scenario the Right style will be ignored. Exact behavior of conflicting styles is not defined 
 * and subject to change. 
 * 
 * See the associated style documentation for additional details.
 * 
 * @constructor AnchorContainerElement 
 * Creates new AnchorContainerElement instance.
 */
function AnchorContainerElement()
{
	AnchorContainerElement.base.prototype.constructor.call(this);
}

//Inherit from ContainerBaseElement
AnchorContainerElement.prototype = Object.create(ContainerBaseElement.prototype);
AnchorContainerElement.prototype.constructor = AnchorContainerElement;
AnchorContainerElement.base = ContainerBaseElement;	
	
//@Override
AnchorContainerElement.prototype._doMeasure = 
	function (padWidth, padHeight)
	{
		var contentSize = {width:0, height:0}; 
		
		var child = null; //for convienence
		
		var x;
		var y;
		var width;
		var height;

		var top;
		var left;
		var bottom;
		var right;
		var hCenter;
		var vCenter;
		var rotateDegrees;
		var rotateCenterX;
		var rotateCenterY;
		var rotatedMetrics;
		
		var tempX;
		var tempY;
		var tempWidth;
		var tempHeight;
		var tempRotateDegrees;
		var tempRotateCenterX;
		var tempRotateCenterY;
		
		for (var i = 0; i < this._elements.length; i++)
		{
			child = this._elements[i];
			if (child.getStyle("IncludeInLayout") == false)
				continue;
			
			var childSize = {width: 0, height:0};
			
			width = child._getStyledOrMeasuredWidth();
			height = child._getStyledOrMeasuredHeight();
			
			x = child.getStyle("X");
			y = child.getStyle("Y");
			top = child.getStyle("Top");
			left = child.getStyle("Left");
			bottom = child.getStyle("Bottom");
			right = child.getStyle("Right");
			
			//prioritize x/y over left/top (but they're the same)
			if (x == null)
				x = left;
			if (y == null)
				y = top;
			
			hCenter = child.getStyle("HorizontalCenter");
			vCenter = child.getStyle("VerticalCenter");
			
			rotateDegrees = child.getStyle("RotateDegrees");
			rotateCenterX = child.getStyle("RotateCenterX");
			rotateCenterY = child.getStyle("RotateCenterY");
			
			if (rotateDegrees != 0)
			{
				//Record child's current x/y & w/h & rotation
				tempX = child._x;
				tempY = child._y;
				tempWidth = child._width;
				tempHeight = child._height;
				tempRotateDegrees = child._rotateDegrees;
				tempRotateCenterX = child._rotateCenterX;
				tempRotateCenterY = child._rotateCenterY;
				
				//TODO: Update getMetrics() so we can pass child values.
				//Spoof the rotation position/size so we can get parent metrics.
				child._x = x == null ? 0 : x;
				child._y = y == null ? 0 : y;
				child._width = width;
				child._height = height;
				child._rotateDegrees = rotateDegrees;
				child._rotateCenterX = rotateCenterX == null ? 0 : rotateCenterX;
				child._rotateCenterY = rotateCenterY == null ? 0 : rotateCenterY;
				
				//Get parent metrics for spoof position
				rotatedMetrics = child.getMetrics(this);
				
				//Put back current values
				child._x = tempX;
				child._y = tempY;
				child._width = tempWidth;
				child._height = tempHeight;
				child._rotateDegrees = tempRotateDegrees;
				child._rotateCenterX = tempRotateCenterX;
				child._rotateCenterY = tempRotateCenterY;
				
				if (rotateCenterX != null && rotateCenterY != null)
				{
					x = Math.max(rotatedMetrics.getX(), 0);
					y = Math.max(rotatedMetrics.getY(), 0);
				}
				
				childSize.width += Math.ceil(rotatedMetrics.getWidth());
				childSize.height += Math.ceil(rotatedMetrics.getHeight());
			}
			else //Non-Rotated Element
			{
				childSize.width += width;
				childSize.height += height;
			}
			
			if (right != null)
				childSize.width += right;
			if (bottom != null)
				childSize.height += bottom;
			
			if (x == null && right == null && hCenter != null)
				childSize.width += Math.abs(hCenter * 2);
			if (y == null && bottom == null && vCenter != null)
				childSize.height += Math.abs(vCenter * 2);
			
			if (x == null || x < 0)
				x = 0;
			if (y == null || y < 0)
				y = 0;
			
			childSize.width += x;
			childSize.height += y;
			
			contentSize.width = Math.max(contentSize.width, Math.ceil(childSize.width));
			contentSize.height = Math.max(contentSize.height, Math.ceil(childSize.height));
		}
		
		return contentSize;
	};
	
//@Override
AnchorContainerElement.prototype._doLayout =
	function(paddingMetrics)
	{
		AnchorContainerElement.base.prototype._doLayout.call(this, paddingMetrics);
	
		var child = null;
		
		var x = null;
		var y = null;
		var width = null;
		var height = null;
		var pWidth = null;
		var pHeight = null;
		var minWidth = null;
		var maxWidth = null;
		var minHeight = null;
		var maxHeight = null;		
		var top = null;
		var left = null;
		var bottom = null;
		var right = null;
		var hCenter = null;
		var vCenter = null;
		var rotateDegrees = null;
		var rotateCenterX = null;
		var rotateCenterY = null;
		var rotatedMetrics = null;
		
		for (var i = 0; i < this._elements.length; i++)
		{
			child = this._elements[i];
			if (child.getStyle("IncludeInLayout") == false)
				continue;
			
			x = child.getStyle("X");
			y = child.getStyle("Y");
			top = child.getStyle("Top");
			left = child.getStyle("Left");
			bottom = child.getStyle("Bottom");
			right = child.getStyle("Right");
			width = child.getStyle("Width");
			height = child.getStyle("Height");
			minWidth = child.getStyle("MinWidth");
			minHeight = child.getStyle("MinHeight");
			maxWidth = child.getStyle("MaxWidth");
			maxHeight = child.getStyle("MaxHeight");
			hCenter = child.getStyle("HorizontalCenter");
			vCenter = child.getStyle("VerticalCenter");
			rotateDegrees = child.getStyle("RotateDegrees");
			rotateCenterX = child.getStyle("RotateCenterX");
			rotateCenterY = child.getStyle("RotateCenterY");
			
			if (minWidth == null)
				minWidth = 0;
			if (minHeight == null)
				minHeight = 0;
			if (maxWidth == null)
				maxWidth = Number.MAX_VALUE;
			if (maxHeight == null)
				maxHeight = Number.MAX_VALUE;
			
			child._setActualRotation(rotateDegrees, rotateCenterX, rotateCenterY);
			
			if (rotateDegrees != 0)
			{
				if (width == null)
				{
					width = child._measuredWidth;
					width = Math.min(width, maxWidth);
					width = Math.max(width, minWidth);
				}
				
				if (height == null)
				{
					height = child._measuredHeight;
					height = Math.min(height, maxHeight);
					height = Math.max(height, minHeight);
				}
				
				child._setActualSize(width, height);
				
				if (rotateCenterX == null || rotateCenterY == null)
				{
					//prioritize x/y over left/top (but they're the same)
					if (x == null)
						x = left;
					if (y == null)
						y = top;
					
					if (x == null || y == null)
					{
						rotatedMetrics = child.getMetrics(this);
						
						width = Math.ceil(rotatedMetrics.getWidth());
						height = Math.ceil(rotatedMetrics.getHeight());
						
						if (x == null && right != null)
							x = this._width - width - right;
						
						if (y == null && bottom != null)
							y = this._height - height - bottom;
						
						if (x == null && hCenter != null)
							x = Math.round((this._width / 2) - (width / 2) + hCenter);
						
						if (y == null && vCenter != null)
							y = Math.round((this._height / 2) - (height / 2) + vCenter);
					}
					
					if (x == null)
						x = 0;
					if (y == null)
						y = 0;
					
					child._setRelativePosition(x, y, this);
				}
				else
				{
					if (x == null)
						x = 0;
					if (y == null)
						y = 0;
					
					child._setActualPosition(x, y);
				}
			}
			else //Non-Rotated Element
			{
				pWidth = child.getStyle("PercentWidth");
				pHeight = child.getStyle("PercentHeight");
			
				//prioritize x/y over left/top (but they're the same)
				if (x == null)
					x = left;
				if (y == null)
					y = top;
				
				if (width == null)
				{
					if (x != null && right != null)
						width = this._width - x - right;
					else
					{
						if (pWidth != null)
							width = Math.round(this._width * (pWidth / 100));
						else
							width = child._measuredWidth;
					}
					
					width = Math.min(width, maxWidth);
					width = Math.max(width, minWidth);
				}
				
				if (height == null)
				{
					if (y != null && bottom != null)
						height = this._height - y - bottom;
					else
					{
						if (pHeight != null)
							height = Math.round(this._height * (pHeight / 100));
						else
							height = child._measuredHeight;
					}
					
					height = Math.min(height, maxHeight);
					height = Math.max(height, minHeight);
				}
				
				if (x == null && right != null)
					x = this._width - width - right;
				
				if (y == null && bottom != null)
					y = this._height - height - bottom;
				
				if (x == null && hCenter != null)
					x = Math.round((this._width / 2) - (width / 2) + hCenter);
				
				if (y == null && vCenter != null)
					y = Math.round((this._height / 2) - (height / 2) + vCenter);
				
				if (x == null)
					x = 0;
				if (y == null)
					y = 0;
				
				child._setActualPosition(x, y);
				child._setActualSize(width, height);
			}
		}
	};	
	
	