
///////////////////////////////////////////////////////////////////////////	
///////////////////////StyleProxy////////////////////////////////////////		
	
/**
 * @class StyleProxy
 * 
 * Internal class used to wrap CanvasElements to proxy styles to other elements. 
 * This should only be used by component developers. When a proxy is assigned
 * to an element, the proxy is included in its style chain lookup after assigned
 * styles (instance, and styleDefinition) but before default styles.   
 * 
 * @constructor StyleProxy 
 * Creates new StyleProxy instance.
 * 
 * @param styleProxyElement CanvasElement
 * The element to proxy styles from.
 * 
 * @param styleProxyMap Object
 * A map of styleNames to proxy. This Object is walked for members so
 * should always be created using a null prototype: Object.create(null) and
 * members created for each styleName to proxy (set to true). 
 * 
 * MyProxyMap = Object.create(null);
 * MyProxyMap.StyleName1 = true;
 * MyProxyMap.StyleName2 = true;
 * 
 * MyProxyMap._Arbitrary = true; 
 * 
 * _Arbitrary is a special flag that indicates all styles that are not defined / unknown 
 * by the element will also be proxied.
 * 
 * For example, a Button will proxy several styles to its skins such as "BackgroundFill" by including
 * them in the proxy map it passes to its skins. Styles like "Visible" however, are omitted from the proxy
 * map. Also, the button sets the _Arbitrary flag so any styles the Button is not aware of and does not define itself, 
 * are automatically proxied to the skin, without having to be added to the proxy map. 
 * This is so that skins may have custom styles and still be blanket set by setting the Button style itself. 
 */
function StyleProxy(styleProxyElement, styleProxyMap)
{
	this._proxyElement = styleProxyElement;
	this._proxyMap = styleProxyMap;
}

//No Inheritance
StyleProxy.prototype.constructor = StyleProxy;

	