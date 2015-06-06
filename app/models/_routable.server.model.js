/*
This is a non-existant object that is only meant to be extended from
*/

var mongoose = require('mongoose'),
	autoIncrement = require('mongoose-auto-increment'),
	Schema = mongoose.Schema;
	

var RoutableSchema = new Schema({
	name: { type : String, required : true},
	hid: { type : Number, required : false, unique : false },
	route: { type : Schema.ObjectId, ref : 'Route' },
	created : { type : Date, default : Date.now },
	modified : { type : Date, default : Date.now }
},
{
	collection: 'routes'//TODO need to prevent this from creating a collection
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
		type : 'TextField',
		tooltip : 'Title'
	},
	url: {
		type : 'TextField',
		tooltip : 'Route Url'
	}
};
RoutableSchema.statics.routable = true;
RoutableSchema.statics.controller = "SOMETHING.server.controller";//to be set by routable model
RoutableSchema.plugin(autoIncrement.plugin, { model: 'Route', field: 'hid', startAt: 100 });
mongoose.model('Routable', RoutableSchema);