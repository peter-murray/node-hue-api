'use strict';

const IntegerType = require('./IntegerType');

module.exports = class UInt8Type extends IntegerType {
  constructor(config) {
    super(config, 'uint8', 0, 255);
  }
};