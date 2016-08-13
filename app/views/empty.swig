<!doctype html>
<html class="{% block htmlClass %}{% endblock %}">
<head>
	{% block head %}{% endblock %}
	{% block meta %}{% endblock %}

	{% block css %}{% endblock %}

	{% block javascript %}{% endblock %}

	<title ng-bind="title">{% block title %}{% endblock %}</title>
</head>
<body class="{% block bodyClass %}{% endblock %}">
	{% block content %}{% endblock %}
</body>
</html>