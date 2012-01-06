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
            process.env[value.split('=')[0]] = value.split('=')[1]; /* Debug */
            /* console.log('Read cmd parameter: ' + value.split('=')[0] + ', with value: ' + value.split('=')[1]); */
        }
        count++;
    });
    callback();
};

UtilitiesManagerModule.prototype.parseConfig = function (configFile, callback) {
	/* Switch to config directory */
    try {
        process.chdir(Module.constants.strings.CONFIG_DIRECTORY);
    } catch (Exception) {
        Module.logger.write(Module.constants.levels.SEVERE, 'Error switching to config directory: ' + Exception);
    }
    
    fs.readFile(configFile, function (error, fd) {
        if (error) {
            console.log('Error reading master config file, exiting application');
            process.exit(1);
        }

        var splitBuffer = fd.toString().split('\n');
        for (var i = 0; i < splitBuffer.length; i++) {
            var params = splitBuffer[i].split('=');
            if (params[0] != undefined && params[0] != '') {
                process.env[params[0]] = params[1]; /* Debug */
                /* console.log('Read config parameter: ' + params[0] + ', with value: ' + params[1]); */
            }
        }
        callback();
    });
};

UtilitiesManagerModule.prototype.getInstanceId = function (callback) {
    if (process.env[Module.constants.strings.EC2] == Module.constants.strings.TRUE) {
        [Module.constants.strings.INSTANCE_ID].forEach(function (
        parameter) {
            require('child_process').exec(
            Module.constants.strings.EC2_METADATA_SCRIPT + ' --' + parameter + ' | awk \'{print$2}\'', function (error, stdout, stderr) {
                if (error) {
                    console.log('Error auto-configuring: ' + error + ', exiting application');
                    process.exit(1);
                } else { /* Debug */
                    /* console.log('Read ec2 parameter: ' + parameter + ', with value: ' + stdout); */
                    callback(stdout.toString());
                    return;
                }
            });
        });
    }
    callback('none');
};

UtilitiesManagerModule.prototype.getPublicHostname = function (callback) {
    if (process.env[Module.constants.strings.EC2] == Module.constants.strings.TRUE) {
        [Module.constants.strings.PUBLIC_HOSTNAME].forEach(function (
        parameter) {
            require('child_process').exec(
            Module.constants.strings.EC2_METADATA_SCRIPT + ' --' + parameter + ' | awk \'{print$2}\'', function (error, stdout, stderr) {
                if (error) {
                    console.log('Error auto-configuring: ' + error + ', exiting application');
                    process.exit(1);
                } else { /* Debug */
                    /* console.log('Read ec2 parameter: ' + parameter + ', with value: ' + stdout); */
                    callback(stdout.toString());
                    return;
                }
            });
        });
    }
    callback('127.0.0.1');
};

UtilitiesManagerModule.prototype.getInternalIP = function (callback) {
    if (process.env[Module.constants.strings.EC2] == Module.constants.strings.TRUE) {
        [Module.constants.strings.LOCAL_IPV4].forEach(function (
        parameter) {
            require('child_process').exec(
            Module.constants.strings.EC2_METADATA_SCRIPT + ' --' + parameter + ' | awk \'{print$2}\'', function (error, stdout, stderr) {
                if (error) {
                    console.log('Error auto-configuring: ' + error + ', exiting application');
                    process.exit(1);
                } else { /* Debug */
                    /* console.log('Read ec2 parameter: ' + parameter + ', with value: ' + stdout); */
                    callback(stdout.toString());
                    return;
                }
            });
        });
    }
    callback('127.0.0.1');
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