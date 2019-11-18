'use strict';

const Placeholder = require('./Placeholder')
  , types = require('../../../types')
;

module.exports = class RuleIdPlaceholder extends Placeholder {

  constructor(name) {
    super('id', name);
    this.typeDefinition = types.uint16({name: 'rule id', optional: false});
  }
};