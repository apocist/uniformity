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
		title : 'Page Content',
		type : 'string',
		formtype: 'textarea',
		placeholder : 'Page Content'
	}
};
PageSchema.statics.controller = "page.server.controller";
mongoose.model('Page', PageSchema);