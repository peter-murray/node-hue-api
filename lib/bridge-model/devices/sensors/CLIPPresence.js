'use strict';

const CLIPCommon = require('./CLIPCommon');

module.exports = class CLIPPresence extends CLIPCommon {

  constructor(data, id) {
    //TODO perform validation on data values?
    super('CLIPPresence', data, id);
  }

  get presence() {
    return this.state.presence;
  }

  set presence(value) {
    this._updateStateAttribute('presence', !!value);
    return this;
  }
};