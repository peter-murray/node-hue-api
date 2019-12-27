'use strict';

const model = require('../model')
  , LightIdPlaceHolder = require('../placeholders/LightIdPlaceholder')
;

const LIGHT_ID_PLACEHOLDER = new LightIdPlaceHolder();

class Cache {

  constructor(data) {
    this.data = data;
    this._lights = {};
  }

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

  get modelid() {
    // BSB001 is the first generation bridge, BSB002 is the current generation one that can support entertainment API
    return this.data.config.modelid;
  }

  get apiversion() {
    return this.data.config.apiversion;
  }
}
module.exports = Cache;