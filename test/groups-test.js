"use strict";

var HueApi = require("../hue-api"),
    ApiError = require("../hue-api/errors").ApiError,
    testValues = require("./support/testValues.js"),
    lightState = require("../").lightState,
    expect = require("chai").expect,
    Q = require("q");


describe("Hue API", function () {

    // Set a maximum timeout for all the tests
    this.timeout(5000);

    var hue = new HueApi(testValues.host, testValues.username);

    describe("group tests", function () {

        describe("#groups", function () {

            function validateAllGroups(results) {
                expect(results).to.be.instanceOf(Array);
                expect(results).to.have.length.greaterThan(0);

                // The first result should always be that of the all lights group
                expect(results[0].id).to.equal("0");
                expect(results[0].name).to.equal("All Lights");
            }

            it("using #promise should retrieve all groups", function (finished) {
                function validateResults(results) {
                    validateAllGroups(results);
                    finished();
                }

                hue.groups().then(validateResults).done();
            });

            it("using #callback should retrieve all groups", function (finished) {
                hue.groups(function (err, results) {
                    expect(err).to.be.null;
                    validateAllGroups(results);
                    finished();
                });
            });
        });


        describe("#getGroup", function () {

            function validateAllLightsResult(groupDetails) {
                expect(groupDetails).to.have.property("id").to.equal("0");
                expect(groupDetails).to.have.property("name").to.equal("All Lights");
                expect(groupDetails).to.have.property("lastAction");

                expect(groupDetails).to.have.property("lights").to.be.instanceOf(Array);
                expect(groupDetails.lights).to.have.length(testValues.lightsCount);
            }

            function failTest() {
                expect.fail("Should not be called");
            }

            describe("using #promise", function () {

                it("should obtain 'All Lights' group details", function (finished) {
                    function validate(results) {
                        validateAllLightsResult(results);
                        finished();
                    }

                    hue.getGroup(0).then(validate).done();
                });

                it("should fail for a group id that does not exist", function (finished) {
                    function checkError(err) {
                        expect(err).to.have.property("type").to.equal(3);
                        expect(err).to.have.property("message").to.contain("resource");
                        expect(err).to.have.property("message").to.contain("not available");
                        finished();
                    }

                    hue.getGroup(16).then(failTest).fail(checkError).done();
                });

                it("should fail for group Id 999", function (finished) {
                    function validateError(err) {
                        expect(err).to.be.instanceOf(ApiError);
                        expect(err.message).to.contain("group id '999' is not valid");

                        finished();
                    }

                    hue.getGroup(999).then(failTest).fail(validateError).done();
                });
            });

            describe("using #callback", function () {

                it("should obtain 'All Lights' group details", function (finished) {
                    hue.getGroup(0, function (err, results) {
                        expect(err).to.be.null;
                        validateAllLightsResult(results);
                        finished();
                    });
                });

                it("should fail for a group id that does not exist", function (finished) {
                    hue.getGroup(16, function (err, result) {
                        expect(result).to.be.null;

                        expect(err).to.have.property("type").to.equal(3);
                        expect(err).to.have.property("message").to.contain("resource");
                        expect(err).to.have.property("message").to.contain("not available");

                        finished();
                    });
                });

                it("should fail for group Id 999", function (finished) {
                    hue.getGroup(999, function (err, result) {
                        expect(result).to.be.null;

                        expect(err).to.be.instanceOf(ApiError);
                        expect(err.message).to.contain("group id '999' is not valid");

                        finished();
                    });
                });
            });
        });

        describe("#createGroup #deleteGroup", function () {

            describe("should create a group and then delete it", function () {

                var groupName = "NodejsApiTest",
                    createdGroupId;

                function validateMissingGroup(err) {
                    expect(err.message).to.contain("resource, /groups/" + createdGroupId);
                    expect(err.message).to.contain("not available");
                }

                it("using #promise", function (done) {

                    function checkResults(result) {
                        expect(result).to.have.property("id");
                        createdGroupId = result.id;
                        return createdGroupId;
                    }

                    function loadGroupDetails(id) {
                        return hue.getGroup(id);
                    }

                    function validateCreatedGroup(group) {
                        expect(group).to.have.property("id").to.equal(createdGroupId);

                        // if a duplicate is found a " x" will be appended hence why this check is not equals
                        expect(group).to.have.property("name").to.have.string(groupName);

                        expect(group).to.have.property("lights").to.be.instanceOf(Array);
                        //TODO these do not always populate correctly due to bug int he bridge
//                        expect(group.lights).to.contain("1", "2", "3");
                    }

                    function deleteGroup() {
                        return hue.deleteGroup(createdGroupId);
                    }

                    function validateDeletion() {
                        return hue.getGroup(createdGroupId)
                            .then(function () {
                                      expect.fail("Should not be called");
                                  })
                            .fail(function (err) {
                                      validateMissingGroup(err);
                                  });
                    }

                    function complete() {
                        done();
                    }

                    // A Round Robin trip through creating a group, validating it and then deleting it and checking for
                    // removal. This covers create and delete API functions.
                    hue.createGroup(groupName, ["1", "2", "3"])
                        .then(_waitForBridge)
                        .then(checkResults)
                        .then(loadGroupDetails)
                        .then(validateCreatedGroup)
                        .then(deleteGroup)
                        .then(_waitForBridge)
                        .then(validateDeletion)
                        .then(complete)
                        .done();
                });

                it("using #callback", function (done) {
                    hue.createGroup(groupName, ["1", "2", "3"], function (err, result) {
                        expect(err).to.be.null;
                        createdGroupId = result.id;

                        setTimeout(function () {
                            hue.deleteGroup(createdGroupId, function (err, result) {
                                expect(err).to.be.null;
                                expect(result).to.be.true;

                                setTimeout(function () {
                                    hue.getGroup(createdGroupId, function (err, res) {
                                        validateMissingGroup(err);
                                        expect(res).to.be.null;
                                        done();
                                    });
                                }, 1500);
                            });
                        }, 1500);
                    });
                });
            });
        });


        //TODO these have been disabled due to quirks in the bridge in the way that groups are created and updated there after...
        describe("#updateGroup", function () {

//            var origName = "UpdateTests",
//                origLights = ["1", "2"],
//                groupId;
//
//            // Create a group to test on
//            beforeEach(function (finished) {
//
//                hue.createGroup(origName, origLights)
//                    .then(function (result) {
//                              groupId = result.id;
//                              finished();
//                          })
//                    .done();
//            });
//
//            // Remove the created group after each test
//            afterEach(function (finished) {
//
//                hue.deleteGroup(groupId)
//                    .then(function () {
//                              finished();
//                          })
//                    .done();
//            });
//
//            function getGroup() {
//                return hue.getGroup(groupId);
//            }
//
//
//            describe("using #promise", function () {
//
//                it("should update only the name of a group", function (finished) {
//                    function validateRename(details) {
//                        // Name changed
//                        expect(details.name).to.have.string("promiseRename");
//                        // Lights Unchanged
//                        expect(details.lights).to.have.length(2);
//                        expect(details.lights).to.contain("1", "2");
//                    }
//
//                    hue.updateGroup(groupId, "promiseRename")
//                        .then(_waitForBridge)
//                        .then(getGroup)
//                        .then(validateRename)
//                        .then(finished)
//                        .done();
//                });
//
//                it("should update only the lights in a group", function (finished) {
//                    function validateLightsChange(details) {
//                        // Name unchanged
//                        expect(details.name).to.have.string(origName);
//                        // Lights changed
//                        expect(details.lights).to.have.length(2);
//                        expect(details.lights).to.contain("1", "4");
//                    }
//
//                    hue.updateGroup(groupId, ["1", "4"])
//                        .then(_waitForBridge)
//                        .then(getGroup)
//                        .then(validateLightsChange)
//                        .then(finished)
//                        .done();
//                });
//
//                it("should update name and lights in a group", function (finished) {
//                    function validateUpdate(details) {
//                        expect(details.name).to.have.string("pSecondRename");
//
//                        expect(details.lights).to.have.length(2);
//                        expect(details.lights).to.contain("4", "5");
//                    }
//
//                    hue.updateGroup(groupId, "pSecondRename", ["4", "5"])
//                        .then(_waitForBridge)
//                        .then(getGroup)
//                        .then(validateUpdate)
//                        .then(finished)
//                        .done();
//                });
//            });
//
//
//            describe("using #callback", function () {
//                //TODO duplicate above tests
//
//                it("should update only the name of a group", function (finished) {
//                    function validateRename(details) {
//                        // Name changed
//                        expect(details.name).to.have.string("promiseRename");
//                        // Lights Unchanged
//                        expect(details.lights).to.have.length(2);
//                        expect(details.lights).to.contain("1", "2");
//                    }
//
//                    hue.updateGroup(groupId, "promiseRename", function (err, result) {
//                        expect(err).to.be.null;
//
//                        setTimeout(function () {
//                            hue.getGroup(groupId, function (err, group) {
//                                expect(err).to.be.null;
//                                console.log(JSON.stringify(group, null, 2));
//                                validateRename(group);
//                                finished();
//                            });
//                        }, 2000);
//                    });
//                });
//            });
        });

        describe("#setGroupLightState", function () {

            it("using #promise", function (finished) {
                hue.setGroupLightState(0, lightState.create().off())
                    .then(function (result) {
                              expect(result).to.be.true;
                              finished();
                          })
                    .done();
            });

            it("using #callback", function (finished) {
                hue.setGroupLightState(0, lightState.create().off(), function(err, result) {
                    expect(err).to.be.null;
                    expect(result).to.be.true;
                    finished();
                });
            });
        });

// TODO include these tests
//
//    describe("#updateGroup", function () {
//
//        it("should fail on invalid group", function (finished) {
//            var failIfCalled = function () {
//                    expect.fail("The function call should have produced an error for invalid group id");
//                    finished();
//                },
//
//                checkError = function (err) {
//                    expect(err.type).to.equal(3);
//                    expect(err.message).to.contain("resource,");
//                    expect(err.message).to.contain("not available");
//                    finished();
//                };
//
//            hue.updateGroup(99, "a name")
//                .then(_waitForBridge)
//                .then(failIfCalled)
//                .fail(checkError)
//                .done();
//        });
//    });

    });
});

// We have to wait for the Bridge to actually process the changes, so this function helps slow the tests.
function _waitForBridge(id) {
    var deferred = Q.defer();

    setTimeout(function () {
                   deferred.resolve(id);
               },
               1500);

    return deferred.promise;
}
