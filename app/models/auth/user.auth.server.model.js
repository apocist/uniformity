var 	mongoose = require('mongoose'),
		Schema = mongoose.Schema;
//TODO need permissions to allow editing
var UserSchema = new Schema({
	permissions: [{type : Schema.ObjectId, ref: 'Permission'}],
	twitter: {
		id: String,
		token: String,
		username: String,
		displayName: String,
		lastStatus: String
	}
},
{
	collection: 'auth.user'
}
);

UserSchema.statics.objectParent = ['User', 'Auth', 'Site'];
mongoose.model('User', UserSchema);