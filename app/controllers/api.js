var 	mongoose = require('mongoose'),
		Route = mongoose.model('Route'),
		PermissionController = require('./auth/permission');
//maybe handle with pre and post hooks
//TODO should be an array of errors

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
 * Shortcut as it's used so often
 * @param res
 */
var reply = function(res) {
	res.json(res.response);
};

exports.wildcard = function(req, res) {
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
		success: false,
		error: [],
		data: {}
	};
	if(res.response.request.model){
		if(mongoose.modelNames().indexOf(res.response.request.model) >= 0) {
			var objModel = mongoose.model(res.response.request.model);
		}
	}
	if(objModel && objModel.apicontroller && objModel.apicontroller[res.response.request.action]){
		objModel.apicontroller[res.response.request.action](req, res);
	} else if(exports[res.response.request.action]){
		exports[res.response.request.action](req, res);
	} else {
		res.response.error.push({message: res.response.request.action + " action does not exist"});
		reply(res);
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
exports.POST = function(req, res) {//TODO allow either _id or hid?
	if(mongoose.modelNames().indexOf(res.response.request.model) < 0) {//if this model doesn't exist
		res.response.error.push(Error(res.response.request.model + " not a Model"));
	}
	if(res.response.error.length <= 0){
		var objModel = mongoose.model(res.response.request.model);
		var obj = new objModel(res.response.request.data);
		//TODO allow controller checks first
		PermissionController.hasAccess(req.user, objModel, [PermissionController.access.create], function(bool){//TODO realizing that this is only checking the permissions of the model schema and not the object....need to find first
			if(!bool){//if no permissions
				res.response.error.push(Error("Do not have Create Permission"));
			}
			if(res.response.error.length <= 0){
				obj.save(function(err) {
					if (err) {res.response.error.push(Error(err));}
					else {
						res.response.data = obj;
						res.response.success = true;
					}
					reply(res);
				});
			} else {reply(res);}
		});
	} else{reply(res);}
};

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
 * @param req
 * @param res
 **/
exports.PUT = function(req, res) {//TODO allow either _id or hid
	if(!res.response.request._id) {//if no id
		res.response.error.push(Error("No ID specified"));
	}
	if(mongoose.modelNames().indexOf(res.response.request.model) < 0) {//if this model doesn't exist
		res.response.error.push(Error(res.response.request.model + " not a Model"));
	}
	if(res.response.error.length <= 0){
		var objModel = mongoose.model(res.response.request.model);
		var obj = new objModel(res.response.request.data);
		//TODO allow controller checks first
		PermissionController.hasAccess(req.user, objModel, [PermissionController.access.updateAll], function(bool){//TODO realizing that this is only checking the permissions of the model schema and not the object....need to find first
			if(!bool){//if no permissions
				res.response.error.push(Error("Do not have Update Permission"));
			}
			if(res.response.error.length <= 0){
				objModel.findByIdAndUpdate(res.response.request._id, obj, function(err) {
					if (err) {res.response.error.push(Error(err));}
					else {res.response.success = true;}//should we return the object?
					reply(res);
				});
			} else {reply(res);}
		});
	} else{reply(res);}
};

/**
 * Deletes Routables and route and JSON returns results
 * @param req
 * @param res
 */
exports.DELETE = function(req, res) {//TODO allow either _id or hid
	if(!res.response.request.hid) {//if no id
		res.response.error.push(Error("No HID specified"));
	}
	if(mongoose.modelNames().indexOf(res.response.request.model) < 0) {//if this model doesn't exist
		res.response.error.push(Error(res.response.request.model + " not a Model"));
	}
	if(res.response.error.length <= 0){
		var objModel = mongoose.model(res.response.request.model);
		//TODO allow controller checks first
		PermissionController.hasAccess(req.user, objModel, [PermissionController.access.deleteAll], function(bool){//TODO realizing that this is only checking the permissions of the model schema and not the object....need to find first
			if(!bool){//if no permissions
				res.response.error.push(Error("Do not have Delete Permission"));
			}
			if(res.response.error.length <= 0){
				objModel.findOneAndRemove({hid :res.response.request.hid}, function(err) {
					if (err) {res.response.error.push(Error(err));}
					else{res.response.success = true;}
					reply(res);
				});
			} else {reply(res);}
		});
	} else{reply(res);}
};

/**
 * Outputs all routables of certain Model
 * @param req
 * @param res
 */
exports.listBySubType = function(req, res) {
	if(mongoose.modelNames().indexOf(res.response.request.model) < 0) {//if this model doesn't exist
		res.response.error.push(Error(res.response.request.model + " not a Model"));
	}
	//FIXME very dangerous as it gives all data for any model at the moment(no permissions)
	if(res.response.error.length <= 0){
		var objType = mongoose.model(res.response.request.model);
		objType.find({}, function(err, objs) {
			if (err) {res.response.error.push(Error(err));}
			else {
				res.response.data = objs;
				res.response.success = true;
			}
			reply(res);
		});
	} else{reply(res);}
};

/**
 * Outputs a single routable
 * @param req
 * @param res
 */
exports.getObjByHid = function(req, res) {//TODO allow either _id or hid
	if(!res.response.request.hid) {//if no hid
		res.response.error.push(Error("No HID specified"));
	}
	if(mongoose.modelNames().indexOf(res.response.request.model) < 0) {//if this model doesn't exist
		res.response.error.push(Error(res.response.request.model + " not a Model"));
	}
	if(res.response.error.length <= 0){
		var objModel = mongoose.model(res.response.request.model);
		//TODO allow controller checks first
		PermissionController.hasAccess(req.user, objModel, [PermissionController.access.readAll], function(bool){//TODO realizing that this is only checking the permissions of the model schema and not the object....need to find first
			if(!bool){//if no permissions
				res.response.error.push(Error("Do not have Read Permission"));
			}
			if(res.response.error.length <= 0){
				objModel.findOne({hid: res.response.request.hid}, function (err, objData) {
					if (err) {res.response.error.push(Error(err));}
					else{
						res.response.data = objData;
						res.response.success = true;
					}
					reply(res);
				});
			} else {reply(res);}
		});
	} else{reply(res);}
};

//TODO deprecated need to move
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