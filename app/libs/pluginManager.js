var 	fs = require('fs'),
		path = '../../config/pluginList.js',
		pluginList = [],//the list of plugins to save (array of strings)
		pluginData = {};//the plugins have been loaded and processed for use
		//pluginOrder = {}

/**
 * A custom Plugin Manager based on the concepts from PoliteJS/polite-plugin-manager
 * @returns {{load: pluginManager.load, process: pluginManager.process, get: pluginManager.get, save: pluginManager.save, addPlugin: pluginManager.addPlugin, removePlugin: pluginManager.removePlugin, hasPlugin: pluginManager.hasPlugin}}
 */
exports = function(){

	var pluginManager = {
		/**
		 * loads the plugin file. Also the construct function
		 * @param callback (optional)
		 */
		load: function(callback) {
			var data = fs.readFileSync(path);

			try {
				pluginList = JSON.parse(data);
				if(callback) callback(pluginList);
			}
			catch (err) {if(callback) callback({}, err);}
		},
		process: function(callback) {
			pluginList.forEach(function (plugin) {
				pluginData[plugin] = require(plugin);
			});
			if(callback) callback();
		},
		get: function(pluginName) {
			if(!pluginData) pluginData = {};
			if(pluginData.hasOwnProperty(pluginName)){
				return pluginData[pluginName];
			} else {
				return null;
			}
		},
		save: function(callback) {
			if(pluginList){
				var data = JSON.stringify(pluginList);

				fs.writeFile(path, data, function (err) {
					if(callback) callback(err);
				});
			} else{
				if(callback) callback();
			}
		},
		addPlugin: function(pluginName) {
			if(!pluginList){
				pluginList = [];
			}
			pluginList.push(pluginName);
		},
		removePlugin: function(pluginName) {
			if(pluginList){
				var index = pluginList.indexOf(pluginName);
				if(index  >= 0){
					pluginList.splice(index, 1);
				}
			}
		},

		hasPlugin: function(pluginName) {
			if(!pluginList){pluginList = [];	}
			return pluginList.indexOf(pluginName) >= 0;
		}
	};
	pluginManager.load();
	return pluginManager;

};


