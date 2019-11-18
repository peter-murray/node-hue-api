'use strict';

const Placeholder = require('./Placeholder')
  , types = require('../../../types')
;

module.exports = class GroupIdPlaceholder extends Placeholder {

  constructor(name) {
    super('id', name);
    this.typeDefinition = types.uint16({name: 'group id', optional: false});
  }
};