'use strict';

const dateUtil = require('./DateTimeUtil')
  , HueTime = require('./HueTime')
  , BridgeTime = require('./BridgeTime')
  , ApiError = require('../../ApiError')
;

module.exports = class Timer extends BridgeTime {

  constructor() {
    super(dateUtil.regex.Timer);
    this._time = new HueTime();
  }

  set value(value) {
    if (value instanceof HueTime) {
      this._time = value;
    } else {
      this.fromString(value);
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
    return `PT${this._time.toString()}`;
  }

  fromString(value) {
    const parsed = this.validationRegex.exec(value);
    if (parsed) {
      this._time.hour(parsed[1]);
      this._time.minute(parsed[2]);
      this._time.second(parsed[3]);
    } else {
      throw new ApiError(`Invalid value format ${value}`);
    }
  }
};