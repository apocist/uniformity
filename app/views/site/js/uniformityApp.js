
define(['angular','angular_material','angular_route','controllerService','apiService','modelService','routeController', 'navigationController'], function(angular) {
	return angular.module('uniformityApp', [
		'controllerService',
		'apiService',
		'modelService',
		'routeController',
		'navigationController',
		'ngRoute'//angular_route
	]);
});