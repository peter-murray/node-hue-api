"use strict";

var util = require('util');

/**
 * An Abstract base class for custom errors.
 * @param msg The error message
 * @param constr The constructor to call.
 * @constructor
 */
var AbstractError = function (msg, constr) {
    // If defined, pass the constr property to V8's captureStackTrace to clean up the output
    Error.captureStackTrace(this, constr || this);

    // If defined, store a custom error message
    this.message = msg || "Error";
};
util.inherits(AbstractError, Error);
AbstractError.prototype.name = "Abstract Error";

/**
 * An Error Type for API related errors when calling the Philips Hue API.
 * @param error The error object returned from the request.
 * @constructor
 */
var ApiError = function(error) {
    ApiError.super_.call(this, error.description, this.constructor);
    this.type = error.type;

    if (error.address) {
        this.address = error.address;
    }
};
util.inherits(ApiError, AbstractError);
ApiError.prototype.name = "Api Error";

module.exports.ApiError = ApiError;