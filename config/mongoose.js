var 	async = require('async'),
		//config = require('./config'),
		mongoose = require('mongoose'),
		autoIncrement = require('mongoose-auto-increment'),
		dir = require('../app/libs/node-dir/node-dir-extend');

module.exports = function(config, pluginController, callback) {
	var db = mongoose.connect(config.get('ENV:db:uri'), config.get('ENV:db:options'));
	db.Promise = global.Promise;
	autoIncrement.initialize(db);

	//models are loaded by parent directories first
	//the required models need to be in a parent folder in order to be loaded first
	async.series(
		[
			function(cb) {loadModelDir('Base Models', __dirname + '/../app/models/', cb);},
			function(cb) {loadPluginLoadOrder(pluginController, 'model.preAuth', cb);},
			function(cb) {loadModelDir('Auth Models', __dirname + '/../app/models/auth/', cb);},
			function(cb) {loadPluginLoadOrder(pluginController, 'model.postAuth', cb);},
			function(cb) {loadPluginLoadOrder(pluginController, 'model.preRoutable', cb);},
			function(cb) {loadModelDir('Routable Models', __dirname + '/../app/models/routable/', cb);},
			function(cb) {loadPluginLoadOrder(pluginController, 'model.postRoutable', cb);}
		],
		function(){
			callback(db);
		}
	);
};

function loadPluginLoadOrder(pluginController, loadOrder, cb){
	var models = [];
	pluginController.getLoadOrder(loadOrder).forEach(function (plugin) {
		if(plugin.hasOwnProperty('item')){
			models.push(plugin['item']);
		}
	});
	if(models.length > 0){
		console.log('Plugins Model ' + loadOrder + ':');
		console.log(models);
	}
	for (var filenNum in models) {
		if (models.hasOwnProperty(filenNum)) {
			require(models[filenNum]);
		}
	}
	cb();
}

function loadModelDir(name, path, cb){
	dir.filesLocal(path, function (files) {
		console.log(name + ':');
		console.log(files);
		for (var filenNum in files) {
			if (files.hasOwnProperty(filenNum)) {
				require(files[filenNum]);
			}
		}
		cb();
	});
}