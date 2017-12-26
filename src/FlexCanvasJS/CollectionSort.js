
///////////////////////////////////////////////////////////////////
///////////////////////CollectionSort//////////////////////////////	

/**
 * @class CollectionSort
 * 
 * CollectionSort is a helper class that stores a comparatorFunction
 * and a isDecending flag used to invert the sort.
 * 
 * 
 * @constructor CollectionSort 
 * Creates new CollectionSort instance.
 * 
 * @param comparatorFunction Function
 * The sort comparator function to use when sorting an array.
 * 
 * @param isDecending boolean
 * When true invert the sort.
 */
function CollectionSort(comparatorFunction, isDecending)
{
	this._comparatorFunction = comparatorFunction;
	this._isDecending = isDecending;
	
	var _self = this;
	
	//Private function to invert the comparator (decending sort). 
	//This gets passed to Array as function pointer so there's no point in using prototype.
	this._collectionSortDecendingComparator = 
		function (objA, objB)
		{
			return _self._comparatorFunction(objB, objA);
		};
}

//No inheritance (base object)
CollectionSort.prototype.constructor = CollectionSort;

/**
 * @function setComparatorFunction
 * Sets the comparator function to be used when sorting. Comparators accept 2 parameters and return -1, 0, or +1 
 * depending on the sort relation between the 2 parameters.
 * 
 * function (objA, objB) { return objA - objB; };
 * 
 *  @param comparatorFunction Function
 *  The function to be used as the comparator.
 */
CollectionSort.prototype.setComparatorFunction = 
	function (comparatorFunction)
	{
		this._comparatorFunction = comparatorFunction;
	};
	
/**
 * @function getComparatorFunction
 * Gets the comparator function used when sorting.
 * 
 * @returns Function
 * The comparator function used when sorting.
 */	
CollectionSort.prototype.getComparatorFunction = 
	function ()
	{
		return this._comparatorFunction;
	};

/**
 * @function sort
 * Sorts an array using the comparator function and isDecending flag.
 * 
 * @param array Array
 * Array to be sorted.
 */	
CollectionSort.prototype.sort = 
	function (array)
	{
		if (this._isDecending == true)
			array.sort(this._collectionSortDecendingComparator);
		else
			array.sort(this._comparatorFunction);
	};
	
/**
 * @function setIsDecending
 * Sets the isDecending flag. True to invert the sort.
 * 
 * @param isDecending bool
 * When true, invert the sort comparator function.
 */	
CollectionSort.prototype.setIsDecending = 
	function (isDecending)
	{
		this._isDecending = isDecending;
	};
	
/**
 * @function getIsDecending
 * Gets the state of the isDecending flag.
 * 
 * @returns boolean
 * The state of the isDecending flag.
 */	
CollectionSort.prototype.getIsDecending = 
	function ()
	{
		return this._isDecending;
	};
	
	