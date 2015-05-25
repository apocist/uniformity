{% extends 'base.swig' %}

{% block title %}{{ name }}{% endblock %}

{% block content %}
<h1>{{ name }}</h1>
<h3>{{ posted|date('F jS, Y') }}</h3>
{{ content }}
{% endblock %}