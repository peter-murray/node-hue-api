'use strict';

const Type = require('./Type')
  , ApiError = require('../ApiError')
;


module.exports = class StringType extends Type {

  constructor(config) {
    super(Object.assign({type: 'string'}, config));

    if (Type.isValueDefined(config.min)) {
      this.min = config.min;
    } else {
      this.min = null;
    }

    if (Type.isValueDefined(config.max)) {
      this.max = config.max;
    } else{
      this.max = null;
    }
  }

  get minLength() {
    return this.min;
  }

  get maxLength() {
    return this.max;
  }

  getValue(value) {
    const checkedValue = super.getValue(value)
      , isValueDefined = Type.isValueDefined(checkedValue)
      , optional = this.optional
    ;

    // If we are optional and have no value, prevent further checks as they will fail
    if (optional && !isValueDefined) {
      return checkedValue;
    }

    // 0 will not trigger this, but it is not a problem in this context
    if (this.minLength) {
      if (!isValueDefined) {
        throw new ApiError(`No value provided for ${this.name}, must have a minimum length of ${this.minLength}`);
      } else if (checkedValue.length < this.min) {
        throw new ApiError(`'${value}' for ${this.name}, does not meet minimum length requirement of ${this.minLength}`);
      }
    }

    // 0 will not trigger this, but it is not a problem in this context, although max length of 0 is not really valid
    if (this.maxLength) {
      if (isValueDefined && checkedValue.length > this.maxLength) {
        throw new ApiError(`'${value}' for ${this.name}, does not meet maximum length requirement of ${this.maxLength}`);
      }
    }
    return checkedValue;
  }

  _convertToType(val) {
    return `${val}`;
  }
};