"use strict";

//
// The Documented Phillips Hue Bridge API for scenes http://www.developers.meethue.com/documentation/scenes-api
//
// This module wraps up all the functionality for the definition and basic processing of the parameters for the API
// so that it can be called from the httpPromise module.
//
// The benefits of keeping all this code here is that it is much simpler to update the keep in step with the Phillips
// Hue API documentation, than having it scatter piece meal through various other classes and functions.
//

var Trait = require("traits").Trait
    , tApiMethod = require("./traits/tApiMethod")
    , tDescription = require("./traits/tDescription")
    , tPostProcessing = require("./traits/tPostProcessing")
    , tLightStateBody = require("./traits/tLightStateBody")
    , tBodyArguments = require("./traits/tBodyArguments")
    , ApiError = require("../errors").ApiError
    , utils = require("../utils")
    , apiTraits = {}
    ;

function processSceneResult(result) {
    var response = {}
        ;

    if (!utils.wasSuccessful(result)) {
        throw new ApiError(utils.parseErrors(result).join(", "));
    }

    function processResultObject(resultEntry) {
        var obj = resultEntry.success
            , idMatch = null
            ;

        Object.keys(obj).forEach(function(key) {
            var id = key.substr(key.lastIndexOf("/") + 1);
            response[id] = obj[key];

            if (!idMatch) {
                idMatch = /scenes\/(.*)\//.exec(key);
            }
        });

        if (!response.id && idMatch) {
            response.id = idMatch[1];
        }
    }

    if (Array.isArray(result)) {
        result.forEach(processResultObject);
    } else {
        processResultObject(result);
    }

    return response;
}

function validateUpdateResults(result) {
    var returnValue = {};

    if (!utils.wasSuccessful(result)) {
        throw new ApiError(utils.parseErrors(result).join(", "));
    }

    result.forEach(function (value) {
        Object.keys(value.success).forEach(function (keyValue) {
            //todo check this
            // The time values being returned do not appear to be correct from the Bridge, it is almost like
            // they are in a transition state when the function returns the value, as such time values are not
            // going to be returned from this function for now.
            //
            // Name and description values appear to be correctly represented in the results, but commands are
            // typically cut short to just "Updated" so to cater for this variability I am just going to return
            // true for each value that was modified, and leave it up to the user to request the value it was
            // set to by re-querying the scene.
            //
            // I have to trust that the Hue Bridge API will have set the values correctly when it reports
            // success otherwise they have some serious issues...
            var data = keyValue.substr(keyValue.lastIndexOf("/") + 1, keyValue.length);
            returnValue[data] = true;
        });
    });
    return returnValue;
}

apiTraits.getAllScenes = Trait.compose(
    tApiMethod(
        "/api/<username>/scenes",
        "GET",
        "1.1",
        "Whitelist"
    ),
    tDescription("Gets a list of all scenes currently stored in the bridge. Scenes are represented by a scene id, a name and a list of lights which are part of the scene.")
);

apiTraits.createScene = Trait.compose(
    tApiMethod(
        "/api/<username>/scenes/<id>",
        "PUT",
        "1.1",
        "Whitelist"
    ),
    tDescription("Updates the given scene with all lights in the provided lights resource."),
    tBodyArguments(
        "application/json",
        [
            {name: "name", type: "string", optional: true},
            {name: "lights", type: "list int", optional: false}
        ]
    ),
    tPostProcessing(processSceneResult)
);

apiTraits.modifyScene = Trait.compose(
    tApiMethod(
        "/api/<username>/scenes/<id>/lights/<lightId>/state",
        "PUT",
        "1.1.1",
        "Whitelist"
    ),
    tDescription("Modifies or creates a new scene. Note that these states are not visible via any API calls, but stored in the lights themselves."),
    tLightStateBody(),
    tPostProcessing(validateUpdateResults)//TODO not sure about this validation
);

module.exports = {
    getAllScenes: Trait.create(Object.prototype, apiTraits.getAllScenes),
    createScene: Trait.create(Object.prototype, apiTraits.createScene),
    modifyScene: Trait.create(Object.prototype, apiTraits.modifyScene)
};