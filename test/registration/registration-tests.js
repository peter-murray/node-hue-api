var api = require("../../index.js").hue,
    testValues = require("../support/testValues.js"),
    expect = require("chai").expect;


describe("Hue API", function () {
    describe("#registerUser", function () {

        it("should register a new user", function (done) {
            var checkResults = function (result) {
                expect(result).to.not.be.null;
                console.log("New Registered User Name: " + result);
                done();
            };

            api.registerUser(testValues.host, testValues.username, "Node Hue Api Tests User")
                .then(checkResults)
                .done();
        });
    });
});