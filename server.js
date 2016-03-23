process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var 	config = require('./config/config'),
		mongoose = require('./config/mongoose'),
		express = require('./config/express'),
		pluginManager = require('./app/libs/pluginManager');


pluginManager.process(function(){
	mongoose(pluginManager, function(d){
		express(pluginManager, function(ap){
			var db = d,
				app = ap;

			app.locals.pluginManager = pluginManager;
			app.listen(config.port);
			module.exports = app;
			console.log(process.env.NODE_ENV  + ' server running at http://localhost:' + config.port);
		});
	})
});



