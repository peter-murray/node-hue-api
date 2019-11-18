'use strict';

const BridgeTime = require('./BridgeTime')
  , dateTimeUtil = require('./DateTimeUtil')
  , HueTime = require('./HueTime')
  , ApiError = require('../../ApiError')
;

//TODO need a nice way to specify days
const DAYS = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 4,
  THURSDAY: 8,
  FRIDAY: 16,
  SATURDAY: 32,
  SUNDAY: 64
};

module.exports = class RecurringTime extends BridgeTime {

  constructor() {
    super(dateTimeUtil.regex.RecurringTime);
    this._time = new HueTime();
    this._weekdays = 0;
  }

  weekdays(value) {
    if (value < 128) {
      this._weekdays = value;
    } else {
      throw new ApiError(`Invalid weekday value bitmask provided '${value}'`);
    }
    return this;
  }

  hour(value) {
    this._time.hour(value);
    return this;
  }

  minute(value) {
    this._time.minute(value);
    return this;
  }

  second(value) {
    this._time.second(value);
    return this;
  }

  toString() {
    return `W${this._weekdays}/T${this._time.toString()}`;
  }

  fromString(value) {
    const parsed = this.validationRegex.exec(value);
    if (parsed) {
      this._weekdays = parsed[1];
      this._time.hour(parsed[2]);
      this._time.minute(parsed[3]);
      this._time.second(parsed[4]);
    } else {
      throw new ApiError(`Invalid value format ${value}`);
    }
  }
};