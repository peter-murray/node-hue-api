'use strict';

const Type = require('./Type');

module.exports = class BooleanType extends Type {

  constructor(config) {
    super(Object.assign({type: 'boolean'}, config));
  }

  getValue(val) {
    if (Type.isValueDefined(val)) {
      return Boolean(val);
    } else {
      if (this.hasDefaultValue()) {
        return Boolean(this.defaultValue);
      } else {
        if (this.optional) {
          return val;
        } else {
          throw new ApiError(`No value provided and '${this.name}' is not optional`);
        }
      }
    }
  }
};