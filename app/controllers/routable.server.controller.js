var mongoose = require('mongoose'),
	Route = mongoose.model('Route');
//maybe handle with pre and post hooks

//creates a routable object
exports.create = function(req, res) {
	if(req.body.type){//Type is case sensitive
		if(mongoose.modelNames().indexOf(req.body.type) >= 0){//if this model type exists
			var objType = mongoose.model(req.body.type);
			var obj = new objType(req.body);
			if (obj.schema.statics.routable) {//makes sure this is a routable obj
				var url;
				if(req.body.url){
					url = req.body.url;//can add additional field "url"
					if(url.charAt(0) != '/'){//make sure url starts with /
						url = '/'+url;
					}
				}
				Route.findOne({
						url: url
					}, 
					function(err, routsearch) {
						if (err) {res.json({error: "Error Checking Url"});}
						else if(routsearch){res.json({error: "Url already exists"});}
						else{//no url exists, go ahead and make it
							var route = new Route({
								url: url,
								type: obj.constructor.modelName,
								object: obj._id
							});
							obj.route = route._id;
							obj.save(function(err) {
								if (err) {res.json({error: "Error Creating Page"});}
								else {
									route.hid = obj.hid;
									route.save(function (err) {
										if (err) {
											obj.remove(function(err) {
												if (err) {res.json({error: "Error Creating Route, Couldn't remove page"});}
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
					}
				);
			}else{res.json({error: "Type not routable"});}
		}else{res.json({error: "Type is not a Model"});}
	}else{res.json({error: "No Type specified"});}
};

/**
 * Deletes Routables and route and JSON returns results
 */
exports.remove = function(req, res) {
	if(req.body.type && req.body.hid){//Type is case sensitive
		if(mongoose.modelNames().indexOf(req.body.type) >= 0){
			var objModel = mongoose.model(req.body.type);
			if (objModel.schema.statics.routable) {//makes sure this is a routable obj
				objModel
					.findOneAndRemove({hid :req.body.hid}, function(err) {
						if (err) {res.json({success: false, error: "Error Searching Obj"});}
						else{
							res.json({success: true});
						}
					});
			}else {	res.json({success: false, error: "Type not routable"});}
		}else{res.json({success: false, error: "Type not a Model"});}
	}else{res.json({success: false, error: "No HID or Type specified"});}
};

exports.list = function(req, res, next) {
	if(mongoose.modelNames().indexOf(req.params.obj) >= 0){//if this model type exists
		var objType = mongoose.model(req.params.obj);
		objType.find({}, function(err, objs) {
			if (err) {
				return next(err);
			}
			else {
				res.json(objs);
			}
		});
	}else{next();}
};

/*exports.getObjByHid = function(hid, objType, next) {//req, res, next, err, route) {
	if(mongoose.modelNames().indexOf(objType) >= 0){
		var obj = mongoose.model(objType);
		obj.findOne({
				hid :hid
			},
			function(err, objData) {
				console.log(objData);
				return next(err, objData);
			}
		);
	}else{return next();}
};*/