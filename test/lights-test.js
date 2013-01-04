var expect = require("chai").expect,
    hueApi = require("../index.js").hue,
    testValues = require("./support/testValues.js");

describe("Hue API", function () {

    describe("#lights", function () {

        it("should find some", function (done) {
            var hue = new hueApi.HueApi(testValues.host, testValues.username),
                checkResults;

            checkResults = function (results) {
                expect(results).to.exist;
                expect(results).to.have.property("lights");
                expect(results.lights).to.have.length(testValues.lightsCount);

                _validateLight(results.lights[0]);
                done();
            };

            hue.lights().then(checkResults).done();
        });
    });
});

function _validateLight(light) {
    expect(light).to.have.keys("id", "name");
};