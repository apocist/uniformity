
define(['angular'], function(angular) {
	return angular.module('modelService', [])
		.factory('TemplateModel', ['$http', function ($http) {
			function TemplateModel(modelData) {
				if (modelData) {
					this.setData(modelData)
				}
				// Some other initializations related to book
			}
			TemplateModel.prototype = {
				setData: function (modelData) {
					angular.extend(this, modelData);
				}
			};
			return TemplateModel;
		}]);
});