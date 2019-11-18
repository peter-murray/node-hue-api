'use strict';

const RuleConditionOperator = require('./RuleConditionOperator');

class NotStable extends RuleConditionOperator {

  constructor() {
    super('not stable');
  }
}

module.exports =  new NotStable();