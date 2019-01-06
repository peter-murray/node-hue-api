'use strict';

const Sensor = require('./Sensor');

module.exports = class ZLLSwitch extends Sensor {

  constructor(data, id) {
    super('ZLLSwitch', data, id);
  }
};