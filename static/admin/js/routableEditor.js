var RoutableEditor = Class({
	routable: null,//current Model
	routableForm: null,//current Form

	RoutableModel: Backbone.Model.extend({
		baseUrl: '',
		//All Routes should have these three values
		defaults: {
			name: '',
			content: '',
			url: ''
		},
		routableType: '',
		urlRoot: function () {
			return this.baseUrl + '/routable/' + this.routableType;
		},
		initialize: function (options) {
			this.baseUrl = (options||{}).baseUrl;
			this.routableType = (options||{}).routableType;
		}
	}),
	RoutableView: Backbone.View.extend({
		load: function(callback) {//TODO should create the needed field
			var that = this;
			that.model.fetch({
				success: function (routable) {
					callback();
				}
			});
		}
	}),

	initialize: function(options){
		var that = this;

		that.routable = new that.RoutableModel({
			id: (options||{}).id,
			routableType: (options||{}).routableType,
			baseUrl: (options||{}).baseUrl
		});
		that.routableForm = new that.RoutableView({
			el: (options||{}).el,//such as $('#content')
			model: that.routable
		});
	},
	load: function() {//TODO should create the needed form and input field
		var that = this;
		that.routableForm.load(function () {
			that.routableForm.populate(that.routable.routableType);//TODO will need to be separate as only 1 field at a time will display
		});
	},
	save: function() {//FIXME static atm
		var that = this;
		//TODO that.routableForm.parse('varname');
		var routableDetails = {
			id: 0,//remove id for a new entry
			name: '',
			content: '',
			url: ''
		};
		that.routable.save(routableDetails, {
			success: function (routable) {
				console.log(routable);
			}
		});
	 }
});

//Additional functions to Views
_.extend(Backbone.View.prototype, {
	//Parses the form into model attributes to SAVE
	parse: function(routableType) {
		var self = this,
		_recurse_form = function(object) {
			if(routableType) {
				_.each(object, function (v, k) {
					object[k] = self.$('[data-var="' + k + '"][data-type="' + routableType + '"]').val();
				});
			} else {//Be carful not to parse unwanted fields
				_.each(object, function (v, k) {
					object[k] = self.$('[data-var="' + k + '"]').val();
				});
			}
			return object;
		};
		this.model.attributes = _recurse_form(this.model.attributes);
	},

	//Displays the currently fetched model in a form
	populate: function(routableType) {
		var self = this,
		_recurse_obj = function(object) {
			if(routableType){
				_.each(object, function (v,k) {
					if(_.isString(v)) {
						self.$('[data-var="' + k + '"][data-type="' + routableType + '"]').val(v);
					}
				});
			} else {//Shouldn't be used multiple times
				_.each(object, function (v,k) {
					if(_.isString(v)) {
						self.$('[data-var="' + k + '"]').val(v);
					}
				});
			}
		};
		_recurse_obj(this.model.attributes);
		console.log('Populated');//TODO
	}
	/*
	 parse: function(objName) {
		var self = this,
		_recurse_form = function(object, objName) {
			_.each(object, function(v,k) {
				if (v instanceof Object) {
					object[k] = _recurse_form(v, objName + '[' + k + '_attributes]');
				} else {
					object[k] = self.$('[name="'+ objName + '[' + k + ']"]').val();
				}
			});
			return object;
		 };
		 this.model.attributes = _recurse_form(this.model.attributes, objName);
	 }
	populate: function(objName, routableType) {
		var self = this,
			_recurse_obj = function(object, objName) {
				_.each(object, function (v,k) {
					if (v instanceof Object) {
						_recurse_obj(v, objName + '[' + k + '_attributes]');
					} else if (_.isString(v)) {
						if(routableType){
							self.$('[name="' + objName + '[' + k + ']"][data-type="' + routableType + '"]').val(v);
						} else{//Shouldn't be used multiple times
							self.$('[name="' + objName + '[' + k + ']"]').val(v);
						}
					}
				});
			};
		_recurse_obj(this.model.attributes, objName);
	}*/
});

