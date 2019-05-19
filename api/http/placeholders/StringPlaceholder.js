'use strict';

const Placeholder = require('./PlaceHolder')
  , ApiError = require('../../ApiError')
;

module.exports = class StringPlaceholder extends Placeholder {

  constructor(id) {
    super('id', id);
  }

  getValue(parameters) {
    const value = super.getValue(parameters);

    if (typeof value !== 'string') {
      throw new ApiError('id must be a string');
    }

    return value;
  }
};