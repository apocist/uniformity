requirejs.config({
	//baseUrl: 'site/js',
	paths: {
		// the left side is the module ID,
		// the right side is the path to
		// the jQuery file, relative to baseUrl.
		// Also, the path should NOT include
		// the '.js' file extension. This example
		// is using jQuery 1.9.0 located at
		// js/lib/jquery-1.9.0.js, relative to
		// the HTML page.
		underscore: 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min',
		jquery: 'http://code.jquery.com/jquery-2.2.1.min',
		backbone: 'https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.1/backbone-min',
		async: 'https://cdnjs.cloudflare.com/ajax/libs/async/1.5.2/async.min',
		bootstrap: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/js/bootstrap.min',//v4 alpha
		tether: 'https://cdnjs.cloudflare.com/ajax/libs/tether/1.3.2/js/tether.min',
		
		common: '/site/js/common',

		uniformityController: '/site/js/uniformityController',
		flashController: '/site/js/flashController',
		authController: '/auth/js/authController',

		contentEditor: '/admin/js/contentEditor'
	},
	shim: {
		bootstrap : {"deps" :['jquery','tether']}
	}
});
require(['tether'], function (tether) {
	window.Tether = tether;//Tether HAS to be in window before bootstrap loads. might want a prettier method
	require(['uniformityController'], function (uniformityController) {
		//Start the main controller
		window.uniformityController = new uniformityController();
		console.log('all done loading');

	});

});