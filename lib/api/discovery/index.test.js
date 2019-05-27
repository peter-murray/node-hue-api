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

      expect(results[0]).to.have.property('friendlyName');
      expect(results[0]).to.have.property('ipaddress');
      expect(results[0]).to.have.property('modelName');
      expect(results[0]).to.have.property('modelNumber');
      expect(results[0]).to.have.property('serialNumber');
    });
  });


  describe('#upnpSearch()', function ()  {

    this.timeout(10000);

    it('should discover a bridge', async () => {
      const results = await discovery.upnpSearch(3000);

      expect(results).to.be.instanceOf(Array);

      expect(results[0]).to.have.property('friendlyName');
      expect(results[0]).to.have.property('ipaddress');
      expect(results[0]).to.have.property('modelName');
      expect(results[0]).to.have.property('modelNumber');
      expect(results[0]).to.have.property('serialNumber');
    });
  });


  describe('#upnpSearch()', function ()  {

    this.timeout(10000);

    it('should discover a bridge', async () => {
      const result = await discovery.description(testValues.host);

      expect(result).to.have.property('friendlyName');
      expect(result).to.have.property('ipaddress');
      expect(result).to.have.property('modelName');
      expect(result).to.have.property('modelNumber');
      expect(result).to.have.property('serialNumber');
    });
  });
});
