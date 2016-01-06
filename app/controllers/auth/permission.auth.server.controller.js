var 	mongoose = require('mongoose'),
		User = mongoose.model('User'),
		Permission = mongoose.model('Permission');


exports.hasAccess = function(user, object, permissionNeeded, done) {//TODO need to make this callback capable
	if(user && object.statics.objectParent){
		var found = false;
		for(var parent in object.statics.objectParent) {//get each parent
			//check if user has a permission for the parent
			if(user.permissionsParsed.hasOwnProperty(object.statics.objectParent[parent])){
				found = true;
				if(user.permissionsParsed[object.statics.objectParent[parent]].permission >= permissionNeeded){//TODO need to do proper checks
					done(true);
				}
				if(found){break;}
			}
		}
	}
};
