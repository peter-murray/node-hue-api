'use strict';

const RangedNumberType = require('./RangedNumberType');

module.exports = class FloatType extends RangedNumberType {
  
  constructor(config) {
    super(config, Number.MIN_VALUE, Number.MAX_VALUE);
    this.type = 'float';
  }
};