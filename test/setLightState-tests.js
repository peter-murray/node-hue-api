var expect = require("chai").expect,
    assert = require("chai").assert,
    hueApi = require("../index.js").hue,
    lightState = require("../index.js").lightState,
    testValues = require("./support/testValues.js");

describe("Hue API", function () {

    describe("#setLightState", function () {

        var hue,
            state;

        beforeEach(function () {
            hue = new hueApi.HueApi(testValues.host, testValues.username);
            state = lightState.create();
        });

        it("should turn on", function (done) {
            var checkResults = function (results) {
                expect(results).to.be.true;
                done();
            };

            state.on();
            hue.setLightState(2, state).then(checkResults).done();
        });

        it("should set alert", function (done) {
            var checkResults = function (results) {
                expect(results).to.be.true;
                done();
            };

            state.alert();
            hue.setLightState(2, state).then(checkResults).done();
        });

        it("should be able to set multiple states", function (done) {
            var checkResults = function (results) {
                expect(results).to.be.true;
                done();
            };

            state.on().white(200, 100);
            hue.setLightState(2, state).then(checkResults).done();
        });

        it("should report error on an invalid state", function (done) {
            function checkError(error) {
                // We should have a well defined error object

                expect(error.message).to.contain("invalid value");
                expect(error.message).to.contain("parameter, bri");

                expect(error.type).to.equal(7);

                expect(error.address).to.equal("/lights/2/state/bri");

                expect(error.stack).to.not.be.empty;
                done();
            }

            function failIfCalled() {
                assert.fail("Should not have been called");
            }

            hue.setLightState(2, {"bri": 10000}).then(failIfCalled).fail(checkError).done();
        });
    });
});