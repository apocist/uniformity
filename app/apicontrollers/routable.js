var 	mongoose = require('mongoose'),
		//ApiController,// can only load later
		PermissionController,// can only load later
		Route; // can only load later

var requireControllers = function(req){
	if(!PermissionController){
		PermissionController = req.app.locals.controllers.auth.permissionController;
	}
	if(!Route){
		Route = mongoose.model('Route');
	}
};

/**
 * Shortcut for creating an error json
 * @param message
 * @returns {{message: (*|string)}}
 * @constructor
 */
var Error = function(message) {
	var err = message || "Unknown Error";
	return {
		message: err
	}
};

/**
 * Shortcut to return an enveloped response
 * @param res
 */
var reply = function(res) {
	res.json(res.response);
};

/**
 * Ensures the creation of a route along side the routable model
 * @param req
 * @param res
 * @constructor
 */
exports.POST = function(req, res) {
	requireControllers(req);
	if(mongoose.modelNames().indexOf(res.response.request.model) < 0) {//if this model doesn't exist
		res.response.error.push(Error(res.response.request.model + " not a Model"));
	}
	if(res.response.error.length <= 0){
		var objType = mongoose.model(res.response.request.model);
		var obj = new objType(res.response.request.data);
		//TODO allow controller checks first
		PermissionController.hasAccess(req.user, obj, [PermissionController.access.create], function(bool){//TODO maybe it should sue objType to avoid the user data first
			if(!bool){//if no permissions
				res.response.error.push(Error("Do not have Create Permission"));
			}
			if(res.response.error.length <= 0){
				var url;
				if(res.response.request.data.url){
					url = req.body.url;//can add additional field "url"
					if(url.charAt(0) != '/'){//make sure url starts with /
						url = '/'+url;
					}
				}
				Route.findOne({url: url}, function(err, routesearch) {
					if(routesearch) {res.response.error.push(Error("Url already exists"));}
					if(err) {res.response.error.push(Error("Error Checking Url"));}
					if(res.response.error.length <= 0){
						var route = new Route({
							url: url,
							routableType: obj.constructor.modelName,
							object: obj._id
						});
						obj.route = route._id;
						obj.save(function(err) {
							if(err) {res.response.error.push(Error("Error Creating Routable"));}
							if(res.response.error.length <= 0){
								route.save(function (err) {
									if (err) {
										obj.remove(function(err) {
											if(err) {res.response.error.push(Error("Error Creating Route, Couldn't remove invalid Routable"));}
											else {res.response.error.push(Error("Error Creating Route, Routable deleted"));}
											reply(res);
										});
									}
									else{//all good
										res.response.data = obj;
										res.response.success = true;
										reply(res);
									}
								});
							} else {reply(res);}
						});
					} else {reply(res);}
				});
			} else {reply(res);}
		});
	} else{reply(res);}
};

//TODO does routable PUT edit the route?

//DELETE is handled by Model events