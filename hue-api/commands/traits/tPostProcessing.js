"use strict";

var util = require("util")
    , Trait = require("traits").Trait
    , ApiError = require("../../errors").ApiError
    ;

function validateFunction(fn) {
    var result = [];

    if (util.isArray(fn)) {
        fn.forEach(function (actualFn) {
            result = result.concat(validateFunction(actualFn));
        });
    } else {
        if (typeof fn !== "function") {
            throw new ApiError("The post processing function must be a function; " + typeof fn);
        }
        result.push(fn);
    }

    return result;
}

module.exports = function (fn) {
    var processingFunctions;

    if (arguments.length === 0) {
        throw new ApiError("At least one post processing functions must be provided");
    }

    processingFunctions = validateFunction(Array.prototype.slice.call(arguments));

    return Trait({
        "postProcessing": processingFunctions
    });
};