/* plugins.js */
var fs = require('fs'),
    Module = {},
    location = 'plugins.js';

PluginsManagerModule = function (constants, utilities, logger, dao) {
    Module = this;
    Module.constants = constants;
    Module.utilities = utilities;
    Module.logger = logger;
    Module.dao = dao;
};

PluginsManagerModule.prototype.start = function () { 
	
	Module.logger.write(Module.constants.levels.INFO, 'Evaluating plugins');
	
	/* Switch to plugins directory */
    try {
        process.chdir(Module.constants.strings.PLUGIN_DIRECTORY);
    } catch (Exception) {
        Module.logger.write(Module.constants.levels.SEVERE, 'Error switching to plugins directory: ' + Exception);
    }

    Module.plugins = {};

    var pluginCount = 0;
    var plugins = fs.readdirSync(process.cwd());
    plugins.forEach(function (plugin) {
        if (plugin.indexOf('_config') == -1) {
            plugin = plugin.split('.')[0];
            var loaded = require(process.cwd() + '/' + plugin);
            Module.plugins[loaded.name] = loaded;

            /* Validate plugin type */
            if (!Module.utilities.validateType(loaded.type)) Module.utilities.exit('Plugin type is not defined');

            Module.logger.write(Module.constants.levels.INFO, 'Loading plugin: ' + loaded.name.toString() + ', of type: ' + loaded.type);
            pluginCount++;
        }
    });

    Module.logger.write(Module.constants.levels.INFO, pluginCount + ' plugin(s) loaded, beginning long polling');
    Module.executePlugins();
};

PluginsManagerModule.prototype.executePlugins = function () {
    if (Module.interval) clearInterval(Module.interval);

    Module.interval = setInterval(function () {
        for (var plugin in Module.plugins) {
            Module.logger.write(Module.constants.levels.INFO, 'Running plugin: ' + plugin);
            Module.plugins[plugin].poll(
            Module.constants, Module.utilities, Module.logger, function (
            pluginName, metricName, unit, value, data) {
                Module.logger.write(Module.constants.levels.INFO, 'Returning metrics for plugin: ' + pluginName);
                /* Post to CloudWatch */
                Module.dao.postCloudwatch(metricName, unit, value); 
                /* Store JSON */
                // Module.dao.write(pluginName, data);
            });
        } /* Duration between poll times */
    }, Number(process.env[Module.constants.strings.PLUGIN_POLL_TIME]) * 1000);
};

exports.PluginsManagerModule = PluginsManagerModule;