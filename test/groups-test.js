"use strict";

var expect = require("chai").expect
    , Q = require("q")
    , HueApi = require("../").api
    , ApiError = require("../hue-api/errors").ApiError
    , testValues = require("./support/testValues.js")
    , lightState = require("../").lightState
    ;


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
                expect(results[0]).to.have.property("id", "0");
                expect(results[0]).to.have.property("name", "Lightset 0");
                expect(results[0]).to.have.property("type", "LightGroup");

                expect(results[1]).to.have.property("id");
                expect(results[1]).to.have.property("type");
                expect(results[1]).to.have.property("name");
                expect(results[1]).to.have.property("lights");
                expect(results[1]).to.have.property("action");
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

        describe("#luminaires", function () {

            it("using #promise", function (done) {
                hue.luminaires()
                    .then(function (data) {
                        expect(data).to.be.an.instanceOf(Array);
                        expect(data).to.be.empty;
                        done();
                    })
                    .done();
            });

            it("using #callback", function (done) {
                hue.luminaires(function (err, data) {
                    expect(err).to.be.null;
                    expect(data).to.be.an.instanceOf(Array);
                    expect(data).to.be.empty;
                    done();
                });
            });
        });

        describe("#lightSources", function () {

            it("using #promise", function (done) {
                hue.lightSources()
                    .then(function (data) {
                        expect(data).to.be.an.instanceOf(Array);
                        expect(data).to.be.empty;
                        done();
                    })
                    .done();
            });

            it("using #callback", function (done) {
                hue.lightSources(function (err, data) {
                    expect(err).to.be.null;
                    expect(data).to.be.an.instanceOf(Array);
                    expect(data).to.be.empty;
                    done();
                });
            });
        });

        describe("#lightGroups", function () {

            it("using #promise", function (done) {
                hue.lightGroups()
                    .then(function (data) {
                        expect(data).to.be.an.instanceOf(Array);
                        expect(data.length).to.be.at.least(1);

                        expect(data[0]).to.have.property("id", "0");
                        expect(data[0]).to.have.property("name", "Lightset 0");
                        done();
                    })
                    .done();
            });

            it("using #callback", function (done) {
                hue.lightGroups(function (err, data) {
                    expect(err).to.be.null;

                    expect(data).to.be.an.instanceOf(Array);
                    expect(data.length).to.be.at.least(1);

                    expect(data[0]).to.have.property("id", "0");
                    expect(data[0]).to.have.property("name", "Lightset 0");
                    done();
                });
            });
        });


        describe("#getGroup", function () {

            function validateAllLightsResult(groupDetails) {
                expect(groupDetails).to.have.property("id", "0");
                expect(groupDetails).to.have.property("name", "Lightset 0");
                expect(groupDetails).to.have.property("lastAction");

                expect(groupDetails).to.have.property("lights").to.be.instanceOf(Array);
                expect(groupDetails.lights).to.have.length(testValues.lightsCount);
            }

            function failTest() {
                throw new Error("Should not be called");
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

                var groupName = "NodejsApiTest"
                    , createdGroupId
                    ;

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
                        expect(group.lights).to.contain("1", "2", "3");
                    }

                    function deleteGroup() {
                        return hue.deleteGroup(createdGroupId);
                    }

                    function validateDeletion() {
                        return hue.getGroup(createdGroupId)
                            .then(function () {
                                throw new Error("Should not be called");
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
                        .then(done)
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


        describe("#updateGroup", function () {

            var origName = "UpdateTests"
                , origLights = ["1", "2"]
                , updateName = "renamedGroupName"
                , updateLights = ["3", "4", "5"]
                , groupId
                ;

            // Create a group to test on
            beforeEach(function (finished) {

                hue.createGroup(origName, origLights)
                    .then(function (result) {
                        groupId = result.id;
                        finished();
                    })
                    .done();
            });

            // Remove the created group after each test
            afterEach(function (finished) {

                hue.deleteGroup(groupId)
                    .then(function () {
                        finished();
                    })
                    .done();
            });

            function getGroup() {
                return hue.getGroup(groupId);
            }

            function validateGroup(expectedName, expectedLights) {
                return function (details) {
                    // Name
                    expect(details).to.have.property("name", expectedName);

                    // Lights
                    expect(details.lights).to.have.length(expectedLights.length);
                    expect(details.lights).to.have.members(expectedLights);
                };
            }

            describe("using #promise", function () {

                it("should update only the name of a group", function (finished) {
                    hue.updateGroup(groupId, updateName)
                        .then(_waitForBridge)
                        .then(getGroup)
                        .then(validateGroup(updateName, origLights))
                        .then(finished)
                        .done();
                });

                it("should update only the lights in a group", function (finished) {
                    hue.updateGroup(groupId, updateLights)
                        .then(_waitForBridge)
                        .then(getGroup)
                        .then(validateGroup(origName, updateLights))
                        .then(finished)
                        .done();
                });

                it("should update name and lights in a group", function (finished) {
                    hue.updateGroup(groupId, updateName, updateLights)
                        .then(_waitForBridge)
                        .then(getGroup)
                        .then(validateGroup(updateName, updateLights))
                        .then(finished)
                        .done();
                });
            });


            describe("using #callback", function () {

                it("should update only the name of a group", function (finished) {
                    hue.updateGroup(groupId, updateName,
                        function (err, result) {
                            expect(err).to.be.null;
                            expect(result).to.be.true;

                            _waitForBridge()
                                .then(getGroup)
                                .then(validateGroup(updateName, origLights))
                                .then(finished)
                                .done();
                        });
                });

                it("should update only the lights in a group", function (finished) {
                    hue.updateGroup(groupId, updateLights,
                        function (err, result) {
                            expect(err).to.be.null;
                            expect(result).to.be.true;

                            _waitForBridge()
                                .then(getGroup)
                                .then(validateGroup(origName, updateLights))
                                .then(finished)
                                .done();
                        });
                });

                it("should update name and lights in a group", function (finished) {
                    hue.updateGroup(groupId, updateName, updateLights,
                        function (err, result) {
                            expect(err).to.be.null;
                            expect(result).to.be.true;

                            _waitForBridge()
                                .then(getGroup)
                                .then(validateGroup(updateName, updateLights))
                                .then(finished)
                                .done();
                        });
                });

                it("should update the name if the lights are null", function(finished) {
                    hue.updateGroup(groupId, updateName, null,
                        function (err, result) {
                            expect(err).to.be.null;
                            expect(result).to.be.true;

                            _waitForBridge()
                                .then(getGroup)
                                .then(validateGroup(updateName, origLights))
                                .then(finished)
                                .done();
                        });
                });
            });
        });

        //TODO these tests need better validation around the body that is generated to be sent to the bridge
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
                hue.setGroupLightState(0, lightState.create().off(), function (err, result) {
                    expect(err).to.be.null;
                    expect(result).to.be.true;
                    finished();
                });
            });
        });

        describe("#updateGroup", function () {

            it("should fail on invalid group id", function (finished) {
                var failIfCalled = function () {
                        throw new Error("The function call should have produced an error for invalid group id");
                    }
                    , checkError = function (err) {
                        console.error(JSON.stringify(err));
                        expect(err).to.have.property("type", 0);
                        expect(err.message).to.contain("cannot be modified");
                        finished();
                    };

                hue.updateGroup(99, "a name")
                    .then(_waitForBridge)
                    .then(failIfCalled)
                    .fail(checkError)
                    .done();
            });
        });

        describe("#_getGroupLightsByType", function() {

            it("should work for group 0", function(done) {
                hue._getGroupLightsByType(0)
                    .then(function(map) {

                        //TODO sort this test
                        console.log(JSON.stringify(map, null, 2));

                        done();
                    })
                    .done();
            });
        });
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
