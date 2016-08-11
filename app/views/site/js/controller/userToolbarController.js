define(['angular'], function(angular) {
	return angular.module('userToolbarController', ['ngMaterial','ngSanitize']).
	controller('userToolbarController', function ($scope, $mdDialog) {

		//Login Strategies
		$scope.loginDialog = function(ev) {
			$mdDialog.show({
				controller: function($scope, $mdDialog/*, items*/) {
					$scope.openStrategy = function(strategy){
						var url = '/auth/login/' + strategy;
						$scope.openPopup(url);
					};
					$scope.openPopup = function(url){
						console.log('Link clicked');
						var width = 640,
							height = 480,
							top = (window.outerHeight - height) / 2,
							left = (window.outerWidth - width) / 2;
						window.open(url, 'Login', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left);
						$mdDialog.hide();
					};
				},
				locals: {
					//items: $scope.items
				},
				parent: angular.element(document.querySelector('body')),
				templateUrl: '/site/partials/strategyLogin.html',
				targetEvent: ev,
				clickOutsideToClose: true
			});
		};

	});
});