//Ran at startup
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
	
	// Setting up Passport Strategies for Login and SignUp/Registration
	app.locals.controllers.pluginController.getLoadOrder('passport.strategy').forEach(function (plugin) {
		if(plugin.hasOwnProperty('item')){
			require(plugin['item'])(app);
		}
	});

};