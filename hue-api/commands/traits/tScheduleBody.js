"use strict";

var Trait = require("traits").Trait,
    tBodyArguments = require("./tBodyArguments");

module.exports = function (allOptional) {
    return tBodyArguments(
        "application/json",
        [
            {"name": "name", "type": "string", "maxLength": 32, "optional": true},
            {"name": "description", "type": "string", "maxLength": 64, "optional": true},
            {"name": "command", "type": "string", "maxLength": 90, "optional": allOptional ? true : false},
            {"name": "time", "type": "time", "optional": allOptional ? true : false}
        ]
    );
};