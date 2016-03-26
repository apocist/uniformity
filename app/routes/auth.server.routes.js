var 	express = require('express'),
		router = express.Router();

module.exports = function(app, passport, callback){

	// handle logout
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/auth/status');//handle sign and notify via json api call
	});

	// route for twitter authentication and login
	router.get('/login/:authType', function(req, res, next) {
		if(passport._strategy(req.params.authType)){
			passport.authenticate(req.params.authType)(req, res, next);
		} else{
			res.render('auth/authStatus', {status: {error: 'Authentication Strategy does not exist', user: null}});
		}
	});

	// handle the callback after twitter has authenticated the user
	router.get('/login/:authType/callback', function(req, res, next) {
		if(passport._strategy(req.params.authType)) {
			passport.authenticate(req.params.authType, function (err, user, flash) {
				var result = {
					status: {
						error: err,
						user: req.user,
						flash: flash
					}
				};
				if (!err && user) {
					req.logIn(user, function (err) {
						result.status.error = err;
						result.status.user = req.user.toJSON();
					});
				}
				return res.render('auth/authStatus', result);
			})(req, res, next);
		} else{
			res.render('auth/authStatus', {status: {error: 'Authentication Strategy does not exist', user: null}});
		}
	});

	router.get('/status', function(req, res){
		//Does not provide a flash message, as that initiates a popup.
		if(req.isAuthenticated()){
			res.json({
				status: {
					user: req.user.toJSON()
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
	callback();
};