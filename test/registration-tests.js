var Hue = require("../").api
    , testValues = require("./support/testValues.js")
    , expect = require("chai").expect
    ;


describe("Hue API", function () {

    describe("#registerUser", function () {

        var hue = new Hue(testValues.host, testValues.username),
            disconnectedHue = new Hue(),
            createdUser;

        // Press the Link Button before running the tests to add the user
        beforeEach(function (finished) {
            hue.pressLinkButton(function (err, result) {
                expect(result).to.be.true;
                finished();
            });
        });

        afterEach(function (finished) {
            if (createdUser) {
                hue.deleteUser(createdUser).then(function (result) {
                    expect(result).to.be.true;
                    createdUser = null;
                    finished();
                });
            } else {
                finished();
            }
        });

        describe("should register a new user", function () {

            it("using #promise", function (finished) {
                disconnectedHue.createUser(testValues.host, "A test user account with no name")
                    .then(function (result) {
                              expect(result).to.exist;
                              createdUser = result;
                              finished();
                          })
                    .done();
            });

            it("using #callback", function (finished) {
                disconnectedHue.createUser(testValues.host,
                                           "A test user account with no name",
                                           function (err, result) {
                                               expect(result).to.exist;
                                               createdUser = result;
                                               finished();
                                           });
            });
        });

        describe("should register a user with no values provided", function () {

            it("using #promise", function (finished) {
                disconnectedHue.createUser(testValues.host)
                    .then(function (result) {
                              expect(result).to.exist;
                              createdUser = result;
                              finished();
                          })
                    .done();
            });

            it("using #callback", function(finished) {
                disconnectedHue.registerUser(testValues.host, function(err, result) {
                    expect(err).to.be.null;

                    expect(result).to.exist;
                    createdUser = result;
                    finished();
                });
            });
        });
    });
});