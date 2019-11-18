'use strict';

const Placeholder = require('./Placeholder')
  , types = require('../../../types')
;


module.exports = class LightIdPlaceholder extends Placeholder {

  constructor(name) {
    super('id', name);
    this.typeDefinition = types.uint16({name: 'light id', optional: false});
  }
};