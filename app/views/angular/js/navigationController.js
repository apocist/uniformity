define(['angular', 'underscore'], function(angular) {
	return angular.module('Element.navigationController', ['ngMaterial', 'ngMessages']).
	controller('navigationController', function ($scope, $routeParams, APIService, controllerService) {
		if(!controllerService.navigationController){
			console.log('Loading Navigation Controller');
			controllerService.navigationController = {
				init:true,
				APIService: APIService,
				scopes: [$scope],
				SiteMap: [],
				currentMenuItem: {
					parent: null,
					children: [],
					url: null
				},
				updateCurrentMenuItem: function () {
					this.currentMenuItem = this.SiteMap.find(function (menuItem) {
						return menuItem.url === $routeParams.url;
					});
					this.updateScopes();
				},
				updateScopes: function() {
					var that = this;
					_.each(that.scopes, function(scope){
						scope.SiteMap = that.SiteMap;
						scope.currentMenuItem = that.currentMenuItem;
					});
				},
				fetchSiteMap: function () {
					var that = this;
					this.APIService.getModel('MenuItem').success(function (response) {
						if (response.success == true && Object.keys(response.data).length) {
							that.SiteMap = response.data;
							that.updateCurrentMenuItem();
						} else {
							console.error('Cannot retrieve menu!');
						}

					});
				}
			};
			controllerService.navigationController.fetchSiteMap();
		} else {
			console.log('Navigation already loaded');
			controllerService.navigationController.scopes.push($scope);
		}

		$scope.isActiveLink = function (url) {
			return url === $routeParams.url ? 'active' : '';
		};

		$scope.isSubMenu = function () {
			//console.log('sidebar item', $scope.currentMenuItem);
			//console.log('sidebar', ($scope.currentMenuItem && ($scope.currentMenuItem.parent || $scope.currentMenuItem.children.length > 0)) || 'nothing');
			return (controllerService.navigationController.currentMenuItem && (controllerService.navigationController.currentMenuItem.parent || controllerService.navigationController.currentMenuItem.children.length > 0));
		};
		$scope.getCurrentNavLink = $routeParams.url;//static  upon load

	});
});