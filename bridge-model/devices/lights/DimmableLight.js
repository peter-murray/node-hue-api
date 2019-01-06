'use strict';


const Light = require('./Light');


class DimmableLight extends Light {

  constructor(data, id) {
    super(data, id);
  }
}
module.exports = DimmableLight;