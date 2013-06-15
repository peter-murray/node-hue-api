"use strict";

var util = require("util"),
    Trait = require("traits").Trait,
    tApiMethod = require("./traits/tApiMethod"),
    tDescription = require("./traits/tDescription"),
    tPostProcessing = require("./traits/tPostProcessing"),
    apiTraits = {};

apiTraits.description = Trait.compose(
    tApiMethod("/description.xml",
               "GET",
               "1.0",
               "All",
               "application/xml"
    ),
    tDescription("Returns an XML description of the Hue Bridge.")
);

apiTraits.upnpLookup = Trait.compose(
    tApiMethod("/api/nupnp",
               "GET",
               "1.0",
               "All"
    ),
    tDescription("Obtains the known Hue Bridges on the network from www.meethue.com"),
    tPostProcessing(_processUpnpBridgeResults)
);

module.exports = {
    description: Trait.create(Object.prototype, apiTraits.description),
    upnpLookup : Trait.create(Object.prototype, apiTraits.upnpLookup)
};

function _processUpnpBridgeResults(results) {
    var bridges = [];

    if (util.isArray(results)) {
        results.forEach(function(bridge) {
            bridges.push(_bridgeResult(bridge));
        });
    } else {
        bridges.push(_bridgeResult(results));
    }

    return bridges;
}

function _bridgeResult(bridge) {
    // Just ignoring the mac address and changing the name for the ip address field
    return {
        id       : bridge.id,
        ipaddress: bridge.internalipaddress
    };
}