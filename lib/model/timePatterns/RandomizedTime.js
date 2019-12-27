'use strict';

const timeUtil = require('./timeUtil')
  , HueTime = require('./HueTime')
  , HueDate = require('./HueDate')
  , BridgeTime = require('./BridgeTime')
  , ApiError = require('../../ApiError')
;

const RANDOMIZED_TIME_REGEX = new RegExp(`^${timeUtil.getDatePattern()}T${timeUtil.getTimePattern()}A${timeUtil.getTimePattern('random')}$`);

module.exports = class RandomizedTime extends BridgeTime {

  constructor(value) {
    super();
    this._time = new HueTime();
    this._date = new HueDate();
    this._random = new HueTime();

    if (value) {
      this.value = value;
    }
  }

  static matches(value) {
    return RANDOMIZED_TIME_REGEX.test(value);
  }

  set value(value) {
    if (value instanceof RandomizedTime) {
      return this.value = value.toString();
    } else if (value instanceof Date) {
      this._time.fromDate(value);
      this._date.fromDate(value);
      this._random = new HueTime();
      return this;
    }

    const parsed = RANDOMIZED_TIME_REGEX.exec(value);
    if (parsed) {
      const time = this._time;
      time.hours = parsed.groups.hours;
      time.minutes = parsed.groups.minutes;
      time.seconds = parsed.groups.seconds;

      const date = this._date;
      date.year = parsed.groups.year;
      date.month = parsed.groups.month;
      date.day = parsed.groups.day;

      const random = this._random;
      random.hours = parsed.groups.randomhours;
      random.minutes = parsed.groups.randomminutes;
      random.seconds = parsed.groups.randomseconds;

      return this;
    }

    throw new ApiError(`Cannot create a randomized time from ${value}`);
  }

  year(value) {
    this._date.year = value;
    return this;
  }

  month(value) {
    this._date.month = value;
    return this;
  }

  day(value) {
    this._date.day = value;
    return this;
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
    return `${this._date.toString()}T${this._time.toString()}A${this._random.toString()}`;
  }

  //TODO need to add support for random elements, along with other values hours, minutes, etc...
};