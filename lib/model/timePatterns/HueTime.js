'use strict';

const ApiError = require('../../ApiError')
  , BridgeObject = require('../BridgeObject')
  , types = require('../../types')
  , dateTimeUtil = require('./timeUtil')
;

const ATTRIBUTES = [
  types.uint8({name: 'hours', min: 0, max: 23}),
  types.uint8({name: 'minutes', min: 0, max: 59}),
  types.uint8({name: 'seconds', min: 0, max: 59}),
];

const TIME_REGEX = new RegExp(dateTimeUtil.getTimePattern());

module.exports = class HueTime extends BridgeObject {

  constructor(time) {
    super(ATTRIBUTES);

    if (time instanceof Date){
      this.fromDate(time);
    } else {
      this.fromString(time || '00:00:00');
    }
  }

  get hours() {
    return this.getAttributeValue('hours');
  }

  get hoursString() {
    return `${this.hours}`.padStart(2, '0');
  }

  set hours(value) {
    return this.setAttributeValue('hours', value);
  }

  get minutes() {
    return this.getAttributeValue('minutes');
  }

  get minutesString() {
    return `${this.minutes}`.padStart(2, '0');
  }

  set minutes(value) {
    return this.setAttributeValue('minutes', value);
  }

  get seconds() {
    return this.getAttributeValue('seconds');
  }

  get secondsString() {
    return `${this.seconds}`.padStart(2, '0');
  }

  set seconds(value) {
    return this.setAttributeValue('seconds', value);
  }

  toString() {
    return `${this.hoursString}:${this.minutesString}:${this.secondsString}`;
  }

  fromString(value) {
    const parsed = TIME_REGEX.exec(value);

    if (parsed) {
      this.hours = parsed.groups.hours;
      this.minutes = parsed.groups.minutes;
      this.seconds = parsed.groups.seconds;
    } else {
      throw new ApiError(`Invalid time format string "${value}"`);
    }
  }

  fromDate(value) {
    //TODO should validate we have a Date first
    this.hours = value.getHours();
    this.minutes = value.getMinutes();
    this.seconds = value.getSeconds();
  }
};

