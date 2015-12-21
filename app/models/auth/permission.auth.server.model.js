var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var PermissionSchema = new Schema({
	user: { type : Schema.ObjectId, ref : 'User' },
	scope: {type : String, required : true},
	permission: Number
},
{
	collection: 'permission'
}
);

mongoose.model('Permission', PermissionSchema);