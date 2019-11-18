'use strict';

const Type = require('./Type')
  , ApiError = require('../ApiError')
;

module.exports = class ObjectType extends Type {

  constructor(config) {
    super(Object.assign({type: 'object'}, config));

    const types = config.types;

    if (!Type.isValueDefined(types)) {
      this._types = null;
      this._childRequiredKeys = [];
    } else {
      if (!Array.isArray(types)) {
        throw new ApiError('types definition must be an Array of types');
      }

      const childRequiredKeys = [];
      types.forEach(type => {
        if (!(type instanceof Type)) {
          throw new ApiError(`type specified as ${JSON.stringify(type)} is not an instance of Type class`);
        }

        if (!type.optional) {
          childRequiredKeys.push(type.name);
        }
      });

      this._types = types;
      this._childRequiredKeys = childRequiredKeys;
    }
  }

  get types() {
    return this._types;
  }

  get childRequiredKeys() {
    return this._childRequiredKeys;
  }

  _convertToType(val) {
    const result = this._getObject(val);
    this._validateRequiredKeys(result);


    if (Object.keys(result).length === 0) {
      if (this.optional) {
        return null;
      } else {
        throw new ApiError(`Empty object created from data provided, but the object is not optional`);
      }
    }

    return result;
  }

  _getObject(val) {
    // We have a free form object type
    if (!this.types) {
      return Object.assign({}, val);
    }

    const result = {};
    // Build the object based off the definitions for the keys
    this.types.forEach(typeAttribute => {
      const name = typeAttribute.name
        , typeValue = typeAttribute.getValue(val[name])
      ;

      if (Type.isValueDefined(typeValue)) {
        result[name] = typeValue;
      }
    });
    return result;
  }


  _validateRequiredKeys(result) {
    if (this.childRequiredKeys.length > 0) {
      const valueKeys = Object.keys(result);

      this.childRequiredKeys.forEach(requiredKey => {
        if (valueKeys.indexOf(requiredKey) === -1) {
          throw new ApiError(`Required key '${requiredKey}' is missing from the object`);
        }
      });
    }
  }
};


