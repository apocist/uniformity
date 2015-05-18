var mongoose = require('mongoose'),
	Route = mongoose.model('Route');

//creates a routable object
exports.create = function(req, res, next) {
	if(req.body.type){//Type is case sensitive
		if(mongoose.modelNames().indexOf(req.body.type) >= 0){//if this model type exists
			var objType = mongoose.model(req.body.type);
			var obj = new objType(req.body);
			if (obj.schema.statics.routable) {//makes sure this is a routable obj
				var url;
				if(req.body.url){
					url = req.body.url;//can add additonal field "url"
					if(url.charAt(0) != '/'){//make sure url starts with /
						url = '/'+url;
					}
				}
				
				Route.findOne({
						url: url
					}, 
					function(err, routsearch) {
						if (err) {return next(err);}
						else if(routsearch){return next();}//TODO error (url already exists)
						else{//no url exists, go ahead and make it
							obj.save(function(err) {
								if (err) {
									return next(err);
								}
								else {
									var route = new Route({
										_id: obj.hid,
										url: url,
										type: obj.constructor.modelName,
										object: obj._id
									});
									route.save(function (err) {
										if (err) {
											return next(err);//TODO remove the new page
										}
										else{
											res.json(obj);
										}
									});
								}
							});
						}
					}
				);
			}else{next();}//TODO error (Type not routable)
		}else{next();}//TODO error (non-existant type)
	}else{next();}//TODO error (no type)
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
