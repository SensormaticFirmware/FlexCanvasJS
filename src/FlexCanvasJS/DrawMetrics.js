
/////////////////////////////////////////////////////////////////////
/////////////////////DrawMetrics/////////////////////////////////////	

/**
 * @class DrawMetrics
 * 
 * Simple data structure to represent bounds. (X, Y, Width, Height). 
 * 
 * 
 * @constructor DrawMetrics 
 * Creates new DrawMetrics instance.
 */

//Supporting class used to indicate element bounds.
function DrawMetrics()
{
	this._x = 0;
	this._y = 0;
	this._width = 0;
	this._height = 0;
}	

//DrawMetrics is base object, no inheritance.
DrawMetrics.prototype.constructor = DrawMetrics;

/**
 * @function equals
 * 
 * Checks if two instances of DrawMetrics contain the same values.
 * 
 * @param drawMetrics DrawMetrics
 * DrawMetrics instance to compare.
 * 
 * @returns bool
 * True when both instances contain the same values.
 */
DrawMetrics.prototype.equals = 
	function(drawMetrics)
	{
		if (this._x == drawMetrics._x && 
			this._y == drawMetrics._y &&
			this._width == drawMetrics._width && 
			this._height == drawMetrics._height)
		{
			return true;
		}
		
		return false;
	};

/**
 * @function clone
 * Duplicates an instance of DrawMetrics. 
 * 
 * @returns DrawMetrics
 * A new DrawMetrics instance identical to the cloned instance.
 */		
DrawMetrics.prototype.clone = 
	function ()
	{
		var clonedMetrics = new DrawMetrics();
		
		clonedMetrics._x = this._x;
		clonedMetrics._y = this._y;
		clonedMetrics._width = this._width;
		clonedMetrics._height = this._height;
		
		return clonedMetrics;
	};
	
//@private (for now)	
DrawMetrics.prototype.copyFrom = 
	function (copyFromMetrics)
	{
		this._x = copyFromMetrics._x;
		this._y = copyFromMetrics._y;
		this._width = copyFromMetrics._width;
		this._height = copyFromMetrics._height;
	};
	
//@private (for now)
DrawMetrics.prototype.mergeExpand = 
	function (mergeWithDrawMetrics)
	{
		if (mergeWithDrawMetrics._x < this._x)
		{
			this._width += (this._x - mergeWithDrawMetrics._x);
			this._x = mergeWithDrawMetrics._x;
		}
		if (mergeWithDrawMetrics._y < this._y)
		{
			this._height += (this._y - mergeWithDrawMetrics._y);
			this._y = mergeWithDrawMetrics._y;
		}
		if (mergeWithDrawMetrics._x + mergeWithDrawMetrics._width > this._x + this._width)
			this._width += ((mergeWithDrawMetrics._x + mergeWithDrawMetrics._width) - (this._x + this._width));
		if (mergeWithDrawMetrics._y + mergeWithDrawMetrics._height > this._y + this._height)
			this._height += ((mergeWithDrawMetrics._y + mergeWithDrawMetrics._height) - (this._y + this._height));
	};
	
//@private (for now)	
DrawMetrics.prototype.mergeReduce = 
	function (mergeWithDrawMetrics)
	{
		if (this._x < mergeWithDrawMetrics._x)
		{
			this._width -= (mergeWithDrawMetrics._x - this._x);
			this._x = mergeWithDrawMetrics._x;
		}
		if (this._y < mergeWithDrawMetrics._y)
		{
			this._height -= (mergeWithDrawMetrics._y - this._y);
			this._y = mergeWithDrawMetrics._y;
		}
		if (this._x + this._width > mergeWithDrawMetrics._x + mergeWithDrawMetrics._width)
			this._width -= ((this._x + this._width) - (mergeWithDrawMetrics._x + mergeWithDrawMetrics._width));
		if (this._y + this._height > mergeWithDrawMetrics._y + mergeWithDrawMetrics._height)
			this._height -= ((this._y + this._height) - (mergeWithDrawMetrics._y + mergeWithDrawMetrics._height));	
	};
	
DrawMetrics.prototype.roundToPrecision = 
	function (precision)
	{
		if (precision == 0)
		{
			this._x = Math.round(this._x);
			this._y = Math.round(this._y);
			
			this._width = Math.round(this._width);
			this._height = Math.round(this._height);
			
			return;
		}
		
		var multiplier = precision * 10;
		
		this._x = this._x * multiplier;
		this._x = Math.round(this._x);
		this._x = this._x / multiplier;
		
		this._y = this._y * multiplier;
		this._y = Math.round(this._y);
		this._y = this._y / multiplier;
		
		this._width = this._width * multiplier;
		this._width = Math.round(this._width);
		this._width = this._width / multiplier;
		
		this._height = this._height * multiplier;
		this._height = Math.round(this._height);
		this._height = this._height / multiplier;
	};
	
//@private (for now)	
DrawMetrics.prototype.roundUp = 
	function ()
	{
		var x1 = this._x;
		var x2 = this._x + this._width;
		var y1 = this._y;
		var y2 = this._y + this._height;
		
		x1 = Math.floor(x1);
		x2 = Math.ceil(x2);
		y1 = Math.floor(y1);
		y2 = Math.ceil(y2);
		
		this._x = x1;
		this._y = y1;
		this._width = x2 - x1;
		this._height = y2 - y1;
	};
	
/**
 * @function getX
 * 
 * Gets the X value in pixels, this may be fractional. 
 * 
 * @returns Number
 * The X value.
 */
DrawMetrics.prototype.getX = 
	function()
	{
		return this._x;
	};
	
/**
 * @function getY
 * 
 * Gets the Y value in pixels, this may be fractional. 
 * 
 * @returns Number
 * The Y value.
 */	
DrawMetrics.prototype.getY = 
	function()
	{
		return this._y;
	};
	
/**
 * @function getWidth
 * 
 * Gets the Width value in pixels, this may be fractional. 
 * 
 * @returns Number
 * The Width value.
 */		
DrawMetrics.prototype.getWidth = 
	function()
	{
		return this._width;
	};
	
/**
 * @function getHeight
 * 
 * Gets the Height value in pixels, this may be fractional. 
 * 
 * @returns Number
 * The Height value.
 */		
DrawMetrics.prototype.getHeight = 
	function()
	{
		return this._height;
	};
	
	