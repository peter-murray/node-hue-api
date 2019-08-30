'use strict';

var expect = require('chai').expect
  , HueApi = require('..').api
  , testValues = require('./support/testValues.js')
;

describe('Hue API', function () {

  const hue = new HueApi(testValues.host, testValues.username);


  describe('#setLightName', function () {

    describe('#promise', function () {

      it('should set name', function (done) {

        function checkResults(results) {
          _validateLightsResult(results, done);
        }

        hue.setLightName(1, 'A New Name').then(checkResults).done();
      });
    });

    describe('#callback', function () {

      it('should set name', function (done) {

        hue.setLightName(1, 'TV Right', function (err, results) {
          if (err) {
            throw err;
          }

          _validateLightsResult(results, done);
        });
      });
    });
  });
});

function _validateLightsResult(result, cb) {
  expect(result).to.be.true;
  cb();
}