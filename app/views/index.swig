{% extends 'base.swig' %}

{% block title %}{{ title }}{% endblock %}

{% block content %}
<h1>{{ title }}</h1>
<p>This is the default index page. Set a Routable's URL to "/" to replace this page.</p>
{% endblock %}