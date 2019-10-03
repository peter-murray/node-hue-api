'use strict';

const ApiError = require('../../../ApiError')
  , RuleCondition = require('./RuleCondition')
  , SensorCondition = require('./SensorCondition')
  , GroupCondition = require('./GroupCondition')
;

//TODO verify we have all conditions covered
module.exports.create = function(data) {
  if (data) {
    if (data instanceof SensorCondition || data instanceof GroupCondition) {
      return data.getRuleCondition();
    } else if (data instanceof RuleCondition) {
      return data;
    } else {
      return new RuleCondition().populate(data);
    }
  } else {
    throw new ApiError('No data provided to build RuleCondition instance from.');
  }
};

