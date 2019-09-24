'use strict';

module.exports.create = function(value) {

};

class RuleConditionOperator {

  constructor(name) {
    this.type = name;
  }
}

class Equals extends RuleConditionOperator {

  constructor() {
    super('eq');
  }
}

class LessThan extends RuleConditionOperator {

  constructor() {
    super('lt');
  }
}

class GreaterThan extends RuleConditionOperator {

  constructor() {
    super('gt');
  }
}

class In extends RuleConditionOperator {

  constructor() {
    super('in');
  }
}

class NotIn extends RuleConditionOperator {

  constructor() {
    super('not in');
  }
}

class Stable extends RuleConditionOperator {

  constructor() {
    super('stable');
  }
}

class NotStable extends RuleConditionOperator {

  constructor() {
    super('not stable');
  }
}

//TODO dx and ddx