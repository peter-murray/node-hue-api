'use strict';

var http = require("q-io/http"),
    BufferStream = require("q-io/buffer-stream"),
    util = require("util"),
    errors = require("./errors.js");

module.exports = {
    invoke: _invoke
};

function _invoke(command, parameters) {
    var options = _buildOptions(command, parameters),
        promise;

//    console.log("HTTP Request Options");
//    console.log(JSON.stringify(options, null, 2));

    promise = http.request(options).then(_checkResponse);

    if (command.response === "application/json") {
        promise = promise.then(_convertToJson);
    }

    if (command.postProcessingFn) {
        promise = promise.then(command.postProcessingFn);
    }

    return promise;
}

function _convertToJson(response) {
    var result = _parseJsonResult(response);
    if (result.error) {
        throw new errors.ApiError(result.error);
    } else {
        result = result.result;
    }
    return result;
}

function _buildOptions(command, parameters) {
    var options = {},
        body;

    if (parameters.host) {
        options.host = parameters.host;
    } else {
        throw new Error("A host name must be provided in the parameters");
    }

    options.method = command.method || "GET";

    if (command.getPath) {
        options.path = command.getPath(parameters);
    } else {
        //TODO throw an error
        throw new errors.ApiError("Cannot get the path to invoke from the command");
    }

    // Check if the command has body arguments and process them accordingly
    if (command.bodyArguments && command.buildRequestBody) {
        body = command.buildRequestBody(parameters.values);

        if (command.bodyType === "application/json") {
            options.body = new BufferStream(JSON.stringify(body), "utf-8");
        } else {
            throw new errors.ApiError("No support for " + command.bodyType + " in requests.");
        }
    }

    if (command.response) {
        options.headers = {};
        options.headers.Accept = command.response;
    }

    return options;
}

function _checkResponse(response) {
    function extractResponse(response) {
        var str = response.toString();
        return str;
    }

    var result;
    if (response.status === 200) {
        result = response.body.read().then(extractResponse);
    } else {
        throw new errors.ApiError(
            {
                type: "Response Error",
                description: "Unexpected response status; " + response.status
            }
        );
    }
    return result;
}

function _getError(jsonObject) {
    var result = null,
        idx = 0,
        len = 0;

    if (jsonObject) {
        if (util.isArray(jsonObject)) {
            for (idx = 0, len = jsonObject.length; idx < len; idx++) {
                result = _getError(jsonObject[idx]);
                // Stop on the first error
                if (result) {
                    break;
                }
            }
        } else if (jsonObject.error) {
            return {
                "type": jsonObject.error.type,
                "description": jsonObject.error.description,
                "address": jsonObject.error.address
            };
        }
    }
    return result;
}

function _parseJsonResult(result) {
    var str,
        jsonResult,
        jsonError;

    str = result.toString();
//    console.log(str);

    jsonResult = JSON.parse(str);
    jsonError = _getError(jsonResult);

    return {
        error : jsonError,
        result: jsonError ? null : jsonResult
    };
}
