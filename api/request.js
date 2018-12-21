'use strict';

const url = require('url')
    , axiosDebug = require('axios-debug-log')
    , axios = require('axios')
    , deepExtend = require("deep-extend")
;

const HttpRequest = function(config) {
  let self = this
      , requestConfig = generateRequestConfig(config)
  ;

  self._axios = axios.create(requestConfig);
  self._username = config.username;
};

module.exports.create = function(config) {
  return new HttpRequest(config);
};

HttpRequest.prototype.execute = function(api, parameters) {
  let self = this
      , axios = self._axios
      , requestParameters = deepExtend({username: self._username}, parameters)
      , promise
  ;

  if (!api) {
    throw new Error('An API must be provided');
  }
  

  promise = axios.request(api.getRequest(requestParameters)).then(res => {
    return res.data;
  }).catch(function(response) {
    let error;

    if (response instanceof Error) {
      error = response;
      // Axios hides the error message data, so expose it, if it is there
      if (error.response && error.response.data) {
        error.message = error.response.data;
      }
    } else {
      error = generateResponseError(response);
    }
    throw error;
  });

  if (api.getErrorHandler()) {
    promise = promise.catch(api.getErrorHandler());
  }

  if (api.getPostProcessing()) {
    // Inject the request parameters into the post processing function
    promise = promise.then(result => {
      return api.getPostProcessing()(result, requestParameters);
    });
  }

  return promise;
};

function generateRequestConfig(config) {
  let requestConfig = {};

  requestConfig.baseURL = url.format(config);
  requestConfig.timeout = config.timeout || 20000;

  return requestConfig;
}

function generateResponseError(response) {
  let err = new Error();

  err.statusCode = response.status;
  err.headers = response.headers;

  if (response.data) {
    err.message = response.data;
  } else {
    err.message = 'Unexpected status code: ' + response.status;
  }

  return err;
}
