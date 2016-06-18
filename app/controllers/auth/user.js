var 	mongoose = require('mongoose'),
		User = mongoose.model('User'),
		Permission = mongoose.model('Permission');

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
		if(options.hasOwnProperty(attrname)){
			newUser[attrname] = options[attrname];
		}
	}

	if(options.hasOwnProperty('strategies')){
		newUser.strategies = [];//empty that list
		for (var strategy in options.strategies) {
			if(options.strategies.hasOwnProperty(strategy)){

				options.strategies[strategy]['user'] = newUser;
				options.strategies[strategy].save();

				newUser.strategies.push(options.strategies[strategy]);
			}
		}
	}

	//TODO should only give master permissions if there are no users with them
	var permission = new Permission();//TODO in the works of a Permissions Controller
	permission.user = newUser;
	permission.scope = 'Site';
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
/**
 * A simple alias for the User model function findOne
 * @param options fields to search for user by
 * @param done expecting a callback function of (err, user)
 */
exports.findOne = function(options, done) {
	if(done){
		User.findOne(options, function(err, user) {
			return done(err, user);
		});
	} else return User.findOne(options);
};
/**
 * A simple alias for the User model function findById
 * @param options fields to search for user by
 * @param done expecting a callback function of (err, user)
 */
exports.findById = function(options, done) {
	if(done){
		User.findById(options, function(err, user) {
			return done(err, user);
		});
	} else return User.findById(options);

};
/**
 * A simple alias for the User model function populate
 * @param options fields to search for user by
 * @param done expecting a callback function of (err, user)
 */
exports.populate = function(options, done) {
	if(done){
		User.populate(options, function(err, user) {
			return done(err, user);
		});
	} else return User.populate(options);
};
/**
 * A simple alias for the User model function exec
 * @param options fields to search for user by
 * @param done expecting a callback function of (err, user)
 */
exports.exec = function(options, done) {
	if(done){
		User.exec(options, function(err, user) {
			return done(err, user);
		});
	} else return User.exec(options);
};
