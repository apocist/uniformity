var routing = require('../controllers/route.server.controller');
var express = require('express');
var vhost = require('vhost');

module.exports = function(app) {
	//noinspection JSUnresolvedFunction,JSCheckFunctionSignatures
	var mainRoute = express.Router();


	mainRoute.route('*')
		.all(routing.routeByURL)//gets a route by friendly url
		.all(routing.routeByID);//gets a route by hid

	app.use(vhost('*.*',mainRoute));//something.com
	app.use(routing.error404);//TODO this is provide a 404 for admin as well, should separate?

	

	
};