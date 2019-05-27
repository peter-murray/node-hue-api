'use strict';

const ParameterType = require('./ParameterType')
  , ApiError = require('../ApiError')
;

module.exports = class ChoiceType extends ParameterType {

  constructor(config) {
    super(config);

    this.allowedValues = config.validValues;
    this.defaultValue = config.defaultValue;
  }

  getValue(val) {
    if (!val) {
      if (this.defaultValue) {
        return this.defaultValue;
      } else {
        throw new ApiError('No value provided and no sensible default for type');
      }
    } else {
      if (this.allowedValues.indexOf(val) > -1) {
        return val;
      } else {
        throw new ApiError(`Value '${val}' is not one of the allowed values [${this.allowedValues}]`);
      }
    }
  }
};
