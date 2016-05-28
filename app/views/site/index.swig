{% extends 'base.swig' %}

{% block javascript %}{% parent %}
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