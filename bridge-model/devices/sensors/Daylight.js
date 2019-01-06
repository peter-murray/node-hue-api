'use strict';

const Sensor = require('./Sensor');

module.exports = class Daylight extends Sensor {

  constructor(data, id) {
    super('Daylight', data, id);
  }


};