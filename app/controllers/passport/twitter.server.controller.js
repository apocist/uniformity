var TwitterStrategy  = require('passport-twitter').Strategy;
//var User = require('../models/user');
var twitterConfig = require('../../../config/social/twitter.js');
var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Permission = mongoose.model('Permission');

module.exports = function(passport) {

	passport.use('twitter', new TwitterStrategy({
			consumerKey     : twitterConfig.apikey,
			consumerSecret  : twitterConfig.apisecret,
			callbackURL     : twitterConfig.callbackURL

		},
		function(token, tokenSecret, profile, done) {

			// make the code asynchronous
			// User.findOne won't fire until we have all our data back from Twitter
			process.nextTick(function() {

				User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

					// if there is an error, stop everything and return that
					// ie an error connecting to the database
					if (err)
						return done(err, null, null);

					// if the user is found then log them in
					if (user) {
						return done(null, user, 'User Found and Logged In'); // user found, return that user
					} else {
						// if there is no user, create them
						//TODO new user functions need to be ran centerally(in the init possibly)
						var newUser                 = new User();

						// set all of the user data that we need
						newUser.twitter.id          = profile.id;
						newUser.twitter.token       = token;
						newUser.twitter.username = profile.username;
						newUser.twitter.displayName = profile.displayName;
						newUser.twitter.lastStatus = profile._json.status.text;

						//TODO should only give master permissions if there are no users with them
						var permission = new Permission();//TODO in the works of a Permissions Controller
						permission.user = newUser;
						permission.scope = 'master';
						permission.permission = 255;
						permission.save();

						newUser.permissions.push(permission);

						// save our user into the database
						newUser.save(function(err) {
							if (err)
								throw err;
							return done(null, newUser, 'New User Registered');
						});
					}
				});

			});

		}
	));

};