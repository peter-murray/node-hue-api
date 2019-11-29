'use strict';

const expect = require('chai').expect
  , RecurringTimer = require('./RecurringTimer')
  , ApiError = require('../../ApiError')
;


describe('#RecurringTimer', () => {

  it('should create a valid empty timer', () => {
    const result = new RecurringTimer();
    expect(result.toString()).to.equal('R/PT00:00:00');
  });

  it('should create a from a valid string', () => {
    const time = 'R/PT06:15:30'
      , result = new RecurringTimer(time)
    ;
    expect(result.toString()).to.equal(time);
  });

  it('should create a valid timer from function calls', () => {
    const result = new RecurringTimer();
    result.hours(23).minutes(59).seconds(59);
    expect(result.toString()).to.equal('R/PT23:59:59');
  });

  it('should reject invalid hour value', () => {
    const result = new RecurringTimer();

    try {
      result.hours(-1);
      expect.fail('should have errored');
    } catch (err) {
      expect(err).to.be.instanceOf(ApiError);
      expect(err.message).to.include('not within allowed limits');
    }
  });

  it('should reject invalid minute value', () => {
    const result = new RecurringTimer();

    try {
      result.minutes(100);
      expect.fail('should have errored');
    } catch (err) {
      expect(err).to.be.instanceOf(ApiError);
      expect(err.message).to.include('not within allowed limit');
    }
  });

  it('should reject invalid second value', () => {
    const result = new RecurringTimer();

    try {
      result.seconds(60);
      expect.fail('should have errored');
    } catch (err) {
      expect(err).to.be.instanceOf(ApiError);
      expect(err.message).to.include('not within allowed limits');
    }
  });

  it('should create from another timer', () => {
    const source = new RecurringTimer();
    source.hours(1).minutes(30).seconds(59);

    const result = new RecurringTimer();
    result.value = source;
    expect(result.toString()).to.equal('R/PT01:30:59');
  });

  it('should create from a valid timer string', () => {
    const result = new RecurringTimer()
      , value = 'R/PT12:01:01'
    ;
    result.value = value;
    expect(result.toString()).to.equal(value);
  });

  describe('repeating limited times', () => {

    it('should work from string value', () => {
      const str = 'R02/PT00:00:10'
        , timer = new RecurringTimer(str)
      ;
      expect(timer.toString()).to.equal(str);
    });

    it('should work from setting values', () => {
      const timer = new RecurringTimer();

      timer.minutes(10).reoccurs(65);
      expect(timer.toString()).to.equal('R65/PT00:10:00');
    });
  });


});