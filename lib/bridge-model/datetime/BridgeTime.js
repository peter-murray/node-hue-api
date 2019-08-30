'use strict';

module.exports = class BridgeTime {

  constructor(validationRegex) {
    this._validationRegex = validationRegex;
  }

  get validationRegex() {
    return this._validationRegex;
  }
};