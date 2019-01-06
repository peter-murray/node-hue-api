'use strict';

const NumberPlaceholder = require('./NumberPlaceholder')
;

module.exports = class SensorIdPlaceholder extends NumberPlaceholder {

  constructor(id) {
    super('id', id);
  }
};