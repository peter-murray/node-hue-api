'use strict';

const Placeholder = require('./PlaceHolder')
  , ApiError = require('../../../ApiError')
;

module.exports = class NumberPlaceholder extends Placeholder {

  constructor(defaultName, name) {
    super(defaultName, name);
  }

  getValue(parameters) {
    const value = super.getValue(parameters);

    if (typeof value !== 'number' && typeof value !== 'string') {
      throw new ApiError('id must be a number or string');
    }

    const result = Number.parseInt(value);

    if (Number.isNaN(result)) {
      throw new ApiError(`id is not an integer '${value}'`);
    }

    return result;
  }
};