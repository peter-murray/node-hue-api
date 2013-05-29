var Hue = require("../hue-api"),
    testValues = require("./support/testValues.js"),
    expect = require("chai").expect;


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

        describe("should register a new user '1234567890'", function () {

            var newUserName = "1234567890";

            it("using #promise", function (finished) {
                disconnectedHue.registerUser(testValues.host, newUserName, "A test user account for the bridge")
                    .then(function (result) {
                              expect(result).to.equal(newUserName);
                              createdUser = result;
                              finished();
                          })
                    .done();
            });

            //TODO no deviceType
            // TODO no username

            it("using #callback", function (finished) {
                disconnectedHue.createUser(testValues.host, newUserName, "A test user account for the bridge",
                                           function (err, result) {
                                               expect(err).to.be.null;
                                               expect(result).to.equal(newUserName);
                                               createdUser = result;
                                               finished();
                                           });
            });
        });


        describe("should register a new user without a username", function () {

            it("using #promise", function (finished) {
                disconnectedHue.createUser(testValues.host, undefined, "A test user account with no name")
                    .then(function (result) {
                              expect(result).to.not.be.undefined;
                              expect(result).to.not.be.null;
//                              console.log("Created user: " + result);
                              createdUser = result;
                              finished();
                          })
                    .done();
            });

            it("using #callback", function (finished) {
                disconnectedHue.createUser(testValues.host,
                                           null,
                                           "A test user account with no name",
                                           function (err, result) {
                                               expect(result).to.not.be.undefined;
                                               expect(result).to.not.be.null;
                                               createdUser = result;
                                               finished();
                                           });
            });
        });

        describe("should register a user with no values provided", function () {

            it("using #promise", function (finished) {
                disconnectedHue.createUser(testValues.host)
                    .then(function (result) {
                              expect(result).to.not.be.null;
                              expect(result).to.not.be.undefined;
                              createdUser = result;
                              finished();
                          })
                    .done();
            });

            it("using #callback", function(finished) {
                disconnectedHue.registerUser(testValues.host, function(err, result) {
                    expect(err).to.be.null;

                    expect(result).to.not.be.null;
                    expect(result).to.not.be.undefined;

                    createdUser = result;
                    finished();
                });
            });
        });
    });
});