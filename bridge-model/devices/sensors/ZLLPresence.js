'use strict';

const Sensor = require('./Sensor');

module.exports = class ZLLPresense extends Sensor {

  constructor(data, id) {
    super('ZLLPresense', data, id);
  }
};