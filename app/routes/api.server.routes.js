var express = require('express');
var routes = {
	routable: require('./api.routable.server.routes')
};

function requirePermission(role) {//TODO in the works of a Permissions Controller
	return function(req, res, next) {
		var granted = false;
		if(req.user){
			if(req.user.permissions){
				for (var i = 0; i < req.user.permissions.length; i++) {
					if(req.user.permissions[i].scope == role && req.user.permissions[i].permission == 255){
						granted = true;
						break;
					}
				}

				if(granted){
					next();
				}
			}
		}
		if(!granted){
			console.log('permission denied');
			res.send(403);//TODO  a json return by default, also allow passing a fail function
		}
	}
}

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
				secureApiRoute.use(requirePermission('master'), routes[route].secure());//FIXME example of requiring master permission

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