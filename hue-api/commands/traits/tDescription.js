"use strict";

var Trait = require("traits").Trait,
    ApiError = require("../../../api/ApiError").ApiError;

module.exports = function (description) {
    return Trait(
        {
            commandDescription : description
        }
    );
};
