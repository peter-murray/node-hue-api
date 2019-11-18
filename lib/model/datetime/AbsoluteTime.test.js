'use strict';

const expect = require('chai').expect
  , AbsoluteTime = require('./AbsoluteTime')
;

describe('AbsoluteTime', () => {

  it('should create a time from a string', () => {
    const value = '2018-02-02T00:00:00'
      , time = new AbsoluteTime()
    ;

    time.value = value;
    expect(time.toString()).to.equal(value);
  });

  it('should create a time from a date object', () => {
    const rawString = '2019-12-08T12:30:01'
      , time = new AbsoluteTime()
    ;

    time.value = new Date(rawString);
    expect(time.toString()).to.equal(rawString);
  });

  it('should create a time from a date only', () => {
    const date = '1977-08-12'
      , time = new AbsoluteTime()
    ;

    time.fromDate(new Date(date));
    // Use the following check to deal with daylight savings issues in conversion
    expect(time.toString()).to.include(`${date}T`);
  });
});