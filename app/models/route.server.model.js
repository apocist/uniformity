var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var RouteSchema = new Schema({
	_id: Number,
	url: String,
	type: String,
	object: { type : Schema.ObjectId, },
},
{
	collection: 'routes'
}
);

mongoose.model('Route', RouteSchema);