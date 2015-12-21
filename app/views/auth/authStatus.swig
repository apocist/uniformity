{% extends '../base.swig' %}

{% block head %}
	<script type="text/javascript">
		if (window.opener) {
			window.opener.focus();

			//var state = '<%= state %>';
			try {
				if (window.opener.authController && window.opener.authController.authUpdate) {
					window.opener.authController.authUpdate({{ status|json|raw }});
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