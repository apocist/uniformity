var 	mongoose = require('mongoose'),
		User = mongoose.model('User'),
		Permission = mongoose.model('Permission');

/**
 * A simple alias for the User model function findOne
 * @param options fields to search for user by
 * @param done expecting a callback function of (err, user)
 */
exports.findOne = function(options, done) {
	User.findOne(options, function(err, user) {
		return done(err, user);
	});
};
/**
 *
 * @param options object containing additional variable objects for newUser
 * @param done expecting a callback function of (err, user)
 */
exports.create = function(options, done) {
	var that = this;

	var newUser                 = new User();

	//add all the items from Object to this new object (merge)
	for (var attrname in options) {
		newUser[attrname] = options[attrname];
	}

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
			done(err, null);
		that.findOne({'_id' : newUser.id},function(err, user) {
			if (err)
				done(err, null);
			done(null, user);
		});

	});
};
