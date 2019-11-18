'use strict';

const ApiError = require('../ApiError.js');

/**
 * @typedef { import('../types/Type') } Type
 * @type {BridgeObject}
 */
module.exports = class BridgeObject {

  /**
   * @param attributes {Array.<Type>}
   * @param id {number | null}
   */
  constructor(attributes, id) {
    this._attributes = {};
    this._data = {};

    attributes.forEach(attr => {
      this._attributes[attr.name] = attr;
    });

    // Validate that we have an id definition
    if (!this._attributes.id) {
      throw new ApiError('All bridge objects must have an "id" definition');
    }
    this.setAttributeValue('id', id);
  }

  /**
   * @param name {string}
   * @returns {*}
   */
  getAttributeValue(name) {
    const definition = this._attributes[name];

    if (definition) {
      return definition.getValue(this._data[name]);
    } else {
      throw new ApiError(`Requesting value for invalid attribute '${name}'`);
    }
  }

  /**
   * @param name {string}
   * @param value {*}
   * @returns {BridgeObject}
   */
  setAttributeValue(name, value) {
    const definition = this._attributes[name];

    if (definition) {
      this._data[definition.name] = definition.getValue(value);
    } else {
      throw new ApiError(`Attempted to set attribute '${name}', but do not have a definition registered`);
    }

    return this;
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
    // return this._bridgeData;
  }

  /**
   * @returns {string}
   */
  toString() {
    return `${this.constructor.name}\n  id: ${this.id}`;
  }

  /**
   * @returns {string}
   */
  toStringDetailed() {
    let result = this.toString();

    Object.keys(this._data).forEach(key => {
      if (key !== 'id') {
        result += `\n  ${key}: ${JSON.stringify(this._data[key])}`;
      }
    });

    return result;
  }

  /**
   * @param data {*}
   * @returns {BridgeObject}
   * @private
   */
  _populate(data) {
    const self = this;

    //TODO Maybe need to support api data and bridge data separately in this call, but treat as the same for now

    if (data) {
      Object.keys(data).forEach(key => {
        if (self._attributes[key]) {
          self.setAttributeValue(key, data[key]);
        }
      });
    }

    // Store this so we can do a diff on it later to help with support of new devices and changes in the API results in the future
    this._populationData = data;

    return self;
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
