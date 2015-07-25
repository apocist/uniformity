/**
 * http://ulion.github.io/jsonform/playground/
 * @param formElement the div to set html into
 * @param formSchema the schema object provided by server
 */
var jsonFormCreator = function(formElement, formSchema){
	var formProperties = [//Form visual options to search for to put in the form object
		'formtype',
		'placeholder',
		'step',
		'aceMode',
		'aceTheme',
		'width',
		'height'/*,
		'inlinetitle',
		'titleMap',
		'imageWidth',
		'imageHeight',
		'imageButtonClass',
		'imagePrefix',
		'imageSuffix',
		'imageSelectorColumn',
		'imageSelectorTitle',
		'expandable',
		'items'*/
	];

	//Converts variables from schema to the form object
	var formPropertiesRename = {
		'formtype': 'type'
	};

	var form = [];//Form being generated
	for(var property in formSchema) {
		var key = {"key": property};
		for(var formProperty in formProperties) {
			if (formSchema[property].hasOwnProperty(formProperties[formProperty])) {
				if(formPropertiesRename.hasOwnProperty(formProperties[formProperty])){//rename properties when needed
					key[formPropertiesRename[formProperties[formProperty]]] = formSchema[property][formProperties[formProperty]];
				}
				else{key[formProperties[formProperty]] = formSchema[property][formProperties[formProperty]];}
			}
		}
		form[form.length] = key;
	}
	//then append the submit button at the end
	form[form.length] = {//TODO need more options
		"title": "Submit",
		"type": "button",
		"onClick": function (evt) {
			evt.preventDefault();//stops from auto submitting
			alert('Do something!');
		}
	};

	formElement.jsonForm({
		"schema": formSchema,
		"form": form,
		/*onSubmit: function (errors, values) {//TODO need to supply own onSubmit
			if (errors) {
				console.log(errors);
				$('#res').html('<p>I beg your pardon?</p>');
			}
			else {
				$('#res').html('<p>Hello ' + values.name + '.' +
				(values.age ? '<br/>You are ' + values.age + '.' : '') +
				'</p>');
			}
		}*/
	});
}