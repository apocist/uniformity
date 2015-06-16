var RoutablePanel = function(formSchema){
	formSchema = $.parseJSON( formSchema );
	//formSchema will be an object that lists off all the routables and their possible form setup
	var Routable = Backbone.Model.extend({
		url: function () {
			return '/routable/' + this.collection.modelName;
		},
		defaults: {
			name: '',
			content: '',
			url: ''
		},
		create: function (collection) {
			var self = this;
			self.collection = collection;
			this.fetch({
				type: 'POST',
				data: self.attributes,
				success: function (response, options) {
					if (!response.error) {
						console.log(response);
						collection.add(response);
					}
					else {
						console.log(response);
					}
				},
				error: function (collection, response, options) {
					console.log("fetch error");
				}
			});
		},
		remove: function () {
			var self = this;

			this.fetch({
				type: 'DELETE',
				data: self.attributes,
				success: function (collection, response, options) {
					if (response.success) {
						self.destroy();
					}
					else {
						console.log(response);
					}
				},
				error: function (collection, response, options) {
					console.log("fetch error");
				}
			});
		}
	});

	var RoutableType = Backbone.Model.extend({
		url: '',
		initialize: function (options) {
			//this.set(options);
			this.modelName = (options||{}).modelName;
			//this.forumSchema = (options||{}).forumSchema;
			this.routableCollection = new RoutableCollection([], {modelName: this.modelName});
		},
		refreshType: function () {
			console.log("refreshing RoutableType "+this.modelName);
			this.routableCollection.refresh();//TODO this is not performing the render
		}
	});

	var RoutableCollection = Backbone.Collection.extend({
		model: Routable,
		modelName: '',//dynamic
		url: function () {
			return '/routable/' + this.modelName + '/list';
		},
		initialize: function (models,options) {
			this.modelName = (options||{}).modelName || "Page";
		},
		refresh: function () {
			var self = this;
			this.fetch({
				reset: true,
				success: function (collection, response, options) {
					for (var i = 0, len = response.length; i < len; i++) {
						console.log(response[i]);
						self.add(new Routable(response[i]))
					}
				},
				error: function (collection, response, options) {
					console.log("fetch error",response);
				}
			});
		}
	});

	var RoutableTypeCollection = Backbone.Collection.extend({
		model: RoutableType,
		forumSchema: '',//dynamic
		url: '',
		initialize: function (schema) {
			this.forumSchema = schema;
		},
		init: function () {
			for(var routable in this.forumSchema.routables){
				//console.log(this.forumSchema.routables[routable]);
				this.add(new RoutableType(this.forumSchema.routables[routable]))
			}
		}
	});

	var RoutableView = Backbone.View.extend({
		tagName: 'fieldset', // name of tag to be created
		className: 'page',
		//attributes:{'style':'clear:both;padding:5px;margin-top:10px;'},
		events: {
			'click span.delete_button': 'remove'
		},
		initialize: function () {
			_.bindAll(this, 'render', 'unrender', 'remove'); // every function that uses 'this' as the current object should be in here


			this.model.bind('change', this.render);
			this.model.bind('remove', this.unrender);
		},
		remove: function () {
			this.model.remove();
		},
		render: function () {
			$(this.el).html(
				'<legend>' + this.model.get('name') + '</legend>'
				+ '<div class="page_data">'
				+ '<div class="url">' + this.model.get('url') + '</div>'//TODO need to make refresh auto populate route
				+ '<div class="content">"' + this.model.get('content') + '"</div>'
				+ '</div>'
				+ '<div class="delete_container">'
				+ '<span class="delete_button">&nbsp;X&nbsp;</span>'
				+ '</div>'
			);
			return this; // for chainable calls, like .render().el
		},
		unrender: function () {
			$(this.el).remove();
		}
	});

	var RoutableCollectionView = Backbone.View.extend({
		el: $('body'), // el attaches to existing element
		elList: 'div#pagelist',
		events: {
			'click button#refresh': 'refresh',
			'click input#post_routable': 'create'
		},
		initialize: function (options) {
			_.bindAll(this, 'render', 'loadCollection', 'appendRoutable', 'clear', 'create', 'refresh'); // every function that uses 'this' as the current object should be in here

			this.loadCollection(options);

			this.render();
		},
		loadCollection: function (options) {

			this.collection = new RoutableCollection([], options);
			this.collection.bind('add', this.appendRoutable); // collection event binder
			this.collection.bind('reset', this.clear); // collection event binder

			//this.refresh();//TODO makes last Collection render

		},
		render: function () {
			//placeholder
		},
		appendRoutable: function (routable) {
			var routableView = new RoutableView({
				model: routable
			});
			$(this.elList, this.el).append(routableView.render().el);
		},
		clear: function () {
			$(this.elList, this.el).empty();
		},
		create: function () {
			var arr = $('form#creator', this.el).serializeArray();
			var data = _(arr).reduce(function (acc, field) {
				acc[field.name] = field.value;
				return acc;
			}, {});
			new Routable(data).create(this.collection);
			//$('#name').val('');$('#content').val('');$('#url').val('');
			//TODO clear the form
		},
		refresh: function () {
			this.collection.refresh();
		}
	});
	var RoutableTypeView = Backbone.View.extend({
		tagName: 'div', // name of tag to be created
		className: 'routabletype',
		attributes:{'style':'border: 1px solid;width: 75px;text-align: center;float: left;margin: 2px;'},
		events: {
			'click': 'refreshType'
		},
		initialize: function () {
			_.bindAll(this, 'render', 'unrender', 'refreshType'); // every function that uses 'this' as the current object should be in here

			this.model.bind('change', this.render);
		},
		render: function () {
			$(this.el).html(
				this.model.get('modelName')
			);
			return this;
		},
		unrender: function () {
			$(this.el).remove();
		},
		refreshType: function () {
			console.log("refreshType clicked");
			this.model.refreshType();
		}
	});
	var RoutableTypeCollectionView = Backbone.View.extend({
		el: $('body'), // el attaches to existing element
		elList: 'div#routabletypelist',
		initialize: function (schema) {
			_.bindAll(this, 'render', 'appendRoutableType', 'clear');// every function that uses 'this' as the current object should be in here

			this.collection = new RoutableTypeCollection(schema);
			this.collection.bind('add', this.appendRoutableType);

			this.collection.init();
			this.render();
		},
		render: function () {
			//placeholder
		},
		appendRoutableType: function (routable) {
			var routableTypeView = new RoutableTypeView({
				model: routable
			});
			$(this.elList, this.el).append(routableTypeView.render().el);
		},
		clear: function () {
			$(this.elList, this.el).empty();
		}
	});

	return new RoutableTypeCollectionView(formSchema);
};