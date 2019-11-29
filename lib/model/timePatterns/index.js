'use strict';

const BridgeTime = require('./BridgeTime')
  , AbsoluteTime = require('./AbsoluteTime')
  , RandomizedTime = require('./RandomizedTime')
  , RecurringTime = require('./RecurringTime')
  , RecurringRandomizedTime = require('./RecurringRandomizedTime')
  , TimeInterval = require('./TimeInterval')
  , Timer = require('./Timer')
  , RecurringTimer = require('./RecurringTimer')
  , RandomizedTimer = require('./RandomizedTimer')
  , RecurringRandomizedTimer = require('./RecurringRandomizedTimer')
  , ApiError = require('../../ApiError')
  , timeUtil = require('./timeUtil')
;


module.exports = {

  weekdays: timeUtil.weekdays,

  isRecurring(value) {
    if (value instanceof BridgeTime) {
      return value instanceof RecurringTime
        || value instanceof RecurringRandomizedTime
        || value instanceof RecurringTimer
        || value instanceof RecurringRandomizedTimer;
    } else {
      return RecurringTime.matches(value)
        || RecurringRandomizedTime.matches(value)
        || RecurringTimer.matches(value)
        || RecurringRandomizedTimer.matches(value);
    }
  },

  createAbsoluteTime(value) {
    return new AbsoluteTime(value);
  },

  createRandomizedTime(value) {
    return new RandomizedTime(value);
  },

  createRecurringTime(weekdays, value) {
    return new RecurringTime(weekdays, value);
  },

  createRecurringRandomizedTime(value) {
    return new RecurringRandomizedTime(value);
  },

  createTimeInterval(value) {
    return new TimeInterval(value);
  },

  createTimer(value) {
    return new Timer(value);
  },

  createRecurringTimer(value) {
    return new RecurringTimer(value);
  },

  createRandomizedTimer(value) {
    return new RandomizedTimer(value);
  },

  createRecurringRandomizedTimer(value) {
    return new RecurringRandomizedTimer(value);
  },

  createFromString(str) {
    if (AbsoluteTime.matches(str)) {
      return new AbsoluteTime(str);
    } else if (RecurringTime.matches(str)) {
      return new RecurringTime(str);
    } else if (Timer.matches(str)) {
      return new Timer(str);
    } else if (RandomizedTime.matches(str)) {
      return new RandomizedTime(str);
    } else if (RecurringRandomizedTime.matches(str)) {
      return new RecurringRandomizedTime(str);
    } else if (RecurringTimer.matches(str)) {
      return new RecurringTimer(str);
    } else if (RandomizedTimer.matches(str)) {
      return new RandomizedTimer(str);
    } else if (RecurringRandomizedTimer.matches(str)) {
      return new RecurringRandomizedTimer(str);
    } else {
      throw new ApiError(`Unable to determine a valid time pattern for string: "${str}"`);
    }
  },

  isTimePattern(str) {
    return AbsoluteTime.matches(str)
      || RecurringTime.matches(str)
      || RandomizedTime.matches(str)
      || RecurringRandomizedTime.matches(str)
      || Timer.matches(str)
      || RecurringTimer.matches(str)
      || RandomizedTimer.matches(str)
      || RecurringRandomizedTimer.matches(str);
  }
};