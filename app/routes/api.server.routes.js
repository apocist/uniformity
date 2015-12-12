//var adminController = require('../controllers/admin.server.controller');
var routable = require('../controllers/routable.server.controller');
var express = require('express');

module.exports = function(app) {
	//Anyone may run GETs
	var apiRoute = express.Router();
	apiRoute.use('/routable', apiRoute);

	apiRoute.route('/:subType/:hid').get(routable.getObjByHid);//works for grabbing certain obj
	apiRoute.route('/:subType').get(routable.listBySubType);//works for listings objs


	//Only authenticated may make changes
	var secureApiRoute = express.Router();


	// Will authenticated every request
	secureApiRoute.use(function(req, res, next) {

		//TODO Authenticate the api request here

		next();// If acceptable, continue
		//res.json({error: "Not Authenticated"});
	});

	secureApiRoute.use('/routable', secureApiRoute);

	secureApiRoute.route('/:subType/:hid')
			.put(routable.update)//works for updating routable in PUT
			.delete(routable.remove);//works for deleting routable in DELETE
	secureApiRoute.route('/:subType')
			.post(routable.create)//works for creating routable in POST
			.put(routable.update)//works for updating routable in PUT
			.delete(routable.remove);//works for deleting routable in DELETE


	//Setup CORS for only Reading externally
	var allowCrossDomain = function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET');
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		next();
	}
	app.use(allowCrossDomain);
	//app.use(vhost('*.*',apiRoute));//something.com
	app.use('/api', apiRoute);
	app.use('/api', secureApiRoute);


	/*app.get('*', function(req, res, next){
		if(req.headers.host == 'some.sub.domain.com')  //if it's a sub-domain
			req.url = '/mysubdomain' + req.url;  //append some text yourself
		next();
		//This will mean that all get requests that come from the subdomain will get
		//	/subomdin appended to them
	});*/

};