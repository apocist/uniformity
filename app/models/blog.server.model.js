//noinspection JSUnusedGlobalSymbols
var mongoose = require('mongoose'),
	extend = require('mongoose-schema-extend'),
	routable = mongoose.model('Routable').schema;
	
var BlogSchema = routable.extend({
	content: String,
	posted : { type : Date, default : Date.now }
},
{
	collection: 'blogs'
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
		type : 'TextField',
		tooltip : 'Blog Content'
	},
	posted: {
		type : 'DateField',
		tooltip : 'Date Posted'
	}
};
BlogSchema.statics.controller = "blog.server.controller";
mongoose.model('Blog', BlogSchema);