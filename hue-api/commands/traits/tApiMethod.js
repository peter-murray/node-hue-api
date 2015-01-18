"use strict";

var Trait = require("traits").Trait,
    ApiError = require("../../errors").ApiError;

function extractParameters(str) {
    var parameters = [],
        currentParameter = null,
        currentChar,
        idx = 0;

    if (str) {
        while (idx < str.length) {
            currentChar = str.charAt(idx);

            if (currentChar === "<") {
                // The beginning of a parameter
                currentParameter = "";
            } else if (currentChar === ">") {
                // The end of a parameter, maybe
                if (currentParameter !== null) {
                    parameters.push(currentParameter);
                    // Reset the current parameter
                    currentParameter = null;
                }
            } else if (currentParameter !== null) {
                // Append the character to the parameter name
                currentParameter += currentChar;
            }

            idx += 1;
        }
    }

    return parameters;
}

module.exports = function (path, method, version, permission, response) {
    return Trait(
        {
            path: path,
            method: method,
            version: version,
            permission: permission, //TODO may not be required as this represents the <username> variable in the path
            response: response || "application/json",

            pathParameters: function () {
                if (!this.path) {
                    throw new ApiError("The command has no path");
                }

                return extractParameters(this.path);
            },

            getPath: function (values) {
                var requiredParameters = this.pathParameters(),
                    resolvedPath = this.path;

                requiredParameters.forEach(function (reqParam) {
                    if (values[reqParam] === undefined) {
                        throw new ApiError("The required parameter '" + reqParam + "' was missing a value.");
                    }

                    resolvedPath = resolvedPath.replace("<" + reqParam + ">", values[reqParam]);
                });

                return resolvedPath;
            },

            toString: function () {
                var result = {
                    "path": this.path,
                    "method": this.method,
                    "version": this.version
                };

                return JSON.stringify(result);
            }
        }
    );
};