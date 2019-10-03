'use strict';

const RuleConditionOperator = require('./RuleConditionOperator');

class Ddx extends RuleConditionOperator {

  constructor() {
    super('ddx');
  }
}

module.exports = new Ddx();