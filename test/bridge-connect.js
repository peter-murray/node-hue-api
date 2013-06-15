var api = require("../index.js"),
    testValues = require("./support/testValues.js"),
    expect = require("chai").expect;


describe("Hue API", function () {
    describe("#connect", function () {

        it("successful", function (done) {
            var hue = new api.HueApi(testValues.host, testValues.username),
                checkResults;

            checkResults = function (results) {
                expect(results).to.exist;
                expect(results).to.have.property("ipaddress").that.equals(testValues.host);
                expect(results).to.have.property("name").that.equals("Philips hue");
                done();
            };

            hue.connect().then(checkResults).done();
        });

        it("should fail gracefully", function (done) {
            var hue = new api.HueApi("127.0.0.1", "invalid"),
                failureCheck;

            failureCheck = function (err) {
                expect(err.message).to.contain("Unexpected response status");
                done();
            };

            hue.connect().fail(failureCheck).done();
        });
    });
});