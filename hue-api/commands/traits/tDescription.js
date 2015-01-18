"use strict";

var Trait = require("traits").Trait,
    ApiError = require("../../errors").ApiError;

module.exports = function (description) {
    return Trait(
        {
            commandDescription : description
        }
    );
};
