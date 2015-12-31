// FIXME Deprecated
var routable = require('routable.server.controller.js');

exports.render = function(req, res) {
	res.render('admin', {
		title: 'Uniformity Control Panel',
		formSchema: JSON.stringify(routable.getRoutableModelSchemas())
	});
};