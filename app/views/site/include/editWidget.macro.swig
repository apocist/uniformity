{% macro addTags(editVarName) %}
	data-editable="true" data-id="{{ _id | raw }}"{% if type %} data-type="{{ __t }}" {% endif %}{#% if __t %} data-subType="{{ __t }}"{% endif %#} data-var="{{ editVarName }}"
{% endmacro %}
{% macro create(editVarName, editVarData, options) %}
	<{% if options.tag %}{{ options.tag }}{% else %}div{% endif %}{% if options.id %} id="{{ options.id }}" {% endif %}{% if options.class %} class="{{ options.class }}"{% endif %} {{ addTags(editVarName) }}>
		{{ editVarData }}
	</{% if options.tag %}{{ options.tag }}{% else %}div{% endif %}>
{% endmacro %}