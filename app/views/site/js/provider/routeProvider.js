define(['uniformityApp'], function(app) {
	return app.config(function($routeProvider, $locationProvider) {
		$routeProvider.		when(":url*", {template: '<div ng-include="templateUrl">Loading...</div>', controller: "routeController"});
		//otherwise({redirectTo: '/'});
		$locationProvider.html5Mode(true);
	});
});