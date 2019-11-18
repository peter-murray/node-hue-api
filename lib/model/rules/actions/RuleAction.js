'use strict';

const ApiError = require('../../../ApiError')
  , BridgeObject = require('../../BridgeObject')
;

module.exports = class RuleAction {

  constructor(id, method) {
    if (id instanceof BridgeObject) {
      this._id = id.id;
    } else {
      this._id = id;
    }

    this._method = method || null;
  }

  /**
   * @return {string}
   */
  get address() {
    throw new ApiError('Not implemented');
  }

  /**
   * @return {*}
   */
  get body() {
    throw new ApiError('Not implemented');
  }

  get id() {
    return this._id;
  }

  get method() {
    return this._method;
  }

  withMethod(method) {
    this._method = method;
    return this;
  }

  get payload() {
    return {
      address: this.address,
      method: this.method,
      body: this.body
    };
  }

  toString() {
    return JSON.stringify(this.payload);
  }
};