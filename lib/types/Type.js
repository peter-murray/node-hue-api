'use strict';

const ApiError = require('../ApiError');

module.exports = class Type {

  static isValueDefined(value) {
    return value !== null && value !== undefined && value !== Number.NaN;
  }

  constructor(config) {
    if (!config.name) {
      throw new ApiError('A name must be specified');
    }
    this._name = config.name;

    if (!config.type) {
      throw new ApiError('A type must be specified');
    }
    this._type = config.type;

    // Optional configuration values
    this._optional = Type.isValueDefined(config.optional) ? config.optional : true;
    this._defaultValue = Type.isValueDefined(config.defaultValue) ? config.defaultValue : null; // null is considered unset in a Type
  }

  get name() {
    return this._name;
  }

  get type() {
    return this._type;
  }

  get defaultValue() {
    return this._defaultValue;
  }

  get optional() {
    return this._optional;
  }

  hasDefaultValue() {
    return Type.isValueDefined(this.defaultValue);
  }

  getValue(val) {
    if (Type.isValueDefined(val)) {
      return this._convertToType(val);
    } else {
      if (this.hasDefaultValue()) {
        return this._convertToType(this.defaultValue);
      } else {
        if (this.optional) {
          // Value not defined (i.e. null or undefined or Number.NaN)
          return null;
        } else {
          throw new ApiError(`No value provided and '${this.name}' is not optional`);
        }
      }
    }
  }

  _convertToType(val) {
    return val;
  }
};