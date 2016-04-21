var 	config = require('nconf'),
		express = require('./config/express'),
		mongoose = require('./config/mongoose'),
	
		pluginManager = require('./app/libs/pluginManager');
	

config
	.env()
	.argv()
	.file('./config/config.json')//absolute -file doesn't need to exist
	.defaults(require('./config/defaults.json'));//relative


pluginManager.process(config, function(){
	mongoose(config, pluginManager, function(d){
		express(config, pluginManager, function(ap){
			var db = d,
				app = ap;
			
			app.listen(config.get('ENV:port'));
			module.exports = app;
			console.log(config.get('NODE_ENV')  + ' server running at http://localhost:' + config.get('ENV:port'));
		});
	})
});



