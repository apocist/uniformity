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

RouteSchema.statics.objectParent = ['Route.Site', 'Routable.Site', 'Site'];//yes, Routable has access to Route
RouteSchema.statics.defaultPermission = [0,0,0,0,0,0,0,0];//no need to access
RouteSchema.statics.controller = "route.server.controller";
mongoose.model('Route', RouteSchema);