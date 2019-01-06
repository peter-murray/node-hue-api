'use strict';

const CLIPSensor = require('./CLIPSensor');

module.exports = class CLIPLightlevel extends CLIPSensor {

  constructor(data, id) {
    //TODO perfom validation on data values?
    super('CLIPLightlevel', data, id);
  }

  //TODO finish offf
};