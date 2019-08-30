'use strict';

const CLIPSensor = require('./CLIPSensor');

module.exports = class CLIPCommon extends CLIPSensor {

  constructor(clipType, data, id) {
    super(clipType, data, id);
  }

  get on() {
    return this.config.on;
  }

  set on(value) {
    this._updateConfigAttribute('on', value);
    return this;
  }

  get reachable() {
    return this.config.reachable;
  }

  set reachable(value) {
    this._updateConfigAttribute('reachable', value);
    return this;
  }

  get battery() {
    return this.config.battery;
  }

  set battery(value) {
    this._updateConfigAttribute('battery', value);
    return this;
  }

  get url() {
    return this.config.url;
  }

  set url(value) {
    this._updateConfigAttribute('url', value);
    return this;
  }
};