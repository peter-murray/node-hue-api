"use strict";

const capabilitiesApi = require("./endpoints/capabilities")
;

const Capabilities = function(api) {
  let self = this
      , request = api._getRequest()
  ;

  self.execute = function(api, parameters) {
    return request.execute(api, parameters);
  }
};

Capabilities.prototype.getAll = function() {
  return this.execute(capabilitiesApi.getAll)
};

module.exports.create = function(api) {
  return new Capabilities(api);
};