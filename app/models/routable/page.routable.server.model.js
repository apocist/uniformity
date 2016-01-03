//noinspection JSUnusedGlobalSymbols
var 	mongoose = require('mongoose'),
		extend = require('mongoose-schema-extend'),
		routable = mongoose.model('Routable').schema;
	
var PageSchema = routable.extend({
	subType: {type: String, default: 'Page', enums: ['Page']},
	content: String
},
{
	collection: 'routable.page'
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
PageSchema.statics.objectParent = ['Page', 'Routable', 'Site'];
PageSchema.statics.controller = "page.routable.server.controller";
mongoose.model('Page', PageSchema);