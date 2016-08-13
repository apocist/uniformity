define(['angular'], function(angular) {
	return angular.module('routeController', ['navigationController'])./* Route Controller */
	controller('routeController', function ($rootScope, $scope, $routeParams, apiService, TemplateModel, controllerService) {
		controllerService.routeController = $scope;
		console.log('$routeParams', $routeParams);
		apiService.getRoutableByUrl($routeParams.url).success(function (response) {
			//console.log('response', response);
			if (response.data != null && Object.keys(response.data).length) {
				$scope.model = new TemplateModel(response.data);
				$rootScope.title = $scope.model.name;
				$scope.templateUrl = '/routable/' + $scope.model.__t + '.html';
			} else if ($routeParams.url == '/' || $routeParams.url == '' || $routeParams.url == null) {
				$rootScope.title = "Uniformity";
				$scope.templateUrl = '/site/partials/index_default.html';
			} else {
				$rootScope.title = "40 to the 4";
				$scope.url = $routeParams.url;
				$scope.templateUrl = '/site/partials/404.html';
			}

			if(controllerService.navigationController){
				//Update the active menu item
				controllerService.navigationController.updateCurrentMenuItem();
			}

		});

	}).run(['$route', function($route)  {
		$route.reload();
	}]);
});