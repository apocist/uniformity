var adminController = require('../controllers/admin.server.controller');
var routable = require('../controllers/routable.server.controller');
var express = require('express');
var vhost = require('vhost');

module.exports = function(app) {
	var adminRoute = express.Router();

	adminRoute.get('/', adminController.render);
	adminRoute.route('/routable/:type')
		.post(routable.create)//works for creating routable in POST
		.put(routable.update)//works for updating routable in PUT
		.delete(routable.remove)//works for deleting routable in DELETE
		.get(routable.listByType);//works for listings objs TODO for getting a list of objs
	adminRoute.route('/routable/:type/list').get(routable.listByType);//works for listings objs //TODO to remove
	adminRoute.route('/routable/:type/get/:hid').get(routable.getObjByHid);//works for grabbing certain obj //TODO to remove
	adminRoute.route('/routable/:type/:hid').get(routable.getObjByHid);//works for grabbing certain obj TODO new for getting single


	//Setup CORS
	var allowCrossDomain = function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');//TODO need to limit to main domain e.g. http://inin.pw:1337
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		next();
	}
	app.use(allowCrossDomain);
	app.use(vhost('admin.*.*',adminRoute));//admin.something.com




	/*app.get('*', function(req, res, next){
		if(req.headers.host == 'some.sub.domain.com')  //if it's a sub-domain
			req.url = '/mysubdomain' + req.url;  //append some text yourself
		next();
		//This will mean that all get requests that come from the subdomain will get
		//	/subomdin appended to them
	});*/

};