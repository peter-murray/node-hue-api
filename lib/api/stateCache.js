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
      let lightData = this.data.lights[id];
      if (lightData) {
        light = lightBuilder.create(lightData, id);
        this._lights[id] = light;
      }
    }

    return light;
  }
}
module.exports = Cache;