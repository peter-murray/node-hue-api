'use strict';

var url = require("url")
  , util = require("util")
  , Q = require("q")
  , axios = require("axios")
  , httpAdapter = require("axios/lib/adapters/http")
  , errors = require("./errors.js")
  , debug = /hue-api/.test(process.env.NODE_DEBUG)
  ;

var defaultOptions = {
  adapter: httpAdapter,
};

function buildOptions(command, parameters) {
  var options = {
      adapter: httpAdapter,
      debug: debug,
      headers: {}
    },
    body,
    urlObj = {
      protocol: parameters.ssl ? "https" : "http",
      hostname: parameters.host
    };

  if (parameters.port) {
    urlObj.port = parameters.port;
  }

  options.timeout = parameters.timeout || 10000;
  options.method = command.method || "GET";

  if (command.getPath) {
    urlObj.pathname = command.getPath(parameters);
  } else {
    throw new errors.ApiError("Cannot get the path to invoke from the command");
  }
  options.url = url.format(urlObj);

  // Check if the command has body arguments and process them accordingly
  if (command.bodyArguments && command.buildRequestBody) {
    body = command.buildRequestBody(parameters.values);

    if (command.bodyType === "application/json") {
      options.responseType = "json";
      options.data = JSON.stringify(body);
    } else {
      throw new errors.ApiError("No support for " + command.bodyType + " in requests.");
    }
  }

  if (command.response) {
    options.headers.Accept = command.response;
  }

  return options;
}

function getError(jsonObject) {
  var result = null
    , idx = 0
    , len = 0
    ;

  if (jsonObject) {
    if (util.isArray(jsonObject)) {
      for (idx = 0, len = jsonObject.length; idx < len; idx++) {
        result = getError(jsonObject[idx]);
        // Stop on the first error
        if (result) {
          break;
        }
      }
    } else if (jsonObject.error) {
      return {
        type: jsonObject.error.type,
        description: jsonObject.error.description,
        address: jsonObject.error.address
      };
    }
  }
  return result;
}

function checkForError(result) {
  var jsonResult
    , jsonError
    ;

  jsonResult = result.data;
  jsonError = getError(jsonResult);

  if (jsonError) {
    throw new errors.ApiError(jsonError);
  }
  return jsonResult;
}

function requireStatusCode200(result) {
  if (result.status !== 200) {
    throw new errors.ApiError(
      {
        type: "Response Error",
        description: "Unexpected response status; " + result.statusCode,
        statusCode: result.statusCode
      }
    );
  }
  return result;
}

function generateErrorsIfMatched(map) {
  return function (result) {
    if (map && map[result.statusCode]) {
      throw new errors.ApiError({
        type: result.statusCode,
        message: map[result.statusCode]
      });
    }
    return result;
  };
}

module.exports.invoke = function (command, parameters) {
  var options = buildOptions(command, parameters)
    , promise
    ;

  //promise = requestUtil.request(options);
  promise = wrapAxios(axios(options));

  if (command.statusCodeMap) {
    promise = promise.then(generateErrorsIfMatched(command.statusCodeMap));
  }

  promise = promise
    .then(requireStatusCode200)
    .then(function (requestResult) {
      var result;

      if (options.headers.Accept === "application/json") {
        result = checkForError(requestResult);
      } else {
        result = requestResult.data;
      }
      return result;
    });

  if (command.postProcessing) {
    command.postProcessing.forEach(function (fn) {
      promise = promise.then(fn);
    });
  }

  return promise;
};

module.exports.simpleGet = function (uri) {
  return wrapAxios(axios.get(uri, defaultOptions))
      .then(requireStatusCode200)
      .then(function(result) {
          return result.data;
      });
};

/**
 * Wrap an axios ES6 promise inside a Q promise.
 * @param promise The axios promise to wrap
 * @returns {*|promise}
 */
function wrapAxios(promise) {
  var deferred = Q.defer();

  promise.then(function (result) {
      deferred.resolve(result);
    })
    .catch(function (err) {
      deferred.reject(err);
    });

  return deferred.promise;
}