var 	that = this,
		mongoose = require('mongoose'),
		User = mongoose.model('User'),
		Permission = mongoose.model('Permission');

exports.access = {
	//unknown: 	0,
	deleteAll: 	1,
	deleteOwn: 	2,
	create:		3,
	updateAll: 	4,
	updateOwn: 	5,
	readAll: 	6,
	readOwn: 	7
};

/**
 * States whether a User has access to a model depending on the User or Object permissions
 *
 * @param user the User Model check permissions of.
 * @param object item to check if user has access to(Model)
 * @param permissionsNeeded array of string or numbered permissions that need to be True( use exports.access)
 * @param done callback currently returns true/false
 */
exports.hasAccess = function(user, object, permissionsNeeded, done) {
	var that = this;
	var permission;
	var skipPermissions = false;
	console.log('checking permissions');
	//TODO skip the checks on readAll if default is readAll (saves on processing power and speed)
	if(permissionsNeeded.length == 1 && (permissionsNeeded[0] == 'readAll' || permissionsNeeded[0] == that.access.readAll) && object.schema.statics.defaultPermission){
		if(object.schema.statics.defaultPermission[6] == 1){//if Model allows readAll by default
			console.log('skipping permissions');
			skipPermissions = true;
		}
	}
	if(user && object.schema.statics.objectParent){
		console.log('there is a user...');
		//TODO Check if User has access to the specific object (may use the scope var of a hash object)
		//Checks if user has has has access from Object Type then parent types
		for(var parent in object.schema.statics.objectParent) {//get each parent
			if(user.permissionsParsed.hasOwnProperty(object.schema.statics.objectParent[parent])){
				permission = user.permissionsParsed[object.schema.statics.objectParent[parent]];
				break;
			}
		}

	}
	//TODO allow specific object to set own default Permissions?
	//Check if User can fallback to default permissions if none found
	if(!permission && object.schema.statics.defaultPermission) {
		permission = {
			permission: that.permission2Raw(object.schema.statics.defaultPermission)
			//TODO allow detailed default permissions
		}
	}

	if(skipPermissions){
		done(skipPermissions);
	} else{
		if(permission){
			that.comparePermissions(permission, permissionsNeeded, function(bool){
				done(bool);
			});
		} else {
			done(false);//no permission
		}
	}

};

/**
 * States whether a Permission meets the conditions of what's needed
 *
 * @param permission Permission Model(or fake model)
 * @param permissionsNeeded (string/number)array for access types found as exports.access
 * @param done callback currently returns true/false
 */
exports.comparePermissions = function(permission, permissionsNeeded, done) {
	var pArray = that.raw2Permission(permission.permission);//convert to readable format
	var allow = true;
	for(var needed in permissionsNeeded){
		if(permissionsNeeded.hasOwnProperty(needed)){
			if(typeof permissionsNeeded[needed] == 'string'){//convert to number
				if(that.access.hasOwnProperty(permissionsNeeded[needed])){
					permissionsNeeded[needed] = that.access[permissionsNeeded[needed]];
				} else{allow = false;break;}
			}
			if(!pArray[Number(permissionsNeeded[needed])]){//if permission is denied
				allow = false;break;
			}
		}
	}
	//as long as it is not denied one, user is allowed to do that action
	done(allow);
};

/**
 * Converts a number(raw permission) into readable array
 *
 * @param rawPermission number 0-255
 * @returns [number] returns 8 length array of numbers
 */
exports.raw2Permission = function(rawPermission) {
	var pArray;
	if(rawPermission > 255){
		pArray = [0,0,0,0,0,0,0,0];//denied
	} else {
		//convert number to array of true/false
		pArray = rawPermission.toString(2).split('');
		//convert the array to all numbers
		for(var bit in pArray){
			pArray[bit] = Number(pArray[bit]);
		}
		//make sure the array is 8 in length
		while(pArray.length < 8){
			pArray.unshift(0);
		}
	}

	return pArray;
};

/**
 * Converts a number array into rawPermission number for saving
 *
 * @param pArray 8 length number array
 * @returns number 0-255
 */
exports.permission2Raw = function(pArray) {//TODO need to make this callback capable
	if(pArray.length == 8){
		return parseInt(pArray.join(''),2)
	} else {
		return 0;//bad permission, denied
	}
};
