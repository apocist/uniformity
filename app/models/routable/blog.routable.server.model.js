//noinspection JSUnusedGlobalSymbols
var 	mongoose = require('mongoose'),
		extend = require('mongoose-schema-extend'),
		routable = mongoose.model('Routable').schema;
	
var BlogSchema = routable.extend({
	subType: {type: String, default: 'Blog', enums: ['Blog']},
	content: String,
	posted : { type : Date, default : Date.now }
},
{
	collection: 'routable.blog'
}
);

BlogSchema.post('remove', function(results, next) {
	console.log("additional cleanup");//TODO remove from parent list
	next();
});
BlogSchema.post('findOneAndRemove', function(results, next) {
	console.log("additional cleanup");//TODO remove from parent list
	next();
});

BlogSchema.statics.formschema = {
	content: {
		title: 'Blog Content',
		type : 'string',
		formtype: 'textarea',
		placeholder : 'Blog Content'
	},
	posted: {
		title: 'Date Posted',
		type : 'string',
		formtype: 'date',//TODO testing - only works in chrome
		format: 'date',//TODO testing - only works in chrome
		placeholder : 'Date Posted'
	}
};
BlogSchema.statics.objectParent = ['Blog.Routable.Site', 'Routable.Site', 'Site'];
BlogSchema.statics.defaultPermission = [0,0,0,0,0,0,1,1];//only Read All
//BlogSchema.statics.controller = "blog.routable.server.controller";//not needed, using as example
mongoose.model('Blog', BlogSchema);