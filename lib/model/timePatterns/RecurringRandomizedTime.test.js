'use strict';

const expect = require('chai').expect
  , RecurringRandomizedTime = require('./RecurringRandomizedTime')
  , HueTime = require('./HueTime')
  , timePatterns = require('./index')
;

describe('RecurringRandomizedTime', () => {

  describe('constructor', () => {

    it('should create an RecurringTime from no parameters', () => {
      const recurringTime = new RecurringRandomizedTime()
        , time = new HueTime()
      ;
      expect(recurringTime.toString()).to.equal(`W${timePatterns.weekdays.ALL}/T${time.toString()}A${time.toString()}`);
    });

    it('should create from a valid string', () => {
      const timeString = 'W001/T12:00:00A03:30:10'
        , recurringTime = new RecurringRandomizedTime(timeString)
      ;
      expect(recurringTime.toString()).to.equal(timeString);
    });

    it('should create from a Date object', () => {
      const date = new Date()
        , recurringTime = new RecurringRandomizedTime(date)
      ;
      expect(recurringTime.toString()).to.equal(`W${timePatterns.weekdays.ALL}/T${fromDate(date)}A00:00:00`);
    });

    it('should create from weekdays and date parameter', () => {
      const date = new Date()
        , weekdays = timePatterns.weekdays.MONDAY | timePatterns.weekdays.TUESDAY | timePatterns.weekdays.WEDNESDAY
        , recurringTime = new RecurringRandomizedTime(weekdays, date)
      ;
      expect(recurringTime.toString()).to.equal(`W${padWeekday(weekdays)}/T${fromDate(date)}A00:00:00`);
    });

    it('should create from setters', () => {
      const time = new RecurringRandomizedTime();
      time.weekdays(timePatterns.weekdays.MONDAY)
        .hours(23).minutes(12).seconds(32)
        .randomHours(1).randomMinutes(2).randomSeconds(59);
      expect(time.toString()).to.equal(`W${padWeekday(timePatterns.weekdays.MONDAY)}/T23:12:32A01:02:59`);
    });

    //TODO allow cloning from another RecurringRandomizedTime?
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