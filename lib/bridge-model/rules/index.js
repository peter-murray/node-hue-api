'use strict';

const Rule = require('./Rule')
  // , RuleAction = require('./actions/RuleAction')
  // , RuleCondition = require('./conditions/RuleCondition')
  , conditionOperators = require('./conditions/operators/index')

  , SensorCondition = require('./conditions/SensorCondition')
  , GroupCondition = require('./conditions/GroupCondition')

  , GroupStateAction = require('./actions/GroupStateAction')
  , LightStateAction = require('./actions/LightStateAction')
  , SensorStateAction = require('./actions/SensorStateAction')
  ;


module.exports = {
  Rule: Rule,

  //TODO questionable
  // RuleAction: RuleAction,
  // RuleCondition: RuleCondition,

  conditions: {
    sensor: function(sensor) {
      return new SensorCondition(sensor);
    },

    group: function(id) {
      return new GroupCondition(id);
    },

    operators: conditionOperators,
  },

  actions: {
    light: function(id) {
      return new LightStateAction(id);
    },

    group: function(id) {
      return new GroupStateAction(id);
    },

    sensor: function(id) {
      return new SensorStateAction(id);
    }
  }
};