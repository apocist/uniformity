var 	pluginList = null,//the list of plugins to save (array of strings)
		pluginData = {},//the plugins have been loaded and processed for use
		pluginOrder = {},
		config;

/**
 * A custom Plugin Manager based on the concepts from PoliteJS/polite-plugin-manager
 * @returns {{load: pluginManager.load, process: pluginManager.process, get: pluginManager.get, save: pluginManager.save, addPlugin: pluginManager.addPlugin, removePlugin: pluginManager.removePlugin, hasPlugin: pluginManager.hasPlugin}}
 */
module.exports = {
		/**
		 * Require each known plugin and gather it's needed information
		 * @param nconf
		 * @param callback (optional)
		 */
		process: function(nconf, callback) {
			var that = this;
			config = nconf;
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
						if(pluginData[pluginName].hasOwnProperty('defaults')){
							if(Object.keys(pluginData[pluginName]['defaults']).length > 0){
								//Add additional defaults
								config.add('defaults-'+pluginName , {type:'literal', store: pluginData[pluginName]['defaults'] });
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
			if(!config){
				config = require('nconf');
				config
					.env()
					.argv()
					.file('./config/config.json')//absolute -file doesn't need to exist
					.defaults(require('../../config/defaults.json'));//relative
			}
			if(config.get('pluginController:pluginList')){
				pluginList = config.get('pluginController:pluginList');
			} else{
				pluginList = [];
			}
			
			if (callback) callback();
		},
		/**
		 * Saves the current pluginList. Actually just saves the whole config file
		 * @param callback (optional)
		 */
		save: function(callback) {
			config.set('pluginController:pluginList', pluginList);
			config.save(function (err) {
				if(callback) callback(err);
			});
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


