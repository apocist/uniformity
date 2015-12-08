var RoutableEditor = Class({
	routable: null,//current Model
	routableFields: [],//array of views

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
		//TODO need to add events to detect on Enter press and leaving input focus
		el: '<input>',//type="text"
		attributes: {//Must always reassign this as a new object when init
			"type": "text",
			"data-type": null,
			"data-var": null
		},
		css: {//Must always reassign this as a new object when init
			"display": "block"
		},
		origEl: null,
		visibleState: false,

		initialize: function(options){
			_.bindAll(this, 'render', 'toggleVisible');
			var that = this;
			that.origEl = (options||{}).origEl;
			that.attributes = {
				"type": "text",//TODO find out what this 'should' be
				"data-type": that.model.routableType,
				"data-var": that.origEl.getAttribute("data-var")
			};
			that.css = {
				"display": "none"
			};
			that.visibleState = false;

			that.render();
			that.initEvents();
		},
		initEvents: function() {
			var that = this;
			$(that.origEl).click(that.toggleVisible);//Clicking the Display Element will allow editing it
			$(that.el).focusout(that.toggleVisible);
		},
		render: function(focus) {//TODO check what happens when rendered a second time(duplicate element, or just move?)
			var that = this;
			$(that.el).attr(that.attributes);
			$(that.el).css(that.css);
			that.el = $(that.el).insertAfter($(that.origEl));
			if(focus){
				$(that.el).focus();
			}
		},
		toggleVisible: function() {
			var that = this;
			if(that.visibleState){
				that.css.display = "none";
				that.visibleState = false;
				that.render();
			} else {
				that.css.display = "block";
				that.visibleState = true;
				that.render(true);
			}
		},
		load: function(callback) {
			var that = this;
			that.model.fetch({
				success: function (routable) {
					console.log('view loaded!');
					callback();
				}
			});
		},
		populate: function() {
			var that = this;
			that.el.val(that.model.attributes[that.attributes['data-var']]);

		}
	}),

	initialize: function(options){
		var that = this;

		that.routable = new that.RoutableModel({
			id: (options||{}).id,
			routableType: (options||{}).routableType,
			baseUrl: (options||{}).baseUrl
		});
		//console.log('Type is '+that.routable.routableType);
		$('[data-type="' + that.routable.routableType + '"]').not("input").each(function(){
			var thatEl  = this;
			//console.log('create for '+ thatEl.getAttribute("data-var"));
			that.routableFields.push(
					new that.RoutableView({
						origEl: thatEl,
						model: that.routable
					})
			);
		});
		//console.log(that.routableFields);
	},
	loadAll: function() {//TODO should create the needed form and input field
		var that = this;
		//console.log(that.routableFields);
		_.each(that.routableFields, function (view) {
			//console.log(view);
			view.load(function () {
				view.populate(that.routable.routableType);//TODO will need to be separate as only 1 field at a time will display
			});
		});
	},
	save: function() {//FIXME static atm
		var that = this;
		//TODO that.routableorm.parse('varname');
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
	}/*,

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
		console.log('Populated');
	}*/
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

