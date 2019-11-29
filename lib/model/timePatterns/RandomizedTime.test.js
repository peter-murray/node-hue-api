'use strict';

const expect = require('chai').expect
  , RandomizedTime = require('./RandomizedTime')
  , HueDate = require('./HueDate')
  , HueTime = require('./HueTime')
;

describe('RandomizedTime', () => {


  describe('constructor', () => {

    it('should create an RandomizedTime from no parameters', () => {
      const randomizedTime = new RandomizedTime()
        , time = new HueTime()
        , date = new HueDate()
      ;

      expect(randomizedTime.toString()).to.equal(`${date.toString()}T${time.toString()}A${time.toString()}`);
    });

    it('should create from a valid string', () => {
      const timeString = '1977-08-12T12:00:00A00:00:10'
        , randomizedTime = new RandomizedTime(timeString)
      ;

      expect(randomizedTime.toString()).to.equal(timeString);
    });

    it('should create from a Date object', () => {
      const date = new Date()
        , randomizedTime = new RandomizedTime(date)
      ;

      expect(randomizedTime.toString()).to.equal(`${fromDate(date)}A00:00:00`);
    });

    it('should create from setters', () => {
      const time = new RandomizedTime();
      time.year(1977).month(12).day(1).hours(23).minutes(12).seconds(31).randomHours(1).randomMinutes(2).randomSeconds(3);
      expect(time.toString()).to.equal('1977-12-01T23:12:31A01:02:03');
    });

    //TODO allow cloning from another RandomizedTime?
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