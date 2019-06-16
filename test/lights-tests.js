'use strict';

const expect = require('chai').expect
  , HueApi = require('../').api
  , testValues = require('./support/testValues.js')
;

describe('Hue API', function () {

  const hue = new HueApi(testValues.host, testValues.username);

  describe('#lights()', function () {

    describe('#promise', function () {

      it('should find some', function (done) {
        hue.lights().then(_validateLightsResult(done)).done();
      });
    });

    describe('#callback', function () {

      it('should find some lights', function (done) {
        hue.lights(function (err, results) {
          expect(err).to.be.null;
          _validateLightsResult(done)(results);
        });
      });
    });
  });

  describe('#getLights()', function () {

    describe('#promise', function () {

      it('should find some', function (done) {
        hue.lights().then(_validateLightsResult(done)).done();
      });
    });

    describe('#callback', function () {

      it('should find some lights', function (done) {
        hue.lights(function (err, results) {
          expect(err).to.be.null;
          _validateLightsResult(done)(results);
        });
      });
    });
  });
});

function _validateLightsResult(cb) {
  return function (results) {
    expect(results).to.have.property('lights');
    expect(results.lights).to.have.length.at.least(testValues.lightsCount);
    _validateLight(results.lights[0]);
    cb();
  };
}

function _validateLight(light) {
  // console.log(JSON.stringify(light, null, 2));
  expect(light).to.have.property('id');
  expect(light).to.have.property('name');
  expect(light).to.have.property('modelid');
  expect(light).to.have.property('type');
  expect(light).to.have.property('swversion');
  expect(light).to.have.property('uniqueid');
  expect(light).to.have.property('manufacturername');
  expect(light).to.have.property('state');
}