var 	config = require('nconf'),
		express = require('./config/express'),
		mongoose = require('./config/mongoose'),
	
		pluginController = require('./app/controllers/plugin');
	

config
	.env()
	.argv()
	.file('./config/config.json')//absolute -file doesn't need to exist
	.defaults(require('./config/defaults.json'));//relative


pluginController.process(config, function(){
	mongoose(config, pluginController, function(d){
		express(config, pluginController, function(ap){
			var db = d,
				app = ap;
			
			app.listen(config.get('ENV:port'));
			module.exports = app;
			console.log(config.get('NODE_ENV')  + ' server running at http://localhost:' + config.get('ENV:port'));
		});
	})
});



