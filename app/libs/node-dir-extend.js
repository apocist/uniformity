var 	dir = require('node-dir'),
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
				for (var subdir in subdirs) {
					subdirs[subdir] += '\\';//ensure that it only blocks files INSIDE this dir(not similar named files outside)
					files = files.filter(function (file) {
						;
						return (file.substring(0, subdirs[subdir].length) != subdirs[subdir])
					});
				}
				//console.log('results:\n',files);
				callback(files);
			});
		});
	}
});