'use strict';

const IntegerType = require('./IntegerType');

module.exports = class UInt16Type extends IntegerType {

  constructor(config) {
    super(config, 'uint16', 0, 65535);
  }
};