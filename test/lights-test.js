"use strict";

var expect = require("chai").expect,
    HueApi = require("../hue-api"),
    testValues = require("./support/testValues.js");

describe("Hue API", function () {

    describe("#lights", function () {

        describe("#promise", function() {

            it("should find some", function (done) {
                var hue = new HueApi(testValues.host, testValues.username);

                function checkResults(results) {
                    _validateLightsResult(results, done);
                }

                hue.lights().then(checkResults).done();
            });
        });

        describe("#callback", function () {

            it("should find some lights", function (done) {
                var hue = new HueApi(testValues.host, testValues.username);

                hue.lights(function (err, results) {
                    if (err) {
                        throw err;
                    }

                    _validateLightsResult(results, done);
                });
            });
        });
    });
});

function _validateLightsResult(results, cb) {
    expect(results).to.exist;
    expect(results).to.have.property("lights");
    expect(results.lights).to.have.length(testValues.lightsCount);

    //TODO do this for all the lights
    _validateLight(results.lights[0]);

    cb();
}

function _validateLight(light) {
    expect(light).to.have.keys("id", "name");
}