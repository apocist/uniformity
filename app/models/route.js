var 	mongoose = require('mongoose'),
		Schema = mongoose.Schema;

var RouteSchema = new Schema({
	url: String,
	routableType: String,
	object: { type : Schema.ObjectId }
},
{
	collection: 'route'
}
);

RouteSchema.statics.objectParent = ['Route.Site', 'Site'];//yes, only special permissions or editable directly through the Routable object
RouteSchema.statics.defaultPermission = [0,0,0,0,0,1,1,1];//only deletable/creatable through routable
RouteSchema.statics.controller = "route";
RouteSchema.statics.apicontroller = require('../apicontrollers/route');//Defaults to routable api controller
mongoose.model('Route', RouteSchema);