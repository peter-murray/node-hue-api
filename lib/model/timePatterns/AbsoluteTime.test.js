'use strict';

const expect = require('chai').expect
  , AbsoluteTime = require('./AbsoluteTime')
  , HueDate = require('./HueDate')
  , HueTime = require('./HueTime')
;

describe('AbsoluteTime', () => {


  describe('constructor', () => {

    it('should create an AbsoluteTime from no parameters', () => {
      const absoluteTime = new AbsoluteTime()
        , time = new HueTime()
        , date = new HueDate()
      ;

      expect(absoluteTime.toString()).to.equal(`${date.toString()}T${time.toString()}`);
    });

    it('should create from a valid string', () => {
      const timeString = '1977-08-12T12:00:00'
        , absoluteTime = new AbsoluteTime(timeString)
      ;

      expect(absoluteTime.toString()).to.equal(timeString);
    });

    it('should create from a Date object', () => {
      const date = new Date()
        , absoluteTime = new AbsoluteTime(date)
      ;

      expect(absoluteTime.toString()).to.equal(fromDate(date));
    });

    it('should create from setters', () => {
      const absoluteTime = new AbsoluteTime();
      absoluteTime.year(1977).month(12).day(1).hours(23).minutes(12).seconds(31);
      expect(absoluteTime.toString()).to.equal('1977-12-01T23:12:31');
    });

    //TODO allow cloning from another AbsoluteTime?
  });
});

function fromDate(date) {
  const hours = `${date.getUTCHours()}`.padStart(2, '0')
    , minutes = `${date.getUTCMinutes()}`.padStart(2, '0')
    , seconds = `${date.getUTCSeconds()}`.padStart(2, '0')
    , month = `${date.getUTCMonth() + 1}`.padStart(2, '0')
    , day = `${date.getUTCDate()}`.padStart(2, '0')
  ;

  return `${date.getFullYear()}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}