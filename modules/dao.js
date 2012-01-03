/* dao.js */

var fs = require('fs'),
    Module = {},
    location = 'dao.js';

/* Override */
String.prototype.replace = (function (r) {
    return function (find, replace, replaceOnce) {
        if (typeof find == 'string' && !replaceOnce) {
            find = r.apply(find, [/[\[\]^$*+.?(){}\\\-]/g, function (c) {
                return '\\' + c;
            }]);
            find = new RegExp(find, 'g');
        } else if (typeof find == 'object' && !replaceOnce && !find.global) {
            find = new RegExp(find.source, 'g');
        }
        return r.apply(this, [find, replace]);
    };
})(String.prototype.replace);

var modules = {
    cloudwatch: 'node-cloudwatch'
};

DaoManagerModule = function (constants, utilities, logger, dao) {
    Module = this;
    Module.constants = constants;
    Module.utilities = utilities;
    Module.logger = logger;
    Module.dao = dao;

    /* Setup dependencies */
    for (var name in modules) {
        eval('var ' + name + ' = require(\'' + modules[name] + '\')');
    }

    var CloudwatchApi = new cloudwatch.AmazonCloudwatchClient();
    Module.cloudwatchApi = CloudwatchApi;
};

DaoManagerModule.prototype.debugMode = function () {
    if (process.env['debug'] == 'true') return true;

    return false;
};

DaoManagerModule.prototype.write = function (pluginName, jsonString) {
    if (Module.utilities.validateData(jsonString)) return true;

    Module.logger.write(Module.constants.levels.WARNING, 'Data is not valid JSON');
    return false;
};

DaoManagerModule.prototype.postCloudwatch = function (metricName, unit, value) { /* If we're in debug mode, don't post */
    if (this.debugMode()) return;

    /* If we're not on EC2, don't post */
    if (process.env[Module.constants.strings.EC2] != Module.constants.strings.TRUE) return;

    var params = {};

    params['Namespace'] = process.env[Module.constants.strings.CLOUDWATCH_NAMESPACE];
    params['MetricData.member.1.MetricName'] = metricName;
    params['MetricData.member.1.Unit'] = unit;
    params['MetricData.member.1.Value'] = value;
    params['MetricData.member.1.Dimensions.member.1.Name'] = 'InstanceID';
    params['MetricData.member.1.Dimensions.member.1.Value'] = process.env[Module.constants.strings.INSTANCE_ID];

    Module.logger.write(Module.constants.levels.INFO, 'CloudWatch Namespace: ' + process.env[Module.constants.strings.CLOUDWATCH_NAMESPACE]);
    Module.logger.write(Module.constants.levels.INFO, 'CloudWatch IP: ' + process.env[Module.constants.strings.INSTANCE_ID]);
    Module.logger.write(Module.constants.levels.INFO, 'CloudWatch MetricName: ' + metricName);
    Module.logger.write(Module.constants.levels.INFO, 'CloudWatch Unit: ' + unit);
    Module.logger.write(Module.constants.levels.INFO, 'CloudWatch Value: ' + value);

    /* If we specified a parameter to enable, then we post */
    Module.logger.write(Module.constants.levels.INFO, 'CloudWatch? ' + process.env[Module.constants.strings.CLOUDWATCH_ENABLED]);
    if (process.env[Module.constants.strings.CLOUDWATCH_ENABLED] == Module.constants.strings.TRUE) {
        try {
            Module.cloudwatchApi.request('PutMetricData', params, function (response) {
                Module.logger.write(Module.constants.levels.INFO, 'CloudWatch response: ' + response.toString());
            });
        } catch (Exception) {
            Module.logger.write(Module.constants.levels.SEVERE, 'Error POSTing data to CloudWatch: ' + Exception);
        }
    }

    return params;
};

exports.DaoManagerModule = DaoManagerModule;