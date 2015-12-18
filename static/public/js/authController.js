var authController = Class({

	twitterButton: null,
	user: null,
	isAuthenticated: false,

	initialize: function(options){
		var that = this;
		that.twitterButton = (options||{}).twitterButton;
		that.user = (options||{}).user;
		that.isAuthenticated = (options||{}).isAuthenticated;

		if(that.twitterButton != null){
			console.log('set twitter button!');//TODO remove later
			$(that.twitterButton).click(that.twitterLogin);//Clicking the Display Element will allow editing it

		}

		console.log('auth inited');
	},
	twitterLogin: function() {//TODO need to make a lightbox popup?
		var url = '/auth/login/twitter',
				width = 640,
				height = 480,
				top = (window.outerHeight - height) / 2,
				left = (window.outerWidth - width) / 2;
		window.open(url, 'Twitter Login', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left);
	},
	resetSession: function() {
		var that = this;
		that.user = null;
		that.isAuthenticated = false;
	},
	authUpdate: function(status) {
		if(status.user){
			this.authSuccess(status);
		} else{
			this.authFail(status);
		}
	},
	authSuccess: function(status) {
		var that = this;
		that.user = status.user;
		that.isAuthenticated = true;
		console.log(status.flash);
		//TODO need to setup popup messages(passive ones that aren't intrusive)
	},
	authFail: function(status) {
		var that = this;
		that.resetSession();
		if(status.flash){
			console.log(status.flash);
		} else if(status.error){
			console.log(status.error);
		} else {
			console.log('Authentication failed');
		}
		//TODO need to setup popup messages(passive ones that aren't intrusive)
	}
});

