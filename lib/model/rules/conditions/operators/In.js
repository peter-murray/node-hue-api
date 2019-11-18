'use strict';

const RuleConditionOperator = require('./RuleConditionOperator');

class In extends RuleConditionOperator {

  constructor() {
    super('in');
  }
}

module.exports =  new In();