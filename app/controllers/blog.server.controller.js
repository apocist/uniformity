exports.render = function(req, res, obj, objType, objData) {
	res.render('blog', objData);
};