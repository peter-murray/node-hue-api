'use strict';

const RangedNumberType = require('./RangedNumberType');

module.exports = class Int8Type extends RangedNumberType {

  constructor(config) {
    super(Object.assign({type: 'int8'}, config), -255, 255);
  }

  _convertToType(val) {
    return parseInt(val);
  }
};