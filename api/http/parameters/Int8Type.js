'use strict';

const IntegerType = require('./IntegerType');

module.exports = class Int8Type extends IntegerType {

  constructor(config) {
    super(config, 'int8', -255, 255);
  }
};