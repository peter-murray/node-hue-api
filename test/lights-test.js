"use strict";

var expect = require("chai").expect
    , HueApi = require("../").api
    , testValues = require("./support/testValues.js")
    ;

describe("Hue API", function () {

    var hue = new HueApi(testValues.host, testValues.username);

    describe("#lights()", function () {

        describe("#promise", function () {

            it("should find some", function (done) {
                hue.lights().then(_validateLightsResult(done)).done();
            });
        });

        describe("#callback", function () {

            it("should find some lights", function (done) {
                hue.lights(function (err, results) {
                    expect(err).to.be.null;
                    _validateLightsResult(done)(results);
                });
            });
        });
    });

    describe("#getLights()", function () {

        describe("#promise", function () {

            it("should find some", function (done) {
                hue.lights().then(_validateLightsResult(done)).done();
            });
        });

        describe("#callback", function () {

            it("should find some lights", function (done) {
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
        expect(results).to.be.defined;

        expect(results).to.have.property("lights");
        expect(results.lights).to.have.length(testValues.lightsCount);

        //TODO do this for all the lights
        _validateLight(results.lights[0]);

        cb();
    };
}

function _validateLight(light) {
    expect(light).to.have.keys("id", "name", "modelid", "type", "swversion", "uniqueid", "manufacturername", "state");
}