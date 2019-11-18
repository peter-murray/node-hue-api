'use strict';

const expect = require('chai').expect
  , Type = require('./Type')
;

describe('Type', () => {

  it('should create one with a name and type', () => {
    const name = 'myType'
      , type = 'custom'
      , result = new Type({name: name, type: type})
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
      , result = new Type({name: name, type: type, defaultValue: defaultValue})
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
      , result = new Type({name: name, type: type, optional: optional})
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
      , result = new Type({name: name, type: type, defaultValue: defaultValue, optional: optional})
    ;

    expect(result).to.have.property('name').to.equal(name);
    expect(result).to.have.property('type').to.equal(type);
    expect(result).to.have.property('optional').to.equal(optional);
    expect(result).to.have.property('defaultValue').to.equal(defaultValue);
  });


  describe('#getValue()', () => {

    describe('with type of no default and is optional', () => {

      const type = new Type({name: 'custom', type: 'custom', optional: true});

      it('should return a value for 0', () => {
        expect(type.getValue(0)).to.equal(0);
      });

      it('should return a value for 1', () => {
        expect(type.getValue(1)).to.equal(1);
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
        expect(type.getValue(obj)).to.equal(obj);
      });
    });


    describe('with type with a default and is optional', () => {

      const DEFAULT_VALUE = 'my-default-value';

      const type = new Type({name: 'custom', type: 'custom', optional: true, defaultValue: DEFAULT_VALUE});

      it('should return a value for 0', () => {
        expect(type.getValue(0)).to.equal(0);
      });

      it('should return a value for 1', () => {
        expect(type.getValue(1)).to.equal(1);
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
        expect(type.getValue(obj)).to.equal(obj);
      });
    });


    describe('with type with no default and is not optional', () => {

      const type = new Type({name: 'custom', type: 'custom', optional: false});

      it('should return a value for 0', () => {
        expect(type.getValue(0)).to.equal(0);
      });

      it('should return a value for 1', () => {
        expect(type.getValue(1)).to.equal(1);
      });

      it('should return a value for "hello"', () => {
        expect(type.getValue('hello')).to.equal('hello');
      });

      it('should return a value for null', () => {
        try {
          type.getValue(null);
          expect.fail('Should not get here');
        } catch (err) {
          expect(err.message).to.contain('is not optional');
        }
      });

      it('should return a value for undefined', () => {
        try {
          type.getValue(undefined);
          expect.fail('Should not get here');
        } catch (err) {
          expect(err.message).to.contain('is not optional');
        }
      });

      it('should return a value for object', () => {
        const obj = {name: 'object', value: 'testing'};
        expect(type.getValue(obj)).to.equal(obj);
      });
    });


    describe('with type with no default and is not optional', () => {

      const DEFAULT_VALUE = 'my-default-value';

      const type = new Type({name: 'custom', type: 'custom', optional: false, defaultValue: DEFAULT_VALUE});

      it('should return a value for 0', () => {
        expect(type.getValue(0)).to.equal(0);
      });

      it('should return a value for 1', () => {
        expect(type.getValue(1)).to.equal(1);
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
        expect(type.getValue(obj)).to.equal(obj);
      });
    });

  });
});