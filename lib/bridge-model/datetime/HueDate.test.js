'use strict';

const expect = require('chai').expect
  , HueDate = require('./HueDate')
;

describe('HueDate', () => {

  it('should create a time from a string', () => {
    const time = new HueDate().year(1977).month(8).day(12);
    expect(time.toString()).to.equal('1977-08-12');
  });

  //TODO test boundaries
});