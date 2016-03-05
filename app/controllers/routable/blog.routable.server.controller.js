
exports.render = function(req, res, obj, objData,libs) {
	libs.PermissionController.hasAccess(req.user, objData, [libs.PermissionController.access.readAll], function(bool){
		if(bool) {
			res.render('routable/blog', objData);
		} else {res.render('404', req);}//TODO need no permission page or something
	});
};