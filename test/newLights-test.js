"use strict";

var expect = require("chai").expect,
    HueApi = require("../hue-api"),
    testValues = require("./support/testValues.js");

describe("Hue API", function () {

    describe("#newLights", function () {


        describe("#promise", function() {

            it("should get new lights", function (done) {
                var hue = new HueApi(testValues.host, testValues.username);

                function checkResults(results) {
                    _validateLightsResult(results, done);
                }

                hue.newLights().then(checkResults).done();
            });
        });


        describe("#callback", function () {

            it("should get new lights", function (done) {
                var hue = new HueApi(testValues.host, testValues.username);

                hue.newLights(function (err, results) {
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
//    console.log(JSON.stringify(results));
    expect(results).to.exist;
    expect(results).to.have.property("lastscan");
    // none, active, or timestamp

    cb();
}