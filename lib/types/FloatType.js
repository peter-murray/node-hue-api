'use strict';

const RangedNumberType = require('./RangedNumberType');

module.exports = class FloatType extends RangedNumberType {
  
  constructor(config) {
    super(Object.assign({type: 'float'}, config), -Number.MAX_VALUE, Number.MAX_VALUE);
  }
};