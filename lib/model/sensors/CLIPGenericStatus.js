'use strict';

const CLIPSensor = require('./CLIPSensor')
  , types = require('../../types')
;

const CONFIG_ATTRIBUTES = [];

const STATE_ATTRIBUTES = [
  types.int16({name: 'status'}),
];

module.exports = class CLIPGenericStatus extends CLIPSensor {

  constructor(id) {
    super(CONFIG_ATTRIBUTES, STATE_ATTRIBUTES, id);
  }

  get status() {
    return this.getStateAttributeValue('status');
  }

  set status(value) {
    return this._updateStateAttributeValue('status', value);
  }
};