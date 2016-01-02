process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var 	config = require('./config/config'),
		mongoose = require('./config/mongoose'),
		express = require('./config/express');

mongoose(function(d){
	express(function(ap){
		var db = d,
			app = ap;

		app.listen(config.port);
		module.exports = app;
		console.log(process.env.NODE_ENV  + ' server running at http://localhost:' + config.port);
	});
});
	
