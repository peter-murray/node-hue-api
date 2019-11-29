'use strict';

const timeUtil = require('./timeUtil')
  , HueTime = require('./HueTime')
  , BridgeTime = require('./BridgeTime')
  , ApiError = require('../../ApiError')
;


const TIMER_REGEX = new RegExp(`^PT${timeUtil.getTimePattern()}$`);


module.exports = class Timer extends BridgeTime {

  constructor(value) {
    super();
    this._time = new HueTime();

    if (value) {
      this.value = value;
    }
  }

  static matches(value) {
    return TIMER_REGEX.test(value);
  }

  set value(value) {
    if (value instanceof Timer) {
      this.value = value.toString();
      return this;
    }

    const parsed = TIMER_REGEX.exec(value);
    if (parsed) {
      const time = this._time;
      time.hours = parsed.groups.hours;
      time.minutes = parsed.groups.minutes;
      time.seconds = parsed.groups.seconds;
      return this;
    }

    throw new ApiError(`Cannot create a Timer from ${value}`);
  }

  hours(value) {
    this._time.hours = value;
    return this;
  }

  minutes(value) {
    this._time.minutes = value;
    return this;
  }

  seconds(value) {
    this._time.seconds = value;
    return this;
  }

  toString() {
    return `PT${this._time.toString()}`;
  }
};