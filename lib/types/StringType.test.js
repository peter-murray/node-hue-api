'use strict';

const expect = require('chai').expect
  , StringType = require('./StringType')
;

describe('StringType', () => {

  it('should create one with a name and type', () => {
    const name = 'myType'
      , type = 'custom'
      , result = new StringType({name: name, type: type})
    ;

    expect(result).to.have.property('name').to.equal(name);
    expect(result).to.have.property('type').to.equal(type);
    expect(result).to.have.property('optional').to.be.true;
    expect(result).to.have.property('defaultValue').to.be.null;
  });

  it('should create one with a name, type and defaultValue', () => {
    const name = 'myType'
      , type = 'custom'
      , defaultValue = 'hello'
      , result = new StringType({name: name, type: type, defaultValue: defaultValue})
    ;

    expect(result).to.have.property('name').to.equal(name);
    expect(result).to.have.property('type').to.equal(type);
    expect(result).to.have.property('optional').to.be.true;
    expect(result).to.have.property('defaultValue').to.equal(defaultValue);
  });

  it('should create one with a name, type and optional', () => {
    const name = 'myType'
      , type = 'custom'
      , optional = false
      , result = new StringType({name: name, type: type, optional: optional})
    ;

    expect(result).to.have.property('name').to.equal(name);
    expect(result).to.have.property('type').to.equal(type);
    expect(result).to.have.property('optional').to.equal(optional);
    expect(result).to.have.property('defaultValue').to.be.null;
  });


  it('should create one with a name, type, optional and defaultValue', () => {
    const name = 'myType'
      , type = 'custom'
      , defaultValue = 'hello'
      , optional = false
      , result = new StringType({name: name, type: type, defaultValue: defaultValue, optional: optional})
    ;

    expect(result).to.have.property('name').to.equal(name);
    expect(result).to.have.property('type').to.equal(type);
    expect(result).to.have.property('optional').to.equal(optional);
    expect(result).to.have.property('defaultValue').to.equal(defaultValue);
  });

  it('should create one with a min length value', () => {
    const name = 'myType'
      , type = 'custom'
      , min = 1
      , result = new StringType({name: name, type: type, min: min})
    ;

    expect(result).to.have.property('name').to.equal(name);
    expect(result).to.have.property('type').to.equal(type);
    expect(result).to.have.property('minLength').to.equal(min);
    expect(result).to.have.property('maxLength').to.equal(null);
  });

  it('should create one with a max length value', () => {
    const name = 'myType'
      , type = 'custom'
      , max = 100
      , result = new StringType({name: name, type: type, max: max})
    ;

    expect(result).to.have.property('name').to.equal(name);
    expect(result).to.have.property('type').to.equal(type);
    expect(result).to.have.property('minLength').to.equal(null);
    expect(result).to.have.property('maxLength').to.equal(max);
  });

  it('should create one with a min and max length value', () => {
    const name = 'myType'
      , type = 'custom'
      , min = 10
      , max = 100
      , result = new StringType({name: name, type: type, min: min, max: max})
    ;

    expect(result).to.have.property('name').to.equal(name);
    expect(result).to.have.property('type').to.equal(type);
    expect(result).to.have.property('minLength').to.equal(min);
    expect(result).to.have.property('maxLength').to.equal(max);
  });


  describe('#getValue()', () => {

    function testFailure(type, val, errMessageContent) {
      try {
        type.getValue(val);
        expect.fail('Should not get here');
      } catch(err) {
        expect(err.message).to.contain(errMessageContent)
      }
    }

    describe('with type of no default and is optional', () => {

      const type = new StringType({name: 'custom', type: 'custom', optional: true});

      it('should return a value for 0', () => {
        expect(type.getValue(0)).to.equal('0');
      });

      it('should return a value for 1', () => {
        expect(type.getValue(1)).to.equal('1');
      });

      it('should return a value for "hello"', () => {
        expect(type.getValue('hello')).to.equal('hello');
      });

      it('should return a value for null', () => {
        expect(type.getValue(null)).to.equal(null);
      });

      it('should return a value for undefined', () => {
        expect(type.getValue(undefined)).to.equal(null);
      });

      it('should return a value for object', () => {
        const obj = {name: 'object', value: 'testing'};
        expect(type.getValue(obj)).to.equal(`${obj}`);
      });
    });


    describe('with type with a default and is optional', () => {

      const DEFAULT_VALUE = 'my-default-value';

      const type = new StringType({name: 'custom', type: 'custom', optional: true, defaultValue: DEFAULT_VALUE});

      it('should return a value for 0', () => {
        expect(type.getValue(0)).to.equal('0');
      });

      it('should return a value for 1', () => {
        expect(type.getValue(1)).to.equal('1');
      });

      it('should return a value for "hello"', () => {
        expect(type.getValue('hello')).to.equal('hello');
      });

      it('should return a value for null', () => {
        expect(type.getValue(null)).to.equal(DEFAULT_VALUE);
      });

      it('should return a value for undefined', () => {
        expect(type.getValue(undefined)).to.equal(DEFAULT_VALUE);
      });

      it('should return a value for object', () => {
        const obj = {name: 'object', value: 'testing'};
        expect(type.getValue(obj)).to.equal(`${obj}`);
      });
    });


    describe('with type with no default and is not optional', () => {

      const type = new StringType({name: 'custom', type: 'custom', optional: false});

      it('should return a value for 0', () => {
        expect(type.getValue(0)).to.equal('0');
      });

      it('should return a value for 1', () => {
        expect(type.getValue(1)).to.equal('1');
      });

      it('should return a value for "hello"', () => {
        expect(type.getValue('hello')).to.equal('hello');
      });

      it('should return a value for null', () => {
        testFailure(type, null, 'is not optional');
      });

      it('should return a value for undefined', () => {
        testFailure(type, undefined, 'is not optional');
      });

      it('should return a value for object', () => {
        const obj = {name: 'object', value: 'testing'};
        expect(type.getValue(obj)).to.equal(`${obj}`);
      });
    });


    describe('with type with no default and is not optional', () => {

      const DEFAULT_VALUE = 'my-default-value';

      const type = new StringType({name: 'custom', type: 'custom', optional: false, defaultValue: DEFAULT_VALUE});

      it('should return a value for 0', () => {
        expect(type.getValue(0)).to.equal('0');
      });

      it('should return a value for 1', () => {
        expect(type.getValue(1)).to.equal('1');
      });

      it('should return a value for "hello"', () => {
        expect(type.getValue('hello')).to.equal('hello');
      });

      it('should return a value for null', () => {
        expect(type.getValue(null)).to.equal(DEFAULT_VALUE);
      });

      it('should return a value for undefined', () => {
        expect(type.getValue(undefined)).to.equal(DEFAULT_VALUE);
      });

      it('should return a value for object', () => {
        const obj = {name: 'object', value: 'testing'};
        expect(type.getValue(obj)).to.equal(`${obj}`);
      });
    });


    describe('with type with min and max range values', () => {

      const MIN_LENGTH = 2
        , MAX_LENGTH = 10
        , STRING_LONGER_THAN_MAX = 'hello world this is a really long string'
        , STRING_SHORTER_THAN_MIN = 'a'
        , STRING_VALID = 'abc12'
        , NUMBER_VALID = 1000
      ;

      describe('min range only', () => {

        const type = new StringType({name: 'custom', type: 'custom', optional: true, min: MIN_LENGTH});

        it('should return a value for a valid number', () => {
          expect(type.getValue(NUMBER_VALID)).to.equal(`${NUMBER_VALID}`);
        });

        it ('should fail on a string that is too short', () => {
          testFailure(type, STRING_SHORTER_THAN_MIN, 'does not meet minimum length');
        });

        it ('should work on a long string', () => {
          expect(type.getValue(STRING_LONGER_THAN_MAX)).to.equal(STRING_LONGER_THAN_MAX);
        });

        it('should work on null', () => {
          expect(type.getValue(null)).to.be.null;
        });

        it('should work on undefined', () => {
          expect(type.getValue(undefined)).to.be.null;
        });

        it('should return a value for object', () => {
          const obj = { a: 'b', b: 1 };
          expect(type.getValue(obj)).to.equal(`${obj}`);
        });
      });


      describe('max range only', () => {

        const type = new StringType({name: 'custom', type: 'custom', optional: true, max: MAX_LENGTH});

        it('should return a value for a valid number', () => {
          expect(type.getValue(NUMBER_VALID)).to.equal(`${NUMBER_VALID}`);
        });

        it ('should fail on a string that is too long', () => {
          testFailure(type, STRING_LONGER_THAN_MAX, 'maximum length requirement');
        });

        it ('should work on a short string', () => {
          expect(type.getValue(STRING_SHORTER_THAN_MIN)).to.equal(STRING_SHORTER_THAN_MIN);
        });

        it('should fail on null', () => {
          expect(type.getValue(null)).to.equal(null);
        });

        it('should fail on undefined', () => {
          expect(type.getValue(undefined)).to.equal(null);
        });

        it('should return a value for object', () => {
          testFailure(type, { a: 'b', b: 1 }, 'maximum length requirement');
        });

      });


      describe('min and max range', () => {

        const type = new StringType({name: 'custom', type: 'custom', optional: true, min: MIN_LENGTH, max: MAX_LENGTH});


        it('should return a value for a valid number', () => {
          expect(type.getValue(NUMBER_VALID)).to.equal(`${NUMBER_VALID}`);
        });

        it('should return a value for a valid length string', () => {
          expect(type.getValue(STRING_VALID)).to.equal(STRING_VALID);
        });

        it ('should fail on a string that is too short', () => {
          testFailure(type, STRING_SHORTER_THAN_MIN, 'does not meet minimum length');
        });

        it ('should fail ona string that is too long', () => {
          testFailure(type, STRING_LONGER_THAN_MAX, 'does not meet maximum length');
        });

        it('should work on null', () => {
          expect(type.getValue(null)).to.be.null;
        });

        it('should work on undefined', () => {
          expect(type.getValue(undefined)).to.be.null;
        });

        it('should fail for object', () => {
          testFailure(type, { a: 'b', b: 1 }, 'maximum length requirement');
        });
      });

    });
  });
});