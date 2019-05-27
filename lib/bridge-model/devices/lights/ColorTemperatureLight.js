'use strict';

const Light = require('./Light');


class ColorTemperatureLight extends Light {

  constructor(data, id) {
    super(data, id);
  }
}
module.exports = ColorTemperatureLight;