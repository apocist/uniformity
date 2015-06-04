var index = require('../controllers/index.server.controller');
var express = require('express');
var vhost = require('vhost');

module.exports = function(app) {
	var indexRoute = express.Router();

	indexRoute.get('/', index.render);

	app.use(vhost('*.*',indexRoute));//something.com index

};