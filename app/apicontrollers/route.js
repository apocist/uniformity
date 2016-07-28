var 	mongoose = require('mongoose'),
		Route, // can only load later
		ApiController;

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
 * fetches routable object based on url
 * @param req
 * @param res
 * @constructor
 */
exports.getRoutableByUrl = function(req, res) {
	if(!ApiController){
		ApiController = req.app.locals.controllers.apiController;
	}
	if(!Route){
		Route = mongoose.model('Route');
	}
	
	res.response.request.dataUrl = req.headers.url || req.headers.id || req.query.url || req.body.url || null;
	if(!res.response.request.dataUrl) {
		res.response.error.push(Error("No URL provided"));
	}
	if(res.response.error.length <= 0){
		if(res.response.request.dataUrl.charAt(0) != '/'){//if url doesn't have /, add it
			res.response.request.dataUrl = '/'+res.response.request.dataUrl
		}
		Route.findOne({url: res.response.request.dataUrl}, function(err, route) {
			if (err) {res.response.error.push(Error(err));}
			if (route == null) {
				res.response.success = true;
				reply(res);
			} else if(res.response.error.length <= 0) {
				res.response.request.model = route.routableType;
				res.response.request.id = route.object;
				if (mongoose.modelNames().indexOf(res.response.request.model) < 0) {//if this model doesn't exist
					res.response.error.push(Error(res.response.request.model + " not a Model"));
				}
				if (res.response.error.length <= 0) {
					var objModel = mongoose.model(route.routableType);
					if (objModel.apicontroller && objModel.apicontroller.getObjById) {//the getObjById function(as it should now have an id)
						objModel.apicontroller.getObjById(req, res);
					} else {
						ApiController.getObjById(req, res);
					}
				} else {reply(res);}
			} else {reply(res);}
		});
	} else{reply(res);}
};