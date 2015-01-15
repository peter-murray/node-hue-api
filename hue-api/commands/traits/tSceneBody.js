"use strict";

var Trait = require("traits").Trait,
    tBodyArguments = require("./tBodyArguments");

module.exports = function () {
    return tBodyArguments(
        "application/json",
        [
            {"name": "name", "type": "string", "optional": false},
            {"name": "lights", "type": "list int", "minValue": 0, "maxValue": 255, "optional": true}
        ]
    );
};