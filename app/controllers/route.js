var 	mongoose = require('mongoose'),
		Route = mongoose.model('Route'),
		PermissionController = require('./auth/permission'),
		libs = {
			'PermissionController': PermissionController
		},
		ObjectId = mongoose.Types.ObjectId;

/**
 * Returns a string if the supplied id could be valid
 * @param id possible mongoose _id
 * @returns {*}
 */
var toObjectId = function(id) {
	if(id == null) {return null}
	var stringId = id.toString().toLowerCase();
	if (!ObjectId.isValid(stringId)) {
		return null;
	}
	var result = new ObjectId(stringId);
	if (result.toString() != stringId) {
		return null;
	}
	return result;
};

exports.error404 = function(req, res) {
	res.status(404);

	// respond with html page
	if (req.accepts('html')) {
		var template_data = {
			url: req.url
		};

		res.render('404', template_data);
		return;
	}

	// respond with json
	if (req.accepts('json')) {
		res.json({ error: 'Not found' });
		return;
	}

	// default to plain-text. send()
	res.type('txt').send('Not found');
};

exports.routeByURL = function(req, res, next){
	var url = req.params[0];
	Route.findOne({
			url: url
		}, 
		function(err, route) {
			exports.getObj(req, res, next, err, route);
		}
	);
};

exports.routeByID = function(req, res, next) {
	var url = req.params[0];
	if(url.charAt(0) == '/'){//if url has / remove it
		url = url.substring(1);
	}
	if(toObjectId(url)){
		Route.findById(toObjectId(url), function(err, route) {
			exports.getObj(req, res, next, err, route);
		});
	}else{next();}
};

exports.getObj = function(req, res, next, err, route) {
	if (!err && route) {
		var objType = route.routableType;
		var id = route.object;
		
		if(mongoose.modelNames().indexOf(objType) >= 0){
			var obj = mongoose.model(objType);
			obj.findOne({
					_id: id
				}, 
				function(err, objData) {
					if (!err && objData) {
						//If controller contains special render functionality, do it
						if(obj.controller && obj.controller.render){
							//routableController.render(req, res, obj, objData);
							obj.controller.render(req, res, obj, objData, libs);
						} else {//Otherwise, perform normal operations
							PermissionController.hasAccess(req.user, objData, [PermissionController.access.readAll], function(bool){
								if(bool) {
									res.render('routable/'+objType, objData);
								} else {exports.error404(req, res);}//TODO need no permission page or something
							});
						}
					}
					else{return next(err);}
				}
			);
		}else{return next();}
	}
	else{return next(err);}
};