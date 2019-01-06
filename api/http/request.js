'use strict';

const url = require('url')
  , https = require('https')
  , sslCertificate = require('get-ssl-certificate')
  , axiosDebug = require('axios-debug-log')
  , axios = require('axios')
  , ApiError = require('../../hue-api/errors')
  , util = require('../../hue-api/utils')
;


module.exports.create = function (config) {
  const requestConfig = generateRequestConfig(config)
    , username = config.username
  ;

  return axios.get(`${requestConfig.baseURL}/api/config`, {httpsAgent: new https.Agent({rejectUnauthorized: false})})
    .then(res => {
      const bridgeId = res.data.bridgeid.toLowerCase();

      return sslCertificate.get(config.hostname)
        .then(cert => {
          const issuer = cert.issuer.CN.toLowerCase();

          if (issuer === bridgeId) {
            return new https.Agent({
              keepAlive: true,
              keepAliveMsecs: 10000,
              maxSockets: 50,
              timeout: requestConfig.timeout,
              rejectUnauthorized: false,
              // ca: cert.pemEncoded //TODO there are still issues here, as the certificate being self sign is failing somewhere deeper in TLS code
            });
          } else {
            throw new ApiError('The hue bridge certificate does not match the expected issuer');
          }
        }).catch(error => {
          throw new ApiError(error);
        })
        .then(agent => {
          return new HttpRequest(
            username,
            axios.create({baseURL: requestConfig.baseURL, httpsAgent: agent})
          );
        });
    });
};

const HttpRequest = function (username, axiosRequest) {
  let self = this;
  self._username = username;
  self._axios = axiosRequest;
};


HttpRequest.prototype.execute = function (api, parameters) {
  let self = this
    , axios = self._axios
    , requestParameters = Object.assign({username: self._username}, parameters)
    , promise
  ;

  if (!api) {
    throw new Error('An API must be provided');
  }

  promise = axios.request(api.getRequest(requestParameters)).then(res => {
    //TODO this hue bridge can be successful, but still return an error object here
    const errors = util.parseErrors(res.data);
    if (errors) {
      throw new ApiError(errors[0]);
    }
    return res.data;
  }).catch(function (response) {
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
