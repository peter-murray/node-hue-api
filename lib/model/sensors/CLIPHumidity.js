'use strict';

const CLIPSensor = require('./CLIPSensor')
  , types = require('../../types')
;

const CONFIG_ATTRIBUTES = [];

const STATE_ATTRIBUTES = [
  types.uint16({name: 'humidity'}),
];

module.exports = class CLIPHumidity extends CLIPSensor {

  constructor(id) {
    super(CONFIG_ATTRIBUTES, STATE_ATTRIBUTES, id);
  }

  get humidity() {
    return this.getStateAttributeValue('humidity');
  }

  set humidity(value) {
    //TODO	Current humidity 0.01% steps (e.g. 2000 is 20%)The bridge does not enforce range/resolution.
    return this._updateStateAttributeValue('humidity', value);
  }
};