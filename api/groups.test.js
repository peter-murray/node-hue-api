'use strict';

const expect = require('chai').expect
    , HueApi = require('.')
    , testValues = require('../test/support/testValues.js') //TODO move these
;

describe('Hue API #lights', () => {

  const hue = new HueApi(testValues.host, testValues.username);

  describe('#getAll()', () => {

    it('should return all groups', async () => {
      const result = await hue.groups.getAll();

      expect(result).to.have.property('0');
      expect(result['0']).to.have.property('name', 'All Lights');

      expect(result['1']).to.have.property('name');
      expect(result['1']).to.have.property('lights');
      expect(result['1']).to.have.property('type');
      expect(result['1']).to.have.property('state');
      expect(result['1']).to.have.property('recycle');
      expect(result['1']).to.have.property('action');

      console.log(JSON.stringify(result, null, 2))//TODO remove
    });
  });

  describe('#createGroup()', () => {

    it('should create a new group', async () => {
      const name = 'Testing Group Creation'
          , lights = ['1', '2']//TODO does not respond well to integers here, validate, also deal with single value
          , result = await hue.groups.createGroup(name, lights)
      ;

      console.log(JSON.stringify(result, null, 2))
    })
  });

  describe('#createRoom()', () => {

    it('should create a new room', async () => {
//TODO
    })
  });
});