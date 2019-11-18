'use strict';

const Type = require('./Type')
  , ApiError = require('../ApiError')
;

module.exports = class ChoiceType extends Type {

  constructor(config) {
    super(Object.assign({type: 'choice'}, config));

    const validValues = config.validValues;
    if (!Type.isValueDefined(validValues)) {
      throw new ApiError('validValues config property is required for choice type');
    }
    this._allowedValues = validValues;
  }

  get validValues() {
    return this._allowedValues;
  }

  _convertToType(val) {
    if (this.validValues.indexOf(val) > -1) {
      return val;
    } else {
      throw new ApiError(`Value '${val}' is not one of the allowed values [${this.validValues}]`);
    }
  }
};
