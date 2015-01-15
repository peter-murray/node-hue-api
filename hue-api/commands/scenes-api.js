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

var Trait           = require("traits").Trait,
    tApiMethod      = require("./traits/tApiMethod"),
    tDescription    = require("./traits/tDescription"),
    tSceneBody      = require("./traits/tSceneBody"),
    tSceneStateBody = require("./traits/tSceneStateBody"),
    tPostProcessing = require("./traits/tPostProcessing"),
    ApiError        = require("../errors").ApiError,
    utils           = require("../utils"),
    apiTraits = {};

apiTraits.getAllScenes = Trait.compose(
    tApiMethod("/api/<username>/scenes",
               "GET",
               "1.0",
               "Whitelist"
    ),
    tDescription("Gets a list of all scenes that have been added to the bridge."),
    tPostProcessing(_processAllScenes)
);

apiTraits.createScene = Trait.compose(
    tApiMethod("/api/<username>/scenes/<id>",
               "PUT",
               "1.0",
               "Whitelist"
    ),
    tDescription("Allows the user to create new scenes. The bridge can store up to 200 scenes."),
    tSceneBody(false),
    tPostProcessing(_processSceneResult)
);

apiTraits.modifyScene = Trait.compose(
    tApiMethod("/api/<username>/scenes/<id>/lights/<lightId>/state",
               "PUT",
               "1.0",
               "Whitelist"
    ),
    tDescription("Allows the user to update the attributes of a scene."),
    tSceneStateBody(true),
    tPostProcessing(_validateUpdateResults)
);

module.exports = {
    "getAllScenes"         : Trait.create(Object.prototype, apiTraits.getAllScenes),
    "createScene"          : Trait.create(Object.prototype, apiTraits.createScene),
    "modifyScene"          : Trait.create(Object.prototype, apiTraits.modifyScene)
};

function _processAllScenes(result) {
    var values = [];

    Object.keys(result).forEach(function (value) {
        values.push({
                        "id"  : value,
                        "name": result[value].name
                    });
    });

    return values;
}

function _processSceneResult(result) {
    if (!utils.wasSuccessful(result)) {
        throw new ApiError(utils.parseErrors(result).join(", "));
    }

    return {"id": result[0].success.id};
}

function _validateUpdateResults(result) {
    var returnValue = {};

    if (!utils.wasSuccessful(result)) {
        throw new ApiError(utils.parseErrors(result).join(", "));
    }

    result.forEach(function(value) {
        Object.keys(value.success).forEach(function(keyValue) {
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