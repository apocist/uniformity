var flashController = Class({

	flashElement: '<div id="flash_message">',

	initialize: function(options){
		var that = this;
		//that.twitterButton = (options||{}).twitterButton;
		//$(that.flashElement).attr('id', 'flash_message');

		that.flashElement = $(that.flashElement).prependTo("body");
		that.hide();
		console.log('flash inited');
	},
	hide: function(){
		var that = this;
		$(that.flashElement).hide();
	},
	show: function(){
		var that = this;
		$(that.flashElement).show();
	},
	successMessage: function(message){
		var that = this;
		that.setMessage(message);
		that.setBGColor('00FF00', 0.5);//TODO wouldn't just CSS work better?(and allow more customization..better switch later)
		that.setFontColor('888888');

		that.displayMessage();
	},
	failMessage: function(message){
		var that = this;
		that.setMessage(message);
		that.setBGColor('FF0000', 0.5);
		that.setFontColor('EEEEEE');

		that.displayMessage();
	},
	alertMessage: function(message){
		var that = this;
		that.setMessage(message);
		that.setBGColor('FF8800', 0.5);
		that.setFontColor('888888');

		that.displayMessage();
	},
	displayMessage: function(){
		var that = this;
		//TODO display the message for XX amount of time(based on message length and min/max
		that.show();
	},
	setMessage: function(message){
		var that = this;
		$(that.flashElement).html(message);
	},
	setBGColor: function(hex, opacity){
		var that = this;
		opacity = opacity || 1;
		var fadeColor = that.colorDarkenLighten(hex) + ',' + opacity;
		var color = that.colorHexToRgb(hex) + ',' + opacity;
		$(that.flashElement).css({
			//'background-color': 'rgba('+ color +')',
			'background-image': 'linear-gradient( 165deg, rgba('+ color +'), rgba(' + fadeColor + ') 50%,rgba(' + color + ') )'
		});
	},
	setFontColor: function(color){
		var that = this;
		color = that.colorHexToRgb(color);
		$(that.flashElement).css({'color': 'rgb('+ color +')'});
	},
	colorHexToRgbArray: function(hex){
		return [(bigint = parseInt(hex, 16)) >> 16 & 255, bigint >> 8 & 255, bigint & 255];
	},
	colorHexToRgb: function(hex){
		return this.colorHexToRgbArray(hex).join();
	},
	colorLuminance: function(hex){
		var color = this.colorHexToRgbArray(hex);
		var hsp = Math.sqrt( // HSP equation from http://alienryderflex.com/hsp.html
			0.299 * (color[0] * color[0]) +//red
			0.587 * (color[1] * color[1]) +//green
			0.114 * (color[2] * color[2])//blue
		);
		return hsp;
	},
	colorDarkenLighten: function(hex){
		var color = this.colorHexToRgbArray(hex);
		if(this.colorLuminance(hex) > 127){//if light, darken
			for(var i = 0, len = color.length; i < len; i++) {
				color[i] -= 64;
				if(color[i] < 0) color[i] = 0;
			}
		} else{//if dark, lighten
			for(var i = 0, len = color.length; i < len; i++) {
				color[i] += 64;
				if(color[i] > 255) color[i] = 255;
			}
		}
		return color.join();
	}
});