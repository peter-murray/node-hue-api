'use strict';

const CLIPSensor = require('./CLIPSensor.js')
  , types = require('../../types')
;

const CONFIG_ATTRIBUTES = [];

const STATE_ATTRIBUTES = [
  types.int16({name: 'temperature'}),
];

module.exports = class CLIPTemperature extends CLIPSensor {

  constructor(id) {
    super(CONFIG_ATTRIBUTES, STATE_ATTRIBUTES, id);
  }

  get temperature() {
    return this.getStateAttributeValue('temperature');
  }

  set temperature(value) {
    return this._updateStateAttributeValue('temperature', value);
  }
};