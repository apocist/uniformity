process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var 	config = require('./config/config'),
		mongoose = require('./config/mongoose'),
		express = require('./config/express');

var PluginManager = require('polite-plugin-manager');


/*PluginManager.registerMany(__dirname+'/plugins').start(function() {

	console.log('loaded packages!');
	//console.log('there are ', PluginManager.packages.length, ' packages')
});*/

mongoose(function(d){
	express(function(ap){
		var db = d,
			app = ap;

		app.listen(config.port);
		module.exports = app;
		console.log(process.env.NODE_ENV  + ' server running at http://localhost:' + config.port);
	});
});



