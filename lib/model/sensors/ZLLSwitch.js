'use strict';

const Sensor = require('./Sensor')
  , types = require('../../types')
;

const CONFIG_ATTRIBUTES = [
  types.boolean({name: 'reachable'}),
  types.uint8({name: 'battery'}),
  types.choice({name: 'alert', validValues: ['none', 'select', 'lselect'], defaultValue: 'none'}),
  types.list({name: 'pending', listType: types.string({name: 'pendingChange'}), minEntries: 0})
];

const STATE_ATTRIBUTES = [
  types.int16({name: 'buttonevent'}),
];

// Hue Dimmer Switch
module.exports = class ZLLSwitch extends Sensor {

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

  get pending() {
    return this.getConfigAttributeValue('pending');
  }

  get buttonevent() {
    return this.getStateAttributeValue('buttonevent');
  }
};