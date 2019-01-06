'use strict';

const CLIPSensor = require('./CLIPSensor');

module.exports = class CLIPHumidity extends CLIPSensor {

  constructor(data, id) {
    //TODO perfom validation on data values?
    super('CLIPHumidity', data, id);
  }

  //TODO finish offf
};