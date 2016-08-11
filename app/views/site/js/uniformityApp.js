
define(['angular','angular_material','angular_route','angular_sanitize','controllerService','apiService','modelService','routeController', 'navigationController','userToolbarController'], function(angular) {
	return angular.module('uniformityApp', [
		'controllerService',
		'apiService',
		'modelService',
		'routeController',
		'navigationController',
		'userToolbarController',
		'ngRoute'//angular_route
	]);
});