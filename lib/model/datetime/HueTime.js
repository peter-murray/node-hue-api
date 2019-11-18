'use strict';

const ApiError = require('../../../index').ApiError;

module.exports = class HueTime {

  constructor() {
    this._date = new Date();
    this._date.setHours(0);
    this._date.setMinutes(0);
    this._date.setSeconds(0);
  }

  hour(value) {
    if (value < 0 || value > 23) {
      throw new ApiError(`Invalid hour value: ${value}, must be between 0 and 23`);
    }
    this._date.setHours(value);
    return this;
  }

  minute(value) {
    if (value < 0 || value > 59) {
      throw new ApiError(`Invalid minute value: ${value}, must be between 0 and 59`);
    }
    this._date.setMinutes(value);
    return this;
  }

  second(value) {
    if (value < 0 || value > 59) {
      throw new ApiError(`Invalid second value: ${value}, must be between 0 and 59`);
    }
    this._date.setSeconds(value);
    return this;
  }

  toString() {
    return this._date.toTimeString().substr(0, 8);
  }

  fromString(value) {
    const parsed = new Date(value);
    return this.fromDate(parsed);
  }

  fromDate(value) {
    this._date.setHours(value.getHours());
    this._date.setMinutes(value.getMinutes());
    this._date.setSeconds(value.getSeconds());
    return this;
  }
};