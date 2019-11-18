'use strict';

const dateUtil = require('./DateTimeUtil')
  , HueTime = require('./HueTime')
  , HueDate = require('./HueDate')
  , BridgeTime = require('./BridgeTime')
  , ApiError = require('../../../index').ApiError
;

module.exports = class AbsoluteTime extends BridgeTime {

  constructor() {
    super(dateUtil.regex.AbsoluteTime);
    this._time = new HueTime();
    this._date = new HueDate();
  }

  set value(value) {
    if (value instanceof Date) {
      this.fromDate(value);
    } else if (value instanceof HueTime) {
      this._time = value;
    } else if (value instanceof HueDate) {
      this._date = value;
    } else if (value instanceof AbsoluteTime) {
      //TODO need a cleaner clone function
      this._time.fromString(value._time.toString());
      this._date.fromString(value._date.toString());
    } else {
      this.fromString(value);
    }
    return this;
  }

  year(value) {
    this._date.year(value);
    return this;
  }

  month(value) {
    this._date.month(value);
    return this;
  }

  day(value) {
    this._date.day(value);
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
    return `${this._date.toString()}T${this._time.toString()}`;
  }

  fromString(value) {
    const parsed = this.validationRegex.exec(value);
    if (parsed) {
      this._date.fromString(value);
      this._time.fromString(value);
    } else {
      throw new ApiError(`Invalid value format ${value}`);
    }
  }

  fromDate(value) {
    if (value instanceof Date) {
      this._date.fromDate(value);
      //TODO daylight savings is a real pain with this
      this._time.fromDate(value);
    } else {
      //TODO try to parse the date first?

      throw new ApiError(`Invalid Date object provided: ${value}`);
    }
  }
};