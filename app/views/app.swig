<!doctype html>
<html>
<head>
	<base href="/">
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic">
	<link rel="stylesheet" type="text/css" href="https://material.angularjs.org/latest/angular-material.min.css">
	<link rel="stylesheet" type="text/css" href="/site/css/common.css">
	<script data-main="site/js/requireConfig" src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.2.0/require.min.js"></script>
	<title ng-bind="title">Uniformity</title>
</head>
<body>
	<div layout="column">
		<div id="header" ng-include="'/site/partials/header.html'" ng-cloak></div>
		<div id="content_section" ng-include="'/site/partials/content-section.html'" ng-cloak></div>
		<div id="footer" ng-include="'/site/partials/footer.html'" ng-cloak></div>
	</div>
</body>
</html>