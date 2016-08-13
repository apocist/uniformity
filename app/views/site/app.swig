{% extends 'base.swig' %}

{% block meta %}{% parent %}
	<base href="/">
{% endblock %}

{% block css %}
	{#{ css.stylesheet("/site/css/common") }}
	{{ css.stylesheet("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/css/bootstrap.min") }}
	{{ css.stylesheet("/site/css/customBootstrap") }#}
	{#{ css.stylesheet("https://cdnjs.cloudflare.com/ajax/libs/angular-material/1.1.0-rc4/angular-material.min") }#}
	{{ css.stylesheet("https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic") }}
	{{ css.stylesheet("https://material.angularjs.org/latest/angular-material.min.css") }}
	{{ css.stylesheet("/site/css/common.css") }}
{% endblock %}

{% block content %}
	{% raw %}
		<div layout="column">
			<div id="header" ng-include="'/site/partials/header.html'" ng-cloak></div>
			<div id="content_section" ng-include="'/site/partials/content-section.html'" ng-cloak></div>
			<div id="footer" ng-include="'/site/partials/footer.html'" ng-cloak></div>
		</div>
	{% endraw %}
{% endblock %}