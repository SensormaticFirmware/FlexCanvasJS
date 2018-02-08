
/**
 * @depends CanvasElement.js
 */

////////////////////////////////////////////////////
//////////////////ImageElement//////////////////////

/**
 * @class ImageElement
 * @inherits CanvasElement
 * 
 * ImageElement renders an image (imagine that). 
 * Images can be loaded via "url" or pre-loaded via DOM image reference and can be stretched, tiled, or aligned. 
 * 
 * @constructor ImageElement 
 * Creates new ImageElement instance.
 */
function ImageElement()
{
	ImageElement.base.prototype.constructor.call(this);
	
	this._imageLoader = null;
	
	this._imageSource = null;
	
	/**
	 * @member _imageLoadComplete boolean
	 * Read Only - True if the image has completed loading, otherwise false.
	 */
	this._imageLoadComplete = false;
	
	var _self = this;
	
	//Private event handler, need different instance for each element.
	this._onImageElementLoadCompleteInstance = 
		function (event)
		{
			_self._imageLoader.removeEventListener("load", _self._onImageElementLoadCompleteInstance);
			_self._imageLoadComplete = true;
			
			_self._invalidateMeasure();
			_self._invalidateLayout();
			_self._invalidateRender();
		};
}

//Inherit from CanvasElement
ImageElement.prototype = Object.create(CanvasElement.prototype);
ImageElement.prototype.constructor = ImageElement;
ImageElement.base = CanvasElement;


/////////////Style Types///////////////////////////////

ImageElement._StyleTypes = Object.create(null);

/**
 * @style ImageSource String
 * Image to render. This may be a String URL, or a reference to a DOM image or canvas.
 */
ImageElement._StyleTypes.ImageSource = 					StyleableBase.EStyleType.NORMAL;		// null || image || "url" 

/**
 * @style ImageSourceClipX Number
 * X position in pixels of the clip area for the source image.
 */
ImageElement._StyleTypes.ImageSourceClipX = 			StyleableBase.EStyleType.NORMAL;		// null || number

/**
 * @style ImageSourceClipY Number
 * Y position in pixels of the clip area for the source image.
 */
ImageElement._StyleTypes.ImageSourceClipY = 			StyleableBase.EStyleType.NORMAL;		// null || number

/**
 * @style ImageSourceClipWidth Number
 * Width in pixels of the clip area for the source image.
 */
ImageElement._StyleTypes.ImageSourceClipWidth = 		StyleableBase.EStyleType.NORMAL;		// null || number

/**
 * @style ImageSourceClipHeight Number
 * Height in pixels of the clip area for the source image.
 */
ImageElement._StyleTypes.ImageSourceClipHeight = 		StyleableBase.EStyleType.NORMAL;		// null || number

/**
 * @style ImageScaleType String
 * Determines how the image should be stretched or scaled. Allowable values are "none", "fit", "stretch", "tile", or "tilefit".
 * "none" will not modify the original image, 
 * "fit" stretches the image but maintains the aspect ratio to fit the available area's minimum width/height constraint,
 * "stretch" stretches the image to fit the entire available area disregarding aspect ratio,
 * "tile" will not modify the original image but repeat it in both directions to fill the available area.
 * "tilefit" stretches the image but maintains the aspect ratio, any remaining space in the areas maximum width/height constraint is tiled with the stretched image.
 */
ImageElement._StyleTypes.ImageScaleType = 				StyleableBase.EStyleType.NORMAL;		// "none" || "fit" || "stretch" || "tile" || "tilefit"

/**
 * @style ImageVerticalAlign String
 * Aligns the image vertically when using ImageScaleType "none" or "fit" and not all of the available space is consumed.
 * Allowable values are "top", "middle", "bottom".
 */
ImageElement._StyleTypes.ImageVerticalAlign = 			StyleableBase.EStyleType.NORMAL;		// "top" || "middle" || "bottom"

/**
 * @style ImageHorizontalAlign String
 * Aligns the image horizontally when using ImageScaleType "none" or "fit" and not all of the available space is consumed.
 * Allowable values are "left", "center", "right".
 */
ImageElement._StyleTypes.ImageHorizontalAlign = 		StyleableBase.EStyleType.NORMAL;		// "left" || "center" || "right"


////////////Default Styles////////////////////////////

ImageElement.StyleDefault = new StyleDefinition();

ImageElement.StyleDefault.setStyle("ImageSource", 						null);			// null || image || "url"
ImageElement.StyleDefault.setStyle("ImageSourceClipX", 					null);			// null || number
ImageElement.StyleDefault.setStyle("ImageSourceClipY", 					null);			// null || number
ImageElement.StyleDefault.setStyle("ImageSourceClipWidth", 				null);			// null || number
ImageElement.StyleDefault.setStyle("ImageSourceClipHeight", 			null);			// null || number

ImageElement.StyleDefault.setStyle("ImageScaleType", 					"stretch");		// "none" || "fit" || "stretch" || "tile" || "tilefit"
ImageElement.StyleDefault.setStyle("ImageHorizontalAlign", 				"left");		// "left" || "center" || "right"
ImageElement.StyleDefault.setStyle("ImageVerticalAlign", 				"top");			// "top" || "middle" || "bottom"


/////////////ImageElement Protected Functions///////////////////

//@Override
ImageElement.prototype._doStylesUpdated =
	function (stylesMap)
	{
		ImageElement.base.prototype._doStylesUpdated.call(this, stylesMap);
	
		if ("ImageSource" in stylesMap)
		{
			var newSource = this.getStyle("ImageSource");
			if (this._imageSource != newSource)
			{
				//Clean up old loader
				if (this._imageLoader != null && this._imageLoadComplete == false)
					this._imageLoader.removeEventListener("load", this._onImageElementLoadCompleteInstance);
				
				this._imageLoader = null;
				this._imageLoadComplete = false;
				
				//May be img, string, TODO: Canvas / Video
				this._imageSource = newSource;
				
				if (this._imageSource instanceof HTMLImageElement)
				{
					this._imageLoader = this._imageSource;
					this._imageLoadComplete = this._imageSource.complete;
					
					if (this._imageLoadComplete == false)
						this._imageLoader.addEventListener("load", this._onImageElementLoadCompleteInstance, false);
				}
				else
				{
					this._imageLoader = new Image();
					this._imageLoader.addEventListener("load", this._onImageElementLoadCompleteInstance, false);
					this._imageLoader.src = this._imageSource;
				}
				
				this._invalidateMeasure();
				this._invalidateRender();
			}
		}
		else
		{
			if ("ImageSourceClipX" in stylesMap ||
				"ImageSourceClipY" in stylesMap ||
				"ImageSourceClipWidth" in stylesMap ||
				"ImageSourceClipHeight" in stylesMap)
			{
				this._invalidateMeasure();
				this._invalidateRender();
			}
			else if ("ImageScaleType" in stylesMap ||
					"ImageVerticalAlign" in stylesMap ||
					"ImageHorizontalAlign" in stylesMap)
			{
				this._invalidateRender();
			}
		}
	};
	
//@Override
ImageElement.prototype._doMeasure = 
	function(padWidth, padHeight)
	{
		var measuredSize = {width: padWidth, height: padHeight};
		
		var clipX = this.getStyle("ImageSourceClipX");
		var clipY = this.getStyle("ImageSourceClipY");
		
		var clipWidth = this.getStyle("ImageSourceClipWidth");
		var clipHeight = this.getStyle("ImageSourceClipHeight");
		
		if (clipX == null)
			clipX = 0;
		
		if (clipY == null)
			clipY = 0;
		
		if (clipWidth != null)
			measuredSize.width += clipWidth;
		else if (this._imageLoadComplete == true)
			measuredSize.width += (this._imageLoader.naturalWidth - clipX);

		if (clipHeight != null)
			measuredSize.height += clipHeight;
		else if (this._imageLoadComplete == true)
			measuredSize.height += (this._imageLoader.naturalHeight - clipY);
		
		return measuredSize;
	};	
	
//@Override
ImageElement.prototype._doRender =
	function()
	{
		ImageElement.base.prototype._doRender.call(this);
		
		if (this._imageLoadComplete == false)
			return;
		
		var paddingMetrics = this._getPaddingMetrics();
		var ctx = this._getGraphicsCtx();
		
		var x = paddingMetrics.getX();
		var y = paddingMetrics.getY();
		var w = paddingMetrics.getWidth();
		var h = paddingMetrics.getHeight();
		
		if (w <= 0 || h <= 0)
			return;
		
		var clipX = this.getStyle("ImageSourceClipX");
		var clipY = this.getStyle("ImageSourceClipY");
		var clipW = this.getStyle("ImageSourceClipWidth");
		var clipH = this.getStyle("ImageSourceClipHeight");
		
		var scaleType = this.getStyle("ImageScaleType");
		
		if (clipX == null)
			clipX = 0;
		if (clipY == null)
			clipY = 0;
		
		if (clipW == null)
			clipW = this._imageLoader.naturalWidth - clipX;
		if (clipH == null)
			clipH = this._imageLoader.naturalHeight - clipY;
		
		if (clipW <= 0 || clipH <= 0)
			return;
		
		if (scaleType == "stretch")
		{
			ctx.drawImage(
				this._imageLoader, 
				clipX, clipY, clipW, clipH, 
				x, y, w, h);
		}
		else if (scaleType == "tile")
		{
			var currentX = x;
			var currentY = y;
			
			var drawWidth = clipW;
			var drawHeight = clipH;
			
			while (true)
			{
				drawWidth = Math.min(clipW, x + w - currentX);
				drawHeight = Math.min(clipH, y + h - currentY);
				
				ctx.drawImage(
					this._imageLoader, 
					clipX, clipY, drawWidth, drawHeight, 
					currentX, currentY, drawWidth, drawHeight);
				
				currentX += drawWidth;
				if (currentX >= x + w)
				{
					currentX = x;
					currentY += drawHeight;
					
					if (currentY >= y + h)
						break;
				}
			}
		}
		else if (scaleType == "tilefit")
		{
			var thisRatio = w / h;
			var imageRatio = clipW / clipH;
			
			var drawWidth = clipW;
			var drawHeight = clipH;
			
			//Size to our height
			if (thisRatio > imageRatio)
			{
				var currentX = x;
				
				drawHeight = h;
				drawWidth = h * imageRatio;
				
				while (true)
				{
					if (currentX + drawWidth > x + w)
					{
						var availableWidth = x + w - currentX;
						var widthRatio = availableWidth / drawWidth;
						
						ctx.drawImage(
							this._imageLoader, 
							clipX, clipY, clipW * widthRatio, clipH, 
							currentX, y, drawWidth * widthRatio, drawHeight);
						
						break;
					}
					else
					{
						ctx.drawImage(
							this._imageLoader, 
							clipX, clipY, clipW, clipH, 
							currentX, y, drawWidth, drawHeight);
						
						currentX += drawWidth;
						if (currentX == x + w)
								break;
					}
				}
			}
			else //Size to our width
			{
				var currentY = y;
				
				drawWidth = w;
				drawHeight = w / imageRatio;
				
				while (true)
				{
					if (currentY + drawHeight > y + h)
					{
						var availableHeight = y + h - currentY;
						var heightRatio = availableHeight / drawHeight;
						
						ctx.drawImage(
							this._imageLoader, 
							clipX, clipY, clipW, clipH * heightRatio, 
							x, currentY, drawWidth, drawHeight * heightRatio);
						
						break;
					}
					else
					{
						ctx.drawImage(
							this._imageLoader, 
							clipX, clipY, clipW, clipH, 
							x, currentY, drawWidth, drawHeight);
						
						currentY += drawHeight;
						if (currentY == y + h)
							break;
					}
				}
			}
		}
		else if (scaleType == "fit" || scaleType == "none" || scaleType == null)
		{
			var verticalAlign = this.getStyle("ImageVerticalAlign");
			var horizontalAlign = this.getStyle("ImageHorizontalAlign");
			
			var drawWidth = clipW;
			var drawHeight = clipH;
			
			if (scaleType == "fit")
			{
				var thisRatio = w / h;
				var imageRatio = clipW / clipH;
				
				//Size to our height
				if (thisRatio > imageRatio)
				{
					drawHeight = h;
					drawWidth = h * imageRatio;
				}
				else //Size to our width
				{
					drawWidth = w;
					drawHeight = w / imageRatio;
				}
			}
			else //scaleType == "none"
			{
				//Reduce image clipping area to render size.
				if (w < clipW)
				{
					if (horizontalAlign == "right")
						clipX += (clipW - w);
					else if (horizontalAlign == "center")
						clipX += ((clipW - w) / 2);
					
					clipW = w;
					drawWidth = w;
				}
				if (h < clipH)
				{
					if (verticalAlign == "bottom")
						clipY += (clipH - h);
					else if (verticalAlign == "middle")
						clipY += ((clipH - h) / 2);
					
					clipH = h;
					drawHeight = h;
				}
			}
			
			var drawX = x;
			var drawY = y;
			
			if (horizontalAlign == "right")
				drawX += w - drawWidth;
			else if (horizontalAlign == "center")
				drawX += ((w - drawWidth) / 2);
			
			if (verticalAlign == "bottom")
				drawY += h - drawHeight;
			else if (verticalAlign == "middle")
				drawY += ((h - drawHeight) / 2);
			
			ctx.drawImage(
				this._imageLoader, 
				clipX, clipY, clipW, clipH, 
				drawX, drawY, drawWidth, drawHeight);
		}
		
	};
	
	
	