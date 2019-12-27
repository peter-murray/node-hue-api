'use strict';

const UsernamePlaceholder = require('../../../placeholders/UsernamePlaceholder')
;

const DEBUG = /node-hue-api/.test(process.env['NODE_DEBUG']);


class ApiEndpoint {

  constructor() {
    this._data = {
      placeholders: [new UsernamePlaceholder()],
      headers: {}
    };
  }

  placeholder(placeholder) {
    if (placeholder) {
      this._getData().placeholders.push(placeholder);
    }
    return this;
  }

  version(version) {
    this.version = version;
    return this;
  }

  uri(uri) {
    this._getData().url = uri;
    return this;
  }

  get() {
    return this.method('GET');
  }

  post() {
    return this.method('POST');
  }

  put() {
    return this.method('PUT');
  }

  delete() {
    return this.method('DELETE');
  }

  method(method) {
    this._getData().method = method;
    return this;
  }

  acceptJson() {
    return this.setHeader('Accept', 'application/json');
  }

  acceptXml() {
    return this.setHeader('Accept', 'application/xml');
  }

  pureJson() {
    this._getData().json = true;
    return this;
  }

  postProcess(fn) {
    if (typeof(fn) === 'function') {
      this._getData().postProcessing = fn;
    }
    return this;
  }

  errorHandler(fn) {
    if (typeof(fn) === 'function') {
      this._getData().errorHandler = fn;
    }
    return this;
  }

  statusCode(expectedStatusCode) {
    this._getData().statusCode = expectedStatusCode;
    return this;
  }

  setHeader(name, value) {
    this._getData().headers[name] = value;
    return this;
  }

  getRequest(parameters) {
    let self = this
      , data = Object.assign({}, self._getData())
    ;

    data.url = replacePlaceholders(data.url, data.placeholders, parameters);

    if (data._payloadFn) {
      let payload = data._payloadFn(parameters)
        , headers = data.headers
      ;

      data.data = payload.body;

      if (payload.type) {
        headers['Content-Type'] = payload.type;
      }
    }

    if (DEBUG) {
      if (data.placeholders) {
        //TODO redact the username from logs, although it would still appear in the URL...
        console.log('URL Placeholders:');
        data.placeholders.forEach(placeholder => {
          console.log(`  ${placeholder.toString()}`);
        });
      }

      if (data.headers) {
        console.log(`Headers: ${JSON.stringify(data.headers)}`);
      }
    }

    if (data.statusCode) {
      data.validateStatus = function(status) {
        return status === data.statusCode;
      };
    }

    // Stop axios parsing text data as JSON
    if (!self.requiresJsonConversion()) {
      data.transformResponse = function(data) {
        return data;
      };
    }

    return data;
  }

  getPostProcessing() {
    return this._getData().postProcessing;
  }

  getErrorHandler() {
    return this._getData().errorHandler;
  }

  payload(fn) {
    this._getData()._payloadFn = fn;
    return this;
  }

  requiresJsonConversion() {
    const data = this._getData();
    return data.json || (data.headers && data.headers['Accept'] === 'application/json');
  }

  get successCode() {
    return this._getData().statusCode || 200;
  }

  get headers() {
    return this._getData().headers;
  }

  _getData() {
    return this._data;
  }
}

module.exports = ApiEndpoint;


function replacePlaceholders(url, placeholders, parameters) {
  let result = url;

  if (placeholders) {
    placeholders.forEach(function(placeholder) {
      result = placeholder.inject(result, parameters);
    });
  }

  return result;
}