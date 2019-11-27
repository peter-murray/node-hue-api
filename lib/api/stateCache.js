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
}
module.exports = Cache;