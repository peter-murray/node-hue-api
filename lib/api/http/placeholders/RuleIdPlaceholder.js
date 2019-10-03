'use strict';

const NumberPlaceholder = require('./NumberPlaceholder')
;

module.exports = class RuleIdPlaceholder extends NumberPlaceholder {

  constructor(name) {
    super('id', name);
  }
};