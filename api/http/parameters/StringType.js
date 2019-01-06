'use strict';

const ParameterType = require('./ParameterType');

module.exports = class StringType extends ParameterType {

  constructor(config) {
    super(config);
  }

  getValue(value) {
    const result = super.getValue(value);
    return String(result);
  }
};