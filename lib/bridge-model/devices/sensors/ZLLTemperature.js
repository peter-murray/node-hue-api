'use strict';

const Sensor = require('./Sensor');

module.exports = class ZLLTemperature extends Sensor {

  constructor(data, id) {
    super('ZLLTemperature', data, id);
  }

  get temperature() {
    return this.state.temperature;
  }
};