'use strict';

const expect = require('chai').expect
  , v3Api = require('../v3').v3.api
  , discovery = require('../index').discovery
  , ApiError = require('../index').ApiError
  , model = require('@peter-murray/hue-bridge-model').model
  , BridgeConfiguration = model.BridgeConfiguration
  , testValues = require('../../test/support/testValues')
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
      expect(config instanceof BridgeConfiguration).to.be.true;
    });
  });


  describe('#updateConfiguration()', () => {

    afterEach(async () => {
      await hue.configuration.updateConfiguration({touchlink: true});
    });

    it('should activate touchlink', async () => {
      const port = 8080
        , result = await hue.configuration.updateConfiguration({'touchlink': true})
        , config = await hue.configuration.getConfiguration()
      ;

      expect(result).to.be.true;
      // expect(config).to.have.property('touchlink').to.be.true;
    });

    it('should activate touchlink using BridgeConfiguration', async () => {
      const updatedConfig = new BridgeConfiguration();

      updatedConfig.touchlink = true;

      const result = await hue.configuration.updateConfiguration(updatedConfig)
        , config = await hue.configuration.getConfiguration()
      ;

      expect(result).to.be.true;
      // expect(config).to.have.property('touchlink').to.be.true;
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
