"use strict";

//
// The Documented Phillips Hue Bridge API for schedules http://developers.meethue.com/3_schedulesapi.html
//
// This module wraps up all the functionality for the definition and basic processing of the parameters for the API
// so that it can be called from the httpPromise module.
//
// The benefits of keeping all this code here is that it is much simpler to update the keep in step with the Phillips
// Hue API documentation, than having it scatter piece meal through various other classes and functions.
//

var Trait = require("traits").Trait,
    deepExtend = require("deep-extend"),
    tApiMethod = require("./traits/tApiMethod"),
    tDescription = require("./traits/tDescription"),
    tScheduleBody = require("./traits/tScheduleBody"),
    tPostProcessing = require("./traits/tPostProcessing"),
    ApiError = require("../errors").ApiError,
    utils = require("../utils"),
    apiTraits = {};

function processAllSchedules(result) {
    var values = [];

    Object.keys(result).forEach(function (value) {
        values.push(deepExtend({id: value}, result[value]));
    });

    return values;
}

function processScheduleResult(result) {
    if (!utils.wasSuccessful(result)) {
        throw new ApiError(utils.parseErrors(result).join(", "));
    }

    return {id: result[0].success.id};
}

function processDeletion(result) {
    if (!utils.wasSuccessful(result)) {
        throw new ApiError(utils.parseErrors(result).join(", "));
    }

    return true;
}

function validateUpdateResults(result) {
    var returnValue = {};

    if (!utils.wasSuccessful(result)) {
        throw new ApiError(utils.parseErrors(result).join(", "));
    }

    result.forEach(function (value) {
        Object.keys(value.success).forEach(function (keyValue) {
            // The time values being returned do not appear to be correct from the Bridge, it is almost like
            // they are in a transition state when the function returns the value, as such time values are not
            // going to be returned from this function for now.
            //
            // Name and description values appear to be correctly represented in the results, but commands are
            // typically cut short to just "Updated" so to cater for this variability I am just going to return
            // true for each value that was modified, and leave it up to the user to request the value it was
            // set to by re-querying the schedule.
            //
            // I have to trust that the Hue Bridge API will have set the values correctly when it reports
            // success otherwise they have some serious issues...
            var data = keyValue.substr(keyValue.lastIndexOf("/") + 1, keyValue.length);
            returnValue[data] = true;
        });
    });
    return returnValue;
}

apiTraits.getAllSchedules = Trait.compose(
    tApiMethod(
        "/api/<username>/schedules",
        "GET",
        "1.0",
        "Whitelist"
    ),
    tDescription("Gets a list of all schedules that have been added to the bridge."),
    tPostProcessing(processAllSchedules)
);

apiTraits.createSchedule = Trait.compose(
    tApiMethod(
        "/api/<username>/schedules",
        "POST",
        "1.0",
        "Whitelist"
    ),
    tDescription("Allows the user to create new schedules. The bridge can store up to 100 schedules."),
    tScheduleBody(false),
    tPostProcessing(processScheduleResult)
);

apiTraits.getSchedule = Trait.compose(
    tApiMethod(
        "/api/<username>/schedules/<id>",
        "GET",
        "1.0",
        "Whitelist"
    ),
    tDescription("Allows the user to change attributes of a schedule.")
);

apiTraits.setScheduleAttributes = Trait.compose(
    tApiMethod(
        "/api/<username>/schedules/<id>",
        "PUT",
        "1.0",
        "Whitelist"
    ),
    tDescription("Sets attributes for a schedule."),
    tScheduleBody(true),
    tPostProcessing(validateUpdateResults)
);

apiTraits.deleteSchedule = Trait.compose(
    tApiMethod(
        "/api/<username>/schedules/<id>",
        "DELETE",
        "1.0",
        "Whitelist"
    ),
    tDescription("Deletes a schedule from the bridge."),
    tPostProcessing(processDeletion)
);


module.exports = {
    "getAllSchedules": Trait.create(Object.prototype, apiTraits.getAllSchedules),
    "createSchedule": Trait.create(Object.prototype, apiTraits.createSchedule),
    "getSchedule": Trait.create(Object.prototype, apiTraits.getSchedule),
    "setScheduleAttributes": Trait.create(Object.prototype, apiTraits.setScheduleAttributes),
    "deleteSchedule": Trait.create(Object.prototype, apiTraits.deleteSchedule)
};