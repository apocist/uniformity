
define(['angular'], function(angular) {
	return angular.module('API.service', [])
		.factory('APIService', function ($http) {
			return {
				getRoutableByUrl: function (url) {
					return $http({
						method: 'GET',
						url: '/api/Route',//by stand, keep the model directly in the Url
						headers: {
							action: 'getRoutableByUrl',
							url: url
						}
					});
				}
			}
		});
});