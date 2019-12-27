'use strict';

const expect = require('chai').expect
  , Timer = require('./Timer')
  , ApiError = require('../../ApiError')
;


describe('#Timer', () => {

  it('should create a valid empty timer', () => {
    const result = new Timer();
    expect(result.toString()).to.equal('PT00:00:00');
  });

  it('should create a from a valid string', () => {
    const time = 'PT06:15:30'
      , result = new Timer(time)
    ;
    expect(result.toString()).to.equal(time);
  });

  it('should create a valid timer from function calls', () => {
    const result = new Timer();
    result.hours(23).minutes(59).seconds(59);
    expect(result.toString()).to.equal('PT23:59:59');
  });

  it('should reject invalid hour value', () => {
    const result = new Timer();

    try {
      result.hours(-1);
      expect.fail('should have errored');
    } catch (err) {
      expect(err).to.be.instanceOf(ApiError);
      expect(err.message).to.include('not within allowed limits');
    }
  });

  it('should reject invalid minute value', () => {
    const result = new Timer();

    try {
      result.minutes(100);
      expect.fail('should have errored');
    } catch (err) {
      expect(err).to.be.instanceOf(ApiError);
      expect(err.message).to.include('not within allowed limit');
    }
  });

  it('should reject invalid second value', () => {
    const result = new Timer();

    try {
      result.seconds(60);
      expect.fail('should have errored');
    } catch (err) {
      expect(err).to.be.instanceOf(ApiError);
      expect(err.message).to.include('not within allowed limits');
    }
  });

  it('should create from another timer', () => {
    const source = new Timer();
    source.hours(1).minutes(30).seconds(59);

    const result = new Timer();
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