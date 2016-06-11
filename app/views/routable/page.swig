{% extends 'base.swig' %}

{% block title %}{{ name }}{% endblock %}

{% block content %}
	<div id="page_container">
		{{ editWidget.create("name", name, {"tag": "h1"}) }}
		<br/>
		{{ editWidget.create("content", content, {"id": "content"}) }}
		<input id="twitterLogin" type="button" value="Twitter Login"/>
	</div>
{% endblock %}