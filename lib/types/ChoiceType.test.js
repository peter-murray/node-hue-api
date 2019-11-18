'use strict';

const expect = require('chai').expect
  , ChoiceType = require('./ChoiceType')
;


describe('ChoiceType', () => {

  it('should fail to create a type with no choices', () => {
    try {
      new ChoiceType({name: 'type'});
    } catch(err) {
      expect(err.message).to.contain('validValues config property')
    }
  });

  function testFailure(type, val, errMessage) {
    try {
      type.getValue(val);
      expect.fail('Should not get here');
    } catch (err) {
      expect(err.message).to.contain(errMessage);
    }
  }


  describe('#getValue()', () => {

    describe('string choices, optional, no default', () => {

      let choice;

      before(() => {
        choice = new ChoiceType({
          name: 'Simple Choice',
          validValues: [
            'a',
            'b',
            'c',
          ]
        });
      });

      it('should return a valid type value', () => {
        expect(choice.getValue('a')).to.equal('a');
        expect(choice.getValue('b')).to.equal('b');
        expect(choice.getValue('c')).to.equal('c');
      });

      it('should process null', () => {
        expect(choice.getValue(null)).to.be.null;
      });

      it('should process undefined', () => {
        expect(choice.getValue(undefined)).to.be.null;
      });

      it('should fail on choice not in valid values', () => {
        testFailure(choice, 'z', 'is not one of the allowed values');
      });
    });


    describe('string choices, not optional, no default', () => {

      let choice;

      before(() => {
        choice = new ChoiceType({
          name: 'Simple Choice',
          optional: false,
          validValues: [
            'a',
            'b',
            'c',
          ]
        });
      });

      it('should return a valid type value', () => {
        expect(choice.getValue('a')).to.equal('a');
        expect(choice.getValue('b')).to.equal('b');
        expect(choice.getValue('c')).to.equal('c');
      });

      it('should fail on null', () => {
        testFailure(choice, null, 'is not optional');
      });

      it('should fail on undefined', () => {
        testFailure(choice, undefined, 'is not optional');
      });

      it('should fail on choice not in valid values', () => {
        testFailure(choice, 'z', 'is not one of the allowed values');
      });
    });


    describe('string choices, not optional, with default', () => {

      let choice;

      before(() => {
        choice = new ChoiceType({
          name: 'Simple Choice',
          optional: false,
          defaultValue: 'a',
          validValues: [
            'a',
            'b',
            'c',
          ]
        });
      });

      it('should return a valid type value', () => {
        expect(choice.getValue('a')).to.equal('a');
        expect(choice.getValue('b')).to.equal('b');
        expect(choice.getValue('c')).to.equal('c');
      });

      it('should fail on null', () => {
        expect(choice.getValue(null)).to.equal('a');
      });

      it('should fail on undefined', () => {
        expect(choice.getValue(undefined)).to.equal('a');
      });

      it('should fail on choice not in valid values', () => {
        testFailure(choice, 'z', 'is not one of the allowed values');
      });
    });


    describe('integer choices, not optional, with default', () => {

      let choice;

      before(() => {
        choice = new ChoiceType({
          name: 'Simple Choice',
          optional: false,
          defaultValue: 1,
          validValues: [
            0,
            1,
            2,
          ]
        });
      });

      it('should return a valid type value', () => {
        expect(choice.getValue(1)).to.equal(1);
        expect(choice.getValue(2)).to.equal(2);
        expect(choice.getValue(0)).to.equal(0);
      });

      it('should fail on null', () => {
        expect(choice.getValue(null)).to.equal(1);
      });

      it('should fail on undefined', () => {
        expect(choice.getValue(undefined)).to.equal(1);
      });

      it('should fail on choice not in valid values', () => {
        testFailure(choice, 'z', 'is not one of the allowed values');
      });
    });

  });
});