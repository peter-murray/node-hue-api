"use strict";

//
// The Documented Phillips Hue Bridge API for lights http://developers.meethue.com/1_lightsapi.html
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
    apiTraits = {};

apiTraits.getAllLights = Trait.compose(
    tApiMethod("/api/<username>/lights",
               "GET",
               "1.0",
               "Whitelist"
    ),
    tDescription("Gets a list of all lights that have been discovered by the bridge."),
    tPostProcessing(_buildLightsResult)
);

apiTraits.getNewLights = Trait.compose(
    tApiMethod("/api/<username>/lights/new",
               "GET",
               "1.0",
               "Whitelist"
    ),
    tDescription("Gets a list of lights that were discovered the last time a search for new lights was performed. " +
                 "The list of new lights is always deleted when a new search is started.")
);

apiTraits.searchForNewLights = Trait.compose(
    tApiMethod("/api/<username>/lights",
               "POST",
               "1.0",
               "Whitelist"
    ),
    tDescription("Starts a search for new lights. The bridge will search for 1 minute and will add a maximum of 15 new lights." +
                 "To add further lights, the command needs to be sent again after the search has completed." +
                 "If a search is already active, it will be aborted and a new search will start." +
                 "When the search has finished, new lights will be available using the get new lights command." +
                 "In addition, the new lights will now be available by calling get all lights or by calling get group " +
                 "attributes on group 0. Group 0 is a special group that cannot be deleted and will always contain all " +
                 "lights known by the bridge."),
    tPostProcessing(utils.wasSuccessful)
);

apiTraits.getLightAttributesAndState = Trait.compose(
    tApiMethod("/api/<username>/lights/<id>",
               "GET",
               "1.0",
               "Whitelist"
    ),
    tDescription("Gets the attributes and state of a given light.")
);

apiTraits.setLightAttributes = Trait.compose(
    tApiMethod("/api/<username>/lights/<id>",
               "PUT",
               "1.0",
               "Whitelist"
    ),
    tDescription("Used to rename lights. A light can have its name changed when in any state, including when it is unreachable or off."),
    tBodyArguments(
        "application/json",
        [
            {"name": "name", "type": "string", "maxLength": 32, "optional": false}
        ]
    ),
    tPostProcessing(utils.wasSuccessful)
);

apiTraits.setLightState = Trait.compose(
    tApiMethod("/api/<username>/lights/<id>/state",
               "PUT",
               "1.0",
               "Whitelist"
    ),
    tDescription("Allows the user to turn the light on and off, modify the hue and effects."),
    tLightStateBody(),
    tPostProcessing(_processSetLightStateResult)
);

module.exports = {
    "getAllLights"              : Trait.create(Object.prototype, apiTraits.getAllLights),
    "getNewLights"              : Trait.create(Object.prototype, apiTraits.getNewLights),
    "searchForNewLights"        : Trait.create(Object.prototype, apiTraits.searchForNewLights),
    "getLightAttributesAndState": Trait.create(Object.prototype, apiTraits.getLightAttributesAndState),
    "renameLight"               : Trait.create(Object.prototype, apiTraits.setLightAttributes),
    "setLightState"             : Trait.create(Object.prototype, apiTraits.setLightState)
};

//TODO tie this into the API definition as a post processing step, then apply it via the http.invoke()
function _buildLightsResult(result) {
    var lights = [],
        id;

    for (id in result) {
        if (result.hasOwnProperty(id)) {
            lights.push(
                {
                    "id"  : id,
                    "name": result[id].name
                }
            );
        }
    }
    return {"lights": lights};
}

function _processSetLightStateResult(result) {
    if (!utils.wasSuccessful(result)) {
        throw new ApiError(utils.parseErrors(result).join(", "));
    }
    return true;
}

