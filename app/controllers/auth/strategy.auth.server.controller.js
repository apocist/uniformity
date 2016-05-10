var 	mongoose = require('mongoose'),
		Strategy = mongoose.model('Strategy');


/**
 * A simple alias for the Strategy model function findOne
 * @param options fields to search for user by
 * @param done expecting a callback function of (err, strategy)
 */
exports.findOne = function(options, done) {
	if(done){
		Strategy.findOne(options, function(err, strategy) {
			return done(err, strategy);
		});
	} else return Strategy.findOne(options);
};
/**
 * A simple alias for the Strategy model function findById
 * @param options fields to search for user by
 * @param done expecting a callback function of (err, strategy)
 */
exports.findById = function(options, done) {
	if(done){
		Strategy.findById(options, function(err, strategy) {
			return done(err, strategy);
		});
	} else return Strategy.findById(options);

};
/**
 * A simple alias for the Strategy model function populate
 * @param options fields to search for user by
 * @param done expecting a callback function of (err, strategy)
 */
exports.populate = function(options, done) {
	if(done){
		Strategy.populate(options, function(err, strategy) {
			return done(err, strategy);
		});
	} else return Strategy.populate(options);
};
/**
 * A simple alias for the Strategy model function exec
 * @param options fields to search for user by
 * @param done expecting a callback function of (err, strategy)
 */
exports.exec = function(options, done) {
	if(done){
		Strategy.exec(options, function(err, strategy) {
			return done(err, strategy);
		});
	} else return Strategy.exec(options);
};
