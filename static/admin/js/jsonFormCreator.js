var jsonFormCreator = function(formElement, formSchema){
	var formProperties = [//Form visual options to search for
		'placeholder'
	];

	var form = [];//Form being generated
	for(var property in formSchema) {
		var key = {"key": property};
		for(var formProperty in formProperties) {
			if (formSchema[property].hasOwnProperty(formProperties[formProperty])) {
				key[formProperties[formProperty]] = formSchema[property][formProperties[formProperty]];
			}
		}
		form[form.length] = key;
	}
	//then append the submit button at the end
	form[form.length] = {//TODO need more options
		"title": "Submit",
		"type": "submit"
	};

	formElement.jsonForm({
		"schema": formSchema,
		"form": form,
		onSubmit: function (errors, values) {//TODO need to supply own onSubmit
			if (errors) {
				console.log(errors);
				$('#res').html('<p>I beg your pardon?</p>');
			}
			else {
				$('#res').html('<p>Hello ' + values.name + '.' +
				(values.age ? '<br/>You are ' + values.age + '.' : '') +
				'</p>');
			}
		}
	});
}