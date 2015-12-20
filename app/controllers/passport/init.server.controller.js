var twitter = require('./twitter.server.controller');
var mongoose = require('mongoose'),
	User = mongoose.model('User');

module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	passport.serializeUser(function(user, done) {
		//console.log('serializing user: ');console.log(user);
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {//TODO may need to sanitize the data to prevent anything unneeded to pass to users
		User
			.findById(id)
			.populate('permissions', 'scope permission')//don't need the user field
			.exec (function(err, user) {
				//console.log('deserializing user:',user);
				done(err, user);
			});
	});

	// Setting up Passport Strategies for Login and SignUp/Registration
	twitter(passport);

};