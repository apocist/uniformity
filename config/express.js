//noinspection JSUnusedGlobalSymbols
var 	async = require('async'),
		bodyParser = require('body-parser'),
		dir = require('../app/libs/node-dir/node-dir-extend'),
		express = require('express'),
		expressSession = require('express-session'),
		passport = require('passport'),
		swig = require('swig'),
		swigExpressLoader = require('../app/libs/swig/expressLoader'),
		uuid = require('node-uuid'),
		vhost = require('vhost');//TODO may not use this unless restricting to certain domain names


/**
 *
 * @param config
 * @param pluginManager
 * @param callback
 */
module.exports = function(config, pluginManager, callback) {
    var app = express();
	app.locals.config = config;
	app.locals.pluginManager = pluginManager;
	app.locals.passport = passport;
	app.locals.controllers = {
		auth: {
			permissionController : require('../app/controllers/auth/permission.auth.server.controller'),
			userController : require('../app/controllers/auth/user.auth.server.controller')
		},
		pluginController : pluginManager
	};

	app.use(bodyParser.urlencoded({
		extended: true
	}));

	app.use(bodyParser.json());
	
	app.engine('swig', swig.renderFile);

	//Load view Templates(core and plugins)
	var views = [];
	app.locals.controllers.pluginController.getLoadOrder('view.preSite').forEach(function (plugin) {
		if(plugin.hasOwnProperty('item')){
			views.push(plugin['item']);
		}
	});
	views.push('./app/views');
	app.locals.controllers.pluginController.getLoadOrder('view.postSite').forEach(function (plugin) {
		if(plugin.hasOwnProperty('item')){
			views.push(plugin['item']);
		}
	});
	app.set('views', views);
	app.set('view engine', 'swig');

	// Swig will cache templates for you, but you can disable
	// that and use Express's caching instead, if you like:
	app.set('view cache', false);
	// To disable Swig's cache, do the following:
	swig.setDefaults({
		cache: false,
		loader:swigExpressLoader(views, 'swig')//Use custom swig template loader
	});
	// NOTE: You should always cache templates in a production environment.
	// Don't leave both of these to `false` in production!

	//separate the static folders away from admin
	app.use(vhost('*.*', express.static('./static/public')));
	/*app.use('/public', function(req, res, next) {
		if (env != 'development') {
			var result = req.url.match(/^.+\.swig$/);
			if (result) {
				return res.status(403).end('403 Forbidden')
			}
		}
		next();
	});*/
	app.use(vhost('*.*', express.static('./app/views')));

	app.use(expressSession({
		resave: false,
		saveUninitialized: false,
		secret: uuid.v4()
		//TODO need to setup a secure store 'connect-mongo'
	}));
	app.use(passport.initialize());
	app.use(passport.session());


	//TODO pass plugin manager
	// Initialize Passport
	require('../app/controllers/auth.server.controller.js')(app);


	//Includes all the files found directly in /app/routes , none in sub directories
	dir.filesLocal(__dirname+'/../app/routes/',function(routes){
		console.log('Routes:\n',routes);
		/*for(var route in routes) {
			require(routes[route])(app, passport);
		}*/
		async.each(routes, function(route, next){
			require(route)(app, next);
		}, function(){
			callback(app);
		});

	});
};