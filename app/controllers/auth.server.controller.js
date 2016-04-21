var 	twitter = require('./auth/twitter.auth.server.controller.js'),
		UserController = require('./auth/user.auth.server.controller.js');

//Run at startup
/**
 * @param app
 * @param passport
 */
module.exports = function(app, passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {//TODO may need to sanitize the data to prevent anything unneeded to pass to users
		UserController
			.findById(id)
			.populate('permissions', 'scope permission')//don't need the user field
			.exec (function(err, user) {
				done(err, user);
			});
	});

	//TODO loop through each plugin and load dynamically
	//TODO should controllers be loaded into 'app'?
	console.log(app.get('passport'));
	// Setting up Passport Strategies for Login and SignUp/Registration
	twitter(passport, UserController, app.locals.config.get("pluginManager:uniformity-auth-twitter"));

};