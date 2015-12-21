var config = require('./config'),
	mongoose = require('mongoose'),
	autoIncrement = require('mongoose-auto-increment');

module.exports = function() {
	var db = mongoose.connect(config.db);
	autoIncrement.initialize(db);
	require('../app/models/auth/user.auth.server.model');
	require('../app/models/auth/permission.auth.server.model');
	require('../app/models/routable/route.server.model');
	require('../app/models/routable/routable.server.model');
	require('../app/models/routable/page.routable.server.model');
	require('../app/models/routable/blog.routable.server.model');
	
	return db;
};

/*
 var fs = require('fs')

 fs.readdirSync(models_path).forEach(function(file) {
 if (file.substring(-3) === '.js') {
 require(models_path + '/' + file);
 }
 });

 */