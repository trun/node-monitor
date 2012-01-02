/* tailing-manager.js */

/**
 * A plugin for monitoring logs.
 */

var fs = require('fs'), Module = {}, location = 'tailing-manager.js';

/* Dependencies */
var modules = {
	step : '../node_modules/step',
	loggingModule : './logging-manager'
};

LogManagerModule = function(constants, utilities) {
	Module = this;
	Module.utilities = utilities;
	Module.constants = constants;

	/* Change directory to eval dependencies */

	try {
		process.chdir(process.env['libDirectory']);
	} catch (Exception) {
	}

	try {
		process.chdir(process.env['moduleDirectory']);
	} catch (Exception) {
	}

	/* Setup dependencies */
	for ( var name in modules) {
		console.log('Evaluating dependency in location: ' + location
				+ ', with name: ' + name + ', path:' + modules[name]);
		eval('var ' + name + ' = require(\'' + modules[name] + '\')');
	}

	var logger = new loggingModule.LoggingManagerModule(constants, utilities);
	Module.logger = logger;
	Module.step = step;
};

LogManagerModule.prototype.start = function() {
	fs.readFile(process.env['logConfigFile'], function(error, buffer, fd) {
		if (error) {
			Module.logger.write(Module.constants.levels.SEVERE,
					'Error reading config file: ' + error.stack);
			return;
		}

		var splitBuffer = [];
		splitBuffer = buffer.toString().split('\n');
		for ( var i = 0; i < splitBuffer.length; i++) {
			Module.logger.write(Module.constants.levels.INFO,
					'Found log in config: ' + splitBuffer[i]);

			var logName = splitBuffer[i];
			Module.logsToMonitor.push(logName);

			if (logName != 'none' || logName != '') {
				// (process.env['clientIP']), logName);
			}
		}
		Module.asyncTailing();
	});
};

/**
 * For each of the specified logs, we start a tailing process.
 */
LogManagerModule.prototype.asyncTailing = function() {
	Module.step(function tailAll() {
		var self = this;
		NodeMonitorObject.logsToMonitor.forEach(function(log) {
			if (log != 'none' || logName != '') {
				Module.logger.write(Module.constants.levels.INFO,
						'Now tailing log: ' + log);
				Module.tailFile(log, self.parallel());
			}
		});
	}, function finalize(error) {
		if (error) {
			Module.logger.write(Module.constants.levels.SEVERE,
					'Error tailing log file: ' + error);
			return;
		}
	});
};

/**
 * It is important to note that -F is correct if the log file rolls, and we
 * always ignore the first one.
 */
LogManagerModule.prototype.tailFile = function(logName, callback) {
	var count = 0;
	var spawn = require('child_process').spawn;
	var tail = spawn('tail', [ '-F', logName ]);

	/* Store the process ID of the file so we can kill it */
	var logPid = tail.pid;

	var pidData = {
		log : logName,
		pid : logPid
	};
	pidData = JSON.stringify(pidData);

	NodeMonitorObject.sendDataLookup(Module.utilities
			.formatLookupLogPidKey(process.env['clientIP']), pidData);

	/* Capture tailing info */
	tail.stdout.on('data', function(data) {
		if (count == 0) {
			count++;
		} else {
			NodeMonitorObject.sendDataLookup(Module.utilities
					.formatLookupLogKey(process.env['clientIP']), logName);
			NodeMonitorObject.sendData(Module.constants.api.LOGS,
					Module.utilities.formatLogKey(process.env['clientIP'],
							logName), Module.utilities.format(
							Module.constants.api.LOGS, data.toString().replace(
									/(\r\n|\n|\r)/gm, '')));
		}
	});
};

exports.LogManagerModule = LogManagerModule;