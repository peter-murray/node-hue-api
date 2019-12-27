'use strict';

const RangedNumberType = require('./RangedNumberType');

module.exports = class UInt8Type extends RangedNumberType {

  constructor(config) {
    super(Object.assign({type: 'uint8'}, config), 0, 255);
  }

  _convertToType(val) {
    return parseInt(val);
  }
};