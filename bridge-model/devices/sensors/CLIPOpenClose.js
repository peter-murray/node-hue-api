'use strict';

const CLIPSensor = require('./CLIPSensor');

module.exports = class CLIPOpenClose extends CLIPSensor {

  constructor(data, id) {
    //TODO perfom validation on data values?
    super('CLIPOpenClose', data, id);
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

  get open() {
    return this.state.open;
  }

  set open(value) {
    this._updateStateAttribute('open', value);
    return this;
  }
};