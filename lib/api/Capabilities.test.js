'use strict';

const expect = require('chai').expect
  , v3Api = require('../v3').api
  , discovery = require('../v3').discovery
  , testValues = require('../../test/support/testValues.js')
;


describe('Hue API #capabilities', () => {

  let hue;

  before(async () => {
    const searchResults = await discovery.nupnpSearch();
    expect(searchResults).to.have.length.at.least(1);

    const localApi = v3Api.createLocal(searchResults[0].ipaddress);
    hue = await localApi.connect(testValues.username);
  });


  describe('#getAll()', () => {

    it('should get all capabilities', async () => {
      const capabilities = await hue.capabilities.getAll();

      expect(capabilities).to.have.property('lights');
      expect(capabilities).to.have.property('sensors');
      expect(capabilities).to.have.property('groups');
      expect(capabilities).to.have.property('scenes');
      expect(capabilities).to.have.property('schedules');
      expect(capabilities).to.have.property('rules');
      expect(capabilities).to.have.property('resourcelinks');
      expect(capabilities).to.have.property('streaming');

      expect(capabilities.timezones).to.be.instanceOf(Array);
    });
  });
});