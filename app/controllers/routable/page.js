//This file is never used, but left as a placeholder example
var PermissionController = require('./../auth/permission');

//render function not need, as it does nothing special
exports.render = function(req, res, obj, objData) {
	PermissionController.hasAccess(req.user, objData, [PermissionController.access.readAll], function(bool){
		if(bool) {
			res.render('routable/page', objData);
		} else {res.render('404', req);}//TODO need no permission page or something
	});
};