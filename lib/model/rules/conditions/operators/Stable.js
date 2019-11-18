'use strict';

const RuleConditionOperator = require('./RuleConditionOperator');

class Stable extends RuleConditionOperator {

  constructor() {
    super('stable');
  }
}

module.exports = new Stable();