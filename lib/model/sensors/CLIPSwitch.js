'use strict';

const CLIPSensor = require('./CLIPSensor')
  , types = require('../../types')
;

const CONFIG_ATTRIBUTES = [];

const STATE_ATTRIBUTES = [
  types.uint16({name: 'buttonevent'}),
];


module.exports = class CLIPSwitch extends CLIPSensor {

  constructor(id) {
    super(CONFIG_ATTRIBUTES, STATE_ATTRIBUTES, id);
  }

  get buttonevent() {
    return this.getStateAttributeValue('buttonevent');
  }

  set buttonevent(value) {
    return this._updateStateAttributeValue('buttonevent', value);
  }
};