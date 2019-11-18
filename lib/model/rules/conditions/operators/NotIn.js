'use strict';

const RuleConditionOperator = require('./RuleConditionOperator');

class NotIn extends RuleConditionOperator {

  constructor() {
    super('not in');
  }
}

module.exports = new NotIn();