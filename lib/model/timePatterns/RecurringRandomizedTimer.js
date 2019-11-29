'use strict';

const timeUtil = require('./timeUtil')
  , HueTime = require('./HueTime')
  , BridgeTime = require('./BridgeTime')
  , ApiError = require('../../ApiError')
  , types = require('../../types')
;


const RECURRING_RANDOMIZED_TIMER_REGEX = new RegExp(`^R(?<times>[0-9]{0,2})/PT${timeUtil.getTimePattern()}A${timeUtil.getTimePattern('random')}$`);

const REOCCURRANCE_ATTRIBUTE = types.uint8({name: 'reoccurs', min: 0, max: 99, defaultValue: 0, optional: true});

module.exports = class RecurringRandomizedTimer extends BridgeTime {

  constructor(value) {
    super();
    this._time = new HueTime();
    this._random = new HueTime();
    this.reoccurs();

    if (value) {
      this.value = value;
    }
  }

  static matches(value) {
    return RECURRING_RANDOMIZED_TIMER_REGEX.test(value);
  }

  set value(value) {
    if (value instanceof RecurringRandomizedTimer) {
      this.value = value.toString();
      return this;
    }

    const parsed = RECURRING_RANDOMIZED_TIMER_REGEX.exec(value);
    if (parsed) {
      const time = this._time;
      time.hours = parsed.groups.hours;
      time.minutes = parsed.groups.minutes;
      time.seconds = parsed.groups.seconds;

      const random = this._random;
      random.hours = parsed.groups.randomhours;
      random.minutes = parsed.groups.randomminutes;
      random.seconds = parsed.groups.randomseconds;

      this.reoccurs(parsed.groups.times.length === 0 ? 0 : parsed.groups.times);
      return this;
    }

    throw new ApiError(`Cannot create a RandomizedTimer from ${value}`);
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

  reoccurs(value) {
    this._reocurrance = REOCCURRANCE_ATTRIBUTE.getValue(value);
    return this;
  }

  toString() {
    const reoccurs = this._reocurrance;
    let limit = '';
    if (reoccurs !== 0) {
      limit = `${reoccurs}`.padStart(2, '0');
    }
    return `R${limit}/PT${this._time.toString()}A${this._random.toString()}`;
  }
};