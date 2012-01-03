/* services.js */
/**
 * A plugin for monitoring running applications.
 */
var fs = require('fs');

var modules = {
    net: 'net'
};

var Plugin = {
    name: 'services',
    command: '',
    type: 'poll'
};

this.name = Plugin.name;
this.type = Plugin.type;

Plugin.format = function (response, processName) {
    var data = {
        service: processName,
        status: response
    };
    return JSON.stringify(data);
};

Plugin.evaluateDeps = function (self) {
    for (var name in modules) {
    	self.logger.write(self.constants.levels.INFO, 'Evaluating dependency in plugin: ' + Plugin.name + ', with name: ' + name + ', path:' + modules[name]);
        eval('var ' + name + ' = require(\'' + modules[name] + '\')');
    }
    self.net = net;
};

this.poll = function (constants, utilities, logger, callback) {
    self = this;
    self.constants = constants;
    self.utilities = utilities;
    self.logger = logger;

    Plugin.evaluateDeps(self);

    var services = [];
    fs.readFile(self.name + '_config', function (error, fd) {
        if (error) self.utilities.exit('Error reading ' + self.name + ' plugin config file');

        function Service(name, port) {
            this.name = name;
            this.port = port;
        }

        var splitBuffer = [];
        splitBuffer = fd.toString().split('\n');
        for (i = 0; i < splitBuffer.length; i++) {
            var service = splitBuffer[i].split('=');
            if (!self.utilities.isEmpty(service[1])) {
                self.logger.write(self.constants.levels.INFO, 'Checking for service ' + service[0] + ' on port: ' + service[1]);
                services.push(new Service(service[0], Number(service[1])));
            } else {
            	if (!self.utilities.isEmpty(service[0])) {
            		self.logger.write(self.constants.levels.INFO, 'Checking for service ' + service[0]);
            		services.push(new Service(service[0], 0));
            	}
            }
        }

        services.forEach(function (service) {
            if (service.port != 0) {
                Plugin.command = 'lsof -i :' + service.port;
                var exec = require('child_process').exec,
                    child;
                child = exec(Plugin.command, function (error, stdout, stderr) {
                    var running;
                    if (stdout.toString() == '') {
                        running = '0';
                        self.logger.write(self.constants.levels.INFO, service.name + ' is NOT running');
                    } else {
                        running = '1';
                        self.logger.write(self.constants.levels.INFO, service.name + ' is running');
                    }
                    callback(Plugin.name, 'RunningProcess-' + service.name, 'None', running, Plugin.format(running, service.name));
                });
            } else {
                Plugin.command = 'ps ax | grep -v grep | grep -v tail | grep ' + service.name;
                var exec = require('child_process').exec,
                    child;
                child = exec(Plugin.command, function (error, stdout, stderr) {
                    var running;
                    if (stdout.toString() == '') {
                        running = '0';
                        self.logger.write(self.constants.levels.INFO, service.name + ' is NOT running');
                    } else {
                        running = '1';
                        self.logger.write(self.constants.levels.INFO, service.name + ' is running');
                    }
                    callback(Plugin.name, 'RunningProcess-' + service.name, 'None', running, Plugin.format(running, service.name));
                });
            }
        });
    });
};