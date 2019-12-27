'use strict';

const expect = require('chai').expect
  , RecurringRandomizedTimer = require('./RecurringRandomizedTimer')
  , ApiError = require('../../ApiError')
;


describe('#RecurringRandomizedTimer', () => {

  it('should create a valid empty timer', () => {
    const result = new RecurringRandomizedTimer();
    expect(result.toString()).to.equal('R/PT00:00:00A00:00:00');
  });

  it('should create a from a valid string', () => {
    const time = 'R/PT06:15:30A00:00:01'
      , result = new RecurringRandomizedTimer(time)
    ;
    expect(result.toString()).to.equal(time);
  });

  it('should create a valid timer from function calls', () => {
    const result = new RecurringRandomizedTimer();
    result.hours(23).minutes(59).seconds(59).reoccurs(1);
    expect(result.toString()).to.equal('R01/PT23:59:59A00:00:00');
  });

  it('should reject invalid hour value', () => {
    const result = new RecurringRandomizedTimer();

    try {
      result.hours(-1);
      expect.fail('should have errored');
    } catch (err) {
      expect(err).to.be.instanceOf(ApiError);
      expect(err.message).to.include('not within allowed limits');
    }
  });

  it('should reject invalid minute value', () => {
    const result = new RecurringRandomizedTimer();

    try {
      result.minutes(100);
      expect.fail('should have errored');
    } catch (err) {
      expect(err).to.be.instanceOf(ApiError);
      expect(err.message).to.include('not within allowed limit');
    }
  });

  it('should reject invalid second value', () => {
    const result = new RecurringRandomizedTimer();

    try {
      result.seconds(60);
      expect.fail('should have errored');
    } catch (err) {
      expect(err).to.be.instanceOf(ApiError);
      expect(err.message).to.include('not within allowed limits');
    }
  });

  it('should create from another timer', () => {
    const source = new RecurringRandomizedTimer();
    source.hours(1).minutes(30).seconds(59).randomHours(2);

    const result = new RecurringRandomizedTimer();
    result.value = source;
    expect(result.toString()).to.equal('R/PT01:30:59A02:00:00');
  });

  it('should create from a valid timer string', () => {
    const result = new RecurringRandomizedTimer()
      , value = 'R50/PT12:01:01A10:01:59'
    ;
    result.value = value;
    expect(result.toString()).to.equal(value);
  });
});