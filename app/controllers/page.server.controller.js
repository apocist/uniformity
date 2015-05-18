exports.render = function(req, res, obj, objType, objData) {
	res.render('page', objData);
};