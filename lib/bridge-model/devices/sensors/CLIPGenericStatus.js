'use strict';

const CLIPCommon = require('./CLIPCommon');

module.exports = class CLIPGenericStatus extends CLIPCommon {

  constructor(data, id) {
    //TODO perform validation on data values?
    super('CLIPGenericStatus', data, id);
  }

  // Integer validation required

  get status() {
    return this.state.status;
  }

  set status(value) {
    this._updateStateAttribute('status', value);
    return this;
  }
};