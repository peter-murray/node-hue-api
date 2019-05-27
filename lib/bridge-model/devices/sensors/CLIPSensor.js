'use strict';

const Sensor = require('./Sensor');

module.exports = class CLIPSensor extends Sensor {

  constructor(clipType, data, id) {
    //TODO perform validation on data values?
    super(clipType, data, id);
  }

  get payload() {
    const payload = super.payload;
    payload.type = this.type;
    return payload;
  }
};