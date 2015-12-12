{% extends 'base.swig' %}

{% block head %}
    {#<script type="text/javascript" src="http://underscorejs.org/underscore-min.js"></script>#}{#1.8.2#}
    <script type="text/javascript" src="http://admin.inin.pw:1337/js/underscore/underscore-1.5.2-min.js"></script>{#1.5.2#}
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
    <script type="text/javascript" src="http://backbonejs.org/backbone-min.js"></script>
    <script type="text/javascript" src="http://admin.inin.pw:1337/js/common.js"></script>
    <script type="text/javascript" src="http://admin.inin.pw:1337/js/contentEditor.js"></script>
    <script type="text/javascript">
        $(document).ready(function() {
            var editor = new ContentEditor({
                id: {{ hid }},
                type: '{{ type }}',
                subType: '{{ __t }}',
                baseUrl: 'http://admin.inin.pw:1337'
            });
            editor.load();
        });
    </script>
{% endblock %}

{% block title %}{{ name }}{% endblock %}

{% block content %}
<h1 data-type="routable" data-subType="Blog" data-var="name">{{ name }}</h1>
<h3>{{ posted|date('F jS, Y') }}</h3> {# TODO need a form type field #}
<div data-type="routable" data-subType="Blog" data-var="content">
    {{ content }}
</div>
{% endblock %}