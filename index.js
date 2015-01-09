"use strict";

var bridgeDiscovery = require("./hue-api/bridge-discovery");

//
// This wrapper is to provide some continuity in the modifications of the APIs over time
//

module.exports.HueApi = require("./hue-api/index.js");

module.exports.locateBridges = _deprecated(
    bridgeDiscovery.locateBridges
    , "'locateBridges' is deprecated, please use 'nupnpSearch' instead"
);
module.exports.nupnpSearch = bridgeDiscovery.locateBridges;

module.exports.searchForBridges = _deprecated(
    bridgeDiscovery.networkSearch
    , "'searchForBridges' is deprecated, please use 'upnpSearch' instead"
);
module.exports.upnpSearch = bridgeDiscovery.networkSearch;

module.exports.lightState = require("./hue-api/lightstate.js");
module.exports.scheduledEvent = require("./hue-api/scheduledEvent.js");
module.exports.ApiError = require("./hue-api/errors.js").ApiError;


function _deprecated(fn, message) {

    return function () {
        var args = Array.prototype.slice.call(arguments);
        console.error(message);
        return fn.apply(this, args);
    }
}