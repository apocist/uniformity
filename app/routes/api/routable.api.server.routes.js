var routable = require('../../controllers/routable/routable.server.controller.js');
var express = require('express');


exports.public = function(req, res, next) {
	var apiRoute = express.Router();
	apiRoute.use('/routable', apiRoute);

	apiRoute.route('/:subType/:hid').get(routable.getObjByHid);//works for grabbing certain obj
	apiRoute.route('/:subType').get(routable.listBySubType);//works for listings objs
	return apiRoute;
};

exports.secure = function(req, res, next) {
	var secureApiRoute = express.Router();
	secureApiRoute.use('/routable', secureApiRoute);

	secureApiRoute.route('/:subType/:hid')
			.put(routable.update)//works for updating routable in PUT
			.delete(routable.remove);//works for deleting routable in DELETE
	secureApiRoute.route('/:subType')
			.post(routable.create)//works for creating routable in POST
			.put(routable.update)//works for updating routable in PUT
			.delete(routable.remove);//works for deleting routable in DELETE
	return secureApiRoute;
};
