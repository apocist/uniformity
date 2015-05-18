var config = require('./config'),
	mongoose = require('mongoose'),
	autoIncrement = require('mongoose-auto-increment');

module.exports = function() {
	var db = mongoose.connect(config.db);
	autoIncrement.initialize(db);
	require('../app/models/route.server.model');
	require('../app/models/_routable.server.model');
	require('../app/models/page.server.model');
	require('../app/models/blog.server.model');
	
	return db;
};