define(['jquery','async','flashController','authController','contentEditor',/*'custombootstrap',*/'common'], function($, async, flashController, authController, contentEditor) {
	return Class({

		controllers: {},
		contentEditors: [],

		initialize: function (options) {
			var that = this;

			that.controllers.flashController = new flashController({uniformityController: that});
			that.controllers.authController = new authController({uniformityController: that, loginButton: $('#loginButton')});
			console.log('uniformity inited');

			that.activateContentEditors();
		},
		activateContentEditors: function(){
			var that = this;
			var editableModels = [];
			var editableModelNames = {};//can't hav e a length
			async.eachSeries($('[data-editable="true"]'), function (element, cb) {
				var item = {};
				var itemName = '';
				if(element.attributes['data-type']){
					item.type = element.attributes['data-type'].value;
					itemName += item.type;
				}
				//FIXME to remove, there should only be Type now
				/*if(element.attributes['data-subType']){
					item.subType = element.attributes['data-subType'].value;
					itemName += item.subType;
				}*/
				if(element.attributes['data-id']){
					item.id = element.attributes['data-id'].value;
					itemName += item.id;
				}
				//console.log(itemName);
				if(typeof editableModelNames[itemName] === 'undefined'){
					editableModelNames[itemName] = item;
					item.uniformityController = that;
					editableModels.push(item);
				}
				cb();

			}, function done() {
				console.log('Editing:');
				console.log(editableModels);
				async.eachSeries(editableModels, function (model, cb) {
					that.contentEditors.push(new contentEditor(model));
					cb();
				}, function done() {
					console.log('content editing Activated');
				});
			});
		},
		deactivateContentEditors: function(){
			var that = this;
			//cycle through that.contentEditors and destroy each one
		}
	});
});