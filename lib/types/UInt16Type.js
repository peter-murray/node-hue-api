'use strict';

const RangedNumberType = require('./RangedNumberType');

module.exports = class UInt16Type extends RangedNumberType {

  constructor(config) {
    super(Object.assign({type: 'uint16'}, config), 0, 65535);
  }

  _convertToType(val) {
    return parseInt(val);
  }
};