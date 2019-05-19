'use strict';

const Placeholder = require('./PlaceHolder')
  , ApiError = require('../../ApiError')
;

module.exports = class NumberPlaceholder extends Placeholder {

  constructor(id) {
    super('id', id);
  }

  getValue(parameters) {
    const value = super.getValue(parameters);

    if (typeof value !== 'number' && typeof value !== 'string') {
      throw new ApiError('id must be a number or string');
    }

    return value;
  }
};