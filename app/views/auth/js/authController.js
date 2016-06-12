define(['jquery','common'], function($) {

	return Class({


		uniformityController: null,
		flashController: null,//Require flashController, alias from uniformityController

		//TODO elements to be removed
		loginButton: null,

		//variables
		user: null,
		isAuthenticated: false,


		initialize: function (options) {
			var that = this;

			that.uniformityController = (options || {}).uniformityController;
			that.flashController = that.uniformityController.controllers.flashController;
			that.loginButton = (options || {}).loginButton;
			that.user = (options || {}).user;
			that.isAuthenticated = (options || {}).isAuthenticated;

			if (that.loginButton != null) {
				console.log('set login button!');//TODO remove later
				$(that.loginButton).click(that.initLogin);//Clicking the Display Element will allow editing it

			}

			console.log('auth inited');
		},
		initLogin: function () {
			var url = '/auth/login',
				width = 640,
				height = 480,
				top = (window.outerHeight - height) / 2,
				left = (window.outerWidth - width) / 2;
			window.open(url, 'Login', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left);
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

