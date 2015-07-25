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
