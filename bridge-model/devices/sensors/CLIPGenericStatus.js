'use strict';

const CLIPSensor = require('./CLIPSensor');

module.exports = class CLIPGenericStatus extends CLIPSensor {

  constructor(data, id) {
    //TODO perfom validation on data values?
    super('CLIPGenericStatus', data, id);
  }

  //TODO finish offf
};