{% extends 'base.swig' %}

{% block meta %}{% parent %}
	<base href="/">
{% endblock %}

{% block css %}
	{#{ css.stylesheet("/site/css/common") }}
	{{ css.stylesheet("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/css/bootstrap.min") }}
	{{ css.stylesheet("/site/css/customBootstrap") }#}
{% endblock %}

{% block title %}Angular Test Page{% endblock %}

{% block content %}
	<div id="header">
		<div class="navigation"><h3>Navigation goes here</h3></div>
	</div>
	<div id="sidebar" class="left"></div>
	<div ng-view id="content" ></div>
	<div id="sidebar" class="right"></div>
	<div id="footer"></div>
{% endblock %}