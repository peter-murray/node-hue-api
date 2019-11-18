'use strict';

const expect = require('chai').expect
  , Int8Type = require('./Int8Type')
;


const MAX_VALUE = 255
  , MIN_VALUE = -255
  , OVER_MAX_VALUE = MAX_VALUE + 1
  , UNDER_MIN_VALUE = MIN_VALUE - 1
;


describe('Int8Type', () => {

  describe('constructor', () => {

    it('should create a type', () => {
      const name = 'my_int_type'
        , type = new Int8Type({name: name})
      ;

      expect(type).to.have.property('name').to.equal(name);
      expect(type).to.have.property('type').to.equal('int8');
    });
  });


  function testFailure(type, value, message) {
    try {
      type.getValue(value);
      expect.fail('should not get here');
    } catch (err) {
      expect(err.message).to.contain(message);
    }
  }

  describe('#getValue()', () => {

    describe('optional, no default', () => {
      let intType = new Int8Type({
        name: 'int8Type',
        optional: true
      });


      it('should process 0', () => {
        expect(intType.getValue(0)).to.equal(0);
      });

      it('should process 1', () => {
        expect(intType.getValue(1)).to.equal(1);
      });

      it('should process -1', () => {
        expect(intType.getValue(-1)).to.equal(-1);
      });

      it('should process max value', () => {
        expect(intType.getValue(MAX_VALUE)).to.equal(MAX_VALUE);
      });

      it('should process -255', () => {
        expect(intType.getValue(MIN_VALUE)).to.equal(MIN_VALUE);
      });

      it('should process 1.2 as 1', () => {
        expect(intType.getValue(1.2)).to.equal(1);
      });

      it('should fail on over max value', () => {
        testFailure(intType, OVER_MAX_VALUE, 'not within allowed limits');
      });

      it('should fail on under min value', () => {
        testFailure(intType, UNDER_MIN_VALUE, 'not within allowed limits');
      });

      it('should process null', () => {
        expect(intType.getValue(null)).to.equal(null);
      });

      it('should process undefined', () => {
        expect(intType.getValue(undefined)).to.equal(null);
      });
    });
  });


  describe('not optional, no default', () => {

    let intType = new Int8Type({
      name: 'int8Type',
      optional: false
    });


    it('should process 0', () => {
      expect(intType.getValue(0)).to.equal(0);
    });

    it('should process 1', () => {
      expect(intType.getValue(1)).to.equal(1);
    });

    it('should process -1', () => {
      expect(intType.getValue(-1)).to.equal(-1);
    });

    it('should process max value', () => {
      expect(intType.getValue(MAX_VALUE)).to.equal(MAX_VALUE);
    });

    it('should process min value', () => {
      expect(intType.getValue(MIN_VALUE)).to.equal(MIN_VALUE);
    });

    it('should process 1.2 as 1', () => {
      expect(intType.getValue(1.2)).to.equal(1);
    });

    it('should fail on over max value', () => {
      testFailure(intType, OVER_MAX_VALUE, 'not within allowed limits');
    });

    it('should fail on under min value', () => {
      testFailure(intType, UNDER_MIN_VALUE, 'not within allowed limits');
    });

    it('should fail on null', () => {
      testFailure(intType, null, 'is not optional');
    });

    it('should fail on undefined', () => {
      testFailure(intType, null, 'is not optional');
    });
  });


  describe('not optional, with default', () => {

    const DEFAULT_VALUE = 10;

    let intType = new Int8Type({
      name: 'int8Type',
      optional: false,
      defaultValue: DEFAULT_VALUE
    });


    it('should process 0', () => {
      expect(intType.getValue(0)).to.equal(0);
    });

    it('should process 1', () => {
      expect(intType.getValue(1)).to.equal(1);
    });

    it('should process -1', () => {
      expect(intType.getValue(-1)).to.equal(-1);
    });

    it('should process 1.2 as 1', () => {
      expect(intType.getValue(1.2)).to.equal(1);
    });

    it('should process max value', () => {
      expect(intType.getValue(MAX_VALUE)).to.equal(MAX_VALUE);
    });

    it('should process min value', () => {
      expect(intType.getValue(MIN_VALUE)).to.equal(MIN_VALUE);
    });

    it('should fail on over max value', () => {
      testFailure(intType, OVER_MAX_VALUE, 'not within allowed limits');
    });

    it('should fail on under max value', () => {
      testFailure(intType, UNDER_MIN_VALUE, 'not within allowed limits');
    });

    it('should process null', () => {
      expect(intType.getValue(null)).to.equal(DEFAULT_VALUE);
    });

    it('should process undefined', () => {
      expect(intType.getValue(undefined)).to.equal(DEFAULT_VALUE);
    });
  });


  describe('not optional, with default and different max/min values', () => {

    const DEFAULT_VALUE = 10;

    let intType = new Int8Type({
      name: 'int8Type',
      optional: false,
      defaultValue: DEFAULT_VALUE,
      min: 10,
      max: 15
    });


    it('should fail on 0', () => {
      testFailure(intType, 0, 'not within allowed limits');
    });

    it('should process 10', () => {
      expect(intType.getValue(10)).to.equal(10);
    });

    it('should process 15', () => {
      expect(intType.getValue(15)).to.equal(15);
    });

    it('should fail on 16', () => {
      testFailure(intType, 16, 'not within allowed limits');
    });

    it('should process 10.5 as 10', () => {
      expect(intType.getValue(10.5)).to.equal(10);
    });

    it('should process null', () => {
      expect(intType.getValue(null)).to.equal(DEFAULT_VALUE);
    });

    it('should process undefined', () => {
      expect(intType.getValue(undefined)).to.equal(DEFAULT_VALUE);
    });
  });
});


