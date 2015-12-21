{% extends 'base.swig' %}

{% block title %}{{ title }}{% endblock %}

{% block head %}
	<link rel="stylesheet" type="text/css" href="/css/admin.css">
	<link rel="stylesheet" type="text/css" href="/css/bootstrap.css" />

	{#<script type="text/javascript" src="http://underscorejs.org/underscore-min.js"></script>#}{#1.8.2#}
	{#jsonform is incompatible with underscore 1.8, the jsonform-dev branch works with 1.8, but wait until required field is fixed#}
	<script type="text/javascript" src="/js/underscore/underscore-1.5.2-min.js"></script>{#1.5.2#}
	<script type="text/javascript" src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
	<script type="text/javascript" src="http://backbonejs.org/backbone-min.js"></script>
	<script type="text/javascript" src="/js/common.js"></script>
	<script type="text/javascript" src="/js/routablePanel.js"></script>
	<script >


		$(document).ready(function(){

			//$.loadScriptsIfNeeded(typeof(RoutablePanel) === typeof(Function), '/js/routablePanel.js', function () {
				new RoutablePanel({{ formSchema|json|raw }});
			//});

		});
	</script>
{% endblock %}

{% block content %}
	<div id="routabletypelist"></div>
	{#<button id="refresh" style="float:left;">Refresh</button>#}
	<div id="pagelist"></div>

	<form id="creator">
	{#<fieldset>
		<legend>New Page</legend>
		<input type="text" name="name" placeholder="Page Name" required />
		<input type="text" name="content" placeholder="Page Content" required />
		<input type="text" name="url" placeholder="Route Url" required />
		<input type="button" id="post_routable" value="Create Page" />
	</fieldset>#}
	</form>

	<div id="res" class="alert" style="clear:both;"></div>
	{#<form id="jsonform"></form>#}
	{#<script type="text/javascript">
		$('form').jsonForm({
			schema: {
				name: {
					type: 'string',
					title: 'Name',
					required: true
				},
				age: {
					type: 'integer',
					title: 'Age'
				}
			},
			form: [
				{
					"key": "name",
					"placeholder": "your Name"
				},
				"age",
				{
					"title": "Submit",
					"type": "submit"
				}
			],
			onSubmit: function (errors, values) {
				if (errors) {
					console.log(errors);
					$('#res').html('<p>I beg your pardon?</p>');
				}
				else {
					$('#res').html('<p>Hello ' + values.name + '.' +
					(values.age ? '<br/>You are ' + values.age + '.' : '') +
					'</p>');
				}
			}
		});
	</script>#}

{% endblock %}