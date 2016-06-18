var 	async = require('async'),
		express = require('express'),
		routes = {
			routable: require('./api/routable.js')
		};


module.exports = function(app, callback) {
	//Setup CORS for only Reading externally
	var allowCrossDomain = function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET');
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		next();
	};
	app.use(allowCrossDomain);

	var apiRoute = null;
	async.each(routes, function(route, next){
		apiRoute = express.Router();

		apiRoute.use(route.routes());

		app.use('/api', apiRoute);
		next();
	}, function(){
		callback();
	});

};
