var 	mongoose = require('mongoose'),
		User = mongoose.model('User'),
		Permission = mongoose.model('Permission');


exports.hasAccess = function(user, object, permissionNeeded, done) {//TODO need to make this callback capable
	if(user && object.statics.objectParent){
		var found = false;
		for(var parent in object.statics.objectParent) {//get each parent
			//check if user has a permission for the parent
			for(var permission in user.permissions){
				if(user.permissions[permission].scope == parent){
					found = true;
					//user has some types of permissions for the object, time to check them
					if(user.permissions[permission].permission >= permissionNeeded){//TODO need to do proper checks
						done(true);
					}
				}
				if(found){break;}
			}
			if(found){break;}
		}
	}
};
