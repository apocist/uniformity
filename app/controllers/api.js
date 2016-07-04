var 	mongoose = require('mongoose'),
		Route = mongoose.model('Route'),
		PermissionController = require('./auth/permission');
//maybe handle with pre and post hooks
//TODO should be an array of errors

//TODO prepare a create api call
/**
 * creates a routable object
 * @param req.params.subType Model Name
 * @param req.body
 * {
 *  (all properties of model)
 * }
 * @param res
 */
/*exports.create = function(req, res) {
	if(mongoose.modelNames().indexOf(req.params.subType) >= 0){//if this model subType exists
		var objType = mongoose.model(req.params.subType);
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
};*/


exports.wildcard = function(req, res) {
	console.log('wildcard');
	res.response = {
		echo: {
			url: req.originalUrl,
			method: req.method,
			action: req.headers.action || req.params.action || req.method,
			model: req.headers.model || req.params.subType,
			_id: req.headers._id || req.params._id || req.body._id,
			hid: req.headers.hid || req.params.hid,
			//headers: req.headers,
			params: req.params,
			data: req.body
		},
		data: {},
		error: {}
	};
	if(exports[res.response.echo.action]){
		exports[res.response.echo.action](req, res);
	} else {
		res.response.error = res.response.echo.action + " action does not exist";
		res.json(res.response);
	}
};

/**
 * Outputs a single routable
 * @param req.params.subType Model Name
 * @param req.params.hid Routable ID
 * @param res
 */
exports.GET = function(req, res) {//req, res, next, err, route) {
	if(res.response.echo.hid) {//Type is case sensitive
		exports.getObjByHid(req, res);
	} else {
		exports.listBySubType(req, res);
	}
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
exports.PUT = function(req, res) {//TODO allow either _id or hid?
	if(res.response.echo._id){
		if(mongoose.modelNames().indexOf(res.response.echo.model) >= 0){//if this model exists
			var objModel = mongoose.model(res.response.echo.model);
			var obj = new objModel(res.response.echo.data);
			//TODO allow controller checks first
			PermissionController.hasAccess(req.user, objModel, [PermissionController.access.updateAll], function(bool){//TODO realizing that this is only checking the permissions of the model schema and not the object....need to find first
				if(bool) {
					objModel.findByIdAndUpdate(res.response.echo._id, obj, function(err) {
						if (err) {res.response.error = err; res.json(res.response);}
						else {res.response.data.success = true; res.json(res.response);}
					});
				} else {res.response.error = "Do not have Update Permission"; res.json(res.response);}
			});
		}else{res.response.error = "Type is not a Model"; res.json(res.response);}
	}else{res.response.error = "No ID specified"; res.json(res.response);}
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
exports.DELETE = function(req, res) {//TODO allow either _id or hid
	if(res.response.echo.hid){
		if(mongoose.modelNames().indexOf(res.response.echo.model) >= 0){
			var objModel = mongoose.model(res.response.echo.model);
			//TODO allow controller checks first
			PermissionController.hasAccess(req.user, objModel, [PermissionController.access.deleteAll], function(bool){//TODO realizing that this is only checking the permissions of the model schema and not the object....need to find first
				if(bool) {
					objModel.findOneAndRemove({hid :res.response.echo.hid}, function(err) {
						if (err) {res.json({error: err}); res.json(res.response);}
						else{
							res.response.data.success = true;
							res.json(res.response);
						}
					});
				} else {res.response.error = "Do not have Delete Permission"; res.json(res.response);}
			});
		}else{res.response.error = res.response.echo.model + " not a Model"; res.json(res.response);}
	}else{res.response.error = "No HID specified"; res.json(res.response);}
};

/**
 * Outputs all routables of certain Model
 * @param req.params.subType Model Name
 * @param res
 */
exports.listBySubType = function(req, res) {//TODO allow either _id or hid
	//FIXME very dangerous as it gives all data for any model at the moment(no permissions)
	if(mongoose.modelNames().indexOf(res.response.echo.model) >= 0){//if this model subType exists
		var objType = mongoose.model(res.response.echo.model);
		objType.find({}, function(err, objs) {
			if(err) {res.response.error = err; res.json(res.response);}
			else {res.response.data = objs; res.json(res.response);}
		});
	}else{res.response.error = res.response.echo.model+" is not a Model"; res.json(res.response);}
};

/**
 * Outputs a single routable
 * @param req.params.subType Model Name
 * @param req.params.hid Routable ID
 * @param res
 */
exports.getObjByHid = function(req, res) {//TODO allow either _id or hid
	if(mongoose.modelNames().indexOf(res.response.echo.model) >= 0){
		var objModel = mongoose.model(res.response.echo.model);
		if (objModel.schema.statics.routable) {//makes sure this is a routable obj
			//TODO allow controller checks first
			PermissionController.hasAccess(req.user, objModel, [PermissionController.access.readAll], function(bool){//TODO realizing that this is only checking the permissions of the model schema and not the object....need to find first
				if(bool) {
					objModel.findOne({hid: res.response.echo.hid}, function (err, objData) {
						if (err) {res.response.error = err;res.json(res.response);}
						else{
							res.response.data = objData;
							res.json(res.response);
						}
					});
				} else {res.response.error = "Do not have Read Permission";res.json(res.response);}
			});
		}else{res.response.error = res.response.echo.model + " not routable";res.json(res.response);}
	}else{res.response.error = res.response.echo.model + " not a Model";res.json(res.response);}
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