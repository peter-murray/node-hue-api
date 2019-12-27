'use strict';

const expect = require('chai').expect
  , RecurringTime = require('./RecurringTime')
  , HueTime = require('./HueTime')
  , timePatterns = require('./index')
;

describe('RecurringTime', () => {

  describe('constructor', () => {

    it('should create an RecurringTime from no parameters', () => {
      const recurringTime = new RecurringTime()
        , time = new HueTime()
      ;

      expect(recurringTime.toString()).to.equal(`W${timePatterns.weekdays.ALL}/T${time.toString()}`);
    });

    it('should create from a valid string', () => {
      const timeString = 'W001/T12:00:00'
        , recurringTime = new RecurringTime(timeString)
      ;
      expect(recurringTime.toString()).to.equal(timeString);
    });

    it('should create from a Date object', () => {
      const date = new Date()
        , recurringTime = new RecurringTime(date)
      ;
      expect(recurringTime.toString()).to.equal(`W${timePatterns.weekdays.ALL}/T${fromDate(date)}`);
    });

    it('should create from weekdays and date parameter', () => {
      const date = new Date()
        , weekdays = timePatterns.weekdays.MONDAY | timePatterns.weekdays.TUESDAY | timePatterns.weekdays.WEDNESDAY
        , recurringTime = new RecurringTime(weekdays, date)
      ;
      expect(recurringTime.toString()).to.equal(`W${padWeekday(weekdays)}/T${fromDate(date)}`);
    });

    it('should create from setters', () => {
      const time = new RecurringTime();
      time.hours(23).minutes(12).seconds(32).weekdays(timePatterns.weekdays.MONDAY);
      expect(time.toString()).to.equal(`W${padWeekday(timePatterns.weekdays.MONDAY)}/T23:12:32`);
    });

    //TODO allow cloning from another RecurringTime?
  });
});

function padWeekday(val) {
  return `${val}`.padStart(3, '0');
}

function fromDate(date) {
  const hours = `${date.getUTCHours()}`.padStart(2, '0')
    , minutes = `${date.getUTCMinutes()}`.padStart(2, '0')
    , seconds = `${date.getUTCSeconds()}`.padStart(2, '0')
  ;

  return `${hours}:${minutes}:${seconds}`;
}