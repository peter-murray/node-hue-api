'use strict';

const NumberPlaceholder = require('./NumberPlaceholder')
;

module.exports = class SensorIdPlaceholder extends NumberPlaceholder {

  constructor(name) {
    super('id', name);
  }
};