var 	exec = require('child_process').exec,
		pluginController = require('./app/controllers/plugin'),
		child;



var name = process.argv[2] || null,
	keywords;

if(!name){
	console.log("Installs a uniformity plugin from the npmjs repo:\n");
	console.log("Syntax: npm run plugin <plugin name>");
	console.log("e.g.: npm run plugin uniformity-blog");

} else {
	//todo first check if one is already installed... if not then check if that module is already in 'node modules'
	console.log("Will install the plugin '"+name+"', fetching record...");

	child = exec('npm show '+name+' keywords', function (error, stdout, stderr) {
		if (error !== null) {
			console.error('exec error: ' + error);
		} else if (stderr != null && stderr.length > 0) {
			console.error('stderr: ' + stderr);
		} else if (stdout !== null && stdout.length > 0) {
			try{
				//console.log(JSON.parse(stdout.replace(/(['"])?([a-z0-9A-Z_.-]+)(['"])?:[ \n]/g, '"$2": ').replace(/(['])/g, '"')));//parses most...fails many times...just get keywords instead
				keywords = JSON.parse(stdout.replace(/(['])/g, '"'));
			} catch(e){console.error(e);}
			if(keywords){
				if (keywords.indexOf('uniformity') >= 0 && keywords.indexOf('plugin') >= 0) {
					console.log("Installing '"+name+"'");
					child = exec('npm install '+name, function (error, stdout, stderr) {
						if (stdout !== null) {
							console.log('stdout: ' + stdout);
						}
						if (stderr !== null && stderr.length > 0) {
							console.log('stderr: ' + stderr);
						}
						if (error !== null) {
							console.log('exec error: ' + error);
						}
						if(error == null){
							pluginController.load(function(){
								pluginController.addPlugin(name);
								pluginController.save();
								console.log("'"+name+"' installed and saved.");
							});
						}
					});
				} else {
					console.warn("'"+name+"' does not seem to be a uniformity plugin, cancelling...");
				}
			}

		}


	});
}

