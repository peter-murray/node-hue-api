'use strict';

const ApiError = require('../../ApiError')
  , HueError = require('../../HueError')
  , util = require('../../../hue-api/utils')
;

const DEBUG = /node-hue-api/.test(process.env.NODE_DEBUG);

module.exports = class Transport {

  constructor(username, axios) {
    this._username = username;
    this._axios = axios;

    if (DEBUG) {
      this._axios.interceptors.request.use(config => {
        const data = {};

        ['method', 'baseURL', 'url', 'data'].forEach(key => {
          if (config[key]) {
            data[key] = config[key];
          }
        });
        console.log(JSON.stringify(data, null, 2));

        return config;
      });
    }
  }

  execute(api, parameters) {
    let self = this
      , axios = self._axios
      , requestParameters = Object.assign({username: self._username}, parameters)
      , promise
    ;

    if (!api) {
      throw new Error('An API must be provided');
    }

    promise = axios.request(api.getRequest(requestParameters))
      .catch(err => {
        throw extractError(err, err.response);
      })
      .then(res => {
        //TODO this hue bridge can be successful, but still return an error object here
        const errors = util.parseErrors(res.data);
        if (errors) {
          throw new ApiError(errors[0]);
        }
        return res.data;
      // })
      // .catch(function (response) {
      //   let error;
      //
      //   if (response instanceof Error) {
      //     error = response;
      //     // Axios hides the error message data, so expose it, if it is there
      //     if (error.response && error.response.data) {
      //       error.message = error.response.data;
      //     }
      //   } else {
      //     error = generateResponseError(response);
      //   }
      //   throw error;
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
    this._axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};


// function generateResponseError(response) {
//   let err = new Error();
//
//   err.statusCode = response.status;
//   err.headers = response.headers;
//
//   if (response.data) {
//     err.message = response.data;
//   } else {
//     err.message = 'Unexpected status code: ' + response.status;
//   }
//
//   return err;
// }

function extractError(err, response) {
  if (!response) {
    throw new ApiError(err.message);
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