'use strict';

const CLIPSensor = require('./CLIPSensor')
  , types = require('../../types')
;

const CONFIG_ATTRIBUTES = [
  types.uint16({name: 'tholddark', defaultValue: 16000}),
  types.uint16({name: 'tholdoffset', minValue: 1, defaultValue: 7000}),
];

const STATE_ATTRIBUTES = [
  types.uint16({name: 'lightlevel'}),
  types.boolean({name: 'dark'}),
  types.boolean({name: 'daylight'}),
];

module.exports = class CLIPLightlevel extends CLIPSensor {

  constructor(id) {
    super(CONFIG_ATTRIBUTES, STATE_ATTRIBUTES, id);
  }

  get tholddark() {
    return this.getConfigAttributeValue('tholddark');
  }

  set tholddark(value) {
    return this._updateConfigAttributeValue('tholddark', value);
  }

  get thresholdDark() {
    return this.tholddark;
  }

  get tholdoffset() {
    return this.getConfigAttributeValue('tholdoffset');
  }

  set tholdoffset(value) {
    return this._updateConfigAttributeValue('tholdoffset', value);
  }

  get thresholdOffset() {
    return this.tholdoffset;
  }

  get lightlevel() {
    return this.getStateAttributeValue('lightlevel');
  }

  set lightlevel(value) {
    return this._updateStateAttributeValue('lightlevel', value);
  }

  get dark() {
    return this.getStateAttributeValue('dark');
  }

  set dark(value) {
    return this._updateStateAttributeValue('dark', value);
  }

  get daylight() {
    return this.getStateAttributeValue('daylight');
  }

  set daylight(value) {
    return this._updateStateAttributeValue('daylight', value);
  }
};