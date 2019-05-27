'use strict';

const IntegerType = require('./IntegerType');

module.exports = class Int16Type extends IntegerType {

  constructor(config) {
    super(config, 'int16', -65535, 65535);
  }
};