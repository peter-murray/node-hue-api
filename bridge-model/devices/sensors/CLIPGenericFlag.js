'use strict';

const CLIPSensor = require('./CLIPSensor');

module.exports = class CLIPGenericFlag extends CLIPSensor {

  constructor(data, id) {
    //TODO perfom validation on data values?
    super('CLIPGenericFlag', data, id);
  }

  //TODO finish offf
};