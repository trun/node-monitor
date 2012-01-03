/* health.js */
/**
 * A plugin for monitoring the monitor.
 */
var fs = require('fs');

var Plugin = {
    name: 'health',
    command: '',
    type: 'poll'
};

this.name = Plugin.name;
this.type = Plugin.type;

Plugin.format = function (response) {
    var data = {
        status: response
    };
    return JSON.stringify(data);
};

this.poll = function (constants, utilities, logger, callback) {
    self = this;
    self.constants = constants;
    self.utilities = utilities;
    self.logger = logger;

    var exec = require('child_process').exec,
        child;
    child = exec(Plugin.command, function (error, stdout, stderr) {
        callback(Plugin.name, 'NodeMonitor', 'None', '1', Plugin.format('1'));
    });
};