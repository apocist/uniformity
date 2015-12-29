//noinspection JSUnusedGlobalSymbols
var config = require('./config'),
	express = require('express'),
	bodyParser = require('body-parser'),
	swig = require('swig'),
	vhost = require('vhost'),//TODO may not use this unless restricting to certain domain names
	passport = require('passport'),
	expressSession = require('express-session'),
	uuid = require('node-uuid');


	
module.exports = function() {
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
	require('../app/controllers/auth/auth.server.controller.js')(passport);

	require('../app/routes/auth.server.routes.js')(app, passport);
	require('../app/routes/api.server.routes.js')(app, passport);
	require('../app/routes/main.server.routes.js')(app);

    return app;
};