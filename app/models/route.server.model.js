var 	mongoose = require('mongoose'),
		Schema = mongoose.Schema;

var RouteSchema = new Schema({
	hid: { type : Number, required : true, unique : false },
	url: String,
	routableType: String,
	object: { type : Schema.ObjectId }
},
{
	collection: 'route'
}
);

RouteSchema.statics.objectParent = ['Routable', 'Site'];//yes, Routable has access to Route
mongoose.model('Route', RouteSchema);