'use strict';

const expect = require('chai').expect
    , HueApi = require('.')
    , lightState = require('./lightState')
    , testValues = require('../test/support/testValues.js') //TODO move these
;

describe('Hue API #lights', () => {

  const hue = new HueApi(testValues.host, testValues.username);


  describe('#getAll()', () => {

    it('should find some', async () => {
      const results = await hue.lights.getAll();

      expect(results).to.have.property('lights');
      expect(results.lights).to.have.length(testValues.lightsCount);

      let light = results.lights[0];
      expect(light).to.have
          .keys('id', 'name', 'modelid', 'type', 'swversion', 'swupdate', 'uniqueid', 'manufacturername',
                'state', 'capabilities', 'config', 'productname');
    });
  });


  describe('#getNew()', () => {

    it('should find some', async () => {
      const result = await hue.lights.getNew();
      expect(result).to.have.property('lastscan');
    });
  });


  describe('#searchForNew()', () => {

    it('should peform a search', async () => {
      const result = await hue.lights.searchForNew();
      expect(result).to.be.true;
    });
  });


  describe('#getLightState()', () => {

    it('should return a light state for id=1', async () => {
      const result = await hue.lights.getLightState(1);

      expect(result).to.have.property('id', 1);

      expect(result).to.have.property('state');
      expect(result.state).to.have.property('on');
      expect(result.state).to.have.property('bri');
      expect(result.state).to.have.property('hue');
      expect(result.state).to.have.property('sat');
      expect(result.state).to.have.property('effect');
      expect(result.state).to.have.property('xy');
      expect(result.state).to.have.property('alert');
      expect(result.state).to.have.property('colormode');
      expect(result.state).to.have.property('mode');
      expect(result.state).to.have.property('reachable');

      expect(result).to.have.property('swupdate');
      expect(result.swupdate).to.have.property('state');
      expect(result.swupdate).to.have.property('lastinstall');

      expect(result).to.have.property('type');
      expect(result).to.have.property('name');
      expect(result).to.have.property('modelid');
      expect(result).to.have.property('manufacturername');
      expect(result).to.have.property('productname');

      expect(result).to.have.property('capabilities');
      expect(result.capabilities).to.have.property('certified');
      expect(result.capabilities).to.have.property('control');
      expect(result.capabilities).to.have.property('streaming');

      expect(result).to.have.property('config');
      expect(result.config).to.have.property('archetype');
      expect(result.config).to.have.property('function');
      expect(result.config).to.have.property('direction');

      expect(result).to.have.property('uniqueid');
      expect(result).to.have.property('swversion');
    });
  });


  describe('#rename()', () => {

    it('should rename a light', async () => {
      const id = 1
          , newName = 'Living Colour Floor'
          , result = await hue.lights.rename(id, newName)
          , actual = await hue.lights.getLightState(id);

      expect(result).to.be.true;

      expect(actual).to.have.property('id', id);
      expect(actual).to.have.property('name', newName);
    });
  });


  describe('#setLightState()', () => {

    it('should set a light to a state', async () => {
      const id = 1
          , state = lightState.create().on()
          , result = await hue.lights.setLightState(id, state);

      expect(result).to.be.true;
    });
  });
});