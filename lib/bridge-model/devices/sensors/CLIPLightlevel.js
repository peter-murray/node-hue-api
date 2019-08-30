'use strict';

const CLIPSensor = require('./CLIPSensor');

module.exports = class CLIPLightlevel extends CLIPSensor {

  constructor(data, id) {
    //TODO perform validation on data values?
    super('CLIPLightlevel', data, id);
  }

  get tholddark() {
    return this.config.tholddark;
  }

  set tholddark(value) {
    this._updateConfigAttribute('tholddark', value);
    return this;
  }

  get thresholdDark() {
    return this.tholddark;
  }

  get tholdoffset() {
    return this.state.tholdoffset;
  }

  set tholdoffset(value) {
    if (value >= 1) {
      this._updateConfigAttribute(value);
    } else {
      throw new Error('Invalid offset must be >= 1');
    }
    return this;
  }

  get lightlevel() {
    return this.state.lightlevel;
  }

  set lightlevel(value) {
    this._updateStateAttribute('lightlevel', value);
    return this;
  }

  get dark() {
    return this.state.dark;
  }

  set dark(value) {
    this._updateStateAttribute('dark', !!value);
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