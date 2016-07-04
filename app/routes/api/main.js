var 	api = require('../../controllers/api'),
		express = require('express');

exports.routes = function(req, res, next) {
	var apiRoute = express.Router();
	//apiRoute.use('/routable', apiRoute);

	apiRoute.route('/:subType/:hid/:action')
		.all(api.wildcard);//works for grabbing certain obj

	apiRoute.route('/:subType/:hid')
		.all(api.wildcard);//works for grabbing certain obj

	apiRoute.route('/:subType')
		.all(api.wildcard);//works for grabbing certain obj

	return apiRoute;
};
