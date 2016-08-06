{% extends 'base.swig' %}

{% block meta %}{% parent %}
	<base href="/">
{% endblock %}

{% block css %}
	{#{ css.stylesheet("/site/css/common") }}
	{{ css.stylesheet("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/css/bootstrap.min") }}
	{{ css.stylesheet("/site/css/customBootstrap") }#}
	{#{ css.stylesheet("https://cdnjs.cloudflare.com/ajax/libs/angular-material/1.1.0-rc4/angular-material.min") }#}
	{{ css.stylesheet("https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic") }}
	{{ css.stylesheet("https://material.angularjs.org/latest/angular-material.min.css") }}
{% endblock %}

{% block title %}Angular Test Page{% endblock %}

{% block content %}
	<div id="header" ng-include="'/site/partials/header.html'"></div>
	<div id="sidebar" class="left" ng-include="'/site/partials/navigation_sidebar.html'"></div>
	<div ng-view id="content" ></div>
	<div id="sidebar" class="right"></div>
	<div id="footer"></div>
{% endblock %}