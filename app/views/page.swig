{% extends 'base.swig' %}

{% block head %}
    {#<script type="text/javascript" src="http://underscorejs.org/underscore-min.js"></script>#}{#1.8.2#}
    <script type="text/javascript" src="http://admin.inin.pw:1337/js/underscore/underscore-1.5.2-min.js"></script>{#1.5.2#}
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
    <script type="text/javascript" src="http://backbonejs.org/backbone-min.js"></script>
    <script type="text/javascript" src="http://admin.inin.pw:1337/js/common.js"></script>
    <script type="text/javascript" src="http://admin.inin.pw:1337/js/routableEditor.js"></script>
    <script type="text/javascript">
        $(document).ready(function() {
            var editor = new RoutableEditor({
                id: 136,//dynmic page/item id
                routableType: 'Page',
                baseUrl: 'http://admin.inin.pw:1337',
                el: $('#page_container'),//The div containing the elements for Page
            });
            editor.load();//maybe should set to only load a single field
        });
        //TODO when initilzing RoutableEditor, the input fields need to be generated
    </script>
{% endblock %}

{% block title %}{{ name }}{% endblock %}

{% block content %}
    <div id="page_container">
        <h1 data-type="Page" data-var="name">{{ name }}</h1><input type="text" name="name" data-type="Page" data-var="name"/><br/>
        <br/>
        <div id="content" data-type="Page" data-var="content">
            {{ content }}
        </div><input type="text" name="content" data-type="Page" data-var="content"/>
    </div>
{% endblock %}