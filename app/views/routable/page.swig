{% extends '../base.swig' %}

{% block head %}
    {#<script type="text/javascript" src="http://underscorejs.org/underscore-min.js"></script>#}{#1.8.2#}
    {#<script type="text/javascript" src="http://admin.inin.pw:1337/js/underscore/underscore-1.5.2-min.js"></script>
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
    <script type="text/javascript" src="http://backbonejs.org/backbone-min.js"></script>
    <script type="text/javascript" src="http://admin.inin.pw:1337/js/common.js"></script>
    <script type="text/javascript" src="http://admin.inin.pw:1337/js/contentEditor.js"></script>#}

    <script type="text/javascript" src="/js/underscore/underscore-1.5.2-min.js"></script>
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
    <script type="text/javascript" src="http://backbonejs.org/backbone-min.js"></script>
    <script type="text/javascript" src="/site/js/common.js+/auth/js/authController.js"></script>
    {#<script type="text/javascript" src="/auth/js/authController.js"></script>#}
    <script type="text/javascript" src="/admin/js/contentEditor.js"></script>
    <script type="text/javascript">
        $(document).ready(function() {
            window.authController = new authController({twitterButton: $('#twitterLogin')});

            var editor = new ContentEditor({
                id: {{ hid }},
                type: '{{ type }}',
                subType: '{{ __t }}',
                //baseUrl: 'http://admin.inin.pw:1337'
            });
            editor.load();
        });
    </script>
{% endblock %}

{% block title %}{{ name }}{% endblock %}

{% block content %}
    <div id="page_container">
        <h1 data-type="routable" data-subType="Page" data-var="name">{{ name }}</h1>
        <br/>
        <div id="content" data-type="routable" data-subType="Page" data-var="content">
            {{ content }}
        </div>
        <input id="twitterLogin" type="button" value="Twitter Login"/>
    </div>
{% endblock %}