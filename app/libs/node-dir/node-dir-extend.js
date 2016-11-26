var 	async = require('async'),
		dir = require('node-dir'),
		pathNode = require('path'),
		_ = require("underscore");

//Extend to provide all the functions of node-dir
_.extend(exports, dir);

_.extend(exports, {
	/**
	 * Lists paths to all files in the provided directory.
	 * Will not display the files of subdirectories
	 *
	 * WARNING: advised not to use a path containing a large number
	 * of recursive subdirectories as this does recursive dir functions
	 * @param path the absolute path to directory ( __dirname+'/api/' )
	 * @param callback array of Strings
	 */
	filesLocal: function (path, callback) {
		dir.files(path, function (err, files) {
			if (err) throw err;
			return dir.subdirs(path, function (err, subdirs) {
				if (err) throw err;
				//remove all subdir files
				async.eachSeries(subdirs, function (subdir, cb) {
					if (subdir) {
						subdir += pathNode.sep;//ensure that it only blocks files INSIDE this dir(not similar named files outside)
						files = files.filter(function (file) {
							return (file.substring(0, subdir.length) != subdir.substring(0, subdir.length-1) + '/')
						});
					}
					cb();
				}, function done(){
					callback(files);
				});
				//console.log('results:\n',files);
				
			});
		});
	}
});