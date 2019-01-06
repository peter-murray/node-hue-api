'use strict';

const CLIPSensor = require('./CLIPSensor');

module.exports = class CLIPPresence extends CLIPSensor {

  constructor(data, id) {
    //TODO perfom validation on data values?
    super('CLIPPresence', data, id);
  }

  //TODO finish offf
};