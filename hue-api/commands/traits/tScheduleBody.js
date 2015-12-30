"use strict";

var tBodyArguments = require("./tBodyArguments");

module.exports = function (allOptional) {
    return tBodyArguments(
        "application/json",
        [
            {name: "name", type: "string", maxLength: 32, optional: true},
            {name: "description", type: "string", maxLength: 64, optional: true},
            {name: "command", type: "string", maxLength: 90, optional: allOptional ? true : false},
            {name: "localtime", type: "time", optional: allOptional ? true : false},
            {name: "status", type: "string", minLength: 5, maxlength: 16, optional: true},
            {name: "autodelete", type: "boolean", optional: true}
        ]
    );
};