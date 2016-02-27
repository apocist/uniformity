
module.exports = function(packageContext) {
	return {
		// package identity properties
		name: 'optional package name',
		priority: 100, // default 100
		init: function() {
			console.log('started plugin!! priorty 100');
		},

		// register hooks callbacks
		'hook-name': function() {
			//
		},
		'another-hook-name': function() {
			//
		}
	};
};