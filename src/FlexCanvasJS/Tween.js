
///////////////////////////////////////////////////////
//////////////////Tween////////////////////////////////
	
/**
 * @class Tween
 * 
 * Tween is a helper class that is used to interpolate values
 * across a given time span and is essentially just a calculator. 
 * It can be used for nearly any type of animation and supports
 * easing for acceleration and deceleration. 
 * 
 * If you're unsure about easing, a hint is that SineInOut is a kind of magic salt 
 * you can sprinkle on just about any linear animation that usually makes everything 
 * look smoother and less jarring without being obvious.
 * 
 * @constructor Tween 
 * Creates new Tween instance.
 */
function Tween()
{
	/**
	 * @member startVal Number
	 * Beginning value at the start time of the tween.
	 */
	this.startVal = 0;
	
	/**
	 * @member endVal Number
	 * Ending value at the end time of the tween duration.
	 */
	this.endVal = 0;
	
	/**
	 * @member duration Number
	 * Duration in milliseconds the tween will run.
	 */
	this.duration = 0;
	
	/**
	 * @member startTime Number
	 * Time in milliseconds that the tween should start as returned by Date.now().
	 */
	this.startTime = null;
	
	/**
	 * @member easingFunction Function
	 * Easing function to use when calculating the tween value. This is used
	 * to create acceleration/deceleration. Setting this to null will result
	 * in a linear tween. This is a function that accepts a fraction
	 * between 0 and 1 and returns a fraction between 0 and 1. The result is used
	 * to calculate the value based on progress and start/end values. There are several
	 * standard easing functions built in as static functions of Tween that you can set to this.
	 */
	this.easingFunction = null;
}
	
//Tween is base object, no inheritance.
Tween.prototype.constructor = Tween;


/**
 * @function getProgress
 * Gets the current progress of the tween based on the start time and the current time.
 * 
 * @param time Number
 * The current time as returned by Date.now().
 * 
 * @returns Number
 * Fraction between 0 and 1.
 */
Tween.prototype.getProgress = 
	function (time)
	{
		if (time >= this.startTime + this.duration)
			return 1;
		else if (time <= this.startTime)
			return 0;
		
		return (time - this.startTime) / this.duration;
	};
	
/**
 * @function getValue
 * Gets the current value based on the supplied time.
 * 
 * @param time Number
 * The current time as returned by Date.now().
 * 
 * @returns Number
 * A number between the start and end values (inclusive).
 */	
Tween.prototype.getValue = 
	function (time)
	{
		var progress = this.getProgress(time);
		
		if (progress == 1)
			return this.endVal;
		else if (progress == 0)
			return this.startVal;
	
		if (this.easingFunction != null)
			progress = this.easingFunction(progress);
		
		var range = Math.abs(this.endVal - this.startVal);
		
		if (this.startVal < this.endVal)
			return this.startVal + (range * progress);
		
		return this.startVal - (range * progress);
	};

//////Static//////////////////
	
/**
 * @function easeInQuad
 * @static
 * Use for quadratic easing.
 * 
 * @param fraction Number
 * A number between 0 and 1.
 * 
 * @returns Number
 * A number between 0 and 1.
 */	
Tween.easeInQuad = 
	function (fraction)
	{
		return fraction * fraction;
	};
	
/**
 * @function easeOutQuad
 * @static
 * Use for quadratic easing.
 * 
 * @param fraction Number
 * A number between 0 and 1.
 * 
 * @returns Number
 * A number between 0 and 1.
 */		
Tween.easeOutQuad = 
	function (fraction)
	{
		return 1 - Tween.easeInQuad(1 - fraction);
	};

/**
 * @function easeInOutQuad
 * @static
 * Use for quadratic easing.
 * 
 * @param fraction Number
 * A number between 0 and 1.
 * 
 * @returns Number
 * A number between 0 and 1.
 */		
Tween.easeInOutQuad = 
	function (fraction)
	{
		if (fraction < 0.5)
			return Tween.easeInQuad(fraction * 2.0) / 2.0;
		
		return 1 - (Tween.easeInQuad((1 - fraction) * 2.0) / 2.0);  
	};
	
/**
 * @function easeInCubic
 * @static
 * Use for cubic easing.
 * 
 * @param fraction Number
 * A number between 0 and 1.
 * 
 * @returns Number
 * A number between 0 and 1.
 */		
Tween.easeInCubic = 
	function (fraction)
	{
		return Math.pow(fraction, 3);
	};
	
/**
 * @function easeOutCubic
 * @static
 * Use for cubic easing.
 * 
 * @param fraction Number
 * A number between 0 and 1.
 * 
 * @returns Number
 * A number between 0 and 1.
 */		
Tween.easeOutCubic = 
	function (fraction)
	{
		return 1 - Tween.easeInCubic(1 - fraction);
	};

/**
 * @function easeInOutCubic
 * @static
 * Use for cubic easing.
 * 
 * @param fraction Number
 * A number between 0 and 1.
 * 
 * @returns Number
 * A number between 0 and 1.
 */		
Tween.easeInOutCubic = 
	function (fraction)
	{
		if (fraction < 0.5)
			return Tween.easeInCubic(fraction * 2.0) / 2.0;
		
		return 1 - (Tween.easeInCubic((1 - fraction) * 2.0) / 2.0);  
	};	
	
/**
 * @function easeOutSine
 * @static
 * Use for sine easing.
 * 
 * @param fraction Number
 * A number between 0 and 1.
 * 
 * @returns Number
 * A number between 0 and 1.
 */		
Tween.easeOutSine = 
	function (fraction)
	{
		return Math.sin(fraction * (Math.PI / 2.0));
	};

/**
 * @function easeInSine
 * @static
 * Use for sine easing.
 * 
 * @param fraction Number
 * A number between 0 and 1.
 * 
 * @returns Number
 * A number between 0 and 1.
 */		
Tween.easeInSine = 
	function (fraction)
	{
		return 1 - Tween.easeOutSine(1 - fraction);
	};	
	
/**
 * @function easeInOutSine
 * @static
 * Use for sine easing.
 * 
 * @param fraction Number
 * A number between 0 and 1.
 * 
 * @returns Number
 * A number between 0 and 1.
 */		
Tween.easeInOutSine = 
	function (fraction)
	{
		if (fraction < 0.5)
			return Tween.easeInSine(fraction * 2.0) / 2.0;
		
		return 1 - (Tween.easeInSine((1 - fraction) * 2.0) / 2.0);  
	};
	
	