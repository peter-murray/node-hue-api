'use strict';

const expect = require('chai').expect
  , discovery = require('./index')
  , testValues = require('../../../test/support/testValues')
;

describe('discovery', () => {

  describe('#nupnpSearch()', () => {

    it('should discover a bridge', async () => {
      const results = await discovery.nupnpSearch();

      expect(results).to.be.instanceOf(Array);

      expect(results[0]).to.have.property('name');
      expect(results[0]).to.have.property('ipaddress');

      //TODO document these changes
      // expect(results[0]).to.have.property('model');
      // expect(results[0].model).to.have.property('name');
      // expect(results[0].model).to.have.property('number');
      // expect(results[0].model).to.have.property('serial');
      expect(results[0]).to.have.property('modelid');
      expect(results[0]).to.have.property('swversion');
    });
  });


  describe('#upnpSearch()', function ()  {

    this.timeout(10000);

    it('should discover a bridge', async () => {
      const results = await discovery.upnpSearch(3000);

      expect(results).to.be.instanceOf(Array);
      expect(results).to.have.length.greaterThan(0);

      expect(results[0]).to.have.property('name');
      expect(results[0]).to.have.property('ipaddress');

      expect(results[0]).to.have.property('model');
      expect(results[0].model).to.have.property('name');
      expect(results[0].model).to.have.property('number');
      expect(results[0].model).to.have.property('serial');
    });
  });


  describe('#description()', function ()  {

    this.timeout(10000);

    it('should discover a bridge', async () => {
      const bridges = await discovery.nupnpSearch();
      const result = await discovery.description(bridges[0].ipaddress);

      expect(result).to.have.property('name');
      expect(result).to.have.property('ipaddress');

      expect(result).to.have.property('model');
      expect(result.model).to.have.property('name');
      expect(result.model).to.have.property('number');
      expect(result.model).to.have.property('serial');
    });
  });
});
