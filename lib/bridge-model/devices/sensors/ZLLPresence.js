'use strict';

const Sensor = require('./Sensor');

// Hue Motion Sensor
module.exports = class ZLLPresense extends Sensor {

  constructor(data, id) {
    super('ZLLPresense', data, id);
  }

  get on() {
    return this.config.on;
  }

  set on(value) {
    this._updateConfigAttribute('on', value);
    return this;
  }

  get battery() {
    return this.config.battery;
  }

  set battery(value) {
    this._updateConfigAttribute('battery', value);
    return this;
  }

  get alert() {
    return this.config.alert;
  }

  set alert(value) {
    this._updateConfigAttribute('alert', value);
    return this;
  }

  get reachable() {
    return this.config.reachable;
  }

  set reachable(value) {
    this._updateConfigAttribute('reachable', value);
    return this;
  }

  get sensitivity() {
    return this.config.sensitivity;
  }

  set sensitivity(value) {
    this._updateConfigAttribute('sensitivity', value);
    return this;
  }

  get sensitivitymax() {
    return this.config.sensitivitymax;
  }

  set sensitivitymax(value) {
    this._updateConfigAttribute('sensitivitymax', value);
    return this;
  }

  get presence() {
    return this.state.presence;
  }

  get lastupdated() {
    return this.state.lastupdated;
  }
};