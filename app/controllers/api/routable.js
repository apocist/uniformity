var 	mongoose = require('mongoose'),
		Route = mongoose.model('Route'),
		PermissionController = require('../auth/permission');

exports.POST = function(req, res) {
	if(mongoose.modelNames().indexOf(req.params.model) >= 0){//if this model subType exists
		var objType = mongoose.model(req.params.model);
		var obj = new objType(req.body);
		if (obj.schema.statics.routable) {//makes sure this is a routable obj
			//TODO allow controller checks first
			PermissionController.hasAccess(req.user, obj, [PermissionController.access.create], function(bool){//TODO maybe it should sue objType to avoid the user data first
				if(bool) {
					var url;
					if(req.body.url){
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
		}else{res.json({error: "Type not routable"});}
	}else{res.json({error: "Type is not a Model"});}
};