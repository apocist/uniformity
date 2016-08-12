{% extends 'empty.swig' %}

{% block javascript %}{% parent %}
	<script type="text/javascript">
		if (window.opener) {
			window.opener.focus();
			try {
				if (window.opener.authService && window.opener.authService.setUser) {
					window.opener.postMessage({{ status|json|raw }}, '*');

				} else {console.error(window.opener.authService);}
			} catch(err) {console.log(err);}
		}
		window.close();
	</script>
{% endblock %}

{% block title %}Authenticating...{% endblock %}

{% block content %}
<p>This window shall close shortly...</p>
{% endblock %}