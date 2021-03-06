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

CredentialManagerModule.prototype.check = function (callback) {
    var checkCredentialsArray = [Module.constants.strings.AWS_ACCESS_KEY_ID, Module.constants.strings.AWS_SECRET_ACCESS_KEY];
    checkCredentialsArray.forEach(function (credential) {
        var check = process.env[credential];
        if (!check)
            Module.utilities.exit(credential + ' credential is not declared');
        
    });
    
    /* For node-cloudwatch */
    process.env[Module.constants.strings.AWS_SECRET_ACCESS_KEY] = process.env[Module.constants.strings.AWS_SECRET_ACCESS_KEY];
    process.env[Module.constants.strings.AWS_ACCESS_KEY_ID] = process.env[Module.constants.strings.AWS_ACCESS_KEY_ID];
    
    callback();
};

exports.CredentialManagerModule = CredentialManagerModule;