'use strict';

const ParameterType = require('./ParameterType')
  , ApiError = require('../ApiError')
;

module.exports = class ListType extends ParameterType {

  constructor(props) {
    if (props.minEntries === null || props.minEntries === undefined) {
      throw new ApiError('minEntries is required for a list type');
    }

    if (props.maxEntries === null || props.maxEntries === undefined) {
      throw new ApiError('maxEntries is required for a list type');
    }

    super(props);
    this.minEntries = props.minEntries;
    this.maxEntries = props.maxEntries;

    //TODO validate that this value is a type
    this.valueType = props.type;
  }

  getValue() {
    //TODO need to check the optional flag
    let listValues;

    if (arguments.length === 1) {
      if (Array.isArray(arguments[0])) {
        listValues = arguments[0];
      } else {
        throw new ApiError('Unexpected list type value');
      }
    } else {
      listValues = Array.from(arguments);
    }

    // Validate the number of entries
    const length = listValues.length;
    if (length < this.minEntries && length > this.maxEntries) {
      throw new ApiError(`The number of entries for the list, "${length}" is outside the range of min=${this.minEntries} max=${this.maxEntries}`);
    }

    // Validate the values in the list
    const result = [];
    for (var idx in listValues) {
      result.push(this.valueType.getValue(listValues[idx]));
    }
    return result;
  }
};
