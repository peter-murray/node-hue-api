'use strict';

const RecurringTime = require('./RecurringTime')
  , ApiError = require('../../ApiError')
  , HueTime = require('./HueTime')
  , dateUtil = require('./timeUtil')
;

const RECURRING_RANDOMIZED_TIME_REGEX = new RegExp(`^W(?<weekdays>[0-9]{3})/T${dateUtil.getTimePattern()}A${dateUtil.getTimePattern('random')}$`);

module.exports = class RecurringRandomizedTime extends RecurringTime {

  constructor() {
    super();
    this._random = new HueTime();

    if (arguments.length > 0) {
      this.setValue.apply(this, Array.from(arguments));
    }
  }

  static matches(value) {
    return RECURRING_RANDOMIZED_TIME_REGEX.test(value);
  }

  setValue() {
    // This is all a little convoluted due to large number of parameters it supports, could do with some work on making
    // it clearer as to the path (although tests do provide coverage).
    let weekdays = null
      , date = null
    ;

    if (arguments.length > 1) {
      weekdays = arguments[0];
      date = arguments[1];
    } else if (arguments.length === 1) {
      const argOne = arguments[0];
      if (argOne instanceof RecurringRandomizedTime) {
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

    const parsed = RECURRING_RANDOMIZED_TIME_REGEX.exec(arguments[0]);
    if (parsed) {
      const time = this._time;
      time.hours = parsed.groups.hours;
      time.minutes = parsed.groups.minutes;
      time.seconds = parsed.groups.seconds;

      this.weekdays(parsed.groups.weekdays);

      const random = this._random;
      random.hours = parsed.groups.randomhours;
      random.minutes = parsed.groups.randomminutes;
      random.seconds = parsed.groups.randomseconds;

      return this;
    }

    if (!weekdays && !date) {
      const values = Array.from(arguments).join(', ');
      throw new ApiError(`Cannot create an recurring time from ${values}`);
    }

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
    return `${super.toString()}A${this._random.toString()}`;
  }
}