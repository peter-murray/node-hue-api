"use strict";

//
// This wrapper is to provide some continuity in the modifications of the APIs over time
//

module.exports.HueApi = require("./hue-api/index.js");

module.exports.locateBridges = require("./hue-api/bridge-discovery").locateBridges;
module.exports.searchForBridges = require("./hue-api/bridge-discovery").networkSearch;

module.exports.lightState = require("./hue-api/lightstate.js");
module.exports.scheduledEvent = require("./hue-api/scheduledEvent.js");
module.exports.ApiError = require("./hue-api/errors.js").ApiError;