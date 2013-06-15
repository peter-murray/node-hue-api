"use strict";

var expect = require("chai").expect,
    assert = require("chai").assert,
    HueApi = require("../hue-api"),
    lightState = require("../").lightState,
    testValues = require("./support/testValues.js");

describe("Hue API", function () {

    describe("#setLightState", function () {

        var hue,
            state,
            lightId = testValues.testLightId;

        beforeEach(function () {
            hue = new HueApi(testValues.host, testValues.username);
            state = lightState.create();
        });


        describe("turn light on", function () {

            it("using #promise", function (done) {
                var checkResults = function (results) {
                    expect(results).to.be.true;
                    done();
                };

                state.on();
                hue.setLightState(lightId, state).then(checkResults).done();
            });

            it("using #callback", function (done) {
                state.on();
                hue.setLightState(lightId, state, function(err, result) {
                    expect(err).to.be.null;
                    expect(result).to.be.true;
                    done();
                });
            });
        });


        describe("set alert state", function() {

            it("using #promise", function (done) {
                var checkResults = function (results) {
                    expect(results).to.be.true;
                    done();
                };

                state.alert();
                hue.setLightState(lightId, state).then(checkResults).done();
            });

            it("using #callback", function (done) {
                state.alert();
                hue.setLightState(lightId, state, function(err, result) {
                    expect(err).to.be.null;
                    expect(result).to.be.true;
                    done();
                });
            });
        });


        describe("set multiple states", function() {

            it("using #promise", function (done) {
                var checkResults = function (results) {
                    expect(results).to.be.true;
                    done();
                };

                state.on().white(200, 100);
                hue.setLightState(lightId, state).then(checkResults).done();
            });

            it("using #callback", function (done) {
                state.on().brightness(50);
                hue.setLightState(lightId, state, function(err, result) {
                    expect(err).to.be.null;
                    expect(result).to.be.true;
                    done();
                });
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

        describe("turn light off", function () {

            it("using #promise", function (done) {
                var checkResults = function (results) {
                    expect(results).to.be.true;
                    done();
                };

                state.off();
                hue.setLightState(lightId, state).then(checkResults).done();
            });

            it("using #callback", function (done) {
                state.off();
                hue.setLightState(lightId, state, function(err, result) {
                    expect(err).to.be.null;
                    expect(result).to.be.true;
                    done();
                });
            });
        });    });
});