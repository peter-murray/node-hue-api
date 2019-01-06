'use strict';

const Light = require('./Light');


class ExtendedColorLight extends Light {

  constructor(data, id) {
    super(data, id);
  }
}
module.exports = ExtendedColorLight;