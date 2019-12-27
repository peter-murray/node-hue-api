'use strict';

const ApiError = require('../../ApiError')
  , BridgeObject = require('../BridgeObject')
  , types = require('../../types')
  , dateTimeUtil = require('./timeUtil')
;

const DATE_STRING_REGEX = new RegExp(`^${dateTimeUtil.getDatePattern()}`);

const MONTHS = [
  'January',
  'Feburary',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];


const ATTRIBUTES = [
  types.uint8({name: 'year', min: 1900, max: 3000}),
  types.choice({name: 'month', validValues: MONTHS}),
  types.uint8({name: 'day', min: 0, max: 31}),
];


module.exports = class HueDate extends BridgeObject{

  constructor(value) {
    super(ATTRIBUTES);

    if (value instanceof Date) {
      this.fromDate(value);
    } else {
      this.fromString(value);
    }
  }

  get year() {
    return this.getAttributeValue('year');
  }

  get yearString() {
    return `${this.year}`;
  }

  set year(value) {
    return this.setAttributeValue('year', value);
  }

  get month() {
    const idx = MONTHS.indexOf(this.getAttributeValue('month'));

    //TODO make mandatory then will not need this?
    if(idx === -1) {
      throw new ApiError(`Month value has not been set`);
    }

    return  idx + 1;
  }

  get monthString() {
    const month = this.month;
    return `${month}`.padStart(2, '0');
  }

  /**
   * Sets the Month for the Date.
   * @param value {number | string} If a number, it is a 1 based index on the month number (1 === Jan), otherwise as a String the name of the month.
   * @returns {BridgeObject}
   */
  set month(value) {
    const monthNumber = new Number(value);
    if (Number.isNaN(monthNumber)) {
      return this.setAttributeValue('month', value);
    } else {
      const monthName = MONTHS[monthNumber - 1];
      return this.setAttributeValue('month', monthName);
    }
  }

  get day() {
    return this.getAttributeValue('day');
  }

  get dayString() {
    return `${this.day}`.padStart(2, '0');
  }

  set day(value) {
    return this.setAttributeValue('day', value);
  }

  toString() {
    return `${this.yearString}-${this.monthString}-${this.dayString}`;
  }

  fromString(value) {
    if (!value) {
      return this.fromDate(new Date());
    } else {
      const parsed = DATE_STRING_REGEX.exec(value);
      if (parsed) {
        this.year = parsed.groups.year;
        this.month = parsed.groups.month;
        this.day = parsed.groups.day;
        return this;
      }
      return this.fromDate(new Date());
    }
  }

  fromDate(value) {
    const year = value.getUTCFullYear()
      , month = value.getUTCMonth()
      , day = value.getUTCDate()
    ;

    this.year = year;
    this.month = month + 1;
    this.day = day;

    return this;
  }
};