'use strict';

const ParameterType = require('./ParameterType');

module.exports = class BooleanType extends ParameterType {

  constructor(config) {
    super(config);
    this.type = 'boolean';
  }

  getValue(value) {
    return Boolean(value);
  }
};