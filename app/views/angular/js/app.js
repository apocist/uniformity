
define(['angular','angular_route','apiService','modelService','routeController', 'navigationController'], function(angular) {
	return angular.module('app', [
		'API.service',
		'API.templateModel',
		'API.routeController',
		'Element.navigationController',
		'ngRoute'
		//'API.routeConfig'
	]);
	/*config(function($routeProvider, $locationProvider) {
		$routeProvider.when(":url*", {template: '<div ng-include="templateUrl">Loading...</div>', controller: "DynamicRouteController"});
		//otherwise({redirectTo: '/'});
		$locationProvider.html5Mode(true);
	});*/
});