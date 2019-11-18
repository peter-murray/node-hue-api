'use strict';

const RuleConditionOperator = require('./RuleConditionOperator');

class Dx extends RuleConditionOperator {

  constructor() {
    super('dx');
  }
}

module.exports = new Dx();