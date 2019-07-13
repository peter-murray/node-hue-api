'use strict';

const CLIPCommon = require('./CLIPCommon');

module.exports = class CLIPGenericFlag extends CLIPCommon {

  constructor(data, id) {
    //TODO perform validation on data values?
    super('CLIPGenericFlag', data, id);
  }

  // Boolean validation required

  get flag() {
    return this.state.flag;
  }

  set flag(value) {
    this._updateStateAttribute('flag', !!value);
    return this;
  }
};