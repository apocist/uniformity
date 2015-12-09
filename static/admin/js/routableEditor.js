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
			return this.baseUrl + '/routable/' + this.routableType; //TODO 'may' not always be a routable..later might be a generic object
		},
		initialize: function (options) {
			this.baseUrl = (options||{}).baseUrl;
			this.routableType = (options||{}).routableType;
		}
	}),
	RoutableView: Backbone.View.extend({
		el: '<input>',//type="text"
		attributes: {//Must always reassign this as a new object when init(make new reference)
			"type": "text",
			"data-type": null,
			"data-var": null
		},
		css: {//Must always reassign this as a new object when init(make new reference)
			"display": "block"
		},
		origEl: null,
		visibleState: false,

		initialize: function(options){
			_.bindAll(this, 'render', 'toggleVisible', 'hide', 'show');
			var that = this;
			that.origEl = (options||{}).origEl;
			that.attributes = {
				"type": "text", //TODO find out what this 'should' be per variable
				"data-type": that.model.routableType,
				"data-var": that.origEl.getAttribute("data-var")
			};
			that.css = $(that.origEl).getCss([//Copies the current calculated css to appear more seamless
				//'margin', //doesn't work properly with firefox
				"margin-top",
				"margin-bottom",
				"margin-left",
				"margin-right",
				'padding',
				'font-size',
				'font-weight'
			]);
			that.css.display = "none";
			that.visibleState = false;

			that.render();
			that.initEvents();
		},
		initEvents: function() {
			var that = this;
			$(that.origEl).click(that.toggleVisible);//Clicking the Display Element will allow editing it
			$(that.el).focusout(that.hide).keypress(function (key) {//Leaving the edit field or pressing 'Enter' will hide it //TODO (and later save)
				if (key.which == 13) {
					that.hide();
					return false;//doesn't already, but prevents submit
				}
			});
		},
		render: function(focus) {
			var that = this;
			$(that.el).attr(that.attributes);
			$(that.el).css(that.css);
			that.el = $(that.el).insertAfter($(that.origEl));
			if(focus){
				$(that.el).focus();
			}
		},
		//does not show/hide that.el in case additional changes want to be made to the properties beforehand to render later
		toggleVisible: function() {
			var that = this;
			if(that.visibleState){
				that.hide();
			} else {
				that.show();
			}
		},
		hide: function() {
			var that = this;
			that.css.display = "none";
			that.visibleState = false;
			that.render();
			$(that.origEl).show();
		},
		show: function() {
			var that = this;
			that.css.display = "block";
			that.visibleState = true;
			$(that.origEl).hide();
			that.render(true);
		},
		load: function(callback) {
			var that = this;
			that.model.fetch({
				success: function (routable) {
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
		$('[data-type="' + that.routable.routableType + '"]').not("input").each(function(){
			var thatEl  = this;
			that.routableFields.push(
					new that.RoutableView({
						origEl: thatEl,
						model: that.routable
					})
			);
		});
	},
	loadAll: function() {//TODO should create the needed form and input field
		var that = this;
		_.each(that.routableFields, function (view) {
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
/**
 * Modified from http://upshots.org/javascript/jquery-copy-style-copycss
 */
(function($){
	$.fn.getCss = function(whitelist){
		var dom = this.get(0);
		var style;
		var returns = {};
		if(window.getComputedStyle){
			var camelize = function(a,b){
				return b.toUpperCase();
			};
			style = window.getComputedStyle(dom, null);
			if(whitelist){
				for(var i=0;i<whitelist.length;i++){
					//if(style.hasOwnProperty(whitelist[i])){ //does not grab base styles from Firefox
					if (typeof style[whitelist[i]] !== 'undefined') {
						var prop = whitelist[i];
						var camel = prop.replace(/\-([a-z])/g, camelize);
						var val = style[prop];
						returns[camel] = val;
					}
				}
			} else {
				for(var i=0;i<style.length;i++){
					var prop = style[i];
					var camel = prop.replace(/\-([a-z])/g, camelize);
					var val = style.getPropertyValue(prop);
					returns[camel] = val;
				}
			}
			return returns;
		}
		if(dom.currentStyle){
			style = dom.currentStyle;
			for(var prop in style){
				returns[prop] = style[prop];
			}
			return returns;
		}
		return this.css();
	}
})(jQuery);



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

