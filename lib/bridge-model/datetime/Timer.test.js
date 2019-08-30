'use strict';

const expect = require('chai').expect
  , Timer = require('./Timer')
  , ApiError = require('../../../index').ApiError
;


describe('#Timer', () => {

  it('should create a valid empty timer', () => {
    const result = new Timer();
    expect(result).to.be.instanceOf(Timer);
    expect(result.toString()).to.equal('PT00:00:00');
  });

  it('should create a valid timer from function calls', () => {
    const result = new Timer();
    result.hour(23).minute(59).second(59);
    expect(result.toString()).to.equal('PT23:59:59');
  });

  it('should reject invalid hour value', () => {
    const result = new Timer();

    try {
      result.hour(-1);
      expect.fail('should have errored');
    } catch(err) {
      expect(err).to.be.instanceOf(ApiError);
      expect(err.message).to.include('Invalid hour value');
    }
  });

  it('should reject invalid minute value', () => {
    const result = new Timer();

    try {
      result.minute(100);
      expect.fail('should have errored');
    } catch(err) {
      expect(err).to.be.instanceOf(ApiError);
      expect(err.message).to.include('Invalid minute value');
    }
  });

  it('should reject invalid second value', () => {
    const result = new Timer();

    try {
      result.second(60);
      expect.fail('should have errored');
    } catch(err) {
      expect(err).to.be.instanceOf(ApiError);
      expect(err.message).to.include('Invalid second value');
    }
  });

  it('should create from another timer', () => {
    const source = new Timer().hour(1).minute(30).second(59)
      , result = new Timer()
    ;

    result.value = source;
    expect(result.toString()).to.equal('PT01:30:59');
  });

  it('should create from a valid timer string', () => {
    const result = new Timer()
      , value = 'PT12:01:01'
    ;
    result.value = value;
    expect(result.toString()).to.equal(value);
  });
});