'use strict';

const expect = require('chai').expect
  , BooleanType = require('./BooleanType')
;

describe('BooleanType', () => {


  it('should have a type of boolean', () => {
    const name = 'My Boolean Type'
      , type = new BooleanType({name: name});

    expect(type.name).to.equal(name);
    expect(type.type).to.equal('boolean');
  });


  describe('no default value', () => {

    const type = new BooleanType({name: 'mytype'});

    it('should return a value for true', () => {
      expect(type.getValue(true)).to.be.true;
    });

    it('should return a value for false', () => {
      expect(type.getValue(false)).to.be.false;
    });

    it('should convert null', () => {
      expect(type.getValue(null)).to.equal(null);
    });

    it('should convert undefined', () => {
      expect(type.getValue(undefined)).to.equal(undefined);
    });
  });


  describe('with default value of false', () => {

    const type = new BooleanType({name: 'mytype', defaultValue: false});

    it('should return a value for true', () => {
      expect(type.getValue(true)).to.be.true;
    });

    it('should return a value for false', () => {
      expect(type.getValue(false)).to.be.false;
    });

    it('should convert null', () => {
      expect(type.getValue(null)).to.equal(false);
    });

    it('should convert undefined', () => {
      expect(type.getValue(undefined)).to.equal(false);
    });
  });


  describe('with default value of true', () => {

    const type = new BooleanType({name: 'mytype', defaultValue: true});

    it('should return a value for true', () => {
      expect(type.getValue(true)).to.be.true;
    });

    it('should return a value for false', () => {
      expect(type.getValue(false)).to.be.false;
    });

    it('should convert null', () => {
      expect(type.getValue(null)).to.equal(true);
    });

    it('should convert undefined', () => {
      expect(type.getValue(undefined)).to.equal(true);
    });
  });

});