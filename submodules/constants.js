/* constants.js */

ConstantsManagerModule = function() {

};

ConstantsManagerModule.prototype.strings = function() {

};

ConstantsManagerModule.prototype.strings.PLUGIN_POLL_TIME = 'plugin_poll_time';
ConstantsManagerModule.prototype.strings.CLOUDWATCH_NAMESPACE = 'cloudwatch_namespace';
ConstantsManagerModule.prototype.strings.AWS_ACCESS_KEY_ID = 'AWS_ACCESS_KEY_ID';
ConstantsManagerModule.prototype.strings.AWS_SECRET_ACCESS_KEY = 'AWS_SECRET_ACCESS_KEY';
ConstantsManagerModule.prototype.strings.PLUGIN_DIRECTORY = '../plugins';
ConstantsManagerModule.prototype.strings.LIB_DIRECTORY = '../lib';
ConstantsManagerModule.prototype.strings.MODULE_DIRECTORY = '../modules';
ConstantsManagerModule.prototype.strings.SUBMODULE_DIRECTORY = '../submodules';
ConstantsManagerModule.prototype.strings.MONITOR_CONFIG_FILE = '../config/monitor_config';
ConstantsManagerModule.prototype.strings.INSTANCE_ID = 'instance-id';
ConstantsManagerModule.prototype.strings.LOCAL_IPV4 = 'local-ipv4';
ConstantsManagerModule.prototype.strings.PUBLIC_HOSTNAME = 'public-hostname';
ConstantsManagerModule.prototype.strings.IP = 'client-ip';
ConstantsManagerModule.prototype.strings.EC2_METADATA_SCRIPT = '../bin/ec2-metadata';
ConstantsManagerModule.prototype.strings.CLOUDWATCH_ENABLED = 'cloudwatch';
ConstantsManagerModule.prototype.strings.EC2 = 'ec2';
ConstantsManagerModule.prototype.strings.TRUE = 'true';
ConstantsManagerModule.prototype.strings.CONSOLE = 'console';

ConstantsManagerModule.prototype.levels = function() {

};

ConstantsManagerModule.prototype.levels.SEVERE = 'SEVERE';
ConstantsManagerModule.prototype.levels.WARNING = 'WARNING';
ConstantsManagerModule.prototype.levels.INFO = 'INFO';
ConstantsManagerModule.prototype.levels.CONFIG = 'CONFIG';
ConstantsManagerModule.prototype.levels.FINE = 'FINE';
ConstantsManagerModule.prototype.levels.DEBUG = 'DEBUG';
ConstantsManagerModule.prototype.levels.ALL = 'ALL';

ConstantsManagerModule.prototype.globals = function() {

};

exports.ConstantsManagerModule = ConstantsManagerModule;
