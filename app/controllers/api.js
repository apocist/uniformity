var 	mongoose = require('mongoose'),
		Route = mongoose.model('Route'),
		PermissionController = require('./auth/permission');
//maybe handle with pre and post hooks
//TODO should be an array of errors

exports.wildcard = function(req, res) {
	console.log('wildcard');
	res.response = {
		request: {
			url: req.originalUrl,
			method: req.method,
			action: req.headers.action || req.params.action || req.method,
			model: req.headers.model || req.params.model || null,
			_id: req.headers._id || req.params._id || req.body._id || null,
			hid: req.headers.hid || req.params.hid || null,
			//headers: req.headers,
			params: req.params,
			data: req.body
		},
		data: {},
		error: {}
	};
	if(res.response.request.model){
		if(mongoose.modelNames().indexOf(res.response.request.model) >= 0) {
			console.log(res.response.request.model + ' model exists');
			var objModel = mongoose.model(res.response.request.model);
			if(objModel.apicontroller){
				if(!req.app.locals.apicontrollers[objModel.apicontroller]){
					req.app.locals.apicontrollers[objModel.apicontroller] = require('./api/'+objModel.apicontroller);
				}
			}

		}
	}
	if(req.app.locals.apicontrollers[objModel.apicontroller] && req.app.locals.apicontrollers[objModel.apicontroller][res.response.request.action]){
		req.app.locals.apicontrollers[objModel.apicontroller][res.response.request.action](req, res);
	} else if(exports[res.response.request.action]){
		exports[res.response.request.action](req, res);
	} else {
		res.response.error = res.response.request.action + " action does not exist";
		res.json(res.response);
	}
};

//TODO prepare a create api call
/**
 * creates a routable object
 * @param req.params.model Model Name
 * @param req.body
 * {
 *  (all properties of model)
 * }
 * @param res
 */
/*exports.POST = function(req, res) {
	console.log('default POST');
	if(mongoose.modelNames().indexOf(req.params.model) >= 0){//if this model model exists
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
};*/

/**
 * Outputs a single routable
 * @param req.params.model Model Name
 * @param req.params.hid Routable ID
 * @param res
 */
exports.GET = function(req, res) {//req, res, next, err, route) {
	if(res.response.request.hid) {//Type is case sensitive
		exports.getObjByHid(req, res);
	} else {
		exports.listBySubType(req, res);
	}
};

/**
 * updates a routable object
 * @param req.params.model Model Name
 * @param req.body
 * {
 *  hid,
 *  (all properties of model)
 * }
 * @param res
 **/
exports.PUT = function(req, res) {//TODO allow either _id or hid?
	if(res.response.request._id){
		if(mongoose.modelNames().indexOf(res.response.request.model) >= 0){//if this model exists
			var objModel = mongoose.model(res.response.request.model);
			var obj = new objModel(res.response.request.data);
			//TODO allow controller checks first
			PermissionController.hasAccess(req.user, objModel, [PermissionController.access.updateAll], function(bool){//TODO realizing that this is only checking the permissions of the model schema and not the object....need to find first
				if(bool) {
					objModel.findByIdAndUpdate(res.response.request._id, obj, function(err) {
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
 * @param req.params.model Model Name
 * @param req.body
 * {
 *  hid,
 * }
 * @param res
 */
exports.DELETE = function(req, res) {//TODO allow either _id or hid
	if(res.response.request.hid){
		if(mongoose.modelNames().indexOf(res.response.request.model) >= 0){
			var objModel = mongoose.model(res.response.request.model);
			//TODO allow controller checks first
			PermissionController.hasAccess(req.user, objModel, [PermissionController.access.deleteAll], function(bool){//TODO realizing that this is only checking the permissions of the model schema and not the object....need to find first
				if(bool) {
					objModel.findOneAndRemove({hid :res.response.request.hid}, function(err) {
						if (err) {res.json({error: err}); res.json(res.response);}
						else{
							res.response.data.success = true;
							res.json(res.response);
						}
					});
				} else {res.response.error = "Do not have Delete Permission"; res.json(res.response);}
			});
		}else{res.response.error = res.response.request.model + " not a Model"; res.json(res.response);}
	}else{res.response.error = "No HID specified"; res.json(res.response);}
};

/**
 * Outputs all routables of certain Model
 * @param req.params.model Model Name
 * @param res
 */
exports.listBySubType = function(req, res) {//TODO allow either _id or hid
	//FIXME very dangerous as it gives all data for any model at the moment(no permissions)
	if(mongoose.modelNames().indexOf(res.response.request.model) >= 0){//if this model subType exists
		var objType = mongoose.model(res.response.request.model);
		objType.find({}, function(err, objs) {
			if(err) {res.response.error = err; res.json(res.response);}
			else {res.response.data = objs; res.json(res.response);}
		});
	}else{res.response.error = res.response.request.model+" is not a Model"; res.json(res.response);}
};

/**
 * Outputs a single routable
 * @param req.params.model Model Name
 * @param req.params.hid Routable ID
 * @param res
 */
exports.getObjByHid = function(req, res) {//TODO allow either _id or hid
	if(mongoose.modelNames().indexOf(res.response.request.model) >= 0){
		var objModel = mongoose.model(res.response.request.model);
		if (objModel.schema.statics.routable) {//makes sure this is a routable obj
			//TODO allow controller checks first
			PermissionController.hasAccess(req.user, objModel, [PermissionController.access.readAll], function(bool){//TODO realizing that this is only checking the permissions of the model schema and not the object....need to find first
				if(bool) {
					objModel.findOne({hid: res.response.request.hid}, function (err, objData) {
						if (err) {res.response.error = err;res.json(res.response);}
						else{
							res.response.data = objData;
							res.json(res.response);
						}
					});
				} else {res.response.error = "Do not have Read Permission";res.json(res.response);}
			});
		}else{res.response.error = res.response.request.model + " not routable";res.json(res.response);}
	}else{res.response.error = res.response.request.model + " not a Model";res.json(res.response);}
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