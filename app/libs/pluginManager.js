var 	fs = require('fs'),
		path = './config/pluginList.js',
		pluginList = null,//the list of plugins to save (array of strings)
		pluginData = {},//the plugins have been loaded and processed for use
		pluginOrder = {};
		/*
		{
			model.postRoutable: [
				{
					order: 2000,
					item: 'bbddgdgd/fsafsdfsd//app/models/routable/blog.routable.server.model.js'
				},
				{

				}
			],
			view.postSite : []
		}
		*/

/**
 * A custom Plugin Manager based on the concepts from PoliteJS/polite-plugin-manager
 * @returns {{load: pluginManager.load, process: pluginManager.process, get: pluginManager.get, save: pluginManager.save, addPlugin: pluginManager.addPlugin, removePlugin: pluginManager.removePlugin, hasPlugin: pluginManager.hasPlugin}}
 */
module.exports = {
		/**
		 * Require each known plugin and gather it's needed information
		 * @param callback (optional)
		 */
		process: function(callback) {
			var that = this;
			that.load(function(){
				pluginList.forEach(function (pluginName) {
					require(pluginName)(function(plugin){
						pluginData[pluginName] = plugin;
						if(pluginData[pluginName].hasOwnProperty('loadOrder')){
							var loadOrder = pluginData[pluginName]['loadOrder'];
							for (var hook in loadOrder) {
								if (loadOrder.hasOwnProperty(hook)) {
									if(pluginOrder.hasOwnProperty(hook)){
										pluginOrder[hook].push(loadOrder[hook]);
									} else{
										pluginOrder[hook]=loadOrder[hook];
									}
								}
							}
						}
					});
				});
				that.processLoadOrder(callback);
			});
		},
		/**
		 * Sorts each plugins' hook by the order they have specified
		 * @param callback (optional)
		 */
		processLoadOrder: function(callback){
			var that = this;
			for (var hook in pluginOrder) {
				if (pluginOrder.hasOwnProperty(hook)) {
					that.sortByKey(pluginOrder[hook], 'order');
				}
			}
			if(callback) callback();
		},
		/**
		 * loads the plugin file
		 * @param callback (optional)
		 */
		load: function(callback) {
			try {
				var data = fs.readFileSync(path);

				try {
					pluginList = JSON.parse(data);
				}
				catch (err) {
					pluginList = [];
				}
			}
			catch (err) {
				pluginList = [];
			}
			if (callback) callback();
		},
		/**
		 * Saves the current pluginList to config/pluginList.js
		 * @param callback (optional)
		 */
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
		/**
		 * Returns the Plugin information. 'process' needs to have been completed first.
		 * @param pluginName
		 * @returns {*}
		 */
		getPlugin: function(pluginName) {
			if(!pluginData) pluginData = {};
			if(pluginData.hasOwnProperty(pluginName)){
				return pluginData[pluginName];
			} else {
				return null;
			}
		},
		/**
		 * Returns the load order of the specified hook. Returns Empty array if none
		 * Returns Array of Objects [{order: 0, item: 'string'}]
		 * @param hook (e.g. 'model.postRoutable')
		 */
		getLoadOrder: function(hook){
			if (pluginOrder.hasOwnProperty(hook)) {
				return pluginOrder[hook];
			} else {return [];}
		},
		/**
		 * Adds Plugin to uniformity. Will need to be 'saved' and 'processed' before it is usable.
		 * @param pluginName
		 */
		addPlugin: function(pluginName) {
			var that = this;
			if(!pluginList){
				pluginList = [];
			}
			if(!that.hasPlugin(pluginName)){
				pluginList.push(pluginName);
			}
		},
		/**
		 * Removes Plugin to uniformity. Will need to be 'saved' and 'processed' before it is usable.
		 * Does not remove the node module.
		 * @param pluginName
		 */
		removePlugin: function(pluginName) {
			if(pluginList){
				var index = pluginList.indexOf(pluginName);
				if(index  >= 0){
					pluginList.splice(index, 1);
				}
			}
		},
		/**
		 * Returns true/false if a Plugin by this name is installed.
		 * @param pluginName
		 * @returns {boolean}
		 */
		hasPlugin: function(pluginName) {
			if(!pluginList){pluginList = [];	}
			return pluginList.indexOf(pluginName) >= 0;
		},
		sortByKey: function(array, key) {
			return array.sort(function (a, b) {
				var x = a[key];
				var y = b[key];
				return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			});
		}


};


