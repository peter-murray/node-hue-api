'use strict';

const expect = require('chai').expect
  , ObjectType = require('./ObjectType')
  , Int8Type = require('./Int8Type')
  , StringType = require('./StringType')
;


describe('ObjectType', () => {

  describe('constructor', () => {

    it('should create a type', () => {
      const name = 'custom_object_type'
        , type = new ObjectType({name: name, types: [new Int8Type({name: 'id'})]});
      ;

      expect(type).to.have.property('name').to.equal(name);
      expect(type).to.have.property('type').to.equal('object');
    });
  });


  describe('#getValue()', () => {

    function testFailure(type, data, expectedMessage) {
      try {
        type.getValue(data);
        expect.fail('should not get here');
      } catch(err) {
        expect(err.message).to.contain(expectedMessage);
      }
    }

    describe('with no defaults', () => {

      let type;

      before(() => {
        type = new ObjectType({
          name: 'object_type_no_default',
          types: [
            new Int8Type({name: 'id'}),
            new StringType({name: 'name'})
          ]
        })
      });

      it('should process empty object', () => {
        const result = type.getValue({});

        expect(result).to.be.null;
      });

      it('should process null', () => {
        const result = type.getValue(null);
        expect(result).to.be.null;
      });

      it('should process undefined', () => {
        const result = type.getValue(undefined);
        expect(result).to.be.null;
      });

      it('should process a matching object', () => {
        const data = {id: 100, name: 'sensor'}
          , result = type.getValue(data)
        ;

        expect(result).to.deep.equal(data);
      });

      it('should process an object with extra keys', () => {
        const data = {id: 100, name: 'sensor', description: 'An extra key on the payload'}
          , result = type.getValue(data)
        ;

        expect(result).to.not.have.property('description');
        expect(result).to.deep.equal({id: data.id, name: data.name});
      });
    });


    describe('with defaults', () => {

      let type;

      before(() => {
        type = new ObjectType({
          name: 'object_type_no_default',
          types: [
            new Int8Type({name: 'id', defaultValue: 0}),
            new StringType({name: 'name'})
          ]
        })
      });

      it('should process empty object', () => {
        const result = type.getValue({});

        expect(result).to.have.property('id').to.equal(0);
        expect(result).to.not.have.property('name');
      });

      it('should process null', () => {
        const result = type.getValue(null);
        expect(result).to.be.null;
      });

      it('should process undefined', () => {
        const result = type.getValue(undefined);
        expect(result).to.be.null;
      });

      it('should process a matching object', () => {
        const data = {id: 100, name: 'sensor'}
          , result = type.getValue(data)
        ;

        expect(result).to.deep.equal(data);
      });

      it('should process an object with extra keys', () => {
        const data = {id: 100, name: 'sensor', description: 'An extra key on the payload'}
          , result = type.getValue(data)
        ;

        expect(result).to.not.have.property('description');
        expect(result).to.deep.equal({id: data.id, name: data.name});
      });
    });


    describe('with non-optional values', () => {

      let type;

      before(() => {
        type = new ObjectType({
          name: 'object_type_no_default',
          types: [
            new Int8Type({name: 'id', optional: false}),
            new StringType({name: 'name', optional: false})
          ]
        })
      });

      it('should fail empty object', () => {
        testFailure(type, {}, '\'id\' is not optional');
      });

      it('should fail on missing id', () => {
        testFailure(type, {name: 'sensor'}, '\'id\' is not optional');
      });

      it('should fail on missing name', () => {
        testFailure(type, {id: 100}, '\'name\' is not optional');
      });

      it('should fail on missing name', () => {
        testFailure(type, {id: 100}, '\'name\' is not optional');
      });

      it('should fail on missing name and id', () => {
        testFailure(type, {idValue: 100, nameValue: 'hello'}, '\'id\' is not optional');
      });

      it('should process null', () => {
        const result = type.getValue(null);
        expect(result).to.be.null;
      });

      it('should process undefined', () => {
        const result = type.getValue(undefined);
        expect(result).to.be.null;
      });

      it('should process a matching object', () => {
        const data = {id: 100, name: 'sensor'}
          , result = type.getValue(data)
        ;

        expect(result).to.deep.equal(data);
      });

      it('should process an object with extra keys', () => {
        const data = {id: 100, name: 'sensor', description: 'An extra key on the payload'}
          , result = type.getValue(data)
        ;

        expect(result).to.not.have.property('description');
        expect(result).to.deep.equal({id: data.id, name: data.name});
      });
    });


    describe('with non-optional object', () => {

      let type;

      before(() => {
        type = new ObjectType({
          name: 'object_type_no_default',
          types: [
            new Int8Type({name: 'id', optional: true}),
            new StringType({name: 'name', optional: true})
          ],
          optional: false,
        })
      });

      it('should fail empty object', () => {
        testFailure(type, {}, 'Empty object created from data provided');
      });

      it('should process with only name key', () => {
        const data = {name: 'sensor'}
          , result = type.getValue(data)
        ;
        expect(result).to.deep.equal(data);
      });

      it('should process with only id key', () => {
        const data = {id: 1}
          , result = type.getValue(data)
        ;
        expect(result).to.deep.equal(data);
      });

      it('should fail on missing name and id', () => {
        testFailure(type, {idValue: 100, nameValue: 'hello'}, 'Empty object created');
      });

      it('should process null', () => {
        testFailure(type, null, 'is not optional');
      });

      it('should process undefined', () => {
        testFailure(type, undefined, 'is not optional');
      });

      it('should process a matching object', () => {
        const data = {id: 100, name: 'sensor'}
          , result = type.getValue(data)
        ;

        expect(result).to.deep.equal(data);
      });

      it('should process an object with extra keys', () => {
        const data = {id: 100, name: 'sensor', description: 'An extra key on the payload'}
          , result = type.getValue(data)
        ;

        expect(result).to.not.have.property('description');
        expect(result).to.deep.equal({id: data.id, name: data.name});
      });
    });
  });
});