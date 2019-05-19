'use strict';

const lightsApi = require('./http/endpoints/lights')
  , ApiDefinition = require('./http/ApiDefinition.js')
  , ApiError = require('./ApiError')
;

module.exports = class Lights extends ApiDefinition {

  constructor(hueApi, request) {
    super(hueApi, request);
  }

  getAll() {
    return this.execute(lightsApi.getAllLights);
  }

  //TODO missing normal get

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
    return this.getLightAttributesAndState(id).then(result => { return result.state;});
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