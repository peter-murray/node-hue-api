'use strict';

var http = require("q-io/http"),
    BufferStream = require("q-io/buffer-stream"),
    util = require("util"),
    errors = require("./errors.js");

module.exports = {
    httpPost  : doPost,
    httpPut   : doPut,
    httpGet   : doGet,
    jsonGet   : doJsonGet,
    httpDelete: doDelete
};

function doDelete(host, path, values) {
    return _doJsonRequest(
        {
            "host"  : host,
            "path"  : path,
            "method": "DELETE",
            "values": values
        }
    );
}

function doGet(host, path) {
    return _doRequest(
        {
            "host": host,
            "path": path
        }
    );
}

function doJsonGet(host, path) {
    return _doJsonRequest(
        {
            "host": host,
            "path": path
        }
    );
}

function doPost(ipAddress, path, values) {
    return _doJsonRequest(
        {
            "host"  : ipAddress,
            "path"  : path,
            "method": "POST",
            "values": values
        });
}

function doPut(ipAddress, path, values) {
    return _doJsonRequest(
        {
            "host"  : ipAddress,
            "path"  : path,
            "method": "PUT",
            "values": values
        });
}

function _doJsonRequest(parameters) {

    function processResponse(response) {
        var result = _parseJsonResult(response);
        if (result.error) {
            throw new errors.ApiError(result.error);
        } else {
            result = result.result;
        }
        return result;
    }

    return _doRequest(parameters).then(processResponse);
}

function _buildOptions(parameters) {
    var options = {};

    if (parameters.host) {
        options.host = parameters.host;
    } else {
        throw new Error("A host name must be provided in the parameters");
    }

    options.method = parameters.method || "GET";

    if (parameters.path) {
        options.path = parameters.path;
    }

    if (parameters.values) {
        options.body = new BufferStream(JSON.stringify(parameters.values), "utf-8");
    }

    return options;
}

function _doRequest(parameters) {
    var options = _buildOptions(parameters);
    return http.request(options).then(_checkResponse);
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
        //TODO errors...
        result = new Error("Invalid response");
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

function _isErrorMessage(jsonObject) {
    return _getError() !== null;
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

/**
 * Gets a function that will process the HTTP Response object and inform the deferred object of the results.
 * @param deferred The deferred object to inform of the results
 * @return {Function} A callback function to use in an HTTP Request.
 */
function _getHttpResponseProcessor(deferred) {
    return function (response) {
        var str = '';

        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            deferred.resolve(str);
        });
    };
}
