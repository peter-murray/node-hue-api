'use strict';

const expect = require('chai').expect
  , HueApi = require('..').HueApi
  , lightState = require('..').lightState
  , testValues = require('./support/testValues.js')
;

describe('Hue API', function () {

  describe('#setLightState', function () {

    const hue = new HueApi(testValues.host, testValues.username)
      , lightId = testValues.testLightId
    ;

    let state;

    beforeEach(function () {
      state = lightState.create(); //TODO refactor
    });


    describe('turn light on', function () {

      it('using #promise', function (done) {
        var checkResults = function (results) {
          expect(results).to.be.true;
          done();
        };

        state.on();
        hue.setLightState(lightId, state).then(checkResults).done();
      });

      it('using #callback', function (done) {
        state.on();
        hue.setLightState(lightId, state, function (err, result) {
          expect(err).to.be.null;
          expect(result).to.be.true;
          done();
        });
      });
    });


    describe('set alert state', function () {

      it('using #promise', function (done) {
        var checkResults = function (results) {
          expect(results).to.be.true;
          done();
        };

        state.alert();
        hue.setLightState(lightId, state).then(checkResults).done();
      });

      it('using #callback', function (done) {
        state.alert();
        hue.setLightState(lightId, state, function (err, result) {
          expect(err).to.be.null;
          expect(result).to.be.true;
          done();
        });
      });
    });

    describe('set brightness increment', function () {

      beforeEach(async () => {
        const initialState = lightState.create().on().bri(200);

        await hue.setLightState(lightId, initialState)
          .then(function (result) {
            expect(result).to.be.true;
          });
      });

      async function test(value, expected) {
        let initialBrightness;

        state.bri_inc(value);

        await hue.getLightStatus(lightId)
          .then(initialState => {
            initialBrightness = initialState.state.bri;
            return hue.setLightState(lightId, state);
          })
          .then(result => {
            expect(result).to.be.true;
            return hue.getLightStatus(lightId);
          })
          .then(result => {
            if (!expected) {
              expected = initialBrightness + value;
            }
            console.log(`Initial: ${initialBrightness} incremented by ${value} resulted in ${result.state.bri}`);
            expect(result.state.bri).to.equal(expected);
          });
      }

      it('should increment by 1', async () => {
        test(1);
      });

      it('should decrement by 20', async () => {
        test(-20);
      });

      it('should decrement by 254', async () => {
        test(-254, 0);
      });

      it('should increment by 500', async () => {
        test(500, 254);
      });
    });

    describe('set multiple states', function () {

      it('using #promise', function (done) {
        var checkResults = function (results) {
          expect(results).to.be.true;
          done();
        };

        state.on().white(200, 100);
        hue.setLightState(lightId, state).then(checkResults).done();
      });

      it('using #callback', function (done) {
        state.on().brightness(50);
        hue.setLightState(lightId, state, function (err, result) {
          expect(err).to.be.null;
          expect(result).to.be.true;
          done();
        });
      });
    });

    describe('set hsb(0, 100, 100)', function () {

      it('using #promise', async () => {
        const state = lightState.create().on().hsb(0, 100, 100)
          , result = await hue.setLightState(lightId, state)
          , stateResult = await hue.getLightStatus(lightId)
        ;

        expect(result).to.be.true;

        expect(stateResult.state).to.have.property('hue', 0);
        expect(stateResult.state).to.have.property('sat', 254);
        expect(stateResult.state).to.have.property('bri', 254);
      });
    });

    describe('set hsl(0, 100, 100)', function () {

      it('using #promise', async () => {
        const state = lightState.create().on().hsl(0, 100, 100)
          , result = await hue.setLightState(lightId, state)
          , stateResult = await hue.getLightStatus(lightId)
        ;

        expect(result).to.be.true;
        validateHSBState(0, 0, 254)(stateResult.state);
      });
    });

    describe('set hsl(0, 100, 50)', function () {

      it('using #promise', async () => {
        const state = lightState.create().on().hsl(0, 100, 50)
          , result = await hue.setLightState(lightId, state)
          , stateResult = await hue.getLightStatus(lightId)
        ;

        expect(result).to.be.true;
        validateHSBState(0, 254, 254)(stateResult.state);
      });

    });

    //TODO need to put this back in and cater for callbacks
    //        it("should report error on an invalid state", function (done) {
    //            function checkError(error) {
    //                // We should have a well defined error object
    //
    //                expect(error.message).to.contain("invalid value");
    //                expect(error.message).to.contain("parameter, bri");
    //
    //                expect(error.type).to.equal(7);
    //
    //                expect(error.address).to.equal("/lights/2/state/bri");
    //
    //                expect(error.stack).to.not.be.empty;
    //                done();
    //            }
    //
    //            function failIfCalled() {
    //                assert.fail("Should not have been called");
    //            }
    //
    //            hue.setLightState(2, {"bri": 10000}).then(failIfCalled).fail(checkError).done();
    //        });

    describe('turn light off', function () {

      beforeEach(function (done) {
        hue.setLightState(lightId, {on: true})
          .then(function () {
            done();
          })
          .done();
      });

      it('using #promise', function (done) {
        var checkResults = function (results) {
          expect(results).to.be.true;
          done();
        };

        state.off();
        hue.setLightState(lightId, state).then(checkResults).done();
      });

      it('using #callback', function (done) {
        state.off();
        hue.setLightState(lightId, state, function (err, result) {
          expect(err).to.be.null;
          expect(result).to.be.true;
          done();
        });
      });
    });

    //TODO turn this into a proper test that can validate the colours correctly
    //describe("with single state shared across multiple lights", function() {
    //
    //    it("should set on and xy values", function(done) {
    //        state.on().rgb(255, 0, 0);
    //
    //        hue.setLightState(4, state)
    //            .then(function(){
    //                return hue.setLightState(5, state);
    //            })
    //            .then(function() {
    //                done();
    //            })
    //            .done();
    //    });
    //});

    //TODO complete the error checking
    describe('using an invalid light id', function () {

      it('should fail with appropriate message', async () => {
        const state = lightState.create().on().bri(100);

        await hue.setLightState(0, state)
          .then(function () {
            throw new Error('should not be called');
          }).catch(err => {
            expect(err.message).to.contain('id:0');
            expect(err.message).to.contain('was not found');
          });
      });
    });
  });

  function validateHSBState(hue, sat, bri) {
    return function (state) {
      expect(state).to.have.property('hue', hue);
      expect(state).to.have.property('sat', sat);
      expect(state).to.have.property('bri', bri);
    };
  }
});