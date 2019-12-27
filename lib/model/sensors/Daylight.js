'use strict';

const Sensor = require('./Sensor')
  , types = require('../../types')
;

const CONFIG_ATTRIBUTES = [
    types.boolean({name: 'configured'}),
    types.int8({name: 'sunriseoffset', defaultValue: 30, minValue: -120, maxValue: 120}),
    types.int8({name: 'sunsetoffset', defaultValue: -30, minValue: -120, maxValue: 120}),
    types.string({name: 'long'}), //TODO Can only set this, regex match required for this
    types.string({name: 'lat'}), //TODO Can only set this
  ]
  , STATE_ATTRIBUTES = [
    types.boolean({name: 'daylight'}),
    types.string({name: 'lastupdated'}),
  ]
;


module.exports = class Daylight extends Sensor {

  constructor(id) {
    super( CONFIG_ATTRIBUTES, STATE_ATTRIBUTES, id);
  }

  set long(value) {
    this._updateConfigAttributeValue('long', value);
    return this;
  }

  set lat(value) {
    this._updateConfigAttributeValue('lat', value);
    return this;
  }

  get configured() {
    return this.getConfigAttributeValue('configured');
  }

  get sunriseoffset() {
    return this.getConfigAttributeValue('sunriseoffset');
  }

  set sunriseoffset(value) {
    this._updateConfigAttributeValue('sunriseoffset', value);
    return this;
  }

  get sunsetoffset() {
    return this.getConfigAttributeValue('sunsetoffset');
  }

  set sunsetoffset(value) {
    this._updateConfigAttributeValue('sunsetoffset', value);
    return this;
  }

  get daylight() {
    return this.getStateAttributeValue('daylight');
  }

  set daylight(value) {
    this._updateStateAttributeValue('daylight', !!value);
    return this;
  }
};