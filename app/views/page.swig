{% extends 'base.swig' %}

{% block head %}
    {#<script type="text/javascript" src="http://underscorejs.org/underscore-min.js"></script>#}{#1.8.2#}
    {#jsonform is incompatible with underscore 1.8, the jsonform-dev branch works with 1.8, but wait until required field is fixed#}
    <script type="text/javascript" src="http://admin.inin.pw:1337/js/underscore/underscore-1.5.2-min.js"></script>{#1.5.2#}
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
    <script type="text/javascript" src="http://backbonejs.org/backbone-min.js"></script>
    <script type="text/javascript" src="http://admin.inin.pw:1337/js/common.js"></script>
    <script type="text/javascript" src="http://admin.inin.pw:1337/js/routableEditor.js"></script>
    <script type="text/javascript">
        $(document).ready(function() {
            var editor = new RoutableEditor({
                id: 136,
                routableType: 'Page',
                baseUrl: 'http://admin.inin.pw:1337',
                formEl: $('#testForm')
            });
            editor.load('varname');
        });
    </script>
{% endblock %}

{% block title %}{{ name }}{% endblock %}

{% block content %}
<h1>{{ name }}</h1>
    <form id="testForm">
        <input type="text" name="varname[name]"/>
    </form>
{{ content }}
{% endblock %}