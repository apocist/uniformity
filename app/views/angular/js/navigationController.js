define(['angular'], function(angular) {
	return angular.module('Element.navigationController', [])./* Route Controller */
	controller('navigationController', function ($scope, APIService) {
		$scope.SiteMenu = [];

		APIService.getModel('MenuItem').success(function (response) {
			console.log('response', response);
			if (response.success == true && Object.keys(response.data).length) {
				$scope.SiteMenu = response.data;
			} else {
				console.error('Cannot retrieve menu!');
			}

		});
	});
});