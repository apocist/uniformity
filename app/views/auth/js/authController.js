define(['jquery','common'], function($) {

	return Class({


		uniformityController: null,
		flashController: null,//Require flashController, alias from uniformityController

		//TODO elements to be removed
		twitterButton: null,

		//variables
		user: null,
		isAuthenticated: false,


		initialize: function (options) {
			var that = this;

			that.uniformityController = (options || {}).uniformityController;
			that.flashController = that.uniformityController.controllers.flashController;
			that.twitterButton = (options || {}).twitterButton;
			that.user = (options || {}).user;
			that.isAuthenticated = (options || {}).isAuthenticated;

			if (that.twitterButton != null) {
				console.log('set twitter button!');//TODO remove later
				$(that.twitterButton).click(that.twitterLogin);//Clicking the Display Element will allow editing it

			}

			console.log('auth inited');
		},
		twitterLogin: function () {//TODO need to make a lightbox popup?
			var url = '/auth/login/twitter',
				width = 640,
				height = 480,
				top = (window.outerHeight - height) / 2,
				left = (window.outerWidth - width) / 2;
			window.open(url, 'Twitter Login', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left);
		},
		resetSession: function () {
			var that = this;
			that.user = null;
			that.isAuthenticated = false;
		},
		authUpdate: function (status) {
			if (status.user) {
				this.authSuccess(status);
			} else {
				this.authFail(status);
			}
		},
		authSuccess: function (status) {
			var that = this;
			that.user = status.user;
			that.isAuthenticated = true;
			if (status.flash) {
				that.flashController.successMessage(status.flash);
			}
		},
		authFail: function (status) {
			var that = this;
			that.resetSession();
			if (status.flash) {
				that.flashController.failMessage(status.flash);
			} else if (status.error) {
				that.flashController.failMessage(status.error);
			}
		}
	});

});

