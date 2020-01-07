'use strict';

const RuleConditionOperator = require('./RuleConditionOperator');

const  Equals = new RuleConditionOperator('eq', ['=', '==', 'equals', '==='])
  , Dx = new RuleConditionOperator('dx')
  , Ddx =new RuleConditionOperator('ddx')
  , Stable = new RuleConditionOperator('stable')
  , NotStable = new RuleConditionOperator('not stable')
  , In = new RuleConditionOperator('in')
  , NotIn = new RuleConditionOperator('not in')
  , LessThan = new RuleConditionOperator('lt', ['<'])
  , GreaterThan = new RuleConditionOperator('gt', ['>'])
;

module.exports.getOperator = function(value) {
  if (value instanceof RuleConditionOperator) {
    return value;
  } else {
    let matchedOperator = null;

    if (value) {
      [Equals, Dx, Ddx, Stable, NotStable, In, NotIn, LessThan, GreaterThan].some(operator => {
        if (operator.matches(value)) {
          matchedOperator = operator;
          return true;
        }
      });
    }

    return matchedOperator;
  }
};

module.exports.equals = Equals;

module.exports.changed = Dx;

module.exports.changedDelayed = Ddx;

module.exports.greaterThan = GreaterThan;

module.exports.lessThan = LessThan;

module.exports.stable = Stable;

module.exports.notStable = NotStable;

module.exports.in = In;

module.exports.notIn = NotIn;