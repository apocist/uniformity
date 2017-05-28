define(['angular'], function(angular) {
	return angular.module('routeController', ['navigationController'])./* Route Controller */
	controller('routeController', function ($rootScope, $scope, $routeParams, apiService, TemplateModel, controllerService) {
		//this.$onInit = function() {
			controllerService.routeController = $scope;
			console.log('$routeParams', $routeParams);
			apiService.getRoutableByUrl($routeParams.url)
				.then(function (response) {
					var responseData = response.data;
					if (responseData.data !== null && Object.keys(responseData.data).length) {
						$scope.model = new TemplateModel(responseData.data);
						$rootScope.title = $scope.model.name;
						$scope.templateUrl = '/routable/' + $scope.model.__t + '.html';
					} else if ($routeParams.url === '/' || $routeParams.url === '' || $routeParams.url === null) {
						$rootScope.title = "Uniformity";
						$scope.templateUrl = '/site/partials/index_default.html';
					} else {
						$rootScope.title = "40 to the 4";
						$scope.url = $routeParams.url;
						$scope.templateUrl = '/site/partials/404.html';
					}

					if (controllerService.navigationController) {
						//Update the active menu item
						controllerService.navigationController.updateCurrentMenuItem();
					}
				})
				.catch(function (response) {
					console.error('route error', response);
				});
		//};

	}).run(['$route', function($route)  {
		$route.reload();
	}]);
});