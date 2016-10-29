var 	config = require('nconf'),
		express = require('./config/express'),
		fs = require('fs'),
		mongoose = require('./config/mongoose'),
		spdy = require('spdy'),
	
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

			var sslEnabled = false;
			var createServerOptions = {
				spdy: {
					plain: true //no https
				}
			};
			//Turn on SSL if certs are found
			if(config.get('ENV:ssl:key') && config.get('ENV:ssl:cert')){
				sslEnabled = true;
				createServerOptions = {
					key: fs.readFileSync(config.get('ENV:ssl:key')),
					cert: fs.readFileSync(config.get('ENV:ssl:cert')),
					spdy: {},
					secureOptions: require('constants').SSL_OP_NO_TLSv1//SSL_OP_CIPHER_SERVER_PREFERENCE
				};
				if(config.get('ENV:ssl:ciphers')){
					createServerOptions.ciphers = config.get('ENV:ssl:ciphers');
				}
			}
			if(config.get('ENV:protocols')) {
				createServerOptions.spdy.protocols = config.get('ENV:protocols'); //protocols: ['h2', 'http/1.1']
			}

			spdy
				.createServer(createServerOptions, app)
				.listen(config.get('ENV:port'), function(err) {
						if(err){
							console.log('error: ', err);
						} else {
							//TODO need to select certain domains
							console.log(config.get('NODE_ENV')  + ' server running at //localhost:' + config.get('ENV:port'));
							if(sslEnabled == true && config.get('ENV:port') != 443){
								console.warn('SSL/TSL is intended to run on port 443, however server is starting on port ' + config.get('ENV:port'));
							} else if(sslEnabled == true && config.get('ENV:port') == 443){ //If SSL is setup, force it's usage
								var redirectApp = require('http');
								redirectApp.createServer(function (req, res) {
									res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
									//TODO push the posts as well?
									res.end();
								}).listen(80);
							}
						}
					}
				);
			module.exports = app;
		});
	})
});



