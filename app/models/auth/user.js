var 	mongoose = require('mongoose'),
		Schema = mongoose.Schema;
var UserSchema = new Schema({
	permissions: [{type : Schema.ObjectId, ref: 'Permission'}],
	strategies: [{type : Schema.ObjectId, ref: 'Strategy'}]
},
{
	collection: 'auth.user',
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true
	}
}
);

UserSchema.virtual('permissionsParsed').
	get(function() {
		return this.___permissionsParsed;
	}).
	set(function(v) {
		this.___permissionsParsed = v;
	});

//Auto populate permissions
UserSchema.pre('findOne', function(next) {this.populate('permissions', 'scope permission');next();});
UserSchema.pre('findOneAndRemove', function(next) {this.populate('permissions', 'scope permission');next();});//Users shouldn't ever actually be deleted, just suspended
UserSchema.pre('remove', function(next) {this.populate('permissions', 'scope permission');next();});//Users shouldn't ever actually be deleted, just suspended

//Sort the Permissions for quick use, runs on Find
UserSchema.post('init', function (doc) {
	doc.permissionsParsed = {};
	for(var perm in doc.permissions){
		if(doc.permissions.hasOwnProperty(perm) && doc.permissions[perm].scope){
			doc.permissionsParsed[doc.permissions[perm].scope] = doc.permissions[perm];
		}
	}
});

UserSchema.statics.objectParent = ['User.Auth.Site', 'Auth.Site', 'Site'];
UserSchema.statics.defaultPermission = [0,0,0,0,0,1,1,1];//only Read All, Update Own TODO need details to prevent updating certain things like own permissions
UserSchema.statics.controller = "user";
UserSchema.statics.apicontroller = require('../../apicontrollers/auth/user');
mongoose.model('User', UserSchema);