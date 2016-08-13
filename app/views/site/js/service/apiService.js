
define(['angular'], function(angular) {
	return angular.module('apiService', [])
		.factory('apiService', function ($http) {
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
				},

				/**
				 * Using only until I get rid of the Auth routes and use purely api
				 * @param url
				 */
				getCustom: function (url) {
					return $http({
						method: 'GET',
						url: url
					});
				}
			}
		});
});