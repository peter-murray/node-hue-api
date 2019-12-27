'use strict';

const timeUtil = require('./timeUtil')
  , HueTime = require('./HueTime')
  , BridgeTime = require('./BridgeTime')
  , ApiError = require('../../ApiError')
;


const RANDOMIZED_TIMER_REGEX = new RegExp(`^PT${timeUtil.getTimePattern()}A${timeUtil.getTimePattern('random')}$`);


module.exports = class RandomizedTimer extends BridgeTime {

  constructor(value) {
    super();
    this._time = new HueTime();
    this._random = new HueTime();

    if (value) {
      this.value = value;
    }
  }

  static matches(value) {
    return RANDOMIZED_TIMER_REGEX.test(value);
  }

  set value(value) {
    if (value instanceof RandomizedTimer) {
      this.value = value.toString();
      return this;
    }

    const parsed = RANDOMIZED_TIMER_REGEX.exec(value);
    if (parsed) {
      const time = this._time;
      time.hours = parsed.groups.hours;
      time.minutes = parsed.groups.minutes;
      time.seconds = parsed.groups.seconds;

      const random = this._random;
      random.hours = parsed.groups.randomhours;
      random.minutes = parsed.groups.randomminutes;
      random.seconds = parsed.groups.randomseconds;
      return this;
    }

    throw new ApiError(`Cannot create a RandomizedTimer from ${value}`);
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

  randomHours(value) {
    this._random.hours = value;
    return this;
  }

  randomMinutes(value) {
    this._random.minutes = value;
    return this;
  }

  randomSeconds(value) {
    this._random.seconds = value;
    return this;
  }

  toString() {
    return `PT${this._time.toString()}A${this._random.toString()}`;
  }
};