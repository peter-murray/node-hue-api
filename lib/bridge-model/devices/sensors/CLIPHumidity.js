'use strict';

const CLIPCommon = require('./CLIPCommon');

module.exports = class CLIPHumidity extends CLIPCommon {

  constructor(data, id) {
    //TODO perform validation on data values?
    super('CLIPHumidity', data, id);
  }

  get humidity() {
    return this.state.humidity;
  }

  set humidity(value) {
    //TODO	Current humidity 0.01% steps (e.g. 2000 is 20%)The bridge does not enforce range/resolution.
    this._updateStateAttribute('humidity', value);
    return this;
  }
};