{% extends 'empty.swig' %}

{% import 'site/include/css.macro.swig' as css %}
{% import 'site/include/editWidget.macro.swig' as editWidget %}

{% block meta %}{% parent %}
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
{% endblock %}

{% block css %}{% parent %}
	{{ css.stylesheet("/site/css/common") }}
	{{ css.stylesheet("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/css/bootstrap.min") }}
	{{ css.stylesheet("/site/css/customBootstrap") }}
{% endblock %}

{% block javascript %}{% parent %}
	<script data-main="site/js/requireConfig" src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.2.0/require.min.js"></script>
{% endblock %}

{% block title %}Uniformity{% endblock %}

