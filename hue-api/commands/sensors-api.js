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

var Trait = require("traits").Trait
    , deepExtend = require("deep-extend")
    , tApiMethod = require("./traits/tApiMethod")
    , tDescription = require("./traits/tDescription")
    , tBodyArguments = require("./traits/tBodyArguments")
    , tLightStateBody = require("./traits/tLightStateBody")
    , tPostProcessing = require("./traits/tPostProcessing")
    , utils = require("../utils")
    ;

var apiTraits = {};

//TODO tie this into the API definition as a post processing step, then apply it via the http.invoke()
function buildSensorsResult(result) {
    var sensors = [];

    if (result) {
        Object.keys(result).forEach(function (id) {
            sensors.push(deepExtend({id: id}, result[id]));
        });
    }
    return {"sensors": sensors};
}

apiTraits.getAllSensors = Trait.compose(
    tApiMethod(
        "/api/<username>/sensors",
        "GET",
        "1.3",
        "Whitelist"
    ),
    tDescription("Gets a list of all sensors that have been discovered by the bridge."),
    tPostProcessing(buildSensorsResult)
);


//TODO there are many more endpoints that need to be added to this: http://www.developers.meethue.com/documentation/sensors-api

module.exports = {
    "getAllSensors": Trait.create(Object.prototype, apiTraits.getAllSensors)
};