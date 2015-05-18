var mongoose = require('mongoose');
	Route = mongoose.model('Route');

exports.error404 = function(req, res) {
	res.status(404);

	// respond with html page
	if (req.accepts('html')) {
		var template_data = {
			url: req.url
		}

		res.render('404', template_data);
		return;
	}

	// respond with json
	if (req.accepts('json')) {
		res.send({ error: 'Not found' });
		return;
	}

	// default to plain-text. send()
	res.type('txt').send('Not found');
};

exports.read = function(req, res) {
	console.log('parsing: ');
	res.json(req.page);
};

exports.routeByURL = function(req, res, next){
	var url = req.params[0];
	Route.findOne({
			url: url
		}, 
		function(err, route) {
			exports.getObj(req, res, next, err, route);
		}
	);
};

exports.routeByID = function(req, res, next) {
	var url = req.params[0];
	if(url.charAt(0) == '/'){//if url has / remove it
		url = url.substring(1);
	}
	if(!isNaN(url)){
		Route.findOne({
				_id: url
			}, 
			function(err, route) {
				exports.getObj(req, res, next, err, route);
			}
		);
	}else{next();}
};

exports.getObj = function(req, res, next, err, route) {
	if (!err && route) {
		var objType = route.type;
		var id = route.object;
		
		if(mongoose.modelNames().indexOf(objType) >= 0){
			var obj = mongoose.model(objType);
			obj.findOne({
					_id: id
				}, 
				function(err, objData) {
					if (!err && objData) {
						require('./'+obj.controller).render(req, res, obj, objType, objData);
					}
					else{return next(err);}
				}
			);
		}else{return next();}
	}
	else{return next(err);}
}