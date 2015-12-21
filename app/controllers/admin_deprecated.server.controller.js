// FIXME Deprecated
var routable = require('../controllers/routable/routable.server.controller');

exports.render = function(req, res) {
    res.render('admin', {
    	title: 'Uniformity Control Panel',
	    formSchema: JSON.stringify(routable.getRoutableModelSchemas())
    });
};