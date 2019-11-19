'use strict';

const lightBuilder = require('../bridge-model/devices/lights');

class Cache {

  constructor(data) {
    this.data = data;
    this._lights = {};
  }

  getLight(id) {
    let light = this._lights[id];

    if (!light) {
      const lightData = this.data.lights[id];
      if (lightData) {
        light = lightBuilder.create(lightData, id);
        this._lights[id] = light;
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