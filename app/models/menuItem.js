var 	mongoose = require('mongoose'),
		Schema = mongoose.Schema;
var MenuItemSchema = new Schema({
	name: { type : String, required : true},
	url: { type : String},
	parent: {type : Schema.ObjectId, ref: 'MenuItem'},
	children: [{type : Schema.ObjectId, ref: 'MenuItem'}],
	priority : { type : Number, default : 0 },
	created : { type : Date, default : Date.now },
	modified : { type : Date, default : Date.now }
},
{
	collection: 'menuItem'
}
);

MenuItemSchema.statics.objectParent = ['Site'];
MenuItemSchema.statics.defaultPermission = [0,0,0,0,0,1,1,1];//only Read All, Update Own
mongoose.model('MenuItem', MenuItemSchema);