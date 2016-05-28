{% extends 'base.swig' %}

{% block javascript %}{% parent %}
	<script type="text/javascript">
		//TODO need to move this all to one central controller
		$(document).ready(function() {
			window.flashController = new flashController();
			window.authController = new authController({twitterButton: $('#twitterLogin')});

			var editor = new ContentEditor({
				id: {{ hid }},
				type: '{{ type }}',
				subType: '{{ __t }}',
				//baseUrl: 'http://admin.inin.pw:1337'
			});
			editor.load();
		});
	</script>
{% endblock %}

{% block title %}{{ name }}{% endblock %}

{% block content %}
	<div id="page_container">
		<h1 data-type="routable" data-subType="Page" data-var="name">{{ name }}</h1>
		<br/>
		<div id="content" data-type="routable" data-subType="Page" data-var="content">
			{{ content }}
		</div>
		<input id="twitterLogin" type="button" value="Twitter Login"/>
	</div>
{% endblock %}