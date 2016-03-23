{% extends 'base.swig' %}

{% block head %}
	<link rel="stylesheet" type="text/css" href="/site/css/common.css">

	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
	<script type="text/javascript" src="http://code.jquery.com/jquery-2.2.1.min.js"></script>
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.1/backbone-min.js"></script>
	<script type="text/javascript" src="/site/js/common.js"></script>
	<script type="text/javascript" src="/site/js/flashController.js"></script>
	<script type="text/javascript" src="/auth/js/authController.js"></script>
	<script type="text/javascript" src="/admin/js/contentEditor.js"></script>
	<script type="text/javascript">
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