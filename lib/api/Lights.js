'use strict';

const lightsApi = require('./http/endpoints/lights')
  , ApiDefinition = require('./http/ApiDefinition.js')
  , ApiError = require('../ApiError')
;

module.exports = class Lights extends ApiDefinition {

  constructor(hueApi) {
    super(hueApi);
  }

  getAll() {
    return this.execute(lightsApi.getAllLights);
  }

  getLightById(id) {
    return this.getAll().then(lights => {
      return lights.find(light => {
        return light.id === id;
      });
    });
  }

  getLightByName(name) {
    return this.getAll().then(lights => {
      return lights.lights.find(light => {
        return light.name === name;
      });
    });
  }

  getNew() {
    return this.execute(lightsApi.getNewLights);
  }

  searchForNew() {
    return this.execute(lightsApi.searchForNewLights);
  }

  getLightAttributesAndState(id) {
    return this.execute(lightsApi.getLightAttributesAndState, {id: id});
  }

  getLightState(id) {
    return this.getLightAttributesAndState(id).then(result => { return result.state; });
  }

  setLightState(id, state) {
    return this.hueApi.getLightDefinition(id)
      .then(device => {
        if (!device) {
          throw new ApiError(`Light with id:${id} was not found on this bridge`);
        }
        return this.execute(lightsApi.setLightState, {id: id, state: state, device: device});
      });
  }

  rename(id, name) {
    return this.execute(lightsApi.setLightAttributes, {id: id, name: name});
  }

  deleteLight(id) {
    return this.execute(lightsApi.deleteLight, {id: id});
  }
};