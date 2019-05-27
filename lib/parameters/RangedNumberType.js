'use strict';

const ParameterType = require('./ParameterType')
  , ApiError = require('../ApiError');

module.exports = class RangedNumberType extends ParameterType {

  constructor(config, typeMin, typeMax) {
    super(config);

    if (config.min !== undefined && config.min !== null) {
      this.min = config.min;
    } else {
      this.min = typeMin;
    }

    if (config.max !== undefined && config.max != null) {
      this.max = config.max;
    } else{
      this.max = typeMax;
    }
  }

  isValueValid(value) {
    if (RangedNumberType.isValueDefined(value)) {
      return value >= this.min && value <= this.max;
    } else {
      return false;
    }
  }

  static isValueDefined(value) {
    return value !== null && value !== undefined && value !== Number.NaN;
  }

  getValue(value) {
    if (this.hasDefaultValue() && !RangedNumberType.isValueDefined(value)) {
      return this.getDefaultValue();
    } else {
      if (this.isValueValid(value)) {
        return value;
      } else {
        throw new ApiError(`Value, '${value}' is not within allowed limits: min=${this.min} max=${this.max}`);
      }
    }
  }

  getMinValue() {
    return this.min;
  }

  getMaxValue() {
    return this.max;
  }

  getRange() {
    // return this.max - this.min; //TODO brightness has a lower bound of 1, which can generate quirks
    return this.max;
  }
};