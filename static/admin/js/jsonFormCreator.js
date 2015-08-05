/**
 * http://ulion.github.io/jsonform/playground/
 * @class
 */
var jsonFormCreator = Class({
	/** Form visual options to search for when generating form(buildForm) */
	formProperties: [
		'formtype',//converted
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
	],
	/** Converts variables from schema to the form object */
	formPropertiesRename: {
		'formtype': 'type'
	},
	/** Form being generated */
	form: [],
	/** Supplied Schema */
	formSchema: {},


	/**
	 * @constructs
	 * @param formElement the div to set html into
	 * @param formSchema the schema object provided by server
	 */
	initialize: function(formElement, formSchema){
		var that = this;
		$.loadScriptsIfNeeded($.fn.jsonForm, ['/js/jsonform/dep/jsv.js','/js/jsonform/jsonform.js'], function () {
			that.formSchema = formSchema;

			that.buildForm();

			that.addButtons();

			that.finalize(formElement);
		});
	},
	/**
	 *  Adds default Submit button to bottom of form
	 *  TODO Need to define what buttons be display, i.e.: default save/submit/cancel as well as customs
	 */
	addButtons: function() {
		//then append the submit button at the end
		this.form[this.form.length] = {//TODO need more options
			"title": "Submit",
			"type": "button",
			"onClick": function (evt) {
				evt.preventDefault();//stops from auto submitting
				alert('Do something!');
			}
		};
	},
	/**
	 *  Generates Form from supplied formSchema
	 */
	buildForm: function() {
		for(var property in this.formSchema) {
			if(this.formSchema.hasOwnProperty(property)) {
				var key = {"key": property};
				for (var formProperty in this.formProperties) {
					if(this.formProperties.hasOwnProperty(formProperty)) {
						if (this.formSchema[property].hasOwnProperty(this.formProperties[formProperty])) {
							if (this.formPropertiesRename.hasOwnProperty(this.formProperties[formProperty])) {//rename properties when needed
								key[this.formPropertiesRename[this.formProperties[formProperty]]] = this.formSchema[property][this.formProperties[formProperty]];
							}
							else {
								key[this.formProperties[formProperty]] = this.formSchema[property][this.formProperties[formProperty]];
							}
						}
					}
				}
				this.form[this.form.length] = key;
			}
		}
	},
	finalize: function(formElement) {
		formElement.jsonForm({
			"schema": this.formSchema,
			"form": this.form,
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
	}/*,
	 toString: function() {
	 return "My name is "+this.name+" and I am "+this.age+" years old.";
	 }*/

});
