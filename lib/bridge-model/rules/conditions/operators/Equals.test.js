'use strict';

const expect = require('chai').expect
  , Equals = require('./Equals')
;

describe('RuleConditionOperator #Equals', () => {

  describe('#matches()', () => {

    it('should match Hue type', () => {
      expect(Equals.matches('eq')).to.be.true;
    });

    it('should match "equals"', () => {
      expect(Equals.matches('equals')).to.be.true;
    });

    it('should match "="', () => {
      expect(Equals.matches('=')).to.be.true;
    });

    it('should match "=="', () => {
      expect(Equals.matches('==')).to.be.true;
    });

    it('should match "==="', () => {
      expect(Equals.matches('===')).to.be.true;
    });

    it('should not match invalid values', () => {
      expect(Equals.matches('')).to.be.false;
      expect(Equals.matches('equ')).to.be.false;
      expect(Equals.matches('!=')).to.be.false;
      expect(Equals.matches('not equals')).to.be.false;
      expect(Equals.matches('not eq')).to.be.false;
    });
  });

  describe('#type()', () => {

    it('should provide correct hue condition typpe', () => {
      expect(Equals.type).to.equal('eq');
    });
  });
});