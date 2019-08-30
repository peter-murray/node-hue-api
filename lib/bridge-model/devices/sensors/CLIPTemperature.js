'use strict';

const CLIPCommon = require('./CLIPCommon.js');

module.exports = class CLIPTemperature extends CLIPCommon {

  constructor(data, id) {
    //TODO perform validation on data values?
    super('CLIPTemperature', data, id);
  }

  get temperature() {
    return this.state.temperature;
  }

  set temperature(value) {
    this._updateStateAttribute('temperature', value);
    return this;
  }
};