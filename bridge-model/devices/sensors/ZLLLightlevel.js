'use strict';

const Sensor = require('./Sensor');

module.exports = class ZLLLightlevel extends Sensor {

  constructor(data, id) {
    super('ZLLLightlevel', data, id);
  }
};