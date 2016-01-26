var 	express = require('express'),
		dir = require('../libs/node-dir-extend');

module.exports = function(app, passport) {
	//Setup CORS for only Reading externally
	var allowCrossDomain = function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET');
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		next();
	};
	app.use(allowCrossDomain);

	var apiRoute = null;

	//Includes all the files found directly in /app/routes , none in sub directories
	dir.filesLocal(__dirname+'/api/',function(routes){
		console.log('Api Paths:\n',routes);
		for(var route in routes) {
			apiRoute = express.Router();

			apiRoute.use(require(routes[route]).routes());

			app.use('/api', apiRoute);
		}
	});

	/*app.get('*', function(req, res, next){
		if(req.headers.host == 'some.sub.domain.com')  //if it's a sub-domain
			req.url = '/mysubdomain' + req.url;  //append some text yourself
		next();
		//This will mean that all get requests that come from the subdomain will get
		//	/subomdin appended to them
	});*/

};