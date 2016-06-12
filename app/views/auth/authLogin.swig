{% extends 'empty.swig' %}

{% block title %}Login{% endblock %}

{% block content %}
	{% if strategies %}
		<ul>
			{% for strat in strategies %}

				<li><a href="/auth/login/{{ strat }}">{{ strat }}</a></li>

			{% endfor %}
		</ul>
	{% else %}
		<p>There is nothing to login with. Please contact an Admin to install an Authentication Strategy.</p>
	{% endif %}

{% endblock %}