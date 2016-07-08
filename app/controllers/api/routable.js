var 	mongoose = require('mongoose'),
		Route, // can only load later
		PermissionController;// can only load later

/**
 * Ensures the creation of a route along side the routable model
 * @param req
 * @param res
 * @constructor
 */
exports.POST = function(req, res) {
	if(!PermissionController){
		PermissionController = req.app.locals.controllers.auth.permissionController;
	}
	if(!Route){
		Route = mongoose.model('Route');
	}
	if(mongoose.modelNames().indexOf(res.response.request.model) >= 0){//if this model subType exists
		var objType = mongoose.model(res.response.request.model);
		var obj = new objType(res.response.request.data);
		if (obj.schema.statics.routable) {//makes sure this is a routable obj
			//TODO allow controller checks first
			PermissionController.hasAccess(req.user, obj, [PermissionController.access.create], function(bool){//TODO maybe it should sue objType to avoid the user data first
				if(bool) {
					var url;
					if(res.response.request.data.url){
						url = req.body.url;//can add additional field "url"
						if(url.charAt(0) != '/'){//make sure url starts with /
							url = '/'+url;
						}
					}
					Route.findOne({url: url}, function(err, routsearch) {
						if(err) {res.json({error: "Error Checking Url"});}
						else if(routsearch) {res.json({error: "Url already exists"});}
						else {//no url exists, go ahead and make it
							var route = new Route({
								url: url,
								routableType: obj.constructor.modelName,
								object: obj._id
							});
							obj.route = route._id;
							obj.save(function(err) {
								if (err) {res.json({error: "Error Creating Routable"});}
								else {
									route.hid = obj.hid;
									route.save(function (err) {
										if (err) {
											obj.remove(function(err) {
												if (err) {res.json({error: "Error Creating Route, Couldn't remove errored Routable"});}
												else {res.json({error: "Error Creating Route"});}
											});
										}
										else{//all good
											res.json(obj);
										}
									});
								}
							});
						}
					});
				} else {res.json({error: "Do not have Create Permission"});}
			});
		}else{res.json({error:res.response.request.model + " not routable"});}
	}else{res.json({error: res.response.request.model + " not a Model"});}
};

//DELETE is handled by Model events