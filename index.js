"use strict";

//
// This wrapper is to provide some continuity in the modifications of the APIs over time
//

module.exports.hue = {
    "locateBridges": require("./hue-api/api").locateBridges,
    "HueApi" : require("./hue-api")
};

module.exports.lightState = require("./hue-api/lightstate.js");
module.exports.scheduledEvent = require("./hue-api/scheduledEvent.js");
module.exports.ApiError = require("./hue-api/errors.js").ApiError;