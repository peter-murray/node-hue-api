"use strict";

//
// The Documented Phillips Hue Bridge API for groups http://developers.meethue.com/2_groupssapi.html
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
    tLightStateBody = require("./traits/tLightStateBody"),
    tPostProcessing = require("./traits/tPostProcessing"),
    ApiError = require("../errors").ApiError,
    utils = require("../utils"),
    ALL_LIGHTS_NAME = "All Lights",
    apiTraits = {};

apiTraits.getAllGroups = Trait.compose(
    tApiMethod("/api/<username>/groups",
               "GET",
               "1.0",
               "Whitelist"
    ),
    tDescription("Gets a list of all groups that have been added to the bridge. A group is a list of lights that " +
                 "can be created, modified and deleted by a user. The maximum numbers of groups is 16. N.B. For " +
                 "the first bridge firmware release, bridge software version 01003542 only, a limited number of " +
                 "these APIs are supported in the firmware so only control of groups/0 is supported."),
    tPostProcessing(_processAllGroups)
);

apiTraits.getGroupAttributes = Trait.compose(
    tApiMethod("/api/<username>/groups/<id>",
               "GET",
               "1.0",
               "Whitelist"
    ),
    tDescription("Gets the name, light membership and last command for a given group.")
//    tPostProcessing(_processGroupResult) // Cannot use this as we need to inject the id we were called with
);

apiTraits.setGroupAttributes = Trait.compose(
    tApiMethod("/api/<username>/groups/<id>",
               "PUT",
               "1.0",
               "Whitelist"
    ),
    tDescription("Allows the user to modify the name and light membership of a group."),
    tBodyArguments(
        "application/json",
        [
            {"name": "name", "type": "string", "maxLength": 32, "optional": true},
            {"name": "lights", "type": "list int", "optional": true}
        ]
    ),
    tPostProcessing(_ensureSuccessful)
);

apiTraits.setGroupState = Trait.compose(
    tApiMethod("/api/<username>/groups/<id>/action",
               "PUT",
               "1.0",
               "Whitelist"
    ),
    tDescription("Modifies the state of all lights in a group"),
    tLightStateBody(),
    tPostProcessing(_processSetLightStateResult)
);

// In version 1.0 of the Phillips Hue API this is not officially supported and has been reverse engineered from
// tinkering with the api end points...
apiTraits.createGroup = Trait.compose(
    tApiMethod("/api/<username>/groups",
               "POST",
               "0.0",
               "Whitelist"
    ),
    tDescription("Creates a new Group. This endPoint has been reverse engineered and is not officially supported by Phillips Hue."),
    tBodyArguments(
        "application/json",
        [
            {"name": "name", "type": "string", maxLength: 32, "optional": true},
            {"name": "lights", "type": "list int", "optional": false}
        ]
    ),
    tPostProcessing(_processCreateGroup)
);

apiTraits.deleteGroup = Trait.compose(
    tApiMethod("/api/<username>/groups/<id>",
               "DELETE",
               "0.0",
               "Whitelist"
    ),
    tDescription("Deletes a Group. This endPoint has been reverse engineered and is not officially supported by Phillips Hue."),
    tPostProcessing(_ensureSuccessful)
);


module.exports = {
    "getAllGroups"      : Trait.create(Object.prototype, apiTraits.getAllGroups),
    "getGroupAttributes": Trait.create(Object.prototype, apiTraits.getGroupAttributes),
    "setGroupAttributes": Trait.create(Object.prototype, apiTraits.setGroupAttributes),
    "setGroupState"     : Trait.create(Object.prototype, apiTraits.setGroupState),
    "createGroup"       : Trait.create(Object.prototype, apiTraits.createGroup),
    "deleteGroup"       : Trait.create(Object.prototype, apiTraits.deleteGroup),
    "NAME_ALL_LIGHTS"   : ALL_LIGHTS_NAME
};

/**
 * Parses the results from the All Groups request into a more useful format.
 * @param result The result from the Hue Bridge.
 * @returns {Array} An array of groups {"id": {*}, "name": {*}} known to the bridge.
 * @private
 */
function _processAllGroups(result) {
    var groupArray = [];

    // There is an implicit all lights group that is not returned in the results of the lookup, so explicitly add it
    groupArray.push({"id": "0", "name": ALL_LIGHTS_NAME});

    Object.keys(result).forEach(function (value) {
        groupArray.push({
                            "id"  : value,
                            "name": result[value].name
                        });
    });
    return groupArray;
}

function _processCreateGroup (result) {
    var idString;

    _ensureSuccessful(result);

    idString = result[0].success.id;
    idString = idString.substr(idString.lastIndexOf("/") + 1);

    return {"id": idString};
}

function _ensureSuccessful(result) {
//    console.log(JSON.stringify(result));
    if (!utils.wasSuccessful(result)) {
        throw new ApiError(utils.parseErrors(result).join(", "));
    }
    return true;
}

function _processSetLightStateResult(result) {
    if (!utils.wasSuccessful(result)) {
        throw new ApiError(utils.parseErrors(result).join(", "));
    }
    return true;
}

//function _processGroupResult(group) {
//    //TODO the group id is injected via the call of the promise
//    var result = {
//        "id"        : String(id),
//        // Inject our "known name" for the all lights group if necessary
//        "name"      : id === 0 ? ALL_LIGHTS_NAME : group.name,
//        "lights"    : group.lights,
//        "lastAction": group.action
//    };
//
//    //TODO Api has a placeholder for scenes which are currently not used
//    return result;
//}