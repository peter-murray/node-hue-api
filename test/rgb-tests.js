"use strict";

var expect = require("chai").expect
    , HueApi = require("../").HueApi
    , lightState = require("../").lightState
    , testValues = require("./support/testValues.js")
    ;

describe("Hue API", function () {

    describe("#setLightState to RGB", function () {

        var hue = new HueApi(testValues.host, testValues.username);

        describe("for Hue Bulb", function () {

            var id = testValues.hueLightId;

            it("should set 255,0,0", function (done) {
                var state = lightState
                    .create()
                    .on()
                    .rgb(255, 0, 0);

                hue.setLightState(id, state)
                    .then(validateLightStateChange(id))
                    .then(validateXY(done, 0.6484, 0.3309))
                    .done();
            });

            it("should set 255,255,255", function (done) {
                var state = lightState
                    .create()
                    .on()
                    .rgb(255, 255, 255);

                hue.setLightState(id, state)
                    .then(validateLightStateChange(id))
                    .then(validateXY(done, 0.3362, 0.3604))
                    .done();
            });

            it("should set 0,0,0", function (done) {
                var state = lightState
                    .create()
                    .on()
                    .rgb(0, 0, 0);

                hue.setLightState(id, state)
                    .then(validateLightStateChange(id))
                    .then(validateXY(done, 0.167, 0.04))
                    .done();
            });
        });

        describe("for Living Color", function () {

            var id = testValues.livingColorLightId;

            it("should set 255,0,0", function (done) {
                var state = lightState
                    .create()
                    .on()
                    .rgb(255, 0, 0);

                hue.setLightState(id, state)
                    .then(validateLightStateChange(id))
                    .then(validateXY(done, 0.6484, 0.3309))
                    .done();
            });

            it("should set 255,255,255", function (done) {
                var state = lightState
                    .create()
                    .on()
                    .rgb(255, 255, 255);

                hue.setLightState(id, state)
                    .then(validateLightStateChange(id))
                    .then(validateXY(done, 0.3362, 0.3604))
                    .done();
            });

            it("should set 0,0,0", function (done) {
                var state = lightState
                    .create()
                    .on()
                    .rgb(0, 0, 0);

                hue.setLightState(id, state)
                    .then(validateLightStateChange(id))
                    .then(validateXY(done, 0.138, 0.08))
                    .done();
            });

            it("shoudl set 128,128,128", function(done) {
                var state = lightState.create().on().rgb(128,128,128);

                hue.setLightState(id, state)
                  .then(validateLightStateChange(id))
                  .then(validateXY(done, 0.3362, 0.3604))
                  .done();
            });
        });

        describe("for Lux Bulb", function () {

            var id = testValues.luxLightId;

            it("should fail when trying to set rgb", function (done) {
                var state = lightState
                    .create()
                    .on()
                    .rgb(255, 0, 0);

                hue.setLightState(id, state)
                    .then(function() {
                        throw new Error("Lux should error on rgb/xy value");
                    }).fail(function(err) {
                        expect(err.message).to.contain("xy, not available");
                        done();
                    })
                    .done();
            });
        });

        function validateLightStateChange(id) {
            return function (result) {
                expect(result).to.be.true;
                return hue.lightStatus(id);
            }
        }

        function validateXY(done, x, y) {
            return function (data) {
                var ls = data.state;
                expect(ls).to.have.property("on", true);
                expect(ls).to.have.property("xy");
                expect(ls.xy[0]).to.equal(x);
                expect(ls.xy[1]).to.equal(y);
                done();
            };
        }
    });
});