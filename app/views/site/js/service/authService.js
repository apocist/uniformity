
define(['angular'], function(angular) {
	return angular.module('authService', [])
		.factory('authService', function ($rootScope) {
			var user = null;
			var service = {
				getUser: function () {
					return this.isAuthenticated() ? user : null;
				},
				setUser: function (newUser) {
					user = newUser;
					$rootScope.$apply(); //ensures the DOM updates properly
					return this;
				},
				isAuthenticated: function () {
					return (user != null);
				}
			};
			window.authService = service;
			window.addEventListener('message', function(ev) {
				if(ev && ev.data && ev.data.type && ev.data.type == 'auth' && ev.data.user){
					console.log('user:',ev.data);
					service.setUser(ev.data.user);
					//TODO add flash message
				}

			});
			return service;
		});
});