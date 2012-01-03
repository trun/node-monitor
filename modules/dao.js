/* dao.js */
var fs = require('fs'),
    Module = {},
    location = 'dao.js';

/* Path to dependencies from file */
var modules = {
    cloudwatch: '../libs/node-cloudwatch'
};

DaoManagerModule = function (constants, utilities, logger, dao) {
    Module = this;
    Module.constants = constants;
    Module.utilities = utilities;
    Module.logger = logger;
    Module.dao = dao;

    /* Setup dependencies */
    
    for (var name in modules) {
    	/* Debug */
        /* console.log('Evaluating dependency in location: ' + location + ', with name: ' + name + ', path:' + modules[name]); */
        eval('var ' + name + ' = require(\'' + modules[name] + '\')');
    }

    var CloudwatchApi = new cloudwatch.AmazonCloudwatchClient();
    Module.cloudwatchApi = CloudwatchApi;
};

DaoManagerModule.prototype.debugMode = function () {
    if (Module.constants.globals['debug'] == 'true') return true;

    return false;
};

DaoManagerModule.prototype.write = function (pluginName, jsonString) {
    if (Module.utilities.validateData(jsonString)) return true;

    Module.logger.write(Module.constants.levels.WARNING, 'Data is not valid JSON');
    return false;
};

DaoManagerModule.prototype.postCloudwatch = function (metricName, unit, value) { 
	/* If we're in debug mode, don't post */
    if (this.debugMode()) return;

    /* If we're not on EC2, don't post */
    if (Module.constants.globals[Module.constants.strings.EC2] != Module.constants.strings.TRUE) return;

    var params = {};

    params['Namespace'] = process.env['cloudwatchNamespace'];
    params['MetricData.member.1.MetricName'] = metricName;
    params['MetricData.member.1.Unit'] = unit;
    params['MetricData.member.1.Value'] = value;
    params['MetricData.member.1.Dimensions.member.1.Name'] = 'InstanceID';
    params['MetricData.member.1.Dimensions.member.1.Value'] = Module.constants.globals[Module.constants.strings.INSTANCE_ID];

    Module.logger.write(Plugin.constants.levels.INFO, 'CloudWatch IP: ' + Module.constants.globals[Module.constants.strings.INSTANCE_ID]);
    Module.logger.write(Plugin.constants.levels.INFO, 'CloudWatch MetricName: ' + metricName);
    Module.logger.write(Plugin.constants.levels.INFO, 'CloudWatch Unit: ' + unit);
    Module.logger.write(Plugin.constants.levels.INFO, 'CloudWatch Value: ' + value);

    /* If we specified a parameter to enable, then we post */
    if (process.env[Module.constants.strings.CLOUDWATCH_ENABLED] == Module.constants.strings.TRUE) {
        try {
            Module.cloudwatchApi.request('PutMetricData', params, function (
            response) {});
        } catch (Exception) {
            Module.logger.write(Module.constants.levels.SEVERE, 'Error POSTing data to CloudWatch: ' + Exception);
        }
    }

    return params;
};

exports.DaoManagerModule = DaoManagerModule;