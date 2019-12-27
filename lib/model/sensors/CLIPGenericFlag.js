'use strict';

const CLIPSensor = require('./CLIPSensor')
  , types = require('../../types')
;

const CONFIG_ATTRIBUTES = [];

const STATE_ATTRIBUTES = [
  types.boolean({name: 'flag'}),
];

module.exports = class CLIPGenericFlag extends CLIPSensor {

  constructor(id) {
    super(CONFIG_ATTRIBUTES, STATE_ATTRIBUTES, id);
  }

  get flag() {
    return this.getStateAttributeValue('flag');
  }

  set flag(value) {
    return this._updateStateAttributeValue('flag', value);
  }
};