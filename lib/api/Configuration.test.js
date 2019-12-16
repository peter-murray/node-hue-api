'use strict';

const expect = require('chai').expect
  , v3Api = require('../v3').api
  , discovery = require('../v3').discovery
  , ApiError = require('../../index').ApiError
  , model = require('../model')
  , testValues = require('../../test/support/testValues.js')
;

describe('Hue API #configuration', () => {

  let hue;

  before(() => {
    return discovery.nupnpSearch()
      .then(searchResults => {
        const localApi = v3Api.createLocal(searchResults[0].ipaddress);
        return localApi.connect(testValues.username)
          .then(api => {
            hue = api;
          });
      });
  });

  describe('#getAll()', () => {

    it('should get all configuration', async () => {
      const allConfig = await hue.configuration.getAll();

      expect(allConfig).to.have.property('lights');
      expect(allConfig).to.have.property('schedules');
      expect(allConfig).to.have.property('rules');
      expect(allConfig).to.have.property('sensors');
      expect(allConfig).to.have.property('resourcelinks');
      expect(allConfig).to.have.property('config');

      validateConfigStructure(allConfig.config);
    });
  });


  describe('#getConfiguration()', () => {

    it('should get the configuration', async () => {
      const config = await hue.configuration.getConfiguration();
      expect(model.isBridgeConfigurationInstance(config)).to.be.true;
    });
  });


  describe('#updateConfiguration()', () => {

    afterEach(async () => {
      await hue.configuration.updateConfiguration({proxyport: 0});
    });

    it('should set the proxy port', async () => {
      const port = 8080
        , result = await hue.configuration.updateConfiguration({'proxyport': port})
        , config = await hue.configuration.getConfiguration()
      ;

      expect(result).to.be.true;
      expect(config).to.have.property('proxyport').to.equal(port);
    });

    it('should set the proxy port using BridgeConfiguration', async () => {
      const port = 8080
        , updatedConfig = model.createBridgeConfiguration();

      updatedConfig.proxyport = port;

      const result = await hue.configuration.updateConfiguration(updatedConfig)
        , config = await hue.configuration.getConfiguration()
      ;

      expect(result).to.be.true;
      expect(config).to.have.property('proxyport').to.equal(port);
    });

    it('should fail to press the link button on local network', async () => {
      try {
        await hue.configuration.updateConfiguration({'linkbutton': true});
        expect.fail('should not get here');
      } catch(err) {
        expect(err).to.be.instanceof(ApiError);
        expect(err.message).to.contain('not modifiable');
      }
    });
  });
});


function validateConfigStructure(config) {
  expect(config).to.have.property('name');
  expect(config).to.have.property('zigbeechannel');
  expect(config).to.have.property('bridgeid');
  expect(config).to.have.property('mac');
  expect(config).to.have.property('dhcp');
  expect(config).to.have.property('ipaddress');
  expect(config).to.have.property('netmask');
  expect(config).to.have.property('proxyaddress');
  expect(config).to.have.property('proxyport');
  expect(config).to.have.property('localtime');
  expect(config).to.have.property('swversion');
  expect(config).to.have.property('apiversion');
  expect(config).to.have.property('linkbutton');
  expect(config).to.have.property('factorynew');
  expect(config).to.have.property('whitelist');
}
