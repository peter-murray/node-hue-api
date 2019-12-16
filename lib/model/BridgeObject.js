'use strict';

const ApiError = require('../ApiError.js');

/**
 * @typedef { import('../types/Type') } Type
 * @type {BridgeObject}
 */
module.exports = class BridgeObject {

  /**
   * @param attributes {Array.<Type>}
   */
  constructor(attributes) {
    this._attributes = {};
    this._data = {};

    attributes.forEach(attr => {
      this._attributes[attr.name] = attr;
    });
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
   * @returns {string}
   */
  toString() {
    return `${this.constructor.name}`;
  }

  /**
   * @returns {string}
   */
  toStringDetailed() {
    let result = `${this.constructor.name}`;

    Object.keys(this._data).forEach(key => {
      result += `\n  ${key}: ${JSON.stringify(this._data[key])}`;
    });

    return result;
  }

  /**
   * Obtains a node-hue-api specific JSON payload of the BridgeObject. This can be used for serialization purposes.
   *
   * This functionality exists to support use cases where server backends need to send data to a web based client to
   * work around CORS or custom backend functionality, whilst preserving and providing reusability of the API objects.
   *
   * @returns {Object} A node-hue-api specific payload that represents the Bridge Object, this can be reconstructed into
   * a valid BridgeObject instance via the model.createFromJson() function.
   */
  getJsonPayload() {
    const data = this._bridgeData;

    data.node_hue_api = {
      type: this.constructor.name.toLowerCase(),
      version: 1
    };

    return data;
  }

  /**
   * Obtains a Hue API compatible representation of the Bridge Object that can be used over the RESTful API.
   * @returns {Object} The payload that is compatible with the Hue RESTful API documentation.
   */
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
};
