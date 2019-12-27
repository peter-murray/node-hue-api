'use strict';

const Sensor = require('./Sensor')
  , types = require('../../types')
;

const CONFIG_ATTRIBUTES = [
  types.uint8({name: 'battery'}),
  types.choice({name: 'alert', validValues: ['none', 'select', 'lselect'], defaultValue: 'none'}),
  types.boolean({name: 'reachable'}),
  types.uint16({name: 'sensitivity'}),
  types.uint16({name: 'sensitivitymax'}),
];

const STATE_ATTRIBUTES = [
  types.boolean({name: 'presence'}),
];

// Hue Motion Sensor
module.exports = class ZLLPresense extends Sensor {

  constructor(id) {
    super(CONFIG_ATTRIBUTES, STATE_ATTRIBUTES, id);
  }

  get battery() {
    return this.getConfigAttributeValue('battery');
  }

  set battery(value) {
    return this._updateConfigAttributeValue('battery', value);
  }

  get alert() {
    return this.getConfigAttributeValue('alert');
  }

  set alert(value) {
    return this._updateConfigAttributeValue('alert', value);
  }

  get reachable() {
    return this.getConfigAttributeValue('reachable');
  }

  set reachable(value) {
    return this._updateConfigAttributeValue('reachable', value);
  }

  get sensitivity() {
    return this.getConfigAttributeValue('sensitivity');
  }

  set sensitivity(value) {
    return this._updateConfigAttributeValue('sensitivity', value);
  }

  get sensitivitymax() {
    return this.getConfigAttributeValue('sensitivitymax');
  }

  set sensitivitymax(value) {
    return this._updateConfigAttributeValue('sensitivitymax', value);
  }

  get presence() {
    return this.getStateAttributeValue('presence');
  }
};