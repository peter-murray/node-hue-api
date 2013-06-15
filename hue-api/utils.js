"use strict";

var util = require("util");

/**
 * Checks the callback and if it is valid, will resolve the promise an utilize the callback to inform of results,
 * otherwise the promise is returned to the caller to chain.
 *
 * @param promise The promise being invoked
 * @param cb The callback function, which is optional
 * @returns {*} The promise if there is not a valid callback, or null, if the callback is used to resolve the promise.
 */
module.exports.promiseOrCallback = function (promise, cb) {
    var promiseResult = promise;

    if (cb && typeof cb === "function") {
        module.exports.resolvePromise(promise, cb);
        // Do not return the promise, as the callbacks will have forced it to resolve
        promiseResult = null;
    }

    return promiseResult;
};

/**
 * Terminates a promise chain and invokes a callback with the results.
 *
 * @param promise The promise to terminate
 * @param callback The callback function to invoke
 */
module.exports.resolvePromise = function(promise, callback) {
    function resolveValue(value) {
        if (callback) {
            callback(null, value);
        }
    }

    function resolveError(err) {
        if (callback) {
            callback(err, null);
        }
    }

    promise.then(resolveValue).fail(resolveError).done();
};

/**
 * Combines the specified object with the properties defined in the values object, overwriting any existing values.
 * @param obj The object to combine the values with
 * @param values The objects to get the properties and values from, can be many arguments
 */
module.exports.combine = function (obj, values) {
    var argIdx = 1,
        value,
        property;

    while (argIdx < arguments.length) {
        value = arguments[argIdx];
        for (property in value) {
            if (value.hasOwnProperty(property)) {
                obj[property] = value[property];
            }
        }
        argIdx++;
    }

    return obj;
};

/**
 * Parses a JSON response checking for success on all changes.
 * @param result The JSON object to parse for success messages.
 * @returns {boolean} true if all changes were successful.
 */
module.exports.wasSuccessful = function (result) {
    var success = true,
        idx,
        len;

    if (util.isArray(result)) {
        for (idx = 0, len = result.length; idx < len; idx++) {
            success = success && module.exports.wasSuccessful(result[idx]);
        }
    } else {
        success = result.success !== 'undefined';
    }
    return success;
};

/**
 * Parses a JSON response looking for the errors in the result(s) returned.
 * @param results The results to look for errors in.
 * @returns {Array} Of errors found.
 */
module.exports.parseErrors = function (results) {
    var errors = [];

    if (util.isArray(results)) {
        results.forEach(function (result) {
            if (result.error) {
                errors.push(result.error);
            }
        });
    } else {
        if (results.error) {
            errors.push(results.error);
        } else {
            //TODO this should not occur
            console.log("UNPARSED");
            console.log(results);
        }
    }

    //TODO actually find the error messages
    return errors;
};

/**
 * Creates a String Value Array from the provided values.
 * @param values The values to convert to a String value Array.
 * @returns {Array} of strings.
 */
module.exports.createStringValueArray = function (values) {
    var result = [];

    if (Array.isArray(values)) {
        values.forEach(function (value) {
            result.push(_asStringValue(value));
        });
    } else {
        result.push(_asStringValue(values));
    }

    return result;
};

function _asStringValue(value) {
    var result;

    if (typeof(value) === 'string') {
        result = value;
    } else {
        result = String(value);
    }
    return result;
}