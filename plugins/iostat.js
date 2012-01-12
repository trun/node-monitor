/* iostat.js */
/**
 * A plugin for monitoring disk utilization in %.
 */
var fs = require('fs');

var Plugin = {
    name: 'iostat',
    command: '',
    type: 'poll'
};

this.name = Plugin.name;
this.type = Plugin.type;

Plugin.format = function (diskToCheck, data) {
    data = data.replace(/(\r\n|\n|\r)/gm, '');
    data = data.replace('%', '');
    data = {
        disk: diskToCheck,
        size: data
    };
    return JSON.stringify(data);
};

this.poll = function (constants, utilities, logger, callback) {
    var self = this;
    self.constants = constants;
    self.utilities = utilities;
    self.logger = logger;

    var disks = [];
    fs.readFile(self.name + '_config', function (error, fd) {
        if (error) self.utilities.exit('Error reading ' + self.name + ' plugin config file');

        var splitBuffer = [];
        splitBuffer = fd.toString().split('\n');
        for (var i = 0; i < splitBuffer.length; i++) {
            var disk = splitBuffer[i];
            if (utilities.trim(disk) != '') {
            	self.logger.write(self.constants.levels.INFO, 'Disk to check: ' + disk);
            	disks.push(disk);
            }
        }

        disks.forEach(function (diskToCheck) {
	    Plugin.command = 'iostat -x \'' + diskToCheck + '\' 1 2 | awk \'NR==13{ print $12 }\'';
            var exec = require('child_process').exec,
                child;
            child = exec(Plugin.command, function (error, stdout, stderr) {
		if (utilities.trim(stdout.toString().replace('%', '')) != '') {
		    callback(Plugin.name, 'DiskUtilization', 'Percent', stdout.toString().replace('%', ''), Plugin.format(diskToCheck, stdout.toString()), { Disk: diskToCheck });
		}
            });
        });
    });
};