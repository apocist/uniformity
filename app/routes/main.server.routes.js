var routable = require('../controllers/routable.server.controller');
var routing = require('../controllers/route.server.controller');
var express = require('express');
var vhost = require('vhost');

module.exports = function(app) {
	//noinspection JSUnresolvedFunction,JSCheckFunctionSignatures
	var mainRoute = express.Router();

	mainRoute.route('/routable/:type')
		.post(routable.create)//works for creating routable in POST
		.put(routable.update)//works for creating routable in POST
		.delete(routable.remove);//works for deleting routable in DELETE
	mainRoute.route('/routable/:type/list').get(routable.listByType);//works for listings objs
	mainRoute.route('/routable/:type/get/:hid').get(routable.getObjByHid);//works for grabbing certain obj
	mainRoute.route('*')
		.all(routing.routeByURL)//gets a route by friendly url
		.all(routing.routeByID);//gets a route by hid

	app.use(vhost('*.*',mainRoute));//something.com
	app.use(routing.error404);//TODO this is provide a 404 for admin as well, should separate?

	

	
};