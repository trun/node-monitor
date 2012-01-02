/* client.js */
/* To run: node client.js ec2=true/false debug=true/false console=true/false cloudwatch=true/false */

/* Dependency management */
var fs = require('fs'), location = 'test.js';

/* Error handling */
process.on('uncaughtException', function(error) {
	console.log('Caught unhandled node.js exception: ' + error);
});

/* Dependencies */
var modules = {
	constantsManager : '../submodules/constants-manager',
	utilitiesManager : '../submodules/utilities-manager',
};

/**
 * NodeMonitor
 * 
 * @returns {NodeMonitor}
 */
function NodeMonitor() {
	console.log('NodeMonitor');
	/**
	 * Init
	 * 
	 * @param callback
	 * @returns {Init}
	 */
	function Init(callback) {
		console.log('Init');

		try {
			process.chdir('../submodules');
		} catch (Exception) {
			console.log('Error loading submodule dir');
		}

		/* Setup dependencies */
		for ( var name in modules) {
			console.log('Evaluating dependency in location: ' + location
					+ ', with name: ' + name + ', path:' + modules[name]);
			eval('var ' + name + ' = require(\'' + modules[name] + '\')');
		}

		var constants = new constantsManager.ConstantsManagerModule();
		var utilities = new utilitiesManager.UtilitiesManagerModule(constants);

		/* Use global object for config options */
		constants.globals = {};

		/* Read config into global object */
		utilities.readConfig(constants.strings.MONITOR_CONFIG_FILE, function() {
			console.log('callback done!');
			for ( var i in constants.globals) {
				console.log('callback debug: ' + constants.globals[i] + ', i: '
						+ i);
			}
		});
	}

	this.init = new Init();
}

var nodeMonitor = new NodeMonitor();
nodeMonitor.init(function() {
	// nodeMonitor.plugins.start();
	// nodeMonitor.tailing.start();
});
