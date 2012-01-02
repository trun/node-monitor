/* client.js */
/* To run: node client.js ec2=true/false debug=true/false console=true/false cloudwatch=true/false */
var fs = require('fs'),
    location = 'client.js';

/* Error handling */
require('long-stack-traces');
process.on('uncaughtException', function (error) {
    console.log('Caught unhandled node.js exception: ' + error);
});

var modules = {
    constantsModule: '../submodules/constants-manager',
    utilitiesModule: '../submodules/utilities-manager',
    credentialsModule: '../modules/credential-manager',
    daoModule: '../modules/dao-manager',
    tailingModule: '../modules/tailing-manager',
    pluginsModule: '../modules/plugins-manager',
    loggingModule: '../modules/logging-manager'
};

/* Setup dependencies */
for (var name in modules) {
    console.log('Evaluating dependency in location: ' + location + ', with name: ' + name + ', path:' + modules[name]);
    eval('var ' + name + ' = require(\'' + modules[name] + '\')');
}

/**
 * NodeMonitor
 * 
 * @returns {NodeMonitor}
 */

function NodeMonitor() {
    this.init = function (callback) {
        var constants = new constantsModule.ConstantsManagerModule();
        var utilities = new utilitiesModule.UtilitiesManagerModule(constants);
        var credentials = new credentialsModule.CredentialManagerModule(constants, utilities);
        var plugins = new pluginsModule.PluginsManagerModule(constants, utilities);
        var tailing = new tailingModule.LogManagerModule(constants, utilities);

        this.constants = constants;
        this.plugins = plugins;
        this.tailing = tailing;

        /* Use object to store config options */
        constants.globals = {};

        /* Parse configuration */
        utilities.parseConfig(
        constants.strings.MONITOR_CONFIG_FILE, function () { 
        	/* Parse command line options */
           utilities.parseCommandLineOptions(function () {
               if (constants.globals[constants.strings.EC2] == constants.strings.TRUE) {
                   /* Use EC2-metadata script */
                   utilities.autoPopulate();
               } else {
                   /* Default to localhost */
                   constants.globals[constants.strings.INSTANCE_ID] = 'none';
                   constants.globals[constants.strings.LOCAL_IPV4] = '127.0.0.1';
                   constants.globals[constants.strings.PUBLIC_HOSTNAME] = '127.0.0.1';
               }

               /* Set default IP */
               constants.globals[constants.strings.IP] = constants.globals[constants.strings.LOCAL_IPV4];

               /* Validate credentials */
               credentials.check();
               callback();
           });
        });
    };
}

var nodeMonitor = new NodeMonitor();
nodeMonitor.init(function() {
	/* Debug */
	for (var i in nodeMonitor.constants.globals) {
	    console.log('Global parameter: ' + i + ', with value: ' + nodeMonitor.constants.globals[i]);
	}
	nodeMonitor.plugins.start();
	// nodeMonitor.tailing.start();
});