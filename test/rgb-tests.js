'use strict';

const expect = require('chai').expect
  , HueApi = require('../').HueApi
  , lightState = require('../').lightState
  , testValues = require('./support/testValues.js')
;

describe('Hue API', function () {


  describe('#setLightState to RGB', function () {

    const hue = new HueApi(testValues.host, testValues.username)
      , hueLightId = testValues.hueLightId
    ;

    //TODO do this for types A, B and C color gamut
    describe('for Hue Bulb', function () {

      it('should set 255,0,0', function (done) {
        const state = lightState.create()
          .on()
          .rgb(255, 0, 0);

        hue.setLightState(hueLightId, state)
          .then(validateLightStateChange(hueLightId))
          .then(validateXY(done, 0.6484, 0.3309))
          .done();
      });

      it('should set 255,255,255', function (done) {
        const state = lightState
          .create()
          .on()
          .rgb(255, 255, 255);

        hue.setLightState(hueLightId, state)
          .then(validateLightStateChange(hueLightId))
          .then(validateXY(done, 0.3362, 0.3604))
          .done();
      });

      it('should set 0,0,0', function (done) {
        const state = lightState
          .create()
          .on()
          .rgb(0, 0, 0);

        hue.setLightState(hueLightId, state)
          .then(validateLightStateChange(hueLightId))
          .then(validateXY(done, 0.1532, 0.0475))
          .done();
      });
    });


    describe('for Lux Bulb', function () {

      const id = testValues.luxLightId;

      it('should fail when trying to set rgb', function (done) {
        const state = lightState
          .create()
          .on()
          .rgb(255, 0, 0);

        hue.setLightState(id, state)
          .then(function () {
            throw new Error('Lux should error on rgb/xy value');
          }).fail(function (err) {
            expect(err.message).to.contain('Cannot set an RGB color on a light that does not support a Color Gamut');
            done();
          })
          .done();
      });
    });

    function validateLightStateChange(id) {
      return function (result) {
        expect(result).to.be.true;
        return hue.lightStatus(id);
      };
    }

    function validateXY(done, x, y) {
      return function (data) {
        const ls = data.state;
        expect(ls).to.have.property('on', true);
        expect(ls).to.have.property('xy');
        expect(ls.xy[0]).to.equal(x);
        expect(ls.xy[1]).to.equal(y);
        done();
      };
    }
  });
});