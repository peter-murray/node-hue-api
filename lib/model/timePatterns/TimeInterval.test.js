'use strict';

const expect = require('chai').expect
  , TimeInterval = require('./TimeInterval')
  , HueTime = require('./HueTime')
  , timePatterns = require('./index')
;

describe('TimeInterval', () => {

  describe('constructor', () => {

    it('should create an RecurringTime from no parameters', () => {
      const recurringTime = new TimeInterval()
        , time = new HueTime()
      ;

      expect(recurringTime.toString()).to.equal(`W${timePatterns.weekdays.ALL}/T${time.toString()}/T${time.toString()}`);
    });

    it('should create from a valid string', () => {
      const timeString = 'W001/T12:00:00/T13:00:00'
        , recurringTime = new TimeInterval(timeString)
      ;
      expect(recurringTime.toString()).to.equal(timeString);
    });

    it('should fail create from a Date object', () => {
      try {
        new TimeInterval(new Date());
        expect.fail('should not get here');
      } catch (err) {
        expect(err.message).to.contain('Cannot');
      }
    });

    it('should create from weekdays and date parameter', () => {

    });

    it('should create from setters', () => {
      const time = new TimeInterval();
      time.fromHours(23).fromMinutes(12).fromSeconds(32).weekdays(timePatterns.weekdays.MONDAY);
      expect(time.toString()).to.equal(`W${padWeekday(timePatterns.weekdays.MONDAY)}/T23:12:32/T00:00:00`);
    });

    it('should create from setters', () => {
      const time = new TimeInterval();

      time.weekdays(timePatterns.weekdays.MONDAY | timePatterns.weekdays.FRIDAY)
        .fromHours(12)
        .toHours(14).toMinutes(30)
      ;
      expect(time.toString()).to.equal(`W${padWeekday(timePatterns.weekdays.MONDAY | timePatterns.weekdays.FRIDAY)}/T12:00:00/T14:30:00`);
    });

    it('should be able to be set using dates', () => {
      const time = new TimeInterval()
        , from = new Date('2019-01-01T02:31:01')
        , to = new Date('2019-02-03T02:32:40')
      ;

      time.weekdays(timePatterns.weekdays.SUNDAY).from(from).to(to);
      expect(time.toString()).to.equal(`W${padWeekday(timePatterns.weekdays.SUNDAY)}/T${fromDate(from)}/T${fromDate(to)}`);
    });
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