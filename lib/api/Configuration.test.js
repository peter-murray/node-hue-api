'use strict';

const expect = require('chai').expect
  , HueApi = require('../v3').api
  , discovery = require('../v3').discovery
  , ApiError = require('../../index').ApiError
  , testValues = require('../../test/support/testValues.js') //TODO move these
  , GroupState = require('../bridge-model/lightstate/GroupState')
;

describe('Hue API #configuration', () => {

  let hue;

  before(() => {
    return discovery.nupnpSearch()
      .then(searchResults => {
        return HueApi.create(searchResults[0].ipaddress, testValues.username)
          .then(api => {
            hue = api;
          });
      });
  });

  describe('#get()', () => {

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


  describe('#get()', () => {

    it('should get the configuration', async () => {
      const config = await hue.configuration.get();
      validateConfigStructure(config);
    });
  });


  describe('#update()', () => {

    it('should set the proxy port', async () => {
      const result = await hue.configuration.update({'proxyport': 8080});
      expect(result).to.be.true;
    });

    it('should fail to press the link button', async () => {
      try {
        await hue.configuration.update({'linkbutton': true});
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
