{% extends 'base.swig' %}

{% block title %}{{ name }}{% endblock %}


{% block content %}
	<div id="page_container">
		<h1 data-editable="true" data-id="{{ hid }}" data-type="{{ type }}" data-subType="{{ __t }}" data-marco="true" data-var="name">{{ name }}</h1>
		<br/>
		<div id="content" data-editable="true" data-id="{{ hid }}" data-type="{{ type }}" data-subType="{{ __t }}" data-var="content">
			{{ content }}
		</div>
		<input id="twitterLogin" type="button" value="Twitter Login"/>
	</div>
{% endblock %}