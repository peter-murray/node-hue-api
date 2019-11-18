'use strict';

const RuleConditionOperator = require('./RuleConditionOperator');

class GreaterThan extends RuleConditionOperator {

  constructor() {
    super('gt');
  }
}

module.exports = new GreaterThan();