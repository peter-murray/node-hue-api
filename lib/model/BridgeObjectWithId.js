'use strict';

const BridgeObject = require('./BridgeObject')
  , ApiError = require('../ApiError.js')
;

/**
 * @typedef { import('../types/Type') } Type
 * @type {BridgeObjectWithId}
 */
module.exports = class BridgeObjectWithId extends BridgeObject {

  /**
   * @param attributes {Array.<Type>}
   * @param id {number | null}
   */
  constructor(attributes, id) {
    super(attributes);

    // Validate that we have an id definition
    if (!this._attributes.id) {
      throw new ApiError('All bridge objects must have an "id" definition');
    }
    this.setAttributeValue('id', id);
  }

  /**
   * @returns {string | number}
   */
  get id() {
    return this.getAttributeValue('id');
  }
};
