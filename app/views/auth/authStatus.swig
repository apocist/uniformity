{% extends 'empty.swig' %}

{% block javascript %}{% parent %}
	<script type="text/javascript">
		if (window.opener) {
			window.opener.focus();

			//var state = '<%= state %>';
			try {
				if (window.opener.uniformityController && window.opener.uniformityController.controllers.authController && window.opener.uniformityController.controllers.authController.authUpdate) {
					window.opener.uniformityController.controllers.authController.authUpdate({{ status|json|raw }});
				}
			} catch(err) {console.log(err);}
		}
		window.close();
	</script>
{% endblock %}

{% block title %}Authenticating...{% endblock %}

{% block content %}
<p>This window shall close shortly...</p>
{% endblock %}