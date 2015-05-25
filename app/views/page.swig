{% extends 'base.swig' %}

{% block title %}{{ name }}{% endblock %}

{% block content %}
<h1>{{ name }}</h1>
{{ content }}
{% endblock %}