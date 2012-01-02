/* lsof.js */
/**
 * A plugin for monitoring open files.
 */
var fs = require('fs');

var Plugin = {
    name: 'lsof',
    command: 'lsof | wc -l',
    type: 'poll'
};

this.name = Plugin.name;
this.type = Plugin.type;

Plugin.format = function (data) {
    data = data.replace(/^(\s*)((\S+\s*?)*)(\s*)$/, '$2');
    data = data.replace('%', '');
    return data;
};

this.poll = function (constants, utilities, logger, callback) {
    self = this;
    self.constants = constants;
    self.utilities = utilities;
    self.logger = logger;

    var exec = require('child_process').exec,
        child;
    child = exec(Plugin.command, function (error, stdout, stderr) {
        callback(Plugin.name, 'OpenFiles', 'Count', Plugin.format(stdout.toString()), Plugin.format(stdout.toString()));
    });
};