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
	<div ng-view id="template_body" >

	</div>
{% endblock %}