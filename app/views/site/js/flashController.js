define(['jquery','common'], function($){
	return Class({

		flashElement: '<div id="flashMessage">',
		timer: null,

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
			//$(that.flashElement).hide();
			$(that.flashElement).removeClass('visible');
		},
		show: function(){
			var that = this;
			//$(that.flashElement).show();
			$(that.flashElement).addClass('visible');
		},
		removeTypes: function(){
			var that = this;
			$(that.flashElement).removeClass('success fail alert info');
		},
		successMessage: function(message){
			var that = this;
			that.removeTypes();
			that.setMessage(message);
			$(that.flashElement).addClass('success');

			that.displayMessage();
		},
		failMessage: function(message){
			var that = this;
			that.removeTypes();
			that.setMessage(message);
			$(that.flashElement).addClass('fail');

			that.displayMessage();
		},
		alertMessage: function(message){
			var that = this;
			that.removeTypes();
			that.setMessage(message);
			$(that.flashElement).addClass('alert');

			that.displayMessage();
		},
		infoMessage: function(message){
			var that = this;
			that.removeTypes();
			that.setMessage(message);
			$(that.flashElement).addClass('info');

			that.displayMessage();
		},
		displayMessage: function(){
			var that = this;
			clearTimeout(that.timer);
			that.timer = setTimeout(function(){that.hide(); }, 3000);
			that.show();
		},
		setMessage: function(message){
			var that = this;
			$(that.flashElement).html(message);
		}/*,
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
		}*/
	});
});