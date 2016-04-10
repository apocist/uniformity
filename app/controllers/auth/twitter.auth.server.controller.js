var 	TwitterStrategy  = require('passport-twitter').Strategy;

/**
 *
 * @param passport
 * @param UserController require('./auth/user.auth.server.controller.js')
 * @param config Strategy Configuration settings
 */
module.exports = function(passport, UserController, config) {

	passport.use('twitter', new TwitterStrategy({
			consumerKey     : config.apikey,
			consumerSecret  : config.apisecret,
			callbackURL     : config.callbackURL
		},
		/**
		 *
		 * @param token
		 * @param tokenSecret
		 * @param profile
		 * @param done expecting a callback function of (err, user, flash)
		 */
		function(token, tokenSecret, profile, done) {

			// make the code asynchronous
			// User.findOne won't fire until we have all our data back from Twitter
			process.nextTick(function() {

				UserController.findOne({ 'twitter.id' : profile.id }, function(err, user) {

					// if there is an error, stop everything and return that
					// ie an error connecting to the database
					if (err)
						return done(err, null, null);

					// if the user is found then log them in
					if (user) {
						//TODO update the twitter profile
						return done(null, user, 'User Found and Logged In'); // user found, return that user
					} else {
						var twitterProfile = {
							'twitter': {
								'id' :profile.id,
								'token': token,
								'username' : profile.username,
								'displayName' : profile.displayName,
								'lastStatus' : profile._json.status.text
							}
						};
						UserController.create(twitterProfile, function(err, usr) {
							if (err)
								throw err;
							return done(null, usr, 'New User Registered');
						});
					}
				});
			});
		}
	));
};