{% extends '../base.swig' %}

{% block head %}
	<script type="text/javascript" src="/js/underscore/underscore-1.5.2-min.js"></script>
	<script type="text/javascript" src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
	<script type="text/javascript" src="http://backbonejs.org/backbone-min.js"></script>
	<script type="text/javascript" src="/site/js/common.js"></script>
	<script type="text/javascript">
		//$(document).ready(function() {
			var test = function(){
				$.getJSON( "/auth/apitest", {whee: 'blank'}, function(data) {
					console.log( "success" );
					console.log(data);
				});
			};
	   // });
	</script>
{% endblock %}

{% block title %}{{ title }}{% endblock %}

{% block content %}
<h1>{{ title }}</h1>
<p>This is the default index page. Set a Routable's URL to "/" to replace this page.</p>
{% endblock %}