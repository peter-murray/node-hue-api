'use strict';

const deepExtend = require('deep-extend')
    , usernamePlaceHolderFn = require("../placeholders/username")
;

const debug = /node-hue-api/.test(process.env['NODE_DEBUG']);

let APIEndpoint = function() {
  this._data = {
    placeholders: []
  };

  this.placeholder("username", usernamePlaceHolderFn)
};
module.exports = APIEndpoint;

APIEndpoint.prototype.version = function(version) {
  this.version = version;
  return this;
};

APIEndpoint.prototype.uri = function(uri) {
  let self = this;
  self._data.url = uri;
  return self;
};

APIEndpoint.prototype.get = function() {
  let self = this;
  self._data.method = 'GET';
  return self;
};

APIEndpoint.prototype.post = function() {
  let self = this;
  self._data.method = 'POST';
  return self;
};

APIEndpoint.prototype.put = function() {
  let self = this;
  self._data.method = 'PUT';
  return self;
};

APIEndpoint.prototype.delete = function() {
  let self = this;
  self._data.method = 'DELETE';
  return self;
};

APIEndpoint.prototype.acceptJson = function() {
  let self = this;
  self.setHeader('Accept', 'application/json');
  return self;
};

APIEndpoint.prototype.pureJson = function() {
  let self = this;
  self._getData().json = true;
  return self;
};

APIEndpoint.prototype.acceptXml = function() {
  let self = this;
  self.setHeader('Accept', 'application/xml');
  return self;
};

// APIEndpoint.prototype.acceptText = function() {
//   let self = this;
//   self.setHeader('Accept', 'text/plain');
//   return self;
// };

APIEndpoint.prototype.postProcess = function(fn) {
  let self = this
      , data = self._getData()
  ;

  if (typeof(fn) === 'function') {
    data.postProcessing = fn;
  }

  return self;
};

APIEndpoint.prototype.errorHandler = function(fn) {
  let self = this
      , data = self._getData()
  ;

  if (typeof(fn) === 'function') {
    data.errorHandler = fn;
  }

  return self;
};

APIEndpoint.prototype.placeholder = function(name, fn) {
  let self = this
      , data = self._getData()
  ;

  data.placeholders.push({name: name, fn: fn});
  return self;
};

APIEndpoint.prototype.statusCode = function(expectedStatusCode) {
  let self = this
      , data = self._getData()
  ;

  data.statusCode = expectedStatusCode;
  return self;
};

APIEndpoint.prototype.setHeader = function(name, value) {
  let self = this
      , headers = self._getHeaders()
  ;

  headers[name] = value;
  return self;
};

APIEndpoint.prototype.getPostProcessing = function() {
  let self = this
      , data = self._getData()
  ;
  return data.postProcessing;
};

APIEndpoint.prototype.getErrorHandler = function() {
  let self = this
      , data = self._getData()
  ;

  return data.errorHandler;
};

APIEndpoint.prototype.payload = function(fn) {
  let self = this
      , data = self._getData()
  ;

  data._payloadFn = fn;

  return this;
};

APIEndpoint.prototype.requiresJsonConversion = function() {
  let self = this
      , data = self._getData()
  ;

  return data.json ||
         (data.headers && data.headers['Accept'] === 'application/json');
};

APIEndpoint.prototype.getRequest = function(parameters) {
  let self = this
      , data = deepExtend({}, self._getData())
  ;

  if (data.placeholders && data.placeholders.length > 0) {
    data.placeholders.forEach(function(placeholder) {
      let name = placeholder.name
          , placeholderFn = placeholder.fn
      ;

      data.url = data.url.replace(
          '<' + name + '>',
          placeholderFn(parameters[name]).getValue()
      );
    });
  }

  if (data._payloadFn) {
    let payload = data._payloadFn(parameters)
        , headers = getOrCreateHeaders(data)
    ;

    data.data = payload.body;

    if (payload.type) {
      headers['Content-Type'] = payload.type;
    }
  }

  if (debug) {
    console.log(JSON.stringify(data));//TODO redact auth passwords
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
};

function getOrCreateHeaders(data) {
  if (data) {
    if (!data.headers) {
      data.headers = {};
    }

    return data.headers;
  }
}

APIEndpoint.prototype.getSuccessCode = function() {
  let self = this;

  return self._getData().statusCode || 200;
};

APIEndpoint.prototype._getHeaders = function() {
  let self = this
      , data = self._getData()
  ;

  return getOrCreateHeaders(data);
};

APIEndpoint.prototype._getData = function() {
  let self = this;
  return self._data;
};