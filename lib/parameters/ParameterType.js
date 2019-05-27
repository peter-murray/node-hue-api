'use strict';

module.exports = class ParameterType {

  constructor(config) {
    this._name = config.name;
    this.type = config.type;
    this.isOptional = config.optional || true;
    this.defaultValue = config.defaultValue;
  }

  get name() {
    return this._name;
  }

  isOptional() {
    return this.isOptional;
  }

  getDefaultValue() {
    return this.defaultValue || null;
  }

  hasDefaultValue() {
    return this.defaultValue !== null && this.defaultValue !== undefined && this.defaultValue !== Number.NaN;
  }

  getValue(val) {
    if (val) {
      return val;
    } else {
      if (this.hasDefaultValue()) {
        return this.getDefaultValue();
      } else {
        return val;
      }
    }
  }
};