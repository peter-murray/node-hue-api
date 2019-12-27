'use strict';

const Sensor = require('./Sensor')
  , types = require('../../types')
  , util = require('../../util')
;

const CONFIG_ATTRIBUTES = [
  types.boolean({name: 'reachable'}),
  types.uint8({name: 'battery', optional: true}),
  types.string({name: 'url', minLength: 0, maxLength: 64}),
];

module.exports = class CLIPSensor extends Sensor {

  constructor(configAttributes, stateAttributes, id) {
    super(util.flatten(CONFIG_ATTRIBUTES, configAttributes), stateAttributes, id);
  }

  get reachable() {
    return this.getConfigAttributeValue('reachable');
  }

  set reachable(value) {
    return this._updateConfigAttributeValue('reachable', value);
  }

  get battery() {
    return this.getConfigAttributeValue('battery');
  }

  set battery(value) {
    return this._updateConfigAttributeValue('battery', value);
  }

  get url() {
    return this.getConfigAttributeValue('url');
  }

  set url(value) {
    return this.setAttributeValue('url', value);
  }

  set modelid(value) {
    return this.setAttributeValue('modelid', value);
  }

  set swversion(value) {
    return this.setAttributeValue('swversion', value);
  }

  set uniqueid(value) {
    return this.setAttributeValue('uniqueid', value);
  }

  set manufacturername(value) {
    return this.setAttributeValue('manufacturername', value);
  }

  get recycle() {
    return this.getAttributeValue('recycle');
  }
};