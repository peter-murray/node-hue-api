"use strict";

var expect = require("chai").expect
    , HueApi = require("..").HueApi
    , lightState = require("..").lightState
    , testValues = require("./support/testValues.js")
    ;

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

        describe("set brightness increment", function() {

            beforeEach(function(done) {
                var initialState = lightState.create().on().brightness(50);
                hue.setLightState(lightId, initialState)
                    .then(function(result) {
                        expect(result).to.be.true;
                        done();
                    })
                    .done();
            });

            function test(value, expected, done) {
                var initialBrightness;

                // expected is optional
                if (expected instanceof Function) {
                    done = expected;
                    expected = null;
                }

                state.bri_inc(value);

                hue.getLightStatus(lightId)
                    .then(function(initial) {
                        initialBrightness = initial.state.bri;
                        return hue.setLightState(lightId, state);
                    })
                    .then(function(result) {
                        expect(result).to.be.true;
                        return hue.getLightStatus(lightId);
                    })
                    .then(function(result) {
                        if (expected === null) {
                            expected = initialBrightness + value;
                        }
                        expect(result.state.bri).to.equal(expected);
                        done();
                    })
                    .done();
            }

            it("should increment by 1", function(done) {
                test(1, done);
            });

            it("should decrement by 20", function(done) {
                test(-20, done);
            });

            it("should decrement by 254", function(done) {
                test(-254, 0, done);
            });

            it("should increment by 500", function(done) {
                test(500, 254, done);
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

        describe("set hsb(0, 100, 100)", function() {

            it("using #promise", function(done) {
                state.on().hsb(0, 100, 100);
                hue.setLightState(lightId, state)
                    .then(function(result) {
                        expect(result).to.be.true;
                        return hue.getLightStatus(lightId);
                    })
                    .then(function(light) {
                        var state;

                        expect(light).to.have.property("state");
                        state = light.state;

                        expect(state).to.have.property("hue", 0);
                        expect(state).to.have.property("sat", 254);
                        expect(state).to.have.property("bri", 254);
                        done();
                    })
                    .done();
            });
        });

        describe("set hsl(0, 100, 100)", function() {

            it("using #promise", function(done) {
                state.on().hsl(0, 100, 100);
                hue.setLightState(lightId, state)
                    .then(function(result) {
                        expect(result).to.be.true;
                        return hue.getLightStatus(lightId);
                    })
                    .then(function(light) {
                        validateHSBState(0, 0, 254)(light);
                        done();
                    })
                    .done();
            });
        });

        describe("set hsl(0, 100, 50)", function() {

            it("using #promise", function(done) {
                state.on().hsl(0, 100, 50);
                hue.setLightState(lightId, state)
                    .then(function(result) {
                        expect(result).to.be.true;
                        return hue.getLightStatus(lightId);
                    })
                    .then(function(light) {
                        validateHSBState(0, 254, 254)(light);
                        done();
                    })
                    .done();
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

            beforeEach(function(done) {
                hue.setLightState(lightId, {on:true})
                    .then(function() {
                        done();
                    })
                    .done();
            });

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
        describe("using an invalid light id", function() {

            it("should fail with appropriate message", function(done) {
                var state = lightState.create().on().rgb(100, 100, 100);

                hue.setLightState(0, state)
                    .then(function() {
                        throw new Error("should not be called");
                    }, function(err) {
                        expect(err.message).to.contain("light id");
                        expect(err.message).to.contain("is not valid");
                        done();
                    })
                    .done();
            });
        });
    });

    function validateHSBState(hue, sat, bri) {
        return function(light) {
            var state;

            expect(light).to.have.property("state");
            state = light.state;

            expect(state).to.have.property("hue", hue);
            expect(state).to.have.property("sat", sat);
            expect(state).to.have.property("bri", bri);
        }
    }
});