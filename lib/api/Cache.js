'use strict';

const model = require('../model')
  , LightIdPlaceHolder = require('../placeholders/LightIdPlaceholder')
;

const LIGHT_ID_PLACEHOLDER = new LightIdPlaceHolder();

/**
 * @type {import('../model/Light')} Light
 * @type {Cache}
 */
module.exports = class Cache {

  constructor(data) {
    this.data = data;
    this._lights = {};
  }

  /**
   * Obtains a known light from the cache
   * @param id {Number | String} The id for the light.
   * @return {Light}
   */
  getLight(id) {
    const lightId = LIGHT_ID_PLACEHOLDER.getValue({id: id});

    let light = this._lights[lightId];

    if (!light) {
      let lightData = this.data.lights[lightId];
      if (lightData) {
        light = model.createFromBridge('light', lightId, lightData);
        this._lights[lightId] = light;
      }
    }

    return light;
  }

  /**
   * Get the modelid for the bridge.
   * @return {String} The model number fo the bridge.
   */
  get modelid() {
    // BSB001 is the first generation bridge, BSB002 is the current generation one that can support entertainment API
    return this.data.config.modelid;
  }

  /**
   * Get the API version for the bridge.
   * @return {String} The Api Version for the bridge.
   */
  get apiversion() {
    return this.data.config.apiversion;
  }
};