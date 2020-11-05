'use strict';

const Bottleneck = require('bottleneck')
  , ApiError = require('../../ApiError')
  , HueError = require('../../HueError')
  , util = require('../../util')
;

// The limiter configuration if nothing is specified
const DEFAULT_LIMITER_CONFIG = {
  maxConcurrent: 4,
  minTime: 50,
};

module.exports = class Transport {

  constructor(username, client, queueConfig) {
    this._username = username;
    this._client = client;
    this.configureLimiter(queueConfig || DEFAULT_LIMITER_CONFIG);
  }

  configureLimiter(config) {
    this._limiter = new Bottleneck(config);
  }

  get limiter() {
    return this._limiter;
  }

  /**
   * Executes an API Endpoint Request.
   * @param {ApiEndpoint} api The Api endpoint to perform a request against.
   * @param {Object=} parameters Any parameters specific to the request.
   * @returns {Promise<any>} The promise for making the specified API request.
   */
  execute(api, parameters) {
    let self = this
      , limiter = this.limiter
      , client = self._client
      , requestParameters = Object.assign({username: self._username}, parameters)
      , promise
    ;

    if (!api) {
      throw new Error('An API must be provided');
    }

    promise = limiter.schedule(() => {return client.request(api.getRequest(requestParameters))})
      .catch(err => {
        throw extractError(err, err.response);
      })
      .then(res => {
        // Errors can be contained in the object payload from a successful response code.
        const errors = util.parseErrors(res.data);
        if (errors) {
          throw new ApiError(errors[0]);
        }
        return res.data;
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
  }

  refreshAuthorizationHeader(token) {
    // Update the default common authorization header with the new bearer token
    this._client.refreshAuthorizationHeader(`Bearer ${token}`);
  }
};

/**
 * Extracts an appropriate error from the provided details.
 *
 * @param {Error} err The captured Error.
 * @param {Object} response The underlying transport HTTP response object.
 * @returns {ApiError | HueError} The error extracted from the data provided
 */
function extractError(err, response) {
  if (!response) {
    //TODO fetch leaks the API key in the URL, need to redact it
    const error = new ApiError(err.message);
    // Set the original stack trace here as the one for the error created is pretty much useless and obscures the real problem
    error.stack = err.stack
    throw error;
  }

  const headers = response.headers
    , authenticateHeader = headers ? headers['www-authenticate'] : null
  ;

  let hueError;

  if (authenticateHeader) {
    const errorMatch = /error="(.*?)"/.exec(authenticateHeader)
      , errorDescriptionMatch = /error_description="(.*?)"/.exec(authenticateHeader)
    ;
    hueError = new HueError({
      type: response.status,
      message: (errorMatch ? errorMatch[1] : response.data) || 'Error',
      description: errorDescriptionMatch ? errorDescriptionMatch[1] : null,
      address: response.config.url,
    });
  } else {
    hueError = new HueError({
      type: response.status,
      error: response.data || 'Error',
      address: response.config.url,
    });
  }

  const error = new ApiError(hueError);
  // error.stack = err.stack;
  return error;
}