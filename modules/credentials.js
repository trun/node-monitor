/* credentials.js */
var fs = require('fs'),
    Module = {},
    location = 'credentials.js';

CredentialManagerModule = function (constants, utilities, logger) {
    Module = this;
    Module.constants = constants;
    Module.utilities = utilities;
    Module.logger = logger;
};

CredentialManagerModule.prototype.check = function () {
    var checkCredentialsArray = [Module.constants.strings.AWS_ACCESS_KEY_ID, Module.constants.strings.AWS_SECRET_ACCESS_KEY];
    checkCredentialsArray.forEach(function (credential) {
        var check = Module.constants.globals[credential];
        if (!check) {
            Module.utilities.exit(credential + ' is not declared');
            Module.utilities.exit('Error with credentials');
        }
    });
};

exports.CredentialManagerModule = CredentialManagerModule;