var obj = require('../controllers/obj.server.controller');
var routing = require('../controllers/route.server.controller');

module.exports = function(app) {
	app.route('/create').post(obj.create);//works for creating page in POST
	app.route('/list/:obj').post(obj.create).get(obj.list);//works for both creating in POST and listings obj in public
	app.route('*').all(routing.routeByURL);//gets a route by friendly url
	app.route('*').all(routing.routeByID);//gets a route by hid

	app.use(routing.error404);

	
	/*app.get('*', function(req, res, next){ 
	  if(req.headers.host == 'some.sub.domain.com')  //if it's a sub-domain
		req.url = '/mysubdomain' + req.url;  //append some text yourself
	  next(); 
	//This will mean that all get requests that come from the subdomain will get 
	//	/subomdin appended to them
	}); */
	
};