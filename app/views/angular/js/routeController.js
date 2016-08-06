define(['angular'], function(angular) {
	return angular.module('API.routeController', ['Element.navigationController'])./* Route Controller */
	controller('routeController', function ($scope, $routeParams, APIService, Model, controllerService) {
		controllerService.routeController = $scope;
		console.log('$routeParams', $routeParams);
		APIService.getRoutableByUrl($routeParams.url).success(function (response) {
			//console.log('response', response);
			if (response.data != null && Object.keys(response.data).length) {
				$scope.model = new Model(response.data);
				//console.log('name', $scope.model.name);
				$scope.templateUrl = '/routable/' + $scope.model.__t + '.html';
			} else if ($routeParams.url == '/' || $routeParams.url == '' || $routeParams.url == null) {
				$scope.templateUrl = '/site/index.html';
			} else {
				$scope.url = $routeParams.url;
				$scope.templateUrl = '/site/404.html';
			}

			if(controllerService.navigationController){
				//Update the active menu item
				controllerService.navigationController.updateCurrentMenuItem();
			}

		});

	});
});