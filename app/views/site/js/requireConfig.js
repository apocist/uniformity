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
		angular: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular.min',
		angular_animate: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular-animate.min',
		angular_aria: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular-aria.min',
		angular_messages: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular-messages.min',
		angular_route: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular-route.min',
		//angular_material: 'https://cdn.gitcdn.link/cdn/angular/bower-material/v1.1.0-rc.5-master-9082e4a/angular-material.min',
		angular_material: 'https://material.angularjs.org/latest/angular-material.min',//v1.1.0-rc.5 why is this file always different per CDN????
		//https://material.angularjs.org/latest/angular-material.min.js
		
		common: '/site/js/common',
		custombootsteap: '/site/js/customBootstrap',

		uniformityController: '/site/js/uniformityController',
		flashController: '/site/js/flashController',
		authController: '/auth/js/authController',

		angularApp: '/angular/js/app',
		angularRoutes: '/angular/js/routes',
		controllerService: '/angular/js/controllerService',
		apiService: '/angular/js/apiService',
		modelService: '/angular/js/templateModel',
		routeController: '/angular/js/routeController',
		navigationController: '/angular/js/navigationController',

		contentEditor: '/admin/js/contentEditor'
	},
	shim: {
		bootstrap: {"deps" :['jquery','tether']},
		angular: {exports: 'angular'},
		angular_route : {"deps" :['angular']},
		angular_animate : {"deps" :['angular']},
		angular_aria : {"deps" :['angular']},
		angular_messages : {"deps" :['angular']},
		angular_material : {"deps" :['angular', 'angular_animate', 'angular_aria', 'angular_messages']}
	}
});
require(['tether'], function (tether) {
	window.Tether = tether;//Tether HAS to be in window before bootstrap loads. might want a prettier method
	require(['angular', 'uniformityController', 'angularApp', 'angularRoutes'], function (angular, uniformityController) {
		//Start the main controller
		angular.bootstrap(document, ['app']);
		window.uniformityController = new uniformityController();
		console.log('all done loading');

	});

});
