'use strict';

const RuleConditionOperator = require('./RuleConditionOperator');

class LessThan extends RuleConditionOperator {

  constructor() {
    super('lt');
  }
}

module.exports = new LessThan();