'use strict';

const Sensor = require('./Sensor');

module.exports = class Daylight extends Sensor {

  constructor(data, id) {
    super('Daylight', data, id);
  }

  get on() {
    return this.config.on;
  }

  set on(value) {
    this._updateConfigAttribute('on', value);
    return this;
  }

  get long() {
    // Hidden from bridge to protect privacy
    return this.configured;
  }

  set long(value) {
    this._updateConfigAttribute('long', value);
    return this;
  }

  get lat() {
    // Hidden from bridge to protect privacy
    return this.configured;
  }

  set lat(value) {
    this._updateConfigAttribute('lat', value);
    return this;
  }

  get configured() {
    return this.config.configured;
  }

  set configured(value) {
    this._updateConfigAttribute('configured', !!value);
    return this;
  }

  get sunriseoffset() {
    return this.config.sunriseoffset;
  }

  set sunriseoffset(value) {
    this._updateConfigAttribute('sunriseoffset', value);
    return this;
  }

  get sunsetoffset() {
    return this.config.sunriseoffset;
  }

  set sunsetoffset(value) {
    this._updateConfigAttribute('sunsetoffset', value);
    return this;
  }

  get daylight() {
    return this.state.daylight;
  }

  set daylight(value) {
    this._updateStateAttribute('daylight', !!value);
    return this;
  }
};