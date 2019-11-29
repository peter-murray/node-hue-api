'use strict';

const expect = require('chai').expect
  , HueDate = require('./HueDate')
;

describe('HueDate', () => {


  describe('constructor', () => {

    it('should create a HueDate', () => {
      const date = new HueDate()
        , now = new Date()
      ;

      expect(date.year).to.equal(now.getUTCFullYear());
      expect(date.month).to.equal(now.getUTCMonth() + 1);
      expect(date.day).to.equal(now.getUTCDate());
    });

    it('should create one from a Date', () => {
      const myDate = new Date('1977-08-12')
        , date = new HueDate(myDate)
      ;

      expect(date.year).to.equal(myDate.getUTCFullYear());
      expect(date.month).to.equal(myDate.getUTCMonth() + 1);
      expect(date.day).to.equal(myDate.getUTCDate());
    });

    it('should create one from a Date', () => {
      const myDate = '1977-08-12'
        , date = new HueDate(myDate)
      ;

      expect(date.year).to.equal(1977);
      expect(date.month).to.equal(8);
      expect(date.day).to.equal(12);
    });
  });


  // describe('#fromString()', () => {
  //
  // });
  //
  //
  // describe('#fromDate()', () => {
  //
  // });

  //TODO test more  boundaries
});