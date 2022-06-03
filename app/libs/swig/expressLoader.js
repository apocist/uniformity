/*!
 * Swig template loader
 * Reused and Modified code from expressjs
 * For use to allow similar template file path resolving within the swig template engine
 * Modified 'Apocist' under LGPL-2.1
 *
 *
 * express - lib/view.js
 * https://github.com/expressjs/express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

var path = require('path');
var fs = require('fs');

/**
 * Module variables.
 * @private
 */

var dirname = path.dirname;
var basename = path.basename;
//var extname = path.extname;
var join = path.join;
var resolve = path.resolve;


/**
 * Loads templates from the file system based on expressjs's known logic.
 * @example
 * swig.setDefaults({ loader: expressLoader(['./app/views','./app/templates']) });
 * @param {array}   [views=[]]   Required paths to templates folders
 * @param {string}   [ext='swig']   Template file name extensions
 * @param {string}   [encoding='utf8']   Template encoding
 */
module.exports = function (views, ext, encoding) {
	var ret = {};

	views = views || [];
	ext = ext || 'swig';
	encoding = encoding || 'utf8';
	//basepath = (basepath) ? path.normalize(basepath) : null;

	/**
	 * Resolves <var>to</var> to a path or unique identifier. This is used for building correct, normalized, and absolute paths to a given template.
	 * @alias resolve
	 * @param  {string} to        file name identifier or pathname to a file.
	 * @param  {string} [from]    Not used
	 * @return {string}
	 */
	ret.resolve = function (to, from) {
		return ret.lookup(to);
	};

	/**
	 * Loads a single template. Given a unique <var>identifier</var> found by the <var>resolve</var> method this should return the given template.
	 * @alias load
	 * @param  {string}   identifier  Unique identifier of a template (possibly an absolute path).
	 * @param  {function} [cb]        Asynchronous callback function. If not provided, this method should run synchronously.
	 * @return {string}               Template source string.
	 */
	ret.load = function (identifier, cb) {
		if (!fs || (cb && !fs.readFile) || !fs.readFileSync) {
			throw new Error('Unable to find file ' + identifier + ' because there is no filesystem to read from.');
		}

		identifier = ret.resolve(identifier);

		if (cb) {
			fs.readFile(identifier, encoding, cb);
			return;
		}
		return fs.readFileSync(identifier, encoding);
	};

	/**
	 * Lookup view by the given `name`
	 *
	 * @param {string} name
	 */
	ret.lookup = function lookup(name) {
		var path;
		var roots = [].concat(views);

		for (var i = 0; i < roots.length && !path; i++) {
			var root = roots[i];

			// resolve the path
			var loc = resolve(root, name);
			var dir = dirname(loc);
			var file = basename(loc);

			// resolve the file
			path = ret.resolvePath(dir, file);
		}

		return path;
	};

	/**
	 * Resolve the file within the given directory.
	 *
	 * @param {string} dir
	 * @param {string} file
	 * @private
	 */
	ret.resolvePath = function resolvePath(dir, file) {

		// <path>.<ext>
		var path = join(dir, file);
		var stat = tryStat(path);

		if (stat && stat.isFile()) {
			return path;
		}

		// <path>/index.<ext>
		path = join(dir, basename(file, ext), 'index' + ext);
		stat = tryStat(path);

		if (stat && stat.isFile()) {
			return path;
		}
	};


	return ret;
};


/**
 * Return a stat, maybe.
 *
 * @param {string} path
 * @return {fs.Stats}
 * @private
 */
function tryStat(path) {

	try {
		return fs.statSync(path);
	} catch (e) {
		return undefined;
	}
}
