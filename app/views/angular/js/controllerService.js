
define(['angular', 'underscore'], function(angular) {
	return angular.module('controllerService', [])
		.factory('controllerService', function ($http) {
			return {
				/*
				This is basically a global namespace for holding controllers
				To be used when controllers need each but must be load async separately
				 */
			}
		});
});