/* utilities.js */
var fs = require('fs'),
    Module = {};

UtilitiesManagerModule = function (constants) {
    Module = this;
    Module.constants = constants;
};

UtilitiesManagerModule.prototype.parseCommandLineOptions = function (callback) {
    var count = 0;
    process.argv.forEach(function (value, index, array) {
        if (count != 0 && count != 1) {
            Module.constants.globals[value.split('=')[0]] = value.split('=')[1]; /* Debug */
            console.log('Read cmd parameter: ' + value.split('=')[0] + ', with value: ' + value.split('=')[1]);
        }
        count++;
    });
    callback();
};

UtilitiesManagerModule.prototype.parseConfig = function (configFile, callback) {
    fs.readFile(configFile, function (error, fd) {
        if (error) {
            console.log('Error reading master config file, exiting application');
            process.exit(1);
        }

        var splitBuffer = fd.toString().split('\n');
        for (var i = 0; i < splitBuffer.length; i++) {
            var params = splitBuffer[i].split('=');
            if (params[0] != undefined && params[0] != '') {
                Module.constants.globals[params[0]] = params[1]; /* Debug */
                console.log('Read config parameter: ' + params[0] + ', with value: ' + params[1]);
            }
        }
        callback();
    });
};

UtilitiesManagerModule.prototype.autoPopulate = function (callback) {
    if (Module.constants.globals[Module.constants.strings.EC2] != Module.constants.strings.TRUE) { /* Default to localhost */
    	Module.constants.globals[Module.constants.strings.INSTANCE_ID] = 'none';
    	Module.constants.globals[Module.constants.strings.LOCAL_IPV4] = '127.0.0.1';
    	Module.constants.globals[Module.constants.strings.PUBLIC_HOSTNAME] = '127.0.0.1';
        return;
    }

    [Module.constants.strings.INSTANCE_ID, Module.constants.strings.LOCAL_IPV4, Module.constants.strings.PUBLIC_HOSTNAME].forEach(function (
    parameter) {
        require('child_process').exec(
        Module.constants.strings.EC2_METADATA_SCRIPT + ' --' + parameter + ' | awk \'{print$2}\'', function (error, stdout, stderr) {
            if (error) {
                console.log('Error auto-configuring: ' + error + ', exiting application');
                process.exit(1);
            } else { /* Debug */
                console.log('Read ec2 parameter: ' + parameter + ', with value: ' + stdout);
                Module.constants.globals[parameter] = stdout;
            }
        });
        callback();
    });
};

UtilitiesManagerModule.prototype.isEven = function (number) {
    return (number % 2 == 0) ? true : false;
};

UtilitiesManagerModule.prototype.trim = function (data) {
    data = data.replace(/^\s+/, '');
    for (var i = data.length - 1; i >= 0; i--) {
        if (/\S/.test(data.charAt(i))) {
            data = data.substring(0, i + 1);
            break;
        }
    }
    return data;
};

UtilitiesManagerModule.prototype.generateEpocTime = function () {
    var date = new Date();
    return date.getTime();
};

UtilitiesManagerModule.prototype.generateFormattedDate = function () {
    var date = new Date();
    return date.getUTCFullYear() + ':' + date.getUTCMonth() + ':' + date.getUTCDate();
};

UtilitiesManagerModule.prototype.getSystemEnvironment = function () {
    return process.platform;
};

UtilitiesManagerModule.prototype.safeEncodeKey = function (key) {
    return key.replace(/\//g, '_');
};

UtilitiesManagerModule.prototype.safeDecodeKey = function (key) {
    return key.replace(/_/g, '/');
};

UtilitiesManagerModule.prototype.validateType = function (type) {
    if (type == 'poll' || type == 'step') return true;

    return false;
};

UtilitiesManagerModule.prototype.isEmpty = function (variable) {
    if (variable.name == 'none' || variable.name == '' || variable.name == undefined) return true;

    return false;
};

UtilitiesManagerModule.prototype.validateData = function (data) {
    try {
        JSON.parse(data);
    } catch (e) {
        return false;
    }
    return true;
};

UtilitiesManagerModule.prototype.exit = function (message) {
    console.log(message + ', exiting application');
    process.exit(1);
};

exports.UtilitiesManagerModule = UtilitiesManagerModule;