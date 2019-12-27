'use strict';

const Type = require('./Type')
  , ApiError = require('../ApiError');

module.exports = class RangedNumberType extends Type {

  constructor(config, typeMin, typeMax) {
    super(config);

    if (Type.isValueDefined(config.min)) {
      this.min = config.min;
    } else {
      this.min = typeMin;
    }

    if (Type.isValueDefined(config.max)) {
      this.max = config.max;
    } else{
      this.max = typeMax;
    }
  }

  getValue(value) {
    const numberValue = super.getValue(value);

    // Value has been checked in the super function and is optional
    if (numberValue === null) {
      return null;
    }

    // Invalid input value
    if (Number.isNaN(numberValue)) {
      throw new ApiError(`Failure to convert value for ${this.name}, value, '${value}' is not a parsable number'`);
    }

    if (this.isValueInRange(numberValue)) {
      return numberValue;
    } else {
      throw new ApiError(`Value, '${numberValue}' is not within allowed limits: min=${this.getMinValue()} max=${this.getMaxValue()} for '${this.name}'`);
    }
  }

  _convertToType(val) {
    return Number(val);
  }

  isValueInRange(value) {
    return value >= this.getMinValue() && value <= this.getMaxValue();
  }

  getMinValue() {
    return this.min;
  }

  getMaxValue() {
    return this.max;
  }

  //TODO check this is still in use
  getRange() {
    // return this.max - this.min; //TODO brightness has a lower bound of 1, which can generate quirks
    return this.max;
  }
};