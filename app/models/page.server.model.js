//noinspection JSUnusedGlobalSymbols
var mongoose = require('mongoose'),
	extend = require('mongoose-schema-extend'),
	routable = mongoose.model('Routable').schema;
	
var PageSchema = routable.extend({
	content: String
},
{
	collection: 'pages'
}
);


PageSchema.statics.formschema = {
	content: {
		type : 'TextField',
		tooltip : 'Page Content'
	}
};
PageSchema.statics.controller = "page.server.controller";
mongoose.model('Page', PageSchema);