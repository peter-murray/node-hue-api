'use strict';

const RuleConditionOperator = require('./RuleConditionOperator');


class Equals extends RuleConditionOperator {

  constructor() {
    super('eq', ['=', '==', 'equals', '===']);
  }
}

module.exports = new Equals();