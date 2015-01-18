"use strict";

var util = require("util")
    , Trait = require("traits").Trait
    , ApiError = require("../../errors").ApiError
    ;

module.exports = function (codeMap) {
    if (!codeMap) {
        throw new ApiError("A status code to error messages object must be provided");
    }

    return Trait({
        statusCodeMap: codeMap
    });
};
