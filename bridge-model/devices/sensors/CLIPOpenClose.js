'use strict';

const CLIPCommon = require('./CLIPCommon');

module.exports = class CLIPOpenClose extends CLIPCommon {

  constructor(data, id) {
    //TODO perform validation on data values?
    super('CLIPOpenClose', data, id);
  }

  get open() {
    return this.state.open;
  }

  set open(value) {
    this._updateStateAttribute('open', value);
    return this;
  }
};