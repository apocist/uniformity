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

{% block title %}Angular Test Page{% endblock %}

{% block content %}
	<div layout="column">
		<div id="header" ng-include="'/site/partials/header.html'"></div>
		<div layout="row">
			{#<div id="sidebar" class="left" ng-include="'/site/partials/navigation_sidebar.html'" flex="20"></div>#}
			{%  raw %}
			<div id="sidebar-left" ng-controller="navigationController" ng-cloak >
				<md-sidenav
						class="md-sidenav-left"
						md-component-id="left"
						md-disable-backdrop
						md-is-open="isSubMenu"
						md-is-locked-open="isSubMenu"
						md-whiteframe="4">
					<md-toolbar class="md-theme-indigo">
						<h1 class="md-toolbar-tools">Sidenav Left</h1>
					</md-toolbar>
					<md-content layout-padding >
						<p>
							This sidebar should only appear if there are sub menu items
						</p>
						<script type="text/ng-template" id="treeMenu">
							<a href="{{menuItem.url}}" ng-class="isActiveLink('{{menuItem.url}}')">{{menuItem.name}}</a>
							<ul ng-if="(SiteMap | filter:{parent : menuItem._id}).length > 0">
								<li ng-repeat="menuItem in SiteMap | filter:{parent : menuItem._id} | orderBy: 'priority' track by menuItem._id"  ng-include="'treeMenu'"></li>
							</ul>
						</script>
						<ul class="main-navigation">
							<li ng-repeat="menuItem in SiteMap | filter:{parent : primaryMenuItem._id} | orderBy: 'priority' track by menuItem._id" ng-include="'treeMenu'"></li>
						</ul>
					</md-content>
				</md-sidenav>

			</div>{%  endraw %}
			<div ng-view id="content" ></div>
			<div id="sidebar-right"></div>
		</div>

		<div id="footer"></div>
	</div>
{% endblock %}