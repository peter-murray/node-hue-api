'use strict';

const RangedNumberType = require('./RangedNumberType');

module.exports = class Int16Type extends RangedNumberType {

  constructor(config) {
    super(Object.assign({type: 'int16'}, config), -65535, 65535);
  }

  _convertToType(val) {
    return parseInt(val);
  }
};