var express = require('express');
var router = express.Router();

module.exports = function(app, passport){

	// handle logout
	router.get('/signout', function(req, res) {
		req.logout();
		//res.redirect('/');//handle sign and notify via json api call
	});

	// route for twitter authentication and login
	router.get('/login/twitter', passport.authenticate('twitter'));

	// handle the callback after twitter has authenticated the user
	router.get('/login/twitter/callback', function(req, res, next) {
		passport.authenticate('twitter', function(err, user, flash) {
			if (err || !user){
				return res.render('authStatus', {
					status: {
						error: err,
						flash: flash
					}
				});
			} else{
				req.logIn(user, function(err) {
					if (err) {
						return res.render('authStatus', {
							status: {
								error: err
							}
						});
					} else {
						return res.render('authStatus', {
							status: {
								user: req.user,
								flash: flash
							}
						});
					}
				});
			}
		})(req, res, next);
	});

	/* Test API is detects login
	* This seem to keep the session even through api calls without passing tokens
	* TODO should replace with an Auth Status json call
	* */
	router.get('/apitest', function(req, res){
		if(req.isAuthenticated()){
			res.json({status: "You are Authenticated"});
		} else {
			res.json({status: "You are NOT Authenticated! GO AWAY!!!!!!"});
		}
	});

	app.use('/auth', router);

};