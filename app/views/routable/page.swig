{% extends 'base.swig' %}

{% block title %}{{ name }}{% endblock %}

{% block content %}
	<div id="page_container" class="container-fluid">
		{{ editWidget.create("name", name, {"tag": "h1"}) }}
		<br/>
		{{ editWidget.create("content", content, {"id": "content"}) }}
		<input id="loginButton" type="button" value="Login"/>
	</div>
{% endblock %}