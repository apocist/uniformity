
define(['angular'], function(angular) {
	return angular.module('API.templateModel', [])
		.factory('Model', ['$http', function ($http) {
			function Model(modelData) {
				if (modelData) {
					this.setData(modelData)
				}
				// Some other initializations related to book
			}
			Model.prototype = {
				setData: function (modelData) {
					angular.extend(this, modelData);
				}
			};
			return Model;
		}]);
});