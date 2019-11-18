'use strict';

const model = require('../model')
;


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
        light = model.createFromBridge('light', id, lightData);
        this._lights[id] = light;
      }
    }

    return light;
  }
}
module.exports = Cache;