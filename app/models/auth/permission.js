var 	mongoose = require('mongoose'),
		Schema = mongoose.Schema;

var PermissionSchema = new Schema({
	user: { type : Schema.ObjectId, ref : 'User' },
	scope: {type : String, required : true},
	permission: Number,
	details: [{type : Schema.ObjectId, ref: 'Permission'}]//allow sub permissions such as for each field
},
{
	collection: 'auth.permission'
}
);

PermissionSchema.statics.objectParent = ['Permission.Auth.Site', 'Auth.Site', 'Site'];
PermissionSchema.statics.defaultPermission = [0,0,0,0,0,0,0,1];//only Read Own
PermissionSchema.statics.controller = "permission";
PermissionSchema.statics.apicontroller = require('../../apicontrollers/auth/permission');
mongoose.model('Permission', PermissionSchema);