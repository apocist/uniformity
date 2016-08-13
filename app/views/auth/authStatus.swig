{% extends 'empty.swig' %}

{% block javascript %}{% parent %}
	<script type="text/javascript">
		if (window.opener) {
			window.opener.focus();
			try {
					window.opener.postMessage({{ status|json|raw }}, '*');
			} catch(err) {console.log(err);}
		}
		window.close();
	</script>
{% endblock %}

{% block title %}Authenticating...{% endblock %}

{% block content %}
<p>This window shall close shortly...</p>
{% endblock %}