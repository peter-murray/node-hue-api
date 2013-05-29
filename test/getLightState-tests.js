"use strict";

var expect = require("chai").expect,
    HueApi = require("../hue-api"),
    testValues = require("./support/testValues.js");

describe("Hue API", function () {

    describe("#lightStatus", function () {


        describe("#promise", function() {

            it("should get status of light", function (done) {
                var hue = new HueApi(testValues.host, testValues.username);

                function checkResults(results) {
                    _validateLightsResult(results, done);
                }

                hue.lightStatus(1).then(checkResults).done();
            });
        });


        describe("#callback", function () {

            it("should get status of light", function (done) {
                var hue = new HueApi(testValues.host, testValues.username);

                hue.lightStatus(1, function (err, results) {
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
    expect(results).to.have.property("type");
    expect(results).to.have.property("name");
    expect(results).to.have.property("modelid");
    expect(results).to.have.property("swversion");
    expect(results).to.have.property("pointsymbol");

    expect(results).to.have.property("state");
    expect(results.state).to.have.property("on");
    expect(results.state).to.have.property("bri");
    expect(results.state).to.have.property("hue");
    expect(results.state).to.have.property("sat");
    expect(results.state).to.have.property("xy");
    expect(results.state).to.have.property("alert");
    expect(results.state).to.have.property("effect");
    expect(results.state).to.have.property("colormode");
    expect(results.state).to.have.property("reachable");

    cb();
}