var 	api = require('../../controllers/api'),
		express = require('express');

exports.routes = function(req, res, next) {
	var apiRoute = express.Router();
	//apiRoute.use('/routable', apiRoute);

	apiRoute.route('/:model/:hid/:action')
		.all(api.wildcard);//works for grabbing certain obj

	apiRoute.route('/:model/:hid')
		.all(api.wildcard);//works for grabbing certain obj

	apiRoute.route('/:model')
		.all(api.wildcard);//works for grabbing certain obj

	return apiRoute;
};
