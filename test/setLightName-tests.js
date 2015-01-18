"use strict";

var expect = require("chai").expect
    , HueApi = require("..").api
    , testValues = require("./support/testValues.js")
    ;

describe("Hue API", function () {

    describe("#setLightName", function () {

        describe("#promise", function() {

            it("should set name", function (done) {
                var hue = new HueApi(testValues.host, testValues.username);

                function checkResults(results) {
                    _validateLightsResult(results, done);
                }

                hue.setLightName(1,"A New Name").then(checkResults).done();
            });
        });

        describe("#callback", function () {

            it("should set name", function (done) {
                var hue = new HueApi(testValues.host, testValues.username);

                hue.setLightName(1, "Living Color Floor", function (err, results) {
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