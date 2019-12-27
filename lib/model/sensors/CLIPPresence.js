'use strict';

const CLIPSensor = require('./CLIPSensor')
  , types = require('../../types')
;

const CONFIG_ATTRIBUTES = [];

const STATE_ATTRIBUTES = [
  types.boolean({name: 'presence'}),
];

module.exports = class CLIPPresence extends CLIPSensor {

  constructor(id) {
    super(CONFIG_ATTRIBUTES, STATE_ATTRIBUTES, id);
  }

  get presence() {
    return this.getStateAttributeValue('presence');
  }

  set presence(value) {
    return this._updateStateAttributeValue('presence', value);
  }
};