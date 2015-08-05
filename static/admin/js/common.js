/**
 * Will load a script then perform an action
 * @function
 * @param url script url to load
 * @param callback action to perform once loaded
 * @param callbackfail action to perform is script failed to load
 */
jQuery.loadScript = function (url, callback, callbackfail) {
	jQuery.ajax({
		url: url,
		cache: true,
		dataType: 'script',
		success: callback,
		error: callbackfail,
		timeout: 8000, //8 secs
		async: true
	});
}
/**
 * Will load multiple scripts then perform an action. If even one fails, the callbackfail function with be performed
 * @function
 * @param urls array of script urls to load
 * @param callback action to perform once loaded
 * @param callbackfail action to perform is script failed to load
 */
jQuery.loadScripts = function (urls, callback, callbackfail) {
	var url = urls.shift();
	if(urls.length > 0){
		$.loadScript(url, function () {
			$.loadScripts(urls, callback, callbackfail);
		}, callbackfail);
	} else {
		$.loadScript(url, callback, callbackfail);
	}
}
/**
 * Will only load script(s) if the needed function is not yet loaded
 * @function
 * @param boolean check if function is ready
 * @param url script url to load, may use Array of strings to load multiple scripts
 * @param callback action to perform once loaded or if already loaded
 * @param callbackfail action to perform is script failed to load
 Example:
	$.loadScriptIfNeeded($.fn.jsonForm !== "undefined", '/js/jsonform/jsonform.js', function () {
		doSomethingOnceReady();
	});
 */
jQuery.loadScriptsIfNeeded = function (boolean, url, callback, callbackfail) {
	if(boolean) {//already loaded
		callback();
	} else {//If function is not loaded yet, load it now
		if($.isArray(url)){//check if loading multiple scripts(array or string)
			$.loadScripts(url, callback, callbackfail);
		} else {
			$.loadScript(url, callback, callbackfail);
		}
	}
}

var Class = function(methods) {
	var klass = function() {
		this.initialize.apply(this, arguments);
	};
	for (var property in methods) {
		klass.prototype[property] = methods[property];
	}
	if (!klass.prototype.initialize) klass.prototype.initialize = function(){};
	return klass;
};