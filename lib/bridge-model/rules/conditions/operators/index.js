'use strict';

const RuleConditionOperator = require('./RuleConditionOperator')
  , Equals = require('./Equals')
  , Dx = require('./Dx')
  , Ddx = require('./Ddx')
  , Stable = require('./Stable')
  , NotStable = require('./NotStable')
  , In = require('./In')
  , NotIn = require('./NotIn')
  , LessThan = require('./LessThan')
  , GreaterThan = require('./GreaterThan')
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