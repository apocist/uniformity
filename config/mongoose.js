var 	config = require('./config'),
		mongoose = require('mongoose'),
		autoIncrement = require('mongoose-auto-increment'),
		dir = require('../app/libs/node-dir-extend');

module.exports = function(pluginManager, callback) {
	var db = mongoose.connect(config.db);
	autoIncrement.initialize(db);

	//models are loaded by parent directories first
	//the required models need to be in a parent folder in order to be loaded first
	dir.files(__dirname+'/../app/models/', function(err, files) {
		if (err) throw err;
		console.log('Models:');
		console.log(files);
		for(var filenNum in files) {
			if(files.hasOwnProperty(filenNum)){
				require(files[filenNum]);
			}
		}
		callback(db);
	});
};