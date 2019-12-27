'use strict';

const Type = require('./Type')
  , ApiError = require('../ApiError')
;

module.exports = class ListType extends Type {

  constructor(config) {
    if (config.minEntries === null || config.minEntries === undefined) {
      throw new ApiError('minEntries is required for a list type');
    }

    // if (props.maxEntries === null || props.maxEntries === undefined) {
    //   throw new ApiError('maxEntries is required for a list type');
    // }

    super(Object.assign({type: 'list'}, config));
    this.minEntries = config.minEntries;
    this.maxEntries = config.maxEntries;

    const type = config.listType;
    if (!(type instanceof Type)) {
      throw new ApiError(`listType must be an instance of a Type, not ${type}`);
    }
    this._listType = type;
  }

  get listType() {
    return this._listType;
  }

  getValue() {
    const listValues = super.getValue.apply(this, Array.from(arguments));

    if (!Type.isValueDefined(listValues)) {
      // Validate the min entries requirement is met
      if (this.minEntries === 0) {
        return listValues;
      } else {
        throw new ApiError(`Type ${this.name}, minEntries requirement not satisfied, required ${this.minEntries}, but have null object`);
      }
    }

    // Value is defined, so validate it according to specification
    const length = listValues.length;
    if (length < this.minEntries) {
      throw new ApiError(`The number of entries for the list, "${length}" is less than required minimum of ${this.minEntries}`);
    }

    if (this.maxEntries && length > this.maxEntries) {
      throw new ApiError(`The number of entries for the list, ${length}, is greater than required maximum of ${this.maxEntries}`);
    }

    return listValues;
  }

  _convertToType(val) {
    if (!Type.isValueDefined(val)) {
      return null;
    }

    const result = []
      , type = this.listType
    ;

    if (Array.isArray(val)) {
      val.forEach(value => {
        result.push(type.getValue(value));
      });
    } else {
      result.push(type.getValue(val))
    }

    return result;
  }
};
