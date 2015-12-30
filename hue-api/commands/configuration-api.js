"use strict";

//
// The Documented Phillips Hue Bridge API for configuration http://developers.meethue.com/4_configurationapi.html
//
// This module wraps up all the functionality for the definition and basic processing of the parameters for the API
// so that it can be called from the httpPromise module.
//
// The benefits of keeping all this code here is that it is much simpler to update the keep in step with the Phillips
// Hue API documentation, than having it scatter piece meal through various other classes and functions.
//

var Trait = require("traits").Trait,
    tApiMethod = require("./traits/tApiMethod"),
    tDescription = require("./traits/tDescription"),
    tBodyArguments = require("./traits/tBodyArguments"),
    tPostProcessing = require("./traits/tPostProcessing"),
    ApiError = require("../errors").ApiError,
    utils = require("../utils"),
    apiTraits = {};


function processUserCreation(result) {
    return result[0].success.username;
}

function processDeletionResults(result) {
    if (!utils.wasSuccessful(result)) {
        throw new ApiError(utils.parseErrors(result).join(", "));
    }
    return true;
}

function processModificationResults(result) {
    if (!utils.wasSuccessful(result)) {
        throw new ApiError(utils.parseErrors(result).join(", "));
    }
    return true;
}

apiTraits.createUser = Trait.compose(
    tApiMethod(
        "/api",
        "POST",
        "1.0",
        "All"
    ),
    tDescription("Creates a new user. The link button on the bridge must be pressed and this command executed within 30 seconds."),
    tBodyArguments(
        "application/json",
        [
            {name: "devicetype", type: "string", maxLength: 40, optional: false}
        ]
    ),
    tPostProcessing(processUserCreation)
);

apiTraits.getConfiguration = Trait.compose(
    tApiMethod(
        "/api/<username>/config",
        "GET",
        "1.0",
        "Whitelist"
    ),
    tDescription("Returns list of all configuration elements in the bridge. Note all times are stored in UTC.")
);

apiTraits.modifyConfiguration = Trait.compose(
    tApiMethod(
        "/api/<username>/config",
        "PUT",
        "1.0",
        "Whitelist"
    ),
    tDescription("Allows the user to set some configuration values."),
    tBodyArguments(
        "application/json",
        [
            {name: "proxyport", type: "uint16", optional: true},
            {name: "name", type: "string", minLength: 4, maxLength: 16, optional: true},
            {name: "swupdate", type: "object", optional: true},
            {name: "proxyaddress", type: "string", maxLength: 40, optional: true},
            {name: "linkbutton", type: "boolean", optional: true},
            {name: "ipaddress", type: "string", optional: true},
            {name: "netmask", type: "string", optional: true},
            {name: "gateway", type: "string", optional: true},
            {name: "dhcp", type: "boolean", optional: true},
            {name: "portalservices", type: "boolean", optional: true}
        ]
    ),
    tPostProcessing(processModificationResults)
);

apiTraits.deleteUser = Trait.compose(
    tApiMethod(
        "/api/<username>/config/whitelist/<username2>",
        "DELETE",
        "1.0",
        "Whitelist"
    ),
    tDescription("Deletes the specified user <username2>, from the whitelist."),
    tPostProcessing(processDeletionResults)
);

apiTraits.getFullState = Trait.compose(
    tApiMethod(
        "/api/<username>",
        "GET",
        "1.0",
        "Whitelist"
    ),
    tDescription("This command is used to fetch the entire datastore from the device, including settings and state " +
    "information for lights, groups, schedules and configuration. It should only be used sparingly as " +
    "it is resource intensive for the bridge, but is supplied e.g. for synchronization purposes.")
);

module.exports = {
    "createUser": Trait.create(Object.prototype, apiTraits.createUser),
    "getConfiguration": Trait.create(Object.prototype, apiTraits.getConfiguration),
    "getFullState": Trait.create(Object.prototype, apiTraits.getFullState),
    "modifyConfiguration": Trait.create(Object.prototype, apiTraits.modifyConfiguration),
    "deleteUser": Trait.create(Object.prototype, apiTraits.deleteUser)
};