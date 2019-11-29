'use strict';

const expect = require('chai').expect
  , RandomizedTimer = require('./RandomizedTimer')
  , ApiError = require('../../ApiError')
;


describe('#RandomizedTimer', () => {

  it('should create a valid empty timer', () => {
    const result = new RandomizedTimer();
    expect(result.toString()).to.equal('PT00:00:00A00:00:00');
  });

  it('should create a from a valid string', () => {
    const time = 'PT06:15:30A00:00:01'
      , result = new RandomizedTimer(time)
    ;
    expect(result.toString()).to.equal(time);
  });

  it('should create a valid timer from function calls', () => {
    const result = new RandomizedTimer();
    result.hours(23).minutes(59).seconds(59);
    expect(result.toString()).to.equal('PT23:59:59A00:00:00');
  });

  it('should reject invalid hour value', () => {
    const result = new RandomizedTimer();

    try {
      result.hours(-1);
      expect.fail('should have errored');
    } catch (err) {
      expect(err).to.be.instanceOf(ApiError);
      expect(err.message).to.include('not within allowed limits');
    }
  });

  it('should reject invalid minute value', () => {
    const result = new RandomizedTimer();

    try {
      result.minutes(100);
      expect.fail('should have errored');
    } catch (err) {
      expect(err).to.be.instanceOf(ApiError);
      expect(err.message).to.include('not within allowed limit');
    }
  });

  it('should reject invalid second value', () => {
    const result = new RandomizedTimer();

    try {
      result.seconds(60);
      expect.fail('should have errored');
    } catch (err) {
      expect(err).to.be.instanceOf(ApiError);
      expect(err.message).to.include('not within allowed limits');
    }
  });

  it('should create from another timer', () => {
    const source = new RandomizedTimer();
    source.hours(1).minutes(30).seconds(59).randomHours(2);

    const result = new RandomizedTimer();
    result.value = source;
    expect(result.toString()).to.equal('PT01:30:59A02:00:00');
  });

  it('should create from a valid timer string', () => {
    const result = new RandomizedTimer()
      , value = 'PT12:01:01A10:01:59'
    ;
    result.value = value;
    expect(result.toString()).to.equal(value);
  });
});