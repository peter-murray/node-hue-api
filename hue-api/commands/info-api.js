"use strict";

//
// The Documented Phillips Hue Bridge API for groups http://www.developers.meethue.com/documentation/info-api
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
    ;

var apiTraits = {};

apiTraits.getAllTimezones = Trait.compose(
    tApiMethod(
        "/api/<username>/info/timezones",
        "GET",
        "1.2.1",
        "Whitelist"
    ),
    tDescription("Allows the user to list all supported bridge timezones.")
);

module.exports = {
    getAllTimezones: Trait.create(Object.prototype, apiTraits.getAllTimezones)
};