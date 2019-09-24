'use strict';

const StringPlaceholder = require('./StringPlaceholder')
;

module.exports = class RuleIdPlaceholder extends StringPlaceholder {

  constructor(name) {
    super('id', name);
  }
};