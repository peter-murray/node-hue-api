'use strict';

const CLIPSensor = require('./CLIPSensor');

module.exports = class CLIPTemperature extends CLIPSensor {

  constructor(data, id) {
    //TODO perfom validation on data values?
    super('CLIPTemperature', data, id);
  }

  //TODO finish offf
};