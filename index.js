"use strict";

//
// This wrapper is to provide some continuity in the modifications of the APIs over time
//

var bridgeDiscovery = require("./hue-api/bridge-discovery")
    , Hue = require("./hue-api")
    , lightState = require("./hue-api/lightstate")
    , scheduledEvent = require("./hue-api/scheduledEvent.js")
    , ApiError = require("./hue-api/errors.js").ApiError
    ;


function deprecated(fn, message) {
    return function () {
        var args = Array.prototype.slice.call(arguments);
        console.error(message);
        return fn.apply(this, args);
    };
}


module.exports = {
    HueApi: Hue,
    BridgeApi: Hue,
    api: Hue,

    //TODO document this
    connect: function(config) {
        return new Hue(config);
    },

    lightState: lightState,
    scheduledEvent: scheduledEvent,

    upnpSearch: bridgeDiscovery.networkSearch,
    nupnpSearch: bridgeDiscovery.locateBridges,

    locateBridges: deprecated(bridgeDiscovery.locateBridges
        , "'locateBridges' is deprecated, please use 'nupnpSearch' instead"),

    searchForBridges: deprecated(
        bridgeDiscovery.networkSearch
        , "'searchForBridges' is deprecated, please use 'upnpSearch' instead"
    ),

    ApiError: ApiError
};