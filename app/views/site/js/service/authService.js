
define(['angular'], function(angular) {
	return angular.module('authService', [])
		.factory('authService', function (apiService, $rootScope, $mdToast) {
			var user = null;
			var service = {
				getUser: function () {
					return this.isAuthenticated() ? user : null;
				},
				setUser: function (newUser) {
					user = newUser;

					//ensures the DOM updates properly, use safeApply
					if ($rootScope.$$phase != '$apply' && $rootScope.$$phase != '$digest') {
						$rootScope.$apply();
					}

					return this;
				},
				isAuthenticated: function () {
					return (user != null);
				}
			};
			//FIXME convert to api
			apiService.getCustom('/auth/status').success(function (response) {
				if (response.status && response.status.user && Object.keys(response.status.user).length) {
					service.setUser(response.status.user);
					console.log('Already Logged in');
				}
			});

			window.addEventListener('message', function(ev) {
				if(ev && ev.data && ev.data.type && ev.data.type == 'auth' && ev.data.user) {
					console.log('user:', ev.data);
					service.setUser(ev.data.user);
				}
				if(ev && ev.data && ev.data.type && ev.data.type == 'auth' && (ev.data.flash || ev.data.error)) {
					$mdToast.show(
						$mdToast.simple()
							.textContent(ev.data.flash || ev.data.error)
							.position('top right')
							.hideDelay(2000)
					);
				}

			});
			return service;
		});
});