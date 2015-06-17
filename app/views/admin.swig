{% extends 'base.swig' %}

{% block title %}{{ title }}{% endblock %}

{% block head %}
    <link rel="stylesheet" type="text/css" href="/css/admin.css">
    <script type="text/javascript" src="http://underscorejs.org/underscore-min.js"></script>
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
    <script type="text/javascript" src="http://backbonejs.org/backbone-min.js"></script>
    <script type="text/javascript" src="/js/routablePanel.js"></script>
    <script >
        $(document).ready(function(){
            //var routablePanel =
                    new RoutablePanel({{ formSchema|json|raw }});
        });
    </script>
{% endblock %}

{% block content %}
    <div id="routabletypelist"></div>
    {#<button id="refresh" style="float:left;">Refresh</button>#}
    <div id="pagelist"></div>
    <form id="creator">
        <fieldset>
            <legend>New Page</legend>
            <input type="text" name="name" placeholder="Page Name" required />
            <input type="text" name="content" placeholder="Page Content" required />
            <input type="text" name="url" placeholder="Route Url" required />
            <input type="button" id="post_routable" value="Create Page" />
        </fieldset>
    </form>

{% endblock %}