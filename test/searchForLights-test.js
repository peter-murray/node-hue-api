'use strict';

const expect = require('chai').expect
  , HueApi = require('..').api
  , testValues = require('./support/testValues.js')
;

describe('Hue API', function () {

  const hue = new HueApi(testValues.host, testValues.username);

  describe('#searchForLights', function () {

    describe('#promise', function () {

      it('should get initiate a search', function (done) {

        function checkResults(results) {
          _validateLightsResult(results, done);
        }

        hue.searchForNewLights().then(checkResults).done();
      });
    });


    describe('#callback', function () {

      it('should initiate a search', function (done) {

        hue.searchForNewLights(function (err, results) {
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