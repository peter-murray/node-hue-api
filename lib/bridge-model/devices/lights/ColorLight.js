'use strict';

const Light = require('./Light');


class ColorLight extends Light {

  constructor(data, id) {
    super(data, id);
  }
}
module.exports = ColorLight;