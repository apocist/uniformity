/*
This is a non-existant object that is only meant to be extended from

Authentication Strategies shall be created from this
*/

var 	mongoose = require('mongoose'),
		Schema = mongoose.Schema;
	

var StrategySchema = new Schema({
	user: {type : Schema.ObjectId, ref: 'User'},
	created : { type : Date, default : Date.now },
	modified : { type : Date, default : Date.now }
},
{
	collection: 'auth.strategy'//collection will hold multiple types
}
);

//Auto populate
StrategySchema.pre('findOne', function(next) {this.populate('user');next();});
StrategySchema.pre('findOneAndRemove', function(next) {this.populate('user');next();});
StrategySchema.pre('remove', function(next) {this.populate('user');next();});


//Clean up children
StrategySchema.post('findOneAndRemove', function(results, next) {
	/*if(results){
		if(results.route){
			try {
				results.route.remove();//remove whenever
			}
			catch(e){}//ignore errors...probably didn't populate as if it route didn't exist
		}
	}*/
	next();
});
StrategySchema.post('remove', function(results, next) {
	/*if(results){
		if(results.route){
			try {
				results.route.remove();//remove whenever
			}
			catch(e){}//ignore errors...probably didn't populate as if it route didn't exist
		}
	}*/
	next();
});

StrategySchema.statics.formschema = {
	/*name: {
		title : 'Name',
		type : 'string',
		placeholder : 'Title',
		required : true
	},
	url: {
		title : 'Route URL',
		type : 'string',
		//formtype: 'url',//TODO testing - only works in chrome, also prevents normal strings
		//format: 'url',//TODO testing - only works in chrome, also prevents normal strings
		placeholder : 'Route Url'
	}*/
};
StrategySchema.statics.objectParent = ['User.Auth.Site', 'Strategy.Auth.Site','Auth.Site', 'Site'];
StrategySchema.statics.defaultPermission = [0,0,0,0,0,0,1,1];//only Read All TODO need details to prevent reading certain things like tokens
StrategySchema.statics.controller = "strategy";
StrategySchema.statics.apicontroller = require('../../apicontrollers/auth/strategy');
mongoose.model('Strategy', StrategySchema);