"use strict";

var Trait = require("traits").Trait,
    tBodyArguments = require("./tBodyArguments");

module.exports = function () {
    return tBodyArguments(
        "application/json",
        [
            {"name": "on", "type": "bool", "optional": true},
            {"name": "bri", "type": "int", "minValue": 0, "maxValue": 255, "optional": true},
            {"name": "hue", "type": "int", "minValue": 0, "maxValue": 65535, "optional": true},
            {"name": "sat", "type": "int", "minValue": 0, "maxValue": 255, "optional": true},
            {"name": "xy", "type": "list float", "optional": true},
            {"name": "ct", "type": "int", "minValue": 153, "maxValue": 500, "optional": true},
            {"name": "alert", "type": "string", "validValues": ["none", "select", "lselect"], "optional": true},
            {"name": "effect", "type": "string", "validValues": ["none", "colorloop"], "optional": true},
            {"name": "transitiontime", "type": "uint16", "optional": true}
        ]
    );
};
