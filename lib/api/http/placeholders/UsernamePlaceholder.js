'use strict';

const Placeholder = require('./PlaceHolder')
  , ApiError = require('../../../ApiError')
;


module.exports = class UsernamePlaceholder extends Placeholder {

  constructor(name) {
    super('username', name);
  }

  getValue(parameters) {
    const value = super.getValue(parameters);

    if (typeof value !== 'string') {
      throw new ApiError('Username must be of type string');
    }
    return value;
  }
};
