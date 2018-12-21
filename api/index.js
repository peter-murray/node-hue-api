"use strict";

const capabilities = require("./capabilities")
    , lights = require("./lights")
    , groups = require("./groups")
    , request = require("./request")
;

function Api(config) {
  let self = this;

  self._config = config;
  self._request = request.create(config);


  self.capabilities = capabilities.create(self);
  self.lights = lights.create(self);
  self.groups = groups.create(self);
}

module.exports = function (host, username, timeout, port) {
  let config = {
    protocol: "http",
    hostname: host,
    username: username,
    timeout: timeout || 10000,
    port: port || 80
  };
  
  return new Api(config)
};


Api.prototype._getRequest = function() {
  return this._request
};
//
// Api.prototype._getUsername = function() {
//   return this._config.username;
// };
