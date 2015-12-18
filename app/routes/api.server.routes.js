var express = require('express');
var routes = {
	routable: require('./api.routable.server.routes')
};
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
	var secureApiRoute = null;
	for(var route in routes) {
		if(routes.hasOwnProperty(route)){
			if(routes[route].hasOwnProperty('public')){
				apiRoute = express.Router();

				apiRoute.use(routes[route].public());

				app.use('/api', apiRoute);
			}
			if(routes[route].hasOwnProperty('secure')){
				secureApiRoute = express.Router();

				// Will authenticated every request
				secureApiRoute.use(function(req, res, next) {

					//TODO Authenticate the api request here

					next();// If acceptable, continue
					//res.json({error: "Not Authenticated"});
				});

				secureApiRoute.use(routes[route].secure());

				app.use('/api', secureApiRoute)
			}
		}
	}


	/*app.get('*', function(req, res, next){
		if(req.headers.host == 'some.sub.domain.com')  //if it's a sub-domain
			req.url = '/mysubdomain' + req.url;  //append some text yourself
		next();
		//This will mean that all get requests that come from the subdomain will get
		//	/subomdin appended to them
	});*/

};