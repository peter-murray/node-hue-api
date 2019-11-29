'use strict';

const BridgeTime = require('./BridgeTime')
  , timeUtil = require('./timeUtil')
  , HueTime = require('./HueTime')
  , ApiError = require('../../ApiError')
  , types = require('../../types')
;


const TIME_INTERVAL_REGEX = new RegExp(`^W(?<weekdays>[0-9]{3})/T${timeUtil.getTimePattern('from')}/T${timeUtil.getTimePattern('to')}$`);

const WEEKDAY_ATTRIBUTE = types.uint8({name: 'weekdays', min: 1, max: timeUtil.weekdays.ALL});

module.exports = class TimeInterval extends BridgeTime {

  constructor() {
    super();

    this._from = new HueTime();
    this._to = new HueTime();
    this._weekdays = timeUtil.weekdays.ALL;

    if (arguments.length > 0) {
      this.setValue.apply(this, Array.from(arguments));
    }
  }

  static matches(value) {
    return TIME_INTERVAL_REGEX.test(value);
  }

  setValue() {
    const argOne = arguments[0];
    if (argOne instanceof TimeInterval) {
      return this.setValue(argOne.toString());
    }

    const parsed = TIME_INTERVAL_REGEX.exec(arguments[0]);
    if (parsed) {
      const from = this._from;
      from.hours = parsed.groups.fromhours;
      from.minutes = parsed.groups.fromminutes;
      from.seconds = parsed.groups.fromseconds;

      const to = this._to;
      to.hours = parsed.groups.tohours;
      to.minutes = parsed.groups.tominutes;
      to.seconds = parsed.groups.toseconds;

      this.weekdays(parsed.groups.weekdays);
      return this;
    }

    const args = Array.from(arguments).join(', ');
    throw new ApiError(`Cannot create a TimeInterval from ${args}`);
  }

  get weekdaysString() {
    return `${this._weekdays}`.padStart(3, '0');
  }

  weekdays(value) {
    this._weekdays = WEEKDAY_ATTRIBUTE.getValue(value);
    return this;
  }

  from(date) {
    this._from.fromDate(date);
    return this;
  }

  fromHours(value) {
    this._from.hours = value;
    return this;
  }

  fromMinutes(value) {
    this._from.minutes = value;
    return this;
  }

  fromSeconds(value) {
    this._from.seconds = value;
    return this;
  }

  to(date) {
    this._to.fromDate(date);
    return this;
  }

  toHours(value) {
    this._to.hours = value;
    return this;
  }

  toMinutes(value) {
    this._to.minutes = value;
    return this;
  }

  toSeconds(value) {
    this._to.seconds = value;
    return this;
  }

  toString() {
    return `W${this.weekdaysString}/T${this._from.toString()}/T${this._to.toString()}`;
  }
};