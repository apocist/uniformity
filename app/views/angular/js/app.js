
define(['angular','angular_material','angular_route','controllerService','apiService','modelService','routeController', 'navigationController'], function(angular) {
	return angular.module('app', [
		'controller.service',
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