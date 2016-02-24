var 	routing = require('../controllers/route.server.controller.js'),
		index = require('../controllers/site/index.site.server.controller'),
		express = require('express'),
		vhost = require('vhost');

module.exports = function(app, passport, callback) {
	//noinspection JSUnresolvedFunction,JSCheckFunctionSignatures
	var mainRoute = express.Router();


	mainRoute.route('*')
		.all(routing.routeByURL)//gets a route by friendly url
		.all(routing.routeByID);//gets a route by hid

	mainRoute.get('/', index.render);

	app.use(vhost('*.*',mainRoute));//something.com
	app.use(routing.error404);//TODO this provides a 404 for admin as well, should it be separate?

	callback();
};