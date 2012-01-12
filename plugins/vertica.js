/* vertica.js */
/**
 * A plugin for monitoring Vertica resource allocation.
 */
var fs = require('fs');

var Plugin = {
    name: 'vertica',
    command: '',
    type: 'poll'
};

this.name = Plugin.name;
this.type = Plugin.type;

Plugin.format = function (data) {
    return data.replace(/(\r\n|\n|\r)/gm, '');
};

this.poll = function (constants, utilities, logger, callback) {
    var self = this;
    self.constants = constants;
    self.utilities = utilities;
    self.logger = logger;

    fs.readFile(self.name + '_config', function (error, fd) {
        if (error) self.utilities.exit('Error reading ' + self.name + ' plugin config file');

	var splitBuffer = fd.toString().trim().split(',');
	var database = splitBuffer[0];
	var username = splitBuffer[1];
	var password = splitBuffer[2];

	var query = "'select memory_inuse_mb from monitor.resources where node_name = (select node_name from current_session)'";
	Plugin.command = 'vsql -d ' + database + ' -U ' + username + ' -w ' + password + ' -c ' + query + ' -Pfooter -A -F \'\t\' | awk \'NR==2{print $1}\'';
	var exec = require('child_process').exec,
	    child;
        child = exec(Plugin.command, function (error, stdout, stderr) {
            if (utilities.trim(stdout.toString()) != '') {
		callback(Plugin.name, 'VerticaMemoryAllocated', 'Megabytes', Plugin.format(stdout.toString()));
            }
        });
    });
};