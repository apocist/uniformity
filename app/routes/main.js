var 	routing = require('../controllers/route'),
		index = require('../controllers/site/index'),
		express = require('express'),
		vhost = require('vhost');

module.exports = function(app, callback) {
	//noinspection JSUnresolvedFunction,JSCheckFunctionSignatures
	var mainRoute = express.Router();

	//mainRoute.route('*').all(function(res){res.render('site/app.swig');});
	mainRoute.get('*', function(req, res){
		res.render('site/app.swig');
	});
	/*mainRoute.route('*')
		.all(routing.routeByURL)//gets a route by friendly url
		.all(routing.routeByID);//gets a route by id

	mainRoute.get('/', index.render);*/

	app.use(vhost('*.*',mainRoute));//something.com
	app.use(routing.error404);//TODO this provides a 404 for admin as well, should it be separate?

	callback();
};