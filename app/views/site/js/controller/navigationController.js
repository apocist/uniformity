define(['angular', 'underscore'], function(angular) {
	return angular.module('navigationController', ['ngMaterial', 'ngMessages']).
	controller('navigationController', function ($scope, $routeParams, apiService, controllerService) {
		if(!controllerService.navigationController){
			controllerService.navigationController = {
				init:false,
				apiService: apiService,
				scopes: [],
				SiteMap: [],
				isSubMenu: false,
				currentMenuItem: {
					parent: null,
					children: [],
					url: null
				},
				primaryMenuItem: {
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
					that.updatePrimaryMenuItem();
					that.updateSubMenu();
					_.each(that.scopes, function(scope){
						scope.SiteMap = that.SiteMap;
						scope.currentMenuItem = that.currentMenuItem;
						scope.primaryMenuItem = that.primaryMenuItem;
						scope.currentNavUrl = that.primaryMenuItem.url || $routeParams.url;
						scope.isSubMenu = that.isSubMenu;
					});
				},
				updatePrimaryMenuItem: function() {
					var that = this;
					if(that.currentMenuItem){//was loaded
						that.getMainParentMenuItem(that.currentMenuItem, function(menuItem){
							that.primaryMenuItem = menuItem;
						});
					}

				},
				updateSubMenu: function() {
					var status = !!(controllerService.navigationController.currentMenuItem && (controllerService.navigationController.currentMenuItem.parent || controllerService.navigationController.currentMenuItem.children.length > 0));
					if(this.isSubMenu !== status){
						this.isSubMenu = status;
					}
				},
				getMainParentMenuItem: function(item, callback){
					var that = this;
					if(item._id && item.parent) {//was loaded
						that.getMainParentMenuItem(
							that.SiteMap.find(function (menuItem) {
								return item.parent === menuItem._id;
							}),
							callback
						);
					} else {
						callback(item);
					}
				},
				fetchSiteMap: function () {
					var that = this;
					that.init = true;
					that.apiService.getModel('MenuItem')
						.then(function (response) {
							var responseData = response.data;
							if (responseData.success === true && Object.keys(responseData.data).length) {
								that.SiteMap = responseData.data;
								console.log('SiteMap', that.SiteMap);
								that.updateCurrentMenuItem();
							} else {
								console.error('Cannot retrieve menu!');
								console.error(responseData);
							}
						})
						.catch(function (response) {
							console.error('nav error', response);
						});
				}
			};
		}
		controllerService.navigationController.scopes.push($scope);

		$scope.isActiveLink = function (url) {
			return url === $routeParams.url ? 'active' : '';
		};

		$scope.currentNavUrl = $routeParams.url;

		if(!controllerService.navigationController.init){
			controllerService.navigationController.fetchSiteMap();
		} else {
			controllerService.navigationController.updateScopes();
		}

	});
});