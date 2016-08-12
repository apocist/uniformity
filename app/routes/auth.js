var 	express = require('express'),
		router = express.Router();

module.exports = function(app, callback){

	// handle logout
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/auth/status');//handle sign and notify via json api call
	});

	// route for login choices
	router.get('/login', function(req, res, next) {
		res.render('auth/authLogin', {strategies: app.locals.passport.authStrategies});
	});
	
	// route for custom authentication and login
	router.get('/login/:authType', function(req, res, next) {
		if(app.locals.passport._strategy(req.params.authType)){
			app.locals.passport.authenticate(req.params.authType)(req, res, next);
		} else{
			res.render('auth/authStatus', {status: {type: 'auth', error: 'Authentication Strategy does not exist', user: null}});
		}
	});

	// handle the callback after twitter has authenticated the user
	router.get('/login/:authType/callback', function(req, res, next) {
		if(app.locals.passport._strategy(req.params.authType)) {
			app.locals.passport.authenticate(req.params.authType, function (err, user, flash) {
				//FIXME not populating
				var result = {
					status: {
						type: 'auth',
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
			res.render('auth/authStatus', {status: {type: 'auth', error: 'Authentication Strategy does not exist', user: null}});
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