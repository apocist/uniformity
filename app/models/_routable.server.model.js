/*
This is a non-existant object that is only meant to be extended from
*/

var mongoose = require('mongoose'),
	autoIncrement = require('mongoose-auto-increment'),
	Schema = mongoose.Schema;
	

var RoutableSchema = new Schema({
	name: String,
	hid: { type : Number, required : false, unique : false },
	route: { type : Schema.ObjectId, ref : 'Route' },
	created : { type : Date, default : Date.now }
},
{
	collection: 'routes'//TODO need to prevent this from creating a collection
}
);

RoutableSchema.statics.routable = true;
RoutableSchema.plugin(autoIncrement.plugin, { model: 'Route', field: 'hid', startAt: 100 });
mongoose.model('Routable', RoutableSchema);