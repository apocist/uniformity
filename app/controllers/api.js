/**
 * Maintains the base functionality when ever a route to http://domain.com/api/X/X/X is called
 */

var 	mongoose = require('mongoose'),
		Route = mongoose.model('Route'),
		PermissionController = require('./auth/permission'),
		ObjectId = mongoose.Types.ObjectId;

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

/**
 * Gateway for all routed api calls. Will determine which function to execute based on the method of action of request
 * @param req
 * @param res
 */
exports.wildcard = function(req, res) {
	res.response = {
		request: {
			url: req.originalUrl,
			method: req.method,
			action: req.headers.action || req.params.action || req.query.action || req.method,
			model: req.headers.model || req.params.model || null,
			id: req.headers.id || req.headers._id || req.params.id || req.body._id || null,
			//hid: req.headers.hid || req.params.hid || null,
			//headers: req.headers,
			//params: req.params,
			data: req.body
		},
		success: false,
		error: [],
		schema: {},
		data: {}
	};
	//Fetch the model, if one
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
 * Creates a modelled object
 * @param req
 * @param res
 * @constructor
 */
exports.POST = function(req, res) {
	if(mongoose.modelNames().indexOf(res.response.request.model) < 0) {//if this model doesn't exist
		res.response.error.push(Error(res.response.request.model + " not a Model"));
	}
	if(res.response.error.length <= 0){
		var objModel = mongoose.model(res.response.request.model);
		var obj = new objModel(res.response.request.data);
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
 * Fetches either a single object or a list of objects that are the the specified Model
 * @param req
 * @param res
 * @constructor
 */
exports.GET = function(req, res) {//req, res, next, err, route) {
	if(res.response.request.id) {//Type is case sensitive
		exports.getObjById(req, res);
	} else {
		exports.listBySubType(req, res);
	}
};

/**
 * Updates the modelled object
 * @param req
 * @param res
 * @constructor
 */
exports.PUT = function(req, res) {
	if(res.response.request.id) {
		var tempId = toObjectId(res.response.request.id);
		if(!tempId){
			res.response.error.push(Error("Invalid id provided"));
		} else {
			res.response.request.id = tempId;
		}
	} else {
		res.response.error.push(Error("No ID specified"));
	}
	if(mongoose.modelNames().indexOf(res.response.request.model) < 0) {//if this model doesn't exist
		res.response.error.push(Error(res.response.request.model + " not a Model"));
	}
	if(res.response.error.length <= 0){
		var objModel = mongoose.model(res.response.request.model);
		var obj = new objModel(res.response.request.data);
		PermissionController.hasAccess(req.user, objModel, [PermissionController.access.updateAll], function(bool){//TODO realizing that this is only checking the permissions of the model schema and not the object....need to find first
			if(!bool){//if no permissions
				res.response.error.push(Error("Do not have Update Permission"));
			}
			if(res.response.error.length <= 0){
				objModel.findByIdAndUpdate(res.response.request.id, obj, function(err) {
					if (err) {res.response.error.push(Error(err));}
					else {res.response.success = true;}//should we return the object?
					reply(res);
				});
			} else {reply(res);}
		});
	} else{reply(res);}
};

/**
 * Deletes the modelled object
 * @param req
 * @param res
 * @constructor
 */
exports.DELETE = function(req, res) {
	if(res.response.request.id) {
		var tempId = toObjectId(res.response.request.id);
		if(!tempId){
			res.response.error.push(Error("Invalid id provided"));
		} else {
			res.response.request.id = tempId;
		}
	} else {
		res.response.error.push(Error("No ID specified"));
	}
	if(mongoose.modelNames().indexOf(res.response.request.model) < 0) {//if this model doesn't exist
		res.response.error.push(Error(res.response.request.model + " not a Model"));
	}
	if(res.response.error.length <= 0){
		var objModel = mongoose.model(res.response.request.model);
		PermissionController.hasAccess(req.user, objModel, [PermissionController.access.deleteAll], function(bool){//TODO realizing that this is only checking the permissions of the model schema and not the object....need to find first
			if(!bool){//if no permissions
				res.response.error.push(Error("Do not have Delete Permission"));
			}
			if(res.response.error.length <= 0){
				objModel.findOneAndRemove({id :res.response.request.id}, function(err) {
					if (err) {res.response.error.push(Error(err));}
					else{res.response.success = true;}
					reply(res);
				});
			} else {reply(res);}
		});
	} else{reply(res);}
};

/**
 * Fetches all instances of the specified Model
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
 * Fetches the specified modelled object
 * @param req
 * @param res
 */
exports.getObjById = function(req, res) {
	if(res.response.request.id) {
		var tempId = toObjectId(res.response.request.id);
		if(!tempId){
			res.response.error.push(Error("Invalid id provided"));
		} else {
			res.response.request.id = tempId;
		}
	} else {
		res.response.error.push(Error("No ID specified"));
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
				objModel.findById(res.response.request.id, function (err, objData) {
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