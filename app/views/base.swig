{% extends 'empty.swig' %}

{% block meta %}{% parent %}
	<meta charset="utf-8">
{% endblock %}

{% block css %}{% parent %}
	<link rel="stylesheet" type="text/css" href="/site/css/common.css">
{% endblock %}

{% block javascript %}{% parent %}

	{#<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
	<script type="text/javascript" src="http://code.jquery.com/jquery-2.2.1.min.js"></script>
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.1/backbone-min.js"></script>#}
	<script data-main="site/js/requireConfig" src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.2.0/require.min.js"></script>
	{#<script type="text/javascript" src="/site/js/common.js"></script>
	<script type="text/javascript" src="/site/js/flashController.js"></script>
	<script type="text/javascript" src="/auth/js/authController.js"></script>
	<script type="text/javascript" src="/admin/js/contentEditor.js"></script>#}
{% endblock %}

{% block title %}Uniformity{% endblock %}

