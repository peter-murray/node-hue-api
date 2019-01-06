'use strict';

const Sensor = require('./Sensor');

module.exports = class ZGPSwitch extends Sensor {

  constructor(data, id) {
    super('ZGPSwitch', data, id);
  }
};