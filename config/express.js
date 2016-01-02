//noinspection JSUnusedGlobalSymbols
var	bodyParser = require('body-parser'),
		config = require('./config'),
		dir = require('../app/libs/node-dir-extend'),
		express = require('express'),
		expressSession = require('express-session'),
		passport = require('passport'),
		swig = require('swig'),
		uuid = require('node-uuid'),
		vhost = require('vhost');//TODO may not use this unless restricting to certain domain names


	
module.exports = function(callback) {
    var app = express();

	app.use(bodyParser.urlencoded({
		extended: true
	}));

	app.use(bodyParser.json());
	
	app.engine('swig', swig.renderFile);
	
    app.set('views', './app/views');
	app.set('view engine', 'swig');

	// Swig will cache templates for you, but you can disable
	// that and use Express's caching instead, if you like:
	app.set('view cache', false);
	// To disable Swig's cache, do the following:
	swig.setDefaults({ cache: false });
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


	// Initialize Passport
	require('../app/controllers/auth.server.controller.js')(passport);


	//Includes all the files found directly in /app/routes , none in sub directories
	dir.filesLocal(__dirname+'/../app/routes/',function(routes){
		console.log('Routes:\n',routes);
		for(var route in routes) {
			require(routes[route])(app, passport);
		}
		callback(app);
	});
};