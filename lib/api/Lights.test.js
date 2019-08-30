'use strict';

const expect = require('chai').expect
  , HueApi = require('../v3').api
  , discovery = require('../v3').discovery
  , LightState = require('../v3').lightStates.LightState
  , testValues = require('../../test/support/testValues.js')
;

describe('Hue API #lights', () => {

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

  describe('#getAll()', () => {

    it('should find some', async () => {
      const lights = await hue.lights.getAll();
      expect(lights).to.have.length.greaterThan(20);

      let light = lights[0];
      expect(light).to.have.property('id').to.be.greaterThan(0);
      expect(light.bridgeData).to.have
        .keys('name', 'modelid', 'type', 'swversion', 'swupdate', 'uniqueid', 'manufacturername',
          'state', 'capabilities', 'config', 'productname');
    });
  });


  describe('#getLightById()', () => {

    it('should get light with id === 1', async () => {
      const result = await hue.lights.getLightById(1);
      expect(result).to.have.property('id').to.equal(1);
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


  describe('#getLightAttributesAndState()', () => {

    it('should return a light state for id=1', async () => {
      const result = await hue.lights.getLightAttributesAndState(1);

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


  describe('#getLightState()', () => {

    it('should return a light state for id=1', async () => {
      const result = await hue.lights.getLightState(1);

      expect(result).to.have.property('on');
      expect(result).to.have.property('bri');
      expect(result).to.have.property('hue');
      expect(result).to.have.property('sat');
      expect(result).to.have.property('effect');
      expect(result).to.have.property('xy');
      expect(result).to.have.property('alert');
      expect(result).to.have.property('colormode');
      expect(result).to.have.property('mode');
      expect(result).to.have.property('reachable');
    });
  });


  describe('#rename()', () => {

    it('should rename a light', async () => {
      const id = 1
        , newName = 'Living Colour Floor'
        , result = await hue.lights.rename(id, newName)
        , actual = await hue.lights.getLightAttributesAndState(id);

      expect(result).to.be.true;

      expect(actual).to.have.property('id', id);
      expect(actual).to.have.property('name', newName);
    });
  });


  describe('#setLightState()', () => {

    it('should set alert to "lselect"', async () => {
      const id = testValues.testLightId
        , state = new LightState().alert('lselect')
        , result = await hue.lights.setLightState(id, state)
        , finalLightState = await hue.lights.getLightState(id)
      ;

      expect(result).to.be.true;
      expect(finalLightState).to.have.property('alert').to.equal('lselect');
    });


    describe('#on', () => {

      function testOn(on) {
        return async () => {
          const id = testValues.testLightId
            , state = new LightState().on(on)
            , result = await hue.lights.setLightState(id, state)
            , finalLightState = await hue.lights.getLightState(id)
          ;

          expect(result).to.be.true;
          expect(finalLightState).to.have.property('on').to.equal(on);
        };
      }

      it('should set on to true', testOn(true));

      it('should set on to false', testOn(false));
    });


    describe('#bri', () => {

      function testBri(briVal) {
        return async () => {
          const id = testValues.testLightId
            , state = new LightState().on().bri(briVal)
            , result = await hue.lights.setLightState(id, state)
            , finalLightState = await hue.lights.getLightState(id)
          ;

          expect(result).to.be.true;
          expect(finalLightState).to.have.property('on').to.be.true;
          expect(finalLightState).to.have.property('bri').to.equal(briVal);
        };
      }

      it('should set bri to 1', testBri(1));

      it('should set bri to 254', testBri(254));

      it('should set bri to 100', testBri(100));
    });


    describe('#hue', () => {

      function testHue(val) {
        return async () => {
          const id = testValues.testLightId
            , state = new LightState().on().hue(val)
            , result = await hue.lights.setLightState(id, state)
            , finalLightState = await hue.lights.getLightState(id)
          ;

          expect(result).to.be.true;
          expect(finalLightState).to.have.property('on').to.be.true;
          expect(finalLightState).to.have.property('hue').to.equal(val);
        };
      }

      it('should set hue to 1', testHue(1));

      it('should set hue to 254', testHue(254));

      it('should set hue to 100', testHue(100));
    });


    describe('#sat', () => {

      function testSat(val) {
        return async () => {
          const id = testValues.testLightId
            , state = new LightState().on().sat(val)
            , result = await hue.lights.setLightState(id, state)
            , finalLightState = await hue.lights.getLightState(id)
          ;

          expect(result).to.be.true;
          expect(finalLightState).to.have.property('on').to.be.true;
          expect(finalLightState).to.have.property('sat').to.equal(val);
        };
      }

      it('should set sat to 1', testSat(1));

      it('should set sat to 254', testSat(254));

      it('should set sat to 100', testSat(100));
    });


    describe('#xy', () => {

      function testXY(xVal, yVal) {
        return async () => {
          const id = testValues.testLightId
            , state = new LightState().on().xy(xVal, yVal)
            , result = await hue.lights.setLightState(id, state)
            , finalLightState = await hue.lights.getLightState(id)
          ;

          expect(result).to.be.true;
          expect(finalLightState).to.have.property('on').to.be.true;
          expect(finalLightState).to.have.property('xy').to.contain(xVal, yVal);
        };
      }

      it('should set xy to 1,1', testXY(1, 1));

      it('should set xy to 0,1', testXY(0, 1));

      it('should set xy to 0,0', testXY(0, 0));

      it('should set xy to 1,0', testXY(1, 0));

      it('should set xy to 0.5,0.5', testXY(0.5, 0.5));

      it('should set xy to 0.178,0.99', testXY(0.178, 0.99));
    });


    describe('#ct', () => {

      function testCt(val) {
        return async () => {
          const id = testValues.testLightId
            , state = new LightState().on().ct(val)
            , result = await hue.lights.setLightState(id, state)
            , finalLightState = await hue.lights.getLightState(id)
          ;

          expect(result).to.be.true;
          expect(finalLightState).to.have.property('on').to.be.true;
          expect(finalLightState).to.have.property('ct').to.equal(val);
        };
      }

      it('should set ct to 153', testCt(153));

      it('should set ct to 500', testCt(500));

      it('should set ct to 200', testCt(200));

      it('should set ct to 499', testCt(499));

      //TODO do failure conditions
    });


    describe('#alert', () => {

      function testAlert(val) {
        return async () => {
          const id = testValues.testLightId
            , state = new LightState().on().alert(val)
            , result = await hue.lights.setLightState(id, state)
            , finalLightState = await hue.lights.getLightState(id)
          ;

          expect(result).to.be.true;
          expect(finalLightState).to.have.property('on').to.be.true;
          expect(finalLightState).to.have.property('alert').to.equal(val);
        };
      }

      it('should set alert to none', testAlert('none'));

      it('should set alert to select', testAlert('select'));

      it('should set alert to lselect', testAlert('lselect'));
    });


    describe('#effect', () => {

      function testEffect(val) {
        return async () => {
          const id = testValues.testLightId
            , state = new LightState().on().effect(val)
            , result = await hue.lights.setLightState(id, state)
            , finalLightState = await hue.lights.getLightState(id)
          ;

          expect(result).to.be.true;
          expect(finalLightState).to.have.property('on').to.be.true;
          expect(finalLightState).to.have.property('effect').to.equal(val);
        };
      }

      it('should set alert to none', testEffect('none'));

      it('should set alert to colorloop', testEffect('colorloop'));
    });


    //TODO can set this, but cannot query the value of it
    // describe('#transitiontime', () => {
    //
    //   function testTransitiontime(val) {
    //     return async () => {
    //       const id = testValues.testLightId
    //         , state = new LightState().on().transitiontime(val)
    //         , result = await hue.lights.setLightState(id, state)
    //         , finalLightState = await hue.lights.getLightState(id)
    //       ;
    //
    //       expect(result).to.be.true;
    //       expect(finalLightState).to.have.property('on').to.be.true;
    //       expect(finalLightState).to.have.property('transitiontime').to.equal(val);
    //     };
    //   }
    //
    //   it('should set to 0', testTransitiontime(0));
    //
    //   it('should set to 4', testTransitiontime(4));
    //
    //   it('should set to 10', testTransitiontime(10));
    //
    //   it('should set to 1000', testTransitiontime(1000));
    // });

    //TODO inc seem to be more difficult to test
    describe('#bri_inc', () => {

      function testBriInc(initialBri, incVal, expectedBri) {
        return async () => {
          const id = testValues.testLightId
            , initialState = new LightState().on().bri(initialBri)
            , incState = new LightState().transitiontime(0).bri_inc(incVal)
          ;

          const initialResult = await hue.lights.setLightState(id, initialState);
          expect(initialResult).to.be.true;

          const  result = await hue.lights.setLightState(id, incState);
          expect(result).to.be.true;


          const finalLightState = await hue.lights.getLightState(id);
          expect(finalLightState).to.have.property('on').to.be.true;
          expect(finalLightState).to.have.property('bri').to.equal(expectedBri);
        };
      }

      it('should respond to +1', testBriInc(1, 1, 2));

      it('should respond to +200', testBriInc(1, 200, 201));
    });


    //TODO complete all the property tests for a light state
  });
});