'use strict';

const expect = require('chai').expect
  , HueTime = require('./HueTime')
;

describe('HueTime', () => {

  const validTimeStrings = [
    '00:00:00',
    '00:00:01',
    '00:00:59',
    '00:59:00',
    '00:01:00',
    '23:00:00',
    '23:59:59',
  ];

  const validDates = [
    new Date(),
    new Date(' August 12, 1977 15:00:01')
  ];

//TODO test boundaries

  describe('construction', () => {

    it('should create from an empty string', () => {
      const time = new HueTime();

      expect(time.toString()).to.equal('00:00:00');
    });

    it('should create a time from a string', () => {
      const timeString = '12:32:47'
        , time = new HueTime(timeString);

      expect(time.toString()).to.equal(timeString);
    });

    it('should create a time from a date', () => {
      const date = new Date()
        , time = new HueTime(date);

      expect(time.hours).to.equal(date.getHours());
      expect(time.minutes).to.equal(date.getMinutes());
      expect(time.seconds).to.equal(date.getSeconds());
    });
  });

  describe('setting hours, minutes, seconds', () => {

    it('should set to values', () => {
      const time = new HueTime();
      time.seconds = 1;

      expect(time.toString()).to.equal('00:00:01');
    });

  });

  describe('#fromString()', () => {

    it('should process valid values', () => {
      validTimeStrings.forEach(validTime => {
        const time = new HueTime();
        time.fromString(validTime);

        expect(time.toString()).to.equal(validTime);
      });
    });
  });

  describe('#fromDate()', () => {

    it('should process valid values', () => {
      validDates.forEach(date => {
        const time = new HueTime();
        time.fromDate(date);

        expect(time.hours).to.equal(date.getHours());
        expect(time.minutes).to.equal(date.getMinutes());
        expect(time.seconds).to.equal(date.getSeconds());
      });
    });
  });
});