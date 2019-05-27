'use strict';

const RangedNumberType = require('./RangedNumberType');

module.exports = class IntegerType extends RangedNumberType {

  constructor(config, type, typeMin, typeMax) {
    super(config, typeMin, typeMax);
    this.type = type || 'integer';
  }
};
