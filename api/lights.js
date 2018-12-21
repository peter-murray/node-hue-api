"use strict";

const lightsApi = require("./endpoints/lights")
;

const Lights = function(api) {
  let self = this
      , request = api._getRequest()
  ;

  self.execute = function(api, parameters) {
    return request.execute(api, parameters);
  }
};

Lights.prototype.getAll = function() {
  return this.execute(lightsApi.getAllLights)
};

Lights.prototype.getNew = function() {
  return this.execute(lightsApi.getNewLights)
};

Lights.prototype.searchForNew = function() {
  return this.execute(lightsApi.searchForNewLights)
};

Lights.prototype.getLightState = function(id) {
  return this.execute(lightsApi.getLightAttributesAndState, {id: id})
};

Lights.prototype.rename = function(id, name) {
  return this.execute(lightsApi.setLightAttributes, {id: id, name: name});
};

Lights.prototype.setLightState = function(id, state) {
  return this.execute(lightsApi.setLightAttributes, {id: id, state: state});
};

module.exports.create = function(api) {
  return new Lights(api);
};