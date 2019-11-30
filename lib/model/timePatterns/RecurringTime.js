'use strict';

const BridgeTime = require('./BridgeTime')
  , timeUtil = require('./timeUtil')
  , HueTime = require('./HueTime')
  , ApiError = require('../../ApiError')
  , types = require('../../types')
;


const RECURRING_TIME_REGEX = new RegExp(`^W(?<weekdays>[0-9]{3})/T${timeUtil.getTimePattern()}$`);

const WEEKDAY_ATTRIBUTE = types.uint8({name: 'weekdays', min: 1, max: timeUtil.weekdays.ALL});

module.exports = class RecurringTime extends BridgeTime {

  constructor() {
    super();

    this._time = new HueTime();
    this._weekdays = timeUtil.weekdays.ALL;

    if (arguments.length > 0) {
      this.setValue.apply(this, Array.from(arguments));
    }
  }

  static matches(value) {
    return RECURRING_TIME_REGEX.test(value);
  }

  setValue() {
    // This is all a little convoluted due to large number of parameters it supports, could do with some work on making
    // it clearer as to the path (although tests do provide coverage).
    let weekdays = null
      , date = null
    ;

    const args = Array.from(arguments).filter(arg => arg !== undefined && arg !== null);

    if (args.length > 1) {
      weekdays = args[0];
      date = args[1];
    } else if (args.length === 1) {
      const argOne = args[0];
      if (argOne instanceof RecurringTime) {
        return this.setValue(argOne.toString());
      } else if (argOne instanceof Date) {
        date = argOne
      } else if (Number.isInteger(argOne)) {
        weekdays = argOne;
      }
    }

    if (date) {
      this._time.fromDate(date);
    }

    if (weekdays) {
      this.weekdays(weekdays);
    }

    const parsed = RECURRING_TIME_REGEX.exec(arguments[0]);
    if (parsed) {
      const time = this._time;
      time.hours = parsed.groups.hours;
      time.minutes = parsed.groups.minutes;
      time.seconds = parsed.groups.seconds;
      this.weekdays(parsed.groups.weekdays);
      return this;
    }

    if (!weekdays && !date) {
      const values = Array.from(arguments).join(', ');
      throw new ApiError(`Cannot create an recurring time from ${values}`);
    }

    return this;
  }

  get weekdaysString() {
    return `${this._weekdays}`.padStart(3, '0');
  }

  weekdays(value) {
    this._weekdays = WEEKDAY_ATTRIBUTE.getValue(value);
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
    return `W${this.weekdaysString}/T${this._time.toString()}`;
  }
};