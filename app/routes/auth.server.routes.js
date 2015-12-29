var express = require('express');
var router = express.Router();

module.exports = function(app, passport){

	// handle logout
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/auth/status');//handle sign and notify via json api call
	});

	// route for twitter authentication and login
	router.get('/login/twitter', passport.authenticate('twitter'));

	// handle the callback after twitter has authenticated the user
	router.get('/login/twitter/callback', function(req, res, next) {
		passport.authenticate('twitter', function(err, user, flash) {
			var result =  {
				status: {
					error: err,
					user: req.user,
					flash: flash
				}
			};
			if (!err && user){
				req.logIn(user, function(err) {
					result.status.error = err;
					result.status.user = req.user;
				});
			}
			return res.render('auth/authStatus', result);
		})(req, res, next);
	});

	router.get('/status', function(req, res){
		//Does not provide a flash message, as that initiates a popup.
		if(req.isAuthenticated()){
			res.json({
				status: {
					user: req.user
				}
			});
		} else {
			res.json({
				status: {
					user: null
				}
			});
		}
	});

	app.use('/auth', router);

};