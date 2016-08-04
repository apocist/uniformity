
define(['angular'], function(angular) {
	return angular.module('API.service', [])
		.factory('APIService', function ($http) {
			return {
				getModel: function (model, action) {
					return $http({
						method: 'GET',
						url: '/api/' + model,
						headers: {
							action: action || 'GET'
						}
					});
				},
				getRoutableByUrl: function (url) {
					return $http({
						method: 'GET',
						url: '/api/Route',
						headers: {
							action: 'getRoutableByUrl',
							url: url
						}
					});
				}
			}
		});
});