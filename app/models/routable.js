/*
This is a non-existant object that is only meant to be extended from
*/

var 	mongoose = require('mongoose'),
		autoIncrement = require('mongoose-auto-increment'),
		Schema = mongoose.Schema;

var RoutableSchema = new Schema({
		type: {type: String, default: 'routable', enums: ['routable']},
		name: { type : String, required : true},
		route: { type : Schema.ObjectId, ref : 'Route' },
		created : { type : Date, default : Date.now },
		modified : { type : Date, default : Date.now }
	},
	{
		collection: 'route'//this object will never exist
	}
);

//Auto populate
RoutableSchema.pre('findOne', function(next) {this.populate('route');next();});
RoutableSchema.pre('findOneAndRemove', function(next) {this.populate('route');next();});
RoutableSchema.pre('remove', function(next) {this.populate('route');next();});


//Clean up children
RoutableSchema.post('findOneAndRemove', function(results, next) {
	if(results){
		if(results.route){
			try {
				results.route.remove();//remove whenever
			}
			catch(e){}//ignore errors...probably didn't populate as if it route didn't exist
		}
	}
	next();
});
RoutableSchema.post('remove', function(results, next) {
	if(results){
		if(results.route){
			try {
				results.route.remove();//remove whenever
			}
			catch(e){}//ignore errors...probably didn't populate as if it route didn't exist
		}
	}
	next();
});

RoutableSchema.statics.formschema = {
	name: {
		title : 'Name',
		type : 'string',
		placeholder : 'Title',
		required : true
	},
	url: {
		title : 'Route URL',
		type : 'string',
		//formtype: 'url',//TODO testing - only works in chrome, also prevents normal strings
		//format: 'url',//TODO testing - only works in chrome, also prevents normal strings
		placeholder : 'Route Url'
	}
};
RoutableSchema.statics.routable = true;
RoutableSchema.statics.objectParent = ['Routable.Site', 'Site'];
RoutableSchema.statics.defaultPermission = [0,0,1,0,0,1,1,1];//Delete own, Update own, Read All
RoutableSchema.statics.controller;//to be set by routable model, if the model needs any special functionality to render, create, or update
RoutableSchema.statics.apicontroller = require('../apicontrollers/routable');//Defaults to routable api controller
RoutableSchema.plugin(autoIncrement.plugin, { model: 'Route', field: 'hid', startAt: 100 });
mongoose.model('Routable', RoutableSchema);