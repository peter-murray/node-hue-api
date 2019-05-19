'use strict';

const expect = require('chai').expect
  , HueTime = require('./HueTime')
;

describe('HueTime', () => {

  it('should create a time from a string', () => {
    const time = new HueTime().hour(0).minute(0).second(1);
    expect(time.toString()).to.equal('00:00:01');
  });

  //TODO test boundaries
});