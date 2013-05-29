"use strict";

var Trait = require("traits").Trait,
    ApiError = require("../../errors").ApiError;

module.exports = function (fn) {
    if (!fn) {
        throw new ApiError("A post processing function must be provided");
    }

    if (typeof fn !== "function") {
        throw new ApiError("The post processing function must be a function; " + typeof fn );
    }

    return Trait(
        {
            "postProcessingFn" : fn
        }
    );
};
