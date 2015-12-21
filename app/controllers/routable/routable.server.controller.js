var mongoose = require('mongoose'),
	Route = mongoose.model('Route');
//maybe handle with pre and post hooks

/**
 * creates a routable object
 * @param req.params.subType Model Name
 * @param req.body
 * {
 *  (all properties of model)
 * }
 * @param res
 */
exports.create = function(req, res) {
	if(mongoose.modelNames().indexOf(req.params.subType) >= 0){//if this model subType exists
		var objType = mongoose.model(req.params.subType);
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
							routableType: obj.constructor.modelName,
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
};

/**
 * updates a routable object
 * @param req.params.subType Model Name
 * @param req.body
 * {
 *  hid,
 *  (all properties of model)
 * }
 * @param res
**/
exports.update = function(req, res) {
	if(req.body._id){//Type is case sensitive
		if(mongoose.modelNames().indexOf(req.params.subType) >= 0){//if this model subType exists
			var objModel = mongoose.model(req.params.subType);
			var obj = new objModel(req.body);
			if (obj.schema.statics.routable) {//makes sure this is a routable obj
				objModel.findByIdAndUpdate(obj._id, obj, function(err) {
						if (err) {res.json({error: err});}//Error Creating Route, Couldn't remove page"});}
						else {res.json({success: true});}
					}
				);
			}else{res.json({error: "Type not routable"});}
		}else{res.json({error: "Type is not a Model"});}
	}else{res.json({error: "No ID specified"});}
};

/**
 * Deletes Routables and route and JSON returns results
 * @param req.params.subType Model Name
 * @param req.body
 * {
 *  hid,
 * }
 * @param res
 */
exports.remove = function(req, res) {
	if(req.body.hid){//Type is case sensitive
		if(mongoose.modelNames().indexOf(req.params.subType) >= 0){
			var objModel = mongoose.model(req.params.subType);
			if (objModel.schema.statics.routable) {//makes sure this is a routable obj
				objModel.findOneAndRemove({
						hid :req.body.hid
					},
					function(err) {
						if (err) {res.json({error: err});}
						else{
							res.json({success: true});
						}
					}
				);
			}else{res.json({error: "Type not routable"});}
		}else{res.json({error: "Type not a Model"});}
	}else{res.json({error: "No HID specified"});}
};

/**
 * Outputs all routables of certain Model
 * @param req.params.subType Model Name
 * @param res
 */
exports.listBySubType = function(req, res) {
	if(mongoose.modelNames().indexOf(req.params.subType) >= 0){//if this model subType exists
		var objType = mongoose.model(req.params.subType);
		objType.find({}, function(err, objs) {
			if(err) {res.json({error: err});}
			else {res.json(objs);}
		});
	}else{res.json({error: req.params.obj+" is not a Model"});}
};

/**
 * Outputs a single routable
 * @param req.params.subType Model Name
 * @param req.params.hid Routable ID
 * @param res
 */
exports.getObjByHid = function(req, res) {//req, res, next, err, route) {
	if(mongoose.modelNames().indexOf(req.params.subType) >= 0){
		var objModel = mongoose.model(req.params.subType);
		if (objModel.schema.statics.routable) {//makes sure this is a routable obj
			objModel.findOne({
					hid: req.params.hid
				},
				function (err, objData) {
					if (err) {res.json({error: err});}
					else{
						res.json(objData);
					}
				}
			);
		}else{res.json({error: "Type not routable"});}
	}else{res.json({error: "Type not a Model"});}
};

/**
 * Outputs all Routable Models' modelSchema and formSchema
 * @return object
 */
exports.getRoutableModelSchemas = function() {//TODO make this an api call
	var uuid = require('node-uuid');
	var standardProperties = mongoose.model('Routable').schema.statics.formschema;
	var modelSchemas = {};
	for(var key in mongoose.models) {
		if (mongoose.models.hasOwnProperty(key)) {
			if(mongoose.models[key].schema.statics.routable && mongoose.models[key].modelName != 'Routable'){
				var routeSchema = JSON.parse(JSON.stringify(standardProperties));//Clone object
				for (var property in mongoose.models[key].schema.statics.formschema) {//Combine schemas
					if (mongoose.models[key].schema.statics.formschema.hasOwnProperty(property)) {
						routeSchema[property] = mongoose.models[key].schema.statics.formschema[property];
					}
				}
				Object.defineProperty(modelSchemas, mongoose.models[key].modelName, {
					value: {
						modelName: mongoose.models[key].modelName,
						modelInstance: uuid.v4(),
						objectType: 'modelSchema',
						formSchema: routeSchema
					},
					writable: true,
					enumerable: true,
					configurable: true
				});
			}
		}
	}
	return modelSchemas;
};