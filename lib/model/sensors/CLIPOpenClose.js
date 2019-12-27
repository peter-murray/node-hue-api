'use strict';

const CLIPSensor = require('./CLIPSensor')
  , types = require('../../types')
;

const CONFIG_ATTRIBUTES = [];

const STATE_ATTRIBUTES = [
  types.boolean({name: 'open'})
];

module.exports = class CLIPOpenClose extends CLIPSensor {

  constructor(id) {
    super(CONFIG_ATTRIBUTES, STATE_ATTRIBUTES, id);
  }

  get open() {
    return this.getStateAttributeValue('open');
  }

  set open(value) {
    return this._updateStateAttributeValue('open', value);
  }
};