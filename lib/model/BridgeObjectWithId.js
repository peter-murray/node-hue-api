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

  getJsonPayload() {
    const data = this._bridgeData;

    data.node_hue_api = {
      type: this.constructor.name.toLowerCase(),
      version: 1
    };

    return data;
  }

  getHuePayload() {
    const result = {};

    Object.keys(this._attributes).forEach(name => {
      const value = this.getAttributeValue(name);
      if (value !== null && value !== undefined) {
        result[name] = value;
      }
    });

    return result;
  }

  /**
   * @returns {any | {}}
   * @private
   */
  get _bridgeData() {
    // Return a copy so that it cannot be modified from outside
    return Object.assign({}, this._data);
  }
};
