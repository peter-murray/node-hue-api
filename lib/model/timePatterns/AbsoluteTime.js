'use strict';

const timeUtil = require('./timeUtil')
  , HueTime = require('./HueTime')
  , HueDate = require('./HueDate')
  , BridgeTime = require('./BridgeTime')
  , ApiError = require('../../ApiError')
;

const ABSOLUTE_TIME_REGEX = new RegExp(`${timeUtil.getDatePattern()}T${timeUtil.getTimePattern()}`);

module.exports = class AbsoluteTime extends BridgeTime {

  constructor(value) {
    super();
    this._time = new HueTime();
    this._date = new HueDate();

    if (value) {
      this.value = value;
    }
  }

  static matches(value) {
    return ABSOLUTE_TIME_REGEX.test(value);
  }

  set value(value) {
    if (value instanceof AbsoluteTime) {
      return this.value = value.toString();
    } else if (value instanceof Date) {
      this._time.fromDate(value);
      this._date.fromDate(value);
      return this;
    }

    const parsed = ABSOLUTE_TIME_REGEX.exec(value);
    if (parsed) {
      const time = this._time;
      time.hours = parsed.groups.hours;
      time.minutes = parsed.groups.minutes;
      time.seconds = parsed.groups.seconds;

      const date = this._date;
      date.year = parsed.groups.year;
      date.month = parsed.groups.month;
      date.day = parsed.groups.day;

      return this;
    }

    throw new ApiError(`Cannot create an absolute time from ${value}`);
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

  toString() {
    return `${this._date.toString()}T${this._time.toString()}`;
  }
};