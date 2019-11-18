'use strict';

const Placeholder = require('./Placeholder')
  , types = require('../../../types')
;

module.exports = class SensorIdPlaceholder extends Placeholder {

  constructor(name) {
    super('id', name);
    this.typeDefinition = types.uint16({name: 'sensor id', optional: false});
  }
};