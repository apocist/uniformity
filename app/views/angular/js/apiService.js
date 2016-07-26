
define(['angular'], function(angular) {
	return angular.module('API.service', [])
		.factory('APIService', function ($http) {
			return {
				getRoutableByUrl: function (url) {
					return $http({
						method: 'GET',
						url: '/api/Route?action=getRoutableByUrl&url=' + url
					});
				}
			}
		});
});