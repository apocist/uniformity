var 	twitter = require('./auth/twitter.auth.server.controller.js'),
		UserController = require('./auth/user.auth.server.controller.js');

//Run at startup
/**
 * @param app
 */
module.exports = function(app){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	app.locals.passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	app.locals.passport.deserializeUser(function(id, done) {//TODO may need to sanitize the data to prevent anything unneeded to pass to users
		app.locals.controllers.auth.userController
			.findById(id)
			.populate('permissions', 'scope permission')//don't need the user field
			.exec (function(err, user) {
				done(err, user);
			});
	});

	//TODO loop through each plugin and load dynamically
	//TODO should controllers be loaded into 'app'?
	// Setting up Passport Strategies for Login and SignUp/Registration
	twitter(app);

};