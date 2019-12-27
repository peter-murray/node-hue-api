'use strict';

const Bottleneck = require('bottleneck')
  , lightsApi = require('./http/endpoints/lights')
  , ApiDefinition = require('./http/ApiDefinition.js')
  , ApiError = require('../ApiError')
  , util = require('../util')
  , model = require('../model')
;

 /**
 * @type {Lights}
 */
module.exports = class Lights extends ApiDefinition {

  constructor(hueApi) {
    super(hueApi);

    // As per Bridge documentation guidance, limit the number of calls to the light state changes to 10 per second max
    this._lightStateLimiter = new Bottleneck({maxConcurrent: 1, minTime: 60});
  }

  /**
   * Gets all the Lights from the Bridge
   * @returns {Promise<Array<import('../model/Light')>>}
   */
  getAll() {
    return this.execute(lightsApi.getAllLights);
  }

  /**
   * Get a specific Light from the Bridge.
   * @param id {number | Light} The id or Light instance to get from the Bridge.
   * @returns {Promise<Light>}
   */
  getLight(id) {
    const lightId = id.id || id;

    return this.getAll().then(lights => {
      const found = lights.filter(light => light.id === lightId);

      if (found.length === 0) {
        throw new ApiError(`Light ${lightId} not found`);
      }
      return found[0]
    });
  }

  /**
   * @deprecated since 4.0. Use getLight(id) instead.
   * @param id {number} The ide of the light to get.
   * @returns {Promise<Light>}
   */
  getLightById(id) {
    util.deprecatedFunction('5.x', 'lights.getLightById(id)', 'Use lights.getLight(id) instead.');
    return this.getLight(id);
  }

  /**
   * Retrieves a Light from the Bridge by name.
   * @param name {string} The name of the light to get.
   * @returns {Promise<Array<Light>>}
   */
  getLightByName(name) {
    return this.getAll().then(lights => {
      return lights.find(light => {
        return light.name === name;
      });
    });
  }

  /**
   * Discovers the "new" lights detected by the Bridge.
   * @returns {Promise<Array<Light>>}
   */
  getNew() {
    return this.execute(lightsApi.getNewLights);
  }

  /**
   * Starts a search for "new"/undiscovered Lights by the bridge. This can take up to 30 seconds to complete.
   * @returns {Promise<boolean>}
   */
  searchForNew() {
    return this.execute(lightsApi.searchForNewLights);
  }

  /**
   * Obtains the current Attributes and State settings for the specified Light.
   * @param id {number | Light} The id or Light instance to get the attributes and state for.
   * @returns {Promise<Object>}
   */
  getLightAttributesAndState(id) {
    return this.execute(lightsApi.getLightAttributesAndState, {id: id});
  }

  /**
   * Obtains the current State settings for the specified Light.
   * @param id {number | Light} The id or Light instance to get the current state for.
   * @returns {Promise<Object>}
   */
  getLightState(id) {
    return this.getLightAttributesAndState(id).then(result => { return result.state; });
  }

  /**
   * Sets the current state for the Light to desired settings.
   * @param id {number | Light} The id or Light instance to set the state on.
   * @param state {Object | LightState} The LightState to set on the light.
   * @returns {PromiseLike<any> | Promise<any>}
   */
  setLightState(id, state) {
    let lightId = id;
    if (model.isLightInstance(id)) {
      lightId = id.id;
    }

    return this.hueApi.getLightDefinition(lightId)
      .then(device => {
        if (!device) {
          throw new ApiError(`Light with id:${lightId} was not found on this bridge`);
        }
        return this._setLightState(id, state, device);
      });
  }

  /**
   * Renames a Light on the Bridge to the specified name in the Light instance.
   * @param light {Light} The Light to rename with the new name set.
   * @returns {Promise<Boolean>}
   */
  renameLight(light) {
    if (model.isLightInstance(light)) {
      return this.execute(lightsApi.setLightAttributes, {id: light, light: light});
    } else {
      throw new ApiError('Light parameter is not an instance of a light');
    }
  }

  /**
   * @deprecated since 4.x, use renameLight(light) instead
   * @param id {int} The Light to rename.
   * @param name {string} The new name.
   * @returns {Promise}
   */
  rename(id, name) {
    if (arguments.length === 1) {
      util.deprecatedFunction('5.x', 'lights.rename(id, name)', 'Use lights.renameLight(light) instead.');
      return this.renameLight(id);
    } else {
      util.deprecatedFunction('5.x', 'lights.rename(id, name)', 'Use lights.renameLight(light) instead.');
      return this.execute(lightsApi.setLightAttributes, {id: id, name: name});
    }
  }

  /**
   * Deletes a Light from the Hue Bridge
   * @param id { number | Light} The id or Light instance to be deleted
   * @returns {Promise<boolean>}
   */
  deleteLight(id) {
    return this.execute(lightsApi.deleteLight, {id: id});
  }

  _setLightState(id, state, device) {
    const self = this;

    return this._lightStateLimiter.schedule(() => {
      return self.execute(lightsApi.setLightState, {id: id, state: state, device: device});
    });
  }
};