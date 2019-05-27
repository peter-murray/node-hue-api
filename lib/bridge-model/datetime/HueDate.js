'use strict';

const ApiError = require('../../../index').ApiError
;

module.exports = class HueDate {

  constructor() {
    this._date = new Date();
    this._date.setUTCFullYear(0);
    this._date.setUTCMonth(0);
    this._date.setUTCDate(1);
  }

  year(value) {
    if (value < 0) {
      throw new ApiError(`Invalid year value: ${value}, must be greater than 0`);
    }
    this._date.setUTCFullYear(value);
    return this;
  }

  month(value) {
    if (value < 1 || value > 12) {
      throw new ApiError(`Invalid month value: ${value}, must be between 1 and 12`);
    }
    this._date.setUTCMonth(value - 1);
    return this;
  }

  day(value) {
    if (value < 1 || value > 31) {
      throw new ApiError(`Invalid day value: ${value}, must be between 1 and 31`);
    }
    this._date.setUTCDate(value);
    return this;
  }

  toString() {
    return this._date.toISOString().substr(0, 10);
  }

  fromString(value) {
    const parsed = new Date(value);
    return this.fromDate(parsed);
  }

  fromDate(value) {
    this._date.setUTCFullYear(value.getUTCFullYear());
    this._date.setUTCDate(value.getUTCDate());
    this._date.setUTCMonth(value.getUTCMonth());
    return this;
  }
};