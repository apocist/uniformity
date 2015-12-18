//noinspection JSUnusedGlobalSymbols
var config = require('./config'),
	express = require('express'),
	bodyParser = require('body-parser'),
	swig = require('swig'),
	vhost = require('vhost'),//TODO may not use this unless restricting to certain domain names
	passport = require('passport'),
	expressSession = require('express-session'),
	flash = require('connect-flash'),//TODO may not be using
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
	//app.use(vhost('admin.*.*', express.static('./static/admin')));
	app.use(vhost('*.*', express.static('./static/public')));

	app.use(expressSession({
		resave: false,
		saveUninitialized: false,
		secret: uuid.v4()
		//TODO need to setup a secure store 'connect-mongo'
	}));
	app.use(passport.initialize());
	app.use(passport.session());

	// Using the flash middleware provided by connect-flash to store messages in session
	// and displaying in templates
	app.use(flash());

	// Initialize Passport
	require('../app/controllers/passport/init.server.controller')(passport);

	require('../app/routes/auth.server.routes.js')(app, passport);
	require('../app/routes/api.server.routes.js')(app);
	require('../app/routes/main.server.routes.js')(app);

    return app;
};