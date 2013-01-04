var expect = require("chai").expect,
    hueApi = require("../index.js").hue,
    testValues = require("./support/testValues.js");


describe("Hue API", function () {

    describe("#locateBridges", function() {

        it ("should find my bridge on the Network", function (done) {
            this.timeout(10000);

            var checkResults = function (results) {
                expect(results).to.have.length(1);
                done();
            };
            hueApi.locateBridges(testValues.locateTimeout).then(checkResults).done();
        });
    });
});