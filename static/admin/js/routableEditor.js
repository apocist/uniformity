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
		parentClass: null,
		el: '<input>',//type="text"
		aliasEl: null,
		attributes: {//Must always reassign this as a new object when init(make new reference)
			"type": "text",
			"data-type": null,
			"data-var": null
		},
		css: {//Must always reassign this as a new object when init(make new reference)
			"display": "block"
		},
		visibleState: false,
		previousVal: null,

		initialize: function(options){
			_.bindAll(this, 'render', 'toggleVisible', 'hide', 'show');
			var that = this;
			that.parentClass = (options||{}).parentClass;
			that.aliasEl = (options||{}).aliasEl;
			that.attributes = {
				"type": "text", //TODO find out what this 'should' be per variable (like a WYSIWYG editor)
				"data-type": that.model.routableType,
				"data-var": that.aliasEl.getAttribute("data-var")
			};
			that.css = $(that.aliasEl).getCss([//Copies the current calculated css to appear more seamless
					'position',
					'top',
					'bottom',
					'left',
					'bottom',
					'float',
					'width',
					'margin-top',
					'margin-bottom',
					'margin-left',
					'margin-right',
					'padding-top',
					'padding-bottom',
					'padding-left',
					'padding-right',
					'font-family',
					'font-size',
					'font-style',
					'font-weight',
					'text-decoration',
					'text-align',

					'color',
					'background-color'
			]);
			//text-transform should be none
			that.css.display = "none";
			that.visibleState = false;

			that.render();
			that.initEvents();
		},
		/**
		 * Sets the events on the DOM, should only run once
		 */
		initEvents: function() {
			var that = this;
			$(that.aliasEl).click(that.toggleVisible);//Clicking the Display Element will allow editing it
			$(that.el).focusout(that.hide).keypress(function (key) {//Leaving the edit field or pressing 'Enter' will hide it
				if (key.which == 13) {
					that.hide();
					return false;//doesn't already, but prevents submit
				}
			});
		},
		/**
		 * Direct set the Field properties in the DOM, can be standalone and run when needed
		 */
		render: function(focus) {
			var that = this;
			$(that.el).attr(that.attributes);
			$(that.el).css(that.css);
			that.el = $(that.el).insertAfter($(that.aliasEl));
			if(focus){
				$(that.el).focus();
			}
		},
		/**
		 * Toggles between Show/Hide functions
		 */
		toggleVisible: function() {
			var that = this;
			if(that.visibleState){
				that.hide();
			} else {
				that.show();
			}
		},
		/**
		 * Hide this Field and show it's Alias Element
		 * Attempt to save if there are changes
		 */
		hide: function() {
			var that = this;
			that.save();
			that.css.display = "none";
			that.visibleState = false;
			that.render();
			$(that.aliasEl).show();
		},
		/**
		 * Show this Field and hide it's Alias Element
		 */
		show: function() {
			var that = this;
			that.css.display = "block";
			that.visibleState = true;
			$(that.aliasEl).hide();
			that.render(true);
		},
		/**
		 * Performs Load of the Model and populates every field(view) related
		 */
		load: function() {
			var that = this;
			that.parentClass.load();
		},
		/**
		 * Save and possible changes to this field
		 */
		save: function() {
			var that = this;
			var newVal =  $(that.el).val();//Hold the possible new Value
			if(that.model.attributes[that.attributes['data-var']] != newVal){//Check for differences
				that.previousVal = that.model.attributes[that.attributes['data-var']];//Preserve the previous value just in case
				that.model.attributes[that.attributes['data-var']] = newVal;//Update the Model
				$(that.aliasEl).html(newVal);//Update the DOM
				that.model.save(null, {
					success: function (model, response) {},
					error: function (model, response) {
						console.log("error",response);
						//TODO add flashbag to DOM
						//Reset to previous values
						that.model.attributes[that.attributes['data-var']] = that.previousVal;
						that.populate();
					}
				});
			}
		},
		/**
		 * Update the DOM with current Model (display and field)
		 */
		populate: function() {
			var that = this;
			that.el.val(that.model.attributes[that.attributes['data-var']]);
			$(that.aliasEl).html(that.model.attributes[that.attributes['data-var']]);
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
			var aliasEl  = this;
			that.routableFields.push(
					new that.RoutableView({
						parentClass: that,
						aliasEl: aliasEl,
						model: that.routable
					})
			);
		});
	},
	/**
	 * Fetch new Model and populate the DOM with all fields
	 */
	load: function() {
		var that = this;
		that.routable.fetch({
			success: function (routable) {
				_.each(that.routableFields, function (view) {
					view.populate();
				});
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

