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

exports.POST = function(req, res) {
	res.response.error.push(Error("User "+ res.response.request.action +" is not possible yet"));
	reply(res);
};

exports.PUT = function(req, res) {
	res.response.error.push(Error("User "+ res.response.request.action +" is not possible yet"));
	reply(res);
};

exports.DELETE = function(req, res) {
	res.response.error.push(Error("User "+ res.response.request.action +" will never be possible"));
	reply(res);
};