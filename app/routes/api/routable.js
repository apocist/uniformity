var 	routable = require('../../controllers/routable'),
		express = require('express');

exports.routes = function(req, res, next) {
	var apiRoute = express.Router();
	apiRoute.use('/routable', apiRoute);

	apiRoute.route('/:subType/:hid').get(routable.getObjByHid);//works for grabbing certain obj
	apiRoute.route('/:subType').get(routable.listBySubType);//works for listings objs

	apiRoute.route('/:subType/:hid')
			.put(routable.update)//works for updating routable in PUT
			.delete(routable.remove);//works for deleting routable in DELETE
	apiRoute.route('/:subType')
			.post(routable.create)//works for creating routable in POST
			.put(routable.update)//works for updating routable in PUT
			.delete(routable.remove);//works for deleting routable in DELETE
	return apiRoute;
};
