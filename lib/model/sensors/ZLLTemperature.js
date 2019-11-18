'use strict';

const Sensor = require('./Sensor')
  , types = require('../../types')
;

const CONFIG_ATTRIBUTES = [];

const STATE_ATTRIBUTES = [
  types.int16({name: 'temperature'}),
];


module.exports = class ZLLTemperature extends Sensor {

  constructor(id) {
    super(CONFIG_ATTRIBUTES, STATE_ATTRIBUTES, id);
  }

  get temperature() {
    return this.getStateAttributeValue('temperature');
  }
};