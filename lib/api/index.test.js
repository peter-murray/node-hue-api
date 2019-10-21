'use strict';

const expect = require('chai').expect
  , v3Api = require('./index')
  , discovery = require('../v3').discovery
  , testValues = require('../../test/support/testValues.js')
;

describe('Hue API #lights', () => {

  let hueLocalIpAddress;

  before(() => {
    return discovery.nupnpSearch()
      .then(searchResults => {
        hueLocalIpAddress = searchResults[0].ipaddress;
      });
  });


  describe('#createLocal()', () => {

    it('should get a local connection', async () => {
      const bootstrap = await v3Api.createLocal(hueLocalIpAddress);
      expect(bootstrap).to.not.be.null;

      const api = await bootstrap.connect(testValues.username);
      expect(api).to.not.be.null;
    });
  });

  describe('#createInsecureLocal()', () => {

    it('should get an insecure local connection', async () => {
      const bootstrap = await v3Api.createInsecureLocal(hueLocalIpAddress);
      expect(bootstrap).to.not.be.null;

      const api = await bootstrap.connect(testValues.username);
      expect(api).to.not.be.null;
    });
  });

  describe('#create()', () => {

    it('should get an insecure local connection', async () => {
      const api = await v3Api.create(hueLocalIpAddress, testValues.username);
      expect(api).to.not.be.null;
    });
  });

});