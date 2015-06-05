{% extends 'base.swig' %}

{% block title %}{{ title }}{% endblock %}

{% block head %}
    <link rel="stylesheet" type="text/css" href="/css/admin.css">
    <script type="text/javascript" src="http://underscorejs.org/underscore-min.js"></script>
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
    <script type="text/javascript" src="http://backbonejs.org/backbone-min.js"></script>
    <script >
        $(document).ready(function(){
            var Routable = Backbone.Model.extend({
                url:'/routable/Page',
                defaults: {
                    name: '',
                    content: '',
                    url: ''
                },
                create: function(collection){
                    var self = this;

                    this.fetch({
                        type:'POST',
                        data: self.attributes,
                        success: function (response, options) {
                            if(!response.error){
                                //routable was saved
                                console.log(response);
                                //console.log(collection.models);
                                collection.add(response);
                            }
                            else{
                                console.log(response);
                            }
                        },
                        error: function (collection, response, options) {
                            console.log("fetch error");
                        }
                    });
                },
                remove: function(){
                    var self = this;

                    this.fetch({
                        type:'DELETE',
                        data: self.attributes,
                        success: function (collection, response, options) {
                            if(response.success){
                                self.destroy();
                            }
                            else{
                                console.log(response);
                            }
                        },
                        error: function (collection, response, options) {
                            console.log("fetch error");
                        }
                    });
                }
            });

            var Collection = Backbone.Collection.extend({
                model: Routable,
                url:'/routable/Page/list',
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
                            console.log("fetch error");
                        }
                    });
                }
            });

            var RoutableView = Backbone.View.extend({
                tagName: 'fieldset', // name of tag to be created
                className: 'page',
                //attributes:{'style':'clear:both;padding:5px;margin-top:10px;'},
                events: {
                    'click span.delete_button': 'remove'
                },
                initialize: function(){
                    _.bindAll(this, 'render', 'unrender', 'remove'); // every function that uses 'this' as the current object should be in here


                    this.model.bind('change', this.render);
                    this.model.bind('remove', this.unrender);
                },
                remove: function(){
                    //this.model.destroy();
                    this.model.remove();
                },
                render: function(){
                    $(this.el).html(
                            '<legend>'+this.model.get('name')+'</legend>'
                            +'<div class="page_data">'
                                +'<div class="url">'+this.model.get('url')+'</div>'//TODO need to make refresh auto populate route
                                +'<div class="content">"'+this.model.get('content')+'"</div>'
                            +'</div>'
                            +'<div class="delete_container">'
                                +'<span class="delete_button">&nbsp;X&nbsp;</span>'
                            +'</div>'
                    );
                    return this; // for chainable calls, like .render().el
                },
                unrender: function(){
                    $(this.el).remove();
                }
            });

            var CollectionView = Backbone.View.extend({
                el: $('body'), // el attaches to existing element
                events: {
                    'click button#refresh': 'refresh',
                    'click input#post_routable': 'create'
                },
                initialize: function(){
                    _.bindAll(this, 'render', 'appendRoutable'); // every function that uses 'this' as the current object should be in here

                    this.collection = new Collection();
                    this.collection.bind('add', this.appendRoutable); // collection event binder
                    this.collection.bind('reset', this.clear); // collection event binder

                    this.collection.refresh();
                    this.render();
                },
                render: function(){
                    //placeholder
                },
                appendRoutable: function(routable){
                    var routableView = new RoutableView({
                        model: routable
                    });
                    $('div#pagelist', this.el).append(routableView.render().el);
                },
                clear: function(){
                    $('div#pagelist', this.el).empty();
                },
                create: function(){
                    console.log("creating routable");
                    //var page = new Page();
                    var arr = $('form#creator', this.el).serializeArray();
                    var data = _(arr).reduce(function(acc, field) {
                        acc[field.name] = field.value;
                        return acc;
                    }, {});
                    new Routable(data).create(this.collection);
                    console.log("created?");
                    //$('#name').val('');$('#content').val('');$('#url').val('');
                },
                refresh: function(){
                    this.collection.refresh();
                }
            });

            var collectionView = new CollectionView();
        });
    </script>
{% endblock %}

{% block content %}
    <button id="refresh" style="float:left;">Refresh</button>
    <div id="pagelist"></div>
    <form id="creator">
        <fieldset>
            <legend>New Page</legend>
            <input type="text" name="name" placeholder="Page Name" required />
            <input type="text" name="content" placeholder="Page Content" required />
            <input type="text" name="url" placeholder="Route Url" required />
            <input type="button" id="post_routable" value="Create Page" />
        </fieldset>
    </form>

{% endblock %}